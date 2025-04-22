
import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";

interface ArticleCardProps {
  article: {
    id: string;
    title: string;
    excerpt: string;
    coverImage: string;
    category: string;
    publishedDate: string;
    readTime: string;
    slug: string;
  };
  featured?: boolean;
}

const ArticleCard = ({ article, featured = false }: ArticleCardProps) => {
  return (
    <article className={`bg-white border border-gray-100 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition duration-300 h-full ${featured ? 'lg:flex' : ''}`}>
      {/* Image */}
      <div className={`relative ${featured ? 'lg:w-1/2' : ''}`}>
        <Link to={`/article/${article.slug}`}>
          <img 
            src={article.coverImage} 
            alt={article.title} 
            className={`w-full h-48 object-cover ${featured ? 'lg:h-full' : ''}`}
          />
        </Link>
        <Badge className="absolute top-4 left-4 bg-blog-purple hover:bg-blog-purple-dark">
          {article.category}
        </Badge>
      </div>

      {/* Content */}
      <div className={`p-6 ${featured ? 'lg:w-1/2 lg:flex lg:flex-col lg:justify-center' : ''}`}>
        <Link to={`/article/${article.slug}`}>
          <h3 className={`font-serif font-semibold text-gray-900 hover:text-blog-purple mb-2 transition duration-200 ${featured ? 'text-2xl' : 'text-xl'}`}>
            {article.title}
          </h3>
        </Link>
        <p className="text-gray-600 mb-4 line-clamp-3">{article.excerpt}</p>
        <div className="flex items-center text-sm text-gray-500 mt-auto">
          <span>{article.publishedDate}</span>
          <span className="mx-2">•</span>
          <span>{article.readTime} read</span>
        </div>
      </div>
    </article>
  );
};

export default ArticleCard;
