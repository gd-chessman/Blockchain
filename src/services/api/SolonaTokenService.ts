import axiosClient from "@/utils/axiosClient";


export const getTokenInforByAddress = async (address: any)=>{
    try {
        const temp = await axiosClient.get(`/solana-tokens/address/${address}`)
        return temp.data.data;
    } catch (error) {
        console.log(error)
        return [];
    }
}