import { useState, useEffect } from "react";
import { BookOpen, Clock, CheckCircle, Calendar, ArrowLeft, Filter } from "lucide-react";
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAuth } from "@/contexts/AuthContext";

interface BorrowedBook {
  id: string;
  title: string;
  author: string;
  coverUrl: string;
  borrowDate: string;
  dueDate: string;
  returnDate?: string;
  status: 'borrowed' | 'returned' | 'overdue';
  renewCount: number;
  maxRenewals: number;
}

export default function MyBooks() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('dueDate');

  // Mock borrowed books data
  const [borrowedBooks] = useState<BorrowedBook[]>([
    {
      id: '1',
      title: 'The Midnight Library',
      author: 'Matt Haig',
      coverUrl: '/placeholder.svg',
      borrowDate: '2024-01-15',
      dueDate: '2024-02-15',
      status: 'borrowed',
      renewCount: 1,
      maxRenewals: 2
    },
    {
      id: '2',
      title: 'Atomic Habits',
      author: 'James Clear',
      coverUrl: '/placeholder.svg',
      borrowDate: '2024-01-10',
      dueDate: '2024-02-10',
      status: 'borrowed',
      renewCount: 0,
      maxRenewals: 2
    },
    {
      id: '3',
      title: 'The Seven Husbands of Evelyn Hugo',
      author: 'Taylor Jenkins Reid',
      coverUrl: '/placeholder.svg',
      borrowDate: '2023-12-01',
      dueDate: '2024-01-01',
      returnDate: '2023-12-28',
      status: 'returned',
      renewCount: 0,
      maxRenewals: 2
    },
    {
      id: '4',
      title: 'Project Hail Mary',
      author: 'Andy Weir',
      coverUrl: '/placeholder.svg',
      borrowDate: '2023-11-15',
      dueDate: '2023-12-15',
      returnDate: '2023-12-14',
      status: 'returned',
      renewCount: 1,
      maxRenewals: 2
    },
    {
      id: '5',
      title: 'Dune',
      author: 'Frank Herbert',
      coverUrl: '/placeholder.svg',
      borrowDate: '2024-01-01',
      dueDate: '2024-01-25',
      status: 'overdue',
      renewCount: 2,
      maxRenewals: 2
    }
  ]);

  useEffect(() => {
    // Simulate loading
    setTimeout(() => setLoading(false), 1000);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'borrowed':
        return 'bg-blue-100 text-blue-800';
      case 'returned':
        return 'bg-green-100 text-green-800';
      case 'overdue':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'borrowed':
        return <BookOpen className="h-4 w-4" />;
      case 'returned':
        return <CheckCircle className="h-4 w-4" />;
      case 'overdue':
        return <Clock className="h-4 w-4" />;
      default:
        return <BookOpen className="h-4 w-4" />;
    }
  };

  const getDaysUntilDue = (dueDate: string) => {
    const due = new Date(dueDate);
    const today = new Date();
    const diffTime = due.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const filteredBooks = borrowedBooks.filter(book => {
    if (filterStatus === 'all') return true;
    return book.status === filterStatus;
  });

  const sortedBooks = [...filteredBooks].sort((a, b) => {
    switch (sortBy) {
      case 'dueDate':
        return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
      case 'borrowDate':
        return new Date(b.borrowDate).getTime() - new Date(a.borrowDate).getTime();
      case 'title':
        return a.title.localeCompare(b.title);
      default:
        return 0;
    }
  });

  const currentBooks = sortedBooks.filter(book => book.status === 'borrowed' || book.status === 'overdue');
  const pastBooks = sortedBooks.filter(book => book.status === 'returned');

  const handleRenewBook = async (bookId: string) => {
    // Mock renewal logic
    console.log('Renewing book:', bookId);
    alert('Book renewal request submitted!');
  };

  const handleReturnBook = async (bookId: string) => {
    // Mock return logic
    console.log('Returning book:', bookId);
    alert('Book return processed!');
  };

  if (!user) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <p>Please log in to view your books.</p>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      
      <main className="flex-1 px-4 py-8">
        <div className="max-w-6xl mx-auto space-y-8">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">My Books</h1>
              <p className="text-gray-600">Manage your borrowed books and reading history</p>
            </div>
            <Link to="/profile">
              <Button variant="outline">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Profile
              </Button>
            </Link>
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <BookOpen className="h-8 w-8 text-blue-600" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Currently Borrowed</p>
                    <p className="text-2xl font-bold">{currentBooks.length}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <Clock className="h-8 w-8 text-orange-600" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Overdue</p>
                    <p className="text-2xl font-bold text-red-600">
                      {borrowedBooks.filter(b => b.status === 'overdue').length}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <CheckCircle className="h-8 w-8 text-green-600" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Books Read</p>
                    <p className="text-2xl font-bold">{pastBooks.length}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <Calendar className="h-8 w-8 text-purple-600" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Total Borrowed</p>
                    <p className="text-2xl font-bold">{borrowedBooks.length}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex items-center space-x-2">
              <Filter className="h-4 w-4 text-gray-500" />
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Books</SelectItem>
                  <SelectItem value="borrowed">Currently Borrowed</SelectItem>
                  <SelectItem value="overdue">Overdue</SelectItem>
                  <SelectItem value="returned">Returned</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="dueDate">Due Date</SelectItem>
                <SelectItem value="borrowDate">Borrow Date</SelectItem>
                <SelectItem value="title">Title</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Books Tabs */}
          <Tabs defaultValue="current" className="space-y-6">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="current">Current Books ({currentBooks.length})</TabsTrigger>
              <TabsTrigger value="history">Reading History ({pastBooks.length})</TabsTrigger>
            </TabsList>
            
            <TabsContent value="current" className="space-y-6">
              {currentBooks.length === 0 ? (
                <Card>
                  <CardContent className="text-center py-12">
                    <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No current books</h3>
                    <p className="text-gray-600 mb-4">You don't have any books currently borrowed.</p>
                    <Link to="/">
                      <Button>Browse Library</Button>
                    </Link>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {currentBooks.map((book) => (
                    <Card key={book.id}>
                      <CardContent className="p-6">
                        <div className="flex space-x-4">
                          <img
                            src={book.coverUrl}
                            alt={book.title}
                            className="w-16 h-20 object-cover rounded"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.src = "/placeholder.svg";
                            }}
                          />
                          <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-gray-900 truncate">{book.title}</h3>
                            <p className="text-sm text-gray-600 mb-2">{book.author}</p>
                            <Badge className={`${getStatusColor(book.status)} mb-2`}>
                              {getStatusIcon(book.status)}
                              <span className="ml-1">{book.status}</span>
                            </Badge>
                            <div className="text-xs text-gray-500 space-y-1">
                              <p>Due: {formatDate(book.dueDate)}</p>
                              {book.status === 'borrowed' && (
                                <p className={`${getDaysUntilDue(book.dueDate) < 0 ? 'text-red-600' : getDaysUntilDue(book.dueDate) <= 3 ? 'text-orange-600' : ''}`}>
                                  {getDaysUntilDue(book.dueDate) < 0 
                                    ? `${Math.abs(getDaysUntilDue(book.dueDate))} days overdue`
                                    : `${getDaysUntilDue(book.dueDate)} days left`
                                  }
                                </p>
                              )}
                              <p>Renewals: {book.renewCount}/{book.maxRenewals}</p>
                            </div>
                          </div>
                        </div>
                        <div className="mt-4 flex space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleReturnBook(book.id)}
                            className="flex-1"
                          >
                            Return Book
                          </Button>
                          {book.renewCount < book.maxRenewals && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleRenewBook(book.id)}
                              className="flex-1"
                            >
                              Renew
                            </Button>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="history" className="space-y-6">
              {pastBooks.length === 0 ? (
                <Card>
                  <CardContent className="text-center py-12">
                    <CheckCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No reading history</h3>
                    <p className="text-gray-600">Your reading history will appear here after you return books.</p>
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-4">
                  {pastBooks.map((book) => (
                    <Card key={book.id}>
                      <CardContent className="p-6">
                        <div className="flex items-center space-x-4">
                          <img
                            src={book.coverUrl}
                            alt={book.title}
                            className="w-12 h-16 object-cover rounded"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.src = "/placeholder.svg";
                            }}
                          />
                          <div className="flex-1">
                            <h3 className="font-semibold text-gray-900">{book.title}</h3>
                            <p className="text-sm text-gray-600">{book.author}</p>
                            <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500">
                              <span>Borrowed: {formatDate(book.borrowDate)}</span>
                              <span>Returned: {book.returnDate ? formatDate(book.returnDate) : 'N/A'}</span>
                              <Badge className={getStatusColor(book.status)}>
                                {getStatusIcon(book.status)}
                                <span className="ml-1">Returned</span>
                              </Badge>
                            </div>
                          </div>
                          <Link to={`/book/${book.id}`}>
                            <Button variant="outline" size="sm">
                              View Details
                            </Button>
                          </Link>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </main>

      <Footer />
    </div>
  );
}
