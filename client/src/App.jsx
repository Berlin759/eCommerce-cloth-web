import { useEffect, useState, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { useDispatch } from "react-redux";
import {
    addCategories,
    addUser,
    removeUser,
    setOrderCount,
    resetOrderCount,
} from "./redux/orebiSlice";
import { serverUrl } from "../config";
import api from "./api/axiosInstance";
import Container from "./components/Container";
import Banner from "./components/Banner";
import ProductOfTheYear from "./components/homeProducts/ProductOfTheYear";
import Videos from "./components/homeProducts/Videos";
import NewArrivals from "./components/homeProducts/NewArrivals";
import BestSellers from "./components/homeProducts/BestSellers";
import SpecialOffers from "./components/homeProducts/SpecialOffers";
import { HiArrowRight, HiChevronLeft, HiChevronRight } from "react-icons/hi";
import { IoStar } from "react-icons/io5";
import { luxuryBannerImg } from "./assets/images";

const pageVariants = {
    initial: { opacity: 0 },
    animate: {
        opacity: 1,
        transition: { staggerChildren: 0.1, delayChildren: 0.2 }
    }
};

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

const FeaturedCollections = () => {
    const collections = [
        {
            id: 1,
            title: "Extreme Damage Care",
            subtitle: "Shampoo & Conditioner",
            image: "https://images.ctfassets.net/r9udlqyetmm3/12YlFtFEIHsaXWoflaIVuK/3b18b2d5f39652da6bec40703ab81703/product-1.png",
            link: "/shop?category=extreme-damage-care",
            bg: "bg-[#fdf6eb]"
        },
        {
            id: 2,
            title: "Miracle Rescue",
            subtitle: "Regenerative Hair Oil",
            image: "https://images.ctfassets.net/r9udlqyetmm3/bM7BiYVvKlLN3AxEEEw0l/2d3f1cfbd9796afb85271d5b47bffbe5/product-2.png",
            link: "/shop?category=miracle-rescue",
            bg: "bg-[#fce8ec]"
        },
        {
            id: 3,
            title: "Abundant & Strong",
            subtitle: "Shampoo & Conditioner",
            image: "https://images.ctfassets.net/r9udlqyetmm3/60lvO9Zt5syUH3kdAdXGDy/182a2f1681b4ae391063f5f8e54c7606/product-1.jpg",
            link: "/shop?category=abundant-strong",
            bg: "bg-[#e8f5ec]"
        },
        {
            id: 4,
            title: "Pro-V Miracles",
            subtitle: "Collection",
            image: "https://images.ctfassets.net/r9udlqyetmm3/5JVVmAyAglBkvCj5P2d2Ax/d1c6007a94701e428e22feb9ff542a03/Shot23_FullCollection_MiracleRescue_3850_v1_sRGB_150dpi_1__3___1___2_.jpg",
            link: "/shop?category=pro-v-miracles",
            bg: "bg-[#fdf0e8]"
        },
    ];

    return (
        <section className="py-20 bg-white">
            <Container>
                <motion.div
                    variants={fadeInUp}
                    initial="initial"
                    whileInView="animate"
                    viewport={{ once: true }}
                    className="text-center mb-16"
                >
                    <h2 className="text-4xl md:text-5xl font-bold text-[#171717] mb-4">
                        ingredient no.1
                    </h2>
                    <h3 className="text-2xl md:text-3xl font-semibold text-[#936e29] mb-4">
                        pro-vitamin
                    </h3>
                    <p className="text-gray-600 text-lg max-w-2xl mx-auto">
                        THE ONE THING IN EVERYTHING - Our primary ingredient developed for stronger and thicker hair.
                    </p>
                    <Link
                        to="/about"
                        className="inline-flex items-center gap-2 mt-6 text-[#936e29] font-semibold hover:underline"
                    >
                        Learn more <HiArrowRight className="w-4 h-4" />
                    </Link>
                </motion.div>

                <motion.div
                    variants={staggerContainer}
                    initial="initial"
                    whileInView="animate"
                    viewport={{ once: true }}
                    className="grid grid-cols-2 lg:grid-cols-4 gap-6"
                >
                    {collections.map((item) => (
                        <motion.div
                            key={item.id}
                            variants={fadeInUp}
                        >
                            <Link to={item.link} className="block group">
                                <div className={`${item.bg} rounded-none p-8 mb-4 aspect-square flex items-center justify-center transition-transform duration-300 group-hover:scale-[1.02]`}>
                                    <img
                                        src={item.image}
                                        alt={item.title}
                                        className="w-full h-full object-contain mix-blend-multiply"
                                        onError={(e) => {
                                            e.target.src = "https://via.placeholder.com/300x300?text=Product";
                                        }}
                                    />
                                </div>
                                <h4 className="font-bold text-[#171717] text-lg">{item.title}</h4>
                                <p className="text-gray-500 text-sm">{item.subtitle}</p>
                            </Link>
                        </motion.div>
                    ))}
                </motion.div>
            </Container>
        </section>
    );
};

const ProVitaminBanner = () => {
    return (
        <section className="py-24 bg-[#f4f6f6]">
            <Container>
                <div className="flex flex-col lg:flex-row items-center gap-16">
                    <motion.div
                        initial={{ opacity: 0, x: -40 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="flex-1 text-center lg:text-left"
                    >
                        <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-[#171717] mb-6">
                            Luxury is beautiful
                        </h2>
                        <p className="text-gray-600 text-lg mb-8 max-w-lg">
                            Our experts have spent years perfecting our fabrics and fits, creating garments that provide all-day comfort, lasting durability, and confidence from within.
                        </p>
                        {/* <Link
                            to="/about"
                            className="inline-flex items-center gap-3 px-8 py-4 bg-[#171717] text-white font-semibold hover:bg-[#936e29] transition-colors duration-300"
                        >
                            Discover Our Story
                            <HiArrowRight className="w-5 h-5" />
                        </Link> */}
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="flex-1"
                    >
                        <div className="relative w-full aspect-square max-w-[500px] mx-auto bg-gradient-to-br from-[#d4b37b]/20 to-[#9d7631]/20 rounded-full flex items-center justify-center">
                            <img
                                src={luxuryBannerImg}
                                // src="https://images.ctfassets.net/r9udlqyetmm3/5JoNeOaqBem4a0wRbUlQVz/680b553e3788426eb947e5613ba4bda3/slider-product-1.png"
                                alt="Pro-V Formula"
                                className="img-width object-contain"
                                onError={(e) => {
                                    e.target.src = "https://via.placeholder.com/500x500?text=Pro-V";
                                }}
                            />
                        </div>
                    </motion.div>
                </div>
            </Container>
        </section>
    );
};

const TopShelfProducts = () => {
    const products = [
        {
            id: 1,
            title: "Miracle Rescue",
            subtitle: "Curl Define & Shine Leave-On Conditioner",
            image: "https://images.ctfassets.net/r9udlqyetmm3/5JoNeOaqBem4a0wRbUlQVz/680b553e3788426eb947e5613ba4bda3/slider-product-1.png",
            link: "/shop",
            bg: "bg-[#fce8ec]"
        },
        {
            id: 2,
            title: "Extreme Damage Care",
            subtitle: "Shampoo",
            image: "https://images.ctfassets.net/r9udlqyetmm3/7pJBf4mm59uwYdr5GgtcbR/d525afc934863704adb6d521345f09cf/Shot1_SingleProductBathroom_ExtremeDamageCareSH_2464_Main_STACKED_v1_sRGB_150dpi__2___1_.jpg",
            link: "/shop",
            bg: "bg-[#fdf6eb]"
        },
        {
            id: 3,
            title: "Abundant & Strong",
            subtitle: "Daily Scalp & Root Serum",
            image: "https://images.ctfassets.net/r9udlqyetmm3/6C3vPWW0Nf6LSRwL488Fje/04d3579370fe67a6b5d1cafdbc40a7d9/product-2.jpg",
            link: "/shop",
            bg: "bg-[#e8f5ec]"
        },
        {
            id: 4,
            title: "Miracle Rescue",
            subtitle: "Collection",
            image: "https://images.ctfassets.net/r9udlqyetmm3/5JVVmAyAglBkvCj5P2d2Ax/d1c6007a94701e428e22feb9ff542a03/Shot23_FullCollection_MiracleRescue_3850_v1_sRGB_150dpi_1__3___1___2_.jpg",
            link: "/shop",
            bg: "bg-[#fce8ec]"
        },
    ];

    return (
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
                        Shop our<br />top shelf
                    </h2>
                    <p className="text-gray-600 text-xl mb-8">
                        Get luxury hair repair without the luxury price tag.
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
                    {products.map((product) => (
                        <motion.div key={product.id} variants={fadeInUp}>
                            <Link to={product.link} className="block group">
                                <div className={`${product.bg} rounded-none p-8 mb-4 aspect-square flex items-center justify-center transition-transform duration-300 group-hover:scale-[1.02]`}>
                                    <img
                                        src={product.image}
                                        alt={product.title}
                                        className="w-full h-full object-cover"
                                        onError={(e) => {
                                            e.target.src = "https://via.placeholder.com/400x400?text=Product";
                                        }}
                                    />
                                </div>
                                <h4 className="font-bold text-[#171717] text-lg">{product.title}</h4>
                                <p className="text-gray-600 text-sm mb-3">{product.subtitle}</p>
                                <span className="inline-flex items-center gap-1 text-[#936e29] font-semibold text-sm">
                                    SHOP NOW <HiArrowRight className="w-3 h-3" />
                                </span>
                            </Link>
                        </motion.div>
                    ))}
                </motion.div>
            </Container>
        </section>
    );
};

const ReviewsSection = () => {
    const reviews = [
        {
            id: 1,
            name: "Aarav",
            text: "The quality of the fabric is amazing. The hoodie feels premium and super comfortable for everyday wear.",
            rating: 5
        },
        {
            id: 2,
            name: "Riya",
            text: "Absolutely love the streetwear collection! The fit is perfect and the designs are trendy without being over the top.",
            rating: 5
        },
        {
            id: 3,
            name: "Kabir",
            text: "Fast delivery and the t-shirts look even better in real life. I've already ordered two more.",
            rating: 4
        },
        {
            id: 4,
            name: "Meera",
            text: "Finally found a brand that nails both comfort and style. Perfect outfits for college and casual outings.",
            rating: 5
        },
        {
            id: 5,
            name: "Arjun",
            text: "The oversized fit is exactly what I was looking for. Great street style vibe!",
            rating: 5
        },
        {
            id: 6,
            name: "Sneha",
            text: "The co-ord set I bought is stylish and super comfy. Got so many compliments!",
            rating: 5
        },
        {
            id: 7,
            name: "Dev",
            text: "Affordable prices with premium feel. This is now my go-to store for casual wear.",
            rating: 4
        },
        {
            id: 8,
            name: "Ananya",
            text: "Loved the packaging and the quality. The crop tops fit perfectly and feel great.",
            rating: 5
        }
    ];

    return (
        <section className="py-20 bg-[#171717]">
            <Container>
                <motion.div
                    variants={fadeInUp}
                    initial="initial"
                    whileInView="animate"
                    viewport={{ once: true }}
                    className="text-center mb-12"
                >
                    <span className="text-[#d4b37b] font-bold text-lg tracking-widest uppercase">Reviews</span>
                </motion.div>

                <motion.div
                    variants={staggerContainer}
                    initial="initial"
                    whileInView="animate"
                    viewport={{ once: true }}
                    className="grid md:grid-cols-2 lg:grid-cols-4 gap-6"
                >
                    {reviews.map((review) => (
                        <motion.div
                            key={review.id}
                            variants={fadeInUp}
                            className="bg-white/5 p-8 border border-white/10"
                        >
                            <div className="flex gap-1 mb-4">
                                {[...Array(review.rating)].map((_, i) => (
                                    <IoStar key={i} className="text-[#d4b37b] w-5 h-5 fill-current" />
                                ))}
                            </div>
                            <p className="text-gray-300 mb-6 italic leading-relaxed">&ldquo;{review.text}&rdquo;</p>
                            <p className="font-bold text-white">{review.name}</p>
                        </motion.div>
                    ))}
                </motion.div>
            </Container>
        </section>
    );
};

const PromoBanner = ({ promo }) => {
    if (!promo?.isActive) return null;

    return (
        <div className="bg-gradient-to-r from-[#9d7631] via-[#d4b37b] to-[#9d7631] py-4">
            <Container>
                <div className="flex items-center justify-center gap-4 text-white">
                    <span className="font-bold text-lg">
                        {promo.title || "FLASH SALE"}: {promo.description || "Get amazing discounts!"}
                        {promo.code && (
                            <span className="ml-3 px-3 py-1 bg-black/20 rounded font-mono">
                                {promo.code}
                            </span>
                        )}
                    </span>
                    <Link
                        to={promo.link || "/shop?offer=true"}
                        className="ml-4 px-6 py-2 bg-white text-[#936e29] font-bold hover:bg-gray-100 transition-colors"
                    >
                        Shop Now
                    </Link>
                </div>
            </Container>
        </div>
    );
};

const FeatureStrip = ({ features }) => {
    const defaultFeatures = [
        { icon: "🚚", title: "Free Shipping", desc: "On orders above ₹500" },
        { icon: "↩️", title: "Easy Returns", desc: "7-day return policy" },
        { icon: "🔒", title: "Secure Payment", desc: "100% protected" },
        { icon: "💬", title: "24/7 Support", desc: "Always here to help" },
    ];

    const displayFeatures = features?.length > 0 ? features : defaultFeatures;

    return (
        <div className="bg-white border-b border-gray-100 py-8">
            <Container>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    {displayFeatures.map((feature, index) => (
                        <div
                            key={index}
                            className="flex items-center gap-4 p-4"
                        >
                            <span className="text-3xl">{feature.icon}</span>
                            <div>
                                <h4 className="font-bold text-[#171717]">{feature.title}</h4>
                                <p className="text-xs text-gray-500">{feature.description || feature.desc}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </Container>
        </div>
    );
};

const NewsletterSection = () => {
    const [email, setEmail] = useState("");
    const [subscribed, setSubscribed] = useState(false);

    const handleSubscribe = (e) => {
        e.preventDefault();
        if (email) {
            setSubscribed(true);
            setEmail("");
        }
    };

    return (
        <section className="py-24 bg-[#f4f6f6]">
            <Container>
                <motion.div
                    variants={fadeInUp}
                    initial="initial"
                    whileInView="animate"
                    viewport={{ once: true }}
                    className="max-w-3xl mx-auto text-center"
                >
                    <h2 className="text-4xl md:text-5xl font-bold text-[#171717] mb-6">
                        Join the Pantene Family
                    </h2>
                    <p className="text-gray-600 text-lg mb-10 max-w-xl mx-auto">
                        Subscribe to receive exclusive deals, early access to new products, and special discounts.
                    </p>

                    {subscribed ? (
                        <div className="p-6 bg-green-50 border border-green-200 rounded-lg text-green-700 text-lg font-semibold">
                            Successfully subscribed! Welcome aboard!
                        </div>
                    ) : (
                        <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-4 max-w-lg mx-auto">
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Enter your email address"
                                required
                                className="flex-1 px-6 py-4 border border-gray-300 text-[#171717] placeholder-gray-400 focus:outline-none focus:border-[#936e29] transition-colors"
                            />
                            <button
                                type="submit"
                                className="px-10 py-4 bg-[#171717] text-white font-semibold hover:bg-[#936e29] transition-colors"
                            >
                                Subscribe
                            </button>
                        </form>
                    )}
                </motion.div>
            </Container>
        </section>
    );
};

function App() {
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(true);
    const [loadingCategories, setLoadingCategories] = useState(false);
    // const [homeData, setHomeData] = useState({
    //     banners: [],
    //     promo: null,
    //     features: [],
    //     stats: [],
    //     newsletter: null,
    // });

    // const fetchHomeData = async () => {
    //     try {
    //         const [bannersRes, settingsRes] = await Promise.all([
    //             api.get(`${serverUrl}/api/banner`),
    //             api.get(`${serverUrl}/api/settings`).catch(() => ({ data: { success: false } })),
    //         ]);

    //         const banners = bannersRes.data?.success ? bannersRes.data.banners.filter(b => b.isActive) : [];
    //         const settings = settingsRes.data?.success ? settingsRes.data.settings : {};

    //         setHomeData({
    //             banners,
    //             promo: settings.promo || null,
    //             features: settings.features || [],
    //             stats: settings.stats || [],
    //             newsletter: settings.newsletter || null,
    //         });
    //     } catch (error) {
    //         console.error("Error fetching home data:", error);
    //     }
    // };

    const fetchCategories = useCallback(async () => {
        setLoadingCategories(true);
        try {
            const response = await api.get(`${serverUrl}/api/category`);
            if (response?.data?.success) {
                dispatch(addCategories(response.data.categories));
            }
        } catch (error) {
            console.error("Error fetching categories:", error);
        } finally {
            setLoadingCategories(false);
        }
    }, [dispatch]);

    const fetchUserOrderCount = useCallback(async (token) => {
        try {
            const response = await api.get(`${serverUrl}/api/order/my-orders`);
            const data = response.data;
            if (data.success) {
                dispatch(setOrderCount(data.orders.length));
            } else if (data.message === "TOKEN_EXPIRED" || data.message === "INVALID_TOKEN") {
                localStorage.removeItem("token");
                dispatch(removeUser());
                dispatch(resetOrderCount());
            }
        } catch (error) {
            console.error("Error fetching order count:", error);
        }
    }, [dispatch]);

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            dispatch(removeUser());
            dispatch(resetOrderCount());
            setLoading(false);
            return;
        }
        try {
            const decoded = jwtDecode(token);
            const currentTime = Date.now() / 1000;
            if (decoded.exp < currentTime) {
                localStorage.removeItem("token");
                dispatch(removeUser());
                dispatch(resetOrderCount());
                setLoading(false);
                return;
            }
            dispatch(addUser(decoded));
            fetchUserOrderCount(token);
        } catch (error) {
            console.error("Invalid token:", error);
            localStorage.removeItem("token");
            dispatch(removeUser());
            dispatch(resetOrderCount());
        }
        setLoading(false);
    }, [dispatch, fetchUserOrderCount]);

    useEffect(() => {
        // fetchHomeData();
        fetchCategories();
    }, [fetchCategories]);

    if (loading || loadingCategories) {
        return (
            <div className="w-full h-screen flex justify-center items-center bg-white">
                <div className="w-12 h-12 border-4 border-gray-200 border-t-[#936e29] rounded-full animate-spin" />
            </div>
        );
    }

    return (
        <motion.main
            variants={pageVariants}
            initial="initial"
            animate="animate"
            className="w-full overflow-hidden bg-white"
            style={{ fontFamily: 'Montserrat, Arial, Helvetica, sans-serif' }}
        >
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700&display=swap');
            `}</style>

            {/* <PromoBanner promo={homeData.promo} /> */}
            <Banner />
            {/* <FeatureStrip features={homeData.features} /> */}
            {/* <FeaturedCollections /> */}
            <SpecialOffers />
            <ProVitaminBanner />
            {/* <TopShelfProducts /> */}
            <BestSellers />
            <Videos />
            <ReviewsSection />

            {/* <section className="py-20 bg-white">
                <Container>
                    <div className="text-center mb-12">
                        <h2 className="text-4xl font-bold text-[#171717] mb-4">New Arrivals</h2>
                        <p className="text-gray-600">Check out the latest additions to our collection</p>
                    </div>
                    <NewArrivals />
                </Container>
            </section> */}

            {/* <section className="py-20 bg-[#f4f6f6]">
                <Container>
                    <div className="text-center mb-12">
                        <h2 className="text-4xl font-bold text-[#171717] mb-4">Best Sellers</h2>
                        <p className="text-gray-600">Our most popular products loved by customers</p>
                    </div>
                    <BestSellers />
                </Container>
            </section> */}

            {/* <section className="py-20 bg-white">
                <Container>
                    <div className="text-center mb-12">
                        <h2 className="text-4xl font-bold text-[#171717] mb-4">Special Offers</h2>
                        <p className="text-gray-600">Grab these deals before they're gone</p>
                    </div>
                    <SpecialOffers />
                </Container>
            </section> */}

            {/* <NewsletterSection /> */}
        </motion.main>
    );
}

export default App;
