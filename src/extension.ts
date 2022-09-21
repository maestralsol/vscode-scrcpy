import { commands, Disposable, ExtensionContext } from 'vscode';
import {
  customBitRate,
  customCrop,
  customEverything,
  customFrameRate,
  customPath,
  customSize,
  mirror,
  mirrorWithAlwaysOnTop,
  record
} from './scrcpy';

function register(
  command: string,
  onExecute: (...args: any[]) => any,
): Disposable {
  return commands.registerCommand(command, onExecute);
}

export function activate(context: ExtensionContext) {
  const registrations = [
    register('scrcpy.mirror', mirror),
    register('scrcpy.mirrorAlwaysOnTop', mirrorWithAlwaysOnTop),
    register('scrcpy.mirrorBitRate', () => customBitRate('mirror')),
    register('scrcpy.mirrorFrameRate', () => customFrameRate('mirror')),
    register('scrcpy.mirrorSize', () => customSize('mirror')),
    register('scrcpy.mirrorCrop', () => customCrop('mirror')),
    register('scrcpy.mirrorCustom', () => customEverything('mirror')),
    register('scrcpy.record', record),
    register('scrcpy.recordBitRate', () => customBitRate('record')),
    register('scrcpy.recordFrameRate', () => customFrameRate('record')),
    register('scrcpy.recordPath', customPath),
    register('scrcpy.recordSize', () => customSize('record')),
    register('scrcpy.recordCrop', () => customCrop('record')),
    register('scrcpy.recordCustom', () => customEverything('record')),
  ];
  context.subscriptions.push(...registrations);
}
