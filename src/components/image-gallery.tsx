"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, X, Expand, Grid3X3 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ImageGalleryProps {
  images: string[];
  title: string;
}

export function ImageGallery({ images, title }: ImageGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [showGrid, setShowGrid] = useState(false);

  const navigate = useCallback(
    (dir: 1 | -1) => {
      setSelectedIndex((i) => (i + dir + images.length) % images.length);
    },
    [images.length],
  );

  useEffect(() => {
    if (!lightboxOpen) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") setLightboxOpen(false);
      if (e.key === "ArrowRight") navigate(1);
      if (e.key === "ArrowLeft") navigate(-1);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [lightboxOpen, navigate]);

  return (
    <>
      {/* Main Gallery */}
      <div className="space-y-2">
        {/* Hero image */}
        <div
          className="group relative cursor-pointer overflow-hidden rounded-2xl"
          onClick={() => setLightboxOpen(true)}
        >
          <motion.img
            key={selectedIndex}
            src={images[selectedIndex]}
            alt={`${title} - Photo ${selectedIndex + 1}`}
            className="aspect-video w-full object-cover"
            initial={{ opacity: 0.6 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          />
          <div className="absolute inset-0 bg-black/0 transition-colors group-hover:bg-black/20" />
          <div className="absolute bottom-3 right-3 flex gap-2 opacity-0 transition-opacity group-hover:opacity-100">
            <Button
              size="sm"
              variant="secondary"
              className="h-8 gap-1.5 bg-black/60 text-white backdrop-blur-sm hover:bg-black/80 border-0"
              onClick={(e) => {
                e.stopPropagation();
                setShowGrid(!showGrid);
              }}
            >
              <Grid3X3 className="h-3.5 w-3.5" />
              {images.length} Photos
            </Button>
            <Button
              size="sm"
              variant="secondary"
              className="h-8 gap-1.5 bg-black/60 text-white backdrop-blur-sm hover:bg-black/80 border-0"
            >
              <Expand className="h-3.5 w-3.5" />
              Fullscreen
            </Button>
          </div>
          {images.length > 1 && (
            <>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  navigate(-1);
                }}
                className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full bg-black/50 p-2 text-white opacity-0 backdrop-blur-sm transition-opacity hover:bg-black/70 group-hover:opacity-100"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  navigate(1);
                }}
                className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-black/50 p-2 text-white opacity-0 backdrop-blur-sm transition-opacity hover:bg-black/70 group-hover:opacity-100"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </>
          )}
        </div>

        {/* Thumbnail strip */}
        {images.length > 1 && (
          <div className="flex gap-2 overflow-x-auto pb-1">
            {images.map((img, i) => (
              <button
                key={i}
                onClick={() => setSelectedIndex(i)}
                className={`flex-shrink-0 overflow-hidden rounded-lg transition-all ${
                  i === selectedIndex
                    ? "ring-2 ring-secondary ring-offset-2 ring-offset-background"
                    : "opacity-60 hover:opacity-100"
                }`}
              >
                <img
                  src={img}
                  alt={`${title} - Thumbnail ${i + 1}`}
                  className="h-16 w-24 object-cover"
                />
              </button>
            ))}
          </div>
        )}

        {/* Grid view */}
        <AnimatePresence>
          {showGrid && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                {images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => {
                      setSelectedIndex(i);
                      setShowGrid(false);
                      setLightboxOpen(true);
                    }}
                    className="group/thumb relative overflow-hidden rounded-xl"
                  >
                    <img
                      src={img}
                      alt={`${title} - ${i + 1}`}
                      className="aspect-video w-full object-cover transition-transform group-hover/thumb:scale-105"
                    />
                    <div className="absolute inset-0 flex items-center justify-center bg-black/0 transition-colors group-hover/thumb:bg-black/30">
                      <Expand className="h-5 w-5 text-white opacity-0 transition-opacity group-hover/thumb:opacity-100" />
                    </div>
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Fullscreen Lightbox */}
      <AnimatePresence>
        {lightboxOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/95"
            onClick={() => setLightboxOpen(false)}
          >
            <button
              className="absolute right-4 top-4 z-10 rounded-full bg-white/10 p-2 text-white backdrop-blur-sm transition-colors hover:bg-white/20"
              onClick={() => setLightboxOpen(false)}
            >
              <X className="h-6 w-6" />
            </button>

            <div className="absolute left-4 top-4 rounded-full bg-white/10 px-3 py-1.5 text-sm text-white backdrop-blur-sm">
              {selectedIndex + 1} / {images.length}
            </div>

            {images.length > 1 && (
              <>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(-1);
                  }}
                  className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full bg-white/10 p-3 text-white backdrop-blur-sm transition-colors hover:bg-white/20"
                >
                  <ChevronLeft className="h-7 w-7" />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(1);
                  }}
                  className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-white/10 p-3 text-white backdrop-blur-sm transition-colors hover:bg-white/20"
                >
                  <ChevronRight className="h-7 w-7" />
                </button>
              </>
            )}

            <motion.img
              key={selectedIndex}
              src={images[selectedIndex]}
              alt={`${title} - Photo ${selectedIndex + 1}`}
              className="max-h-[85vh] max-w-[90vw] rounded-lg object-contain"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              onClick={(e) => e.stopPropagation()}
            />

            {/* Lightbox thumbnails */}
            {images.length > 1 && (
              <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-2 rounded-full bg-black/60 p-2 backdrop-blur-sm">
                {images.map((img, i) => (
                  <button
                    key={i}
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedIndex(i);
                    }}
                    className={`h-10 w-14 overflow-hidden rounded transition-all ${
                      i === selectedIndex
                        ? "ring-2 ring-white"
                        : "opacity-50 hover:opacity-80"
                    }`}
                  >
                    <img
                      src={img}
                      alt=""
                      className="h-full w-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
