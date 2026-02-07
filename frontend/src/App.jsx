import { useState } from 'react'
import { getRecommendations } from './api'
import './App.css'

function App() {
  const [formData, setFormData] = useState({
    role: '',
    min_cgpa: '',
    req_skills: '',
    pref_skills: '',
    count: 10
  })
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      if (!formData.role || !formData.min_cgpa || !formData.req_skills) {
        setError('Please fill in all required fields')
        setLoading(false)
        return
      }

      const data = {
        role: formData.role,
        min_cgpa: parseFloat(formData.min_cgpa),
        req_skills: formData.req_skills.split(',').map(s => s.trim()).filter(s => s),
        pref_skills: formData.pref_skills.split(',').map(s => s.trim()).filter(s => s),
        count: parseInt(formData.count) || 10
      }
      const response = await getRecommendations(data)
      setResults(response)
    } catch (error) {
      setError('Failed to fetch recommendations. Please try again.')
      console.error('Error:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (field, value) => {
    setFormData({...formData, [field]: value})
  }

  return (
    <div className="app-container">
      <header className="header">
        <div className="header-content">
          <h1 className="app-title">Placement Recommendation System</h1>
          <p className="app-subtitle">Find the perfect candidates for your roles</p>
        </div>
      </header>

      <main className="main-content">
        <div className="form-section">
          <form onSubmit={handleSubmit} className="recommendation-form">
            <div className="form-grid">
              <div className="form-group">
                <label htmlFor="role">Job Role *</label>
                <input 
                  id="role"
                  type="text" 
                  className="form-input" 
                  placeholder="e.g., backend, frontend, fullstack"
                  value={formData.role}
                  onChange={(e) => handleInputChange('role', e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="min_cgpa">Minimum CGPA *</label>
                <input 
                  id="min_cgpa"
                  type="number" 
                  className="form-input" 
                  placeholder="e.g., 7.0"
                  value={formData.min_cgpa}
                  onChange={(e) => handleInputChange('min_cgpa', e.target.value)}
                  step="0.1"
                  min="0"
                  max="10"
                  required
                />
              </div>

              <div className="form-group full-width">
                <label htmlFor="req_skills">Required Skills * <span className="hint">(comma-separated)</span></label>
                <input 
                  id="req_skills"
                  type="text" 
                  className="form-input" 
                  placeholder="e.g., Python, JavaScript, React"
                  value={formData.req_skills}
                  onChange={(e) => handleInputChange('req_skills', e.target.value)}
                  required
                />
              </div>

              <div className="form-group full-width">
                <label htmlFor="pref_skills">Preferred Skills <span className="hint">(comma-separated)</span></label>
                <input 
                  id="pref_skills"
                  type="text" 
                  className="form-input" 
                  placeholder="e.g., Docker, AWS, TypeScript"
                  value={formData.pref_skills}
                  onChange={(e) => handleInputChange('pref_skills', e.target.value)}
                />
              </div>

              <div className="form-group">
                <label htmlFor="count">Number of Candidates</label>
                <input 
                  id="count"
                  type="number" 
                  className="form-input" 
                  placeholder="10"
                  value={formData.count}
                  onChange={(e) => handleInputChange('count', e.target.value)}
                  min="1"
                  max="50"
                />
              </div>
            </div>

            {error && <div className="error-message">{error}</div>}

            <button type="submit" className="submit-btn" disabled={loading}>
              <span>{loading ? '⏳ Searching...' : '🔍 Get Recommendations'}</span>
            </button>
          </form>
        </div>

        {results.length > 0 && (
          <div className="results-section">
            <div className="results-header">
              <h2>Recommended Candidates</h2>
              <p className="results-count">Found {results.length} candidate{results.length !== 1 ? 's' : ''}</p>
            </div>
            <div className="results-grid">
              {results.map((student, index) => (
                <div key={student.id} className="student-card">
                  <div className="card-rank">#{index + 1}</div>
                  <div className="card-content">
                    <h3 className="student-name">{student.name}</h3>
                    <div className="score-badge">
                      <span className="score-value">{(student.score * 100).toFixed(1)}%</span>
                    </div>
                    <div className="student-info">
                      <div className="info-item">
                        <span className="info-label">CGPA:</span>
                        <span className="info-value">{student.cgpa.toFixed(2)}</span>
                      </div>
                    </div>
                    <div className="skills-container">
                      <p className="skills-label">Skills:</p>
                      <div className="skills-list">
                        {student.skills.map((skill, i) => (
                          <span key={i} className="skill-tag">{skill}</span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {results.length === 0 && !loading && (
          <div className="empty-state">
            <div className="empty-icon">📋</div>
            <p>Fill out the form above to find candidate recommendations</p>
          </div>
        )}
      </main>
    </div>
  )
}

export default App