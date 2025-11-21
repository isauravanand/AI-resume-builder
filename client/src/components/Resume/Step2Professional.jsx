import React from 'react';
import { toast } from 'react-toastify';
import { Plus, X } from 'lucide-react';

const Step2Professional = React.forwardRef(({ formData, handleArrayInputChange, removeArrayItem, addArrayItem, validationRules, setFormData }, ref) => {

    const handleBasicInputChange = (field, value) => {
        setFormData((prev) => ({
            ...prev,
            [field]: value,
        }));
    };

    const validate = () => {
        if (!validationRules.profileSummary.validate(formData.profileSummary)) {
            toast.error(validationRules.profileSummary.error);
            return false;
        }

        const hasValidEducationEntry = formData.education.some(edu => edu.degree.trim() || edu.institution.trim());

        if (formData.education.length === 0 || !hasValidEducationEntry) {
            toast.error("At least one education entry required");
            return false;
        }

        for (let edu of formData.education) {
            if (!edu.degree && !edu.institution && !edu.startYear) continue;

            if (!validationRules.degree.validate(edu.degree)) {
                toast.error(`Education: ${validationRules.degree.error}`);
                return false;
            }
            if (!validationRules.institution.validate(edu.institution)) {
                toast.error(`Education: ${validationRules.institution.error}`);
                return false;
            }
            if (!validationRules.startYear.validate(edu.startYear)) {
                toast.error(`Education: ${validationRules.startYear.error}`);
                return false;
            }
        }
        return true;
    };

    React.useImperativeHandle(ref, () => ({
        validate: validate
    }));

    return (
        <div className="space-y-8">
            <div>
                <h2 className="text-2xl font-bold text-white mb-8">Professional Information</h2>
                <div className="mb-8">
                    <label className="block text-sm font-medium text-gray-300 mb-2">Profile Summary * (Min 20, Max 800)</label>
                    <textarea
                        value={formData.profileSummary}
                        onChange={(e) => handleBasicInputChange("profileSummary", e.target.value)}
                        className="w-full px-4 py-2 bg-white/5 border border-white/20 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 focus:bg-white/10 transition h-32"
                        placeholder="Write a brief professional summary (20-800 characters)"
                    />
                    <p className="text-xs text-gray-400 mt-1">{formData.profileSummary.length}/800 characters</p>
                </div>
            </div>

            <div>
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-bold text-white">Education *</h3>
                    <button
                        onClick={() => addArrayItem("education")}
                        className="flex items-center gap-2 px-3 py-1 bg-purple-600 hover:bg-purple-700 text-white text-sm rounded-lg transition"
                    >
                        <Plus size={16} /> Add
                    </button>
                </div>
                <div className="space-y-6">
                    {formData.education.map((edu, idx) => (
                        <div key={idx} className="p-4 bg-white/5 rounded-lg border border-white/10">
                            <div className="flex justify-between items-center mb-4">
                                <h4 className="text-white font-medium">Education #{idx + 1}</h4>
                                {formData.education.length > 0 && (
                                    <button
                                        onClick={() => removeArrayItem("education", idx)}
                                        className="text-red-500 hover:text-red-400 transition"
                                    >
                                        <X size={20} />
                                    </button>
                                )}
                            </div>
                            <div className="grid md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm text-gray-300 mb-1">Degree *</label>
                                    <input
                                        type="text"
                                        value={edu.degree}
                                        onChange={(e) => handleArrayInputChange("education", idx, "degree", e.target.value)}
                                        className="w-full px-3 py-2 bg-white/5 border border-white/20 rounded text-white text-sm focus:outline-none focus:border-purple-500 transition"
                                        placeholder="B.Tech"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm text-gray-300 mb-1">Institution *</label>
                                    <input
                                        type="text"
                                        value={edu.institution}
                                        onChange={(e) => handleArrayInputChange("education", idx, "institution", e.target.value)}
                                        className="w-full px-3 py-2 bg-white/5 border border-white/20 rounded text-white text-sm focus:outline-none focus:border-purple-500 transition"
                                        placeholder="University Name"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm text-gray-300 mb-1">Start Year * (Min 1900)</label>
                                    <input
                                        type="number"
                                        value={edu.startYear}
                                        onChange={(e) => handleArrayInputChange("education", idx, "startYear", e.target.value)}
                                        className="w-full px-3 py-2 bg-white/5 border border-white/20 rounded text-white text-sm focus:outline-none focus:border-purple-500 transition"
                                        placeholder="2020"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm text-gray-300 mb-1">End Year</label>
                                    <input
                                        type="number"
                                        value={edu.endYear}
                                        onChange={(e) => handleArrayInputChange("education", idx, "endYear", e.target.value)}
                                        className="w-full px-3 py-2 bg-white/5 border border-white/20 rounded text-white text-sm focus:outline-none focus:border-purple-500 transition"
                                        placeholder="2024"
                                    />
                                </div>
                                <div className="md:col-span-2">
                                    <label className="block text-sm text-gray-300 mb-1">Percentage/Grade</label>
                                    <input
                                        type="text"
                                        value={edu.percentage}
                                        onChange={(e) => handleArrayInputChange("education", idx, "percentage", e.target.value)}
                                        className="w-full px-3 py-2 bg-white/5 border border-white/20 rounded text-white text-sm focus:outline-none focus:border-purple-500 transition"
                                        placeholder="8.5 / 85%"
                                    />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
});

export default Step2Professional;