import { Blog } from "./Blog";
import { Problem, Track } from "@prisma/client";
import MCQRenderer from "./mcq/MCQRenderer";
import RedirectToLoginCard from "./RedirectToLoginCard";
import { getServerSession } from "next-auth";
import { authOptions } from "../lib/auth";
import { AppbarClient } from "./AppbarClient";

export const LessonView = async ({
  problem,
  track,
  showAppBar,
  showPagination = false,
  isPdfRequested,
}: {
  problem: Problem & { notionRecordMap: any };
  track: Track & { problems: Problem[] };
  showAppBar?: boolean;
  showPagination?: boolean;
  isPdfRequested?: boolean;
}) => {
  const session = await getServerSession(authOptions);
  const problemIndex = track.problems.findIndex((p) => p.id === problem.id);

  // eslint-disable-next-line turbo/no-undeclared-env-vars
  const isInDevMode = process?.env?.NODE_ENV === "development";

  if (!isInDevMode && problemIndex > 1 && (!session || !session.user)) {
    return (
      <div>
        <AppbarClient />
        <RedirectToLoginCard />
      </div>
    );
  }

  if (problem.type === "MCQ") {
    return <MCQRenderer problem={problem} track={track} showAppBar={!!showAppBar} problemIndex={problemIndex} />;
  }

  if (problem.type === "Blog") {
    return (
      <Blog
        isPdfRequested={isPdfRequested}
        problem={problem}
        problemIndex={problemIndex}
        showAppBar={!!showAppBar}
        showPagination={showPagination}
        track={track}
      />
    );
  }
  return <div>Not found</div>;
};
