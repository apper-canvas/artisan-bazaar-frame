import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import ApperIcon from "@/components/ApperIcon";
import Card from "@/components/atoms/Card";
import Badge from "@/components/atoms/Badge";
import PriceDisplay from "@/components/molecules/PriceDisplay";
import RatingDisplay from "@/components/molecules/RatingDisplay";

const ProductCard = ({ product, shop }) => {
  const getProductTypeBadge = (type) => {
    const badges = {
      digital: { variant: "info", label: "Digital", icon: "Download" },
      customizable: { variant: "warning", label: "Custom", icon: "Palette" },
      physical: { variant: "default", label: "Handmade", icon: "Package" }
    };
    return badges[type] || badges.physical;
  };

  const badge = getProductTypeBadge(product.productType);

  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
    >
      <Link to={`/product/${product.Id}`}>
        <Card hoverable className="overflow-hidden">
          <div className="relative aspect-[4/5] bg-surface">
            <img
              src={product.images[0]}
              alt={product.title}
              className="w-full h-full object-cover"
            />
            <button className="absolute top-3 right-3 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white transition-colors shadow-lg">
              <ApperIcon name="Heart" size={20} className="text-gray-700" />
            </button>
            <div className="absolute top-3 left-3">
              <Badge variant={badge.variant} className="backdrop-blur-sm">
                <ApperIcon name={badge.icon} size={12} className="mr-1" />
                {badge.label}
              </Badge>
            </div>
          </div>

          <div className="p-4 space-y-3">
            <div>
              <h3 className="font-display font-semibold text-lg text-gray-900 line-clamp-2 mb-1">
                {product.title}
              </h3>
              {shop && (
                <p className="text-sm text-gray-600">by {shop.name}</p>
              )}
            </div>

            <div className="flex items-center justify-between">
              <PriceDisplay price={product.basePrice} className="text-2xl" />
              <RatingDisplay rating={5} count={12} size={14} />
            </div>
          </div>
        </Card>
      </Link>
    </motion.div>
  );
};

export default ProductCard;