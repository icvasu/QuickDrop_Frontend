'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';
import { 
  Shield, 
  AlertCircle, 
  Users, 
  FileText, 
  Lock, 
  AlertTriangle,
  Link as LinkIcon,
  Edit,
  CheckCircle,
  DollarSign,
  HelpCircle,
  Gavel
} from 'lucide-react';

const Terms = () => {
  const sectionsRef = useRef([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.remove('opacity-0', 'translate-y-8');
            entry.target.classList.add('opacity-100', 'translate-y-0');
          }
        });
      },
      { threshold: 0.1 }
    );

    sectionsRef.current.forEach((section) => {
      if (section) observer.observe(section);
    });

    return () => observer.disconnect();
  }, []);

  const sections = [
    {
      icon: Gavel,
      title: 'Legal Agreement',
      content: 'Welcome to NoLogin, a platform designed for seamless and secure sharing of text and documents without requiring login credentials. Before using our services, please carefully read the terms and conditions outlined below.',
      gradient: 'from-purple-500 to-blue-500'
    },
    {
      icon: CheckCircle,
      title: 'Acceptance of Terms',
      content: 'By using NoLogin, you agree to comply with these terms and conditions, as well as our Privacy Policy. If you do not agree with any part of these terms, you should not use our platform.',
      gradient: 'from-blue-500 to-cyan-500'
    },
    {
      icon: Users,
      title: 'User Responsibility',
      content: `NoLogin provides a platform for sharing content, but we do not control or monitor what is shared through our service. Users are solely responsible for any text, files, documents, or other content they share or upload through NoLogin. This includes ensuring that the content complies with all applicable laws and regulations.

By using NoLogin, you agree not to use the platform for:
• Sharing illegal, harmful, or malicious content.
• Violating the privacy or intellectual property rights of others.
• Distributing offensive, defamatory, or inappropriate content.
• Spreading malware, spam, or any malicious activity.`,
      gradient: 'from-cyan-500 to-teal-500'
    },
    {
      icon: FileText,
      title: 'Content Disclaimer',
      content: 'NoLogin is not liable for the content uploaded or shared by its users. We do not guarantee the accuracy, legality, or appropriateness of any user-generated content. Users are responsible for ensuring that their use of NoLogin complies with applicable laws. We reserve the right to remove any content that violates these terms, and we may suspend or terminate accounts involved in sharing such content. However, we are under no obligation to monitor, review, or censor content shared on NoLogin.',
      gradient: 'from-teal-500 to-green-500'
    },
    {
      icon: Lock,
      title: 'Security and Privacy',
      content: 'While NoLogin uses industry-standard measures to protect user data, we do not guarantee complete security of the files and information shared on the platform. You are responsible for ensuring the security of the content you upload, including using features like password protection, read-only modes, and setting link expirations. NoLogin will not be held responsible for any data breaches, leaks, or unauthorized access to files shared through the platform.',
      gradient: 'from-green-500 to-emerald-500'
    },
    {
      icon: AlertTriangle,
      title: 'Limitation of Liability',
      content: `Under no circumstances will NoLogin, its founders, developers, or affiliates be held liable for any direct, indirect, incidental, or consequential damages arising from:
• The use or inability to use our platform.
• The security, privacy, or protection of content shared through Nologin.
• Any loss of data or unauthorized access to user content.
• Content shared by users that may cause harm, offense, or violate legal rights.

NoLogin is provided "as is" without any warranties, express or implied. We do not guarantee the platform will always be available or free of errors or interruptions.`,
      gradient: 'from-emerald-500 to-lime-500'
    },
    {
      icon: LinkIcon,
      title: 'Third-Party Links',
      content: 'NoLogin may contain links to third-party websites. We are not responsible for the content, privacy policies, or practices of any third-party sites. Once you leave our platform, you are subject to the terms and policies of the respective third-party site.',
      gradient: 'from-purple-500 to-pink-500'
    },
    {
      icon: Edit,
      title: 'Modifications to the Terms',
      content: 'NoLogin reserves the right to update or modify these terms and conditions at any time without prior notice. By continuing to use the platform, you agree to be bound by the updated terms. We encourage users to periodically review these terms to stay informed.',
      gradient: 'from-pink-500 to-rose-500'
    },
    {
      icon: AlertCircle,
      title: 'Consent',
      content: 'By using NoLogin, you consent to our terms and conditions and agree to abide by them.',
      gradient: 'from-violet-500 to-purple-500'
    },
    {
      icon: DollarSign,
      title: 'Affiliate Disclosure',
      content: 'NoLogin may participate in affiliate marketing programs. Any purchases made through affiliate links on the platform may result in a commission for NoLogin at no extra cost to you.',
      gradient: 'from-orange-500 to-red-500'
    },
    {
      icon: HelpCircle,
      title: 'Questions About Our Terms?',
      content: 'If you need clarification or have concerns about our terms and conditions, please contact our support team at support@nologin.com',
      gradient: 'from-blue-500 to-indigo-500'
    }
  ];

  return (
    <div className="min-h-screen bg-[#0b0f15] text-white">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 p-6 z-50">
        <Link href="/">
          <button className="px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg text-gray-300 text-sm font-medium transition-all duration-300 hover:scale-105 ring-1 ring-cyan-400/30">
            Home
          </button>
        </Link>
      </nav>

      {/* Hero Section with Animation */}
      <section className="pt-32 pb-20 px-6 text-center animate-fade-in">
        <h1 className="text-5xl md:text-7xl font-bold mb-6">
          <span className="text-white">Terms & </span>
          <span className="bg-gradient-to-r from-cyan-400 via-indigo-400 to-fuchsia-500 bg-clip-text text-transparent animate-gradient">
            Conditions
          </span>
          <span className="text-white"> - NoLogin</span>
        </h1>
        <p className="text-xl text-gray-400 max-w-3xl mx-auto">
          Understanding Your Rights and Responsibilities on NoLogin
        </p>
      </section>

      {/* Content Sections with Scroll Animations */}
      <div className="max-w-5xl mx-auto px-6 pb-20 space-y-20">
        {sections.map((section, index) => {
          const Icon = section.icon;
          return (
            <div
              key={index}
              ref={(el) => (sectionsRef.current[index] = el)}
              className="opacity-0 translate-y-8 transition-all duration-700 ease-out"
            >
              <div className="flex items-start gap-4 mb-6">
                <div className={`p-3 rounded-xl bg-gradient-to-br ${section.gradient} flex-shrink-0 shadow-lg hover:scale-110 transition-transform duration-300`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <h2 className="text-3xl md:text-4xl font-bold hover:text-transparent hover:bg-clip-text hover:bg-gradient-to-r hover:from-purple-400 hover:to-pink-400 transition-all duration-300 cursor-default">
                  {section.title}
                </h2>
              </div>
              <div className="pl-16">
                <p className="text-lg text-gray-300 leading-relaxed whitespace-pre-line">
                  {section.content}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer with Fade Animation */}
      <footer className="border-t border-gray-800 py-8 text-center animate-fade-in-delay">
        <p className="text-gray-400">
          © 2024 NoLogin. All rights reserved.
        </p>
      </footer>

      {/* Custom Animations */}
      <style jsx>{`
        @keyframes fade-in {
          from { 
            opacity: 0; 
            transform: translateY(20px); 
          }
          to { 
            opacity: 1; 
            transform: translateY(0); 
          }
        }
        
        @keyframes gradient {
          0%, 100% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
        }
        
        @keyframes fade-in-delay {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        
        .animate-fade-in {
          animation: fade-in 1s ease-out;
        }
        
        .animate-gradient {
          background-size: 200% auto;
          animation: gradient 3s ease infinite;
        }
        
        .animate-fade-in-delay {
          animation: fade-in-delay 1.5s ease-out 0.5s both;
        }
        
        /* Smooth Scrolling */
        html {
          scroll-behavior: smooth;
        }
        
        /* Custom Scrollbar */
        ::-webkit-scrollbar {
          width: 8px;
        }
        
        ::-webkit-scrollbar-track {
          background: #1a1a1a;
        }
        
        ::-webkit-scrollbar-thumb {
          background: linear-gradient(180deg, #a855f7, #ec4899);
          border-radius: 4px;
        }
        
        ::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(180deg, #9333ea, #db2777);
        }
      `}</style>
    </div>
  );
};

export default Terms;
