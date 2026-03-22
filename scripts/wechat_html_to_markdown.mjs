#!/usr/bin/env node

import fs from "fs";
import path from "path";
import vm from "vm";

function usage() {
  console.error("Usage: node scripts/wechat_html_to_markdown.mjs <input-dir> <output-dir>");
  process.exit(1);
}

if (process.argv.length < 4) {
  usage();
}

const inputDir = process.argv[2];
const outputDir = process.argv[3];

if (!fs.existsSync(inputDir)) {
  console.error(`Input directory not found: ${inputDir}`);
  process.exit(1);
}

fs.mkdirSync(outputDir, { recursive: true });

function decodeJsDecodeString(raw) {
  try {
    return vm.runInNewContext(`'${raw}'`);
  } catch {
    return raw;
  }
}

function decodeEntities(text) {
  let s = text;
  s = s.replace(/&nbsp;/g, " ");
  s = s.replace(/&amp;/g, "&");
  s = s.replace(/&lt;/g, "<");
  s = s.replace(/&gt;/g, ">");
  s = s.replace(/&quot;/g, '"');
  s = s.replace(/&#39;/g, "'");
  s = s.replace(/&#x([0-9a-fA-F]+);/g, (_, hex) => String.fromCodePoint(parseInt(hex, 16)));
  s = s.replace(/&#([0-9]+);/g, (_, num) => String.fromCodePoint(parseInt(num, 10)));
  return s;
}

function htmlToReadableText(html) {
  let s = html;

  s = s.replace(/<script[\s\S]*?<\/script>/gi, "");
  s = s.replace(/<style[\s\S]*?<\/style>/gi, "");

  s = s.replace(/<br\s*\/?>/gi, "\n");
  s = s.replace(/<hr[^>]*>/gi, "\n---\n");
  s = s.replace(/<\/(p|div|section|blockquote|table|tr|ul|ol)>/gi, "\n");
  s = s.replace(/<(h1|h2|h3|h4|h5|h6)[^>]*>/gi, "\n");
  s = s.replace(/<\/(h1|h2|h3|h4|h5|h6)>/gi, "\n");
  s = s.replace(/<li[^>]*>/gi, "\n- ");
  s = s.replace(/<\/li>/gi, "\n");
  s = s.replace(/<td[^>]*>/gi, " | ");
  s = s.replace(/<\/td>/gi, " ");
  s = s.replace(/<th[^>]*>/gi, " | ");
  s = s.replace(/<\/th>/gi, " ");
  s = s.replace(/<[^>]+>/g, "");

  s = decodeEntities(s);
  s = s.replace(/\r/g, "");

  const lines = s.split("\n").map((line) => line.replace(/[ \t]+/g, " ").trim());
  const compact = [];
  let blankCount = 0;
  for (const line of lines) {
    if (!line) {
      blankCount += 1;
      if (blankCount <= 1) {
        compact.push("");
      }
      continue;
    }
    blankCount = 0;
    compact.push(line);
  }
  return compact.join("\n").trim();
}

function extractSingle(html, re) {
  const m = html.match(re);
  return m ? m[1] : "";
}

const files = fs.readdirSync(inputDir).filter((f) => f.endsWith(".html")).sort();

for (const file of files) {
  const fullPath = path.join(inputDir, file);
  const html = fs.readFileSync(fullPath, "utf8");

  const titleRaw = extractSingle(html, /title:\s*JsDecode\('([\s\S]*?)'\),/);
  const authorRaw = extractSingle(html, /author:\s*JsDecode\('([\s\S]*?)'\),/);
  const createTimeRaw = extractSingle(html, /create_time:\s*JsDecode\('([\s\S]*?)'\),/);
  const linkRaw = extractSingle(html, /link:\s*JsDecode\('([\s\S]*?)'\),/);
  const contentRaw = extractSingle(
    html,
    /content_noencode:\s*JsDecode\('([\s\S]*?)'\),\s*create_time:\s*JsDecode/
  );

  const title = decodeEntities(decodeJsDecodeString(titleRaw)) || path.basename(file, ".html");
  const author = decodeEntities(decodeJsDecodeString(authorRaw)) || "未知";
  const createTime = decodeEntities(decodeJsDecodeString(createTimeRaw)) || "未知";
  const link = decodeEntities(decodeJsDecodeString(linkRaw)) || "未知";
  const contentHtml = decodeJsDecodeString(contentRaw);
  const body = htmlToReadableText(contentHtml);

  const md = [
    `# ${title}`,
    "",
    `作者：${author}`,
    "",
    `发布时间：${createTime}`,
    "",
    `原文链接：${link}`,
    "",
    "来源文件：HTML 快照自动转换",
    "",
    "## 原文正文（文本提取）",
    "",
    body,
    "",
  ].join("\n");

  const outName = file.replace(/\.html$/i, ".md");
  const outPath = path.join(outputDir, outName);
  fs.writeFileSync(outPath, md, "utf8");
}

console.log(`Converted ${files.length} files to markdown: ${outputDir}`);
