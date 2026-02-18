import api from "../api/api";

export const fetchAllGroups = async () => {
  const res = await api.get("/allGroup");
  return res.data;
};

export const handelStatus = async(auth_id) =>{
    return api.post("/changeStatus",{auth_id});
}

export const fetchAllConversation = async() => {
    const res=await api.get("/fetchConversation");
    return res.data;
}

export const deleteGrp = async(conversationId) => {
    return await api.post("/dropConversation",{conversationId});
}