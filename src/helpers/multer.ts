import * as fs from 'fs';
import * as multer from 'multer';

import { config } from '../config/config';

const { movies_upload_dir } = config;

if (!fs.existsSync(movies_upload_dir)) {
  fs.mkdirSync(movies_upload_dir, { recursive: true });
}

function generateTimestampName(): string {
  const date = new Date();

  const pad = (num: number) => num.toString().padStart(2, '0');

  return `${date.getFullYear()}${pad(date.getMonth() + 1)}${pad(date.getDate())}${pad(date.getHours())}${pad(date.getMinutes())}${pad(date.getSeconds())}.txt`;
}

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, movies_upload_dir),
  filename: (_req, _file, cb) => cb(null, generateTimestampName()),
});

export const multerUpload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
});
