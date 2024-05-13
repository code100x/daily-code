import { ProblemEditor } from "../components/ProblemEditor";
import { TracksEditor } from "../components/TracksEditor";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@repo/ui";
import { LinkProblems } from "../components/LinkProblems";
import CompleteAddTracks from "../components/CompleteAddTracks";
import AdminMCQ from "../components/AdminMCQ";
import { ProblemStatements } from "../components/admin/code/ProblemStatements";
import { getAllCategories, getAllProblems, getAllTracks } from "../components/utils";

export const Admin = async () => {
  const problems = await getAllProblems();
  const tracks = await getAllTracks();
  const categories = await getAllCategories();
  return (
    <div className="pt-2">
      <div className="flex justify-center">
        <Tabs defaultValue="auto" className="w-full">
          <div className="flex justify-center my-2">
            <TabsList>
              <TabsTrigger value="auto">Complete Track</TabsTrigger>
              <TabsTrigger value="problems">Problems</TabsTrigger>
              <TabsTrigger value="tracks">Tracks</TabsTrigger>
              <TabsTrigger value="link">Link</TabsTrigger>
              <TabsTrigger value="MCQ">MCQ</TabsTrigger>
              <TabsTrigger value="problem-statement">Problem Statements</TabsTrigger>
            </TabsList>
          </div>
          <TabsContent value="auto">
            <CompleteAddTracks categories={categories} />
          </TabsContent>
          <TabsContent value="problems">
            <ProblemEditor problems={problems} />
          </TabsContent>
          <TabsContent value="tracks">
            <TracksEditor tracks={tracks} />
          </TabsContent>
          <TabsContent value="link">
            <LinkProblems tracks={tracks} />
          </TabsContent>
          <TabsContent value="MCQ">
            <AdminMCQ />
          </TabsContent>
          <TabsContent value="problem-statement">
            <ProblemStatements />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};
