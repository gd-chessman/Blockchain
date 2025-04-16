import axiosClient from "@/utils/axiosClient";



  export const getTopCoins = async (item: any) => {
    try {
      const temp = await axiosClient.get(`/on-chain/top-coins?sort_by=${item.sort_by}&sort_type=${item.sort_type}&offset=${item.offset}&limit=${item.limit}`);
      return temp.data.data.items;
    } catch (error) {
      console.log(error);
      return [];
    }
  };