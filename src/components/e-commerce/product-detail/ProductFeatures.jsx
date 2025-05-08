// components/ProductFeatures.jsx
export default function ProductFeatures() {
    const features = [
      { label: "Band", value: "Smart Band" },
      { label: "Compatible Devices", value: "Smartphones" },
      { label: "Ideal For", value: "Unisex" },
      {
        label: "Lifestyle",
        value: "Fitness | Indoor | Sports | Swimming | Outdoor",
      },
      {
        label: "Basic Features",
        value: "Calendar | Date & Time | Timer/Stop Watch",
      },
      {
        label: "Health Tracker",
        value: "Heart Rate | Exercise Tracker",
      },
    ];
  
    return (
      <div className="p-6 bg-white rounded-lg shadow-md mt-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-12">
          {features.map((item, idx) => (
            <div key={idx} className="flex">
              <div className="w-48 text-gray-500 font-medium">{item.label}:</div>
              <div className="text-gray-700">{item.value}</div>
            </div>
          ))}
        </div>
      </div>
    );
  }
  