import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Slider from "react-slick";
import { motion } from "framer-motion";
import { HiChevronLeft, HiChevronRight } from "react-icons/hi2";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Container from "./Container";
import PriceFormat from "./PriceFormat";
import { serverUrl } from "../../config";
import api from "../api/axiosInstance";

const bannerData = [
    {
        title: "Premium Collection",
        subtitle: "Top selling smartphone and accessories",
        description: "Discover the latest in mobile technology with exclusive discounts",
        discount: "Up to 40% off",
        from: 599.99,
        sale: "Limited Time",
        image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&h=800&fit=crop",
    },
    {
        title: "Household Chairs",
        subtitle: "The best deals on Chairs",
        description: "Professional-grade chairs for creatives and professionals",
        discount: "$250 off",
        from: 2349.99,
        sale: "Special Offer",
        image: "https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?w=800&h=800&fit=crop",
    },
    {
        title: "Lighting Excellence",
        subtitle: "Premium lighting collection",
        description: "Experience crystal-clear light with our curated selection",
        discount: "Free shipping",
        from: 199.99,
        sale: "Weekend Deal",
        image: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=800&h=800&fit=crop",
    },
];

const fadeInUp = {
    hidden: { opacity: 0, y: 40 },
    visible: (i) => ({
        opacity: 1,
        y: 0,
        transition: {
            delay: i * 0.15,
            duration: 0.6,
            ease: [0.25, 0.46, 0.45, 0.94],
        },
    }),
};

const floatAnimation = {
    animate: {
        y: [0, -10, 0],
        transition: {
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut",
        },
    },
};

const pulseRing = {
    animate: {
        scale: [1, 1.5, 1],
        opacity: [0.5, 0, 0.5],
        transition: {
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
        },
    },
};

