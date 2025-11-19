import React from "react";
import { Mail, Phone, Linkedin, Twitter, Github, Rocket } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-gradient-to-t from-black via-slate-950 to-slate-900/50 border-t border-white/10 text-slate-300 shadow-inner shadow-slate-900/50">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-12">

        {/* Main Footer Content Grid (Simplified to 2 Columns: Brand & Contact) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10 border-b border-slate-700/50 pb-8">

          {/* 1. Brand Section (Takes 2/3 width on md+) */}
          <div className="md:col-span-2">
            <h3 className="text-2xl font-extrabold text-white mb-4 flex items-center gap-2">
              <Rocket size={24} className="text-emerald-400 rotate-45" />
              NexFolio
            </h3>
            <p className="text-sm text-slate-400 mb-6 leading-relaxed max-w-xl">
              Build professional resumes powered by AI. Land your dream job with an ATS-optimized resume in minutes.
            </p>
            <div className="flex gap-4">
              <a
                href="#"
                className="text-slate-400 hover:text-emerald-400 transition-colors duration-300 p-2 rounded-full border border-transparent hover:border-emerald-600/50"
                aria-label="LinkedIn"
              >
                <Linkedin size={20} />
              </a>
              <a
                href="#"
                className="text-slate-400 hover:text-emerald-400 transition-colors duration-300 p-2 rounded-full border border-transparent hover:border-emerald-600/50"
                aria-label="Twitter"
              >
                <Twitter size={20} />
              </a>
              <a
                href="#"
                className="text-slate-400 hover:text-emerald-400 transition-colors duration-300 p-2 rounded-full border border-transparent hover:border-emerald-600/50"
                aria-label="GitHub"
              >
                <Github size={20} />
              </a>
            </div>
          </div>

          {/* 2. Contact Info (Takes 1/3 width on md+) */}
          <div className="md:col-span-1 md:pt-4">
            <h4 className="text-white font-semibold mb-6 uppercase tracking-wider text-sm">Contact Info</h4>

            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <Mail size={18} className="text-emerald-400 flex-shrink-0 mt-1" />
                <div>
                  <p className="text-xs text-slate-500 uppercase">Email</p>
                  {/* <a
                    href="mailto:support@nexfolio.com"
                    className="text-slate-300 hover:text-emerald-400 transition-colors duration-300 text-sm"
                  > */}
                    Soon
                  {/* </a> */}
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Phone size={18} className="text-emerald-400 flex-shrink-0 mt-1" />
                <div>
                  <p className="text-xs text-slate-500 uppercase">Phone</p>
                  {/* <a
                    href="tel:+1234567890"
                    className="text-slate-300 hover:text-emerald-400 transition-colors duration-300 text-sm"
                  > */}
                    XXXXXXXXX
                  {/* </a> */}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* --- Bottom Bar / Copyright --- */}
        <div className="pt-4 flex flex-col md:flex-row items-center justify-between">
          <p className="text-sm text-slate-500 text-center md:text-left mb-4 md:mb-0">
            © 2025 NexFolio. All rights reserved. <br /> <br />   
            Author: Saurav Anand
          </p>
          <p className="text-sm text-slate-500">
            Crafted with <span className="text-emerald-400">♥</span> and AI for job seekers worldwide
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;