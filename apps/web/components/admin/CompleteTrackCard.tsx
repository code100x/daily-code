import { Prisma, ProblemType } from "@prisma/client";
import { useEffect, useState } from "react";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger, Button } from "@repo/ui";
import EditProblem from "../EditProblem";
import { createTrack } from "../utils";
import { insertData } from "../../lib/search";

interface CompleteTrackCardProps {
  trackId: string;
  trackTitle: string;
  trackDescription: string;
  trackImage: string;
  selectedCategory: string[];
  cohort: string;
}

export interface Problem {
  sortingOrder: number;
  id: string;
  notionDocId: string;
  title: string;
  description: string;
  type: string;
}
const CompleteTrackCard = ({ notionId, TrackData }: { notionId: string; TrackData: CompleteTrackCardProps }) => {
  async function handleAddTrack() {
    setIsSubmitting(true);
    await createTrack({
      id: TrackData.trackId,
      title: TrackData.trackTitle,
      description: TrackData.trackDescription,
      image: TrackData.trackImage,
      hidden: false,
      problems: problems,
      selectedCategory: TrackData.selectedCategory,
      cohort: parseInt(TrackData.cohort),
    });
    await insertData(TrackData.trackId);
    setIsSubmitting(true);
  }

  const [addButton, setAddButton] = useState(false);
  const [problems, setProblems] = useState<{ problem: Prisma.ProblemCreateManyInput; sortingOrder: number }[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`/api/AddTracks`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ notionId }),
        });
        if (response.ok) {
          const data: { notionDocId: string; title: string }[] = await response.json();

          const dbData: { problem: Prisma.ProblemCreateManyInput; sortingOrder: number }[] = [];

          for (let i = 0; i < data.length; i++) {
            let problem = {
              id: `${TrackData.trackTitle.replace(/[^a-zA-Z0-9]/g, "-")}-${i + 1}`,
              notionDocId: data[i]?.notionDocId!,
              title: data[i]?.title!,
              description: data[i]?.title!,
              type: ProblemType.Blog,
            };
            dbData.push({ problem, sortingOrder: data.length - i });
          }

          setProblems(dbData);
        } else {
          throw new Error("Failed to fetch data");
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    if (notionId) {
      fetchData();
    }
  }, [addButton]);

  return (
    <div>
      <Sheet>
        <SheetTrigger
          onClick={() => setAddButton(!addButton)}
          className="h-9 px-4 py-2 inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground shadow hover:bg-primary/90"
        >
          View
        </SheetTrigger>
        <SheetContent side={"bottom"} className="h-4/5 overflow-y-auto space-y-4">
          <div className="text-5xl text-center mb-4"> Track Details </div>
          <div className="flex justify-center">
            <SheetHeader>
              <div className="grid grid-cols-6">
                <img
                  src={TrackData.trackImage}
                  className="flex m-4 min-h-[130px] sm:h-[130px] min-w-[130px] sm:w-[130px] rounded-xl"
                />
                <div className="col-span-5 flex items-center space-x-3">
                  <SheetTitle>{TrackData.trackTitle}</SheetTitle>
                  <SheetDescription>{TrackData.trackDescription}</SheetDescription>
                  <SheetDescription>{TrackData.selectedCategory}</SheetDescription>
                </div>
              </div>
            </SheetHeader>
          </div>
          <div className="text-5xl text-center mb-4"> Problem Details </div>
          {problems?.map(({ problem }, i) => <EditProblem key={i} problem={problem} />)}
          <Button className="flex mx-auto w-1/2" onClick={handleAddTrack} disabled={isSubmitting}>
            Add Track
          </Button>
          {isSubmitting && <div>Added Track to database</div>}
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default CompleteTrackCard;
