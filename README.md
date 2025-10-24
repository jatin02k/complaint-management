# 💼 Full-Stack Complaint Management System

This project is a comprehensive full-stack web application developed using Next.js (TypeScript), React, and Tailwind CSS for the frontend, with Mongoose/MongoDB for data persistence and Nodemailer for email notifications.

It implements a dual-role system: a User/Client interface for submitting complaints, and an Admin interface for viewing, filtering, updating, and deleting those complaints (full CRUD operations).

## 🛠️ Local Setup Instructions

Follow these steps to get the application running on your local machine.

**1. Prerequisites**

You must have the following installed:

- Node.js (LTS version recommended)

- npm or yarn

- Git

**2. Installation**

Clone the repository and install the dependencies:
```
git clone [YOUR_REPOSITORY_URL]
cd complaint-management-system
npm install
# or
yarn install
```

**3. Environment Configuration (.env.local)**

You must create a file named .env.local in the root directory of the project and define the following variables:

a. DATABASE CONFIGURATION (MongoDB Atlas)
```
# This URI is necessary to connect to your MongoDB Atlas cluster.
MONGODB_URI="mongodb+srv://<username>:<password>@cluster0.abcde.mongodb.net/complaint_db?retryWrites=true&w=majority"
```

b. EMAIL CONFIGURATION (Nodemailer via SMTP)
```
# The email address used to send notifications (e.g., your admin email)
EMAIL_USER="your.sending.email@gmail.com" 

# The App Password or SMTP password for the above account. 
# NOTE: For Gmail, this MUST be the 16-character App Password, not your regular login password.
EMAIL_PASS="YOUR_16_CHARACTER_APP_PASSWORD" 

# The recipient email address for all notifications (e.g., the Admin)
ADMIN_EMAIL="admin.recipient@example.com"
```

**4. Running the Application**

Start the development server:
```
npm run dev
# or
yarn dev
```

The application will be accessible at http://localhost:3000.

## 💻 Application Usage Guide

The application uses a ViewSwitcher (Navbar) to toggle between two distinct interfaces:

**1. User Submission View**

- Access: Click the User Submission button.

- Action: Fill out the form fields (Title, Description, Category, Priority) and click Submit Complaint.

- Result: The complaint is saved to MongoDB, and an email notification is sent to the Admin at the ADMIN_EMAIL address.

**2. Admin Management Panel**

- Access: Click the Admin Management button. This triggers a GET request to fetch the latest data.

- Data View: All submitted complaints are displayed in a responsive table.

- Interactions:

  - Filtering: Use the dropdowns at the top to filter complaints by Status or Priority (client-side filtering).

  - Update Status: Change the status using the dropdown in the Status column (executes a PATCH request, which triggers a status confirmation email).

  - Delete: Use the trash can icon in the Actions column (executes a DELETE request).

## 📸 Screenshots and Live Demo

To fulfill the visual and deployment requirements, please ensure you complete the following steps:

- Deployment: Deployed the application to Vercel.

  Live Demo Link: [PASTE LIVE VERCELL/HEROKU URL HERE]

- Screenshots:
   - ![User Form screenshot](./User_panel.png)
   - ![Admin Tabel Screenshot](./Admin_panel.png)
   - ![Mail Screenshot](./Mail.png)
