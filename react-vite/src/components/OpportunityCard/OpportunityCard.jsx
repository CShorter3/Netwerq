import { Calendar, Edit2 } from 'lucide-react';

function OpportunityCard(){

    return (
        <div className="opportunity-card">
            <div className="opportunity-icon"></div>
            <div className="opportunity-details">
                <div className="opportunity-header">
                <h3>Phone Call</h3>
                <span className="Active">
                    Active
                </span>
                </div>
                <p className="opportunity-description">Casual low pressure convo</p>
                <div className="opportunity-subinfo">
                <span className="opportunity-occurrence">
                    <Calendar size={14} />
                    {"Bi-montly"} • Next: {"11/07/2024"}
                </span>
                </div>
            </div>
        <div className="opportunity-actions">
            <button 
                className="edit-opportunity-button"
                //   onClick={() => onEdit(opportunity)}
                aria-label="Edit opportunity"
            >
            <Edit2 size={16} />
            </button>
        </div>
        </div>
        )

    }

export default OpportunityCard;