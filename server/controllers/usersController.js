const User= require("../models/userModel")
const Token = require("../models/token");
const bcrypt =require("bcrypt");
const emailValidator=require("deep-email-validator")
const crypto = require("crypto");
const sendEmail = require("../utils/sendEmail");
async function isEmailValid(email) {
  return emailValidator.validate(email)
}
module.exports.register=async (req,res,next)=>{
    try{
    const{username,email,password}=req.body
    const usernameCheck = await User.findOne({ username });
    const valid =isEmailValid(email);
    if(!valid)
      return res.json({msg: "Enter a valid email address", status: false})
    if (usernameCheck)
      return res.json({ msg: "Username already used", status: false });
    const emailCheck = await User.findOne({ email });
    if (emailCheck)
      return res.json({ msg: "Email already used", status: false });
    
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
        email,
        username,
        password: hashedPassword,
      });
      const userVerification= await User.findOne({ username });
      const token = await new Token({
        userId: userVerification._id,
        token: crypto.randomBytes(32).toString("hex"),
      }).save();
      const url = `${process.env.BASE_URL}users/${userVerification._id}/verify/${token.token}`;
    delete user.password;
		await sendEmail(email, "Verify Email", url);
    if(!userVerification.verified){
      return res.json({ msg: "Please Verify your Email", status: false });
    }
      return res.json({ status: true, user });
    } catch (ex) {
      next(ex);
    }
}
module.exports.login=async (req,res,next)=>{
    try{
    const{username,password}=req.body
    const user = await User.findOne({ username });
    if (!user)
      return res.json({ msg: "Incorrect username or password", status: false });
    const isPassword = await bcrypt.compare(password, user.password)
    if (!isPassword)
      return res.json({ msg: "Incorrect username or password", status: false });
    delete user.password;
    if (!user.verified) {
			let token = await Token.findOne({ userId: user._id });
			if (!token) {
				token = await new Token({
					userId: user._id,
					token: crypto.randomBytes(32).toString("hex"),
				}).save();
				const url = `${process.env.BASE_URL}users/${user._id}/verify/${token.token}`;
				await sendEmail(user.email, "Verify Email", url);
			}return res.json({ msg: "Please Verify your Email", status: false });
    }
    return res.json({ status: true, user });
    } catch (ex) {
      next(ex);
    }
}
module.exports.auth=async(req,res,next)=>{
  try{
    const user = await User.findOne({ _id: req.params.id });
    
		if (!user){
      return res.json({ msg: "Invaild link", status: false });
    }
    const token = await Token.findOne({
			userId: user._id,
			token: req.params.token,
		});
		if (!token) {
      return res.json({ msg: "Invalid Link", status: false });
    }
    await User.updateOne(
      { _id: user._id },
      { $set: { verified: true } }
    );
		await Token.findOneAndDelete({ _id: token._id });
    return res.json({msg: "Email Verified Successfully", status: true})
  }catch(ex){
    next(ex);
  }
}
module.exports.setAvatar = async (req, res, next) => {
  try {
    const userId = req.params.id;
    const avatarImage = req.body.image;
    const user = await User.findOne({ _id: userId });
    
    const userData = await User.findByIdAndUpdate(
      userId,
      {
        isAvatarImageSet: true,
        avatarImage,
      },
      { new: true }
    );
    return res.json({
      isSet: userData.isAvatarImageSet,
      image: userData.avatarImage,
    });
  } catch (ex) {
    next(ex);
  }
};
module.exports.logOut = (req, res, next) => {
  try {
    if (!req.params.id) return res.json({ msg: "User id is required " });
    onlineUsers.delete(req.params.id);
    return res.status(200).send();
  } catch (ex) {
    next(ex);
  }
};
module.exports.getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find({ _id: { $ne: req.params.id } }).select([
      "email",
      "username",
      "avatarImage",
      "_id",
    ]);
    return res.json(users);
  } catch (ex) {
    next(ex);
  }
};