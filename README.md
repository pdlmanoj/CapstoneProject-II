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
git clone [your-repository-url]
cd [repository-name]
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

## Features in Detail

### 1. Popular Roadmaps
- Access to 8 predefined learning paths
- Structured content with main topics and subtopics
- Interactive visualization with expandable nodes

### 2. Custom Roadmap Generation
- AI-powered roadmap creation for any learning field
- Natural language processing for understanding user input
- Structured output matching predefined roadmap format

### 3. Roadmap Visualization
- Interactive node-based visualization
- Expandable/collapsible topics
- Smooth animations and transitions
- Pan and zoom capabilities

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
