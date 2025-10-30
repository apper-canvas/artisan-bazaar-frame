const PriceDisplay = ({ price, className = "" }) => {
  const formatPrice = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD"
    }).format(amount);
  };

  return (
    <span className={`font-display font-bold text-primary ${className}`}>
      {formatPrice(price)}
    </span>
  );
};

export default PriceDisplay;