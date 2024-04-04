import { Problem, Track } from "@prisma/client";
import { ScrollArea } from "./shad/ui/scroll-area";
import { NotionRenderer } from "./NotionRenderer";
import { BlogAppbar } from "./BlogAppbar";
import MCQQuestionCard from "./MCQQuestionCard";

const MCQQuestionRenderer = ({
  problem,
  track,
  showAppBar,
}: {
  problem: Problem & { notionRecordMap: any };
  track: Track & { problems: Problem[] };
  showAppBar?: Boolean;
}) => {
  return (
    <div>
      {showAppBar && <BlogAppbar problem={problem} track={track} />}
      <div className="grid grid-cols-3">
        <ScrollArea className="h-screen p-2 rounded-lg col-span-2">
          <div className="w-2/3">
            <NotionRenderer recordMap={problem.notionRecordMap} />
          </div>
        </ScrollArea>
        <ScrollArea className="h-screen p-2 rounded-lg">
          <MCQQuestionCard problem={problem} />
        </ScrollArea>
      </div>
    </div>
  );
};

export default MCQQuestionRenderer;
