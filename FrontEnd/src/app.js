import React from 'react';
import axios from 'axios';
import "./index.css";
import { isNumber } from 'util';
import { TransitionGroup } from 'react-transition-group';
import { CSSTransition } from 'react-transition-group';

import {
    faHourglass, faHourglassEnd,
    faCartArrowDown,
    faSort, faSortUp, faSortDown, faBars, faSlidersH

} from "@fortawesome/free-solid-svg-icons";
import { faHourglass as faHourglassRegular, faCalendarMinus, faCalendarPlus} from "@fortawesome/free-regular-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const func = require("./MyFuncs")

// const URL = "http://localhost:3001/api/foods"
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
            newFoodSelected: false,
            newFood: {obj: null, start: 0, end: 1},
            latestfoods: [],
            filtersPressed: [],
            filters: [
                {name: "main", on: [], off: MAINTYPEFILTERS},
                {name: "side", on: [], off: SIDETYPEFILTERS},
                {name: "speed", on: [], off: SPEEDTYPEFILTERS},
                {name: "day", on: [], off: DAYTYPEFILTER}
            ],
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
            ],
        }
        this.SetFoodParameters = this.SetFoodParameters.bind(this)
    }

    componentDidMount() {
        console.log("mounttas")
        axios.get(URL).then(response => {
            this.setState({foods: response.data})
        })
    }

    DeactivateFilter(type) {
        let currentFilters = this.state.filters
        for (let i = 0; i < currentFilters.length; i++) {
            currentFilters[i] = currentFilters[i].name === getFilterType(type) ?
                {
                    name: currentFilters[i].name,
                    on: currentFilters[i].on.filter(value => value !== type),
                    off: currentFilters[i].off.concat(type)
                }
                : currentFilters[i]
        }
        this.setState({
            filtersPressed: this.state.filtersPressed.filter(
                value => value !== type
            ),
            filters: currentFilters
        })
    }

    ActivateFilter(type) {
        let currentFilters = this.state.filters
        for (let i = 0; i< currentFilters.length; i++) {
            currentFilters[i] = currentFilters[i].name === getFilterType(type) ?
                {
                    name: currentFilters[i].name,
                    on: currentFilters[i].on.concat(type),
                    off: currentFilters[i].off.filter(value => value !== type)
                }
                : currentFilters[i]
        }
        this.setState({
            filtersPressed: this.state.filtersPressed.concat(type),
            filters: currentFilters
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
                        key={i}>{type}</button>
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
    SelectFood = () => {
        let newFood = this.state.newFood.obj
        console.log("syodaan nakojaan " + newFood.name)
        const startDay = this.state.newFood.start
        const endDay = this.state.newFood.end
        newFood.lasteaten = [new Date(startDay).toDateString(), new Date(endDay).toDateString()]
        console.log(newFood)
        axios.post(URL + "/select/", newFood).then(response => {
            console.log("updated: " + response.data)
            this.componentDidMount()
        })
        this.setState({
            newFoodSelected: false,
            dropdown: ""
        })
    }

    SetFoodParameters = () => {
        function handleClick(start, end) {
            const origStart = this.state.newFood.start
            const origEnd = this.state.newFood.end
            if (origStart === origEnd && (start > 0 || end < 0)) return
            const startDate = func.shiftDay(this.state.newFood.start, start)
            const endDate = func.shiftDay(this.state.newFood.end, end)
            this.setState({
                newFood: {
                    obj: this.state.newFood.obj,
                    start: startDate,
                    end: endDate
                }
            })
            console.log(this.state.newFood)
        }
        function getShortDate(date) {
            const month = new Date(date).getMonth()
            return new Date(date).getDate() + "." + month
        }
        return (
            <div className="food-adder-content">
                <div className="fa-box" >{this.state.newFood.obj.name}</div>
                <div className="fa-box" >Start</div>
                    <i></i>
                    <FontAwesomeIcon className="fa-box" icon={faCalendarMinus} onClick={handleClick.bind(this, -1, 0)}/>
                    <div className="fa-box">{this.state.newFood.start.split(" ")[0]}</div>
                    <FontAwesomeIcon className="fa-box" icon={faCalendarPlus} onClick={handleClick.bind(this, 1, 0)}/>
                    <i></i>
                <div className="fa-box">{getShortDate(this.state.newFood.start)}</div>

                <div className="fa-box">End 2</div>
                    <i></i>
                    <FontAwesomeIcon className="fa-box" icon={faCalendarMinus} onClick={handleClick.bind(this, 0, -1)}/>
                    <div className="fa-box">{this.state.newFood.end.split(" ")[0]}</div>
                    <FontAwesomeIcon className="fa-box" icon={faCalendarPlus} onClick={handleClick.bind(this, 0, 1)}/>
                    <i></i>
                <div className="fa-box">{getShortDate(this.state.newFood.end)}</div>

                <div className="fa-box"
                    onClick={() => this.setState({
                        newFoodSelected: false,
                        dropdown: ""
                        })}>
                        Cancel</div><i></i>
                <div className="fa-box"
                    onClick={this.SelectFood.bind(this)}>
                        Ok</div>
            </div>
        )
    }

    FilteredFoods() {
        if (this.state.filtersPressed.length === 0 &&
            this.state.textfilter.length === 0)
            return this.state.foods
        let mainfilter = this.state.filters[0].on.length === 0 ?
            this.state.filters[0].off :
            this.state.filters[0].on
        let sidefilter = this.state.filters[1].on.length === 0 ?
            this.state.filters[1].off :
            this.state.filters[1].on
        let dayfilter = this.state.filters[3].on.length === 0 ?
            this.state.filters[3].off :
            this.state.filters[3].on
        const arr = this.state.foods.filter(food =>
                mainfilter.indexOf(food.maintype) !== -1 &&
                func.arrayElementInArray(food.sidetype.split(", "), sidefilter) &&
                dayfilter.indexOf(food.foodamount) !== -1 &&
                func.checkSpeedFilter(food.time, this.state.filters[2].on) &&
                food.name.toLowerCase().includes(this.state.textfilter.toLowerCase())
            )
        return arr
    }

    FoodTable = ({foods}) => {
        return (
            foods.map((food, i) =>
                <tr key={i}>
                <td className="maintype_table">{food.maintype}</td>
                <td className="sidetype_table">{food.sidetype}</td>
                <this.NameLink food={food} />
                {this.state.show_timeseaten ? <td>{food.timeseaten}</td> : null}
                {this.state.show_duration ? <td>{food.foodamount}</td> : null}
                {this.state.show_lasteaten ? <td>{func.lastEaten(food.lasteaten)}</td> : null}
                <td onClick={() => {
                    document.getElementById("food-table").classList.toggle("set-to-background")
                    this.setState({
                        newFoodSelected: true,
                        newFood: func.getStartAndEndDays(this.state.foods, food, 0, food.foodamount)
                    })}}>
                    <FontAwesomeIcon icon={faCartArrowDown} />
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

    MenuItem = ({name, dropName, icon}) => {
        function handeClick() {
            console.log(dropName)
            let prevName = this.state.dropdown
            console.log(prevName)
            document.getElementById(dropName).classList.toggle("is-nav-open")
            this.setState({
                dropdown: prevName === dropName ? "" : dropName
            })
            if (prevName !== dropName && prevName.length > 0)
                document.getElementById(prevName).classList.toggle("is-nav-open")
        }
        return (
            <i
                className="menu-text"
                onClick={handeClick.bind(this, handeClick)}>
                    <FontAwesomeIcon icon={icon}/>{" " + name}
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
                    {name === "lasteaten" ? "Last Eaten" : name + " "}
                    {state.order === 1 ? <FontAwesomeIcon icon={faSortDown}/>
                    : state.order === 2 ? <FontAwesomeIcon icon={faSortUp}/>
                                        : <FontAwesomeIcon icon={faSort}/>}
                </i>
            </th>
        )
    }

    // onClick={this.SelectFood.bind(this, food)}
    render() {
        const filtersSelected = this.FilterSelected()
        const mainFilterRow = this.CreateRow("main", this.state.filters[0].off)
        const sideFilterRow = this.CreateRow("side", this.state.filters[1].off)
        const speedFilterRow = this.CreateRow("speed", this.state.filters[2].off)
        const dayFilterRow = this.CreateRow("days", this.state.filters[3].off)

        return (
            <div>
                {this.state.newFoodSelected ? <this.SetFoodParameters /> :
            <div id="main">
                <this.MenuItem name={"Filters"} dropName={"filtermenu"} icon={faBars} />
                <this.MenuItem name={"Show"} dropName={"showmenu"} icon={faSlidersH}/>
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
                <div id="showmenu" className="showmenu">
                    {this.state.dropdown === "showmenu" ?
                    <div>
                        <this.ToggleButton name={"Times Eaten"} />
                        <this.ToggleButton name={"Duration"} />
                        <this.ToggleButton name={"Last Eaten"} />
                    </div>
                : null} </div>
                <div>
                    <TransitionGroup>
                        {filtersSelected}
                    </TransitionGroup>
                </div>
                <div>
                    <table id="food-table" className="food-table">
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
            </div>}
            </div>
        )
    }
}

export default App