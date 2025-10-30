import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Card from "@/components/atoms/Card";
import Empty from "@/components/ui/Empty";
import PriceDisplay from "@/components/molecules/PriceDisplay";

const CartPage = () => {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([
    {
      id: 1,
      productId: 1,
      title: "Handmade Ceramic Coffee Mug",
      price: 28,
      quantity: 2,
      image: "https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?w=400",
      variant: "Ocean Blue",
      shopName: "Emma's Pottery Studio"
    },
    {
      id: 2,
      productId: 5,
      title: "Macramé Wall Hanging",
      price: 98,
      quantity: 1,
      image: "https://images.unsplash.com/photo-1586339277861-b0b895343ba5?w=400",
      variant: "Large (36in)",
      shopName: "Sarah's Textile Art"
    }
  ]);

  const updateQuantity = (id, newQuantity) => {
    if (newQuantity < 1) return;
    setCartItems(items =>
      items.map(item =>
        item.id === id ? { ...item, quantity: newQuantity } : item
      )
    );
    toast.success("Cart updated");
  };

  const removeItem = (id) => {
    setCartItems(items => items.filter(item => item.id !== id));
    toast.success("Item removed from cart");
  };

  const calculateSubtotal = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const handleCheckout = () => {
    navigate("/checkout");
  };

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-white to-surface flex items-center justify-center">
        <Empty
          icon="ShoppingCart"
          title="Your cart is empty"
          message="Start shopping to add items to your cart"
          actionLabel="Browse Products"
          onAction={() => navigate("/browse")}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-surface py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <h1 className="font-display font-bold text-4xl text-gray-900 mb-8">
          Shopping Cart ({cartItems.length})
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            {cartItems.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="p-6">
                  <div className="flex gap-6">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-32 h-32 rounded-lg object-cover flex-shrink-0"
                    />

                    <div className="flex-1">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h3 className="font-display font-bold text-lg text-gray-900 mb-1">
                            {item.title}
                          </h3>
                          <p className="text-sm text-gray-600">by {item.shopName}</p>
                          {item.variant && (
                            <p className="text-sm text-gray-600 mt-1">
                              Variant: {item.variant}
                            </p>
                          )}
                        </div>
                        <button
                          onClick={() => removeItem(item.id)}
                          className="p-2 hover:bg-surface rounded-lg transition-colors"
                        >
                          <ApperIcon name="Trash2" size={20} className="text-error" />
                        </button>
                      </div>

                      <div className="flex items-center justify-between mt-4">
                        <div className="flex items-center gap-3">
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="w-8 h-8 rounded-lg border-2 border-secondary/30 hover:border-accent hover:bg-accent/10 transition-all flex items-center justify-center"
                          >
                            <ApperIcon name="Minus" size={16} />
                          </button>
                          <span className="text-lg font-bold w-8 text-center">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="w-8 h-8 rounded-lg border-2 border-secondary/30 hover:border-accent hover:bg-accent/10 transition-all flex items-center justify-center"
                          >
                            <ApperIcon name="Plus" size={16} />
                          </button>
                        </div>

                        <PriceDisplay
                          price={item.price * item.quantity}
                          className="text-2xl"
                        />
                      </div>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>

          <div className="lg:sticky lg:top-24 h-fit">
            <Card className="p-6">
              <h2 className="font-display font-bold text-2xl text-gray-900 mb-6">
                Order Summary
              </h2>

              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <PriceDisplay price={calculateSubtotal()} className="text-base" />
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Shipping</span>
                  <span className="font-semibold text-gray-900">Calculated at checkout</span>
                </div>
                <div className="pt-3 border-t border-secondary/20">
                  <div className="flex justify-between items-baseline">
                    <span className="font-display font-bold text-xl text-gray-900">Total</span>
                    <PriceDisplay price={calculateSubtotal()} className="text-3xl" />
                  </div>
                </div>
              </div>

              <Button
                variant="accent"
                size="lg"
                className="w-full"
                onClick={handleCheckout}
              >
                Proceed to Checkout
                <ApperIcon name="ArrowRight" size={20} className="ml-2" />
              </Button>

              <button
                onClick={() => navigate("/browse")}
                className="w-full mt-4 text-center text-primary hover:text-primary/80 font-medium transition-colors"
              >
                Continue Shopping
              </button>
            </Card>

            <Card className="p-6 mt-4">
              <div className="flex items-center gap-3 text-sm text-gray-600">
                <ApperIcon name="Shield" size={20} className="text-success" />
                <div>
                  <p className="font-semibold text-gray-900">Secure Checkout</p>
                  <p>Your payment information is safe</p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;