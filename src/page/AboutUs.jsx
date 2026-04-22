import useAxiosPublic from "@/hooks/useAxiosPublic";
import { useQuery } from "@tanstack/react-query";

const AboutUs = () => {
  const axiosInstance = useAxiosPublic();

  const { data: aboutData, isLoading } = useQuery({
    queryKey: ["about-us"],
    queryFn: async () => {
      const response = await axiosInstance.get("/cms/about");
      return response?.data?.data;
    },
  });

  // Fallback if loading or no data
  if (isLoading || !aboutData) {
    return <div className="py-20 text-center">Loading about information...</div>;
  }

  const {
    hero = [],
    mission = [],
    key_to_excellence,
    bottom_description,
    features_item = [],
    owner_info,
    team_header,
    team_member = [],
    get_started,
  } = aboutData;

  const heroItem = hero[0] || {};
  const missionItem = mission[0] || {};

  // Split bottom_description into paragraphs (handles \r\n)
  const bottomParagraphs = bottom_description?.description
    ? bottom_description.description.split(/\r?\n\r?\n/).filter(Boolean)
    : [];

  const hasTeamMembers = team_member.length > 0;

  return (
    <div className="w-full bg-linear-to-b from-gray-50 to-white py-8 px-4">
      <div className="container mx-auto">
        {/* Header Section */}
        <div className="text-center mb-16 mt-5">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            {heroItem.title || "About WhistleWorks"}
          </h1>
          <div className="w-24 h-1 bg-primary mx-auto mb-6"></div>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            {heroItem.description ||
              "Developing better officials through elite training, honest feedback, and innovative technology"}
          </p>
        </div>

        {/* Founder Section */}
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-16 items-center mb-24">
          {/* Left Side - Founder / Owner */}
          <div className="lg:w-2/5 w-full">
            <div className="relative group">
              <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                <div className="absolute inset-0 bg-linear-to-tr from-primary/20 to-transparent z-10"></div>
                <img
                  src={owner_info?.image || "/api/placeholder/500/600"}
                  alt={owner_info?.name || "President/CEO"}
                  className="w-full h-[500px] object-cover transform group-hover:scale-105 transition-transform duration-500"
                />
              </div>

              {/* Info Card */}
              <div className="relative -mt-12 mx-6 bg-white rounded-xl shadow-lg p-6 border border-gray-100">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  {owner_info?.name || "Drew Bontrager"}
                </h3>
                <p className="text-primary font-semibold mb-3">
                  {owner_info?.designation || "President/CEO"}
                </p>
                <div className="flex items-center gap-2 text-gray-600">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span className="font-medium">
                    {owner_info?.experience || "25+ Years Experience"}
                  </span>
                </div>
              </div>
            </div>

            {/* Stats Badges - from owner_info.stats */}
            <div className="mt-8 grid grid-cols-3 gap-4">
              {owner_info?.stats?.map((stat, idx) => (
                <div
                  key={idx}
                  className="bg-primary/10 rounded-lg p-4 text-center transform hover:scale-105 transition-transform duration-300"
                >
                  <p className="text-xl font-bold text-primary">{stat.value}</p>
                  <p className="text-sm text-gray-600">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Right Side - Content */}
          <div className="lg:w-3/5 w-full">
            <div className="space-y-8">
              {/* Mission */}
              <div className="bg-linear-to-r from-primary/10 to-white p-8 rounded-2xl border-l-4 border-primary">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  {missionItem.title || "Our Mission"}
                </h2>
                <p className="text-gray-700 text-lg leading-relaxed">
                  {missionItem.description ||
                    "To develop better officials through elite training, honest feedback, and innovative technology, helping referees advance their careers at every level."}
                </p>
              </div>

              {/* Main Content */}
              <div className="space-y-6">
                {bottomParagraphs.map((para, idx) => (
                  <p key={idx} className="text-gray-700 leading-relaxed">
                    {para}
                  </p>
                ))}

                {/* Key to Excellence */}
                {key_to_excellence && (
                  <div className="bg-gray-50 p-6 rounded-xl">
                    <h3 className="text-xl font-semibold text-gray-900 mb-3">
                      {key_to_excellence.title}
                    </h3>
                    <p className="text-gray-700">{key_to_excellence.description}</p>
                  </div>
                )}

                {/* Features Grid - using real icons from API */}
                <div className="grid md:grid-cols-2 gap-4 mt-8">
                  {features_item.map((feature) => (
                    <div
                      key={feature.id}
                      className="flex items-start gap-3 p-4 bg-white rounded-lg border border-gray-200 hover:border-primary hover:shadow-md transition-all duration-300"
                    >
                      <div className="bg-primary/10 p-2 rounded-lg">
                        <img
                          src={feature.image}
                          alt={feature.title}
                          className="w-6 h-6 object-contain"
                        />
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900">{feature.title}</h4>
                        <p className="text-sm text-gray-600">{feature.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Team Section - only show if there are members */}
        {hasTeamMembers && (
          <div className="mt-24">
            {/* Team Header */}
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                {team_header?.title || "Meet Our Team"}
              </h2>
              <div className="w-24 h-1 bg-primary mx-auto mb-6"></div>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                {team_header?.description ||
                  "Our dedicated team of professionals brings together expertise in sports officiating, technology, and training to support your development."}
              </p>
            </div>

            {/* Team Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {team_member.map((member) => (
                <div
                  key={member.id}
                  className="group bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2"
                >
                  <div className="relative h-64 overflow-hidden bg-gray-200">
                    {/* <div className="absolute inset-0 bg-linear-to-b from-transparent to-primary/20 z-10"></div> */}
                    <img
                      src={member.image || "/api/placeholder/400/400"}
                      alt={member.title || "Team Member"}
                      className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                    />
                  </div>

                  <div className="p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                      {member.title}
                    </h3>
                    {member.designation && (
                      <p className="text-primary font-semibold mb-3">
                        {member.designation}
                      </p>
                    )}
                    {/* Experience can be added later if API provides it */}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Call to Action */}
        <div className="mt-24 bg-linear-to-r from-primary to-[#0086b8] rounded-2xl p-12 text-center text-white">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            {get_started?.title || "Ready to Elevate Your Officiating Career?"}
          </h2>
          <p className="text-lg mb-8 max-w-2xl mx-auto opacity-90">
            {get_started?.description ||
              "Join WhistleWorks today and start your journey towards becoming an elite official with our proven training methods and cutting-edge technology."}
          </p>
          <button className="bg-white text-primary px-8 py-4 rounded-lg font-semibold text-lg hover:bg-gray-100 transition-all duration-300 transform hover:scale-105 shadow-lg">
            Get Started Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;