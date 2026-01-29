const express = require("express")
const app = express()
app.use(express.json())

let users = {}

app.post("/tap", (req,res)=>{
  const {id,count}=req.body
  if(!users[id]) users[id]={coins:0,last:Date.now()}
  const now=Date.now()
  if(now-users[id].last<80) return res.status(403).send("cheat")
  users[id].coins+=count
  users[id].last=now
  res.json({coins:users[id].coins})
})

app.get("/leaderboard",(req,res)=>{
  const top=Object.entries(users)
    .sort((a,b)=>b[1].coins-a[1].coins)
    .slice(0,10)
  res.json(top)
})

app.listen(3000,()=>console.log("SERVER OK"))
