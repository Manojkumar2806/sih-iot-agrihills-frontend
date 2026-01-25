import React, { useState, useEffect, useCallback } from 'react';
import { Search, Filter, ChevronLeft, ChevronRight, RefreshCw, AlertCircle, ShoppingBag, MapPin, Tag, Info } from 'lucide-react';

interface MarketRecord {
    state: string;
    district: string;
    market: string;
    commodity: string;
    variety: string;
    grade: string;
    arrival_date: string;
    min_price: number;
    max_price: number;
    modal_price: number;
}

interface ApiResponse {
    records: MarketRecord[];
    total: number;
    count: number;
    limit: string;
    offset: string;
}

const INDIAN_STATES = [
    "Andaman and Nicobar", "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar",
    "Chandigarh", "Chattisgarh", "Dadra and Nagar Haveli", "Daman and Diu", "Delhi",
    "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jammu and Kashmir", "Jharkhand",
    "Karnataka", "Kerala", "Lakhshadweep", "Madhya Pradesh", "Maharashtra", "Manipur",
    "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Puducherry", "Punjab", "Rajasthan",
    "Sikkim", "Tamil Nadu", "Telangana", "Tripura", "Uttar Pradesh", "Uttrakhand", "West Bengal"
];

const POPULAR_VEGETABLES = ["Tomato", "Potato", "Onion", "Brinjal", "Cauliflower", "Cabbage", "Ginger", "Chili", "Garlic"];

