import {combineReducers} from 'redux'

// Reducers
import {user} from './userReducer'
import {auth} from './auth'
import { IrootState } from '../../interfaces/rootState'

export const rootReducer = combineReducers<IrootState>({
    user,
    auth
})