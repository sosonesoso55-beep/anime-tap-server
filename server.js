const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

let users = {};
let lastTap = {};

app.post("/tap", (req, res) => {
  const { userId } = req.body;
  const now = Date.now();

  if (!lastTap[userId]) lastTap[userId] = 0;

  // АНТИЧИТ: максимум 5 тапов в секунду
  if (now - lastTap[userId] < 200) {
    return res.status(429).json({ error: "Too fast" });
  }

  lastTap[userId] = now;
  users[userId] = (users[userId] || 0) + 1;

  res.json({ score: users[userId] });
});

app.get("/top", (req, res) => {
  const top = Object.entries(users)
    .sort((a,b)=>b[1]-a[1])
    .slice(0,5);
  res.json(top);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("Server started"));
