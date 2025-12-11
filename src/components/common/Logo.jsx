import logo from '@/assets/logo.png'

const Logo = ({ className }) => {
    return (
        <img src={logo} alt="" className={`shrink-0 ${className}`} />
    );
};
export default Logo;