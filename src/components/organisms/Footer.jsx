import { Link } from "react-router-dom";
import ApperIcon from "@/components/ApperIcon";

const Footer = () => {
  return (
    <footer className="bg-gradient-to-b from-surface to-white border-t border-secondary/20 mt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div>
            <Link to="/" className="flex items-center gap-3 mb-4 group">
              <div className="w-10 h-10 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center group-hover:scale-105 transition-transform">
                <ApperIcon name="Sparkles" className="text-white" size={24} />
              </div>
              <span className="font-display font-bold text-xl bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                Artisan Bazaar
              </span>
            </Link>
            <p className="text-gray-600 text-sm">
              Discover unique handcrafted treasures from talented artisans around the world.
            </p>
          </div>

          <div>
            <h3 className="font-display font-bold text-gray-900 mb-4">Shop</h3>
            <ul className="space-y-2">
              <li><Link to="/browse" className="text-gray-600 hover:text-primary transition-colors">Browse All</Link></li>
              <li><Link to="/browse?category=Home+%26+Living" className="text-gray-600 hover:text-primary transition-colors">Home & Living</Link></li>
              <li><Link to="/browse?category=Jewelry" className="text-gray-600 hover:text-primary transition-colors">Jewelry</Link></li>
              <li><Link to="/browse?category=Art+%26+Collectibles" className="text-gray-600 hover:text-primary transition-colors">Art</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-display font-bold text-gray-900 mb-4">Sell</h3>
            <ul className="space-y-2">
              <li><Link to="/sell" className="text-gray-600 hover:text-primary transition-colors">Start Selling</Link></li>
              <li><Link to="/seller-guide" className="text-gray-600 hover:text-primary transition-colors">Seller Guide</Link></li>
              <li><Link to="/pricing" className="text-gray-600 hover:text-primary transition-colors">Pricing</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-display font-bold text-gray-900 mb-4">Trust & Safety</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <ApperIcon name="Shield" size={18} className="text-success" />
                Secure Payments
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <ApperIcon name="Award" size={18} className="text-success" />
                Verified Sellers
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <ApperIcon name="PackageCheck" size={18} className="text-success" />
                Quality Guaranteed
              </div>
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-secondary/20 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-gray-600 text-sm">
            © 2024 Artisan Bazaar. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <a href="#" className="text-gray-600 hover:text-primary transition-colors">
              <ApperIcon name="Instagram" size={20} />
            </a>
            <a href="#" className="text-gray-600 hover:text-primary transition-colors">
              <ApperIcon name="Facebook" size={20} />
            </a>
            <a href="#" className="text-gray-600 hover:text-primary transition-colors">
              <ApperIcon name="Twitter" size={20} />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;