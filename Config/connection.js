const mongoose = require("mongoose");

const connectDb = async () => {
  mongoose
    .connect(process.env.MONOGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
    })
    .then((res) => console.log(`Db connected on ${res.connection.user}`));
};
module.exports = connectDb;
