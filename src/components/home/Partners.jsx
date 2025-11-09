"use client";
import CommonTitle from "../common/CommonTitle";
import Marquee from "react-fast-marquee";

import partner1 from "@/assets/partners/partner1.png";
import partner2 from "@/assets/partners/partner2.png";
import partner3 from "@/assets/partners/partner3.png";
import partner4 from "@/assets/partners/partner4.png";
import partner5 from "@/assets/partners/partner5.png";

const Partners = () => {
  const partners = [partner1, partner2, partner3, partner4, partner5];

  return (
    <div className="bg-neutral-200 py-12 relative overflow-hidden">
      <div className="text-center mb-8">
        <CommonTitle text="WHISTLE WORKS Partners." />
      </div>

      {/* Glow effect on left */}
      <div className="absolute top-0 left-0 h-full w-24 bg-gradient-to-r from-neutral-200/80 to-neutral-200/0 pointer-events-none"></div>
      {/* Glow effect on right */}
      <div className="absolute top-0 right-0 h-full w-24 bg-gradient-to-l from-neutral-200/80 to-neutral-200/0 pointer-events-none"></div>

      <Marquee
        speed={50}
        pauseOnHover={true}
        gradient={false} // we disable built-in gradient
        className="py-4"
      >
        {partners.concat(partners).map((partner, index) => (
          <div key={index} className="flex items-center justify-center px-40">
            <img
              src={partner}
              alt={`Partner ${index + 1}`}
              className="h-24 object-contain"
            />
          </div>
        ))}
      </Marquee>
    </div>
  );
};

export default Partners;
