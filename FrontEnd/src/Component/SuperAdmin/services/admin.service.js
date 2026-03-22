import API from "./api";

export const createSystemAdmin = (data) => {
  return API.post("/system-admin/create-system-admin", {
    fullName: data.fullName,
    email: data.email,
    password: data.password,
  });
};
