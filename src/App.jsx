import { useState } from 'react'
import axios from 'axios'
import './App.css'

const API_URL = 'http://16.171.60.162'  

function App() {
  const [videoUrl, setVideoUrl] = useState('')
  const [jobId, setJobId] = useState(null)
  const [status, setStatus] = useState(null)
  const [results, setResults] = useState(null)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    
    try {
      const response = await axios.post(`${API_URL}/process`, {
        video_url: videoUrl
      })
      
      setJobId(response.data.job_id)
      pollStatus(response.data.job_id)
    } catch (error) {
      alert('Error: ' + error.message)
      setLoading(false)
    }
  }

  const pollStatus = async (id) => {
    const interval = setInterval(async () => {
      try {
        const response = await axios.get(`${API_URL}/status/${id}`)
        setStatus(response.data)
        
        if (response.data.status === 'completed') {
          setResults(response.data.clips)
          setLoading(false)
          clearInterval(interval)
        } else if (response.data.status === 'failed') {
          alert('Processing failed: ' + response.data.error)
          setLoading(false)
          clearInterval(interval)
        }
      } catch (error) {
        console.error(error)
      }
    }, 2000)  // Poll every 2 seconds
  }

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  return (
    <div className="App">
      <h1>Videotto Clip Analyzer</h1>
      
      {!loading && !results && (
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Enter Dropbox video URL"
            value={videoUrl}
            onChange={(e) => setVideoUrl(e.target.value)}
            required
          />
          <button type="submit">Analyze Video</button>
        </form>
      )}

      {loading && status && (
        <div className="status">
          <h2>Processing Video...</h2>
          <div className="progress-bar">
            <div 
              className="progress" 
              style={{width: `${status.progress}%`}}
            />
          </div>
          <p>{status.progress}% - {status.status}</p>
        </div>
      )}

      {results && (
        <div className="results">
          <h2>Top 3 Clips</h2>
          {results.map((clip, index) => (
            <div key={index} className="clip-card">
              <h3>Clip {index + 1}</h3>
              <p className="timestamp">
                {formatTime(clip.start_time)} - {formatTime(clip.end_time)}
                <span className="duration">
                  ({Math.round(clip.end_time - clip.start_time)}s)
                </span>
              </p>
              <p className="explanation">{clip.explanation}</p>
              <p className="score">Score: {clip.score}</p>
            </div>
          ))}
          <button onClick={() => window.location.reload()}>
            Analyze Another Video
          </button>
        </div>
      )}
    </div>
  )
}

export default App