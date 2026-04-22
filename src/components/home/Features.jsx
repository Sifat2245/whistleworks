import CommonTitle from "../common/CommonTitle";
import CommonText from "../common/CommonText";

const Features = ({ mainFeature, featureItems = [] }) => {
  const title = mainFeature?.title || "Powerful Features";
  const description =
    mainFeature?.description ||
    "Everything you need to manage referees, schedules, and evaluations in one modern platform";

  const displayedFeatures = featureItems.length > 0 ? featureItems : [];

  return (
    <div className="container lg:pt-16 md:pt-10 pt-6">
      <div className="text-center">
        <CommonTitle text={title} />

        <CommonText
          text={description}
          className="md:w-1/2 mx-auto text-neutral-500 mt-5"
        />
      </div>

      {displayedFeatures.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:gap-8 lg:gap-6 md:gap-5 gap-4 lg:mt-12 md:mt-10 mt-8 md:mb-16 mb-10">
          {displayedFeatures.map((feature) => (
            <div
              key={feature.id}
              className="flex flex-col items-start lg:p-6 p-4 bg-white rounded-lg shadow-lg/5 border border-neutral-200 hover:border-primary duration-300 transition-all"
            >
              {/* Feature Image/Icon */}
              {feature.image && (
                <div className="lg:p-4 p-3 rounded-full bg-primary mb-4">
                  <img
                    src={feature.image}
                    alt={feature.title}
                    className="h-6 w-6 lg:h-8 lg:w-8 object-contain"
                    loading="lazy"
                  />
                </div>
              )}

              <h3 className="text-lg font-semibold mb-2 text-gray-800">
                {feature.title}
              </h3>

              <p className="text-neutral-600 text-base leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-16 text-neutral-500">
          No features available at the moment
        </div>
      )}
    </div>
  );
};

export default Features;
