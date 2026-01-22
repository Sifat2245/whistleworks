import drewImage from "@/assets/about_us.jpg";

const AboutUs = () => {
    return (
        <div className="w-full bg-linear-to-b from-gray-50 to-white py-16 md:py-24 px-4">
            <div className="max-w-7xl mx-auto">
                {/* Header Section */}
                <div className="text-center mb-16 mt-5">
                    <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                        About WhistleWorks
                    </h1>
                    <div className="w-24 h-1 bg-blue-600 mx-auto mb-6"></div>
                    <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                        Developing better officials through elite training, honest feedback, and innovative technology
                    </p>
                </div>

                <div className="flex flex-col lg:flex-row gap-12 lg:gap-16 items-center">
                    {/* Left Side - Founder Section */}
                    <div className="lg:w-2/5">
                        <div className="relative group">
                            {/* Image Container */}
                            <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                                <div className="absolute inset-0 bg-linear-to-tr from-blue-600/20 to-transparent z-10"></div>
                                <img
                                    src={drewImage}
                                    alt="Founder - Basketball Official"
                                    className="w-full h-[500px] object-cover transform group-hover:scale-105 transition-transform duration-500"
                                />
                            </div>

                            {/* Founder Info Card */}
                            <div className="relative -mt-12 mx-6 bg-white rounded-xl shadow-lg p-6 border border-gray-100">
                                <h3 className="text-2xl font-bold text-gray-900 mb-2">Drew Bontrager</h3>
                                <p className="text-blue-600 font-semibold mb-3">President/CEO</p>
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
                            <div className="bg-blue-50 rounded-lg p-4 text-center">
                                <p className="text-xl font-bold text-blue-700">25+</p>
                                <p className="text-sm text-gray-600">Years Officiating</p>
                            </div>
                            <div className="bg-blue-50 rounded-lg p-4 text-center">
                                <p className="text-xl font-bold text-blue-700">NCAA</p>
                                <p className="text-sm text-gray-600">Retired Division 1 Official</p>
                            </div>
                            <div className="bg-blue-50 rounded-lg p-4 text-center">
                                <p className="text-xl font-bold text-blue-700">10+</p>
                                <p className="text-sm text-gray-600">Conferences</p>
                            </div>
                        </div>
                    </div>

                    {/* Right Side - Content */}
                    <div className="lg:w-3/5">
                        <div className="space-y-8">
                            {/* Mission Statement */}
                            <div className="bg-linear-to-r from-blue-50 to-white p-8 rounded-2xl border-l-4 border-blue-600">
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
                                    <div className="flex items-start gap-3 p-4 bg-white rounded-lg border border-gray-200">
                                        <div className="bg-blue-100 p-2 rounded-lg">
                                            <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                        </div>
                                        <div>
                                            <h4 className="font-semibold text-gray-900">GPS Integration</h4>
                                            <p className="text-sm text-gray-600">Smart game assignment tracking</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-3 p-4 bg-white rounded-lg border border-gray-200">
                                        <div className="bg-blue-100 p-2 rounded-lg">
                                            <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                            </svg>
                                        </div>
                                        <div>
                                            <h4 className="font-semibold text-gray-900">Instant Feedback</h4>
                                            <p className="text-sm text-gray-600">Real-time performance evaluations</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-3 p-4 bg-white rounded-lg border border-gray-200">
                                        <div className="bg-blue-100 p-2 rounded-lg">
                                            <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                            </svg>
                                        </div>
                                        <div>
                                            <h4 className="font-semibold text-gray-900">Progress Tracking</h4>
                                            <p className="text-sm text-gray-600">Development analytics & insights</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-3 p-4 bg-white rounded-lg border border-gray-200">
                                        <div className="bg-blue-100 p-2 rounded-lg">
                                            <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
            </div>
        </div>
    );
};
export default AboutUs;