import api from "../api/api";

export const fetchAllGroups = async () => {
  const res = await api.get("/allGroup");
  return res.data;
};

export const handelStatus = async(auth_id) =>{
    return api.post("/changeStatus",{auth_id});
}