import React from 'react';
import { Github, Linkedin, Mail, Database, Wifi } from 'lucide-react';

type FooterProps = {
  onNavigate: (section: string) => void;
};

const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  return (
    <footer className="bg-slate-900/90 border-t border-cyan-500/20 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <div className="relative">
                <Wifi className="h-8 w-8 text-cyan-400" />
                <div className="absolute -top-1 -right-1 h-3 w-3 bg-green-400 rounded-full animate-pulse"></div>
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                IoT Monitor
              </span>
            </div>
            <p className="text-gray-400 mb-6 max-w-md">
              Empowering intelligent IoT monitoring with real-time Firebase integration 
              and AI-driven insights for the connected world.
            </p>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 text-sm text-gray-400">
                <Database className="h-4 w-4 text-orange-400" />
                <span>Powered by Firebase</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-3">
              <li>
                <button 
                  onClick={() => onNavigate('dashboard')} 
                  className="text-gray-400 hover:text-cyan-400 transition-colors"
                >
                  Dashboard
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onNavigate('analytics')} 
                  className="text-gray-400 hover:text-cyan-400 transition-colors"
                >
                  Analytics
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onNavigate('chatbot')} 
                  className="text-gray-400 hover:text-cyan-400 transition-colors"
                >
                  AI Assistant
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onNavigate('about')} 
                  className="text-gray-400 hover:text-cyan-400 transition-colors"
                >
                  Documentation
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onNavigate('data')} 
                  className="text-gray-400 hover:text-cyan-400 transition-colors"
                >
                  Data Table
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onNavigate('weather')} 
                  className="text-gray-400 hover:text-cyan-400 transition-colors"
                >
                  Weather
                </button>
              </li>
            </ul>
          </div>

          {/* Connect */}
          <div>
            <h3 className="text-white font-semibold mb-4">Connect</h3>
            <div className="flex space-x-3">
              <a 
                href="https://www.linkedin.com/in/manoj-kumar-pendem/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="p-2 bg-slate-800 hover:bg-cyan-500/20 rounded-lg text-gray-400 hover:text-cyan-400 transition-all duration-300"
              >
                <Linkedin className="h-5 w-5" />
              </a>
              <a 
                href="https://github.com/Manojkumar2806" 
                target="_blank" 
                rel="noopener noreferrer"
                className="p-2 bg-slate-800 hover:bg-cyan-500/20 rounded-lg text-gray-400 hover:text-cyan-400 transition-all duration-300"
              >
                <Github className="h-5 w-5" />
              </a>
              <a 
                href="mailto:23691A3279@mits.ac.in" 
                className="p-2 bg-slate-800 hover:bg-cyan-500/20 rounded-lg text-gray-400 hover:text-cyan-400 transition-all duration-300"
              >
                <Mail className="h-5 w-5" />
              </a>
            </div>

            <div className="mt-4">
              <p className="text-sm text-gray-500">
                © 2025 IoT Monitor. Built with React & Firebase.
              </p>
            </div>
          </div>
        </div>

        <div className="border-t border-slate-800 mt-8 pt-8 text-center">
          <p className="text-gray-500 text-sm">
            Advanced IoT monitoring platform designed for real-time insights and intelligent automation.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
