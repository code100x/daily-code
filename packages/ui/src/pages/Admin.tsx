import { ProblemEditor } from "../ProblemEditor";
import { TracksEditor } from "../TracksEditor";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../shad/ui/tabs";
import { getAllProblems } from "../../../../apps/web/components/utils";

export const Admin = async () => {
  const problems = await getAllProblems();
  return (
    <div className="pt-2">
      <div className="flex justify-center">
        <Tabs defaultValue="problems" className="w-full">
          <div className="flex justify-center my-2">
            <TabsList>
              <TabsTrigger value="problems">Problems</TabsTrigger>
              <TabsTrigger value="tracks">Tracks</TabsTrigger>
            </TabsList>
          </div>
          <TabsContent value="problems">
            <ProblemEditor problems={problems} />
          </TabsContent>
          <TabsContent value="tracks">
            <TracksEditor />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};
