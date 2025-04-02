import axiosClient from "@/utils/axiosClient";

export const getMasters = async (code: any)=>{
    try {
        const temp = await axiosClient.get(`/trade/amount/${code}`)
        return temp.data;
    } catch (error) {
        console.log(error)
        return {};
    }
}

export const getAmount = async ()=>{
    try {
        const temp = await axiosClient.get("/trade/orders")
        return temp.data;
    } catch (error) {
        console.log(error)
        return {};
    }
}

export const getOrderBook = async ()=>{
    try {
        const temp = await axiosClient.get("/trade/order-book")
        return temp.data;
    } catch (error) {
        console.log(error)
        return {};
    }
}

export const createTrading = async (item: any)=>{
    try {
        const temp = await axiosClient.post("/trade/orders", item)
        return temp.data;
    } catch (error) {
        console.log(error)
        throw error;
    }
}