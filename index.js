const express = require("express")
const app = express()
const bodyParser = require("body-parser")
const cors = require("cors")
const DB = require("./mongo.js")

app.use(bodyParser.json())
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
    DB.findById(id).then(person => {
        res.json(formatFood(person))
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

app.post("/api/foods", (req, res) => {
    const food = req.body
    if (!food.name || food.name.length < 1) {
        return res.status(400).json({error: "name is missing"})
    }
    const newfood = new DB({
        name: food.name,
        link: food.link,
        maintype: food.maintype,
        sidetype: food.sidetype,
        foodamount: food.foodamount,
        time: food.time,
        timeseaten: food.timeseaten,
        lasteaten: food.lasteaten
    })
    newfood.save().then(addedperson => {
        console.log("adding food " + food.name + " to the directory")
        res.json(formatFood(addedperson))
    })

})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log("Server running on port " + PORT)
})