// src/data/socialStats.js
import { FaFacebookF, FaGoogle, FaTwitter } from "react-icons/fa";

const socialStats = [
  {
    platform: "Facebook",
    Icon: FaFacebookF,
    likes: 12281,
    growth: "+2.3%",
    target: 35098,
    duration: 3539,
    color: "text-blue-600",
  },
  {
    platform: "Google",
    Icon: FaGoogle,
    likes: 12281,
    growth: "+4.5%",
    target: 35098,
    duration: 3539,
    color: "text-red-600",
  },
  {
    platform: "Twitter",
    Icon: FaTwitter,
    likes: 12281,
    growth: "+6.2%",
    target: 35098,
    duration: 3539,
    color: "text-sky-500",
  },
];

export default socialStats;
