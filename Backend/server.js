require("dotenv").config({ path: ".env" });
const bodyParser = require("body-parser");
const express = require("express");
const app = express();
// const { upload, uploads } = require("./untils/multer");

const cors = require("cors");
const connectDB = require("./connection");
const { uploads } = require("./untils/multer");

//PORT
const PORT = process.env.PORT || 5000;

// //connect database
connectDB();

// //midleware
app.use(uploads);

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use("/auth", require("./src/auth/route"));
app.use("/social", require("./src/user/route"));
app.use("/files", require("./src/files/route"));
app.use("/story", require("./src/post/route"));
app.use("/job", require("./src/task/route"));
// app.use("/product", require("./routes/product-route/productRoute"));
// app.use("/order", require("./routes/order-route/orderRoute"));
// app.use("/post", require("./routes/post-route/postRoute"));

app.listen(PORT, () => {
  console.log(`server run on http://localhost:${PORT}`);
});
