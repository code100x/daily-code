"use client";
import { Cross2Icon, MagnifyingGlassIcon } from "@radix-ui/react-icons";
import { Button } from "./shad/ui/button";
import { Dialog, DialogClose, DialogContent } from "./shad/ui/dailog";
import { useEffect, useState } from "react";
import algoliasearch from "algoliasearch";
import { InstantSearch, SearchBox, Hits } from "react-instantsearch";
import Link from "next/link";
import { Card, CardDescription, CardHeader } from "./shad/ui/card";

function HitsComponent({ hit, trackid }: { hit: any; trackid: string }) {
  return (
    <Link href={`/tracks/${trackid}/${hit.problemId}`} passHref>
      <div className="flex">
        <Card className="p-2 w-full mx-2">
          <div className="flex my-2">
            <img src={hit.ImgLink} className="flex mx-2 w-1/6 rounded-xl" />
            <div>
              <CardHeader>
                <CardDescription>{hit.title}</CardDescription>
              </CardHeader>
            </div>
          </div>
        </Card>
      </div>
    </Link>
  );
}

function TrackSearch({ trackid }: { trackid: string }) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [searchButton, setSearchButton] = useState(false);
  const [client, setClient] = useState<any>("");

  useEffect(() => {
    const Client = algoliasearch("VRLCKYEFSI", "20a234ddb95b0ad35cfcdba3fb187978");
    setClient(Client);
  }, []);

  function handleClose(open: boolean) {
    if (!open) setDialogOpen(false);
  }

  return (
    <>
      {client && (
        <InstantSearch searchClient={client} indexName={trackid}>
          <Dialog open={dialogOpen} onOpenChange={handleClose}>
            <Button variant="outline" className="pr-2" onClick={() => setDialogOpen(true)}>
              <div className="md:flex gap-2 items-center hidden">
                <MagnifyingGlassIcon className="h-[1.2rem] w-[1.2rem]" />
                Search...
                <kbd className="bg-white/15 p-1.5 rounded-sm text-xs leading-3">Ctrl K</kbd>
              </div>
              <div className="block md:hidden">
                <MagnifyingGlassIcon className="h-[1.2rem] w-[1.2rem]" />
              </div>
            </Button>
            <DialogContent className="p-0 gap-0 max-w-2xl">
              <div className="flex items-center px-4 py-2 border-b">
                <MagnifyingGlassIcon className="h-[1.5rem] w-[1.5rem]" />
                <SearchBox className="border-none focus-visible:outline-none focus-visible:ring-0 text-base shadow-none" />
                <Button variant="ghost" onClick={() => setSearchButton(!searchButton)}>
                  <MagnifyingGlassIcon className="h-[1.5rem] w-[1.5rem]" />
                  <div className="mx-2">Search</div>
                </Button>
                <DialogClose>
                  <Cross2Icon className="h-4 w-4" />
                  <span className="sr-only">Close</span>
                </DialogClose>
              </div>
              <div className="h-[400px] py-4 space-y-4 overflow-y-scroll">
                <Hits hitComponent={(props: any) => <HitsComponent {...props} trackid={trackid} />} />
              </div>
            </DialogContent>
          </Dialog>
        </InstantSearch>
      )}
    </>
  );
}

export default TrackSearch;
