const User = require("../models/user.model");
const bcrypt = require("bcryptjs");
const router = require("express").Router();
const jwt = require("jsonwebtoken");

router.post("/signup", (req, res, next) => {
  const { email, password } = req.body;
  
  if (email === "" || password === "") {
      res.status(400).json({ message: "Please provide an email and a password." });
      return;
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
    if (!emailRegex.test(email)) {
    res.status(400).json({ message: "Please provide a valid email address." });
    return;
}

User.findOne({ email })
    .then((foundUser) => {
      if (foundUser) {
        res.status(400).json({ message: "An account already exists for your email. Please log in." });
          return;
        }
        
        const saltRounds = 10;
        const salt = bcrypt.genSaltSync(saltRounds);
        const hashedPassword = bcrypt.hashSync(password, salt);

      return User.create({ email, password: hashedPassword });
    })
    .then((createdUser) => {
      const { email, _id } = createdUser;
      const user = { email, _id };
      res.status(201).json({ user: user });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ message: "internal server error" });
    });
});

router.post('/login', (req, res, next) => {
    console.log('running login api req');
const { email, password } = req.body;

if(email ===''|| password ==='') {
    res.status(400).json({ message: 'Please enter your email and password.'});
    return;
}

User.findOne({ email })
    .then((foundUser) => {
        console.log(foundUser);
        if(!foundUser) {
            res.status(401).json({message: 'user not found'})
            return;
        }

        const passwordCorrect = bcrypt.compareSync(password, foundUser.password);

        if(passwordCorrect) {
            const {_id, email } = foundUser;
            console.log('User with email ', email, 'is logging in.')
            const payload = {_id, email };
            const authToken = jwt.sign(
                payload,
                process.env.TOKEN_SECRET,
                {algorithm: 'HS256', expiresIn: '24h'}
            );

            //changed below to add ", userId:_id" bit
            res.status(200).json({ authToken: authToken, userId:_id});
            // res.status(200).json({ userId:_id});
        }
        else {
            res.status(401).json({message: 'Unable to authenticate user; login information incorrect.'});
        }
    })
    .catch(err => {
        console.log(err)
        res.status(500).json({message: 'internal server error'})
    })

})

// router.get('/verify', (req, res, next) =>{
//     // router.get('/verify', isAuthenticated, (req, res, next) =>{

// console.log('req.payload', req.payload);
// res.status(200).json(req.payload);

// });

module.exports = router;


// const uri = "mongodb+srv://squabattack:<password>@cluster0.dcq1p.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
