import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Star, ChevronLeft, ShoppingCart, Heart } from "lucide-react";
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";
import { formatPrice } from "../lib/utils";

export default function ProductDetails() {
  const { id } = useParams();
  const { addToCart } = useCart();
  const { toggleWishlistItem, isInWishlist } = useWishlist();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  
  // Mock data for demo purposes
  const mockProduct = {
    _id: id,
    name: "Premium Leather Notebook",
    price: 24.99,
    images: [
      "https://images.unsplash.com/photo-1544816155-12df9643f363?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=987&q=80",
      "https://images.unsplash.com/photo-1572726729207-a78d6feb18d7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=974&q=80",
      "https://images.unsplash.com/photo-1518893494013-481c1d8ed3fd?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2574&q=80",
    ],
    description: "A premium leather-bound notebook with high-quality paper. Perfect for journaling, sketching, or taking notes. Features 240 pages of acid-free paper that works well with most pen types.",
    brand: "Moleskine",
    category: "notebooks",
    countInStock: 15,
    rating: 4.8,
    numReviews: 12,
    inStock: true,
  };

  useEffect(() => {
    // Simulating API call with a timeout
    setLoading(true);
    const timer = setTimeout(() => {
      setProduct(mockProduct);
      setLoading(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, [id]);

  const handleAddToCart = () => {
    addToCart(product, quantity);
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="h-6 w-48 bg-muted rounded mb-8"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="aspect-square bg-muted rounded"></div>
            <div className="space-y-4">
              <div className="h-8 bg-muted rounded w-3/4"></div>
              <div className="h-6 bg-muted rounded w-1/4"></div>
              <div className="h-4 bg-muted rounded w-full mt-4"></div>
              <div className="h-4 bg-muted rounded w-full"></div>
              <div className="h-4 bg-muted rounded w-3/4"></div>
              <div className="h-12 bg-muted rounded w-full mt-6"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold mb-4">Product Not Found</h1>
        <p className="text-muted-foreground mb-8">The product you're looking for doesn't exist or has been removed.</p>
        <Link
          to="/products"
          className="inline-flex items-center px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
        >
          <ChevronLeft size={16} className="mr-2" />
          Back to Products
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <div className="flex items-center text-sm mb-8">
        <Link to="/" className="text-muted-foreground hover:text-foreground transition-colors">
          Home
        </Link>
        <span className="mx-2 text-muted-foreground">/</span>
        <Link to={`/categories/${product.category}`} className="text-muted-foreground hover:text-foreground transition-colors">
          {product.category.charAt(0).toUpperCase() + product.category.slice(1)}
        </Link>
        <span className="mx-2 text-muted-foreground">/</span>
        <span className="font-medium">{product.name}</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Product Images */}
        <div className="space-y-4">
          <div className="aspect-square rounded-lg overflow-hidden bg-accent/20">
            <img
              src={product.images?.[selectedImage] || product.image}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Thumbnails */}
          {product.images && product.images.length > 1 && (
            <div className="flex gap-3 overflow-x-auto pb-2">
              {product.images.map((image, index) => (
                <button
                  key={index}
                  className={`w-20 h-20 rounded-md overflow-hidden flex-shrink-0 border-2 ${
                    selectedImage === index ? "border-primary" : "border-transparent"
                  }`}
                  onClick={() => setSelectedImage(index)}
                >
                  <img src={image} alt={`${product.name} thumbnail ${index + 1}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div>
          <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
          
          <div className="flex items-center mb-4">
            <div className="flex items-center text-amber-500 mr-3">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  size={16}
                  className={i < Math.floor(product.rating) ? "fill-current" : "stroke-current opacity-30"}
                />
              ))}
              <span className="ml-2 text-sm">{product.rating}</span>
            </div>
            <span className="text-sm text-muted-foreground">
              ({product.numReviews} reviews)
            </span>
          </div>

          <div className="text-2xl font-semibold mb-6">
            {formatPrice(product.price)}
          </div>

          <p className="text-muted-foreground mb-6">
            {product.description}
          </p>

          <div className="mb-6">
            <div className="flex items-center mb-2">
              <span className="w-24 text-sm">Brand:</span>
              <span>{product.brand}</span>
            </div>
            <div className="flex items-center mb-2">
              <span className="w-24 text-sm">Category:</span>
              <span className="capitalize">{product.category}</span>
            </div>
            <div className="flex items-center">
              <span className="w-24 text-sm">Availability:</span>
              <span>
                {product.countInStock > 0 ? (
                  <span className="text-green-600">In Stock ({product.countInStock})</span>
                ) : (
                  <span className="text-red-600">Out of Stock</span>
                )}
              </span>
            </div>
          </div>

          {product.countInStock > 0 && (
            <div className="flex items-center mb-6">
              <div className="flex items-center border border-border rounded-md mr-4">
                <button
                  className="px-3 py-2 text-lg"
                  onClick={() => setQuantity(q => (q > 1 ? q - 1 : 1))}
                  disabled={quantity === 1}
                >
                  -
                </button>
                <span className="w-12 text-center">{quantity}</span>
                <button
                  className="px-3 py-2 text-lg"
                  onClick={() => setQuantity(q => (q < product.countInStock ? q + 1 : q))}
                  disabled={quantity === product.countInStock}
                >
                  +
                </button>
              </div>
            </div>
          )}

          <div className="flex flex-wrap gap-3">
            <button
              onClick={handleAddToCart}
              disabled={product.countInStock === 0}
              className="flex-1 flex items-center justify-center px-6 py-3 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ShoppingCart size={18} className="mr-2" />
              Add to Cart
            </button>
            
            <button
              onClick={() => toggleWishlistItem(product)}
              className="p-3 rounded-lg border border-border hover:bg-accent transition-colors"
              aria-label={isInWishlist(product._id) ? "Remove from wishlist" : "Add to wishlist"}
            >
              <Heart
                size={20}
                className={isInWishlist(product._id) ? "fill-red-500 text-red-500" : ""}
              />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 