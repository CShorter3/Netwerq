import { useState } from "react";
import './ContactProfile.css';


function ContactProfilePage(){

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
        <>
            <h1>Profile Page</h1>
            <h2>Contact Form</h2>
        </>
    )
}

export default ContactProfilePage;