import { motion } from "framer-motion";
import ProductCard from "./ProductCard";

const ProductGrid = ({ products, shops }) => {
  const getShopForProduct = (productShopId) => {
    return shops?.find(shop => shop.Id === productShopId);
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {products.map((product, index) => (
        <motion.div
          key={product.Id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: index * 0.05 }}
        >
          <ProductCard 
            product={product} 
            shop={getShopForProduct(product.shopId)}
          />
        </motion.div>
      ))}
    </div>
  );
};

export default ProductGrid;