import { useEffect } from "react";

export function SeoJsonLd({ id, data }) {
  const payload = JSON.stringify(data);

  useEffect(() => {
    if (!data) return undefined;
    const scripts = (Array.isArray(data) ? data : [data]).map((schema, index) => {
      const el = document.createElement("script");
      el.type = "application/ld+json";
      el.dataset.seo = `${id}-${index}`;
      el.text = JSON.stringify(schema);
      document.head.appendChild(el);
      return el;
    });
    return () => {
      scripts.forEach((el) => el.remove());
    };
  }, [id, payload]);

  return null;
}
