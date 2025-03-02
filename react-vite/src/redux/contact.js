/* Action Constants */
const ADD_CONTACT = "contact/addContact";
const UPDATE_CONTACT = "contact/updateContact";
const DELETE_CONTACT = "contact/deleteContact";

/* Action Creators */
const addContact = (contact) => ({
    type: ADD_CONTACT,
    payload: contact
});

const updateContact = (contact) => ({
    type: UPDATE_CONTACT,
    payload: contact
});

const deleteContact = (contactId) => ({
    type: DELETE_CONTACT,
    payload: contactId
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

export const updateContactThunk = (contactId, contactData) => async (dispatch) => {
    console.log("*****INSIDE UPDATE CONTACT THUNK!*****");
    const csrfToken = getCsrfToken();
    try {
        const response = await fetch(`/api/contacts/${contactId}`, {
            method: "PUT",
            headers: { 
                "Content-Type": "application/json",
                "X-CSRFToken": csrfToken,
            },
            credentials: 'include',
            body: JSON.stringify(contactData)
        });
        
        if (!response.ok) {
            const errorData = await response.json();
            return errorData.errors || "Failed to update contact";
        }
        
        const data = await response.json();
        dispatch(updateContact(data));
        return true;
    } catch (error) {
        console.error("Error updating contact: ", error);
        return error.toString();
    }
};

export const deleteContactThunk = (contactId) => async (dispatch) => {
    console.log("*****INSIDE DELETE CONTACT THUNK!*****");
    const csrfToken = getCsrfToken();
    try {
      const response = await fetch(`/api/contacts/${contactId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "X-CSRFToken": csrfToken,
        },
        credentials: 'include'
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        return errorData.errors || "Failed to delete contact";
      }
  
      dispatch(deleteContact(contactId));
      return true;
    } catch (error) {
      console.error("Error deleting contact:", error);
      return error.toString();
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
        case UPDATE_CONTACT:
            return {
                ...state,
                contacts: state.contacts.map(contact => 
                    contact.id === action.payload.id ? action.payload : contact
                ),
                currentContact: action.payload
            };
        case DELETE_CONTACT:
            return {
                ...state,
                contacts: state.contacts.filter(contact => contact.id !== action.payload),
                currentContact: state.currentContact?.id === action.payload? null : state.currentContact
            };
        default:
            return state;
    }
}

export default contactReducer;