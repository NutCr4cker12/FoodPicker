const mongoose = require("mongoose")
const dotenv = require("dotenv")
dotenv.config()

const url = process.env.MONGODB_URL

mongoose.connect(url)
mongoose.Promise = global.Promise

const db = mongoose.model("foodpicker", {
    name: String,
    link: String,
    maintype: String,
    sidetype: String,
    foodamount: Number,
    time: Number,
    timeseaten: Number,
    lasteaten: Array
})
db.find({}).then(food => {
    console.log(food)
})
/*
db.find({}).then(food => {
    var target = undefined
    food.forEach(f => {
        if (f.name === "testitesti")
            target = f
    })
    const day = 24*60*60*1000
    const toDay = new Date()
    const startDay = Date.parse(toDay.toDateString()) - 1*day
    const endDay = Date.parse(new Date(startDay).toDateString()) + 2*day
    target.lasteaten = [new Date(startDay).toDateString(), new Date(endDay).toDateString()]
    target.timeseaten = 0
    console.log(target)
    db.findOneAndUpdate({name: "testitesti"}, target, {upsert:true, useFindAndModify: false},
            function(err, doc){
                if (err) console.log("error: " + err)
                else console.log("succes!")
            })
})

db.find({_id: "5cf97ca61c9d440000889f91"}).then(food => {
    food.forEach(f => {
        console.log(f.lasteaten)
    })
})
*/

module.exports = db