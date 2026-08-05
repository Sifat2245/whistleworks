import logo from '@/assets/logo.png'
import { cn } from '@/lib/utils';

const Logo = ({ className }) => {
    return (
        <img src={logo} alt="" className={cn("scale-150 shrink-0", className)} />
    );
};
export default Logo;