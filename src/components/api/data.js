// useCategories.js
import { useEffect, useState } from "react";

const useCategories = () => {
  const [categories, setCategories] = useState([]); // ক্যাটেগরির জন্য স্টেট
  const [conditions, setConditions] = useState([]);
  const [loading, setLoading] = useState(true); // লোডিং স্টেট
  const [error, setError] = useState(null); // ত্রুটি স্টেট

  useEffect(() => {
    const fetchCategories = async () => {
      setLoading(true);
      try {
        const response = await fetch("https://media.upfrica.com/api/categories/"); // তোমার API URL এখানে
        const data = await response.json();
        setCategories(data.results); // ক্যাটেগরির ডেটা সেট করা
      } catch (error) {
        setError("Error fetching categories: " + error.message); // ত্রুটি বার্তা
      } finally {
        setLoading(false); // লোডিং শেষ
      }
    };

    const fetchConditions = async () => {
      setLoading(true);
      try {
        const response = await fetch("https://media.upfrica.com/api/conditions/"); // তোমার API URL এখানে
        const data = await response.json();
        setConditions(data); // কন্ডিশনের ডেটা সেট করা
      } catch (error) {
        setError("Error fetching conditions: " + error.message); // ত্রুটি বার্তা
      } finally {
        setLoading(false); // লোডিং শেষ
      }
    };

    fetchCategories();
    fetchConditions(); // কম্পোনেন্ট মাউন্ট হলে ডেটা ফেচ করা
  }, []); // খালি ডিপেন্ডেন্সি অ্যারে মানে একবারই চলবে

  return { categories, conditions, loading, error }; // ক্যাটেগরি, কন্ডিশন, লোডিং এবং ত্রুটি ফেরত দেওয়া
};

export default useCategories;
