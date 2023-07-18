const mongoose = require("mongoose");
mongoose.set('strictQuery', true);
const connectDB = async () => {
  try {
    // mongodb connection string
    await mongoose.connect(process.env.DB_CONNECT, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log(`MongoDB connected `);
  } catch (err) {
    console.log(err);
    process.exit(1);
  }
};

module.exports = connectDB;