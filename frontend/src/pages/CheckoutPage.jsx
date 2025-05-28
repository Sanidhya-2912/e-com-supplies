import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { Check, Loader2, AlertTriangle } from 'lucide-react';
import PaymentForm from '../components/payment/PaymentForm';
import { BASE_URL } from '../lib/api';

const CheckoutSteps = ({ currentStep }) => {
  const steps = [
    { id: 1, name: 'Shipping' },
    { id: 2, name: 'Payment' },
    { id: 3, name: 'Confirmation' },
  ];

  return (
    <div className="mb-8">
      <ol className="flex items-center w-full text-sm font-medium text-center text-gray-500 dark:text-gray-400 sm:text-base">
        {steps.map((step, i) => (
          <li 
            key={step.id} 
            className={`flex md:w-full items-center ${
              currentStep >= step.id 
                ? 'text-primary dark:text-primary' 
                : 'text-gray-500 dark:text-gray-400'
            } ${i !== steps.length - 1 ? 'after:content-[""] after:w-full after:h-1 after:border-b after:border-gray-200 after:border-1 after:hidden sm:after:inline-block after:mx-6 xl:after:mx-10' : ''}`}
          >
            <span className="flex items-center justify-center w-6 h-6 mr-2 text-xs border border-primary rounded-full shrink-0">
              {currentStep > step.id ? (
                <Check size={14} className="text-primary" />
              ) : (
                step.id
              )}
            </span>
            {step.name}
          </li>
        ))}
      </ol>
    </div>
  );
};

