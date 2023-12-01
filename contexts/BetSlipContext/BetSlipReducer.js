export default (state, action) => {
      switch (action.type) {
        case "SET_BETSLIP":
            return {
              ...state,
              wagers: action.payload,
            };
        default:
          return state;
      }
}