const MarketPrices: React.FC = () => {
    const [records, setRecords] = useState<MarketRecord[]>([]);
    const [loading, setLoading] = useState(true);
    const [districtsLoading, setDistrictsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [totalRecords, setTotalRecords] = useState(0);
    const [offset, setOffset] = useState(0);
    const [availableDistricts, setAvailableDistricts] = useState<string[]>([]);
    const limit = 10;
    const startIndex = offset;

    const apiKey = '579b464db66ec23bdd000001616a8e3565db4d8b5f203ccb7b5559f7';

    // Filters State
    const [filters, setFilters] = useState({
        state: '',
        district: '',
        market: '',
        commodity: '',
        variety: '',
        grade: '',
    });

    const fetchData = useCallback(async (currentOffset: number) => {
        setLoading(true);
        setError(null);
        try {
            let url = `https://api.data.gov.in/resource/9ef84268-d588-465a-a308-a864a43d0070?api-key=${apiKey}&format=json&limit=${limit}&offset=${currentOffset}`;

            if (filters.state) url += `&filters[state.keyword]=${encodeURIComponent(filters.state)}`;
            if (filters.district) url += `&filters[district]=${encodeURIComponent(filters.district)}`;
            if (filters.market) url += `&filters[market]=${encodeURIComponent(filters.market)}`;
            if (filters.commodity) url += `&filters[commodity]=${encodeURIComponent(filters.commodity)}`;
            if (filters.variety) url += `&filters[variety]=${encodeURIComponent(filters.variety)}`;
            if (filters.grade) url += `&filters[grade]=${encodeURIComponent(filters.grade)}`;

            const response = await fetch(url);
            if (!response.ok) throw new Error('Failed to fetch market data');

            const data: ApiResponse = await response.json();
            setRecords(data.records || []);
            setTotalRecords(data.total || 0);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An error occurred while fetching data');
        } finally {
            setLoading(false);
        }
    }, [filters, apiKey, limit]);

    useEffect(() => {
        const fetchDistricts = async () => {
            if (!filters.state) {
                setAvailableDistricts([]);
                return;
            }

            setDistrictsLoading(true);
            try {
                const url = `https://api.data.gov.in/resource/9ef84268-d588-465a-a308-a864a43d0070?api-key=${apiKey}&format=json&limit=1000&filters[state.keyword]=${encodeURIComponent(filters.state)}`;
                const response = await fetch(url);
                if (response.ok) {
                    const data: ApiResponse = await response.json();
                    const uniqueDistricts = Array.from(new Set((data.records || []).map(r => r.district))).sort();
                    setAvailableDistricts(uniqueDistricts);
                }
            } catch (err) {
                console.error('Error fetching districts:', err);
            } finally {
                setDistrictsLoading(false);
            }
        };

        fetchDistricts();
    }, [filters.state, apiKey]);

    useEffect(() => {
        fetchData(offset);
    }, [fetchData, offset]);

    const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFilters(prev => {
            const newFilters = { ...prev, [name]: value };
            if (name === 'state') newFilters.district = '';
            return newFilters;
        });
        setOffset(0);
    };

    const setCommodity = (commodity: string) => {
        setFilters(prev => ({ ...prev, commodity: prev.commodity === commodity ? '' : commodity }));
        setOffset(0);
    };

    const resetFilters = () => {
        setFilters({
            state: '',
            district: '',
            market: '',
            commodity: '',
            variety: '',
            grade: '',
        });
        setOffset(0);
    };

    return (
        <div className="min-h-screen pt-20 px-4 sm:px-6 lg:px-8 bg-slate-900 pb-12">
            <div className="max-w-7xl mx-auto">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-white mb-2 mt-8">Real-time Market Prices</h1>
                        <p className="text-gray-400">Live prices from Indian Mandis per Quintal (100 Kg)</p>
                    </div>
                    <div className="flex gap-2">
                        <button
                            onClick={() => fetchData(offset)}
                            className="flex items-center gap-2 bg-slate-700 hover:bg-slate-600 px-4 py-2 rounded-lg text-white transition-colors border border-slate-600"
                        >
                            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                            Refresh
                        </button>
                        <button
                            onClick={resetFilters}
                            className="px-4 py-2 bg-slate-700/50 hover:bg-slate-700 px-4 py-2 rounded-lg text-gray-300 transition-colors border border-slate-600"
                        >
                            Reset
                        </button>
                    </div>
                </div>

                {/* Filters Section */}
                <div className="bg-gradient-to-br from-slate-800/30 to-slate-900/30 p-6 rounded-xl border border-cyan-500/10 mb-6 space-y-4">
                    {/* Commodity Search & Chips */}
                    <div className="space-y-4">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                            <input
                                type="text"
                                name="commodity"
                                placeholder="Search commodity (e.g. Tomato, Ginger)..."
                                value={filters.commodity}
                                onChange={handleFilterChange}
                                className="pl-11 pr-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 w-full"
                            />
                        </div>
                        <div className="flex flex-wrap items-center gap-2">
                            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Quick Select:</span>
                            {POPULAR_VEGETABLES.map(veg => (
                                <button
                                    key={veg}
                                    onClick={() => setCommodity(veg)}
                                    className={`px-3 py-1 rounded-full text-xs transition-all border ${filters.commodity === veg
                                        ? 'bg-cyan-500 border-cyan-400 text-slate-900 font-bold'
                                        : 'bg-slate-700 border-slate-600 text-gray-400 hover:border-cyan-500/50 hover:text-cyan-400'
                                        }`}
                                >
                                    {veg}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="h-px bg-slate-700 my-4" />

                    {/* Detailed Filters Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
                        <div className="space-y-1">
                            <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest flex items-center gap-1">
                                <MapPin className="h-3 w-3" /> State
                            </label>
                            <select
                                name="state"
                                value={filters.state}
                                onChange={handleFilterChange}
                                className="w-full bg-slate-700 border border-slate-600 rounded-lg py-2 px-3 text-sm text-white focus:outline-none focus:border-cyan-500 transition-colors"
                            >
                                <option value="">All States</option>
                                {INDIAN_STATES.map(s => <option key={s} value={s}>{s}</option>)}
                            </select>
                        </div>

                        <div className="space-y-1">
                            <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest flex items-center gap-1">
                                <Filter className={`h-3 w-3 ${districtsLoading ? 'animate-spin' : ''}`} /> District
                            </label>
                            <select
                                name="district"
                                value={filters.district}
                                onChange={handleFilterChange}
                                disabled={!filters.state || districtsLoading}
                                className="w-full bg-slate-700 border border-slate-600 rounded-lg py-2 px-3 text-sm text-white focus:outline-none focus:border-cyan-500 transition-colors disabled:opacity-40"
                            >
                                <option value="">{districtsLoading ? 'Loading...' : 'All Districts'}</option>
                                {availableDistricts.map(d => <option key={d} value={d}>{d}</option>)}
                            </select>
                        </div>

                        <div className="space-y-1">
                            <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest flex items-center gap-1">
                                <ShoppingBag className="h-3 w-3" /> Market
                            </label>
                            <input
                                type="text"
                                name="market"
                                placeholder="ex: Sonari APMC"
                                value={filters.market}
                                onChange={handleFilterChange}
                                className="w-full bg-slate-700 border border-slate-600 rounded-lg py-2 px-3 text-sm text-white focus:outline-none focus:border-cyan-500 transition-colors"
                            />
                        </div>

                        <div className="space-y-1">
                            <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest flex items-center gap-1">
                                <Tag className="h-3 w-3" /> Variety
                            </label>
                            <input
                                type="text"
                                name="variety"
                                placeholder="ex: Hybrid, Desi"
                                value={filters.variety}
                                onChange={handleFilterChange}
                                className="w-full bg-slate-700 border border-slate-600 rounded-lg py-2 px-3 text-sm text-white focus:outline-none focus:border-cyan-500 transition-colors"
                            />
                        </div>

                        <div className="space-y-1">
                            <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest flex items-center gap-1">
                                <Info className="h-3 w-3" /> Grade
                            </label>
                            <input
                                type="text"
                                name="grade"
                                placeholder="ex: FAQ, Medium"
                                value={filters.grade}
                                onChange={handleFilterChange}
                                className="w-full bg-slate-700 border border-slate-600 rounded-lg py-2 px-3 text-sm text-white focus:outline-none focus:border-cyan-500 transition-colors"
                            />
                        </div>
                    </div>
                </div>

                {/* Table Section */}
                <div className="bg-gradient-to-br from-slate-800/30 to-slate-900/30 rounded-xl border border-cyan-500/10 overflow-hidden relative min-h-[400px]">
                    {loading && (
                        <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm z-10 flex flex-col items-center justify-center">
                            <div className="h-10 w-10 border-4 border-cyan-500/20 border-t-cyan-500 rounded-full animate-spin mb-3"></div>
                            <p className="text-cyan-400 text-sm font-medium">Fetching Records...</p>
                        </div>
                    )}

                    {error && (
                        <div className="p-12 text-center">
                            <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
                            <h3 className="text-lg font-bold text-white mb-2">Sync Error</h3>
                            <p className="text-gray-400 mb-6">{error}</p>
                            <button onClick={() => fetchData(offset)} className="px-6 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 rounded-lg">Retry</button>
                        </div>
                    )}

                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-slate-800/50 border-b border-slate-700">
                                <tr>
                                    <th className="px-6 py-4 text-xs font-bold text-cyan-400 uppercase tracking-wider">Commodity</th>
                                    <th className="px-6 py-4 text-xs font-bold text-cyan-400 uppercase tracking-wider">Variety / Grade</th>
                                    <th className="px-6 py-4 text-xs font-bold text-cyan-400 uppercase tracking-wider">Mandi Location</th>
                                    <th className="px-6 py-4 text-xs font-bold text-cyan-400 uppercase tracking-wider">Arrival Date</th>
                                    <th className="px-6 py-4 text-xs font-bold text-cyan-400 uppercase tracking-wider text-right">Min/Max Price</th>
                                    <th className="px-6 py-4 text-xs font-bold text-cyan-400 uppercase tracking-wider text-right">Modal Price</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-700">
                                {!loading && records.length === 0 && !error ? (
                                    <tr>
                                        <td colSpan={6} className="px-6 py-12 text-center text-gray-500 font-medium italic">
                                            No records match your current filters.
                                        </td>
                                    </tr>
                                ) : (
                                    records.map((record, idx) => (
                                        <tr key={`${record.market}-${record.commodity}-${idx}`} className="hover:bg-slate-800/30 transition-colors group">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className="font-bold text-white group-hover:text-cyan-400 transition-colors uppercase">
                                                    {record.commodity}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm text-gray-300">{record.variety}</div>
                                                <div className="text-[10px] text-gray-500 font-bold uppercase">{record.grade}</div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm text-gray-200 font-medium">{record.market}</div>
                                                <div className="text-xs text-cyan-500/60 font-semibold">{record.district}, {record.state}</div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400 font-mono">
                                                {record.arrival_date}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right">
                                                <div className="inline-grid grid-cols-1 gap-1.5">
                                                    <div className="bg-slate-800/80 px-2 py-0.5 rounded border-l-2 border-red-500 flex items-center justify-between gap-4">
                                                        <span className="text-[9px] text-gray-400 font-black uppercase tracking-widest">Min</span>
                                                        <span className="text-[13px] font-mono font-bold text-white">₹{record.min_price}</span>
                                                    </div>
                                                    <div className="bg-slate-800/80 px-2 py-0.5 rounded border-l-2 border-emerald-500 flex items-center justify-between gap-4">
                                                        <span className="text-[9px] text-gray-400 font-black uppercase tracking-widest">Max</span>
                                                        <span className="text-[13px] font-mono font-bold text-white">₹{record.max_price}</span>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right">
                                                <div className="inline-block px-3 py-1 bg-cyan-500/10 border border-cyan-500/20 rounded-md text-cyan-400 font-bold font-mono text-base">
                                                    ₹{record.modal_price}
                                                </div>
                                                <div className="text-[8px] font-bold text-gray-600 mt-1 uppercase">PER QUINTAL</div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    <div className="bg-slate-800/30 px-6 py-4 border-t border-slate-700 flex flex-col sm:flex-row items-center justify-between gap-4">
                        <div className="text-sm text-gray-400 font-medium">
                            Showing <span className="text-white">{startIndex + 1}</span> to <span className="text-white">{Math.min(startIndex + records.length, totalRecords)}</span> of <span className="text-cyan-400 font-bold">{totalRecords.toLocaleString()}</span> entries
                        </div>
                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => setOffset(Math.max(0, offset - limit))}
                                disabled={offset === 0 || loading}
                                className="px-3 py-1.5 bg-slate-700 hover:bg-slate-600 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg text-sm text-white transition-colors border border-slate-600"
                            >
                                <ChevronLeft className="h-4 w-4" />
                            </button>
                            <div className="px-3 py-1 bg-slate-950/20 border border-white/5 rounded-md text-sm text-gray-400 font-semibold">
                                {Math.floor(offset / limit) + 1} / {Math.ceil(totalRecords / limit)}
                            </div>
                            <button
                                onClick={() => setOffset(offset + limit)}
                                disabled={offset + limit >= totalRecords || loading}
                                className="px-3 py-1.5 bg-slate-700 hover:bg-slate-600 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg text-sm text-white transition-colors border border-slate-600"
                            >
                                <ChevronRight className="h-4 w-4" />
                            </button>
                        </div>
                    </div>
                </div>

                <div className="mt-8 flex items-center justify-center gap-2 text-[10px] font-bold text-gray-600 uppercase tracking-widest text-center">
                    <Info className="h-3 w-3" /> Data provided by Ministry of Agriculture and Farmers Welfare (Data.gov.in)
                </div>
            </div>
        </div>
    );
};

export default MarketPrices;
