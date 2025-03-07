import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import ContactsList from "../ContactsList";


const Dashboard = () => {
    const navigate = useNavigate();
    const sessionUser = useSelector(state => state.session.user);

    if(!sessionUser) {
        navigate('/');  // navigate to splash page
        return;
    }

    return (
        <div className="dashboard">
            <div className="dashboard-content">
                <ContactsList sessionUser={sessionUser} />
                {/* Future dashboard components will go here */}
                {/* 1. Upcoming Activites [reminders & notifications feature] */}
                {/* 2. Recent Activties [documentation feature] */}
                {/* 2. Data insights [eg. location based recommendation] */}
            </div>
        </div>
    );
};

export default Dashboard;