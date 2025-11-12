const Resume = require("../models/resume");
const { resumeSchema } = require("../validations/resumeValidation");

async function createResume(req, res) {
  try {
    const result = resumeSchema.safeParse(req.body);

    if (!result.success) {
      console.log("Validation Error:", result.error.errors);

      return res.status(400).json({
        success: false,
        message: "Validation error",
        errors: result.error.errors.map((err) => ({
          field: err.path.join("."),
          message: err.message,
        })),
      });
    }

    const {
      user,
      fullname,
      email,
      phone,
      linkedin,
      github,
      portfolio,
      profileSummary,
      education,
      technicalSkills,
      workExperience,
      projects,
      certifications,
      languages,
      interests,
    } = result.data;

    const newResume = await Resume.create({
      user,
      fullname,
      email,
      phone,
      linkedin,
      github,
      portfolio,
      profileSummary,
      education,
      technicalSkills,
      workExperience,
      projects,
      certifications,
      languages,
      interests,
    });

    return res.status(201).json({
      success: true,
      message: "Resume created successfully",
      resume: newResume,
    });
  } catch (error) {
    console.error("Resume Creation Error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
}

 
async function getResumeByUser(req, res) {
  try {
    const { userId } = req.params;

    const resume = await Resume.findOne({ user: userId });
    if (!resume) {
      return res.status(404).json({
        success: false,
        message: "Resume not found for this user",
      });
    }

    return res.status(200).json({
      success: true,
      resume,
    });
  } catch (error) {
    console.error("Get Resume Error:", error);
    return res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
}


async function updateResume(req, res) {
  try {
    const { id } = req.params;

    const result = resumeSchema.safeParse(req.body);

    if (!result.success) {
      return res.status(400).json({
        success: false,
        message: "Validation error",
        errors: result.error.errors.map((err) => ({
          field: err.path.join("."),
          message: err.message,
        })),
      });
    }

    const updatedResume = await Resume.findByIdAndUpdate(id, result.data, {
      new: true,
      runValidators: true,
    });

    if (!updatedResume) {
      return res.status(404).json({
        success: false,
        message: "Resume not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Resume updated successfully",
      resume: updatedResume,
    });
  } catch (error) {
    console.error("Update Resume Error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
}


async function deleteResume(req, res) {
  try {
    const { id } = req.params;

    const deletedResume = await Resume.findByIdAndDelete(id);
    if (!deletedResume) {
      return res.status(404).json({
        success: false,
        message: "Resume not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Resume deleted successfully",
    });
  } catch (error) {
    console.error("Delete Resume Error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
}

module.exports = {
  createResume,
  getResumeByUser,
  updateResume,
  deleteResume,
};
