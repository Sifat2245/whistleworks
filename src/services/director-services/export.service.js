import useAxiosSecure from "@/hooks/useAxiosSecure";

export const useExportService = () => {
  const axiosSecure = useAxiosSecure();

  return {
    exportSchedule: (campId) =>
      axiosSecure.get(`/roster/export/camp/${campId}`, {
        responseType: "blob",
      }),
    exportRanking: (campId) =>
      axiosSecure.get(`/referee/evaluation/export/camp/${campId}`, {
        responseType: "blob",
      }),

    exportReferees: (campId) =>
      axiosSecure.get(`/roster/export/referees/camp/${campId}`, {
        responseType: 'blob'
      }),
      
    exportEvaluators: (campId) =>
      axiosSecure.get(`/evaluator-registrations/export/camp/${campId}`, {
        responseType: 'blob'
      }),
      
    exportCrews: (campId) => 
      axiosSecure.get(`/crews/export/camp/${campId}`)  
  };
};
