import React from 'react';
import { toast } from 'react-toastify';
import { Plus, X } from 'lucide-react';

const Step3Experience = React.forwardRef(({ formData, handleArrayInputChange, removeArrayItem, addArrayItem, validationRules, setFormData }, ref) => {

    const validate = () => {
        const validSkills = formData.technicalSkills.filter((s) => s.trim().length > 0);
        if (validSkills.length === 0) {
            toast.error("At least one skill required");
            return false;
        }
        for (let skill of validSkills) {
            if (!validationRules.skill.validate(skill)) {
                toast.error(`Skill: ${validationRules.skill.error}`);
                return false;
            }
        }

        for (let work of formData.workExperience) {
            const hasAnyField = work.company?.trim() || work.position?.trim() || work.startDate;
            if (hasAnyField) { 
                if (!validationRules.company.validate(work.company)) {
                    toast.error(`Work Exp: ${validationRules.company.error}`);
                    return false;
                }
                if (!validationRules.position.validate(work.position)) {
                    toast.error(`Work Exp: ${validationRules.position.error}`);
                    return false;
                }
                if (!validationRules.startDate.validate(work.startDate)) {
                    toast.error(`Work Exp: ${validationRules.startDate.error}`);
                    return false;
                }
                if (work.description && work.description.length > 500) {
                    toast.error(`Work Exp: Description cannot exceed 500 characters`);
                    return false;
                }
            }
        }

        for (let proj of formData.projects) {
            const hasAnyField = proj.title?.trim() || proj.description?.trim();
            if (hasAnyField) {
                if (!validationRules.projectTitle.validate(proj.title)) {
                    toast.error(`Project: ${validationRules.projectTitle.error}`);
                    return false;
                }
                if (!validationRules.projectDescription.validate(proj.description)) {
                    toast.error(`Project: ${validationRules.projectDescription.error}`);
                    return false;
                }
                if (proj.link && !validationRules.linkedin.validate(proj.link)) { 
                    toast.error(`Project Link: Enter a valid URL`);
                    return false;
                }
            }
        }

        for (let cert of formData.certifications) {
            const hasAnyField = cert.title?.trim() || cert.organization?.trim() || cert.issueDate?.trim() || cert.credentialUrl?.trim();
            if (hasAnyField) { // Only validate required fields if the user started filling this entry
                if (!validationRules.certTitle.validate(cert.title)) {
                    toast.error(`Certification: ${validationRules.certTitle.error}`);
                    return false;
                }
                // Credential URL validation (only if value is present and not empty)
                if (cert.credentialUrl && !validationRules.linkedin.validate(cert.credentialUrl)) { // Reuse general URL rule
                    toast.error(`Certification URL: Provide a valid credential URL`);
                    return false;
                }
            }
        }

        return true;
    };

    React.useImperativeHandle(ref, () => ({
        validate: validate
    }));

    return (
        <div className="space-y-8">
            <h2 className="text-2xl font-bold text-white mb-8">Skills & Experience</h2>

            <div>
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-bold text-white">Technical Skills *</h3>
                    <button
                        onClick={() => setFormData((prev) => ({ ...prev, technicalSkills: [...prev.technicalSkills, ""] }))}
                        className="flex items-center gap-2 px-3 py-1 bg-purple-600 hover:bg-purple-700 text-white text-sm rounded-lg transition"
                    >
                        <Plus size={16} /> Add Skill
                    </button>
                </div>
                <div className="grid md:grid-cols-3 gap-4">
                    {formData.technicalSkills.map((skill, idx) => (
                        <div key={idx} className="relative">
                            <input
                                type="text"
                                value={skill}
                                onChange={(e) => handleArrayInputChange("technicalSkills", idx, "", e.target.value)}
                                className="w-full px-4 py-2 bg-white/5 border border-white/20 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 transition"
                                placeholder="e.g., React"
                            />
                            {formData.technicalSkills.length > 0 && (
                                <button
                                    onClick={() => removeArrayItem("technicalSkills", idx)}
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
                    <h3 className="text-xl font-bold text-white">Work Experience</h3>
                    <button
                        onClick={() => addArrayItem("workExperience")}
                        className="flex items-center gap-2 px-3 py-1 bg-purple-600 hover:bg-purple-700 text-white text-sm rounded-lg transition"
                    >
                        <Plus size={16} /> Add
                    </button>
                </div>
                <div className="space-y-6">
                    {formData.workExperience.map((work, idx) => (
                        <div key={idx} className="p-4 bg-white/5 rounded-lg border border-white/10">
                            <div className="flex justify-between items-center mb-4">
                                <h4 className="text-white font-medium">Work Experience #{idx + 1}</h4>
                                {formData.workExperience.length > 0 && (
                                    <button
                                        onClick={() => removeArrayItem("workExperience", idx)}
                                        className="text-red-500 hover:text-red-400 transition"
                                    >
                                        <X size={20} />
                                    </button>
                                )}
                            </div>
                            <div className="grid md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm text-gray-300 mb-1">Company * (Min 2 chars)</label>
                                    <input
                                        type="text"
                                        value={work.company}
                                        onChange={(e) => handleArrayInputChange("workExperience", idx, "company", e.target.value)}
                                        className="w-full px-3 py-2 bg-white/5 border border-white/20 rounded text-white text-sm focus:outline-none focus:border-purple-500 transition"
                                        placeholder="Company Name"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm text-gray-300 mb-1">Position * (Min 2 chars)</label>
                                    <input
                                        type="text"
                                        value={work.position}
                                        onChange={(e) => handleArrayInputChange("workExperience", idx, "position", e.target.value)}
                                        className="w-full px-3 py-2 bg-white/5 border border-white/20 rounded text-white text-sm focus:outline-none focus:border-purple-500 transition"
                                        placeholder="Job Title"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm text-gray-300 mb-1">Start Date *</label>
                                    <input
                                        type="date"
                                        value={work.startDate}
                                        onChange={(e) => handleArrayInputChange("workExperience", idx, "startDate", e.target.value)}
                                        className="w-full px-3 py-2 bg-white/5 border border-white/20 rounded text-white text-sm focus:outline-none focus:border-purple-500 transition"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm text-gray-300 mb-1">End Date</label>
                                    <input
                                        type="date"
                                        value={work.endDate}
                                        onChange={(e) => handleArrayInputChange("workExperience", idx, "endDate", e.target.value)}
                                        className="w-full px-3 py-2 bg-white/5 border border-white/20 rounded text-white text-sm focus:outline-none focus:border-purple-500 transition"
                                    />
                                </div>
                                <div className="md:col-span-2">
                                    <label className="block text-sm text-gray-300 mb-1">Description (Max 500 characters)</label>
                                    <textarea
                                        value={work.description}
                                        onChange={(e) => handleArrayInputChange("workExperience", idx, "description", e.target.value)}
                                        className="w-full px-3 py-2 bg-white/5 border border-white/20 rounded text-white text-sm focus:outline-none focus:border-purple-500 transition h-20"
                                        placeholder="Describe your responsibilities..."
                                        maxLength={500}
                                    />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div>
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-bold text-white">Projects</h3>
                    <button
                        onClick={() => addArrayItem("projects")}
                        className="flex items-center gap-2 px-3 py-1 bg-purple-600 hover:bg-purple-700 text-white text-sm rounded-lg transition"
                    >
                        <Plus size={16} /> Add
                    </button>
                </div>
                <div className="space-y-6">
                    {formData.projects.map((proj, idx) => (
                        <div key={idx} className="p-4 bg-white/5 rounded-lg border border-white/10">
                            <div className="flex justify-between items-center mb-4">
                                <h4 className="text-white font-medium">Project #{idx + 1}</h4>
                                {formData.projects.length > 0 && (
                                    <button
                                        onClick={() => removeArrayItem("projects", idx)}
                                        className="text-red-500 hover:text-red-400 transition"
                                    >
                                        <X size={20} />
                                    </button>
                                )}
                            </div>
                            <div className="grid md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm text-gray-300 mb-1">Title * (Min 2 chars)</label>
                                    <input
                                        type="text"
                                        value={proj.title}
                                        onChange={(e) => handleArrayInputChange("projects", idx, "title", e.target.value)}
                                        className="w-full px-3 py-2 bg-white/5 border border-white/20 rounded text-white text-sm focus:outline-none focus:border-purple-500 transition"
                                        placeholder="Project Name"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm text-gray-300 mb-1">Link</label>
                                    <input
                                        type="url"
                                        value={proj.link}
                                        onChange={(e) => handleArrayInputChange("projects", idx, "link", e.target.value)}
                                        className="w-full px-3 py-2 bg-white/5 border border-white/20 rounded text-white text-sm focus:outline-none focus:border-purple-500 transition"
                                        placeholder="https://..."
                                    />
                                </div>
                                <div className="md:col-span-2">
                                    <label className="block text-sm text-gray-300 mb-1">Description * (Min 10 chars)</label>
                                    <textarea
                                        value={proj.description}
                                        onChange={(e) => handleArrayInputChange("projects", idx, "description", e.target.value)}
                                        className="w-full px-3 py-2 bg-white/5 border border-white/20 rounded text-white text-sm focus:outline-none focus:border-purple-500 transition h-20"
                                        placeholder="Describe the project..."
                                    />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div>
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-bold text-white">Certifications</h3>
                    <button
                        onClick={() => addArrayItem("certifications")}
                        className="flex items-center gap-2 px-3 py-1 bg-purple-600 hover:bg-purple-700 text-white text-sm rounded-lg transition"
                    >
                        <Plus size={16} /> Add
                    </button>
                </div>
                <div className="space-y-6">
                    {formData.certifications.map((cert, idx) => (
                        <div key={idx} className="p-4 bg-white/5 rounded-lg border border-white/10">
                            <div className="flex justify-between items-center mb-4">
                                <h4 className="text-white font-medium">Certification #{idx + 1}</h4>
                                {formData.certifications.length > 0 && (
                                    <button
                                        onClick={() => removeArrayItem("certifications", idx)}
                                        className="text-red-500 hover:text-red-400 transition"
                                    >
                                        <X size={20} />
                                    </button>
                                )}
                            </div>
                            <div className="grid md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm text-gray-300 mb-1">Title * (Min 3 chars)</label>
                                    <input
                                        type="text"
                                        value={cert.title}
                                        onChange={(e) => handleArrayInputChange("certifications", idx, "title", e.target.value)}
                                        className="w-full px-3 py-2 bg-white/5 border border-white/20 rounded text-white text-sm focus:outline-none focus:border-purple-500 transition"
                                        placeholder="Certification Name"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm text-gray-300 mb-1">Organization</label>
                                    <input
                                        type="text"
                                        value={cert.organization}
                                        onChange={(e) => handleArrayInputChange("certifications", idx, "organization", e.target.value)}
                                        className="w-full px-3 py-2 bg-white/5 border border-white/20 rounded text-white text-sm focus:outline-none focus:border-purple-500 transition"
                                        placeholder="Issuing Organization"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm text-gray-300 mb-1">Issue Date</label>
                                    <input
                                        type="date"
                                        value={cert.issueDate}
                                        onChange={(e) => handleArrayInputChange("certifications", idx, "issueDate", e.target.value)}
                                        className="w-full px-3 py-2 bg-white/5 border border-white/20 rounded text-white text-sm focus:outline-none focus:border-purple-500 transition"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm text-gray-300 mb-1">Credential URL</label>
                                    <input
                                        type="url"
                                        value={cert.credentialUrl}
                                        onChange={(e) => handleArrayInputChange("certifications", idx, "credentialUrl", e.target.value)}
                                        className="w-full px-3 py-2 bg-white/5 border border-white/20 rounded text-white text-sm focus:outline-none focus:border-purple-500 transition"
                                        placeholder="https://..."
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

export default Step3Experience;