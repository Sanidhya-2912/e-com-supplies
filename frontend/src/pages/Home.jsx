import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ChevronRight, Star, ShoppingCart, Heart } from "lucide-react";
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";
import { formatPrice } from "../lib/utils";

// Mock data for featured products
const FEATURED_PRODUCTS = [
  {
    _id: "1",
    name: "Premium Leather Notebook",
    price: 24.99,
    image: "https://images.unsplash.com/photo-1544816155-12df9643f363?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=987&q=80",
    category: "notebooks",
    rating: 4.8,
    reviews: 124,
    inStock: true,
  },
  {
    _id: "2",
    name: "Ergonomic Desk Organizer",
    price: 19.99,
    image: "https://images.unsplash.com/photo-1558051815-0f18e64e6280?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=989&q=80",
    category: "desk-accessories",
    rating: 4.5,
    reviews: 89,
    inStock: true,
  },
  {
    _id: "3",
    name: "Fountain Pen Set",
    price: 39.99,
    image: "https://images.unsplash.com/photo-1583485088034-697b5bc1b13a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=975&q=80",
    category: "pens",
    rating: 4.9,
    reviews: 56,
    inStock: true,
  },
  {
    _id: "4",
    name: "Wireless Charging Desk Lamp",
    price: 49.99,
    image: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=987&q=80",
    category: "electronics",
    rating: 4.7,
    reviews: 42,
    inStock: true,
  },
];

// Mock data for categories
const CATEGORIES = [
  {
    id: "notebooks",
    name: "Notebooks & Journals",
    image: "https://images.unsplash.com/photo-1531346878377-a5be20888e57?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=987&q=80",
  },
  {
    id: "pens",
    name: "Pens & Writing",
    image: "https://images.unsplash.com/photo-1595231776515-ddffb1f4eb73?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=987&q=80",
  },
  {
    id: "desk-accessories",
    name: "Desk Accessories",
    image: "https://images.unsplash.com/photo-1565193298442-2373bcacc481?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2670&q=80",
  },
  {
    id: "electronics",
    name: "Electronics",
    image: "https://images.unsplash.com/photo-1593642634367-d91a135587b5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2669&q=80",
  },
];

export default function Home() {
  const { addToCart } = useCart();
  const { toggleWishlistItem, isInWishlist } = useWishlist();
  const [isLoading, setIsLoading] = useState(false);

  // Simulating loading state for demo
  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-primary-600 to-primary-800 text-white py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              Premium Office Supplies for Your Workspace
            </h1>
            <p className="text-lg md:text-xl mb-8 text-primary-50">
              Elevate your productivity with our curated collection of high-quality stationery and office essentials.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                to="/categories/all"
                className="px-6 py-3 rounded-lg bg-white text-primary-700 font-medium hover:bg-primary-50 transition-colors"
              >
                Shop Now
              </Link>
              <Link
                to="/about"
                className="px-6 py-3 rounded-lg bg-transparent border border-white text-white font-medium hover:bg-white/10 transition-colors"
              >
                Learn More
              </Link>
            </div>
          </div>
        </div>
        
        {/* Decorative element */}
        <div className="hidden md:block absolute right-0 bottom-0 w-1/3 h-full bg-[url('https://images.unsplash.com/photo-1497032628192-86f99bcd76bc?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2670&q=80')] bg-cover bg-center opacity-20"></div>
      </section>

      {/* Categories Section */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl md:text-3xl font-bold">Shop by Category</h2>
            <Link
              to="/categories"
              className="text-primary hover:text-primary-700 flex items-center font-medium"
            >
              View All <ChevronRight size={16} className="ml-1" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {CATEGORIES.map((category) => (
              <Link
                key={category.id}
                to={`/categories/${category.id}`}
                className="group relative rounded-xl overflow-hidden h-64 shadow-md hover:shadow-lg transition-shadow"
              >
                <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition-colors z-10"></div>
                <img
                  src={category.image}
                  alt={category.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute bottom-0 left-0 right-0 p-6 text-white z-20">
                  <h3 className="text-xl font-semibold mb-1">{category.name}</h3>
                  <p className="flex items-center text-sm text-white/80">
                    Shop Now <ChevronRight size={14} className="ml-1" />
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="py-16 bg-accent/30">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl md:text-3xl font-bold">Featured Products</h2>
            <Link
              to="/products"
              className="text-primary hover:text-primary-700 flex items-center font-medium"
            >
              View All <ChevronRight size={16} className="ml-1" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {isLoading
              ? Array(4)
                  .fill(null)
                  .map((_, index) => (
                    <div
                      key={index}
                      className="bg-background rounded-xl p-4 shadow-sm animate-pulse"
                    >
                      <div className="h-48 bg-muted rounded-lg mb-4"></div>
                      <div className="h-4 bg-muted rounded w-3/4 mb-2"></div>
                      <div className="h-4 bg-muted rounded w-1/2 mb-4"></div>
                      <div className="h-8 bg-muted rounded w-full"></div>
                    </div>
                  ))
              : FEATURED_PRODUCTS.map((product) => (
                  <div
                    key={product._id}
                    className="bg-background rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow"
                  >
                    <Link to={`/products/${product._id}`} className="block relative">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-48 object-cover"
                      />
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          toggleWishlistItem(product);
                        }}
                        className="absolute top-3 right-3 p-2 rounded-full bg-background/80 hover:bg-background transition-colors"
                        aria-label={
                          isInWishlist(product._id)
                            ? "Remove from wishlist"
                            : "Add to wishlist"
                        }
                      >
                        <Heart
                          size={18}
                          className={
                            isInWishlist(product._id)
                              ? "fill-red-500 text-red-500"
                              : "text-muted-foreground"
                          }
                        />
                      </button>
                    </Link>

                    <div className="p-4">
                      <Link to={`/products/${product._id}`}>
                        <h3 className="font-medium mb-1 hover:text-primary transition-colors">
                          {product.name}
                        </h3>
                      </Link>

                      <div className="flex items-center mb-2">
                        <div className="flex items-center text-amber-500 mr-2">
                          <Star size={14} className="fill-current" />
                          <span className="text-sm ml-1">{product.rating}</span>
                        </div>
                        <span className="text-xs text-muted-foreground">
                          ({product.reviews} reviews)
                        </span>
                      </div>

                      <div className="flex items-center justify-between mt-4">
                        <span className="font-semibold">
                          {formatPrice(product.price)}
                        </span>
                        <button
                          onClick={() => addToCart(product)}
                          className="p-2 rounded-full bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
                          aria-label={`Add ${product.name} to cart`}
                        >
                          <ShoppingCart size={18} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-16 bg-primary-50 dark:bg-primary-900/20">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">
              Subscribe to Our Newsletter
            </h2>
            <p className="text-muted-foreground mb-6">
              Stay updated with our latest products, exclusive offers, and office organization tips.
            </p>
            <form className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Your email address"
                required
                className="flex-1 px-4 py-3 rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
              <button
                type="submit"
                className="px-6 py-3 rounded-lg bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
} 