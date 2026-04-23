const express = require("express");
const app = express();
const PORT = 3000;
const hobbies = ["coding", "reading", "cycling"];
const student = {
  name: "Alex",
  hobbies: ["coding", "reading", "cycling"],
  intro: "Hi, I'm Alex, a Year 2 student passionate about building APIs!",
};
app.get("/", (req, res) => {
  res.send("Welcome to Homework API");
});

app.get("/intro", (req, res) => {
  res.send("Returns a short introduction about yourself");
});

app.get("/name", (req, res) => {
  res.send("Returns your name");
});

app.get("/hobbies", (req, res) => {
  res.json(hobbies);
});

app.get("/food", (req, res) => {
  res.send("Returns your favourite foods");
});

app.get("/student", (req, res) => {
  res.send(student);
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
