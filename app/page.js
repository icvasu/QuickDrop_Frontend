'use client';


import { useState } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { Copy, Clock } from 'lucide-react';

export default function HomePage() {
  const router = useRouter();
  const pathname = usePathname();
  const [domainName, setDomainName] = useState('');
  const [selectedTime, setSelectedTime] = useState('24 hrs');
  const [showTimeDropdown, setShowTimeDropdown] = useState(false);
  const [notification, setNotification] = useState(null);

  const showNotification = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const timeOptions = [
    '1 hour',
    '3 hours',
    '5 hours',
    '10 hours',
    '24 hours (Default)',
    '2 days',
    '4 days',
    '7 days'
  ];

  const handleSubmit = async () => {
    if (!domainName.trim()) {
      alert('Please enter a domain name');
      return;
    }
    
    // Convert domain name to slug format
    const slug = domainName
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
    
    try {
      // Convert selected time to hours
      const timeMap = {
        '1 hour': 1,
        '3 hours': 3,
        '5 hours': 5,
        '10 hours': 10,
        '24 hours (Default)': 24,
        '2 days': 48,
        '4 days': 96,
        '7 days': 168
      };
      
      const expirationHours = timeMap[selectedTime] || 24;

      // Create slug on backend first
      const response = await fetch('https://quickdrop-backend-g9hydba9gzdwgtgx.centralindia-01.azurewebsites.net/api/slugs/create  ', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          slug: slug,
          expirationHours: expirationHours
        })
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.error || 'Failed to create domain');
        return;
      }

      // Navigate to the slug page
      router.push(`/${slug}`);
      
    } catch (error) {
      console.error('Submit error:', error);
      alert('Failed to create domain. Please try again.');
    }
  };

  const handleCopy = () => {
    if (!domainName.trim()) {
      alert('Please enter a domain name first');
      return;
    }
    
    const slug = domainName
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
    
    const fullUrl = `https://www.quickdrop.cloud/${slug}`;
    navigator.clipboard.writeText(fullUrl);
    showNotification('url copied to clipboard!');
  };

 
  return (
    <div className="min-h-screen bg-[#0a0e17] flex flex-col overflow-hidden">
      {/* Toast Notification */}
{notification && (
  <div className={`fixed top-5 right-5 bg-green-500 text-white px-6 py-4 rounded-lg flex items-center gap-3 shadow-lg transition-all duration-300 min-w-[300px] z-[9999] ${
    notification ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-[400px]'
  }`}>
    <span className="w-7 h-7 bg-white text-green-500 rounded-full flex items-center justify-center font-bold text-lg flex-shrink-0">
      ✓
    </span>
    <span className="text-base font-medium">{notification.message}</span>
  </div>
)}
      {/* Floating Orbs Background */}
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <span className="orb orb-blue" />
        <span className="orb orb-cyan" />
        <span className="orb orb-purple" />
      </div>

      {/* Header */}
      <header className="flex items-center justify-between px-8 py-5 relative z-50 animate-slideDown">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-[#0a2e3e] to-[#0d3f52] rounded-2xl flex items-center justify-center hover:scale-110 transition-transform duration-300 border border-cyan-500/30">
  <svg className="w-6 h-6 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
  </svg>
</div>
          <h1 className="text-2xl font-bold">
            <span className="text-white">Quick</span>
            <span className="text-cyan-400">drop</span>
          </h1>
        </div>
        <nav className="flex gap-6">
  <Link 
    href="/" 
    className={`px-4 py-2 text-sm font-medium rounded-lg transition-all duration-300 ${
      pathname === '/' 
        ? 'bg-gray-700 text-white' 
        : 'text-gray-300 hover:text-white hover:bg-gray-800/50'
    }`}
  >
    Home
  </Link>
  
  <Link 
    href="/about" 
    className={`px-4 py-2 text-sm font-medium rounded-lg transition-all duration-300 ${
      pathname === '/about' 
        ? 'bg-gray-700 text-white' 
        : 'text-gray-300 hover:text-white hover:bg-gray-800/50'
    }`}
  >
    About Us
  </Link>
</nav>
      </header>
{/* Click outside to close dropdown - MOVED HERE */}

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-center px-8 pb-20 pt-12">
        {/* Icon with Animation */}
        <div className="mb-12 relative animate-fadeInScale">
          <div className="w-32 h-32 bg-gradient-to-br from-cyan-500/20 to-blue-600/20 rounded-3xl flex items-center justify-center backdrop-blur-sm border border-cyan-500/30 shadow-[0_0_50px_rgba(6,182,212,0.2)] hover:shadow-[0_0_70px_rgba(6,182,212,0.35)] transition-all duration-500 hover:scale-110 animate-pulse-slow">
            <svg className="w-16 h-16 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
            </svg>
          </div>
          {/* Glow rings */}
          <div className="absolute inset-0 rounded-3xl bg-cyan-500/10 blur-xl animate-ping-slow"></div>
        </div>

        {/* Badge with Animation */}
        <div className="mb-10 px-6 py-3 bg-cyan-500/5 rounded-full border border-cyan-500/20 backdrop-blur-sm animate-fadeInUp hover:bg-cyan-500/10 transition-all duration-300" style={{ animationDelay: '0.2s' }}>
  <div className="flex items-center gap-3 text-base">
            <span className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse"></span>
            <span className="text-gray-300">No account needed</span>
            <span className="text-gray-500">•</span>
            <span className="text-gray-300">Instant sharing</span>
            <span className="text-gray-500">•</span>
            <span className="text-gray-300">Secure & temporary</span>
          </div>
        </div>

        {/* Hero Title with Animation */}
        <h1 className="text-6xl md:text-7xl font-bold text-center mb-6 leading-tight animate-fadeInUp" style={{ animationDelay: '0.3s' }}>
          <span className="text-white">Share Anything,</span>
          <br />
          <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-cyan-300 bg-clip-text text-transparent animate-gradient">
            Instantly & Anonymously
          </span>
        </h1>

        {/* Subtitle with Animation */}
        <p className="text-lg text-gray-400 text-center mb-14 max-w-2xl animate-fadeInUp" style={{ animationDelay: '0.4s' }}>
          Upload <span className="text-cyan-400 font-semibold">files</span>, share{' '}
          <span className="text-cyan-400 font-semibold">code snippets</span>, or send{' '}
          <span className="text-cyan-400 font-semibold">text</span> — all without creating an account
        </p>

        {/* Feature Pills with Staggered Animation */}
        <div className="flex items-center gap-6 mb-14">
          <div className="flex items-center gap-2 text-sm text-gray-300 animate-fadeInUp hover:scale-105 transition-transform duration-300" style={{ animationDelay: '0.5s' }}>
            <div className="w-8 h-8 bg-cyan-500/10 rounded-lg flex items-center justify-center border border-cyan-500/20 hover:bg-cyan-500/20 transition-colors duration-300">
              <svg className="w-4 h-4 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
            </div>
            <span>No Registration</span>
          </div>

          <div className="flex items-center gap-2 text-sm text-gray-300 animate-fadeInUp hover:scale-105 transition-transform duration-300" style={{ animationDelay: '0.6s' }}>
            <div className="w-8 h-8 bg-cyan-500/10 rounded-lg flex items-center justify-center border border-cyan-500/20 hover:bg-cyan-500/20 transition-colors duration-300">
              <svg className="w-4 h-4 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <span>Secure Sharing</span>
          </div>

          <div className="flex items-center gap-2 text-sm text-gray-300 animate-fadeInUp hover:scale-105 transition-transform duration-300" style={{ animationDelay: '0.7s' }}>
            <div className="w-8 h-8 bg-cyan-500/10 rounded-lg flex items-center justify-center border border-cyan-500/20 hover:bg-cyan-500/20 transition-colors duration-300">
              <svg className="w-4 h-4 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <span>Custom URLs</span>
          </div>
        </div>

        {/* Input Section with Animation */}
        <div className="w-full max-w-2xl space-y-4 animate-fadeInUp" style={{ animationDelay: '0.8s' }}>
          {/* Domain Input Label */}
          <div className="text-left">
            <label className="text-sm font-medium text-gray-400 mb-2 block">
              Your Custom Domain
            </label>
          </div>

          {/* Domain Input */}
          <div className="flex items-center rounded-xl bg-[#0e1520] border border-cyan-500/30 overflow-hidden shadow-[0_0_30px_rgba(6,182,212,0.1)] hover:border-cyan-500/50 hover:shadow-[0_0_40px_rgba(6,182,212,0.2)] transition-all duration-300">
            <div className="bg-cyan-500/10 px-5 py-4 border-r border-cyan-500/20">
              <span className="text-cyan-400 font-semibold text-sm">quickdrop.cloud/</span>
            </div>
            <input
              type="text"
              value={domainName}
              onChange={(e) => setDomainName(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSubmit()}
              placeholder="my-custom-link"
              className="flex-1 px-5 py-4 bg-transparent text-white placeholder-gray-500 focus:outline-none text-sm"
            />
            <button
              onClick={handleCopy}
              className="bg-cyan-500/10 hover:bg-cyan-500/20 px-5 py-4 border-l border-cyan-500/20 transition-all duration-300 group"
              title="Copy link"
            >
              <Copy className="w-4 h-4 text-cyan-400 group-hover:text-cyan-300 group-hover:scale-110 transition-transform duration-300" />
            </button>
          </div>

         {/* Expiration Time Dropdown - UPWARD */}
<div className="relative">
  <div className="flex items-center gap-2 mb-2">
    <Clock className="w-4 h-4 text-gray-400" />
    <label className="text-sm font-medium text-gray-400">
      Expiration Time
    </label>
  </div>
  
  <button
    type="button"
    onClick={(e) => {
      e.stopPropagation();
      setShowTimeDropdown(!showTimeDropdown);
    }}
    className="w-full px-5 py-4 bg-[#0e1520] border border-gray-700 hover:border-cyan-500/30 hover:shadow-[0_0_20px_rgba(6,182,212,0.1)] rounded-xl text-left text-white text-sm transition-all duration-300 flex items-center justify-between"
  >
    <span>{selectedTime}</span>
    <svg 
      className={`w-4 h-4 text-gray-400 transition-transform duration-300 ${showTimeDropdown ? 'rotate-180' : ''}`} 
      fill="none" 
      stroke="currentColor" 
      viewBox="0 0 24 24"
    >
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
    </svg>
  </button>

  {/* Dropdown Menu - Opens UPWARD */}
  {showTimeDropdown && (
    <>
      {/* Backdrop overlay */}
      <div
        className="fixed inset-0"
        style={{ zIndex: 49 }}
        onClick={(e) => {
          e.stopPropagation();
          setShowTimeDropdown(false);
        }}
      />
      
      {/* Dropdown content */}
      <div 
        className="absolute bottom-full left-0 w-48 mb-2 bg-[#0e1520] border border-cyan-500/30 rounded-xl shadow-[0_10px_60px_rgba(6,182,212,0.2)] overflow-hidden"
        style={{ zIndex: 50 }}
      >
        {timeOptions.map((time) => (
          <button
            key={time}
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setSelectedTime(time);
              setShowTimeDropdown(false);
            }}
            className={`w-full px-4 py-2 text-left text-sm transition-all duration-200 ${
              selectedTime === time
                ? 'bg-cyan-500/10 text-cyan-400 font-medium border-l-2 border-cyan-400'
                : 'text-gray-300 hover:bg-cyan-500/5 hover:text-white'
            }`}
          >
            {time}
          </button>
        ))}
      </div>
    </>
  )}
</div>

          {/* Create Link Button */}
          <button
            onClick={handleSubmit}
            className="w-full py-4 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 rounded-xl text-white font-semibold text-base transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] shadow-[0_10px_40px_rgba(6,182,212,0.3)] hover:shadow-[0_15px_50px_rgba(6,182,212,0.4)] flex items-center justify-center gap-2 group"
          >
            <span>Create Link</span>
            <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </button>
        </div>
      </main>

      

      {/* Custom Styles */}
      <style jsx>{`
        /* Background Orbs with Float Animation */
        .orb {
          position: absolute;
          border-radius: 9999px;
          filter: blur(80px);
          opacity: 0.15;
          animation: float 20s ease-in-out infinite;
        }
        
        .orb-blue {
          width: 500px;
          height: 500px;
          background: radial-gradient(circle, rgba(59, 130, 246, 0.5), transparent 70%);
          top: -10%;
          left: 10%;
          animation-delay: 0s;
        }
        
        .orb-cyan {
          width: 600px;
          height: 600px;
          background: radial-gradient(circle, rgba(6, 182, 212, 0.4), transparent 70%);
          bottom: -20%;
          right: -10%;
          animation-delay: 3s;
        }
        
        .orb-purple {
          width: 450px;
          height: 450px;
          background: radial-gradient(circle, rgba(99, 102, 241, 0.3), transparent 70%);
          top: 40%;
          right: 20%;
          animation-delay: 6s;
        }

        @keyframes float {
          0%, 100% {
            transform: translate(0, 0) scale(1);
          }
          33% {
            transform: translate(30px, -30px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
        }

        /* Fade In Up Animation */
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fadeInUp {
          animation: fadeInUp 0.8s ease-out forwards;
          opacity: 0;
        }

        /* Fade In Scale Animation */
        @keyframes fadeInScale {
          from {
            opacity: 0;
            transform: scale(0.8);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        .animate-fadeInScale {
          animation: fadeInScale 1s ease-out forwards;
        }

        /* Slide Down Animation */
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-slideDown {
          animation: slideDown 0.3s ease-out forwards;
        }

        /* Slide UP Animation (for upward dropdown) */
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-slideUp {
          animation: slideUp 0.3s ease-out forwards;
        }

        /* Gradient Animation */
        @keyframes gradient {
          0%, 100% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
        }

        .animate-gradient {
          background-size: 200% auto;
          animation: gradient 3s ease infinite;
        }

        /* Slow Pulse for Icon */
        @keyframes pulse-slow {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0.8;
          }
        }

        .animate-pulse-slow {
          animation: pulse-slow 3s ease-in-out infinite;
        }

        /* Slow Ping for Glow Ring */
        @keyframes ping-slow {
          0% {
            transform: scale(1);
            opacity: 0.3;
          }
          50% {
            transform: scale(1.1);
            opacity: 0.1;
          }
          100% {
            transform: scale(1);
            opacity: 0.3;
          }
        }

        .animate-ping-slow {
          animation: ping-slow 4s cubic-bezier(0, 0, 0.2, 1) infinite;
        }
          /* Toast with error variant */
.toast-error {
  background-color: #ef4444 !important;
}
      `}</style>
    </div>
  );
}