import SaveRecords from "./../../models/FertilizerSuggestion/SaveRecordsModel.js"

// Controller function to save data to the database
export const saveRecord = async (req, res) => {
  try {
    const newRecord = new SaveRecords(req.body);
    const savedRecord = await newRecord.save();
    res.status(201).json(savedRecord);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Controller function to retrieve data from the database based on record_id
export const getRecordById = async (req, res) => {
  const recordId = req.params.record_id;
  try {
    const record = await SaveRecords.findOne({ record_id: recordId });
    res.status(200).json(record);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

//Get last record
export const getLastRecord = async (req, res) => {
  try {
    const lastRecord = await SaveRecords.findOne({}, null, { sort: { _id: -1 } });
    if (!lastRecord) {
      res.status(200);
      return 1;
    }
    res.status(200).json(lastRecord);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

//get all records
export const getAllRecords = async (req, res) => {
  try {
    const allRecords = await SaveRecords.find();
    if (!allRecords) {
      res.status(200).json({ message: "No Any Records" });
      return;
    }
    res.status(200).json(allRecords);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}