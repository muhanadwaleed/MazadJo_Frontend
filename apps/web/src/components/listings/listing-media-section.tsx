"use client";

import { useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";

import {
  ApiError,
  auctionsService,
  getApiErrorMessage,
  type AuctionMedia,
  type ProductSettings,
} from "@mazad/api";
import {
  canAddImage,
  formatDuration,
  getVideoDurationSeconds,
  imageCountMeetsMinimum,
  mediaAccept,
} from "@/lib/listing-media-rules";
import { AuthenticatedMediaPreview } from "@/components/listings/authenticated-media-preview";
import { Button } from "@mazad/ui";
import { cn } from "@mazad/ui/utils";

type ListingMediaSectionProps = {
  auctionId: number;
  mediaItems: AuctionMedia[];
  settings: ProductSettings | null;
  onChange: (items: AuctionMedia[]) => void;
  labels: {
    mediaTitle: string;
    mediaHint: string;
    photosTitle: string;
    videosTitle: string;
    attachmentsTitle: string;
    addPhotos: string;
    addVideo: string;
    addAttachment: string;
    uploading: string;
    remove: string;
    maxPhotosReached: string;
    videoDurationUnknown: string;
    uploadSuccess: string;
    blurNextPhoto: string;
    noVideosYet: string;
    videoPreview: string;
  };
};

function MediaTile({
  auctionId,
  item,
  busy,
  onRemove,
  removeLabel,
  videoPreviewLabel,
}: {
  auctionId: number;
  item: AuctionMedia;
  busy: boolean;
  onRemove: () => void;
  removeLabel: string;
  videoPreviewLabel: string;
}) {
  const isVideo = item.media_type === "video";
  const isFile = item.media_type === "file";
  const isImage = item.media_type === "image";

  return (
    <li className="relative overflow-hidden rounded-lg border bg-muted/30">
      {isFile ? (
        <div className="flex aspect-square flex-col items-center justify-center gap-1 p-2 text-center text-xs">
          <span className="line-clamp-2 font-medium">{item.file_name}</span>
          <span className="text-muted-foreground">{item.file_type}</span>
        </div>
      ) : isImage || isVideo ? (
        <AuthenticatedMediaPreview
          auctionId={auctionId}
          mediaId={item.id}
          url={item.url}
          mediaType={isVideo ? "video" : "image"}
          alt={isVideo ? videoPreviewLabel : item.file_name}
          className={
            isVideo
              ? "aspect-video w-full bg-black object-contain"
              : "aspect-square w-full object-cover"
          }
        />
      ) : (
        <div className="flex aspect-square items-center justify-center p-2 text-xs text-muted-foreground">
          {item.file_name}
        </div>
      )}
      <Button
        type="button"
        size="xs"
        variant="destructive"
        className="absolute right-1 top-1 shadow-sm"
        disabled={busy}
        onClick={onRemove}
      >
        {removeLabel}
      </Button>
    </li>
  );
}

export function ListingMediaSection({
  auctionId,
  mediaItems,
  settings,
  onChange,
  labels,
}: ListingMediaSectionProps) {
  const t = useTranslations("listingWizard");
  const imageInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [uploading, setUploading] = useState<"image" | "video" | "file" | null>(null);
  const [busyId, setBusyId] = useState<number | null>(null);
  const [blurNextPhoto, setBlurNextPhoto] = useState(false);

  const minImages = settings?.min_images_count ?? 1;
  const maxImages = settings?.max_images_count ?? 10;
  const videoAllowed = settings?.video_allowed ?? false;
  const maxVideoSec = settings?.max_video_duration_sec ?? null;
  const attachmentsAllowed = settings?.attachments_allowed ?? false;
  const blurEnabled = settings?.blur_option_enabled ?? false;
  const extensions = settings?.allowed_extensions_json;

  const images = mediaItems.filter((m) => m.media_type === "image");
  const videos = mediaItems.filter((m) => m.media_type === "video");
  const files = mediaItems.filter((m) => m.media_type === "file");

  const canAddImages = canAddImage(mediaItems, maxImages);
  const meetsMinImages = imageCountMeetsMinimum(mediaItems, minImages);

  async function uploadFiles(
    fileList: FileList | null,
    mediaType: "image" | "video" | "file"
  ) {
    if (!fileList?.length) return;

    if (mediaType === "image" && !canAddImages) {
      toast.error(labels.maxPhotosReached);
      return;
    }

    setUploading(mediaType);
    try {
      const uploaded: AuctionMedia[] = [];
      const existingImages = images.length;

      for (let i = 0; i < fileList.length; i++) {
        const file = fileList[i];

        if (mediaType === "image") {
          if (existingImages + uploaded.length >= maxImages) break;
        }

        if (mediaType === "video" && maxVideoSec != null && maxVideoSec > 0) {
          try {
            const duration = await getVideoDurationSeconds(file);
            if (duration > maxVideoSec) {
              toast.error(
                t("videoTooLong", {
                  max: maxVideoSec,
                  actual: formatDuration(duration),
                })
              );
              continue;
            }
          } catch {
            toast.error(labels.videoDurationUnknown);
            continue;
          }
        }

        const sortBase =
          mediaType === "image"
            ? existingImages + uploaded.length
            : mediaItems.length + uploaded.length;

        const item = await auctionsService.uploadMediaClient(auctionId, file, {
          media_type: mediaType,
          sort_order: sortBase,
          is_blurred: mediaType === "image" && blurNextPhoto,
        });
        uploaded.push(item);
      }

      if (uploaded.length > 0) {
        onChange([...mediaItems, ...uploaded]);
        toast.success(labels.uploadSuccess);
        if (mediaType === "image") setBlurNextPhoto(false);
      }
    } catch (error) {
      toast.error(
        error instanceof ApiError ? getApiErrorMessage(error) : t("uploadFailed")
      );
    } finally {
      setUploading(null);
      if (mediaType === "image" && imageInputRef.current) imageInputRef.current.value = "";
      if (mediaType === "video" && videoInputRef.current) videoInputRef.current.value = "";
      if (mediaType === "file" && fileInputRef.current) fileInputRef.current.value = "";
    }
  }

  async function handleRemove(mediaId: number) {
    setBusyId(mediaId);
    try {
      await auctionsService.deleteMediaClient(auctionId, mediaId);
      onChange(mediaItems.filter((m) => m.id !== mediaId));
    } catch (error) {
      toast.error(
        error instanceof ApiError ? getApiErrorMessage(error) : t("deleteFailed")
      );
    } finally {
      setBusyId(null);
    }
  }

  const photoCountLabel = meetsMinImages
    ? t("photoCountOk", { current: images.length, min: minImages, max: maxImages })
    : t("photoCountBelowMin", { current: images.length, min: minImages, max: maxImages });

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-lg font-semibold">{labels.mediaTitle}</h2>
        <p className="text-sm text-muted-foreground">{labels.mediaHint}</p>
      </div>

      {/* Photos */}
      <section className="space-y-4">
        <div>
          <h3 className="text-base font-medium">{labels.photosTitle}</h3>
          <p
            className={cn(
              "mt-1 text-sm font-medium",
              meetsMinImages ? "text-emerald-700 dark:text-emerald-400" : "text-amber-700 dark:text-amber-400"
            )}
          >
            {photoCountLabel}
          </p>
        </div>

        {images.length > 0 ? (
          <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
            {images.map((item) => (
              <MediaTile
                key={item.id}
                auctionId={auctionId}
                item={item}
                busy={busyId === item.id}
                removeLabel={labels.remove}
                videoPreviewLabel={labels.videoPreview}
                onRemove={() => void handleRemove(item.id)}
              />
            ))}
          </ul>
        ) : null}

        <div className="flex flex-wrap items-center gap-3">
          <input
            ref={imageInputRef}
            type="file"
            accept={mediaAccept(extensions, "image")}
            multiple
            className="hidden"
            disabled={!canAddImages || uploading !== null}
            onChange={(e) => void uploadFiles(e.target.files, "image")}
          />
          <Button
            type="button"
            variant="outline"
            disabled={!canAddImages || uploading !== null}
            onClick={() => imageInputRef.current?.click()}
          >
            {uploading === "image"
              ? labels.uploading
              : canAddImages
                ? labels.addPhotos
                : labels.maxPhotosReached}
          </Button>

          {blurEnabled ? (
            <label className="flex cursor-pointer items-center gap-2 text-sm">
              <input
                type="checkbox"
                className="size-4 rounded border-input"
                checked={blurNextPhoto}
                onChange={(e) => setBlurNextPhoto(e.target.checked)}
                disabled={!canAddImages || uploading !== null}
              />
              {labels.blurNextPhoto}
            </label>
          ) : null}
        </div>
      </section>

      {/* Videos */}
      {videoAllowed ? (
        <section className="space-y-4">
          <div>
            <h3 className="text-base font-medium">{labels.videosTitle}</h3>
            {maxVideoSec != null && maxVideoSec > 0 ? (
              <p className="mt-1 text-sm text-muted-foreground">
                {t("videoMaxDuration", { max: maxVideoSec })}
              </p>
            ) : null}
          </div>

          {videos.length > 0 ? (
            <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {videos.map((item) => (
                <MediaTile
                  key={item.id}
                  auctionId={auctionId}
                  item={item}
                  busy={busyId === item.id}
                  removeLabel={labels.remove}
                  videoPreviewLabel={labels.videoPreview}
                  onRemove={() => void handleRemove(item.id)}
                />
              ))}
            </ul>
          ) : (
            <p className="text-sm text-muted-foreground">{labels.noVideosYet}</p>
          )}

          <div>
            <input
              ref={videoInputRef}
              type="file"
              accept={mediaAccept(extensions, "video")}
              className="hidden"
              disabled={uploading !== null}
              onChange={(e) => void uploadFiles(e.target.files, "video")}
            />
            <Button
              type="button"
              variant="outline"
              disabled={uploading !== null}
              onClick={() => videoInputRef.current?.click()}
            >
              {uploading === "video" ? labels.uploading : labels.addVideo}
            </Button>
          </div>
        </section>
      ) : null}

      {/* Attachments */}
      {attachmentsAllowed ? (
        <section className="space-y-4">
          <h3 className="text-base font-medium">{labels.attachmentsTitle}</h3>

          {files.length > 0 ? (
            <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              {files.map((item) => (
                <MediaTile
                  key={item.id}
                  auctionId={auctionId}
                  item={item}
                  busy={busyId === item.id}
                  removeLabel={labels.remove}
                  videoPreviewLabel={labels.videoPreview}
                  onRemove={() => void handleRemove(item.id)}
                />
              ))}
            </ul>
          ) : null}

          <div>
            <input
              ref={fileInputRef}
              type="file"
              accept={mediaAccept(extensions, "file")}
              className="hidden"
              disabled={uploading !== null}
              onChange={(e) => void uploadFiles(e.target.files, "file")}
            />
            <Button
              type="button"
              variant="outline"
              disabled={uploading !== null}
              onClick={() => fileInputRef.current?.click()}
            >
              {uploading === "file" ? labels.uploading : labels.addAttachment}
            </Button>
          </div>
        </section>
      ) : null}
    </div>
  );
}
