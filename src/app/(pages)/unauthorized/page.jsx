// app/unauthorized/page.jsx
export default function Unauthorized() {
  return (
    <div className="p-6 text-center">
      <h1 className="text-2xl font-bold text-red-500">Access Denied</h1>
      <p className="mt-4">You do not have permission to view this page.</p>
    </div>
  );
}