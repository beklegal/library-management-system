import { useState, useEffect } from "react";
import { Search, ChevronLeft, ChevronRight, AlertCircle, Loader2 } from "lucide-react";
import { useSearchParams } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import BookCard from "@/components/BookCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  searchBooks, 
  getTrendingBooks, 
  transformBookForDisplay,
  OpenLibraryBook
} from "@/lib/openLibraryApi";

interface DisplayBook {
  id: string;
  title: string;
  author: string;
  coverImage: string;
  status: "In Stock" | "On Loan" | "Reserved";
  publishYear?: number;
  subjects?: string[];
}

export default function Index() {
  const [searchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState("");
  const [featuredBooks, setFeaturedBooks] = useState<DisplayBook[]>([]);
  const [searchResults, setSearchResults] = useState<DisplayBook[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalResults, setTotalResults] = useState(0);
  const [loading, setLoading] = useState(false);
  const [featuredLoading, setFeaturedLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hasSearched, setHasSearched] = useState(false);

  const booksPerPage = 20;

  // Load featured books on component mount and handle URL search params
  useEffect(() => {
    loadFeaturedBooks();

    // Check for search query in URL parameters
    const urlQuery = searchParams.get('q');
    if (urlQuery) {
      setSearchQuery(urlQuery);
      performSearch(urlQuery);
    }
  }, [searchParams]);

  const loadFeaturedBooks = async () => {
    try {
      setFeaturedLoading(true);
      setError(null);
      
      // Load trending/popular books for featured section
      const response = await getTrendingBooks(8);
      const transformedBooks = response.docs.map(transformBookForDisplay);
      setFeaturedBooks(transformedBooks);
    } catch (err) {
      console.error('Error loading featured books:', err);
      setError('Failed to load featured books. Please try again later.');
    } finally {
      setFeaturedLoading(false);
    }
  };

  const performSearch = async (query: string) => {
    if (!query.trim()) {
      setError('Please enter a search term');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      setHasSearched(true);
      setCurrentPage(1);

      const offset = 0;
      const response = await searchBooks(query.trim(), booksPerPage, offset);

      if (response.numFound === 0) {
        setSearchResults([]);
        setTotalResults(0);
        setError(`No books found for "${query}". Try different keywords or check your spelling.`);
        return;
      }

      const transformedBooks = response.docs.map(transformBookForDisplay);
      setSearchResults(transformedBooks);
      setTotalResults(response.numFound);
    } catch (err) {
      console.error('Search error:', err);
      setError(err instanceof Error ? err.message : 'Search failed. Please try again.');
      setSearchResults([]);
      setTotalResults(0);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    await performSearch(searchQuery);
  };

  const handlePageChange = async (newPage: number) => {
    if (!searchQuery.trim() || newPage < 1) return;

    try {
      setLoading(true);
      setError(null);

      const offset = (newPage - 1) * booksPerPage;
      const response = await searchBooks(searchQuery.trim(), booksPerPage, offset);
      
      const transformedBooks = response.docs.map(transformBookForDisplay);
      setSearchResults(transformedBooks);
      setCurrentPage(newPage);
    } catch (err) {
      console.error('Pagination error:', err);
      setError(err instanceof Error ? err.message : 'Failed to load more results.');
    } finally {
      setLoading(false);
    }
  };

  const totalPages = Math.ceil(totalResults / booksPerPage);
  const showPagination = hasSearched && totalResults > booksPerPage;

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      
      <main className="flex-1">
        {/* Hero Search Section */}
        <section className="bg-white py-16 px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-8">
              Find Your Next Read
            </h1>
            
            <form onSubmit={handleSearch} className="max-w-2xl mx-auto">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1 relative">
                  <Input
                    type="text"
                    placeholder="Search by title, author, or genre..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full h-12 px-4 text-base border-gray-300 rounded-md focus:border-primary focus:ring-primary"
                    disabled={loading}
                  />
                </div>
                <Button 
                  type="submit"
                  className="h-12 px-8 bg-primary hover:bg-primary/90 text-white font-medium"
                  disabled={loading || !searchQuery.trim()}
                >
                  {loading ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Searching...
                    </>
                  ) : (
                    <>
                      <Search className="h-4 w-4 mr-2" />
                      Search
                    </>
                  )}
                </Button>
              </div>
            </form>

            {/* Search Results Summary */}
            {hasSearched && !loading && (
              <div className="mt-6 text-sm text-gray-600">
                {totalResults > 0 ? (
                  <p>Found {totalResults.toLocaleString()} books for "{searchQuery}"</p>
                ) : error ? null : (
                  <p>No results found</p>
                )}
              </div>
            )}
          </div>
        </section>

        {/* Error Alert */}
        {error && (
          <section className="px-4 pb-8">
            <div className="max-w-7xl mx-auto">
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            </div>
          </section>
        )}

        {/* Search Results Section */}
        {hasSearched && searchResults.length > 0 && (
          <section className="py-16 px-4">
            <div className="max-w-7xl mx-auto">
              <h2 className="text-3xl font-bold text-gray-900 mb-8">
                Search Results
              </h2>
              
              {loading ? (
                <div className="flex justify-center items-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  <span className="ml-2 text-gray-600">Loading books...</span>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {searchResults.map((book) => (
                    <BookCard
                      key={book.id}
                      id={book.id.replace('/works/', '')}
                      title={book.title}
                      author={book.author}
                      coverImage={book.coverImage}
                      status={book.status}
                      publishYear={book.publishYear}
                      subjects={book.subjects}
                    />
                  ))}
                </div>
              )}

              {/* Search Results Pagination */}
              {showPagination && !loading && (
                <div className="flex justify-center items-center space-x-4 mt-12">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="flex items-center"
                  >
                    <ChevronLeft className="h-4 w-4 mr-1" />
                    Previous
                  </Button>
                  
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-600">
                      Page {currentPage} of {totalPages}
                    </span>
                  </div>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage >= totalPages}
                    className="flex items-center"
                  >
                    Next
                    <ChevronRight className="h-4 w-4 ml-1" />
                  </Button>
                </div>
              )}
            </div>
          </section>
        )}

        {/* Featured Books Section (shown when no search or at start) */}
        {!hasSearched && (
          <section className="py-16 px-4">
            <div className="max-w-7xl mx-auto">
              <h2 className="text-3xl font-bold text-gray-900 mb-8">
                Featured Books
              </h2>
              
              {featuredLoading ? (
                <div className="flex justify-center items-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  <span className="ml-2 text-gray-600">Loading featured books...</span>
                </div>
              ) : featuredBooks.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {featuredBooks.map((book) => (
                    <BookCard
                      key={book.id}
                      id={book.id.replace('/works/', '')}
                      title={book.title}
                      author={book.author}
                      coverImage={book.coverImage}
                      status={book.status}
                      publishYear={book.publishYear}
                      subjects={book.subjects}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <p className="text-gray-600">No featured books available at the moment.</p>
                  <Button 
                    onClick={loadFeaturedBooks}
                    variant="outline"
                    className="mt-4"
                  >
                    Try Again
                  </Button>
                </div>
              )}
            </div>
          </section>
        )}
      </main>

      <Footer />
    </div>
  );
}
