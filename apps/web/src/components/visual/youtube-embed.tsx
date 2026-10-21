"use client";

import { useState } from "react";
import {
  youtubeEmbedSrc,
  youtubePosterUrls,
  youtubeVideoIdFromUrl,
} from "@/lib/sanity/youtube";
import { SUBPAGE } from "@/lib/subpage-copy";
import { cn } from "@/lib/utils";

const POSTER_DOTS = 6;
/** YouTube serves a 120×90 gray tile when a named size is missing. */
const PLACEHOLDER_WIDTH = 120;

type YoutubeEmbedProps = {
  url: string;
  className?: string;
};

export function YoutubeEmbed({ url, className }: YoutubeEmbedProps) {
  const src = youtubeEmbedSrc(url);
  const playSrc = youtubeEmbedSrc(url, { autoplay: true });
  const videoId = youtubeVideoIdFromUrl(url);
  const posters = videoId ? youtubePosterUrls(videoId) : [];
  const [playing, setPlaying] = useState(false);
  const [posterIndex, setPosterIndex] = useState(0);
  const poster = posters[posterIndex];

  if (!src || !playSrc) return null;

  if (playing) {
    return (
      <div className={cn("pt-embed", className)}>
        <iframe
          src={playSrc}
          title={SUBPAGE.video.play}
          className="pt-embed-frame"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>
    );
  }

  return (
    <div className={cn("pt-embed", className)}>
      <button
        type="button"
        className="pt-embed-poster"
        data-burst="idle"
        onClick={() => setPlaying(true)}
        onPointerEnter={(event) => {
          event.currentTarget.dataset.burst = "in";
        }}
        onPointerLeave={(event) => {
          event.currentTarget.dataset.burst = "out";
        }}
        onFocus={(event) => {
          event.currentTarget.dataset.burst = "in";
        }}
        onBlur={(event) => {
          event.currentTarget.dataset.burst = "out";
        }}
        aria-label={SUBPAGE.video.play}
      >
        {poster ? (
          // Remote still; size ladder is tried in onError / tiny-placeholder onLoad.
          // eslint-disable-next-line @next/next/no-img-element
          <img
            key={poster}
            src={poster}
            alt=""
            className="pt-embed-still"
            decoding="async"
            onLoad={(event) => {
              if (event.currentTarget.naturalWidth <= PLACEHOLDER_WIDTH) {
                setPosterIndex((index) => index + 1);
              }
            }}
            onError={() => setPosterIndex((index) => index + 1)}
          />
        ) : null}
        <span className="pt-embed-burst" aria-hidden>
          {Array.from({ length: POSTER_DOTS }, (_, index) => (
            <span key={index} className="pt-embed-dot" />
          ))}
        </span>
        <span className="pt-embed-play" aria-hidden>
          <svg viewBox="0 0 48 48" className="pt-embed-play-mark">
            <path
              d="M18 12 37 24 18 36Z"
              strokeLinejoin="round"
              strokeWidth="7"
            />
          </svg>
        </span>
      </button>
    </div>
  );
}
