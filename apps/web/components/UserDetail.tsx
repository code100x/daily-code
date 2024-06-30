import UserImage from "./UserImage";
import { Avatar } from "./solution/Solution";
import SubmissionCreatedAt from "./submission/SubmissionCreatedAt";

export function UserDetail({solution}: {solution: any}) {
  return (
    <div>
      <div className="flex gap-3">  
        {!solution.user?.image ? (
          <Avatar />
        ) : (
          <div className="pt-2">
            <UserImage image={solution.user?.image} height={40} width={40} />
          </div>
        )}
        <div className="flex flex-col">
          <div className="text-xs">
            <div className="mt-2 text-md">
              {solution?.user?.name}
            </div>
            <SubmissionCreatedAt createdAt={solution.createdAt} />
          </div>
        </div>
      </div>
    </div>
  )
}