const Banner = () => {
    const navigate = useNavigate();
    const sliderRef = useRef(null);
    const [dotActive, setDocActive] = useState(0);
    const [isHovered, setIsHovered] = useState(false);
    const [banners, setBanners] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchBanners = async () => {
        try {
            setLoading(true);
            const response = await api.get(`${serverUrl}/api/banner`);
            const data = response.data;

            if (data.success && data.banners && data.banners.length > 0) {
                const activeBanners = data.banners.filter((b) => b.isActive);
                if(activeBanners && activeBanners.length > 0){
                    setBanners(activeBanners);
                } else {
                    setBanners(bannerData);
                };
            } else {
                setBanners(bannerData);
            };
        } catch (error) {
            console.error("Error fetching banners:", error);
            setBanners(bannerData);
        } finally {
            setLoading(false);
        };
    };

    useEffect(() => {
        fetchBanners();
    }, []);

    const settings = {
        dots: true,
        infinite: true,
        autoplay: true,
        autoplaySpeed: 4000,
        slidesToShow: 1,
        slidesToScroll: 1,
        arrows: false,
        fade: true,
        cssEase: "linear",
        beforeChange: (prev, next) => {
            setDocActive(next);
        },
        appendDots: (dots) => (
            <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
                <ul className="flex items-center gap-3">{dots}</ul>
            </div>
        ),
        customPaging: (i) => (
            <div
                className={`cursor-pointer transition-all duration-300 ${i === dotActive
                        ? "w-8 h-2 bg-gray-800 rounded-full"
                        : "w-2 h-2 bg-gray-600/50 rounded-full hover:bg-gray-600/75"
                    }`}
            />
        ),
        responsive: [
            {
                breakpoint: 768,
                settings: {
                    fade: false,
                    appendDots: (dots) => (
                        <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2">
                            <ul className="flex items-center gap-2">{dots}</ul>
                        </div>
                    ),
                    customPaging: (i) => (
                        <div
                            className={`cursor-pointer transition-all duration-300 ${i === dotActive
                                    ? "w-6 h-1.5 bg-gray-800 rounded-full"
                                    : "w-1.5 h-1.5 bg-gray-600/50 rounded-full hover:bg-gray-600/75"
                                }`}
                        />
                    ),
                },
            },
        ],
    };

    if (loading) {
        return (
            <div className="w-full h-[70vh] min-h-[500px] flex items-center justify-center bg-gray-100">
                <div className="w-12 h-12 border-4 border-gray-300 border-t-blue-600 rounded-full animate-spin"></div>
            </div>
        );
    };

    if (!banners || banners.length === 0) {
        return (
            <div className="w-full h-[60vh] flex items-center justify-center bg-gray-100 text-gray-500">
                No banners available
            </div>
        );
    };

    return (
        <div
            className="w-full h-[70vh] min-h-[750px] max-h-[1500px] relative overflow-hidden group bg-white"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <Slider ref={sliderRef} {...settings}>
                {banners?.map((item, index) => (
                    <div
                        key={index}
                        className="relative h-[70vh] min-h-[750px] max-h-[1500px]"
                    >
                        <div className="relative z-10 h-full bg-gradient-to-br from-gray-50 via-white to-gray-100">
                            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_rgba(59,130,246,0.1),_transparent_50%)]" />
                            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_rgba(168,85,247,0.1),_transparent_50%)]" />
                            <div
                                className="absolute inset-0 opacity-30"
                                style={{
                                    backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='0.03'%3E%3Ccircle cx='30' cy='30' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                                }}
                            ></div>

                            <Container className="h-full relative z-10 py-8 md:py-0">
                                <div className="flex flex-col lg:grid lg:grid-cols-2 gap-8 lg:gap-5 h-full lg:items-center">
                                    <motion.div
                                        initial={{ opacity: 0, x: -80 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ duration: 0.8, ease: "easeOut" }}
                                        className="space-y-5 lg:space-y-6 text-gray-800 order-2 lg:order-1 text-center lg:text-left"
                                    >
                                        <motion.div
                                            custom={0}
                                            initial="hidden"
                                            animate="visible"
                                            variants={fadeInUp}
                                            className="inline-flex items-center gap-2"
                                        >
                                            <span className="relative flex h-3 w-3">
                                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                                                <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                                            </span>
                                            <span className="inline-flex items-center px-5 py-2.5 bg-gradient-to-r from-red-600 to-red-500 text-white text-sm font-bold uppercase tracking-wider rounded-full shadow-lg shadow-red-500/25">
                                                {item?.sale}
                                            </span>
                                        </motion.div>

                                        <motion.h1
                                            custom={1}
                                            initial="hidden"
                                            animate="visible"
                                            variants={fadeInUp}
                                            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black leading-tight lg:leading-none bg-gradient-to-r from-gray-800 via-gray-900 to-black bg-clip-text text-transparent"
                                        >
                                            {item?.title}
                                        </motion.h1>

                                        <motion.p
                                            custom={2}
                                            initial="hidden"
                                            animate="visible"
                                            variants={fadeInUp}
                                            className="text-lg sm:text-xl md:text-2xl text-gray-600 font-semibold"
                                        >
                                            {item?.subtitle}
                                        </motion.p>

                                        <motion.p
                                            custom={3}
                                            initial="hidden"
                                            animate="visible"
                                            variants={fadeInUp}
                                            className="text-base sm:text-lg text-gray-500 leading-relaxed max-w-xl mx-auto lg:mx-0"
                                        >
                                            {item?.description}
                                        </motion.p>

                                        <motion.div
                                            custom={4}
                                            initial="hidden"
                                            animate="visible"
                                            variants={fadeInUp}
                                            className="flex flex-col sm:flex-row sm:items-center justify-center lg:justify-start gap-4 lg:gap-8 py-3 lg:py-5"
                                        >
                                            <div className="flex items-center justify-center lg:justify-start">
                                                <div className="text-3xl sm:text-4xl md:text-5xl font-black text-transparent bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 bg-clip-text drop-shadow-sm">
                                                    {item?.discount}
                                                </div>
                                            </div>
                                            <div className="flex items-center justify-center lg:justify-start gap-3">
                                                <span className="text-sm sm:text-base text-gray-500 font-medium">
                                                    Starting from
                                                </span>
                                                <PriceFormat
                                                    amount={item?.from}
                                                    className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800"
                                                />
                                            </div>
                                        </motion.div>

                                        <motion.div
                                            custom={5}
                                            initial="hidden"
                                            animate="visible"
                                            variants={fadeInUp}
                                            className="pt-3 lg:pt-5 flex justify-center lg:justify-start"
                                        >
                                            <motion.button
                                                onClick={() => navigate("/shop")}
                                                whileHover={{ scale: 1.05, boxShadow: "0 20px 40px rgba(0,0,0,0.2)" }}
                                                whileTap={{ scale: 0.98 }}
                                                className="group relative inline-flex items-center gap-3 lg:gap-4 px-10 lg:px-12 py-5 lg:py-6 bg-black text-white text-sm lg:text-base font-bold uppercase tracking-wider overflow-hidden shadow-2xl"
                                            >
                                                <span className="absolute inset-0 bg-gradient-to-r from-gray-800 via-gray-900 to-black transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></span>
                                                <motion.span
                                                    className="relative z-10 flex items-center gap-2"
                                                >
                                                    <span>Shop Collection</span>
                                                    <motion.span
                                                        animate={{ x: [0, 5, 0] }}
                                                        transition={{ duration: 1.5, repeat: Infinity }}
                                                    >
                                                        →
                                                    </motion.span>
                                                </motion.span>
                                            </motion.button>
                                        </motion.div>
                                    </motion.div>

                                    <motion.div
                                        initial={{ opacity: 0, x: 80, scale: 0.8, rotate: 5 }}
                                        animate={{ opacity: 1, x: 0, scale: 1, rotate: 0 }}
                                        transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
                                        className="relative order-1 lg:order-2 h-64 sm:h-80 lg:h-full flex items-center justify-center"
                                    >
                                        <div className="relative max-w-xs sm:max-w-sm lg:max-w-xl w-full pt-3">
                                            <motion.div
                                                animate={floatAnimation.animate}
                                                className="absolute inset-0 bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-pink-500/20 rounded-full blur-3xl transform scale-110"
                                            />

                                            <motion.div
                                                initial={{ rotate: -5 }}
                                                animate={{ rotate: 0 }}
                                                transition={{ duration: 1, ease: "easeOut" }}
                                                className="relative bg-gradient-to-br from-white/80 to-white/40 backdrop-blur-xl rounded-3xl p-6 sm:p-8 lg:p-10 border border-white/50 shadow-2xl"
                                            >
                                                <motion.div
                                                    variants={pulseRing}
                                                    animate="animate"
                                                    className="absolute -top-4 -right-4 w-16 h-16 bg-yellow-400/30 rounded-full"
                                                />
                                                <motion.div
                                                    variants={pulseRing}
                                                    animate="animate"
                                                    transition={{ delay: 0.5 }}
                                                    className="absolute -bottom-6 -left-6 w-20 h-20 bg-blue-400/30 rounded-full"
                                                />
                                                <img
                                                    src={item?.image}
                                                    alt={`Banner ${index + 1}`}
                                                    className="w-full h-auto max-h-56 sm:max-h-72 lg:max-h-[500px] object-contain drop-shadow-2xl"
                                                />
                                            </motion.div>

                                            <motion.div
                                                initial={{ scale: 0, opacity: 0 }}
                                                animate={{ scale: 1, opacity: 1 }}
                                                transition={{ delay: 0.8 }}
                                                className="absolute -top-4 -right-4 lg:-top-6 lg:-right-6 w-16 h-16 lg:w-24 lg:h-24 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-2xl flex items-center justify-center shadow-lg"
                                            >
                                                <span className="text-white font-bold text-xs lg:text-sm">HOT</span>
                                            </motion.div>
                                        </div>
                                    </motion.div>
                                </div>
                            </Container>
                        </div>
                    </div>
                ))}
            </Slider>

            <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: isHovered ? 1 : 0, x: isHovered ? 0 : -20 }}
                transition={{ duration: 0.3 }}
                className="absolute inset-y-0 left-0 flex items-center z-20"
            >
                <button
                    onClick={() => sliderRef.current?.slickPrev()}
                    className="ml-4 lg:ml-8 p-4 bg-white/90 backdrop-blur-sm text-gray-900 hover:bg-white hover:scale-110 transition-all duration-200 rounded-full shadow-xl"
                    aria-label="Previous slide"
                >
                    <HiChevronLeft className="w-6 h-6" />
                </button>
            </motion.div>

            <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: isHovered ? 1 : 0, x: isHovered ? 0 : 20 }}
                transition={{ duration: 0.3 }}
                className="absolute inset-y-0 right-0 flex items-center z-20"
            >
                <button
                    onClick={() => sliderRef.current?.slickNext()}
                    className="mr-4 lg:mr-8 p-4 bg-white/90 backdrop-blur-sm text-gray-900 hover:bg-white hover:scale-110 transition-all duration-200 rounded-full shadow-xl"
                    aria-label="Next slide"
                >
                    <HiChevronRight className="w-6 h-6" />
                </button>
            </motion.div>

            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 flex items-center gap-2">
                {banners?.map((_, i) => (
                    <motion.button
                        key={i}
                        onClick={() => sliderRef.current?.slickGoTo(i)}
                        className={`relative h-2 rounded-full transition-all duration-300 ${i === dotActive ? "w-8 bg-black" : "w-2 bg-gray-400/50 hover:bg-gray-400"
                            }`}
                    >
                        {i === dotActive && (
                            <motion.div
                                layoutId="activeDot"
                                className="absolute inset-0 bg-black rounded-full"
                                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                            />
                        )}
                    </motion.button>
                ))}
            </div>
        </div>
    );
};

export default Banner;
