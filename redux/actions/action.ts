import { USER } from "../type/types"
import { AUTH } from '../type/types'

export const userLoggedIn = (data: any) => {
    return {
        type: USER.LOGGED_IN,
        payload: data
    }
}

export const userLogout = () => {
    return {
        type: USER.LOGGED_OUT
    }
}

export const authorized = () => {
    return {
        type: AUTH.AUTH_APPROVED
    }
}

export const unauthorized = () => {
    return {
        type: AUTH.AUTH_DENIED
    }
}