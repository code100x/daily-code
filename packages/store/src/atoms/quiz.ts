import { atom, selector } from "recoil";

export const scoreState = atom({
    key: "scoreState",
    default: 0,
});