import { Calendar, Edit2 } from 'lucide-react';

function OpportunityCard({ opportunity, onEdit }){

    // Unitility function: Format date mm/dd/yyyy 
    function formatDate(dateString) {
        if (!dateString) return "N/A";
        const date = new Date(dateString);
        return date.toLocaleDateString();
      }

    return (
        <div className="opportunity-card">
            <div className="opportunity-icon">{opportunity.icon}</div>
            <div className="opportunity-details">
                <div className="opportunity-header">
                <h3>{opportunity.title}</h3>
                <span className={`opportunity-status status-${opportunity.status.toLowerCase()}`}>
                    {opportunity.status}
                </span>
                </div>
                <p className="opportunity-description">{opportunity.description}</p>
                <div className="opportunity-subinfo">
                <span className="opportunity-occurrence">
                    <Calendar size={14} />
                    {opportunity.occurrence} • Next: {formatDate(opportunity.next_date)}
                </span>
                </div>
            </div>
            <div className="opportunity-actions">
                <button 
                    className="edit-opportunity-button"
                    onClick={() => onEdit(opportunity)}
                    aria-label="Edit opportunity"
                >
                    <Edit2 size={16} />
                </button>
            </div>
        </div>
    );
}

export default OpportunityCard;