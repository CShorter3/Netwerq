/* Action Constants */
const ADD_CONTACT = "contact/addContact";

/* Action Creators */
const addContact = (contact) => ({
    type: ADD_CONTACT,
    payload: contact
});

/* Csrf Extraction Utility */
const getCsrfToken = () => {
    return document.cookie
      .split('; ')
      .find(row => row.startsWith('csrf_token='))
      ?.split('=')[1];
};
  

/* Thunk Actions */
export const saveContact = (contactData) => async (dispatch) => {
    console.log("*****INSIDE SAVE CONTACT THUNK!*****")
    const response = await fetch("/api/contacts", {
        method: "POST",
        headers: { 
            "Content-Type": "application/json" 
        },
        body: JSON.stringify(contactData)
    });
    console.log("returned contact date response: ", response);
}


/* Contact slice of root reducer */
const initialState = { user: null };

function contactReducer(state = initialState, action){
    switch (action.type){
        default:
            return state;
    }
}

export default contactReducer;