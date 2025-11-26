import React from 'react';
import { toast } from 'react-toastify';

const Step1Contact = React.forwardRef(({ formData, validationRules, setFormData }, ref) => {

    const handleBasicInputChange = (field, value) => {
        setFormData((prev) => ({
            ...prev,
            [field]: value,
        }));
    };

    const validate = () => {
        const { fullname, email, phone, linkedin, github, portfolio } = formData;

        if (!validationRules.fullname.validate(fullname)) {
            toast.error(validationRules.fullname.error);
            return false;
        }
        if (!validationRules.email.validate(email)) {
            toast.error(validationRules.email.error);
            return false;
        }
        // Zod Phone: regex(/^[0-9]{10}$/, "Phone number must be 10 digits")
        if (!validationRules.phone.validate(phone)) {
            toast.error(validationRules.phone.error);
            return false;
        }
        // Zod URL check only if value is NOT empty (to pass optional/or(z.literal("")) check)
        if (linkedin && !validationRules.linkedin.validate(linkedin)) {
            toast.error(validationRules.linkedin.error);
            return false;
        }
        if (github && !validationRules.github.validate(github)) {
            toast.error(validationRules.github.error);
            return false;
        }
        if (portfolio && !validationRules.portfolio.validate(portfolio)) {
            toast.error(validationRules.portfolio.error);
            return false;
        }
        return true;
    };

    // Expose validation function to parent
    React.useImperativeHandle(ref, () => ({
        validate: validate
    }));

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold text-white mb-8">Contact Information</h2>
            <div className="grid md:grid-cols-2 gap-6">
                <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Full Name *</label>
                    <input
                        type="text"
                        value={formData.fullname}
                        onChange={(e) => handleBasicInputChange("fullname", e.target.value)}
                        className="w-full px-4 py-2 bg-white/5 border border-white/20 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 focus:bg-white/10 transition"
                        placeholder="Your name"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Email *</label>
                    <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => handleBasicInputChange("email", e.target.value)}
                        className="w-full px-4 py-2 bg-white/5 border border-white/20 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 focus:bg-white/10 transition"
                        placeholder="you@example.com"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Phone (10 digits) *</label>
                    <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => handleBasicInputChange("phone", e.target.value)}
                        className="w-full px-4 py-2 bg-white/5 border border-white/20 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 focus:bg-white/10 transition"
                        placeholder="1234567890"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">LinkedIn URL</label>
                    <input
                        type="url"
                        value={formData.linkedin}
                        onChange={(e) => handleBasicInputChange("linkedin", e.target.value)}
                        className="w-full px-4 py-2 bg-white/5 border border-white/20 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 focus:bg-white/10 transition"
                        placeholder="https://linkedin.com/in/..."
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">GitHub URL</label>
                    <input
                        type="url"
                        value={formData.github}
                        onChange={(e) => handleBasicInputChange("github", e.target.value)}
                        className="w-full px-4 py-2 bg-white/5 border border-white/20 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 focus:bg-white/10 transition"
                        placeholder="https://github.com/..."
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Portfolio URL</label>
                    <input
                        type="url"
                        value={formData.portfolio}
                        onChange={(e) => handleBasicInputChange("portfolio", e.target.value)}
                        className="w-full px-4 py-2 bg-white/5 border border-white/20 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 focus:bg-white/10 transition"
                        placeholder="https://portfolio.com"
                    />
                </div>
            </div>
        </div>
    );
});

export default Step1Contact;