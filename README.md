# Wix Clone

![Wix Clone](https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEgLSlDJheZIrGbXIUZJWWrl_HDK58StzezCvI1tki4T2AzPQAYpK3T3uZussC084n-V8VeLPXVptclbDo_DPXd7gALLjZYDRRk92al37r2QUY2RVuPPNUIT0eA0tEVx2eddlHBlfe4tb3aHA4fNnCVcUhLNVay2A8Kxn4wKdGJBFSV4MiI6LQxgTNPM/s1600/webbu.JPG)

Full functional Wix clone created in React, Express and Supabase (Postgres). Has drag drop functionality, managing pages, settings along with animations, image search etc..

## Demo: https://wixclone.onrender.com/

## Features

- Drag and drop interface
- Create multi page website
- Pexels image search, so finding correct royalty free image is easy.
- Has inbuilt animation effects which can be applied anywhere
- Can create custom layouts
- Creates the user generated website preveiew to show on their dashboard.
- Nesting of elements is possible.
- Layers panel with hover effect shownn on the element
- Publishing the user website on unique link to user
- Responsive preview for the user generated pages
- Google font manager, to manage google fonts for the page at single place.
- Detailed element editing options
- Layout modification options
- SEO settings like page title, description, favicon along with the preview. `(To be implemented)`
- CSS Gradients creator for the background
- Element min height adjuster
- preview page for unpublished websites, which will only show preview to authorized user.
- Website management dashboard

## How to run

### Frontend

1. `npm install -y` to install the required dependecies.
2. Create the `.env` file in the directory with the following details.<br/>
   ` REACT_APP_GOOGLE_API_KEY="[Google font API KEY : https://developers.google.com/fonts/docs/developer_api]"`<br/>
   `REACT_APP_PEXELS_API_KEY="[Pexels API key : https://www.pexels.com/api/]"`<br/>
3. `npm run build` to create a build version of the front-end.
4. (If you want to modify the frontend you can`npm start` the frontend and `npm run dev` for the backend)

### Database (Local Supabase)

1. Install [Docker Desktop](https://www.docker.com/products/docker-desktop/) (required for local Supabase).
2. From the project root (`Wix-Clone/`), start local Supabase:
   ```bash
   supabase start
   ```
3. Migrations in `supabase/migrations/` are applied automatically on start.
4. Supabase Studio is available at http://127.0.0.1:54323

### Backend

1. Copy the build folder generated into the backend folder.
2. `cd backend/` go in the backend folder.
3. `npm install -y` to install the dependencies
4. Copy `.env.example` to `.env` and update values if needed:
   ```bash
   cp .env.example .env
   ```
   Required variables:
   - `JWT_SECRET` — random string used to sign JWT tokens
   - `PORT=8000`
   - `API_LOGIN_PERIOD="2d"`
   - `SUPABASE_URL` — `http://127.0.0.1:54321` for local Supabase
   - `SUPABASE_SERVICE_ROLE_KEY` — from `supabase status` after `supabase start`
5. `npm run dev` to run on a local machine. For deployment use `node ./src/server.js`
6. It should be available on the port 8000.

### Deploy on Vercel

1. Import the repo at [vercel.com/new](https://vercel.com/new).
2. Add these **Environment Variables** (required for API to work):
   - `JWT_SECRET`
   - `API_LOGIN_PERIOD` (e.g. `2d`)
   - `SUPABASE_URL`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `REACT_APP_GOOGLE_API_KEY` (optional)
   - `REACT_APP_PEXELS_API_KEY` (optional)
3. Deploy — `vercel.json` builds the React app and serves it with the Express API on one domain.
