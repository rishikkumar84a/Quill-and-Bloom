import { useParams, Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { articles } from "@/data/articles";
import { Separator } from "@/components/ui/separator";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useAuthSession } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

const ADMIN_EMAIL = "rishikkumarchaurasiya@gmail.com";

const Article = () => {
  const { slug } = useParams();
  const session = useAuthSession();
  const navigate = useNavigate();
  const { toast } = useToast();
  const isAdmin = session?.user?.email === ADMIN_EMAIL;
  
  const article = articles.find((article) => article.slug === slug);

  const [isLoading, setIsLoading] = useState(false);

  const handleEdit = () => {
    // In a real app, this would navigate to an edit page
    toast({
      title: "Edit functionality",
      description: "Edit functionality would be implemented here.",
    });
  };

  const handleDelete = () => {
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      toast({
        title: "Article deleted",
        description: "Article has been deleted successfully.",
      });
      setIsLoading(false);
      navigate("/");
    }, 1000);
  };

  if (!article) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 container mx-auto px-4 py-8">
          <div className="text-center py-12">
            <h1 className="text-3xl font-bold mb-4">Article Not Found</h1>
            <p className="mb-6">The article you're looking for doesn't exist.</p>
            <Link to="/" className="text-blog-purple hover:underline">
              Return to Home
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 container mx-auto px-4 py-8">
        <article className="max-w-3xl mx-auto">
          {isAdmin && (
            <div className="bg-gray-50 p-4 mb-6 rounded-lg border border-gray-200">
              <h2 className="text-lg font-medium mb-3">Admin Controls</h2>
              <div className="flex gap-3">
                <Button 
                  onClick={handleEdit} 
                  variant="outline" 
                  className="flex items-center gap-2"
                >
                  <Pencil className="h-4 w-4" /> Edit Article
                </Button>
                <Button 
                  onClick={handleDelete} 
                  variant="destructive" 
                  className="flex items-center gap-2"
                  disabled={isLoading}
                >
                  <Trash2 className="h-4 w-4" /> {isLoading ? "Deleting..." : "Delete Article"}
                </Button>
              </div>
            </div>
          )}
          
          <h1 className="text-4xl font-serif font-bold mb-4">{article.title}</h1>
          <div className="flex items-center text-gray-600 mb-6">
            <span>{new Date(article.publishedDate).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric"
            })}</span>
            <span className="mx-2">•</span>
            <span>{article.readTime} min read</span>
          </div>
          
          {article.coverImage && (
            <img 
              src={article.coverImage} 
              alt={article.title} 
              className="w-full h-80 object-cover rounded-lg mb-6"
            />
          )}
          
          <div className="prose prose-lg max-w-none">
            {article.content.split("\n\n").map((paragraph, index) => (
              <p key={index} className="mb-4">{paragraph}</p>
            ))}
          </div>
          
          <Separator className="my-8" />
          
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between">
            <div>
              <h3 className="text-lg font-medium mb-1">About the Author</h3>
              <p className="text-gray-600">{article.category}</p>
            </div>
            <div className="mt-4 sm:mt-0">
              <Link to="/" className="text-blog-purple hover:underline">
                ← Back to Articles
              </Link>
            </div>
          </div>
        </article>
      </main>
      <Footer />
    </div>
  );
};

export default Article;
