import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Card from "@/components/atoms/Card";
import FormField from "@/components/molecules/FormField";
import sellerService from "@/services/api/sellerService";

const BecomeSellerPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    description: "",
    bannerImage: "",
    logoImage: "",
    instagram: "",
    facebook: "",
    twitter: ""
  });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user types
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ""
      }));
    }

    // Auto-generate slug from shop name
    if (name === "name") {
      const slug = value.toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');
      setFormData(prev => ({
        ...prev,
        slug
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Shop name is required";
    }

    if (!formData.slug.trim()) {
      newErrors.slug = "Shop URL is required";
    }

    if (!formData.description.trim()) {
      newErrors.description = "Description is required";
    } else if (formData.description.length < 50) {
      newErrors.description = "Description must be at least 50 characters";
    }

    if (!formData.bannerImage.trim()) {
      newErrors.bannerImage = "Banner image URL is required";
    } else if (!formData.bannerImage.match(/^https?:\/\/.+/)) {
      newErrors.bannerImage = "Please enter a valid URL";
    }

    if (!formData.logoImage.trim()) {
      newErrors.logoImage = "Logo image URL is required";
    } else if (!formData.logoImage.match(/^https?:\/\/.+/)) {
      newErrors.logoImage = "Please enter a valid URL";
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
      setLoading(true);
      
      // For simulation, use a fixed seller ID
      const sellerId = 100; // In real app, this would come from authenticated user
      
      const shopData = {
        sellerId,
        name: formData.name,
        slug: formData.slug,
        description: formData.description,
        bannerImage: formData.bannerImage,
        logoImage: formData.logoImage,
        socialLinks: {
          instagram: formData.instagram,
          facebook: formData.facebook,
          twitter: formData.twitter
        }
      };

      await sellerService.createShop(shopData);
      toast.success("Shop created successfully!");
      navigate("/sell/dashboard");
    } catch (error) {
      toast.error(error.message || "Failed to create shop");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-surface py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="text-center mb-12">
            <h1 className="font-display font-bold text-5xl text-gray-900 mb-4">
              Become a Seller
            </h1>
            <p className="text-xl text-gray-600">
              Start your journey as an artisan seller and reach customers worldwide
            </p>
          </div>

          <Card className="p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <h2 className="font-display font-bold text-2xl text-gray-900 mb-6">
                  Shop Information
                </h2>

                <div className="space-y-5">
                  <FormField
                    label="Shop Name"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    error={errors.name}
                    required
                    placeholder="e.g., Emma's Pottery Studio"
                  />

                  <FormField
                    label="Shop URL"
                    id="slug"
                    name="slug"
                    value={formData.slug}
                    onChange={handleChange}
                    error={errors.slug}
                    required
                    placeholder="emmas-pottery-studio"
                  />

                  <div>
                    <FormField
                      label="Description"
                      id="description"
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                      error={errors.description}
                      required
                      placeholder="Tell customers about your craft, techniques, and what makes your products special..."
                    />
                    <p className="text-sm text-gray-600 mt-1">
                      {formData.description.length}/500 characters (minimum 50)
                    </p>
                  </div>

                  <FormField
                    label="Banner Image URL"
                    id="bannerImage"
                    name="bannerImage"
                    value={formData.bannerImage}
                    onChange={handleChange}
                    error={errors.bannerImage}
                    required
                    placeholder="https://images.unsplash.com/photo-..."
                  />

                  <FormField
                    label="Logo Image URL"
                    id="logoImage"
                    name="logoImage"
                    value={formData.logoImage}
                    onChange={handleChange}
                    error={errors.logoImage}
                    required
                    placeholder="https://images.unsplash.com/photo-..."
                  />
                </div>
              </div>

              <div>
                <h3 className="font-display font-bold text-xl text-gray-900 mb-4">
                  Social Media (Optional)
                </h3>
                <div className="space-y-4">
                  <FormField
                    label="Instagram"
                    id="instagram"
                    name="instagram"
                    value={formData.instagram}
                    onChange={handleChange}
                    placeholder="your_instagram_handle"
                  />

                  <FormField
                    label="Facebook"
                    id="facebook"
                    name="facebook"
                    value={formData.facebook}
                    onChange={handleChange}
                    placeholder="your-facebook-page"
                  />

                  <FormField
                    label="Twitter"
                    id="twitter"
                    name="twitter"
                    value={formData.twitter}
                    onChange={handleChange}
                    placeholder="your_twitter"
                  />
                </div>
              </div>

              <div className="flex gap-4 pt-6">
                <Button
                  type="button"
                  variant="secondary"
                  size="lg"
                  onClick={() => navigate("/")}
                  disabled={loading}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="accent"
                  size="lg"
                  disabled={loading}
                  className="flex-1"
                >
                  {loading ? (
                    <>
                      <ApperIcon name="Loader2" size={20} className="mr-2 animate-spin" />
                      Creating Shop...
                    </>
                  ) : (
                    <>
                      <ApperIcon name="Store" size={20} className="mr-2" />
                      Create Shop
                    </>
                  )}
                </Button>
              </div>
            </form>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default BecomeSellerPage;