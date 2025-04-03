'use client';

import { useState, FormEvent, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';

// Company Carousel component
const CompanyCarousel = () => {
  const companies = [
    { name: "PubMed", logo: "/pubmed.png" },
    { name: "NIH", logo: "/nih.png" },
    { name: "ORCID", logo: "/orcid.png" },
    { name: "CMS", logo: "/cms.png" },
    { name: "BLS", logo: "/bls.png" },
    { name: "Grants", logo: "/grants.png" },
  ];

  // Duplicate the array for a seamless loop
  const allCompanies = [...companies, ...companies, ...companies, ...companies];

  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const scrollElement = scrollRef.current;
    if (!scrollElement) return;

    let animationId: number;
    let position = 0;

    const scroll = () => {
      position += 0.5; // Adjust speed as needed
      if (position >= scrollElement.scrollWidth / 2) {
        position = 0; // Reset position to create an infinite loop
      }
      scrollElement.scrollLeft = position;
      animationId = requestAnimationFrame(scroll);
    };

    animationId = requestAnimationFrame(scroll);
    return () => {
      cancelAnimationFrame(animationId);
    };
  }, []);

  return (
    <div className="relative w-full overflow-hidden">
      <div
        className="flex gap-10 md:gap-16 overflow-x-hidden py-4" // Smaller gap on mobile
        ref={scrollRef}
      >
        {allCompanies.map((company, index) => (
          <div
            className="flex flex-shrink-0 items-center justify-center transition-transform duration-300 hover:scale-110"
            key={index}
          >
            {company.logo ? (
              <img alt={`${company.name} logo`} className="h-8 sm:h-10 md:h-12 object-contain" src={company.logo} />
            ) : (
              <div className="text-sm sm:text-base md:text-lg font-semibold text-gray-700">{company.name}</div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default function LandingPage() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [mounted, setMounted] = useState(false);
  const [scrollY, setScrollY] = useState(0);

  // Animation setup
  useEffect(() => {
    setMounted(true);
    
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  const parallaxOffset = scrollY * 0.3;
  const fadeInOpacity = Math.min(1, mounted ? 1 : 0);
  const slideUpTransform = `translateY(${mounted ? 0 : '20px'})`;

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address');
      setLoading(false);
      return;
    }

    try {
      // Store email in your database
      const response = await fetch('/api/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        setSubmitted(true);
        setEmail('');
      } else {
        console.error('API Error:', data);
        setError(data.error || 'Failed to subscribe. Please try again.');
      }
    } catch (err) {
      console.error('Submission Error:', err);
      setError('Network error. Please check your connection and try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white overflow-hidden">
      {/* Animated background elements */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div 
          className="absolute top-0 right-0 w-[800px] h-[800px] bg-blue-200/20 rounded-full blur-3xl" 
          style={{ transform: `translate(${400 - parallaxOffset}px, ${-400 + parallaxOffset/2}px)` }}
        />
        <div 
          className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-indigo-200/20 rounded-full blur-3xl" 
          style={{ transform: `translate(${-300 + parallaxOffset/1.5}px, ${200 - parallaxOffset/3}px)` }}
        />
      </div>

      <div 
        className="container mx-auto px-4 py-4 sm:py-8 md:py-16"
        style={{ 
          opacity: fadeInOpacity,
          transition: 'opacity 0.8s ease-out, transform 0.8s ease-out',
          transform: slideUpTransform
        }}
      >
        {/* Header */}
        <header className="flex justify-between items-center mb-8 sm:mb-16">
          <div className="flex items-center">
            <div className="h-10 w-10 sm:h-12 sm:w-12 relative mr-2">
              <Image
                src="/logo-small.png" 
                alt="Connect Logo"
                fill
                style={{ objectFit: 'contain' }}
                priority
              />
            </div>
            <span className="text-xl sm:text-2xl md:text-3xl font-bold text-blue-900">Connect+</span>
          </div>
        </header>

        {/* Main content */}
        <main className="grid md:grid-cols-2 gap-8 md:gap-12 items-center mt-6 md:mt-16">
          <div className="space-y-6 md:space-y-8">
            <div className="space-y-3 md:space-y-4">
              <h1 
                className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 md:mb-6 bg-gradient-to-r from-blue-800 via-blue-600 to-indigo-800 bg-clip-text text-transparent leading-tight"
                style={{ 
                  transition: 'transform 0.5s ease',
                  transform: mounted ? 'translateY(0)' : 'translateY(20px)'
                }}
              >
                Connect with Brilliant Minds
              </h1>
              <p 
                className="text-base sm:text-lg text-gray-600 mb-6 md:mb-8 leading-relaxed"
                style={{ 
                  transition: 'transform 0.5s ease 0.1s, opacity 0.5s ease 0.1s',
                  transform: mounted ? 'translateY(0)' : 'translateY(20px)',
                  opacity: mounted ? 1 : 0
                }}
              >
                Connect+ links brilliant minds in healthcare, helping professionals collaborate, share knowledge, and advance their careers. Join our network of 5M+ healthcare professionals today.
              </p>
            </div>

            {submitted ? (
              <div 
                className="bg-white/80 border border-blue-100 text-gray-700 px-6 sm:px-8 py-4 sm:py-6 rounded-xl shadow-md"
                style={{ 
                  transition: 'all 0.5s ease',
                  transform: 'scale(1)',
                  animation: 'pulse 2s infinite'
                }}
              >
                <div className="flex items-center">
                  <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-full bg-blue-100 flex items-center justify-center mr-4">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M5 13L9 17L19 7" stroke="#1E40AF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  <div>
                    <p className="font-bold text-base sm:text-lg text-gray-900">Thank you for your interest!</p>
                    <p className="text-sm sm:text-base text-gray-600">We'll keep you updated about Connect+.</p>
                  </div>
                </div>
              </div>
            ) : (
              <form 
                onSubmit={handleSubmit} 
                className="space-y-3 md:space-y-4 p-5 sm:p-8 bg-white/80 backdrop-blur-md rounded-xl shadow-lg border border-blue-100/50"
                style={{ 
                  transition: 'transform 0.5s ease 0.2s, opacity 0.5s ease 0.2s',
                  transform: mounted ? 'translateY(0)' : 'translateY(20px)',
                  opacity: mounted ? 1 : 0
                }}
              >
                <div>
                  <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                    Get early access to Connect+
                  </label>
                  <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                    <input
                      id="email"
                      type="email"
                      placeholder="Enter your email address"
                      className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm transition-all duration-200"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                    <button
                      type="submit"
                      disabled={loading}
                      className="px-6 py-3 bg-blue-900 text-white rounded-lg font-medium hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all duration-300 disabled:opacity-70 shadow-lg relative overflow-hidden group"
                    >
                      <span className="absolute inset-0 w-full h-full bg-blue-800 opacity-0 group-hover:opacity-20 transition-opacity duration-300"></span>
                      {loading ? (
                        <div className="flex items-center justify-center">
                          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Submitting...
                        </div>
                      ) : "Start for free"}
                    </button>
                  </div>
                  {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
                </div>
                <p className="text-xs text-gray-500">By submitting, you agree to our <a href="#" className="text-blue-600 hover:text-blue-800">Privacy Policy</a> and <a href="#" className="text-blue-600 hover:text-blue-800">Terms of Service</a>.</p>
              </form>
            )}

            <div className="mt-8 md:mt-12">
              <div className="flex items-center gap-2 mb-4">
                <div className="flex">
                  {Array(5).fill(0).map((_, i) => (
                    <span key={i} className="text-amber-400 text-base sm:text-lg">★</span>
                  ))}
                </div>
                <span className="text-xs sm:text-sm font-medium text-gray-700">4.9 rating from professionals</span>
              </div>
              <div className="grid grid-cols-3 gap-2 sm:gap-4 mt-4 sm:mt-8">
                <div className="flex flex-col items-center p-2 md:p-3 bg-white/60 backdrop-blur-sm rounded-lg border border-gray-200/50 shadow-sm">
                  <div className="text-lg sm:text-2xl font-bold text-blue-700">5M+</div>
                  <div className="text-[10px] sm:text-xs text-gray-600 text-center">Healthcare Professionals</div>
                </div>
                <div className="flex flex-col items-center p-2 md:p-3 bg-white/60 backdrop-blur-sm rounded-lg border border-gray-200/50 shadow-sm">
                  <div className="text-lg sm:text-2xl font-bold text-blue-700">150+</div>
                  <div className="text-[10px] sm:text-xs text-gray-600 text-center">Countries Worldwide</div>
                </div>
                <div className="flex flex-col items-center p-2 md:p-3 bg-white/60 backdrop-blur-sm rounded-lg border border-gray-200/50 shadow-sm">
                  <div className="text-lg sm:text-2xl font-bold text-blue-700">10K+</div>
                  <div className="text-[10px] sm:text-xs text-gray-600 text-center">Healthcare Organizations</div>
                </div>
              </div>
            </div>
          </div>

          {/* Visual element - Hidden on small screens but shown on medium screens and up */}
          <div 
            className="hidden md:block relative"
            style={{ 
              transition: 'transform 0.8s ease 0.3s, opacity 0.8s ease 0.3s',
              transform: mounted ? 'translateX(0)' : 'translateX(50px)',
              opacity: mounted ? 1 : 0
            }}
          >
            {/* Semicircular container similar to the main app */}
            <div className="relative h-[500px] rounded-l-full bg-gradient-to-r from-blue-100/40 to-transparent">
              {/* Floating profile cards */}
              <div className="absolute inset-0">
                {/* Profile card 1 */}
                <div className="animate-float-slow absolute left-[10%] top-[20%] -rotate-6 transform w-64 flex items-center gap-3 rounded-xl border border-blue-100 bg-white/90 p-4 shadow-lg backdrop-blur-sm">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-600 font-medium text-white">
                    SC
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900">Sarah Chen</h3>
                    <p className="text-sm text-gray-600">Cardiologist</p>
                    <div className="mt-1 flex items-center gap-1">
                      <svg className="h-3 w-3 text-blue-500" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M20 10c0 4.418-8 12-8 12s-8-7.582-8-12a8 8 0 1116 0z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M12 10a2 2 0 100-4 2 2 0 000 4z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                      <span className="text-xs text-gray-500">San Francisco, CA</span>
                    </div>
                  </div>
                </div>
                
                {/* Profile card 2 */}
                <div className="animate-float-slower absolute right-[15%] top-[30%] rotate-3 transform w-64 flex items-center gap-3 rounded-xl border border-blue-100 bg-white/90 p-4 shadow-lg backdrop-blur-sm">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-600 font-medium text-white">
                    MP
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900">Michael Park</h3>
                    <p className="text-sm text-gray-600">Pediatrician</p>
                    <div className="mt-1 flex items-center gap-1">
                      <svg className="h-3 w-3 text-blue-500" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M20 10c0 4.418-8 12-8 12s-8-7.582-8-12a8 8 0 1116 0z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M12 10a2 2 0 100-4 2 2 0 000 4z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                      <span className="text-xs text-gray-500">New York, NY</span>
                    </div>
                  </div>
                </div>
                
                {/* Profile card 3 */}
                <div className="animate-float absolute bottom-[30%] left-[15%] rotate-6 transform w-64 flex items-center gap-3 rounded-xl border border-blue-100 bg-white/90 p-4 shadow-lg backdrop-blur-sm">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-600 font-medium text-white">
                    EW
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900">Emma Wilson</h3>
                    <p className="text-sm text-gray-600">Professor of Neurology</p>
                    <div className="mt-1 flex items-center gap-1">
                      <svg className="h-3 w-3 text-blue-500" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M20 10c0 4.418-8 12-8 12s-8-7.582-8-12a8 8 0 1116 0z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M12 10a2 2 0 100-4 2 2 0 000 4z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                      <span className="text-xs text-gray-500">London, UK</span>
                    </div>
                  </div>
                </div>
                
                {/* Optional decorative dots */}
                <div className="absolute right-1/4 top-1/4 h-3 w-3 animate-pulse rounded-full bg-blue-400 opacity-60"></div>
                <div className="absolute bottom-1/3 left-1/3 h-2 w-2 animate-pulse rounded-full bg-indigo-400 opacity-60"></div>
                <div className="absolute right-1/3 top-1/2 h-4 w-4 animate-pulse rounded-full bg-violet-400 opacity-60"></div>
              </div>
            </div>
          </div>
        </main>

        {/* Partners section */}
        <section className="mt-16 sm:mt-20 md:mt-24 mb-10 sm:mb-16">
          <div className="text-center mb-6 sm:mb-8">
            <div className="mb-2 inline-block rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-800">
              TRUSTED DATA
            </div>
            <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">Partnering with trusted data sources</h2>
            <p className="text-sm sm:text-base text-gray-600 max-w-2xl mx-auto">Joining thousands of institutions that rely on Connect+ for their professional networking needs</p>
          </div>
          <div className="glass-card overflow-hidden rounded-xl p-4 sm:p-6 bg-white/80 backdrop-blur-md border border-blue-100/50 shadow-lg">
            <CompanyCarousel />
          </div>
        </section>

        {/* Footer */}
        <footer className="mt-16 sm:mt-24 text-center text-gray-500 text-xs sm:text-sm border-t border-gray-200 pt-6 sm:pt-8">
          <div className="flex flex-wrap justify-center gap-4 sm:space-x-6 mb-4">
            {['Privacy', 'Terms', 'Contact', 'About'].map((link, i) => (
              <a key={i} href="#" className="hover:text-gray-700 transition-colors">{link}</a>
            ))}
          </div>
          <p>© {new Date().getFullYear()} Connect+. All rights reserved.</p>
        </footer>
      </div>
      
      {/* Global CSS for animations */}
      <style jsx global>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.8; transform: scale(1.05); }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0) rotate(6deg); }
          50% { transform: translateY(-10px) rotate(6deg); }
        }
        @keyframes float-slow {
          0%, 100% { transform: translateY(0) rotate(-6deg); }
          50% { transform: translateY(-15px) rotate(-6deg); }
        }
        @keyframes float-slower {
          0%, 100% { transform: translateY(0) rotate(3deg); }
          50% { transform: translateY(-8px) rotate(3deg); }
        }
        @keyframes float-slowest {
          0%, 100% { transform: translateY(0) rotate(-3deg); }
          50% { transform: translateY(-12px) rotate(-3deg); }
        }
        
        .glass-card {
          background: rgba(255, 255, 255, 0.85);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          border: 1px solid rgba(255, 255, 255, 0.2);
          box-shadow: 0 8px 32px rgba(31, 38, 135, 0.1);
        }
      `}</style>
    </div>
  );
}
