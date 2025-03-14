const SET_USER = 'session/setUser';
const REMOVE_USER = 'session/removeUser';

const setUser = (user) => ({
  type: SET_USER,
  payload: user
});

const removeUser = () => ({
  type: REMOVE_USER
});

const csrfToken = document.cookie
.split('; ')
.find(row => row.startsWith('csrf_token='))
?.split('=')[1];

export const thunkAuthenticate = () => async (dispatch) => {
	const response = await fetch("/api/auth/");
	if (response.ok) {
		const data = await response.json();
		if (data.errors) {
			return;
		}
		dispatch(setUser(data));
	}
};

export const thunkLogin = (credentials) => async dispatch => {
  
  const response = await fetch("/api/auth/login", {
    method: "POST",
    headers: { 
      "Content-Type": "application/json",
      'X-CSRFToken': csrfToken, 
    },
    body: JSON.stringify(credentials),
    credentials: 'include'
  });
  
  if(response.ok) {
    const data = await response.json();
    dispatch(setUser(data));
  } else if (response.status < 500) {
    const errorMessages = await response.json();
    return errorMessages
  } else {
    return { server: "Something went wrong. Please try again" }
  }
};

export const thunkSignup = (user) => async (dispatch) => {
  //console.log("Signup request data:", user);

  const response = await fetch("/api/auth/signup", {
    method: "POST",
    headers: { 
      "Content-Type": "application/json",
      'X-CSRFToken': csrfToken,
    },
    body: JSON.stringify(user),
    credentials: 'include'
  });

  if(response.ok) {
    const data = await response.json();
    dispatch(setUser(data));
  } else if (response.status < 500) {
    const errorMessages = await response.json();
    //console.log("Signup validation errors:", errorMessages);
    return errorMessages
  } else {
    return { server: "Something went wrong. Please try again" }
  }
};

export const thunkLogout = () => async (dispatch) => {
  await fetch("/api/auth/logout");
  dispatch(removeUser());
};

const initialState = { user: null };

function sessionReducer(state = initialState, action) {
  switch (action.type) {
    case SET_USER:
      return { ...state, user: action.payload };
    case REMOVE_USER:
      return { ...state, user: null };
    default:
      return state;
  }
}

export default sessionReducer;
