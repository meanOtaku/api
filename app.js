const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");

const app = express();
const port = process.env.PORT || 5000
app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(express.static('public'));
app.use(bodyParser.json());
const dbURI = 'mongodb+srv://Cherag:racoon2004R@cluster0.qbqdg.mongodb.net/myFirstDatabase?retryWrites=true&w=majority';
mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex:true })
  .then((result) => app.listen(port, function(){
      console.log("Server Running");
  }))
  .catch((err) => console.log(err));

mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);


const curriculumSchema = new mongoose.Schema({
    heading: {
        type: String,
        //required: true
    },
    modules: String
})

const courseSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    AgeGroupRecommendation: String,
    content: {
        type: String,
        minlength: 55,
        required: true
    },
    curriculum: [curriculumSchema]
})

const Course = mongoose.model("Course", courseSchema);

//COURSE ROUTE--------------------------------------------------------------------
//finished whole route
app.route("/course")

.get(function(req, res){
    Course.find(function(err, foundCourses){
        if(!err){
            console.log("Course Sended");
            res.send(foundCourses);
        }else{
            res.send(err);
        }
    });
})

.post(function(req, res){
    console.log(req.body);
    const newCourse = new Course({
        title: req.body.title.trim(),
        content: req.body.content.trim(),
        AgeGroupRecommendation: req.body.AgeGroupRecommendation.trim()
    })

    newCourse.save(function(err){
        if(!err){
            console.log("added course");
            res.send("successfully added a new course");
        }else{
            console.log(err);
            res.send(err);
        }
    });
})

.delete(function(req, res){
    Course.deleteMany(function(err){
        if(!err){
            res.send("Successfully deleted all courses");
        }else{
            res.send(err);
        }
    });
});


//Inside Course------------------------------------------------------------------------
app.route("/course/:courseTitle")

//finished
.get(function(req, res){
    Course.findOne({title: req.params.courseTitle}, function(err, foundCourse){
        if(foundCourse){
            res.send(foundCourse);
        }else{
            res.send("No course matching");
        }
    });
})


.put(function(req, res){
    Course.updateOne(
        {title: req.params.courseTitle},
        {title: req.body.title.trim(), content: req.body.content.trim()},
        {overwrite: true},
        function(err){
            if(!err){
                res.send("successfully Edited");
            }
        }
    );
})

//finished
.patch(function(req, res){
    Course.updateOne(
        {title: req.params.courseTitle},
        {$push: {curriculum: {heading: req.body.heading.trim(), modules: req.body.modules.trim()}}},
        function(err){
            if(!err){
                console.log(req.body);
                console.log("Updated")
                res.send("Updated");
            }else{
                res.send("Unable to update");
            }
        }
    );
})

//finished
.delete(function(req, res){

    Course.deleteOne(
      {title: req.params.courseTitle},
      function(err){
        if (!err){
            console.log(req.params.courseTitle);
            res.send("Successfully deleted the corresponding course.");
        } else {
            res.send(err);
        }
      }
    );
  });

//Inside course and inside module------------------------------------------------------

app.route("/course/:courseTitle/:moduleTitle")

  .patch(function(req, res){
      Course.findOneAndUpdate(
        {curriculum: {heading: req.params.moduleTitle}},
        {$push: {curriculum: {modules: req.body.name.trim()}}},
        function(err){
            if(!err){
                console.log(req.body);
                res.send("Module updated");
            }
        }
      )
  })

//finished
  .delete(function(req, res){
    Course.updateOne(
        {title: req.params.courseTitle},
        {$pull: {curriculum: {heading: req.params.moduleTitle}}},
        function(err){
            if(!err){
                console.log(req.params.moduleTitle);
                res.send("Module deleted");
            }
        }
    )
  });


