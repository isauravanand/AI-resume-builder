import React from 'react';
import { toast } from 'react-toastify';
import { Plus, X } from 'lucide-react';

const Step4Languages = React.forwardRef(({ formData, handleArrayInputChange, removeArrayItem, validationRules, setFormData }, ref) => {

    const validate = () => {
        const validLanguages = formData.languages.filter(l => l.trim().length > 0);
        const validInterests = formData.interests.filter(i => i.trim().length > 0);

        for (let lang of validLanguages) {
            if (!validationRules.language.validate(lang)) {
                toast.error(`Language: ${validationRules.language.error}`);
                return false;
            }
        }
        for (let interest of validInterests) {
            if (!validationRules.interest.validate(interest)) {
                toast.error(`Interest: ${validationRules.interest.error}`);
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
            <h2 className="text-2xl font-bold text-white mb-8">Languages & Interests</h2>

            <div>
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-bold text-white">Languages</h3>
                    <button
                        onClick={() => setFormData((prev) => ({ ...prev, languages: [...prev.languages, ""] }))}
                        className="flex items-center gap-2 px-3 py-1 bg-purple-600 hover:bg-purple-700 text-white text-sm rounded-lg transition"
                    >
                        <Plus size={16} /> Add Language
                    </button>
                </div>
                <div className="grid md:grid-cols-3 gap-4">
                    {formData.languages.map((lang, idx) => (
                        <div key={idx} className="relative">
                            <input
                                type="text"
                                value={lang}
                                onChange={(e) => handleArrayInputChange("languages", idx, "", e.target.value)}
                                className="w-full px-4 py-2 bg-white/5 border border-white/20 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 transition"
                                placeholder="e.g., English"
                            />
                            {formData.languages.length > 1 && (
                                <button
                                    onClick={() => removeArrayItem("languages", idx)}
                                    className="absolute right-3 top-2 text-red-500 hover:text-red-400"
                                >
                                    <X size={18} />
                                </button>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            <div>
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-bold text-white">Interests</h3>
                    <button
                        onClick={() => setFormData((prev) => ({ ...prev, interests: [...prev.interests, ""] }))}
                        className="flex items-center gap-2 px-3 py-1 bg-purple-600 hover:bg-purple-700 text-white text-sm rounded-lg transition"
                    >
                        <Plus size={16} /> Add Interest
                    </button>
                </div>
                <div className="grid md:grid-cols-3 gap-4">
                    {formData.interests.map((interest, idx) => (
                        <div key={idx} className="relative">
                            <input
                                type="text"
                                value={interest}
                                onChange={(e) => handleArrayInputChange("interests", idx, "", e.target.value)}
                                className="w-full px-4 py-2 bg-white/5 border border-white/20 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 transition"
                                placeholder="e.g., Reading"
                            />
                            {formData.interests.length > 1 && (
                                <button
                                    onClick={() => removeArrayItem("interests", idx)}
                                    className="absolute right-3 top-2 text-red-500 hover:text-red-400"
                                >
                                    <X size={18} />
                                </button>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
});

export default Step4Languages;