import React, { useContext, useReducer } from "react";
import { BetSlipContext } from "./BetSlipContext";
import BetSlipReducer from "./BetSlipReducer";
import { MainContext } from "../MainContext";
export let globalValue = {};



export const useBetslip = () => {
  const { state, dispatch } = useContext(BetSlipContext);
  return [state, dispatch];
};

export const BetSlipProvider = ({ children }) => {
    const user = React.useContext(MainContext);
  const initialState = {
   wagers : 0
  };
  React.useEffect(() => {
    globalValue = user?.token;
  }, [user?.token]);

  const [state, dispatch] = useReducer(BetSlipReducer, initialState);

  return (

    <BetSlipContext.Provider
      value={{
        state: state,
        dispatch: dispatch
      }}
    >
      {children}
    </BetSlipContext.Provider>
  );
};