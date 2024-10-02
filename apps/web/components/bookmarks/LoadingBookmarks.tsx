// app/bookmarks/LoadingBookmarks.tsx
export function LoadingBookmarks() {
  return (
    <div className="space-y-4">
      {[1, 2, 3].map((i) => (
        <div key={i} className="animate-pulse rounded-lg bg-white p-6 shadow-md">
          <div className="mb-2 h-6 w-3/4 rounded bg-gray-200"></div>
          <div className="mb-2 h-4 w-full rounded bg-gray-200"></div>
          <div className="flex justify-between">
            <div className="h-4 w-1/4 rounded bg-gray-200"></div>
            <div className="h-4 w-1/4 rounded bg-gray-200"></div>
          </div>
        </div>
      ))}
    </div>
  );
}
