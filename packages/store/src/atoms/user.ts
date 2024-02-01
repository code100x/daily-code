import { atom, selector } from "recoil";

export interface User {
  email: string;
  name: string;
}

export const userAtom = atom<null | User>({
  key: "userAtom",
  default: null,
});
