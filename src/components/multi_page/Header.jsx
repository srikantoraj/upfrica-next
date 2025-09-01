export default function Header() {
  return (
    <header className="flex justify-between items-center bg-white shadow p-4">
      <div className="flex items-center gap-4">
        <div className="bg-gray-200 w-10 h-10 rounded" />
        <h1 className="text-xl font-bold">Create multiple listings</h1>
      </div>
      <button className="text-sm text-blue-600 hover:underline">
        Send Feedback
      </button>
    </header>
  );
}
