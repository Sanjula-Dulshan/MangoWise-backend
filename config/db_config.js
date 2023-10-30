import mongoose from "mongoose";
import chalk from "chalk";

//Database connection
const connectDB = async () => {
  await mongoose
    .connect(process.env.DATABASE, {
      useUnifiedTopology: true,
      useNewUrlParser: true,
    })
    .then(() => {
      console.log(chalk.blue.bold("[Server]")+ " : " +chalk.yellow.bold("MongoDB") +chalk.green.bold(" Connected..."));
    })
    .catch((err) => {
      console.log(chalk.blue.bold('[Server]') + chalk.white.bold(' : ') + chalk.red.bold('MongoDB connection Failed...') + ' ' + chalk.white.bold(err.message));
      process.exit();
    });
};
export default connectDB;
