import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Calendar, BookOpen, Users, Building, Hash, Languages, AlertCircle, Loader2 } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { getBookDetails, BookDetail } from "@/lib/openLibraryApi";

export default function BookDetails() {
  const { id } = useParams<{ id: string }>();
  const [book, setBook] = useState<BookDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      fetchBookDetails(id);
    }
  }, [id]);

  const fetchBookDetails = async (bookId: string) => {
    try {
      setLoading(true);
      setError(null);
      
      // Ensure the book key is in the correct format
      const bookKey = bookId.startsWith('/works/') ? bookId : `/works/${bookId}`;
      const bookDetails = await getBookDetails(bookKey);
      
      if (!bookDetails) {
        setError('Book not found. Please check the URL or try searching for the book.');
        return;
      }
      
      setBook(bookDetails);
    } catch (err) {
      console.error('Error fetching book details:', err);
      setError(err instanceof Error ? err.message : 'Failed to load book details. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleBorrowReturn = () => {
    if (!book) return;
    
    // Mock borrow/return functionality
    const action = Math.random() > 0.5 ? 'borrowed' : 'returned';
    alert(`Book "${book.title}" has been ${action} successfully!`);
    console.log(`Book action: ${action}`, book);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Header />
        <main className="flex-1 flex items-center justify-center px-4 py-16">
          <div className="text-center">
            <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Loading Book Details</h2>
            <p className="text-gray-600">Please wait while we fetch the book information...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error || !book) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Header />
        <main className="flex-1 px-4 py-8">
          <div className="max-w-4xl mx-auto">
            <div className="mb-6">
              <Link to="/" className="inline-flex items-center text-primary hover:text-primary/80">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Home
              </Link>
            </div>
            
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription className="flex flex-col space-y-2">
                <span>{error || 'Book not found'}</span>
                <div className="flex space-x-2">
                  <Button 
                    onClick={() => id && fetchBookDetails(id)} 
                    variant="outline" 
                    size="sm"
                  >
                    Try Again
                  </Button>
                  <Link to="/">
                    <Button variant="outline" size="sm">
                      Go Home
                    </Button>
                  </Link>
                </div>
              </AlertDescription>
            </Alert>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      
      <main className="flex-1 px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Back Navigation */}
          <div className="mb-6">
            <Link to="/" className="inline-flex items-center text-primary hover:text-primary/80 transition-colors">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Home
            </Link>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 p-8">
              {/* Book Cover */}
              <div className="lg:col-span-1">
                <div className="aspect-[3/4] bg-gray-100 rounded-lg overflow-hidden shadow-md">
                  <img
                    src={book.coverUrl}
                    alt={`${book.title} cover`}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = "/placeholder.svg";
                    }}
                  />
                </div>
              </div>

              {/* Book Information */}
              <div className="lg:col-span-2 space-y-6">
                {/* Title and Author */}
                <div>
                  <h1 className="text-4xl font-bold text-gray-900 mb-2 leading-tight">
                    {book.title}
                  </h1>
                  {book.subtitle && (
                    <h2 className="text-xl text-gray-700 mb-4">
                      {book.subtitle}
                    </h2>
                  )}
                  <div className="flex items-center text-xl text-gray-700 mb-6">
                    <Users className="h-5 w-5 mr-2" />
                    <span>
                      {book.authors.length > 0 ? book.authors.join(', ') : 'Unknown Author'}
                    </span>
                  </div>
                </div>

                {/* Book Metadata */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {book.publishDate && (
                    <div className="flex items-center text-sm text-gray-600">
                      <Calendar className="h-4 w-4 mr-2" />
                      <span className="font-medium">Published:</span>
                      <span className="ml-1">{book.publishDate}</span>
                    </div>
                  )}
                  
                  {book.publishers && book.publishers.length > 0 && (
                    <div className="flex items-center text-sm text-gray-600">
                      <Building className="h-4 w-4 mr-2" />
                      <span className="font-medium">Publisher:</span>
                      <span className="ml-1">{book.publishers.join(', ')}</span>
                    </div>
                  )}
                  
                  {book.isbn && (
                    <div className="flex items-center text-sm text-gray-600">
                      <Hash className="h-4 w-4 mr-2" />
                      <span className="font-medium">ISBN:</span>
                      <span className="ml-1">{book.isbn}</span>
                    </div>
                  )}
                  
                  {book.numberOfPages && (
                    <div className="flex items-center text-sm text-gray-600">
                      <BookOpen className="h-4 w-4 mr-2" />
                      <span className="font-medium">Pages:</span>
                      <span className="ml-1">{book.numberOfPages}</span>
                    </div>
                  )}
                  
                  {book.language && book.language.length > 0 && (
                    <div className="flex items-center text-sm text-gray-600">
                      <Languages className="h-4 w-4 mr-2" />
                      <span className="font-medium">Language:</span>
                      <span className="ml-1">{book.language.join(', ')}</span>
                    </div>
                  )}
                </div>

                {/* Subjects/Genres */}
                {book.subjects && book.subjects.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Subjects & Genres</h3>
                    <div className="flex flex-wrap gap-2">
                      {book.subjects.slice(0, 10).map((subject, index) => (
                        <Badge 
                          key={index}
                          variant="secondary" 
                          className="bg-blue-100 text-blue-800 hover:bg-blue-200"
                        >
                          {subject}
                        </Badge>
                      ))}
                      {book.subjects.length > 10 && (
                        <Badge variant="outline" className="text-gray-500">
                          +{book.subjects.length - 10} more
                        </Badge>
                      )}
                    </div>
                  </div>
                )}

                <Separator />

                {/* Description */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Description</h3>
                  {book.description ? (
                    <div className="prose prose-gray max-w-none">
                      <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                        {book.description}
                      </p>
                    </div>
                  ) : book.firstSentence ? (
                    <div className="prose prose-gray max-w-none">
                      <p className="text-gray-700 leading-relaxed">
                        {book.firstSentence}
                      </p>
                      <p className="text-sm text-gray-500 italic mt-2">
                        Full description not available
                      </p>
                    </div>
                  ) : (
                    <p className="text-gray-500 italic">
                      No description available for this book.
                    </p>
                  )}
                </div>

                {/* Action Button */}
                <div className="pt-4">
                  <Button 
                    onClick={handleBorrowReturn}
                    className="bg-primary hover:bg-primary/90 text-white px-8 py-3 text-base font-medium"
                  >
                    Borrow This Book
                  </Button>
                  <p className="text-sm text-gray-500 mt-2">
                    Click to simulate borrowing this book from the library
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
