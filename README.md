\# Parcel Tracking System



A simple full-stack web application where users can book parcels and track their delivery status.  

Includes an admin panel to manage parcels.



---



\## Tech Stack



Frontend:

\- HTML

\- CSS

\- JavaScript



Backend:

\- Node.js

\- Express.js



Database:

\- MongoDB



---



\## Project Structure



parcel-tracking-system/



backend/

\- server.js

\- models/

\- package.json



frontend/

\- index.html

\- booking.html

\- admin.html

\- auth.html

\- style.css



---



\## Setup Instructions



\### 1. Clone the Repository



git clone https://github.com/AnkurSandilya/parcel-tracking-system.git



cd parcel-tracking-system



---



\### 2. Install Backend Dependencies



cd backend



npm install



---



\### 3. Setup MongoDB Connection



Create a file inside the \*\*backend folder\*\* called:



.env



Add your MongoDB connection string:



MONGO\_URI=your\_mongodb\_connection\_string



Example:



MONGO\_URI=mongodb+srv://username:password@cluster.mongodb.net/parcelDB



---



\### 4. Start the Backend Server



node server.js



Server will run on:



http://localhost:5000



---



\### 5. Run the Frontend



Go to the \*\*frontend folder\*\* and open:



index.html



in your browser.



---



\## Important Notes



\- Each developer should use their \*\*own MongoDB connection string\*\*.

\- Do NOT upload `.env` file to GitHub.

\- `.gitignore` already prevents this.



---



\## Features



\- User authentication

\- Parcel booking

\- Parcel tracking

\- Admin dashboard

