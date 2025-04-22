
import { useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { articles } from "@/data/articles";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useAuthSession } from "@/App";
import { Button } from "@/components/ui/button";
import { Plus, Pencil, Trash2, Eye } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const ADMIN_EMAIL = "rishikkumarchaurasiya@gmail.com";

const Admin = () => {
  const session = useAuthSession();
  const { toast } = useToast();
  const isAdmin = session?.user?.email === ADMIN_EMAIL;
  
  const [activeTab, setActiveTab] = useState("articles");
  const [loading, setLoading] = useState<{[key: string]: boolean}>({});

  // Redirect if not logged in as admin
  if (!isAdmin) {
    return <Navigate to="/auth" replace />;
  }

  const handleCreate = () => {
    toast({
      title: "Create new article",
      description: "New article creation would be implemented here.",
    });
  };

  const handleEdit = (slug: string) => {
    toast({
      title: "Edit article",
      description: `Editing article: ${slug}`,
    });
  };

  const handleDelete = (slug: string) => {
    setLoading({...loading, [slug]: true});
    // Simulate API call
    setTimeout(() => {
      toast({
        title: "Article deleted",
        description: `Article "${slug}" has been deleted successfully.`,
      });
      setLoading({...loading, [slug]: false});
    }, 1000);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold font-serif text-blog-purple-dark">Admin Dashboard</h1>
            <Button onClick={handleCreate} className="flex items-center gap-2">
              <Plus className="h-4 w-4" /> New Article
            </Button>
          </div>

          <Tabs defaultValue="articles" className="mb-8">
            <TabsList className="mb-6">
              <TabsTrigger value="articles" onClick={() => setActiveTab("articles")}>Articles</TabsTrigger>
              <TabsTrigger value="categories" onClick={() => setActiveTab("categories")}>Categories</TabsTrigger>
              <TabsTrigger value="users" onClick={() => setActiveTab("users")}>Users</TabsTrigger>
            </TabsList>

            <TabsContent value="articles" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {articles.map((article) => (
                  <Card key={article.slug} className="overflow-hidden">
                    <div className="h-40 overflow-hidden">
                      {article.coverImage ? (
                        <img 
                          src={article.coverImage} 
                          alt={article.title} 
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                          <span className="text-gray-500">No image</span>
                        </div>
                      )}
                    </div>
                    <CardContent className="p-4">
                      <h3 className="font-medium text-lg mb-2 line-clamp-1">{article.title}</h3>
                      <p className="text-gray-600 text-sm mb-2">By {article.category}</p>
                      <p className="text-gray-500 text-xs">
                        {new Date(article.publishedDate).toLocaleDateString()} • {article.readTime} min read
                      </p>
                    </CardContent>
                    <CardFooter className="flex justify-between p-4 pt-0">
                      <div className="flex gap-2">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="h-8 px-2"
                          asChild
                        >
                          <Link to={`/article/${article.slug}`}>
                            <Eye className="h-4 w-4" />
                          </Link>
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="h-8 px-2"
                          onClick={() => handleEdit(article.slug)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                      </div>
                      <Button 
                        variant="destructive" 
                        size="sm" 
                        className="h-8 px-2"
                        onClick={() => handleDelete(article.slug)}
                        disabled={loading[article.slug]}
                      >
                        {loading[article.slug] ? "..." : <Trash2 className="h-4 w-4" />}
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="categories">
              <div className="bg-white p-6 rounded-lg border border-gray-200">
                <p className="text-gray-600">Category management would be implemented here.</p>
              </div>
            </TabsContent>

            <TabsContent value="users">
              <div className="bg-white p-6 rounded-lg border border-gray-200">
                <p className="text-gray-600">User management would be implemented here.</p>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Admin;
