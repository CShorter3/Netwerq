import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";
import { X, Trash2, AlertTriangle } from "lucide-react";
//import "./RelationshipManagementModals.css";
import { createOpportunityThunk, updateOpportunityThunk, deleteOpportunityThunk } from "../../redux/opportunity";

function AddEditOpportunityModal({ contactId, opportunity = null, onClose, opportunities, setOpportunities }) {
  const dispatch = useDispatch();
  const { closeModal } = useModal();
  const isEditMode = !!opportunity;
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);

  // Get CSRF token from cookies
  const csrfToken = document.cookie
    .split('; ')
    .find(row => row.startsWith('csrf_token='))
    ?.split('=')[1];

  // Initialize form data to match Flask form fields
  const [formData, setFormData] = useState({
    csrf_token: csrfToken,
    title: "",
    description: "",
    occurrence: "Monthly",
    status: "Active",
    icon: "📅"
  });

  // Form validation errors - will align with Flask WTForm validation
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Preset icons for selection
  const iconOptions = ["📅", "🤝", "💬", "📊", "📚", "💼", "🧭", "☕", "🎯", "📝"];

  // Pre-populate form with opportunity data when in edit mode
  useEffect(() => {
    if (opportunity) {
      setFormData({
        csrf_token: csrfToken,
        title: opportunity.title || "",
        description: opportunity.description || "",
        occurrence: opportunity.occurrence || "Monthly",
        status: opportunity.status || "Active",
        icon: opportunity.icon || "📅"
      });
    }
  }, [opportunity, csrfToken]);

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear the error for this field when user types
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  // Select an icon
  const handleIconSelect = (icon) => {
    setFormData(prev => ({ ...prev, icon }));
  };

  // Validate the form - aligned with Flask WTForm validators
  const validateForm = () => {
    const newErrors = {};
    
    // Title validation - matches DataRequired and Length(min=1, max=50)
    if (!formData.title.trim()) {
      newErrors.title = "Title is required";
    } else if (formData.title.length > 50) {
      newErrors.title = "Title must be between 1 and 50 characters";
    }
    
    // Description validation - matches DataRequired and Length(min=1, max=80)
    if (!formData.description.trim()) {
      newErrors.description = "Description is required";
    } else if (formData.description.length > 80) {
      newErrors.description = "Description must be between 1 and 80 characters";
    }
    
    // Occurrence validation - matches DataRequired
    if (!formData.occurrence) {
      newErrors.occurrence = "Frequency is required";
    }
    
    // Icon validation - matches Length(max=10)
    if (formData.icon && formData.icon.length > 10) {
      newErrors.icon = "Icon must be less than 10 characters";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm() || isSubmitting) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      let result;
      
      if (isEditMode) {
        // Update existing opportunity
        result = await dispatch(updateOpportunityThunk(opportunity.id, formData));
        
        if (result && !result.errors) {
          // Update the opportunities list
          const updatedOpportunities = opportunities.map(opp => 
            opp.id === opportunity.id ? result : opp
          );
          setOpportunities(updatedOpportunities);
          
          // Close the modal
          handleClose(updatedOpportunities);
        } else {
          setErrors(prev => ({
            ...prev,
            ...(typeof result.errors === 'object' ? result.errors : { server: result.errors || "An error occurred" })
          }));
        }
      } else {
        // Create new opportunity
        result = await dispatch(createOpportunityThunk(contactId, formData));
        
        if (result && !result.errors) {
          // Add the new opportunity to the list
          const updatedOpportunities = [...opportunities, result];
          setOpportunities(updatedOpportunities);
          
          // Close the modal
          handleClose(updatedOpportunities);
        } else {
          setErrors(prev => ({
            ...prev,
            ...(typeof result.errors === 'object' ? result.errors : { server: result.errors || "An error occurred" })
          }));
        }
      }
    } catch (error) {
      console.error("Error saving opportunity:", error);
      setErrors(prev => ({
        ...prev,
        server: "An unexpected error occurred"
      }));
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle delete
  const handleDelete = async () => {
    if (isSubmitting || !opportunity) return;
    
    setIsSubmitting(true);
    
    try {
      const result = await dispatch(deleteOpportunityThunk(opportunity.id));
      
      if (result && !result.errors) {
        // Remove the opportunity from the list
        const updatedOpportunities = opportunities.filter(opp => opp.id !== opportunity.id);
        setOpportunities(updatedOpportunities);
        
        // Close the modal
        handleClose(updatedOpportunities);
      } else {
        setErrors(prev => ({
          ...prev,
          server: typeof result.errors === 'object' ? "Failed to delete opportunity" : result.errors
        }));
        setShowDeleteConfirmation(false);
      }
    } catch (error) {
      console.error("Error deleting opportunity:", error);
      setErrors(prev => ({
        ...prev,
        server: "An unexpected error occurred"
      }));
      setShowDeleteConfirmation(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle modal close
  const handleClose = (updatedOpportunities) => {
    if (onClose) {
      onClose(updatedOpportunities);
    } else {
      closeModal();
    }
  };

  // If showing delete confirmation, render that instead
  if (showDeleteConfirmation) {
    return (
      <div className="modal-backdrop">
        <div className="delete-confirmation-modal">
          <div className="delete-modal-header">
            <AlertTriangle size={24} color="#e53e3e" />
            <h2>Confirm Deletion</h2>
          </div>
          <div className="delete-modal-content">
            <p>Are you sure you want to delete this opportunity?</p>
            <p className="warning-text">This action cannot be undone.</p>
            
            <div className="delete-modal-actions">
              <button 
                className="cancel-button" 
                onClick={() => setShowDeleteConfirmation(false)}
                disabled={isSubmitting}
              >
                Cancel
              </button>
              <button 
                className="confirm-delete-button" 
                onClick={handleDelete}
                disabled={isSubmitting}
              >
                {isSubmitting ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="modal-backdrop">
      <div className="opportunity-modal">
        <div className="modal-header">
          <h2>{isEditMode ? "Edit Opportunity" : "Add New Opportunity"}</h2>
          <button 
            className="close-button" 
            onClick={() => handleClose()}
            disabled={isSubmitting}
          >
            <X size={20} />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="modal-content">
          {errors.server && (
            <div className="server-error">{errors.server}</div>
          )}
          
          {/* Hidden CSRF token field */}
          <input
            type="hidden"
            name="csrf_token"
            value={csrfToken || ""}
          />
          
          <div className="form-group">
            <label htmlFor="title">Title *</label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              maxLength={50}
              required
              disabled={isSubmitting}
              placeholder="Enter opportunity title"
            />
            {errors.title && <div className="error-message">{errors.title}</div>}
            <div className="char-count">{formData.title.length}/50</div>
          </div>
          
          <div className="form-group">
            <label htmlFor="description">Description *</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              maxLength={80}
              required
              disabled={isSubmitting}
              placeholder="Describe the interaction or activity"
            />
            {errors.description && <div className="error-message">{errors.description}</div>}
            <div className="char-count">{formData.description.length}/80</div>
          </div>
          
          <div className="form-group">
            <label htmlFor="occurrence">Frequency *</label>
            <select
              id="occurrence"
              name="occurrence"
              value={formData.occurrence}
              onChange={handleInputChange}
              required
              disabled={isSubmitting}
            >
              <option value="Once">Once</option>
              <option value="Weekly">Weekly</option>
              <option value="Bi-weekly">Bi-weekly</option>
              <option value="Monthly">Monthly</option>
              <option value="Quarterly">Quarterly</option>
              <option value="Bi-Annually">Bi-Annually</option>
              <option value="Annually">Annually</option>
            </select>
            {errors.occurrence && <div className="error-message">{errors.occurrence}</div>}
          </div>
          
          {isEditMode && (
            <div className="form-group">
              <label htmlFor="status">Status</label>
              <select
                id="status"
                name="status"
                value={formData.status}
                onChange={handleInputChange}
                disabled={isSubmitting}
              >
                <option value="Active">Active</option>
                <option value="Pending">Pending</option>
                <option value="Completed">Completed</option>
              </select>
              {errors.status && <div className="error-message">{errors.status}</div>}
            </div>
          )}
          
          <div className="form-group">
            <label>Icon</label>
            <div className="icon-selection">
              {iconOptions.map((icon) => (
                <button
                  key={icon}
                  type="button"
                  className={`icon-option ${formData.icon === icon ? 'selected' : ''}`}
                  onClick={() => handleIconSelect(icon)}
                  disabled={isSubmitting}
                >
                  {icon}
                </button>
              ))}
            </div>
            {errors.icon && <div className="error-message">{errors.icon}</div>}
          </div>
          
          <div className="modal-actions">
            {isEditMode && (
              <button
                type="button"
                className="delete-button"
                onClick={() => setShowDeleteConfirmation(true)}
                disabled={isSubmitting}
                aria-label="Delete opportunity"
              >
                <Trash2 size={18} />
              </button>
            )}
            <div className="primary-actions">
              <button 
                type="button" 
                className="cancel-button" 
                onClick={() => handleClose()}
                disabled={isSubmitting}
              >
                Cancel
              </button>
              <button 
                type="submit" 
                className="save-button"
                disabled={isSubmitting}
              >
                {isSubmitting ? (isEditMode ? "Saving..." : "Adding...") : (isEditMode ? "Save Changes" : "Add Opportunity")}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddEditOpportunityModal;