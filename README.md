Videotto Clip Analyzer - README
Overview

This system analyzes long-form videos and automatically identifies the top 3 most engaging clips based on multiple audio-visual metrics. The analyzer uses a parallel processing pipeline to efficiently extract and score video segments.

How Clip-Ranking Works
Multi-Metric Scoring System

The clip ranking algorithm evaluates video segments across 5 key dimensions:
1. Audio Energy (25% weight) 
    Uses RMS (Root Mean Square) energy analysis via librosa
    Identifies segments with high vocal intensity and dynamic audio
    Rationale: Engaging content typically has energetic speakers and varied audio dynamics

2. Energy variance (15% weight)
    Calculates variance in audio energy over 2-second windows
    Detects dynamic range and emotional variation in speech/audio
    Rationale: Monotone, flat audio has low variance while engaging content shows energy fluctuations (loud/soft patterns, emotional emphasis, excitement). This metric is crucial for distinguishing between boring monologues and dynamic presentations where speakers modulate their voice for emphasis and engagement.

3. Spectral score (10% weight)
    - Combines spectral centroid (audio brightness/excitement) and zero-crossing rate
    - Spectral centroid measures the "brightness" of sound - higher values indicate sharper, more exciting audio
    - Zero-crossing rate helps differentiate speech from music and background noise
    - Rationale: Rich spectral content indicates varied and interesting audio. High spectral brightness often correlates with energetic speech, vocal emphasis, or impactful sound design, it also helps to differentiate between speech and music

4. Scene Cut Density (25% weight)

    Detects visual transitions using PySceneDetect's ContentDetector
    Counts scene changes per second within each segment
    Rationale: Frequent scene changes indicate dynamic, well-edited content

5. Motion Intensity (25% weight)

    Analyzes frame-to-frame differences to detect movement
    Uses downsampled frames (160x90) for efficiency
    Rationale: High motion suggests action-packed or visually engaging content

6. Position Penalty 

    Reduces scores for clips within first/last 15 seconds
    Rationale: Intros/outros are typically less engaging than core content

Segment Creation Strategy:

    Target duration: 15-30 seconds per clip (optimal for social media)
    Maintains natural speech boundaries from transcript
    Ensures non-overlapping final selections

Key Tradeoffs and Decisions
1. No transcription

    Decision: No transcription model used as of right now
    Tradeoff: Faster processing, but less accurate clip finding
    Justification: For clip ranking, approximate transcript is sufficient; speed is critical for UX

2. Motion Detection: Frame Differencing vs. Optical Flow

    Decision: Switched from Farneback optical flow to simple frame differencing
    Tradeoff: Less precise motion vectors, but 10x faster processing
    Justification: We only need relative motion intensity, not directional flow data

3. Parallel Processing Architecture

    Decision: Run audio energy,  scene detection, and motion analysis concurrently
    Benefit: speedup on multi-core systems
    Complexity: Required thread-safe progress tracking and result aggregation

4. Aggressive Downsampling for Motion Analysis

    Decision: Resize frames to 160x90 before processing
    Tradeoff: Lower spatial resolution  for motion detection
    Justification: Motion patterns still detectable; saves much of computation time


5. No AI/ML for Content Understanding

    Decision: Avoided using GPT/Claude or vision models for semantic analysis
    Tradeoff: Missing context like "joke delivery" or "emotional climax"
    Justification: 5-hour time constraint; heuristics are fast and interpretable

Short-Term Improvements 
1. Semantic Content Analysis

    Use Whisper's language detection + sentiment analysis on transcript
    Detect keywords like "important," "key point," "remember this"
    Weight segments containing questions or calls-to-action higher

2. Face Detection & Tracking

    Use dlib or mediapipe to detect speakers
    Boost scores when faces are visible and centered
    Critical for talking-head videos (common format)

3. Audio Classification

    Distinguish music vs. speech vs. silence
    Detect laughter, applause, or crowd reactions
    Penalize segments with just background music


Medium-Term Improvements 
1. Multimodal AI Scoring

    Use CLIP or similar vision-language models
    Score frames based on "visual interestingness"
    Detect text overlays, captions, or memes

2. Audio Ducking Detection

    Identify moments where music fades for speech
    Often indicates "important moment" in edited content

Long-Term Improvements 
1. Fine-Tuned Clip Ranking Model

    Collect dataset of human-labeled "best clips"
    Train a transformer model on multimodal features
    End-to-end learning of engagement prediction

2. Real-Time Processing

    Optimize pipeline for streaming video analysis
    Process clips as video uploads (progressive enhancement)

