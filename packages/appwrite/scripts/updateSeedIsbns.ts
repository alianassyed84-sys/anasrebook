import { BOOKS } from "./data";
import fs from "fs";

async function fetchBookByTitle(title: string, author?: string) {
  try {
    const query = encodeURIComponent(`intitle:${title}${author ? `+inauthor:${author}` : ""}`);
    const res = await fetch(`https://www.googleapis.com/books/v1/volumes?q=${query}&maxResults=1`);
    if (!res.ok) return null;
    
    const data = await res.json();
    if (!data.items || data.items.length === 0) return null;
    
    const bookInfo = data.items[0].volumeInfo;
    
    // Get ISBN (prefer ISBN_13)
    let isbn = null;
    if (bookInfo.industryIdentifiers) {
      const isbn13 = bookInfo.industryIdentifiers.find((id: any) => id.type === "ISBN_13");
      const isbn10 = bookInfo.industryIdentifiers.find((id: any) => id.type === "ISBN_10");
      if (isbn13) isbn = isbn13.identifier;
      else if (isbn10) isbn = isbn10.identifier;
    }
    
    // Get cover image (highest resolution available) // replace http with https
    let coverUrl = null;
    if (bookInfo.imageLinks) {
       coverUrl = bookInfo.imageLinks.thumbnail || bookInfo.imageLinks.smallThumbnail;
       if (coverUrl) coverUrl = coverUrl.replace("http:", "https:");
    }
    
    return {
      title: bookInfo.title,
      authors: bookInfo.authors || [],
      isbn,
      coverUrl
    };
  } catch (err) {
    console.error(`Error fetching: ${title}`, err);
    return null;
  }
}

async function main() {
  const updatedBooks = [];
  for (const book of BOOKS) {
    console.log(`Fetching data for: ${book.title}...`);
    const fetched = await fetchBookByTitle(book.title, book.author);
    if (fetched) {
      updatedBooks.push({
        ...book,
        isbn: fetched.isbn || "9780000000000",
        coverUrl: fetched.coverUrl || ""
      });
      console.log(`  Found: ISBN ${fetched.isbn}, Cover: ${fetched.coverUrl ? "Yes" : "No"}`);
    } else {
      updatedBooks.push(book);
      console.log(`  Not found.`);
    }
    await new Promise(r => setTimeout(r, 1000)); // be nice to API
  }
  
  fs.writeFileSync("books_updated.json", JSON.stringify(updatedBooks, null, 2));
  console.log("Written to books_updated.json");
}

main();
