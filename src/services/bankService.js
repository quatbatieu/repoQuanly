import Axios from "axios";

export const getBanksLocal =  async ()=>{
   const banks = await Axios.get('/atm/bank.json')
    return banks
}