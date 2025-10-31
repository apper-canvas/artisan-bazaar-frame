import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import categoryService from "@/services/api/categoryService";
import productService from "@/services/api/productService";
import shopService from "@/services/api/shopService";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Card from "@/components/atoms/Card";
import ProductGrid from "@/components/organisms/ProductGrid";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";

const HomePage = () => {
  const navigate = useNavigate();
const [products, setProducts] = useState([]);
  const [shops, setShops] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      setError("");
      const [productsData, shopsData, categoriesData] = await Promise.all([
        productService.getAll(),
        shopService.getAll(),
        categoryService.getAll()
      ]);
      setProducts(productsData.slice(0, 8));
      setShops(shopsData);
      setCategories(categoriesData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loading message="Loading marketplace..." />;
  if (error) return <Error message={error} onRetry={loadData} />;

  return (
    <div className="min-h-screen">
      <section className="relative bg-gradient-to-br from-surface via-white to-surface py-20 px-4 overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-20 left-20 w-72 h-72 bg-accent rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-primary rounded-full blur-3xl" />
        </div>

        <div className="max-w-7xl mx-auto relative">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-4xl mx-auto"
          >
            <h1 className="font-display font-bold text-5xl md:text-7xl text-gray-900 mb-6">
              Discover Unique
              <span className="block bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
                Handcrafted Treasures
              </span>
            </h1>
            <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto">
              Connect with talented artisans and find one-of-a-kind pieces that tell a story. Every item is made with love and care.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
<Button variant="accent" size="lg" onClick={() => navigate("/browse")}>
                <ApperIcon name="Sparkles" size={20} className="mr-2" />
                Start Shopping
              </Button>
              <Button variant="secondary" size="lg" onClick={() => navigate("/sell/register")}>
                <ApperIcon name="Store" size={20} className="mr-2" />
                Become a Seller
              </Button>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-16 grid grid-cols-3 gap-4 md:gap-8 max-w-3xl mx-auto"
          >
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-display font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent mb-2">
                10,000+
              </div>
              <div className="text-sm md:text-base text-gray-600">Artisans</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-display font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent mb-2">
                50,000+
              </div>
              <div className="text-sm md:text-base text-gray-600">Products</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-display font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent mb-2">
                4.9★
              </div>
              <div className="text-sm md:text-base text-gray-600">Rating</div>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="font-display font-bold text-4xl text-gray-900 mb-10 text-center">
            Shop by Category
          </h2>
<div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {categories.map((category, index) => (
              <motion.div
                key={category.Id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
              >
                <Link to={`/browse?category=${encodeURIComponent(category.name)}`}>
                  <Card hoverable className="overflow-hidden">
                    <div className="aspect-square bg-surface">
                      <img
                        src={category.image}
                        alt={category.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="p-4">
                      <h3 className="font-display font-semibold text-gray-900 text-center">
                        {category.name}
                      </h3>
                    </div>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 px-4 bg-gradient-to-b from-white to-surface">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-10">
            <h2 className="font-display font-bold text-4xl text-gray-900">
              Featured Products
            </h2>
            <Link to="/browse">
              <Button variant="ghost">
                View All
                <ApperIcon name="ArrowRight" size={18} className="ml-2" />
              </Button>
            </Link>
          </div>
          <ProductGrid products={products} shops={shops} />
        </div>
      </section>

      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="bg-gradient-to-br from-primary to-accent rounded-3xl p-12 text-center text-white relative overflow-hidden">
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-0 left-0 w-64 h-64 bg-white rounded-full blur-3xl" />
              <div className="absolute bottom-0 right-0 w-80 h-80 bg-white rounded-full blur-3xl" />
            </div>
            <div className="relative">
              <h2 className="font-display font-bold text-4xl mb-4">
                Start Selling Your Craft Today
              </h2>
              <p className="text-xl mb-8 max-w-2xl mx-auto opacity-90">
                Join thousands of artisans who have found success on Artisan Bazaar. Set up your shop in minutes and reach customers worldwide.
              </p>
<Button variant="secondary" size="lg" onClick={() => navigate("/sell/register")}>
                <ApperIcon name="Sparkles" size={20} className="mr-2" />
                Get Started Free
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 px-4 bg-surface">
        <div className="max-w-7xl mx-auto">
          <h2 className="font-display font-bold text-4xl text-gray-900 mb-10 text-center">
            Why Choose Artisan Bazaar
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="p-8 text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-success/20 to-success/30 rounded-full flex items-center justify-center mx-auto mb-4">
                <ApperIcon name="Shield" size={32} className="text-success" />
              </div>
              <h3 className="font-display font-bold text-xl text-gray-900 mb-3">
                Secure Payments
              </h3>
              <p className="text-gray-600">
                Shop with confidence. All transactions are protected with industry-leading security.
              </p>
            </Card>

            <Card className="p-8 text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-accent/20 to-accent/30 rounded-full flex items-center justify-center mx-auto mb-4">
                <ApperIcon name="Award" size={32} className="text-accent" />
              </div>
              <h3 className="font-display font-bold text-xl text-gray-900 mb-3">
                Quality Guaranteed
              </h3>
              <p className="text-gray-600">
                Every item is handcrafted with care by verified artisans who take pride in their work.
              </p>
            </Card>

            <Card className="p-8 text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-info/20 to-info/30 rounded-full flex items-center justify-center mx-auto mb-4">
                <ApperIcon name="Heart" size={32} className="text-info" />
              </div>
              <h3 className="font-display font-bold text-xl text-gray-900 mb-3">
                Support Artisans
              </h3>
              <p className="text-gray-600">
                Your purchase directly supports independent creators and their families.
              </p>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;