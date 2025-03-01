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
export const saveContactThunk = (contactData) => async (dispatch) => {
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
            const errorData = await response.json();
            return errorData.errors || "Failed to save contact";
        }

        const data = await response.json();

        dispatch(addContact(data));
        console.log("Returned contact data response: ", data);

        return true;
    } catch (error){
        console.error("Error saving contact: ", error)
    }
};


/* Contact slice of root reducer */
const initialState = { 
    contacts: [],
    currentContact: null
};

function contactReducer(state = initialState, action){
    switch (action.type){
        case ADD_CONTACT:
            return {
                ...state,
                contacts: [...state.contacts, action.payload],
                currentContact: action.payload
            };
        default:
            return state;
    }
}

export default contactReducer;