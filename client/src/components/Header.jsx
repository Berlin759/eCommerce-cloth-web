import { useState, useEffect } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { Dialog, DialogPanel } from "@headlessui/react";
import { motion, AnimatePresence } from "framer-motion";
import { HiOutlineMenu } from "react-icons/hi";
import { IoCloseOutline } from "react-icons/io5";
import { IoMdCart } from "react-icons/io";
import { useSelector } from "react-redux";
import { FaUserAlt, FaHeart } from "react-icons/fa";
import { getData } from "../helpers";
import { config } from "../../config";
import Container from "./Container";
import { logo } from "../assets/images";
import SearchInput from "./SearchInput";
import Title from "./ui/title";
import SocialLinks from "./SocialLinks";

export const headerNavigation = [
    {
        title: "About",
        link: "/about",
    },
    {
        title: "Contact",
        link: "/contact",
    },
    {
        title: "Orders",
        link: "/orders",
    },
];

const Header = () => {
    let [isOpen, setIsOpen] = useState(false);
    const [categories, setCategories] = useState([]);
    const [scrolled, setScrolled] = useState(false);
    const location = useLocation();
    const { products, userInfo, orderCount } = useSelector((state) => state.orebiReducer);
    const categoriesList = useSelector((state) => state.orebiReducer.categoriesList);
    const activeCategory = new URLSearchParams(location.search).get("category")?.toLowerCase();

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const toggleMenu = () => {
        setIsOpen(!isOpen);
    };

    // Fetch categories from products
    const fetchCategoryOptions = async () => {
        try {
            const data = await getData(`${config?.baseUrl}/api/products`);
            const products = data?.products || [];

            // Extract unique categories
            const uniqueCategories = [
                ...new Set(products.map((p) => p.category).filter(Boolean)),
            ];

            setCategories(uniqueCategories);
        } catch (error) {
            console.error("Error fetching filter options:", error);
        };
    };

    useEffect(() => {
        fetchCategoryOptions();
    }, []);

    return (
        <motion.header
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.5 }}
            className={`sticky top-0 z-50 transition-all duration-300 ${
                scrolled
                    ? "bg-white/95 backdrop-blur-lg shadow-lg"
                    : "bg-white"
            }`}
        >
            <div className={`border-b transition-all duration-300 ${scrolled ? "border-transparent" : "border-gray-200"}`}>
                <Container className="py-2 lg:py-2 flex items-center gap-x-3 md:gap-x-5 justify-between">
                    <Link to={"/"} className="flex-shrink-0">
                        <motion.img
                            whileHover={{ scale: 1.05 }}
                            src={logo} alt="logo" className="h-5 w-auto" />
                    </Link>

                    <div className="hidden md:block flex-1 max-w-xl mx-4">
                        <SearchInput />
                    </div>

                    <div className="hidden lg:flex items-center gap-1">
                        <Link
                            to="/wishlist"
                            className="p-2 text-gray-700 hover:text-black relative transition-colors duration-300 rounded-full hover:bg-gray-50"
                        >
                            <FaHeart className="text-base" />
                        </Link>
                        
                        <Link
                            to={"/cart"}
                            className="p-2 text-gray-700 hover:text-black relative transition-colors duration-300 rounded-full hover:bg-gray-50"
                        >
                            <IoMdCart className="text-lg" />
                            {products?.length > 0 && (
                                <motion.span
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    className="absolute -right-1 -top-1 w-4 h-4 rounded-full text-[10px] bg-black text-white flex items-center justify-center font-medium"
                                >
                                    {products.length}
                                </motion.span>
                            )}
                        </Link>

                        {userInfo ? (
                            <Link
                                to={"/profile"}
                                className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-gray-50 hover:bg-gray-100 transition-all duration-300"
                            >
                                <div className="w-7 h-7 bg-gradient-to-br from-gray-700 to-gray-900 rounded-full flex items-center justify-center">
                                    <FaUserAlt className="text-xs text-white" />
                                </div>
                                <span className="font-medium text-gray-900 text-sm">{userInfo?.name?.split(' ')[0]}</span>
                            </Link>
                        ) : (
                            <Link
                                to={"/signin"}
                                className="px-4 py-2 bg-black text-white font-medium rounded-full hover:bg-gray-800 transition-all duration-300 hover:shadow-lg text-sm"
                            >
                                Sign In
                            </Link>
                        )}
                    </div>

                    <div className="lg:hidden flex items-center gap-2">
                        <Link
                            to="/wishlist"
                            className="p-2 text-gray-700 hover:text-black relative"
                        >
                            <FaHeart className="text-lg" />
                        </Link>
                        
                        <Link
                            to={"/cart"}
                            className="p-2 text-gray-700 hover:text-black relative"
                        >
                            <IoMdCart className="text-xl" />
                            {products?.length > 0 && (
                                <span className="absolute -right-1 -top-1 w-4 h-4 rounded-full text-[10px] bg-black text-white flex items-center justify-center">
                                    {products.length}
                                </span>
                            )}
                        </Link>
                    </div>

                    <button
                        onClick={toggleMenu}
                        className="md:hidden text-xl text-gray-700 hover:text-black duration-300 p-1.5 hover:bg-gray-50 rounded-full transition-all"
                    >
                        <HiOutlineMenu />
                    </button>
                </Container>

                <div className="hidden md:block">
                    <Container>
                        <div className="flex items-center justify-center gap-6 py-1">
                            <NavLink
                                className={({ isActive }) =>
                                    `font-medium transition-colors relative ${
                                        isActive ? "text-2xl text-black" : "text-1xl text-gray-600 hover:text-black"
                                    }`
                                }
                                to="/"
                            >
                                Home
                                <span className={`absolute bottom-0 left-0 w-full h-0.5 bg-black transform origin-left transition-transform ${location.pathname === "/" ? "scale-x-100" : "scale-x-0"}`} />
                            </NavLink>
                            
                            <div className="relative group">
                                <button
                                    type="button"
                                    className="cursor-pointer text-1xl font-medium text-gray-600 hover:text-black flex items-center gap-1"
                                >
                                    Category
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                    </svg>
                                </button>

                                <div className="absolute left-0 top-full mt-2 w-56 bg-white border rounded-xl shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 py-2">
                                    <Link
                                        to="/shop"
                                        className={`block px-4 py-2.5 text-1xl transition-colors ${
                                            !activeCategory
                                                ? "bg-gray-50 text-black font-semibold"
                                                : "text-gray-700 hover:bg-gray-50"
                                        }
                                    `}
                                    >
                                        All Categories
                                    </Link>
                                    {categories?.length > 0 && categories.map((category) => (
                                        <Link
                                            key={category}
                                            to={`/shop?category=${category?.toLowerCase()}`}
                                            onClick={() => window.scrollTo(0, 0)}
                                            className={`block px-4 py-2.5 text-1xl transition-colors ${
                                                activeCategory === category?.toLowerCase()
                                                    ? "bg-gray-50 text-black font-semibold"
                                                    : "text-gray-700 hover:bg-gray-50 hover:text-black"
                                            }
                                        `}
                                        >
                                            {category}
                                        </Link>
                                    ))}
                                </div>
                            </div>
                            
                            {headerNavigation.map((item) => (
                                <NavLink
                                    key={item?.title}
                                    className={({ isActive }) =>
                                        `font-medium transition-colors relative ${
                                            isActive ? "text-2xl text-black" : "text-1xl text-gray-600 hover:text-black"
                                        }`
                                    }
                                    to={item?.link}
                                >
                                    {item?.title}
                                    {item?.title === "Orders" && userInfo && orderCount > 0 && (
                                        <span className="ml-1.5 inline-flex items-center justify-center w-5 h-5 rounded-full text-[10px] bg-red-500 text-white">
                                            {orderCount}
                                        </span>
                                    )}
                                    <span className={`absolute bottom-0 left-0 w-full h-0.5 bg-black transform origin-left transition-transform ${location.pathname === item?.link ? "scale-x-100" : "scale-x-0"}`} />
                                </NavLink>
                            ))}
                        </div>
                    </Container>
                </div>
            </div>

            <Dialog
                open={isOpen}
                onClose={() => setIsOpen(false)}
                className="relative z-50 md:hidden"
            >
                <AnimatePresence>
                    {isOpen && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 bg-black/50 backdrop-blur-sm"
                        />
                    )}
                </AnimatePresence>
                <div className="fixed inset-0 flex items-start justify-center pt-16 px-4">
                    <DialogPanel className="w-full max-w-md bg-white rounded-3xl shadow-2xl transform transition-all duration-300 ease-out">
                        <div className="p-6">
                            <div className="flex items-center justify-between mb-6">
                                <Title className="text-xl font-bold text-gray-900">
                                    Menu
                                </Title>
                                <button
                                    onClick={() => setIsOpen(false)}
                                    className="text-gray-400 hover:text-gray-600 transition-colors duration-200 p-2 hover:bg-gray-50 rounded-full"
                                >
                                    <IoCloseOutline className="text-2xl" />
                                </button>
                            </div>

                            <div className="mb-4">
                                <SearchInput />
                            </div>

                            <div className="px-4 py-3">
                                <p className="text-xs font-semibold text-gray-500 uppercase mb-2">
                                    Categories
                                </p>

                                <div className="space-y-1">
                                    {categories?.length > 0 && categories.map((category) => (
                                        <Link
                                            key={category}
                                            to={`/shop?category=${category?.toLowerCase()}`}
                                            onClick={() => {
                                                setIsOpen(false);
                                                window.scrollTo(0, 0);
                                            }}
                                            className={`block px-3 py-2.5 text-sm transition-colors rounded-lg ${
                                                activeCategory === category?.toLowerCase()
                                                    ? "bg-gray-100 text-black font-semibold"
                                                    : "text-gray-700 hover:bg-gray-50 hover:text-black"
                                            }
                                        `}
                                        >
                                            {category}
                                        </Link>
                                    ))}
                                </div>
                            </div>

                            <div className="border-t border-gray-100 my-4" />

                            <div className="space-y-1">
                                <NavLink
                                    to="/"
                                    onClick={() => setIsOpen(false)}
                                    className={({ isActive }) =>
                                        `block px-4 py-3 rounded-lg transition-all duration-200 ${
                                            isActive
                                                ? "bg-gray-100 text-black font-semibold"
                                                : "text-gray-700 hover:bg-gray-50 hover:text-black"
                                        }`
                                    }
                                >
                                    Home
                                </NavLink>
                                
                                {headerNavigation?.map((item) => (
                                    <NavLink
                                        key={item?.title}
                                        to={item?.link}
                                        onClick={() => setIsOpen(false)}
                                        className={({ isActive }) =>
                                            `block px-4 py-3 rounded-lg transition-all duration-200 ${
                                                isActive
                                                    ? "bg-gray-100 text-black font-semibold"
                                                    : "text-gray-700 hover:bg-gray-50 hover:text-black"
                                            }`
                                        }
                                    >
                                        <div className="flex items-center gap-3">
                                            {item?.title}
                                            {item?.title === "Orders" &&
                                                userInfo &&
                                                orderCount > 0 && (
                                                    <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
                                                        {orderCount}
                                                    </span>
                                                )}
                                        </div>
                                    </NavLink>
                                ))}

                                <Link
                                    to={"/cart"}
                                    onClick={() => setIsOpen(false)}
                                    className="block px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-50 hover:text-black transition-all duration-200"
                                >
                                    <div className="flex items-center gap-3">
                                        <span>Cart</span>
                                        {products?.length > 0 && (
                                            <span className="ml-auto bg-black text-white text-xs px-2 py-0.5 rounded-full">
                                                {products.length}
                                            </span>
                                        )}
                                    </div>
                                </Link>

                                <Link
                                    to="/wishlist"
                                    onClick={() => setIsOpen(false)}
                                    className="block px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-50 hover:text-black transition-all duration-200"
                                >
                                    Wishlist
                                </Link>

                                {userInfo ? (
                                    <Link
                                        to={"/profile"}
                                        onClick={() => setIsOpen(false)}
                                        className="block px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-50 hover:text-black transition-all duration-200"
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                                                <FaUserAlt className="text-xs text-gray-600" />
                                            </div>
                                            <span>{userInfo?.name}</span>
                                        </div>
                                    </Link>
                                ) : (
                                    <Link
                                        to={"/signin"}
                                        onClick={() => setIsOpen(false)}
                                        className="block px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-50 hover:text-black transition-all duration-200"
                                    >
                                        Sign In
                                    </Link>
                                )}
                            </div>

                            <div className="mt-6 pt-6 border-t border-gray-100">
                                <SocialLinks />
                            </div>
                        </div>
                    </DialogPanel>
                </div>
            </Dialog>
        </motion.header>
    );
};

export default Header;
