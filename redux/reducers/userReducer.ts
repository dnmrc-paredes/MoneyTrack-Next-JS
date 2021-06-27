import { AnyAction } from "redux";
import { USER } from "../type/types";

const INITIAL_STATE = {}

export const user = (state = INITIAL_STATE, action: AnyAction) => {
    switch(action.type) {
        case USER.LOGGED_IN: {
            return state = action.payload
        }
        case USER.LOGGED_OUT: {
            return state = {}
        }
        default: {
            return state
        }
    }
}