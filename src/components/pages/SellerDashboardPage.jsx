import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Card from "@/components/atoms/Card";
import Badge from "@/components/atoms/Badge";
import FormField from "@/components/molecules/FormField";
import Loading from "@/components/ui/Loading";
import Empty from "@/components/ui/Empty";
import sellerService from "@/services/api/sellerService";

const SellerDashboardPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [shop, setShop] = useState(null);
  const [products, setProducts] = useState([]);
  const [stats, setStats] = useState(null);
  const [showProductForm, setShowProductForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    basePrice: "",
    category: "",
    productType: "physical",
    images: [""],
    inventory: "",
    variants: []
  });
  const [errors, setErrors] = useState({});

  const sellerId = 100; // In real app, from authenticated user

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const [shopData, productsData, statsData] = await Promise.all([
        sellerService.getShopBySellerId(sellerId),
        sellerService.getSellerProducts(sellerId),
        sellerService.getDashboardStats(sellerId)
      ]);

      if (!shopData) {
        navigate("/sell/register");
        return;
      }

      setShop(shopData);
      setProducts(productsData);
      setStats(statsData);
    } catch (error) {
      toast.error(error.message || "Failed to load dashboard");
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      basePrice: "",
      category: "",
      productType: "physical",
      images: [""],
      inventory: "",
      variants: []
    });
    setErrors({});
    setEditingProduct(null);
    setShowProductForm(false);
  };

  const handleEditProduct = (product) => {
    setEditingProduct(product);
    setFormData({
      title: product.title,
      description: product.description,
      basePrice: product.basePrice.toString(),
      category: product.category,
      productType: product.productType,
      images: product.images.length > 0 ? product.images : [""],
      inventory: product.inventory.toString(),
      variants: product.variants || []
    });
    setShowProductForm(true);
  };

  const handleDeleteProduct = async (productId) => {
    if (!confirm("Are you sure you want to delete this product?")) return;

    try {
      await sellerService.deleteProduct(productId);
      toast.success("Product deleted successfully");
      loadDashboardData();
    } catch (error) {
      toast.error(error.message || "Failed to delete product");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ""
      }));
    }
  };

  const handleImageChange = (index, value) => {
    const newImages = [...formData.images];
    newImages[index] = value;
    setFormData(prev => ({
      ...prev,
      images: newImages
    }));
  };

  const addImageField = () => {
    setFormData(prev => ({
      ...prev,
      images: [...prev.images, ""]
    }));
  };

  const removeImageField = (index) => {
    if (formData.images.length === 1) {
      toast.error("At least one image is required");
      return;
    }
    const newImages = formData.images.filter((_, i) => i !== index);
    setFormData(prev => ({
      ...prev,
      images: newImages
    }));
  };

  const addVariant = () => {
    setFormData(prev => ({
      ...prev,
      variants: [
        ...prev.variants,
        { name: "", options: [{ value: "", price: "", stock: "", hex: "" }] }
      ]
    }));
  };

  const removeVariant = (variantIndex) => {
    const newVariants = formData.variants.filter((_, i) => i !== variantIndex);
    setFormData(prev => ({
      ...prev,
      variants: newVariants
    }));
  };

  const handleVariantChange = (variantIndex, field, value) => {
    const newVariants = [...formData.variants];
    newVariants[variantIndex][field] = value;
    setFormData(prev => ({
      ...prev,
      variants: newVariants
    }));
  };

  const addVariantOption = (variantIndex) => {
    const newVariants = [...formData.variants];
    newVariants[variantIndex].options.push({ value: "", price: "", stock: "", hex: "" });
    setFormData(prev => ({
      ...prev,
      variants: newVariants
    }));
  };

  const removeVariantOption = (variantIndex, optionIndex) => {
    const newVariants = [...formData.variants];
    if (newVariants[variantIndex].options.length === 1) {
      toast.error("At least one option is required");
      return;
    }
    newVariants[variantIndex].options.splice(optionIndex, 1);
    setFormData(prev => ({
      ...prev,
      variants: newVariants
    }));
  };

  const handleVariantOptionChange = (variantIndex, optionIndex, field, value) => {
    const newVariants = [...formData.variants];
    newVariants[variantIndex].options[optionIndex][field] = value;
    setFormData(prev => ({
      ...prev,
      variants: newVariants
    }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = "Title is required";
    }

    if (!formData.description.trim()) {
      newErrors.description = "Description is required";
    }

    if (!formData.basePrice || parseFloat(formData.basePrice) <= 0) {
      newErrors.basePrice = "Valid price is required";
    }

    if (!formData.category.trim()) {
      newErrors.category = "Category is required";
    }

    if (!formData.inventory || parseInt(formData.inventory) < 0) {
      newErrors.inventory = "Valid inventory is required";
    }

    const validImages = formData.images.filter(img => img.trim() !== "");
    if (validImages.length === 0) {
      newErrors.images = "At least one image URL is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error("Please fix the errors in the form");
      return;
    }

    try {
      const validImages = formData.images.filter(img => img.trim() !== "");
      
      const processedVariants = formData.variants.map(variant => ({
        name: variant.name,
        options: variant.options.map(opt => ({
          value: opt.value,
          price: parseFloat(opt.price) || parseFloat(formData.basePrice),
          stock: parseInt(opt.stock) || 0,
          ...(opt.hex && { hex: opt.hex })
        }))
      }));

      const productData = {
        sellerId,
        shopId: shop.Id,
        title: formData.title,
        description: formData.description,
        basePrice: parseFloat(formData.basePrice),
        category: formData.category,
        productType: formData.productType,
        images: validImages,
        inventory: parseInt(formData.inventory),
        variants: processedVariants,
        digitalFileUrl: null,
        sellers: []
      };

      if (editingProduct) {
        await sellerService.updateProduct(editingProduct.Id, productData);
        toast.success("Product updated successfully");
      } else {
        await sellerService.createProduct(productData);
        toast.success("Product created successfully");
      }

      resetForm();
      loadDashboardData();
    } catch (error) {
      toast.error(error.message || "Failed to save product");
    }
  };

  if (loading) return <Loading message="Loading dashboard..." />;

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-surface py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-display font-bold text-4xl text-gray-900 mb-2">
              Seller Dashboard
            </h1>
            <p className="text-gray-600">Manage your shop and products</p>
          </div>
          {!showProductForm && (
            <Button
              variant="accent"
              size="lg"
              onClick={() => setShowProductForm(true)}
            >
              <ApperIcon name="Plus" size={20} className="mr-2" />
              Add Product
            </Button>
          )}
        </div>

        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card className="p-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-600 text-sm">Total Products</span>
                <ApperIcon name="Package" size={20} className="text-primary" />
              </div>
              <p className="font-display font-bold text-3xl text-gray-900">
                {stats.totalProducts}
              </p>
            </Card>

            <Card className="p-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-600 text-sm">Active Products</span>
                <ApperIcon name="Check" size={20} className="text-success" />
              </div>
              <p className="font-display font-bold text-3xl text-gray-900">
                {stats.activeProducts}
              </p>
            </Card>

            <Card className="p-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-600 text-sm">Total Inventory</span>
                <ApperIcon name="Box" size={20} className="text-info" />
              </div>
              <p className="font-display font-bold text-3xl text-gray-900">
                {stats.totalInventory}
              </p>
            </Card>

            <Card className="p-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-600 text-sm">Low Stock</span>
                <ApperIcon name="AlertTriangle" size={20} className="text-warning" />
              </div>
              <p className="font-display font-bold text-3xl text-gray-900">
                {stats.lowStockProducts}
              </p>
            </Card>
          </div>
        )}

        {showProductForm ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Card className="p-8 mb-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-display font-bold text-2xl text-gray-900">
                  {editingProduct ? "Edit Product" : "Add New Product"}
                </h2>
                <Button
                  variant="ghost"
                  onClick={resetForm}
                >
                  <ApperIcon name="X" size={20} />
                </Button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <FormField
                  label="Product Title"
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  error={errors.title}
                  required
                  placeholder="e.g., Handmade Ceramic Coffee Mug"
                />

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Description *
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows={4}
                    className="w-full px-4 py-3 rounded-lg border-2 border-secondary/30 hover:border-secondary focus:border-accent focus:outline-none transition-colors bg-white resize-none"
                    placeholder="Describe your product..."
                  />
                  {errors.description && (
                    <p className="text-sm text-error mt-1">{errors.description}</p>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    label="Base Price"
                    id="basePrice"
                    name="basePrice"
                    type="number"
                    step="0.01"
                    value={formData.basePrice}
                    onChange={handleChange}
                    error={errors.basePrice}
                    required
                    placeholder="29.99"
                  />

                  <FormField
                    label="Inventory"
                    id="inventory"
                    name="inventory"
                    type="number"
                    value={formData.inventory}
                    onChange={handleChange}
                    error={errors.inventory}
                    required
                    placeholder="15"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                      Category *
                    </label>
                    <input
                      type="text"
                      name="category"
                      value={formData.category}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-lg border-2 border-secondary/30 hover:border-secondary focus:border-accent focus:outline-none transition-colors bg-white"
                      placeholder="e.g., Home & Living"
                    />
                    {errors.category && (
                      <p className="text-sm text-error mt-1">{errors.category}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                      Product Type *
                    </label>
                    <select
                      name="productType"
                      value={formData.productType}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-lg border-2 border-secondary/30 hover:border-secondary focus:border-accent focus:outline-none transition-colors bg-white"
                    >
                      <option value="physical">Physical</option>
                      <option value="digital">Digital</option>
                      <option value="customizable">Customizable</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Product Images *
                  </label>
                  {formData.images.map((image, index) => (
                    <div key={index} className="flex gap-2 mb-2">
                      <input
                        type="url"
                        value={image}
                        onChange={(e) => handleImageChange(index, e.target.value)}
                        className="flex-1 px-4 py-3 rounded-lg border-2 border-secondary/30 hover:border-secondary focus:border-accent focus:outline-none transition-colors bg-white"
                        placeholder="https://images.unsplash.com/photo-..."
                      />
                      <Button
                        type="button"
                        variant="secondary"
                        onClick={() => removeImageField(index)}
                      >
                        <ApperIcon name="Trash2" size={16} />
                      </Button>
                    </div>
                  ))}
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={addImageField}
                  >
                    <ApperIcon name="Plus" size={16} className="mr-2" />
                    Add Image
                  </Button>
                  {errors.images && (
                    <p className="text-sm text-error mt-1">{errors.images}</p>
                  )}
                </div>

                <div>
                  <div className="flex items-center justify-between mb-4">
                    <label className="block text-sm font-bold text-gray-700">
                      Variants (Optional)
                    </label>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={addVariant}
                    >
                      <ApperIcon name="Plus" size={16} className="mr-2" />
                      Add Variant
                    </Button>
                  </div>

                  {formData.variants.map((variant, vIndex) => (
                    <Card key={vIndex} className="p-4 mb-4">
                      <div className="flex items-center justify-between mb-4">
                        <input
                          type="text"
                          value={variant.name}
                          onChange={(e) => handleVariantChange(vIndex, "name", e.target.value)}
                          className="flex-1 px-4 py-2 rounded-lg border-2 border-secondary/30 hover:border-secondary focus:border-accent focus:outline-none transition-colors bg-white"
                          placeholder="Variant Name (e.g., Color, Size)"
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeVariant(vIndex)}
                          className="ml-2"
                        >
                          <ApperIcon name="Trash2" size={16} />
                        </Button>
                      </div>

                      {variant.options.map((option, oIndex) => (
                        <div key={oIndex} className="grid grid-cols-1 md:grid-cols-5 gap-2 mb-2">
                          <input
                            type="text"
                            value={option.value}
                            onChange={(e) => handleVariantOptionChange(vIndex, oIndex, "value", e.target.value)}
                            className="px-3 py-2 rounded-lg border-2 border-secondary/30 focus:border-accent focus:outline-none transition-colors bg-white"
                            placeholder="Value"
                          />
                          <input
                            type="number"
                            step="0.01"
                            value={option.price}
                            onChange={(e) => handleVariantOptionChange(vIndex, oIndex, "price", e.target.value)}
                            className="px-3 py-2 rounded-lg border-2 border-secondary/30 focus:border-accent focus:outline-none transition-colors bg-white"
                            placeholder="Price"
                          />
                          <input
                            type="number"
                            value={option.stock}
                            onChange={(e) => handleVariantOptionChange(vIndex, oIndex, "stock", e.target.value)}
                            className="px-3 py-2 rounded-lg border-2 border-secondary/30 focus:border-accent focus:outline-none transition-colors bg-white"
                            placeholder="Stock"
                          />
                          <input
                            type="text"
                            value={option.hex}
                            onChange={(e) => handleVariantOptionChange(vIndex, oIndex, "hex", e.target.value)}
                            className="px-3 py-2 rounded-lg border-2 border-secondary/30 focus:border-accent focus:outline-none transition-colors bg-white"
                            placeholder="Hex (optional)"
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => removeVariantOption(vIndex, oIndex)}
                          >
                            <ApperIcon name="X" size={14} />
                          </Button>
                        </div>
                      ))}

                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => addVariantOption(vIndex)}
                        className="mt-2"
                      >
                        <ApperIcon name="Plus" size={14} className="mr-2" />
                        Add Option
                      </Button>
                    </Card>
                  ))}
                </div>

                <div className="flex gap-4 pt-6">
                  <Button
                    type="button"
                    variant="secondary"
                    size="lg"
                    onClick={resetForm}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    variant="accent"
                    size="lg"
                    className="flex-1"
                  >
                    <ApperIcon name={editingProduct ? "Save" : "Plus"} size={20} className="mr-2" />
                    {editingProduct ? "Update Product" : "Create Product"}
                  </Button>
                </div>
              </form>
            </Card>
          </motion.div>
        ) : (
          <>
            {products.length === 0 ? (
              <Empty
                icon="Package"
                title="No products yet"
                message="Start by adding your first product to your shop"
                actionLabel="Add Product"
                onAction={() => setShowProductForm(true)}
              />
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map((product, index) => (
                  <motion.div
                    key={product.Id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card className="overflow-hidden">
                      <div className="relative aspect-square bg-surface">
                        <img
                          src={product.images[0]}
                          alt={product.title}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute top-3 right-3">
                          <Badge variant={product.inventory > 0 ? "success" : "secondary"}>
                            {product.inventory > 0 ? `${product.inventory} in stock` : "Out of stock"}
                          </Badge>
                        </div>
                      </div>

                      <div className="p-4 space-y-3">
                        <div>
                          <h3 className="font-display font-semibold text-lg text-gray-900 line-clamp-2 mb-1">
                            {product.title}
                          </h3>
                          <p className="text-sm text-gray-600">{product.category}</p>
                        </div>

                        <div className="flex items-center justify-between">
                          <span className="font-display font-bold text-2xl text-primary">
                            ${product.basePrice.toFixed(2)}
                          </span>
                          <Badge variant="default" className="capitalize">
                            {product.productType}
                          </Badge>
                        </div>

                        <div className="flex gap-2 pt-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEditProduct(product)}
                            className="flex-1"
                          >
                            <ApperIcon name="Edit" size={14} className="mr-1" />
                            Edit
                          </Button>
                          <Button
                            variant="secondary"
                            size="sm"
                            onClick={() => handleDeleteProduct(product.Id)}
                            className="flex-1"
                          >
                            <ApperIcon name="Trash2" size={14} className="mr-1" />
                            Delete
                          </Button>
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default SellerDashboardPage;