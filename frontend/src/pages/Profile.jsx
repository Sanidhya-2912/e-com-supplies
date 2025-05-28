import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { User, Package, Home, Settings, LogOut } from "lucide-react";
import { useAuth } from "../context/AuthContext";

export default function Profile() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("account");

  // Mock data for orders
  const orders = [
    { id: "ORD-1234", date: "2023-06-15", status: "Delivered", total: 49.99 },
    { id: "ORD-5678", date: "2023-05-22", status: "Processing", total: 29.99 },
    { id: "ORD-9012", date: "2023-04-10", status: "Delivered", total: 79.99 },
  ];

  // Mock data for addresses
  const addresses = [
    {
      id: 1,
      type: "Home",
      name: "John Doe",
      street: "123 Main St",
      city: "San Francisco",
      state: "CA",
      zip: "94105",
      default: true,
    },
    {
      id: 2,
      type: "Work",
      name: "John Doe",
      street: "456 Market St",
      city: "San Francisco",
      state: "CA",
      zip: "94103",
      default: false,
    },
  ];

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  // Placeholder for demo purposes
  if (!user) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Please Log In</h1>
          <p className="mb-6 text-muted-foreground">You need to be logged in to view your profile.</p>
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
      <h1 className="text-3xl font-bold mb-8">My Profile</h1>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar Navigation */}
        <div className="w-full md:w-64 space-y-1">
          <button
            onClick={() => setActiveTab("account")}
            className={`flex items-center w-full px-4 py-3 rounded-md transition-colors ${
              activeTab === "account" 
                ? "bg-primary text-primary-foreground" 
                : "hover:bg-accent"
            }`}
          >
            <User className="mr-3" size={18} />
            Account Information
          </button>
          
          <button
            onClick={() => setActiveTab("orders")}
            className={`flex items-center w-full px-4 py-3 rounded-md transition-colors ${
              activeTab === "orders" 
                ? "bg-primary text-primary-foreground" 
                : "hover:bg-accent"
            }`}
          >
            <Package className="mr-3" size={18} />
            My Orders
          </button>
          
          <button
            onClick={() => setActiveTab("addresses")}
            className={`flex items-center w-full px-4 py-3 rounded-md transition-colors ${
              activeTab === "addresses" 
                ? "bg-primary text-primary-foreground" 
                : "hover:bg-accent"
            }`}
          >
            <Home className="mr-3" size={18} />
            My Addresses
          </button>
          
          <button
            onClick={() => setActiveTab("settings")}
            className={`flex items-center w-full px-4 py-3 rounded-md transition-colors ${
              activeTab === "settings" 
                ? "bg-primary text-primary-foreground" 
                : "hover:bg-accent"
            }`}
          >
            <Settings className="mr-3" size={18} />
            Account Settings
          </button>
          
          <button
            onClick={handleLogout}
            className="flex items-center w-full px-4 py-3 text-destructive hover:bg-destructive/10 rounded-md transition-colors"
          >
            <LogOut className="mr-3" size={18} />
            Logout
          </button>
        </div>

        {/* Content Area */}
        <div className="flex-1 bg-background border border-border rounded-lg p-6">
          {/* Account Information */}
          {activeTab === "account" && (
            <div>
              <h2 className="text-xl font-bold mb-4">Account Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-muted-foreground mb-1">
                    Name
                  </label>
                  <div className="p-3 bg-accent/50 rounded-md">
                    {user.name || "John Doe"}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-muted-foreground mb-1">
                    Email
                  </label>
                  <div className="p-3 bg-accent/50 rounded-md">
                    {user.email || "john.doe@example.com"}
                  </div>
                </div>
              </div>
              
              <button className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors">
                Edit Information
              </button>
            </div>
          )}

          {/* Orders Tab */}
          {activeTab === "orders" && (
            <div>
              <h2 className="text-xl font-bold mb-4">My Orders</h2>
              
              {orders.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="border-b border-border">
                      <tr>
                        <th className="text-left py-3 px-2">Order ID</th>
                        <th className="text-left py-3 px-2">Date</th>
                        <th className="text-left py-3 px-2">Status</th>
                        <th className="text-left py-3 px-2">Total</th>
                        <th className="text-right py-3 px-2">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {orders.map((order) => (
                        <tr key={order.id} className="border-b border-border hover:bg-accent/30">
                          <td className="py-3 px-2">{order.id}</td>
                          <td className="py-3 px-2">{order.date}</td>
                          <td className="py-3 px-2">
                            <span 
                              className={`px-2 py-1 rounded-full text-xs ${
                                order.status === "Delivered" 
                                  ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300" 
                                  : "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300"
                              }`}
                            >
                              {order.status}
                            </span>
                          </td>
                          <td className="py-3 px-2">${order.total.toFixed(2)}</td>
                          <td className="py-3 px-2 text-right">
                            <button className="text-primary hover:text-primary/80">
                              View Details
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-12 text-muted-foreground">
                  <p>You haven't placed any orders yet.</p>
                  <Link 
                    to="/"
                    className="mt-4 inline-block px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
                  >
                    Browse Products
                  </Link>
                </div>
              )}
            </div>
          )}

          {/* Addresses Tab */}
          {activeTab === "addresses" && (
            <div>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">My Addresses</h2>
                <button className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors">
                  Add New Address
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                {addresses.map((address) => (
                  <div key={address.id} className="border border-border rounded-lg p-4 relative">
                    {address.default && (
                      <span className="absolute top-2 right-2 bg-primary/10 text-primary text-xs px-2 py-1 rounded-full">
                        Default
                      </span>
                    )}
                    <div className="text-lg font-medium mb-1">{address.type}</div>
                    <div className="text-muted-foreground mb-4">
                      {address.name}<br />
                      {address.street}<br />
                      {address.city}, {address.state} {address.zip}
                    </div>
                    <div className="flex space-x-2">
                      <button className="text-primary hover:text-primary/80 text-sm">
                        Edit
                      </button>
                      {!address.default && (
                        <>
                          <span className="text-muted-foreground">|</span>
                          <button className="text-primary hover:text-primary/80 text-sm">
                            Set as default
                          </button>
                          <span className="text-muted-foreground">|</span>
                          <button className="text-destructive hover:text-destructive/80 text-sm">
                            Remove
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Settings Tab */}
          {activeTab === "settings" && (
            <div>
              <h2 className="text-xl font-bold mb-6">Account Settings</h2>
              
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium mb-3">Change Password</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">
                        Current Password
                      </label>
                      <input 
                        type="password"
                        className="w-full p-2.5 border border-border rounded-md focus:ring-2 focus:ring-primary/20 focus:border-primary"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">
                        New Password
                      </label>
                      <input 
                        type="password"
                        className="w-full p-2.5 border border-border rounded-md focus:ring-2 focus:ring-primary/20 focus:border-primary"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">
                        Confirm New Password
                      </label>
                      <input 
                        type="password"
                        className="w-full p-2.5 border border-border rounded-md focus:ring-2 focus:ring-primary/20 focus:border-primary"
                      />
                    </div>
                    <button className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors">
                      Update Password
                    </button>
                  </div>
                </div>
                
                <div className="pt-6 border-t border-border">
                  <h3 className="text-lg font-medium mb-3">Communication Preferences</h3>
                  <div className="space-y-2">
                    <label className="flex items-center cursor-pointer">
                      <input type="checkbox" className="rounded text-primary focus:ring-primary/20 mr-2" />
                      <span>Receive order updates via email</span>
                    </label>
                    <label className="flex items-center cursor-pointer">
                      <input type="checkbox" className="rounded text-primary focus:ring-primary/20 mr-2" />
                      <span>Receive promotional emails</span>
                    </label>
                  </div>
                  <button className="mt-4 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors">
                    Save Preferences
                  </button>
                </div>
                
                <div className="pt-6 border-t border-border">
                  <h3 className="text-lg font-medium mb-3 text-destructive">Danger Zone</h3>
                  <button className="px-4 py-2 bg-destructive/10 text-destructive rounded-md hover:bg-destructive/20 transition-colors">
                    Delete Account
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 