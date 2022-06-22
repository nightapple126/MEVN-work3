ffmpeg -y -i E:/NADIA.mp4 -c:a aac -ac 2 -ab 256k -ar 48000 -c:v libx264 -x264opts "keyint=24:min-keyint=24:no-scenecut" -b:v 1500k -maxrate 1500k -bufsize 1000k -vf "scale=1:720" C:/NADIA.mpd
ffmpeg -y -i src/sample.mp4 -c:a aac -ac 2 -ab 128k -ar 44100 -c libx264 -x264opts
"keyint=24:min-keyint=24:no-scenecut" -b:v 800k -maxrate 800k -bufsize 500k -vf "scale=1:540"
src/sample540.mp4
ffmpeg -y -i http://techslides.com/demos/sample-videos/small.mp4 -c:a aac -ac 2 -ab 64k -ar 22050 -c:v libx264 -x264opts "keyint=24:min-keyint=24:no-scenecut" -b:v 400k -maxrate 400k -bufsize 400k -vf "scale=1:360" E:/NADIA.mpd