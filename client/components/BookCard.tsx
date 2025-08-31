import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { Calendar, BookOpen } from "lucide-react";

interface BookCardProps {
  id: string;
  title: string;
  author: string;
  coverImage: string;
  status: "In Stock" | "On Loan" | "Reserved";
  publishYear?: number;
  subjects?: string[];
  onClick?: () => void;
}

export default function BookCard({ 
  id, 
  title, 
  author, 
  coverImage, 
  status,
  publishYear,
  subjects,
  onClick 
}: BookCardProps) {
  const getStatusVariant = (status: string) => {
    switch (status) {
      case "In Stock":
        return "default";
      case "On Loan":
        return "secondary";
      case "Reserved":
        return "outline";
      default:
        return "default";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "In Stock":
        return "text-green-700 bg-green-100";
      case "On Loan":
        return "text-red-700 bg-red-100";
      case "Reserved":
        return "text-orange-700 bg-orange-100";
      default:
        return "text-gray-700 bg-gray-100";
    }
  };

  // Truncate title if too long
  const truncatedTitle = title.length > 60 ? `${title.substring(0, 60)}...` : title;
  const truncatedAuthor = author.length > 40 ? `${author.substring(0, 40)}...` : author;

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-all duration-200 hover:scale-105">
      {/* Book Cover */}
      <div className="aspect-[3/4] relative bg-gray-100 overflow-hidden">
        <img
          src={coverImage}
          alt={`${title} cover`}
          className="w-full h-full object-cover transition-opacity duration-200"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = "/placeholder.svg";
          }}
          loading="lazy"
        />
        
        {/* Publish Year Badge */}
        {publishYear && (
          <div className="absolute top-2 left-2">
            <Badge variant="secondary" className="bg-white/90 text-gray-700 text-xs">
              <Calendar className="h-3 w-3 mr-1" />
              {publishYear}
            </Badge>
          </div>
        )}
      </div>

      {/* Book Info */}
      <div className="p-4 space-y-3">
        <div className="space-y-2">
          <h3 
            className="font-semibold text-gray-900 text-sm leading-tight line-clamp-2 min-h-[2.5rem]"
            title={title}
          >
            {truncatedTitle}
          </h3>
          <p 
            className="text-sm text-gray-600 line-clamp-1"
            title={author}
          >
            by {truncatedAuthor}
          </p>
        </div>

        {/* Subjects/Genres */}
        {subjects && subjects.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {subjects.slice(0, 2).map((subject, index) => (
              <Badge 
                key={index}
                variant="outline" 
                className="text-xs px-2 py-0.5 bg-blue-50 text-blue-700 border-blue-200"
              >
                <BookOpen className="h-3 w-3 mr-1" />
                {subject.length > 15 ? `${subject.substring(0, 15)}...` : subject}
              </Badge>
            ))}
            {subjects.length > 2 && (
              <Badge variant="outline" className="text-xs px-2 py-0.5 text-gray-500">
                +{subjects.length - 2} more
              </Badge>
            )}
          </div>
        )}

        {/* Status Badge */}
        <div className="flex justify-between items-center">
          <Badge 
            variant="secondary" 
            className={`text-xs px-2 py-1 ${getStatusColor(status)}`}
          >
            {status}
          </Badge>
        </div>

        {/* View Details Button */}
        <Link to={`/book/${id}`} className="block">
          <Button 
            variant="default" 
            size="sm" 
            className="w-full bg-primary hover:bg-primary/90 text-white transition-colors"
            onClick={onClick}
          >
            View Details
          </Button>
        </Link>
      </div>
    </div>
  );
}
