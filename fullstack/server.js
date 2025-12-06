const express = require("express");
const userRoutes = require("./routes/user.routes");
const cors = require("cors");
require('./db/db.connect');
const app = express();
app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
app.use("/user", userRoutes);
app.listen(3000, () => {
  console.log("server is runnig on port 3000");
});
