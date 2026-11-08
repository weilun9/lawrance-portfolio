import { useEffect, useRef } from 'react'

// Self-hosted H.264 copy of the original clip. The original CDN file is 10-bit HEVC,
// which most Chrome/Firefox installs on Windows cannot decode (renders black).
// Encoded with every frame as a keyframe so each seek decodes a single frame.
const VIDEO_SRC = '/hero.mp4'
const POSTER_SRC = '/hero-poster.jpg'

const SENSITIVITY = 0.8

export function BackgroundVideo() {
  const videoRef = useRef<HTMLVideoElement>(null)
  const prevX = useRef<number | null>(null)
  const targetTime = useRef(0)
  const seeking = useRef(false)

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
      if (!duration || Number.isNaN(duration)) return

      const offset = (delta / window.innerWidth) * SENSITIVITY * duration
      targetTime.current = Math.min(Math.max(targetTime.current + offset, 0), duration)

      // Only one seek in flight; onSeeked picks up any newer target.
      if (!seeking.current) {
        seeking.current = true
        video.currentTime = targetTime.current
      }
    }

    window.addEventListener('mousemove', onMouseMove)
    return () => window.removeEventListener('mousemove', onMouseMove)
  }, [])

  const onSeeked = () => {
    const video = videoRef.current
    seeking.current = false
    if (video && Math.abs(video.currentTime - targetTime.current) > 0.01) {
      seeking.current = true
      video.currentTime = targetTime.current
    }
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
        objectPosition: '70% center',
        background: `#b3122b url(${POSTER_SRC}) 70% center / cover no-repeat`,
      }}
    />
  )
}
