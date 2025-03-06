import { NavLink } from "react-router-dom";
import { useLocation } from "react-router-dom";
//import ProfileButton from "./ProfileButton";
import { ArrowLeft } from "lucide-react";
import "./Navigation.css";

function Navigation() {

  const location = useLocation();
  const path = location.pathname;
  
  // Show back to bashboard nav bar on Contact Profile pages
  if (path.includes('/contacts/')) {
    return (
      <div className="contact-nav">
        <NavLink to="/" className="back-button">
          <ArrowLeft size={16} />
          Back to Dashboard
        </NavLink>
      </div>
    );
  }

  return <div></div>; 
  // (
    // <ul>
    //   <li>
    //     <NavLink to="/">Home</NavLink>
    //   </li>

      {/* <li>
        <ProfileButton />
      </li> */}
    // </ul>
  // );
}

export default Navigation;
