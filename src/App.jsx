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

import { useState, useEffect, useRef } from 'react'
import axios from 'axios'
import './App.css'

const API_URL = 'https://815rl57zqf.execute-api.eu-north-1.amazonaws.com'

function App() {
  const [videoUrl, setVideoUrl] = useState('')
  const [jobId, setJobId] = useState(null)
  const [status, setStatus] = useState(null)
  const [results, setResults] = useState(null)
  const [loading, setLoading] = useState(false)
  const [logs, setLogs] = useState([])
  const logsEndRef = useRef(null)

  // Auto-scroll logs to bottom
  useEffect(() => {
    logsEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [logs])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setLogs([])
    
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
        
        // Update logs
        if (response.data.logs) {
          setLogs(response.data.logs)
        }
        
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
    }, 1000)  // Poll every 1 second for faster log updates
  }

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  return (
    <div className="App">
      <h1>🎬 Videotto Clip Analyzer</h1>
      <p className="subtitle">AI-powered video clip extraction</p>
      
      {!loading && !results && (
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Enter YouTube, Dropbox, or direct video URL"
            value={videoUrl}
            onChange={(e) => setVideoUrl(e.target.value)}
            required
          />
          <button type="submit">🚀 Analyze Video</button>
          <p className="hint">
            Supports: YouTube (youtube.com, youtu.be), Dropbox, or direct MP4 links
          </p>
        </form>
      )}

      {loading && status && (
        <div className="status">
          <h2>⚙️ Processing Video...</h2>
          <div className="progress-bar">
            <div 
              className="progress" 
              style={{width: `${status.progress}%`}}
            />
          </div>
          <p className="progress-text">{status.progress}% - {status.status}</p>
          
          {/* Real-time logs */}
          <div className="logs-container">
            <h3>📋 Processing Logs</h3>
            <div className="logs">
              {logs.map((log, index) => (
                <div key={index} className="log-entry">
                  {log}
                </div>
              ))}
              <div ref={logsEndRef} />
            </div>
          </div>
        </div>
      )}

      {results && (
        <div className="results">
          <h2>🏆 Top 3 Clips</h2>
          {results.map((clip, index) => (
            <div key={index} className="clip-card">
              <div className="clip-header">
                <h3>🎬 Clip {index + 1}</h3>
                <span className="score-badge">Score: {clip.score.toFixed(3)}</span>
              </div>
              <p className="timestamp">
                ⏱️  {formatTime(clip.start_time)} - {formatTime(clip.end_time)}
                <span className="duration">
                  ({Math.round(clip.end_time - clip.start_time)}s)
                </span>
              </p>
              <p className="explanation">💡 {clip.explanation}</p>
            </div>
          ))}
          <button onClick={() => window.location.reload()} className="reset-btn">
            ↻ Analyze Another Video
          </button>
        </div>
      )}
    </div>
  )
}

export default App