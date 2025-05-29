import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Search, Mic, Filter, X } from 'lucide-react';
import useVoiceSearch from '../lib/hooks/useVoiceSearch';

// Sample product data (replace with API calls in real app)
const dummyProducts = [
  { id: '1', name: 'Premium Notebook', category: 'notebooks', price: 12.99, description: 'Hardcover notebook' },
  { id: '2', name: 'Gel Pens (Pack of 10)', category: 'pens', price: 9.99, description: 'Smooth writing pens' },
  // Add more products here...
];

const SearchResults = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialQuery = searchParams.get('q')  ||'';

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [filtersOpen, setFiltersOpen] = useState(false);

  const { 
    isListening, 
    transcript, 
    browserSupportsSpeechRecognition, 
    resetTranscript,
    toggleListening
  } = useVoiceSearch({
    onResult: (text) => setSearchQuery(text)
  });

  // Fetch products based on query
  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      const filtered = initialQuery
        ? dummyProducts.filter((p) =>
            p.name.toLowerCase().includes(initialQuery.toLowerCase()) ||
            p.description.toLowerCase().includes(initialQuery.toLowerCase()) ||
            p.category.toLowerCase().includes(initialQuery.toLowerCase())
          )
        : dummyProducts;
      setProducts(filtered);
      setLoading(false);
    }, 500);
  }, [initialQuery]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setSearchParams({ q: searchQuery.trim() });
    resetTranscript();
  };

  const handleVoiceSearch = () => {
    if (!browserSupportsSpeechRecognition) {
      alert('Your browser does not support voice search.');
      return;
    }
    toggleListening();
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-4">Search Results for "{initialQuery}"</h1>

      {/* Search Bar */}
      <form onSubmit={handleSearchSubmit} className="mb-6">
        <div className="flex gap-2">
          <div className="relative flex-1">
            <input
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search products..."
              className="w-full py-3 px-4 pr-20 rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center gap-2">
              {searchQuery && (
                <button type="button" onClick={() => setSearchQuery('')} className="p-1 rounded-full hover:bg-accent">
                  <X size={18} className="text-muted-foreground" />
                </button>
              )}
              <button
                type="button"
                onClick={handleVoiceSearch}
                className={`p-1 rounded-full ${isListening ? 'bg-primary text-white' : 'hover:bg-accent'}`}
              >
                <Mic size={18} className={isListening ? 'animate-pulse' : ''} />
              </button>
              <button type="submit" className="p-1 rounded-full hover:bg-accent">
                <Search size={18} className="text-muted-foreground" />
              </button>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setFiltersOpen(!filtersOpen)}
            className={`px-4 py-3 rounded-lg border border-border ${
              filtersOpen ? 'bg-accent' : 'bg-background'
            }`}
          >
            <Filter size={18} />
          </button>
        </div>
      </form>

      {/* Filter Panel */}

      {filtersOpen && (
        <div className="bg-background border border-border rounded-lg p-4 mb-6">
          <h2 className="font-medium mb-4">Filter Panel (To be implemented)</h2>
          {/* Add your filters here */}
        </div>
      )}

      {/* Loading */}
      {loading ? (
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      ) : products.length === 0 ? (
        <div className="text-center py-10">
          <h2 className="text-xl font-bold mb-2">No results found</h2>
          <p className="text-muted-foreground">Try different keywords or voice search.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map((product) => (
            <Link
              key={product.id}
              to={`/products/${product.id}`}
              className="group bg-background border border-border rounded-lg overflow-hidden hover:shadow-md"
            >
              <div className="aspect-square bg-muted flex items-center justify-center">
                <span className="text-muted-foreground text-2xl">{product.name[0]}</span>
              </div>
              <div className="p-4">
                <h3 className="font-medium group-hover:text-primary">{product.name}</h3>
                <p className="text-sm text-muted-foreground">{product.category}</p>
                <p className="font-medium">${product.price.toFixed(2)}</p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchResults;
