import { combineReducers } from 'redux'
import app from './App/AppReducer'
import user from './App/userReducer'
import drawer from './App/drawerReducer'
import profile from './App/profileReducer'
import food from './foods/foodReducers'
import payment from './payments/paymentReducer'

export default combineReducers({
    app,
    user,
    drawer,
    profile,
    food,
    payment,
})
