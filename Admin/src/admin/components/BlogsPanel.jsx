import { Newspaper, Plus, Trash2, Save, Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";

export function BlogsPanel({
  blogs,
  blogForm,
  setBlogForm,
  editingBlogId,
  handleBlogSubmit,
  handleEditBlog,
  handleDeleteBlog,
  resetBlogForm,
}) {
  return (
    <div className="space-y-6">
      <Card className="overflow-hidden rounded-3xl border border-border/30 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border/20 p-5">
          <div className="flex items-center gap-2">
            <Newspaper className="h-5 w-5 text-ink-accent" />
            <div>
              <h3 className="text-sm font-bold uppercase tracking-wide">Blog posts</h3>
              <p className="text-xs text-muted-foreground">
                Publish news & insights shown on the storefront homepage and /news.
              </p>
            </div>
          </div>
          {editingBlogId && (
            <Button type="button" variant="outline" size="sm" onClick={resetBlogForm}>
              Cancel edit
            </Button>
          )}
        </div>
        <CardContent className="p-6">
          <form onSubmit={handleBlogSubmit} className="grid gap-4 md:grid-cols-2">
            <div className="md:col-span-2">
              <label className="mb-1 block text-xs font-semibold text-muted-foreground">
                Title
              </label>
              <Input
                value={blogForm.title}
                onChange={(e) => setBlogForm((p) => ({ ...p, title: e.target.value }))}
                placeholder="Dermatology breakthroughs this season"
                required
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-semibold text-muted-foreground">
                Category
              </label>
              <Input
                value={blogForm.category}
                onChange={(e) => setBlogForm((p) => ({ ...p, category: e.target.value }))}
                placeholder="Dermatology"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-semibold text-muted-foreground">
                Author
              </label>
              <Input
                value={blogForm.author}
                onChange={(e) => setBlogForm((p) => ({ ...p, author: e.target.value }))}
                placeholder="Dr. Ananya Patel"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-semibold text-muted-foreground">
                Date
              </label>
              <Input
                type="date"
                value={blogForm.date}
                onChange={(e) => setBlogForm((p) => ({ ...p, date: e.target.value }))}
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-semibold text-muted-foreground">
                Read time
              </label>
              <Input
                value={blogForm.readTime}
                onChange={(e) => setBlogForm((p) => ({ ...p, readTime: e.target.value }))}
                placeholder="4 min read"
              />
            </div>
            <div className="md:col-span-2">
              <label className="mb-1 block text-xs font-semibold text-muted-foreground">
                Cover image URL
              </label>
              <Input
                value={blogForm.image}
                onChange={(e) => setBlogForm((p) => ({ ...p, image: e.target.value }))}
                placeholder="https://… or /uploads/…"
              />
            </div>
            <div className="md:col-span-2">
              <label className="mb-1 block text-xs font-semibold text-muted-foreground">
                Excerpt
              </label>
              <Input
                value={blogForm.excerpt}
                onChange={(e) => setBlogForm((p) => ({ ...p, excerpt: e.target.value }))}
                placeholder="Short summary for cards"
                required
              />
            </div>
            <div className="md:col-span-2">
              <label className="mb-1 block text-xs font-semibold text-muted-foreground">
                Content
              </label>
              <textarea
                value={blogForm.content}
                onChange={(e) => setBlogForm((p) => ({ ...p, content: e.target.value }))}
                rows={6}
                className="w-full rounded-xl border border-border/40 bg-[var(--c-lime)] px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/30"
                placeholder="Full article body…"
                required
              />
            </div>
            <div className="md:col-span-2 flex justify-end gap-2">
              <Button type="submit" className="gap-1.5">
                {editingBlogId ? <Save className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
                {editingBlogId ? "Update post" : "Publish post"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <div className="grid gap-3">
        {(blogs || []).map((blog) => (
          <Card
            key={blog.id || blog.blogId}
            className="overflow-hidden rounded-2xl border border-border/30"
          >
            <CardContent className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center">
              <div className="h-16 w-24 shrink-0 overflow-hidden rounded-xl bg-muted">
                {blog.image ? (
                  <img src={blog.image} alt="" className="h-full w-full object-cover" />
                ) : null}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-bold">{blog.title}</p>
                <p className="truncate text-xs text-muted-foreground">
                  {blog.category} · {blog.author} · {blog.date}
                </p>
              </div>
              <div className="flex gap-2">
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={() => handleEditBlog(blog)}
                >
                  <Pencil className="h-3.5 w-3.5" />
                </Button>
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  className="text-ink-accent"
                  onClick={() => handleDeleteBlog(blog)}
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
        {!blogs?.length && (
          <p className="rounded-2xl border border-dashed border-border/50 p-8 text-center text-sm text-muted-foreground">
            No blog posts yet. Publish your first insight above.
          </p>
        )}
      </div>
    </div>
  );
}
