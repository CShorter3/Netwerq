/***** Browser console fetch requests to test contact routes*****/

/***** Utility function to extract csrf token from cookies *****/
const csrfToken = document.cookie
    .split('; ')
    .find(row => row.startsWith('csrf_token='))
    ?.split('=')[1];

/****** #1 - GET all user opportunities *****/
async function getAllOpportunities() {
    try {
        const response = await fetch('/api/opportunities/', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': csrfToken
            },
            credentials: 'include' // Ensures cookies (session data) are sent
        });
        console.log("Raw response:", response);
        const text = await response.text();
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}, Response: ${text}`);
        }
        const data = JSON.parse(text);
        console.log("All opportunities:", data);
    } catch (error) {
        console.error("Error fetching all opportunities:", error);
    }
}
getAllOpportunities();


/****** #2 - GET a specific opportunity by ID [logged in as demo] *****/
async function getOpportunityById(opportunityId) {
    try {
        const response = await fetch(`/api/opportunities/${opportunityId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },

        });
        console.log("Raw response:", response);
        const text = await response.text();
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}, Response: ${text}`);
        }
        const data = JSON.parse(text);
        console.log("Opportunity details:", data);
    } catch (error) {
        console.error("Error fetching opportunity:", error);
    }
}
getOpportunityById(21);


/***** #3 - GET all opportunities for a specific contact [logged in as demo] *****/
async function getContactOpportunities(contactId) {
    try {
        const response = await fetch(`/api/opportunities/contact/${contactId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': csrfToken
            },
            credentials: 'include'
        });
        console.log("Raw response:", response);
        const text = await response.text();
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}, Response: ${text}`);
        }
        const data = JSON.parse(text);
        console.log("Contact opportunities:", data);
    } catch (error) {
        console.error("Error fetching contact opportunities:", error);
    }
}
getContactOpportunities(1);