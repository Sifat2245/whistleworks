import { useState, useEffect } from "react";
import { Modal, Input, Button, Spin } from "antd";
import { LoadingOutlined, CheckCircleFilled, CloseCircleOutlined } from "@ant-design/icons";
import useAxiosSecure from "@/hooks/useAxiosSecure";
import toast from "react-hot-toast";
import RegistrationSuccessModal from "./RegistrationSuccessModal";
import {
  useCampPrice,
  useApplyCoupon,
} from "@/hooks/api/referee-hooks/useCampRegistration";

const RegistrationModal = ({
  open,
  onClose,
  campId,
  campName,
  sportsName,
  onRegistrationSuccess,
}) => {
  const axiosSecure = useAxiosSecure();

  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [discountInfo, setDiscountInfo] = useState(null);
  const [registering, setRegistering] = useState(false);
  const [successData, setSuccessData] = useState(null);

  // Fetch camp pricing
  const {
    data: pricingData,
    isLoading: pricingLoading,
    isError: pricingError,
    refetch: refetchPricing,
  } = useCampPrice(open ? campId : null);

  const camp = pricingData?.camp || {};
  const pricing = pricingData?.pricing || {};

  // Apply coupon mutation
  const applyCouponMutation = useApplyCoupon();

  // Handle coupon apply
  const handleApplyCoupon = () => {
    if (!couponCode.trim()) {
      toast.error("Please enter a coupon code");
      return;
    }

    applyCouponMutation.mutate(
      { campId, couponCode: couponCode.trim() },
      {
        onSuccess: (response) => {
          const data = response?.data?.data;
          if (data?.coupon && data?.pricing) {
            setAppliedCoupon(data.coupon.code);
            setDiscountInfo(data.pricing);
            toast.success(response?.data?.message || "Coupon applied!");
          }
        },
        onError: (err) => {
          const errorMsg =
            err?.response?.data?.data ||
            err?.response?.data?.message ||
            "Invalid coupon code.";
          toast.error(errorMsg);
          setAppliedCoupon(null);
          setDiscountInfo(null);
        },
      }
    );
  };

  // Handle remove coupon
  const handleRemoveCoupon = () => {
    setCouponCode("");
    setAppliedCoupon(null);
    setDiscountInfo(null);
    applyCouponMutation.reset();
  };

  // Handle registration
  const handleRegister = async () => {
    setRegistering(true);
    try {
      const payload = {};
      if (appliedCoupon) {
        payload.coupon_code = appliedCoupon;
      }

      const response = await axiosSecure.post(
        `/v2/referee/camp/${campId}/register`,
        payload
      );

      const { success, data } = response.data;

      if (success) {
        if (data?.payment_required && data?.checkout_url) {
          // Save camp info & price breakdown to localStorage so PaymentSuccess can display it
          localStorage.setItem(
            "pending_camp_registration",
            JSON.stringify({
              camp: data?.camp,
              price_breakdown: data?.price_breakdown,
              discount: data?.discount,
              session_id: data?.session_id,
            })
          );
          onClose();
          window.location.href = data.checkout_url;
          return;
        }

        // Registration successful (free or 100% discount) — show success modal
        setSuccessData(data);
        onRegistrationSuccess?.();
      }
    } catch (error) {
      const errorMsg =
        error.response?.data?.message ||
        error.response?.data?.error ||
        "Registration failed. Please try again.";
      toast.error(errorMsg);
    } finally {
      setRegistering(false);
    }
  };

  // Reset state when modal opens
  useEffect(() => {
    if (open) {
      setCouponCode("");
      setAppliedCoupon(null);
      setDiscountInfo(null);
      applyCouponMutation.reset();
      setRegistering(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const handleCloseSuccess = () => {
    setSuccessData(null);
    onClose();
  };

  const hasValidPricing = pricing.total_price !== undefined;

  return (
    <Modal
      title={null}
      open={open}
      onCancel={onClose}
      footer={null}
      width={500}
      centered
      destroyOnClose
      closeIcon={
        <CloseCircleOutlined className="text-gray-400 hover:text-gray-600 transition-colors text-lg" />
      }
      className="registration-modal"
      styles={{
        body: {
          padding: 0,
          overflow: "hidden",
          borderRadius: 12,
        },
        content: {
          borderRadius: 12,
          overflow: "hidden",
          padding: 0,
        },
        mask: {
          backdropFilter: "blur(4px)",
        },
      }}
    >
      {pricingLoading ? (
        <div className="flex flex-col items-center justify-center py-20 gap-4">
          <Spin indicator={<LoadingOutlined style={{ fontSize: 40, color: "#00AEEF" }} spin />} />
          <p className="text-gray-500 text-sm">Loading pricing details...</p>
        </div>
      ) : pricingError ? (
        <div className="text-center py-16">
          <p className="text-red-500 mb-4">Failed to load pricing details.</p>
          <Button onClick={refetchPricing} type="primary" size="small">
            Retry
          </Button>
        </div>
      ) : !hasValidPricing ? (
        <div className="text-center py-16 text-gray-500">
          No pricing information available for this camp.
        </div>
      ) : (
        <>
          {/* Header with gradient accent */}
          <div className="bg-linear-to-r from-primary/10 to-primary/5 px-6 pt-6 pb-5 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-primary">
                  Registration
                </p>
                <h3 className="text-xl font-bold text-gray-900 mt-1">
                  {camp.name || campName}
                </h3>
              </div>
              {sportsName && (
                <span className="px-3 py-1.5 bg-primary/10 text-primary text-xs font-semibold rounded-full whitespace-nowrap">
                  {sportsName}
                </span>
              )}
            </div>
            {camp.start_date && camp.end_date && (
              <p className="text-sm text-gray-500 mt-2 flex items-center gap-1.5">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                {camp.start_date} — {camp.end_date}
              </p>
            )}
          </div>

          <div className="px-6 py-5 space-y-5">
            {/* Pricing Card */}
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-xs">
              {/* Total price row — prominent */}
              <div className="px-5 py-4 bg-linear-to-r from-gray-50 to-white">
                <div className="flex justify-between items-center">
                  <span className="text-gray-700 font-medium">Camp Fee</span>
                  <span className="text-2xl font-bold text-gray-900">
                    ${Number(pricing.total_price || 0).toFixed(2)}
                  </span>
                </div>
              </div>

              {/* Discount (if coupon applied) */}
              {discountInfo && Number(discountInfo.discount_amount) > 0 && (
                <>
                  <div className="border-t border-gray-100" />
                  <div className="px-5 py-3 bg-green-50/50">
                    <div className="flex justify-between items-center">
                      <span className="text-green-700 flex items-center gap-1.5 text-sm font-medium">
                        <CheckCircleFilled className="text-green-500" />
                        Discount Applied
                        <span className="text-green-600 font-mono text-xs bg-green-100 px-2 py-0.5 rounded ml-1">
                          {appliedCoupon}
                        </span>
                      </span>
                      <span className="text-green-600 font-semibold">
                        -${Number(discountInfo.discount_amount).toFixed(2)}
                      </span>
                    </div>
                  </div>
                </>
              )}

              {/* Total after discount */}
              {discountInfo && (
                <>
                  <div className="border-t border-gray-100" />
                  <div className="px-5 py-4 bg-primary/[0.03]">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-900 font-bold">Total After Discount</span>
                      <span className="text-2xl font-bold text-primary">
                        ${Number(discountInfo.price_after_discount || 0).toFixed(2)}
                      </span>
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Coupon Section */}
            <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-xs">
              <p className="font-medium text-gray-700 text-sm mb-3 flex items-center gap-1.5">
                <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
                </svg>
                Have a coupon code?
              </p>

              {appliedCoupon ? (
                <div className="flex items-center justify-between bg-green-50 border border-green-200 rounded-lg px-4 py-3">
                  <div className="flex items-center gap-2.5">
                    <CheckCircleFilled className="text-green-500 text-lg" />
                    <div>
                      <p className="text-green-700 font-medium text-sm leading-tight">
                        Coupon Applied
                      </p>
                      <p className="text-green-600 text-xs font-mono mt-0.5">
                        {appliedCoupon}
                      </p>
                    </div>
                  </div>
                  <Button
                    size="small"
                    danger
                    onClick={handleRemoveCoupon}
                    className="text-xs font-medium"
                    icon={<CloseCircleOutlined />}
                  >
                    Remove
                  </Button>
                </div>
              ) : (
                <div className="flex gap-2">
                  <Input
                    placeholder="Enter coupon code"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    size="large"
                    className="flex-1 uppercase"
                    style={{ textTransform: "uppercase" }}
                    onPressEnter={handleApplyCoupon}
                    disabled={applyCouponMutation.isPending}
                  />
                  <Button
                    type="primary"
                    size="large"
                    onClick={handleApplyCoupon}
                    loading={applyCouponMutation.isPending}
                    disabled={!couponCode.trim() || applyCouponMutation.isPending}
                    className="bg-primary hover:bg-[#0099d4] border-none font-medium px-6 shadow-xs"
                  >
                    Apply
                  </Button>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-2">
              <Button
                size="large"
                onClick={onClose}
                className="flex-1 border-gray-300 text-gray-600 font-medium h-12 rounded-lg hover:bg-gray-50 transition-all"
                disabled={registering}
              >
                Cancel
              </Button>
              <Button
                type="primary"
                size="large"
                onClick={handleRegister}
                loading={registering}
                className="flex-1 bg-primary! hover:bg-[#0099d4]! border-none font-semibold h-12 text-base rounded-lg shadow-md shadow-primary/25 hover:shadow-lg hover:shadow-primary/30 transition-all duration-200"
              >
                {registering ? "Registering..." : "Confirm & Register"}
              </Button>
            </div>
          </div>
        </>
      )}

      {/* Success Modal for free/100% discount registrations */}
      <RegistrationSuccessModal
        open={!!successData}
        onClose={handleCloseSuccess}
        registrationData={successData}
      />
    </Modal>
  );
};

export default RegistrationModal;
