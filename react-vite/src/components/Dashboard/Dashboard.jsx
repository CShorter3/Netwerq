import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";


const Dashboard = () => {
    const navigate = useNavigate();
    const sessionUser = useSelector(state => state.session.user);

    if(!sessionUser) return <p>Loading...</p>;

    const handleCreateContact = () => {
        navigate(`/contacts/${sessionUser.id}`);
    };

    return (
        <div className="dashboard">
            <h1>Welcome, {sessionUser.first_name}!</h1>
            <button onClick={handleCreateContact} className="create-contact-button">
                Create Contact
            </button>
            
        </div>
    );
}

export default Dashboard;