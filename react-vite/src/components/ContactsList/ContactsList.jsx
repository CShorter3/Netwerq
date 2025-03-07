// src/components/ContactsList/ContactsList.jsx

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Plus } from 'lucide-react';
import { fetchUserContactsThunk } from '../../redux/contact';
import './ContactsList.css';

// Modified to accept sessionUser as a prop
function ContactsList({ sessionUser }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  // Get contacts from Redux store
  const contacts = useSelector(state => state.contact.contacts || []);
  
  const [activeFilter, setActiveFilter] = useState('All');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Only fetch contacts if we have a valid session user
    if (sessionUser && sessionUser.id) {
      const loadContacts = async () => {
        setIsLoading(true);
        try {
          const result = await dispatch(fetchUserContactsThunk());
          if (result && result.errors) {
            // * Ensure error is always a string by handling object errors
            setError(typeof result.errors === 'object' ? 
              (result.errors.server || JSON.stringify(result.errors)) : 
              result.errors || 'Failed to load contacts');
          }
        } catch (err) {
          setError('An error occurred while loading contacts');
          console.error('Error fetching contacts:', err);
        } finally {
          setIsLoading(false);
        }
      };
      
      loadContacts();
    }
  }, [dispatch, sessionUser]);

  // Filter buttons data
  const filterButtons = [
    { name: 'All', active: activeFilter === 'All' },
    { name: 'Mentors', active: activeFilter === 'Mentors', disabled: true },
    { name: 'Mentees', active: activeFilter === 'Mentees', disabled: true },
    { name: 'Peers', active: activeFilter === 'Peers', disabled: true },
    { name: 'Recruiters', active: activeFilter === 'Recruiters', disabled: true }
  ];

  const handleFilterClick = (filterName) => {
    if (filterName !== 'All') {
      // Show coming soon tooltip for non-functional filters
      alert('feature coming soon');
      return;
    }
    setActiveFilter(filterName);
  };

  const handleContactClick = (contactId) => {
    navigate(`/contacts/${contactId}`);
  };

  const handleAddContact = () => {
    navigate('/contacts/new');
  };

  const handleSearchClick = () => {
    alert('feature coming soon');
  };

  // If no session user, show an empty or login prompt state
  if (!sessionUser) {
    return (
      <div className="contacts-panel">
        <div className="empty-state">
          <p>go log in</p>
        </div>
      </div>
    );
  }

  return (
    <div className="contacts-panel">
      <div className="contacts-panel-header">
        <h2>Your Network</h2>
      </div>

      {/* Search Bar */}
      <div className="search-container">
        <input 
          type="text" 
          placeholder="search coming soon..." 
          onClick={handleSearchClick}
          readOnly
        />
      </div>

      {/* Filter Buttons */}
      <div className="filter-buttons">
        {filterButtons.map(button => (
          <button
            key={button.name}
            className={`filter-button ${button.active ? 'active' : ''}`}
            onClick={() => handleFilterClick(button.name)}
            disabled={button.disabled}
          >
            {button.name}
          </button>
        ))}
      </div>

      {/* Contacts List */}
      <div className="contacts-list-container">
        {isLoading ? (
          <div className="loading-state">Loading contacts...</div>
        ) : error ? (
          // * Ensure error display handles objects properly
          <div className="error-state">
            {typeof error === 'object' ? JSON.stringify(error) : error}
          </div>
        ) : contacts.length === 0 ? (
          <div className="empty-state">
            <p>Network looks empty</p>
            <p>Click the + button to add your first contact.</p>
          </div>
        ) : (
          <ul className="contacts-list">
            {contacts.map(contact => (
              <li 
                key={contact.id} 
                className="contact-item"
                onClick={() => handleContactClick(contact.id)}
              >
                <div className="contact-info">
                  <h3 className="contact-name">
                    {contact.first_name} {contact.last_name}
                  </h3>
                  <p className="contact-title">
                    {contact.job_title || 'No title'}
                  </p>
                  <div className={`relation-type ${contact.relation_type.toLowerCase()}`}>
                    {contact.relation_type}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Add Contact Button */}
      <button className="add-contact-button" onClick={handleAddContact}>
        <Plus size={24} />
      </button>
    </div>
  );
}

export default ContactsList;