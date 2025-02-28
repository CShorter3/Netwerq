/***** Browser console fetch requests to test contact routes*****/

// Get CSRF token from cookies
const csrfToken = document.cookie
    .split('; ')
    .find(row => row.startsWith('csrf_token='))
    ?.split('=')[1];

// #1 - GET all user contacts
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