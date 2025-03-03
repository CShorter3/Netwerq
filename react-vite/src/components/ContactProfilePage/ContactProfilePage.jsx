import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import './ContactProfilePage.css';
import { saveContactThunk, getContactThunk, updateContactThunk, deleteContactThunk } from "../../redux/contact";

function ContactProfilePage({ isNewContact: routerIsNewContact }) {
    // Get route parameters and location
    const { contactId } = useParams();
    const location = useLocation();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    
    // Determine the form mode based on URL path
    const isNewContact = routerIsNewContact || contactId === 'new';
    const isEditMode = location.pathname.endsWith('/edit');
    const isViewMode = !isNewContact && !isEditMode;
    
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
    const [isLoading, setIsLoading] = useState(false);

    // Load existing contact data if we're viewing or editing an existing contact
    useEffect(() => {
        if (!isNewContact && contactId) {
            setIsLoading(true);
            
            dispatch(getContactThunk(contactId))
                .then((result) => {
                    if (result && !result.errors) {
                        setFormData({
                            first_name: result.first_name || '',
                            last_name: result.last_name || '',
                            relation_type: result.relation_type || 'peer',
                            city: result.city || '',
                            state: result.state || '',
                            number: result.number || '',
                            job_title: result.job_title || '',
                            company: result.company || '',
                            init_meeting_note: result.init_meeting_note || '',
                            distinct_memory_note: result.distinct_memory_note || ''
                        });
                        setSavedFormData({...result});
                        setSavedContactId(result.id);
                        setIsContactSaved(true);
                    } else {
                        setErrors({ server: result.errors || "Contact not found" });
                    }
                })
                .catch(err => {
                    setErrors({ server: "Error loading contact data" });
                    console.error("Error fetching contact:", err);
                })
                .finally(() => {
                    setIsLoading(false);
                });
        }
    }, [contactId, dispatch, isNewContact]);

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
        
        Object.keys(formData).forEach(field => {
          const error = validateContactField(field, formData[field]);
          if (error) {
            newErrors[field] = error;
          }
        });
        
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    /* Submit behavior depends on the form's mode */
    const handleSubmit = async (e) => {
        e.preventDefault();
        e.stopPropagation();
        
        if (!validateForm()) {
            const firstError = document.querySelector('.error-message');
            if (firstError) {
              firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
            return;
        } 

        // For editing an existing contact
        if (isEditMode && contactId) {
            const result = await dispatch(updateContactThunk(contactId, formData));

            if (!result.errors) {
                setErrors({});
                setSavedFormData({...formData});
                // Navigate to view mode after successful update
                navigate(`/contacts/${contactId}`);
            } else {
                setErrors(prev => ({
                    ...prev,
                    ...(typeof result.errors === 'object' ? result.errors : { server: result.errors })
                }));
            }
        } 
        // For creating a new contact
        else if (isNewContact) {
            const result = await dispatch(saveContactThunk(formData));
            
            if (!result.errors) {
                // Navigate to the permanent contact URL with the new ID
                navigate(`/contacts/${result.id}`);
                
                setErrors({});
                setSavedFormData({...formData});
                setIsContactSaved(true);
                setSavedContactId(result.id);
            } else {
                setErrors(prev => ({
                    ...prev,
                    ...(typeof result.errors === 'object' ? result.errors : { server: result.errors })
                }));
            }
        }
    };

    const handleEdit = () => {
        navigate(`/contacts/${contactId}/edit`);
    };

    const handleCancel = () => {
        if (isNewContact) {
            navigate('/');
        } else if (isEditMode) {
            navigate(`/contacts/${contactId}`);
        }
    };

    const handleDelete = async () => {
        if (window.confirm("Are you sure you want to delete this contact?")) {
            if (contactId) {
                const result = await dispatch(deleteContactThunk(contactId));
                if (!result.errors) {
                    navigate('/');
                } else {
                    setErrors(prev => ({
                        ...prev,
                        server: typeof result.errors === 'object' ? "Failed to delete contact" : result.errors
                    }));
                }
            } else {
                navigate('/');
            }
        }
    };
    
    // Loading state
    if (isLoading) {
        return <div className="loading">Loading contact data...</div>;
    }

    // Determine if fields should be disabled
    const fieldsDisabled = isViewMode;

    // Determine page title
    let pageTitle = "Create New Contact";
    if (isViewMode) {
        pageTitle = `${formData.first_name} ${formData.last_name}`;
    } else if (isEditMode) {
        pageTitle = `Edit ${formData.first_name} ${formData.last_name}`;
    }

    return (
        <div className="contact-profile-page-container">
            {/* Header */}
            <div className="contact-header">
                <h1>{pageTitle}</h1>
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
                            disabled={fieldsDisabled}
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
                            disabled={fieldsDisabled}
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
                                disabled={fieldsDisabled}
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
                                disabled={fieldsDisabled}
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
                                disabled={fieldsDisabled}
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
                                disabled={fieldsDisabled}
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
                            disabled={fieldsDisabled}
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
                            disabled={fieldsDisabled}
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
                            disabled={fieldsDisabled}
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
                            disabled={fieldsDisabled}
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
                            disabled={fieldsDisabled}
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
                        disabled={fieldsDisabled}
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
                        disabled={fieldsDisabled}
                    />
                    {errors.distinct_memory_note && <div className="error-message">{errors.distinct_memory_note}</div>}
                    <div className="char-count">{formData.distinct_memory_note.length}/300</div>
                    </div>
                </div>

                {/* Form Buttons - different buttons based on mode */}
                <div className="form-buttons">
                    {isViewMode ? (
                        // View mode buttons
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
                    ) : (
                        // Edit mode or New Contact mode buttons
                        <>
                            <button type="button" 
                                className="cancel-button"
                                onClick={handleCancel}
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
                                {isEditMode ? "Confirm Changes" : "Save Contact"}
                            </button>
                        </>
                    )}
                </div>
                </form>
            </div>
            
            {/* Display any server errors at the bottom of the form */}
            {errors.server && (
                <div className="server-error">
                    {errors.server}
                </div>
            )}
        </div> 
    );
}

export default ContactProfilePage;


/* INITIAL CODE */

// import { useState, useEffect } from "react";
// import { useDispatch } from "react-redux";
// import { useNavigate, useParams } from 'react-router-dom';
// import { ArrowLeft } from 'lucide-react';
// import './ContactProfilePage.css';
// import { saveContactThunk, getContactThunk, updateContactThunk, deleteContactThunk } from "../../redux/contact";


// function ContactProfilePage({ isNewContact: routerIsNewContact }) {
//     // Get route parameters to check if this is a new contact or existing contact
//     const { contactId } = useParams();
    
//     // Determine if this is a new contact form, checking both prop and URL
//     const isNewContact = routerIsNewContact || contactId === 'new';

//     /* utility support */
//     const navigate = useNavigate();
//     const dispatch = useDispatch();

//     /* React state controlled contact details */
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
    
//     /* React state controlled contact form variables */
//     const [errors, setErrors] = useState({});
//     const [isContactSaved, setIsContactSaved] = useState(false); // Start as false for new contacts
//     const [savedFormData, setSavedFormData] = useState(null);
//     const [savedContactId, setSavedContactId] = useState(null);
//     const [isEditingForm, setIsEditingForm] = useState(true); // Start in editing mode for new contacts
//     const [isInitialLoad, setIsInitialLoad] = useState(true); 
//     const [isLoading, setIsLoading] = useState(!isNewContact); // Don't show loading for new contacts

//     useEffect(() => {
//         console.log('isEditingForm changed to:', isEditingForm);
//     }, [isEditingForm]);

//     // Load existing contact data if we're viewing an existing contact
//     useEffect(() => {
//         if (!isNewContact && contactId) {
//             setIsLoading(true);
            
//             // Fetch the contact data
//             dispatch(getContactThunk(contactId))
//                 .then((result) => {
//                     if (result && !result.errors) {
//                         // Update form with the contact data
//                         setFormData({
//                             first_name: result.first_name || '',
//                             last_name: result.last_name || '',
//                             relation_type: result.relation_type || 'peer',
//                             city: result.city || '',
//                             state: result.state || '',
//                             number: result.number || '',
//                             job_title: result.job_title || '',
//                             company: result.company || '',
//                             init_meeting_note: result.init_meeting_note || '',
//                             distinct_memory_note: result.distinct_memory_note || ''
//                         });
//                         setSavedFormData({...result});
//                         setSavedContactId(result.id);
//                         setIsContactSaved(true);
//                         //setIsEditingForm(false); comment out, blocks edit mode from mainting edit status

//                         if(isInitialLoad){              // auto disable edit mode on an existing contact with params id only 
//                             setIsEditingForm(false);    // when a contact is initially created.
//                             setIsInitialLoad(false); 
//                         }

//                     } else {
//                         // Handle contact not found
//                         setErrors({ server: result.errors || "Contact not found" });
//                     }
//                 })
//                 .catch(err => {
//                     setErrors({ server: "Error loading contact data" });
//                     console.error("Error fetching contact:", err);
//                 })
//                 .finally(() => {
//                     setIsLoading(false);
//                 });
//         }
//     }, [contactId, dispatch, isNewContact, isInitialLoad]);

//     /* Validate field input utility function */
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

//         if(error) {
//             setErrors(prev => ({ ...prev, [name]: error }));
//         }
//     }

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

//     /* Submit behavior depends on the state of it's contact form's react state variables */
//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         e.stopPropagation();                       // stop input as error
        
//         // form prevents invalid contact edits and creations
//         if (!validateForm()) {
//             console.log('Form has errors, please correct them.');
  
//             // form directs the client's view towards the first input error 
//             const firstError = document.querySelector('.error-message');
//             if (firstError) {
//               firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
//             }
//             return;
//         } 

//         // form can edit a registered contact
//         if (isContactSaved && savedContactId) {
//             const result = await dispatch(updateContactThunk(savedContactId, formData));

//             if (!result.errors) {
//                 setErrors({});                      // stop input as error: when validation passes, reset errors
//                 setSavedFormData({...formData});
//                 setIsEditingForm(false);
//             } else {
//                 // Handle errors
//                 setErrors(prev => ({
//                     ...prev,
//                     ...(typeof result.errors === 'object' ? result.errors : { server: result.errors })
//                 }));
//             }
//         } 
//         // form can register a new contact
//         else {
//             // form used Redux to send contact details to the backend api server
//             const result = await dispatch(saveContactThunk(formData));
//             console.log("check the value of response retuned from save contact: ", result);
            
//             if (!result.errors) {
//                 // Navigate to the permanent contact URL with the new ID
//                 navigate(`/contacts/${result.id}`, { replace: true });
                
//                 setErrors({});                  // stop input as error: when validation passes, reset errors
//                 setSavedFormData({...formData});
//                 setIsContactSaved(true);
//                 setIsEditingForm(false);
//                 setSavedContactId(result.id);
//             } else {
//                 // Handle errors
//                 setErrors(prev => ({
//                     ...prev,
//                     ...(typeof result.errors === 'object' ? result.errors : { server: result.errors })
//                 }));
//             }
//         }
//     };

//     const handleEdit = () => {
//         setIsEditingForm(true);
//         if(savedFormData){
//             setFormData(savedFormData); // restore previous saved data
//         } else {
//             console.warn("No savedFormData found, unable to restore.");
//         }
//     };

//     const handleDelete = async () => {
//         if (window.confirm("Are you sure you want to delete this contact?")) {
//             if (savedContactId) {
//                 const result = await dispatch(deleteContactThunk(savedContactId));
//                 if (!result.errors) {
//                     navigate('/');
//                 } else {
//                     setErrors(prev => ({
//                         ...prev,
//                         server: typeof result.errors === 'object' ? "Failed to delete contact" : result.errors
//                     }));
//                 }
//             } else {
//                 navigate('/');
//             }
//         }
//     };

//     useEffect(() => {
//         if (isEditingForm && savedFormData) {
//             setFormData(savedFormData);
//         }
//     }, [isEditingForm, savedFormData]);
    
//     // Only show loading if we're fetching an existing contact
//     if (isLoading && !isNewContact) {
//         return <div className="loading">Loading contact data...</div>;
//     }


//     return (
//         <div className="contact-profile-page-container">
//             {/* Header */}
//             <div className="contact-header">
//                 <h1>{isNewContact ? "Create New Contact" : `${formData.first_name} ${formData.last_name}`}</h1>
//                 <button className="back-button" onClick={() => navigate('/')}>
//                     <ArrowLeft size={16}/>
//                     Back to Dashboard
//                 </button>
//             </div>
            
//             {/* Form */}
//             <div className="contact-form-container">
//                 <form className="contact-form">
//                 {/* Contact Information */}
//                 <div className="form-section">
//                     <h2>Contact Information</h2>
                    
//                     <div className="form-row">
//                     <div className="form-group">
//                         <label htmlFor="first_name">First Name *</label>
//                         <input
//                             type="text"
//                             id="first_name"
//                             name="first_name"
//                             value={formData.first_name}
//                             onChange={handleInputChange}
//                             onBlur={handleInputError}
//                             maxLength={30}
//                             required
//                             disabled={isContactSaved && !isEditingForm}
//                         />
//                         {errors.first_name && <div className="error-message">{errors.first_name}</div>}
//                         <div className="char-count">{formData.first_name.length}/30</div>
//                     </div>
                    
//                     <div className="form-group">
//                         <label htmlFor="last_name">Last Name *</label>
//                         <input
//                             type="text"
//                             id="last_name"
//                             name="last_name"
//                             value={formData.last_name}
//                             onChange={handleInputChange}
//                             onBlur={handleInputError}
//                             maxLength={30}
//                             required
//                             disabled={isContactSaved && !isEditingForm}
//                         />
//                         {errors.last_name && <div className="error-message">{errors.last_name}</div>}
//                         <div className="char-count">{formData.last_name.length}/30</div>
//                     </div>
//                     </div>

//                     <div className="form-row">
//                     <div className="form-group">
//                         <label htmlFor="relation_type">Relationship Type *</label>
//                         <div className="radio-group">
//                         <label className="radio-label">
//                             <input
//                                 type="radio"
//                                 name="relation_type"
//                                 value="mentor"
//                                 checked={formData.relation_type === 'mentor'}
//                                 onChange={handleInputChange}
//                                 required
//                                 disabled={isContactSaved && !isEditingForm}
//                             />
//                             <span>Mentor</span>
//                         </label>
//                         <label className="radio-label">
//                             <input
//                                 type="radio"
//                                 name="relation_type"
//                                 value="peer"
//                                 checked={formData.relation_type === 'peer'}
//                                 onChange={handleInputChange}
//                                 disabled={isContactSaved && !isEditingForm}
//                             />
//                             <span>Peer</span>
//                         </label>
//                         <label className="radio-label">
//                             <input
//                                 type="radio"
//                                 name="relation_type"
//                                 value="mentee"
//                                 checked={formData.relation_type === 'mentee'}
//                                 onChange={handleInputChange}
//                                 disabled={isContactSaved && !isEditingForm}
//                             />
//                             <span>Mentee</span>
//                         </label>
//                         <label className="radio-label">
//                             <input
//                                 type="radio"
//                                 name="relation_type"
//                                 value="recruiter"
//                                 checked={formData.relation_type === 'recruiter'}
//                                 onChange={handleInputChange}
//                                 disabled={isContactSaved && !isEditingForm}
//                             />
//                             <span>Recruiter</span>
//                         </label>
//                     </div>
//                     {errors.relation_type && (
//                         <div className="error-message">{errors.relation_type}</div>
//                     )}
//                     </div>
//                     </div>
//                 </div>

//                 {/* Contact Details */}
//                 <div className="form-section">
//                     <h2>Contact Details</h2>
//                     <div className="form-row">
//                     <div className="form-group">
//                         <label htmlFor="city">City</label>
//                         <input
//                             type="text"
//                             id="city"
//                             name="city"
//                             value={formData.city}
//                             onChange={handleInputChange}
//                             onBlur={handleInputError}
//                             maxLength={35}
//                             disabled={isContactSaved && !isEditingForm}
//                         />
//                         {errors.city && <div className="error-message">{errors.city}</div>}
//                         <div className="char-count">{formData.city.length}/35</div>
//                     </div>
                    
//                     <div className="form-group">
//                         <label htmlFor="state">State</label>
//                         <input
//                             type="text"
//                             id="state"
//                             name="state"
//                             value={formData.state}
//                             onChange={handleInputChange}
//                             onBlur={handleInputError}
//                             maxLength={35}
//                             disabled={isContactSaved && !isEditingForm}
//                         />
//                         {errors.state && <div className="error-message">{errors.state}</div>}
//                         <div className="char-count">{formData.state.length}/35</div>
//                     </div>
//                     </div>

//                     <div className="form-row">
//                     <div className="form-group">
//                         <label htmlFor="number">Phone Number</label>
//                         <input
//                             type="text"
//                             id="number"
//                             name="number"
//                             value={formData.number}
//                             onChange={handleInputChange}
//                             onBlur={handleInputError}
//                             maxLength={20}
//                             disabled={isContactSaved && !isEditingForm}
//                         />
//                         {errors.number && <div className="error-message">{errors.number}</div>}
//                         <div className="char-count">{formData.number.length}/20</div>
//                     </div>
//                     </div>

//                     <div className="form-row">
//                     <div className="form-group">
//                         <label htmlFor="job_title">Job Title</label>
//                         <input
//                             type="text"
//                             id="job_title"
//                             name="job_title"
//                             value={formData.job_title}
//                             onChange={handleInputChange}
//                             onBlur={handleInputError}
//                             maxLength={50}
//                             disabled={isContactSaved && !isEditingForm}
//                         />
//                         {errors.job_title && <div className="error-message">{errors.job_title}</div>}
//                         <div className="char-count">{formData.job_title.length}/50</div>
//                     </div>
                    
//                     <div className="form-group">
//                         <label htmlFor="company">Company</label>
//                         <input
//                             type="text"
//                             id="company"
//                             name="company"
//                             value={formData.company}
//                             onChange={handleInputChange}
//                             onBlur={handleInputError}
//                             maxLength={50}
//                             disabled={isContactSaved && !isEditingForm}
//                         />
//                         {errors.company && <div className="error-message">{errors.company}</div>}
//                         <div className="char-count">{formData.company.length}/50</div>
//                     </div>
//                     </div>
//                 </div>

//                 {/* Notes */}
//                 <div className="form-section">
//                     <h2>Contact Notes</h2>
//                     <div className="form-group full-width">
//                     <label htmlFor="init_meeting_note">Initial Meeting Note *</label>
//                     <textarea
//                         id="init_meeting_note"
//                         name="init_meeting_note"
//                         value={formData.init_meeting_note}
//                         onChange={handleInputChange}
//                         onBlur={handleInputError}
//                         placeholder="Describe how you met this person..."
//                         maxLength={300}
//                         required
//                         disabled={isContactSaved && !isEditingForm}
//                     />
//                     {errors.init_meeting_note && <div className="error-message">{errors.init_meeting_note}</div>}
//                     <div className="char-count">{formData.init_meeting_note.length}/300</div>
//                     </div>
                    
//                     <div className="form-group full-width">
//                     <label htmlFor="distinct_memory_note">Distinctive Memory Note *</label>
//                     <textarea
//                         id="distinct_memory_note"
//                         name="distinct_memory_note"
//                         value={formData.distinct_memory_note}
//                         onChange={handleInputChange}
//                         onBlur={handleInputError}
//                         placeholder="Note distinctive features, qualities, or associations to help you remember this person..."
//                         maxLength={300}
//                         required
//                         disabled={isContactSaved && !isEditingForm}
//                     />
//                     {errors.distinct_memory_note && <div className="error-message">{errors.distinct_memory_note}</div>}
//                     <div className="char-count">{formData.distinct_memory_note.length}/300</div>
//                     </div>
//                 </div>

//                 {/* Form Buttons */}
//                 <div className="form-buttons">
//                     {isContactSaved ? (
//                         isEditingForm ? (
//                             <>
//                                 <button type="button" 
//                                     className="cancel-button"
//                                     onClick={() => setIsEditingForm(false)}
//                                 >
//                                     Cancel
//                                 </button>
//                                 <button type="submit" 
//                                     className="save-button"
//                                     onClick={(e) => {
//                                         e.preventDefault();
//                                         handleSubmit(e);
//                                     }}
//                                 >
//                                     Confirm Changes
//                                 </button>
//                             </>
//                         ) : (
//                             <>
//                                 <button type="button" 
//                                     className="delete-button"
//                                     onClick={handleDelete}
//                                 >
//                                     Delete Contact
//                                 </button>
//                                 <button type="button" 
//                                     className="edit-button"
//                                     onClick={handleEdit}
//                                 >
//                                     Edit Contact
//                                 </button>
//                             </>
//                         )
//                     ) : (
//                         <>
//                             <button type="button" 
//                                 className="cancel-button"
//                                 onClick={() => navigate('/')}
//                             >
//                                 Cancel
//                             </button>
//                             <button type="submit" 
//                                 className="save-button"
//                                 onClick={(e) => {
//                                     e.preventDefault();
//                                     handleSubmit(e);
//                                 }}
//                             >
//                                 Save Contact
//                             </button>
//                         </>
//                     )}
//                 </div>
//                 </form>
//             </div>
            
//             {/* Display any server errors at the bottom of the form */}
//             {errors.server && (
//                 <div className="server-error">
//                     {errors.server}
//                 </div>
//             )}
//         </div> 
//     )
// }

// export default ContactProfilePage;