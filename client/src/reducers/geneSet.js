export default (
  state = {
    accessCode: "",
  },
  action
) => {
  switch (action.type) {
    case "fetch gene set": {
      console.log(action);

      return {
        ...state,
        accessCode: action.accessCode,
      };
    }
    default:
      return state;
  }
};
