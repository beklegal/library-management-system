export interface Book {
  id: string;
  title: string;
  author: string;
  coverImage: string;
  status: "In Stock" | "On Loan" | "Reserved";
  genre?: string;
  publisher?: string;
  publishedYear?: number;
  isbn?: string;
  description?: string;
}

export const featuredBooks: Book[] = [
  {
    id: "1",
    title: "The Silent Reader",
    author: "Alice Wonderland",
    coverImage: "/placeholder.svg",
    status: "In Stock",
    genre: "Mystery",
  },
  {
    id: "2",
    title: "Echoes of the Past",
    author: "Bob The Builder",
    coverImage: "/placeholder.svg",
    status: "On Loan",
    genre: "Historical Fiction",
  },
  {
    id: "3",
    title: "The Unseen Path",
    author: "Charlie Chaplin",
    coverImage: "/placeholder.svg",
    status: "In Stock",
    genre: "Adventure",
  },
  {
    id: "4",
    title: "Whispers of Tomorrow",
    author: "Diana Prince",
    coverImage: "/placeholder.svg",
    status: "In Stock",
    genre: "Sci-Fi",
  },
];

export const collectionBooks: Book[] = [
  {
    id: "5",
    title: "The Silent Reader",
    author: "Alice Wonderland",
    coverImage: "/placeholder.svg",
    status: "In Stock",
    genre: "Mystery",
  },
  {
    id: "6",
    title: "Echoes of the Past",
    author: "Bob The Builder",
    coverImage: "/placeholder.svg",
    status: "On Loan",
    genre: "Historical Fiction",
  },
  {
    id: "7",
    title: "The Unseen Path",
    author: "Charlie Chaplin",
    coverImage: "/placeholder.svg",
    status: "In Stock",
    genre: "Adventure",
  },
  {
    id: "8",
    title: "Whispers of Tomorrow",
    author: "Diana Prince",
    coverImage: "/placeholder.svg",
    status: "In Stock",
    genre: "Sci-Fi",
  },
  {
    id: "9",
    title: "Chronicles of the Forgotten",
    author: "Eve Adams",
    coverImage: "/placeholder.svg",
    status: "In Stock",
    genre: "Fantasy",
  },
  {
    id: "10",
    title: "The Midnight Library",
    author: "Frankenstein",
    coverImage: "/placeholder.svg",
    status: "On Loan",
    genre: "Philosophy",
  },
  {
    id: "11",
    title: "Beneath the Willow Tree",
    author: "Grace Hopper",
    coverImage: "/placeholder.svg",
    status: "In Stock",
    genre: "Romance",
  },
  {
    id: "12",
    title: "The Quantum Enigma",
    author: "Harry Potter",
    coverImage: "/placeholder.svg",
    status: "In Stock",
    genre: "Science",
  },
];
