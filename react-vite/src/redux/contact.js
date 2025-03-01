const ADD_CONTACT = "contact/addContact";

const addContact = (contact) => ({
    type: ADD_CONTACT,
    payload: contact
});

const initialState = { user: null };

function contactReducer(state = initialState, action){
    switch (action.type){
        default:
            return state;
    }
}

export default contactReducer;