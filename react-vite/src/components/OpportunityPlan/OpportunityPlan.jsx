

// first just test data output
function OpportunityPlan({contactId, relationshipType}) {
    console.log("in opportunity plan")
    return(
        <>
            <h1> here i am, the opportunies plan </h1>
            <h4> {contactId}, {relationshipType} </h4>
        </>
    )

}

export default OpportunityPlan;