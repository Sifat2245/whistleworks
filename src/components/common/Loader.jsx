import { lineSpinner } from "ldrs";
lineSpinner.register();

const Loader = ({ size = 25, stroke = 4, color = "white" , speed=1 }) => {
  return (
    <l-line-spinner
      size={size}
      stroke={stroke}
      speed={speed}
      color={color}
    ></l-line-spinner>
  );
};

export default Loader;
