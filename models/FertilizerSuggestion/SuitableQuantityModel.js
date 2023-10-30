import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const SuitableQuantitySchema = new Schema({

    ageLowerLimit: {
        type: Number,
        required: [true,"Please enter the age lower limit"]
    },
    ageUpperLimit: {
        type: Number,
        required: [true,"Please enter the age upper limit"]
    },
    N_upperLimit: {
        type: Number,
        required: [true,"Please enter the N upper limit"]
    },
    N_lowerLimit: {
        type: Number,
        required: [true,"Please enter the N lower limit"]
    },
    P_upperLimit: {
        type: Number,
        required: [true,"Please enter the P upper limit"]
    },
    P_lowerLimit: {
        type: Number,
        required: [true,"Please enter the P lower limit"]
    },
    K_upperLimit: {
        type: Number,
        required: [true,"Please enter the K upper limit"]
    },
    K_lowerLimit: {
        type: Number,
        required: [true,"Please enter the K lower limit"]
    },
    growthStage: {
        type: String,
        required: [true,"Please enter the growth stage"]
    }

});

const SuitableQuantity = mongoose.model('SuitableQuantity', SuitableQuantitySchema);
export default SuitableQuantity;



