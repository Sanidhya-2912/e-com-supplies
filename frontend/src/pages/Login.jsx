import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, AlertCircle, Wifi, WifiOff } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import axios from "axios";

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [serverStatus, setServerStatus] = useState('checking'); // 'checking', 'online', 'offline'

  // Check if backend server is running
  useEffect(() => {
    const checkServerStatus = async () => {
      try {
        await axios.get('http://localhost:5002/api/users/test');
        setServerStatus('online');
      } catch (err) {
        console.error("Server connection error:", err);
        setServerStatus('offline');
      }
    };

    checkServerStatus();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    // Clear error when user starts typing again
    if (error) setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    // Basic validation
    if (!formData.email || !formData.password) {
      setError("Email and password are required");
      setIsLoading(false);
      return;
    }

    // Server offline check
    if (serverStatus === 'offline') {
      setError("Cannot connect to server. Please try again later.");
      setIsLoading(false);
      return;
    }

    try {
      await login(formData.email, formData.password);
      navigate("/");
    } catch (err) {
      setError(err.message || "Invalid email or password. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Demo login helper function
  const handleDemoLogin = async () => {
    setError("");
    setIsLoading(true);
    try {
      await login("admin@example.com", "123456");
      navigate("/");
    } catch (err) {
      setError(err.message || "Demo login failed. Please try with regular login.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="bg-background border border-border rounded-lg p-8 shadow-sm">
          <h1 className="text-2xl font-bold mb-6 text-center">Login to Your Account</h1>

          {/* Server status indicator */}
          <div className="flex items-center justify-center mb-4">
            {serverStatus === 'checking' ? (
              <span className="text-xs flex items-center text-muted-foreground">
                <span className="mr-1 inline-block w-2 h-2 rounded-full bg-yellow-400 animate-pulse"></span>
                Checking server status...
              </span>
            ) : serverStatus === 'online' ? (
              <span className="text-xs flex items-center text-green-600">
                <Wifi size={14} className="mr-1" />
                Server connected
              </span>
            ) : (
              <span className="text-xs flex items-center text-red-600">
                <WifiOff size={14} className="mr-1" />
                Server offline - login unavailable
              </span>
            )}
          </div>

          {error && (
            <div className="mb-4 p-3 rounded-md bg-red-50 border border-red-200 text-red-600 text-sm flex items-center">
              <AlertCircle size={16} className="mr-2 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label htmlFor="email" className="block mb-2 text-sm font-medium text-foreground">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="w-full p-2.5 border border-border rounded-md focus:ring-2 focus:ring-primary/20 focus:border-primary text-foreground dark:text-foreground dark:placeholder:text-muted-foreground/70"
                required
                autoComplete="email"
                disabled={serverStatus === 'offline'}
              />
            </div>

            <div className="mb-6">
              <label htmlFor="password" className="block mb-2 text-sm font-medium text-foreground">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="w-full p-2.5 border border-border rounded-md focus:ring-2 focus:ring-primary/20 focus:border-primary text-foreground dark:text-foreground dark:placeholder:text-muted-foreground/70"
                  required
                  autoComplete="current-password"
                  disabled={serverStatus === 'offline'}
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={serverStatus === 'offline'}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              <div className="mt-2 text-right">
                <Link to="/forgot-password" className="text-sm text-primary hover:text-primary/80">
                  Forgot password?
                </Link>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 px-4 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors focus:ring-2 focus:ring-primary/20 disabled:opacity-70"
              disabled={isLoading || serverStatus === 'offline'}
            >
              {isLoading ? (
                <span className="flex items-center justify-center">
                  <svg
                    className="animate-spin -ml-1 mr-2 h-4 w-4"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Logging in...
                </span>
              ) : (
                "Log in"
              )}
            </button>
          </form>

          {/* Demo login button */}
          {serverStatus !== 'offline' && (
            <div className="mt-4">
              <button 
                onClick={handleDemoLogin}
                className="w-full py-2 border border-primary text-primary hover:bg-primary/5 rounded-md transition-colors"
                disabled={isLoading}
              >
                Demo Login (admin@example.com)
              </button>
            </div>
          )}

          <div className="mt-6 text-center">
            <span className="text-muted-foreground">Don't have an account?</span>{" "}
            <Link to="/register" className="text-primary hover:text-primary/80">
              Sign up
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
} 