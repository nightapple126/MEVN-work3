const Movie = require('../models/movie');
const uuid = require("uuid/v1");


let controller = {

    loadMovie(req,res){
        var id = req.query.id;
        Movie.findById(id).then(data => {
            res.send(data);
        }).catch(err=>{
            res.send(err);
        })
    },
    uploadMovie(req,res){
        if (!req.files)
        return res.status(400).send({ message: "No file to upload!" });
      let video = req.files.video;
      console.log(video)
      const filename =
        uuid() +
        "." +
        video.mimetype.substr(video.mimetype.indexOf("/") + 1);
      video.mv(
        __dirname + "/../../public/uploads/movies/" + filename,
        err => {
          if (err)
            return res
              .status(500)
              .send({ message: "error while uploading" + err });
          res.send({ filename: filename });
        }
      );
    },
    postMovie(req,res){
        var movie = req.body;
        var movieSandBox = new Movie({
            title:"Star Trek the Original",
            hits:1,
            genres:['Fantasy','Adventure'],
            thumbnail:'http://d2a2wjuuf1c30f.cloudfront.net/product_photos/8889070/STME1CvrCorroneyFinal_original.jpg',
            dash_manifest:'//storage.googleapis.com/shaka-demo-assets/angel-one/dash.mpd'
        });
        movieSandBox.save().then(data=>{
            res.send(data)
        }).catch(err=>{
            console.log(err)
        })

    },
    allMovies(req,res){

        Movie.find().then(data => {
            res.send(data);
        }).catch(err=>{
            res.send(err);
        })

    }

}
module.exports = controller;