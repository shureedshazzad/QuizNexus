import {error} from "console";
import asyncHandler from "../middleware/asyncHandler.js";
import User from "../models/userModel.js";
import generateToken from "../utils/generateToken.js";
import generateOtp from "../utils/generateOtp.js";
import nodemailer from 'nodemailer';


//@desc Auth Usser and get Token
//@route POST/api/users/login
//@access Public
const authUser = asyncHandler(async (req, res) => {
    const {email, password} = req.body;

    const user = await User.findOne({email});

    if(user && (await user.matchPassword(password))) {
        generateToken(res,user._id);

        res.status(200).json({
            _id: user._id,
            userName: user.userName,
            email: user.email,
            isAdmin: user.isAdmin,
            avatar: user.avatar,
            total_score: user.total_score,
            level: user.level,
        });

    }
    else {
        res.status(401);
        throw new Error('Invalid email or password');
    }

});

//@desc Log out User and clear cookies
//@route POST/api/users/logout
//@access Private
const logoutUser = asyncHandler(async (req, res) => {
    res.cookie('jwt', '', {
      httpOnly: true,
      expires: new Date(0),
    });
  
    res.status(200).json({ message: 'Logged Out Successfully' });
  
  });


//@desc Register User
//@route POST/api/users
//@access Public
const registerUser = asyncHandler(async (req, res) => {
    const {userName, email, password, avatar, level} = req.body;

    const userExists = await User.findOne({email});
    if(userExists) {
        res.status(400);
        throw new Error('User already exists');
    }

    let isAdmin = false;

    // if (email === process.env.TRANSACTION_MAIL) {
    //     isAdmin = true;
    // }

    const user = await User.create({
        userName,
        email,
        password,
        isAdmin,
        avatar,
        level,
        total_score: 0,
    })

    if(user){
        // Generate OTP
        const otp = generateOtp();
        user.otp = otp;

        user.otpGeneratedAt = new Date();

        await user.save();

        // Send OTP via email
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.TRANSACTION_MAIL,
                pass: process.env.TRANSACTION_MAIL_PASS,
            },
        });

        // Prepare the OTP for the email template
       const otpDigits = otp.split(''); // assuming OTP is a string of numbers

    // HTML email template with OTP integration
    const htmlTemplateEmailVerification = `
    <!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
        body {
            font-family: Arial, sans-serif;
        }
        .container {
            max-width: 600px;
            margin: 0 auto;
            background-color: #ffffff;
            padding: 20px;
        }
        .header {
            padding: 10px 0;
            text-align: center;
        }
        .logo {
            width: 50px;
            height: 50px;
            vertical-align: middle;
        }
        .logo-name {
            display: inline-block;
            color:rgb(255, 191, 26);
            font-size: 24px;
            vertical-align: middle;
            margin-left: 10px;
            font-weight: bolder;
        }
        .main {
            background-color: #365CCE;
            color: #ffffff;
            text-align: center;
            padding: 30px;
        }
        .main p {
            color: #ffffff;
        }
        p {
           color: #151515
        }
        .otp-box {
            text-align: center;
            margin-top: 20px;
        }
        .otp-box div {
            display: inline-block;
            font-size: 24px;
            padding: 10px;
            border: 2px solid #151515;
            border-radius: 5px;
            margin: 0 5px;
        }
        .content {
            margin-top: 20px;
            color: #333333;
        }
        .button {
            display: block;
            width: 100%;
            background-color:rgb(255, 102, 0);
            color: #ffffff;
            padding: 10px;
            border: none;
            border-radius: 5px;
            text-align: center;
            text-decoration: none;
            margin-top: 20px;
        }
        .footer {
            text-align: center;
            color: #666666;
            margin-top: 20px;
        }
        .footer a {
            color: #365CCE;
            text-decoration: none;
        }
    </style>
</head>
<body>
     <div class="container">
              <div class="header">
                  <h2 class="logo-name">QuizNexus</h2>
              </div>
              <div class="main">
                  <p>THANKS FOR SIGNING UP!</p>
                  <h2>Verify Your E-mail Address</h2>
              </div>
              <div class="content">
                  <p>Hello <b>${user.userName},</b></p>
                  <p>Please use the following One Time Password (OTP) to verify your email address.</p>
                  <div class="otp-box">
                      <div>${otpDigits[0]}</div>
                      <div>${otpDigits[1]}</div>
                      <div>${otpDigits[2]}</div>
                      <div>${otpDigits[3]}</div>
                  </div>
                  <p>This passcode will be valid for the next <strong>2 minutes</strong>. Don't share this OTP with anyone. If you did not sign-up, just ignore this email.</p>
                  <p>Thank you,<br>From QuizNexus</p>
              </div>
              <div class="footer">
                  <p>This email was sent from <a href="mailto:sales@infynno.com">sales@infynno.com</a>. If you'd rather not receive this kind of email, you can <a href="#">unsubscribe</a> or <a href="#">manage your email preferences</a>.</p>
              </div>
          </div>
       </body>
    </html>

    `;

    const message = {
        from: process.env.TRANSACTION_MAIL,
        to: user.email,
        subject: 'Registration related OTP',
        html: htmlTemplateEmailVerification,
      };

      transporter.sendMail(message)
      .then(() => {
        res.status(200).json({ message: 'An OTP is sent to your email. Check your email' });
      })
      .catch((error) => {
        res.status(500).json({ error });
      });
   }
   else{
    res.status(404).json({ error: 'User not found' });
   }

})


