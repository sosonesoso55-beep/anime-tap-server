const express = require("express");
const app = express();

const PORT = process.env.PORT || 3000;

// middleware
app.use(express.json());

// test route
app.get("/", (req, res) => {
  res.send("🔥 Anime Tap Server работает!");
});

// leaderboard example
let leaderboard = [];

app.post("/score", (req, res) => {
  const { user, score } = req.body;

  if (!user || typeof score !== "number") {
    return res.status(400).json({ error: "Invalid data" });
  }

  leaderboard.push({ user, score });
  leaderboard.sort((a, b) => b.score - a.score);
  leaderboard = leaderboard.slice(0, 10);

  res.json({ success: true });
});

app.get("/leaderboard", (req, res) => {
  res.json(leaderboard);
});

// START SERVER
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
