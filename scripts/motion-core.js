/* Pure geometry shared by browser and Node tests. */
(function (root, factory) {
  const api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  else root.PortfolioMotionCore = api;
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  'use strict';
  const clamp = (v, min=0, max=1) => Math.min(max, Math.max(min, Number.isFinite(v) ? v : min));
  function scrollProgress(scroll, top, height, viewport, offset=0) {
    const distance = height - (viewport - offset);
    return distance > 0 ? clamp((scroll + offset - top) / distance) : 0;
  }
  function stepIndex(progress, count) {
    return count > 0 ? clamp(Math.floor(clamp(progress) * count), 0, count-1) : 0;
  }
  function stepPosition(index, count, top, height, viewport, offset=0) {
    const fraction = count > 1 ? (clamp(index,0,count-1)+.5)/count : 0;
    return Math.max(0, top - offset + Math.max(0,height-(viewport-offset))*fraction);
  }
  // Fixed site policy. Former saved, URL and system preferences are not consulted.
  function resolveMotion() {
    return Object.freeze({mode: 'on', source: 'site', reduced: false});
  }
  return Object.freeze({clamp, scrollProgress, stepIndex, stepPosition, resolveMotion});
});
