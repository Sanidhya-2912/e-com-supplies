import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Heart, ShoppingCart, Sliders, X, ChevronDown } from "lucide-react";
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";
import { formatPrice } from "../lib/utils";
import axios from "axios";

export default function CategoryPage() {
  const { category } = useParams();
  const { addToCart } = useCart();
  const { toggleWishlistItem, isInWishlist } = useWishlist();
  
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isFilterMenuOpen, setIsFilterMenuOpen] = useState(false);
  const [priceRange, setPriceRange] = useState({ min: 0, max: 100 });
  const [sortBy, setSortBy] = useState("featured");
  
  // Fetch products from API
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        
        let url = '/api/products';
        if (category && category !== "all") {
          url = `/api/products/category/${category}`;
        }
        
        console.log('Fetching products from:', url);
        const { data } = await axios.get(url);
        console.log('API response:', data);
        
        // Apply client-side price filter
        let filteredProducts = Array.isArray(data) ? data : data.products || [];
        console.log('Products before filtering:', filteredProducts.length);
        
        filteredProducts = filteredProducts.filter(
          product => product.price >= priceRange.min && product.price <= priceRange.max
        );
        
        // Apply sorting
        filteredProducts = sortProducts(filteredProducts, sortBy);
        console.log('Products after filtering and sorting:', filteredProducts.length);
        
        setProducts(filteredProducts);
        setError(null);
      } catch (err) {
        console.error('Error fetching products:', err);
        setError(err.message || "An error occurred while fetching products");
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };
    
    fetchProducts();
  }, [category, priceRange, sortBy]);
  
  // Sort products based on selected option
  const sortProducts = (products, sortOption) => {
    const sortedProducts = [...products];
    
    switch (sortOption) {
      case "price-low-high":
        return sortedProducts.sort((a, b) => a.price - b.price);
      case "price-high-low":
        return sortedProducts.sort((a, b) => b.price - a.price);
      case "rating":
        return sortedProducts.sort((a, b) => b.rating - a.rating);
      case "newest":
        return sortedProducts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      case "featured":
      default:
        return sortedProducts.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
    }
  };
  
  // Format category name for display
  const formatCategoryName = (categorySlug) => {
    if (!categorySlug || categorySlug === "all") return "All Products";
    return categorySlug
      .split("-")
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };
  
  // Handle adding product to cart
  const handleAddToCart = (product) => {
    addToCart({
      ...product,
      _id: product._id // MongoDB uses _id
    });
  };
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold mb-2">{formatCategoryName(category)}</h1>
        <p className="text-muted-foreground">
          {products.length} products available
        </p>
      </div>
      
      {/* Filters and Sort Row */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <button
          onClick={() => setIsFilterMenuOpen(!isFilterMenuOpen)}
          className="flex items-center justify-center px-4 py-2 rounded-md border border-border hover:bg-muted transition-colors md:w-auto w-full"
        >
          <Sliders size={16} className="mr-2" />
          Filters
        </button>
        
        <div className="relative">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="appearance-none w-full md:w-48 px-4 py-2 bg-background rounded-md border border-border pr-10 focus:outline-none focus:ring-2 focus:ring-primary/20"
          >
            <option value="featured">Featured</option>
            <option value="price-low-high">Price: Low to High</option>
            <option value="price-high-low">Price: High to Low</option>
            <option value="rating">Highest Rated</option>
            <option value="newest">Newest Arrivals</option>
          </select>
          <ChevronDown size={16} className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none text-muted-foreground" />
        </div>
      </div>
      
      {/* Filter Panel (Slide out on mobile, visible on desktop) */}
      {isFilterMenuOpen && (
        <div className="bg-background border border-border rounded-lg p-6 mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="font-medium">Filters</h2>
            <button 
              onClick={() => setIsFilterMenuOpen(false)}
              className="text-muted-foreground hover:text-foreground p-1 rounded-full md:hidden"
            >
              <X size={18} />
            </button>
          </div>
          
          <div className="mb-6">
            <h3 className="text-sm font-medium mb-3">Price Range</h3>
            <div className="flex items-center gap-4">
              <div className="relative flex-1">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">$</span>
                <input
                  type="number"
                  value={priceRange.min}
                  onChange={(e) => setPriceRange({ ...priceRange, min: Number(e.target.value) })}
                  className="w-full pl-8 pr-4 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/20"
                  placeholder="Min"
                  min="0"
                />
              </div>
              <span className="text-muted-foreground">to</span>
              <div className="relative flex-1">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">$</span>
                <input
                  type="number"
                  value={priceRange.max}
                  onChange={(e) => setPriceRange({ ...priceRange, max: Number(e.target.value) })}
                  className="w-full pl-8 pr-4 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/20"
                  placeholder="Max"
                  min="0"
                />
              </div>
            </div>
          </div>
          
          <button 
            onClick={() => setIsFilterMenuOpen(false)}
            className="w-full md:w-auto py-2 px-4 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
          >
            Apply Filters
          </button>
        </div>
      )}
      
      {/* Error Message */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
          <p>{error}</p>
        </div>
      )}
      
      {/* Products Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="bg-muted h-64 rounded-lg mb-3"></div>
              <div className="h-4 bg-muted rounded w-3/4 mb-2"></div>
              <div className="h-4 bg-muted rounded w-1/2"></div>
            </div>
          ))}
        </div>
      ) : products.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map((product) => (
            <div
              key={product._id}
              className="bg-background rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow border border-border"
            >
              <Link to={`/products/${product._id}`} className="block relative">
                <img
                  src={product.image.startsWith('http') 
                    ? product.image 
                    : `http://localhost:5001${product.image}`}
                  alt={product.name}
                  className="h-48 w-full object-cover object-center transition-transform group-hover:scale-105"
                />
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    toggleWishlistItem({
                      ...product,
                      _id: product._id // Add _id field to match the format expected by the wishlist
                    });
                  }}
                  className="absolute top-3 right-3 p-2 rounded-full bg-background/80 hover:bg-background transition-colors"
                  aria-label={isInWishlist(product._id) ? "Remove from wishlist" : "Add to wishlist"}
                >
                  <Heart
                    size={18}
                    className={isInWishlist(product._id) ? "fill-red-500 text-red-500" : "text-muted-foreground"}
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
                    <span className="text-xs">{product.rating}</span>
                    <span className="text-amber-500 ml-1">★</span>
                  </div>
                  <span className="text-xs text-muted-foreground">
                    ({product.numReviews} reviews)
                  </span>
                </div>

                <div className="flex items-center justify-between mt-4">
                  <span className="font-semibold">
                    {formatPrice(product.price)}
                  </span>
                  <button
                    onClick={() => handleAddToCart(product)}
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
      ) : (
        <div className="text-center py-12">
          <h2 className="text-xl font-medium mb-2">No products found</h2>
          <p className="text-muted-foreground mb-6">
            Try adjusting your filters or browse our other categories
          </p>
          <Link
            to="/categories/all"
            className="inline-flex items-center px-6 py-3 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
          >
            View All Products
          </Link>
        </div>
      )}
    </div>
  );
} 