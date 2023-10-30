import mongoose from "mongoose";
const Schema = mongoose.Schema;


const SaveBudDetectionsSchema = new Schema(
  {
    class: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const SaveBudDetections = mongoose.model("SaveBudDetections", SaveBudDetectionsSchema);
export default SaveBudDetections;

