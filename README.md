# Family Tree Maker

A web application for creating and visualizing family trees dynamically.

## Features
*   **Dynamic Tree Generation**: Automatically renders a hierarchical family tree from database records.
*   **Interactive Editing**: Add, edit, and delete family members directly from the tree view.
*   **Infinite Hierarchy**: Supports unlimited generations via recursive relationships.
*   **Visual Design**: Clean, rounded-box design with automatic connector lines.

## Technology Stack
*   **Backend**: Django 6.0, Django REST Framework, SQLite
*   **Frontend**: React 18, Vite, Axios
*   **Styling**: Pure CSS (Recursive Flexbox Layout)

## Project Structure
*   `backend/`: Django project containing the API and Database.
*   `frontend/`: React application handling the UI.
*   `system_design.md`: Detailed architecture and design documentation.

## Setup & Running

### Prerequisites
*   Python 3.10+
*   Node.js 18+

### 1. Backend Setup
```bash
cd backend
# Create virtual environment
python -m venv venv
# Activate virtual environment
.\venv\Scripts\activate
# Install dependencies
pip install django djangorestframework django-cors-headers
# Run migrations
python manage.py migrate
# Seed initial data (Optional)
python manage.py seed_family
# Start Server
python manage.py runserver
```
The API will be available at `http://localhost:8000/api/`.

### 2. Frontend Setup
```bash
cd frontend
# Install dependencies
npm install
# Start Development Server
npm run dev
```
Access the application at `http://localhost:5173/`.

## API Endpoints
*   `GET /api/tree/`: Returns the full nested tree structure.
*   `GET /api/people/`: List all individuals.
*   `POST /api/people/`: Create a new person.
*   `PUT /api/people/{id}/`: Update a person.
*   `DELETE /api/people/{id}/`: Delete a person (and their descendants).
