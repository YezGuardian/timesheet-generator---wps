"use client";

import React from 'react';
import { Search, Filter } from 'lucide-react';
import { Candidate, Timesheet } from '@/types';

interface SearchBarProps {
    searchQuery: string;
    setSearchQuery: (query: string) => void;
    statusFilter: string;
    setStatusFilter: (status: string) => void;
    monthFilter: string;
    setMonthFilter: (month: string) => void;
    candidates: Candidate[];
}

const SearchBar: React.FC<SearchBarProps> = ({ 
    searchQuery, 
    setSearchQuery, 
    statusFilter, 
    setStatusFilter, 
    monthFilter, 
    setMonthFilter, 
    candidates 
}) => {

    const availableMonths = React.useMemo(() => {
        const months = new Set<string>();
        candidates.forEach(candidate => {
            candidate.timesheets.forEach((timesheet: Timesheet) => {
                const monthKey = timesheet.periodEnding.substring(0, 7); // YYYY-MM
                months.add(monthKey);
            });
        });
        return Array.from(months).sort().reverse();
    }, [candidates]);

    return (
        <div className="mb-4 p-4 bg-white rounded-lg shadow-sm">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="md:col-span-2 relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                    <input
                        type="text"
                        placeholder="Search by candidate name, email, or company..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    />
                </div>
                <div className="relative">
                    <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    >
                        <option value="">All Statuses</option>
                        <option value="uploaded">Uploaded</option>
                        <option value="downloaded">Downloaded</option>
                        <option value="pending">Pending</option>
                    </select>
                </div>
                <div className="relative">
                    <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                    <select
                        value={monthFilter}
                        onChange={(e) => setMonthFilter(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    >
                        <option value="">All Months</option>
                        {availableMonths.map(month => (
                            <option key={month} value={month}>{month}</option>
                        ))}
                    </select>
                </div>
            </div>
        </div>
    );
};

export default SearchBar;
