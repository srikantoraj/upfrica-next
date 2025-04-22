// useBrands.js
import { useEffect, useState } from "react";

const useBrands = () => {
    const [brands, setBrands] = useState([]);           // ব্র্যান্ডের জন্য স্টেট
    const [loading, setLoading] = useState(true);       // লোডিং স্টেট
    const [error, setError] = useState(null);           // ত্রুটি স্টেট

    useEffect(() => {
        const fetchBrands = async () => {
            setLoading(true);
            try {
                const response = await fetch("https://media.upfrica.com/api/brands/");  // তোমার ব্র্যান্ড API URL
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json();
                setBrands(data);   // ব্র্যান্ডের ডেটা সেট করা (assumes `results` field)
            } catch (err) {
                setError("Error fetching brands: " + err.message);  // ত্রুটি বার্তা
            } finally {
                setLoading(false);  // লোডিং শেষ
            }
        };

        fetchBrands();  // কম্পোনেন্ট মাউন্ট হলে ডেটা ফেচ করা
    }, []);  // খালি ডিপেন্ডেন্সি অ্যারে মানে একবারই চলবে

    return { brands, loading, error };  // ব্র্যান্ড, লোডিং এবং ত্রুটি ফেরত দেওয়া
};

export default useBrands;
