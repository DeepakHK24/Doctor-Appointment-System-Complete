const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: String,

    email: { type: String, unique: true },

    password: String,

    role: {
      type: String,
      enum: ["admin", "doctor", "patient"],
      default: "patient",
    },

    isApproved: {
      type: Boolean,
      default: function () {
        return this.role !== "doctor"; 
      },
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);