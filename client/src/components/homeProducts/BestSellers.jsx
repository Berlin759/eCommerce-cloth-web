import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Slider from "react-slick";
import { motion } from "framer-motion";
import { HiArrowRight, HiChevronLeft, HiChevronRight } from "react-icons/hi";
import NextArrow from "../NextArrow";
import PreviousArrow from "../PreviousArrow";
import ProductCard from "../ProductCard";
import { getData } from "../../helpers";
import { config } from "../../../config";
import Container from "../Container";
import PriceContainer from "../PriceContainer";

const productBackground = [
    "bg-[#fdf6eb]",
    "bg-[#fce8ec]",
    "bg-[#e8f5ec]",
    "bg-[#fdf0e8]",
];

const fadeInUp = {
    initial: { opacity: 0, y: 40 },
    animate: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.6, ease: "easeOut" }
    }
};

const staggerContainer = {
    animate: {
        transition: {
            staggerChildren: 0.1,
            delayChildren: 0.1
        }
    }
};

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

const BestSellers = () => {
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
    const endpoint = `${config?.baseUrl}/api/products?_type=best_sellers`;

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
        // <motion.div
        //     variants={containerVariants}
        //     initial="hidden"
        //     whileInView="visible"
        //     viewport={{ once: true }}
        //     className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
        // >
        //     {products?.map((item) => (
        //         <motion.div key={item?._id} variants={itemVariants}>
        //             <ProductCard item={item} />
        //         </motion.div>
        //     ))}
        //     {(!products || products.length === 0) && (
        //         <div className="col-span-full text-center py-12">
        //             <p className="text-gray-500">No bestsellers available</p>
        //         </div>
        //     )}
        // </motion.div>

        <section className="py-20 bg-white">
            <Container>
                <motion.div
                    variants={fadeInUp}
                    initial="initial"
                    whileInView="animate"
                    viewport={{ once: true }}
                    className="text-center mb-16"
                >
                    <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-[#171717] mb-4">
                        {/* Shop our<br />top shelf */}
                        Shop our top shelf
                    </h2>
                    <p className="text-gray-600 text-xl mb-8">
                        Our most popular products loved by customers
                    </p>
                    <Link
                        to="/shop"
                        className="inline-flex items-center gap-2 px-8 py-4 bg-[#171717] text-white font-semibold hover:bg-[#936e29] transition-colors duration-300"
                    >
                        Shop All <HiArrowRight className="w-5 h-5" />
                    </Link>
                </motion.div>

                <motion.div
                    variants={staggerContainer}
                    initial="initial"
                    whileInView="animate"
                    viewport={{ once: true }}
                    className="grid md:grid-cols-2 lg:grid-cols-4 gap-8"
                >
                    {products.map((product, index) => (
                        <motion.div key={product._id} variants={fadeInUp}>
                            <Link to={`/shop?category=${product?.category}`} className="block group">
                                <div className={`${productBackground[index]} rounded-none p-8 mb-4 aspect-square flex items-center justify-center transition-transform duration-300 group-hover:scale-[1.02]`}>
                                    <img
                                        src={product?.images?.[0] || product?.image}
                                        alt={product?.name}
                                        className="w-full h-full object-cover"
                                        onError={(e) => {
                                            e.target.src = "https://via.placeholder.com/400x400?text=Product";
                                        }}
                                    />
                                </div>
                                <h4 className="font-bold text-[#171717] text-lg">{product?.name}</h4>
                                <div className="mt-5 mb-3">
                                    <PriceContainer item={product} className={`text-xl font-semibold `} />
                                </div>
                                <span className="inline-flex items-center gap-1 text-[#936e29] font-semibold text-sm">
                                    SHOP NOW <HiArrowRight className="w-3 h-3" />
                                </span>
                            </Link>
                        </motion.div>
                    ))}

                    {(!products || products.length === 0) && (
                        <div className="col-span-full text-center py-12">
                            <p className="text-gray-600 text-xl mb-8">No top selling brand available</p>
                        </div>
                    )}
                </motion.div>
            </Container>
        </section>
    );
};

export default BestSellers;
