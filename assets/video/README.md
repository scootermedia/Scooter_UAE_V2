# Showreel video

`showreel.mp4` is the home page hero background: the full Scooter reel (V5, 1:42),
re-encoded for the web at 1280×720, H.264 + AAC, faststart, about 9.5 MB.
It plays muted on a continuous loop; the speaker button in the hero turns sound on.

Source master: Google Drive "Showreel_Website.mp4" (1920×1080, 207 MB).
Poster frame: `/assets/img/hero-poster.jpg` (frame at 0:02).

To replace it, keep the same file name and re-encode with:

```bash
ffmpeg -i master.mp4 -vf scale=1280:-2 -c:v libx264 -preset veryfast -crf 27 -pix_fmt yuv420p \
  -movflags +faststart -c:a aac -b:a 96k showreel.mp4
```
