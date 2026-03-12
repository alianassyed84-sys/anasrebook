// Get book cover URL from ISBN using Open Library
export function getBookCoverUrl(isbn: string, size: "S" | "M" | "L" = "M"): string {
  if (!isbn) return "";
  return `https://covers.openlibrary.org/b/isbn/${isbn}-${size}.jpg`;
}

// Fetch book data + cover from Google Books API (no key needed for basic use)
export async function fetchBookByTitle(title: string, author: string) {
  const query = encodeURIComponent(`${title} ${author}`);
  const url = `https://www.googleapis.com/books/v1/volumes?q=${query}&maxResults=1`;

  try {
    const res = await fetch(url);
    const data = await res.json();
    const book = data.items?.[0]?.volumeInfo;

    if (!book) return null;

    return {
      title: book.title,
      author: book.authors?.[0] || author,
      isbn: book.industryIdentifiers?.find((id: any) => id.type === "ISBN_13")?.identifier ||
            book.industryIdentifiers?.find((id: any) => id.type === "ISBN_10")?.identifier,
      coverUrl: book.imageLinks?.thumbnail?.replace("http://", "https://"),
      publisher: book.publisher,
      description: book.description,
    };
  } catch {
    return null;
  }
}
