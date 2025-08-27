"use client";

import React from 'react';
import { Plus } from 'lucide-react';
import { HeaderProps } from '@/types';

const Header: React.FC<HeaderProps> = ({ onAddCandidate }) => (
    <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 pb-4 border-b border-slate-200">
        <div>
            <h1 className="text-3xl font-bold text-slate-900">Timesheet Management</h1>
            <p className="text-slate-500 mt-1">Create and track weekly timesheets for your candidates.</p>
        </div>
        <button 
            onClick={onAddCandidate} 
            className="mt-4 sm:mt-0 flex items-center bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg shadow-md hover:bg-blue-700 transition-colors duration-200"
        >
            <Plus size={18} className="mr-2" />
            Add Candidate
        </button>
    </header>
);

export default Header;