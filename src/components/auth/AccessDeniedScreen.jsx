//src/components/auth/AccessDeniedScreen.jsx
export default function AccessDeniedScreen() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-red-600">Access Denied</h1>
        <p className="mt-3 text-gray-600">
          You do not have permission to view this page.
        </p>
      </div>
    </div>
  );
}
