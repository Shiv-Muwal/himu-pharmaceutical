import { Navigate, useParams } from "react-router-dom";
import { Image } from "@/components/ui/image";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { Badge } from "@/components/ui/badge";
import { FadeIn } from "@/components/animations/motion-components";
import { getBlogBySlug } from "@/data/blogs";
import { formatDate } from "@/lib/utils";
export default function NewsDetailPage() {
  const { slug = "" } = useParams();
  const post = getBlogBySlug(slug);
  if (!post) return <Navigate to="/404" replace />;
  return (
    <>
      <section className="pt-28 pb-8">
        <div className="container-custom max-w-4xl">
          <Breadcrumbs
            items={[
              {
                label: "News",
                href: "/news",
              },
              {
                label: post.title,
              },
            ]}
          />
          <FadeIn>
            <Badge className="mb-4">{post.category}</Badge>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 font-[family-name:var(--font-heading)]">
              {post.title}
            </h1>
            <p className="text-muted-foreground mb-6">
              {formatDate(post.date)} · {post.author} · {post.readTime}
            </p>
          </FadeIn>
        </div>
      </section>
      <section className="pb-16">
        <div className="container-custom max-w-4xl">
          <FadeIn>
            <div className="relative h-64 md:h-96 rounded-2xl overflow-hidden shadow-xl mb-10">
              <Image
                src={post.image}
                alt={post.title}
                fill
                className="object-cover"
                priority
              />
            </div>
            <div className="prose-custom">
              {post.content.split("\n\n").map((paragraph, index) => (
                <p key={`${post.id}-${index}`}>{paragraph}</p>
              ))}
            </div>
          </FadeIn>
        </div>
      </section>
    </>
  );
}
