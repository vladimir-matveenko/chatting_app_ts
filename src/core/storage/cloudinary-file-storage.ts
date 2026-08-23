import type { UploadApiResponse } from "cloudinary";

import { cloudinary } from "./cloudinary.js";

import type { FileStorage, StoredFile } from "./file-storage.interface.js";

export class CloudinaryFileStorage implements FileStorage {
  async save(file: Buffer, directory: string, fileName: string): Promise<StoredFile> {
    const publicId = `${directory}/${fileName.replace(/\.[^/.]+$/, "")}`;

    const result = await new Promise<UploadApiResponse>((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        {
          resource_type: "image",
          public_id: publicId,
          overwrite: false,
        },
        (error, result) => {
          if (error) {
            reject(error);
            return;
          }

          if (!result) {
            reject(new Error("Cloudinary upload returned no result."));
            return;
          }

          resolve(result);
        },
      );

      stream.end(file);
    });

    return {
      url: result.secure_url,
      publicId: result.public_id,
    };
  }

  async delete(publicId: string | null): Promise<void> {
    if (!publicId) {
      return;
    }

    await cloudinary.uploader.destroy(publicId, {
      resource_type: "image",
    });
  }
}
