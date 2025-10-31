import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";

function NotFound() {
  return (
    <div className="min-h-[calc(100vh-16rem)] flex items-center justify-center bg-gradient-to-br from-surface to-secondary/10 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center max-w-md"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          className="inline-flex items-center justify-center w-24 h-24 bg-primary/10 rounded-full mb-6"
        >
          <ApperIcon name="PackageX" size={48} className="text-primary" />
        </motion.div>

        <h1 className="text-6xl font-display font-bold text-primary mb-4">
          404
        </h1>
        <h2 className="text-2xl font-display font-semibold text-gray-800 mb-3">
          Page Not Found
        </h2>
        <p className="text-gray-600 mb-8">
          The page you're looking for doesn't exist or has been moved. Let's get you back to discovering amazing artisan products.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link to="/">
            <Button className="w-full sm:w-auto">
              <ApperIcon name="Home" size={18} className="mr-2" />
              Back to Home
            </Button>
          </Link>
          <Link to="/browse">
            <Button variant="outline" className="w-full sm:w-auto">
              <ApperIcon name="Search" size={18} className="mr-2" />
              Browse Products
            </Button>
          </Link>
        </div>
      </motion.div>
    </div>
  );
}

export default NotFound;