const oneDay = 24*60*60*1000

/** params:
 *
 * searcharray = [array], array to search from
 *
 * filterarray = [array], array to match an element from
 */
const arrayElementInArray = (searcharray, filterarray) => {
    for (let i = 0; i < searcharray.length; i++) {
        for (let j = 0; j < filterarray.length; j++) {
            if (searcharray[i] === filterarray[j]) return true
        }
    }
    return false
}

function slowestFood(arr) {
    let slowest = 600
    for (let i = 0; i < arr.length; i++) {
        if (arr[i] === "<1/2h") {
            slowest = 30
        } else if (arr[i] === "<1h") {
            slowest = 60
        }
    }
    return slowest
}

function parseDates(dayarray) {
    const today = Date.parse(new Date().toDateString())
    const startEating = Date.parse(new Date(dayarray[0]).toDateString())
    const lastAte = Date.parse(new Date(dayarray[1]).toDateString())
    const daysMin = (today - startEating) / oneDay
    console.log((today - lastAte) % oneDay)
    const daysMax = (today - lastAte) / oneDay
    return {
        "daysMin": daysMin,
        "daysMinInt": startEating,
        "daysMax": daysMax,
        "daysMaxInt": lastAte
    }
}

function lastEaten(dayarray) {
    if (!dayarray) return "-"
    const dates = parseDates(dayarray)
    console.log(dates)
    const daysMin = dates.daysMin
    const daysMax = dates.daysMax
    if (daysMax <= 0 && daysMin <= 0) {
        return "In " + Math.round(daysMin*-1) + " days"
    } else if (daysMax <= 0) {
        return "Current"
    }
    return Math.round(daysMax) + " days ago"
}

function nextAvailableFreeDay(foods) {
    const latestFood = getLatestFood(foods)
    return parseDates(latestFood.lasteaten).daysMax - 1
}


/**
 *
 * @param {array} foods
 * return {object in foods (= "food")} lates eaten Food
 */
function getLatestFood(foods) {
    let latesFood = foods[0]
    let biggestDate = Date.parse(new Date(0).toDateString())
    foods.forEach(food => {
        if (food.lasteaten && parseDates(food.lasteaten).daysMaxInt > biggestDate)
            biggestDate = parseDates(food.lasteaten).daysMaxInt
            latesFood = food
    })
    return latesFood
}

/**
 *
 * @param {array} foods
 * return {array} constinsting of the foods eaten in last 3 weeks
 */
function last3weeksFoods(foods) {
    const arr = []
    for (let food of foods) {
        if (food.lasteaten && parseDates(food.lasteaten).daysMax < 21) arr.push(food)
    }
    return arr
}

function sortFoods(foods, sortBy) {
    let newFoods = []
    function nameSort(x, y, order) {
        if (x < y) return order===1 ? -1 : 1
        if (x > y) return order===1 ? 1 : -1
        return 0
    }
    let sorts = sortBy.filter(obj => obj.order !== 0)
                    .sort((a, b) => b.clicked - a.clicked)
    if (sorts.length === 0) return foods
    sorts.forEach(sort => {
        if (sort.name === "main") {
            newFoods = foods.sort((a, b) => {
                return nameSort(a.maintype.toLowerCase(), b.maintype.toLowerCase(), sort.order)
            })
        } else if (sort.name === "side") {
            newFoods = foods.sort((a, b) => {
                return nameSort(a.sidetype.toLowerCase(), b.sidetype.toLowerCase(), sort.order)
            })
        } else if (sort.name === "name") {
            newFoods = foods.sort((a, b) => {
                return nameSort(a.name.toLowerCase(), b.name.toLowerCase(), sort.order)
            })
        } else if (sort.name === "eaten") {
            newFoods = foods.sort((a, b) => {return a.timeseaten - b.timeseaten})
        } else if (sort.name === "duration") {
            newFoods = foods.sort((a, b) => {return a.foodamount - b.foodamount})
        } else if (sort.name === "lasteaten") {
            newFoods = foods.sort((a, b) => {
                let x = a.lasteaten ? Date.parse(a.lasteaten[1]) : Infinity
                let y = b.lasteaten ? Date.parse(b.lasteaten[1]) : Infinity
                return x - y})
        }
        if (sort.order === 2) newFoods.reverse()
    })
    return newFoods
}

exports.arrayElementInArray = arrayElementInArray
exports.slowestFood = slowestFood
exports.lastEaten = lastEaten
exports.nextAvailableFreeDay = nextAvailableFreeDay
exports.last3weeksFoods = last3weeksFoods
exports.getLatestFood = getLatestFood
exports.sortFoods = sortFoods