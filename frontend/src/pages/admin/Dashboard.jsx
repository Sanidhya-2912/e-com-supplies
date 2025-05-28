import { useState } from "react";
import { Link } from "react-router-dom";
import { 
  BarChart, 
  Users, 
  Package, 
  CreditCard, 
  DollarSign, 
  ShoppingCart, 
  TrendingUp,
  ChevronDown,
  Search,
  Plus 
} from "lucide-react";

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState("overview");
  const [searchQuery, setSearchQuery] = useState("");

  // Mock data
  const stats = [
    {
      title: "Total Sales",
      value: "$12,345.67",
      change: "+12.5%",
      trend: "up",
      icon: <DollarSign className="h-6 w-6" />,
    },
    {
      title: "New Customers",
      value: "123",
      change: "+5.2%",
      trend: "up",
      icon: <Users className="h-6 w-6" />,
    },
    {
      title: "Total Orders",
      value: "456",
      change: "+8.1%",
      trend: "up",
      icon: <ShoppingCart className="h-6 w-6" />,
    },
    {
      title: "Products",
      value: "89",
      change: "+3.7%",
      trend: "up",
      icon: <Package className="h-6 w-6" />,
    },
  ];

  const recentOrders = [
    {
      id: "ORD-001",
      customer: "John Smith",
      date: "2023-04-15",
      amount: "$124.99",
      status: "Completed",
    },
    {
      id: "ORD-002",
      customer: "Emma Johnson",
      date: "2023-04-14",
      amount: "$75.50",
      status: "Processing",
    },
    {
      id: "ORD-003",
      customer: "Michael Brown",
      date: "2023-04-14",
      amount: "$249.99",
      status: "Completed",
    },
    {
      id: "ORD-004",
      customer: "Sarah Wilson",
      date: "2023-04-13",
      amount: "$32.50",
      status: "Shipped",
    },
    {
      id: "ORD-005",
      customer: "David Lee",
      date: "2023-04-12",
      amount: "$199.99",
      status: "Completed",
    },
  ];

  const topProducts = [
    {
      id: 1,
      name: "Premium Leather Notebook",
      image: "https://images.unsplash.com/photo-1544816155-12df9643f363?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=987&q=80",
      sales: 124,
      stock: 45,
    },
    {
      id: 2,
      name: "Ergonomic Desk Organizer",
      image: "https://images.unsplash.com/photo-1558051815-0f18e64e6280?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=989&q=80",
      sales: 98,
      stock: 32,
    },
    {
      id: 3,
      name: "Fountain Pen Set",
      image: "https://images.unsplash.com/photo-1583485088034-697b5bc1b13a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=975&q=80",
      sales: 87,
      stock: 18,
    },
  ];

  // Filter orders based on search query
  const filteredOrders = recentOrders.filter(
    (order) =>
      order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
        <h1 className="text-2xl font-bold mb-4 md:mb-0">Admin Dashboard</h1>
        <div className="flex space-x-2">
          <button className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors flex items-center">
            <Plus size={16} className="mr-2" />
            Add Product
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="mb-8 border-b border-border">
        <nav className="flex space-x-8">
          <button
            onClick={() => setActiveTab("overview")}
            className={`pb-4 font-medium text-sm flex items-center ${
              activeTab === "overview"
                ? "border-b-2 border-primary text-primary"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <BarChart size={16} className="mr-2" />
            Overview
          </button>
          <button
            onClick={() => setActiveTab("products")}
            className={`pb-4 font-medium text-sm flex items-center ${
              activeTab === "products"
                ? "border-b-2 border-primary text-primary"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Package size={16} className="mr-2" />
            Products
          </button>
          <button
            onClick={() => setActiveTab("orders")}
            className={`pb-4 font-medium text-sm flex items-center ${
              activeTab === "orders"
                ? "border-b-2 border-primary text-primary"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <ShoppingCart size={16} className="mr-2" />
            Orders
          </button>
          <button
            onClick={() => setActiveTab("customers")}
            className={`pb-4 font-medium text-sm flex items-center ${
              activeTab === "customers"
                ? "border-b-2 border-primary text-primary"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Users size={16} className="mr-2" />
            Customers
          </button>
        </nav>
      </div>

      {activeTab === "overview" && (
        <div>
          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {stats.map((stat, index) => (
              <div
                key={index}
                className="bg-background border border-border rounded-lg p-6"
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground mb-1">
                      {stat.title}
                    </p>
                    <h3 className="text-2xl font-bold">{stat.value}</h3>
                  </div>
                  <div className="p-2 bg-primary/10 text-primary rounded">
                    {stat.icon}
                  </div>
                </div>
                <div className="flex items-center">
                  {stat.trend === "up" ? (
                    <TrendingUp size={16} className="text-green-500 mr-1" />
                  ) : (
                    <ChevronDown size={16} className="text-red-500 mr-1" />
                  )}
                  <span
                    className={`text-sm ${
                      stat.trend === "up" ? "text-green-500" : "text-red-500"
                    }`}
                  >
                    {stat.change} from last month
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Recent Orders */}
          <div className="bg-background border border-border rounded-lg mb-8">
            <div className="p-6 border-b border-border">
              <h2 className="font-semibold">Recent Orders</h2>
            </div>
            <div className="p-6">
              <div className="mb-4">
                <div className="relative">
                  <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
                  <input
                    type="text"
                    placeholder="Search orders..."
                    className="w-full pl-9 pr-4 py-2 border border-border rounded-md focus:ring-2 focus:ring-primary/20 focus:border-primary"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="text-left text-sm text-muted-foreground">
                      <th className="pb-3 font-medium">Order ID</th>
                      <th className="pb-3 font-medium">Customer</th>
                      <th className="pb-3 font-medium">Date</th>
                      <th className="pb-3 font-medium">Amount</th>
                      <th className="pb-3 font-medium">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredOrders.map((order) => (
                      <tr key={order.id} className="border-t border-border">
                        <td className="py-4">
                          <Link to={`/admin/orders/${order.id}`} className="font-medium text-primary hover:underline">
                            {order.id}
                          </Link>
                        </td>
                        <td className="py-4">{order.customer}</td>
                        <td className="py-4">{order.date}</td>
                        <td className="py-4">{order.amount}</td>
                        <td className="py-4">
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              order.status === "Completed"
                                ? "bg-green-100 text-green-800"
                                : order.status === "Processing"
                                ? "bg-blue-100 text-blue-800"
                                : "bg-yellow-100 text-yellow-800"
                            }`}
                          >
                            {order.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Top Products */}
          <div className="bg-background border border-border rounded-lg">
            <div className="p-6 border-b border-border">
              <h2 className="font-semibold">Top Selling Products</h2>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {topProducts.map((product) => (
                  <div
                    key={product.id}
                    className="flex items-center justify-between"
                  >
                    <div className="flex items-center">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-12 h-12 object-cover rounded mr-4"
                      />
                      <div>
                        <h3 className="font-medium">{product.name}</h3>
                        <p className="text-sm text-muted-foreground">
                          {product.stock} in stock
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">{product.sales} sold</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === "products" && (
        <div className="bg-background border border-border rounded-lg p-6">
          <h2 className="font-semibold mb-4">Products Management</h2>
          <p className="text-muted-foreground">
            This section is under development. Coming soon!
          </p>
        </div>
      )}

      {activeTab === "orders" && (
        <div className="bg-background border border-border rounded-lg p-6">
          <h2 className="font-semibold mb-4">Orders Management</h2>
          <p className="text-muted-foreground">
            This section is under development. Coming soon!
          </p>
        </div>
      )}

      {activeTab === "customers" && (
        <div className="bg-background border border-border rounded-lg p-6">
          <h2 className="font-semibold mb-4">Customers Management</h2>
          <p className="text-muted-foreground">
            This section is under development. Coming soon!
          </p>
        </div>
      )}
    </div>
  );
} 