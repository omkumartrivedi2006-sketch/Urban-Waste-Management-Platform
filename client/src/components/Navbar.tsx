import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Recycle, Menu, X, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', href: '#home' },
    { name: 'Problems', href: '#problems' },
    { name: 'Features', href: '#features' },
    { name: 'How It Works', href: '#how-it-works' },
    { name: 'Who Is It For', href: '#who-is-for' },
  ];

  return (
    <>
      <motion.nav
        className={`fixed top-0 left-0 w-full z-50 transition-premium ${
          isScrolled
            ? 'py-4 glass shadow-soft'
            : 'py-6 bg-transparent border-b border-transparent'
        }`}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] }}
      >
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          {/* Logo */}
          <a href="#home" className="flex items-center space-x-2.5 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-primary to-accent-lime flex items-center justify-center text-white shadow-md transition-premium group-hover:rotate-12">
              <Recycle className="w-5.5 h-5.5" />
            </div>
            <span className="font-heading text-xl font-bold tracking-tight text-neutral-dark flex items-center">
              UWMP
              <span className="w-1.5 h-1.5 rounded-full bg-accent-lime ml-1"></span>
            </span>
          </a>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="text-sm font-medium text-neutral-muted hover:text-primary transition-colors relative py-1 group"
              >
                {link.name}
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-accent-lime transition-all duration-300 group-hover:w-full"></span>
              </a>
            ))}
          </div>

          {/* CTAs */}
          <div className="hidden md:flex items-center space-x-4">
            <Link 
              to="/login"
              className="text-sm font-semibold text-neutral-dark hover:text-primary transition-colors py-2.5 px-5"
            >
              Login
            </Link>
            <Link
              to="/register"
              className="text-sm font-semibold text-white bg-primary hover:bg-primary-light rounded-xl py-2.5 px-5 flex items-center space-x-1.5 transition-premium hover:shadow-premium hover:-translate-y-0.5 active:translate-y-0"
            >
              <span>Get Started</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 text-neutral-dark focus:outline-none"
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </motion.nav>

      {/* Mobile Drawer Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 bg-neutral-dark/40 z-40 md:hidden backdrop-blur-sm"
            />
            {/* Drawer */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'tween', duration: 0.35, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] }}
              className="fixed top-0 right-0 w-4/5 max-w-sm h-full bg-white z-50 shadow-2xl p-8 flex flex-col md:hidden"
            >
              <div className="flex items-center justify-between mb-8">
                <span className="font-heading text-lg font-bold text-neutral-dark">Navigation</span>
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-2 text-neutral-dark"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="flex flex-col space-y-6 flex-grow">
                {navLinks.map((link) => (
                  <a
                    key={link.name}
                    href={link.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="text-lg font-medium text-neutral-text hover:text-primary transition-colors border-b border-gray-100 pb-3"
                  >
                    {link.name}
                  </a>
                ))}
              </div>

              <div className="flex flex-col space-y-4 pt-6 border-t border-gray-100">
                <Link
                  to="/login"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="w-full text-center py-3 font-semibold text-neutral-dark hover:text-primary transition-colors border border-gray-200 rounded-xl block"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="w-full text-center py-3 font-semibold text-white bg-primary hover:bg-primary-light rounded-xl block transition-premium shadow-md text-center"
                >
                  Get Started
                </Link>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
