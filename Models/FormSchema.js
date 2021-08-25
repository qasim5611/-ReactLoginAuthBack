const mongoose = require("mongoose");

const schema = mongoose.Schema;

const Form = new schema(
  {
    id: {
      type: String,
    },
    name: {
      type: String,
    },

    phone: {
      type: String,
    },
    
    image: {
      type: String,
    },
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
  }
);

module.exports = mongoose.model("Form", Form);
