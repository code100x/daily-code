import React from "react";
import "highlight.js/styles/github-dark-dimmed.css";
import "highlight.js/styles/github.css";
import { useToast } from "@repo/ui";
import { Copy } from "lucide-react";

export default function CodeBlock({ block }: { block: any }) {
  const code: string = block.properties.title[0].toString();

  const { toast } = useToast();

  return (
    <div className="w-full overflow-auto py-2">
      <pre
        onClick={() => {
          navigator.clipboard.writeText(code).then(() => {});
          toast({
            description: "Copied to clipboard",
          });
        }}
        className={`rounded-lg bg-secondary/50 justify-between flex lg:w-[35vw] p-6 relative group border border-primary/5 cursor-pointer `}
      >
        <code className="text-primary font-mono overflow-auto">{code}</code>
        <div
          className={`flex flex-col absolute top-4 right-4 text-primary/50 lg:opacity-25 group-hover:opacity-100 transition-all duration-300`}
        >
          <Copy className="size-4 text-primary/50" />
        </div>
      </pre>
    </div>
  );
}
