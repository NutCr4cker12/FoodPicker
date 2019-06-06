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

module.exports = db