import React from 'react';
import { ArrowRight, Zap, BarChart3, Shield } from 'lucide-react';

interface HeroProps {
  onNavigate: (section: string) => void;
}

const Hero: React.FC<HeroProps> = ({ onNavigate }) => {
  return (
    <div className="pt-16 min-h-screen flex items-center">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <div className="mb-8">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-cyan-500/10 border border-cyan-500/20 mb-6">
              <Zap className="h-4 w-4 text-cyan-400 mr-2" />
              <span className="text-cyan-400 text-sm font-medium">Real-Time IoT Monitoring</span>
            </div>
          </div>

          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
            <span className="bg-gradient-to-r from-white via-cyan-200 to-cyan-400 bg-clip-text text-transparent">
              Smart IoT Monitoring
            </span>
            <br />
            <span className="text-2xl md:text-3xl lg:text-4xl text-gray-300">
              Real-Time Insights Powered by Firebase
            </span>
          </h1>

          <p className="text-xl text-gray-400 mb-12 max-w-3xl mx-auto leading-relaxed">
            Monitor your connected devices, analyze sensor data, and gain actionable insights 
            with our advanced IoT dashboard. Experience the future of intelligent monitoring.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <button
              onClick={() => onNavigate('data')}
              className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 rounded-lg text-white font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg shadow-cyan-500/25"
            >
              View Live Data
              <ArrowRight className="ml-2 h-5 w-5" />
            </button>
            <button
              onClick={() => onNavigate('analytics')}
              className="inline-flex items-center px-8 py-4 bg-transparent border border-cyan-500/50 hover:bg-cyan-500/10 rounded-lg text-cyan-400 font-semibold transition-all duration-300"
            >
              Explore Analytics
            </button>
          </div>

          {/* Feature cards */}
          <div className="grid md:grid-cols-3 gap-8 mt-16">
            <div className="p-6 bg-gradient-to-br from-slate-800/50 to-slate-900/50 rounded-xl border border-cyan-500/10 hover:border-cyan-500/30 transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-cyan-500/10">
              <BarChart3 className="h-12 w-12 text-cyan-400 mb-4 mx-auto" />
              <h3 className="text-xl font-semibold mb-2">Real-Time Analytics</h3>
              <p className="text-gray-400">Monitor sensor data with live charts and interactive visualizations.</p>
            </div>
            
            <div className="p-6 bg-gradient-to-br from-slate-800/50 to-slate-900/50 rounded-xl border border-cyan-500/10 hover:border-cyan-500/30 transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-cyan-500/10">
              <Shield className="h-12 w-12 text-cyan-400 mb-4 mx-auto" />
              <h3 className="text-xl font-semibold mb-2">Firebase Integration</h3>
              <p className="text-gray-400">Secure, scalable data storage with real-time synchronization.</p>
            </div>
            
            <div className="p-6 bg-gradient-to-br from-slate-800/50 to-slate-900/50 rounded-xl border border-cyan-500/10 hover:border-cyan-500/30 transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-cyan-500/10">
              <Zap className="h-12 w-12 text-cyan-400 mb-4 mx-auto" />
              <h3 className="text-xl font-semibold mb-2">AI Assistant</h3>
              <p className="text-gray-400">Get insights and answers about your IoT data through our chatbot.</p>
            </div>
          </div>

          {/* How It Works Section */}
          <div className="mt-24">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">How It Works</h2>
              <p className="text-xl text-gray-400 max-w-2xl mx-auto">
                Simple steps to get your IoT monitoring system up and running
              </p>
            </div>

            <div className="grid md:grid-cols-4 gap-8">
              <div className="text-center group">
                <div className="relative mb-6">
                  <div className="w-20 h-20 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-full flex items-center justify-center mx-auto group-hover:scale-110 transition-transform duration-300">
                    <span className="text-2xl font-bold text-white">1</span>
                  </div>
                  <div className="absolute top-10 left-1/2 w-full h-0.5 bg-gradient-to-r from-cyan-500/50 to-transparent hidden md:block"></div>
                </div>
                <h3 className="text-xl font-semibold text-white mb-3">Connect Sensors</h3>
                <p className="text-gray-400">Connect your IoT sensors to our platform using Firebase real-time database integration.</p>
              </div>

              <div className="text-center group">
                <div className="relative mb-6">
                  <div className="w-20 h-20 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-full flex items-center justify-center mx-auto group-hover:scale-110 transition-transform duration-300">
                    <span className="text-2xl font-bold text-white">2</span>
                  </div>
                  <div className="absolute top-10 left-1/2 w-full h-0.5 bg-gradient-to-r from-cyan-500/50 to-transparent hidden md:block"></div>
                </div>
                <h3 className="text-xl font-semibold text-white mb-3">Real-Time Data</h3>
                <p className="text-gray-400">Watch as your sensor data flows in real-time, automatically stored and synchronized across all devices.</p>
              </div>

              <div className="text-center group">
                <div className="relative mb-6">
                  <div className="w-20 h-20 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-full flex items-center justify-center mx-auto group-hover:scale-110 transition-transform duration-300">
                    <span className="text-2xl font-bold text-white">3</span>
                  </div>
                  <div className="absolute top-10 left-1/2 w-full h-0.5 bg-gradient-to-r from-cyan-500/50 to-transparent hidden md:block"></div>
                </div>
                <h3 className="text-xl font-semibold text-white mb-3">Analyze & Visualize</h3>
                <p className="text-gray-400">Use our advanced analytics dashboard to visualize trends, patterns, and insights from your data.</p>
              </div>

              <div className="text-center group">
                <div className="relative mb-6">
                  <div className="w-20 h-20 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-full flex items-center justify-center mx-auto group-hover:scale-110 transition-transform duration-300">
                    <span className="text-2xl font-bold text-white">4</span>
                  </div>
                </div>
                <h3 className="text-xl font-semibold text-white mb-3">AI Insights</h3>
                <p className="text-gray-400">Get intelligent recommendations and answers from our AI assistant about your IoT ecosystem.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;