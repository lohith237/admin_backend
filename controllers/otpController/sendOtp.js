const User = require('../../models/userModel');

const sendOtp = async (req, res) => {
    const { phoneNumber } = req.body;
    if (!phoneNumber) {
        return res.status(400).json({ message: "Phone number is required" });
    }

    const otp = Math.floor(1000 + Math.random() * 9000);
    const otpExpiresAt = new Date(Date.now() + 5 * 60000);

    let user = await User.findOne({ phoneNumber });

    if (!user) {
        user = new User({
            phoneNumber,
            otp,
            otpExpiresAt,
        });
        await user.save();
    } else {
        user.otp = otp;
        user.otpExpiresAt = otpExpiresAt;
        await user.save();
    }

    console.log(`OTP sent to ${phoneNumber}: ${otp}`);

    return res.status(200).json({ message: `Enter 4 digit code sent to your phone +${phoneNumber}` });
};

module.exports = sendOtp;
