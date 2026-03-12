import { databases, Query } from "./client";
import { APPWRITE_DB_ID, COLLECTIONS } from "./config";
import type { Book } from "@rebookindia/types";

export const bookActions = {
  createBook: async (bookData: Omit<Book, "createdAt" | "updatedAt">) => {
    return await databases.createDocument(
      APPWRITE_DB_ID,
      COLLECTIONS.BOOKS,
      bookData.bookId,
      {
        ...bookData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }
    );
  },
  getBookById: async (bookId: string): Promise<Book> => {
    return (await databases.getDocument(
      APPWRITE_DB_ID,
      COLLECTIONS.BOOKS,
      bookId
    )) as unknown as Book;
  },
  getAllBooks: async (filters: string[] = [], search?: string, sort?: string, limit: number = 100): Promise<Book[]> => {
    const queryList = [...filters];
    
    if (search) queryList.push(Query.search("title", search));
    if (sort) {
      if (sort === "price_asc") queryList.push(Query.orderAsc("sellingPrice"));
      if (sort === "price_desc") queryList.push(Query.orderDesc("sellingPrice"));
      if (sort === "newest") queryList.push(Query.orderDesc("createdAt"));
      if (sort === "title_asc") queryList.push(Query.orderAsc("title"));
    } else {
        // Default to A-Z as requested by user
        queryList.push(Query.orderAsc("title"));
    }

    queryList.push(Query.limit(limit));

    const res = await databases.listDocuments(
      APPWRITE_DB_ID,
      COLLECTIONS.BOOKS,
      queryList
    );
    return res.documents as unknown as Book[];
  },
  getBooksByVendor: async (vendorId: string): Promise<Book[]> => {
    return await bookActions.getAllBooks([Query.equal("vendorId", vendorId)]);
  },
  updateBook: async (bookId: string, data: Partial<Book>) => {
    return await databases.updateDocument(
      APPWRITE_DB_ID,
      COLLECTIONS.BOOKS,
      bookId,
      {
        ...data,
        updatedAt: new Date().toISOString()
      }
    );
  },
  deleteBook: async (bookId: string) => {
    return await databases.deleteDocument(
      APPWRITE_DB_ID,
      COLLECTIONS.BOOKS,
      bookId
    );
  },
  getFeaturedBooks: async (): Promise<Book[]> => {
    return await bookActions.getAllBooks([Query.equal("isFeatured", true)]);
  },
  getSponsoredBooks: async (): Promise<Book[]> => {
    return await bookActions.getAllBooks([Query.equal("isSponsored", true)]);
  },
  searchBooks: async (searchQuery: string, filters: string[] = []): Promise<Book[]> => {
    return await bookActions.getAllBooks(filters, searchQuery);
  },
  updateBookQuantity: async (bookId: string, quantityChange: number) => {
      // In a real scenario, consider atomic operations or fetch-then-update
      const book = await bookActions.getBookById(bookId);
      const newQty = Math.max(0, (book.quantity || 0) + quantityChange);
      return await bookActions.updateBook(bookId, { 
          quantity: newQty,
          isAvailable: newQty > 0 
      });
  }
};
