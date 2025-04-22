
import { useState } from "react";
import { Link } from "react-router-dom";
import { articles, categories, Article } from "@/data/articles";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ArticleCard from "@/components/ArticleCard";
import { Badge } from "@/components/ui/badge";

const Home = () => {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  
  const featuredArticle = articles[0];
  let filteredArticles = activeCategory 
    ? articles.filter(article => article.category.toLowerCase() === activeCategory.toLowerCase())
    : articles;
  
  // If we're showing featured article and no category filter, remove it from filtered list
  if (!activeCategory && featuredArticle) {
    filteredArticles = filteredArticles.filter(article => article.id !== featuredArticle.id);
  }

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

        {/* Content */}
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
                  {category.name} ({category.count})
                </Badge>
              ))}
            </div>
          </div>

          {/* Featured Article */}
          {!activeCategory && featuredArticle && (
            <section className="mb-12">
              <h2 className="font-serif text-2xl font-semibold mb-6">Featured Article</h2>
              <ArticleCard article={featuredArticle} featured />
            </section>
          )}

          {/* Recent Articles */}
          <section>
            <h2 className="font-serif text-2xl font-semibold mb-6">
              {activeCategory 
                ? `Articles in ${categories.find(c => c.slug === activeCategory)?.name || activeCategory}` 
                : "Recent Articles"}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredArticles.map(article => (
                <ArticleCard key={article.id} article={article} />
              ))}
            </div>

            {filteredArticles.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-500 text-lg">No articles found in this category.</p>
                <button 
                  className="mt-4 text-blog-purple hover:text-blog-purple-dark font-medium"
                  onClick={() => setActiveCategory(null)}
                >
                  View all articles
                </button>
              </div>
            )}
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Home;
