const express = require("express");

require("dotenv").config();
const connectDatabase = require("./config/connection");

const app = express();
const path = require("path");
const cors = require("cors");


app.use(cors());





var bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const _dirname = path.resolve();
app.use("uploads", express.static(path.join(_dirname, "uploads")));



const multer = require("multer");

const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, "uploads");
  },
  filename(req, file, cb) {
    cb(
      null,
      `${file.fieldname}-${file.originalname
        .toLowerCase()
        .split(" ")
        .join("_")}`
    );
  },
});


var upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    if (
      // file.mimetype == "image/png" ||
      // file.mimetype == "image/jpg" ||
      // file.mimetype == "image/jpeg" ||
      // file.mimetype == "video/webm" ||
      // file.mimetype == "video/mp4" ||
      // file.mimetype == "video/mav"

      file
    ) {
      cb(null, true);
    } else {
      cb(null, false);
      // return cb(new Error("Only .png, .jpg and .jpeg format allowed!"));
      return cb(new Error("File is required"));
    }
  },
});

app.use("/api/uploads", express.static(path.join(_dirname, "uploads")));



// Sign Up


// Form Data

let Formdata = require("./routes/form/formdata")


app.post("/Saveformdata", upload.single("image"), Formdata.create_form);

app.post("/update", upload.single("image"), Formdata.gupdate_form);

app.post("/deleteidBase", Formdata.del_form);

app.get("/Getformdata", Formdata.get_form);



// User SignUp

let Authenticate = require("./routes/form/Autherize/autherize");


app.post("/savesignupdata", Authenticate.signup_rec);


app.post("/loginuser", Authenticate.signin_user);

app.post("/VerifyToken", Authenticate.verify_tkn);



app.post("/VerifyTokenforpass", Authenticate.verify_tknpass);


app.post("/forgotpass", Authenticate.forgot_passw);



app.post("/Updatepasswd", Authenticate.frgtpass_update);



// User SignIn by Auth

// let Signin = require("./routes/form/signIn/signin");


// app.post("/authuserCredentl", Signin.auth_user);





app.use(express.static("./build"));
app.use("*", (req, res) => {
  res.sendFile("./build/index.html");
});

connectDatabase();
const PORT = process.env.PORT || 8071;
app.listen(PORT, function () {
  console.log("server is started on port " + PORT);
});
