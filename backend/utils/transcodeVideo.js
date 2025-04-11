const fs = require('fs');
const tmp = require('tmp');
const ffmpeg = require('fluent-ffmpeg');
const ffmpegPath = require('ffmpeg-static');

ffmpeg.setFfmpegPath(ffmpegPath);

async function transcodeVideo(inputBuffer) {
    return new Promise((resolve, reject) => {
        const inputTmp = tmp.tmpNameSync({ postfix: '.mp4' });
        const outputTmp = tmp.tmpNameSync({ postfix: '.mp4' });

        try{
            if(!inputBuffer || inputBuffer.length === 0){
                throw new Error('Empty input buffer received');
            }
            
            fs.writeFileSync(inputTmp, inputBuffer);
            if(!fs.existsSync(inputTmp)){
                throw new Error('Failed to create input temp file');
            }

            const command = ffmpeg(inputTmp).output(outputTmp)
            .outputOptions([
                '-c:v libx264',
                '-profile:v high',
                '-level 4.0',
                '-preset medium',
                '-crf 23',
                '-vf', 'scale=w=1080:h=-2', // 👈 Corrected line
                '-pix_fmt yuv420p',
                '-c:a aac',
                '-b:a 128k',
                '-ar 44100',
                '-ac 2',
                '-movflags +faststart',
                '-r 30',
                '-vsync cfr'
            ]);

            // Add debug logging
            // console.log('FFmpeg command:', command._getArguments().join(' '));

            let ffmpegLogs = '';
            command
            .on('start', (commandLine) => {
                console.log('FFmpeg started:', commandLine);
            })
            .on('codecData', (data) => {
                console.log('Input format:', data);
            })
            .on('stderr', (stderrLine) => {
                ffmpegLogs += stderrLine + '\n';
                console.log('FFmpeg stderr:', stderrLine);
            })
            .on('error', (err) => {
                console.error('FFmpeg error:', err);
                console.error('FFmpeg logs:\n', ffmpegLogs);
                cleanupFiles();
                reject(new Error(`FFmpeg conversion failed: ${err.message}\nLogs: ${ffmpegLogs}`));
            })
            .on('end', () => {
                try{
                    if(!fs.existsSync(outputTmp)){
                        throw new Error('Output file not created');
                    }
                    const stats = fs.statSync(outputTmp);
                    if(stats.size < 1024){
                        throw new Error('Output file too small');
                    }
                    const outputBuffer = fs.readFileSync(outputTmp);
                    cleanupFiles();
                    resolve(outputBuffer);
                } 
                catch(err){
                    cleanupFiles();
                    reject(err);
                }
            });

            command.run();
        } 
        catch(err){
            cleanupFiles();
            reject(err);
        }

        function cleanupFiles() {
            try { fs.unlinkSync(inputTmp); } catch {}
            try { fs.unlinkSync(outputTmp); } catch {}
        }
    });
}

module.exports = { transcodeVideo };
