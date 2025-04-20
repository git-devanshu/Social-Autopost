# AutoPost - Social Media Content Scheduler

AutoPost is a powerful full-stack web application that allows users to seamlessly connect and publish posts across multiple social media platforms, including **Facebook**, **Instagram**, **LinkedIn**, and **X (Twitter)**. It helps individuals, marketers, and businesses save time by managing all their social content in one place.

---

## Features

- **Multi-Platform Integration**  
  Connect your social accounts using OAuth and manage all your channels in one dashboard.

- **Unified Post Composer**  
  Write once, post everywhere! Supports text, images, and video posts (platform-specific support).

- **Instant Posting**  
  Post in real-time to Facebook Pages, Instagram Business Accounts, LinkedIn Profiles, and Twitter (X).

- **Posting History**
  Users can check history of posts made using AutoPost in the History tab.

- **Posting Summary Table**  
  Clear and concise tables displaying what kind of media and caption lengths are supported on each platform.

- **Usage Tables for Users**  
  API rate limits, file size limits, and caption length constraints shown transparently.

- **Issue Reporting Panel**  
  Users can report bugs or request features directly from the Help & Support.

---

## Tech Stack

- **Frontend**: React.js, Chakra UI
- **Backend**: Node.js, Express.js
- **Database**: MongoDB Atlas
- **Deployment**: Render (Frontend), Render (Backend)

---

## Deployed Project Link

🔗 **Live Demo:** [View the deployed project here]()

---

## Prerequisites

Before you begin, ensure you have met the following requirements:
- Node.js (v20 or higher)
- npm (v8 or higher)
- MongoDB Atlas account (or local MongoDB instance)
- Cloudinary account
- LinkedIn Developer App credentials
- Twitter Developer App credentials
- Use the in-app guide for Facebook and Instagram Developer App credentails

---

## ⚙️ Installation & Setup

1. Clone the Repository
```bash
git clone https://github.com/git-devanshu/Social-Autopost.git
```

2. Create two terminals inside the root directory

3. switch to frontend on one terminal and install dependencies (one time only)
```bash
cd frontend
npm install
```

4. switch to backend on other terminal and install dependencies (one time only)
```bash
cd backend
npm install
```

5. Add .env file in the backend with following variables
```bash
PORT=5000
MONGO_URI=<your mongo db connection string>
JWT_SECRET=<random string for signing tokens>
AES_SECRET=<32 characters random string for encryption>
CLIENT_URL=<add the URL on which your frontend is running, here 'http://localhost:5173'>
USER=<your email id for sending emails>
PASS=<app password of the same email id (not the actual password)>
LINKEDIN_CLIENT_ID=<client id of your linkedin developer app>
LINKEDIN_CLIENT_SECRET=<client secret of your linkedin developer app>
TWITTER_CONSUMER_KEY=<consumer key/api key of your twitter developer app>
TWITTER_CONSUMER_SECRET=<consumer secret/api secret of your twitter developer app>
CLOUDINARY_CLOUD_NAME=<cloud name of your cloudinary database>
CLOUDINARY_API_KEY=<API key of your cloudinary database>
CLOUDINARY_API_SECRET=<API secret of your cloudinary database>
```

6. Change the getBaseURL() function in the /src/utils/helperFunctions.js file: set the base URL to 'http://localhost:5000' for local testing.

7. Add a .env file in the frontend with the following variables
```bash
VITE_LINKEDIN_CLIENT_ID=<client id of your linkedin developer app>
VITE_CLOUDINARY_NAME=<name given by you to your cloudinary cloud>
VITE_CLOUDINARY_CLOUD_NAME=<cloud name of your cloudinary database>
```

8. Run the backend
```bash
cd backend
npm start
```

9. Run the frontend
```bash
cd frontend
npm run dev
```