var Food =  require('../models/food');
var FoodRates = require('../models/person_rates_food');

let repo = {
    hello() {
        console.log('hello');
    },
    helloThere() {
        console.log('hello there');
    },
    getRatesAvg(food_id) {
        FoodRates.aggregate([{
            $match: { food_id: food_id },
        }, {
            $group: {
                _id: null,
                rateFinal: {
                    $avg: "$rate"
                }
            }
        }])
        .then(data => {
            console.log("food_id")
            console.log(food_id)
            console.log(data[0].rateFinal);
            this
            .updateOne({ _id: food_id }, { rate: data[0].rateFinal })
            .then(res => {
                console.log(data);
                console.log(res);
            })
            .catch(err => {
                console.log(err);
            })
            ;
        });
    }
};

module.exports = repo;
