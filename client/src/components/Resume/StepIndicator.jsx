import React from 'react';

const StepIndicator = ({ currentStep }) => {
    const steps = [
        { num: 1, label: "Contact" },
        { num: 2, label: "Professional" },
        { num: 3, label: "Experience" },
        { num: 4, label: "Languages" },
    ];
    return (
        <div className="mb-12">
            <div className="flex justify-between items-center">
                {steps.map((step, idx) => (
                    <div key={step.num} className="flex items-center flex-1">
                        <div
                            className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-all ${step.num <= currentStep
                                    ? "bg-gradient-to-r from-purple-600 to-indigo-600 text-white"
                                    : "bg-white/10 text-gray-400"
                                }`}
                        >
                            {step.num}
                        </div>
                        <span
                            className={`ml-2 text-sm transition-all ${step.num <= currentStep ? "text-white" : "text-gray-400"
                                }`}
                        >
                            {step.label}
                        </span>
                        {idx < steps.length - 1 && (
                            <div
                                className={`flex-1 h-1 mx-4 rounded transition-all ${step.num < currentStep
                                        ? "bg-gradient-to-r from-purple-600 to-indigo-600"
                                        : "bg-white/10"
                                    }`}
                            />
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default StepIndicator;