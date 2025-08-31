import { useState, useEffect } from "react";
import { 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  BookOpen, 
  ArrowLeft,
  Filter,
  MoreHorizontal
} from "lucide-react";
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useAuth } from "@/contexts/AuthContext";

interface ManagedBook {
  id: string;
  title: string;
  author: string;
  isbn: string;
  genre: string;
  publisher: string;
  publishYear: number;
  totalCopies: number;
  availableCopies: number;
  description: string;
  coverUrl: string;
  status: 'active' | 'inactive';
}

export default function ManageBooks() {
  const { user, isAdmin } = useAuth();
  const [books, setBooks] = useState<ManagedBook[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterGenre, setFilterGenre] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingBook, setEditingBook] = useState<ManagedBook | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    author: "",
    isbn: "",
    genre: "",
    publisher: "",
    publishYear: new Date().getFullYear(),
    totalCopies: 1,
    description: "",
    coverUrl: ""
  });
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Mock books data
  useEffect(() => {
    const mockBooks: ManagedBook[] = [
      {
        id: '1',
        title: 'The Midnight Library',
        author: 'Matt Haig',
        isbn: '978-0525559474',
        genre: 'Fiction',
        publisher: 'Viking',
        publishYear: 2020,
        totalCopies: 5,
        availableCopies: 2,
        description: 'Between life and death there is a library...',
        coverUrl: '/placeholder.svg',
        status: 'active'
      },
      {
        id: '2',
        title: 'Atomic Habits',
        author: 'James Clear',
        isbn: '978-0735211292',
        genre: 'Self-Help',
        publisher: 'Avery',
        publishYear: 2018,
        totalCopies: 8,
        availableCopies: 3,
        description: 'An Easy & Proven Way to Build Good Habits & Break Bad Ones',
        coverUrl: '/placeholder.svg',
        status: 'active'
      },
      {
        id: '3',
        title: 'Dune',
        author: 'Frank Herbert',
        isbn: '978-0441172719',
        genre: 'Science Fiction',
        publisher: 'Ace',
        publishYear: 1965,
        totalCopies: 3,
        availableCopies: 0,
        description: 'A science fiction masterpiece...',
        coverUrl: '/placeholder.svg',
        status: 'active'
      }
    ];
    
    setBooks(mockBooks);
    setLoading(false);
  }, []);

  if (!user || !isAdmin) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Access Denied</h2>
            <p className="text-gray-600">You need administrator privileges to access this page.</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const genres = ['Fiction', 'Non-Fiction', 'Science Fiction', 'Mystery', 'Romance', 'Biography', 'History', 'Self-Help'];

  const filteredBooks = books.filter(book => {
    const matchesSearch = book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         book.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         book.isbn.includes(searchQuery);
    const matchesGenre = filterGenre === 'all' || book.genre === filterGenre;
    const matchesStatus = filterStatus === 'all' || book.status === filterStatus;
    
    return matchesSearch && matchesGenre && matchesStatus;
  });

  const resetForm = () => {
    setFormData({
      title: "",
      author: "",
      isbn: "",
      genre: "",
      publisher: "",
      publishYear: new Date().getFullYear(),
      totalCopies: 1,
      description: "",
      coverUrl: ""
    });
  };

  const handleAddBook = async () => {
    try {
      // Validate form
      if (!formData.title || !formData.author || !formData.isbn) {
        setMessage({ type: 'error', text: 'Please fill in all required fields' });
        return;
      }

      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      const newBook: ManagedBook = {
        id: `book_${Date.now()}`,
        ...formData,
        availableCopies: formData.totalCopies,
        status: 'active'
      };

      setBooks(prev => [...prev, newBook]);
      setMessage({ type: 'success', text: 'Book added successfully!' });
      setIsAddDialogOpen(false);
      resetForm();
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to add book. Please try again.' });
    }
  };

  const handleEditBook = async () => {
    if (!editingBook) return;

    try {
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      setBooks(prev => prev.map(book => 
        book.id === editingBook.id 
          ? { ...editingBook, ...formData, availableCopies: Math.min(formData.totalCopies, editingBook.availableCopies) }
          : book
      ));

      setMessage({ type: 'success', text: 'Book updated successfully!' });
      setEditingBook(null);
      resetForm();
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to update book. Please try again.' });
    }
  };

  const handleDeleteBook = async (bookId: string) => {
    if (!confirm('Are you sure you want to delete this book?')) return;

    try {
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 500));

      setBooks(prev => prev.filter(book => book.id !== bookId));
      setMessage({ type: 'success', text: 'Book deleted successfully!' });
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to delete book. Please try again.' });
    }
  };

  const startEdit = (book: ManagedBook) => {
    setEditingBook(book);
    setFormData({
      title: book.title,
      author: book.author,
      isbn: book.isbn,
      genre: book.genre,
      publisher: book.publisher,
      publishYear: book.publishYear,
      totalCopies: book.totalCopies,
      description: book.description,
      coverUrl: book.coverUrl
    });
  };

  const BookForm = ({ isEditing = false }: { isEditing?: boolean }) => (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="title">Title *</Label>
          <Input
            id="title"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            placeholder="Book title"
          />
        </div>
        <div>
          <Label htmlFor="author">Author *</Label>
          <Input
            id="author"
            value={formData.author}
            onChange={(e) => setFormData({ ...formData, author: e.target.value })}
            placeholder="Author name"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="isbn">ISBN *</Label>
          <Input
            id="isbn"
            value={formData.isbn}
            onChange={(e) => setFormData({ ...formData, isbn: e.target.value })}
            placeholder="978-0000000000"
          />
        </div>
        <div>
          <Label htmlFor="genre">Genre</Label>
          <Select value={formData.genre} onValueChange={(value) => setFormData({ ...formData, genre: value })}>
            <SelectTrigger>
              <SelectValue placeholder="Select genre" />
            </SelectTrigger>
            <SelectContent>
              {genres.map(genre => (
                <SelectItem key={genre} value={genre}>{genre}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="publisher">Publisher</Label>
          <Input
            id="publisher"
            value={formData.publisher}
            onChange={(e) => setFormData({ ...formData, publisher: e.target.value })}
            placeholder="Publisher name"
          />
        </div>
        <div>
          <Label htmlFor="publishYear">Publish Year</Label>
          <Input
            id="publishYear"
            type="number"
            value={formData.publishYear}
            onChange={(e) => setFormData({ ...formData, publishYear: parseInt(e.target.value) })}
            min="1800"
            max={new Date().getFullYear()}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="totalCopies">Total Copies</Label>
          <Input
            id="totalCopies"
            type="number"
            value={formData.totalCopies}
            onChange={(e) => setFormData({ ...formData, totalCopies: parseInt(e.target.value) })}
            min="1"
          />
        </div>
        <div>
          <Label htmlFor="coverUrl">Cover URL</Label>
          <Input
            id="coverUrl"
            value={formData.coverUrl}
            onChange={(e) => setFormData({ ...formData, coverUrl: e.target.value })}
            placeholder="https://..."
          />
        </div>
      </div>

      <div>
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          placeholder="Book description..."
          rows={3}
        />
      </div>
    </div>
  );

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      
      <main className="flex-1 px-4 py-8">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <Link to="/admin" className="inline-flex items-center text-primary hover:text-primary/80 mb-2">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Link>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Manage Books</h1>
              <p className="text-gray-600">Add, edit, and manage your library collection</p>
            </div>
            
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button onClick={() => { resetForm(); setIsAddDialogOpen(true); }}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Book
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Add New Book</DialogTitle>
                  <DialogDescription>
                    Enter the details for the new book to add to your library collection.
                  </DialogDescription>
                </DialogHeader>
                <BookForm />
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleAddBook}>Add Book</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>

          {/* Success/Error Messages */}
          {message && (
            <Alert variant={message.type === 'error' ? 'destructive' : 'default'}>
              <AlertDescription>{message.text}</AlertDescription>
            </Alert>
          )}

          {/* Filters and Search */}
          <Card>
            <CardContent className="p-6">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Search by title, author, or ISBN..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <div className="flex space-x-2">
                  <Select value={filterGenre} onValueChange={setFilterGenre}>
                    <SelectTrigger className="w-[150px]">
                      <SelectValue placeholder="All Genres" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Genres</SelectItem>
                      {genres.map(genre => (
                        <SelectItem key={genre} value={genre}>{genre}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  
                  <Select value={filterStatus} onValueChange={setFilterStatus}>
                    <SelectTrigger className="w-[120px]">
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Books List */}
          <Card>
            <CardHeader>
              <CardTitle>Books Collection ({filteredBooks.length})</CardTitle>
              <CardDescription>
                Manage your library's book collection
              </CardDescription>
            </CardHeader>
            <CardContent>
              {filteredBooks.length === 0 ? (
                <div className="text-center py-12">
                  <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No books found</h3>
                  <p className="text-gray-600 mb-4">
                    {searchQuery || filterGenre !== 'all' || filterStatus !== 'all' 
                      ? 'Try adjusting your search or filters.'
                      : 'Start by adding your first book to the collection.'
                    }
                  </p>
                  {!(searchQuery || filterGenre !== 'all' || filterStatus !== 'all') && (
                    <Button onClick={() => setIsAddDialogOpen(true)}>
                      <Plus className="h-4 w-4 mr-2" />
                      Add First Book
                    </Button>
                  )}
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredBooks.map((book) => (
                    <div key={book.id} className="flex items-center space-x-4 p-4 border rounded-lg">
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
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="font-semibold text-gray-900">{book.title}</h3>
                            <p className="text-sm text-gray-600">{book.author}</p>
                            <div className="flex items-center space-x-4 mt-2">
                              <span className="text-xs text-gray-500">ISBN: {book.isbn}</span>
                              <Badge variant="outline">{book.genre}</Badge>
                              <Badge variant={book.status === 'active' ? 'default' : 'secondary'}>
                                {book.status}
                              </Badge>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-medium">
                              {book.availableCopies}/{book.totalCopies} available
                            </p>
                            <p className="text-xs text-gray-500">Year: {book.publishYear}</p>
                          </div>
                        </div>
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => startEdit(book)}>
                            <Edit className="h-4 w-4 mr-2" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            onClick={() => handleDeleteBook(book.id)}
                            className="text-red-600"
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Edit Dialog */}
          <Dialog open={!!editingBook} onOpenChange={(open) => !open && setEditingBook(null)}>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Edit Book</DialogTitle>
                <DialogDescription>
                  Update the details for "{editingBook?.title}".
                </DialogDescription>
              </DialogHeader>
              <BookForm isEditing />
              <DialogFooter>
                <Button variant="outline" onClick={() => setEditingBook(null)}>
                  Cancel
                </Button>
                <Button onClick={handleEditBook}>Save Changes</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </main>

      <Footer />
    </div>
  );
}
