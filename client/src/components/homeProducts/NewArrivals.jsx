import { useEffect, useState } from "react";
import Slider from "react-slick";
import { motion } from "framer-motion";
import NextArrow from "../NextArrow";
import PreviousArrow from "../PreviousArrow";
import ProductCard from "../ProductCard";
import { getData } from "../../helpers";
import { config } from "../../../config";
import { HiArrowRight, HiStar } from "react-icons/hi";
import { Link } from "react-router-dom";

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: { staggerChildren: 0.08 },
    },
};

const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { type: "spring", stiffness: 100, damping: 12 },
    },
};

const NewArrivals = () => {
    const settings = {
        infinite: true,
        speed: 500,
        slidesToShow: 4,
        slidesToScroll: 1,
        nextArrow: <NextArrow />,
        prevArrow: <PreviousArrow />,
        responsive: [
            {
                breakpoint: 1025,
                settings: {
                    slidesToShow: 3,
                    slidesToScroll: 1,
                    infinite: true,
                },
            },
            {
                breakpoint: 769,
                settings: {
                    slidesToShow: 2,
                    slidesToScroll: 2,
                    infinite: true,
                },
            },
            {
                breakpoint: 480,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1,
                    infinite: true,
                },
            },
        ],
    };

    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const endpoint = `${config?.baseUrl}/api/products?_type=new_arrivals`;

    useEffect(() => {
        const getProducts = async () => {
            setLoading(true);
            try {
                const data = await getData(endpoint);
                // Handle the new API response format that includes success field
                setProducts(data?.products || []);
            } catch (error) {
                console.error("Error fetching products:", error);
                setProducts([]);
            } finally {
                setLoading(false);
            }
        };
        getProducts();
    }, []);

    // Render skeleton loading state
    if (loading) {
        return (
            <div className="w-full py-10">
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {Array.from({ length: 4 }).map((_, index) => (
                        <div
                            key={index}
                            className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden animate-pulse"
                        >
                            <div className="aspect-square bg-gray-200"></div>
                            <div className="p-4">
                                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                                <div className="h-3 bg-gray-200 rounded mb-2 w-3/4"></div>
                                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
        >
            {products?.map((item) => (
                <motion.div key={item?._id} variants={itemVariants}>
                    <ProductCard item={item} />
                </motion.div>
            ))}
            {(!products || products.length === 0) && (
                <div className="col-span-full text-center py-12">
                    <p className="text-gray-500">No new arrivals available</p>
                </div>
            )}
        </motion.div>
    );
};

export default NewArrivals;
