import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import  {getResumeById  }from "../api/resumeApi";
import{ generateAiResume}  from "../api/aiApi";
import Navbar from "../components/UserInterface/Navbar";

const ResumePreview = () => {
    const { resumeId } = useParams();
    const [selectedTemplate, setSelectedTemplate] = useState("executive");
    const [resume, setResume] = useState(null);
    const [loadingType, setLoadingType] = useState(null); 

    useEffect(() => {
        fetchResume();
    }, []);

    const fetchResume = async () => {
        try {
            const res = await getResumeById(resumeId);
            setResume(res.data.resume);
        } catch (err) {
            toast.error("Unable to load resume.");
        }
    };

    const handleGeneratePdf = async () => {
        if (!resume) {
            toast.error("Resume not loaded");
            return;
        }

        setLoadingType('pdf');
        try {
            const res = await generateAiResume(selectedTemplate, resume);

            const blob = new Blob([res.data], { type: "application/pdf" });
            const url = window.URL.createObjectURL(blob);

            const a = document.createElement("a");
            a.href = url;
            a.download = `${resume.fullname.replace(" ", "_")}_Resume.pdf`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);

            toast.success("AI Resume PDF Generated!");
        } catch (err) {
            console.error("AI Resume PDF Error:", err);
            toast.error("Failed to generate AI resume PDF");
        } finally {
            setLoadingType(null);
        }
    };

  


    if (!resume)
        return (
            <div className="min-h-screen bg-slate-900 text-white flex items-center justify-center">
                <p className="text-lg text-slate-400">Loading resume data...</p>
            </div>
        );

    const commonButtonClasses = `
        w-full px-8 py-3 rounded-md font-bold text-lg tracking-wide
        transition duration-200 shadow-lg disabled:bg-gray-600 disabled:shadow-none disabled:cursor-not-allowed
    `;

    const templates = ["modern", "creative", "executive"];

    return (
        <div className="min-h-screen bg-gradient-to-br from-black via-slate-900 to-black text-white">
            <Navbar />

            <main className="max-w-4xl mx-auto px-6 lg:px-8 pt-24 pb-20">
                {/* Heading */}
                <h1 className="text-4xl md:text-5xl font-extrabold mb-4 bg-gradient-to-r from-emerald-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
                    Review & Generate Resume
                </h1>
                <h2 className="text-xl font-medium text-slate-300 mb-10">
                    Finalize your details and select a template for file export.
                </h2>

                <div className="p-6 md:p-8 rounded-xl bg-slate-800 border border-slate-700 shadow-xl shadow-slate-900/50 mb-12">
                    <h3 className="text-xl font-semibold mb-4 text-emerald-400 border-b border-slate-700 pb-2">
                        Data Summary
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-slate-300">
                        <p className="border-l-2 border-emerald-500 pl-3"><strong>Name:</strong> {resume.fullname}</p>
                        <p className="border-l-2 border-blue-500 pl-3"><strong>Email:</strong> {resume.email}</p>
                        <p className="border-l-2 border-purple-500 pl-3"><strong>Phone:</strong> {resume.phone}</p>

                        <p className="col-span-full pt-2">
                            <strong>Skills:</strong>{" "}
                            <span className="text-sm text-slate-400">
                                {resume.technicalSkills.join(" | ")}
                            </span>
                        </p>
                    </div>
                </div>

                <h2 className="text-2xl font-semibold mb-5 text-white">
                 Choose Design Template
                </h2>
                <div className="flex flex-wrap gap-5 mb-10">
                    {templates.map((tpl) => (
                        <div
                            key={tpl}
                            className={`
                                p-5 rounded-lg border-2 cursor-pointer w-full sm:w-32 text-center
                                transition duration-200 
                                ${selectedTemplate === tpl
                                    ? "border-emerald-500 bg-emerald-500/10 shadow-lg"
                                    : "border-slate-700 bg-slate-800 hover:border-slate-500"
                                }
                            `}
                            onClick={() => setSelectedTemplate(tpl)}
                        >
                            <p className="font-bold text-lg capitalize tracking-wide text-white">
                                {tpl}
                            </p>
                            <p className="text-sm text-slate-400 mt-1">Style</p>
                        </div>
                    ))}
                </div>

                {/* --- Generate Buttons Group --- */}
                <h2 className="text-2xl font-semibold mb-5 text-white">
                     Download
                </h2>
                <div className="flex flex-col md:flex-row gap-4">

                    <button
                        onClick={handleGeneratePdf}
                        disabled={loadingType !== null}
                        className={`
                            ${commonButtonClasses}
                            bg-emerald-500 text-white shadow-emerald-500/50 hover:bg-emerald-600
                            md:w-80
                        `}
                    >
                        {loadingType === 'pdf' ? (
                            <span className="flex items-center justify-center">
                                {/* AI-themed spinner and text */}
                                <svg className="animate-spin -ml-1 mr-3 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" strokeLinecap="round"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                <span className="bg-gradient-to-r from-purple-300 to-white bg-clip-text text-transparent font-extrabold">
                                    Generating AI Resume
                                </span>
                            </span>
                        ) : (
                            "AI Generate & Download"
                        )}
                    </button>


                </div>

            </main>
        </div>
    );
};

export default ResumePreview;