import { mkdir, readdir, readFile, stat, writeFile } from 'node:fs/promises';
import { dirname, extname, join, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { brotliCompressSync, constants as zlibConstants, gzipSync } from 'node:zlib';

const ROOT = resolve(fileURLToPath(new URL('..', import.meta.url)));
const SOURCE_TARGETS = ['index.html', 'src'];
const OUTPUT_DIR = join(ROOT, 'dist', 'compressed');
const ALLOWED_EXTENSIONS = new Set(['.html', '.css', '.js', '.json']);

const collectFiles = async (paths) => {
  const files = [];

  for (const targetPath of paths) {
    const absolute = join(ROOT, targetPath);
    const info = await stat(absolute);

    if (info.isDirectory()) {
      const next = await readdir(absolute);
      const nested = await collectFiles(next.map((name) => join(targetPath, name)));
      files.push(...nested);
    } else if (ALLOWED_EXTENSIONS.has(extname(absolute))) {
      files.push(absolute);
    }
  }

  return files;
};

const compressFile = async (filePath) => {
  const data = await readFile(filePath);
  const relativePath = relative(ROOT, filePath);

  const gzipBuffer = gzipSync(data, { level: zlibConstants.Z_BEST_COMPRESSION });
  const brotliBuffer = brotliCompressSync(data, {
    params: {
      [zlibConstants.BROTLI_PARAM_QUALITY]: 11,
    },
  });

  const gzipTarget = join(OUTPUT_DIR, `${relativePath}.gz`);
  const brotliTarget = join(OUTPUT_DIR, `${relativePath}.br`);

  await mkdir(dirname(gzipTarget), { recursive: true });
  await writeFile(gzipTarget, gzipBuffer);
  await mkdir(dirname(brotliTarget), { recursive: true });
  await writeFile(brotliTarget, brotliBuffer);

  console.log('[OMR:BUILD] compressed', relativePath);
};

const run = async () => {
  await mkdir(OUTPUT_DIR, { recursive: true });
  const files = await collectFiles(SOURCE_TARGETS);

  await Promise.all(files.map(compressFile));
};

run().catch((error) => {
  console.error('[OMR:BUILD] compression failed', error);
  process.exitCode = 1;
});
