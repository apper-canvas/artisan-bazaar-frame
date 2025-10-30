import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import FilterSidebar from "@/components/organisms/FilterSidebar";
import ProductGrid from "@/components/organisms/ProductGrid";
import productService from "@/services/api/productService";
import shopService from "@/services/api/shopService";

const BrowsePage = () => {
  const [searchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [shops, setShops] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    loadData();
  }, [searchParams]);

  const loadData = async () => {
    try {
      setLoading(true);
      setError("");
      
      const category = searchParams.get("category");
      const search = searchParams.get("search");

      let productsData;
      if (search) {
        productsData = await productService.search(search);
      } else if (category) {
        productsData = await productService.getByCategory(category);
      } else {
        productsData = await productService.getAll();
      }

      const shopsData = await shopService.getAll();
      
      setProducts(productsData);
      setFilteredProducts(productsData);
      setShops(shopsData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (filters) => {
    let filtered = [...products];

    if (filters.priceRange) {
      filtered = filtered.filter(p => p.basePrice <= filters.priceRange[1]);
    }

    if (filters.categories.length > 0) {
      filtered = filtered.filter(p => filters.categories.includes(p.category));
    }

    if (filters.productType !== "all") {
      filtered = filtered.filter(p => p.productType === filters.productType);
    }

    setFilteredProducts(filtered);
  };

  const handleSort = (value) => {
    setSortBy(value);
    let sorted = [...filteredProducts];

    switch (value) {
      case "price-low":
        sorted.sort((a, b) => a.basePrice - b.basePrice);
        break;
      case "price-high":
        sorted.sort((a, b) => b.basePrice - a.basePrice);
        break;
      case "newest":
        sorted.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        break;
      default:
        break;
    }

    setFilteredProducts(sorted);
  };

  const category = searchParams.get("category");
  const search = searchParams.get("search");

  if (loading) return <Loading message="Loading products..." />;
  if (error) return <Error message={error} onRetry={loadData} />;

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-surface py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="font-display font-bold text-4xl text-gray-900 mb-2">
            {search ? `Search: "${search}"` : category || "All Products"}
          </h1>
          <p className="text-gray-600">
            {filteredProducts.length} {filteredProducts.length === 1 ? "product" : "products"} found
          </p>
        </div>

        <div className="lg:hidden mb-6">
          <Button
            variant="secondary"
            className="w-full"
            onClick={() => setShowFilters(!showFilters)}
          >
            <ApperIcon name="Filter" size={18} className="mr-2" />
            {showFilters ? "Hide Filters" : "Show Filters"}
          </Button>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          <aside className={`lg:w-64 flex-shrink-0 ${showFilters ? "block" : "hidden lg:block"}`}>
            <FilterSidebar onFilterChange={handleFilterChange} />
          </aside>

          <main className="flex-1">
            <div className="flex items-center justify-between mb-6 bg-white rounded-lg border border-secondary/20 p-4">
              <span className="text-sm text-gray-600">Sort by:</span>
              <select
                value={sortBy}
                onChange={(e) => handleSort(e.target.value)}
                className="px-4 py-2 bg-white border-2 border-secondary/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent"
              >
                <option value="newest">Newest</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
              </select>
            </div>

            {filteredProducts.length === 0 ? (
              <Empty
                icon="Package"
                title="No products found"
                message="Try adjusting your filters or search terms"
                actionLabel="Clear Filters"
                onAction={loadData}
              />
            ) : (
              <ProductGrid products={filteredProducts} shops={shops} />
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

export default BrowsePage;