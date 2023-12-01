import axios from "axios";

import Config from "../../constants/config";


// Set BETSLIP
export const getBetSlip = async(dispatch,token)=> {

  const url = `${Config.BASEURL}/api/betslips?primary=1`
  const res = await axios.get(url,
     {
         headers: {
             Authorization: `Bearer ${token}`,
             'app-api-key': Config.APP_API_KEY
         }
     })
        dispatch({
            type: "SET_BETSLIP",
            payload: res.data.data.length > 0 ? res.data.data[0].wagers.length : 0
          });
 

};