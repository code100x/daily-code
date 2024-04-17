"use client";
import { useCallback, useEffect, useState } from "react";
import { getAllProblemStatements } from "web/components/utils";

export default function useProblemStatement() {
  const [problemStatements, setProblemStatements] = useState();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchProblemStatement = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const ps = await getAllProblemStatements();
      setProblemStatements(ps);
    } catch (e) {
      setError("Something Went Wrong!");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProblemStatement();
  }, [fetchProblemStatement]);

  return { problemStatements, isLoading, error, refetch: fetchProblemStatement };
}
