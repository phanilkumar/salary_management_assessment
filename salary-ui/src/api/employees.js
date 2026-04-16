import api from "./axios";

const normalize = (item) => ({ id: item.id, ...item.attributes });

export const fetchEmployees = async (params) => {
  const { data } = await api.get("/employees", { params });
  return {
    employees: data.data.map(normalize),
    meta: data.meta,
  };
};

export const fetchEmployee = async (id) => {
  const { data } = await api.get(`/employees/${id}`);
  return normalize(data.data);
};

export const createEmployee = async (payload) => {
  const { data } = await api.post("/employees", { employee: payload });
  return normalize(data.data);
};

export const updateEmployee = async ({ id, ...payload }) => {
  const { data } = await api.patch(`/employees/${id}`, { employee: payload });
  return normalize(data.data);
};

export const deleteEmployee = async (id) => {
  await api.delete(`/employees/${id}`);
};
