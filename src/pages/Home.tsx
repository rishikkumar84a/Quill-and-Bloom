import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ArticleCard from "@/components/ArticleCard";
import { Badge } from "@/components/ui/badge";
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

const Home = () => {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const [{ data: cats }, { data: arts }] = await Promise.all([
        supabase.from("categories").select("*"),
        supabase.from("articles").select("*").order("published_date", { ascending: false })
      ]);
      if (cats) setCategories(cats);
      if (arts) setArticles(arts);
      setLoading(false);
    };
    fetchData();
  }, []);

  // Compute filtered articles
  const featuredArticle = articles[0];
  let filteredArticles = activeCategory
    ? articles.filter(article => {
        const cat = categories.find(c => c.slug === activeCategory);
        return cat && article.category?.toLowerCase() === cat.name.toLowerCase();
      })
    : articles;
  // If we're showing featured article and no category filter, remove it from filtered list
  if (!activeCategory && featuredArticle) {
    filteredArticles = filteredArticles.filter(article => article.id !== featuredArticle.id);
  }

  // Helper: get count of articles for a category
  const getCategoryCount = (category: Category) =>
    articles.filter(article => article.category?.toLowerCase() === category.name.toLowerCase()).length;

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="bg-blog-purple-light py-16">
          <div className="container mx-auto px-4 text-center">
            <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-4">
              Quill & Bloom
            </h1>
            <p className="text-xl text-gray-700 max-w-3xl mx-auto">
              A beautiful space for thoughtful articles and stories that inspire, educate, and entertain.
            </p>
          </div>
        </section>
        <div className="container mx-auto px-4 py-12">
          {/* Category Filter */}
          <div className="mb-12">
            <h2 className="font-serif text-2xl font-semibold mb-4">Browse by Category</h2>
            <div className="flex flex-wrap gap-2">
              <Badge
                className={`cursor-pointer text-sm px-4 py-2 ${!activeCategory ? 'bg-blog-purple text-white' : 'bg-gray-100 text-gray-800 hover:bg-gray-200'}`}
                onClick={() => setActiveCategory(null)}
              >
                All
              </Badge>
              {categories.map(category => (
                <Badge
                  key={category.slug}
                  className={`cursor-pointer text-sm px-4 py-2 ${activeCategory === category.slug ? 'bg-blog-purple text-white' : 'bg-gray-100 text-gray-800 hover:bg-gray-200'}`}
                  onClick={() => setActiveCategory(category.slug)}
                >
                  {category.name} ({getCategoryCount(category)})
                </Badge>
              ))}
            </div>
          </div>
          {/* Featured Article */}
          {!activeCategory && featuredArticle && (
            <section className="mb-12">
              <h2 className="font-serif text-2xl font-semibold mb-6">Featured Article</h2>
              <ArticleCard article={mapArticleForCard(featuredArticle)} featured />
            </section>
          )}
          {/* Recent Articles */}
          <h2 className="font-serif text-2xl font-semibold mb-6">Recent Articles</h2>
          {loading ? (
            <div className="text-center py-12">Loading articles...</div>
          ) : filteredArticles.length === 0 ? (
            <div className="text-center text-gray-500 mb-8">No articles found in this category.</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredArticles.map(article => (
                <ArticleCard key={article.id} article={mapArticleForCard(article)} />
              ))}
            </div>
          )}
          <div className="text-center mt-8">
            <Link
              to="/articles"
              className="text-blog-purple hover:underline font-medium"
            >
              View all articles
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Home;
