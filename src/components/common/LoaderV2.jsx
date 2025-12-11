import { lineSpinner } from 'ldrs'
lineSpinner.register()
const LoaderV2 = ({ size = 25, stroke = 4, color = "#00C6C8", speed = 1 }) => {
    return (
        <l-line-spinner
            size={size}
            stroke={stroke}
            speed={speed}
            color={color}
        ></l-line-spinner>
    );
};

export default LoaderV2;