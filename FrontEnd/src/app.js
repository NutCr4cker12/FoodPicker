import React from 'react';
import axios from 'axios';
import "./index.css";
import { isNumber } from 'util';
import { CSSTransitionGroup } from 'react-trasition-group';

import { faHome } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import cow from "./images/liha2.png"
import cow_x from "./images/liha_x.png"

const URL = "http://localhost:3001/api/foods"
// const URL = "/api/foods"

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

class App extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            foods: [],
            latestfoods: [],
            filtersPressed: [],
            maintypefilter: {on: [], off: MAINTYPEFILTERS},
            sidetypefilter: {on: [], off: SIDETYPEFILTERS},
            speedtypefilter: {on: [], off: SPEEDTYPEFILTERS},
            daytypefilter: {on: [], off: DAYTYPEFILTER},
            textfilter: "",
            dropdownpressed: false
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
                <button onClick={this.DeactivateFilter.bind(this, type)}
                    key={i}>{type==="liha" ? <img src={cow_x} alt="cow" height="20" width="38"></img> :
                    type==="pasta" ? <img src="http://pngimg.com/uploads/pasta/pasta_PNG91.png"
                        alt="pasta" height="20" width="20"></img> :
                        type}</button>
            )
        )
    }

    FilterAvailable = () => {
        const Mains = () => {
            return (
                this.state.maintypefilter.off.map((type, i) =>
                <button onClick={this.ActivateFilter.bind(this, type)}
                    key={i}>{type}</button>
            ))
        }
        const Side = () => {
            return (
                this.state.sidetypefilter.off.map((type, i) =>
                    <button onClick={this.ActivateFilter.bind(this, type)}
                    key={i}>{type}</button>
                )
            )
        }
        const Speed = () => {
            return (
                this.state.speedtypefilter.off.map((type, i) =>
                    <button onClick={this.ActivateFilter.bind(this, type)}
                    key={i}>{type}</button>
                )
            )
        }
        const Day = () => {
            return (
                this.state.daytypefilter.off.map((type, i) =>
                    <button onClick={this.ActivateFilter.bind(this, type)}
                    key={i}>{type}</button>
                )
            )
        }
        return (
                    <div>
                        <form>
                            <input value={this.state.textfilter}
                                onChange={this.updateTextFilter}/>
                        </form>
                        {this.state.maintypefilter.off.length !== 0 ?
                            <table><tbody><tr><td className="filter_available">main:</td><td><Mains />
                            </td></tr></tbody></table> : null}
                        {this.state.sidetypefilter.off.length !== 0 ?
                            <table><tbody><tr><td className="filter_available">side:</td><td><Side />
                            </td></tr></tbody></table> : null}
                        {this.state.speedtypefilter.off.length !== 0 ?
                            <table><tbody><tr><td className="filter_available">speed:</td><td><Speed />
                            </td></tr></tbody></table> : null}
                        {this.state.daytypefilter.off.length !== 0 ?
                            <table><tbody><tr><td className="filter_available">days:</td><td><Day />
                            </td></tr></tbody></table> : null}
                    </div>
        )
    }

    NameLink = ({food}) => {
        return (
            food.link === "" ?
            <td>{food.name}</td> :
            <td><a href={food.link}>{food.name}</a></td>
        )
    }

    SelectFood = (food) => {
        console.log("syodaan nakojaan " + food.name)
        console.log(food.id)
        axios.post(URL + "/select", food).then(response => {
            console.log("updated: " + response.data)
            this.componentDidMount()
        })
    }

    slowestFood() {
        let slowest = 600
        let arr = this.state.speedtypefilter.on
        for (let i = 0; i < arr.length; i++) {
            if (arr[i] === "<1/2h") {
                slowest = 30
            } else if (arr[i] === "<1h") {
                slowest = 60
            }
        }
        return slowest
    }

    /** params:
     *
     * searcharray = [array], array to search from
     *
     * filterarray = [array], array to match an element from
     */
    arrayElementInArray = (searcharray, filterarray) => {
        for (let i = 0; i < searcharray.length; i++) {
            for (let j = 0; j < filterarray.length; j++) {
                if (searcharray[i] === filterarray[j]) return true
            }
        }
        return false
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
                this.arrayElementInArray(food.sidetype.split(", "), sidefilter) &&
                dayfilter.indexOf(food.foodamount) !== -1 &&
                food.time < this.slowestFood() &&
                food.name.toLowerCase().includes(this.state.textfilter.toLowerCase())
            )
        return arr
    }

    FoodTable = ({foods}) => {
        return (
        foods.map((food, i) =>
            <tr key={i}>
            <td className="maintype_table">{food.maintype === "liha" ?
                    <img src={cow} alt="cow" height="20" width="20"></img>: food.maintype}</td>
            <td className="sidetype_table">{food.sidetype}</td>
            <this.NameLink food={food} />
            <td>{food.timeseaten}</td>
            <td>{food.foodamount}</td>
            <td onClick={this.SelectFood.bind(this, food)}>
                <img src="https://cdn.pixabay.com/photo/2016/03/09/07/08/web-1245502_960_720.png" alt="select" height="20" width="20"></img>
            </td>
            </tr>
        ))
    }

    updateTextFilter = (event) => {
        this.setState({textfilter: event.target.value})
    }

    dropDownClick() {
        console.log("dropwdown pressed")
        const wrapper = document.getElementById("filtermenu");
        wrapper.classList.toggle("is-nav-open")
        this.setState({
            dropdownpressed: !this.state.dropdownpressed
        })
    }

    render() {
        return (
            <div>
                <div id="filtermenu" className="filtermenu">
                    <div className="nav">
                        <i
                            className="nav__icon"
                            type="menu-fold"
                            onClick={this.dropDownClick.bind(this)}>
                                Filters</i>
                        <div>
                            {this.state.dropdownpressed ? <this.FilterAvailable /> : null}
                        </div>
                    </div>
                </div>
                <div>
                    <this.FilterSelected />
                </div>
                <div>
                    <table>
                        <tbody>
                            <tr>
                                <th>main</th>
                                <th>side</th>
                                <th>name</th>
                                <th>eaten</th>
                                <th>days</th>
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