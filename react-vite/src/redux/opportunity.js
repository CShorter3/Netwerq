/* Action Constants */
const FETCH_OPPORTUNITIES = "opportunity/fetchOpportunities";
const ADD_OPPORTUNITY = "opportunity/addOpportunity";
const UPDATE_OPPORTUNITY = "opportunity/updateOpportunity";
const REMOVE_OPPORTUNITY = "opportunity/removeOpportunity";


/* Action Creators */
const fetchOpportunities = (opportunities) => ({
    type: FETCH_OPPORTUNITIES,
    payload: opportunities
});

const addOpportunity = (opportunity) => ({
    type: ADD_OPPORTUNITY,
    payload: opportunity
});

const updateOpportunity = (opportunity) => ({
    type: UPDATE_OPPORTUNITY,
    payload: opportunity
});

const removeOpportunity = (opportunityId) => ({
    type: REMOVE_OPPORTUNITY,
    payload: opportunityId
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


export const createOpportunityThunk = (contactId, opportunityData) => async (dispatch) => {
    //const csrfToken = getCsrfToken();
    console.log("***** INSIDE CREATE OPPS THUNK! *****");

    try {
        const response = await fetch(`/api/opportunities/contact/${contactId}`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "X-CSRFToken": opportunityData.csrf_token || getCsrfToken()
        },
        credentials: 'include',
        body: JSON.stringify(opportunityData)
        });

        if (!response.ok) {
            const errorData = await response.json();
            return { errors: errorData.errors || "Failed to create opportunity" };
        }

        const data = await response.json();
        dispatch(addOpportunity(data));
        return data;
    } catch (error) {
        console.error("Error creating opportunity:", error);
        return { errors: error.toString() };
    }
};


export const updateOpportunityThunk = (opportunityId, opportunityData) => async (dispatch) => {
    //const csrfToken = getCsrfToken();
    console.log("***** INSIDE UPDATE OPPS THUNK! *****");

    try {
      const response = await fetch(`/api/opportunities/${opportunityId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "X-CSRFToken": opportunityData.csrf_token || getCsrfToken()
        },
        credentials: 'include',
        body: JSON.stringify(opportunityData)
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        return { errors: errorData.errors || "Failed to update opportunity" };
      }
  
      const data = await response.json();
      dispatch(updateOpportunity(data));
      return data;
    } catch (error) {
      console.error("Error updating opportunity:", error);
      return { errors: error.toString() };
    }
};


export const deleteOpportunityThunk = (opportunityId) => async (dispatch) => {
    console.log("***** INSIDE UPDATE OPPS THUNK! *****");

    const csrfToken = getCsrfToken();

    try {
    const response = await fetch(`/api/opportunities/${opportunityId}`, {
        method: "DELETE",
        headers: {
        "Content-Type": "application/json",
        "X-CSRFToken": csrfToken
        },
        credentials: 'include'
    });

    if (!response.ok) {
        const errorData = await response.json();
        return { errors: errorData.errors || "Failed to delete opportunity" };
    }

    dispatch(removeOpportunity(opportunityId));
    return { success: true };
    } catch (error) {
        console.error("Error deleting opportunity:", error);
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
        case ADD_OPPORTUNITY:
            return {
                ...state,
                opportunities: [...state.opportunities, action.payload]
        };
        case UPDATE_OPPORTUNITY:
            return {
                ...state,
                opportunities: state.opportunities.map(opportunity => 
                opportunity.id === action.payload.id ? action.payload : opportunity
                )
        };
        case REMOVE_OPPORTUNITY:
            return {
                ...state,
                opportunities: state.opportunities.filter(
                opportunity => opportunity.id !== action.payload
                )
            };
        default:
            return state;
    }
}
  
export default opportunityReducer;