import mongoose from "mongoose";
const Schema = mongoose.Schema;

const SaveRecordsSchema = new Schema({

    N_level: {
        type: Number,
        required: [true, "Please enter the N level"]
    },
    P_level: {
        type: Number,
        required: [true, "Please enter the P level"]
    },
    K_level: {
        type: Number,
        required: [true, "Please enter the K level"]
    },
    record_id: {
        type: Number,
        required: [true, "Please enter the record id"]
    },
    fertilizer: {
        type: String,
        required: [true, "Please enter the fertilizer"]
    },
    quantity: {
        type: Number,
        required: [true, "Please enter the quantity"]
    },
    age: {
        type: Number,
        required: [true, "Please enter the age"]
    },
    savedDate: {
        type: String,
        required: true
    },
    savedTime: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: [true, "Please enter the email"]
    },

},
    {
        timestamps: true
    }
);

const SaveRecords = mongoose.model("SaveRecords", SaveRecordsSchema);
export default SaveRecords;