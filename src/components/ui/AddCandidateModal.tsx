"use client";

import React, { useState } from 'react';
import { AddCandidateModalProps } from '@/types';

const AddCandidateModal: React.FC<AddCandidateModalProps> = ({ onClose, onAddCandidate, candidates }) => {
    const [name, setName] = useState('');
    const [company, setCompany] = useState('');
    const [email, setEmail] = useState('');
    const [contactNumber, setContactNumber] = useState('');
    const [manager, setManager] = useState('');
    const [employeeId, setEmployeeId] = useState('');
    const [workingHours, setWorkingHours] = useState('08:00 - 16:00'); // New state for working hours

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        onAddCandidate({ name, company, email, contactNumber, manager, employeeId, workingHours });
        onClose();
    };

    const existingCompanies = Array.from(new Set(candidates.map(c => c.company)));

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-2xl p-8 w-full max-w-2xl m-4 max-h-[90vh] overflow-y-auto">
                <h2 className="text-2xl font-bold mb-6">Add New Employee</h2>
                <form onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 space-y-0">
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-slate-700 mb-1">Employee Name</label>
                            <input 
                                type="text" 
                                id="name" 
                                value={name} 
                                onChange={(e) => setName(e.target.value)} 
                                className="w-full form-input px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500" 
                                required 
                            />
                        </div>
                        <div>
                            <label htmlFor="company" className="block text-sm font-medium text-slate-700 mb-1">Company</label>
                            <input 
                                type="text" 
                                id="company" 
                                value={company} 
                                onChange={(e) => setCompany(e.target.value)} 
                                className="w-full form-input px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500" 
                                required 
                                list="company-list"
                            />
                            <datalist id="company-list">
                                {existingCompanies.map(comp => (
                                    <option key={comp} value={comp} />
                                ))}
                            </datalist>
                        </div>
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-1">Employee Email Address</label>
                            <input 
                                type="email" 
                                id="email" 
                                value={email} 
                                onChange={(e) => setEmail(e.target.value)} 
                                className="w-full form-input px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500" 
                                required 
                            />
                        </div>
                        <div>
                            <label htmlFor="contactNumber" className="block text-sm font-medium text-slate-700 mb-1">Employee Contact Number</label>
                            <input 
                                type="tel" 
                                id="contactNumber" 
                                value={contactNumber} 
                                onChange={(e) => setContactNumber(e.target.value)} 
                                className="w-full form-input px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500" 
                                required 
                            />
                        </div>
                        <div>
                            <label htmlFor="manager" className="block text-sm font-medium text-slate-700 mb-1">Manager</label>
                            <input 
                                type="text" 
                                id="manager" 
                                value={manager} 
                                onChange={(e) => setManager(e.target.value)} 
                                className="w-full form-input px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500" 
                                required 
                            />
                        </div>
                        <div>
                            <label htmlFor="employeeId" className="block text-sm font-medium text-slate-700 mb-1">Employee ID Number</label>
                            <input 
                                type="text" 
                                id="employeeId" 
                                value={employeeId} 
                                onChange={(e) => setEmployeeId(e.target.value)} 
                                className="w-full form-input px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500" 
                                required 
                            />
                        </div>
                        <div>
                            <label htmlFor="workingHours" className="block text-sm font-medium text-slate-700 mb-1">Working Hours</label>
                            <input 
                                type="text" 
                                id="workingHours" 
                                value={workingHours} 
                                onChange={(e) => setWorkingHours(e.target.value)} 
                                className="w-full form-input px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500" 
                                placeholder="e.g., 09:00 - 17:00"
                            />
                        </div>
                    </div>
                    <div className="flex justify-end gap-4 mt-8">
                        <button 
                            type="button" 
                            onClick={onClose} 
                            className="py-2 px-4 bg-slate-200 text-slate-800 font-semibold rounded-lg hover:bg-slate-300 transition-colors"
                        >
                            Cancel
                        </button>
                        <button 
                            type="submit" 
                            className="py-2 px-4 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
                        >
                            Add Employee
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddCandidateModal;