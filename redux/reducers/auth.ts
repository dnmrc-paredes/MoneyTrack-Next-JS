import { AnyAction } from "redux";
import { AUTH } from "../type/types";

export const auth = (state = false, action: AnyAction) => {
    switch (action.type) {
        case AUTH.AUTH_APPROVED: {
            return state = true
        }
        case AUTH.AUTH_DENIED: {
            return state = false
        }
        default: {
            return state
        }
    }
}