const nodemailer = require("nodemailer");

const usertable = require("../../../Models/signup_schema");

// const nodemailer = require("nodemailer");

var validator = require("validator");
var bcrypt = require("bcryptjs");
var jwt = require("jsonwebtoken");

const sendEmail = require("./../../Emailer/sendmail");

var code = Math.floor(100000 + Math.random() * 900000);

const Auth = {
  signup_rec: async function (req, res) {
    let { name, email, password, isVerified } = req.body;

    try {
      // if user exist
      let user = await usertable.findOne({ email });
      console.log("is user is find?", user);
      if (user) {
        if (user.isVerified == false) {
          if (user.email) {
            if (user.code) {
              await usertable.updateOne(
                {
                  email: email,
                },
                {
                  $set: {
                    code: code,
                  },
                }
              );
            }

            await sendEmail(user.email, user.name, code);

            console.log("sendEmail", code);

            let mailret = user.email;
            console.log("mailret", mailret);

            return res.send({
              msg: "Email is already registred.  Check YOUR MAIL.. You just need to Verify Your Account...",
              mailret,
            });
          }
        } else if (user.isVerified == true) {
          if (user.email) {
            // await sendEmail(user.email, user.name, code);

            // console.log("sendEmail", code);

            let mailret = user.email;
            console.log("mailret", mailret);

            return res.send({
              msg: "You Are Already Registerd and Verified, Just hit on SignIn",
              mailret,
            });
          }
        }
      }

      let userReg = new usertable({
        name,
        email,
        password,
        isVerified: isVerified ? isVerified : false,
        code,
      });

      userReg.password = await bcrypt.hash(password, 10);

      // await user.save();     // User Resifstrtion Saved here....
      await userReg.save((err, success) => {
        if (err) {
          console.log("err", err);
        } else {
          console.log("success"), success;
        }
      });

      let payload = {
        user: {
          id: userReg.id,
          // isAdmin: user.isAdmin,
        },
      };
      // jsonwebtoken
      jwt.sign(payload, "jjjkukrhhhua", { expiresIn: 3000 }, (err, token) => {
        if (err) throw err;
        if (!userReg.isVerified) {
          if (email && code) {
            console.log(code);
            sendEmail(email, name, code);

            console.log("sendEmail", code, email, name);

            // After Send Token to Email, We also want to save it on Our DB

            let mailret = userReg.email;
            console.log("mailret", mailret);
            console.log("mailret", mailret);
            return res.send({
              msg: "Email verification code send.",
              mailret,
            });
          }
        }

        return res.json("You are successfully Registered");
      });
    } catch (err) {
      // return res.status(200).json({ errors: [{ msg: "Server Error" }] });
      return res.json("Server Error");
    }
  },

  verify_tkn: async function (req, res) {
    let { email, values } = req.body;

    console.log("emailid", email);
    console.log("token2", values.token);

    let code = values.token;

    let mytb1 = await usertable.findOne({ email });

    console.log("is user is find?", mytb1);

    console.log("is user is find?", mytb1);

    console.log("is user is find?", mytb1.name);

    console.log("is user is find?", mytb1.code);

    if (mytb1) {
      //////////////////////////////////////////////////////////////////////////
      if (mytb1.code == code) {
        await usertable.updateOne(
          {
            email: email,
          },
          {
            $set: {
              isVerified: true,
            },
          }
        );

        return res.send({
          msg: "Congratulation You Have Been Verified,  Go To SignIn Now",
          email,
        });
      }
      /////////////////////////////////////////////////////////////////
      else if (mytb1.code !== code) {
        await usertable.updateOne(
          {
            email: email,
          },
          {
            $set: {
              isVerified: false,
            },
          }
        );

        return res.send({
          msg: "Sorry Your Token Is Not Correct",
          email,
        });
      }
      /////////////////////////////////////////////////////
    }
  },

  // this is to verify Email , at when the user apply for Password Recovery

  verify_tknpass: async function (req, res) {
    let email = req.body.email;

    


    console.log("emailid", email);
    console.log("token2", req.body.values.token);

    console.log("token2", req.body.values.token);

    var Usertoken = req.body.values.token;

    // let code = values.token;
    console.log("Usertoken", Usertoken);


    let mytb1 = await usertable.findOne({ email });

    console.log("is user is find?", mytb1);

    console.log("is user is find?", mytb1);

    console.log("is user is find?", mytb1.name);

    console.log("is user is find?", mytb1.code);

    if (mytb1) {
    
      if (mytb1.code == Usertoken) {
      

        return res.send({
          msg: "You Have Been Verified for Password Update. Redirecting...",
          email,
        });
      }
 
    
        

        return res.send({
          msg: "Sorry Your Token Is Not Correct",
          email,
        });
     
  
    }
  },

  forgot_passw: async function (req, res) {
    let { email } = req.body;

    console.log(email);

    usertable.findOne({ email: email }, async function (err, user) {
      console.log("user", user);

      console.log("user", user);

      if (err) {
        return res.json("Error On Server");
      } else if (!user) {
        // return res.send({ msg: "Email Not Found" });

        return res.send({
          msg: "Email Not Found.",
          user,
        });
      }

      await usertable.updateOne(
        {
          email: email,
        },
        {
          $set: {
            code: code,
          },
        }
      );

      sendEmail(user.email, user.name, code);

      console.log("sendEmail", code);

      // let mailret = user.email;
      // console.log("mailret", mailret);

      return res.send({
        msg: "Cool Email Found, Redirecting to Change Password",
        user,
      });

      // return res.send({
      //   msg: "Cool Email Found, Redirecting to Change Password",
      //   user,
      // });
    });
  },

  frgtpass_update: async function (req, res) {
    let { email, values } = req.body;

    console.log("emailid", email);
    console.log("token2", values.password);

    let code = values.password;

    let mytb1 = await usertable.findOne({ email });

    console.log("is user is find?", mytb1);

    console.log("is user is find?", mytb1);

    console.log("is user is find?", mytb1.name);

    console.log("is user is find?", mytb1.code);
    
    
    console.log("is user is find?", mytb1.password);


    code = await bcrypt.hash(code, 10);

    if (mytb1) {
    

            let isUpdates =    await usertable.updateOne(
                  {
                    email: email,
                  },
                  {
                    $set: {
                      password: code,
                    },
                  }
                );

                if (isUpdates){
                  return res.send({
                    msg: "Password Updated",
                    isUpdates,
                  });
                }

                return res.send({
                  msg: "Password Not Updated",
                  isUpdates,
                });
              

    }
    
    
  },

  signin_user: function (req, res) {
    let { email, password } = req.body;
    console.log(email);
    console.log(password);

    usertable.findOne({ email: email }, function (err, user) {
      console.log("user", user);

      console.log("user", user);

      console.log("user", user);
      if (err) {
        return res.json("Error On Server");
      } else if (!user) {
        // return res.send({ msg: "Email Not Found" });

        return res.send({
          auth: false,
          token: null,
          msg: "Not available email",
          user,
        });
      }
      // if (!user) return res.status(404).send("Email user is not found.");

      var passwordIsValid = bcrypt.compareSync(
        req.body.password,
        user.password
      );

      var userIsVerifed = user.isVerified;

      console.log("userIsVerifed", userIsVerifed);

      if (passwordIsValid == true) {
        if (userIsVerifed == true) {
          var token = jwt.sign({ id: user._id }, "kjdfadskjhkjkhfnf", {
            expiresIn: 86400, // expires in 24 hours
          });

          return res.send({
            auth: true,
            token: token,
            msg: "Login Successful",
            user,
          });
        } else if (userIsVerifed == false) {
          let mailret = user.email;
          console.log("mailret", mailret);

          console.log("user.name", user.name);
          console.log("user.email", user.email);
          console.log("code", code);

          // sendEmail(user.email, user.name, code);
          // console.log("sendEmail", code);

          return res.send({
            auth: false,
            token: null,
            msg: "NOT Verified, Check Mail, We Already Have Send you Email", // + redirect to verify page
            user,
          });
        }
      }
      //  return res.status(401).send({ auth: false, token: null });

      return res.send({
        auth: false,
        token: null,
        msg: "Password Not Correct",
        user,
      });
    });
  },
  getProfile: function (req, res) {
    usertable.findOne({ _id: req.body.id }, function (err, user) {
      if (err) return res.status(500).send("Error on the server.");
      if (!user) return res.status(404).send("No user found.");

      var token = jwt.sign({ id: user._id }, "kjdfadskjhkjkhfnf", {
        expiresIn: 86400, // expires in 24 hours
      });

      res.status(200).send({ auth: true, token: token, user });
    });
  },

  forget_password: function (req, res) {
    usertable.findOne({ email: req.body.email }, function (error, userData) {
      if (userData == null) {
        return res.status(404).json({
          success: false,
          msg: "Email is not register",
        });
      }
      let transporter = nodemailer.createTransport({
        service: "gmail",
        host: "smtp.gmail.com",
        port: 587,
        // ssl:     true,
        secure: false,
        requireTLS: true,

        auth: {
          user: "MenuMonkey1@gmail.com", // generated ethereal user
          pass: "mymenu12", // generated ethereal password
        },
      });
      var currentDateTime = new Date();
      var mailOptions = {
        from: '"Menu Monkey" <MenuMonkey1@gmail.com>',
        to: req.body.email,
        subject: "Password Reset",
        // text: 'That was easy!',
        html:
          "<h1>Welcome To Menu Monkey Reset Password ! </h1><p>\
      <h3>Hello " +
          userData.name +
          "</h3>\
      If You are requested to reset your password then click on below link <br/>\
      <h2> http://localhost:6000/resetpassword/" +
          currentDateTime +
          "+++" +
          userData.email +
          "'Click On This Link</h2>\
      </p>",
      };

      transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
          console.log(error);
        } else {
          console.log("Email sent: " + info.response);
          usertable.updateOne(
            { email: userData.email },
            {
              token: currentDateTime,
            },
            { multi: true },
            function (err, affected, resp) {
              return res.status(200).json({
                success: false,
                msg: info.response,
                userlist: resp,
              });
            }
          );
        }
      });
    });
  },

  reset_password: function (req, res) {
    usertable.findOne(
      { email: req.body.email },
      function (errorFind, userData) {
        if (userData.token == req.body.linkDate) {
          bcrypt.genSalt(10, (errB, salt) => {
            bcrypt.hash(req.body.password, salt, (err, hash) => {
              if (err) throw err;
              let newPassword = hash;
              let condition = { _id: userData._id };
              let dataForUpdate = {
                password: newPassword,
                updatedDate: new Date(),
              };
              usertable.findOneAndUpdate(
                condition,
                dataForUpdate,
                { new: true },
                function (error, updatedUser) {
                  if (error) {
                    if (err.name === "MongoError" && error.code === 11000) {
                      return res
                        .status(500)
                        .json({ msg: "Mongo Db Error", error: error.message });
                    } else {
                      return res.status(500).json({
                        msg: "Unknown Server Error",
                        error: "Unknow server error when updating usertable",
                      });
                    }
                  } else {
                    if (!updatedUser) {
                      return res.status(404).json({
                        msg: "usertable Not Found.",
                        success: false,
                      });
                    } else {
                      return res.status(200).json({
                        success: true,
                        msg: "Your password are Successfully Updated",
                        updatedData: updatedUser,
                      });
                    }
                  }
                }
              );
            });
          });
        }
        if (errorFind) {
          return res.status(401).json({
            msg: "Something Went Wrong",
            success: false,
          });
        }
      }
    );
  },

  Guest: function (req, res) {
    const { first_name, last_name, email, number } = req.body;
    console.log(req.body);
    const Guestss = new Guest({
      first_name: first_name,
      last_name: last_name,
      email: email,
      number: number,
    });

    Guestss.save((err, success) => {
      if (err) {
        console.log(err);
      } else {
        return res.json({ msg: "success" });
      }
    });
  },
};

module.exports = Auth;
