# Placement Recommendation System

A full-stack web application that recommends the best candidates for job roles based on skills and academic performance using machine learning algorithms.

## Features

- **Candidate Recommendation Engine**: Uses cosine similarity and skill matching to recommend candidates
- **Role-based Scoring**: Different weightings for technical skills vs CGPA based on job role
- **Resume**: Display recommended candidates with ranking, scores, and detailed info
- **Professional UI**: Modern, responsive interface with gradient design
- **CORS Enabled**: Secure communication between frontend and backend

## Tech Stack

### Backend
- **Framework**: FastAPI
- **Server**: Uvicorn
- **ML/Data**: Scikit-learn (cosine similarity)
- **Validation**: Pydantic

### Frontend
- **Framework**: React 19
- **Build Tool**: Vite
- **Styling**: CSS3 with modern design
- **HTTP Client**: Axios
- **UI**: Bootstrap 5

## Prerequisites

- Python 3.10 or higher
- Node.js 16 or higher
- npm or yarn

## Project Structure

```
placement-recommendation-system/
├── backend/
│   └── app/
│       ├── main.py           # FastAPI application
│       ├── data/
│       │   └── student.py    # Student data and vocabulary
│       └── __pycache__/
├── frontend/
│   ├── src/
│   │   ├── main.jsx
│   │   ├── App.jsx           # Main app component
│   │   ├── App.css           # Styling
│   │   ├── api.js            # API client
│   │   └── index.css         # Global styles
│   ├── package.json
│   ├── vite.config.js
│   └── index.html
├── env/                      # Python virtual environment
├── requirements.txt          # Python dependencies
└── README.md
```

## Installation

### Backend Setup

1. **Create a Python virtual environment**:
   ```bash
   python -m venv env
   ```

2. **Activate the virtual environment**:
   - On Windows:
     ```bash
     env\Scripts\activate
     ```
   - On macOS/Linux:
     ```bash
     source env/bin/activate
     ```

3. **Install Python dependencies**:
   ```bash
   pip install -r requirements.txt
   ```

### Frontend Setup

1. **Navigate to frontend directory**:
   ```bash
   cd frontend
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

## Running the Application

### Start Backend Server

1. **Activate virtual environment** (if not already activated):
   ```bash
   env\Scripts\activate
   ```

2. **Navigate to backend directory**:
   ```bash
   cd backend
   ```

3. **Run the FastAPI server**:
   ```bash
   python -m uvicorn app.main:app --reload --port 8000
   ```
   The backend will be available at `http://localhost:8000`
   API documentation: `http://localhost:8000/docs`

### Start Frontend Development Server

1. **Open a new terminal and navigate to frontend directory**:
   ```bash
   cd frontend
   ```

2. **Start the development server**:
   ```bash
   npm run dev
   ```
   The frontend will be available at `http://localhost:5173`

## API Endpoints

### GET `/`
Health check endpoint
- **Response**: `{"status": "online"}`

### POST `/recommend`
Get placement recommendations for a given job role

**Request Body**:
```json
{
  "role": "backend",
  "req_skills": ["Python", "FastAPI", "SQL"],
  "pref_skills": ["Docker", "AWS"],
  "min_cgpa": 7.5,
  "count": 10
}
```

**Response**:
```json
[
  {
    "id": 1,
    "name": "Student Name",
    "cgpa": 8.5,
    "skills": ["Python", "FastAPI", "SQL", "Docker"],
    "score": 0.85
  }
]
```

## Scoring Algorithm

The recommendation engine uses a weighted scoring system:

1. **Skill Score** (70% weight):
   - Cosine Similarity (70%): Vector similarity between required skills and student skills
   - Logic-based Matching (30%): Ratio-based matching for required and preferred skills

2. **CGPA Score** (30% weight):
   - Normalized to 0-1 scale: `cgpa / 10`

3. **Role-based Adjustment**:
   - **Backend**: Skills 60%, CGPA 40%
   - **Frontend**: Skills 50%, CGPA 50%
   - **Fullstack**: Skills 70%, CGPA 30%
   - **Data Science**: Skills 80%, CGPA 20%
   - **DevOps**: Skills 60%, CGPA 40%

## Building for Production

### Frontend Build
```bash
cd frontend
npm run build
```
The optimized build will be in `frontend/dist/`

## Features in Detail

### Recommendation Form
- **Role**: Job position (backend, frontend, fullstack, data_science, devops)
- **Min CGPA**: Minimum academic requirement (0-10)
- **Required Skills**: Skills candidates must have (comma-separated)
- **Preferred Skills**: Nice-to-have skills (comma-separated)
- **Count**: Number of candidates to return (1-50)

### Results Display
- **Ranking**: Candidates ranked by score
- **Score**: Matching percentage (0-100%)
- **CGPA**: Student's academic performance
- **Skills**: Matched and relevant skills display

## Troubleshooting

**CORS Error**: Ensure the backend is running on port 8000 and frontend on port 5173

**No recommendations returned**: Lower the min_cgpa or ensure required skills are in the skill vocabulary

**Backend connection failed**: Check that:
- Backend server is running (`python -m uvicorn app.main:app --reload --port 8000`)
- Frontend is connecting to `http://localhost:8000`
- Ports 8000 and 5173 are available

## Future Enhancements

- Database integration for persistent student records
- User authentication and authorization
- Advanced filtering options
- Analytics dashboard
- Bulk candidate import
- Export recommendations as PDF/CSV

## Contact

For issues and feature requests, please create an issue in the repository.
