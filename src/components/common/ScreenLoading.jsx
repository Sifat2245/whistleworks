import LoaderV2 from "./LoaderV2"

const ScreenLoading = () => {
    return (
        <div className="w-full h-screen fixed inset-0 z-1000 bg-black/60 backdrop-blur-[3px]  flex justify-center items-center">
            <LoaderV2 color="#00AEEF" stroke={9} size={58} />
        </div>
    )
}

export default ScreenLoading