import { useState } from "react";
import { useDispatch, /*useSelector*/ } from "react-redux";
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import './ContactProfilePage.css';
import { saveContactThunk } from "../../redux/contact";
import { updateContactThunk } from "../../redux/contact";


function ContactProfilePage(){

    //const contactState = useSelector(state => state.contact);


    /* utility support */
    const navigate = useNavigate();
    const dispatch = useDispatch();

    /* React state controlled contact details */
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
    
    /* React state controlled contact form variables */
    const [errors, setErrors] = useState({});
    const [isContactSaved, setIsContactSaved] = useState(false);
    const [savedFormData, setSavedFormData] = useState(null);
    const [savedContactId, setSavedContactId] = useState(null);
    const [isEditingForm, setIsEditingForm] = useState(true);

    /* Validate field input utility function */
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

    /* Submit behavior depends on the state of it's contact form's react state variables */
    const handleSubmit = async (e) => {
        e.preventDefault();
        e.stopPropagation();                       // stop input as error
        
        // form prevents invalid contact edits and creations
        if (!validateForm()) {
            console.log('Form has errors, please correct them.');
  
            // form directs the client's view towards the first input error 
            const firstError = document.querySelector('.error-message');
            if (firstError) {
              firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
            return;
        } 

        // form can edit a registed contact
        if (isContactSaved && savedContactId) {
            const result = await dispatch(updateContactThunk(savedContactId, formData));
            
            if (result === true) {
                setErrors({});                      // stop input as error: when validation passes, reset errors
                setSavedFormData(formData);
                setIsEditingForm(false);
            } else {
                // Handle errors
                setErrors(prev => ({
                    ...prev,
                    ...(typeof result === 'object' ? result : { server: result })
                }));
            }
        } 
        // form can register a new contact
        else {
            // form used Redux to send contact details to the backend api server
            const result = await dispatch(saveContactThunk(formData));
            
            if (result === true) {
                setErrors({});                  // stop input as error: when validation passes, reset errors
                setSavedFormData(formData);
                setIsContactSaved(true);
                setIsEditingForm(false);
                setSavedContactId(result.id);
            } else {
                // Handle errors
                setErrors(prev => ({
                    ...prev,
                    ...(typeof result === 'object' ? result : { server: result })
                }));
            }
        }
    };

    const handleEdit = () => {
        // if (contactState && contactState.currentContact) {
        //     setFormData(contactState.currentContact);
        // }
        setIsEditingForm(true);
    }

    const handleDelete = () => {
        navigate('/');
    }

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
                            disabled={isContactSaved && !isEditingForm}
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
                            disabled={isContactSaved && !isEditingForm}
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
                                disabled={isContactSaved && !isEditingForm}
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
                                disabled={isContactSaved && !isEditingForm}
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
                                disabled={isContactSaved && !isEditingForm}
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
                                disabled={isContactSaved && !isEditingForm}
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
                            disabled={isContactSaved && !isEditingForm}
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
                            disabled={isContactSaved && !isEditingForm}
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
                            disabled={isContactSaved && !isEditingForm}
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
                            disabled={isContactSaved && !isEditingForm}
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
                            disabled={isContactSaved && !isEditingForm}
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
                        disabled={isContactSaved && !isEditingForm}
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
                        disabled={isContactSaved && !isEditingForm}
                    />
                    {errors.distinct_memory_note && <div className="error-message">{errors.distinct_memory_note}</div>}
                    <div className="char-count">{formData.distinct_memory_note.length}/300</div>
                    </div>
                </div>

                {/* Form Buttons */}
                <div className="form-buttons">
                    {isContactSaved ? (
                        isEditingForm ? (
                            <>
                                <button type="button" 
                                    className="cancel-button"
                                    onClick={() => setIsEditingForm(false)}
                                >
                                    Cancel
                                </button>
                                <button type="submit" 
                                    className="save-button"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        handleSubmit(e);
                                    }}
                                >
                                    Confirm Changes
                                </button>
                            </>
                        ) : (
                            <>
                                <button type="button" 
                                    className="delete-button"
                                    onClick={handleDelete}
                                >
                                    Delete Contact
                                </button>
                                <button type="button" 
                                    className="edit-button"
                                    onClick={handleEdit}
                                >
                                    Edit Contact
                                </button>
                            </>
                        )
                    ) : (
                        <>
                            <button type="button" 
                                className="cancel-button"
                                onClick={() => navigate('/')}
                            >
                                Cancel
                            </button>
                            <button type="submit" 
                                className="save-button"
                                onClick={(e) => {
                                    e.preventDefault();
                                    handleSubmit(e);
                                }}
                            >
                                Save Contact
                            </button>
                        </>
                    )}
                </div>
                </form>
            </div>
        </div> 
    )
}

