import { Iuser } from "./user";

export interface IrootState {
    user: Iuser
    auth: boolean
}