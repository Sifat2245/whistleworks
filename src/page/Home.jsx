import Hero from "@/components/home/Hero"
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
        </div>
    )
}

export default Home