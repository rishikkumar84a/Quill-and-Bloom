import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ArticleCard from "@/components/ArticleCard";
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";

type Category = Database["public"]["Tables"]["categories"]["Row"];
type Article = Database["public"]["Tables"]["articles"]["Row"];

// Helper: Map Supabase article to ArticleCard format
function mapArticleForCard(article: Article) {
  return {
    id: article.id,
    title: article.title,
    excerpt: article.content.slice(0, 120) + (article.content.length > 120 ? "..." : ""),
    coverImage: article.cover_image || "https://images.unsplash.com/photo-1563089145-599997674d42?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    category: article.category,
    publishedDate: new Date(article.published_date).toLocaleDateString(),
    readTime: article.read_time ? `${article.read_time} min` : "-",
    slug: article.slug,
  };
}

const Categories = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const [{ data: cats }, { data: arts }] = await Promise.all([
        supabase.from("categories").select("*"),
        supabase.from("articles").select("*")
      ]);
      if (cats) setCategories(cats);
      if (arts) setArticles(arts);
      setLoading(false);
    };
    fetchData();
  }, []);

  // Helper: get article count and cover image for each category
  const getCategoryData = (category: Category) => {
    const catArticles = articles.filter(
      article => article.category && article.category.toLowerCase() === category.name.toLowerCase()
    );
    return {
      count: catArticles.length,
      coverImage: category.cover_image || catArticles[0]?.cover_image ||
        "https://images.unsplash.com/photo-1563089145-599997674d42?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
      description: category.description || "Browse all articles about " + category.name.toLowerCase() + " topics"
    };
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="bg-blog-purple-light py-16">
          <div className="container mx-auto px-4 text-center">
            <h1 className="font-serif text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Categories
            </h1>
            <p className="text-xl text-gray-700 max-w-3xl mx-auto">
              Browse articles by topic
            </p>
          </div>
        </section>
        {/* Categories Grid */}
        <section className="container mx-auto px-4 py-12">
          {loading ? (
            <div className="text-center py-12">Loading categories...</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {categories.map(category => {
                const { count, coverImage, description } = getCategoryData(category);
                return (
                  <Link
                    key={category.slug}
                    to={`/category/${category.slug}`}
                    className="group block"
                  >
                    <div className="bg-white border border-gray-100 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition duration-300 h-full">
                      <div className="relative h-40">
                        <img
                          src={coverImage}
                          alt={category.name}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-blog-purple bg-opacity-40 group-hover:bg-opacity-50 transition duration-300"></div>
                        <div className="absolute inset-0 flex items-center justify-center">
                          <h2 className="font-serif text-2xl font-bold text-white">
                            {category.name}
                          </h2>
                        </div>
                      </div>
                      <div className="p-6">
                        <p className="text-gray-600 mb-2">
                          {count} {count === 1 ? 'article' : 'articles'}
                        </p>
                        <p className="text-gray-500 text-sm">
                          {description}
                        </p>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </section>
        {/* Featured Articles */}
        <section className="container mx-auto px-4 py-12 border-t border-gray-100">
          <h2 className="font-serif text-2xl font-semibold mb-8 text-center">Popular Articles</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {articles.slice(0, 3).map(article => (
              <ArticleCard key={article.id} article={mapArticleForCard(article)} />
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Categories;
