const initialState = {
  error: null,
  loading: false,
  items: [],
};

const review = (state = initialState, action) => {
  switch (action.type) {
    case "reviews/fetch/pending":
      return {
        ...state,
        loading: true,
      };
    case "reviews/fetch/fulfilled":
      return {
        ...state,
        loading: false,
        items: action.payload,
      };
    case "reviews/fetch/rejected":
      return {
        ...state,
        loading: false,
      };
    case "review/add/pending":
      return {
        ...state,
        loading: true
      };
    case 'review/add/fulfilled':
      return {
        ...state,
        loading: false,
        items: [action.payload, ...state.items]
      }
    case 'review/add/rejected':
      return {
        ...state,
        loading: false
      }
    default:
      return state;
  }
};

export default review;

export const loadAllReviews = (id) => {
  return async (dispatch) => {
    dispatch({ type: "reviews/fetch/pending" });

    try {
      const res = await fetch(`api/reviews/agent/${id}`);
      const json = await res.json();
      dispatch({ type: "reviews/fetch/fulfilled", payload: json });
    } catch (e) {
      dispatch({ type: "reviews/fetch/rejected", error: e.toString() });
    }
  };
};

export const addReview = (data, id) => {
return async (dispatch, getState) => {
  const state = getState();
  dispatch({ type: "review/add/pending"});
  try {
    const res = await fetch(`api/agent/${id}/review`, {
      method: 'POST',
      body: JSON.stringify(data),
      headers: {
        "Content-type": "application/json"
      },
    });
    const json = await res.json();
    dispatch({ type: 'review/add/fulfilled', payload: json})
  } catch (e) {
    dispatch({ type: 'review/add/rejected', error: e.toString()})
  }
}
}

export const selectAllReviews = (state) => state.review.items
export const selectLoadingReviews = (state) => state.review.loading
