import { Problem } from "../../store/src/atoms";
import { CodeProblemRenderer } from "./CodeProblemRenderer";

export const LessonView = ({ problem }: { problem: Problem }) => {
    if (problem.type === "code") {
        return <CodeProblemRenderer problem={problem} />
    }
}