"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Activity, Star, Calendar, Clock, Zap, Target, BarChart, Bell, Send, Quote } from 'lucide-react';
import { useAuth, SignInButton } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';

export default function LandingPage() {
  const { isSignedIn, isLoaded } = useAuth();
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Prevent hydration errors by not rendering anything until mounted
  if (!isMounted) return null;

  return (
    <div 
      className="text-white font-sans selection:bg-white/20 selection:text-white"
      style={{
        backgroundImage: "url('/istockphoto-1451071102-1024x1024.jpg')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundAttachment: 'fixed'
      }}
    >
      {/* Hero Section */}
      <div className="min-h-screen flex flex-col relative bg-gradient-to-r from-black/90 via-black/40 to-black/70">
        {/* Navigation Header */}
        <header className="w-full px-8 py-6 flex items-center justify-between z-10">
          <div className="flex items-center gap-2">
            <Activity className="w-6 h-6 text-white" />
            <span className="font-semibold text-lg tracking-tight">TimeTracker</span>
          </div>
          
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-white/70">
            <a href="#features" className="hover:text-white transition-colors">Features</a>
            <a href="#schedules" className="hover:text-white transition-colors">Schedules</a>
            <a href="#testimonials" className="hover:text-white transition-colors">Testimonials</a>
            <a href="#contact" className="hover:text-white transition-colors">Contact</a>
          </nav>

          <div>
            {!isSignedIn ? (
              <SignInButton mode="modal">
                <button className="px-5 py-2.5 bg-[#FDF9F1] text-black text-sm font-bold rounded-lg hover:bg-white transition-all transform hover:scale-105 active:scale-95 shadow-[0_0_20px_rgba(255,255,255,0.2)]">
                  Sign In
                </button>
              </SignInButton>
            ) : (
              <Link href="/dashboard" className="px-5 py-2.5 bg-[#FDF9F1] text-black text-sm font-bold rounded-lg hover:bg-white transition-all transform hover:scale-105 active:scale-95 shadow-[0_0_20px_rgba(255,255,255,0.2)]">
                Dashboard
              </Link>
            )}
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 flex flex-col lg:flex-row items-center lg:items-end justify-between max-w-7xl w-full mx-auto px-8 pb-24 z-10 pt-20">
          
          {/* Left Typography section */}
          <div className="flex-1 max-w-2xl mb-12 lg:mb-0">
            <h1 className="text-6xl md:text-8xl font-medium leading-[1.05] tracking-tight mb-8 drop-shadow-2xl">
              Find Your <br />
              Escape in <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-white/50">Focus</span>
            </h1>
            
            <p className="text-lg md:text-xl text-white/80 max-w-md leading-relaxed mb-16 drop-shadow-md">
              Discover handcrafted focus blocks in a distraction-free environment. Unplug, unwind, and reconnect with your deepest work.
            </p>

            <div className="flex items-center gap-4">
              <div className="flex -space-x-2">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="w-10 h-10 rounded-full border-2 border-black bg-white/20 backdrop-blur-md flex items-center justify-center">
                    <Star className="w-4 h-4 fill-white text-white" />
                  </div>
                ))}
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-semibold leading-none">4.9/5</span>
                <span className="text-white/70 text-sm">from 50,000+ sessions</span>
              </div>
            </div>
          </div>

          {/* Right Glassmorphism Card */}
          <div className="w-full max-w-[400px] bg-black/30 backdrop-blur-2xl border border-white/20 rounded-[32px] p-8 shadow-[0_30px_60px_rgba(0,0,0,0.6)] relative overflow-hidden group hover:border-white/30 transition-colors">
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
            
            <div className="flex justify-between items-start mb-8 relative z-10">
              <div>
                <h3 className="text-2xl font-medium mb-1">Deep Work</h3>
                <p className="text-white/70 text-lg">Focus Block</p>
              </div>
              <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center border border-white/10">
                <Clock className="w-5 h-5 text-white/90" />
              </div>
            </div>

            <div className="flex items-center justify-between gap-4 mb-6 border-b border-white/10 pb-6 relative z-10">
              <div className="flex items-center gap-2 text-white/90 font-medium">
                <Calendar className="w-4 h-4" />
                <span>Today</span>
              </div>
              <div className="h-4 w-px bg-white/20"></div>
              <div className="flex items-center gap-2 text-white/90 font-medium">
                <Target className="w-4 h-4" />
                <span>2 Hours</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-8 text-sm relative z-10">
              <div>
                <div className="text-white/50 mb-1">Start</div>
                <div className="font-medium text-white/90">After 09:00 AM</div>
              </div>
              <div>
                <div className="text-white/50 mb-1">Complete by</div>
                <div className="font-medium text-white/90">Until 12:00 PM</div>
              </div>
            </div>

            <div className="flex items-end justify-between mb-8 relative z-10">
              <div>
                <span className="text-4xl font-medium tracking-tight">100%</span>
                <span className="text-white/50 text-sm ml-1 font-medium">/focus</span>
              </div>
              <div className="text-sm text-white/70 text-right bg-white/10 px-3 py-1 rounded-full border border-white/5">
                0 distractions
              </div>
            </div>

            {!isSignedIn ? (
              <SignInButton mode="modal">
                <button className="relative z-10 w-full py-4 bg-white text-black font-semibold rounded-2xl text-lg hover:scale-[1.02] active:scale-[0.98] transition-transform shadow-[0_0_20px_rgba(255,255,255,0.15)]">
                  Start Session
                </button>
              </SignInButton>
            ) : (
              <Link href="/dashboard" className="relative z-10 block w-full text-center py-4 bg-white text-black font-semibold rounded-2xl text-lg hover:scale-[1.02] active:scale-[0.98] transition-transform shadow-[0_0_20px_rgba(255,255,255,0.15)]">
                Go to Dashboard
              </Link>
            )}
          </div>
        </main>
        
        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-50 animate-bounce">
          <span className="text-xs uppercase tracking-widest font-semibold">Scroll</span>
          <div className="w-px h-8 bg-gradient-to-b from-white to-transparent"></div>
        </div>
      </div>

      {/* Features Section */}
      <section id="features" className="py-32 px-8 bg-black/60 backdrop-blur-2xl relative overflow-hidden border-t border-white/10">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-white/5 blur-[120px] rounded-full pointer-events-none"></div>
        
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-medium tracking-tight mb-6">Master your time.</h2>
            <p className="text-lg text-white/60 max-w-2xl mx-auto">Everything you need to regain your focus, organized in an elegant, distraction-free environment.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { icon: Target, title: "Deep Focus Blocks", desc: "Set intentional blocks of time. No notifications, no distractions, just pure uninterrupted flow." },
              { icon: BarChart, title: "Analytics & Logs", desc: "Track your 10-minute micro-learnings and visualize your focus consistency over time." },
              { icon: Bell, title: "Smart Push Alerts", desc: "Get beautifully timed nudges 15 minutes before your schedule to help you prepare." }
            ].map((feat, i) => (
              <div key={i} className="bg-white/5 border border-white/10 rounded-[24px] p-8 hover:bg-white/10 transition-colors group">
                <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <feat.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-3">{feat.title}</h3>
                <p className="text-white/60 leading-relaxed">{feat.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Schedules Section */}
      <section id="schedules" className="py-32 px-8 bg-black/70 backdrop-blur-3xl border-t border-white/10">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-16">
          <div className="flex-1">
            <h2 className="text-4xl md:text-5xl font-medium tracking-tight mb-6">Structure your day, <br/><span className="text-white/50">effortlessly.</span></h2>
            <p className="text-lg text-white/60 mb-8 max-w-lg leading-relaxed">
              Build weekday and weekend schedules that adapt to your lifestyle. We handle the transitions so you can focus on the execution.
            </p>
            <ul className="space-y-4">
              {['Custom Phase Tracking', 'Flexible Weekend Routines', 'Automated Push Reminders'].map((item, i) => (
                <li key={i} className="flex items-center gap-3 text-white/80">
                  <div className="w-1.5 h-1.5 rounded-full bg-white"></div>
                  {item}
                </li>
              ))}
            </ul>
          </div>
          
          <div className="flex-1 w-full max-w-lg">
            <div className="bg-black border border-white/10 rounded-[32px] p-8 shadow-2xl relative">
              <div className="absolute -inset-0.5 bg-gradient-to-br from-white/20 to-transparent rounded-[34px] -z-10 blur-sm"></div>
              
              <div className="space-y-4">
                {[
                  { time: '08:00 AM', title: 'Morning Routine', active: false },
                  { time: '10:00 AM', title: 'Deep Work Session', active: true },
                  { time: '01:00 PM', title: 'Decompress', active: false },
                ].map((s, i) => (
                  <div key={i} className={`p-4 rounded-2xl flex items-center justify-between border ${s.active ? 'bg-white/10 border-white/20' : 'bg-transparent border-white/5'}`}>
                    <div className="flex items-center gap-4">
                      <div className={`text-xs font-mono px-2 py-1 rounded ${s.active ? 'bg-white/20 text-white' : 'bg-white/5 text-white/50'}`}>
                        {s.time}
                      </div>
                      <span className={`font-medium ${s.active ? 'text-white' : 'text-white/60'}`}>{s.title}</span>
                    </div>
                    {s.active && <div className="w-2 h-2 rounded-full bg-white animate-pulse"></div>}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-32 px-8 bg-black/40 backdrop-blur-xl relative border-t border-white/10">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-medium tracking-tight mb-6">Loved by focused minds.</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { text: "This has completely transformed how I handle my deep work sessions. The subtle nudges are perfect.", author: "Sarah Jenkins", role: "Software Engineer" },
              { text: "Finally, a time tracker that isn't overwhelming. The 10-minute study logs are a game changer for my learning retention.", author: "Michael Chen", role: "Product Designer" },
              { text: "The aesthetic alone keeps me coming back. It feels premium, distraction-free, and perfectly tuned for deep focus.", author: "Emma Roberts", role: "Freelance Writer" }
            ].map((t, i) => (
              <div key={i} className="bg-white/5 border border-white/10 rounded-[24px] p-8 flex flex-col justify-between">
                <div>
                  <Quote className="w-8 h-8 text-white/20 mb-6" />
                  <p className="text-lg text-white/90 leading-relaxed font-medium mb-8">"{t.text}"</p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center font-bold text-white">
                    {t.author.charAt(0)}
                  </div>
                  <div>
                    <div className="font-semibold text-sm">{t.author}</div>
                    <div className="text-white/50 text-xs">{t.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-32 px-8 bg-gradient-to-b from-black/70 to-black/95 backdrop-blur-2xl border-t border-white/10 text-center relative">
        {/* Glow behind contact */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-white/5 blur-[100px] rounded-full pointer-events-none"></div>
        <div className="max-w-2xl mx-auto">
          <div className="w-16 h-16 rounded-2xl bg-white/10 flex items-center justify-center mx-auto mb-8">
            <Send className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-4xl font-medium tracking-tight mb-6">Ready to regain your focus?</h2>
          <p className="text-lg text-white/60 mb-10">
            Join thousands of others who are building better habits and accomplishing more with TimeTracker.
          </p>
          {!isSignedIn ? (
            <SignInButton mode="modal">
              <button className="px-8 py-4 bg-white text-black font-semibold rounded-2xl text-lg hover:scale-105 transition-transform shadow-[0_0_30px_rgba(255,255,255,0.2)]">
                Get Started for Free
              </button>
            </SignInButton>
          ) : (
            <Link href="/dashboard" className="inline-block px-8 py-4 bg-white text-black font-semibold rounded-2xl text-lg hover:scale-105 transition-transform shadow-[0_0_30px_rgba(255,255,255,0.2)]">
              Enter Dashboard
            </Link>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 border-t border-white/10 text-center text-white/40 text-sm bg-black/95 backdrop-blur-md relative z-10">
        <p>© {new Date().getFullYear()} TimeTracker. All rights reserved.</p>
      </footer>
    </div>
  );
}
