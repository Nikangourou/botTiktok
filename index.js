const fs = require('fs');
const { createFFmpeg, fetchFile } = require('@ffmpeg/ffmpeg');
const ffmpeg = createFFmpeg({ log: true });

const input = "test.mp4";

(async () => {
  await ffmpeg.load();
  ffmpeg.FS('writeFile', input, await fetchFile('./'+input));
  await ffmpeg.run('-i', input, '-c', 'copy', '-map', '0', '-segment_time', '00:00:05', '-f', 'segment', 'output%03d.mp4');

  /* Delete input in MEMFS */
  ffmpeg.FS('unlink', input);
  // Output
  ffmpeg.FS('readdir', '/').filter((p) => p.endsWith('.mp4')).forEach(async (p) => {
    fs.writeFileSync('output/'+p, ffmpeg.FS('readFile', p));
  });

  process.exit(0);
})();

// ffmpeg -i input.mp4 -c copy -map 0 -segment_time 00:20:00 -f segment output%03d.mp4