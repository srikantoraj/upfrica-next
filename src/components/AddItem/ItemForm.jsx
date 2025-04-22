// ItemForm.jsx
'use client'
import { useState } from 'react';
import DropdownSelect from './DropdownSelect';

const ItemForm = () => {
  const [brand, setBrand] = useState('Apple');
  const [model, setModel] = useState('Apple Watch Series 8');
  const [caseSize, setCaseSize] = useState('41 mm');
  const [os, setOS] = useState('iOS - Apple');
  const [band, setBand] = useState('Fluoroelastomer');

  return (
    <div className="">
      <h2 className="text-lg font-bold mb-4">Product Details</h2>

      <DropdownSelect
        label="Brand"
        tooltip="Name of the brand, designer or artist"
        options={['Apple', 'Samsung', 'Fitbit', 'Garmin']}
        selected={brand}
        setSelected={setBrand}
      />

      <DropdownSelect
        label="Model"
        tooltip="Specific name used for the product"
        options={['Apple Watch Series 8', 'Apple Watch SE', 'Apple Watch Ultra']}
        selected={model}
        setSelected={setModel}
      />

      <DropdownSelect
        label="Case Size"
        tooltip="Measured diagonally in mm"
        options={['38 mm', '40 mm', '41 mm', '44 mm', '45 mm']}
        selected={caseSize}
        setSelected={setCaseSize}
      />

      <DropdownSelect
        label="Compatible OS"
        tooltip="OS supported by the device"
        options={['iOS - Apple', 'Android', 'Windows']}
        selected={os}
        setSelected={setOS}
      />

      <DropdownSelect
        label="Band Material"
        tooltip="Main material of the watch band"
        options={['Fluoroelastomer', 'Leather', 'Silicone', 'Stainless Steel']}
        selected={band}
        setSelected={setBand}
      />
    </div>
  );
};

export default ItemForm;
