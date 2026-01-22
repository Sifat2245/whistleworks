import CommonTitle from "../common/CommonTitle";
import CommonText from "../common/CommonText";

const Reviews = ({ testimonialTitle, testimonials = [] }) => {
  const title = testimonialTitle?.title || "What Our Users Say";
  const subtitle =
    testimonialTitle?.description ||
    "Trusted by directors, referees, and administrators worldwide";
  const displayedTestimonials = testimonials.length > 0 ? testimonials : [];

  return (
    <div className="container md:my-16 my-10">
      <div className="text-center">
        <CommonTitle text={title} />
        <CommonText text={subtitle} className="text-neutral-500 mt-4" />
      </div>

      {displayedTestimonials.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-3 xl:gap-8 lg:gap-6 md:gap-5 gap-4 xl:mt-12 lg:mt-10 md:mt-8 mt-6">
          {displayedTestimonials.map((review) => (
            <div
              key={review.id}
              className="xl:p-6 lg:p-5 md:p-4 p-3 bg-white rounded-lg shadow-lg/5 border border-neutral-200 flex flex-col transition-all hover:shadow-xl hover:border-primary/30"
            >
              <p className="text-neutral-600 leading-relaxed grow">
                {review.feedback || review.description || review.content}
              </p>

              <div className="flex items-center gap-3 mt-6">
                {/* Avatar - with fallback */}
                <div className="shrink-0">
                  {review.avatar || review.image ? (
                    <img
                      src={review.avatar || review.image}
                      alt={review.name || "User"}
                      className="xl:w-16 lg:w-14 w-12 xl:h-16 lg:h-14 h-12 rounded-full object-cover border-2 border-white shadow-sm"
                      loading="lazy"
                    />
                  ) : (
                    <div className="xl:w-16 lg:w-14 w-12 xl:h-16 lg:h-14 h-12 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 font-medium">
                      {review.name?.[0]?.toUpperCase() || "?"}
                    </div>
                  )}
                </div>

                <div>
                  <h3 className="font-semibold text-gray-800">
                    {review.name || "Anonymous User"}
                  </h3>
                  <p className="text-sm text-neutral-500">
                    {review.role || review.position || "Referee / Director"}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-16 text-neutral-500">
          No testimonials available yet — be the first to share your experience!
        </div>
      )}
    </div>
  );
};

export default Reviews;
