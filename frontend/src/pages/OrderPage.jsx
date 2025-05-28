import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { AlertCircle, Package, Truck, CreditCard, CheckCircle, Loader2 } from 'lucide-react';
import PaymentForm from '../components/payment/PaymentForm';

// API base URL - using port 5002 as seen in terminal output
const API_URL = 'http://localhost:5002/api';

const OrderPage = () => {
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  
  const { id: orderId } = useParams();
  const { user } = useAuth();
  
  useEffect(() => {
    const fetchOrder = async () => {
      try {
        setLoading(true);
        
        // Get token from localStorage
        const token = localStorage.getItem('userToken');
        
        if (!token) {
          setError('You need to be logged in to view order details');
          setLoading(false);
          return;
        }
        
        const response = await axios.get(
          `${API_URL}/orders/${orderId}`,
          {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`
            }
          }
        );
        
        setOrder(response.data);
      } catch (error) {
        console.error('Error fetching order:', error);
        setError(
          error.response?.data?.message || 
          error.message || 
          'Failed to fetch order details'
        );
      } finally {
        setLoading(false);
      }
    };
    
    if (orderId) {
      fetchOrder();
    }
  }, [orderId]);
  
  const handlePaymentSuccess = async (paymentResult) => {
    try {
      // Get token from localStorage
      const token = localStorage.getItem('userToken');
      
      // Update order to paid status
      await axios.put(
        `${API_URL}/orders/${orderId}/pay`,
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
      
      // Update local order state with new payment information
      setOrder({
        ...order,
        isPaid: true,
        paidAt: new Date().toISOString(),
        paymentResult: {
          id: paymentResult.transactionId,
          status: 'COMPLETED',
          update_time: paymentResult.timestamp,
          email_address: user.email
        }
      });
      
      setPaymentSuccess(true);
    } catch (error) {
      console.error('Payment update error:', error);
      setError(
        error.response?.data?.message || 
        error.message || 
        'Payment was processed but order status update failed'
      );
    }
  };
  
  if (loading) {
    return (
      <div className="container mx-auto px-4 py-16 flex justify-center">
        <div className="flex items-center gap-2">
          <Loader2 size={24} className="animate-spin" />
          <span>Loading order details...</span>
        </div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-destructive/10 text-destructive border border-destructive/20 rounded-lg p-4 flex items-start gap-3">
          <AlertCircle size={20} className="mt-0.5" />
          <div>
            <h2 className="font-medium mb-1">Error</h2>
            <p>{error}</p>
            <Link to="/orders" className="text-primary hover:underline mt-2 inline-block">
              Return to Orders
            </Link>
          </div>
        </div>
      </div>
    );
  }
  
  if (!order) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h2 className="text-xl font-bold mb-4">Order Not Found</h2>
          <p>We couldn't find the order you're looking for.</p>
          <Link to="/orders" className="text-primary hover:underline mt-4 inline-block">
            Back to Orders
          </Link>
        </div>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">Order #{order._id}</h1>
          <p className="text-sm text-muted-foreground">
            Placed on {new Date(order.createdAt).toLocaleDateString()}
          </p>
        </div>
        <Link to="/orders" className="mt-2 md:mt-0 text-primary hover:underline">
          Back to Orders
        </Link>
      </div>
      
      {/* Order Status */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="border border-border rounded-lg p-4 flex items-center gap-3">
          <div className={`p-2 rounded-full ${order.isPaid ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
            <CreditCard size={24} />
          </div>
          <div>
            <h3 className="font-bold">Payment Status</h3>
            <p className="text-sm">
              {order.isPaid ? 
                `Paid on ${new Date(order.paidAt).toLocaleDateString()}` : 
                'Not Paid'}
            </p>
          </div>
        </div>
        
        <div className="border border-border rounded-lg p-4 flex items-center gap-3">
          <div className={`p-2 rounded-full ${order.isDelivered ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
            <Package size={24} />
          </div>
          <div>
            <h3 className="font-bold">Order Status</h3>
            <p className="text-sm">
              {order.isDelivered ? 
                `Delivered on ${new Date(order.deliveredAt).toLocaleDateString()}` : 
                'Processing'}
            </p>
          </div>
        </div>
        
        <div className="border border-border rounded-lg p-4 flex items-center gap-3">
          <div className="p-2 bg-primary/10 text-primary rounded-full">
            <Truck size={24} />
          </div>
          <div>
            <h3 className="font-bold">Delivery Method</h3>
            <p className="text-sm">Standard Shipping</p>
          </div>
        </div>
      </div>
      
      {/* Order Details */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Items and Shipping */}
        <div className="col-span-2">
          {/* Order Items */}
          <div className="border border-border rounded-lg mb-6 overflow-hidden">
            <div className="p-4 bg-muted/40">
              <h2 className="font-bold">Order Items</h2>
            </div>
            
            <div className="divide-y divide-border">
              {order.orderItems.map((item) => (
                <div key={item._id || item.product} className="p-4 flex">
                  <div className="w-16 h-16 mr-4">
                    <img 
                      src={item.image} 
                      alt={item.name} 
                      className="w-full h-full object-cover rounded-md"
                    />
                  </div>
                  <div className="flex-1">
                    <Link to={`/products/${item.product}`} className="font-medium hover:text-primary">
                      {item.name}
                    </Link>
                    <p className="text-sm text-muted-foreground">Qty: {item.qty}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">${(item.price * item.qty).toFixed(2)}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Shipping Address */}
          <div className="border border-border rounded-lg overflow-hidden">
            <div className="p-4 bg-muted/40">
              <h2 className="font-bold">Shipping Address</h2>
            </div>
            <div className="p-4">
              <p>{order.shippingAddress.address}</p>
              <p>
                {order.shippingAddress.city}, {order.shippingAddress.postalCode}
              </p>
              <p>{order.shippingAddress.country}</p>
            </div>
          </div>
        </div>
        
        {/* Order Summary and Payment */}
        <div className="col-span-1">
          {/* Order Summary */}
          <div className="border border-border rounded-lg overflow-hidden mb-6">
            <div className="p-4 bg-muted/40">
              <h2 className="font-bold">Order Summary</h2>
            </div>
            <div className="p-4 space-y-2">
              <div className="flex justify-between">
                <span>Items:</span>
                <span>${order.itemsPrice.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping:</span>
                <span>${order.shippingPrice.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Tax:</span>
                <span>${order.taxPrice.toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-bold pt-2 border-t border-border">
                <span>Total:</span>
                <span>${order.totalPrice.toFixed(2)}</span>
              </div>
            </div>
          </div>
          
          {/* Payment Form (only show if not paid) */}
          {!order.isPaid && (
            <div>
              <h2 className="font-bold mb-4">Payment</h2>
              
              {paymentSuccess ? (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
                  <div className="flex justify-center mb-2">
                    <CheckCircle size={32} className="text-green-500" />
                  </div>
                  <h3 className="font-bold text-green-700">Payment Successful!</h3>
                  <p className="text-sm text-green-600 mt-1">Your payment has been processed.</p>
                </div>
              ) : (
                <PaymentForm 
                  orderId={order._id}
                  amount={order.totalPrice}
                  onPaymentSuccess={handlePaymentSuccess}
                />
              )}
            </div>
          )}
          
          {/* Show payment details if paid */}
          {order.isPaid && order.paymentResult && (
            <div className="border border-green-200 bg-green-50 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle size={18} className="text-green-500" />
                <h3 className="font-bold text-green-700">Payment Completed</h3>
              </div>
              <div className="text-sm text-green-700 space-y-1">
                <p>Transaction ID: {order.paymentResult.id}</p>
                <p>Status: {order.paymentResult.status}</p>
                <p>Date: {new Date(order.paidAt).toLocaleString()}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrderPage; 