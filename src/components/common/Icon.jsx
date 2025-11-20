import { ReactSVG } from "react-svg";

const Icon = ({ src, className, style, onClick }) => {
  return (
    <ReactSVG
      src={src}
      beforeInjection={(svg) => {
        if (className) {
          className.split(" ").forEach((cls) => {
            if (cls) svg.classList.add(cls);
          });
        }
        if (style) Object.assign(svg.style, style);
        if (onClick) svg.addEventListener("click", (e) => onClick(e));
      }}
      wrapper="span"
    />
  );
};

export default Icon;