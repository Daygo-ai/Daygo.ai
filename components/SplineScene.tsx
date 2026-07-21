"use client";

import dynamic from "next/dynamic";
import { Suspense } from "react";
import { IridescentBlob } from "@/components/IridescentBlob";

// Dynamic import keeps the heavy three.js + Spline runtime out of
// the initial bundle. The page renders the CSS fallback first; the
// Spline scene streams in once the user is past the hero. SSR off
// because Spline pokes WebGL APIs during construction.
// Pinned to @splinetool/react-spline@2.2.6 because v4+ uses subpath
// exports (`./next`) that Next.js 15.1's resolver fails to traverse.
// v2 has a clean default export.
const Spline = dynamic(() => import("@splinetool/react-spline"), {
  ssr: false,
  loading: () => null,
});

/**
 * Spline 3D scene wrapper. Pass a scene URL exported from
 * spline.design (right-click in Spline → "Export" → "Code Export"
 * → copy the `.splinecode` URL) and it'll render here.
 *
 * While the scene loads, we show an `IridescentBlob` of similar size
 * so the layout doesn't pop. Pointer events disabled so the canvas
 * never eats clicks meant for content above it.
 */
export function SplineScene({
  url,
  className,
  fallbackBlobDuration,
}: {
  url: string;
  className?: string;
  fallbackBlobDuration?: number;
}) {
  if (!url) {
    // No URL set yet — keep the CSS blob.
    return (
      <IridescentBlob
        className={className}
        duration={fallbackBlobDuration ?? 24}
      />
    );
  }
  return (
    <div className={`pointer-events-none ${className ?? ""}`}>
      <Suspense
        fallback={<IridescentBlob className="h-full w-full" duration={fallbackBlobDuration ?? 24} />}
      >
        <Spline scene={url} style={{ width: "100%", height: "100%" }} />
      </Suspense>
    </div>
  );
}
