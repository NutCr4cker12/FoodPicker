const express = require("express")
const app = express()
const cors = require("cors")
const DB = require("./mongo.js")

app.use(cors())
app.use(express.static("build"))

const formatFood = (food) => {
    return {
        name: food.name,
        link: food.link,
        maintype: food.maintype,
        sidetype: food.sidetype,
        foodamount: food.foodamount,
        time: food.time,
        timeseaten: food.timeseaten,
        lasteaten: food.lasteaten,
        id: food._id
    }
}

app.get("/api/foods", (req, res) => {
    DB.find({}).then(persons => {
        res.json(persons.map(formatFood))
    })
})

app.get("/api/foods/:id", (req, res) => {
    const id = req.params.id
    DB.findById(id).then(food => {
        res.json(formatFood(food))
    })
})

app.delete("/api/foods/:id", (req, res) => {
    const id = req.params.id
    DB.findByIdAndDelete(id, function (err, doc) {
        if (err) {
            res.status(400).json({error: "No match with id: " + id})
        } else {
            console.log("deleting: " + doc)
            res.status(204).end()
        }
    })
})

app.post("/api/foods/select", (req, res) => {
    const food = req.body
    console.log(food.id)
    food.timeseaten = food.timeseaten + 1
    console.log("backend updating: " + food.timeseaten)
    DB.findOneAndUpdate({_id: food.id}, food, {upsert:true, useFindAndModify: false},
            function(err, doc){
                if (err) return res.status(400).json({error: err})
                else res.status(204).end()
            })
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log("Server running on port " + PORT)
})