import Features from "@/components/home/Features"
import Hero from "@/components/home/Hero"
import Partners from "@/components/home/Partners"
import ReadyToTrasform from "@/components/home/ReadyToTrasform"
import Reviews from "@/components/home/Reviews"
import TrainingCamps from "@/components/home/TrainingCamps"

const Home = () => {
    return (
        <div>
            <Hero />
            <TrainingCamps />
            <Partners/>
            <Features/>
            <ReadyToTrasform/>
            <Reviews/>
        </div>
    )
}

export default Home