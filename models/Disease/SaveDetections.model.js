import mongoose from "mongoose";
const Schema = mongoose.Schema;

const DiseaseDetails = new Schema({
  class: {
    type: String,
    required: true,
  },
  affectedAreaPercentage: {
    type: Number,
    required: true,
  },
});

const SaveDetectionsSchema = new Schema(
  {
    mainDisease: {
      type: String,
      required: true,
    },
    diseasesInfo: {
      type: [DiseaseDetails],
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

const SaveDetections = mongoose.model("SaveDetections", SaveDetectionsSchema);
export default SaveDetections;

//give me a sample json
// {
//   "mainDisease": "Anthracnose",
//   "diseasesInfo": [
//     {
//       "class": "Anthracnose",
//       "affectedAreaPercentage": 25.98
//     },
//     {
//       "class": "Sooty Mold",
//       "affectedAreaPercentage": 74.02
//     }
//   ],
//   "image": "https://res.cloudinary.com/waste123/image/upload/v1691680008/yuyntgfmipxtqibwyfjd.jpg"
// }
