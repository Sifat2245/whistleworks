import { waveform } from 'ldrs'
waveform.register()
const LoaderV2 = ({ size = 25, stroke = 4, color = "#00C6C8", speed = 1 }) => {
    return (
        <l-waveform
            size={size}
            stroke={stroke}
            speed={speed}
            color={color}
        ></l-waveform>
    );
};

export default LoaderV2;
