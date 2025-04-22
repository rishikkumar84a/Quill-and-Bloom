import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Menu, X, Search, LogOut, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { useAuthSession } from "@/context/AuthContext";

const ADMIN_EMAIL = "rishikkumarchaurasiya@gmail.com";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const session = useAuthSession();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  const isAdmin = session?.user?.email === ADMIN_EMAIL;

  return (
    <header className="border-b border-gray-100 bg-white/95 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center">
          <img 
            src="/public/lovable-uploads/320cc0d2-c3cd-4e0e-8fdb-d2fb3f65ad20.png" 
            alt="Logo Quill and Bloom" 
            className="h-10 mr-2"
          />
          <h1 className="text-2xl font-serif font-bold text-blog-purple-dark">Logo Quill and Bloom</h1>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-8">
          <Link to="/" className="text-gray-700 hover:text-blog-purple font-medium">Home</Link>
          <Link to="/categories" className="text-gray-700 hover:text-blog-purple font-medium">Categories</Link>
          <Link to="/about" className="text-gray-700 hover:text-blog-purple font-medium">About</Link>
          {isAdmin && (
            <Link to="/admin" className="text-gray-700 hover:text-blog-purple font-medium">Admin</Link>
          )}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsSearchOpen(!isSearchOpen)}
            aria-label="Search"
          >
            <Search className="h-5 w-5" />
          </Button>
          {isAdmin ? (
            <Button variant="ghost" size="icon" aria-label="Logout" onClick={handleLogout}>
              <LogOut className="h-5 w-5" />
            </Button>
          ) : (
            <Link to="/auth" className="text-gray-700 hover:text-blog-purple font-medium">Admin Login</Link>
          )}
        </nav>

        {/* Mobile Menu Button */}
        <div className="md:hidden flex items-center">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsSearchOpen(!isSearchOpen)}
            className="mr-2"
            aria-label="Search"
          >
            <Search className="h-5 w-5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label={isMenuOpen ? "Close Menu" : "Open Menu"}
          >
            {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {/* Search Bar */}
      {isSearchOpen && (
        <div className="container mx-auto px-4 py-3 border-t border-gray-100">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
            <Input
              type="search"
              placeholder="Search articles..."
              className="pl-10 w-full"
              autoFocus
            />
          </div>
        </div>
      )}

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden container mx-auto px-4 py-4 border-t border-gray-100">
          <nav className="flex flex-col space-y-4">
            <Link to="/" className="text-gray-700 hover:text-blog-purple font-medium py-2" onClick={() => setIsMenuOpen(false)}>Home</Link>
            <Link to="/categories" className="text-gray-700 hover:text-blog-purple font-medium py-2" onClick={() => setIsMenuOpen(false)}>Categories</Link>
            <Link to="/about" className="text-gray-700 hover:text-blog-purple font-medium py-2" onClick={() => setIsMenuOpen(false)}>About</Link>
            {isAdmin && (
              <Link to="/admin" className="text-gray-700 hover:text-blog-purple font-medium py-2" onClick={() => setIsMenuOpen(false)}>
                <div className="flex items-center">
                  <Settings className="h-4 w-4 mr-2" /> Admin Dashboard
                </div>
              </Link>
            )}
            {isAdmin ? (
              <Button variant="ghost" size="sm" aria-label="Logout" onClick={handleLogout}>
                <LogOut className="h-4 w-4 mr-2" /> Logout
              </Button>
            ) : (
              <Link to="/auth" className="text-gray-700 hover:text-blog-purple font-medium py-2" onClick={() => setIsMenuOpen(false)}>Admin Login</Link>
            )}
          </nav>
        </div>
      )}
    </header>
  );
};

export default Navbar;
