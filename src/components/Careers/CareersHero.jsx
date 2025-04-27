// 'use client';
// import carrers from '../../public/images/carres.jpg'

// export default function CareersHero() {
//   return (
//     <section
//       className="relative w-full h-[400px] lg:min-h-[600px] bg-white text-white bg-cover bg-center flex items-center justify-center"
//       style={{
//         backgroundImage: `linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.3)), url('https://res.cloudinary.com/pinpointhq/image/upload/f_auto,q_auto/v1/uploads/production/pvfebdgjgsfgejsz7q1a')`,
//       }}
//     >
//       <div className="text-center px-4 md:px-8 max-w-3xl text-white">
//         <h2 className="text-5xl md:text-7xl font-bold mb-6 text-white">
//           CAREERS
//         </h2>
//         <p className="text-xl md:text-2xl mb-10 ">
//           Come Work With Us
//         </p>
//         <a
//           href="#js-careers-jobs-block"
//           className="inline-block px-10 py-4 bg-purple-500 hover:bg-purple-700 text-white text-lg font-semibold rounded-full shadow-lg transition duration-300"
//         >
//           View Jobs
//         </a>
//       </div>
//     </section>
//   );
// }

'use client';
import careers from '../../public/images/carres.jpg';

export default function CareersHero() {
  return (
    <section className="relative w-full min-h-[400px]  md:min-h-[600px] xl:h-[700px] flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img 
          src={careers.src}
          alt="Careers Background"
          className="w-full h-full object-fill "
        />
        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-black bg-opacity-60"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 text-center px-4 md:px-8 max-w-3xl ">
        <h2 className="text-5xl md:text-7xl font-bold mb-6 text-white">
          CAREERS
        </h2>

        <a
          href="#js-careers-jobs-block"
          className="inline-block px-10 py-4 bg-purple-500 hover:bg-purple-700 text-white text-lg font-semibold rounded-full shadow-lg transition duration-300"
        >
          View Jobs
        </a>
      </div>
    </section>
  );
}




