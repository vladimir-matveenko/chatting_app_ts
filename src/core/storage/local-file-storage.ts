import { mkdir, unlink, writeFile } from "node:fs/promises";
import path from "node:path";

import type { FileStorage } from "./file-storage.interface.js";

export class LocalFileStorage implements FileStorage {
  constructor(private readonly rootDirectory: string) {}

  async save(file: Buffer, directory: string, fileName: string): Promise<string> {
    const targetDirectory = path.join(this.rootDirectory, directory);

    await mkdir(targetDirectory, {
      recursive: true,
    });

    const filePath = path.join(targetDirectory, fileName);

    await writeFile(filePath, file);

    return `${directory}/${fileName}`;
  }

  async delete(filePath: string | null): Promise<void> {
    if (!filePath) {
      return;
    }

    const absolutePath = path.join(this.rootDirectory, filePath);

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
