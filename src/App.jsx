// import { useState } from 'react'
// import axios from 'axios'
// import './App.css'

// const API_URL = 'https://815rl57zqf.execute-api.eu-north-1.amazonaws.com'  


// function App() {
//   const [videoUrl, setVideoUrl] = useState('')
//   const [jobId, setJobId] = useState(null)
//   const [status, setStatus] = useState(null)
//   const [results, setResults] = useState(null)
//   const [loading, setLoading] = useState(false)

//   const handleSubmit = async (e) => {
//     e.preventDefault()
//     setLoading(true)
    
//     try {
//       const response = await axios.post(`${API_URL}/process`, {
//         video_url: videoUrl
//       })
      
//       setJobId(response.data.job_id)
//       pollStatus(response.data.job_id)
//     } catch (error) {
//       alert('Error: ' + error.message)
//       setLoading(false)
//     }
//   }

//   const pollStatus = async (id) => {
//     const interval = setInterval(async () => {
//       try {
//         const response = await axios.get(`${API_URL}/status/${id}`)
//         setStatus(response.data)
        
//         if (response.data.status === 'completed') {
//           setResults(response.data.clips)
//           setLoading(false)
//           clearInterval(interval)
//         } else if (response.data.status === 'failed') {
//           alert('Processing failed: ' + response.data.error)
//           setLoading(false)
//           clearInterval(interval)
//         }
//       } catch (error) {
//         console.error(error)
//       }
//     }, 2000)  // Poll every 2 seconds
//   }

//   const formatTime = (seconds) => {
//     const mins = Math.floor(seconds / 60)
//     const secs = Math.floor(seconds % 60)
//     return `${mins}:${secs.toString().padStart(2, '0')}`
//   }

//   return (
//     <div className="App">
//       <h1>Videotto Clip Analyzer</h1>
      
//       {!loading && !results && (
//         <form onSubmit={handleSubmit}>
//           <input
//             type="text"
//             placeholder="Enter Dropbox video URL"
//             value={videoUrl}
//             onChange={(e) => setVideoUrl(e.target.value)}
//             required
//           />
//           <button type="submit">Analyze Video</button>
//         </form>
//       )}

//       {loading && status && (
//         <div className="status">
//           <h2>Processing Video...</h2>
//           <div className="progress-bar">
//             <div 
//               className="progress" 
//               style={{width: `${status.progress}%`}}
//             />
//           </div>
//           <p>{status.progress}% - {status.status}</p>
//         </div>
//       )}

//       {results && (
//         <div className="results">
//           <h2>Top 3 Clips</h2>
//           {results.map((clip, index) => (
//             <div key={index} className="clip-card">
//               <h3>Clip {index + 1}</h3>
//               <p className="timestamp">
//                 {formatTime(clip.start_time)} - {formatTime(clip.end_time)}
//                 <span className="duration">
//                   ({Math.round(clip.end_time - clip.start_time)}s)
//                 </span>
//               </p>
//               <p className="explanation">{clip.explanation}</p>
//               <p className="score">Score: {clip.score}</p>
//             </div>
//           ))}
//           <button onClick={() => window.location.reload()}>
//             Analyze Another Video
//           </button>
//         </div>
//       )}
//     </div>
//   )
// }

// export default App
import { useState } from 'react'
import axios from 'axios'
import './App.css'

const API_URL = 'https://815rl57zqf.execute-api.eu-north-1.amazonaws.com'

