const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(express.static('public'));
app.use(express.json());
mongoose.connect("mongodb://localhost:27017/courseDB", {useNewUrlParser: true, useUnifiedTopology: true});

const moduleSchema = {
    name: {
        type: Array,
        //required: true
    }
}


const curriculumSchema = {
    heading: {
        type: String,
        //required: true
    },
    modules: [moduleSchema]
}

const courseSchema = {
    title: {
        type: String,
        required: true
    },
    AgeGroupRecommendation: String,
    content: {
        type: String,
        required: true
    },
    curriculum: [curriculumSchema]
}

const Course = mongoose.model("Course", courseSchema);


app.route("/course")

.get(function(req, res){
    Course.find(function(err, foundCourses){
        if(!err){
            res.send(foundCourses);
        }else{
            res.send(err);
        }
    });
})

.post(function(req, res){
    const newCourse = new Course({
        title: req.body.title,
        content: req.body.content
    })

    newCourse.save(function(err){
        if(!err){
            res.send("successfully added a new course");
        }else{
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

app.route("/course/:courseTitle")

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
        {title: req.body.title, content: req.body.content},
        {overwrite: true},
        function(err){
            if(!err){
                res.send("successfully Edited");
            }
        }
    );
})

.patch(function(req, res){
    Course.updateOne(
        {_id: req.params.courseTitle},
        {$set: req.body},
        function(err){
            if(!err){
                console.log(req.body);
                res.send("Updated");
            }else{
                res.send("Unable to update");
            }
        }
    );
})

.delete(function(req, res){

    Course.deleteOne(
      {_id: req.params.courseTitle},
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


  app.route("/course/:courseTitle/:moduleTitle")

  .patch(function(req, res){
      Course.updateOne(
        {_id: req.params.courseTitle},
        {$push: {curriculum: { _id: req.params.moduleTitle }}},
        function(err){
            if(!err){
                res.send("Module deleted");
            }
        }
      )
  })


  .delete(function(req, res){
    Course.updateOne(
        {_id: req.params.courseTitle},
        {$pull: {curriculum: { _id: req.params.moduleTitle }}},
        function(err){
            if(!err){
                res.send("Module deleted");
            }
        }
    )
  });


  app.route("/course/:courseTitle/:moduleTitle/:nameTitle")

  .patch(function(req, res){
      Course.updateOne(
        {_id: req.params.courseTitle},
        {$push: {curriculum: { name: {_id: req.params.nameTitle} }}},
        function(err){
            if(!err){
                res.send("Module deleted");
            }
        }
      )
  })


  .delete(function(req, res){
    Course.updateOne(
        {_id: req.params.courseTitle},
        {$pull: {curriculum: {  name: {_id: req.params.nameTitle} }}},
        function(err){
            if(!err){
                res.send("Module deleted");
            }
        }
    )
  });



  app.listen(process.env.PORT || 3000, function(){
      console.log("server running");
  })