
import { Link } from "react-router-dom";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white border-t border-gray-100 py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Logo and Description */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center">
              <img 
                src="/public/lovable-uploads/320cc0d2-c3cd-4e0e-8fdb-d2fb3f65ad20.png" 
                alt="Quill & Bloom Logo" 
                className="h-10 mr-2"
              />
              <h2 className="text-xl font-serif font-bold text-blog-purple-dark">Quill & Bloom</h2>
            </Link>
            <p className="text-gray-600 leading-relaxed">
              A beautiful space for sharing thoughtful articles and stories that inspire, educate, and entertain.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-lg font-serif font-semibold text-gray-800">Quick Links</h3>
            <nav className="flex flex-col space-y-2">
              <Link to="/" className="text-gray-600 hover:text-blog-purple transition duration-200">Home</Link>
              <Link to="/categories" className="text-gray-600 hover:text-blog-purple transition duration-200">Categories</Link>
              <Link to="/about" className="text-gray-600 hover:text-blog-purple transition duration-200">About</Link>
            </nav>
          </div>

          {/* Subscribe */}
          <div className="space-y-4">
            <h3 className="text-lg font-serif font-semibold text-gray-800">Stay Updated</h3>
            <p className="text-gray-600 leading-relaxed">
              Subscribe to receive notifications when new articles are published.
            </p>
            <div className="flex flex-col sm:flex-row gap-2">
              <input 
                type="email" 
                placeholder="Your email address" 
                className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blog-purple/50 focus:border-blog-purple"
              />
              <button 
                className="bg-blog-purple text-white font-medium px-4 py-2 rounded-md hover:bg-blog-purple-dark transition duration-200"
              >
                Subscribe
              </button>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-gray-100 mt-10 pt-6 text-center text-gray-500 text-sm">
          <p>© {currentYear} Quill & Bloom. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
