const fs = require("fs");
const path = require("path");
const puppeteer = require("puppeteer");
const { generateWithGemini, safeExtractJSON } = require("../utils/geminiHelpers");
const { registerHandlebarsHelpers, Handlebars } = require("../utils/templateHelpers");

// Set Puppeteer cache directory for Render
if (process.env.NODE_ENV === 'production') {
    process.env.PUPPETEER_CACHE_DIR = process.env.PUPPETEER_CACHE_DIR || '/opt/render/.cache/puppeteer';
}

registerHandlebarsHelpers();


module.exports.GenerateAiResume = async (req, res) => {
    let browser;

    try {
        const { template, resumeData } = req.body;

        if (!resumeData)
            return res.status(400).json({ message: "No resume data received" });

        delete resumeData._id;
        delete resumeData.createdAt;
        delete resumeData.updatedAt;
        delete resumeData.user;

        const aiPrompt = `
You are a professional ATS resume rewriting AI. Rewrite and enhance the entire resume using the user-provided JSON.

### RULES:
- Fill the entire A4 page with strong, professional, concise content.
- Keep the SAME JSON structure and keys.
- Improve ALL sections (summary, experience, projects, education, skills).
- Expand weak descriptions with context-based, realistic achievements.
- Do NOT invent fake companies, fake internships, fake degrees.
- Do NOT add extra JSON keys.
- Keep formatting clean (no markdown).
- Return ONLY valid JSON.

### Input JSON:
${JSON.stringify(resumeData, null, 2)}
`;

        let improvedData = resumeData;

        try {
            const aiResponse = await generateWithGemini(aiPrompt);
            improvedData = safeExtractJSON(aiResponse);
            console.log("Gemini AI rewrite successful");
        } catch (err) {
            console.warn("AI rewrite failed , using original data", err.message);
        }

        const templatePath = path.join(
            __dirname,
            "..", 
            "templates", 
            `${template}.html`
        );

        if (!fs.existsSync(templatePath))
            return res.status(400).json({ message: `Template file not found at: ${templatePath}` });

        const htmlTemplate = fs.readFileSync(templatePath, "utf8");
        const compiledHTML = Handlebars.compile(htmlTemplate)(improvedData);

        // Configure Puppeteer for Render deployment
        const launchOptions = {
            headless: "new",
            args: [
                "--no-sandbox",
                "--disable-setuid-sandbox",
                "--disable-dev-shm-usage",
                "--disable-accelerated-2d-canvas",
                "--no-first-run",
                "--no-zygote",
                "--single-process",
                "--disable-gpu",
                "--disable-software-rasterizer",
                "--disable-extensions",
            ],
        };

        // Try to find Chrome in common system locations (for Render)
        const possibleChromePaths = [
            process.env.PUPPETEER_EXECUTABLE_PATH,
            "/usr/bin/google-chrome-stable",
            "/usr/bin/google-chrome",
            "/usr/bin/chromium",
            "/usr/bin/chromium-browser",
            "/snap/bin/chromium",
        ];

        // Use system Chrome if available (for Render)
        let chromeFound = false;
        for (const chromePath of possibleChromePaths) {
            if (chromePath && fs.existsSync(chromePath)) {
                launchOptions.executablePath = chromePath;
                chromeFound = true;
                console.log(`Using Chrome at: ${chromePath}`);
                break;
            }
        }

        // If Chrome not found, try to use Puppeteer's bundled Chrome
        if (!chromeFound) {
            try {
                // Try to get Puppeteer's executable path
                const puppeteerExecutable = puppeteer.executablePath();
                if (puppeteerExecutable && fs.existsSync(puppeteerExecutable)) {
                    launchOptions.executablePath = puppeteerExecutable;
                    chromeFound = true;
                    console.log(`Using Puppeteer bundled Chrome at: ${puppeteerExecutable}`);
                }
            } catch (err) {
                console.warn("Could not get Puppeteer executable path:", err.message);
            }
        }

        if (!chromeFound) {
            console.warn("Chrome executable not found. Puppeteer will attempt to download it...");
        }

        browser = await puppeteer.launch(launchOptions);

        const page = await browser.newPage();
        await page.setContent(compiledHTML, {
            waitUntil: "networkidle0",
            timeout: 60000,
        });

        const pdfBuffer = await page.pdf({
            format: "A4",
            printBackground: true,
            margin: { top: '0.5in', bottom: '0.5in', left: '0.5in', right: '0.5in' }
        });

        res.set({
            "Content-Type": "application/pdf",
            "Content-Disposition": `attachment; filename=AI_Resume_${template}.pdf`,
        });

        return res.send(pdfBuffer);

    } catch (error) {
        console.error(" Resume Generation Error:", error);
        
        // Provide more helpful error messages
        if (error.message && error.message.includes("Could not find Chrome")) {
            return res.status(500).json({ 
                message: "Chrome browser not found. Please ensure Chrome is installed or Puppeteer cache is configured correctly.",
                error: error.message 
            });
        }
        
        return res.status(500).json({ 
            message: "Error generating resume",
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    } finally {
        if (browser) {
            try {
                await browser.close();
            } catch (closeError) {
                console.error("Error closing browser:", closeError);
            }
        }
    }
};