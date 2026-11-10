# Showreel video

The home page hero plays a muted, looping background video from this folder:

- `showreel.mp4` (H.264, required)
- `showreel.webm` (VP9, optional — smaller, used first when present)

Source reel: https://www.instagram.com/reel/De9RsRDCG6s/

Recommended export: 1920×1080 (or 1080×1920 cropped to 16:9), 10–20 s seamless loop,
no burned-in text, **no audio track needed**, target under 6 MB.

```bash
ffmpeg -i reel.mp4 -an -vf "scale=1920:-2,crop=1920:1080" -c:v libx264 -preset slow -crf 26 -movflags +faststart showreel.mp4
ffmpeg -i reel.mp4 -an -vf "scale=1920:-2,crop=1920:1080" -c:v libvpx-vp9 -b:v 0 -crf 36 showreel.webm
```

Until the file is added, the hero shows the dark poster (`/assets/img/hero-poster.jpg`).
Replace that poster with a still frame from the reel for the best first paint.
