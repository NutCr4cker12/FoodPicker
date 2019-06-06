import React from 'react';
import axios from 'axios';
import "./index.css";

// const URL = "http://localhost:3001/api/foods"
const URL = "https://kisaeeheifoodpicker.herokuapp.com"

const MAINTYPEFILTERS = ["liha", "kana", "kala", "kasvis"]
const SIDETYPEFILTERS = ["pasta", "peruna", "riisi", "salaatti", "bataatti"]
const SPEEDTYPEFILTERS = ["slow", "normal", "fast"]

const getFilterType = (type) => {
    return (
        MAINTYPEFILTERS.indexOf(type) !== -1 ? "main" :
        SIDETYPEFILTERS.indexOf(type) !== -1 ? "side" :
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
            speedtypefilter: {on: [], off: SPEEDTYPEFILTERS}
        }
    }

    componentDidMount() {
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
        }) :
        this.setState({
            speedtypefilter : {on: this.state.speedtypefilter.on.filter(
                value => value !== type
            ),
                off: this.state.speedtypefilter.off.concat(type)}
        })
        console.log(this.state)
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
        }) :
        this.setState({
            filtersPressed: this.state.filtersPressed.concat(type),
            speedtypefilter: {on: this.state.speedtypefilter.on.concat(type),
                off: this.state.speedtypefilter.off.filter(
                value => value !== type
            )}
        })
        console.log(this.state)
    }

    FilterSelected = () => {
        return (
            this.state.filtersPressed.map((type, i) =>
                <button onClick={this.DeactivateFilter.bind(this, type)}
                    key={i}>{type}</button>
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
        return (
                    <h6>
                        <p><Mains /></p>
                        <p><Side /></p>
                        <p><Speed /></p>
                    </h6>
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
    }

    slowestFood() {
        let slowest = 600
        let arr = this.state.speedtypefilter.on
        for (let i = 0; i < arr.length; i++) {
            if (arr[i] === "fast") {
                slowest = 30
            } else if (arr[i] === "normal") {
                slowest = 60
            }
        }
        return slowest
    }

    FilteredFoods() {
        if (this.state.filtersPressed.length === 0)
            return this.state.foods
        let mainfilter = this.state.maintypefilter.on.length === 0 ?
            this.state.maintypefilter.off :
            this.state.maintypefilter.on
        let sidefilter = this.state.sidetypefilter.on.length === 0 ?
            this.state.sidetypefilter.off :
            this.state.sidetypefilter.on
        const arr = this.state.foods.filter(food =>
                mainfilter.indexOf(food.maintype) !== -1 &&
                sidefilter.indexOf(food.sidetype) !== -1 &&
                food.time < this.slowestFood()
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
            <td onClick={this.SelectFood.bind(this, food)}>PICKME</td>
            </tr>
        ))
    }

    render() {
        return (
            <div>
                <h3>Filter selected</h3>
                <this.FilterSelected />
                <h3>Filters available</h3>
                <this.FilterAvailable />
                <table>
                    <tbody>
                        <tr>
                            <th>main</th>
                            <th>side</th>
                            <th>name</th>
                            <th>Choose</th>
                        </tr>
                        <this.FoodTable foods={this.FilteredFoods()} />
                    </tbody>
                </table>
            </div>
        )
    }
}

export default App