function App() {
  const [videoUrl, setVideoUrl] = useState('')
  const [jobId, setJobId] = useState(null)
  const [status, setStatus] = useState(null)
  const [results, setResults] = useState(null)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setResults(null)
    
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
    }, 2000)
  }

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const detectUrlType = (url) => {
    if (url.includes('youtube.com') || url.includes('youtu.be')) {
      return '🎥 YouTube'
    } else if (url.includes('dropbox.com')) {
      return '📦 Dropbox'
    } else {
      return '🌐 Direct URL'
    }
  }

  return (
    <div className="App">
      <div className="header">
        <h1>🎬 Videotto</h1>
        <p className="subtitle">AI-Powered Video Clip Analyzer</p>
        <p className="description">
          Extract the most engaging moments from your videos using advanced AI analysis
        </p>
      </div>
      
      {!loading && !results && (
        <div className="input-section">
          <form onSubmit={handleSubmit}>
            <div className="input-wrapper">
              <input
                type="text"
                placeholder="Paste YouTube, Dropbox, or direct video URL..."
                value={videoUrl}
                onChange={(e) => setVideoUrl(e.target.value)}
                required
              />
              {videoUrl && (
                <span className="url-type-badge">
                  {detectUrlType(videoUrl)}
                </span>
              )}
            </div>
            <button type="submit" className="analyze-btn">
              <span>🚀 Analyze Video</span>
            </button>
          </form>
          
          <div className="supported-platforms">
            <h3>✨ Supported Platforms</h3>
            <div className="platform-badges">
              <span className="badge youtube">🎥 YouTube</span>
              <span className="badge dropbox">📦 Dropbox</span>
              <span className="badge direct">🌐 Direct MP4</span>
            </div>
          </div>

          <div className="features">
            <div className="feature">
              <span className="icon">🎯</span>
              <h4>Smart Detection</h4>
              <p>Analyzes audio energy, motion, and scene changes</p>
            </div>
            <div className="feature">
              <span className="icon">⚡</span>
              <h4>Fast Processing</h4>
              <p>Optimized algorithms for quick results</p>
            </div>
            <div className="feature">
              <span className="icon">🎬</span>
              <h4>Top 3 Clips</h4>
              <p>Get the most engaging 15-30 second segments</p>
            </div>
          </div>
        </div>
      )}

      {loading && status && (
        <div className="status-section">
          <div className="spinner"></div>
          <h2>⚙️ Processing Your Video</h2>
          <p className="status-text">{status.status}</p>
          
          <div className="progress-container">
            <div className="progress-bar">
              <div 
                className="progress-fill" 
                style={{width: `${status.progress}%`}}
              >
                <span className="progress-text">{status.progress}%</span>
              </div>
            </div>
          </div>

          <div className="processing-steps">
            <div className={`step ${status.progress >= 5 ? 'active' : ''}`}>
              <span className="step-icon">📥</span>
              <span>Downloading</span>
            </div>
            <div className={`step ${status.progress >= 15 ? 'active' : ''}`}>
              <span className="step-icon">🎵</span>
              <span>Audio Analysis</span>
            </div>
            <div className={`step ${status.progress >= 50 ? 'active' : ''}`}>
              <span className="step-icon">🎬</span>
              <span>Video Analysis</span>
            </div>
            <div className={`step ${status.progress >= 90 ? 'active' : ''}`}>
              <span className="step-icon">🏆</span>
              <span>Selecting Clips</span>
            </div>
          </div>
        </div>
      )}

      {results && (
        <div className="results-section">
          <div className="results-header">
            <h2>🏆 Top 3 Clips Detected</h2>
            <p>Here are the most engaging moments from your video</p>
          </div>
          
          <div className="clips-grid">
            {results.map((clip, index) => (
              <div key={index} className="clip-card">
                <div className="clip-rank">
                  <span className="rank-badge">#{index + 1}</span>
                  <span className="score-badge">⭐ {clip.score.toFixed(3)}</span>
                </div>
                
                <div className="clip-content">
                  <div className="clip-time">
                    <span className="time-icon">⏱️</span>
                    <span className="timestamp">
                      {formatTime(clip.start_time)} → {formatTime(clip.end_time)}
                    </span>
                    <span className="duration">
                      {Math.round(clip.end_time - clip.start_time)}s
                    </span>
                  </div>
                  
                  <div className="clip-explanation">
                    <span className="explanation-icon">💡</span>
                    <p>{clip.explanation}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <button onClick={() => window.location.reload()} className="reset-btn">
            ↻ Analyze Another Video
          </button>
        </div>
      )}

      <footer className="footer">
        <p>Powered by AI • Videotto Engineering Exercise</p>
      </footer>
    </div>
  )
}

export default App