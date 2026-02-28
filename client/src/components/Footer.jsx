import { useState } from "react";
import { useSelector } from "react-redux";
import { motion } from "framer-motion";
import Container from "./Container";
import { Button } from "./ui/button";
import { paymentCard } from "../assets/images";
import SocialLinks from "./SocialLinks";
import { Link } from "react-router-dom";
import { HiArrowRight } from "react-icons/hi2";

const footerLinks = {
    quickLinks: [
        { name: "About Us", href: "/about" },
        { name: "Shop", href: "/shop" },
        { name: "Contact", href: "/contact" },
        { name: "Blog", href: "/blog" },
        { name: "FAQ", href: "/faq" },
    ],
    categories: [
        { name: "Smartphones", href: "/shop?category=smartphones" },
        { name: "Electronics", href: "/shop?category=electronics" },
        { name: "Home & Living", href: "/shop?category=home" },
        { name: "Accessories", href: "/shop?category=accessories" },
    ],
    legal: [
        { name: "Privacy Policy", href: "#" },
        { name: "Terms of Service", href: "#" },
        { name: "Refund Policy", href: "#" },
        { name: "Shipping Policy", href: "#" },
    ],
};

const Footer = () => {
    const categoriesList = useSelector((state) => state.orebiReducer.categoriesList);
    const [emailInfo, setEmailInfo] = useState("");
    const [subscription, setSubscription] = useState(false);
    const [errMsg, setErrMsg] = useState("");

    const emailValidation = () => {
        return String(emailInfo)
            .toLocaleLowerCase()
            .match(/^\w+([-]?\w+)*@\w+([-]?\w+)*(\.\w{2,3})+$/);
    };

    const handleSubscription = () => {
        if (emailInfo === "") {
            setErrMsg("Please provide an Email !");
        } else if (!emailValidation(emailInfo)) {
            setErrMsg("Please give a valid Email!");
        } else {
            setSubscription(true);
            setErrMsg("");
            setTimeout(() => setEmailInfo(""), 3000);
        }
    };

    return (
        <footer className="bg-gray-900 text-white">
            <Container className="py-16">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12"
                >
                    <div className="lg:col-span-1">
                        <motion.div
                            whileHover={{ scale: 1.02 }}
                            className="inline-block mb-6"
                        >
                            <Link to="/" className="text-2xl font-bold">
                                ECommerce
                            </Link>
                        </motion.div>
                        <p className="text-gray-400 mb-6 leading-relaxed">
                            Your trusted destination for premium products. We deliver quality, style, and exceptional service to millions of customers worldwide.
                        </p>
                        <SocialLinks
                            className="text-gray-400"
                            iconStyle="w-5 h-5 hover:text-white transition-colors duration-200"
                        />
                    </div>

                    <div>
                        <h4 className="text-lg font-semibold mb-6">Quick Links</h4>
                        <ul className="space-y-3">
                            {footerLinks.quickLinks.map((link, index) => (
                                <motion.li
                                    key={index}
                                    whileHover={{ x: 5 }}
                                >
                                    <a
                                        href={link.href}
                                        className="text-gray-400 hover:text-white transition-colors duration-200 text-sm flex items-center gap-2"
                                    >
                                        <HiArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100" />
                                        {link.name}
                                    </a>
                                </motion.li>
                            ))}
                        </ul>
                    </div>

                    <div>
                        <h4 className="text-lg font-semibold mb-6">Categories</h4>
                        <ul className="space-y-3">
                            {categoriesList && categoriesList.length > 0 ? (
                                categoriesList.slice(0, 5).map((cat) => (
                                    <motion.li
                                        key={cat._id}
                                        whileHover={{ x: 5 }}
                                    >
                                        <a
                                            href={`/shop?category=${cat.slug}`}
                                            className="text-gray-400 hover:text-white transition-colors duration-200 text-sm capitalize flex items-center gap-2"
                                        >
                                            <HiArrowRight className="w-3 h-3 opacity-0" />
                                            {cat.name}
                                        </a>
                                    </motion.li>
                                ))
                            ) : (
                                footerLinks.categories.map((link, index) => (
                                    <motion.li
                                        key={index}
                                        whileHover={{ x: 5 }}
                                    >
                                        <a
                                            href={link.href}
                                            className="text-gray-400 hover:text-white transition-colors duration-200 text-sm flex items-center gap-2"
                                        >
                                            <HiArrowRight className="w-3 h-3 opacity-0" />
                                            {link.name}
                                        </a>
                                    </motion.li>
                                ))
                            )}
                        </ul>
                    </div>

                    <div>
                        <h4 className="text-lg font-semibold mb-6">Stay Updated</h4>
                        <p className="text-gray-400 mb-4 text-sm leading-relaxed">
                            Subscribe to get exclusive deals and updates.
                        </p>

                        {subscription ? (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="p-4 bg-green-500/10 border border-green-500/20 rounded-xl"
                            >
                                <p className="text-green-400 text-sm font-medium">
                                    ✓ Successfully subscribed!
                                </p>
                            </motion.div>
                        ) : (
                            <div className="space-y-3">
                                <div>
                                    <input
                                        onChange={(e) => setEmailInfo(e.target.value)}
                                        value={emailInfo}
                                        className="w-full px-5 py-3.5 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-white/20 focus:border-white/30 transition-all duration-200 text-sm text-white placeholder-gray-500"
                                        type="email"
                                        placeholder="Enter your email"
                                    />
                                    {errMsg && (
                                        <p className="text-red-400 text-xs mt-2">
                                            {errMsg}
                                        </p>
                                    )}
                                </div>
                                <Button
                                    onClick={handleSubscription}
                                    className="w-full bg-white text-gray-900 hover:bg-gray-100 py-3.5 rounded-xl font-semibold transition-colors duration-200"
                                >
                                    Subscribe Now
                                </Button>
                            </div>
                        )}
                    </div>
                </motion.div>

                <div className="border-t border-white/10 pt-8">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                        <p className="text-gray-400 text-sm">
                            © 2026 ECommerce. All rights reserved.
                        </p>

                        <div className="flex items-center gap-4">
                            <span className="text-gray-500 text-sm">We accept:</span>
                            <img
                                src={paymentCard}
                                alt="Payment methods"
                                className="h-8 object-contain opacity-70 grayscale hover:grayscale-0 transition-all duration-300"
                            />
                        </div>

                        <div className="flex gap-6">
                            {footerLinks.legal.map((link, index) => (
                                <a
                                    key={index}
                                    href={link.href}
                                    className="text-gray-500 hover:text-white text-sm transition-colors duration-200"
                                >
                                    {link.name}
                                </a>
                            ))}
                        </div>
                    </div>
                </div>
            </Container>
        </footer>
    );
};

export default Footer;
