import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import {
  LuMail,
  LuSend,
  LuSparkles,
  LuCircleCheck,
  LuShieldCheck,
  LuClock,
  LuCircleHelp,
  LuArrowRight,
  LuMessageSquare,
} from "react-icons/lu";
import CommonInputWrapper from "@/components/common/CommonInputWrapper";
import CommonSubmitBtn from "@/components/common/CommonSubmitBtn";
import LoaderV2 from "@/components/common/LoaderV2";
import { useSubmitContactForm } from "@/hooks/api/useContact";

const ContactUs = () => {
  const [isSubmittedSuccess, setIsSubmittedSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    mode: "onTouched",
    defaultValues: {
      name: "",
      email: "",
      subject: "",
      message: "",
    },
  });

  const submitContactMutation = useSubmitContactForm({
    onSuccess: (res) => {
      const successMsg =
        res?.data?.message || "Thank you! Your message has been sent successfully.";
      toast.success(successMsg);
      setIsSubmittedSuccess(true);
      reset();
    },
    onError: (err) => {
      const errMsg =
        err?.response?.data?.message ||
        err?.message ||
        "Failed to send message. Please try again.";
      toast.error(errMsg);
    },
  });

  const onSubmit = (data) => {
    submitContactMutation.mutate(data);
  };

  return (
    <div className="w-full bg-slate-50 min-h-screen text-slate-900 overflow-hidden font-sans">
      {/* ── 1. Hero Header ────────────────────────────────────────── */}
      <section className="relative bg-slate-950 text-white pt-10 pb-16 sm:pt-12 sm:pb-20 lg:pt-14 lg:pb-22 overflow-hidden">
        {/* Ambient Glow Orbs */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[38rem] h-[18rem] bg-primary/20 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute bottom-0 right-10 w-72 h-72 bg-sky-500/10 rounded-full blur-[80px] pointer-events-none" />

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-slate-900 border border-slate-800 text-primary text-xs font-bold uppercase tracking-wider mb-3"
          >
            <LuSparkles className="text-amber-400 text-xs" />
            <span>Support & Communications</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-[1.15] mb-2.5"
          >
            We&apos;d Love to <span className="text-primary">Hear From You</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-sm sm:text-base text-slate-300 leading-relaxed font-normal max-w-xl mx-auto"
          >
            Have questions about camp registration, referee officiating rubrics, or
            custom platform integrations? Our dedicated team is here to help.
          </motion.p>
        </div>
      </section>

      {/* ── 2. Content & Form Container ───────────────────────────── */}
      <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12 -mt-8 sm:-mt-10 relative z-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start max-w-7xl mx-auto">
          {/* Left Column: Contact Cards & Trust Indicators */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 space-y-6">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-primary block mb-1">
                  Direct Inquiries
                </span>
                <h2 className="text-2xl font-black text-slate-900 tracking-tight">
                  Reach Out Directly
                </h2>
                <p className="text-slate-500 text-sm mt-1 leading-relaxed">
                  Connect with our team for questions regarding camps, evaluations, or technical support.
                </p>
              </div>

              {/* Email Support Card */}
              <a
                href="mailto:drewbontrager@gmail.com"
                className="group flex items-start gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-200 hover:border-primary/50 hover:bg-sky-50/50 transition-all duration-300"
              >
                <div className="w-11 h-11 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                  <LuMail className="text-xl" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                    General & Camp Support
                  </p>
                  <p className="font-bold text-slate-900 group-hover:text-primary transition-colors truncate">
                    drewbontrager@gmail.com
                  </p>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Fast response within 24 hours
                  </p>
                </div>
              </a>

              {/* Value / Trust Badges */}
              <div className="pt-2 border-t border-slate-100 space-y-3">
                <div className="flex items-center gap-3 text-sm text-slate-600 font-medium">
                  <LuClock className="text-primary text-base shrink-0" />
                  <span>Prompt resolution for active game day schedules</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-slate-600 font-medium">
                  <LuShieldCheck className="text-emerald-600 text-base shrink-0" />
                  <span>Secure & verified sports official communications</span>
                </div>
              </div>
            </div>

            {/* Quick FAQ Link Box */}
            <div className="bg-gradient-to-br from-slate-900 to-slate-950 text-white rounded-3xl p-6 sm:p-7 border border-slate-800 flex items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-primary text-xs font-bold uppercase tracking-wider">
                  <LuCircleHelp className="text-sm" />
                  <span>Quick Answers</span>
                </div>
                <h3 className="text-lg font-bold text-white tracking-tight">
                  Looking for Instant Answers?
                </h3>
                <p className="text-slate-400 text-xs leading-relaxed max-w-sm">
                  Check our Knowledge Base & FAQ for details on camp registration and scoring.
                </p>
              </div>

              <Link
                to="/faq"
                className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white text-white hover:text-slate-900 border border-white/20 font-bold text-xs transition-all shrink-0 group"
              >
                <span>Read FAQ</span>
                <LuArrowRight className="text-xs group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>

          {/* Right Column: Contact Form */}
          <div className="lg:col-span-7">
            <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 relative overflow-hidden">
              <div className="mb-8">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider mb-2">
                  <LuMessageSquare className="text-xs" />
                  <span>Send a Message</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                  Get In Touch With Our Team
                </h2>
                <p className="text-slate-500 text-sm mt-1.5 leading-relaxed">
                  Fill in the details below and we&apos;ll direct your inquiry to the
                  appropriate department coordinator.
                </p>
              </div>

              <AnimatePresence>
                {isSubmittedSuccess && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="mb-8 p-5 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-start gap-4"
                  >
                    <LuCircleCheck className="text-emerald-600 text-2xl shrink-0 mt-0.5" />
                    <div className="space-y-1">
                      <p className="text-sm font-bold text-emerald-900">
                        Message Sent Successfully!
                      </p>
                      <p className="text-xs text-emerald-700 leading-relaxed">
                        We have received your transmission and will review it promptly.
                        You can also send another inquiry if needed.
                      </p>
                      <button
                        type="button"
                        onClick={() => setIsSubmittedSuccess(false)}
                        className="text-xs font-bold text-emerald-800 underline hover:text-emerald-950 mt-1 cursor-pointer"
                      >
                        Send another message
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                {/* Full Name & Email Row */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <CommonInputWrapper
                    label="Full Name *"
                    placeholder="e.g. John Doe"
                    register_as="name"
                    register={register}
                    errors={errors}
                    validationRules={{
                      required: "Full name is required",
                      minLength: {
                        value: 2,
                        message: "Name must be at least 2 characters",
                      },
                    }}
                    inputClass="shadow-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                  />

                  <CommonInputWrapper
                    label="Email Address *"
                    type="email"
                    placeholder="e.g. john@example.com"
                    register_as="email"
                    register={register}
                    errors={errors}
                    validationRules={{
                      required: "Email address is required",
                      pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: "Please enter a valid email address",
                      },
                    }}
                    inputClass="shadow-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                  />
                </div>

                {/* Subject Row */}
                <CommonInputWrapper
                  label="Subject *"
                  placeholder="e.g. Camp Registration Inquiry"
                  register_as="subject"
                  register={register}
                  errors={errors}
                  validationRules={{
                    required: "Subject is required",
                    minLength: {
                      value: 3,
                      message: "Subject must be at least 3 characters",
                    },
                  }}
                  inputClass="shadow-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                />

                {/* Message Field */}
                <CommonInputWrapper
                  label="Message *"
                  type="textarea"
                  placeholder="Tell us about your inquiry, camp dates, or technical questions..."
                  register_as="message"
                  register={register}
                  errors={errors}
                  validationRules={{
                    required: "Message is required",
                    minLength: {
                      value: 10,
                      message: "Message must be at least 10 characters",
                    },
                  }}
                  textareaClass="min-h-36 shadow-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                />

                {/* Submit Button */}
                <div className="pt-2">
                  <CommonSubmitBtn
                    variant="primary"
                    type="submit"
                    disabled={submitContactMutation.isPending}
                    className="w-full sm:w-auto px-8 py-3.5 rounded-xl font-bold flex items-center justify-center gap-2 cursor-pointer"
                  >
                    {submitContactMutation.isPending ? (
                      <LoaderV2 />
                    ) : (
                      <>
                        <span>Submit Message</span>
                        <LuSend className="text-sm" />
                      </>
                    )}
                  </CommonSubmitBtn>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ContactUs;
