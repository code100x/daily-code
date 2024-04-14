import { useEffect, useState } from "react";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "./shad/ui/sheet";
import EditProblem from "./EditProblem";
import { Button } from "./shad/ui/button";
import { createTrack } from "../../../apps/web/components/utils";

interface CompleteProblemCard {
  id: string;
  title: string;
  notionDocId: string;
}
interface CompleteTrackCard {
  trackId: string;
  trackTitle: string;
  trackDescription: string;
  trackImage: string;
  selectedCategory: string;
}

const CompleteTrackCard = ({ notionId, TrackData }: { notionId: string; TrackData: CompleteTrackCard }) => {
  function handleAddTrack() {
    setIsSubmitting(true);
    createTrack({
      id: TrackData.trackId,
      title: TrackData.trackTitle,
      description: TrackData.trackDescription,
      image: TrackData.trackImage,
      problems: {
        create: dbData.reverse(),
      },
      selectedCategory: TrackData.selectedCategory,
    });
  }

  const [problemData, setProblemData] = useState<CompleteProblemCard[]>([]);
  const [addButton, setAddButton] = useState(false);
  const [dbData, setDbData] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const dbData = [];

    for (let i = 0; i < problemData.length; i++) {
      let problem = {
        sortingOrder: problemData.length - i,
        problem: {
          create: {
            id: problemData[i]?.id,
            notionDocId: problemData[i]?.notionDocId,
            title: problemData[i]?.title,
            description: problemData[i]?.title,
            type: "Blog",
          },
        },
      };
      dbData.push(problem);
    }
    setDbData(dbData);
  }, [problemData]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`http://localhost:3000/api/AddTracks`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ notionId }),
        });
        if (response.ok) {
          const data = await response.json();
          data.forEach((problem, i) => {
            problem.id = `${TrackData.trackTitle.replace(" ", "")}-${i + 1}`;
          });
          setProblemData(data);
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
          {problemData?.map((problem, i) => <EditProblem key={i} problem={problem} />)}
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
