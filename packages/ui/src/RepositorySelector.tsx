import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./shad/ui/dropdown-menu";
import { SiGithub } from "@icons-pack/react-simple-icons";
import Link from "next/link";

export const RepositorySelector = () => {
  return (
    <div>
      <DropdownMenu>
        <DropdownMenuTrigger>
          <SiGithub className="text-white hover:text-blue-500" />
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuLabel>Github Repos</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <Link target="_blank" href={"https://github.com/100xdevs-cohort-2"}>
            <DropdownMenuItem>100xDevs Cohort 2</DropdownMenuItem>
          </Link>
          <Link target="_blank" href={"https://github.com/code100x"}>
            <DropdownMenuItem>Code100x</DropdownMenuItem>
          </Link>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};
