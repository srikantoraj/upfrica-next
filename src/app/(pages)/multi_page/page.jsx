import BulkEditMenu from "@/components/multi_page/BulkEditMenu";
import DraftTable from "@/components/multi_page/DraftTable";
import Header from "@/components/multi_page/Header";

export default function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="p-6 space-y-4">
        <BulkEditMenu />
        <DraftTable />
        <div className="flex justify-end gap-2 mt-4">
          <button className="bg-gray-300 px-4 py-2 rounded">
            Save for later
          </button>
          <button className="bg-blue-600 text-white px-4 py-2 rounded">
            Submit (1)
          </button>
        </div>
      </main>
    </div>
  );
}
