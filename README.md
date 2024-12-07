# BrightPath AI - Learning Roadmap Platform

An intelligent learning roadmap platform that helps users create and visualize personalized learning paths for various tech domains.

## Features

- React + Vite for fast and efficient frontend development
- Python backend
- Tailwind CSS for styling
- React Router for navigation
- Clerk for authentication
- React Icons
- React Markdown with GFM support

### Backend
- Django 4.2.9
- Django REST Framework
- Django CORS Headers
- Google Generative AI
- PyTorch
- Transformers

## Prerequisites

- Node.js (v18 or higher)
- Python (v3.9 or higher)
- npm or yarn

## Installation

1. Clone the repository:
```bash
git clone https://github.com/pdlmanoj/CapstoneProject-II.git
cd CapstoneProject-II
```

2. Install frontend dependencies:
```bash
npm install
```

3. Set up Python virtual environment and install backend dependencies:
```bash
python3 -m venv venv
source venv/bin/activate  # On Windows use: venv\Scripts\activate
pip3 install -r requirements.txt
```

4. Set up environment variables:
Create a `.env` file in the root directory and add:
```env
VITE_CLERK_PUBLISHABLE_KEY=your_clerk_key
GOOGLE_API_KEY=your_google_ai_api_key
```

## Development

1. Start the frontend development server:
```bash
npm run dev
```

2. Start the Django backend server:
```bash
# From the backend directory
python3 manage.py runserver
```

## Project Structure

```
├── src/                 # React frontend source
│   ├── components/      # React components
│   ├── pages/          # Page components
│   └── App.jsx         # Main app component
├── backend/            # Django backend
│   ├── roadmap/        # Roadmap app
│   └── backend/        # Django project settings
├── dataset.json        # Predefined roadmap data
├── public/             # Static assets
└── model/             # AI model related files
```