// Open Library API Types
export interface OpenLibraryBook {
  key: string;
  title: string;
  author_name?: string[];
  first_publish_year?: number;
  publisher?: string[];
  isbn?: string[];
  cover_i?: number;
  subject?: string[];
  number_of_pages_median?: number;
  first_sentence?: string[];
  edition_count?: number;
  publish_date?: string[];
  language?: string[];
}

export interface OpenLibrarySearchResponse {
  numFound: number;
  start: number;
  numFoundExact: boolean;
  docs: OpenLibraryBook[];
}

export interface BookDetail {
  key: string;
  title: string;
  subtitle?: string;
  authors: string[];
  description?: string;
  subjects?: string[];
  publishDate?: string;
  publishers?: string[];
  isbn?: string;
  numberOfPages?: number;
  coverUrl?: string;
  firstSentence?: string;
  language?: string[];
}

export interface OpenLibraryBookDetails {
  description?: string | { value: string };
  title: string;
  subtitle?: string;
  authors?: Array<{ name: string }>;
  subjects?: string[];
  publish_date?: string;
  publishers?: string[];
  isbn_10?: string[];
  isbn_13?: string[];
  number_of_pages?: number;
  covers?: number[];
  first_sentence?: string | { value: string };
  languages?: Array<{ key: string }>;
}

// API Base URLs
const SEARCH_BASE_URL = 'https://openlibrary.org/search.json';
const BOOKS_BASE_URL = 'https://openlibrary.org';
const COVERS_BASE_URL = 'https://covers.openlibrary.org/b';

// Helper function to get cover URL
export const getCoverUrl = (coverId: number | undefined, size: 'S' | 'M' | 'L' = 'M'): string => {
  if (!coverId) return '/placeholder.svg';
  return `${COVERS_BASE_URL}/id/${coverId}-${size}.jpg`;
};

// Helper function to extract description text
const extractDescription = (description: string | { value: string } | undefined): string => {
  if (!description) return '';
  if (typeof description === 'string') return description;
  return description.value || '';
};

// Helper function to extract first sentence
const extractFirstSentence = (sentence: string | { value: string } | undefined): string => {
  if (!sentence) return '';
  if (typeof sentence === 'string') return sentence;
  return sentence.value || '';
};

// Search for books by query (title, author, or general search)
export const searchBooks = async (
  query: string,
  limit: number = 20,
  offset: number = 0
): Promise<OpenLibrarySearchResponse> => {
  try {
    const params = new URLSearchParams({
      q: query,
      limit: limit.toString(),
      offset: offset.toString(),
      fields: 'key,title,author_name,first_publish_year,publisher,isbn,cover_i,subject,number_of_pages_median,first_sentence,edition_count'
    });

    const response = await fetch(`${SEARCH_BASE_URL}?${params}`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data: OpenLibrarySearchResponse = await response.json();
    return data;
  } catch (error) {
    console.error('Error searching books:', error);
    throw new Error('Failed to search books. Please check your internet connection and try again.');
  }
};

// Search books by specific field
export const searchBooksByTitle = async (title: string, limit: number = 20): Promise<OpenLibrarySearchResponse> => {
  return searchBooks(`title:${title}`, limit);
};

export const searchBooksByAuthor = async (author: string, limit: number = 20): Promise<OpenLibrarySearchResponse> => {
  return searchBooks(`author:${author}`, limit);
};

export const searchBooksBySubject = async (subject: string, limit: number = 20): Promise<OpenLibrarySearchResponse> => {
  return searchBooks(`subject:${subject}`, limit);
};

// Get detailed book information by key
export const getBookDetails = async (bookKey: string): Promise<BookDetail | null> => {
  try {
    // Remove '/works/' prefix if present
    const cleanKey = bookKey.replace('/works/', '');
    
    const response = await fetch(`${BOOKS_BASE_URL}/works/${cleanKey}.json`);
    
    if (!response.ok) {
      if (response.status === 404) {
        throw new Error('Book not found');
      }
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data: OpenLibraryBookDetails = await response.json();
    
    // Transform the API response to our BookDetail interface
    const bookDetail: BookDetail = {
      key: bookKey,
      title: data.title,
      subtitle: data.subtitle,
      authors: data.authors?.map(author => author.name) || [],
      description: extractDescription(data.description),
      subjects: data.subjects?.slice(0, 10) || [], // Limit subjects to prevent UI overflow
      publishDate: data.publish_date,
      publishers: data.publishers,
      isbn: data.isbn_13?.[0] || data.isbn_10?.[0],
      numberOfPages: data.number_of_pages,
      coverUrl: data.covers?.[0] ? getCoverUrl(data.covers[0], 'L') : '/placeholder.svg',
      firstSentence: extractFirstSentence(data.first_sentence),
      language: data.languages?.map(lang => lang.key.replace('/languages/', '')) || []
    };
    
    return bookDetail;
  } catch (error) {
    console.error('Error fetching book details:', error);
    throw new Error('Failed to load book details. Please try again.');
  }
};

// Get book details by ISBN
export const getBookByISBN = async (isbn: string): Promise<BookDetail | null> => {
  try {
    const response = await fetch(`https://openlibrary.org/api/books?bibkeys=ISBN:${isbn}&format=json&jscmd=data`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    const bookData = data[`ISBN:${isbn}`];
    
    if (!bookData) {
      return null;
    }
    
    const bookDetail: BookDetail = {
      key: bookData.key || isbn,
      title: bookData.title || '',
      authors: bookData.authors?.map((author: any) => author.name) || [],
      description: bookData.description || '',
      subjects: bookData.subjects?.map((subject: any) => subject.name) || [],
      publishDate: bookData.publish_date,
      publishers: bookData.publishers?.map((pub: any) => pub.name) || [],
      isbn: isbn,
      numberOfPages: bookData.number_of_pages,
      coverUrl: bookData.cover ? bookData.cover.large || bookData.cover.medium || bookData.cover.small : '/placeholder.svg'
    };
    
    return bookDetail;
  } catch (error) {
    console.error('Error fetching book by ISBN:', error);
    throw new Error('Failed to load book by ISBN. Please try again.');
  }
};

// Transform OpenLibraryBook to simplified format for display
export const transformBookForDisplay = (book: OpenLibraryBook): {
  id: string;
  title: string;
  author: string;
  coverImage: string;
  status: "In Stock" | "On Loan" | "Reserved";
  publishYear?: number;
  subjects?: string[];
} => {
  return {
    id: book.key,
    title: book.title,
    author: book.author_name?.[0] || 'Unknown Author',
    coverImage: getCoverUrl(book.cover_i),
    status: "In Stock", // Default status since Open Library doesn't provide this
    publishYear: book.first_publish_year,
    subjects: book.subject?.slice(0, 3) // Limit to 3 subjects for display
  };
};

// Get popular/trending books (using a curated search)
export const getTrendingBooks = async (limit: number = 20): Promise<OpenLibrarySearchResponse> => {
  // Search for popular books using a mix of criteria
  return searchBooks('subject:fiction OR subject:bestseller', limit);
};

// Get books by genre/subject
export const getBooksByGenre = async (genre: string, limit: number = 20): Promise<OpenLibrarySearchResponse> => {
  return searchBooks(`subject:${genre.toLowerCase()}`, limit);
};
