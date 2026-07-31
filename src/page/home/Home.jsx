import Features from "@/page/home/components/Features";
import Hero from "@/page/home/components/Hero";
import Partners from "@/page/home/components/Partners";
import ReadyToTrasform from "@/page/home/components/ReadyToTrasform";
import Reviews from "@/page/home/components/Reviews";
import TrainingCamps from "@/page/home/components/TrainingCamps";
import { useHomeCms } from "@/hooks/api/useCms";

const Home = () => {
  const { data: cmsData, isLoading } = useHomeCms();

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