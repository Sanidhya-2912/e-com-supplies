import { useState } from "react";
import { Link } from "react-router-dom";
import { Package, ChevronDown, ChevronUp, ExternalLink } from "lucide-react";
import { useAuth } from "../context/AuthContext";

export default function Orders() {
  const { user } = useAuth();
  const [expandedOrder, setExpandedOrder] = useState(null);

  // Mock order data
  const orders = [
    {
      id: "ORD-1234",
      date: "June 15, 2023",
      status: "Delivered",
      total: 49.99,
      items: [
        { id: 1, name: "Premium Leather Notebook", price: 24.99, quantity: 1, image: "https://images.unsplash.com/photo-1583336663277-620dc1996580?ixlib=rb-4.0.3" },
        { id: 2, name: "Fountain Pen Set", price: 39.99, quantity: 1, image: "https://images.unsplash.com/photo-1607522370275-f14206abe5d3?ixlib=rb-4.0.3" },
      ],
      shipping: {
        address: "123 Main St, San Francisco, CA 94105",
        method: "Standard Shipping",
        cost: 5.99,
      },
      payment: {
        method: "Credit Card",
        last4: "4242",
      }
    },
    {
      id: "ORD-5678",
      date: "May 22, 2023",
      status: "Processing",
      total: 29.99,
      items: [
        { id: 3, name: "Desk USB Hub", price: 24.99, quantity: 1, image: "https://images.unsplash.com/photo-1619658235752-7bafdcfe2684?ixlib=rb-4.0.3" },
        { id: 4, name: "Gel Ink Pens (12 Colors)", price: 11.99, quantity: 1, image: "https://images.unsplash.com/photo-1566213727810-c363678786fc?ixlib=rb-4.0.3" },
      ],
      shipping: {
        address: "123 Main St, San Francisco, CA 94105",
        method: "Express Shipping",
        cost: 9.99,
      },
      payment: {
        method: "PayPal",
        email: "j***@example.com",
      }
    },
    {
      id: "ORD-9012",
      date: "April 10, 2023",
      status: "Delivered",
      total: 79.99,
      items: [
        { id: 5, name: "Wireless Charging Desk Lamp", price: 49.99, quantity: 1, image: "https://images.unsplash.com/photo-1534621668293-073231f8598e?ixlib=rb-4.0.3" },
        { id: 6, name: "Desk Pad Protector", price: 14.99, quantity: 2, image: "https://images.unsplash.com/photo-1598212537293-5f068e169291?ixlib=rb-4.0.3" },
      ],
      shipping: {
        address: "456 Market St, San Francisco, CA 94103",
        method: "Standard Shipping",
        cost: 5.99,
      },
      payment: {
        method: "Credit Card",
        last4: "1234",
      }
    },
  ];

  const toggleOrderExpand = (orderId) => {
    if (expandedOrder === orderId) {
      setExpandedOrder(null);
    } else {
      setExpandedOrder(orderId);
    }
  };

  if (!user) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Please Log In</h1>
          <p className="mb-6 text-muted-foreground">You need to be logged in to view your orders.</p>
          <Link 
            to="/login"
            className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
          >
            Go to Login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center mb-6">
        <Package className="mr-2" size={24} />
        <h1 className="text-3xl font-bold">My Orders</h1>
      </div>

      {orders.length > 0 ? (
        <div className="space-y-4">
          {orders.map((order) => (
            <div key={order.id} className="border border-border rounded-lg overflow-hidden">
              {/* Order Header */}
              <div 
                className="flex flex-col md:flex-row md:items-center justify-between p-4 bg-background cursor-pointer"
                onClick={() => toggleOrderExpand(order.id)}
              >
                <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-8">
                  <div>
                    <span className="text-sm text-muted-foreground">Order #:</span>
                    <span className="font-medium ml-1">{order.id}</span>
                  </div>
                  <div>
                    <span className="text-sm text-muted-foreground">Placed on:</span>
                    <span className="font-medium ml-1">{order.date}</span>
                  </div>
                  <div>
                    <span className="text-sm text-muted-foreground">Total:</span>
                    <span className="font-medium ml-1">${order.total.toFixed(2)}</span>
                  </div>
                  <div>
                    <span 
                      className={`px-2 py-1 rounded-full text-xs ${
                        order.status === "Delivered" 
                          ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300" 
                          : "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300"
                      }`}
                    >
                      {order.status}
                    </span>
                  </div>
                </div>
                
                <div className="flex items-center mt-2 md:mt-0">
                  <button 
                    className="flex items-center text-sm text-primary"
                    aria-label={expandedOrder === order.id ? "Collapse order details" : "View order details"}
                  >
                    {expandedOrder === order.id ? (
                      <>
                        <span className="mr-1">Hide Details</span>
                        <ChevronUp size={16} />
                      </>
                    ) : (
                      <>
                        <span className="mr-1">View Details</span>
                        <ChevronDown size={16} />
                      </>
                    )}
                  </button>
                </div>
              </div>
              
              {/* Order Details */}
              {expandedOrder === order.id && (
                <div className="px-4 pb-4 pt-2 border-t border-border">
                  <div className="mb-6">
                    <h3 className="font-medium mb-3">Items</h3>
                    <div className="space-y-3">
                      {order.items.map((item) => (
                        <div key={item.id} className="flex items-center space-x-3">
                          <div className="w-12 h-12 rounded-md overflow-hidden flex-shrink-0">
                            <img 
                              src={item.image} 
                              alt={item.name} 
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="flex-1">
                            <div className="font-medium">{item.name}</div>
                            <div className="text-sm text-muted-foreground">
                              Qty: {item.quantity} × ${item.price.toFixed(2)}
                            </div>
                          </div>
                          <div className="font-medium">
                            ${(item.price * item.quantity).toFixed(2)}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                      <h3 className="font-medium mb-2">Shipping Information</h3>
                      <div className="text-sm">
                        <div className="mb-1">{order.shipping.method}</div>
                        <div className="text-muted-foreground">{order.shipping.address}</div>
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="font-medium mb-2">Payment Method</h3>
                      <div className="text-sm">
                        {order.payment.method}
                        {order.payment.last4 && <span> ending in {order.payment.last4}</span>}
                        {order.payment.email && <span> ({order.payment.email})</span>}
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="font-medium mb-2">Order Summary</h3>
                      <div className="text-sm space-y-1">
                        <div className="flex justify-between">
                          <span>Subtotal:</span>
                          <span>${(order.total - order.shipping.cost).toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Shipping:</span>
                          <span>${order.shipping.cost.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between font-medium pt-1 border-t border-border">
                          <span>Total:</span>
                          <span>${order.total.toFixed(2)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-6 flex justify-end">
                    <Link 
                      to={`/order/${order.id}`}
                      className="flex items-center text-primary hover:text-primary/80"
                    >
                      <span className="mr-1">Track Order</span>
                      <ExternalLink size={14} />
                    </Link>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 border border-border rounded-lg">
          <Package size={48} className="mx-auto text-muted-foreground mb-4" />
          <h2 className="text-xl font-medium mb-2">No Orders Yet</h2>
          <p className="text-muted-foreground mb-6">You haven't placed any orders yet.</p>
          <Link 
            to="/"
            className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
          >
            Start Shopping
          </Link>
        </div>
      )}
    </div>
  );
} 