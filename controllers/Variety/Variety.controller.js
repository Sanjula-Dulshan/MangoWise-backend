import Detections from "../../models/Variety/SaveVarietyDetections.model.js";

export const saveVarietyDetection = async (req, res) => {
  try {
    const newDetection = new Detections(req.body);
    const savedDetection = await newDetection.save();
    res.status(201).json(savedDetection);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getDetections = async (req, res) => {
  try {
    const detections = await Detections.find({}, { __v: 0 }).sort({
      createdAt: -1,
    });
    res.status(200).json(detections);
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};
