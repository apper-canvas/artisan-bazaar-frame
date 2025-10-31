import { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import { toast } from "react-toastify";
import Header from "@/components/organisms/Header";
import Footer from "@/components/organisms/Footer";

function Layout() {
  const [cartItems, setCartItems] = useState([]);
  const [cartItemCount, setCartItemCount] = useState(0);

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem("artisan-cart");
    if (savedCart) {
      try {
        const parsed = JSON.parse(savedCart);
        setCartItems(parsed);
        setCartItemCount(parsed.reduce((sum, item) => sum + item.quantity, 0));
      } catch (error) {
        console.error("Failed to load cart:", error);
      }
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    if (cartItems.length > 0) {
      localStorage.setItem("artisan-cart", JSON.stringify(cartItems));
      setCartItemCount(cartItems.reduce((sum, item) => sum + item.quantity, 0));
    } else {
      localStorage.removeItem("artisan-cart");
      setCartItemCount(0);
    }
  }, [cartItems]);

  // Add item to cart
  const addToCart = (product, quantity = 1) => {
    setCartItems((prev) => {
      const existingItem = prev.find((item) => item.Id === product.Id);
      if (existingItem) {
        return prev.map((item) =>
          item.Id === product.Id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { ...product, quantity }];
    });
    toast.success("Added to cart!");
  };

  // Update cart item quantity
  const updateCartQuantity = (id, quantity) => {
    if (quantity <= 0) {
      removeFromCart(id);
      return;
    }
    setCartItems((prev) =>
      prev.map((item) => (item.Id === id ? { ...item, quantity } : item))
    );
  };

  // Remove item from cart
  const removeFromCart = (id) => {
    setCartItems((prev) => prev.filter((item) => item.Id !== id));
    toast.info("Item removed from cart");
  };

  // Clear entire cart
  const clearCart = () => {
    setCartItems([]);
    toast.info("Cart cleared");
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header cartItemCount={cartItemCount} />
      <main className="flex-1">
        <Outlet
          context={{
            cartItems,
            addToCart,
            updateCartQuantity,
            removeFromCart,
            clearCart,
          }}
        />
      </main>
      <Footer />
    </div>
  );
}

export default Layout;