import mongoose, { Schema } from "mongoose";
import * as dotenv from "dotenv";
import Joi from "joi";

dotenv.config();

mongoose
  .connect(process.env.MONGODB_P)
  .then(() => {
    console.log("Ok, Go On");
  })
  .catch(() => {
    console.log("Have Error with Mongodb connect  ");
  });

const logINSchema = new mongoose.Schema({
  FirstName: {
    type: String,
    required: [true, "FirstName is required"],
    minlength: 5,
    maxlength: 50,
  },
  LastName: {
    type: String,
    required: [true, "LastName is required"],
    minlength: 5,
    maxlength: 50,
  },
  password: {
    type: String,
    required: true,
    minlength: 4,
    maxlength: 160,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
});

const collection = mongoose.model("collection", logINSchema);

function validate1(values) {
  const userinfoss = Joi.object({
    FirstName: Joi.string().min(5).max(50),
    LastName: Joi.string().min(5).max(50),
    password: Joi.string().required().min(4).max(160),
    email: Joi.string().required(),
  });
  return userinfoss.validate(values);
}

//Products save in Mongodb

const productShema = new mongoose.Schema(
  {
    title: { require: true, type: String },
    description: { type: String, required: true },
    image: { type: String, required: true },
    price: { type: Number, required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "collection" },
  },
  { timestamps: true }
);

const ProductModel = mongoose.model("ProductModel", productShema);

export { collection, validate1, ProductModel };
