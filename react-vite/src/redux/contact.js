/* Action Constants */
const ADD_CONTACT = "contact/addContact";

/* Action Creators */
const addContact = (contact) => ({
    type: ADD_CONTACT,
    payload: contact
});

/* csrf extraction utility */
const getCsrfToken = () => {
    return document.cookie
      .split('; ')
      .find(row => row.startsWith('csrf_token='))
      ?.split('=')[1];
};

/* Thunk Actions */
export const saveContact = (contactData) => async (dispatch) => {
    console.log("*****INSIDE SAVE CONTACT THUNK!*****")
    const csrfToken = getCsrfToken();

    try{
        const response = await fetch("/api/contacts", {
            method: "POST",
            headers: { 
                "Content-Type": "application/json",
                "X-CSRFToken": csrfToken,
            },
            credentials: 'include',
            body: JSON.stringify(contactData)
        });

        if(!response.ok){
            throw new Error("Failed to save contact");
        }

        const data = await response.json();
        console.log("Returned contact data response: ", data);

    } catch (error){
        console.error("Error saving contact: ", error)
    }
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