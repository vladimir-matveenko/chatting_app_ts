import multer from "multer";

import { BadRequestError } from "../errors/index.js";

const MAX_AVATAR_SIZE = 5 * 1024 * 1024;

export const avatarUpload = multer({
  storage: multer.memoryStorage(),

  limits: {
    fileSize: MAX_AVATAR_SIZE,
    files: 1,
  },

  fileFilter: (_req, file, callback) => {
    const allowedTypes = ["image/jpeg", "image/png", "image/webp"];

    if (!allowedTypes.includes(file.mimetype)) {
      callback(
        new BadRequestError("Only JPEG, PNG and WebP images are allowed.", "INVALID_AVATAR_FORMAT"),
      );

      return;
    }

    callback(null, true);
  },
});
