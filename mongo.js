const mongoose = require("mongoose")

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
    lasteaten: Date
})

/*
db.find({}).then(food => {
    var target = undefined
    food.forEach(f => {
        if (f.name === "testitesti")
            target = f
    })
    target.lasteaten = new Date().toDateString()
    target.timeseaten = 0
    console.log(target)
    db.findOneAndUpdate({name: "testitesti"}, target, {upsert:true},
            function(err, doc){
                if (err) console.log("error: " + err)
                else console.log("succes!")
            })
})
*/
/*
db.find({_id: "5cf97ca61c9d440000889f91"}).then(food => {
    food.forEach(f => {
        console.log(f)
    })
})*/

module.exports = db