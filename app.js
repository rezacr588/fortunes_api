const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const fortunes = require('./data/fortunes.json')
const app = express();
const port = 3000;
function writeFortunes(json) {
  fs.writeFile("./data/fortunes.json", JSON.stringify(json), err => console.log(err));
}
app.use(bodyParser.json());
app.get("/fortunes", (req, res) => {
  res.json(fortunes);
})
app.get("/fortunes/random", (req,res) => {
  res.send(fortunes[Math.floor(Math.random() * fortunes.length)])
})
app.get("/fortunes/:id", (req, res) => {
  res.send(fortunes.find(f => f.id == req.params.id));
})
app.post("/fortunes", (req, res) => {
  const {message,
    luck_number,
    spirit_animal } = req.body;
  const fortunes_ids = fortunes.map(f => f.id);
  const new_fortunes = fortunes.concat({
    id: (fortunes_ids.length > 0 ? Math.max(...fortunes_ids) : 0) + 1,
    message,
    luck_number,
    spirit_animal
  });
  fs.writeFile("./data/fortunes.json", JSON.stringify(new_fortunes), err => console.log(err));
  res.send(new_fortunes);
})
app.put("/fortunes/:id", (req, res) => {
  const { id } = req.params;
  const old_fortune = fortunes.find(f => f.id == id);
  [
    "message",
    "luck_number",
    "spirit_animal"
  ].forEach(key => {
      if (req.body[key]) old_fortune[key] = req.body[key];
    });
  writeFortunes(fortunes);
  res.json(fortunes);
})
app.delete("/fortunes/:id", (req, res) => {
  const { id } = req.params;
  const new_fortunes = fortunes.filter(f => f.id != id);
  writeFortunes(new_fortunes);
  res.send(new_fortunes);
})
module.exports = app;