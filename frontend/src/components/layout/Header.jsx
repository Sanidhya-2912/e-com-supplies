import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Sun, Moon, ShoppingCart, Heart, Menu, X, Search, User, LogOut, Mic, AlertTriangle, WifiOff } from "lucide-react";
import { useTheme } from "../../context/ThemeContext";
import { useAuth } from "../../context/AuthContext";
import { useCart } from "../../context/CartContext";
import useVoiceSearch from "../../lib/hooks/useVoiceSearch";
import VoiceSearchToast from "../utils/VoiceSearchToast";

export default function Header() {
  const { theme, toggleTheme } = useTheme();
  const { user, logout } = useAuth();
  const { getCartCount } = useCart();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const navigate = useNavigate();

  const { 
    isListening, 
    errorMessage, 
    toggleListening,
    browserSupportsSpeechRecognition,
    searchText,
    resetTranscript,
    transcript,
    isOnline
  } = useVoiceSearch({
    onResult: (text) => setSearchQuery(text)
  });

  useEffect(() => {
    if (errorMessage) {
      console.error('Voice search error:', errorMessage);
    }
  }, [errorMessage]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery("");
      setIsMenuOpen(false);
      resetTranscript();
    }
  };

  const handleVoiceSearchClick = () => {
    if (!browserSupportsSpeechRecognition || !isOnline) {
      const searchText = prompt("Voice search unavailable. Enter your search term:", "");
      if (searchText?.trim()) {
        setSearchQuery(searchText.trim());
        navigate(`/search?q=${encodeURIComponent(searchText.trim())}`);
      }
      return;
    }
    toggleListening();
  };

  const renderMicButton = () => {
    let buttonClass = "p-1 rounded-full";
    let iconElement = <Mic size={18} />;
    let tooltipText = "Search with voice";

    if (!browserSupportsSpeechRecognition) {
      buttonClass += " text-destructive hover:bg-destructive/10";
      iconElement = <AlertTriangle size={18} />;
      tooltipText = "Voice search unavailable in this browser";
    } else if (!isOnline) {
      buttonClass += " text-amber-500 hover:bg-amber-500/10";
      iconElement = <WifiOff size={18} />;
      tooltipText = "Voice search requires internet connection";
    } else if (isListening) {
      buttonClass += " bg-primary text-white";
      iconElement = <Mic size={18} className="animate-pulse" />;
      tooltipText = "Listening... click to stop";
    } else {
      buttonClass += " hover:bg-accent";
    }

    return (
      <button 
        type="button" 
        onClick={handleVoiceSearchClick}
        className={buttonClass}
        title={tooltipText}
        disabled={!isOnline && !isListening}
      >
        {iconElement}
      </button>
    );
  };

  return (
    <>
      <header className={`sticky top-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-background/80 backdrop-blur-md shadow-sm' : 'bg-background'}`}>
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center gap-2 font-bold text-2xl">
              <span className="text-primary">Office</span>
              <span>Supplies</span>
            </Link>

            <nav className="hidden md:flex items-center space-x-6">
              <Link to="/categories/notebooks" className="text-foreground hover:text-primary transition-colors">Notebooks</Link>
              <Link to="/categories/pens" className="text-foreground hover:text-primary transition-colors">Pens</Link>
              <Link to="/categories/desk-accessories" className="text-foreground hover:text-primary transition-colors">Desk Accessories</Link>
              <Link to="/categories/electronics" className="text-foreground hover:text-primary transition-colors">Electronics</Link>
            </nav>

            <div className="hidden md:flex relative flex-1 max-w-md mx-6">
              <form onSubmit={handleSearch} className="w-full">
                <div className="relative">
                  <input
                    type="search"
                    placeholder={browserSupportsSpeechRecognition ? "Search products or click mic to search by voice..." : "Search products..."}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full py-2 px-4 pr-20 rounded-full border border-border focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center gap-2">
                    {renderMicButton()}
                    <button type="submit" className="p-1 rounded-full hover:bg-accent">
                      <Search size={18} className="text-muted-foreground" />
                    </button>
                  </div>
                </div>
              </form>
            </div>

            <div className="hidden md:flex items-center space-x-4">
              <button onClick={toggleTheme} className="p-2 rounded-full hover:bg-accent transition-colors" aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}>
                {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
              </button>

              <Link to="/wishlist" className="p-2 rounded-full hover:bg-accent transition-colors">
                <Heart size={20} />
              </Link>

              <Link to="/cart" className="relative p-2 rounded-full hover:bg-accent transition-colors">
                <ShoppingCart size={20} />
                {getCartCount() > 0 && (
                  <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {getCartCount()}
                  </span>
                )}
              </Link>

              {user ? (
                <div 
                  className="relative"
                  onMouseEnter={() => setShowProfileMenu(true)}
                  onMouseLeave={() => setShowProfileMenu(false)}
                >
                  <button className="flex items-center space-x-1 p-2 rounded-full hover:bg-accent transition-colors">
                    <User size={20} />
                  </button>
                  {showProfileMenu && (
                    <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-background border border-border">
                      {user.isAdmin && (
                        <Link to="/admin" className="block px-4 py-2 text-sm hover:bg-accent transition-colors" onClick={() => setShowProfileMenu(false)}>Admin Dashboard</Link>
                      )}
                      <Link to="/profile" className="block px-4 py-2 text-sm hover:bg-accent transition-colors" onClick={() => setShowProfileMenu(false)}>My Profile</Link>
                      <Link to="/orders" className="block px-4 py-2 text-sm hover:bg-accent transition-colors" onClick={() => setShowProfileMenu(false)}>My Orders</Link>
                      <button onClick={() => { logout(); setShowProfileMenu(false); }} className="flex w-full items-center px-4 py-2 text-sm text-destructive hover:bg-accent transition-colors">
                        <LogOut size={16} className="mr-2" /> Logout
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <Link to="/login" className="px-4 py-2 rounded-full bg-primary text-primary-foreground hover:bg-primary/90 transition-colors">
                  Login
                </Link>
              )}
            </div>

            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="p-2 md:hidden rounded-full hover:bg-accent transition-colors">
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </header>

      <VoiceSearchToast isListening={isListening} transcript={transcript} errorMessage={errorMessage} />
    </>
  );
}
