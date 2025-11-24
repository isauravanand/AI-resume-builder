const Brevo = require("@getbrevo/brevo");

const apiInstance = new Brevo.TransactionalEmailsApi();

// Load API key
apiInstance.setApiKey(
  Brevo.TransactionalEmailsApiApiKeys.apiKey,
  process.env.BREVO_API_KEY
);

async function sendVerificationEmail(to, verifyCode) {
  try {
    const emailData = {
      sender: {
        name: "Your App Team",
        email: "sauravanand1608@gmail.com", // can be Gmail (Brevo allows it)
      },
      to: [{ email: to }],
      subject: "Verify your email address",
      htmlContent: `
        <div style="font-family: Arial, sans-serif; line-height: 1.5;">
          <h2>Verify Your Email</h2>
          <p>Hi there ${to},</p>
          <p>Use the verification code below to complete your registration:</p>
          <h1 style="background: #f4f4f4; display: inline-block; padding: 10px 20px; border-radius: 8px;">${verifyCode}</h1>
          <p>This code will expire in <strong>10 minutes</strong>.</p>
          <p>If you didn’t request this, you can safely ignore this email.</p>
          <br/>
          <p>— Your App Team</p>
        </div>
      `,
    };

    const response = await apiInstance.sendTransacEmail(emailData);

    console.log("Verification email sent:", response);
    return true;
  } catch (error) {
    console.error("Error sending email:", error);
    return false;
  }
}

module.exports = sendVerificationEmail;
