import { atom, selector } from "recoil";

export interface Problem {
    description: string;
    defaultCode: {
        cpp: string;
        js: string;
    };
    notionDocId: string;
    notionRecordMap?: any;
    image: string;
    type: "code";
    title: string;
}

export interface Track {
    id: string;
    image: string;
    title: string;
    problems: string[];
    description: string;
}
