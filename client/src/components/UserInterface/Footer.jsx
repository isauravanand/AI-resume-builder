import React from "react";
import { Mail, Phone, Linkedin, Twitter, Github, Rocket } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-gradient-to-t from-black via-slate-950 to-slate-900/50 border-t border-emerald-600/20 text-slate-300 shadow-inner shadow-slate-900/50">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-14">

        {/* --- TOP SECTION: BRAND & CONTACT --- */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-10 border-b border-slate-700/50 pb-10">

          {/* 1. Brand Section (Takes 2 columns on md) */}
          <div className="md:col-span-2">
            <h3 className="text-3xl font-extrabold text-white mb-5 flex items-center gap-2">
              <Rocket size={28} className="text-emerald-400 rotate-45" />
              NexFolio
            </h3>
            <p className="text-sm text-slate-400 mb-6 leading-relaxed max-w-lg">
              Build professional resumes powered by AI. Land your dream job with an ATS-optimized resume in minutes.
            </p>

            {/* Social Links - Enhanced button styling */}
            <div className="flex gap-3 mt-6">
              <SocialIcon href="#" label="LinkedIn"><Linkedin size={20} /></SocialIcon>
              <SocialIcon href="#" label="Twitter"><Twitter size={20} /></SocialIcon>
              <SocialIcon href="#" label="GitHub"><Github size={20} /></SocialIcon>
            </div>
          </div>

          {/* 2. Contact Info (Takes 1 column on md) */}
          <div className="md:col-span-2">
            <h4 className="text-white font-extrabold mb-6 uppercase tracking-widest text-sm border-b border-slate-700/50 pb-2">Contact & Support</h4>

            <div className="grid grid-cols-2 gap-4">

              {/* Contact 1 */}
              <div className="flex items-start gap-3">
                <Mail size={18} className="text-emerald-400 flex-shrink-0 mt-1" />
                <div>
                  <p className="text-xs text-slate-500 uppercase">Email</p>
                  <span className="text-slate-300 text-sm">Soon</span>
                </div>
              </div>

              {/* Contact 2 */}
              <div className="flex items-start gap-3">
                <Phone size={18} className="text-emerald-400 flex-shrink-0 mt-1" />
                <div>
                  <p className="text-xs text-slate-500 uppercase">Phone</p>
                  <span className="text-slate-300 text-sm">XXX-XXX-XXXX</span>
                </div>
              </div>

              {/* Placeholder Links for structure */}
              {/* <div className="col-span-2 pt-4">
                <h4 className="text-white font-semibold mb-3 uppercase tracking-wider text-xs">Quick Links</h4>
                <div className="flex gap-4 text-sm text-slate-400">
                  <a href="/privacy" className="hover:text-emerald-400 transition">Privacy</a>
                  <a href="/terms" className="hover:text-emerald-400 transition">Terms</a>
                  <a href="/about" className="hover:text-emerald-400 transition">About</a>
                </div>
              </div> */}
            </div>
          </div>
        </div>

        {/* --- BOTTOM BAR: COPYRIGHT --- */}
        <div className="pt-4 flex flex-col md:flex-row items-center justify-between">
          <p className="text-sm text-slate-500 text-center md:text-left mb-4 md:mb-0">
            © 2025 NexFolio. All rights reserved.
            <span className="text-purple-400 block mt-1">Author: Saurav Anand</span>
          </p>
          <p className="text-sm text-slate-500">
            Crafted with <span className="text-emerald-400">♥</span> and AI for job seekers worldwide
          </p>
        </div>
      </div>
    </footer>
  );
};

// Helper component for styled social icons
const SocialIcon = ({ href, label, children }) => (
  <a
    href={href}
    className="text-slate-400 hover:text-emerald-400 transition-colors duration-300 p-2 rounded-full border border-slate-700 hover:border-emerald-600/50 hover:bg-slate-800 flex items-center justify-center"
    aria-label={label}
  >
    {children}
  </a>
);

export default Footer;