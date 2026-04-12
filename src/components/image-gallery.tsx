import Image from "next/image";

interface ImageGalleryProps {
  images: string[];
  title: string;
}

export function ImageGallery({ images, title }: ImageGalleryProps) {
  return (
    <div className="relative aspect-video w-full overflow-hidden rounded-xl border bg-muted">
      {images[0] ? (
        <Image
          src={images[0]}
          alt={title}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 66vw, 100vw"
        />
      ) : (
        <div className="flex h-full items-center justify-center text-muted-foreground">
          No image available
        </div>
      )}
    </div>
  );
}
