import React from 'react';
import axios from 'axios';
import "./index.css";
import { isNumber } from 'util';
import { TransitionGroup } from 'react-transition-group';
import { CSSTransition } from 'react-transition-group';

import { faHourglass, faHourglassEnd } from "@fortawesome/free-solid-svg-icons";
import { faHourglass as faHourglassRegular} from "@fortawesome/free-regular-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import cow from "./images/liha2.png"
import cow_x from "./images/liha_x.png"

const func = require("./MyFuncs")

//const URL = "http://localhost:3001/api/foods"
const URL = "/api/foods"

const MAINTYPEFILTERS = ["liha", "kana", "kala", "kasvis"]
const SIDETYPEFILTERS = ["pasta", "peruna", "riisi", "salaatti", "bataatti"]
const SPEEDTYPEFILTERS = ["<1/2h","<1h", ">1h"]
const DAYTYPEFILTER = [1, 2, 3]

const getFilterType = (type) => {
    return (
        MAINTYPEFILTERS.indexOf(type) !== -1 ? "main" :
        SIDETYPEFILTERS.indexOf(type) !== -1 ? "side" :
        isNumber(type) ? "day" :
        "speed"
    )
}

function Filters(type) {
    return (
        type === "<1/2h" ? <FontAwesomeIcon icon={faHourglassRegular}/> :
        type === "<1h" ? <FontAwesomeIcon icon={faHourglassEnd}/> :
        type === ">1h" ? <FontAwesomeIcon icon={faHourglass}/> : type
    )
}

