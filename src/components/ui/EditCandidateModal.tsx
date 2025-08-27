"use client";

import React, { useState } from 'react';
import { EditCandidateModalProps } from '@/types';

const EditCandidateModal: React.FC<EditCandidateModalProps> = ({ candidate, onClose, onEditCandidate }) => {
    const [name, setName] = useState(candidate.name);
    const [company, setCompany] = useState(candidate.company);
    const [email, setEmail] = useState(candidate.email);
    const [contactNumber, setContactNumber] = useState(candidate.contactNumber);
    const [manager, setManager] = useState(candidate.manager);
    const [employeeId, setEmployeeId] = useState(candidate.employeeId);

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        onEditCandidate({ name, company, email, contactNumber, manager, employeeId });
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-2xl p-8 w-full max-w-2xl m-4 max-h-[90vh] overflow-y-auto">
                <h2 className="text-2xl font-bold mb-6">Edit Employee</h2>
                <form onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 space-y-0">
                        <div>
                            <label htmlFor="edit-name" className="block text-sm font-medium text-slate-700 mb-1">Employee Name</label>
                            <input 
                                type="text" 
                                id="edit-name" 
                                value={name} 
                                onChange={(e) => setName(e.target.value)} 
                                className="w-full form-input px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500" 
                                required 
                            />
                        </div>
                        <div>
                            <label htmlFor="edit-company" className="block text-sm font-medium text-slate-700 mb-1">Company</label>
                            <input 
                                type="text" 
                                id="edit-company" 
                                value={company} 
                                onChange={(e) => setCompany(e.target.value)} 
                                className="w-full form-input px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500" 
                                required 
                            />
                        </div>
                        <div>
                            <label htmlFor="edit-email" className="block text-sm font-medium text-slate-700 mb-1">Employee Email Address</label>
                            <input 
                                type="email" 
                                id="edit-email" 
                                value={email} 
                                onChange={(e) => setEmail(e.target.value)} 
                                className="w-full form-input px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500" 
                                required 
                            />
                        </div>
                        <div>
                            <label htmlFor="edit-contactNumber" className="block text-sm font-medium text-slate-700 mb-1">Employee Contact Number</label>
                            <input 
                                type="tel" 
                                id="edit-contactNumber" 
                                value={contactNumber} 
                                onChange={(e) => setContactNumber(e.target.value)} 
                                className="w-full form-input px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500" 
                                required 
                            />
                        </div>
                        <div>
                            <label htmlFor="edit-manager" className="block text-sm font-medium text-slate-700 mb-1">Manager</label>
                            <input 
                                type="text" 
                                id="edit-manager" 
                                value={manager} 
                                onChange={(e) => setManager(e.target.value)} 
                                className="w-full form-input px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500" 
                                required 
                            />
                        </div>
                        <div>
                            <label htmlFor="edit-employeeId" className="block text-sm font-medium text-slate-700 mb-1">Employee ID Number</label>
                            <input 
                                type="text" 
                                id="edit-employeeId" 
                                value={employeeId} 
                                onChange={(e) => setEmployeeId(e.target.value)} 
                                className="w-full form-input px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500" 
                                required 
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
                            Update Employee
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditCandidateModal;