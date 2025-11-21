import api from "./axios";

export const generateAiResume = (template, resumeData) =>
    api.post(
        `/ai/generate-resume`,
        { template, resumeData },
        { responseType: "blob" }
    );
