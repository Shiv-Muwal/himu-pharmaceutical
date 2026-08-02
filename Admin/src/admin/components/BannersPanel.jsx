import { useRef, useState } from "react";
import {
  ImageIcon,
  Plus,
  Trash2,
  Save,
  Link2,
  ToggleLeft,
  Upload,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { adminSession, mediaUrl, uploadApi } from "@/lib/api";

export function BannersPanel({
  banners,
  bannerForm,
  setBannerForm,
  editingBannerId,
  handleBannerSubmit,
  handleEditBanner,
  handleDeleteBanner,
  handleToggleBanner,
  resetBannerForm,
}) {
  const fileRef = useRef(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");

  const previewSrc = mediaUrl(bannerForm.image);

  const handleWebpSelect = async (event) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    setUploadError("");
    if (!file) return;

    const isWebp =
      file.type === "image/webp" || file.name.toLowerCase().endsWith(".webp");
    if (!isWebp) {
      setUploadError("Only WebP images are allowed (.webp)");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setUploadError("Image must be 5MB or smaller");
      return;
    }

    const token = adminSession.get();
    if (!token) {
      setUploadError("Please sign in again to upload");
      return;
    }

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("image", file);
      const result = await uploadApi("/banners/upload", formData, { token });
      setBannerForm((prev) => ({ ...prev, image: result.url }));
    } catch (error) {
      setUploadError(error.message || "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card className="overflow-hidden rounded-3xl border border-border/30 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border/20 p-5">
          <div className="flex items-center gap-2">
            <ImageIcon className="h-5 w-5 text-ink-accent" />
            <div>
              <h3 className="text-sm font-bold uppercase tracking-wide">
                Homepage Banners
              </h3>
              <p className="text-xs text-muted-foreground">
                Add, reorder, or remove carousel slides on the storefront home.
              </p>
            </div>
          </div>
          {editingBannerId && (
            <Button type="button" variant="outline" size="sm" onClick={resetBannerForm}>
              Cancel edit
            </Button>
          )}
        </div>
        <CardContent className="p-6">
          <form onSubmit={handleBannerSubmit} className="grid gap-4 md:grid-cols-2">
            <div className="md:col-span-2">
              <label className="mb-1 block text-xs font-semibold text-muted-foreground">
                Title
              </label>
              <Input
                value={bannerForm.title}
                onChange={(e) =>
                  setBannerForm((prev) => ({ ...prev, title: e.target.value }))
                }
                placeholder="Dermatology care, delivered"
                required
              />
            </div>
            <div className="md:col-span-2">
              <label className="mb-1 block text-xs font-semibold text-muted-foreground">
                Subtitle
              </label>
              <Input
                value={bannerForm.subtitle}
                onChange={(e) =>
                  setBannerForm((prev) => ({ ...prev, subtitle: e.target.value }))
                }
                placeholder="Short promotional line"
              />
            </div>

            <div className="md:col-span-2">
              <label className="mb-2 block text-xs font-semibold text-muted-foreground">
                Banner image (WebP only)
              </label>
              <input
                ref={fileRef}
                type="file"
                accept="image/webp,.webp"
                className="hidden"
                onChange={handleWebpSelect}
              />
              <div className="grid gap-3 sm:grid-cols-[1fr_180px]">
                <button
                  type="button"
                  disabled={uploading}
                  onClick={() => fileRef.current?.click()}
                  className="flex min-h-[140px] flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-primary/30 bg-primary/5 px-4 py-6 text-center transition hover:border-primary hover:bg-primary/10 disabled:opacity-60"
                >
                  {uploading ? (
                    <Loader2 className="h-7 w-7 animate-spin text-ink-accent" />
                  ) : (
                    <Upload className="h-7 w-7 text-ink-accent" />
                  )}
                  <span className="text-sm font-bold text-foreground">
                    {uploading ? "Uploading WebP..." : "Upload WebP image"}
                  </span>
                  <span className="text-[11px] text-muted-foreground">
                    Accepts .webp only · max 5MB
                  </span>
                  {bannerForm.image && (
                    <span className="mt-1 max-w-full truncate rounded-full bg-[var(--c-lime)] px-3 py-1 text-[10px] font-semibold text-ink-accent dark:bg-card">
                      {bannerForm.image}
                    </span>
                  )}
                </button>
                <div className="overflow-hidden rounded-2xl border border-border/40 bg-muted">
                  {previewSrc ? (
                    <img
                      src={previewSrc}
                      alt="Banner preview"
                      className="h-[140px] w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-[140px] items-center justify-center px-3 text-center text-[11px] text-muted-foreground">
                      Preview appears after upload
                    </div>
                  )}
                </div>
              </div>
              {uploadError && (
                <p className="mt-2 text-xs font-semibold text-ink-accent">{uploadError}</p>
              )}
              {!bannerForm.image && (
                <p className="mt-2 text-[11px] text-muted-foreground">
                  A WebP banner image is required before saving.
                </p>
              )}
            </div>

            <div>
              <label className="mb-1 block text-xs font-semibold text-muted-foreground">
                Link
              </label>
              <Input
                value={bannerForm.link}
                onChange={(e) =>
                  setBannerForm((prev) => ({ ...prev, link: e.target.value }))
                }
                placeholder="/products?category=dermatology"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-semibold text-muted-foreground">
                CTA label
              </label>
              <Input
                value={bannerForm.ctaLabel}
                onChange={(e) =>
                  setBannerForm((prev) => ({ ...prev, ctaLabel: e.target.value }))
                }
                placeholder="Shop now"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-semibold text-muted-foreground">
                Order
              </label>
              <Input
                type="number"
                value={bannerForm.order}
                onChange={(e) =>
                  setBannerForm((prev) => ({ ...prev, order: e.target.value }))
                }
                min={0}
              />
            </div>
            <div className="md:col-span-2 flex flex-wrap gap-3">
              <Button type="submit" className="gap-2" disabled={uploading || !bannerForm.image}>
                {editingBannerId ? (
                  <>
                    <Save className="h-4 w-4" /> Update banner
                  </>
                ) : (
                  <>
                    <Plus className="h-4 w-4" /> Add banner
                  </>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-2">
        {banners.length === 0 && (
          <Card className="rounded-3xl border border-dashed border-border/50 p-8 text-center text-sm text-muted-foreground md:col-span-2">
            No banners yet. Add your first homepage slide above.
          </Card>
        )}
        {banners.map((banner) => (
          <Card
            key={banner.id || banner.bannerId}
            className="overflow-hidden rounded-3xl border border-border/30 shadow-sm"
          >
            <div className="relative h-36 bg-muted">
              <img
                src={mediaUrl(banner.image)}
                alt={banner.title}
                className="h-full w-full object-cover"
              />
              <span
                className={`absolute left-3 top-3 rounded-full px-2 py-0.5 text-[10px] font-black uppercase ${
                  banner.active !== false
                    ? "bg-emerald/90 text-foreground"
                    : "bg-[var(--c-peach)]/55 text-foreground"
                }`}
              >
                {banner.active !== false ? "Active" : "Hidden"}
              </span>
            </div>
            <CardContent className="space-y-3 p-4">
              <div>
                <h4 className="font-bold text-foreground">{banner.title}</h4>
                <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">
                  {banner.subtitle || "—"}
                </p>
              </div>
              <p className="inline-flex items-center gap-1 text-[11px] font-semibold text-ink-accent">
                <Link2 className="h-3 w-3" />
                {banner.link || "/products"}
              </p>
              <div className="flex flex-wrap gap-2">
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={() => handleEditBanner(banner)}
                >
                  Edit
                </Button>
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  className="gap-1"
                  onClick={() => handleToggleBanner(banner)}
                >
                  <ToggleLeft className="h-3.5 w-3.5" />
                  {banner.active !== false ? "Hide" : "Show"}
                </Button>
                <Button
                  type="button"
                  size="sm"
                  variant="destructive"
                  className="gap-1"
                  onClick={() => handleDeleteBanner(banner)}
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  Remove
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
