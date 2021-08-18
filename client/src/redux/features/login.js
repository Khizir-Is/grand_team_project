const initialState = {
  signingUp: false,
  signingIn: false,
  error: null,
  token: null,
  role: null,
  candidate: null,
  loading: false,
  editingAgent: null,
  editingClient: null,
};

const login = (state = initialState, action) => {
  switch (action.type) {
    case "agent/signIn/pending":
      return {
        ...state,
        signingIn: true,
        error: null,
        token: null,
      };
    case "agent/signIn/fulfilled":
      return {
        ...state,
        signingIn: false,
        token: action.payload.token,
        role: action.payload.role,
        candidate: action.payload.candidate,
      };
    case "agent/signIn/rejected":
      return {
        ...state,
        signingIn: false,
        error: action.error,
      };

    case "client/signIn/pending":
      return {
        ...state,
        signingIn: true,
        error: null,
        token: null,
      };
    case "client/signIn/fulfilled":
      return {
        ...state,
        signingIn: false,
        token: action.payload.token,
        role: action.payload.role,
        candidate: action.payload.candidate,
      };
    case "client/signIn/rejected":
      return {
        ...state,
        signingIn: false,
        error: action.error,
      };

    case "user/logout/pending":
      return {
        ...state,
        signingIn: true,
        error: null,
        token: null,
      };
    case "user/logout/fulfilled":
      return {
        ...state,
        signingIn: false,
        token: null,
        role: null,
        candidate: null,
      };
    case "user/logout/rejected":
      return {
        ...state,
        signingIn: false,
        error: action.error,
      };

    case "close/dialog":
      return {
        ...state,
        editingAgent: null,
      };
    case "close/dialog-client":
      return {
        ...state,
        editingClient: null,
      };

    case "set/field":
      const { target } = action.payload;
      return {
        ...state,
        editingAgent: {
          ...state.editingAgent,
          [target.name]: target.value,
        },
      };
    case "set/field-client":
      const targ = action.payload.target;
      return {
        ...state,
        editingClient: {
          ...state.editingClient,
          [targ.name]: targ.value,
        },
      };

    case "agent/set-editing-agent":
      return {
        ...state,
        editingAgent: {
          ...state.candidate,
        },
      };
    case "client/set-editing-client":
      return {
        ...state,
        editingClient: {
          ...state.candidate,
        },
      };

    case "agent/edit/pending":
      return {
        ...state,
        loading: true,
      };
    case "agent/edit/fulfilled":
      return {
        ...state,
        loading: false,
        candidate: {
          ...state.editingAgent,
        },

        editingAgent: null,
      };
    case "agent/edit/rejected":
      return {
        ...state,
        loading: false,
        error: action.error,
      };

    case "client/edit/pending":
      return {
        ...state,
        loading: true,
      };
    case "client/edit/fulfilled":
      return {
        ...state,
        loading: false,
        candidate: {
          ...state.editingClient,
        },

        editingClient: null,
      };
    case "client/edit/rejected":
      return {
        ...state,
        loading: false,
        error: action.error,
      };
    case "avatarAgent/add/pending":
      return {
        ...state,
        loading: true,
      };
    case "avatarAgent/add/fulfilled":
      return {
        ...state,
        loading: false,
        candidate: {
          ...state.candidate,
          avatar: action.payload,
        },
      };
    case "avatarClient/add/fulfilled":
      return {
        ...state,
        loading: false,
        candidate: {
          ...state.candidate,
          avatar: action.payload,
        },
      };
    case "avatarAgent/add/rejected":
      return {
        ...state,
        loading: false,
        error: action.error,
      };
    default:
      return state;
  }
};
export default login;

