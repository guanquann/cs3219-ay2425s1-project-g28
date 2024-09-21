import mongoose, { Schema, Document } from "mongoose";

export interface IUser extends Document {
  username: string;
  email: string;
  password: string;
  createdAt?: Date;
  isAdmin: boolean;

  profile_picture_url?: string;
  first_name?: string;
  last_name?: string;
  biography?: string;
}

const UserModelSchema: Schema<IUser> = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now, // Setting default to the current date/time
  },
  isAdmin: {
    type: Boolean,
    required: true,
    default: false,
  },
  profile_picture_url: {
    type: String,
    required: false,
  },
  first_name: {
    type: String,
    required: false,
  },
  last_name: {
    type: String,
    required: false,
  },
  biography: {
    type: String,
    required: false,
    default: "Hello World!",
  },
});

const UserModel = mongoose.model<IUser>("UserModel", UserModelSchema);

export default UserModel;
