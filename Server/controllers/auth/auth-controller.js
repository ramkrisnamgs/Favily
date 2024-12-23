const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../../models/User');


// Register User
const registerUser = async (req, res) => {
   const { userName, email, password } = req.body;

   try {
      const checkUser = await User.findOne({email});
      if (checkUser) {
         return res.json({
            success: false,
            message: "User already exists with this email",
         });
      }

      const hashPassword = await bcrypt.hash(password, 12);
      const user = new User({
         userName,
         email,
         password: hashPassword
      });

      await user.save();
      res.status(201).json({
         success: true,
         message: "User registered successfully",
      });
   } catch (error) {
      res.status(500).json({
         success: false,
         message: "Something went wrong",
         error: error.message,
      });
   }
};

// Login User
const loginUser = async (req, res) => {
   const { emailOrUsername, password } = req.body;

   try {
      const checkUser = await User.findOne({
         $or: [
            { email: emailOrUsername },
            { userName: emailOrUsername }
         ]
      });

      if (!checkUser) {
         return res.status(400).json({
            success: false,
            message: "User does not exist! Please register first.",
         });
      }

      const checkPasswordMatch = await bcrypt.compare(password, checkUser.password);
      if (!checkPasswordMatch) {
         return res.status(400).json({
            success: false,
            message: "Password is incorrect",
         });
      }

      const token = jwt.sign({
         id: checkUser._id,
         role: checkUser.role,
         email: checkUser.email,
         userName: checkUser.userName,
      }, 'CLIENT_SECRET_KEY', { expiresIn: '1h' });

      // res.cookie('token', token, {
      //    httpOnly: true,
      //    secure: true,
      // }).json({
      //    success: true,
      //    message: "User logged in successfully",
      //    user: {
      //       email: checkUser.email,
      //       role: checkUser.role,
      //       id: checkUser._id,
      //       userName: checkUser.userName,
      //    }
      // });

      return res.status(200).json({
         success:true,
         message: "User logged in successfully",
         token: token,
         user: {
            email: checkUser.email,
            role: checkUser.role,
            id: checkUser._id,
            userName: checkUser.userName,
         },
         
      });

   } catch (error) {
      console.error('Login error:', error);
      return res.status(500).json({
         success: false,
         message: "Something went wrong",
         error: error.message,
      });
   }
};

// Logout User
const logoutUser = async (req, res) => {
   res.clearCookie('token').json({
      success: true,
      message: "User logged out successfully",
   });
};




// auth middleware

// const authMiddleware = async (req, res, next) => {
//    const token = req.cookies.token;
//    if (!token) {
//       return res.status(401).json({
//          success: false,
//          message: "Unauthorized",
//       });
//    }

//    try{
//       const decoded = jwt.verify(token, 'CLIENT_SECRET_KEY');
//       req.user = decoded;
//       next();
//    } catch (error) {
//       res.status(401).json({
//          success: false,
//          message: "Unauthorized",
//       });
//    }
// }

const authMiddleware = async (req, res, next) => {
   const authHeader = req.header['Authorization'];
   const token = authHeader && authHeader.split(' ')[1];
   if (!token) {
      return res.status(401).json({
         success: false,
         message: "Unauthorized",
      });
   }

   try{
      const decoded = jwt.verify(token, 'CLIENT_SECRET_KEY');
      req.user = decoded;
      next();
   } catch (error) {
      res.status(401).json({
         success: false,
         message: "Unauthorized",
      });
   }
}

module.exports = { registerUser, loginUser, logoutUser, authMiddleware };