const express = require("express");
const cors = require("cors");
const app = express();

app.use(cors());
app.use(express.json());

const users = {};

function getUser(id){
if(!users[id]){
users[id]={id,score:0,power:1,lastTap:0};
}
return users[id];
}

app.get("/state",(req,res)=>{
const u=getUser(req.query.id);
res.json(u);
});

app.post("/tap",(req,res)=>{
const u=getUser(req.body.id);
const now=Date.now();
if(now-u.lastTap<100) return res.json(u); // античит
u.lastTap=now;
u.score+=u.power;
res.json(u);
});

app.get("/leaderboard",(req,res)=>{
res.json(
Object.values(users)
.sort((a,b)=>b.score-a.score)
.slice(0,10)
);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT,()=>console.log("Server running"));
