import { ipcRenderer } from 'electron';

import audioDecode from 'audio-decode';
import audioBufferUtils from 'audio-buffer-utils';
import toWav from 'audiobuffer-to-wav';

const startButton = document.getElementById('start-slicing');

startButton.addEventListener('click', () => {
  ipcRenderer.send('start-slicing');
});
