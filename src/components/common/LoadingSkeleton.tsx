interface LoadingSkeletonProps {
  isDark: boolean;
}

export default function LoadingSkeleton({ isDark }: LoadingSkeletonProps) {
  return (
    <div className="space-y-6 animate-pulse">
      <div
        className={`h-4 ${
          isDark ? "bg-gray-800" : "bg-gray-200"
        } rounded w-full`}
      ></div>
      <div
        className={`h-4 ${
          isDark ? "bg-gray-800" : "bg-gray-200"
        } rounded w-5/6`}
      ></div>
      <div
        className={`h-4 ${
          isDark ? "bg-gray-800" : "bg-gray-200"
        } rounded w-4/6`}
      ></div>
      <div
        className={`h-8 ${
          isDark ? "bg-gray-800" : "bg-gray-200"
        } rounded w-2/6 mt-8`}
      ></div>
      <div
        className={`h-4 ${
          isDark ? "bg-gray-800" : "bg-gray-200"
        } rounded w-full`}
      ></div>
      <div
        className={`h-4 ${
          isDark ? "bg-gray-800" : "bg-gray-200"
        } rounded w-5/6`}
      ></div>
      <div
        className={`h-4 ${
          isDark ? "bg-gray-800" : "bg-gray-200"
        } rounded w-3/6`}
      ></div>
    </div>
  );
}
