var request = require('request');
var places = require('../../config/places.json');


let controller = {
    findPlace(req, res) {
        var type = req.body.type;
        var location = places.position;
        var radius = req.body.radius;
        console.log("Radius is "+radius);
        var url = "https://maps.googleapis.com/maps/api/place/nearbysearch/json?key=AIzaSyCe92gr43sp4saSVSes4G7xJtH67b41EoY&" +
            "location="+location+"&" +
            "radius="+radius+"&" +
            "type=" + type; 
        console.log(url);
        request({
            url: url,
            method: "GET"
        }, function (error, response, body) {
            if (error!=null){
                res.sendStatus(500);
            }
            res.json(JSON.parse(body));
            
        })
    }
}

module.exports = controller;