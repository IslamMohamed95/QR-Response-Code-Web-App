const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcrypt");

const adminSchema = new mongoose.Schema(
  {
    userName: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    email: {
      type: String,
      required: true,
      validator(value) {
        if (!validator.isEmail(value)) throw new Error("Invalid Email");
      },
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
      trim: true,
    },
    role: {
      type: String,
      default: "admin",
    },

    site: {
      type: String,
      enum: [
        " ",
        "مركز مزيد",
        "مركز الهير",
        "مركز وسط المدينة",
        "مركز المقام",
        "مركز الوقن",
      ],

      required: true,
    },
    master: {
      type: Boolean,
      require: true,
      default: false,
    },
    pin: {
      type: String,
      default: "",
    },

    tokens: [{ token: { type: String, required: true } }],
  },

  {
    timestamps: true,
  }
);

/*--------- hide __v from Database---------*/
adminSchema.methods.toJSON = function () {
  const admin = this.toObject();
  const deletedItem = ["password", "__v"];
  deletedItem.forEach((item) => delete admin[item]);
  return admin;
};

/*----------- encrypt the user password --------*/
adminSchema.pre("save", async function () {
  const admin = this;
  if (admin.isModified("password"))
    admin.password = await bcrypt.hash(admin.password, 10);
});

const adminModel = mongoose.model("admins", adminSchema);
module.exports = adminModel;
