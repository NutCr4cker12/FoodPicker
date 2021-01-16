const transactionState = {
    transactions: {
        page: 0,
        skip: 0,
        limit: 100,
        data: []
    }
}

export default (state = transactionState, action) => {
    switch (action.type) {
        case "SET_TRANSACTION":
            return Object.assign({}, state, { transactions: action.transactions })
        default:
            return state;
    }
}