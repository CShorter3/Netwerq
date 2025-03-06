import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { PlusCircle } from "lucide-react";
import "./RelationshipManagementComponent.css";
import OpportunityCard from "../OpportunityCard";
import AddEditOpportunityModal from "../OpportunityCard/AddEditOpportunityModal";
import { fetchOpportunitiesThunk } from "../../redux/opportunity";

// A Opportunity plan component renders in a Profile Contact Page, on contact creation 
function OpportunityPlan({ contactId, relationshipType }) {
  const dispatch = useDispatch();
  const [opportunities, setOpportunities] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [editingOpportunity, setEditingOpportunity] = useState(null);

  // Fetch opportunities when component mounts or contactId changes
  useEffect(() => {
    if (!contactId) return;
    setIsLoading(true);
    dispatch(fetchOpportunitiesThunk(contactId))
      .then(result => {
        if (result && !result.errors) {
          setOpportunities(result.opportunities || []);
        } else {
          setError(result?.errors || "Failed to load opportunities");
        }
      })
      .catch(err => {
        setError("An error occurred while loading opportunities");
        console.error("Error fetching opportunities:", err);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [contactId, dispatch]);

  // Handle adding a new opportunity
  const handleAddOpportunity = () => {
    setEditingOpportunity(null); // Ensure we're not in edit mode
    setShowModal(true);
  };

  // Handle editing an existing opportunity
  const handleEditOpportunity = (opportunity) => {
    setEditingOpportunity(opportunity);
    setShowModal(true);
  };

  // Close the modal and refresh opportunities if needed
  const handleCloseModal = (updatedOpportunities) => {
    setShowModal(false);
    setEditingOpportunity(null);
    
    // If we received updated opportunities, update our state
    if (updatedOpportunities) {
      setOpportunities(updatedOpportunities);
    }
  };

  if (isLoading) {
    return <div className="relationship-management-loading">Loading opportunities...</div>;
  }

  if (error) {
    return <div className="relationship-management-error">Error: {error}</div>;
  }

  return (
    <div className="relationship-management-container">
      <div className="relationship-header">
        <h2>Relationship Opportunities</h2>
        <button 
          className="add-opportunity-button"
          onClick={handleAddOpportunity}
        >
          <PlusCircle size={16} />
          New Opportunity
        </button>
      </div>
      {/* Opportunities list */}
      <div className="opportunities-list">
        {opportunities.length === 0 ? (
          <div className="no-opportunities">
            No opportunities found. Add your first opportunity!
          </div>
        ) : (
          opportunities.map((opportunity) => (
            <OpportunityCard
              key={opportunity.id}
              opportunity={opportunity}
              onEdit={handleEditOpportunity}
            />
          ))
        )}
      </div>
      {/* Modal for adding/editing opportunities */}
      {showModal && (
        <AddEditOpportunityModal
          contactId={contactId}
          opportunity={editingOpportunity}
          onClose={handleCloseModal}
          opportunities={opportunities}
          setOpportunities={setOpportunities}
        />
      )}
    </div>
  );
}

export default OpportunityPlan;