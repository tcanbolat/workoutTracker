const express = require("express");
const logger = require("morgan");
const mongoose = require("mongoose");

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://<dbuser>:<dbpassword>@ds239967.mlab.com:39967/heroku_pjhn1xrj";
const PORT = process.env.PORT || 3000;

const db = require("./models");

const app = express();

app.use(logger("dev"));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(express.static("public"));

mongoose.connect(MONGODB_URI || "mongodb://localhost/workout", {
  useNewUrlParser: true
});

///////////// HTML ROUTES /////////////
app.get("/stats", (req, res) => {
  res.redirect("./stats.html");
});

app.get("/exercise", (req, res) => {
  res.redirect("./exercise.html");
});

///////////// API ROUTES /////////////

///////////// ROUTE FOR GETTING ALL WORKOUTS /////////////
app.get("/api/workouts/", (req, res) => {
  //console.log(req);
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
  db.Workout.findByIdAndUpdate({ _id: id }, { $push: { exercises: body } })
    .then(dbWorkout => {
      res.json(dbWorkout);
      console.log(dbWorkout);
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
  console.log(err);
  })
 // db.Workout.aggregate([{ $group: { _id: 'id', name: { $max: '$name' } } }])
  // db.Workout.find({}, (err, data) => {

  // // for (let i = 0; i < data; i++) {
  // // }
  // data.map(workDB => {
  //   console.log(workDB);
  // })
  // })
    .then(dbWorkout => {
      // console.log(dbWorkout);
      // console.log(dbWorkout.length);
      // for(let i =0; i < dbWorkout.length; i++) {
      //   console.log(dbWorkout[i].exercises);
      // }
      res.json(dbWorkout);
    })
    .catch(err => {
      console.log(err);
    });
});

app.listen(PORT, () => {
  console.log(`App running on port ${PORT}!`);
});
