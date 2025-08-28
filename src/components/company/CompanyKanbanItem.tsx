"use client";

import React, { useState } from 'react';
import { Building, AlertCircle, ChevronDown, ChevronRight } from 'lucide-react';
import { CompanyGroupProps } from '@/types';
import { CandidateCard } from '@/components/candidate';

const CompanyKanbanItem: React.FC<CompanyGroupProps> = ({ company, candidates, allCandidates = [], ...props }) => {
    const [isOpen, setIsOpen] = useState(false);
    const companyHasUndownloaded = candidates.some(c => c.timesheets.some(t => !t.downloaded));

    return (
        <div className={`bg-white rounded-xl shadow-md overflow-hidden ${companyHasUndownloaded ? 'ring-2 ring-red-400' : ''}`}>
            <button 
                onClick={() => setIsOpen(!isOpen)} 
                className="w-full flex items-center justify-between p-4 bg-slate-50 hover:bg-slate-100 transition-colors"
            >
                <div className="flex items-center">
                    <Building size={20} className="mr-3 text-slate-500" />
                    <h2 className="text-xl font-bold text-slate-800">{company}</h2>
                    <span className="ml-3 bg-slate-200 text-slate-600 text-xs font-semibold px-2 py-1 rounded-full">
                        {candidates.length} candidate(s)
                    </span>
                </div>
                <div className="flex items-center">
                    {companyHasUndownloaded && <AlertCircle size={20} className="text-red-500 mr-3" />}
                    {isOpen ? <ChevronDown size={24} className="text-slate-500" /> : <ChevronRight size={24} className="text-slate-500" />}
                </div>
            </button>
            {isOpen && (
                <div className="p-4 space-y-4">
                    {candidates.map(candidate => (
                        <CandidateCard 
                            key={candidate.id} 
                            candidate={candidate} 
                            allCandidates={allCandidates}
                            {...props} 
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

export default CompanyKanbanItem;