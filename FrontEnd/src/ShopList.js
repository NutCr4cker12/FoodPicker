import React from 'react';
import App from "./app"

class ShopList extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            name: props.name,
            prevState: props.prevState,
            return: false
        }
    }

    FoodPicker = () => {
        console.log("wadup")
        return <App state={this.state.prevState}/>
    }

    render() {
        console.log(this.state.prevState)
        return this.state.return ? <App state={this.state.prevState}/>
        : (
            <div>
                <h1 onClick={() => this.setState({return: true})}>{this.state.name}</h1>
            </div>
        )
    }
}

export default ShopList