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

const BookMarkComponent = ({ track }: { track: TrackCardProps }) => {
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
      const { data } = await axios.post("/api/bookmark", {
        userid, 
        trackid: track.id,
      });
      data && data.data == "created"
        ? toast({
          description: "Bookmark Added Successfully",
          className: "bg-primary text-white dark:text-black",
          variant: "default",
        })
        : toast({
          className: "bg-primary text-white dark:text-black",
          description: "Bookmark Removed Successfully",
          variant: "default",
        });
    } catch (error) {
      console.log(error);
    }
  };
  const getBookMarkStatus = async () => {
    console.log(status);
    if (status === "unauthenticated" || data === null) {
      setBookMarkStatus(false);
      return;
    }
    try {
      if (status === "authenticated") {
        {
          const { data } = await axios.post("/api/getBookmarkStatus", {
            userid: userid,
            trackid: track.id,
          });

          if (data.success === true) {
            setBookMarkStatus(true);
          }
          if (data.success === false) {
            setBookMarkStatus(false);
          }
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getBookMarkStatus();
  }, [status]);

  return (
    <div>
      {BookMarkStatus && (
        <BookmarkFilledIcon className="m-3 cursor-pointer " width={23} height={23} onClick={toggleBookmarkHandler} />
      )}
      {BookMarkStatus === false && (
        <BookmarkIcon className="m-3 cursor-pointer " width={23} height={23} onClick={toggleBookmarkHandler} />
      )}
    </div>
  );
};

export default BookMarkComponent;
