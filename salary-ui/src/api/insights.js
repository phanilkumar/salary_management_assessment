import api from "./axios";

export const fetchOverview          = async () => (await api.get("/insights/overview")).data.data;
export const fetchByCountry         = async () => (await api.get("/insights/by_country")).data.data;
export const fetchByDepartment      = async () => (await api.get("/insights/by_department")).data.data;
export const fetchByEmploymentType  = async () => (await api.get("/insights/by_employment_type")).data.data;
export const fetchTopJobTitles      = async (limit = 10) =>
  (await api.get("/insights/top_paying_job_titles", { params: { limit } })).data.data;
export const fetchSalaryBands       = async () => (await api.get("/insights/salary_bands")).data.data;
export const fetchByJobTitle        = async ({ country, job_title }) =>
  (await api.get("/insights/by_job_title", { params: { country, job_title } })).data.data;
