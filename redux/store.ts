import { createStore, compose, Store, AnyAction, EmptyObject } from 'redux'
import { persistStore, persistReducer } from 'redux-persist'
import { composeWithDevTools } from 'redux-devtools-extension'
import storage from 'redux-persist/lib/storage'
import {createWrapper, HYDRATE, Context} from 'next-redux-wrapper'

// Main Reducer
import {rootReducer} from './reducers/rootReducer'
import { IrootState } from '../interfaces/rootState'
import { PersistPartial } from 'redux-persist/es/persistReducer'

export interface State {
    tick: string;
}

declare global {
    interface Window {
       __REDUX_DEVTOOLS_EXTENSION_COMPOSE__?: typeof compose;
    }
}

const persistConfig = {
    key: 'Hello',
    storage
}

const reducer = (state: State = {tick: 'init'}, action: AnyAction) => {
    switch (action.type) {
        case HYDRATE:
            // Attention! This will overwrite client state! Real apps should use proper reconciliation.
            return {...state, ...action.payload};
        case 'TICK':
            return {...state, tick: action.payload};
        default:
            return state;
    }
};

const makeStore = (context: Context) => createStore(reducer);
// const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__  || compose;
const persistedReducer = persistReducer(persistConfig, rootReducer)
const composeEnhancers = compose;
export const store = createStore(persistedReducer, composeWithDevTools(composeEnhancers()))
export const persistor = persistStore(store as any)
export const wrapper = createWrapper<Store<State>>(makeStore, {debug: true});
// export const wrapper = createWrapper(store, {debug: true})