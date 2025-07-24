import express from "express"
import cors from "cors";
import env from "./config/env.js";
import router from "./routes/index.js";
const app = express();

const { PORT } = env;

// Middleware
app.use(cors());
app.use(express.json());


app.get("/", (req, res) => {
    res.status(200).json({ status: true, statusCode: 200, message: "Salesforce agent script working fine.", data: {} })
})
app.use("/api", router)

app.use(/(.*)/, (req, res) => {
    res.status(400).json({ status: false, statusCode: 404, message: "Request route not found." })
})

// Start Server
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});