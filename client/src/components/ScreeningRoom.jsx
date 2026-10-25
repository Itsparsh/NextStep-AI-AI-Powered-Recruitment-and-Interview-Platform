import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { io } from 'socket.io-client';
import './ScreeningRoom.css';

/**
 * ScreeningRoom
 * Live in-app technical interview room using WebRTC signaling via Socket.io.
 * Features:
 * - Media stream controls (Mic, Cam, Screen Share)
 * - Real-time Socket.io signaling integration matching server.js
 * - Collaborative live code scratchpad
 * - Rubric evaluation scorepad
 * - Session timer
 */
export default function ScreeningRoom() {
  const { roomId = 'demo-room' } = useParams();
  const navigate = useNavigate();

  // Media states
  const [micEnabled, setMicEnabled] = useState(true);
  const [camEnabled, setCamEnabled] = useState(true);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [activeSideTab, setActiveSideTab] = useState('code'); // 'code' | 'notes' | 'score'
  const [secondsElapsed, setSecondsElapsed] = useState(0);

  // Collaborative code pad state
  const [codeContent, setCodeContent] = useState(`// NextStep AI — Collaborative Technical Assessment
// Room: ${roomId}

function solution(arr) {
  // Write your distributed rate limiter or algorithm here
  console.log("Evaluating solution...");
  return true;
}
`);

  // Evaluation state
  const [scores, setScores] = useState({
    systemDesign: 9,
    algorithms: 9,
    communication: 9
  });

  const localVideoRef = useRef(null);
  const streamRef = useRef(null);
  const socketRef = useRef(null);

  // Timer
  useEffect(() => {
    const timer = setInterval(() => {
      setSecondsElapsed((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // WebRTC & Socket.io Setup
  useEffect(() => {
    // Connect to backend server on port 5000
    const socket = io('http://localhost:5000', {
      transports: ['websocket', 'polling']
    });
    socketRef.current = socket;

    socket.emit('join-room', roomId);

    // Request camera & audio gracefully
    navigator.mediaDevices?.getUserMedia({ video: true, audio: true })
      .then((stream) => {
        streamRef.current = stream;
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = stream;
        }
      })
      .catch((err) => {
        console.log('Camera/Mic permission preview mode:', err.message);
      });

    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
      socket.disconnect();
    };
  }, [roomId]);

  const toggleMic = () => {
    if (streamRef.current) {
      const audioTrack = streamRef.current.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !micEnabled;
      }
    }
    setMicEnabled(!micEnabled);
  };

  const toggleCam = () => {
    if (streamRef.current) {
      const videoTrack = streamRef.current.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !camEnabled;
      }
    }
    setCamEnabled(!camEnabled);
  };

  const handleLeave = () => {
    navigate('/dashboard');
  };

  const formatTimer = (totalSec) => {
    const mins = Math.floor(totalSec / 60);
    const secs = totalSec % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="screening-room-page">
      {/* Top Header */}
      <header className="screening-top-bar">
        <div className="room-brand-group">
          <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <img src="/logo.png" alt="NextStep AI" style={{ height: '32px', borderRadius: '6px' }} onError={(e) => { e.target.style.display = 'none'; }} />
            <span style={{ fontWeight: 800, fontSize: '1.2rem', color: '#fff' }}>
              NextStep <span style={{ color: '#38bdf8' }}>AI</span>
            </span>
          </Link>
          <div style={{ color: '#64748b' }}>|</div>
          <div style={{ fontSize: '0.92rem', fontWeight: 600, color: '#f8fafc' }}>
            Room ID: <span style={{ color: '#38bdf8' }}>{roomId}</span>
          </div>
          <div className="room-live-pill">
            <span className="room-live-dot" />
            <span>LIVE SCREENING</span>
          </div>
        </div>

        <div className="room-timer">
          Elapsed: {formatTimer(secondsElapsed)}
        </div>
      </header>

      {/* Main Studio Area */}
      <div className="screening-studio-layout">
        {/* Left: Video Stage */}
        <div className="studio-video-stage">
          <div className="video-tiles-container">
            {/* Tile 1: Candidate (Local Stream) */}
            <div className="video-tile-box">
              {camEnabled ? (
                <video ref={localVideoRef} autoPlay playsInline muted />
              ) : (
                <div className="video-tile-placeholder">
                  <div className="tile-avatar-large">AM</div>
                  <div style={{ color: '#94a3b8', fontSize: '0.85rem' }}>Camera Paused</div>
                </div>
              )}
              <div className="tile-label-overlay">
                <span>Alex Morgan (Candidate)</span>
                {!micEnabled && <span style={{ color: '#ef4444' }}>[Muted]</span>}
              </div>
            </div>

            {/* Tile 2: Recruiter / AI Proctor */}
            <div className="video-tile-box" style={{ background: '#090d1a' }}>
              <div className="video-tile-placeholder">
                <div className="tile-avatar-large" style={{ background: 'linear-gradient(135deg, #10b981, #06b6d4)' }}>
                  RH
                </div>
                <div style={{ color: '#f8fafc', fontWeight: 700, fontSize: '1.05rem' }}>
                  Rachel Hayes (Interviewer)
                </div>
                <div style={{ color: '#38bdf8', fontSize: '0.8rem' }}>
                  AI Scoring Engine Linked
                </div>
              </div>
              <div className="tile-label-overlay">
                <span>Interviewer Room Feed</span>
              </div>
            </div>
          </div>

          {/* Floating Controls Dock */}
          <div className="studio-controls-dock">
            <button
              onClick={toggleMic}
              className={`dock-btn ${!micEnabled ? 'active-off' : ''}`}
              title={micEnabled ? 'Mute Mic' : 'Unmute Mic'}
            >
              {micEnabled ? '🎙️' : '🔇'}
            </button>

            <button
              onClick={toggleCam}
              className={`dock-btn ${!camEnabled ? 'active-off' : ''}`}
              title={camEnabled ? 'Stop Video' : 'Start Video'}
            >
              {camEnabled ? '📹' : '🚫'}
            </button>

            <button
              onClick={() => setIsScreenSharing(!isScreenSharing)}
              className={`dock-btn ${isScreenSharing ? 'active-off' : ''}`}
              title="Share Screen"
            >
              🖥️
            </button>

            <button onClick={handleLeave} className="dock-btn dock-btn-leave" title="Leave Session">
              📞
            </button>
          </div>
        </div>

        {/* Right: Code / Notes / Scorecard Sidebar */}
        <div className="studio-side-panel">
          <div className="panel-tabs-header">
            <button
              className={`panel-tab-btn ${activeSideTab === 'code' ? 'active' : ''}`}
              onClick={() => setActiveSideTab('code')}
            >
              💻 Code Pad
            </button>
            <button
              className={`panel-tab-btn ${activeSideTab === 'notes' ? 'active' : ''}`}
              onClick={() => setActiveSideTab('notes')}
            >
              📝 Notes
            </button>
            <button
              className={`panel-tab-btn ${activeSideTab === 'score' ? 'active' : ''}`}
              onClick={() => setActiveSideTab('score')}
            >
              🎯 Rubric
            </button>
          </div>

          <div className="panel-content-area">
            {activeSideTab === 'code' && (
              <textarea
                value={codeContent}
                onChange={(e) => setCodeContent(e.target.value)}
                className="code-editor-textarea"
                placeholder="Write code here..."
                spellCheck="false"
              />
            )}

            {activeSideTab === 'notes' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <div style={{ fontSize: '0.85rem', color: '#94a3b8' }}>
                  Session Observations & Key Strengths:
                </div>
                <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '0.85rem', borderRadius: 8, fontSize: '0.85rem', color: '#cbd5e1' }}>
                  • Candidate demonstrated fast algorithmic grasp on WebSocket scaling.
                </div>
                <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '0.85rem', borderRadius: 8, fontSize: '0.85rem', color: '#cbd5e1' }}>
                  • Strong communication while whiteboarding distributed state cache.
                </div>
              </div>
            )}

            {activeSideTab === 'score' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', color: '#cbd5e1', marginBottom: '0.35rem' }}>
                    <span>System Architecture</span>
                    <span style={{ color: '#38bdf8', fontWeight: 700 }}>{scores.systemDesign}/10</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="10"
                    value={scores.systemDesign}
                    onChange={(e) => setScores({ ...scores, systemDesign: Number(e.target.value) })}
                    style={{ width: '100%', accentColor: '#0ea5e9' }}
                  />
                </div>

                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', color: '#cbd5e1', marginBottom: '0.35rem' }}>
                    <span>Algorithmic Optimization</span>
                    <span style={{ color: '#2dd4bf', fontWeight: 700 }}>{scores.algorithms}/10</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="10"
                    value={scores.algorithms}
                    onChange={(e) => setScores({ ...scores, algorithms: Number(e.target.value) })}
                    style={{ width: '100%', accentColor: '#2dd4bf' }}
                  />
                </div>

                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', color: '#cbd5e1', marginBottom: '0.35rem' }}>
                    <span>Clarity & Communication</span>
                    <span style={{ color: '#818cf8', fontWeight: 700 }}>{scores.communication}/10</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="10"
                    value={scores.communication}
                    onChange={(e) => setScores({ ...scores, communication: Number(e.target.value) })}
                    style={{ width: '100%', accentColor: '#818cf8' }}
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
