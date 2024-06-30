import { Button, ScrollArea } from "@repo/ui";
import { useEffect, useState } from "react";
import { SquarePen } from "lucide-react";
import MDEditor from "@uiw/react-md-editor";
import Editor from "@monaco-editor/react";
import {
  Dialog,
  DialogContent,
  DialogClose,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  useToast
} from "@repo/ui";
import { Input } from "@repo/ui";
import { Label } from "@repo/ui";
import { activeSubmissionResultSelector, languageState, problemStatementIdState } from "@repo/store";
import { useRecoilValue } from "recoil";
import { getAllLanguagesSupported } from "../utils";
import { CodeLanguage } from "@prisma/client";

const editorDefualtValue = `
  # Intuition 

  <!-- Describe your first thoughts on how to solve this problem. --> 
  
  # Approach 
  
  <!-- Describe your approach to solving the problem. --> 
  
  # Complexity 
  
  - Time complexity: <!-- Add your time complexity here, e.g. $$O(n)$$ --> 
  
  - Space complexity: <!-- Add your space complexity here, e.g. $$O(n)$$ -->`;

export function AddSolution() {
  const [title, setTitle] = useState<string>("");
  const [explanation, setExplanation] = useState<string | undefined>(editorDefualtValue);
  const submissionDetails = useRecoilValue(activeSubmissionResultSelector);
  const language = useRecoilValue(languageState);
  const problemStatementId = useRecoilValue(problemStatementIdState);
  const [languageId, setLanguageId] = useState<number>();
  const [open, setOpen] = useState(false);
  const { toast } = useToast();
  const [toggleButton, setToggleButton] = useState<boolean>(false);

  async function handleAddSolution() {
    try {
      setToggleButton(true);
      const res = await fetch("/api/solution", {
        method: "POST",
        body: JSON.stringify({
          problemStatementId,
          title: title,
          explanation: explanation,
          code: submissionDetails.code,
          languageId: languageId,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      });
  
      if (res.status == 200) {
        const data = await res.json();
        console.log(data.solution);
        if (data.solution) {
          toast({
            title: "Added solution",
            description: "Solution added",
          });
          setOpen(false);
        }
        setToggleButton(false);
      }
    } catch (error) {
      toast({
        title: "An error occured",
        description: `${error}`
      });
    }
  }

  useEffect(() => {
    async function getLanguages() {
      const languages: CodeLanguage[] = await getAllLanguagesSupported();
      const selectedLanguage = languages.find((lang) => lang.value === language);
      if (selectedLanguage) {
        setLanguageId(selectedLanguage.id);
      }
    }
    getLanguages();
  }, []);

  return (
    <div>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button className="bg-[rgb(14,120,42)] text-white hover:bg-[#24572e]">
            <div className="flex gap-2 items-center">
              <SquarePen size={16} /> Solution
            </div>
          </Button>
        </DialogTrigger>
        <DialogContent className="min-w-full overflow-y-scroll max-h-[600px]">
          <DialogHeader>
            <DialogTitle className="flex justify-center text-xl">Add solution</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="flex items-center gap-8">
              <Label htmlFor="title" className="pl-8 text-lg">
                Title
              </Label>
              <Input
                id="title"
                placeholder="Add a title"
                className="col-span-3 mx-8"
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="language" className="pl-8 text-lg">
                Explanation
              </Label>
              {/* <Select disabled={true} value={language}>
                <SelectTrigger className="">
                  <SelectValue placeholder="Select a language" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={language}>{language}</SelectItem>
                </SelectContent>
              </Select> */}
            </div>
            <div className="flex flex-col gap-2 px-8">
              <MDEditor
                height={500}
                data-color-mode="dark"
                value={explanation}
                onChange={(val) => {
                  setExplanation(val);
                }}
                highlightEnable={false}
              />
              <div>
                <div className="py-4 font-semibold text-xl">Code</div>
                <ScrollArea className="rounded-md">
                  <Editor
                    height={"40vh"}
                    value={atob(submissionDetails.code)}
                    theme="vs-dark"
                    options={{
                      fontSize: 14,
                      scrollBeyondLastLine: false,
                      readOnly: true
                    }}  
                    language={language}
                    defaultLanguage="javascript"
                  />
                </ScrollArea>
              </div>
            </div>
          </div>
          <div className="flex justify-end">
              <Button 
                className="mr-4"
                onClick={() => setOpen(false)}>
                  Close
              </Button>
              <Button 
                className="mr-8"
                onClick={handleAddSolution}>
                  {toggleButton ? "Adding solution..." : "Add solution"}
              </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