export default ContactProfilePage;




// import { useState, useEffect } from "react";
// import { ArrowLeft } from 'lucide-react';
// import { useNavigate, useParams } from 'react-router-dom';
// import { useDispatch, useSelector } from 'react-redux';
// import { saveContactThunk, loadContactThunk, updateContactThunk, deleteContactThunk } from "../../redux/contact";
// import './ContactProfilePage.css';

// function ContactProfilePage() {
//     const { contactId } = useParams();
//     const navigate = useNavigate();
//     const dispatch = useDispatch();
    
//     // Get contact from Redux store
//     const currentContact = useSelector(state => state.contact.currentContact);
    
//     // Track if we're editing an existing contact
//     //const isExistingContact = contactId && contactId !== 'new';
    
//     // State for form mode
//     //const [isEditing, setIsEditing] = useState(contactId === 'new');
//     const [isLoading, setIsLoading] = useState(isExistingContact);
//     const isExistingContact = contactId && contactId !== 'new';
//     const [isEditing, setIsEditing] = useState(!isExistingContact);

//     // Controlled contact details
//     const [formData, setFormData] = useState({
//         first_name: '',
//         last_name: '',
//         relation_type: 'peer',
//         city: '',
//         state: '',
//         number: '',
//         job_title: '',
//         company: '',
//         init_meeting_note: '',
//         distinct_memory_note: ''
//     });
    
//     // Controlled contact form errors
//     const [errors, setErrors] = useState({});
    
//     // Load contact data if viewing an existing contact
//     useEffect(() => {
//         async function loadContactData() {
//             if (isExistingContact) {
//                 setIsLoading(true);
//                 try {
//                     const result = await dispatch(loadContactThunk(contactId));
//                     if (result) {
//                         // Populate form with contact data
//                         setFormData(result);
//                         setIsEditing(false);  // Start in view mode for existing contacts
//                     } else {
//                         // Handle contact not found
//                         navigate('/');
//                     }
//                 } catch (error) {
//                     console.error("Error loading contact:", error);
//                     navigate('/');
//                 } finally {
//                     setIsLoading(false);
//                 }
//             }
//         }
        
//         loadContactData();
//     }, [contactId, dispatch, navigate, isExistingContact]);
    
//     // Validate field input utility function
//     const validateContactField = (name, value) => {
//         let error = null;
        
//         switch (name) {
//           case 'first_name':
//             if (!value.trim()) {
//               error = "First name is required";
//             } else if (value.length > 30) {
//               error = "First name must be less than 30 characters";
//             }
//             break;
            
//           case 'last_name':
//             if (!value.trim()) {
//               error = "Last name is required";
//             } else if (value.length > 30) {
//               error = "Last name must be less than 30 characters";
//             }
//             break;
            
//           case 'relation_type':
//             if (!value) {
//               error = "Relationship type is required";
//             }
//             break;
            
//           case 'city':
//             if (value && value.length > 35) {
//               error = "City must be less than 35 characters";
//             }
//             break;
            
//           case 'state':
//             if (value && value.length > 35) {
//               error = "State must be less than 35 characters";
//             }
//             break;
            
//           case 'number':
//             if (value && value.length > 20) {
//               error = "Phone number must be less than 20 characters";
//             }
//             break;
            
//           case 'job_title':
//             if (value && value.length > 50) {
//               error = "Job title must be less than 50 characters";
//             }
//             break;
            
//           case 'company':
//             if (value && value.length > 50) {
//               error = "Company name must be less than 50 characters";
//             }
//             break;
            
//           case 'init_meeting_note':
//             if (!value.trim()) {
//               error = "Initial meeting note is required";
//             } else if (value.length > 300) {
//               error = "Initial meeting note must be less than 300 characters";
//             }
//             break;
            
