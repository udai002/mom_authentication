import ApiError from "../Error/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import TryCatch from "../utils/TryCatch.js";
import Users from "../models/user.model.js";
import sendMail from "../utils/EmailService.js";

class ForgotPswd {
  forgotPswd = TryCatch(async (req, res) => {
    const { email } = req.body;

    if (!email) {
      throw new ApiError("email not found", 401, false);
    }

    const user = await Users.findOne({ email });

    if (!user) {
      throw new ApiError("user not found", 401, false);
    }
    
    const resetToken = user.createResetPasswordToken();
    await user.save();

    // Log raw token in console for testing
    console.log("RESET TOKEN (copy this into frontend):", resetToken);

    // Create reset URL for frontend
    const resetURL = `http://localhost:5173/forgot?token=${resetToken}`;

    // Email content
          // <h2>Password Reset Request</h2>
      // <div style={{border-20px}}>
      // <p>Click the link below to reset your password:</p>
      // <a href="${resetURL}">Reset Password</a>
      // <p>Link expires in 10 minutes.</p>
      // </div>
    const html = `

      <!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Password Reset Request</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      background-color: #f1f3f4;
      margin: 0;
      padding: 0;
    }
    .container {
      width: 100%;
      max-width: 600px;
      margin: 0 auto;
      background-color: #ffffff;
      padding: 20px;
      border-radius: 10px;
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
      text-align: center;
    }
    h2 {
      color: #202124;
      font-size: 24px;
      margin-bottom: 20px;
    }
    p {
      color: #202124;
      font-size: 16px;
      line-height: 1.6;
    }
    .reset-link {
      display: inline-block;
      color: white;
      padding: 12px 25px;
      font-size: 16px;
      text-decoration: none;
      border-radius: 5px; 
      margin: 20px 0;
    }
   
    .footer {
      margin-top: 30px;
      color: #5f6368;
      font-size: 14px;
    }
  </style>
</head>
<body>
  <div class="container">
    <h2>Password Reset Request</h2>
    <p>We received a request to reset your password. To proceed, please click the button below:</p>
    <a class="reset-link" href="${resetURL}">Reset Password</a>
    <p class="footer">This link will expire in 10 minutes.</p>
  </div>
</body>
</html>

      
    `;

    await sendMail(user.email, "Reset Your Password", html);
    res.json(
      new ApiResponse("Link send to ur Mail Successfully ", 200, resetToken)
    );
    // throw new ApiError("faild send link to mail", 401, false);

    // console.log("resetTocken  is ",resetToken);
  });
}

export default ForgotPswd;
