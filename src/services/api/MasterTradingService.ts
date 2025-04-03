import axiosClient from "@/utils/axiosClient"


export const getMasters = async ()=>{
    try {
        const temp = await axiosClient.get("/master-trading/masters")
        return temp.data.data;
    } catch (error) {
        console.log(error)
        return [];
    }
}

export const getMyGroups = async ()=>{
    try {
        const temp = await axiosClient.get("/master-trading/get-my-groups")
        return temp;
    } catch (error) {
        console.log(error)
        return [];
    }
}

export const getGroupById = async ()=>{
    try {
        const temp = await axiosClient.get("/master-trading/group/7")
        return temp.data;
    } catch (error) {
        console.log(error)
        return {};
    }
}

export const checkMaster = async (item: any)=>{
    try {
        const temp = await axiosClient.post("/master-trading/check-master", item)
        return temp.data;
    } catch (error) {
        console.log(error)
        throw error;
    }
}

export const connectMaster = async (item: any)=>{
    try {
        const temp = await axiosClient.post("/master-trading/connect-master", item)
        return temp.data;
    } catch (error) {
        console.log(error)
        throw error;
    }
}

export const memberSetConnect = async (item: any)=>{
    try {
        const temp = await axiosClient.post("/master-trading/member-set-connect", item)
        return temp.data;
    } catch (error) {
        console.log(error)
        throw error;
    }
}

export const masterCreateGroup = async (item: any)=>{
    try {
        const temp = await axiosClient.post("/master-trading/master-create-group", item)
        return temp.data;
    } catch (error) {
        console.log(error)
        throw error;
    }
}

export const masterSetGroup = async (item: any)=>{
    try {
        const temp = await axiosClient.post("/master-trading/master-set-group", item)
        return temp.data;
    } catch (error) {
        console.log(error)
        throw error;
    }
}

export const masterSetConnect = async (item: any)=>{
    try {
        const temp = await axiosClient.post("/master-trading/master-set-group", item)
        return temp.data;
    } catch (error) {
        console.log(error)
        throw error;
    }
}

