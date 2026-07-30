import { cn } from "@/lib/utils";

export function Image({
  src,
  alt,
  fill,
  width,
  height,
  priority,
  className,
  style,
  ...props
}) {
  if (fill) {
    return (
      <img
        src={src}
        alt={alt}
        loading={priority ? "eager" : "lazy"}
        className={cn("absolute inset-0 h-full w-full", className)}
        style={style}
        {...props}
      />
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      width={width}
      height={height}
      loading={priority ? "eager" : "lazy"}
      className={className}
      style={style}
      {...props}
    />
  );
}
