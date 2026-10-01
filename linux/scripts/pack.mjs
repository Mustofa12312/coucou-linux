// Copies the installers Tauri buries in target/release/bundle/ into
// linux/release/, with the name it ships under. Used by `npm run pack`.

import { readFileSync, mkdirSync, copyFileSync, readdirSync, statSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const debBundleDir = join(root, "target", "release", "bundle", "deb");
const appImageBundleDir = join(root, "target", "release", "bundle", "appimage");
const outDir = join(root, "release");

const { version } = JSON.parse(readFileSync(join(root, "src-tauri", "tauri.conf.json"), "utf8"));

mkdirSync(outDir, { recursive: true });

function copyLatest(bundleDir, ext, suffix) {
  let files = [];
  try {
    files = readdirSync(bundleDir).filter((f) => f.endsWith(ext));
  } catch {
    console.log(`No ${ext} found in ${bundleDir}`);
    return;
  }
  if (files.length === 0) return;

  const built = files
    .map((f) => join(bundleDir, f))
    .sort((a, b) => statSync(b).mtimeMs - statSync(a).mtimeMs)[0];

  const versioned = join(outDir, `Coucou-Linux-${version}${suffix}`);
  const rolling = join(outDir, `Coucou-Linux${suffix}`);
  copyFileSync(built, versioned);
  copyFileSync(built, rolling);

  const mb = (statSync(versioned).size / 1024 / 1024).toFixed(2);
  console.log(`  Copied ${suffix} — ${mb} MB`);
}

console.log(`\n  Installers ready:\n`);
copyLatest(debBundleDir, ".deb", ".deb");
copyLatest(appImageBundleDir, ".AppImage", ".AppImage");
console.log("");
