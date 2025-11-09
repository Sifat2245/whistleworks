import Features from "@/components/home/Features"
import Hero from "@/components/home/Hero"
import Partners from "@/components/home/Partners"
import ReadyToTrasform from "@/components/home/ReadyToTrasform"
import Reviews from "@/components/home/Reviews"
import TrainingCamps from "@/components/home/TrainingCamps"
import { useQuery } from "@tanstack/react-query"
import axios from "axios"

const Home = () => {
    // const axiosInstance = useAxiosPublic()
    const {data: camps, isLoading} = useQuery({
        queryKey: ['camps'],
        queryFn : async () => {
            const response = await axios.get('/camps.json')
            return response.data
        }
    }) 
    // console.log(camps);

    
    return (
        <div>
            <Hero />
            <TrainingCamps camps={camps} isLoading={isLoading} />
            <Partners/>
            <Features/>
            <ReadyToTrasform/>
            <Reviews/>
        </div>
    )
}

export default Home