/**
 * SquishBench reference app.
 *
 * Two disembodied hands share one squishy. The left hand is anchored to the
 * stage; the right hand tracks the pointer. Holding the squishy links the two:
 * pulling away stretches it, pushing in squashes it, and vertical offset between
 * the hands twists it. Right-click (or the Toss button) throws it between hands.
 */
(() => {
  'use strict';

  const root = document.getElementById('stress-reliever');
  if (!root || root.dataset.ready === 'true') return;
  root.dataset.ready = 'true';

  const stage = document.getElementById('sr-stage');
  const orbit = document.getElementById('sr-orbit');
  const squishy = document.getElementById('sr-squishy');
  const status = document.getElementById('sr-status');
  const readout = document.getElementById('sr-readout');
  const tossButton = document.getElementById('sr-toss');
  const buttons = Array.from(root.querySelectorAll('button[data-kind]'));

  const narrowScreen = window.matchMedia('(max-width: 520px)');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const labels = { ball: 'Ball', cow: 'Cow', pizza: 'Pizza' };

  const state = {
    kind: 'ball',
    pointerX: 0.78,
    pointerY: 0.52,
    objectX: 0.5,
    objectY: 0.52,
    grabbing: false,
    throwing: false,
    caughtBy: null,
    startDistance: 1,
    lastAngle: 0,
    tossTarget: 'right',
    idleStart: performance.now()
  };

  const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

  /** Pointer position as a fraction of the stage, kept just inside the edges. */
  function stagePoint(event) {
    const rect = stage.getBoundingClientRect();
    return {
      x: clamp((event.clientX - rect.left) / rect.width, 0.03, 0.97),
      y: clamp((event.clientY - rect.top) / rect.height, 0.06, 0.94),
      width: rect.width,
      height: rect.height
    };
  }

  /** Where the left hand sits. It never follows the pointer. */
  function leftPoint() {
    return { x: narrowScreen.matches ? 0.12 : 0.16, y: 0.52 };
  }

  function setLeftHand() {
    const left = leftPoint();
    root.style.setProperty('--sr-left-x', `${left.x * 100}%`);
    root.style.setProperty('--sr-left-y', `${left.y * 100}%`);
    return left;
  }

  function setPointer(point) {
    state.pointerX = point.x;
    state.pointerY = point.y;
    root.style.setProperty('--sr-right-x', `${point.x * 100}%`);
    root.style.setProperty('--sr-right-y', `${point.y * 100}%`);
  }

  function setObject(x, y) {
    state.objectX = x;
    state.objectY = y;
    root.style.setProperty('--sr-x', `${x * 100}%`);
    root.style.setProperty('--sr-y', `${y * 100}%`);
  }

  function relaxedTransform() {
    squishy.style.transform = 'rotate(0deg) scaleX(1) scaleY(1) skewY(0deg)';
  }

  /**
   * Deform the squishy from the hand-to-hand vector: distance drives
   * stretch/squash, the angle rotates it, vertical offset skews it.
   */
  function updateGrip() {
    const left = leftPoint();
    const dx = (state.pointerX - left.x) * stage.clientWidth;
    const dy = (state.pointerY - left.y) * stage.clientHeight;
    const distance = Math.max(20, Math.hypot(dx, dy));
    const ratio = clamp(distance / state.startDistance, 0.48, 1.85);
    const angle = (Math.atan2(dy, dx) * 180) / Math.PI;
    const side = clamp(dy / 170, -1, 1);
    const scaleX = ratio;
    const scaleY = clamp(1.18 - (ratio - 0.5) * 0.34, 0.68, 1.22);
    const twist = side * 19;

    state.lastAngle = angle;
    setObject((left.x + state.pointerX) / 2, (left.y + state.pointerY) / 2);
    squishy.style.transform =
      `rotate(${angle}deg) scaleX(${scaleX}) scaleY(${scaleY}) skewY(${twist}deg)`;

    let action = 'relaxed';
    if (ratio > 1.13) action = 'stretched';
    else if (ratio < 0.86) action = 'squished';
    if (Math.abs(side) > 0.35) action = `${action} + twisted`;

    status.textContent = action.charAt(0).toUpperCase() + action.slice(1);
    readout.textContent = `${labels[state.kind]} · ${action}`;
  }

  function wobble() {
    if (reducedMotion) {
      relaxedTransform();
      return;
    }
    squishy.animate(
      [
        { transform: squishy.style.transform || 'scale(1)' },
        { transform: `rotate(${state.lastAngle * 0.18}deg) scaleX(.88) scaleY(1.13) skewY(-6deg)` },
        { transform: 'rotate(-3deg) scaleX(1.08) scaleY(.94) skewY(4deg)' },
        { transform: 'rotate(2deg) scaleX(.97) scaleY(1.04) skewY(-2deg)' },
        { transform: 'rotate(0deg) scaleX(1) scaleY(1) skewY(0deg)' }
      ],
      { duration: 560, easing: 'cubic-bezier(.2,.8,.2,1)' }
    ).onfinish = relaxedTransform;
  }

  function release() {
    if (!state.grabbing) return;
    state.grabbing = false;
    state.caughtBy = null;
    state.idleStart = performance.now();
    root.classList.remove('is-grabbing');
    status.textContent = 'Wobbling';
    readout.textContent = `${labels[state.kind]} · released`;
    wobble();
    window.setTimeout(() => {
      if (!state.grabbing && !state.throwing) status.textContent = 'Floating';
    }, 580);
  }

  function startGrab(event) {
    if (event.button !== 0 || state.throwing) return;
    event.preventDefault();

    const point = stagePoint(event);
    setPointer(point);

    const left = leftPoint();
    state.startDistance = Math.max(
      80,
      Math.hypot((point.x - left.x) * point.width, (point.y - left.y) * point.height)
    );
    state.grabbing = true;
    state.caughtBy = 'right';
    root.classList.add('is-grabbing');

    try {
      squishy.setPointerCapture(event.pointerId);
    } catch {
      /* Capture is a nicety; window-level pointerup still ends the grab. */
    }

    status.textContent = 'Gripped';
    updateGrip();
  }

  /** Arc the squishy to the other hand and hand off ownership. */
  function toss() {
    if (state.throwing) return;
    state.throwing = true;
    state.grabbing = false;
    root.classList.remove('is-grabbing');

    const left = leftPoint();
    const targetSide = state.tossTarget;
    const target =
      targetSide === 'right'
        ? { x: state.pointerX - 0.055, y: state.pointerY }
        : { x: left.x + 0.06, y: left.y };
    const start = { x: state.objectX, y: state.objectY };
    const mid = {
      x: (start.x + target.x) / 2,
      y: clamp(Math.min(start.y, target.y) - 0.28, 0.16, 0.54)
    };
    const duration = reducedMotion ? 1 : 620;

    status.textContent = `Tossing ${targetSide}`;
    readout.textContent = `${labels[state.kind]} · airborne`;

    const flight = orbit.animate(
      [
        { left: `${start.x * 100}%`, top: `${start.y * 100}%`, offset: 0 },
        { left: `${mid.x * 100}%`, top: `${mid.y * 100}%`, offset: 0.5 },
        { left: `${target.x * 100}%`, top: `${target.y * 100}%`, offset: 1 }
      ],
      { duration, easing: 'cubic-bezier(.25,.75,.2,1)' }
    );

    squishy.animate(
      [
        { transform: 'rotate(0deg) scale(1)' },
        { transform: 'rotate(190deg) scaleX(1.12) scaleY(.9)' },
        { transform: 'rotate(380deg) scale(1)' }
      ],
      { duration, easing: 'ease-in-out' }
    );

    flight.onfinish = () => {
      setObject(target.x, target.y);
      state.caughtBy = targetSide;
      state.tossTarget = targetSide === 'right' ? 'left' : 'right';
      state.throwing = false;
      relaxedTransform();
      status.textContent = `Caught ${targetSide}`;
      readout.textContent = `${labels[state.kind]} · caught by ${targetSide} hand`;
    };
  }

  function selectKind(kind) {
    if (!labels[kind]) return;
    state.kind = kind;
    squishy.dataset.kind = kind;
    buttons.forEach((candidate) => {
      const selected = candidate.dataset.kind === kind;
      candidate.classList.toggle('btn-primary', selected);
      candidate.setAttribute('aria-pressed', String(selected));
    });
    status.textContent = 'Floating';
    readout.textContent = `${labels[kind]} · relaxed`;
    wobble();
  }

  stage.addEventListener('pointermove', (event) => {
    const point = stagePoint(event);
    setPointer(point);
    if (state.grabbing) {
      updateGrip();
    } else if (state.caughtBy === 'right' && !state.throwing) {
      // Carried in the right hand: it rides along just behind the palm.
      setObject(point.x - 0.055, point.y);
    }
  });

  squishy.addEventListener('pointerdown', startGrab);
  squishy.addEventListener('pointerup', release);
  squishy.addEventListener('pointercancel', release);
  window.addEventListener('pointerup', release);

  stage.addEventListener('contextmenu', (event) => {
    event.preventDefault();
    toss();
  });

  tossButton.addEventListener('click', toss);

  buttons.forEach((button) => {
    button.addEventListener('click', () => selectKind(button.dataset.kind));
  });

  const applyBreakpoint = () => {
    setLeftHand();
    if (state.grabbing) updateGrip();
  };

  window.addEventListener('resize', applyBreakpoint);
  if (typeof narrowScreen.addEventListener === 'function') {
    narrowScreen.addEventListener('change', applyBreakpoint);
  }

  /** Idle bob, only while nothing owns the squishy. */
  function idleFrame(now) {
    if (!state.grabbing && !state.throwing && !state.caughtBy) {
      const t = (now - state.idleStart) / 1000;
      setObject(0.5 + Math.sin(t * 0.7) * 0.018, 0.5 + Math.cos(t * 1.05) * 0.027);
      squishy.style.transform =
        `rotate(${Math.sin(t * 0.8) * 2.4}deg)` +
        ` scaleX(${1 + Math.sin(t * 1.4) * 0.018})` +
        ` scaleY(${1 - Math.sin(t * 1.4) * 0.018})`;
    }
    requestAnimationFrame(idleFrame);
  }

  setLeftHand();
  setPointer({ x: state.pointerX, y: state.pointerY });
  setObject(state.objectX, state.objectY);
  if (!reducedMotion) requestAnimationFrame(idleFrame);
})();
