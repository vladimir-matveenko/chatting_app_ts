export interface FileStorage {
  save(file: Buffer, directory: string, fileName: string): Promise<string>;

  delete(filePath: string | null): Promise<void>;
}
