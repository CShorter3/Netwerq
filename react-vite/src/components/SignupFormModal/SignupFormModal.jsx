import { useState } from "react";
import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";
import { thunkSignup } from "../../redux/session";
import LoginFormModal from "../LoginFormModal/LoginFormModal";
import "./SignupForm.css";

function SignupFormModal() {
  const dispatch = useDispatch();
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState({});
  const { closeModal } = useModal();

  const switchToLogin = (e) => {
    e.preventDefault();
    closeModal();
    setModalContent(<LoginFormModal />);
  };



const validateForm = () => {
  const newErrors = {};
  
  if (!email) {
    newErrors.email = "Email is required";
  } else if (!/\S+@\S+\.\S+/.test(email)) {
    newErrors.email = "Please provide a valid email";
  }
  
  if (!username) {
    newErrors.username = "Username is required";
  } else if (username.length < 3 || username.length > 40) {
    newErrors.username = "Username must be between 3 and 40 characters";
  }
  
  if (!password) {
    newErrors.password = "Password is required";
  } else if (password.length < 6) {
    newErrors.password = "Password must be at least 6 characters long";
  }
  
  if (password !== confirmPassword) {
    newErrors.confirmPassword = "Passwords must match";
  }
  
  setErrors(newErrors);
  return Object.keys(newErrors).length === 0;
};


const handleSubmit = async (e) => {
  e.preventDefault();
  
  if(!validateForm()){
    return;
  }
  
  const serverResponse = await dispatch(
    thunkSignup({
      email,
      username,
      password,
    })
  );
  
  if (serverResponse) {
    setErrors(serverResponse);
  } else {
    closeModal();
  }
};

return (
  <div className="signup-modal">
    {/* Header */}
    <div className="signup-modal-header">
      <h2>Join Netwerq</h2>
      <p>Create an account to strengthen your professional network</p>
    </div>
    
    {/* Content */}
    <div className="signup-modal-content">
      {errors.server && <p className="error-message server-error">{errors.server}</p>}
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="text"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          {errors.email && <p className="error-message">{errors.email}</p>}
        </div>
        
        <div className="form-group">
          <label htmlFor="username">Username</label>
          <input
            id="username"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          {errors.username && <p className="error-message">{errors.username}</p>}
        </div>
        
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          {errors.password && <p className="error-message">{errors.password}</p>}
        </div>
        
        <div className="form-group">
          <label htmlFor="confirmPassword">Confirm Password</label>
          <input
            id="confirmPassword"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
          {errors.confirmPassword && <p className="error-message">{errors.confirmPassword}</p>}
        </div>
        
        <button type="submit" className="submit-button">Sign Up</button>
      </form>
      
      <div className="login-prompt">
        <p>
          Already have an account? <a onClick={switchToLogin}>Log in</a>
        </p>
      </div>
    </div>
  </div>
);

}


export default SignupFormModal;