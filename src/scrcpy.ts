import * as cp from 'child_process';
import { commands, Uri, window } from 'vscode';
import { Mode, Options } from './types';
import {
  askForAlwaysOnTop,
  askForBitRate,
  askForCrop,
  askForFrameRate,
  askForPath,
  askForSize,
  askForStayAwake,
  askForTurnScreenOff,
  getDefaultFileName,
  getDefaultRecordingPath,
  showNotSpecifiedMessage
} from './utils';

function start(options: Options) {
  const {
    bitrate,
    framerate,
    path,
    size,
    crop,
    mode,
    alwaysOnTop,
    screenOff,
    stayAwake,
  } = options;

  const p = mode === 'record' ? path || getDefaultRecordingPath() : undefined;

  const recordParam =
    mode === 'record' ? `--record ${p}/${getDefaultFileName()}` : '';
  const bitrateParam = bitrate ? `--bit-rate ${bitrate}` : '';
  const framerateParam = framerate ? `--max-fps ${framerate}` : '';
  const sizeParam = size ? `--max-size ${size}` : '';
  const cropParam = crop ? `--crop ${crop}` : '';
  const alwaysOnTopParam = alwaysOnTop ? '--always-on-top' : '';
  const stayAwakeParam = stayAwake ? '-w' : '';
  const turnScreenOffParam = screenOff ? '-S' : '';

  showNotSpecifiedMessage(options);

  cp.exec(
    `scrcpy ${recordParam} ${bitrateParam} ${framerateParam} ${sizeParam} ${cropParam} ${alwaysOnTopParam} ${turnScreenOffParam} ${stayAwakeParam}`,
    error => {
      if (error?.message?.includes('command not found')) {
        window
          .showInformationMessage('scrcpy not found', {}, 'How to install')
          .then(action => {
            if (action === 'How to install') {
              commands.executeCommand(
                'vscode.open',
                Uri.parse('https://github.com/Genymobile/scrcpy#get-the-app'),
              );
            }
          });
      } else if (error) {
        window.showErrorMessage(error.message);
      }
    },
  );
}

function mirror() {
  start({ mode: 'mirror' });
}

function record() {
  start({ mode: 'record' });
}

async function mirrorWithAlwaysOnTop() {
  const awake = (await askForStayAwake()) || null;
  const screenOff = (await askForTurnScreenOff()) || null;
  start({
    mode: 'mirror',
    alwaysOnTop: true,
    stayAwake: awake,
    screenOff: screenOff,
  });
}

async function customBitRate(mode: Mode) {
  const bitrate = await askForBitRate();
  start({ mode: mode, bitrate: bitrate || null });
}

async function customFrameRate(mode: Mode) {
  const framerate = await askForFrameRate();
  start({ mode: mode, framerate: framerate || null });
}

async function customPath() {
  const path = await askForPath();
  start({ mode: 'record', path: path || null });
}

async function customSize(mode: Mode) {
  const size = await askForSize();
  start({ mode: mode, size: size || null });
}

async function customCrop(mode: Mode) {
  const crop = await askForCrop();
  start({ mode: mode, crop: crop || null });
}

async function customEverything(mode: Mode) {
  const bitrate = await askForBitRate();
  const framerate = await askForFrameRate();
  const size = await askForSize();
  const crop = await askForCrop();
  const awake = (await askForStayAwake()) || null;
  const screenOff = (await askForTurnScreenOff()) || null;
  const alwaysOnTop = (await askForAlwaysOnTop()) || null;

  let path;
  if (mode === 'record') {
    path = await askForPath();
  }
  start({
    mode: mode,
    bitrate: bitrate || null,
    framerate: framerate || null,
    path: path || null,
    size: size || null,
    crop: crop || null,
    stayAwake: awake,
    screenOff: screenOff,
    alwaysOnTop: alwaysOnTop,
  });
}

export {
  mirror,
  mirrorWithAlwaysOnTop,
  record,
  customBitRate,
  customFrameRate,
  customPath,
  customSize,
  customCrop,
  customEverything,
};
