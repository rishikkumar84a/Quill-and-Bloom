import { useState, useEffect } from "react";
import { Link, Navigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useContext } from "react";
import { AuthContext } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Plus, Pencil, Trash2, Eye, User as UserIcon } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";
import { saveAs } from "file-saver";

type ArticleRow = Database["public"]["Tables"]["articles"]["Row"];
type CategoryRow = Database["public"]["Tables"]["categories"]["Row"];

type UserRow = Database["public"]["Tables"]["users"]["Row"];

type EditState = {
  open: boolean;
  article: ArticleRow | null;
};

type CreateState = {
  open: boolean;
};

type CategoryEditState = {
  open: boolean;
  category: CategoryRow | null;
};

type CategoryCreateState = {
  open: boolean;
};

const ADMIN_EMAIL = "rishikkumarchaurasiya@gmail.com";

const Admin = () => {
  const session = useContext(AuthContext);
  const { toast } = useToast();
  const isAdmin = session?.user?.email === ADMIN_EMAIL;

  const [activeTab, setActiveTab] = useState("articles");
  const [loading, setLoading] = useState<{[key: string]: boolean}>({});
  const [articles, setArticles] = useState<ArticleRow[]>([]);
  const [fetching, setFetching] = useState(true);
  const [editState, setEditState] = useState<EditState>({ open: false, article: null });
  const [editForm, setEditForm] = useState<Partial<ArticleRow>>({});
  const [editLoading, setEditLoading] = useState(false);
  const [createState, setCreateState] = useState<CreateState>({ open: false });
  const [createForm, setCreateForm] = useState<Partial<ArticleRow>>({});
  const [createLoading, setCreateLoading] = useState(false);

  const [categories, setCategories] = useState<CategoryRow[]>([]);
  const [fetchingCategories, setFetchingCategories] = useState(true);
  const [categoryEditState, setCategoryEditState] = useState<CategoryEditState>({ open: false, category: null });
  const [categoryEditForm, setCategoryEditForm] = useState<Partial<CategoryRow>>({});
  const [categoryEditLoading, setCategoryEditLoading] = useState(false);
  const [categoryCreateState, setCategoryCreateState] = useState<CategoryCreateState>({ open: false });
  const [categoryCreateForm, setCategoryCreateForm] = useState<Partial<CategoryRow>>({});
  const [categoryCreateLoading, setCategoryCreateLoading] = useState(false);

  const [users, setUsers] = useState<UserRow[]>([]);
  const [fetchingUsers, setFetchingUsers] = useState(true);

  const [stats, setStats] = useState({
    articles: 0,
    categories: 0,
    users: 0,
    subscribers: 0,
  });

  const exportSubscribers = async () => {
    const { data, error } = await supabase.from("subscribers").select("*");
    if (error) {
      toast({ title: "Error exporting subscribers", description: error.message });
      return;
    }
    if (!data || data.length === 0) {
      toast({ title: "No subscribers to export" });
      return;
    }
    const csv = [
      "email,created_at",
      ...data.map((row: Database["public"]["Tables"]["subscribers"]["Row"]) => `${row.email},${row.created_at}`)
    ].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    saveAs(blob, `subscribers-${new Date().toISOString().split("T")[0]}.csv`);
  };

  const exportUsers = async () => {
    const { data, error } = await supabase.from("users").select("*");
    if (error) {
      toast({ title: "Error exporting users", description: error.message });
      return;
    }
    if (!data || data.length === 0) {
      toast({ title: "No users to export" });
      return;
    }
    const csv = [
      "email,role,created_at",
      ...data.map((row: Database["public"]["Tables"]["users"]["Row"]) => `${row.email},${row.role || "user"},${row.created_at}`)
    ].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    saveAs(blob, `users-${new Date().toISOString().split("T")[0]}.csv`);
  };

  // Fetch articles from Supabase
  useEffect(() => {
    const fetchArticles = async () => {
      setFetching(true);
      const { data, error } = await supabase
        .from("articles")
        .select("*")
        .order("published_date", { ascending: false });
      if (!error && data) {
        setArticles(data);
      }
      setFetching(false);
    };
    fetchArticles();
  }, []);

  useEffect(() => {
    const fetchCategories = async () => {
      setFetchingCategories(true);
      const { data, error } = await supabase.from("categories").select("*").order("name", { ascending: true });
      if (!error && data) setCategories(data);
      setFetchingCategories(false);
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchUsers = async () => {
      setFetchingUsers(true);
      // Try to fetch from users table; fallback to auth.users if not present
      let data: Database["public"]["Tables"]["users"]["Row"][] = [];
      let error: unknown = null;
      try {
        const res = await supabase.from("users").select("*");
        data = res.data || [];
        error = res.error;
      } catch (e) {
        error = e;
      }
      setUsers(data);
      setFetchingUsers(false);
    };
    fetchUsers();
  }, []);

  useEffect(() => {
    const fetchStats = async () => {
      const [{ count: articles }, { count: categories }, { count: users }, { count: subscribers }] = await Promise.all([
        supabase.from("articles").select("id", { count: "exact", head: true }),
        supabase.from("categories").select("id", { count: "exact", head: true }),
        supabase.from("users").select("id", { count: "exact", head: true }),
        supabase.from("subscribers").select("id", { count: "exact", head: true }),
      ]);
      setStats({
        articles: articles ?? 0,
        categories: categories ?? 0,
        users: users ?? 0,
        subscribers: subscribers ?? 0,
      });
    };
    fetchStats();
  }, []);

  // Redirect if not logged in as admin
  if (!isAdmin) {
    return <Navigate to="/auth" replace />;
  }

  // CREATE HANDLERS
  const handleCreateOpen = () => {
    setCreateState({ open: true });
    setCreateForm({});
  };
  const handleCreateChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setCreateForm(prev => ({ ...prev, [name]: value }));
  };
  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreateLoading(true);
    const { title, category, content, slug } = createForm;
    if (!title || !category || !content || !slug) {
      toast({ title: "Missing required fields", description: "Title, category, slug, and content are required." });
      setCreateLoading(false);
      return;
    }
    const { data, error } = await supabase.from("articles").insert([{ ...createForm }]).select();
    if (!error && data && data[0]) {
      setArticles(prev => [data[0], ...prev]);
      toast({ title: "Article created", description: "New article has been created." });
      setCreateState({ open: false });
      setCreateForm({});
    } else {
      toast({ title: "Error creating article", description: error?.message });
    }
    setCreateLoading(false);
  };
  const handleCreateClose = () => {
    setCreateState({ open: false });
    setCreateForm({});
  };

  // EDIT HANDLERS (unchanged)
  const handleEdit = (article: ArticleRow) => {
    setEditState({ open: true, article });
    setEditForm({ ...article });
  };
  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setEditForm(prev => ({ ...prev, [name]: value }));
  };
  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editState.article) return;
    setEditLoading(true);
    const { id, ...updateData } = editForm;
    const { error } = await supabase.from("articles").update(updateData).eq("id", editState.article.id);
    if (!error) {
      setArticles(prev => prev.map(a => a.id === editState.article?.id ? { ...a, ...updateData } as ArticleRow : a));
      toast({ title: "Article updated", description: "Article has been updated successfully." });
      setEditState({ open: false, article: null });
    } else {
      toast({ title: "Error updating article", description: error.message });
    }
    setEditLoading(false);
  };
  const handleEditClose = () => {
    setEditState({ open: false, article: null });
    setEditForm({});
  };

  // DELETE HANDLER (unchanged)
  const handleDelete = async (id: string) => {
    setLoading(prev => ({ ...prev, [id]: true }));
    const { error } = await supabase.from("articles").delete().eq("id", id);
    if (!error) {
      setArticles(prev => prev.filter(article => article.id !== id));
      toast({
        title: "Article deleted",
        description: `Article has been deleted successfully.`,
      });
    } else {
      toast({
        title: "Error deleting article",
        description: error.message,
      });
    }
    setLoading(prev => ({ ...prev, [id]: false }));
  };

  // Create Category
  const handleCategoryCreateOpen = () => {
    setCategoryCreateState({ open: true });
    setCategoryCreateForm({});
  };
  const handleCategoryCreateChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setCategoryCreateForm(prev => ({ ...prev, [name]: value }));
  };
  const handleCategoryCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setCategoryCreateLoading(true);
    const { name, slug, description, cover_image } = categoryCreateForm;
    if (!name || !slug) {
      toast({ title: "Missing required fields", description: "Name and slug are required." });
      setCategoryCreateLoading(false);
      return;
    }
    const { data, error } = await supabase.from("categories").insert([{ ...categoryCreateForm }]).select();
    if (!error && data && data[0]) {
      setCategories(prev => [...prev, data[0]]);
      toast({ title: "Category created", description: "New category has been created." });
      setCategoryCreateState({ open: false });
      setCategoryCreateForm({});
    } else {
      toast({ title: "Error creating category", description: error?.message });
    }
    setCategoryCreateLoading(false);
  };
  const handleCategoryCreateClose = () => {
    setCategoryCreateState({ open: false });
    setCategoryCreateForm({});
  };

  // Edit Category
  const handleCategoryEdit = (category: CategoryRow) => {
    setCategoryEditState({ open: true, category });
    setCategoryEditForm({ ...category });
  };
  const handleCategoryEditChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setCategoryEditForm(prev => ({ ...prev, [name]: value }));
  };
  const handleCategoryEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!categoryEditState.category) return;
    setCategoryEditLoading(true);
    const { id, ...updateData } = categoryEditForm;
    const { error } = await supabase.from("categories").update(updateData).eq("id", categoryEditState.category.id);
    if (!error) {
      setCategories(prev => prev.map(c => c.id === categoryEditState.category?.id ? { ...c, ...updateData } as CategoryRow : c));
      toast({ title: "Category updated", description: "Category has been updated successfully." });
      setCategoryEditState({ open: false, category: null });
    } else {
      toast({ title: "Error updating category", description: error.message });
    }
    setCategoryEditLoading(false);
  };
  const handleCategoryEditClose = () => {
    setCategoryEditState({ open: false, category: null });
    setCategoryEditForm({});
  };

  // Delete Category
  const handleCategoryDelete = async (id: string) => {
    setFetchingCategories(true);
    const { error } = await supabase.from("categories").delete().eq("id", id);
    if (!error) {
      setCategories(prev => prev.filter(category => category.id !== id));
      toast({ title: "Category deleted", description: `Category has been deleted successfully.` });
    } else {
      toast({ title: "Error deleting category", description: error.message });
    }
    setFetchingCategories(false);
  };

  const handleRoleChange = async (userId: string, newRole: string) => {
    // Optimistically update UI
    setUsers(prev => prev.map(u => u.id === userId ? { ...u, role: newRole } : u));
    const { error } = await supabase.from("users").update({ role: newRole }).eq("id", userId);
    if (error) {
      toast({ title: "Error updating role", description: error.message });
      // Revert UI if error
      setUsers(prev => prev.map(u => u.id === userId ? { ...u, role: u.role === "admin" ? "user" : "admin" } : u));
    } else {
      toast({ title: "Role updated", description: `User is now ${newRole}` });
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-white rounded-lg shadow p-4 flex flex-col items-center">
              <span className="text-2xl font-bold text-blog-purple">{stats.articles}</span>
              <span className="text-gray-600 text-sm mt-1">Articles</span>
            </div>
            <div className="bg-white rounded-lg shadow p-4 flex flex-col items-center">
              <span className="text-2xl font-bold text-blog-purple">{stats.categories}</span>
              <span className="text-gray-600 text-sm mt-1">Categories</span>
            </div>
            <div className="bg-white rounded-lg shadow p-4 flex flex-col items-center">
              <span className="text-2xl font-bold text-blog-purple">{stats.users}</span>
              <span className="text-gray-600 text-sm mt-1">Users</span>
            </div>
            <div className="bg-white rounded-lg shadow p-4 flex flex-col items-center">
              <span className="text-2xl font-bold text-blog-purple">{stats.subscribers}</span>
              <span className="text-gray-600 text-sm mt-1">Subscribers</span>
            </div>
          </div>
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold font-serif text-blog-purple-dark">Admin Dashboard</h1>
            <Button onClick={handleCreateOpen} className="flex items-center gap-2">
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
              {fetching ? (
                <div className="text-center py-8">Loading articles...</div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {articles.map((article) => (
                    <Card key={article.id} className="overflow-hidden">
                      <div className="h-40 overflow-hidden">
                        {article.cover_image ? (
                          <img 
                            src={article.cover_image} 
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
                        <p className="text-gray-600 text-sm mb-2">{article.category}</p>
                        <p className="text-gray-500 text-xs">
                          {new Date(article.published_date).toLocaleDateString()} • {article.read_time} min read
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
                            onClick={() => handleEdit(article)}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                        </div>
                        <Button 
                          variant="destructive" 
                          size="sm" 
                          className="h-8 px-2"
                          onClick={() => handleDelete(article.id)}
                          disabled={loading[article.id]}
                        >
                          {loading[article.id] ? "..." : <Trash2 className="h-4 w-4" />}
                        </Button>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>
            <TabsContent value="categories">
              {fetchingCategories ? (
                <div className="text-center py-8">Loading categories...</div>
              ) : (
                <div className="space-y-6">
                  <Button onClick={handleCategoryCreateOpen} className="flex items-center gap-2">
                    <Plus className="h-4 w-4" /> New Category
                  </Button>
                  <ul>
                    {categories.map(category => (
                      <li key={category.id} className="py-2">
                        <span className="text-lg">{category.name}</span>
                        <div className="flex gap-2">
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="h-8 px-2"
                            onClick={() => handleCategoryEdit(category)}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="destructive" 
                            size="sm" 
                            className="h-8 px-2"
                            onClick={() => handleCategoryDelete(category.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </TabsContent>
            <TabsContent value="users">
              {fetchingUsers ? (
                <div className="text-center py-8">Loading users...</div>
              ) : (
                <div className="space-y-6">
                  <Button onClick={exportUsers} variant="outline" size="sm" className="mb-4">Export Users CSV</Button>
                  <ul>
                    {users.map(user => (
                      <li key={user.id} className="flex items-center gap-4 py-2 border-b">
                        <UserIcon className="h-6 w-6 text-blog-purple" />
                        <div className="flex-1">
                          <div className="font-medium">{user.email}</div>
                          <div className="text-xs text-gray-400">Joined {user.created_at ? new Date(user.created_at).toLocaleDateString() : "-"}</div>
                        </div>
                        <select
                          className="border rounded px-2 py-1 text-sm"
                          value={user.role || "user"}
                          onChange={e => handleRoleChange(user.id, e.target.value)}
                          disabled={user.email === ADMIN_EMAIL}
                          title={user.email === ADMIN_EMAIL ? "Cannot change role for main admin" : undefined}
                        >
                          <option value="user">User</option>
                          <option value="admin">Admin</option>
                        </select>
                      </li>
                    ))}
                  </ul>
                  {users.length === 0 && <div className="text-gray-500 text-center">No users found.</div>}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
        {/* Create Modal */}
        {createState.open && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
            <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-lg relative">
              <button
                className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
                onClick={handleCreateClose}
              >
                ×
              </button>
              <h2 className="text-2xl font-bold mb-4">New Article</h2>
              <form onSubmit={handleCreateSubmit} className="space-y-4">
                <input
                  type="text"
                  name="title"
                  value={createForm.title || ""}
                  onChange={handleCreateChange}
                  placeholder="Title"
                  className="w-full border rounded px-3 py-2"
                  required
                />
                <input
                  type="text"
                  name="category"
                  value={createForm.category || ""}
                  onChange={handleCreateChange}
                  placeholder="Category"
                  className="w-full border rounded px-3 py-2"
                  required
                />
                <input
                  type="text"
                  name="cover_image"
                  value={createForm.cover_image || ""}
                  onChange={handleCreateChange}
                  placeholder="Cover Image URL"
                  className="w-full border rounded px-3 py-2"
                />
                <input
                  type="text"
                  name="slug"
                  value={createForm.slug || ""}
                  onChange={handleCreateChange}
                  placeholder="Slug"
                  className="w-full border rounded px-3 py-2"
                  required
                />
                <input
                  type="number"
                  name="read_time"
                  value={createForm.read_time || ""}
                  onChange={handleCreateChange}
                  placeholder="Read Time (min)"
                  className="w-full border rounded px-3 py-2"
                />
                <textarea
                  name="content"
                  value={createForm.content || ""}
                  onChange={handleCreateChange}
                  placeholder="Content"
                  className="w-full border rounded px-3 py-2 min-h-[120px]"
                  required
                />
                <div className="flex gap-2 justify-end">
                  <Button type="button" variant="outline" onClick={handleCreateClose}>
                    Cancel
                  </Button>
                  <Button type="submit" disabled={createLoading}>
                    {createLoading ? "Creating..." : "Create Article"}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        )}
        {/* Edit Modal (unchanged) */}
        {editState.open && editState.article && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
            <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-lg relative">
              <button
                className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
                onClick={handleEditClose}
              >
                ×
              </button>
              <h2 className="text-2xl font-bold mb-4">Edit Article</h2>
              <form onSubmit={handleEditSubmit} className="space-y-4">
                <input
                  type="text"
                  name="title"
                  value={editForm.title || ""}
                  onChange={handleEditChange}
                  placeholder="Title"
                  className="w-full border rounded px-3 py-2"
                  required
                />
                <input
                  type="text"
                  name="category"
                  value={editForm.category || ""}
                  onChange={handleEditChange}
                  placeholder="Category"
                  className="w-full border rounded px-3 py-2"
                  required
                />
                <input
                  type="text"
                  name="cover_image"
                  value={editForm.cover_image || ""}
                  onChange={handleEditChange}
                  placeholder="Cover Image URL"
                  className="w-full border rounded px-3 py-2"
                />
                <input
                  type="text"
                  name="slug"
                  value={editForm.slug || ""}
                  onChange={handleEditChange}
                  placeholder="Slug"
                  className="w-full border rounded px-3 py-2"
                  required
                />
                <input
                  type="number"
                  name="read_time"
                  value={editForm.read_time || ""}
                  onChange={handleEditChange}
                  placeholder="Read Time (min)"
                  className="w-full border rounded px-3 py-2"
                />
                <textarea
                  name="content"
                  value={editForm.content || ""}
                  onChange={handleEditChange}
                  placeholder="Content"
                  className="w-full border rounded px-3 py-2 min-h-[120px]"
                  required
                />
                <div className="flex gap-2 justify-end">
                  <Button type="button" variant="outline" onClick={handleEditClose}>
                    Cancel
                  </Button>
                  <Button type="submit" disabled={editLoading}>
                    {editLoading ? "Saving..." : "Save Changes"}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        )}
        {/* Category Create Modal */}
        {categoryCreateState.open && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
            <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-lg relative">
              <button
                className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
                onClick={handleCategoryCreateClose}
              >
                ×
              </button>
              <h2 className="text-2xl font-bold mb-4">New Category</h2>
              <form onSubmit={handleCategoryCreateSubmit} className="space-y-4">
                <input
                  type="text"
                  name="name"
                  value={categoryCreateForm.name || ""}
                  onChange={handleCategoryCreateChange}
                  placeholder="Name"
                  className="w-full border rounded px-3 py-2"
                  required
                />
                <input
                  type="text"
                  name="slug"
                  value={categoryCreateForm.slug || ""}
                  onChange={handleCategoryCreateChange}
                  placeholder="Slug"
                  className="w-full border rounded px-3 py-2"
                  required
                />
                <textarea
                  name="description"
                  value={categoryCreateForm.description || ""}
                  onChange={handleCategoryCreateChange}
                  placeholder="Description (optional)"
                  className="w-full border rounded px-3 py-2 min-h-[80px]"
                />
                <input
                  type="text"
                  name="cover_image"
                  value={categoryCreateForm.cover_image || ""}
                  onChange={handleCategoryCreateChange}
                  placeholder="Cover Image URL (optional)"
                  className="w-full border rounded px-3 py-2"
                />
                {categoryCreateForm.cover_image && (
                  <img
                    src={categoryCreateForm.cover_image}
                    alt="Preview"
                    className="w-full h-32 object-cover rounded mb-2 border"
                  />
                )}
                <div className="flex gap-2 justify-end">
                  <Button type="button" variant="outline" onClick={handleCategoryCreateClose}>
                    Cancel
                  </Button>
                  <Button type="submit" disabled={categoryCreateLoading}>
                    {categoryCreateLoading ? "Creating..." : "Create Category"}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        )}
        {/* Category Edit Modal */}
        {categoryEditState.open && categoryEditState.category && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
            <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-lg relative">
              <button
                className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
                onClick={handleCategoryEditClose}
              >
                ×
              </button>
              <h2 className="text-2xl font-bold mb-4">Edit Category</h2>
              <form onSubmit={handleCategoryEditSubmit} className="space-y-4">
                <input
                  type="text"
                  name="name"
                  value={categoryEditForm.name || ""}
                  onChange={handleCategoryEditChange}
                  placeholder="Name"
                  className="w-full border rounded px-3 py-2"
                  required
                />
                <input
                  type="text"
                  name="slug"
                  value={categoryEditForm.slug || ""}
                  onChange={handleCategoryEditChange}
                  placeholder="Slug"
                  className="w-full border rounded px-3 py-2"
                  required
                />
                <textarea
                  name="description"
                  value={categoryEditForm.description || ""}
                  onChange={handleCategoryEditChange}
                  placeholder="Description (optional)"
                  className="w-full border rounded px-3 py-2 min-h-[80px]"
                />
                <input
                  type="text"
                  name="cover_image"
                  value={categoryEditForm.cover_image || ""}
                  onChange={handleCategoryEditChange}
                  placeholder="Cover Image URL (optional)"
                  className="w-full border rounded px-3 py-2"
                />
                {categoryEditForm.cover_image && (
                  <img
                    src={categoryEditForm.cover_image}
                    alt="Preview"
                    className="w-full h-32 object-cover rounded mb-2 border"
                  />
                )}
                <div className="flex gap-2 justify-end">
                  <Button type="button" variant="outline" onClick={handleCategoryEditClose}>
                    Cancel
                  </Button>
                  <Button type="submit" disabled={categoryEditLoading}>
                    {categoryEditLoading ? "Saving..." : "Save Changes"}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        )}
        <Button onClick={exportSubscribers} variant="outline" size="sm" className="mb-4 fixed bottom-4 right-4">Export Subscribers CSV</Button>
      </main>
      <Footer />
    </div>
  );
};

export default Admin;
