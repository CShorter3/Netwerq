/* Action Constants */
const FETCH_OPPORTUNITIES = "opportunity/fetchOpportunities";
const ADD_OPPORTUNITY = "opportunity/addOpportunity";


/* Action Creators */
const fetchOpportunities = (opportunities) => ({
    type: FETCH_OPPORTUNITIES,
    payload: opportunities
});

const addOpportunity = (opportunity) => ({
    type: ADD_OPPORTUNITY,
    payload: opportunity
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
    const csrfToken = getCsrfToken();

    try {
        const response = await fetch(`/api/opportunities/contact/${contactId}`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "X-CSRFToken": opportunityData.csrf_token || csrfToken
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
        default:
            return state;
    }
}
  
export default opportunityReducer;