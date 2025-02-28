import { useState } from "react";
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import './ContactProfilePage.css';


function ContactProfilePage(){
    const navigate = useNavigate();

    // Controlled contact details
    const [formData, setFormData] = useState({
        first_name: '',
        last_name: '',
        relation_type: 'peer',
        city: '',
        state: '',
        number: '',
        job_title: '',
        company: '',
        init_meeting_note: '',
        distinct_memory_note: ''
    });
    
    // Controlled contact form errors
    const [errors, setErrors] = useState({});
    
    // Handle input changes
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
        ...prevState,
        [name]: value
        }));
        
        // Clear current input error on type
        // if (errors[name]) {
        // setErrors(prev => ({
        //     ...prev,
        //     [name]: null
        // }));
        // }
    };


    return (
        <div className="contact-profile-page-container">
            {/* Header */}
            <div className="contact-header">
                <h1>Create New Contact</h1>
                <button className="back-button" onClick={() => navigate('/')}>
                    <ArrowLeft size={16}/>
                    Back to Dashboard
                </button>

            </div>
            
            <h2>Contact Form</h2>
        </div>
    )
}

export default ContactProfilePage;