"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  RotateCcw,
  ZoomIn,
  ZoomOut,
  Maximize,
  X,
  ChevronLeft,
  ChevronRight,
  Eye,
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface VirtualTourProps {
  images: string[];
  title: string;
}

const rooms = [
  "Living Room",
  "Kitchen",
  "Master Bedroom",
  "Bathroom",
  "Dining Area",
  "Balcony",
];

export function VirtualTour({ images, title }: VirtualTourProps) {
  const [currentRoom, setCurrentRoom] = useState(0);
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState(0);

  const roomNames = rooms.slice(0, images.length);

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStart(e.clientX);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    const delta = e.clientX - dragStart;
    setRotation((prev) => prev + delta * 0.3);
    setDragStart(e.clientX);
  };

  const handleMouseUp = () => setIsDragging(false);

  const navigateRoom = (dir: 1 | -1) => {
    setCurrentRoom((i) => (i + dir + images.length) % images.length);
    setRotation(0);
    setZoom(1);
  };

  const tourContent = (
    <div className="relative select-none overflow-hidden rounded-xl bg-black">
      {/* Controls */}
      <div className="absolute left-3 top-3 z-10 flex items-center gap-2">
        <div className="flex items-center gap-1 rounded-full bg-black/60 px-3 py-1.5 text-xs font-medium text-white backdrop-blur-sm">
          <Eye className="h-3.5 w-3.5 text-secondary" />
          Virtual Tour
        </div>
        <div className="rounded-full bg-black/60 px-3 py-1.5 text-xs font-medium text-white backdrop-blur-sm">
          {roomNames[currentRoom]}
        </div>
      </div>

      <div className="absolute right-3 top-3 z-10 flex gap-1.5">
        <Button
          size="icon"
          variant="ghost"
          className="h-8 w-8 rounded-full bg-black/60 text-white backdrop-blur-sm hover:bg-black/80"
          onClick={() => setZoom((z) => Math.min(z + 0.25, 3))}
        >
          <ZoomIn className="h-4 w-4" />
        </Button>
        <Button
          size="icon"
          variant="ghost"
          className="h-8 w-8 rounded-full bg-black/60 text-white backdrop-blur-sm hover:bg-black/80"
          onClick={() => setZoom((z) => Math.max(z - 0.25, 1))}
        >
          <ZoomOut className="h-4 w-4" />
        </Button>
        <Button
          size="icon"
          variant="ghost"
          className="h-8 w-8 rounded-full bg-black/60 text-white backdrop-blur-sm hover:bg-black/80"
          onClick={() => {
            setRotation(0);
            setZoom(1);
          }}
        >
          <RotateCcw className="h-4 w-4" />
        </Button>
        <Button
          size="icon"
          variant="ghost"
          className="h-8 w-8 rounded-full bg-black/60 text-white backdrop-blur-sm hover:bg-black/80"
          onClick={() => setIsFullscreen(!isFullscreen)}
        >
          {isFullscreen ? (
            <X className="h-4 w-4" />
          ) : (
            <Maximize className="h-4 w-4" />
          )}
        </Button>
      </div>

      {/* Navigation arrows */}
      {images.length > 1 && (
        <>
          <button
            onClick={() => navigateRoom(-1)}
            className="absolute left-3 top-1/2 z-10 -translate-y-1/2 rounded-full bg-black/50 p-2 text-white backdrop-blur-sm hover:bg-black/70"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            onClick={() => navigateRoom(1)}
            className="absolute right-3 top-1/2 z-10 -translate-y-1/2 rounded-full bg-black/50 p-2 text-white backdrop-blur-sm hover:bg-black/70"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </>
      )}

      {/* Image with pan/zoom */}
      <div
        className={`relative ${isFullscreen ? "h-[80vh]" : "h-[400px]"} w-full cursor-grab overflow-hidden active:cursor-grabbing`}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        <AnimatePresence mode="wait">
          <motion.img
            key={currentRoom}
            src={images[currentRoom]}
            alt={`${title} - ${roomNames[currentRoom]}`}
            className="h-full w-full object-cover"
            style={{
              transform: `scale(${zoom}) translateX(${rotation}px)`,
              transition: isDragging ? "none" : "transform 0.3s ease",
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            draggable={false}
          />
        </AnimatePresence>

        {/* Compass overlay */}
        <div className="absolute bottom-3 left-3 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-black/60 backdrop-blur-sm">
          <div
            className="text-xs font-bold text-white"
            style={{ transform: `rotate(${-rotation * 0.5}deg)` }}
          >
            N
          </div>
        </div>

        {/* Drag hint */}
        <div className="absolute bottom-3 left-1/2 z-10 -translate-x-1/2 rounded-full bg-black/60 px-3 py-1 text-xs text-white/70 backdrop-blur-sm">
          Drag to look around • Scroll to zoom
        </div>
      </div>

      {/* Room thumbnails */}
      {images.length > 1 && (
        <div className="flex gap-1 bg-black/80 p-2">
          {images.map((img, i) => (
            <button
              key={i}
              onClick={() => {
                setCurrentRoom(i);
                setRotation(0);
                setZoom(1);
              }}
              className={`relative flex-1 overflow-hidden rounded-md transition-all ${
                i === currentRoom
                  ? "ring-2 ring-secondary"
                  : "opacity-50 hover:opacity-80"
              }`}
            >
              <img
                src={img}
                alt={roomNames[i]}
                className="h-14 w-full object-cover"
              />
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent px-1 py-0.5">
                <span className="text-[10px] font-medium text-white">
                  {roomNames[i]}
                </span>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );

  if (isFullscreen) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 p-4">
        <div className="w-full max-w-7xl">{tourContent}</div>
      </div>
    );
  }

  return (
    <div className="mt-8">
      <h2 className="mb-3 font-heading text-xl font-semibold">Virtual Tour</h2>
      {tourContent}
    </div>
  );
}
