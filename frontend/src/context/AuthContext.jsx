import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

const AuthContext = createContext();

// Constants
const API_URL = 'http://localhost:5002';

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : null;
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Setup axios defaults for API calls
  useEffect(() => {
    axios.defaults.baseURL = API_URL;
    axios.defaults.withCredentials = false;
    axios.defaults.headers.common['Access-Control-Allow-Origin'] = '*';
  }, []);

  // Check if user is already logged in
  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const token = localStorage.getItem("token");
        if (token) {
          axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  
          const { data } = await axios.get("/api/users/profile");
  
          const normalizedUser = {  // ✅ This was missing
            id: data._id,
            name: data.name,
            email: data.email,
            isAdmin: data.isAdmin
          };
  
          setUser(normalizedUser);
          localStorage.setItem("user", JSON.stringify(normalizedUser));
        }
      } catch (err) {
        console.error("Auth check error:", err);
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        delete axios.defaults.headers.common['Authorization'];
      } finally {
        setLoading(false);
      }
    };
  
    checkAuthStatus();
  }, []);
  

  // Login function
  const login = async (email, password) => {
    setLoading(true);
    setError(null);
    try {
      await axios.get(`${API_URL}/api/users/test`);
      
      const { data } = await axios.post("/api/users/login", { email, password });

      localStorage.setItem("token", data.token);
      axios.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;

      const userObj = { id: data._id, name: data.name, email: data.email, isAdmin: data.isAdmin };
      setUser(userObj);
      localStorage.setItem("user", JSON.stringify(userObj));

      return data;
    } catch (err) {
      console.error("Login error:", err);
      const message = err.response?.data?.message || "Login failed";
      setError(message);
      throw new Error(message);
    } finally {
      setLoading(false);
    }
    console.log("✅ User after login/register:", user);

  };

  // Register function
  const register = async (name, email, password) => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await axios.post("/api/users/register", { name, email, password });

      localStorage.setItem("token", data.token);
      axios.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;

      const userObj = { id: data._id, name: data.name, email: data.email, isAdmin: data.isAdmin };
      setUser(userObj);
      localStorage.setItem("user", JSON.stringify(userObj));

      return data;
    } catch (err) {
      const message = err.response?.data?.message || "Registration failed";
      setError(message);
      throw new Error(message);
    } finally {
      setLoading(false);
    }
    console.log("✅ User after login/register:", user);

  };

  // Logout function
  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    delete axios.defaults.headers.common['Authorization'];
    setUser(null);
  };

  // Check if user is admin
  const isAdmin = () => {
    return user?.isAdmin === true;
  };

  const value = {
    user,
    loading,
    error,
    login,
    register,
    logout,
    isAdmin,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
