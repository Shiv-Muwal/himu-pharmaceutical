import { useState, useMemo } from "react";
import { Link } from "@/components/ui/link";
import { Image } from "@/components/ui/image";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FadeIn } from "@/components/animations/motion-components";
import { blogPosts, blogCategories } from "@/data/blogs";
import { formatDate } from "@/lib/utils";
export function BlogListing() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const filtered = useMemo(() => {
    let result = [...blogPosts];
    if (category !== "All")
      result = result.filter((p) => p.category === category);
    if (search) {
      const q = search.toLowerCase();
      result = result.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.excerpt.toLowerCase().includes(q),
      );
    }
    return result;
  }, [search, category]);
  return (
    <div>
      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search articles..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex flex-wrap gap-2">
          {blogCategories.map((cat) => (
            <button
              onClick={() => setCategory(cat)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${category === cat ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:bg-primary/10"}`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filtered.map((post, i) => (
          <FadeIn delay={i * 0.05}>
            <Link href={`/news/${post.slug}`}>
              <Card className="group overflow-hidden h-full hover:shadow-xl transition-shadow">
                <div className="relative h-48 overflow-hidden">
                  <Image
                    src={post.image}
                    alt={post.title}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                </div>
                <CardContent className="p-5">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant="outline">{post.category}</Badge>
                    <span className="text-xs text-muted-foreground">
                      {post.readTime}
                    </span>
                  </div>
                  <h3 className="font-bold text-lg mb-2 group-hover:text-primary transition-colors line-clamp-2">
                    {post.title}
                  </h3>
                  <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                    {post.excerpt}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {formatDate(post.date)} · {post.author}
                  </p>
                </CardContent>
              </Card>
            </Link>
          </FadeIn>
        ))}
      </div>
    </div>
  );
}
