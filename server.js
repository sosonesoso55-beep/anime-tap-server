const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 10000;

/* ===== ХРАНИЛИЩЕ ===== */
const users = {};

/* ===== ЦЕНЫ ===== */
const PRICES = {
  x2: 50,
  x5: 120,
  auto: 80,
  p1: 60,
  p2: 120,
  crit: 150
};

/* ===== ВСПОМОГАТЕЛЬНОЕ ===== */
function getUser(id){
  if(!users[id]){
    users[id]={
      score:0,
      coins:0,
      power:1,
      crit:0,
      mult:1,
      multUntil:0,
      autoUntil:0,
      lastTap:0
    };
  }
  return users[id];
}

/* ===== ПРОФИЛЬ ===== */
app.get("/me",(req,res)=>{
  const u=getUser(req.query.id);
  res.json(u);
});

/* ===== ТАП ===== */
app.post("/tap",(req,res)=>{
  const {id}=req.body;
  const u=getUser(id);
  const now=Date.now();

  // античит: не чаще 1 тапа / 80мс
  if(now-u.lastTap<80){
    return res.json(u);
  }
  u.lastTap=now;

  // множитель по времени
  let mult = (now<u.multUntil) ? u.mult : 1;

  // крит
  let add = u.power * mult;
  if(Math.random()<u.crit){
    add*=3;
  }

  u.score += add;
  u.coins += Math.ceil(add/2);

  res.json(u);
});

/* ===== ПОКУПКИ ===== */
app.post("/buy",(req,res)=>{
  const {id,type}=req.body;
  const u=getUser(id);

  if(!PRICES[type]) return res.json(u);
  if(u.coins<PRICES[type]) return res.json(u);

  u.coins-=PRICES[type];
  const now=Date.now();

  if(type==="x2"){
    u.mult=2;
    u.multUntil=now+10*60*1000;
  }
  if(type==="x5"){
    u.mult=5;
    u.multUntil=now+10*60*1000;
  }
  if(type==="auto"){
    u.autoUntil=now+5*60*1000;
  }
  if(type==="p1") u.power+=1;
  if(type==="p2") u.power+=2;
  if(type==="crit") u.crit+=0.1;

  res.json(u);
});

/* ===== АВТОТАП ===== */
setInterval(()=>{
  const now=Date.now();
  for(const id in users){
    const u=users[id];
    if(now<u.autoUntil){
      let mult = (now<u.multUntil) ? u.mult : 1;
      let add = u.power * mult;
      u.score+=add;
      u.coins+=Math.ceil(add/2);
    }
  }
},1000);

/* ===== ЛИДЕРБОРД ===== */
app.get("/leaderboard",(req,res)=>{
  const top=Object.values(users)
    .sort((a,b)=>b.score-a.score)
    .slice(0,10);
  res.json(top);
});

/* ===== СТАРТ ===== */
app.listen(PORT,()=>console.log("Server running on",PORT));
