/***** Browser console fetch requests to test contact routes*****/

/***** Utility function to extract csrf token from cookies *****/
const csrfToken = document.cookie
    .split('; ')
    .find(row => row.startsWith('csrf_token='))
    ?.split('=')[1];

/****** #1 - GET all user contacts *****/
async function getContacts() {
    try {
        const response = await fetch('/api/contacts/', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': csrfToken // Include CSRF token
            },
            credentials: 'include' // Ensures cookies (session data) are sent
        });

        console.log("Raw response:", response);

        const text = await response.text();

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}, Response: ${text}`);
        }

        const data = JSON.parse(text);
        console.log("Parsed JSON:", data);
    } catch (error) {
        console.error("Error:", error);
    }
}

getContacts();

/***** #2 - GET a user's contact *****/
async function getContactById(contactId) {
    try {
        const response = await fetch(`/api/contacts/${contactId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': csrfToken, 
            },
            credentials: 'include'
        });

        console.log("Raw response:", response);

        const text = await response.text();

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}, Response: ${text}`);
        }

        const data = JSON.parse(text);
        console.log("Parsed JSON:", data);
    } catch (error) {
        console.error("Error:", error);
    }
}

getContactById(4);


/***** #3 - POST a new contact *****/
async function createContact() {

    const data = {
        first_name: "John",
        last_name: "Doe",
        relation_type: "mentor",
        city: "San Francisco",
        state: "CA",
        number: "+1-555-123-4567",
        job_title: "Software Engineer",
        company: "TechCorp",
        init_meeting_note: "Met at a networking event",
        distinct_memory_note: "Loves hiking and AI research"
    };

    try {
        const response = await fetch('/api/contacts', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': csrfToken,
            },
            body: JSON.stringify(data)
        });

        const result = await response.json();
        console.log("Success:", result);
    } catch (error) {
        console.error("Error:", error);
    }
}

createContact();

