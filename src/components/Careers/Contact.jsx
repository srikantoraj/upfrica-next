import Link from "next/link";
import React from "react";
import {
  FaFacebookMessenger,
  FaFacebookSquare,
  FaInstagram,
  FaLinkedin,
  FaTwitter,
  FaYoutube,
} from "react-icons/fa";
import { IoLogoWhatsapp } from "react-icons/io";

const Contact = () => {
  return (
    <div className=" px-4 py-5">
      {/* Main Grid */}
      <div className="md:flex justify-between gap-8 text-gray-800 space-y-8 md:space-y-0">
        {/* Contact Info */}
        <div className="space-y-2">
          <p className="text-lg font-bold text-gray-900">Contact Us</p>
          <ul className="space-y-3 text-base">
            <li>
              Email: <span className="text-pink-400">gogirlsgobd@gmail.com</span>
            </li>
            <li>
              Phone: <span className="text-pink-400">+01810368925</span>
            </li>

          </ul>

        </div>

        {/* contact us  */}
        <div>
          <Link href={'https://api.whatsapp.com/send?phone=%2B8801810368925&context=ARCfwjbLS7S5pNqFv89vbV433gnfjsKYBPBC1NXdTkmtND2jj57pHnfDbbpscX1P54Eqbr1KZI5QNNoUc5lE14xtYhTQN-qnkXYQmB2K9R5IBfGNv5cWVF1AlUoa2kvGUEqU4s7PFbrfGntyhw8QvQ_mNQ&source=FB_Page&app=facebook&entry_point=page_cta&fbclid=IwY2xjawHWF1hleHRuA2FlbQIxMAABHcCy7cXq_oMXVGJz0WF_pMdow1WCg35-gMGMtQ7LQFPNeTEy4cqLUSesgQ_aem_qpPnqo8feMkAoB4_2k8hfA'}>
            WhatsApp: <span className="text-pink-400">Message us</span>
          </Link>
          {/* Social Icons */}
          <div className="flex items-center gap-4 pt-4 md:justify-center">
            <Link href={'https://www.facebook.com/gogirlzzzz'}>
              <FaFacebookSquare className="w-6 h-6 text-gray-700 hover:text-blue-600 transition-colors" />
            </Link>
            <Link href={'https://api.whatsapp.com/send?phone=%2B8801810368925&context=ARCfwjbLS7S5pNqFv89vbV433gnfjsKYBPBC1NXdTkmtND2jj57pHnfDbbpscX1P54Eqbr1KZI5QNNoUc5lE14xtYhTQN-qnkXYQmB2K9R5IBfGNv5cWVF1AlUoa2kvGUEqU4s7PFbrfGntyhw8QvQ_mNQ&source=FB_Page&app=facebook&entry_point=page_cta&fbclid=IwY2xjawHWF1hleHRuA2FlbQIxMAABHcCy7cXq_oMXVGJz0WF_pMdow1WCg35-gMGMtQ7LQFPNeTEy4cqLUSesgQ_aem_qpPnqo8feMkAoB4_2k8hfA'}>
              <IoLogoWhatsapp className="w-6 h-6 text-gray-700 hover:text-blue-400 transition-colors" />
            </Link>
            {/* <Link href={""}>
              <FaTwitter className="w-6 h-6 text-gray-700 hover:text-blue-500 transition-colors" />
            </Link> */}
            <Link href={'https://www.instagram.com/go.girlzzzz/'}>
              <FaInstagram className="w-6 h-6 text-gray-700 hover:text-pink-500 transition-colors" />
            </Link>
            <Link href={"https://www.youtube.com/@gogirlsgobd"}>
              <FaYoutube className="w-6 h-6 text-gray-700 hover:text-red-600 transition-colors" />
            </Link>
            {/* <Link href={""}>
              <FaLinkedin className="w-6 h-6 text-gray-700 hover:text-blue-700 transition-colors" />
            </Link> */}
          </div>
        </div>

        {/* Dhaka Office */}
        <div>
          <ul className="space-y-3 text-gray-600 text-base">
            <li className="text-lg font-bold text-gray-900">Dhaka Office</li>
            <li>ICT Tower, 14th Floor</li>
            {/* <li>House no. 76, Road 12, Block E, Banani</li> */}
            <li>Agargaon, Dhaka 1213, Bangladesh</li>
          </ul>
        </div>


      </div>

      {/* Divider */}
      <hr className="mt-10 border-gray-300" />
    </div>
  );
};

export default Contact;
