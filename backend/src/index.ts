import express from "express";
import path from "path";

const app = express();

// Serve the React app
app.use(express.static(path.join(__dirname, "../frontend/build")));

app.get("/", (req, res) => {
	res.send("hello world")
	// res.sendFile(path.join(__dirname, "../frontend/build", "index.html"));
});

app.listen(5000, () => {
	console.log("Backend server is running on http://localhost:5000");
});
