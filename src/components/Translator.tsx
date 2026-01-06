
import React, { useState, useEffect } from "react";
import { Check, ChevronDown, Search } from "lucide-react";

declare global {
    interface Window {
        google: any;
        googleTranslateElementInit: () => void;
    }
}

const languages = [
    { code: "en", name: "English", flag: "gb" },
    { code: "hi", name: "हिन्दी", flag: "in" },
    { code: "te", name: "తెలుగు", flag: "in" },
    { code: "ta", name: "தமிழ்", flag: "in" },
    { code: "kn", name: "ಕನ್ನಡ", flag: "in" },
    { code: "ml", name: "മലയാളം", flag: "in" },
    { code: "ur", name: "اردو", flag: "in" },
    { code: "bn", name: "বাংলা", flag: "in" },
    { code: "gu", name: "ગુજરાતી", flag: "in" },
    { code: "mr", name: "मराठी", flag: "in" },
    { code: "pa", name: "ਪੰਜਾਬੀ", flag: "in" },
    // Add more as needed
];

export default function Translator() {
    const [open, setOpen] = useState(false);
    const [value, setValue] = useState("en");
    const [mounted, setMounted] = useState(false);
    const [search, setSearch] = useState("");

    useEffect(() => {
        setMounted(true);

        // Check for existing cookie
        const cookies = document.cookie.split(';');
        const googtrans = cookies.find(c => c.trim().startsWith('googtrans='));
        if (googtrans) {
            const langCode = googtrans.split('=')[1].split('/').pop();
            if (langCode) setValue(langCode);
        }

        // Load Google Translate Script
        if (!window.google?.translate?.TranslateElement) {
            const scriptId = "google-translate-script";
            if (!document.getElementById(scriptId)) {
                const addScript = document.createElement("script");
                addScript.id = scriptId;
                addScript.src = "//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
                addScript.async = true;
                document.body.appendChild(addScript);

                window.googleTranslateElementInit = () => {
                    new window.google.translate.TranslateElement(
                        {
                            pageLanguage: "en",
                            autoDisplay: false,
                            includedLanguages: languages.map(l => l.code).join(','),
                            layout: window.google.translate.TranslateElement.InlineLayout.SIMPLE,
                        },
                        "google_translate_element"
                    );
                };
            }
        }
    }, []);

    const handleLanguageChange = (langCode: string) => {
        setValue(langCode);
        setOpen(false);

        // Set Google Translate Cookie
        // This is the magic that makes Google Translate work custom-ly
        document.cookie = `googtrans=/en/${langCode}; path=/; domain=${window.location.hostname}`;
        document.cookie = `googtrans=/en/${langCode}; path=/;`; // Fallback

        // Reload page to apply translation
        window.location.reload();
    };

    // Close dropdown on click outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            const target = event.target as HTMLElement;
            if (!target.closest('.translator-dropdown')) {
                setOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    if (!mounted) return null;

    const selectedLanguage = languages.find((language) => language.code === value);
    const filteredLanguages = languages.filter(l => l.name.toLowerCase().includes(search.toLowerCase()));

    return (
        <div className="relative translator-dropdown z-50 notranslate">
            {/* Hidden Google Element */}
            <div id="google_translate_element" className="hidden absolute" />
            <style>{`
                .goog-te-banner-frame { display: none !important; }
                .goog-te-balloon-frame { display: none !important; }
                #goog-gt-tt { display: none !important; }
                .skiptranslate { display: none !important; } 
                body { top: 0px !important; position: static !important; }
            `}</style>

            {/* Trigger Button */}
            <button
                onClick={() => setOpen(!open)}
                className="flex items-center justify-between w-[160px] h-12 bg-slate-900/80 backdrop-blur-md border border-cyan-500/30 hover:border-cyan-500/60 transition-all duration-300 rounded-full px-4 cursor-pointer shadow-lg shadow-cyan-500/10"
            >
                {selectedLanguage ? (
                    <div className="flex items-center gap-3">
                        <div className="relative w-6 h-4 overflow-hidden rounded shadow-sm border border-slate-600">
                            {/* Using flagpedia or similar since flagcdn was requested but we need simple imgs */}
                            <img
                                src={`https://flagcdn.com/w40/${selectedLanguage.flag}.png`}
                                alt={selectedLanguage.name}
                                className="object-cover w-full h-full"
                            />
                        </div>
                        <span className="text-cyan-400 font-semibold text-sm">{selectedLanguage.name}</span>
                    </div>
                ) : (
                    <span className="text-cyan-400 font-medium">Select Language</span>
                )}
                <ChevronDown className={`w-4 h-4 text-cyan-400 opacity-70 transition-transform duration-300 ${open ? 'rotate-180' : ''}`} />
            </button>

            {/* Dropdown Content */}
            {open && (
                <div className="absolute top-14 left-0 w-[200px] bg-slate-900 border border-cyan-500/30 rounded-xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                    <div className="p-2 border-b border-slate-800">
                        <div className="flex items-center px-2 bg-slate-800/50 rounded-lg">
                            <Search className="w-4 h-4 text-slate-400 mr-2" />
                            <input
                                type="text"
                                placeholder="Search..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="w-full bg-transparent border-none text-slate-200 text-sm py-2 focus:outline-none placeholder:text-slate-500"
                                autoFocus
                            />
                        </div>
                    </div>
                    <div className="max-h-[240px] overflow-y-auto custom-scrollbar">
                        {filteredLanguages.map((language) => (
                            <div
                                key={language.code}
                                onClick={() => handleLanguageChange(language.code)}
                                className={`flex items-center justify-between px-4 py-3 cursor-pointer transition-colors ${value === language.code ? 'bg-cyan-950/30 text-cyan-400' : 'text-slate-300 hover:bg-slate-800'}`}
                            >
                                <div className="flex items-center gap-3">
                                    <div className="relative w-5 h-3.5 overflow-hidden rounded shadow-sm">
                                        <img
                                            src={`https://flagcdn.com/w40/${language.flag}.png`}
                                            alt={language.name}
                                            className="object-cover w-full h-full"
                                        />
                                    </div>
                                    <span className="text-sm font-medium">{language.name}</span>
                                </div>
                                {value === language.code && <Check className="w-4 h-4 text-cyan-500" />}
                            </div>
                        ))}
                        {filteredLanguages.length === 0 && (
                            <div className="p-4 text-center text-slate-500 text-sm">No language found.</div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
