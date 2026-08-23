import path from "node:path";
import { mkdir, unlink, writeFile } from "node:fs/promises";

import type { FileStorage, StoredFile } from "./file-storage.interface.js";

export class LocalFileStorage implements FileStorage {
  constructor(private readonly rootDirectory: string) {}

  async save(file: Buffer, directory: string, fileName: string): Promise<StoredFile> {
    const targetDirectory = path.join(this.rootDirectory, directory);

    await mkdir(targetDirectory, {
      recursive: true,
    });

    const filePath = path.join(targetDirectory, fileName);

    await writeFile(filePath, file);

    return {
      url: `/uploads/${directory}/${fileName}`,
      publicId: `${directory}/${fileName}`,
    };
  }

  async delete(publicId: string | null): Promise<void> {
    if (!publicId) {
      return;
    }

    const absolutePath = path.join(this.rootDirectory, publicId);

    try {
      await unlink(absolutePath);
    } catch (error: unknown) {
      if ((error as NodeJS.ErrnoException).code === "ENOENT") {
        return;
      }

      throw error;
    }
  }
}
