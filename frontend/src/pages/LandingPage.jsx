import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { TreeDeciduous, Users, Lock, Sparkles, ChevronRight, Leaf } from 'lucide-react';

const LandingPage = () => {
    return (
        <div className="landing-page">
            {/* Animated Background Elements */}
            <div className="background-shapes">
                <div className="shape shape-1"></div>
                <div className="shape shape-2"></div>
                <div className="shape shape-3"></div>
            </div>

            <nav className="navbar glass-nav" style={{padding: '8px 5%', minHeight: '44px'}}>
                <div className="logo">
                    <div className="logo-icon-bg"><TreeDeciduous size={24} color="white" /></div>
                    <span className="logo-text">FamilyTreeMaker</span>
                </div>
                <div className="nav-links">
                    <Link to="/login" className="nav-link">Log In</Link>
                    <Link to="/signup" className="nav-btn-primary">Get Started</Link>
                </div>
            </nav>

            <header className="hero section">
                <div className="hero-container">
                    <motion.div
                        initial={{ opacity: 0, y: 40 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        className="hero-text-content"
                    >
                        <motion.div
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.2 }}
                            className="hero-badge"
                        >
                            <Sparkles size={16} />
                            <span>Reimagine your history</span>
                        </motion.div>
                        <h1 className="hero-title">
                            Where your story <br />
                            <span className="gradient-text">comes to life.</span>
                        </h1>
                        <p className="hero-subtitle">
                            Securely map your lineage, discover hidden connections, and preserve your family
                            legacy in a beautiful, interactive digital garden to share for generations.
                        </p>
                        <div className="hero-actions">
                            <Link to="/signup" className="cta-btn-large">
                                Start Your Tree <ChevronRight size={20} />
                            </Link>
                            <Link to="/login" className="cta-link">
                                Continue where you left off
                            </Link>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, x: 40 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 1, delay: 0.2 }}
                        className="hero-visual"
                    >
                        {/* Abstract Tree Composition */}
                        <div className="tree-composition">
                            <motion.div
                                animate={{ y: [0, -10, 0] }}
                                transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
                                className="float-card card-1"
                            >
                                <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=Grandma`} alt="Ancestor" />
                                <div>
                                    <h5>Grandma Rose</h5>
                                    <span>1940 - 2022</span>
                                </div>
                            </motion.div>
                            <motion.div
                                animate={{ y: [0, 15, 0] }}
                                transition={{ repeat: Infinity, duration: 5, ease: "easeInOut", delay: 1 }}
                                className="float-card card-2"
                            >
                                <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=Dad`} alt="Ancestor" />
                                <div>
                                    <h5>Arthur</h5>
                                    <span>1965 - Present</span>
                                </div>
                            </motion.div>
                            <div className="visual-circle">
                                <TreeDeciduous size={120} strokeWidth={1} />
                            </div>
                        </div>
                    </motion.div>
                </div>
            </header>

            <section className="features section">
                <div className="features-header">
                    <h2>Everything you need to <br />capture the past.</h2>
                </div>
                <div className="features-grid">
                    <motion.div
                        whileHover={{ y: -5 }}
                        className="feature-card glass-card"
                    >
                        <div className="icon-box green">
                            <Users size={32} />
                        </div>
                        <h3>Unlimited Generations</h3>
                        <p>Go back as far as records allow. Our infinite canvas handles centuries of family depth without limits.</p>
                    </motion.div>
                    <motion.div
                        whileHover={{ y: -5 }}
                        className="feature-card glass-card"
                    >
                        <div className="icon-box blue">
                            <Leaf size={32} />
                        </div>
                        <h3>Modern Visualization</h3>
                        <p>Ditch the dusty charts. Experience your family tree with fluid animations and intuitive navigation.</p>
                    </motion.div>
                    <motion.div
                        whileHover={{ y: -5 }}
                        className="feature-card glass-card"
                    >
                        <div className="icon-box purple">
                            <Lock size={32} />
                        </div>
                        <h3>Private & Secure</h3>
                        <p>Your history is precious. We use bank-level security to ensure your personal data stays private.</p>
                    </motion.div>
                </div>
            </section>

            <footer className="footer-modern">
                <div className="footer-content">
                    <div className="footer-brand">
                        <TreeDeciduous size={24} />
                        <span>FamilyTreeMaker</span>
                    </div>
                    <div className="footer-links">
                        <a href="#">Privacy</a>
                        <a href="#">Terms</a>
                        <a href="#">Contact</a>
                    </div>
                    <p className="copyright">&copy; 2026 Family Tree Maker. Preserving moments.</p>
                </div>
            </footer>
        </div>
    );
};

export default LandingPage;
