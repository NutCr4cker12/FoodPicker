import React from 'react';
import axios from 'axios';

class App extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
          persons: []
        }
    }
    render() {
        return (
            <div>
                <h1>Hello World</h1>
            </div>
        )
    }
}

export default App