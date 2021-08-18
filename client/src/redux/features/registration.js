const initialState = {
  signingUp: false,
  signingIn: false,
  error: null,
  token: localStorage.getItem("token"),
  role: localStorage.getItem("role"),
};

const registration = (state = initialState, action) => {
  switch (action.type) {
    case "agent/signUp/pending":
      return {
        ...state,
        signingUp: true,
        error: null,
      };
    case "agent/signUp/fulfilled":
      return {
        ...state,
        signingUp: false,
      };
    case "agent/signUp/rejected":
      return {
        ...state,
        signingUp: false,
        error: action.error,
      };
    case "client/signUp/pending":
      return {
        ...state,
        signingUp: true,
        error: null,
      };
    case "client/signUp/fulfilled":
      return {
        ...state,
        signingUp: false,
      };
    case "client/signUp/rejected":
      return {
        ...state,
        signingUp: false,
        error: action.error,
      };
    default:
      return state;
  }
};

export default registration;

export const registrationAgent = (data) => {
  return async (dispatch) => {
    dispatch({ type: "agent/signUp/pending" });
    console.log(data);
    const res = await fetch("api/agent", {
      method: "POST",
      body: JSON.stringify(data),
      headers: {
        "Content-type": "application/json",
      },
    });
    const json = await res.json();

    if (json.error) {
      dispatch({ type: "agent/signUp/rejected", error: json.error });
    } else {
      dispatch({ type: "agent/signUp/fulfilled", payload: json });
    }
  };
};

export const registrationClient = (data) => {
  return async (dispatch) => {
    dispatch({ type: "client/signUp/pending" });

    const res = await fetch("api/client", {
      method: "POST",
      body: JSON.stringify(data),
      headers: {
        "Content-type": "application/json",
      },
    });
    const json = await res.json();

    if (json.error) {
      dispatch({ type: "client/signUp/rejected", error: json.error });
    } else {
      dispatch({ type: "client/signUp/fulfilled", payload: json });
    }
  };
};

export const selectError = (state) => state.registration.error;
