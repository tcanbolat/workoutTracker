const express = require("express");
const logger = require("morgan");
const mongoose = require("mongoose");
const path = require("path");

const PORT = process.env.PORT || 3000;

const db = require("./models");

const app = express();

app.use(logger("dev"));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(express.static("public"));

mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost/workout", {
  useNewUrlParser: true
});

//require("./seeders/seed");
///////////// HTML ROUTES /////////////
app.get("/stats", (req, res) => {
  res.sendFile(path.join(__dirname, "/public/stats.html"));
});

app.get("/exercise", (req, res) => {
  res.sendFile(path.join(__dirname, "/public/exercise.html"));
});

///////////// API ROUTES /////////////

///////////// ROUTE FOR GETTING ALL WORKOUTS /////////////
app.get("/api/workouts/", (req, res) => {
  db.Workout.find({})
    .then(dbWorkout => {
      res.json(dbWorkout);
    })
    .catch(err => {
      console.log(err);
    });
});

///////////// ROUTE FOR CREATING A NEW WORKOUT /////////////
app.post("/api/workouts/", (req, res) => {
  db.Workout.create({})
    .then(dbWorkout => {
      res.json(dbWorkout);
    })
    .catch(err => {
      console.log(err);
    });
});

/////////// ROUTE FOR LOGGING A WORKOUT /////////////
app.put("/api/workouts/:id", (req, res) => {
  const id = req.params.id;
  const body = req.body;
  console.log(id);
  console.log(body);
  db.Workout.findOneAndUpdate({ _id: id }, { $push: { exercises: body } })
    .then(dbWorkout => {
      res.json(dbWorkout);
    })
    .catch(err => {
      console.log(err);
    });
});

///////////// ROUTE FOR WORKOUT RANGE /////////////
app.get("/api/workouts/range", (req, res) => {
  db.Workout.find({}, (err, data) => {
    console.log("/workuts/range is hit");
    console.log(data);
  })
    .then(dbWorkout => {
      res.json(dbWorkout);
    })
    .catch(err => {
      console.log(err);
    });
});

app.listen(PORT, () => {
  console.log(`App running on port ${PORT}!`);
});
