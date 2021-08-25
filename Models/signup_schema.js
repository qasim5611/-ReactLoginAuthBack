const mongoose = require("mongoose");

const schema = mongoose.Schema;

const Signup = new schema(
  {
    id: {
      type: String,
    },
    name: {
      type: String,
    },

    email: {
      type: String,
    },

    password: {
      type: String,
    },

    isVerified: {
      type: Boolean,
      default: false,
    },

    code: {
      type: String,
    },
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
  }
);

module.exports = mongoose.model("Signup", Signup);
