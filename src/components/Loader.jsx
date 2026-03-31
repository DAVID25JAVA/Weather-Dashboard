import { CloudSun } from "lucide-react";

export default function Loader() {
  return (
    <div className="relative flex h-screen items-center justify-center">
      {/* Spinning Ring */}
      <div className="w-20 h-20 border-4 border-blue-300 border-t-blue-600 rounded-full animate-spin"></div>

      {/* Icon in Center */}
      <div className="absolute">
        <CloudSun className="text-blue-600 animate-pulse" size={30} />
      </div>
    </div>
  );
}
