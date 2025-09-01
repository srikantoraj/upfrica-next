
// src/app/utils/showToast.js
import { toast } from "react-hot-toast"
import { X } from "lucide-react" // or any icon you like

/**
 * Display a toast with close button and custom style
 * @param {string} message - The message to display
 * @param {'success' | 'error' | 'info' | 'loading'} type - Type of toast
 */
export const showToast = (message, type = "error") => {
  toast.custom((t) => (
    <div
      className={`${
        t.visible ? 'animate-enter' : 'animate-leave'
      } max-w-sm w-full bg-white shadow-lg rounded-lg pointer-events-auto flex ring-1 ring-black ring-opacity-5 border-l-4 ${
        type === 'success'
          ? 'border-green-600'
          : type === 'error'
          ? 'border-red-600'
          : type === 'info'
          ? 'border-blue-600'
          : 'border-yellow-500'
      }`}
    >
      <div className="flex-1 w-0 p-4">
        <p
          className={`text-sm font-medium ${
            type === 'success'
              ? 'text-green-800'
              : type === 'error'
              ? 'text-red-800'
              : type === 'info'
              ? 'text-blue-800'
              : 'text-yellow-800'
          }`}
        >
          {message}
        </p>
      </div>
      <div className="flex border-l border-gray-200">
        <button
          onClick={() => toast.dismiss(t.id)}
          className="w-full rounded-none rounded-r-lg p-2 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
        >
          <span className="sr-only">Close</span>
          <X className="h-4 w-4 text-gray-700" />
        </button>
      </div>
    </div>
  ), { duration: 5000 })
}