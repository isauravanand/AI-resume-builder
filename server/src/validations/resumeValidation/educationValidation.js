const { z } = require("zod");

const educationSchema = z.object({
  degree: z.string().min(2, "Degree is required"),
  institution: z.string().min(3, "Institution is required"),
  startYear: z.number().min(1900, "Enter a valid start year"),
  endYear: z.number().optional(),
  percentage: z.string().optional(),
});

module.exports = { educationSchema };