class App extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            foods: [],
            newFoodAmount: 1,
            latestfoods: [],
            filtersPressed: [],
            maintypefilter: {on: [], off: MAINTYPEFILTERS},
            sidetypefilter: {on: [], off: SIDETYPEFILTERS},
            speedtypefilter: {on: [], off: SPEEDTYPEFILTERS},
            daytypefilter: {on: [], off: DAYTYPEFILTER},
            textfilter: "",
            dropdown: "",
            show_timeseaten: false,
            show_duration: false,
            show_lasteaten: false,
            selectingFood: {
                bool: false,
                newFood: null
            },
            sortBy: [
                {name: "main", clicked: 0, order: 0},
                {name: "side", clicked: 0, order: 0},
                {name: "name", clicked: 0, order: 0},
                {name: "eaten", clicked: 0, order: 0},
                {name: "duration", clicked: 0, order: 0},
                {name: "lasteaten", clicked: 0, order: 0}
            ]
        }
    }

    componentDidMount() {
        console.log("mounttas")
        axios.get(URL).then(response => {
            this.setState({foods: response.data})
        })
    }

    DeactivateFilter(type) {
        this.setState({
            filtersPressed: this.state.filtersPressed.filter(
                value => value !== type
            )
        })
        getFilterType(type)==="main" ?
        this.setState({
            maintypefilter : {on: this.state.maintypefilter.on.filter(
                value => value !== type
            ),
                off: this.state.maintypefilter.off.concat(type)}
        }) : getFilterType(type)==="side" ?
        this.setState({
            sidetypefilter : {on: this.state.sidetypefilter.on.filter(
                value => value !== type
            ),
                off: this.state.sidetypefilter.off.concat(type)}
        }) : getFilterType(type)==="day" ?
        this.setState({
            daytypefilter : {on: this.state.daytypefilter.on.filter(
                value => value !== type
            ),
                off: this.state.daytypefilter.off.concat(type)}
        }) :
        this.setState({
            speedtypefilter : {on: this.state.speedtypefilter.on.filter(
                value => value !== type
            ),
                off: this.state.speedtypefilter.off.concat(type)}
        })
    }

    ActivateFilter(type) {
        getFilterType(type)==="main" ?
        this.setState({
            filtersPressed: this.state.filtersPressed.concat(type),
            maintypefilter: {on: this.state.maintypefilter.on.concat(type),
                            off: this.state.maintypefilter.off.filter(
                value => value !== type
            )}
        }) : getFilterType(type)==="side" ?
        this.setState({
            filtersPressed: this.state.filtersPressed.concat(type),
            sidetypefilter: {on: this.state.sidetypefilter.on.concat(type),
                off: this.state.sidetypefilter.off.filter(
                value => value !== type
            )}
        }) : getFilterType(type)==="day" ?
        this.setState({
            filtersPressed: this.state.filtersPressed.concat(type),
            daytypefilter: {on: this.state.daytypefilter.on.concat(type),
                off: this.state.daytypefilter.off.filter(
                value => value !== type
            )}
        }) :
        this.setState({
            filtersPressed: this.state.filtersPressed.concat(type),
            speedtypefilter: {on: this.state.speedtypefilter.on.concat(type),
                off: this.state.speedtypefilter.off.filter(
                value => value !== type
            )}
        })
    }

    FilterSelected = () => {
        return (
            this.state.filtersPressed.map((type, i) =>
                <CSSTransition
                    key={i}
                    classNames="filtered"
                    timeout={{ enter: 500, exit: 300}}
                >
                    <button onClick={this.DeactivateFilter.bind(this, type)}
                        key={i}>{type==="liha" ? <img src={cow_x} alt="cow" height="20" width="38"></img> :
                        type==="pasta" ? <img src="http://pngimg.com/uploads/pasta/pasta_PNG91.png"
                            alt="pasta" height="20" width="20"></img> :
                            type}</button>
                </CSSTransition>
            )
        )
    }

    CreateRow = (name, arr) => {
        return (
                arr.map((type, i) =>
                    <CSSTransition key={i} classNames="filtered" timeout={{ enter: 500, exit: 300}}>
                        <button onClick={this.ActivateFilter.bind(this, type)} key={i}>{Filters(type)}</button>
                    </CSSTransition>
                    )
        )
    }

    CreateRow2 = (name, arr) => {
        return this.state.dropName === "filtermenu" ?
            <div><TransitionGroup>{this.CreateRow(name, arr)}</TransitionGroup></div>
            : null
    }

    NameLink = ({food}) => {
        return (
            food.link === "" ?
            <td>{food.name}</td> :
            <td><a href={food.link}>{food.name}</a></td>
        )
    }
    /**
     * Params:
     *
     * food = map   -   selected food
     *
     * eatStart = int   -   +/- days from today it started to be eaten
     *
     * eatEnd = int     -   How many days it is eaten
     */
    SelectFood = (food, eatStart, eatEnd) => {
        console.log("syodaan nakojaan " + food.name)
        console.log(food.id)
        const day = 24*60*60*1000
        const toDay = new Date()
        const startDay = Date.parse(toDay.toDateString() + eatStart*day)
        const endDay = Date.parse(new Date(startDay).toDateString() + eatEnd*day)
        food.lasteaten = [new Date(startDay).toDateString(), new Date(endDay).toDateString()]
        axios.post(URL + "/select/", food).then(response => {
            console.log("updated: " + response.data)
            this.componentDidMount()
        })
    }

    FilteredFoods() {
        if (this.state.filtersPressed.length === 0 &&
            this.state.textfilter.length === 0)
            return this.state.foods
        let mainfilter = this.state.maintypefilter.on.length === 0 ?
            this.state.maintypefilter.off :
            this.state.maintypefilter.on
        let sidefilter = this.state.sidetypefilter.on.length === 0 ?
            this.state.sidetypefilter.off :
            this.state.sidetypefilter.on
        let dayfilter = this.state.daytypefilter.on.length === 0 ?
            this.state.daytypefilter.off :
            this.state.daytypefilter.on
        const arr = this.state.foods.filter(food =>
                mainfilter.indexOf(food.maintype) !== -1 &&
                func.arrayElementInArray(food.sidetype.split(", "), sidefilter) &&
                dayfilter.indexOf(food.foodamount) !== -1 &&
                food.time < func.slowestFood(this.state.speedtypefilter.on) &&
                food.name.toLowerCase().includes(this.state.textfilter.toLowerCase())
            )
        return arr
    }

    FoodTable = ({foods}) => {
        const handleClick = (food) => {
            this.setState({
                selectingFood: {bool: true, newFood: food}
            })
        }
        return (
            foods.map((food, i) =>
                <tr key={i}>
                <td className="maintype_table">{food.maintype === "liha" ?
                        <img src={cow} alt="cow" height="20" width="20"></img>: food.maintype}</td>
                <td className="sidetype_table">{food.sidetype}</td>
                <this.NameLink food={food} />
                {this.state.show_timeseaten ? <td>{food.timeseaten}</td> : null}
                {this.state.show_duration ? <td>{food.foodamount}</td> : null}
                {this.state.show_lasteaten ? <td>{func.lastEaten(food.lasteaten)}</td> : null}
                <td onClick={handleClick.bind(this, food)}>
                    <img src="https://cdn.pixabay.com/photo/2016/03/09/07/08/web-1245502_960_720.png" alt="select" height="20" width="20"></img>
                </td>
                </tr>
            )
        )
    }

    updateTextFilter = (event) => {
        this.setState({textfilter: event.target.value})
    }

    DropDown(id_name) {
        document.getElementById(id_name).classList.toggle("is-nav-open")
        this.setState({
            dropdown: this.state.dropdown.length === 0 ? id_name : ""
        })
    }

    ToggleButton = ({name}) => {
        function showFilter(name) {
            document.getElementById(name).classList.toggle("active")
            document.getElementById("toggleButton-text").classList.toggle("pressed")
            document.getElementById("showmenu").classList.toggle("is-open")
            name === "Times Eaten" ?
                this.setState({
                show_timeseaten: !this.state.show_timeseaten
            }) : name === "Duration" ? this.setState({
                show_duration: !this.state.show_duration
            }) : this.setState({
                show_lasteaten: !this.state.show_lasteaten
            })
        }
        return (
            <div>
                <p
                        id="toggleButton-text"
                        className="toggleButton-text"
                        onClick={showFilter.bind(this, name)}>
                            {name}
                    </p>
            <div id={name} className="toggleButton">
                <div className="inner-Circle">
                </div>
            </div>
            </div>
        )
    }

    MenuItem = ({name, dropName}) => {
        return (
            <i
                className="menu-text"
                onClick={() => {document.getElementById("filtermenu").classList.toggle("is-nav-open")
                    this.setState({
                        dropdown: this.state.dropdown.length === 0 ? dropName : "" })}}>
                    {name}
            </i>
        )
    }

    handleSorterClick(sort) {
        let newSortBy = this.state.sortBy
        for (let i = 0; i < newSortBy.length; i++) {
            newSortBy[i] = newSortBy[i].name === sort ?
                {
                    name: sort,
                    clicked: newSortBy[i].order === 2 ? 0 : Date.parse(new Date().toDateString()),
                    order: (newSortBy[i].order + 1) % 3
                }
                : newSortBy[i]
        }
        console.log(newSortBy)
        this.setState({
            foods: func.sortFoods(this.state.foods, newSortBy),
            sortBy: newSortBy
        })
    }

    TableHeader = ({name}) => {
        let state = undefined
        this.state.sortBy.forEach(sort => {
            if (sort.name === name) state = sort
        })
        return (
            <th>
                <i className="table-header"
                    onClick={this.handleSorterClick.bind(this, name)}>
                    {name === "lasteaten" ? "Last Eaten" : name}{state.order === 1 ? " v" : state.order === 2 ? " ^" : ""}
                </i>
            </th>
        )
    }

    // onClick={this.SelectFood.bind(this, food)}
    render() {
        const filtersSelected = this.FilterSelected()
        const mainFilterRow = this.CreateRow("main", this.state.maintypefilter.off)
        const sideFilterRow = this.CreateRow("side", this.state.sidetypefilter.off)
        const speedFilterRow = this.CreateRow("speed", this.state.speedtypefilter.off)
        const dayFilterRow = this.CreateRow("days", this.state.daytypefilter.off)

        // <FontAwesomeIcon icon={faIgloo}/>
        return (
            <div>
                <this.MenuItem name={"Filters"} dropName={"filtermenu"} />
                <this.MenuItem name={"Show"} dropName={"showmenu"}/>
                <div id="filtermenu" className="filtermenu">
                    <div className="nav">
                        <div>
                        {this.state.dropdown === "filtermenu" ? <div>
                            <form>
                                <input value={this.state.textfilter}
                                    onChange={this.updateTextFilter}/>
                        </form></div> : null}
                        {/*<this.CreateRow2 name={"main"} arr={this.state.maintypefilter.off}/>*/}
                        {this.state.dropdown === "filtermenu" ? <div>
                            {<TransitionGroup>{mainFilterRow}</TransitionGroup>}
                        </div> : null}
                        {this.state.dropdown === "filtermenu" ? <div>
                            <TransitionGroup>{sideFilterRow}</TransitionGroup>
                        </div> : null}
                        {this.state.dropdown === "filtermenu" ? <div>
                            <TransitionGroup>{speedFilterRow}</TransitionGroup>
                        </div> : null}
                        {this.state.dropdown === "filtermenu" ? <div>
                            <TransitionGroup>{dayFilterRow}</TransitionGroup>
                        </div> : null}
                        </div>
                    </div>
                </div>
                {this.state.dropdown === "showmenu" ? <div id="showmenu" className="showmenu">
                    <this.ToggleButton name={"Times Eaten"} />
                    <this.ToggleButton name={"Duration"} />
                    <this.ToggleButton name={"Last Eaten"} />
                    <this.ToggleButton name={"Last Eaten"} />
                </div> : null}
                <div>
                    <TransitionGroup>
                        {filtersSelected}
                    </TransitionGroup>
                </div>
                <div>
                    <table className="food-table">
                        <tbody>
                            <tr>
                                <this.TableHeader name={"main"} />
                                <this.TableHeader name={"side"} />
                                <this.TableHeader name={"name"} />
                                {this.state.show_timeseaten ? <this.TableHeader name={"eaten"}/> : null}
                                {this.state.show_duration ? <this.TableHeader name={"duration"}/> : null}
                                {this.state.show_lasteaten ? <this.TableHeader name={"lasteaten"}/> : null}
                            </tr>
                            <this.FoodTable foods={this.FilteredFoods()} />
                        </tbody>
                    </table>
                </div>
            </div>
        )
    }
}

export default App