import React from "react";
import { FaShoppingBag, FaCheckCircle } from "react-icons/fa";

export default function HeroBanner() {
  return (
    <section
      className="
        relative
        flex
        items-center
        justify-center
        text-center
        text-white
        p-8
        md:p-16
        bg-cover
        bg-center
        h-[500px]
      "
      style={{
        backgroundImage:
          "url('https://images.pexels.com/photos/4559715/pexels-photo-4559715.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2')",
      }}
    >
      {/* Dark semi-transparent + blur overlay */}
      <div className="absolute inset-0 bg-black bg-opacity-20 backdrop-blur-sm"></div>

      {/* Centered Content */}
      <div className="relative z-10 max-w-2xl space-y-8 text-center">
        <h1 className="text-6xl md:text-7xl font-extrabold uppercase">
          <span className="text-white">JOIN&nbsp;</span>
          <span className="text-violet-700">UPFRICA!</span>
        </h1>

        <p className="text-2xl md:text-3xl font-semibold ">
          Become a local sourcing agent.
        </p>

        <a
          href="/careers/apply"
          className="
            inline-block
            text-white
            bg-violet-700
            font-semibold
            uppercase
            py-4
            px-20
            rounded-full
            hover:opacity-90
            transition
          "
        >
          APPLY NOW
        </a>
      </div>
    </section>
  );
}