const CheckoutPage = () => {
  const [step, setStep] = useState(1);
  const [shippingAddress, setShippingAddress] = useState({
    address: '',
    city: '',
    postalCode: '',
    country: '',
  });
  const [paymentMethod, setPaymentMethod] = useState('Card');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [createdOrder, setCreatedOrder] = useState(null);
  const [paymentCompleted, setPaymentCompleted] = useState(false);
  
  const navigate = useNavigate();
  const { cart, clearCart, cartTotal } = useCart();
  const { user } = useAuth();
  
  // Calculate order totals
  const itemsPrice = cartTotal;
  const shippingPrice = itemsPrice > 100 ? 0 : 10;
  const taxPrice = Number((0.15 * itemsPrice).toFixed(2));
  const totalPrice = (itemsPrice + shippingPrice + taxPrice);
  
  // Redirect if cart is empty
  useEffect(() => {
    if (cart.length === 0 && !createdOrder) {
      navigate('/cart');
    }
    
    // Get saved shipping address from localStorage
    const savedAddress = localStorage.getItem('shippingAddress');
    if (savedAddress) {
      setShippingAddress(JSON.parse(savedAddress));
    }
  }, [cart, navigate, createdOrder]);

  // Handle shipping form submission
  const handleShippingSubmit = (e) => {
    e.preventDefault();
    
    // Save shipping address to localStorage
    localStorage.setItem('shippingAddress', JSON.stringify(shippingAddress));
    
    // Move to payment step
    setStep(2);
  };
  
  // Handle order creation
  const createOrder = async () => {
    setLoading(true);
    setError('');
    
    try {
      // Get token from localStorage
      const token = localStorage.getItem('token');
      console.log("🧐 CheckoutPage - token:", token);
console.log("🧐 CheckoutPage - user:", user);

      
      if (!token) {
        setError('You need to be logged in to place an order');
        setLoading(false);
        return;
      }
      
      const response = await axios.post(
        `${BASE_URL}/orders`,
        {
          orderItems: cart.map(item => ({
            name: item.name,
            qty: item.quantity,
            image: item.image || "https://placehold.co/150x150",
            price: item.price,
            product: item._id,
          })),
          shippingAddress,
          paymentMethod,
          itemsPrice,
          taxPrice,
          shippingPrice,
          totalPrice,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          }
        }
      );
      
      setCreatedOrder(response.data);
      setStep(3);
    } catch (error) {
      console.error('Order creation error:', error);
      setError(
        error.response?.data?.message || 
        error.message || 
        'Failed to create order. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };
  
  // Handle payment success
  const handlePaymentSuccess = async (paymentResult) => {
    setLoading(true);
    try {
      console.log('Payment successful:', paymentResult);
      
      // Get token from localStorage
      const token = localStorage.getItem('userToken');
      
      if (!token) {
        throw new Error('Authentication token not found. Please log in again.');
      }
      
      // Update order to paid status
      const orderUpdateResponse = await axios.put(
        `${BASE_URL}/orders/${createdOrder._id}/pay`,
        {
          transactionId: paymentResult.transactionId,
          status: 'COMPLETED',
          update_time: paymentResult.timestamp,
          email_address: user.email
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          }
        }
      );
      
      console.log('Order updated to paid:', orderUpdateResponse.data);
      
      // Clear cart after successful payment
      clearCart();
      
      // Set payment as completed
      setPaymentCompleted(true);
    } catch (error) {
      console.error('Payment update error:', error);
      setError(
        error.response?.data?.message || 
        error.message || 
        'Payment was processed but order status update failed'
      );
    } finally {
      setLoading(false);
    }
  };
  
  // Handle payment error
  const handlePaymentError = (errorMessage) => {
    console.error('Payment processing error:', errorMessage);
    setError(`Payment error: ${errorMessage}`);
  };
  
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl md:text-3xl font-bold mb-6">Checkout</h1>
      
      <CheckoutSteps currentStep={step} />
      
      {error && (
        <div className="mb-6 p-4 bg-destructive/10 text-destructive border border-destructive/20 rounded-lg flex items-start gap-3">
          <AlertTriangle size={20} className="mt-0.5" />
          <div>{error}</div>
        </div>
      )}

      {step === 1 && (
        <div className="max-w-lg mx-auto">
          <h2 className="text-xl font-bold mb-4">Shipping Information</h2>
          <form onSubmit={handleShippingSubmit}>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2" htmlFor="address">
                Address
              </label>
              <input
                type="text"
                id="address"
                className="w-full p-2 border border-border rounded-md"
                value={shippingAddress.address}
                onChange={(e) => setShippingAddress({ ...shippingAddress, address: e.target.value })}
                required
              />
            </div>
            
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2" htmlFor="city">
                City
              </label>
              <input
                type="text"
                id="city"
                className="w-full p-2 border border-border rounded-md"
                value={shippingAddress.city}
                onChange={(e) => setShippingAddress({ ...shippingAddress, city: e.target.value })}
                required
              />
            </div>
            
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2" htmlFor="postal-code">
                Postal Code
              </label>
              <input
                type="text"
                id="postal-code"
                className="w-full p-2 border border-border rounded-md"
                value={shippingAddress.postalCode}
                onChange={(e) => setShippingAddress({ ...shippingAddress, postalCode: e.target.value })}
                required
              />
            </div>
            
            <div className="mb-6">
              <label className="block text-sm font-medium mb-2" htmlFor="country">
                Country
              </label>
              <input
                type="text"
                id="country"
                className="w-full p-2 border border-border rounded-md"
                value={shippingAddress.country}
                onChange={(e) => setShippingAddress({ ...shippingAddress, country: e.target.value })}
                required
              />
            </div>
            
            <button 
              type="submit" 
              className="w-full py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
            >
              Continue to Payment
            </button>
          </form>
        </div>
      )}
      
      {step === 2 && (
        <div className="max-w-lg mx-auto">
          <h2 className="text-xl font-bold mb-4">Order Summary</h2>
          
          <div className="border border-border rounded-lg mb-6 overflow-hidden">
            <div className="p-4 bg-muted/40">
              <h3 className="font-medium">Items ({cart.length})</h3>
            </div>
            
            <div className="p-4 border-t border-border">
              <ul className="divide-y divide-border">
                {cart.map((item) => (
                  <li key={item._id} className="py-3 flex justify-between items-center">
                    <div className="flex items-center">
                      <img 
                        src={item.image} 
                        alt={item.name} 
                        className="w-12 h-12 object-cover rounded" 
                      />
                      <div className="ml-3">
                        <p className="font-medium">{item.name}</p>
                        <p className="text-sm text-muted-foreground">Qty: {item.quantity}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">${(item.price * item.quantity).toFixed(2)}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
            
            <div className="p-4 border-t border-border bg-muted/40">
              <div className="flex justify-between mb-2">
                <span>Items Total:</span>
                <span>${itemsPrice.toFixed(2)}</span>
              </div>
              <div className="flex justify-between mb-2">
                <span>Shipping:</span>
                <span>${shippingPrice.toFixed(2)}</span>
              </div>
              <div className="flex justify-between mb-2">
                <span>Tax:</span>
                <span>${taxPrice.toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-bold">
                <span>Total:</span>
                <span>${totalPrice.toFixed(2)}</span>
              </div>
            </div>
          </div>
          
          <div className="flex justify-between mb-8">
            <button
              type="button"
              onClick={() => setStep(1)}
              className="px-4 py-2 border border-border rounded-md hover:bg-accent transition-colors"
            >
              Back
            </button>
            
            <button
              type="button"
              onClick={createOrder}
              disabled={loading}
              className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors disabled:opacity-70 flex items-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  Processing...
                </>
              ) : (
                'Place Order'
              )}
            </button>
          </div>
        </div>
      )}
      
      {step === 3 && (
        <div className="max-w-lg mx-auto">
          <h2 className="text-xl font-bold mb-4">
            {paymentCompleted ? 'Order Complete!' : 'Complete Payment'}
          </h2>
          
          {paymentCompleted ? (
            <div className="text-center py-8">
              <div className="mb-4 flex justify-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                  <Check size={32} className="text-green-500" />
                </div>
              </div>
              <h3 className="text-xl font-bold mb-2">Thank You For Your Order!</h3>
              <p className="mb-6">Your order has been placed and is being processed.</p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button 
                  type="button"
                  onClick={() => navigate(`/order/${createdOrder._id}`)}
                  className="px-6 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
                >
                  View Order
                </button>
                <button 
                  type="button"
                  onClick={() => navigate('/')}
                  className="px-6 py-2 border border-border rounded-md hover:bg-accent transition-colors"
                >
                  Continue Shopping
                </button>
              </div>
            </div>
          ) : (
            <>
              <p className="mb-4">Complete your payment to finish your order.</p>
              <div className="border border-border rounded-lg p-4 mb-6 bg-muted/30">
                <div className="flex justify-between mb-2">
                  <span className="font-medium">Order Number:</span>
                  <span>{createdOrder?._id}</span>
                </div>
                <div className="flex justify-between mb-2">
                  <span className="font-medium">Order Total:</span>
                  <span className="font-bold">${totalPrice.toFixed(2)}</span>
                </div>
              </div>
              
              <PaymentForm 
                orderId={createdOrder?._id}
                amount={totalPrice}
                onPaymentSuccess={handlePaymentSuccess}
                onPaymentError={handlePaymentError}
              />
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default CheckoutPage; 