# Netwerq MPV

MVP Implements the Connections and Opportunities Features Only

Schema: [Netwerq Database Schema](https://dbdiagram.io/d/Netwerq-67b8c162263d6cf9a007a6ba)

Wireframes: 
![IMG_4050](https://github.com/user-attachments/assets/a40a23e2-1eb2-4481-b19f-466613569097?size=100)


## MVP Feature List
- A0 - Dashboard (R)
- A1 - **Connections (CRUD)**
- A2 - **Preset Opportunities (CRUD)**
- A2 - Custom Opportunities (CRUD)  
- A3 - Notifications (RUD)  
- A4 - GPS Notifications (RUD)  

## Extended Future Features
- B0 - Engagement Logs (History)
- B1 - Historical Data Analysis Insights
- B2 - Historical Text Analysis Insights
- B3 - Search
- C2 - Contact Profiles
- C3 - Questions
- C1 - Engagement Outreach Templates
- D0 - Calendar View
- D1 - Garden (Activity Heatmap)
- D2 - Points
- D3 - News

## Feature Descriptions & Routes
### Connections (Users can SEED and manage their network)
- Create: `POST api/connections/:id`
- Read: `GET api/connections`
- Update: `PUT api/connections/:id`
- Delete: `DELETE api/connections/:id`

### Opportunities (Users manage action plans to MAINTAIN their network)
- Create: `POST api/opportunities/:id`
- Read: `GET api/opportunities`
- Update: `PUT api/opportunities/:id`
- Delete: `DELETE api/opportunities/:id`

### Notifications (Users receive reminders and notifications to NURTURE their network)
- Create: `-`
- Read: `-`
- Update: `-`
- Delete: `-`

### Interaction Logs (Users DOCUMENT interactions with their network)
- Create: `-`
- Read: `-`
- Update: `-`
- Delete: `-`

### Questions (Users set next questions, PROMPTED to answer during documentation of the next interaction with a contact)
- Create: `-`
- Read: `-`
- Update: `-`
- Delete: `-`

### Historical Text Analysis (Users gain insights from sentiment analysis)
- Create: `-`
- Read: `-`
- Update: `-`
- Delete: `-`

### Historical Data Analysis (Users gain insights from aggregate networking data)
- Create: `-`
- Read: `-`
- Update: `-`
- Delete: `-`

## User Stories

### Signup
A user can register at `api/signup`:
- A registered but unauthorized user can click a login link to navigate to the login page.
- An unregistered and unauthorized user can enter their first name, last name, username, city, state, and password to register.

### Login
A user can sign in at `api/login`:
- A registered but unauthorized user can enter their email and password to log in.
- An unregistered and unauthorized user can click a signup link to navigate to the signup page.
- An authorized user is redirected to their session's homepage.

### Homepage (Future Dashboard)
A registered and authorized user can access the homepage at `api/current`:
- A user can click a button resembling a seed or seeding action to add a new contact.
- Clicking the button redirects the user to the Contact Page at `api/connections/:id/`.

### Contact Page
A registered and authorized user can access the Contact Page at `api/connections/:id/`:

### Create Contact Form

##### Before Submission:
- A user can input and edit a new contact’s details:
  - First name, Last name, Email, City, State, Title, Company, Initial meeting description, Distinctive memory key
- A user can click a Cancel button to void the contact creation and return home.

##### After Form Validation & Submission (Contact Details):
- The contact is registered.
- The form becomes read-only (no further edits allowed).
- The Cancel button disappears.
- A Delete Contact button appears, allowing the user to delete the contact and related data, redirecting them home.

##### After Form Validation & Submission (Contact Management):
- A preset contact management plan appears, represented as a list or map, showing recommended opportunities for interacting with the contact.
- A user can add a custom opportunity to the contact's plan:
  - Clicking "Add Opportunity" opens a modal with a Create New Opportunity form.
  - The user can input a description and select an occurrence.
- A user can view, edit, and delete any opportunity in their relationship management plan.
