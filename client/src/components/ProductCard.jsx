import { useNavigate } from "react-router-dom";
import { useState } from "react";
import PropTypes from "prop-types";
import { motion } from "framer-motion";
import AddToCartButton from "./AddToCartButton";
import PriceContainer from "./PriceContainer";

const ProductCard = ({ item, viewMode = "grid", className = "" }) => {
    const navigate = useNavigate();
    const [isHovered, setIsHovered] = useState(false);
    const [imageLoaded, setImageLoaded] = useState(false);

    const handleProductDetails = () => {
        navigate(`/product/${item?._id}`, {
            state: {
                item: item,
            },
        });
    };

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.05,
            },
        },
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { type: "spring", stiffness: 100, damping: 12 },
        },
        exit: { opacity: 0, y: -20 },
    };

    if (viewMode === "list") {
        return (
            <div
                className={`w-full bg-white border border-gray-100 hover:border-gray-200 hover:shadow-lg transition-all duration-300 rounded-lg overflow-hidden ${className}`}
            >
                <div className="flex">
                    {/* Image Container */}
                    <div className="w-48 h-48 flex-shrink-0 relative overflow-hidden bg-gray-50">
                        <div
                            onClick={handleProductDetails}
                            className="w-full h-full overflow-hidden cursor-pointer bg-white"
                        >
                            <img
                                className="w-full h-full object-cover transition-transform duration-500 ease-out hover:scale-105"
                                src={item?.images?.[0] || item?.image}
                                alt={item?.name}
                            />
                        </div>

                        {/* Sale Badge */}
                        {item?.offer && (
                            <div className="absolute top-3 left-3">
                                {item?.discountedPercentage > 0 ? (
                                    <span className="bg-black text-white text-xs font-medium px-2 py-1 uppercase tracking-wide">
                                        -{item.discountedPercentage}%
                                    </span>
                                ) : (
                                    <span className="bg-red-600 text-white text-xs font-medium px-2 py-1 uppercase tracking-wide">
                                        Sale
                                    </span>
                                )}
                            </div>
                        )}

                        {/* Badge for new items */}
                        {item?.badge && (
                            <div className="absolute top-3 right-3">
                                <span className="bg-green-600 text-white text-xs font-medium px-2 py-1 uppercase tracking-wide">
                                    New
                                </span>
                            </div>
                        )}
                    </div>

                    {/* Product Info */}
                    <div className="flex-1 p-6 flex flex-col justify-between">
                        <div>
                            <div className="flex justify-between items-start mb-2">
                                <h3
                                    className="text-lg font-semibold text-gray-900 uppercase tracking-wide cursor-pointer hover:text-gray-600 transition-colors duration-200 flex-1 mr-4"
                                    onClick={handleProductDetails}
                                >
                                    {item?.name}
                                </h3>
                                <div className="text-right">
                                    <PriceContainer item={item} />
                                </div>
                            </div>

                            {item?.brand && (
                                <p className="text-sm text-gray-600 mb-2">
                                    Brand: {item.brand}
                                </p>
                            )}

                            {item?.category && (
                                <p className="text-sm text-gray-600 mb-3">
                                    Category: {item.category}
                                </p>
                            )}

                            {item?.description && (
                                <p className="text-gray-700 text-sm line-clamp-3 mb-4">
                                    {item.description}
                                </p>
                            )}
                        </div>

                        {/* Add to Cart Button */}
                        <div className="flex justify-end">
                            <AddToCartButton item={item} />
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // Grid view (default)
    return (
        <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className={`w-full relative group bg-white border border-gray-100 hover:border-gray-200 hover:shadow-xl transition-all duration-300 ease-out ${className}`}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <motion.div variants={itemVariants} className="relative overflow-hidden bg-gray-50">
                <div
                    onClick={handleProductDetails}
                    className="w-full aspect-[4/5] overflow-hidden cursor-pointer bg-white"
                >
                    <motion.img
                        initial={{ scale: 1.1, opacity: 0 }}
                        animate={{ scale: isHovered ? 1.1 : 1, opacity: 1 }}
                        transition={{ duration: 0.5, ease: "easeOut" }}
                        className="w-full h-full object-cover"
                        src={item?.images?.[0] || item?.image}
                        alt={item?.name}
                        onLoad={() => setImageLoaded(true)}
                    />
                </div>

                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: isHovered ? 1 : 0, y: isHovered ? 0 : -10 }}
                    transition={{ duration: 0.3 }}
                    className="absolute top-3 left-3"
                >
                    {item?.offer && (
                        <span className="bg-black text-white text-xs font-medium px-3 py-1.5 uppercase tracking-wide">
                            {item?.discountedPercentage > 0 ? `-${item.discountedPercentage}%` : "Sale"}
                        </span>
                    )}
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: isHovered ? 1 : 0, y: isHovered ? 0 : -10 }}
                    transition={{ duration: 0.3, delay: 0.1 }}
                    className="absolute top-3 right-3"
                >
                    {item?.badge && (
                        <span className="bg-green-600 text-white text-xs font-medium px-3 py-1.5 uppercase tracking-wide">
                            New
                        </span>
                    )}
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: isHovered ? 1 : 0, scale: isHovered ? 1 : 0.8 }}
                    transition={{ duration: 0.3, delay: 0.1 }}
                    className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-black/60 to-transparent"
                >
                    <button
                        onClick={handleProductDetails}
                        className="w-full py-3 bg-white text-black font-semibold uppercase text-sm tracking-wide hover:bg-gray-100 transition-colors duration-200 rounded-lg"
                    >
                        Quick View
                    </button>
                </motion.div>
            </motion.div>

            <motion.div variants={itemVariants} className="pt-4 pb-4 px-4 text-center">
                <motion.h3
                    whileHover={{ scale: 1.02 }}
                    className="text-sm font-semibold text-gray-900 uppercase tracking-wide mb-2 cursor-pointer hover:text-gray-600 transition-colors duration-200"
                    onClick={handleProductDetails}
                >
                    {item?.name}
                </motion.h3>

                <div className="mb-3">
                    <PriceContainer item={item} />
                </div>

                <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: isHovered ? 1 : 0, height: isHovered ? "auto" : 0 }}
                    transition={{ duration: 0.3 }}
                >
                    <AddToCartButton item={item} />
                </motion.div>

                {!isHovered && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                    >
                        <AddToCartButton item={item} />
                    </motion.div>
                )}
            </motion.div>
        </motion.div>
    );
};

ProductCard.propTypes = {
    item: PropTypes.shape({
        _id: PropTypes.string,
        name: PropTypes.string,
        image: PropTypes.string,
        images: PropTypes.arrayOf(PropTypes.string),
        offer: PropTypes.bool,
        badge: PropTypes.bool,
        discountedPercentage: PropTypes.number,
        brand: PropTypes.string,
        category: PropTypes.string,
        description: PropTypes.string,
    }).isRequired,
    viewMode: PropTypes.oneOf(["grid", "list"]),
    className: PropTypes.string,
};

export default ProductCard;
