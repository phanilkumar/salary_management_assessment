import { useQuery } from "@tanstack/react-query";
import {
  fetchOverview,
  fetchByCountry,
  fetchByDepartment,
  fetchByEmploymentType,
  fetchTopJobTitles,
  fetchSalaryBands,
  fetchByJobTitle,
} from "../api/insights";

export const useOverview         = () => useQuery({ queryKey: ["insights", "overview"],         queryFn: fetchOverview });
export const useByCountry        = () => useQuery({ queryKey: ["insights", "by_country"],        queryFn: fetchByCountry });
export const useByDepartment     = () => useQuery({ queryKey: ["insights", "by_department"],     queryFn: fetchByDepartment });
export const useByEmploymentType = () => useQuery({ queryKey: ["insights", "by_employment_type"], queryFn: fetchByEmploymentType });
export const useTopJobTitles     = (limit) => useQuery({ queryKey: ["insights", "top_job_titles", limit], queryFn: () => fetchTopJobTitles(limit) });
export const useSalaryBands      = () => useQuery({ queryKey: ["insights", "salary_bands"],      queryFn: fetchSalaryBands });
export const useByJobTitle       = (country, jobTitle) =>
  useQuery({
    queryKey: ["insights", "by_job_title", country, jobTitle],
    queryFn:  () => fetchByJobTitle({ country, job_title: jobTitle }),
    enabled:  !!(country && jobTitle),
  });
