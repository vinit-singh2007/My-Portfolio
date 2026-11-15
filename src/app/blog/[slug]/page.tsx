import { notFound } from "next/navigation";
import ArticleSlider from "@/components/blog/ArticleSlider";
import { articles } from "@/lib/articles";

export function generateStaticParams() {
  return articles.map((a) => ({ slug: a.slug }));
}

export default async function BlogPost({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article = articles.find((a) => a.slug === slug);
  if (!article) notFound();
  return (
    <ArticleSlider
      slides={article.slides}
      bg={article.bg}
      side={article.side}
      banner={article.banner}
    />
  );
}
