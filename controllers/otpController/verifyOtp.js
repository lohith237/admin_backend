const jwt = require('jsonwebtoken');
const User = require('../../models/userModel');

const verifyOtp = async (req, res) => {
    const { phoneNumber, otp } = req.body;

    if (!phoneNumber || !otp) {
        return res.status(400).json({ message: "Phone number and OTP are required" });
    }

    let user = await User.findOne({ phoneNumber });

    if (!user) {
        return res.status(400).json({ message: "User not found" });
    }

    if (user.otpExpiresAt < Date.now()) {
        return res.status(400).json({ message: "OTP has expired, please request a new one" });
    }

    if (otp !== user.otp.toString()) {
        return res.status(400).json({ message: "Invalid OTP, please try again" });
    }

    const token = user.token || jwt.sign(
        { user_id: user._id, phoneNumber: user.phoneNumber },
        process.env.JWT_SECRET,
        { expiresIn: '1h' }
    );

    if (!user.token) {
        user.token = token;
        await user.save();
    }

    return res.status(200).json({
        user_id: user._id,
        token,
        message: "OTP verified successfully"
    });
};

module.exports = verifyOtp;
