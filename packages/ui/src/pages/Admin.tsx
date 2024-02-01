import { ProblemEditor } from "../ProblemEditor";
import { TracksEditor } from "../TracksEditor";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../shad/ui/tabs";

export const Admin = () => {
  return (
    <div className="pt-2">
      <div className="flex justify-center">
        <Tabs defaultValue="problems" className="w-full">
          <TabsList>
            <TabsTrigger value="problems">Problems</TabsTrigger>
            <TabsTrigger value="tracks">Tracks</TabsTrigger>
          </TabsList>
          <TabsContent value="problems">
            <ProblemEditor />
          </TabsContent>
          <TabsContent value="tracks">
            <TracksEditor />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};
