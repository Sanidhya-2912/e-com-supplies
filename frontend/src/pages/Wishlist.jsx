import { Link } from "react-router-dom";
import { Heart, ShoppingCart, Trash2, ChevronLeft } from "lucide-react";
import { useWishlist } from "../context/WishlistContext";
import { useCart } from "../context/CartContext";
import { formatPrice } from "../lib/utils";

export default function Wishlist() {
  const { wishlist, removeFromWishlist, clearWishlist } = useWishlist();
  const { addToCart } = useCart();

  const handleAddToCart = (product) => {
    addToCart(product);
    removeFromWishlist(product._id);
  };

  if (wishlist.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <div className="max-w-md mx-auto">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-muted rounded-full mb-6">
            <Heart size={32} className="text-muted-foreground" />
          </div>
          <h1 className="text-2xl font-bold mb-4">Your Wishlist is Empty</h1>
          <p className="text-muted-foreground mb-8">
            You haven't added any items to your wishlist yet.
          </p>
          <Link
            to="/"
            className="inline-flex items-center px-6 py-3 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
          >
            <ChevronLeft size={16} className="mr-2" />
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl md:text-3xl font-bold">My Wishlist</h1>
        <button
          onClick={clearWishlist}
          className="text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          Clear All
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {wishlist.map((product) => (
          <div
            key={product._id}
            className="bg-background rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow border border-border"
          >
            <Link to={`/products/${product._id}`} className="block relative">
              <img
                src={product.image || "https://via.placeholder.com/300"}
                alt={product.name}
                className="w-full h-48 object-cover"
              />
              <button
                onClick={(e) => {
                  e.preventDefault();
                  removeFromWishlist(product._id);
                }}
                className="absolute top-3 right-3 p-2 rounded-full bg-background/80 hover:bg-background transition-colors"
                aria-label="Remove from wishlist"
              >
                <Trash2 size={16} className="text-red-500" />
              </button>
            </Link>

            <div className="p-4">
              <Link to={`/products/${product._id}`}>
                <h3 className="font-medium mb-1 hover:text-primary transition-colors">
                  {product.name}
                </h3>
              </Link>

              {product.rating && (
                <div className="flex items-center mb-2">
                  <div className="flex items-center text-amber-500 mr-2">
                    <span className="text-xs">{product.rating}</span>
                    <span className="text-amber-500 ml-1">★</span>
                  </div>
                  {product.numReviews && (
                    <span className="text-xs text-muted-foreground">
                      ({product.numReviews} reviews)
                    </span>
                  )}
                </div>
              )}

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

      <div className="mt-8">
        <Link
          to="/"
          className="inline-flex items-center text-primary hover:text-primary-700 transition-colors"
        >
          <ChevronLeft size={16} className="mr-1" />
          Continue Shopping
        </Link>
      </div>
    </div>
  );
} 