
function OpportunityCardModal() {
  

  return (
    <div className="modal-backdrop">
      <div className="opportunity-modal">
        <div className="modal-header">
          <h2>Edit Opportunity</h2>
          <button className="close-button">
            <X size={20} />
          </button>
        </div>
        <form className="modal-content">
          <input name="title" value="Phone Call" />
          <textarea name="description" value="Low pressure phone call" />
          <select name="occurrence" value="Bi-Monthly" >

          </select>
          <button type="submit">Save</button>
        </form>
      </div>
    </div>
  );
}

export default OpportunityCardModal;


