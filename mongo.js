const mongoose = require("mongoose")

const password = "cg6TwxkhLLijoP"
const url = 'mongodb+srv://paakayttaja:cg6TwxkhLLijoP@fstrainmongodb-3ve2c.mongodb.net/foodpickerdb'
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

module.exports = db