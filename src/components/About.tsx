import React from 'react';
import { Database, Zap, Shield, BarChart3, MessageCircle, Globe } from 'lucide-react';

const About: React.FC = () => {
  return (
    <div className="pt-16 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-12 text-center">
          <h1 className="text-3xl font-bold text-white mb-4">About IoT Monitor</h1>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            A cutting-edge IoT monitoring platform that brings real-time sensor data to your fingertips, 
            powered by Firebase and enhanced with AI-driven insights.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 p-6 rounded-xl border border-cyan-500/20 hover:border-cyan-500/40 transition-all duration-300 hover:scale-105">
            <Database className="h-12 w-12 text-cyan-400 mb-4" />
            <h3 className="text-xl font-semibold text-white mb-3">Firebase Integration</h3>
            <p className="text-gray-400">
              Seamless real-time data synchronization with Google Firebase, ensuring your sensor data is always up-to-date and secure.
            </p>
          </div>

          <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 p-6 rounded-xl border border-cyan-500/20 hover:border-cyan-500/40 transition-all duration-300 hover:scale-105">
            <BarChart3 className="h-12 w-12 text-green-400 mb-4" />
            <h3 className="text-xl font-semibold text-white mb-3">Real-Time Analytics</h3>
            <p className="text-gray-400">
              Interactive charts and visualizations that update in real-time, giving you instant insights into your IoT environment.
            </p>
          </div>

          <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 p-6 rounded-xl border border-cyan-500/20 hover:border-cyan-500/40 transition-all duration-300 hover:scale-105">
            <MessageCircle className="h-12 w-12 text-purple-400 mb-4" />
            <h3 className="text-xl font-semibold text-white mb-3">AI Assistant</h3>
            <p className="text-gray-400">
              Intelligent chatbot that can answer questions about your data, provide insights, and help you understand trends.
            </p>
          </div>

          <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 p-6 rounded-xl border border-cyan-500/20 hover:border-cyan-500/40 transition-all duration-300 hover:scale-105">
            <Globe className="h-12 w-12 text-blue-400 mb-4" />
            <h3 className="text-xl font-semibold text-white mb-3">Responsive Design</h3>
            <p className="text-gray-400">
              Fully responsive interface that works seamlessly across desktop, tablet, and mobile devices for monitoring on-the-go.
            </p>
          </div>

          <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 p-6 rounded-xl border border-cyan-500/20 hover:border-cyan-500/40 transition-all duration-300 hover:scale-105">
            <Shield className="h-12 w-12 text-red-400 mb-4" />
            <h3 className="text-xl font-semibold text-white mb-3">Secure & Reliable</h3>
            <p className="text-gray-400">
              Built with security in mind, using industry-standard practices to protect your IoT data and ensure reliable monitoring.
            </p>
          </div>

          <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 p-6 rounded-xl border border-cyan-500/20 hover:border-cyan-500/40 transition-all duration-300 hover:scale-105">
            <Zap className="h-12 w-12 text-yellow-400 mb-4" />
            <h3 className="text-xl font-semibold text-white mb-3">Real-Time Updates</h3>
            <p className="text-gray-400">
              Live data streaming ensures you're always seeing the most current information from your connected sensors.
            </p>
          </div>
        </div>

        {/* Technology Stack */}
        <div className="bg-gradient-to-br from-slate-800/30 to-slate-900/30 p-8 rounded-xl border border-cyan-500/10 mb-12">
          <h2 className="text-2xl font-bold text-white mb-6 text-center">Technology Stack</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="bg-cyan-500/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-2xl">⚛️</span>
              </div>
              <p className="text-white font-medium">React</p>
              <p className="text-sm text-gray-400">Frontend Framework</p>
            </div>
            
            <div className="text-center">
              <div className="bg-orange-500/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-2xl">🔥</span>
              </div>
              <p className="text-white font-medium">Firebase</p>
              <p className="text-sm text-gray-400">Real-time Database</p>
            </div>
            
            <div className="text-center">
              <div className="bg-blue-500/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-2xl">📊</span>
              </div>
              <p className="text-white font-medium">Chart.js</p>
              <p className="text-sm text-gray-400">Data Visualization</p>
            </div>
            
            <div className="text-center">
              <div className="bg-green-500/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-2xl">🎨</span>
              </div>
              <p className="text-white font-medium">Tailwind CSS</p>
              <p className="text-sm text-gray-400">Styling Framework</p>
            </div>
          </div>
        </div>

        {/* Team or Contact Section */}
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Get Started</h2>
          <p className="text-gray-400 mb-6 max-w-2xl mx-auto">
            Ready to start monitoring your IoT devices? Connect your sensors to Firebase and 
            begin experiencing real-time insights with our powerful analytics platform.
          </p>
          <button className="inline-flex items-center px-8 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 rounded-lg text-white font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg shadow-cyan-500/25">
            Start Monitoring
          </button>
        </div>
      </div>
    </div>
  );
};

export default About;