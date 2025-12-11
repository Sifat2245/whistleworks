import { Input } from "antd"

const OtpWrapper = ({ otp, OtpChange }) => {
    return (
        <div className="w-full flex gap-5 justify-center items-center">
            <Input.OTP
                length={4}
                value={otp}
                onChange={(val) => OtpChange(val)}
            />
        </div>
    )
};
export default OtpWrapper