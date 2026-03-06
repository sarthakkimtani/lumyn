import * as FileSystem from "expo-file-system/legacy";
import { storage } from "./storage";

const STORAGE_KEY = "MODEL_DOWNLOAD_STATE";
const MODEL_DIR = FileSystem.documentDirectory + "models";

export class ModelDownloader {
  private downloadResumable: FileSystem.DownloadResumable | null = null;

  private parseModelId(modelId: string) {
    const parts = modelId.split("/");
    if (parts.length < 3) {
      throw new Error(`Invalid model ID format: "${modelId}". Expected "owner/repo/file.gguf"`);
    }

    const filename = parts.pop()!;
    const repo = parts.join("/");
    return { repo, filename };
  }

  private buildHFUrl(modelId: string) {
    const { repo, filename } = this.parseModelId(modelId);

    return {
      filename,
      url: `https://huggingface.co/${repo}/resolve/main/${filename}?download=true`,
    };
  }

  private async ensureModelDir() {
    await FileSystem.makeDirectoryAsync(MODEL_DIR, {
      intermediates: true,
    });
  }

  getModelPath(modelId: string) {
    const { filename } = this.parseModelId(modelId);
    return `${MODEL_DIR}/${filename}`;
  }

  async isModelDownloaded(modelId: string) {
    const path = this.getModelPath(modelId);
    const info = await FileSystem.getInfoAsync(path);
    return info.exists;
  }

  async start(modelId: string, onProgress: (pct: number) => void) {
    await this.ensureModelDir();

    const { filename, url } = this.buildHFUrl(modelId);
    const destPath = `${MODEL_DIR}/${filename}`;

    const info = await FileSystem.getInfoAsync(destPath);
    if (info.exists) {
      return destPath;
    }

    this.downloadResumable = FileSystem.createDownloadResumable(url, destPath, {}, (progress) => {
      const pct = progress.totalBytesWritten / progress.totalBytesExpectedToWrite;

      onProgress(Math.round(pct * 100));
    });

    const result = await this.downloadResumable.downloadAsync();
    storage.remove(STORAGE_KEY);

    if (!result?.uri) {
      throw new Error("Download failed");
    }

    return result.uri;
  }

  async pause() {
    if (!this.downloadResumable) return;

    const snapshot = await this.downloadResumable.pauseAsync();
    storage.set(STORAGE_KEY, JSON.stringify(snapshot.resumeData));
  }

  async resume(modelId: string, onProgress: (pct: number) => void) {
    const resumeData = storage.getString(STORAGE_KEY);
    if (!resumeData) return null;

    const { filename, url } = this.buildHFUrl(modelId);
    const destPath = `${MODEL_DIR}/${filename}`;

    this.downloadResumable = FileSystem.createDownloadResumable(
      url,
      destPath,
      {},
      (progress) => {
        const pct = progress.totalBytesWritten / progress.totalBytesExpectedToWrite;

        onProgress(Math.round(pct * 100));
      },
      resumeData,
    );

    const result = await this.downloadResumable.resumeAsync();

    storage.remove(STORAGE_KEY);
    return result?.uri ?? null;
  }
}

export const modelDownloader = new ModelDownloader();
