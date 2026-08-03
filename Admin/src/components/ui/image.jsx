import { cn } from "@/lib/utils";
import { getApiOrigin } from "@/lib/api-base";

function resolveSrc(src) {
  if (!src) return "";
  if (
    src.startsWith("http://") ||
    src.startsWith("https://") ||
    src.startsWith("data:") ||
    src.startsWith("blob:")
  ) {
    return src;
  }
  if (src.startsWith("/uploads/")) {
    return `${getApiOrigin()}${src}`;
  }
  return src;
}

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
  const resolved = resolveSrc(src);

  if (fill) {
    return (
      <img
        src={resolved}
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
      src={resolved}
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
