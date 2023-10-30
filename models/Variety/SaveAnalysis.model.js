import mongoose from "mongoose";

const mangoSchema = new mongoose.Schema({
  cost: Number,
  selectedMonth: String,
  freshMangoes: Number,
  damagedMangoes: Number,
});

const Mango = mongoose.model("Mango", mangoSchema);
export default Mango;
