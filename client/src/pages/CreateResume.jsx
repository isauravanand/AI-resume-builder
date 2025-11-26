import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { createResume } from "../api/resumeApi";

// Imported Step Components
import Navbar from "../components/UserInterface/Navbar";
import Background from "../components/UserInterface/Background";
import Footer from "../components/UserInterface/Footer";
import StepIndicator from "../components/Resume/StepIndicator";
import Step1Contact from "../components/Resume/Step1Contact";
import Step2Professional from "../components/Resume/Step2Professional";
import Step3Experience from "../components/Resume/Step3Experience";
import Step4Languages from "../components/Resume/Step4Languages";


const CreateResume = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  const stepRef = useRef({});

  const [formData, setFormData] = useState({
    fullname: "",
    email: "",
    phone: "",
    linkedin: "",
    github: "",
    portfolio: "",
    profileSummary: "",
    education: [{ degree: "", institution: "", startYear: "", endYear: "", percentage: "" }],
    technicalSkills: ["", ""],
    workExperience: [{ company: "", position: "", startDate: "", endDate: "", description: "" }],
    projects: [{ title: "", description: "", technologies: [], link: "", githubLink: "" }],
    certifications: [{ title: "", organization: "", issueDate: "", credentialUrl: "" }],
    languages: ["English", ""],
    interests: ["", ""],
  });

  // Validation rules object derived from your Zod schemas
  const validationRules = {
    fullname: { validate: (val) => val.trim().length >= 3 && val.trim().length <= 100, error: "Full name is required (3-100 characters)" },
    email: { validate: (val) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val), error: "Enter a valid email" },
    phone: { validate: (val) => /^[0-9]{10}$/.test(val), error: "Phone number must be 10 digits" },
    linkedin: { validate: (val) => !val || (val && /^https?:\/\/.+/.test(val)), error: "Enter valid LinkedIn URL" },
    github: { validate: (val) => !val || (val && /^https?:\/\/.+/.test(val)), error: "Enter valid GitHub URL" },
    portfolio: { validate: (val) => !val || (val && /^https?:\/\/.+/.test(val)), error: "Enter valid portfolio URL" },
    profileSummary: { validate: (val) => val.trim().length >= 20 && val.trim().length <= 800, error: "Profile summary must be descriptive (20-800 characters)" },

    // Education (min 2, min 3, min 1900)
    degree: { validate: (val) => val.trim().length >= 2, error: "Degree is required (min 2 characters)" },
    institution: { validate: (val) => val.trim().length >= 3, error: "Institution is required (min 3 characters)" },
    startYear: { validate: (val) => { const year = parseInt(val); return year >= 1900 && year <= new Date().getFullYear(); }, error: "Enter a valid start year (1900-current)" },

    // Skills (min 2)
    skill: { validate: (val) => val.trim().length >= 2, error: "Skill name must be at least 2 characters" },

    // Work Experience (min 2 for company/position, Date required for startDate)
    company: { validate: (val) => val.trim().length >= 2, error: "Company name is required (min 2 characters)" },
    position: { validate: (val) => val.trim().length >= 2, error: "Position is required (min 2 characters)" },
    startDate: { validate: (val) => val && !isNaN(Date.parse(val)), error: "Start date is required" },

    // Projects (min 2 for title, min 10 for description)
    projectTitle: { validate: (val) => val.trim().length >= 2, error: "Project title is required (min 2 characters)" },
    projectDescription: { validate: (val) => val.trim().length >= 10, error: "Description should be at least 10 characters" },

    // Certifications (min 3 for title)
    certTitle: { validate: (val) => val.trim().length >= 3, error: "Certificate title is required (min 3 characters)" },

    // Languages & Interests (min 2 for name)
    language: { validate: (val) => val.trim().length >= 2, error: "Language name is required (min 2 characters)" },
    interest: { validate: (val) => val.trim().length >= 2, error: "Interest name is required (min 2 characters)" },
  };

  // Input handlers
  const handleArrayInputChange = (arrayName, index, field, value) => {
    setFormData((prev) => {
      const updated = [...prev[arrayName]];
      if (field === "") {
        updated[index] = value;
      } else {
        updated[index] = { ...updated[index], [field]: value };
      }
      return { ...prev, [arrayName]: updated };
    });
  };

  const addArrayItem = (arrayName) => {
    setFormData((prev) => {
      const newItem =
        arrayName === "education" ? { degree: "", institution: "", startYear: "", endYear: "", percentage: "" }
          : arrayName === "workExperience" ? { company: "", position: "", startDate: "", endDate: "", description: "" }
            : arrayName === "projects" ? { title: "", description: "", technologies: [], link: "", githubLink: "" }
              : arrayName === "certifications" ? { title: "", organization: "", issueDate: "", credentialUrl: "" }
                : "";

      return { ...prev, [arrayName]: [...prev[arrayName], newItem] };
    });
  };

  const removeArrayItem = (arrayName, index) => {
    setFormData((prev) => ({
      ...prev,
      [arrayName]: prev[arrayName].filter((_, i) => i !== index),
    }));
  };


  const handleNext = () => {
    if (stepRef.current && stepRef.current.validate && stepRef.current.validate()) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    if (stepRef.current && stepRef.current.validate && stepRef.current.validate()) {
      try {
        setIsLoading(true);
        toast.info("Saving your resume...");

        const cleanedData = {
          ...formData,
          technicalSkills: formData.technicalSkills.filter(s => s.trim() !== ''),
          languages: formData.languages.filter(s => s.trim() !== ''),
          interests: formData.interests.filter(s => s.trim() !== ''),

          workExperience: formData.workExperience.filter(exp => exp.company.trim() || exp.position.trim()),
          projects: formData.projects.filter(proj => proj.title.trim()),
          certifications: formData.certifications.filter(cert => cert.title.trim()),

          linkedin: formData.linkedin || undefined,
          github: formData.github || undefined,
          portfolio: formData.portfolio || undefined,
        };

        const response = await createResume(cleanedData);
        toast.success("Resume saved!");
        const resumeId = response.data.resume._id;

        navigate(`/resume-preview/${resumeId}`);
      } catch (error) {
        let errorMessage = "An unexpected error occurred.";

        if (error.response && error.response.data && error.response.data.errors) {
          errorMessage = error.response.data.message || "Validation failed on the server.";
          toast.error(errorMessage);
          error.response.data.errors.forEach(err => {
            toast.warn(`Server: Field '${err.field}' - ${err.message}`, { autoClose: 7000 });
          });
        } else if (error.response && error.response.data && error.response.data.message) {
          errorMessage = error.response.data.message;
          toast.error(errorMessage);
        } else {
          toast.error("Network or server connection failed.");
        }

        console.error("Submission Error:", error);

      } finally {
        setIsLoading(false);
      }
    }
  };

  const renderStep = () => {
    const stepProps = {
      formData,
      setFormData,
      validationRules,
      handleArrayInputChange,
      removeArrayItem,
      addArrayItem,
      ref: stepRef,
    };

    switch (currentStep) {
      case 1:
        return <Step1Contact {...stepProps} />;
      case 2:
        return <Step2Professional {...stepProps} />;
      case 3:
        return <Step3Experience {...stepProps} />;
      case 4:
        return <Step4Languages {...stepProps} />;
      default:
        return <div>Error: Invalid Step</div>;
    }
  };

  return (
    <>
      <Background>
        <Navbar />
        <div className="pt-20 pb-12 px-4 md:px-8">
          <div className="max-w-5xl mx-auto">
            <StepIndicator currentStep={currentStep} />

            <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-8 mb-8">
              {renderStep()}
            </div>

            {/* Navigation */}
            <div className="flex justify-between items-center">
              <button
                onClick={handlePrevious}
                disabled={currentStep === 1}
                className={`px-6 py-2 rounded-lg font-semibold transition ${currentStep === 1
                  ? "bg-white/5 text-gray-500 cursor-not-allowed"
                  : "bg-white/10 text-white hover:bg-white/20"
                  }`}
              >
                Previous
              </button>

              <span className="text-gray-400">
                Step {currentStep} of 4
              </span>

              {currentStep === 4 ? (
                <button
                  onClick={handleSubmit}
                  disabled={isLoading}
                  className="px-8 py-2 rounded-lg font-semibold bg-gradient-to-r from-purple-600 to-indigo-600 text-white hover:shadow-lg hover:shadow-purple-500/50 transition disabled:opacity-50"
                >
                  {isLoading ? "Creating..." : "Create Resume"}
                </button>
              ) : (
                <button
                  onClick={handleNext}
                  className="px-8 py-2 rounded-lg font-semibold bg-gradient-to-r from-purple-600 to-indigo-600 text-white hover:shadow-lg hover:shadow-purple-500/50 transition"
                >
                  Next
                </button>
              )}
            </div>
          </div>
        </div>
      </Background>
    </>
  );
};

export default CreateResume;