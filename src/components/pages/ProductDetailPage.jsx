import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import Card from "@/components/atoms/Card";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import PriceDisplay from "@/components/molecules/PriceDisplay";
import RatingDisplay from "@/components/molecules/RatingDisplay";
import productService from "@/services/api/productService";
import shopService from "@/services/api/shopService";
import reviewService from "@/services/api/reviewService";
const ProductDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
const [product, setProduct] = useState(null);
  const [shop, setShop] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedVariants, setSelectedVariants] = useState({});
  const [quantity, setQuantity] = useState(1);
  const [selectedSeller, setSelectedSeller] = useState(null);
  const [availableSellers, setAvailableSellers] = useState([]);
  const [variantMatrix, setVariantMatrix] = useState(null);
  const [usedItems, setUsedItems] = useState([]);

useEffect(() => {
    loadData();
  }, [id]);

  const loadData = async () => {
    try {
      setLoading(true);
      setError("");
      const productData = await productService.getById(id);
      const shopData = await shopService.getById(productData.shopId);
      const reviewsData = await reviewService.getByProductId(id);
      
      setProduct(productData);
      setShop(shopData);
      setReviews(reviewsData);
      
      // Set up sellers
      if (productData.sellers && productData.sellers.length > 0) {
        setAvailableSellers(productData.sellers);
        // Select default seller (prime first, then lowest price)
        const primeSeller = productData.sellers.find(s => s.isPrime);
        const defaultSeller = primeSeller || productData.sellers.sort((a, b) => a.price - b.price)[0];
        setSelectedSeller(defaultSeller);
      }

      // Set up variant matrix if available
      if (productData.variantMatrix) {
        setVariantMatrix(productData.variantMatrix);
      }

      // Set up used options
      if (productData.usedOptions) {
        setUsedItems(productData.usedOptions);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

const handleAddToCart = () => {
    const sellerInfo = selectedSeller ? ` from ${selectedSeller.shopName}` : '';
    toast.success(`Added to cart${sellerInfo}!`);
  };

  const handleSelectSeller = (seller) => {
    setSelectedSeller(seller);
    toast.info(`Switched to ${seller.shopName}`);
  };

const handleVariantChange = (variantName, value) => {
    const newVariants = {
      ...selectedVariants,
      [variantName]: value
    };
    setSelectedVariants(newVariants);

    // Update main image based on variant selection
    const variantImage = productService.getCurrentVariantImage(product, newVariants);
    const imageIndex = product.images.indexOf(variantImage);
    if (imageIndex !== -1) {
      setSelectedImage(imageIndex);
    }

    toast.info(`Selected ${variantName}: ${value}`);
  };

  const handleMatrixSelect = (matrixItem) => {
    const newVariants = {
      Color: matrixItem.color,
      Size: matrixItem.size
    };
    setSelectedVariants(newVariants);

    // Update image based on color
    const variantImage = productService.getCurrentVariantImage(product, newVariants);
    const imageIndex = product.images.indexOf(variantImage);
    if (imageIndex !== -1) {
      setSelectedImage(imageIndex);
    }

    toast.success(`Selected ${matrixItem.color} - ${matrixItem.size}`);
  };

  const handleAddUsedToCart = (usedItem) => {
    toast.success(`Added ${usedItem.condition} item to cart from ${usedItem.shopName}!`);
  };

  const getProductTypeBadge = (type) => {
    const badges = {
      digital: { variant: "info", label: "Digital Download", icon: "Download" },
      customizable: { variant: "warning", label: "Customizable", icon: "Palette" },
      physical: { variant: "default", label: "Handmade", icon: "Package" }
    };
    return badges[type] || badges.physical;
  };

if (loading) return <Loading message="Loading product..." />;
  if (error) return <Error message={error} onRetry={loadData} />;
  if (!product) return null;

// Calculate current price based on selected variants
  const variantPrice = productService.getVariantPrice(
    product.basePrice,
    product.variants,
    selectedVariants
  );
  const currentPrice = selectedSeller ? selectedSeller.price : variantPrice;
  const currentStock = selectedSeller ? selectedSeller.stock : product.inventory;
  const badge = getProductTypeBadge(product.productType);

  // Get selected variant stock if applicable
  const getSelectedVariantStock = () => {
    if (variantMatrix && selectedVariants.Color && selectedVariants.Size) {
      const matrixItem = variantMatrix.find(
        item => item.color === selectedVariants.Color && item.size === selectedVariants.Size
      );
      return matrixItem ? matrixItem.stock : currentStock;
    }
    
    if (product.variants && product.variants.length > 0) {
      for (const variant of product.variants) {
        const selectedValue = selectedVariants[variant.name];
        if (selectedValue) {
          const option = variant.options.find(opt => opt.value === selectedValue);
          if (option && option.stock !== undefined) {
            return option.stock;
          }
        }
      }
    }
    return currentStock;
  };

  const displayStock = getSelectedVariantStock();

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-surface py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-600 hover:text-primary mb-6 transition-colors"
        >
          <ApperIcon name="ArrowLeft" size={20} />
          Back
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-12">
          <div>
            <div className="sticky top-24">
<motion.div
                key={selectedImage}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
                className="aspect-square bg-surface rounded-2xl overflow-hidden mb-4 shadow-lg"
              >
                <img
                  src={product.images[selectedImage]}
                  alt={product.title}
                  className="w-full h-full object-cover cursor-zoom-in"
                />
              </motion.div>

              <div className="grid grid-cols-5 gap-3">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`aspect-square rounded-lg overflow-hidden border-2 transition-all ${
                      selectedImage === index
                        ? "border-accent shadow-md scale-105"
                        : "border-transparent hover:border-secondary"
                    }`}
                  >
                    <img
                      src={image}
                      alt={`${product.title} ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <Badge variant={badge.variant} className="mb-4">
                <ApperIcon name={badge.icon} size={14} className="mr-1" />
                {badge.label}
              </Badge>

              <h1 className="font-display font-bold text-4xl text-gray-900 mb-4">
                {product.title}
              </h1>

<div className="flex items-center gap-4 mb-6">
                {selectedSeller && (
                  <RatingDisplay 
                    rating={selectedSeller.rating / 20} 
                    count={selectedSeller.ratingCount} 
                  />
                )}
              </div>

<div className="mb-6">
              <PriceDisplay price={currentPrice} className="text-5xl" />
              {Object.keys(selectedVariants).length > 0 && variantPrice !== product.basePrice && (
                <p className="text-sm text-gray-600 mt-2">
                  Base price: <span className="line-through">${product.basePrice}</span>
                  {' '}
                  <span className="text-accent font-semibold">
                    {variantPrice > product.basePrice ? '+' : ''}
                    ${(variantPrice - product.basePrice).toFixed(2)}
                  </span>
                </p>
              )}
            </div>
              
              {selectedSeller && (
                <div className="mb-6">
                  <div className="flex items-center gap-2 text-sm mb-2">
                    <span className="text-gray-600">Sold by</span>
                    <span className="font-semibold text-gray-900">{selectedSeller.shopName}</span>
                    {selectedSeller.isPrime && (
                      <Badge variant="primary" className="ml-2">
                        <ApperIcon name="Zap" size={12} className="mr-1" />
                        Prime
                      </Badge>
                    )}
                  </div>
                  <div className="text-sm text-gray-600">
                    and Fulfilled by Amazon
                  </div>
                  {selectedSeller.shippingCost === 0 ? (
                    <div className="text-sm text-success font-semibold mt-1">
                      FREE Shipping
                    </div>
                  ) : (
                    <div className="text-sm text-gray-600 mt-1">
                      + ${selectedSeller.shippingCost.toFixed(2)} shipping
                    </div>
                  )}
                  <div className="text-sm text-gray-900 font-semibold mt-1">
                    Arrives in {selectedSeller.deliveryDays} {selectedSeller.deliveryDays === 1 ? 'day' : 'days'}
                  </div>
                </div>
              )}
            </div>

{product.variants.map((variant) => (
              <div key={variant.name}>
                <label className="block text-sm font-bold text-gray-700 mb-3">
                  {variant.name}
                  {selectedVariants[variant.name] && (
                    <span className="ml-2 text-sm font-normal text-gray-600">
                      ({selectedVariants[variant.name]})
                    </span>
                  )}
                </label>
                
                {variant.name === "Color" ? (
                  <div className="flex flex-wrap gap-3">
                    {variant.options.map((option) => {
                      const isSelected = selectedVariants[variant.name] === option.value;
                      const isOutOfStock = option.stock === 0;
                      return (
                        <button
                          key={option.value}
                          onClick={() => !isOutOfStock && handleVariantChange(variant.name, option.value)}
                          disabled={isOutOfStock}
                          className={`group relative ${isOutOfStock ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}`}
                          title={option.value}
                        >
                          <div
                            className={`w-12 h-12 rounded-full border-3 transition-all ${
                              isSelected
                                ? "border-accent shadow-lg scale-110"
                                : "border-gray-300 hover:border-secondary"
                            } ${isOutOfStock ? 'opacity-40' : ''}`}
                            style={{ backgroundColor: option.hex || '#cccccc' }}
                          />
                          {isSelected && (
                            <div className="absolute inset-0 flex items-center justify-center">
                              <ApperIcon name="Check" size={20} className="text-white drop-shadow-md" />
                            </div>
                          )}
                          {isOutOfStock && (
                            <div className="absolute inset-0 flex items-center justify-center">
                              <div className="w-10 h-0.5 bg-gray-400 rotate-45"></div>
                            </div>
                          )}
                          <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap text-xs bg-gray-900 text-white px-2 py-1 rounded">
                            {option.value}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                ) : (
                  <select
                    value={selectedVariants[variant.name] || ""}
                    onChange={(e) => handleVariantChange(variant.name, e.target.value)}
                    className="w-full px-4 py-3 rounded-lg border-2 border-secondary/30 hover:border-secondary focus:border-accent focus:outline-none transition-colors bg-white"
                  >
                    <option value="">Select {variant.name}</option>
                    {variant.options.map((option) => (
                      <option
                        key={option.value}
                        value={option.value}
                        disabled={option.stock === 0}
                      >
                        {option.value}
                        {option.price !== product.basePrice && ` (+$${(option.price - product.basePrice).toFixed(2)})`}
                        {option.stock !== undefined && ` - ${option.stock > 0 ? `${option.stock} in stock` : 'Out of stock'}`}
                      </option>
                    ))}
                  </select>
                )}
              </div>
            ))}

            {variantMatrix && (
              <div className="mt-6">
                <h4 className="text-sm font-bold text-gray-700 mb-3">Available Combinations</h4>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="border-b-2 border-gray-200">
                        <th className="text-left py-2 px-3 text-sm font-semibold text-gray-700">Color</th>
                        <th className="text-left py-2 px-3 text-sm font-semibold text-gray-700">Size</th>
                        <th className="text-right py-2 px-3 text-sm font-semibold text-gray-700">Price</th>
                        <th className="text-center py-2 px-3 text-sm font-semibold text-gray-700">Stock</th>
                        <th className="text-center py-2 px-3 text-sm font-semibold text-gray-700"></th>
                      </tr>
                    </thead>
                    <tbody>
                      {variantMatrix.map((item, index) => {
                        const isSelected = 
                          selectedVariants.Color === item.color &&
                          selectedVariants.Size === item.size;
                        const isOutOfStock = item.stock === 0;
                        return (
                          <tr
                            key={index}
                            className={`border-b border-gray-100 ${
                              isSelected ? 'bg-accent/10' : 'hover:bg-gray-50'
                            } ${isOutOfStock ? 'opacity-50' : ''}`}
                          >
                            <td className="py-3 px-3">
                              <div className="flex items-center gap-2">
                                <div
                                  className="w-6 h-6 rounded-full border-2 border-gray-300"
                                  style={{
                                    backgroundColor: product.variants
                                      .find(v => v.name === 'Color')
                                      ?.options.find(o => o.value === item.color)?.hex || '#cccccc'
                                  }}
                                />
                                <span className="text-sm text-gray-900">{item.color}</span>
                              </div>
                            </td>
                            <td className="py-3 px-3 text-sm text-gray-900">{item.size}</td>
                            <td className="py-3 px-3 text-right">
                              <PriceDisplay price={item.price} className="text-base font-semibold" />
                            </td>
                            <td className="py-3 px-3 text-center">
                              <Badge variant={item.stock > 0 ? 'success' : 'secondary'} className="text-xs">
                                {item.stock > 0 ? `${item.stock} left` : 'Out of stock'}
                              </Badge>
                            </td>
                            <td className="py-3 px-3 text-center">
                              {isSelected ? (
                                <Badge variant="primary" className="text-xs">Selected</Badge>
                              ) : (
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleMatrixSelect(item)}
                                  disabled={isOutOfStock}
                                  className="text-xs"
                                >
                                  Select
                                </Button>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-3">
                Quantity
              </label>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-10 h-10 rounded-lg border-2 border-secondary/30 hover:border-accent hover:bg-accent/10 transition-all flex items-center justify-center"
                >
                  <ApperIcon name="Minus" size={18} />
                </button>
                <span className="text-xl font-bold w-12 text-center">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-10 h-10 rounded-lg border-2 border-secondary/30 hover:border-accent hover:bg-accent/10 transition-all flex items-center justify-center"
                >
                  <ApperIcon name="Plus" size={18} />
                </button>
              </div>
            </div>

<div className="mb-4">
              {displayStock > 0 ? (
                <p className="text-sm text-success font-semibold flex items-center gap-2">
                  <ApperIcon name="Check" size={16} />
                  In Stock - {displayStock} available
                </p>
              ) : (
                <p className="text-sm text-error font-semibold flex items-center gap-2">
                  <ApperIcon name="X" size={16} />
                  Currently Out of Stock
                </p>
              )}
            </div>

            <div className="flex gap-4">
              <Button
                variant="accent"
                size="lg"
                className="flex-1"
                onClick={handleAddToCart}
                disabled={displayStock === 0}
              >
                <ApperIcon name="ShoppingCart" size={20} className="mr-2" />
                {displayStock > 0 ? 'Add to Cart' : 'Out of Stock'}
              </Button>
              <Button variant="secondary" size="lg">
                <ApperIcon name="Heart" size={20} />
              </Button>
            </div>

{shop && (
              <Card className="p-6">
                <div className="flex items-start gap-4">
                  <img
                    src={shop.logoImage}
                    alt={shop.name}
                    className="w-16 h-16 rounded-full object-cover"
                  />
                  <div className="flex-1">
                    <h3 className="font-display font-bold text-lg text-gray-900 mb-1">
                      {shop.name}
                    </h3>
                    <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                      {shop.description}
                    </p>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => navigate(`/shop/${shop.slug}`)}
                    >
                      Visit Shop
                      <ApperIcon name="ArrowRight" size={16} className="ml-2" />
                    </Button>
                  </div>
                </div>
              </Card>
            )}

{usedItems.length > 0 && (
              <Card className="p-6 mb-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-display font-bold text-xl text-gray-900">
                    Buy New & Used
                  </h3>
                  <Badge variant="secondary" className="text-xs">
                    Save up to {Math.round(((product.basePrice - Math.min(...usedItems.map(i => i.price))) / product.basePrice) * 100)}%
                  </Badge>
                </div>
                <p className="text-sm text-gray-600 mb-4">
                  Consider these quality alternatives at lower prices
                </p>
                <div className="grid gap-4">
                  {usedItems.map((item, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="border-2 border-gray-200 rounded-lg p-4 hover:border-accent transition-colors"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <Badge 
                              variant={
                                item.conditionRating >= 90 ? 'success' :
                                item.conditionRating >= 80 ? 'primary' :
                                item.conditionRating >= 70 ? 'warning' : 'secondary'
                              }
                              className="text-xs"
                            >
                              {item.condition}
                            </Badge>
                            <div className="flex items-center gap-1">
                              <div className="flex">
                                {[...Array(5)].map((_, i) => (
                                  <ApperIcon
                                    key={i}
                                    name="Star"
                                    size={12}
                                    className={`${
                                      i < Math.floor(item.conditionRating / 20)
                                        ? 'text-warning fill-warning'
                                        : 'text-gray-300'
                                    }`}
                                  />
                                ))}
                              </div>
                              <span className="text-xs text-gray-600">
                                {item.conditionRating}% rating
                              </span>
                            </div>
                          </div>
                          <p className="text-sm text-gray-700 mb-3">{item.description}</p>
                          <div className="flex items-center gap-4 text-sm">
                            <div>
                              <span className="text-gray-600">Sold by:</span>
                              <span className="font-semibold text-gray-900 ml-1">
                                {item.shopName}
                              </span>
                            </div>
                            <div className="flex items-center gap-1">
                              <ApperIcon name="Star" size={14} className="text-warning fill-warning" />
                              <span className="font-semibold text-gray-900">
                                {item.rating}%
                              </span>
                              <span className="text-gray-600">
                                ({item.ratingCount.toLocaleString()})
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="text-right flex-shrink-0">
                          <div className="mb-2">
                            <PriceDisplay price={item.price} className="text-2xl font-bold" />
                            <p className="text-xs text-gray-600 mt-1">
                              Save <span className="text-success font-semibold">
                                ${(product.basePrice - item.price).toFixed(2)}
                              </span>
                            </p>
                          </div>
                          {item.stock > 0 ? (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleAddUsedToCart(item)}
                              className="w-full"
                            >
                              <ApperIcon name="ShoppingCart" size={14} className="mr-1" />
                              Add to Cart
                            </Button>
                          ) : (
                            <Badge variant="secondary" className="text-xs">
                              Out of Stock
                            </Badge>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </Card>
            )}

            {availableSellers.length > 1 && (
              <Card className="p-6">
                <h3 className="font-display font-bold text-xl text-gray-900 mb-4">
                  Other Sellers on Amazon
                </h3>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="text-left py-3 px-2 text-sm font-semibold text-gray-700">Seller</th>
                        <th className="text-left py-3 px-2 text-sm font-semibold text-gray-700">Price</th>
                        <th className="text-left py-3 px-2 text-sm font-semibold text-gray-700">Rating</th>
                        <th className="text-left py-3 px-2 text-sm font-semibold text-gray-700">Shipping</th>
                        <th className="text-left py-3 px-2 text-sm font-semibold text-gray-700">Delivery</th>
                        <th className="py-3 px-2"></th>
                      </tr>
                    </thead>
                    <tbody>
                      {availableSellers.map((seller, index) => {
                        const isSelected = selectedSeller?.shopId === seller.shopId;
                        return (
                          <tr 
                            key={index} 
                            className={`border-b border-gray-100 ${isSelected ? 'bg-blue-50' : 'hover:bg-gray-50'}`}
                          >
                            <td className="py-4 px-2">
                              <div className="flex items-center gap-2">
                                <span className="font-semibold text-gray-900 text-sm">
                                  {seller.shopName}
                                </span>
                                {seller.isPrime && (
                                  <Badge variant="primary" className="text-xs">
                                    <ApperIcon name="Zap" size={10} className="mr-1" />
                                    Prime
                                  </Badge>
                                )}
                              </div>
                              <div className="text-xs text-gray-500 mt-1">
                                Fulfilled by Amazon
                              </div>
                            </td>
                            <td className="py-4 px-2">
                              <PriceDisplay price={seller.price} className="text-lg font-bold" />
                            </td>
                            <td className="py-4 px-2">
                              <div className="text-sm">
                                <div className="font-semibold text-gray-900">
                                  {seller.rating}% positive
                                </div>
                                <div className="text-xs text-gray-500">
                                  ({seller.ratingCount.toLocaleString()} ratings)
                                </div>
                              </div>
                            </td>
                            <td className="py-4 px-2">
                              <div className="text-sm">
                                {seller.shippingCost === 0 ? (
                                  <span className="text-success font-semibold">FREE</span>
                                ) : (
                                  <span className="text-gray-900">
                                    ${seller.shippingCost.toFixed(2)}
                                  </span>
                                )}
                              </div>
                            </td>
                            <td className="py-4 px-2">
                              <div className="text-sm text-gray-900">
                                {seller.deliveryDays} {seller.deliveryDays === 1 ? 'day' : 'days'}
                              </div>
                            </td>
                            <td className="py-4 px-2 text-right">
                              {isSelected ? (
                                <Badge variant="success">Selected</Badge>
                              ) : (
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleSelectSeller(seller)}
                                  disabled={seller.stock === 0}
                                >
                                  {seller.stock > 0 ? 'Select' : 'Out of Stock'}
                                </Button>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </Card>
            )}
          </div>
        </div>
<div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Card className="p-8">
              <h2 className="font-display font-bold text-2xl text-gray-900 mb-4">
                Description
              </h2>
              <p className="text-gray-600 leading-relaxed whitespace-pre-line">
                {product.description}
              </p>
            </Card>

            <Card className="p-8 mt-8">
              <h2 className="font-display font-bold text-2xl text-gray-900 mb-6">
                Customer Reviews ({reviews.length})
              </h2>

              {reviews.length === 0 ? (
                <p className="text-gray-600 text-center py-8">
                  No reviews yet. Be the first to review this product!
                </p>
              ) : (
                <div className="space-y-6">
                  {reviews.map((review) => (
                    <div key={review.Id} className="border-b border-secondary/20 pb-6 last:border-0">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <RatingDisplay rating={review.rating} showCount={false} />
                          <p className="text-sm text-gray-600 mt-1">
                            {new Date(review.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <p className="text-gray-700 mb-3">{review.reviewText}</p>
                      {review.mediaFiles.length > 0 && (
                        <div className="flex gap-2">
                          {review.mediaFiles.map((media, index) => (
                            <img
                              key={index}
                              src={media}
                              alt="Review"
                              className="w-20 h-20 rounded-lg object-cover"
                            />
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </Card>
          </div>

          <div>
<Card className="p-6 sticky top-24">
              <h3 className="font-display font-bold text-lg text-gray-900 mb-4">
                Product Details
              </h3>
              <dl className="space-y-3 text-sm">
                <div>
                  <dt className="text-gray-600">Category</dt>
                  <dd className="font-semibold text-gray-900">{product.category}</dd>
                </div>
                <div>
<dt className="text-gray-600">Stock</dt>
                  <dd className="font-semibold text-gray-900">
                    {displayStock > 0 ? `${displayStock} available` : "Out of stock"}
                  </dd>
                </div>
                <div>
                  <dt className="text-gray-600">Type</dt>
                  <dd className="font-semibold text-gray-900 capitalize">{product.productType}</dd>
                </div>
              </dl>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;