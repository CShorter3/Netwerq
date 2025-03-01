import { useState } from "react";
import { useDispatch } from "react-redux";
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { saveContactThunk } from "../../redux/contact";
import './ContactProfilePage.css';


function ContactProfilePage(){

    /* utility support */
    const navigate = useNavigate();
    const dispatch = useDispatch();

    // React state controlled contact details
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
    
    // React state controlled contact form variables
    const [errors, setErrors] = useState({});
    const [isContactSaved, setIsContactSaved] = useState(false);
    const [isEditingForm, setIsEditingForm] = useState(true);
    const [savedContactId, setSavedContactId] = useState(null);

    
    // Validate field input utility function
    const validateContactField = (name, value) => {
        let error = null;
        
        switch (name) {
          case 'first_name':
            if (!value.trim()) {
              error = "First name is required";
            } else if (value.length > 30) {
              error = "First name must be less than 30 characters";
            }
            break;
            
          case 'last_name':
            if (!value.trim()) {
              error = "Last name is required";
            } else if (value.length > 30) {
              error = "Last name must be less than 30 characters";
            }
            break;
            
          case 'relation_type':
            if (!value) {
              error = "Relationship type is required";
            }
            break;
            
          case 'city':
            if (value && value.length > 35) {
              error = "City must be less than 35 characters";
            }
            break;
            
          case 'state':
            if (value && value.length > 35) {
              error = "State must be less than 35 characters";
            }
            break;
            
          case 'number':
            if (value && value.length > 20) {
              error = "Phone number must be less than 20 characters";
            }
            break;
            
          case 'job_title':
            if (value && value.length > 50) {
              error = "Job title must be less than 50 characters";
            }
            break;
            
          case 'company':
            if (value && value.length > 50) {
              error = "Company name must be less than 50 characters";
            }
            break;
            
          case 'init_meeting_note':
            if (!value.trim()) {
              error = "Initial meeting note is required";
            } else if (value.length > 300) {
              error = "Initial meeting note must be less than 300 characters";
            }
            break;
            
          case 'distinct_memory_note':
            if (!value.trim()) {
              error = "Distinctive memory note is required";
            } else if (value.length > 300) {
              error = "Distinctive memory note must be less than 300 characters";
            }
            break;
            
          default:
            break;
        }
        
        return error;
    };
    
    // Listen for input changes
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({ ...prevState, [name]: value }));
        
        // Clear current input error on type
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: null }));
        }
    };

    // Listen for input errors on focus change
    const handleInputError = (e) => {
        const { name, value } = e.target;
        const error = validateContactField(name, value);

        if(error) {
            setErrors(prev => ({ ...prev, [name]: error }));
        }
    }

    // Use utility function to validate the entire contact form at once
    const validateForm = () => {
        const newErrors = {};
        
        // check for form erros
        Object.keys(formData).forEach(field => {
          const error = validateContactField(field, formData[field]);
          if (error) {
            newErrors[field] = error;
          }
        });
        
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // Submitting a valid form adds a user contact and triggers reactive UI behaviour
    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // do not process an invalid creator or edit form submission
        if (!validateForm()) {
            console.log('Form has errors, please correct them.');
  
            // direct user's view to the first error
            const firstError = document.querySelector('.error-message');
            if (firstError) {
              firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
            return;
        } 

        const result = dispatch(saveContactThunk(formData));

        if(result) { 
            // PROCESS STATE CHANGE
        } else {
            setErrors(prev => ({
                ...prev,
                ...(typeof result === 'object' ? result : { server: result })
            }));            
        }

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
            
            {/* Form */}
            <div className="contact-form-container">
                <form className="contact-form">
                {/* Contact Information */}
                <div className="form-section">
                    <h2>Contact Information</h2>
                    
                    <div className="form-row">
                    <div className="form-group">
                        <label htmlFor="first_name">First Name *</label>
                        <input
                            type="text"
                            id="first_name"
                            name="first_name"
                            value={formData.first_name}
                            onChange={handleInputChange}
                            onBlur={handleInputError}
                            maxLength={30}
                            required
                        />
                        {errors.first_name && <div className="error-message">{errors.first_name}</div>}
                        <div className="char-count">{formData.first_name.length}/30</div>
                    </div>
                    
                    <div className="form-group">
                        <label htmlFor="last_name">Last Name *</label>
                        <input
                            type="text"
                            id="last_name"
                            name="last_name"
                            value={formData.last_name}
                            onChange={handleInputChange}
                            onBlur={handleInputError}
                            maxLength={30}
                            required
                        />
                        {errors.last_name && <div className="error-message">{errors.last_name}</div>}
                        <div className="char-count">{formData.last_name.length}/30</div>
                    </div>
                    </div>

                    <div className="form-row">
                    <div className="form-group">
                        <label htmlFor="relation_type">Relationship Type *</label>
                        <div className="radio-group">
                        <label className="radio-label">
                            <input
                                type="radio"
                                name="relation_type"
                                value="mentor"
                                checked={formData.relation_type === 'mentor'}
                                onChange={handleInputChange}
                                required
                            />
                            <span>Mentor</span>
                        </label>
                        <label className="radio-label">
                            <input
                                type="radio"
                                name="relation_type"
                                value="peer"
                                checked={formData.relation_type === 'peer'}
                                onChange={handleInputChange}
                            />
                            <span>Peer</span>
                        </label>
                        <label className="radio-label">
                            <input
                                type="radio"
                                name="relation_type"
                                value="mentee"
                                checked={formData.relation_type === 'mentee'}
                                onChange={handleInputChange}
                            />
                            <span>Mentee</span>
                        </label>
                        <label className="radio-label">
                            <input
                                type="radio"
                                name="relation_type"
                                value="recruiter"
                                checked={formData.relation_type === 'recruiter'}
                                onChange={handleInputChange}
                            />
                            <span>Recruiter</span>
                        </label>
                    </div>
                    {errors.relation_type && (
                        <div className="error-message">{errors.relation_type}</div>
                    )}
                    </div>
                    </div>
                </div>

                {/* Contact Details */}
                <div className="form-section">
                    <h2>Contact Details</h2>
                    <div className="form-row">
                    <div className="form-group">
                        <label htmlFor="city">City</label>
                        <input
                            type="text"
                            id="city"
                            name="city"
                            value={formData.city}
                            onChange={handleInputChange}
                            onBlur={handleInputError}
                            maxLength={35}
                        />
                        {errors.city && <div className="error-message">{errors.city}</div>}
                        <div className="char-count">{formData.city.length}/35</div>
                    </div>
                    
                    <div className="form-group">
                        <label htmlFor="state">State</label>
                        <input
                            type="text"
                            id="state"
                            name="state"
                            value={formData.state}
                            onChange={handleInputChange}
                            onBlur={handleInputError}
                            maxLength={35}
                        />
                        {errors.state && <div className="error-message">{errors.state}</div>}
                        <div className="char-count">{formData.state.length}/35</div>
                    </div>
                    </div>

                    <div className="form-row">
                    <div className="form-group">
                        <label htmlFor="number">Phone Number</label>
                        <input
                            type="text"
                            id="number"
                            name="number"
                            value={formData.number}
                            onChange={handleInputChange}
                            onBlur={handleInputError}
                            maxLength={20}
                        />
                        {errors.number && <div className="error-message">{errors.number}</div>}
                        <div className="char-count">{formData.number.length}/20</div>
                    </div>
                    </div>

                    <div className="form-row">
                    <div className="form-group">
                        <label htmlFor="job_title">Job Title</label>
                        <input
                            type="text"
                            id="job_title"
                            name="job_title"
                            value={formData.job_title}
                            onChange={handleInputChange}
                            onBlur={handleInputError}
                            maxLength={50}
                        />
                        {errors.job_title && <div className="error-message">{errors.job_title}</div>}
                        <div className="char-count">{formData.job_title.length}/50</div>
                    </div>
                    
                    <div className="form-group">
                        <label htmlFor="company">Company</label>
                        <input
                            type="text"
                            id="company"
                            name="company"
                            value={formData.company}
                            onChange={handleInputChange}
                            onBlur={handleInputError}
                            maxLength={50}
                        />
                        {errors.company && <div className="error-message">{errors.company}</div>}
                        <div className="char-count">{formData.company.length}/50</div>
                    </div>
                    </div>
                </div>

                {/* Notes */}
                <div className="form-section">
                    <h2>Contact Notes</h2>
                    <div className="form-group full-width">
                    <label htmlFor="init_meeting_note">Initial Meeting Note *</label>
                    <textarea
                        id="init_meeting_note"
                        name="init_meeting_note"
                        value={formData.init_meeting_note}
                        onChange={handleInputChange}
                        onBlur={handleInputError}
                        placeholder="Describe how you met this person..."
                        maxLength={300}
                        required
                    />
                    {errors.init_meeting_note && <div className="error-message">{errors.init_meeting_note}</div>}
                    <div className="char-count">{formData.init_meeting_note.length}/300</div>
                    </div>
                    
                    <div className="form-group full-width">
                    <label htmlFor="distinct_memory_note">Distinctive Memory Note *</label>
                    <textarea
                        id="distinct_memory_note"
                        name="distinct_memory_note"
                        value={formData.distinct_memory_note}
                        onChange={handleInputChange}
                        onBlur={handleInputError}
                        placeholder="Note distinctive features, qualities, or associations to help you remember this person..."
                        maxLength={300}
                        required
                    />
                    {errors.distinct_memory_note && <div className="error-message">{errors.distinct_memory_note}</div>}
                    <div className="char-count">{formData.distinct_memory_note.length}/300</div>
                    </div>
                </div>

                {/* Form Buttons */}
                <div className="form-buttons">
                    <button type="button" className="cancel-button"
                        onClick={() => navigate('/')}
                    >
                        Cancel
                    </button>
                    <button type="submit" className="save-button"
                        onClick={(e) => {
                            e.preventDefault();
                            console.log('Form data:', formData);
                            handleSubmit(e)
                        }}
                    >
                        Save Contact
                    </button>
                </div>
                </form>
            </div>
        </div>
            
    )
}

export default ContactProfilePage;