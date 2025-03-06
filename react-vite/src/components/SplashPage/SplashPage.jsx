import React from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useModal } from "../../context/Modal"; // Import useModal
import LoginFormModal from "../LoginFormModal";
import SignupFormModal from "../SignupFormModal";
import "./SplashPage.css";

function SplashPage() {
  const navigate = useNavigate();
  const { setModalContent } = useModal(); // Use modal context
  const sessionUser = useSelector((state) => state.session.user);

  const handleAddContact = () => {
    navigate("/contacts/new");
  };

  return (
    <div className="splash-page">
      <div className="page-container">
        <div className="content-container">
          {sessionUser && (
            <p className="welcome-text">Welcome, {sessionUser.username}</p>
          )}

          <h1 className="tagline">
            Nurture the relationships
            <br />
            that shape your future
          </h1>

          {!sessionUser && (
            <div className="auth-links">
              {/* Login Button - Opens LoginFormModal */}
              <button
                className="login-link"
                onClick={() => setModalContent(<LoginFormModal />)}
              >
                Log in
              </button>

              {/* Signup Button - Opens SignupFormModal */}
              <button
                className="signup-link"
                onClick={() => setModalContent(<SignupFormModal />)}
              >
                Sign up
              </button>
            </div>
          )}
        </div>

        {sessionUser && (
          <button className="add-contact-button" onClick={handleAddContact}>
            <span className="add-icon"></span>
            <span className="button-text">Add Contact</span>
          </button>
        )}
      </div>
    </div>
  );
}

export default SplashPage;
