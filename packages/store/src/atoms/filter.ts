import { atom } from "recoil";
export const categories = atom<string[]>({
  key: "categories",
  default: [],
});
