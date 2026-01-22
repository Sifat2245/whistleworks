import logo from '@/assets/logo.png'
import { cn } from '@/lib/utils';

const Logo = ({ className }) => {
    return (
        <img src={logo} alt="" className={cn("shrink-0", className)} />
    );
};
export default Logo;