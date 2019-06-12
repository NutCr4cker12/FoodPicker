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
        } else if (arr[i] === ">1h") {
            return -1
        }
    }
    return slowest
}

/**
 *
 * @param {int} foodtime : preparing time for the food
 * @param {array} filterArray : array of time filters
 */
function checkSpeedFilter(foodtime, filterArray) {
    if (!filterArray) return true
    const slowest = slowestFood(filterArray)
    if (slowest < 0) {
        if (foodtime > 60) return true
        return false
    } else if (slowest === 30) {
        if (foodtime <= 30) return true
        return false
    }
    if (foodtime <= 60) return true
    return false

}


/**
 *
 * @param {array} dayarray : array constinging of start and end days of the food
 *
 * Return {map} :
 *      BigInt : daysMin (in milliseconds)
 *      Int : daysMinInt (in days, +- from today)
 *      BigInt : daysMax  (in milliseconds)
 *      Int : daysMaxInt (in days, +- from today)
 */
function parseDates(dayarray) {
    if (!dayarray) return {
        "daysMin": 0,
        "daysMinInt": 0,
        "daysMax": 0,
        "daysMaxInt": 0
    }
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

/**
 *
 * @param {array} foods : array of food objects
 *
 * @returns {int} Next available free day in toDateString() format
 */
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
            newFoods = foods.sort((a, b) => {
                return nameSort(a.timeseaten, b.timeseaten, sort.order)
            })
        } else if (sort.name === "duration") {
            newFoods = foods.sort((a, b) => {
                return nameSort(a.foodamount, b.foodamount, sort.order)
            })
        } else if (sort.name === "lasteaten") {
            newFoods = foods.sort((a, b) => {
                let x = a.lasteaten ? Date.parse(a.lasteaten[1]) : Infinity
                let y = b.lasteaten ? Date.parse(b.lasteaten[1]) : Infinity
                return nameSort(x, y, sort.order)
            })
        }
    })
    return newFoods
}


/**
 *
 * @param {array} foods : array of food objects
 * @param {object} food : selected food
 * @param {int} startDiff : days to vary startDay from default
 * @param {int} endDiff : days to vary endDay from default
 *
 * @returns {Map} : {obj: food, start: String, end: String}
 */
function getStartAndEndDays(foods, food, startDiff, endDiff) {
    let toDay_ms = Date.parse(new Date().toDateString())
    let startDay_ms = toDay_ms + (nextAvailableFreeDay(foods)*-1 + startDiff)*oneDay
    let endDay_ms = startDay_ms + endDiff*oneDay
    let startDayString = new Date(startDay_ms).toDateString()
    let endDayString = new Date(endDay_ms).toDateString()
    console.log("today ms" + toDay_ms)
    console.log("start ms" + startDay_ms)
    console.log("endDay ms" + endDay_ms)
    console.log("startDayString" + startDayString)
    console.log("endDayString" + endDayString)
    return {obj: food, start: startDayString, end: endDayString}
}

/**
 *
 * @param {String} date : starting date
 * @param {int} shift : number of days to shift
 *
 * @returns {String} date : shifted Date
 */
function shiftDay(date, shift) {
    return new Date(Date.parse(new Date(date)) + shift*oneDay).toDateString()
}

exports.arrayElementInArray = arrayElementInArray
exports.slowestFood = slowestFood
exports.lastEaten = lastEaten
exports.nextAvailableFreeDay = nextAvailableFreeDay
exports.last3weeksFoods = last3weeksFoods
exports.getLatestFood = getLatestFood
exports.sortFoods = sortFoods
exports.getStartAndEndDays = getStartAndEndDays
exports.shiftDay = shiftDay
exports.checkSpeedFilter = checkSpeedFilter