export const loginAgent = (login, password) => {
  return async (dispatch) => {
    dispatch({ type: "agent/signIn/pending" });

    const res = await fetch("api/login/agent", {
      method: "POST",
      body: JSON.stringify({ login, password }),
      headers: {
        "Content-type": "application/json",
      },
    });
    const json = await res.json();

    if (json.error) {
      dispatch({ type: "agent/signIn/rejected", error: json.error });
    } else {
      dispatch({ type: "agent/signIn/fulfilled", payload: json });
      localStorage.setItem("token", json.token);
      localStorage.setItem("role", json.role);
    }
  };
};
export const loginClient = (login, password) => {
  return async (dispatch) => {
    dispatch({ type: "client/signIn/pending" });

    const res = await fetch("api/login/client", {
      method: "POST",
      body: JSON.stringify({ login, password }),
      headers: {
        "Content-type": "application/json",
      },
    });
    const json = await res.json();

    if (json.error) {
      dispatch({ type: "client/signIn/rejected", error: json.error });
    } else {
      dispatch({ type: "client/signIn/fulfilled", payload: json });
      localStorage.setItem("token", json.token);
      localStorage.setItem("role", json.role);
    }
  };
};

export const logout = () => {
  return async (dispatch) => {
    dispatch({ type: "user/logout/pending" });

    try {
      dispatch({ type: "user/logout/fulfilled" });

      localStorage.setItem("token", null);
      localStorage.setItem("role", null);
    } catch (e) {
      dispatch({ type: "user/logout/rejected" });
    }
  };
};

export const closeEditingDialog = () => {
  return {
    type: "close/dialog",
  };
};
export const closeEditingDialogClient = () => {
  return {
    type: "close/dialog-client",
  };
};

export const setFormFields = (e) => {
  return {
    type: "set/field",
    payload: e,
  };
};
export const setFormFieldsClient = (e) => {
  return {
    type: "set/field-client",
    payload: e,
  };
};

export const setEditingAgent = () => {
  return {
    type: "agent/set-editing-agent",
  };
};
export const setEditingClient = () => {
  return {
    type: "client/set-editing-client",
  };
};

export const editAgent = () => {
  return async (dispatch, getState) => {
    dispatch({ type: "agent/edit/pending" });
    const { login } = getState();
    try {
      const resp = await fetch(`api/agent/${login.editingAgent._id}`, {
        method: "PATCH",
        body: JSON.stringify(login.editingAgent),
        headers: {
          "Content-type": "application/json; charset=UTF-8",
        },
      });
      dispatch({ type: "agent/edit/fulfilled" });
    } catch (e) {
      dispatch({ type: "agent/edit/rejected", error: e.toString() });
    }
  };
};
export const editClient = () => {
  return async (dispatch, getState) => {
    dispatch({ type: "client/edit/pending" });
    const { login } = getState();
    console.log(login.editingClient);
    try {
      await fetch(`api/client/${login.editingClient._id}`, {
        method: "PATCH",
        body: JSON.stringify(login.editingClient),
        headers: {
          "Content-type": "application/json; charset=UTF-8",
        },
      });

      dispatch({ type: "client/edit/fulfilled" });
    } catch (e) {
      dispatch({ type: "client/edit/rejected", error: e.toString() });
    }
  };
};

export const uploadAvatarAgent = (file) => {
  return async (dispatch, getState) => {
    const { login } = getState();

    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch("api/avatar/agent", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${login.token}`,
        },
        body: formData,
      });
      const json = await res.json();
      dispatch({ type: "avatarAgent/add/fulfilled", payload: json.avatar });
    } catch (e) {
      console.log(e.message);
    }
  };
};

export const uploadAvatarClient = (file) => {
  return async (dispatch, getState) => {
    const { login } = getState();

    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch("api/avatar/client", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${login.token}`,
        },
        body: formData,
      });
      const json = await res.json();
      dispatch({ type: "avatarClient/add/fulfilled", payload: json.avatar });
    } catch (e) {
      console.log(e.message);
    }
  };
};
export const selectEditingAgent = (state) => state.login.editingAgent;
export const selectEditingClient = (state) => state.login.editingClient;
export const selectToken = (state) => state.login.token;
export const selectRole = (state) => state.login.role;
export const selectCandidate = (state) => state.login.candidate;
