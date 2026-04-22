import Features from "@/components/home/Features";
import Hero from "@/components/home/Hero";
import Partners from "@/components/home/Partners";
import ReadyToTrasform from "@/components/home/ReadyToTrasform";
import Reviews from "@/components/home/Reviews";
import TrainingCamps from "@/components/home/TrainingCamps";
import useAxiosPublic from "@/hooks/useAxiosPublic";
import { useQuery } from "@tanstack/react-query";

const Home = () => {
  const axiosInstance = useAxiosPublic();

  const { data: cmsData, isLoading } = useQuery({
    queryKey: ["home-cms"],
    queryFn: async () => {
      const response = await axiosInstance.get("/cms/home");
      return response?.data?.message; 
    },
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Hero heroData={cmsData?.hero?.[0]} />
      <TrainingCamps trainingCampData={cmsData?.training_camp?.[0]} />
      <Partners 
        partners={cmsData?.partners[0] || []}
        partnerLogos={cmsData?.partners_logo || []}
      />
      <Features
        mainFeature={cmsData?.features?.[0]}
        featureItems={cmsData?.features_item || []}
      />
      <ReadyToTrasform operationData={cmsData?.operations?.[0]} />
      <Reviews
        testimonialTitle={cmsData?.testimonial?.[0]}
        testimonials={cmsData?.testimonial_card || []}
      />
    </div>
  );
};

export default Home;