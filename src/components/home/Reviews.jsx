import CommonTitle from "../common/CommonTitle";
import CommonText from "../common/CommonText";

const Reviews = () => {
  const reviews = [
    {
      name: "John Doe",
      role: "Referee",
      feedback:
        "This platform has made scheduling and communication so much easier. Highly recommend!",
      avatar: "https://i.pravatar.cc/100?img=1",
    },
    {
      name: "Jane Smith",
      role: "Camp Director",
      feedback:
        "Managing multiple camps and tracking performance has never been simpler.",
      avatar: "https://i.pravatar.cc/100?img=2",
    },
    {
      name: "Michael Lee",
      role: "Administrator",
      feedback:
        "The intuitive interface and real-time notifications are game changers for our operations.",
      avatar: "https://i.pravatar.cc/100?img=3",
    },
  ];

  return (
    <div className="container md:my-16 my-10">
      <div className="text-center">
        <CommonTitle text="What Our Users Say" />
        <CommonText
          text="Trusted by directors, referees, and administrators worldwide"
          className="text-neutral-500"
        />
      </div>

      {/* review cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 xl:gap-8 lg:gap-6 md:gap-5 gap-4 xl:mt-12 lg:mt-10 md:mt-8 mt-6 ">
        {reviews.map((review, index) => (
          <div
            key={index}
            className="xl:p-6 lg:p-5 md:p-4 p-3 bg-white rounded-lg shadow-lg/5 border border-neutral-200 flex flex-col"
          >
            <p className="text-neutral-500">&quot;{review.feedback}&quot;</p>
            <div className="flex items-center gap-2 mt-6">
              <img
                src={review.avatar}
                alt={review.name}
                className="xl:w-16 lg:w-11 w-10 xl:h-16 lg:h-11 h-10 rounded-full mb-4"
              />
              <div>
                <h3 className="text-lg font-semibold">{review.name}</h3>
                <p className="text-sm text-neutral-400 mb-3">{review.role}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Reviews;
