const IMAGE_EXTENSIONS = new Set(["jpg", "jpeg", "png", "webp", "gif", "bmp", "heic", "heif"]);
const VIDEO_EXTENSIONS = new Set(["mp4", "webm", "mov", "m4v", "avi", "mkv"]);

function normalizeExt(ext: string): string {
  return ext.toLowerCase().replace(/^\./, "");
}

export function filterExtensionsForMediaType(
  extensions: string[] | undefined,
  kind: "image" | "video" | "file"
): string[] {
  if (!extensions?.length) {
    if (kind === "image") return ["jpg", "jpeg", "png", "webp"];
    if (kind === "video") return ["mp4", "webm", "mov"];
    return [];
  }

  const normalized = extensions.map(normalizeExt);
  if (kind === "image") {
    const filtered = normalized.filter((e) => IMAGE_EXTENSIONS.has(e));
    return filtered.length ? filtered : normalized;
  }
  if (kind === "video") {
    const filtered = normalized.filter((e) => VIDEO_EXTENSIONS.has(e));
    return filtered.length ? filtered : normalized.filter((e) => VIDEO_EXTENSIONS.has(e) || e === "mp4");
  }
  const filtered = normalized.filter(
    (e) => !IMAGE_EXTENSIONS.has(e) && !VIDEO_EXTENSIONS.has(e)
  );
  return filtered.length ? filtered : normalized;
}

export function mediaAccept(extensions: string[] | undefined, kind: "image" | "video" | "file"): string {
  const list = filterExtensionsForMediaType(extensions, kind);
  if (!list.length) {
    if (kind === "image") return "image/*";
    if (kind === "video") return "video/*";
    return "*/*";
  }
  return list.map((ext) => `.${ext}`).join(",");
}

export function imageCountMeetsMinimum(
  mediaItems: { media_type: string }[],
  minImages: number
): boolean {
  const count = mediaItems.filter((m) => m.media_type === "image").length;
  return count >= minImages;
}

export function canAddImage(
  mediaItems: { media_type: string }[],
  maxImages: number
): boolean {
  return mediaItems.filter((m) => m.media_type === "image").length < maxImages;
}

/** Read duration from a local video file (client-side only). */
export function getVideoDurationSeconds(file: File): Promise<number> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const video = document.createElement("video");
    video.preload = "metadata";

    video.onloadedmetadata = () => {
      URL.revokeObjectURL(url);
      const duration = video.duration;
      if (!Number.isFinite(duration) || duration <= 0) {
        reject(new Error("invalid_duration"));
        return;
      }
      resolve(duration);
    };

    video.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("metadata_failed"));
    };

    video.src = url;
  });
}

export function formatDuration(seconds: number): string {
  const total = Math.floor(seconds);
  const m = Math.floor(total / 60);
  const s = total % 60;
  return `${m}:${String(s).padStart(2, "0")}`;
}
