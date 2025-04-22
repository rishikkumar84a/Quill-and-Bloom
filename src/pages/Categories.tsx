
import { Link } from "react-router-dom";
import { categories, articles } from "@/data/articles";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ArticleCard from "@/components/ArticleCard";

const Categories = () => {
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {categories.map(category => {
              // Get the first article in this category for the image
              const categoryArticle = articles.find(
                article => article.category.toLowerCase() === category.name.toLowerCase()
              );
              
              return (
                <Link 
                  key={category.slug} 
                  to={`/category/${category.slug}`}
                  className="group block"
                >
                  <div className="bg-white border border-gray-100 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition duration-300 h-full">
                    <div className="relative h-40">
                      <img 
                        src={categoryArticle?.coverImage || "https://images.unsplash.com/photo-1563089145-599997674d42?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"} 
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
                        {category.count} {category.count === 1 ? 'article' : 'articles'}
                      </p>
                      <p className="text-gray-500 text-sm">
                        Browse all articles about {category.name.toLowerCase()} topics
                      </p>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>
        
        {/* Featured Articles */}
        <section className="container mx-auto px-4 py-12 border-t border-gray-100">
          <h2 className="font-serif text-2xl font-semibold mb-8 text-center">Popular Articles</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {articles.slice(0, 3).map(article => (
              <ArticleCard key={article.id} article={article} />
            ))}
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default Categories;
