import CommonTitle from "../common/CommonTitle";
import Marquee from "react-fast-marquee";

const Partners = ({ partnerLogos = [], partners = [] }) => {
  if (partnerLogos.length === 0) {
    return (
      <div className="bg-neutral-200 py-12 text-center">
        <CommonTitle text="WHISTLE WORKS Partners" />
        <p className="mt-6 text-gray-600">
          No partner logos available at the moment
        </p>
      </div>
    );
  }

  console.log(partnerLogos, 'parnets');

  return (
    <div className="bg-neutral-200 py-12 relative overflow-hidden">
      <div className="text-center mb-8">
        {partners?.title ? (
          <CommonTitle text={`${partners?.title}`} />
        ) : (
          <CommonTitle text={"WHISTLE WORKS Partners"} />
        )}
      </div>

      {/* Subtle gradient fade on sides */}
      <div className="absolute top-0 left-0 h-full w-32 bg-linear-to-r from-neutral-200 to-transparent pointer-events-none z-10"></div>
      <div className="absolute top-0 right-0 h-full w-32 bg-linear-to-l from-neutral-200 to-transparent pointer-events-none z-10"></div>

      <Marquee speed={60} pauseOnHover={true} gradient={false} className="py-6">
        {[...partnerLogos, ...partnerLogos].map((logo, index) => (
          <div
            key={`${logo.id}-${index}`}
            className="flex items-center justify-center mx-16 md:mx-24 lg:mx-32"
          >
            <img
              src={logo.image}
              alt="Partner logo"
              className="h-20 md:h-24 lg:h-28 object-contain transition-all duration-300"
              loading="lazy"
            />
          </div>
        ))}
      </Marquee>

      {/* Optional small note below marquee */}
      {partners.length > 0 && (
        <div className="text-center mt-6 text-sm text-gray-600">
          In partnership with {partners.map((p) => p.name).join(", ")}
        </div>
      )}
    </div>
  );
};

export default Partners;
