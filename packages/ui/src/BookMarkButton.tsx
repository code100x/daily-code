"use client";
import { ArrowRightIcon, BookmarkFilledIcon, BookmarkIcon, ChevronRightIcon } from "@radix-ui/react-icons";
import { Track, Problem } from "@prisma/client";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useToast } from "./shad/ui/use-toast";
import axios from "axios";

interface TrackCardProps extends Track {
  problems: Problem[];
  categories: {
    category: {
      id: string;
      category: string;
    };
  }[];
}

const BookMarkComponent = ({ track, bookmarkStatus }: { track: TrackCardProps, bookmarkStatus: Boolean }) => {

  const [BookMarkStatus, setBookMarkStatus] = useState<Boolean | null>(null);

  const { toast } = useToast();
  const { data, status } = useSession();

  // @ts-ignore
  const userid = data && data?.user?.id;

  const toggleBookmarkHandler = async () => {
    if (status === "unauthenticated") {
      toast({
        title: "",
        className: "bg-primary text-white dark:text-black",
        description: "Log in to bookmark this ",
        variant: "destructive",
      });
      return;
    }
    setBookMarkStatus((prev) => !prev);
    try {
      if (BookMarkStatus === false) {
        const { data } = await axios.post("/api/bookmark", {
          userid,
          trackid: track.id,
        });

        data &&
          data.data == "created" &&
          toast({
            description: "Bookmark Added Successfully",
            className: "bg-primary text-white dark:text-black",
            variant: "default",
          });
      }
      if (BookMarkStatus === true) {
        const { data } = await axios.delete("/api/bookmark", {
          data: {
            userid,
            trackid: track.id,
          },
        });

        data &&
          data.data == "deleted" &&
          toast({
            description: "Bookmark Deleted Successfully",
            className: "bg-primary text-white dark:text-black",
            variant: "default",
          });
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    setBookMarkStatus(bookmarkStatus)

  }, [status, bookmarkStatus]);


  return (
    <div>
      {
        BookMarkStatus === true && status === "authenticated" ?
          <BookmarkFilledIcon className="m-3 cursor-pointer " width={23} height={23} onClick={toggleBookmarkHandler} /> : null
      }
      {BookMarkStatus === false && status === "authenticated" ?
        <BookmarkIcon className="m-3 cursor-pointer " width={23} height={23} onClick={toggleBookmarkHandler} /> : null
      }
    </div>
  );
};

export default BookMarkComponent;
