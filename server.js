import express from "express";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 10000;

/* ====== ХРАНИЛИЩЕ ====== */
const users = {}; 
/*
users[userId] = {
  score: 0,
  multiplier: 1,
  multEnd: 0
}
*/

/* ====== ПОЛУЧИТЬ ПРОФИЛЬ ====== */
app.get("/profile/:id", (req, res) => {
  const id = req.params.id;

  if (!users[id]) {
    users[id] = { score: 0, multiplier: 1, multEnd: 0 };
  }

  res.json(users[id]);
});

/* ====== ТАП ====== */
app.post("/tap", (req, res) => {
  const { id } = req.body;

  if (!users[id]) {
    users[id] = { score: 0, multiplier: 1, multEnd: 0 };
  }

  const now = Date.now();
  if (users[id].multEnd < now) {
    users[id].multiplier = 1;
  }

  users[id].score += users[id].multiplier;
  res.json(users[id]);
});

/* ====== МАГАЗИН ====== */
app.post("/buy", (req, res) => {
  const { id, type } = req.body;
  const user = users[id];
  if (!user) return res.status(400).json({ error: "no user" });

  const now = Date.now();

  if (type === "x2" && user.score >= 500) {
    user.score -= 500;
    user.multiplier = 2;
    user.multEnd = now + 10 * 60 * 1000;
  }

  if (type === "x5" && user.score >= 3000) {
    user.score -= 3000;
    user.multiplier = 5;
    user.multEnd = now + 10 * 60 * 1000;
  }

  res.json(user);
});

/* ====== ЛИДЕРБОРД ====== */
app.get("/leaderboard", (req, res) => {
  const top = Object.entries(users)
    .map(([id, u]) => ({ id, score: u.score }))
    .sort((a, b) => b.score - a.score)
    .slice(0, 10);

  res.json(top);
});

app.listen(PORT, () => {
  console.log("🔥 Anime Tap Server работает!");
});