// @desc Verify OTP after registration
// @route POST /api/users/verify-otp-reg
// @access Public
const verifyOTPReg = asyncHandler(async (req,res) => {
    const { email, otp , count } = req.body;

    const user = await User.findOne({email});

    

    if(!user || !user.otp)
    {
        res.status(404).json({ error: 'User not found or OTP not generated.' });
        return; // Return to prevent further execution
    }

    if(count === 0)
    {
        res.status(404).json({ error: 'OTP is expired.' });
        await User.findOneAndDelete({email});
        return;
    }


    if (otp === null || otp !== user.otp) {
        res.status(401).json({ error: 'Sorry invalid OTP. Try again' });
        return; // Return to prevent further execution
    }
    

    if(otp === user.otp)
    {
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
              user: process.env.TRANSACTION_MAIL,
              pass: process.env.TRANSACTION_MAIL_PASS,
            },
          });

          const emailTemplate= `
    <!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.3/css/all.min.css" />
    <style>
        body {
            font-family: Arial, sans-serif;
        }

        .container {
            max-width: 600px;
            margin: 0 auto;
            background-color: #ffffff;
            padding: 20px;
        }

        .header {
            padding: 10px 0;
            text-align: center;
        }

        .logo {
            width: 50px;
            height: 50px;
            vertical-align: middle;
        }

        .logo-name {
            display: inline-block;
            color:rgb(255, 191, 26);
            font-size: 24px;
            vertical-align: middle;
            margin-left: 10px;
            font-weight: bolder;
        }

        .main {
            background-color: #365CCE;
            color: #ffffff;
            text-align: center;
            padding: 30px;
        }

        .otp-box {
            text-align: center;
            margin-top: 20px;
        }

        .otp-box div {
            display: inline-block;
            font-size: 24px;
            padding: 10px;
            border: 2px solid #151515;
            border-radius: 5px;
            margin: 0 5px;
        }

        .content {
            margin-top: 20px;
            color: #333333;
        }

        .footer {
            text-align: center;
            color: #666666;
            margin-top: 20px;
        }

        .footer a {
            color: #365CCE;
            text-decoration: none;
        }

        .button {
            background-color: #ff6700;
            color: #ffffff;
            padding: 10px 15px;
            border: none;
            border-radius: 5px;
            text-align: center;
            text-decoration: none;
            margin: 20px auto;
            display: flex;
            align-items: center;
            justify-content: center;
            width: fit-content;
        }

        .button .fa-telegram-plane {
            margin-right: 10px; /* Space between icon and text */
        }
    </style>
</head>

<body>
    <div class="container">
        <div class="header">
            <span class="logo-name">QuizNexus</span>
        </div>
        <div class="main">
            <p>THANKS FOR JOINING THE QuizNexus!</p>
        </div>
        <div class="content">
            <p>Hello <b>${user.userName}</b>,</p>
            <p>Welcome to the "QuizNexus" community! We are thrilled to have you as a part of our community.</p>
        </div>
        <div class="footer">
            <p>This email was sent from <a href="mailto:support@dreamclub.com">support@dreamclub.com</a>.
                If you'd prefer not to receive these emails, you can <a href="#">unsubscribe</a> or <a
                    href="#">manage your
                    email preferences</a>.</p>
        </div>
    </div>

</body>

</html>
    
    `;

    const message = {
        from: process.env.TRANSACTION_MAIL,
        to: user.email,
        subject: 'Registration Confirmation',
        html: emailTemplate,
      };

      transporter.sendMail(message).then(() => {
        const token = generateToken(res,user._id);
        res.status(200).json({
            _id: user._id,
            userName: user.userName,
            email: user.email,
            isAdmin: user.isAdmin,
            avatar: user.avatar,
            total_score: user.total_score,
            level: user.level,
            otp: user.otp,
            token,
            message: 'You should receive an email with registration confirmation.',
        });
      })  
      .catch((error) => {
        res.status(500).json({ error });
      });

    }

})