//           case 'distinct_memory_note':
//             if (!value.trim()) {
//               error = "Distinctive memory note is required";
//             } else if (value.length > 300) {
//               error = "Distinctive memory note must be less than 300 characters";
//             }
//             break;
            
//           default:
//             break;
//         }
        
//         return error;
//     };
    
//     // Listen for input changes
//     const handleInputChange = (e) => {
//         const { name, value } = e.target;
//         setFormData(prevState => ({ ...prevState, [name]: value }));
        
//         // Clear current input error on type
//         if (errors[name]) {
//             setErrors(prev => ({ ...prev, [name]: null }));
//         }
//     };

//     // Listen for input errors on focus change
//     const handleInputError = (e) => {
//         const { name, value } = e.target;
//         const error = validateContactField(name, value);

//         if (error) {
//             setErrors(prev => ({ ...prev, [name]: error }));
//         }
//     };

//     // Use utility function to validate the entire contact form at once
//     const validateForm = () => {
//         const newErrors = {};
        
//         // check for form errors
//         Object.keys(formData).forEach(field => {
//           const error = validateContactField(field, formData[field]);
//           if (error) {
//             newErrors[field] = error;
//           }
//         });
        
//         setErrors(newErrors);
//         return Object.keys(newErrors).length === 0;
//     };

//     // Submit handler for both create and update
//     const handleSubmit = async (e) => {
//         e.preventDefault();
        
//         // do not process an invalid creator or edit form submission
//         if (!validateForm()) {
//             console.log('Form has errors, please correct them.');
  
//             // direct user's view to the first error
//             const firstError = document.querySelector('.error-message');
//             if (firstError) {
//                 firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
//             }
//             return;
//         } 

//         try {
//             let result;
            
//             if (isExistingContact) {
//                 // Update existing contact
//                 result = await dispatch(updateContactThunk(contactId, formData));
//             } else {
//                 // Create new contact
//                 result = await dispatch(saveContactThunk(formData));
                
//                 if (result && result.id) {
//                     // Redirect to the new contact's page
//                     navigate(`/contacts/${result.id}`, { replace: true });
//                 }
//             }
            
//             if (result) {
//                 // Success - switch to view mode
//                 setIsEditing(false);
//             } else {
//                 // Handle error
//                 setErrors(prev => ({
//                     ...prev,
//                     server: "Failed to save contact"
//                 }));
//             }
//         } catch (error) {
//             console.error("Error saving contact:", error);
//             setErrors(prev => ({
//                 ...prev,
//                 server: error.toString()
//             }));
            
//             // Scroll to errors
//             const firstError = document.querySelector('.error-message');
//             if (firstError) {
//                 firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
//             }
//         }
//     };

//     // Toggle edit mode
//     const handleEdit = () => {
//         setIsEditing(true);
//     };

//     // Cancel edit
//     const handleCancelEdit = () => {
//         if (!isExistingContact) {
//             // If creating a new contact, go back to home
//             navigate('/');
//         } else {
//             // If editing an existing contact, switch back to view mode
//             setIsEditing(false);
            
//             // Reset form data to the original contact data
//             if (currentContact) {
//                 setFormData(currentContact);
//             }
//         }
//     };
    
//     // Handle delete
//     const handleDelete = async () => {
//         if (window.confirm('Are you sure you want to delete this contact?')) {
//             try {
//                 await dispatch(deleteContactThunk(contactId));
//                 navigate('/');
//             } catch (error) {
//                 console.error("Error deleting contact:", error);
//                 setErrors(prev => ({
//                     ...prev,
//                     server: "Failed to delete contact"
//                 }));
//             }
//         }
//     };

//     // Show loading state while fetching contact
//     if (isLoading) {
//         return <div className="loading">Loading contact...</div>;
//     }

//     return (
//         <div className="contact-profile-page-container">
//             {/* Header */}
//             <div className="contact-header">
//                 <h1>{isExistingContact ? 'Contact Profile' : 'Create New Contact'}</h1>
//                 <button className="back-button" onClick={() => navigate('/')}>
//                     <ArrowLeft size={16}/>
//                     Back to Dashboard
//                 </button>
//             </div>
            
//             {/* Form */}
//             <div className="contact-form-container">
//                 <form className="contact-form">
//                     {/* Contact Information */}
//                     <div className="form-section">
//                         <h2>Contact Information</h2>
                        
