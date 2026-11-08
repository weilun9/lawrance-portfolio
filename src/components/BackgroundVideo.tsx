import { useEffect, useRef } from 'react'

// Self-hosted H.264 copy of the original clip. The original CDN file is 10-bit HEVC,
// which most Chrome/Firefox installs on Windows cannot decode (renders black).
// Encoded with every frame as a keyframe so each seek decodes a single frame.
const VIDEO_SRC = '/hero.mp4'
const POSTER_SRC = '/hero-poster.jpg'

const SENSITIVITY = 0.8

// If a browser never fires `seeked` (e.g. tab backgrounded mid-seek), stop waiting after this long.
const SEEK_TIMEOUT_MS = 500

export function BackgroundVideo() {
  const videoRef = useRef<HTMLVideoElement>(null)
  const prevX = useRef<number | null>(null)
  const targetTime = useRef(0)
  const seekStartedAt = useRef<number | null>(null) // null = no seek in flight

  // Starts a seek to the latest target. Never lets a bad value (NaN/Infinity)
  // into currentTime, because that throws and would leave the scrub stuck.
  const seekToTarget = (video: HTMLVideoElement) => {
    const t = targetTime.current
    if (!Number.isFinite(t)) {
      targetTime.current = video.currentTime || 0
      return
    }
    if (Math.abs(video.currentTime - t) <= 0.01) return
    try {
      seekStartedAt.current = performance.now()
      video.currentTime = t
    } catch {
      seekStartedAt.current = null
    }
  }

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    const onMouseMove = (e: MouseEvent) => {
      const currentX = e.clientX
      if (prevX.current === null) {
        prevX.current = currentX
        return
      }
      const delta = currentX - prevX.current
      prevX.current = currentX

      const duration = video.duration
      const width = window.innerWidth
      // Hidden/background windows can report width 0, which would make 0/0 = NaN.
      if (!delta || !width || !Number.isFinite(duration) || duration <= 0) return

      const offset = (delta / width) * SENSITIVITY * duration
      targetTime.current = Math.min(Math.max(targetTime.current + offset, 0), duration)

      // Only one seek in flight; onSeeked picks up any newer target.
      const inFlight =
        seekStartedAt.current !== null && performance.now() - seekStartedAt.current < SEEK_TIMEOUT_MS
      if (!inFlight) seekToTarget(video)
    }

    window.addEventListener('mousemove', onMouseMove)
    return () => window.removeEventListener('mousemove', onMouseMove)
  }, [])

  const onSeeked = () => {
    seekStartedAt.current = null
    const video = videoRef.current
    if (video) seekToTarget(video)
  }

  return (
    <video
      ref={videoRef}
      src={VIDEO_SRC}
      poster={POSTER_SRC}
      muted
      playsInline
      preload="auto"
      onSeeked={onSeeked}
      className="fixed inset-0 z-0 h-full w-full object-cover"
      // The poster doubles as a CSS background, so the hero is never plain black
      // even if the video fails to load or decode.
      style={{
        objectPosition: '58% center',
        background: `#13304f url(${POSTER_SRC}) 58% center / cover no-repeat`,
      }}
    />
  )
}
