'use client';

import React from 'react';
import { FaCcVisa, FaCcMastercard, FaShieldAlt } from 'react-icons/fa';
import { SiGooglepay } from 'react-icons/si';

export default function TrustBadges() {
  return (
    <div className="pt-2 flex items-center gap-3 text-gray-700">
      <FaShieldAlt className="text-xl" title="Buyer Protection" />
      <SiGooglepay className="text-2xl" title="Google Pay" />
      <FaCcVisa className="text-2xl" title="Visa" />
      <FaCcMastercard className="text-2xl" title="Mastercard" />
    </div>
  );
}