//                         <div className="form-row">
//                             <div className="form-group">
//                                 <label htmlFor="first_name">First Name *</label>
//                                 <input
//                                     type="text"
//                                     id="first_name"
//                                     name="first_name"
//                                     value={formData.first_name}
//                                     onChange={handleInputChange}
//                                     onBlur={handleInputError}
//                                     maxLength={30}
//                                     required
//                                     disabled={!isEditing}
//                                 />
//                                 {errors.first_name && <div className="error-message">{errors.first_name}</div>}
//                                 <div className="char-count">{formData.first_name.length}/30</div>
//                             </div>
                            
//                             <div className="form-group">
//                                 <label htmlFor="last_name">Last Name *</label>
//                                 <input
//                                     type="text"
//                                     id="last_name"
//                                     name="last_name"
//                                     value={formData.last_name}
//                                     onChange={handleInputChange}
//                                     onBlur={handleInputError}
//                                     maxLength={30}
//                                     required
//                                     disabled={!isEditing}
//                                 />
//                                 {errors.last_name && <div className="error-message">{errors.last_name}</div>}
//                                 <div className="char-count">{formData.last_name.length}/30</div>
//                             </div>
//                         </div>

//                         <div className="form-row">
//                             <div className="form-group">
//                                 <label htmlFor="relation_type">Relationship Type *</label>
//                                 <div className="radio-group">
//                                     <label className="radio-label">
//                                         <input
//                                             type="radio"
//                                             name="relation_type"
//                                             value="mentor"
//                                             checked={formData.relation_type === 'mentor'}
//                                             onChange={handleInputChange}
//                                             required
//                                             disabled={!isEditing}
//                                         />
//                                         <span>Mentor</span>
//                                     </label>
//                                     <label className="radio-label">
//                                         <input
//                                             type="radio"
//                                             name="relation_type"
//                                             value="peer"
//                                             checked={formData.relation_type === 'peer'}
//                                             onChange={handleInputChange}
//                                             disabled={!isEditing}
//                                         />
//                                         <span>Peer</span>
//                                     </label>
//                                     <label className="radio-label">
//                                         <input
//                                             type="radio"
//                                             name="relation_type"
//                                             value="mentee"
//                                             checked={formData.relation_type === 'mentee'}
//                                             onChange={handleInputChange}
//                                             disabled={!isEditing}
//                                         />
//                                         <span>Mentee</span>
//                                     </label>
//                                     <label className="radio-label">
//                                         <input
//                                             type="radio"
//                                             name="relation_type"
//                                             value="recruiter"
//                                             checked={formData.relation_type === 'recruiter'}
//                                             onChange={handleInputChange}
//                                             disabled={!isEditing}
//                                         />
//                                         <span>Recruiter</span>
//                                     </label>
//                                 </div>
//                                 {errors.relation_type && (
//                                     <div className="error-message">{errors.relation_type}</div>
//                                 )}
//                             </div>
//                         </div>
//                     </div>

//                     {/* Contact Details */}
//                     <div className="form-section">
//                         <h2>Contact Details</h2>
//                         <div className="form-row">
//                             <div className="form-group">
//                                 <label htmlFor="city">City</label>
//                                 <input
//                                     type="text"
//                                     id="city"
//                                     name="city"
//                                     value={formData.city}
//                                     onChange={handleInputChange}
//                                     onBlur={handleInputError}
//                                     maxLength={35}
//                                     disabled={!isEditing}
//                                 />
//                                 {errors.city && <div className="error-message">{errors.city}</div>}
//                                 <div className="char-count">{formData.city.length}/35</div>
//                             </div>
                            
//                             <div className="form-group">
//                                 <label htmlFor="state">State</label>
//                                 <input
//                                     type="text"
//                                     id="state"
//                                     name="state"
//                                     value={formData.state}
//                                     onChange={handleInputChange}
//                                     onBlur={handleInputError}
//                                     maxLength={35}
//                                     disabled={!isEditing}
//                                 />
//                                 {errors.state && <div className="error-message">{errors.state}</div>}
//                                 <div className="char-count">{formData.state.length}/35</div>
//                             </div>
//                         </div>

