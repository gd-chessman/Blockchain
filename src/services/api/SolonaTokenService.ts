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

export const getSearchTokenInfor= async (keyS: any, page = 1, limit = 30)=>{
    try {
        const temp = await axiosClient.get(`/solana-tokens/search?query=${keyS}&page=${page}&limit=${limit}`)
        console.log(temp)
        return temp.data.data ;
    } catch (error) {
        console.log(error)
        return [];
    }
}


export const getTokenPrice = async (address: any)=>{
    try {
        const temp = await axiosClient.get(`/solana-tokens/token-price?address=${address}`)
        console.log(temp)
        return temp.data.data ;
    } catch (error) {
        console.log(error)
        return {};
    }
}


export const getPriceSolona = async ()=>{
    try {
        const temp = await axiosClient.get(`/solana-tokens/token-price?address=So11111111111111111111111111111111111111112`)
        console.log(temp)
        return temp.data.data ;
    } catch (error) {
        console.log(error)
        return {};
    }
}