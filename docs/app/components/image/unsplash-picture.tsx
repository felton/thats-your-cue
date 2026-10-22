import type { ImgHTMLAttributes } from "react";

/**
 * Aspect ratio as "W:H" (e.g. "16:9") or a number (width / height, e.g. 1.777).
 */
export type AspectRatio = `${number}:${number}` | number;

export interface UnsplashBreakpoint {
  /** Viewport min-width in px this crop applies from. Use 0 for the base (mobile) crop. */
  minWidth: number;
  /** Rendered width in CSS px at 1x. The 2x variant is generated via Imgix `dpr=2`. */
  width: number;
  /** Crop aspect ratio for this breakpoint. */
  aspect: AspectRatio;
}

/** Tailwind's default breakpoints, with art-directed crops. */
export const TAILWIND_BREAKPOINTS: UnsplashBreakpoint[] = [
  { minWidth: 1536, width: 1920, aspect: "21:9" }, // 2xl
  { minWidth: 1280, width: 1536, aspect: "21:9" }, // xl
  { minWidth: 1024, width: 1280, aspect: "16:9" }, // lg
  { minWidth: 768, width: 1024, aspect: "16:9" }, // md
  { minWidth: 640, width: 768, aspect: "4:5" }, // sm
  { minWidth: 0, width: 640, aspect: "4:5" }, // base
];

export interface UnsplashPictureProps extends Omit<
  ImgHTMLAttributes<HTMLImageElement>,
  "src" | "srcSet" | "width" | "height" | "alt"
> {
  /** The path segment from the Unsplash URL, e.g. "photo-1558970439-add78fc68990". */
  photoId: string;
  /** Required: describe the image, or pass "" if it's purely decorative. */
  alt: string;
  /** Unsplash's `ixid` tracking param. Encoded ("...%3D") or decoded ("...=") both work. */
  ixid?: string;
  /** Imgix quality for 1x images. */
  quality?: number;
  /** Imgix quality for 2x images. Lower is fine; artifacts are less visible at high DPI. */
  quality2x?: number;
  /** Override the breakpoint/crop table. Order doesn't matter. */
  breakpoints?: UnsplashBreakpoint[];
  /** Force one aspect ratio at every breakpoint (disables art direction). */
  aspect?: AspectRatio;
  /** Above-the-fold image: loads eagerly with high fetch priority. */
  priority?: boolean;
  /** Classes for the <picture> wrapper. `className` goes on the <img>. */
  pictureClassName?: string;
}

const BASE_URL = "https://images.unsplash.com/";

function toRatio(aspect: AspectRatio): number {
  if (typeof aspect === "number") return aspect;
  const [w, h] = aspect.split(":").map(Number);
  if (!w || !h) throw new Error(`Invalid aspect ratio: "${aspect}"`);
  return w / h;
}

function safeDecode(value: string): string {
  try {
    return decodeURIComponent(value);
  } catch {
    return value;
  }
}

export function unsplashUrl(
  photoId: string,
  opts: { w: number; h: number; q: number; dpr?: number; ixid?: string },
): string {
  const params = new URLSearchParams({
    auto: "format",
    fit: "crop",
    q: String(opts.q),
    w: String(opts.w),
    h: String(opts.h),
  });
  if (opts.dpr && opts.dpr !== 1) params.set("dpr", String(opts.dpr));
  // Decode first so an already-encoded ixid isn't double-encoded.
  if (opts.ixid) params.set("ixid", safeDecode(opts.ixid));
  return `${BASE_URL}${photoId.replace(/^\/+/, "")}?${params}`;
}

export function UnsplashPicture({
  photoId,
  alt,
  ixid,
  quality = 75,
  quality2x = 50,
  breakpoints = TAILWIND_BREAKPOINTS,
  aspect,
  priority = false,
  pictureClassName,
  className,
  loading,
  decoding,
  ...imgProps
}: UnsplashPictureProps) {
  // Largest first: the browser uses the first <source> whose media query matches.
  const sorted = [...breakpoints].sort((a, b) => b.minWidth - a.minWidth);
  const base = sorted[sorted.length - 1];
  const sources = sorted.slice(0, -1);

  const variant = (bp: UnsplashBreakpoint) => {
    const w = bp.width;
    const h = Math.round(w / toRatio(aspect ?? bp.aspect));
    const oneX = unsplashUrl(photoId, { w, h, q: quality, ixid });
    const twoX = unsplashUrl(photoId, { w, h, q: quality2x, dpr: 2, ixid });
    return { w, h, oneX, twoX };
  };

  const img = variant(base);

  return (
    <picture className={pictureClassName}>
      {sources.map((bp) => {
        const v = variant(bp);
        return (
          <source
            key={bp.minWidth}
            media={`(min-width: ${bp.minWidth}px)`}
            width={v.w}
            height={v.h}
            srcSet={`${v.oneX} 1x, ${v.twoX} 2x`}
          />
        );
      })}
      <img
        {...imgProps}
        src={img.oneX}
        srcSet={`${img.twoX} 2x`}
        width={img.w}
        height={img.h}
        alt={alt}
        className={["block h-auto w-full object-cover", className].filter(Boolean).join(" ")}
        loading={loading ?? (priority ? "eager" : "lazy")}
        decoding={decoding ?? (priority ? "sync" : "async")}
        fetchPriority={priority ? "high" : imgProps.fetchPriority}
      />
    </picture>
  );
}

export default UnsplashPicture;

/*
Usage:

  <UnsplashPicture
    photoId="photo-1558970439-add78fc68990"
    ixid="NHwxMjA3fDA%3D"
    alt="Describe the image"
    priority
  />

  // Same crop everywhere:
  <UnsplashPicture photoId="photo-1558970439-add78fc68990" alt="" aspect="3:2" />

  // Custom crops (e.g. a card that's square on mobile, 4:3 from md up):
  <UnsplashPicture
    photoId="photo-1558970439-add78fc68990"
    alt="..."
    breakpoints={[
      { minWidth: 768, width: 600, aspect: "4:3" },
      { minWidth: 0, width: 400, aspect: "1:1" },
    ]}
  />
*/
