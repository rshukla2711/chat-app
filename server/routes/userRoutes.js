const { register, login,auth,setAvatar,logOut,getAllUsers } = require('../controllers/usersController');

const router= require('express').Router();
router.post('/register',register);
router.post('/login',login);
router.get("/:id/verify/:token/",auth);
router.post("/setavatar/:id", setAvatar);
router.get("/allusers/:id", getAllUsers);
router.get("/logout/:id", logOut);
module.exports=router;