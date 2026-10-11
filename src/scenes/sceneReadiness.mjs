/** Only the intro's rendered stage can open the splash gate. */
export function introCanContinue(rendererState, stageReady) {
  return rendererState === 'unavailable' || stageReady === true;
}
