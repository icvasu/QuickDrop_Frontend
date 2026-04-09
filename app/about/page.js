'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';
import { Shield, Clock4, Globe2, Lock, Share2, Sparkles } from 'lucide-react';

export default function AboutPage() {
  const missionRef = useRef(null);
  const connectRef = useRef(null);

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

    if (missionRef.current) observer.observe(missionRef.current);
    if (connectRef.current) observer.observe(connectRef.current);

    return () => observer.disconnect();
  }, []);

  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      {/* Top bar with animation */}
      <div className="px-6 pt-6 animate-fade-in">
        <Link href="/" className="px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg text-gray-300 text-sm font-medium transition-all duration-300 hover:scale-105">
          Home
        </Link>
      </div>

      <main className="flex-1 px-6 pb-16">
        {/* Hero */}
        <section className="max-w-5xl mx-auto text-center mt-6 animate-fade-in">
          <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight mb-3">
            <span className="text-white">About </span>
            <span className="bg-gradient-to-r from-purple-500 via-pink-500 to-orange-400 bg-clip-text text-transparent animate-gradient">
              QuickDrop
            </span>
          </h1>
          <p className="text-gray-400 text-lg md:text-xl">
            Simplifying Text, Document Sharing for Everyone
          </p>
        </section>

        {/* Mission */}
        <section ref={missionRef} className="max-w-4xl mx-auto mt-16 opacity-0 translate-y-8 transition-all duration-700">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-6 hover:text-transparent hover:bg-clip-text hover:bg-gradient-to-r hover:from-purple-400 hover:to-pink-400 transition-all duration-300 cursor-default">
            Our Mission
          </h2>
          <p className="text-gray-300 text-center leading-relaxed">
            At Quickdrop, we believe in making text and document sharing simple and efficient. Our
            platform is designed to provide fast, secure, and hassle-free sharing, all without the
            need for login credentials.
          </p>
        </section>

        {/* Features Grid */}
        <section className="max-w-6xl mx-auto mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((f, idx) => (
            <FeatureCard key={f.title} {...f} index={idx} />
          ))}
        </section>

        {/* Connect with us */}
        <section ref={connectRef} className="max-w-6xl mx-auto mt-16 rounded-2xl border border-purple-500/20 bg-gradient-to-b from-purple-950/20 to-transparent p-8 opacity-0 translate-y-8 transition-all duration-700 hover:border-purple-400/40 transition-colors duration-300">
          <h3 className="text-2xl md:text-3xl font-bold mb-2 text-purple-400 hover:scale-105 transition-transform duration-300 cursor-default">Connect with Us</h3>
          <p className="text-gray-300 mb-6">Join our community and stay updated with the latest features and improvements.</p>
          <div className="flex flex-wrap gap-4">
            <SocialButton href="#" label="LinkedIn" />
            <SocialButton href="#" label="Instagram" />
            <SocialButton href="#" label="Email" />
          </div>
          <hr className="border-gray-800 my-8" />
          <p className="text-center text-gray-500 animate-fade-in-delay">© 2025 Quickdrop. All rights reserved.</p>
        </section>
      </main>

      <style jsx>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(6px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes slide-up {
          from { opacity: 0; transform: translateY(16px); }
          to { opacity: 1; transform: translateY(0); }
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
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .animate-fade-in { animation: fade-in 600ms ease-out both; }
        .animate-slide-up { animation: slide-up 700ms ease-out both; }
        .animate-gradient { 
          background-size: 200% auto;
          animation: gradient 3s ease infinite;
        }
        .animate-fade-in-delay {
          animation: fade-in-delay 1.5s ease-out 0.5s both;
        }
        .card-shadow { box-shadow: 0 10px 40px rgba(14, 165, 233, 0.15); }
      `}</style>
    </div>
  );
}

function FeatureCard({ title, desc, icon: Icon, index }) {
  const gradients = [
    'from-purple-500 to-blue-500',
    'from-blue-500 to-cyan-500',
    'from-cyan-500 to-teal-500',
    'from-green-500 to-emerald-500',
    'from-emerald-500 to-lime-500',
    'from-orange-500 to-red-500'
  ];
  
  const gradient = gradients[index % gradients.length];

  return (
    <div
      className="rounded-2xl border border-purple-500/20 bg-[#0f0b15]/80 backdrop-blur-sm p-6 transition-all duration-300 hover:-translate-y-2 hover:border-purple-400/40 hover:shadow-2xl hover:shadow-purple-500/20 card-shadow cursor-default"
      style={{ animation: `fade-in 500ms ease-out ${100 + index * 80}ms both` }}
    >
      <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center mb-4 ring-1 ring-purple-500/30 transition-transform duration-300 hover:scale-110 hover:rotate-6`}>
        <Icon className="w-6 h-6 text-white" />
      </div>
      <h4 className="text-xl font-semibold mb-2 hover:text-purple-400 transition-colors duration-300">{title}</h4>
      <p className="text-gray-400 leading-relaxed">{desc}</p>
    </div>
  );
}

function SocialButton({ href, label }) {
  return (
    <Link
      href={href}
      className="px-5 py-3 rounded-full bg-white/5 hover:bg-white/10 text-white transition-all duration-300 inline-flex items-center gap-2 hover:scale-110 hover:shadow-lg hover:shadow-purple-500/30"
    >
      <Sparkles className="w-4 h-4 text-purple-400" />
      <span>{label}</span>
      <span className="opacity-70">↗</span>
    </Link>
  );
}

const features = [
  {
    title: 'Hassle-Free Sharing',
    desc: 'No accounts or tedious steps. Create a link and share instantly.',
    icon: Share2,
  },
  {
    title: 'Secure Access',
    desc: 'Optional password protection and time-bound access keep content private.',
    icon: Shield,
  },
  {
    title: 'Universal Access',
    desc: 'Works across devices and platforms so your notes and files follow you.',
    icon: Globe2,
  },
  {
    title: 'Lock When Needed',
    desc: 'Lock your slug anytime and control who can view or modify.',
    icon: Lock,
  },
  {
    title: 'Time Efficient',
    desc: 'Choose expiry and forget cleanup—expired content is removed automatically.',
    icon: Clock4,
  },
  {
    title: 'Simple by Design',
    desc: 'Minimal UI focused on the essentials of writing, uploading, and sharing.',
    icon: Sparkles,
  },
];


