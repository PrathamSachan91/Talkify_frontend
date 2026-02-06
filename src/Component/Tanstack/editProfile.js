import api from "../api/api";

export const editProfile = async ({ user_name, profile_image }) => {
  const formData = new FormData();

  if (user_name) formData.append("user_name", user_name);
  if (profile_image) formData.append("profile_image", profile_image);

  const res = await api.post("/editProfile", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

  return res.data;
};
