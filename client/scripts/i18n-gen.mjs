import fs from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();
const TXT = path.join(ROOT, 'locales.txt');
const EN = path.join(ROOT, 'src', 'shared', 'i18n', 'locales', 'en.json');
const RU = path.join(ROOT, 'src', 'shared', 'i18n', 'locales', 'ru.json');

function setDeep(obj, dottedKey, value) {
  const parts = dottedKey.split('.').filter(Boolean);
  let cur = obj;
  for (let i = 0; i < parts.length - 1; i++) {
    const k = parts[i];
    cur[k] ||= {};
    cur = cur[k];
  }
  cur[parts[parts.length - 1]] = value;
}

function parse(content) {
  const dict = {};
  for (const raw of content.split(/\r?\n/)) {
    const line = raw.trim();
    if (!line || line.startsWith('#')) continue;

    const m = line.match(/^(\S+)\s*(?:=|\s)\s*(.*)$/);
    const key = (m?.[1] ?? '').trim();
    const value = (m?.[2] ?? '').trim();
    if (!key || !value) continue;

    setDeep(dict, key, value);
  }
  return dict;
}

function write(file, obj) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, JSON.stringify(obj, null, 2) + '\n', 'utf8');
}

function regen() {
  const dict = parse(fs.readFileSync(TXT, 'utf8'));
  write(EN, dict);
  write(RU, dict);
  process.stdout.write('[i18n] regenerated\n');
}

regen();
process.stdout.write('[i18n] watching locales.txt...\n');

fs.watchFile(TXT, { interval: 200 }, (cur, prev) => {
  if (cur.mtimeMs !== prev.mtimeMs) regen();
});
