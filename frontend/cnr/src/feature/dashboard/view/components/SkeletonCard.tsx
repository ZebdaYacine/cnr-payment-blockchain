// components/SkeletonCard.tsx

export default function SkeletonCard({
  lines = 3,
  height = "h-60",
  rounded = "rounded-xl",
  className = "",
}: {
  lines?: number;
  height?: string;
  rounded?: string;
  className?: string;
}) {
  return (
    <div
      className={`card bg-base-200 shadow animate-pulse p-4 ${height} ${rounded} ${className}`}
    >
      <div className="h-5 w-32 bg-gray-300 rounded mb-3 skeleton" />
      <div className="h-3 w-20 bg-gray-200 rounded mb-4 skeleton" />
      <div className="space-y-2">
        {Array.from({ length: lines }).map((_, i) => (
          <div key={i} className="h-4 bg-gray-100 rounded skeleton" />
        ))}
      </div>
    </div>
  );
}
