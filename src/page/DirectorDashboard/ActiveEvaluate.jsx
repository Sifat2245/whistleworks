import ActiveEvalutorList2 from "./ActiveEvalutorList2";
import BackBtn from "@/components/common/BackBtn";
import PendingEvaluator2 from "./PendingEvaluator2";
import useAxiosSecure from "@/hooks/useAxiosSecure";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { Spin } from "antd"; 

const ActiveEvaluate = () => {
  const { id } = useParams(); 
  const axiosInstance = useAxiosSecure();

  const {
    data: registrations = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["evaluator-registrations", id],
    queryFn: async () => {
      const response = await axiosInstance.get(
        `/director/evaluator-registrations/camp/${id}`
      );
      return response?.data?.data?.registrations || [];
    },
    enabled: !!id,
  });


  // Separate approved and pending evaluators
  const approvedEvaluators = registrations
    .filter((reg) => reg.status === "approved")
    .map((reg) => ({
      id: reg.id,
      image: reg.evaluator.avatar,
      name: reg.evaluator.name?.trim() || "Unnamed Evaluator",
      evaluatorMail: reg.evaluator.email,
      evaluatorAddress: reg.evaluator.address,
      evaluatorNumber: reg.evaluator.phone,
      registeredAt: reg.registered_at,
      approvedAt: reg.approved_at,
    }));

  const pendingEvaluators = registrations
    .filter((reg) => reg.status === "pending")
    .map((reg) => ({
      id: reg.id,
      image: reg.evaluator.avatar,
      name: reg.evaluator.name?.trim() || "Unnamed Evaluator",
      evaluatorMail: reg.evaluator.email,
      evaluatorAddress: "",
      evaluatorNumber: "",
      registeredAt: reg.registered_at,
    }));

  if (isLoading) {
    return (
      <div className="w-full flex justify-center items-center min-h-screen">
        <Spin size="large" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="w-full text-center py-12 text-red-500">
        Failed to load evaluators. Please try again later.
      </div>
    );
  }

  // console.log(approvedEvaluators,'qwerwer');

  return (
    <div className="w-full flex flex-col items-start gap-10 mb-16">
      <BackBtn />
      <PendingEvaluator2 pendingEvaluatorData={pendingEvaluators} />
      <ActiveEvalutorList2 activeEvaluatorData={approvedEvaluators} />
    </div>
  );
};

export default ActiveEvaluate;
