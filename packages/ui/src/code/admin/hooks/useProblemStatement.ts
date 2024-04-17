"use client";
import { Dispatch, SetStateAction, useCallback, useEffect, useState } from "react";
import { getAllProblemStatements } from "web/components/utils";
import { ProblemStatement } from "prisma/prisma-client";

export default function useProblemStatement() {
  const [problemStatements, setProblemStatements]: [ProblemStatement[], Dispatch<SetStateAction<ProblemStatement[]>>] =
    useState<ProblemStatement[]>([]);
  const [isLoading, setIsLoading]: [boolean, Dispatch<SetStateAction<boolean>>] = useState(true);
  const [error, setError]: [string | null, Dispatch<SetStateAction<string | null>>] = useState<string | null>(null);

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
