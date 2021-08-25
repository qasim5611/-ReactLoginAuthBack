const nodemailer = require("nodemailer");

// let testAccount = await nodemailer.createTestAccount();

var smtpTransport = nodemailer.createTransport({
  service: "gmail",
  host: "smtp.gmail.com",
  port: 587,
  // ssl:     true,
  secure: false,
  requireTLS: true,
  auth: {
    user: "qasimtahir5611@gmail.com",
    pass: "qasimtahir",
  },
});

const sendmail = async (email, name, code) => {
  console.log('code', code);
  mailOptions = {
    from: `"Verify Your Accout by Token" <qasimtahir5611@gmail.com>`,
    to: `${email}`,
    subject: "Please Vrifiy your Email account",
    html: `
     <h3 style="font-family: cursive">Hy ${name} TechSchema wansts to Verify your Email by Token... </h3>
     <h3>${code}</h3>`,
  };
  console.log(mailOptions);
  smtpTransport.sendMail(mailOptions, function (error, response) {
    if (error) {
      console.log(error);
      return error;
    } else {
      console.log(response);
      return response;
    }
  });
};
module.exports = sendmail;
