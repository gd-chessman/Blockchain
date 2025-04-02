import axiosClient from "@/utils/axiosClient";

export const login = async (item: any) => {
    try {
        const temp = await axiosClient.post(`/telegram-wallets/connect-wallets`, item,);
        return temp.data;
    } catch (e) {
        console.log(e)
        throw new Error("Error Login")
    }
}