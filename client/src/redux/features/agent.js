const initialState = {
  items: [],
  error: null,
  loading: false,
  currentItem: [],
  itemsById: [],
};

const agent = (state = initialState, action) => {
  switch (action.type) {
    case "agent/getById/pending":
      return {
        ...state,
        loading: true,
      };
    case "agent/getById/fulfilled":
      return {
        ...state,
        loading: false,
        itemsById: [action.payload],
      };
    case "agent/getById/rejected":
      return {
        ...state,
        loading: false,
      };
    case "avatar/add/pending":
      return {
        ...state,
        loading: true,
      };
    case "avatar/add/fulfilled":
      return {
        ...state,
        loading: false,
        currentItem: {
          ...state.currentItem,
          avatar: action.payload,
        },
      };
    case "avatar/add/rejected":
      return {
        ...state,
        loading: false,
        error: action.error,
      };
    case "agents/fetch/pending":
      return {
        ...state,
        loading: true,
      };
    case "agents/fetch/fulfilled":
      return {
        ...state,
        items: action.payload,
        loading: false,
      };
    case "agents/fetch/rejected":
      return {
        ...state,
        loading: false,
      };
    default:
      return state;
  }
};

export const addClientsToAgent = (clientId, agentId) => {
  return async (dispatch) => {
    dispatch({ type: "agent/addClient/pending" });

    try {
      await fetch(`api/add/client/to/${agentId}`, {
        method: "POST",
        body: JSON.stringify({ client: clientId }),
        headers: {
          "Content-type": "application/json",
        },
      });
      dispatch({ type: "agent/addClient/fulfilled" });
    } catch (e) {
      dispatch({ type: "agent/addClient/rejected", error: e.toString() });
    }
  };
};

export const loadAllAgents = () => {
  return async (dispatch) => {
    dispatch({ type: "agents/fetch/pending" });

    try {
      const res = await fetch("api/agents");

      const json = await res.json();

      dispatch({ type: "agents/fetch/fulfilled", payload: json });
    } catch (e) {
      dispatch({ type: "agents/fetch/rejected", error: e.toString() });
    }
  };
};

export const loadAgentById = (agentId) => {
  return async (dispatch) => {
    dispatch({ type: "agent/getById/pending" });

    try {
      const res = await fetch(`api/agent/${agentId}`);
      const json = await res.json();

      dispatch({ type: "agent/getById/fulfilled", payload: json });
    } catch (e) {
      dispatch({ type: "agent/getById/rejected", error: e.toString() });
    }
  };
};

export default agent;

export const selectAllAgents = (state) => state.agent.items;
export const selectAgentById = (state) => state.agent.itemsById;
export const selectLoadingAgent = (state) => state.agent.loading
