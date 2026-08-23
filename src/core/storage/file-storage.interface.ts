export interface StoredFile {
  url: string;
  publicId: string;
}

export interface FileStorage {
  save(file: Buffer, directory: string, fileName: string): Promise<StoredFile>;

  delete(publicId: string | null): Promise<void>;
}