// @desc Forgot Password - Send OTP via Email
// @route POST/api/users/forget-password
// @access Public

const forgetPassword = asyncHandler(async (req, res) => {
    const { email } = req.body;
    const user = await User.findOne({email});

    if(user)
    {
        //genearte otp
        const otp = generateOtp();
        //set otp and otp generation time
        user.otp = otp;
        user.otpGeneratedAt = new Date();

        await user.save();

        
       // Send OTP via email
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.TRANSACTION_MAIL,
          pass: process.env.TRANSACTION_MAIL_PASS,
        },
      });
      // Prepare the OTP for the email template
      const otpDigits = otp.split(''); // assuming OTP is a string of numbers

       // HTML email template with OTP integration
    const htmlTemplate = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
            body {
                font-family: Arial, sans-serif;
            }
            .container {
                max-width: 600px;
                margin: 0 auto;
                background-color: #ffffff;
                padding: 20px;
            }
            .header {
                padding: 10px 0;
                text-align: center;
            }
            .logo {
                width: 50px;
                height: 50px;
                vertical-align: middle;
            }
            .logo-name {
                display: inline-block;
                color: rgb(255, 191, 26);
                font-size: 24px;
                vertical-align: middle;
                margin-left: 10px;
                font-weight: bolder;
            }
            .main {
                background-color: #365CCE;
                color: #ffffff;
                text-align: center;
                padding: 30px;
            }
            .main p {
                color: #ffffff;
            }
            p {
               color: #151515
            }
            .otp-box {
                text-align: center;
                margin-top: 20px;
            }
            .otp-box div {
                display: inline-block;
                font-size: 24px;
                padding: 10px;
                border: 2px solid #151515;
                border-radius: 5px;
                margin: 0 5px;
            }
            .content {
                margin-top: 20px;
                color: #333333;
            }
            .button {
                display: block;
                width: 100%;
                background-color: #ff6700;
                color: #ffffff;
                padding: 10px;
                border: none;
                border-radius: 5px;
                text-align: center;
                text-decoration: none;
                margin-top: 20px;
            }
            .footer {
                text-align: center;
                color: #666666;
                margin-top: 20px;
            }
            .footer a {
                color: #365CCE;
                text-decoration: none;
            }
        </style>
    </head>
    <body>
         <div class="container">
                  <div class="header">
                      <h2 class="logo-name">QuizNexus</h2>
                  </div>
                  <div class="main">
                      <p>DON'T WORRY!</p>
                      <h2>Recover Your Password!</h2>
                  </div>
                  <div class="content">
                      <p>Hello <b>${user.userName},</b></p>
                      <p>Please use the following One Time Password (OTP) to verify your email address.</p>
                      <div class="otp-box">
                          <div>${otpDigits[0]}</div>
                          <div>${otpDigits[1]}</div>
                          <div>${otpDigits[2]}</div>
                          <div>${otpDigits[3]}</div>
                      </div>
                      <p>This passcode will be valid for the next <strong>4 minutes</strong>. Don't share this OTP with anyone. If you did not sign-up, just ignore this email.</p>
                      <p>Thank you,<br>Quiz Nexus Team</p>
                  </div>
                  <div class="footer">
                      <p>This email was sent from <a href="mailto:sales@infynno.com">sales@infynno.com</a>. If you'd rather not receive this kind of email, you can <a href="#">unsubscribe</a> or <a href="#">manage your email preferences</a>.</p>
                  </div>
              </div>
        </body>
       </html>
       `;

       
     const message = {
        from: process.env.TRANSACTION_MAIL,
        to: user.email,
        subject: 'Password Recovery OTP',
        html: htmlTemplate,
       };

       transporter.sendMail(message)
       .then(() => {
         res.status(200).json({ message: 'OTP sent successfully. Check your email.' });
       })
       .catch((error) => {
         res.status(500).json({ error });
       });
    }
    else{
        res.status(404).json({ error: 'User not found' }); 
    }
})



// @desc Verify OTP
// @route POST /api/users/verify-otp
// @access Public

const verifyOTP = asyncHandler(async (req,res) => {
    const {email, otp, count} = req.body;
    const user = await User.findOne({ email });
    
    if(!user || !user.otp)
    {
        res.status(404).json({ error: 'User not found or OTP not generated.' });
        return; // Return to prevent further execution
    }
    
    if(count === 0)
    {
        res.status(404).json({ error: 'OTP is expired.' });
        return;
    }
    if (otp === null || otp !== user.otp) {
        res.status(401).json({ error: 'Sorry invalid OTP. Try again' });
        return; // Return to prevent further execution
    }

    if(otp === user.otp)
    {
        res.status(200).json({ message: 'OTP verified successfully.' });
    }

})


// @desc Reset Password without OTP verification (since OTP is already verified)
// @route POST /api/users/reset-password
// @access Public
const resetPassword = asyncHandler(async (req,res) => {
    const {email, password} = req.body;
    const user = await User.findOne({ email });
    if(user){
        user.password = password;
        await user.save();
        res.status(200).json({ message: 'Password reset successful.' });
    }else{
        res.status(404).json({ error: 'User not found.' });
    }
})


//@desc Get User Profile 
//@route GET/api/users/profile
//@access Private
const getUserProfile = asyncHandler(async (req, res) => {

    const user = await User.findById(req.user._id);

    if(user)
    {
        res.status(201).json({
            userName: user.userName,
            email: user.email,
            avatar: user.avatar,
            total_score: user.total_score,
            level: user.level,
        })
    }
    else{
        res.status(404);
        throw new Error ('User not found');
    }
})

//@desc Update User Profile
//@route PUT/api/users/profile
//@access private
const updateUserProfile = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id);
    if(user){
        if(req.body.password)
        {
            user.password = req.body.password;
        }

        const updatedUser = await user.save();

        res.status(200).json({
            _id: updatedUser._id,
            userName: updatedUser.userName,
            email: updatedUser.email,
            isAdmin: updatedUser.isAdmin,
            avatar: updatedUser.avatar,
            level: updatedUser.level,
            total_score: updatedUser.total_score,
        })
     }
     else{
        res.status(404);
        throw new Error ('User not found');
     }
})



//@desc Get all users
//@route GET/api/users
//@access Private/Admin
const getUsers = asyncHandler(async (req, res) => {
    const users = await User.find({});
    res.status(200).json(users);
  });

  //@desc Get a user by id
  //@route GET/api/users/:id
  //@access Private/Admin
  const getUserbyId = asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id).select('-password');
  
    if (user) {
      return res.json(user);
    }
    else {
      res.status(404);
      throw new Error('User Not Found');
    }
  });


  //@desc delete a user
  //@route DELETE/api/users/:id
  //@access Private/Admin
  const deleteUser = asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id);
  
    if (user) {
      if (user.isAdmin) {
        res.status(400);
        throw new error('Cannot delete admin user');
      }
      await User.deleteOne({ _id: user._id });
      res.status(200).json({ message: "User is deleted successfully" });
    }
    else {
      res.status(404);
      throw new Error('User not found');
    }
});


export
{
    authUser,
    logoutUser,
    registerUser,
    verifyOTPReg,
    forgetPassword,
    verifyOTP,
    resetPassword,
    getUserProfile,
    updateUserProfile,
    getUsers,
    getUserbyId,
    deleteUser
}









