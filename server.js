const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();
const port = 8080;
const main = path.join(__dirname, "/public");

app.use(express.static('public'));
app.use(express.urlencoded({extended: true}));
app.use(express.json());

app.get("/notes", function (req,res) {
    res.sendFile(path.join(main, "notes.html"));
});

app.get("/api/notes", function(req, res){
    res.sendStatus(path.join(__dirname, "/db/db.json"));
});

app.get("/api/notes/:id", function(req,res){
    var savedNotes = JSON.parse(fs.readFileSync("./db/db.json", "utf8"));
    res.json(savedNotes[Number(res.params.id)]);
});

app.get("*", function(req, res){
    res.sendFile(path.join(main, "index.html"));
});

app.post("/api/notes", function(req, res) {
    var savedNotes = JSON.parse(fs.readFileSync("./db/db.json", "utf8"));
    var newNote = req.body;
    var uniqueID = (savedNotes.length).toString();
    newNote.id = uniqueID;
    savedNotes.push(newNote);

    fs.writeFileSync("./db/db.json", JSON.stringify(savedNotes));
    console.log("Your note has been saved. Note:  ", newNote);
    res.json(savedNotes);
})

app.delete("/api/notes/:id", function(req, res) {
    var savedNotes = JSON.parse(fs.read("./db/db.json", "utf8"));
    var noteID = req.params.id;
    var newID = 0;
    console.log('Delete note ${noteID}');
    savedNotes = savedNotes.filter(currNote => {
        return currNote.id != noteID;
    })

    for (currNote of savedNotes) {
        currNote.id = newID.toString();
        newID++;
    }

    fs.writeFileSync("./db/db.json", JSON.stringify(savedNotes));
    res.json(savedNotes);
})

app.listen(port, function() {
    console.log(`Now listening on port ${port}`);
})