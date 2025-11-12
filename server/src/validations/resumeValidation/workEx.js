const { z } = require("zod");

const workExperienceSchema = z.object({
    company: z.string().min(2, "Company name is required"),
    position: z.string().min(2, "Position is required"),
    startDate: z.string().transform((val) => new Date(val)),
    endDate: z.string().optional().transform((val) => (val ? new Date(val) : undefined)),
    description: z.string().max(500, "Description cannot exceed 500 characters").optional(),
});

module.exports = { workExperienceSchema };
