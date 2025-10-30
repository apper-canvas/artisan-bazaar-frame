import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import SearchBar from "@/components/molecules/SearchBar";

const Header = ({ cartItemCount = 0 }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCategoriesOpen, setIsCategoriesOpen] = useState(false);
  const navigate = useNavigate();

  const handleSearch = (query) => {
    navigate(`/browse?search=${encodeURIComponent(query)}`);
  };

  const categories = [
    "Home & Living",
    "Furniture",
    "Home Decor",
    "Digital Products",
    "Art & Collectibles",
    "Jewelry"
  ];

  return (
    <header className="bg-white border-b border-secondary/20 sticky top-0 z-40 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <div className="flex items-center gap-8">
            <Link to="/" className="flex items-center gap-3 group">
              <div className="w-10 h-10 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center group-hover:scale-105 transition-transform">
                <ApperIcon name="Sparkles" className="text-white" size={24} />
              </div>
              <span className="font-display font-bold text-2xl bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                Artisan Bazaar
              </span>
            </Link>

            <nav className="hidden lg:flex items-center gap-6">
              <div 
                className="relative"
                onMouseEnter={() => setIsCategoriesOpen(true)}
                onMouseLeave={() => setIsCategoriesOpen(false)}
              >
                <button className="flex items-center gap-2 text-gray-700 hover:text-primary transition-colors font-medium">
                  Browse
                  <ApperIcon name="ChevronDown" size={16} />
                </button>
                
                <AnimatePresence>
                  {isCategoriesOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="absolute top-full left-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-secondary/20 py-2 backdrop-blur-lg"
                    >
                      {categories.map((category) => (
                        <Link
                          key={category}
                          to={`/browse?category=${encodeURIComponent(category)}`}
                          className="block px-4 py-2 text-gray-700 hover:bg-surface hover:text-primary transition-colors"
                        >
                          {category}
                        </Link>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <Link to="/sell" className="text-gray-700 hover:text-primary transition-colors font-medium">
                Sell
              </Link>
            </nav>
          </div>

          <div className="hidden md:block flex-1 max-w-2xl mx-8">
            <SearchBar 
              onSearch={handleSearch}
              placeholder="Search for handmade treasures..."
            />
          </div>

          <div className="flex items-center gap-4">
            <Link to="/cart" className="relative p-2 hover:bg-surface rounded-lg transition-colors">
              <ApperIcon name="ShoppingCart" size={24} className="text-gray-700" />
              {cartItemCount > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-r from-accent to-accent/90 text-white text-xs rounded-full flex items-center justify-center font-bold"
                >
                  {cartItemCount}
                </motion.span>
              )}
            </Link>

            <div className="hidden lg:flex items-center gap-3">
              <Button variant="ghost" onClick={() => navigate("/login")}>
                Sign In
              </Button>
              <Button variant="primary" onClick={() => navigate("/register")}>
                Join Now
              </Button>
            </div>

            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 hover:bg-surface rounded-lg transition-colors"
            >
              <ApperIcon name={isMobileMenuOpen ? "X" : "Menu"} size={24} />
            </button>
          </div>
        </div>

        <div className="md:hidden pb-4">
          <SearchBar 
            onSearch={handleSearch}
            placeholder="Search..."
          />
        </div>
      </div>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden border-t border-secondary/20 bg-white"
          >
            <div className="max-w-7xl mx-auto px-4 py-4 space-y-3">
              <Link
                to="/browse"
                className="block px-4 py-2 text-gray-700 hover:bg-surface rounded-lg transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Browse All
              </Link>
              <Link
                to="/sell"
                className="block px-4 py-2 text-gray-700 hover:bg-surface rounded-lg transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Sell
              </Link>
              <div className="pt-3 border-t border-secondary/20 space-y-2">
                <Button 
                  variant="ghost" 
                  className="w-full justify-center"
                  onClick={() => {
                    navigate("/login");
                    setIsMobileMenuOpen(false);
                  }}
                >
                  Sign In
                </Button>
                <Button 
                  variant="primary" 
                  className="w-full justify-center"
                  onClick={() => {
                    navigate("/register");
                    setIsMobileMenuOpen(false);
                  }}
                >
                  Join Now
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Header;