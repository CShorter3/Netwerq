/* Action Constants */
const FETCH_OPPORTUNITIES = "opportunity/fetchOpportunities";


/* Action Creators */
const fetchOpportunities = (opportunities) => ({
    type: FETCH_OPPORTUNITIES,
    payload: opportunities
  });


  /* CSRF token extraction utility */
const getCsrfToken = () => {
    return document.cookie
      .split('; ')
      .find(row => row.startsWith('csrf_token='))
      ?.split('=')[1];
  };
  

  /* Thunk Actions */
  export const fetchOpportunitiesThunk = (contactId) => async (dispatch) => {
    console.log("***** INSIDE FETCH OPPS THUNK! *****");
    try {
      const response = await fetch(`/api/opportunities/contact/${contactId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json"
        },
        credentials: 'include'
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        return { errors: errorData.errors || "Failed to fetch opportunities" };
      }
  
      const data = await response.json();
      console.log("fetch ops api data response: ", data);
      dispatch(fetchOpportunities(data.opportunities));
      return data;
    } catch (error) {
      console.error("Error fetching opportunities:", error);
      return { errors: error.toString() };
    }
  };


  /* Opportunity reducer */
const initialState = {
    opportunities: []
  };
  
  function opportunityReducer(state = initialState, action) {
    switch (action.type) {
      case FETCH_OPPORTUNITIES:
        return {
          ...state,
          opportunities: action.payload
        };
      default:
        return state;
    }
  }
  
  export default opportunityReducer;