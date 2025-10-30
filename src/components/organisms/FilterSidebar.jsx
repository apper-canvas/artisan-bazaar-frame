import { useState } from "react";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Label from "@/components/atoms/Label";

const FilterSidebar = ({ onFilterChange }) => {
  const [priceRange, setPriceRange] = useState([0, 500]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [productType, setProductType] = useState("all");

  const categories = [
    "Home & Living",
    "Furniture",
    "Home Decor",
    "Digital Products",
    "Art & Collectibles",
    "Jewelry"
  ];

  const handleCategoryToggle = (category) => {
    setSelectedCategories(prev => 
      prev.includes(category)
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };

  const handleApplyFilters = () => {
    if (onFilterChange) {
      onFilterChange({
        priceRange,
        categories: selectedCategories,
        productType
      });
    }
  };

  const handleReset = () => {
    setPriceRange([0, 500]);
    setSelectedCategories([]);
    setProductType("all");
    if (onFilterChange) {
      onFilterChange({
        priceRange: [0, 500],
        categories: [],
        productType: "all"
      });
    }
  };

  return (
    <div className="bg-white rounded-xl border border-secondary/20 p-6 space-y-6 sticky top-24">
      <div className="flex items-center justify-between">
        <h3 className="font-display font-bold text-lg text-gray-900">Filters</h3>
        <button
          onClick={handleReset}
          className="text-sm text-primary hover:text-primary/80 transition-colors"
        >
          Reset
        </button>
      </div>

      <div>
        <Label className="mb-3">Price Range</Label>
        <div className="space-y-3">
          <input
            type="range"
            min="0"
            max="500"
            value={priceRange[1]}
            onChange={(e) => setPriceRange([0, parseInt(e.target.value)])}
            className="w-full accent-accent"
          />
          <div className="flex items-center justify-between text-sm text-gray-600">
            <span>${priceRange[0]}</span>
            <span>${priceRange[1]}+</span>
          </div>
        </div>
      </div>

      <div>
        <Label className="mb-3">Product Type</Label>
        <div className="space-y-2">
          {["all", "physical", "digital", "customizable"].map((type) => (
            <label key={type} className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="productType"
                value={type}
                checked={productType === type}
                onChange={(e) => setProductType(e.target.value)}
                className="accent-accent"
              />
              <span className="text-sm text-gray-700 capitalize">{type === "all" ? "All Products" : type}</span>
            </label>
          ))}
        </div>
      </div>

      <div>
        <Label className="mb-3">Categories</Label>
        <div className="space-y-2 max-h-[300px] overflow-y-auto">
          {categories.map((category) => (
            <label key={category} className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={selectedCategories.includes(category)}
                onChange={() => handleCategoryToggle(category)}
                className="accent-accent"
              />
              <span className="text-sm text-gray-700">{category}</span>
            </label>
          ))}
        </div>
      </div>

      <Button
        variant="primary"
        className="w-full"
        onClick={handleApplyFilters}
      >
        <ApperIcon name="Filter" size={18} className="mr-2" />
        Apply Filters
      </Button>
    </div>
  );
};

export default FilterSidebar;