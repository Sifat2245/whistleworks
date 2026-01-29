import drewImage from "@/assets/about_us.jpg";

const AboutUs = () => {
    // Team members data - you can update this with actual team information
    const teamMembers = [
        {
            name: "Sarah Mitchell",
            role: "Head of Technology",
            image: "/api/placeholder/400/400", // Replace with actual image
            experience: "15+ Years in Sports Tech"
        },
        {
            name: "Marcus Johnson",
            role: "Training Director",
            image: "/api/placeholder/400/400", // Replace with actual image
            experience: "NCAA Official & Coach"
        },
        {
            name: "Emily Chen",
            role: "Product Manager",
            image: "/api/placeholder/400/400", // Replace with actual image
            experience: "10+ Years Development"
        },
        {
            name: "James Rodriguez",
            role: "Senior Developer",
            image: "/api/placeholder/400/400", // Replace with actual image
            experience: "Full-Stack Expert"
        }
    ];

    return (
        <div className="w-full bg-gradient-to-b from-gray-50 to-white py-16 md:py-24 px-4">
            <div className="max-w-7xl mx-auto">
                {/* Header Section */}
                <div className="text-center mb-16 mt-5">
                    <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                        About WhistleWorks
                    </h1>
                    <div className="w-24 h-1 bg-[#00aeef] mx-auto mb-6"></div>
                    <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                        Developing better officials through elite training, honest feedback, and innovative technology
                    </p>
                </div>

                {/* Founder Section */}
                <div className="flex flex-col lg:flex-row gap-12 lg:gap-16 items-center mb-24">
                    {/* Left Side - Founder Section */}
                    <div className="lg:w-2/5 w-full">
                        <div className="relative group">
                            {/* Image Container */}
                            <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                                <div className="absolute inset-0 bg-gradient-to-tr from-[#00aeef]/20 to-transparent z-10"></div>
                                <img
                                    src={drewImage}
                                    alt="Founder - Basketball Official"
                                    className="w-full h-[500px] object-cover transform group-hover:scale-105 transition-transform duration-500"
                                />
                            </div>

                            {/* Founder Info Card */}
                            <div className="relative -mt-12 mx-6 bg-white rounded-xl shadow-lg p-6 border border-gray-100">
                                <h3 className="text-2xl font-bold text-gray-900 mb-2">Drew Bontrager</h3>
                                <p className="text-[#00aeef] font-semibold mb-3">President/CEO</p>
                                <div className="flex items-center gap-2 text-gray-600">
                                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                                    </svg>
                                    <span className="font-medium">25+ Years Experience</span>
                                </div>
                            </div>
                        </div>

                        {/* Experience Badges */}
                        <div className="mt-8 grid grid-cols-3 gap-4">
                            <div className="bg-[#00aeef]/10 rounded-lg p-4 text-center transform hover:scale-105 transition-transform duration-300">
                                <p className="text-xl font-bold text-[#00aeef]">25+</p>
                                <p className="text-sm text-gray-600">Years Officiating</p>
                            </div>
                            <div className="bg-[#00aeef]/10 rounded-lg p-4 text-center transform hover:scale-105 transition-transform duration-300">
                                <p className="text-xl font-bold text-[#00aeef]">NCAA</p>
                                <p className="text-sm text-gray-600">Retired Division 1 Official</p>
                            </div>
                            <div className="bg-[#00aeef]/10 rounded-lg p-4 text-center transform hover:scale-105 transition-transform duration-300">
                                <p className="text-xl font-bold text-[#00aeef]">10+</p>
                                <p className="text-sm text-gray-600">Conferences</p>
                            </div>
                        </div>
                    </div>

                    {/* Right Side - Content */}
                    <div className="lg:w-3/5 w-full">
                        <div className="space-y-8">
                            {/* Mission Statement */}
                            <div className="bg-gradient-to-r from-[#00aeef]/10 to-white p-8 rounded-2xl border-l-4 border-[#00aeef]">
                                <h2 className="text-2xl font-bold text-gray-900 mb-4">Our Mission</h2>
                                <p className="text-gray-700 text-lg leading-relaxed">
                                    To develop better officials through elite training, honest feedback, and innovative technology,
                                    helping referees advance their careers at every level.
                                </p>
                            </div>

                            {/* Main Content */}
                            <div className="space-y-6">
                                <p className="text-gray-700 leading-relaxed">
                                    Our founder brings more than 25 years of basketball officiating experience and a lifelong
                                    commitment to growth, excellence, and development in everything we do.
                                </p>

                                <p className="text-gray-700 leading-relaxed">
                                    Throughout his career, he worked at every collegiate level, including NCAA Division I in the
                                    Missouri Valley, Southland, and Ohio Valley Conferences, along with multiple NCAA Division II
                                    Regional tournaments and conference championship games.
                                </p>

                                <div className="bg-gray-50 p-6 rounded-xl">
                                    <h3 className="text-xl font-semibold text-gray-900 mb-3">The Key to Excellence</h3>
                                    <p className="text-gray-700">
                                        A key factor in advancing to the highest levels was consistent participation in elite training
                                        camps, investing in instruction, evaluation, and mentorship to continuously improve performance
                                        on the court.
                                    </p>
                                </div>

                                <p className="text-gray-700 leading-relaxed">
                                    That same philosophy drives WhistleWorks today. We combine proven training methods with modern
                                    technology to prepare officials for success in real time.
                                </p>

                                {/* Features Grid */}
                                <div className="grid md:grid-cols-2 gap-4 mt-8">
                                    <div className="flex items-start gap-3 p-4 bg-white rounded-lg border border-gray-200 hover:border-[#00aeef] hover:shadow-md transition-all duration-300">
                                        <div className="bg-[#00aeef]/10 p-2 rounded-lg">
                                            <svg className="w-6 h-6 text-[#00aeef]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                        </div>
                                        <div>
                                            <h4 className="font-semibold text-gray-900">GPS Integration</h4>
                                            <p className="text-sm text-gray-600">Smart game assignment tracking</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-3 p-4 bg-white rounded-lg border border-gray-200 hover:border-[#00aeef] hover:shadow-md transition-all duration-300">
                                        <div className="bg-[#00aeef]/10 p-2 rounded-lg">
                                            <svg className="w-6 h-6 text-[#00aeef]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                            </svg>
                                        </div>
                                        <div>
                                            <h4 className="font-semibold text-gray-900">Instant Feedback</h4>
                                            <p className="text-sm text-gray-600">Real-time performance evaluations</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-3 p-4 bg-white rounded-lg border border-gray-200 hover:border-[#00aeef] hover:shadow-md transition-all duration-300">
                                        <div className="bg-[#00aeef]/10 p-2 rounded-lg">
                                            <svg className="w-6 h-6 text-[#00aeef]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                            </svg>
                                        </div>
                                        <div>
                                            <h4 className="font-semibold text-gray-900">Progress Tracking</h4>
                                            <p className="text-sm text-gray-600">Development analytics & insights</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-3 p-4 bg-white rounded-lg border border-gray-200 hover:border-[#00aeef] hover:shadow-md transition-all duration-300">
                                        <div className="bg-[#00aeef]/10 p-2 rounded-lg">
                                            <svg className="w-6 h-6 text-[#00aeef]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                            </svg>
                                        </div>
                                        <div>
                                            <h4 className="font-semibold text-gray-900">Mentorship</h4>
                                            <p className="text-sm text-gray-600">Expert guidance & coaching</p>
                                        </div>
                                    </div>
                                </div>

                                <p className="text-gray-700 leading-relaxed pt-4">
                                    Our app provides GPS game assignment integration, instant evaluations, performance feedback,
                                    and development tracking, elevating referees with the tools they need to grow faster and more
                                    confidently. This allows officials to identify strengths, address weaknesses, and take ownership
                                    of their development like never before.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Team Section */}
                <div className="mt-24">
                    {/* Team Header */}
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                            Meet Our Team
                        </h2>
                        <div className="w-24 h-1 bg-[#00aeef] mx-auto mb-6"></div>
                        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                            Our dedicated team of professionals brings together expertise in sports officiating, 
                            technology, and training to support your development.
                        </p>
                    </div>

                    {/* Team Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                        {teamMembers.map((member, index) => (
                            <div 
                                key={index} 
                                className="group bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2"
                            >
                                {/* Team Member Image */}
                                <div className="relative h-64 overflow-hidden bg-gray-200">
                                    <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#00aeef]/20 z-10"></div>
                                    <img
                                        src={member.image}
                                        alt={member.name}
                                        className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                                    />
                                </div>
                                
                                {/* Team Member Info */}
                                <div className="p-6">
                                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                                        {member.name}
                                    </h3>
                                    <p className="text-[#00aeef] font-semibold mb-3">
                                        {member.role}
                                    </p>
                                    <div className="flex items-center gap-2 text-gray-600">
                                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M6 6V5a3 3 0 013-3h2a3 3 0 013 3v1h2a2 2 0 012 2v3.57A22.952 22.952 0 0110 13a22.95 22.95 0 01-8-1.43V8a2 2 0 012-2h2zm2-1a1 1 0 011-1h2a1 1 0 011 1v1H8V5zm1 5a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1z" clipRule="evenodd" />
                                            <path d="M2 13.692V16a2 2 0 002 2h12a2 2 0 002-2v-2.308A24.974 24.974 0 0110 15c-2.796 0-5.487-.46-8-1.308z" />
                                        </svg>
                                        <span className="text-sm">{member.experience}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Call to Action Section */}
                <div className="mt-24 bg-gradient-to-r from-[#00aeef] to-[#0086b8] rounded-2xl p-12 text-center text-white">
                    <h2 className="text-3xl md:text-4xl font-bold mb-4">
                        Ready to Elevate Your Officiating Career?
                    </h2>
                    <p className="text-lg mb-8 max-w-2xl mx-auto opacity-90">
                        Join WhistleWorks today and start your journey towards becoming an elite official 
                        with our proven training methods and cutting-edge technology.
                    </p>
                    <button className="bg-white text-[#00aeef] px-8 py-4 rounded-lg font-semibold text-lg hover:bg-gray-100 transition-all duration-300 transform hover:scale-105 shadow-lg">
                        Get Started Now
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AboutUs;