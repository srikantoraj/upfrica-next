import React from "react";

const LaptopDetails = () => {
  const laptopDetails = [
    {
      Condition: "Renewed",
      Brand: "Dell",
      Type: "Laptops",
      ModelName: "Dell Latitude 3380",
      ScreenSizeInches: 13.3,
      HardDiskSizeGB: 128,
      CpuModelGHz: 2.0,
      RamMemoryGB: 4,
      OperatingSystem: "Windows 11",
      Series: "Core i3",
      Features: ["HDMI", "Bluetooth", "Camera", "WiFi Connection", "USB Ports"],
      UpfricaItemID: "JERB7PX8",
      ItemNumber: "0000003487",
    },
  ];

  return (
    <div className="space-y-4">
      {laptopDetails.map((details, index) => (
        <div key={index} className="space-y-3">
          {Object.entries(details).map(([key, value]) => (
            <div key={key} className="flex">
              <div className="font-bold text-gray-700 w-1/3 text-right pr-2">
                {key}:
              </div>
              <div className="text-gray-900 w-2/3 pl-2">
                {Array.isArray(value) ? value.join(", ") : value.toString()}
              </div>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default LaptopDetails;
