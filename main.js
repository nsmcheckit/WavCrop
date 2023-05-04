import { app, BrowserWindow } from 'electron';
import fs from 'fs';
import audioDecode from 'audio-decode';
import audioBufferUtils from 'audio-buffer-utils';
import toWav from 'audiobuffer-to-wav';

function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      enableRemoteModule: true,
    },
  });

  mainWindow.loadFile('index.html');
}

app.whenReady().then(() => {
  createWindow();

  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit();
});

ipcMain.on('start-slicing', (event) => {
  // 读取音频文件
  const inputFile = 'input.wav'; // 替换为你的输入文件名
  const outputFile = 'output.wav'; // 替换为你的输出文件名
  const startTime = 1; // 裁剪开始时间（秒）
  const endTime = 3; // 裁剪结束时间（秒）

  fs.readFile(inputFile, (err, fileBuffer) => {
    if (err) {
      console.error(err);
      return;
    }

    // 解码音频文件
    audioDecode(fileBuffer.buffer)
      .then((audioBuffer) => {
        // 计算裁剪的开始和结束位置（采样）
        const startSample = Math.floor(startTime * audioBuffer.sampleRate);
        const endSample = Math.floor(endTime * audioBuffer.sampleRate);

        // 裁剪音频
        const slicedBuffer = audioBufferUtils.slice(audioBuffer, startSample, endSample);

        // 将 AudioBuffer 转换为 WAV 文件
        const wavBuffer = toWav(slicedBuffer);

        // 保存裁剪后的音频文件
        fs.writeFile(outputFile, Buffer.from(wavBuffer), (err) => {
          if (err) {
            console.error(err);
            return;
          }
          console.log('Audio sliced and saved to', outputFile);
        });
      })
      .catch((err) => {
        console.error(err);
      });
  });
});
