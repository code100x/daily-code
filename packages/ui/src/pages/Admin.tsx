import { ProblemEditor } from "../ProblemEditor";
import { TracksEditor } from "../TracksEditor";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../shad/ui/tabs";
import { getAllCategories, getAllProblems, getAllTracks } from "web/components/utils";
import { LinkProblems } from "../LinkProblems";
import CompleteAddTracks from "../CompleteAddTracks";
import AdminSearch from "../AdminSearch";
import db from "@repo/db/client";
import AdminMCQ from "../AdminMCQ";

export const Admin = async () => {
  const problems = await getAllProblems();
  const tracks = await getAllTracks();
  const categories = await getAllCategories();
  const TracksinSearch = await db.track.findMany({
    where: {
      inSearch: true,
    },
  });
  const TracksNotinSearch = await db.track.findMany({
    where: {
      inSearch: false,
    },
  });
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
              <TabsTrigger value="search">Search</TabsTrigger>
              <TabsTrigger value="MCQ">MCQ</TabsTrigger>
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
          <TabsContent value="search">
            <AdminSearch TracksNotinSearch={TracksNotinSearch} TracksinSearch={TracksinSearch} />
          </TabsContent>
          <TabsContent value="MCQ">
            <AdminMCQ />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};