//                         <div className="form-row">
//                             <div className="form-group">
//                                 <label htmlFor="number">Phone Number</label>
//                                 <input
//                                     type="text"
//                                     id="number"
//                                     name="number"
//                                     value={formData.number}
//                                     onChange={handleInputChange}
//                                     onBlur={handleInputError}
//                                     maxLength={20}
//                                     disabled={!isEditing}
//                                 />
//                                 {errors.number && <div className="error-message">{errors.number}</div>}
//                                 <div className="char-count">{formData.number.length}/20</div>
//                             </div>
//                         </div>

//                         <div className="form-row">
//                             <div className="form-group">
//                                 <label htmlFor="job_title">Job Title</label>
//                                 <input
//                                     type="text"
//                                     id="job_title"
//                                     name="job_title"
//                                     value={formData.job_title}
//                                     onChange={handleInputChange}
//                                     onBlur={handleInputError}
//                                     maxLength={50}
//                                     disabled={!isEditing}
//                                 />
//                                 {errors.job_title && <div className="error-message">{errors.job_title}</div>}
//                                 <div className="char-count">{formData.job_title.length}/50</div>
//                             </div>
                            
//                             <div className="form-group">
//                                 <label htmlFor="company">Company</label>
//                                 <input
//                                     type="text"
//                                     id="company"
//                                     name="company"
//                                     value={formData.company}
//                                     onChange={handleInputChange}
//                                     onBlur={handleInputError}
//                                     maxLength={50}
//                                     disabled={!isEditing}
//                                 />
//                                 {errors.company && <div className="error-message">{errors.company}</div>}
//                                 <div className="char-count">{formData.company.length}/50</div>
//                             </div>
//                         </div>
//                     </div>

//                     {/* Notes */}
//                     <div className="form-section">
//                         <h2>Contact Notes</h2>
//                         <div className="form-group full-width">
//                             <label htmlFor="init_meeting_note">Initial Meeting Note *</label>
//                             <textarea
//                                 id="init_meeting_note"
//                                 name="init_meeting_note"
//                                 value={formData.init_meeting_note}
//                                 onChange={handleInputChange}
//                                 onBlur={handleInputError}
//                                 placeholder="Describe how you met this person..."
//                                 maxLength={300}
//                                 required
//                                 disabled={!isEditing}
//                             />
//                             {errors.init_meeting_note && <div className="error-message">{errors.init_meeting_note}</div>}
//                             <div className="char-count">{formData.init_meeting_note.length}/300</div>
//                         </div>
                        
//                         <div className="form-group full-width">
//                             <label htmlFor="distinct_memory_note">Distinctive Memory Note *</label>
//                             <textarea
//                                 id="distinct_memory_note"
//                                 name="distinct_memory_note"
//                                 value={formData.distinct_memory_note}
//                                 onChange={handleInputChange}
//                                 onBlur={handleInputError}
//                                 placeholder="Note distinctive features, qualities, or associations to help you remember this person..."
//                                 maxLength={300}
//                                 required
//                                 disabled={!isEditing}
//                             />
//                             {errors.distinct_memory_note && <div className="error-message">{errors.distinct_memory_note}</div>}
//                             <div className="char-count">{formData.distinct_memory_note.length}/300</div>
//                         </div>
//                     </div>

//                     {/* Display server errors */}
//                     {errors.server && (
//                         <div className="server-error">
//                             <div className="error-message">{errors.server}</div>
//                         </div>
//                     )}

//                     {/* Form Buttons */}
//                     <div className="form-buttons">
//                         {isEditing ? (
//                             <>
//                                 <button type="button" className="cancel-button"
//                                     onClick={handleCancelEdit}
//                                 >
//                                     Cancel
//                                 </button>
//                                 <button type="submit" className="save-button"
//                                     onClick={(e) => {
//                                         e.preventDefault();
//                                         handleSubmit(e);
//                                     }}
//                                 >
//                                     {isExistingContact ? 'Save Changes' : 'Save Contact'}
//                                 </button>
//                             </>
//                         ) : (
//                             <>
//                                 <button type="button" className="edit-button"
//                                     onClick={handleEdit}
//                                 >
//                                     Edit Contact
//                                 </button>
//                                 {isExistingContact && (
//                                     <button type="button" className="delete-button"
//                                         onClick={handleDelete}
//                                     >
//                                         Delete Contact
//                                     </button>
//                                 )}
//                             </>
//                         )}
//                     </div>
//                 </form>
//             </div>
//         </div>
//     );
// }

// export default ContactProfilePage;