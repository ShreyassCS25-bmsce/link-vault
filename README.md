# LinkVault — URL Shortener & Analytics

LinkVault is a MERN stack web application that converts long URLs into short links and tracks link visits. It also supports optional link expiry, preventing expired links from redirecting to their original destinations.

## Live Demo

**Website:** https://link-vault-kmuu.onrender.com

**GitHub Repository:** https://github.com/ShreyassCS25-bmsce/link-vault

## Features

- **URL Shortening:** Generate short links from long URLs.
- **Redirection:** Redirect visitors to the original destination using a short code.
- **Click Tracking:** Track the number of visits to each short link.
- **Optional Link Expiry:** Set an expiry date and time for a link.
- **Analytics Dashboard:** View total links, total clicks, active links, and expired links.
- **URL Validation:** Validate submitted URLs before creating short links.
- **Persistent Storage:** Store link information in MongoDB Atlas.

## Tech Stack

- **Frontend:** React.js, JavaScript, HTML, CSS
- **Backend:** Node.js, Express.js
- **Database:** MongoDB Atlas
- **HTTP Client:** Axios
- **Deployment:** Render
- **Version Control:** Git and GitHub

## How It Works

1. A user enters a long URL and optionally selects an expiry date and time.
2. The React frontend sends a request to the Express backend.
3. The backend validates the URL, generates a short code, and stores the link in MongoDB.
4. When someone opens the short link, the backend checks whether it exists and has expired.
5. If the link is valid, the visitor is redirected to the original URL and the click count increases.
6. The analytics dashboard displays the stored link statistics.

## API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/shorten` | Create a short link |
| GET | `/api/analytics` | Retrieve link analytics |
| GET | `/:shortCode` | Redirect to the original URL or reject an expired link |

### Example request

`POST /api/shorten`

```json
{
  "originalUrl": "https://www.wikipedia.org/",
  "expiresAt": null
}
```

Set `expiresAt` to a valid future date-time string to create a link that expires. Use `null` for a link without an expiry.

## Run Locally

### Prerequisites

- Node.js and npm
- A MongoDB Atlas database or another MongoDB connection string
- Git

### 1. Clone the repository

```bash
git clone https://github.com/ShreyassCS25-bmsce/link-vault.git
cd link-vault
```

### 2. Configure the backend

```bash
cd backend
npm install
```

Create a `.env` file inside the `backend` folder:

```env
MONGO_URI=your_mongodb_connection_string
PORT=5000
```

Replace `your_mongodb_connection_string` with your MongoDB connection string. Never commit your real credentials to GitHub.

### 3. Start the backend

From the `backend` folder, run:

```bash
npm start
```

The backend will start on the configured port, normally `5000`.

### 4. Start the frontend

Open a second terminal from the project root:

```bash
cd frontend
npm install
npm start
```

The React development server normally opens at `http://localhost:3000`.

**Note:** The frontend currently uses the deployed backend URL in its configuration. To run the full application locally against your local backend, configure the frontend API base URL to `http://localhost:5000`.

## Security Notes

- Keep database credentials in environment variables.
- Do not commit `.env` files or other secrets.
- Configure MongoDB Atlas network access to allow only appropriate IP ranges.
- Restrict browser CORS access to trusted frontend origins.
- Validate user input before processing requests.

## Future Improvements

- Custom short codes
- Search and filtering in analytics
- Rate limiting and stronger abuse prevention
- Automated backend and frontend tests
- More detailed link analytics

## 👨‍💻 Author

Developed as a MERN stack project for the **Junior Coordinator – Technical recruitment task**.

