import ApperIcon from "@/components/ApperIcon";

const RatingDisplay = ({ rating, count, size = 16, showCount = true }) => {
  const stars = Array.from({ length: 5 }, (_, i) => i + 1);

  return (
    <div className="flex items-center gap-1">
      {stars.map((star) => (
        <ApperIcon
          key={star}
          name="Star"
          size={size}
          className={star <= rating ? "text-accent fill-accent" : "text-gray-300"}
        />
      ))}
      {showCount && count !== undefined && (
        <span className="ml-1 text-sm text-gray-600">
          ({count})
        </span>
      )}
    </div>
  );
};

export default RatingDisplay;