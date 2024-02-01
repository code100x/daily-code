import { useEffect, useState } from "react";
import { Input } from "./shad/ui/input";
import { Button } from ".";
import { Card } from "./shad/ui/card";
import { getFunction } from "@repo/common";
import { useToast } from "./shad/ui/use-toast";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./shad/ui/select";

const data = [
    {
        id: 'wsefgrf1',
        title: 'Problem 1',
        description: 'This is a problem description',
        notionId: '123'
    },
    {
        title: 'Problem 2',
        description: 'This is a problem description',
        notionId: '124'
    },
    {
        title: 'Problem 3',
        description: 'This is a problem description',
        notionId: '125'
    },
];

export const ProblemEditor = () => {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [notionDocId, setNotionDocId] = useState("");
    const [problems, setProblems] = useState<any>([]);
    const [type, setType] = useState("code");
    const addProblemFn = getFunction("addProblem");
    const editProblemFn = getFunction("editProblem");
    const getAllProblemsFn = getFunction("allProblem");
    const { toast } = useToast();
    const [isEdit, setIsEdit] = useState(false);

    useEffect(() => {
        (async () => {
            const { data: { problems } }: any = await getAllProblemsFn();
            console.log("data", problems);
            setProblems(problems.map((problem : any) => ({ ...problem, 'title': 'this is a title' })));
        })();
    }, []);

    return (
        <div className="grid grid-cols-2">
            <div>
                {problems.map((problem :any)=> (
                    <div
                        className="p-2"
                        style={{
                            border: `1px solid white`,
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '10px'
                        }}
                        onClick={() => {
                            // go to notion page
                        }}
                    >
                        {!isEdit && <button className='p-1' style={{ border: `1px solid white` }} onClick={() => setIsEdit(true)}>Edit</button>}
                        {isEdit ? (
                            <Select onValueChange={(e) => {
                                setType(e);
                            }}>
                                <SelectTrigger className="w-[180px]">
                                    <SelectValue placeholder="Type" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="code">Code</SelectItem>
                                    <SelectItem value="blog">Blog</SelectItem>
                                </SelectContent>
                            </Select>
                        ) : (
                            <p>type : {problem.type}</p>
                        )}
                        <div>
                            {!isEdit ? <p>{problem.title}</p> : <Input type="text" defaultValue={problem.title} onChange={(e) => setTitle(e.target.value)} />}
                        </div>
                        <div>
                            {!isEdit ? <p>{problem.description}</p> : <Input type="text" defaultValue={problem.description} onChange={(e) => setDescription(e.target.value)} />}
                        </div>
                        <div>
                            {isEdit && (
                                <button
                                    className="p-1"
                                    style={{ border: `1px solid white` }}
                                    onClick={async () => {
                                        // save
                                        setIsEdit(false);
                                        await editProblemFn({
                                            problemId: problem,
                                            title: "",
                                            description: "",
                                            type: "",
                                            notionDocId: ""
                                        });
                                    }}
                                >
                                    Save
                                </button>
                            )}
                        </div>
                    </div>
                ))}
            </div>
            <Card className="cols-span-4 p-4 w-full">
                <Select onValueChange={(e) => {
                    setType(e);
                }}>
                    <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Type" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="code">Code</SelectItem>
                        <SelectItem value="blog">Blog</SelectItem>
                    </SelectContent>
                </Select>
                <Input type="text" placeholder="Problem title" onChange={(event) => {
                    setTitle(event.target.value);
                }} />
                <Input type="text" placeholder="Description" onChange={(event) => {
                    setDescription(event.target.value);
                }} />
                <Input type="text" placeholder="problem title" onChange={(event) => {
                    setNotionDocId(event.target.value);
                }} />
                <Button
                    disabled={!title || !description || !type || !notionDocId}
                    onClick={async () => {
                        await addProblemFn({
                            title,
                            description,
                            type,
                            notionDocId
                        });
                        toast({
                            title: "Added problem",
                            description: "Problem added"
                        });
                    }}
                >
                    Add
                </Button>
            </Card>
        </div>
    );
};
