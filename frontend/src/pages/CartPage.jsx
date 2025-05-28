import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight } from 'lucide-react';

const CartPage = () => {
  const { cart, updateCartItemQuantity, removeFromCart, cartTotal } = useCart();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  
  // Redirect to checkout
  const handleCheckout = () => {
    setLoading(true);
    // Simulate a small loading delay
    setTimeout(() => {
      navigate('/checkout');
      setLoading(false);
    }, 500);
  };
  
  // Calculate order summary
  const subtotal = cartTotal();
  const shipping = subtotal > 100 ? 0 : 10;
  const tax = Number((0.15 * subtotal).toFixed(2));
  const total = subtotal + shipping + tax;
  
  // Add payment gateway display in the cart page
  const renderPaymentInfo = () => (
    <div className="mb-4 p-4 bg-primary/5 rounded-lg text-sm">
      <h3 className="font-medium text-base mb-2 flex items-center gap-2">
        <span>Secure Payment Options</span>
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary"><rect width="20" height="14" x="2" y="5" rx="2"/><path d="M2 10h20"/></svg>
      </h3>
      <div className="flex flex-wrap gap-3 mb-2">
        <div className="p-2 bg-white rounded border border-border flex items-center justify-center h-8 w-14">
          <svg xmlns="http://www.w3.org/2000/svg" width="28" height="8" viewBox="0 0 28 8"><path d="M3 0A3 3 0 0 0 0 3v2a3 3 0 0 0 3 3h22a3 3 0 0 0 3-3V3a3 3 0 0 0-3-3H3z" fill="#ff5f00"/><path d="M14 7a3.5 3.5 0 0 1 0-6c1.4 0 2.5.8 3 2a3.5 3.5 0 0 1-3 4z" fill="#eb001b"/><path d="M14 7a3.5 3.5 0 0 1 0-6c1.4 0 2.6.8 3.2 2a3.5 3.5 0 0 1-3.2 4z" fill="#f79e1b"/></svg>
        </div>
        <div className="p-2 bg-white rounded border border-border flex items-center justify-center h-8 w-14">
          <svg xmlns="http://www.w3.org/2000/svg" width="30" height="8" viewBox="0 0 30 8"><path d="M21.4 1h-9.8v6h9.8V1z" fill="#191e63"/><path d="M12.2 4c0-1.6 1-3 2.4-3.5-1-.5-2.3-.5-3.4 0-1 .4-2 1.2-2.4 2.2-.5 1-.5 2.2 0 3.3.4 1 1.3 1.8 2.4 2.2 1 .4 2.3.4 3.4 0-1.4-.5-2.4-1.8-2.4-3.5v-.7z" fill="#191e63"/><path d="M27.2 4c0 1-.6 2-1.6 2.5-1 .6-2.2.6-3.2 0-1-.6-1.6-1.5-1.6-2.6s.6-2 1.6-2.6c1-.6 2.2-.6 3.2 0 1 .6 1.6 1.5 1.6 2.6z" fill="#ff9a00"/></svg>
        </div>
        <div className="p-2 bg-white rounded border border-border flex items-center justify-center h-8 w-14">
          <svg viewBox="0 0 38 8" width="38" height="8" xmlns="http://www.w3.org/2000/svg"><path d="M11 4.2c0-1.2-.9-2.2-2-2.2-1.1 0-2 1-2 2.2 0 1.2.9 2.2 2 2.2 1.1 0 2-1 2-2.2zm-9 0c0-1.2.9-2.2 2-2.2V.5C1.8.5 0 2.2 0 4.2s1.8 3.7 4 3.7V6.4c-1.1 0-2-1-2-2.2zm32-2.2c-1.1 0-2 1-2 2.2 0 1.2.9 2.2 2 2.2 1.1 0 2-1 2-2.2 0-1.2-.9-2.2-2-2.2zm0 5.9c-2.2 0-4-1.7-4-3.7s1.8-3.7 4-3.7 4 1.7 4 3.7-1.8 3.7-4 3.7zm-10-3c0 2-1.9 3.6-4.3 3.6-2.3 0-4.2-1.6-4.2-3.5 0-2 1.9-3.6 4.2-3.6 2.4 0 4.3 1.6 4.3 3.5zm-1.6 0c0-1.4-1.2-2.5-2.7-2.5-1.5 0-2.6 1.1-2.6 2.5s1.2 2.5 2.6 2.5c1.5 0 2.7-1.1 2.7-2.5zm15.6 0c0 2-1.9 3.6-4.3 3.6-2.3 0-4.2-1.6-4.2-3.5 0-2 1.9-3.6 4.2-3.6 2.4 0 4.3 1.6 4.3 3.5zm-1.6 0c0-1.4-1.2-2.5-2.7-2.5-1.5 0-2.6 1.1-2.6 2.5s1.2 2.5 2.6 2.5c1.5 0 2.7-1.1 2.7-2.5zm-20 0c0 2 1.8 3.5 4 3.5V6.4c-1.1 0-2-1-2-2.2 0-1.2.9-2.2 2-2.2V.5c-2.2 0-4 1.6-4 3.6z" fill="#6772e5"/></svg>
        </div>
        <div className="p-2 bg-white rounded border border-border flex items-center justify-center h-8 w-14">
          <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 48 48"><path fill="#0052FF" d="M24 48c13.255 0 24-10.745 24-24S37.255 0 24 0 0 10.745 0 24s10.745 24 24 24z"/><path fill="#ffffff" d="M17.533 28.8h12.934c.733 0 1.333-.6 1.333-1.333v-.534c0-.733-.6-1.333-1.333-1.333h-12.8c-.733 0-1.333-.6-1.333-1.333v-2.667c0-.733.6-1.333 1.333-1.333h12.8c.733 0 1.333-.6 1.333-1.333V18.4c0-.733-.6-1.333-1.333-1.333h-12.8c-.733 0-1.333-.6-1.333-1.333v-.534c0-.733.6-1.333 1.333-1.333h12.934c.733 0 1.333-.6 1.333-1.333V12c0-.733-.6-1.333-1.333-1.333H17.533c-2.2 0-4 1.8-4 4v10.133c0 2.2 1.8 4 4 4z"/></svg>
        </div>
        <div className="p-2 bg-white rounded border border-border flex items-center justify-center h-8 w-14">
          <svg xmlns="http://www.w3.org/2000/svg" width="30" height="8" viewBox="0 0 56 14"><path d="M10.6 0L0 14h7.4L18 0h-7.4zm13.3 0L13.4 14h7.4L31.3 0h-7.4zM33.9 0L23.4 14h7.4L41.3 0h-7.4zm13.3 0L36.7 14h7.4L54.6 0h-7.4z" fill="#3395ff"/></svg>
        </div>
      </div>
      <p className="text-muted-foreground">All payments are processed securely. Multiple payment options available at checkout.</p>
    </div>
  );

  return (
    <div className="container mx-auto max-w-6xl px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl md:text-3xl font-bold">Your Cart</h1>
        <Link to="/products" className="text-primary hover:underline flex items-center gap-1">
          <ShoppingBag size={16} />
          <span>Continue Shopping</span>
        </Link>
      </div>
      
      {cart.length === 0 ? (
        <div className="text-center py-16">
          <div className="mb-4 flex justify-center">
            <ShoppingBag size={48} className="text-muted-foreground" />
          </div>
          <h2 className="text-xl font-medium mb-4">Your cart is empty</h2>
          <p className="text-muted-foreground mb-8">Looks like you haven't added anything to your cart yet.</p>
          <Link
            to="/products"
            className="inline-flex items-center justify-center px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
          >
            Browse Products
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="border border-border rounded-md overflow-hidden">
              <div className="hidden md:grid grid-cols-12 gap-4 p-4 bg-muted/50 text-sm font-medium">
                <div className="col-span-6">Product</div>
                <div className="col-span-2 text-center">Price</div>
                <div className="col-span-2 text-center">Quantity</div>
                <div className="col-span-2 text-center">Total</div>
              </div>
              
              {cart.map((item) => (
                <div key={item.id} className="border-t border-border first:border-t-0 p-4">
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
                    <div className="md:col-span-6 flex gap-4 items-center">
                      <div className="w-16 h-16 bg-muted rounded-md overflow-hidden">
                        <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                      </div>
                      <div>
                        <h3 className="font-medium">{item.name}</h3>
                        <p className="text-sm text-muted-foreground">{item.brand}</p>
                      </div>
                    </div>
                    
                    <div className="md:col-span-2 flex md:justify-center items-center">
                      <span className="text-sm text-muted-foreground md:hidden mr-2">Price:</span>
                      <span>${item.price.toFixed(2)}</span>
                    </div>
                    
                    <div className="md:col-span-2 flex md:justify-center items-center">
                      <span className="text-sm text-muted-foreground md:hidden mr-2">Quantity:</span>
                      <div className="flex items-center">
                        <button
                          onClick={() => updateCartItemQuantity(item.id, Math.max(1, item.quantity - 1))}
                          className="w-8 h-8 flex items-center justify-center border border-border rounded-l-md hover:bg-muted transition-colors"
                          aria-label="Decrease quantity"
                        >
                          <Minus size={16} />
                        </button>
                        <div className="w-10 h-8 flex items-center justify-center border-t border-b border-border">
                          {item.quantity}
                        </div>
                        <button
                          onClick={() => updateCartItemQuantity(item.id, item.quantity + 1)}
                          className="w-8 h-8 flex items-center justify-center border border-border rounded-r-md hover:bg-muted transition-colors"
                          aria-label="Increase quantity"
                        >
                          <Plus size={16} />
                        </button>
                      </div>
                    </div>
                    
                    <div className="md:col-span-2 flex justify-between md:justify-center items-center">
                      <span className="text-sm text-muted-foreground md:hidden">Total:</span>
                      <div className="flex items-center gap-2">
                        <span className="font-medium">${(item.price * item.quantity).toFixed(2)}</span>
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="text-muted-foreground hover:text-destructive transition-colors"
                          aria-label="Remove item"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div>
            <div className="border border-border rounded-md p-4 mb-4">
              <h2 className="text-lg font-bold mb-4">Order Summary</h2>
              
              <div className="space-y-2 mb-4">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Tax (15%)</span>
                  <span>${tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Shipping</span>
                  <span>{shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`}</span>
                </div>
                <div className="flex justify-between font-bold pt-2 border-t border-border mt-2">
                  <span>Total</span>
                  <span>${total.toFixed(2)}</span>
                </div>
              </div>
              
              {shipping === 0 ? (
                <div className="text-xs text-green-600 mb-4">You qualify for free shipping!</div>
              ) : (
                <div className="text-xs text-muted-foreground mb-4">
                  Add ${(100 - subtotal).toFixed(2)} more to qualify for free shipping
                </div>
              )}
              
              <button
                onClick={handleCheckout}
                disabled={loading || cart.length === 0}
                className="w-full py-2 px-4 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors disabled:opacity-70 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Processing...
                  </>
                ) : (
                  <>
                    Proceed to Checkout
                    <ArrowRight size={16} />
                  </>
                )}
              </button>
            </div>
            
            {renderPaymentInfo()}
          </div>
        </div>
      )}
    </div>
  );
};

export default CartPage; 