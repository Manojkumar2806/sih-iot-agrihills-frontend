import React from 'react';
import { Menu, X, Wifi, ChevronDown } from 'lucide-react';

interface NavbarProps {
  activeSection: string;
  onNavigate: (section: string) => void;
}

const Navbar: React.FC<NavbarProps> = ({ activeSection, onNavigate }) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const [openDropdown, setOpenDropdown] = React.useState<string | null>(null);

  const navItems = [
    { id: 'home', label: 'Home' },
    { id: 'data', label: 'Data Table' },
    { id: 'dashboard', label: 'Dashboard' },
    { id: 'analytics', label: 'Analytics' },
    {
      id: 'market',
      label: 'Market',
      children: [
        { id: 'marketPrices', label: 'Market Prices' },
        { id: 'agriEye', label: 'Agri Eye' },
      ]
    },
    { id: 'chatbot', label: 'Chatbot' },
    { id: 'about', label: 'About' },
    { id: 'weather', label: 'Weather' },
  ];

  return (
    <nav className="fixed top-0 w-full z-50 bg-slate-900/95 backdrop-blur-md border-b border-cyan-500/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-2">
            <div className="relative">
              <Wifi className="h-8 w-8 text-cyan-400" />
              <div className="absolute -top-1 -right-1 h-3 w-3 bg-green-400 rounded-full animate-pulse"></div>
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
              Agri Hills
            </span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              {navItems.map((item) => (
                <div key={item.id} className="relative group">
                  {item.children ? (
                    <>
                      <button
                        onClick={() => setOpenDropdown(openDropdown === item.id ? null : item.id)}
                        onMouseEnter={() => setOpenDropdown(item.id)}
                        className={`px-3 py-2 rounded-md text-sm font-medium transition-all duration-300 flex items-center space-x-1 ${activeSection === item.id || item.children.some(child => child.id === activeSection)
                            ? 'bg-cyan-500/20 text-cyan-400 shadow-lg shadow-cyan-500/25'
                            : 'text-gray-300 hover:text-cyan-400 hover:bg-cyan-500/10'
                          }`}
                      >
                        <span>{item.label}</span>
                        <ChevronDown className={`h-4 w-4 transition-transform duration-300 ${openDropdown === item.id ? 'rotate-180' : ''}`} />
                      </button>

                      {openDropdown === item.id && (
                        <div
                          className="absolute left-0 mt-2 w-48 rounded-md shadow-lg bg-slate-900 border border-cyan-500/20 py-1 z-50 animate-in fade-in slide-in-from-top-2 duration-200"
                          onMouseLeave={() => setOpenDropdown(null)}
                        >
                          {item.children.map((child) => (
                            <button
                              key={child.id}
                              onClick={() => {
                                onNavigate(child.id);
                                setOpenDropdown(null);
                              }}
                              className={`block px-4 py-2 text-sm w-full text-left transition-colors duration-200 ${activeSection === child.id
                                  ? 'bg-cyan-500/20 text-cyan-400'
                                  : 'text-gray-300 hover:text-cyan-400 hover:bg-cyan-500/10'
                                }`}
                            >
                              {child.label}
                            </button>
                          ))}
                        </div>
                      )}
                    </>
                  ) : (
                    <button
                      onClick={() => onNavigate(item.id)}
                      className={`px-3 py-2 rounded-md text-sm font-medium transition-all duration-300 ${activeSection === item.id
                          ? 'bg-cyan-500/20 text-cyan-400 shadow-lg shadow-cyan-500/25'
                          : 'text-gray-300 hover:text-cyan-400 hover:bg-cyan-500/10'
                        }`}
                    >
                      {item.label}
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-300 hover:text-cyan-400 p-2"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isOpen && (
        <div className="md:hidden bg-slate-900/98 backdrop-blur-md">
          <div className="px-2 pt-2 pb-3 space-y-1">
            {navItems.map((item) => (
              <div key={item.id}>
                {item.children ? (
                  <>
                    <button
                      onClick={() => setOpenDropdown(openDropdown === item.id ? null : item.id)}
                      className={`flex items-center justify-between px-3 py-2 rounded-md text-base font-medium w-full text-left transition-all duration-300 ${activeSection === item.id || item.children.some(child => child.id === activeSection)
                          ? 'bg-cyan-500/20 text-cyan-400'
                          : 'text-gray-300 hover:text-cyan-400 hover:bg-cyan-500/10'
                        }`}
                    >
                      <span>{item.label}</span>
                      <ChevronDown className={`h-5 w-5 transition-transform duration-300 ${openDropdown === item.id ? 'rotate-180' : ''}`} />
                    </button>
                    {openDropdown === item.id && (
                      <div className="pl-4 mt-1 space-y-1">
                        {item.children.map((child) => (
                          <button
                            key={child.id}
                            onClick={() => {
                              onNavigate(child.id);
                              setIsOpen(false);
                              setOpenDropdown(null);
                            }}
                            className={`block px-3 py-2 rounded-md text-sm font-medium w-full text-left transition-all duration-300 ${activeSection === child.id
                                ? 'text-cyan-400 bg-cyan-500/10'
                                : 'text-gray-400 hover:text-cyan-400 hover:bg-cyan-500/5'
                              }`}
                          >
                            {child.label}
                          </button>
                        ))}
                      </div>
                    )}
                  </>
                ) : (
                  <button
                    onClick={() => {
                      onNavigate(item.id);
                      setIsOpen(false);
                    }}
                    className={`block px-3 py-2 rounded-md text-base font-medium w-full text-left transition-all duration-300 ${activeSection === item.id
                        ? 'bg-cyan-500/20 text-cyan-400'
                        : 'text-gray-300 hover:text-cyan-400 hover:bg-cyan-500/10'
                      }`}
                  >
                    {item.label}
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;