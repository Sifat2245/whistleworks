const ResendCode = ({ resendActive, handleResend, seconds = 0 }) => {
    return (
        <p className="2xs:text-base text-sm text-center">
            Didn’t receive code?{" "}
            {resendActive ? (
                <span
                    className="cursor-pointer underline"
                    onClick={handleResend}
                >
                    Resend
                </span>
            ) : (
                <span>Resend in {seconds}s</span>
            )}
        </p>
    )
};
export default ResendCode