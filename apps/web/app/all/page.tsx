"use client";

import { Button } from "@repo/ui/button";
import { useState } from "react";

const createSearchIndex = () => {
  const [loading, setLoading] = useState(false);
  const [Error, setError] = useState(false);
  const [Success, setSucces] = useState(false);

  const handleClick = async () => {
    setLoading(true);
    try {
      const response = await fetch("api/all", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        setSucces(true);
      } else {
        setError(true);
      }
    } catch (error) {
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen w-screen flex justify-center items-center">
      <Button onClick={handleClick} disabled={loading}>
        Create Index For Existing Tracks
      </Button>
      {loading && "Creating Index..."}
      {Error && "Something went wrong"}
      {Success && "index created"}
    </div>
  );
};

export default createSearchIndex;
