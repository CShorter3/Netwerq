import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useModal } from "../../context/Modal";
import LoginFormModal from "../LoginFormModal";
import SignupFormModal from "../SignupFormModal";
import { thunkLogout } from "../../redux/session";
import { Sprout, LayoutDashboard } from 'lucide-react';
import "./SplashPage.css";

function SplashPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { setModalContent } = useModal();
  const sessionUser = useSelector((state) => state.session.user);

  const handleAddContact = () => {
    navigate("/contacts/new");
  };

  const handleDashboard = () => {
    navigate("/dashboard");
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

          {!sessionUser ? (
            <div className="auth-links">
              {/* Login Button - Opens LoginFormModal */}
              <a
                className="login-link"
                onClick={() => setModalContent(<LoginFormModal />)}
              >
                Log in
              </a>

              {/* Signup Button - Opens SignupFormModal */}
              <a
                className="signup-link"
                onClick={() => setModalContent(<SignupFormModal />)}
              >
                Sign up
              </a>
            </div>

          ) : (

            <div className="auth-links">
              {/* Login Button - Opens LoginFormModal */}
              <a
                className="logout-link"
                onClick={() => dispatch(thunkLogout())}
              >
                Log out
              </a>
            </div>
          )}

        </div>

        {sessionUser ? (
            <div className="action-buttons">
              <button className="add-contact-button" onClick={handleAddContact}>
                <span className="add-icon"></span>
                <span className="button-text">Add Contact</span>
              </button>
              <button className="dashboard-button" onClick={handleDashboard}>
                <LayoutDashboard className="dashboard-icon" size={24} />
                <span className="button-text">Dashboard</span>
              </button>
          </div>
        ) : (
            <div className="sprout-container">
              <Sprout className="sprout-icon" size={100} color="rgba(19, 50, 11, 0)" />
            </div>
        )}
      </div>
    </div>
  );
}

export default SplashPage;
