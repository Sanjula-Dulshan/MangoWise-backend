import axios from "axios";
import Detection from "../../models/Bud/SaveBudDetections.model.js";

export const detectSuitability = async (req, res) => {
    console.log("Detecting Suitability");
  
    // Get the base64 image from the request body
    const { image } = req.body;
  
    if (!image) {
      return res.status(400).json({ error: "Image is required" });
    }
  
    try {
      console.log("calling deployed cnn model");
  
      // Create a FormData object to send the image as a file with the name 'file'
      const formData = new FormData();
      formData.append("file", {
        uri: image.uri, // Assuming 'uri' is the file URI of the image
        type: "image/jpeg", // Adjust the image type if needed
        name: "image.jpg", // Adjust the file name if needed
      });
  
      // Call deployed cnn model
      const response = await axios.post(
        "https://us-central1-mangowise-395709.cloudfunctions.net/bud_predict",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data", // Important for sending files
          },
        }
      );
  
      const imageData = response.data;
  
      // Log the response
      console.log(imageData);
  
      res.status(200).json({ message: "Success", imageData });
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: "Internal server error" });
    }
  };

  export const saveImage = async (req, res) => {
    console.log("Saving Image");
    try {
      const newDetection = new Detection(req.body);
      const savedDetection = await newDetection.save();

      console.log("Saved: ",savedDetection);
      res.status(201).json(savedDetection);
    } catch (error) {
      console.log(error.message);
      res.status(500).json({ error: error.message });
    }
  };

  export const getDetections = async (req, res) => {
    console.log("Getting Detections");
    try {
      const detections = await Detection.find({}, { __v: 0, createdAt: 0 }).sort({
        createdAt: -1,
      });
      res.status(200).json(detections);
    } catch (error) {
      console.log(error);
      res.status(500).json(error);
    }
  }
  
    
  