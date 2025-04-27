// // components/HeroBanner.jsx
// import { FaShoppingBag, FaCheckCircle } from 'react-icons/fa'

// export default function HeroBanner() {
//   return (
//     <section className="flex flex-col-reverse md:flex-row items-center justify-between bg-[#5d2eee] text-white p-8 md:p-16">
//       {/* Text & CTA */}
//       <div className="space-y-6 md:max-w-2xl text-white flex  flex-col items-center justify-center" >
//         <h1 className="text-4xl md:text-5xl font-bold leading-tight text-white">
//           Join Upfrica !<br />
          
//         </h1>
//         <p className='text-lg text-white">'>
//           BECOME A LOCAL SOURCING AGENT
//         </p>

//         <a
//           href="/apply"
//           className="inline-block bg-white text-[#5d2eee] font-semibold py-3 px-8 rounded-full hover:opacity-90 transition"
//         >
//           APPLY NOW
//         </a>

//       </div>

//       {/* Illustration */}
//       <div className="mb-8 md:mb-0 md:max-w-md">
//         <img
//           src="https://img.freepik.com/free-vector/business-analytics-report-data-statistics-visualization-financial-analysis-presentation-analyst-female-flat-character-holding-tablet-device_335657-2614.jpg?t=st=1745761256~exp=1745764856~hmac=1afefc9a2ddd0902306679348c2d403a699fcb55ee212b029dec1ec1ef118ef2&w=1380"
//           alt="Local sourcing agent"
//           className="w-full h-auto rounded-lg shadow-lg"
//         />
//       </div>
//     </section>
//   )
// }
// components/HeroBanner.jsx
import React from 'react'
import { FaShoppingBag, FaCheckCircle } from 'react-icons/fa'

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
        backgroundImage: "url('https://images.pexels.com/photos/4559715/pexels-photo-4559715.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2')"
      }}
    >
      {/* Dark semi-transparent + blur overlay */}
      <div className="absolute inset-0 bg-black bg-opacity-20 backdrop-blur-sm"></div>

      {/* Centered Content */}
      <div className="relative z-10 max-w-2xl space-y-8 text-center">
        <h1 className="text-6xl md:text-7xl font-extrabold uppercase">
          <span className="text-white">JOIN&nbsp;</span>
          <span className="text-[#5d2eee]">UPFRICA!</span>
        </h1>

        <p className="text-2xl md:text-3xl font-semibold ">
          Become a local sourcing agent.
        </p>

        <a
          href="/careers/apply"
          className="
            inline-block
            text-white
            bg-[#5d2eee]
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
  )
}
