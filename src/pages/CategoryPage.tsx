
import { useParams, Link } from "react-router-dom";
import { articles, categories } from "@/data/articles";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ArticleCard from "@/components/ArticleCard";
import { Badge } from "@/components/ui/badge";

const CategoryPage = () => {
  const { slug } = useParams<{ slug: string }>();

  const category = categories.find(cat => cat.slug === slug);
  const filteredArticles = articles.filter(
    article => article.category.toLowerCase() === (category?.name.toLowerCase() || slug?.toLowerCase())
  );

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="bg-blog-purple-light py-16">
          <div className="container mx-auto px-4 text-center">
            <Link to="/categories" className="text-blog-purple-dark hover:text-blog-purple mb-2 inline-block">
              All Categories
            </Link>
            <h1 className="font-serif text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              {category?.name || slug}
            </h1>
            <p className="text-xl text-gray-700 max-w-3xl mx-auto">
              Explore our articles in the {category?.name || slug} category
            </p>
          </div>
        </section>
        
        {/* Categories */}
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-wrap gap-2 justify-center">
            {categories.map(cat => (
              <Link key={cat.slug} to={`/category/${cat.slug}`}>
                <Badge 
                  className={`text-sm px-4 py-2 ${cat.slug === slug 
                    ? 'bg-blog-purple text-white' 
                    : 'bg-gray-100 text-gray-800 hover:bg-gray-200'}`}
                >
                  {cat.name} ({cat.count})
                </Badge>
              </Link>
            ))}
          </div>
        </div>
        
        {/* Articles */}
        <div className="container mx-auto px-4 py-12">
          {filteredArticles.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredArticles.map(article => (
                <ArticleCard key={article.id} article={article} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">No articles found in this category.</p>
              <Link 
                to="/"
                className="mt-4 text-blog-purple hover:text-blog-purple-dark font-medium inline-block"
              >
                View all articles
              </Link>
            </div>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default CategoryPage;
