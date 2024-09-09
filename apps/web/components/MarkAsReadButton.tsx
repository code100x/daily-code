'use client';

import { Button } from '@repo/ui'; // Adjust import as needed
import { Check } from 'lucide-react';
import { useEffect, useState } from "react";


const MarkAsReadButton = ({ trackId, disabled = false, currentProblemIndex, totalProblems }: { trackId: string, disabled?: boolean, currentProblemIndex: number, totalProblems: number }) => {
    const [isComplete, setIsComplete] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (currentProblemIndex === totalProblems - 1) {
            const checkProgress = async () => {
                try {
                    const response = await fetch(`/api/tracks/${trackId}/progress`, {
                        method: 'GET',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                    });
                    if (response.ok) {
                        const result = await response.json();
                        setIsComplete(result.progress);
                    }
                } catch (error) {
                    console.error('Error while checking the track progress:', error);
                } finally {
                    setLoading(false);
                }
            }
            checkProgress()
        }
    }, [currentProblemIndex, trackId, totalProblems]);

    const handleClick = async () => {
        try {
            const response = await fetch(`/api/tracks/${trackId}/mark-as-completed`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error('Failed to mark track as complete');
            }

            setIsComplete(true);
            localStorage.setItem(`track_${trackId}_completed`, 'true');
        } catch (err) {
            console.error('Error marking track as complete:', err);
        }
    };

    if (currentProblemIndex !== totalProblems - 1 || loading) {
        return null;
    }

    return (
        <Button onClick={handleClick} className="flex gap-2 bg-[#323232] font-semibold dark:bg-slate-50" size={"lg"} disabled={isComplete}>
            {isComplete ? "Completed" : "Mark as Completed"}
            <Check className="size-4" />
        </Button>
    );
};

export default MarkAsReadButton;
