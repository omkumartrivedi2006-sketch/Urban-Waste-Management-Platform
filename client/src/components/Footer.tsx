import React, { useState } from 'react';
import { Recycle, MessageSquare, Send, Check } from 'lucide-react';

export default function Footer() {
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsLoading(true);
    // Mock API call
    setTimeout(() => {
      setIsLoading(false);
      setIsSubscribed(true);
      setEmail('');
    }, 1500);
  };

  const footerLinks = {
    company: [
      { name: 'About Us', href: '#' },
      { name: 'Careers', href: '#' },
      { name: 'Newsroom', href: '#' },
      { name: 'Impact Report', href: '#' },
    ],
    solutions: [
      { name: 'Municipal Portal', href: '#' },
      { name: 'Citizen Apps', href: '#' },
      { name: 'Fleet Telematics', href: '#' },
      { name: 'AI Image Analyzer', href: '#' },
    ],
    support: [
      { name: 'Help Documentation', href: '#' },
      { name: 'API Reference', href: '#' },
      { name: 'System Status', href: '#' },
      { name: 'Contact Sales', href: '#' },
    ],
  };

  return (
    <footer id="contact" className="bg-neutral-dark text-gray-300 relative overflow-hidden pt-20 pb-8 border-t border-white/5">
      {/* Footer background gradient blob */}
      <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-accent-lime/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 pb-16 border-b border-white/5">
        {/* Brand Left Column */}
        <div className="lg:col-span-4 flex flex-col space-y-5">
          <div className="flex items-center space-x-2.5">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-primary to-accent-lime flex items-center justify-center text-white shadow-md">
              <Recycle className="w-5.5 h-5.5" />
            </div>
            <span className="font-heading text-xl font-bold tracking-tight text-white flex items-center">
              UWMP
              <span className="w-1.5 h-1.5 rounded-full bg-accent-lime ml-1"></span>
            </span>
          </div>
          
          <p className="text-xs leading-relaxed text-gray-400 max-w-sm">
            Digitizing municipal waste networks to power smarter collections, cut urban carbon footprints, and restore civic accountability to cities worldwide.
          </p>

          {/* Socials */}
          <div className="flex space-x-4 pt-2">
            <a href="#" className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center hover:bg-primary hover:text-white transition-colors duration-300" aria-label="Twitter">
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
            </a>
            <a href="#" className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center hover:bg-primary hover:text-white transition-colors duration-300" aria-label="GitHub">
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/></svg>
            </a>
            <a href="#" className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center hover:bg-primary hover:text-white transition-colors duration-300" aria-label="Chat">
              <MessageSquare className="w-4 h-4" />
            </a>
            <a href="#" className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center hover:bg-primary hover:text-white transition-colors duration-300" aria-label="LinkedIn">
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.779-1.75-1.75s.784-1.75 1.75-1.75 1.75.779 1.75 1.75-.784 1.75-1.75 1.75zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>
            </a>
          </div>
        </div>

        {/* Links Middle Columns */}
        <div className="lg:col-span-5 grid grid-cols-3 gap-6">
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-4">Platform</h4>
            <ul className="space-y-2.5 text-xs">
              {footerLinks.solutions.map((link) => (
                <li key={link.name}>
                  <a href={link.href} className="text-gray-400 hover:text-accent-lime transition-colors">
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-4">Company</h4>
            <ul className="space-y-2.5 text-xs">
              {footerLinks.company.map((link) => (
                <li key={link.name}>
                  <a href={link.href} className="text-gray-400 hover:text-accent-lime transition-colors">
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-4">Resources</h4>
            <ul className="space-y-2.5 text-xs">
              {footerLinks.support.map((link) => (
                <li key={link.name}>
                  <a href={link.href} className="text-gray-400 hover:text-accent-lime transition-colors">
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Newsletter Right Column */}
        <div className="lg:col-span-3 flex flex-col space-y-4">
          <h4 className="text-xs font-bold text-white uppercase tracking-wider">Stay Updated</h4>
          <p className="text-xs text-gray-400 leading-normal">
            Subscribe to our newsletter to receive the latest smart city insights and platform logs.
          </p>

          <form onSubmit={handleSubscribe} className="space-y-2">
            <div className="relative">
              <input
                type="email"
                placeholder="Email Address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isSubscribed || isLoading}
                className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-4 pr-12 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-accent-lime focus:ring-1 focus:ring-accent-lime transition-colors disabled:opacity-50"
              />
              <button
                type="submit"
                disabled={isSubscribed || isLoading || !email}
                className="absolute right-1 top-1 bottom-1 w-10 bg-primary hover:bg-primary-light text-white rounded-lg flex items-center justify-center transition-colors disabled:opacity-50"
              >
                {isLoading ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : isSubscribed ? (
                  <Check className="w-4 h-4 text-accent-lime" />
                ) : (
                  <Send className="w-4 h-4" />
                )}
              </button>
            </div>
            {isSubscribed && (
              <span className="text-[10px] text-accent-lime font-bold block mt-1">✓ Thank you for subscribing!</span>
            )}
          </form>
        </div>
      </div>

      {/* Footer Bottom copyright */}
      <div className="max-w-7xl mx-auto px-6 pt-8 flex flex-col sm:flex-row sm:items-center sm:justify-between text-xs text-gray-500">
        <span>© {new Date().getFullYear()} UWMP. All rights reserved.</span>
        <div className="flex space-x-6 mt-4 sm:mt-0">
          <a href="#" className="hover:text-gray-400 transition-colors">Privacy Policy</a>
          <a href="#" className="hover:text-gray-400 transition-colors">Terms of Service</a>
          <a href="#" className="hover:text-gray-400 transition-colors">SLA Agreement</a>
        </div>
      </div>
    </footer>
  );
}
