"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { notFound, useRouter, useParams } from 'next/navigation';
import toast from 'react-hot-toast';
import { ShoppingCart, Heart, MessageCircle, Star, MapPin, Package, Check, ChevronRight, ChevronDown } from 'lucide-react';
import { databases, DB_ID, COLLECTIONS, account } from "@/lib/appwrite";

const BookCoverImage = ({ isbn, title, coverUrl, className }: any) => {
    const getImageUrl = (fileId: string) => {
        return `${process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT}/storage/buckets/book-images/files/${fileId}/view?project=${process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID}`;
    };
    const placeholderUrl = `https://images.unsplash.com/photo-1491843384429-30494622eb9d?auto=format&fit=crop&w=800&h=1000&q=80`;
    const imageUrl = isbn ? `https://covers.openlibrary.org/b/isbn/${isbn}-L.jpg` : (coverUrl ? getImageUrl(coverUrl) : placeholderUrl);
    
    return <img src={imageUrl} alt={title} className={className || "w-full max-w-[280px] md:max-w-full mx-auto shadow-2xl rounded-sm"} />;
};

export default function BookDetailPage() {
    const params = useParams();
    const router = useRouter();
    
    const [book, setBook] = useState<any>(null);
    const [vendor, setVendor] = useState<any>(null);
    const [isLoaded, setIsLoaded] = useState(false);
    const [accordionOpen, setAccordionOpen] = useState(false);
    
    const [user, setUser] = useState<any>(null);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    
    const [cartItems, setCartItems] = useState<string[]>([]);
    const [wishlistItems, setWishlistItems] = useState<string[]>([]);

    useEffect(() => {
        const fetchInitial = async () => {
            try {
                const sessionUser = await account.get();
                setUser(sessionUser);
                setIsLoggedIn(true);
            } catch (e) {
                setIsLoggedIn(false);
            }
            
            const cart = JSON.parse(localStorage.getItem("cart") || "[]");
            setCartItems(cart.map((i: any) => i.$id || i.id));
            
            const wl = JSON.parse(localStorage.getItem("wishlist") || "[]");
            setWishlistItems(wl);
        };
        fetchInitial();
    }, []);

    useEffect(() => {
        const id = params?.id as string;
        if (!id) return;
        
        const fetchData = async () => {
            try {
                const bookData = await databases.getDocument(DB_ID, COLLECTIONS.BOOKS, id);
                setBook(bookData);
                
                if (bookData.vendorId) {
                    const vendorData = await databases.getDocument(DB_ID, COLLECTIONS.VENDORS, bookData.vendorId);
                    setVendor(vendorData);
                }
            } catch (err) {
                toast.error("Book not found!");
                router.push("/books");
            } finally {
                setIsLoaded(true);
            }
        };
        
        fetchData();
    }, [params.id, router]);

    const hasItem = (id: string) => cartItems.includes(id);
    const addItem = (b: any) => {
        const cart = JSON.parse(localStorage.getItem("cart") || "[]");
        if (!hasItem(b.$id || b.id)) {
            cart.push(b);
            localStorage.setItem("cart", JSON.stringify(cart));
            setCartItems([...cartItems, b.$id || b.id]);
            window.dispatchEvent(new Event("cartUpdated"));
        }
    };
    
    const hasWishlist = (id: string) => wishlistItems.includes(id);
    const toggleWishlist = (id: string) => {
        let current = [...wishlistItems];
        if (current.includes(id)) {
            current = current.filter(i => i !== id);
        } else {
            current.push(id);
        }
        setWishlistItems(current);
        localStorage.setItem("wishlist", JSON.stringify(current));
    };

    if (!isLoaded) return <div className="min-h-[50vh] flex items-center justify-center">Loading book details...</div>;
    if (!book) return notFound();

    // Map properties from old database to new UI format
    const bookCategory = book.category || book.category_id || "Uncategorized";
    const bookId = book.$id || book.id;
    const coverUrl = book.imageIds?.[0] || book.cover_url || book.coverUrl;
    
    const ourPrice = Number(book.sellingPrice || book.ourPrice || 0);
    const mrp = Number(book.mrp || 0);
    const savings = Number(mrp - ourPrice);
    
    // Derived dummy earnings since old code did not have riEarn
    const vendorEarn = Number(book.vendorEarn || Math.round(ourPrice * 0.8));
    const riEarn = Number(book.riEarn || Math.round(ourPrice * 0.2));

    const waBook = `https://wa.me/918801550189?text=Hi%20RebookIndia,%20I%20need%20help%20with%20buying%20${book.title}.`;
    let waVendor = waBook;
    
    if (vendor && vendor.phone) {
        waVendor = `https://wa.me/91${vendor.phone}?text=Hi%20${vendor.shopName},%20I%20am%20interested%20in%20your%20book%20${book.title}.`;
    }
    
    // Fallback for similar books if we don't have them yet
    const similarBooks: any[] = [];
    
    return (
        <div className="bg-[var(--color-cream)] min-h-screen py-8 md:py-12">
            <div className="max-w-6xl mx-auto px-4">

                {/* Breadcrumb */}
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[var(--color-dust)] mb-8">
                    <Link href="/" className="hover:text-[var(--color-rust)]">Home</Link>
                    <ChevronRight size={12} />
                    <Link href={`/books`} className="hover:text-[var(--color-rust)]">{bookCategory.replace('_', ' ')}</Link>
                    <ChevronRight size={12} />
                    <span className="text-[var(--color-ink)] truncate max-w-[200px] inline-block">{book.title}</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-12 gap-10">

                    {/* Left: Image */}
                    <div className="md:col-span-4 lg:col-span-3">
                        <div className="md:sticky md:top-24">
                            <BookCoverImage isbn={book.isbn || ''} title={book.title} coverUrl={coverUrl} />
                            <div className="mt-4 flex gap-2 justify-center">
                                <button
                                    onClick={() => { toggleWishlist(bookId); toast.success("Wishlist updated"); }}
                                    className="flex items-center gap-2 text-sm font-bold text-[var(--color-dust)] hover:text-red-500 transition-colors py-2 px-4 rounded-full bg-white/50 backdrop-blur-sm md:bg-transparent"
                                >
                                    <Heart size={16} fill={hasWishlist(bookId) ? "currentColor" : "none"} className={hasWishlist(bookId) ? "text-red-500" : ""} />
                                    {hasWishlist(bookId) ? 'Saved' : 'Save'}
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Right: Info */}
                    <div className="md:col-span-8 lg:col-span-6 space-y-6">
                        <div>
                            <span className="inline-block bg-[var(--color-ink)] text-white text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-sm mb-3">
                                Condition: {book.condition?.replace('_', ' ') || 'Good'}
                            </span>
                            <h1 className="font-display font-black text-3xl md:text-5xl text-[var(--color-ink)] leading-tight mb-2">
                                {book.title}
                            </h1>
                            <p className="text-lg text-[var(--color-dust)]">{book.author}</p>

                            <div className="flex flex-wrap items-center gap-4 text-xs text-[var(--color-dust)] mt-4 divide-x divide-[var(--color-ldust)]">
                                <span className="pr-4">ISBN: {book.isbn || 'Unknown'}</span>
                                <span className="px-4">Publisher cover matched</span>
                                <span className="pl-4 text-[var(--color-sage)] font-bold flex items-center gap-1">
                                    <Check size={14} /> In Stock
                                </span>
                            </div>
                        </div>

                        {/* Price Block */}
                        <div className="bg-white border border-[var(--color-ldust)] p-6 rounded-sm shadow-sm relative overflow-hidden">
                            {mrp > 0 && Math.round(((mrp - ourPrice) / mrp) * 100) > 0 && (
                                <div className="absolute top-0 right-0 bg-[var(--color-rust)] text-white font-bold text-xs uppercase tracking-widest px-4 py-1 rounded-bl-lg">
                                    {Math.round(((mrp - ourPrice) / mrp) * 100)}% OFF MRP
                                </div>
                            )}
                            <div className="flex items-end gap-3 mb-2">
                                <span className="text-4xl md:text-5xl font-mono font-black text-[var(--color-sage)]">₹{ourPrice}</span>
                                <span className="text-lg font-mono text-[var(--color-dust)] line-through pb-1">₹{mrp}</span>
                            </div>
                            <div className="text-[var(--color-rust)] font-bold mb-4">You save exactly ₹{savings}</div>

                            <div className="text-xs text-[var(--color-dust)] group mt-4">
                                <button
                                    onClick={() => setAccordionOpen(!accordionOpen)}
                                    className="cursor-pointer hover:text-[var(--color-ink)] font-bold flex items-center gap-1 w-full text-left"
                                >
                                    <span className="w-4 h-4 rounded-full bg-[var(--color-paper)] flex items-center justify-center transition-transform duration-300" style={{ transform: accordionOpen ? 'rotate(180deg)' : 'none' }}>
                                        <ChevronDown size={12} />
                                    </span>
                                    Where does this money go?
                                </button>
                                <div
                                    className={`mt-3 pl-4 border-l-2 border-[var(--color-ldust)] space-y-2 bg-[var(--color-paper)] pr-4 rounded-r-sm transition-all duration-300 overflow-hidden ${accordionOpen ? 'max-h-48 py-2 opacity-100' : 'max-h-0 py-0 opacity-0'}`}
                                >
                                    <div className="flex justify-between"><span>Vendor earns (80%):</span> <span className="font-mono font-bold">₹{vendorEarn}</span></div>
                                    <div className="flex justify-between"><span>Rebook earns (20%):</span> <span className="font-mono font-bold">₹{riEarn}</span></div>
                                    <div className="pt-2 italic border-t border-[var(--color-ldust)] opacity-80">&quot;We are honest about every rupee.&quot;</div>
                                </div>
                            </div>
                        </div>

                        {/* Buttons */}
                        <div className="flex flex-col sm:flex-row gap-3 pt-4">
                            <button
                                onClick={async () => {
                                    if (!isLoggedIn || !user) {
                                        toast.error("Please login to continue");
                                        router.push('/login');
                                        return;
                                    }
                                    try {
                                        const tId = toast.loading("Preparing checkout...");
                                        
                                        // Use localStorage for cart
                                        addItem(book);
                                        
                                        toast.dismiss(tId);
                                        router.push('/checkout?bookId=' + bookId);
                                    } catch (err) {
                                        toast.error("Failed to process cart.");
                                    }
                                }}
                                className="order-1 sm:order-2 flex items-center justify-center bg-[var(--color-rust)] text-white hover:bg-[#A93C23] py-4 rounded-lg font-bold shadow-md transition-all text-lg w-full active:scale-95"
                            >
                                Place Order Request
                            </button>
                            <button
                                onClick={async () => {
                                    if (!isLoggedIn || !user) {
                                        toast.error("Please login to add to cart");
                                        router.push('/login');
                                        return;
                                    }
                                    if (!hasItem(bookId)) {
                                        try {
                                            const tId = toast.loading("Adding...");
                                            
                                            // UI adds instantly
                                            addItem(book); 
                                            
                                            toast.dismiss(tId);
                                            toast.success("Added to cart");
                                        } catch (err) {
                                            toast.error("Failed to add to cart.");
                                        }
                                    } else {
                                        toast.error("Already in cart!");
                                    }
                                }}
                                className={`order-2 sm:order-1 flex items-center justify-center gap-2 py-4 rounded-lg font-bold shadow-sm transition-all text-lg w-full active:scale-95 ${hasItem(bookId) ? 'bg-[var(--color-sage)] text-white' : 'bg-[var(--color-ink)] text-white hover:bg-black'}`}
                            >
                                {hasItem(bookId) ? <><Check size={20} /> In Cart</> : <><ShoppingCart size={20} /> Add to Cart</>}
                            </button>
                        </div>
                        <button
                            onClick={() => window.open(waBook, '_blank')}
                            className="w-full flex items-center justify-center gap-2 border-2 border-[#25D366] text-[#128c7e] hover:bg-[#25D366] hover:text-white py-3 rounded-sm font-bold transition-colors"
                        >
                            <MessageCircle size={20} /> Enquire via WhatsApp
                        </button>

                        <div className="flex items-start gap-4 p-4 bg-[var(--color-paper)] border border-[var(--color-ldust)] rounded-sm mt-8">
                            <Package className="text-[var(--color-dust)] mt-1" size={24} />
                            <div>
                                <h4 className="font-bold text-[var(--color-ink)] text-sm mb-1">How collection works</h4>
                                <p className="text-xs text-[var(--color-dust)] leading-relaxed">Place order request online &rarr; Admin confirms availability &rarr; Pay cash/UPI directly at the vendor&apos;s shop during pickup, or upon delivery. No payment on website.</p>
                            </div>
                        </div>
                    </div>

                    {/* Right sidebar: Vendor */}
                    <div className="md:col-span-12 lg:col-span-3">
                        <h3 className="font-display font-bold text-lg text-[var(--color-ink)] mb-4">Sold By</h3>
                        {vendor && (
                            <div className="bg-white border border-[var(--color-ldust)] rounded-sm shadow-sm overflow-hidden sticky top-24">
                                <div className="h-[100px] relative bg-[var(--color-paper)] flex items-center justify-center">
                                    {vendor.shopImage ? (
                                        <img src={vendor.shopImage} alt={vendor.shopName} className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="w-full h-full bg-gradient-to-br from-[var(--color-ink)] to-gray-800 text-white flex items-center justify-center text-4xl font-bold">
                                            {vendor.shopName?.[0]}
                                        </div>
                                    )}
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                                    <div className="absolute bottom-2 left-3 right-3 flex items-end justify-between">
                                        <span className="text-white text-[10px] font-bold uppercase bg-black/40 px-2 py-0.5 rounded-sm backdrop-blur-sm border border-white/20">
                                            Verified Seller
                                        </span>
                                        <span className="text-white text-xs font-bold flex items-center gap-1">
                                            <Star size={12} fill="currentColor" className="text-[var(--color-amber)]" /> 4.8
                                        </span>
                                    </div>
                                </div>
                                <div className="p-4">
                                    <Link href={`#`} className="font-display font-bold text-[var(--color-ink)] hover:text-[var(--color-rust)] block mb-2">{vendor.shopName}</Link>
                                    <div className="flex items-center gap-1 text-xs text-[var(--color-dust)] mb-4">
                                        <MapPin size={12} /> {vendor.city}, {vendor.state}
                                    </div>
                                    <button
                                        onClick={() => window.open(waVendor, '_blank')}
                                        className="w-full bg-[#25D366]/10 text-[#128c7e] hover:bg-[#25D366] hover:text-white py-2 rounded-sm font-bold text-xs flex items-center justify-center gap-1 transition-colors"
                                    >
                                        <MessageCircle size={14} /> Contact Vendor
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Similar Books */}
                {similarBooks.length > 0 && (
                    <div className="mt-20 pt-10 border-t border-[var(--color-ldust)]">
                        <h2 className="font-display font-black text-2xl text-[var(--color-ink)] mb-6">More in {bookCategory.replace('_', ' ')}</h2>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
                            {similarBooks.map(b => (
                                <Link href={`/book/${b.$id || b.id}`} key={b.$id || b.id} className="bg-white group rounded-sm shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden flex flex-col hover:-translate-y-1 border border-[var(--color-ldust)]">
                                    <BookCoverImage isbn={b.isbn || ''} title={b.title} coverUrl={b.imageIds?.[0] || b.cover_url || b.coverUrl} />
                                    <div className="p-3">
                                        <h3 className="font-display font-bold text-xs text-[var(--color-ink)] line-clamp-1 mb-1 group-hover:text-[var(--color-rust)]">{b.title}</h3>
                                        <div className="flex items-baseline gap-2">
                                            <span className="font-mono text-sm font-bold text-[var(--color-sage)]">₹{b.sellingPrice || b.ourPrice}</span>
                                            <span className="font-mono text-[10px] line-through text-[var(--color-dust)]">₹{b.mrp}</span>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                )}

            </div>
        </div>
    );
}
