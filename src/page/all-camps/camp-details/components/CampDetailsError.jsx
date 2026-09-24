import { Link } from "react-router-dom";
import { FiArrowLeft } from "react-icons/fi";
import { IoCloudOfflineOutline } from "react-icons/io5";

export default function CampDetailsError({ onRetry }) {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-10 max-w-md w-full text-center">
        <div className="w-14 h-14 bg-red-50 rounded-2xl flex items-center justify-center mx-auto mb-5">
          <IoCloudOfflineOutline className="w-7 h-7 text-red-500" />
        </div>
        <h2 className="text-xl font-bold text-gray-900 mb-2">
          We couldn&apos;t load this camp
        </h2>
        <p className="text-sm text-gray-500 leading-relaxed mb-6">
          Something went wrong while fetching the camp details. Check your
          connection and try again.
        </p>
        <button
          type="button"
          onClick={onRetry}
          className="w-full bg-primary hover:bg-primary/90 text-white font-semibold py-3 rounded-xl transition-colors cursor-pointer"
        >
          Try Again
        </button>
        <Link
          to="/all-camps"
          className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-primary mt-4 transition-colors"
        >
          <FiArrowLeft className="w-4 h-4" />
          Back to all camps
        </Link>
      </div>
    </div>
  );
}
