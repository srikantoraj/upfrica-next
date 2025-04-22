import React, { useState } from 'react';
import ReactSlider from 'react-slider';
import './PriceRange.css';

const PriceRange = () => {
    // Using one state array to store the two values [min, max]
    const [priceRange, setPriceRange] = useState([0, 1000]);

    return (
        <div className="price-range-container p-5 bg-white border border-[#dee2e6] drop-shadow-[0_0_10px_rgba(0,0,0,0.1)]" style={{ margin: '0px' }}>
            <label className="block text-sm font-medium mb-1">Price Range</label>
            <ReactSlider
                className="horizontal-slider"
                thumbClassName="thumb"
                trackClassName="track"
                value={priceRange}
                min={0}
                max={1000}
                onChange={(newValues) => setPriceRange(newValues)}
                withTracks={true}
            />
            <div className="flex justify-between mt-2">
                <span className="text-sm">Min: {priceRange[0]}</span>
                <span className="text-sm">Max: {priceRange[1]}</span>
            </div>
        </div>
    );
};

export default PriceRange;
