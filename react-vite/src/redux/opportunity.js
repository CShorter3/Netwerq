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
      dispatch(fetchOpportunities(data.opportunities));
      return data;
    } catch (error) {
      console.error("Error fetching opportunities:", error);
      return { errors: error.toString() };
    }
  };