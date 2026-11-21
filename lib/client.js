window.__ModuleLoader__.load({ id: "dsh-chat-a2ui", factory: (require) => {
var module = { exports: {} }; var exports = module.exports;
"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/client/index.tsx
var index_exports = {};
__export(index_exports, {
  apply: () => apply3,
  inject: () => inject
});
module.exports = __toCommonJS(index_exports);

// src/client/chat-a2ui/ChatA2UIView.tsx
var import_react36 = require("react");

// node_modules/framer-motion/dist/es/components/AnimatePresence/index.mjs
var import_jsx_runtime3 = require("react/jsx-runtime");
var import_react10 = require("react");

// node_modules/framer-motion/dist/es/context/LayoutGroupContext.mjs
var import_react = require("react");
var LayoutGroupContext = (0, import_react.createContext)({});

// node_modules/framer-motion/dist/es/utils/use-constant.mjs
var import_react2 = require("react");
function useConstant(init) {
  const ref = (0, import_react2.useRef)(null);
  if (ref.current === null) {
    ref.current = init();
  }
  return ref.current;
}

// node_modules/framer-motion/dist/es/components/AnimatePresence/PresenceChild.mjs
var import_jsx_runtime2 = require("react/jsx-runtime");
var React2 = __toESM(require("react"), 1);
var import_react6 = require("react");

// node_modules/framer-motion/dist/es/context/PresenceContext.mjs
var import_react3 = require("react");
var PresenceContext = (0, import_react3.createContext)(null);

// node_modules/framer-motion/dist/es/components/AnimatePresence/PopChild.mjs
var import_jsx_runtime = require("react/jsx-runtime");
var React = __toESM(require("react"), 1);
var import_react5 = require("react");

// node_modules/framer-motion/dist/es/context/MotionConfigContext.mjs
var import_react4 = require("react");
var MotionConfigContext = (0, import_react4.createContext)({
  transformPagePoint: (p) => p,
  isStatic: false,
  reducedMotion: "never"
});

// node_modules/framer-motion/dist/es/components/AnimatePresence/PopChild.mjs
var PopChildMeasure = class extends React.Component {
  getSnapshotBeforeUpdate(prevProps) {
    const element = this.props.childRef.current;
    if (element && prevProps.isPresent && !this.props.isPresent) {
      const size = this.props.sizeRef.current;
      size.height = element.offsetHeight || 0;
      size.width = element.offsetWidth || 0;
      size.top = element.offsetTop;
      size.left = element.offsetLeft;
    }
    return null;
  }
  /**
   * Required with getSnapshotBeforeUpdate to stop React complaining.
   */
  componentDidUpdate() {
  }
  render() {
    return this.props.children;
  }
};
function PopChild({ children, isPresent }) {
  const id3 = (0, import_react5.useId)();
  const ref = (0, import_react5.useRef)(null);
  const size = (0, import_react5.useRef)({
    width: 0,
    height: 0,
    top: 0,
    left: 0
  });
  const { nonce } = (0, import_react5.useContext)(MotionConfigContext);
  (0, import_react5.useInsertionEffect)(() => {
    const { width, height, top, left } = size.current;
    if (isPresent || !ref.current || !width || !height)
      return;
    ref.current.dataset.motionPopId = id3;
    const style = document.createElement("style");
    if (nonce)
      style.nonce = nonce;
    document.head.appendChild(style);
    if (style.sheet) {
      style.sheet.insertRule(`
          [data-motion-pop-id="${id3}"] {
            position: absolute !important;
            width: ${width}px !important;
            height: ${height}px !important;
            top: ${top}px !important;
            left: ${left}px !important;
          }
        `);
    }
    return () => {
      document.head.removeChild(style);
    };
  }, [isPresent]);
  return (0, import_jsx_runtime.jsx)(PopChildMeasure, { isPresent, childRef: ref, sizeRef: size, children: React.cloneElement(children, { ref }) });
}

// node_modules/framer-motion/dist/es/components/AnimatePresence/PresenceChild.mjs
var PresenceChild = ({ children, initial, isPresent, onExitComplete, custom, presenceAffectsLayout, mode }) => {
  const presenceChildren = useConstant(newChildrenMap);
  const id3 = (0, import_react6.useId)();
  const memoizedOnExitComplete = (0, import_react6.useCallback)((childId) => {
    presenceChildren.set(childId, true);
    for (const isComplete of presenceChildren.values()) {
      if (!isComplete)
        return;
    }
    onExitComplete && onExitComplete();
  }, [presenceChildren, onExitComplete]);
  const context = (0, import_react6.useMemo)(
    () => ({
      id: id3,
      initial,
      isPresent,
      custom,
      onExitComplete: memoizedOnExitComplete,
      register: (childId) => {
        presenceChildren.set(childId, false);
        return () => presenceChildren.delete(childId);
      }
    }),
    /**
     * If the presence of a child affects the layout of the components around it,
     * we want to make a new context value to ensure they get re-rendered
     * so they can detect that layout change.
     */
    presenceAffectsLayout ? [Math.random(), memoizedOnExitComplete] : [isPresent, memoizedOnExitComplete]
  );
  (0, import_react6.useMemo)(() => {
    presenceChildren.forEach((_, key) => presenceChildren.set(key, false));
  }, [isPresent]);
  React2.useEffect(() => {
    !isPresent && !presenceChildren.size && onExitComplete && onExitComplete();
  }, [isPresent]);
  if (mode === "popLayout") {
    children = (0, import_jsx_runtime2.jsx)(PopChild, { isPresent, children });
  }
  return (0, import_jsx_runtime2.jsx)(PresenceContext.Provider, { value: context, children });
};
function newChildrenMap() {
  return /* @__PURE__ */ new Map();
}

// node_modules/framer-motion/dist/es/components/AnimatePresence/use-presence.mjs
var import_react7 = require("react");
function usePresence(subscribe = true) {
  const context = (0, import_react7.useContext)(PresenceContext);
  if (context === null)
    return [true, null];
  const { isPresent, onExitComplete, register } = context;
  const id3 = (0, import_react7.useId)();
  (0, import_react7.useEffect)(() => {
    if (subscribe)
      register(id3);
  }, [subscribe]);
  const safeToRemove = (0, import_react7.useCallback)(() => subscribe && onExitComplete && onExitComplete(id3), [id3, onExitComplete, subscribe]);
  return !isPresent && onExitComplete ? [false, safeToRemove] : [true];
}

// node_modules/framer-motion/dist/es/components/AnimatePresence/utils.mjs
var import_react8 = require("react");
var getChildKey = (child) => child.key || "";
function onlyElements(children) {
  const filtered = [];
  import_react8.Children.forEach(children, (child) => {
    if ((0, import_react8.isValidElement)(child))
      filtered.push(child);
  });
  return filtered;
}

// node_modules/framer-motion/dist/es/utils/use-isomorphic-effect.mjs
var import_react9 = require("react");

// node_modules/framer-motion/dist/es/utils/is-browser.mjs
var isBrowser = typeof window !== "undefined";

// node_modules/framer-motion/dist/es/utils/use-isomorphic-effect.mjs
var useIsomorphicLayoutEffect = isBrowser ? import_react9.useLayoutEffect : import_react9.useEffect;

// node_modules/framer-motion/dist/es/components/AnimatePresence/index.mjs
var AnimatePresence = ({ children, custom, initial = true, onExitComplete, presenceAffectsLayout = true, mode = "sync", propagate = false }) => {
  const [isParentPresent, safeToRemove] = usePresence(propagate);
  const presentChildren = (0, import_react10.useMemo)(() => onlyElements(children), [children]);
  const presentKeys = propagate && !isParentPresent ? [] : presentChildren.map(getChildKey);
  const isInitialRender = (0, import_react10.useRef)(true);
  const pendingPresentChildren = (0, import_react10.useRef)(presentChildren);
  const exitComplete = useConstant(() => /* @__PURE__ */ new Map());
  const [diffedChildren, setDiffedChildren] = (0, import_react10.useState)(presentChildren);
  const [renderedChildren, setRenderedChildren] = (0, import_react10.useState)(presentChildren);
  useIsomorphicLayoutEffect(() => {
    isInitialRender.current = false;
    pendingPresentChildren.current = presentChildren;
    for (let i = 0; i < renderedChildren.length; i++) {
      const key = getChildKey(renderedChildren[i]);
      if (!presentKeys.includes(key)) {
        if (exitComplete.get(key) !== true) {
          exitComplete.set(key, false);
        }
      } else {
        exitComplete.delete(key);
      }
    }
  }, [renderedChildren, presentKeys.length, presentKeys.join("-")]);
  const exitingChildren = [];
  if (presentChildren !== diffedChildren) {
    let nextChildren = [...presentChildren];
    for (let i = 0; i < renderedChildren.length; i++) {
      const child = renderedChildren[i];
      const key = getChildKey(child);
      if (!presentKeys.includes(key)) {
        nextChildren.splice(i, 0, child);
        exitingChildren.push(child);
      }
    }
    if (mode === "wait" && exitingChildren.length) {
      nextChildren = exitingChildren;
    }
    setRenderedChildren(onlyElements(nextChildren));
    setDiffedChildren(presentChildren);
    return;
  }
  if (false) {
    console.warn(`You're attempting to animate multiple children within AnimatePresence, but its mode is set to "wait". This will lead to odd visual behaviour.`);
  }
  const { forceRender } = (0, import_react10.useContext)(LayoutGroupContext);
  return (0, import_jsx_runtime3.jsx)(import_jsx_runtime3.Fragment, { children: renderedChildren.map((child) => {
    const key = getChildKey(child);
    const isPresent = propagate && !isParentPresent ? false : presentChildren === renderedChildren || presentKeys.includes(key);
    const onExit = () => {
      if (exitComplete.has(key)) {
        exitComplete.set(key, true);
      } else {
        return;
      }
      let isEveryExitComplete = true;
      exitComplete.forEach((isExitComplete) => {
        if (!isExitComplete)
          isEveryExitComplete = false;
      });
      if (isEveryExitComplete) {
        forceRender === null || forceRender === void 0 ? void 0 : forceRender();
        setRenderedChildren(pendingPresentChildren.current);
        propagate && (safeToRemove === null || safeToRemove === void 0 ? void 0 : safeToRemove());
        onExitComplete && onExitComplete();
      }
    };
    return (0, import_jsx_runtime3.jsx)(PresenceChild, { isPresent, initial: !isInitialRender.current || initial ? void 0 : false, custom: isPresent ? void 0 : custom, presenceAffectsLayout, mode, onExitComplete: isPresent ? void 0 : onExit, children: child }, key);
  }) });
};

// node_modules/motion-utils/dist/es/noop.mjs
var noop = /* @__NO_SIDE_EFFECTS__ */ (any) => any;

// node_modules/motion-utils/dist/es/errors.mjs
var warning = noop;
var invariant = noop;
if (false) {
  warning = (check, message) => {
    if (!check && typeof console !== "undefined") {
      console.warn(message);
    }
  };
  invariant = (check, message) => {
    if (!check) {
      throw new Error(message);
    }
  };
}

// node_modules/motion-utils/dist/es/memo.mjs
// @__NO_SIDE_EFFECTS__
function memo(callback) {
  let result;
  return () => {
    if (result === void 0)
      result = callback();
    return result;
  };
}

// node_modules/motion-utils/dist/es/progress.mjs
var progress = /* @__NO_SIDE_EFFECTS__ */ (from, to, value) => {
  const toFromDifference = to - from;
  return toFromDifference === 0 ? 1 : (value - from) / toFromDifference;
};

// node_modules/motion-utils/dist/es/time-conversion.mjs
var secondsToMilliseconds = /* @__NO_SIDE_EFFECTS__ */ (seconds) => seconds * 1e3;
var millisecondsToSeconds = /* @__NO_SIDE_EFFECTS__ */ (milliseconds) => milliseconds / 1e3;

// node_modules/framer-motion/dist/es/utils/GlobalConfig.mjs
var MotionGlobalConfig = {
  skipAnimations: false,
  useManualTiming: false
};

// node_modules/framer-motion/dist/es/frameloop/render-step.mjs
function createRenderStep(runNextFrame) {
  let thisFrame = /* @__PURE__ */ new Set();
  let nextFrame = /* @__PURE__ */ new Set();
  let isProcessing = false;
  let flushNextFrame = false;
  const toKeepAlive = /* @__PURE__ */ new WeakSet();
  let latestFrameData = {
    delta: 0,
    timestamp: 0,
    isProcessing: false
  };
  function triggerCallback(callback) {
    if (toKeepAlive.has(callback)) {
      step.schedule(callback);
      runNextFrame();
    }
    callback(latestFrameData);
  }
  const step = {
    /**
     * Schedule a process to run on the next frame.
     */
    schedule: (callback, keepAlive = false, immediate = false) => {
      const addToCurrentFrame = immediate && isProcessing;
      const queue = addToCurrentFrame ? thisFrame : nextFrame;
      if (keepAlive)
        toKeepAlive.add(callback);
      if (!queue.has(callback))
        queue.add(callback);
      return callback;
    },
    /**
     * Cancel the provided callback from running on the next frame.
     */
    cancel: (callback) => {
      nextFrame.delete(callback);
      toKeepAlive.delete(callback);
    },
    /**
     * Execute all schedule callbacks.
     */
    process: (frameData2) => {
      latestFrameData = frameData2;
      if (isProcessing) {
        flushNextFrame = true;
        return;
      }
      isProcessing = true;
      [thisFrame, nextFrame] = [nextFrame, thisFrame];
      thisFrame.forEach(triggerCallback);
      thisFrame.clear();
      isProcessing = false;
      if (flushNextFrame) {
        flushNextFrame = false;
        step.process(frameData2);
      }
    }
  };
  return step;
}

// node_modules/framer-motion/dist/es/frameloop/batcher.mjs
var stepsOrder = [
  "read",
  // Read
  "resolveKeyframes",
  // Write/Read/Write/Read
  "update",
  // Compute
  "preRender",
  // Compute
  "render",
  // Write
  "postRender"
  // Compute
];
var maxElapsed = 40;
function createRenderBatcher(scheduleNextBatch, allowKeepAlive) {
  let runNextFrame = false;
  let useDefaultElapsed = true;
  const state2 = {
    delta: 0,
    timestamp: 0,
    isProcessing: false
  };
  const flagRunNextFrame = () => runNextFrame = true;
  const steps = stepsOrder.reduce((acc, key) => {
    acc[key] = createRenderStep(flagRunNextFrame);
    return acc;
  }, {});
  const { read, resolveKeyframes, update, preRender, render, postRender } = steps;
  const processBatch = () => {
    const timestamp = MotionGlobalConfig.useManualTiming ? state2.timestamp : performance.now();
    runNextFrame = false;
    state2.delta = useDefaultElapsed ? 1e3 / 60 : Math.max(Math.min(timestamp - state2.timestamp, maxElapsed), 1);
    state2.timestamp = timestamp;
    state2.isProcessing = true;
    read.process(state2);
    resolveKeyframes.process(state2);
    update.process(state2);
    preRender.process(state2);
    render.process(state2);
    postRender.process(state2);
    state2.isProcessing = false;
    if (runNextFrame && allowKeepAlive) {
      useDefaultElapsed = false;
      scheduleNextBatch(processBatch);
    }
  };
  const wake = () => {
    runNextFrame = true;
    useDefaultElapsed = true;
    if (!state2.isProcessing) {
      scheduleNextBatch(processBatch);
    }
  };
  const schedule = stepsOrder.reduce((acc, key) => {
    const step = steps[key];
    acc[key] = (process2, keepAlive = false, immediate = false) => {
      if (!runNextFrame)
        wake();
      return step.schedule(process2, keepAlive, immediate);
    };
    return acc;
  }, {});
  const cancel = (process2) => {
    for (let i = 0; i < stepsOrder.length; i++) {
      steps[stepsOrder[i]].cancel(process2);
    }
  };
  return { schedule, cancel, state: state2, steps };
}

// node_modules/framer-motion/dist/es/frameloop/frame.mjs
var { schedule: frame, cancel: cancelFrame, state: frameData, steps: frameSteps } = createRenderBatcher(typeof requestAnimationFrame !== "undefined" ? requestAnimationFrame : noop, true);

// node_modules/framer-motion/dist/es/context/LazyContext.mjs
var import_react11 = require("react");
var LazyContext = (0, import_react11.createContext)({ strict: false });

// node_modules/framer-motion/dist/es/motion/features/definitions.mjs
var featureProps = {
  animation: [
    "animate",
    "variants",
    "whileHover",
    "whileTap",
    "exit",
    "whileInView",
    "whileFocus",
    "whileDrag"
  ],
  exit: ["exit"],
  drag: ["drag", "dragControls"],
  focus: ["whileFocus"],
  hover: ["whileHover", "onHoverStart", "onHoverEnd"],
  tap: ["whileTap", "onTap", "onTapStart", "onTapCancel"],
  pan: ["onPan", "onPanStart", "onPanSessionStart", "onPanEnd"],
  inView: ["whileInView", "onViewportEnter", "onViewportLeave"],
  layout: ["layout", "layoutId"]
};
var featureDefinitions = {};
for (const key in featureProps) {
  featureDefinitions[key] = {
    isEnabled: (props) => featureProps[key].some((name) => !!props[name])
  };
}

// node_modules/framer-motion/dist/es/motion/features/load-features.mjs
function loadFeatures(features) {
  for (const key in features) {
    featureDefinitions[key] = {
      ...featureDefinitions[key],
      ...features[key]
    };
  }
}

// node_modules/framer-motion/dist/es/motion/utils/valid-prop.mjs
var validMotionProps = /* @__PURE__ */ new Set([
  "animate",
  "exit",
  "variants",
  "initial",
  "style",
  "values",
  "variants",
  "transition",
  "transformTemplate",
  "custom",
  "inherit",
  "onBeforeLayoutMeasure",
  "onAnimationStart",
  "onAnimationComplete",
  "onUpdate",
  "onDragStart",
  "onDrag",
  "onDragEnd",
  "onMeasureDragConstraints",
  "onDirectionLock",
  "onDragTransitionEnd",
  "_dragX",
  "_dragY",
  "onHoverStart",
  "onHoverEnd",
  "onViewportEnter",
  "onViewportLeave",
  "globalTapTarget",
  "ignoreStrict",
  "viewport"
]);
function isValidMotionProp(key) {
  return key.startsWith("while") || key.startsWith("drag") && key !== "draggable" || key.startsWith("layout") || key.startsWith("onTap") || key.startsWith("onPan") || key.startsWith("onLayout") || validMotionProps.has(key);
}

// node_modules/framer-motion/dist/es/render/dom/utils/filter-props.mjs
var shouldForward = (key) => !isValidMotionProp(key);
function loadExternalIsValidProp(isValidProp) {
  if (!isValidProp)
    return;
  shouldForward = (key) => key.startsWith("on") ? !isValidMotionProp(key) : isValidProp(key);
}
try {
  loadExternalIsValidProp(require("@emotion/is-prop-valid").default);
} catch (_a) {
}
function filterProps(props, isDom, forwardMotionProps) {
  const filteredProps = {};
  for (const key in props) {
    if (key === "values" && typeof props.values === "object")
      continue;
    if (shouldForward(key) || forwardMotionProps === true && isValidMotionProp(key) || !isDom && !isValidMotionProp(key) || // If trying to use native HTML drag events, forward drag listeners
    props["draggable"] && key.startsWith("onDrag")) {
      filteredProps[key] = props[key];
    }
  }
  return filteredProps;
}

// node_modules/framer-motion/dist/es/render/components/create-proxy.mjs
function createDOMMotionComponentProxy(componentFactory) {
  if (typeof Proxy === "undefined") {
    return componentFactory;
  }
  const componentCache = /* @__PURE__ */ new Map();
  const deprecatedFactoryFunction = (...args) => {
    if (false) {
      warnOnce(false, "motion() is deprecated. Use motion.create() instead.");
    }
    return componentFactory(...args);
  };
  return new Proxy(deprecatedFactoryFunction, {
    /**
     * Called when `motion` is referenced with a prop: `motion.div`, `motion.input` etc.
     * The prop name is passed through as `key` and we can use that to generate a `motion`
     * DOM component with that name.
     */
    get: (_target, key) => {
      if (key === "create")
        return componentFactory;
      if (!componentCache.has(key)) {
        componentCache.set(key, componentFactory(key));
      }
      return componentCache.get(key);
    }
  });
}

// node_modules/framer-motion/dist/es/motion/index.mjs
var import_jsx_runtime4 = require("react/jsx-runtime");
var import_react17 = require("react");

// node_modules/framer-motion/dist/es/context/MotionContext/index.mjs
var import_react12 = require("react");
var MotionContext = (0, import_react12.createContext)({});

// node_modules/framer-motion/dist/es/context/MotionContext/create.mjs
var import_react13 = require("react");

// node_modules/framer-motion/dist/es/render/utils/is-variant-label.mjs
function isVariantLabel(v) {
  return typeof v === "string" || Array.isArray(v);
}

// node_modules/framer-motion/dist/es/animation/utils/is-animation-controls.mjs
function isAnimationControls(v) {
  return v !== null && typeof v === "object" && typeof v.start === "function";
}

// node_modules/framer-motion/dist/es/render/utils/variant-props.mjs
var variantPriorityOrder = [
  "animate",
  "whileInView",
  "whileFocus",
  "whileHover",
  "whileTap",
  "whileDrag",
  "exit"
];
var variantProps = ["initial", ...variantPriorityOrder];

// node_modules/framer-motion/dist/es/render/utils/is-controlling-variants.mjs
function isControllingVariants(props) {
  return isAnimationControls(props.animate) || variantProps.some((name) => isVariantLabel(props[name]));
}
function isVariantNode(props) {
  return Boolean(isControllingVariants(props) || props.variants);
}

// node_modules/framer-motion/dist/es/context/MotionContext/utils.mjs
function getCurrentTreeVariants(props, context) {
  if (isControllingVariants(props)) {
    const { initial, animate } = props;
    return {
      initial: initial === false || isVariantLabel(initial) ? initial : void 0,
      animate: isVariantLabel(animate) ? animate : void 0
    };
  }
  return props.inherit !== false ? context : {};
}

// node_modules/framer-motion/dist/es/context/MotionContext/create.mjs
function useCreateMotionContext(props) {
  const { initial, animate } = getCurrentTreeVariants(props, (0, import_react13.useContext)(MotionContext));
  return (0, import_react13.useMemo)(() => ({ initial, animate }), [variantLabelsAsDependency(initial), variantLabelsAsDependency(animate)]);
}
function variantLabelsAsDependency(prop) {
  return Array.isArray(prop) ? prop.join(" ") : prop;
}

// node_modules/framer-motion/dist/es/motion/utils/symbol.mjs
var motionComponentSymbol = Symbol.for("motionComponentSymbol");

// node_modules/framer-motion/dist/es/motion/utils/use-motion-ref.mjs
var import_react14 = require("react");

// node_modules/framer-motion/dist/es/utils/is-ref-object.mjs
function isRefObject(ref) {
  return ref && typeof ref === "object" && Object.prototype.hasOwnProperty.call(ref, "current");
}

// node_modules/framer-motion/dist/es/motion/utils/use-motion-ref.mjs
function useMotionRef(visualState, visualElement, externalRef) {
  return (0, import_react14.useCallback)(
    (instance) => {
      if (instance) {
        visualState.onMount && visualState.onMount(instance);
      }
      if (visualElement) {
        if (instance) {
          visualElement.mount(instance);
        } else {
          visualElement.unmount();
        }
      }
      if (externalRef) {
        if (typeof externalRef === "function") {
          externalRef(instance);
        } else if (isRefObject(externalRef)) {
          externalRef.current = instance;
        }
      }
    },
    /**
     * Only pass a new ref callback to React if we've received a visual element
     * factory. Otherwise we'll be mounting/remounting every time externalRef
     * or other dependencies change.
     */
    [visualElement]
  );
}

// node_modules/framer-motion/dist/es/motion/utils/use-visual-element.mjs
var import_react16 = require("react");

// node_modules/framer-motion/dist/es/render/dom/utils/camel-to-dash.mjs
var camelToDash = (str) => str.replace(/([a-z])([A-Z])/gu, "$1-$2").toLowerCase();

// node_modules/framer-motion/dist/es/animation/optimized-appear/data-id.mjs
var optimizedAppearDataId = "framerAppearId";
var optimizedAppearDataAttribute = "data-" + camelToDash(optimizedAppearDataId);

// node_modules/framer-motion/dist/es/frameloop/microtask.mjs
var { schedule: microtask, cancel: cancelMicrotask } = createRenderBatcher(queueMicrotask, false);

// node_modules/framer-motion/dist/es/context/SwitchLayoutGroupContext.mjs
var import_react15 = require("react");
var SwitchLayoutGroupContext = (0, import_react15.createContext)({});

// node_modules/framer-motion/dist/es/motion/utils/use-visual-element.mjs
function useVisualElement(Component4, visualState, props, createVisualElement, ProjectionNodeConstructor) {
  var _a, _b;
  const { visualElement: parent } = (0, import_react16.useContext)(MotionContext);
  const lazyContext = (0, import_react16.useContext)(LazyContext);
  const presenceContext = (0, import_react16.useContext)(PresenceContext);
  const reducedMotionConfig = (0, import_react16.useContext)(MotionConfigContext).reducedMotion;
  const visualElementRef = (0, import_react16.useRef)(null);
  createVisualElement = createVisualElement || lazyContext.renderer;
  if (!visualElementRef.current && createVisualElement) {
    visualElementRef.current = createVisualElement(Component4, {
      visualState,
      parent,
      props,
      presenceContext,
      blockInitialAnimation: presenceContext ? presenceContext.initial === false : false,
      reducedMotionConfig
    });
  }
  const visualElement = visualElementRef.current;
  const initialLayoutGroupConfig = (0, import_react16.useContext)(SwitchLayoutGroupContext);
  if (visualElement && !visualElement.projection && ProjectionNodeConstructor && (visualElement.type === "html" || visualElement.type === "svg")) {
    createProjectionNode(visualElementRef.current, props, ProjectionNodeConstructor, initialLayoutGroupConfig);
  }
  const isMounted = (0, import_react16.useRef)(false);
  (0, import_react16.useInsertionEffect)(() => {
    if (visualElement && isMounted.current) {
      visualElement.update(props, presenceContext);
    }
  });
  const optimisedAppearId = props[optimizedAppearDataAttribute];
  const wantsHandoff = (0, import_react16.useRef)(Boolean(optimisedAppearId) && !((_a = window.MotionHandoffIsComplete) === null || _a === void 0 ? void 0 : _a.call(window, optimisedAppearId)) && ((_b = window.MotionHasOptimisedAnimation) === null || _b === void 0 ? void 0 : _b.call(window, optimisedAppearId)));
  useIsomorphicLayoutEffect(() => {
    if (!visualElement)
      return;
    isMounted.current = true;
    window.MotionIsMounted = true;
    visualElement.updateFeatures();
    microtask.render(visualElement.render);
    if (wantsHandoff.current && visualElement.animationState) {
      visualElement.animationState.animateChanges();
    }
  });
  (0, import_react16.useEffect)(() => {
    if (!visualElement)
      return;
    if (!wantsHandoff.current && visualElement.animationState) {
      visualElement.animationState.animateChanges();
    }
    if (wantsHandoff.current) {
      queueMicrotask(() => {
        var _a2;
        (_a2 = window.MotionHandoffMarkAsComplete) === null || _a2 === void 0 ? void 0 : _a2.call(window, optimisedAppearId);
      });
      wantsHandoff.current = false;
    }
  });
  return visualElement;
}
function createProjectionNode(visualElement, props, ProjectionNodeConstructor, initialPromotionConfig) {
  const { layoutId, layout: layout2, drag: drag2, dragConstraints, layoutScroll, layoutRoot } = props;
  visualElement.projection = new ProjectionNodeConstructor(visualElement.latestValues, props["data-framer-portal-id"] ? void 0 : getClosestProjectingNode(visualElement.parent));
  visualElement.projection.setOptions({
    layoutId,
    layout: layout2,
    alwaysMeasureLayout: Boolean(drag2) || dragConstraints && isRefObject(dragConstraints),
    visualElement,
    /**
     * TODO: Update options in an effect. This could be tricky as it'll be too late
     * to update by the time layout animations run.
     * We also need to fix this safeToRemove by linking it up to the one returned by usePresence,
     * ensuring it gets called if there's no potential layout animations.
     *
     */
    animationType: typeof layout2 === "string" ? layout2 : "both",
    initialPromotionConfig,
    layoutScroll,
    layoutRoot
  });
}
function getClosestProjectingNode(visualElement) {
  if (!visualElement)
    return void 0;
  return visualElement.options.allowProjection !== false ? visualElement.projection : getClosestProjectingNode(visualElement.parent);
}

// node_modules/framer-motion/dist/es/motion/index.mjs
function createRendererMotionComponent({ preloadedFeatures, createVisualElement, useRender, useVisualState, Component: Component4 }) {
  var _a, _b;
  preloadedFeatures && loadFeatures(preloadedFeatures);
  function MotionComponent(props, externalRef) {
    let MeasureLayout2;
    const configAndProps = {
      ...(0, import_react17.useContext)(MotionConfigContext),
      ...props,
      layoutId: useLayoutId(props)
    };
    const { isStatic } = configAndProps;
    const context = useCreateMotionContext(props);
    const visualState = useVisualState(props, isStatic);
    if (!isStatic && isBrowser) {
      useStrictMode(configAndProps, preloadedFeatures);
      const layoutProjection = getProjectionFunctionality(configAndProps);
      MeasureLayout2 = layoutProjection.MeasureLayout;
      context.visualElement = useVisualElement(Component4, visualState, configAndProps, createVisualElement, layoutProjection.ProjectionNode);
    }
    return (0, import_jsx_runtime4.jsxs)(MotionContext.Provider, { value: context, children: [MeasureLayout2 && context.visualElement ? (0, import_jsx_runtime4.jsx)(MeasureLayout2, { visualElement: context.visualElement, ...configAndProps }) : null, useRender(Component4, props, useMotionRef(visualState, context.visualElement, externalRef), visualState, isStatic, context.visualElement)] });
  }
  MotionComponent.displayName = `motion.${typeof Component4 === "string" ? Component4 : `create(${(_b = (_a = Component4.displayName) !== null && _a !== void 0 ? _a : Component4.name) !== null && _b !== void 0 ? _b : ""})`}`;
  const ForwardRefMotionComponent = (0, import_react17.forwardRef)(MotionComponent);
  ForwardRefMotionComponent[motionComponentSymbol] = Component4;
  return ForwardRefMotionComponent;
}
function useLayoutId({ layoutId }) {
  const layoutGroupId = (0, import_react17.useContext)(LayoutGroupContext).id;
  return layoutGroupId && layoutId !== void 0 ? layoutGroupId + "-" + layoutId : layoutId;
}
function useStrictMode(configAndProps, preloadedFeatures) {
  const isStrict = (0, import_react17.useContext)(LazyContext).strict;
  if (false) {
    const strictMessage = "You have rendered a `motion` component within a `LazyMotion` component. This will break tree shaking. Import and render a `m` component instead.";
    configAndProps.ignoreStrict ? warning(false, strictMessage) : invariant(false, strictMessage);
  }
}
function getProjectionFunctionality(props) {
  const { drag: drag2, layout: layout2 } = featureDefinitions;
  if (!drag2 && !layout2)
    return {};
  const combined = { ...drag2, ...layout2 };
  return {
    MeasureLayout: (drag2 === null || drag2 === void 0 ? void 0 : drag2.isEnabled(props)) || (layout2 === null || layout2 === void 0 ? void 0 : layout2.isEnabled(props)) ? combined.MeasureLayout : void 0,
    ProjectionNode: combined.ProjectionNode
  };
}

// node_modules/framer-motion/dist/es/render/svg/lowercase-elements.mjs
var lowercaseSVGElements = [
  "animate",
  "circle",
  "defs",
  "desc",
  "ellipse",
  "g",
  "image",
  "line",
  "filter",
  "marker",
  "mask",
  "metadata",
  "path",
  "pattern",
  "polygon",
  "polyline",
  "rect",
  "stop",
  "switch",
  "symbol",
  "svg",
  "text",
  "tspan",
  "use",
  "view"
];

// node_modules/framer-motion/dist/es/render/dom/utils/is-svg-component.mjs
function isSVGComponent(Component4) {
  if (
    /**
     * If it's not a string, it's a custom React component. Currently we only support
     * HTML custom React components.
     */
    typeof Component4 !== "string" || /**
     * If it contains a dash, the element is a custom HTML webcomponent.
     */
    Component4.includes("-")
  ) {
    return false;
  } else if (
    /**
     * If it's in our list of lowercase SVG tags, it's an SVG component
     */
    lowercaseSVGElements.indexOf(Component4) > -1 || /**
     * If it contains a capital letter, it's an SVG component
     */
    /[A-Z]/u.test(Component4)
  ) {
    return true;
  }
  return false;
}

// node_modules/framer-motion/dist/es/motion/utils/use-visual-state.mjs
var import_react18 = require("react");

// node_modules/framer-motion/dist/es/render/utils/resolve-variants.mjs
function getValueState(visualElement) {
  const state2 = [{}, {}];
  visualElement === null || visualElement === void 0 ? void 0 : visualElement.values.forEach((value, key) => {
    state2[0][key] = value.get();
    state2[1][key] = value.getVelocity();
  });
  return state2;
}
function resolveVariantFromProps(props, definition, custom, visualElement) {
  if (typeof definition === "function") {
    const [current, velocity] = getValueState(visualElement);
    definition = definition(custom !== void 0 ? custom : props.custom, current, velocity);
  }
  if (typeof definition === "string") {
    definition = props.variants && props.variants[definition];
  }
  if (typeof definition === "function") {
    const [current, velocity] = getValueState(visualElement);
    definition = definition(custom !== void 0 ? custom : props.custom, current, velocity);
  }
  return definition;
}

// node_modules/framer-motion/dist/es/animation/utils/is-keyframes-target.mjs
var isKeyframesTarget = (v) => {
  return Array.isArray(v);
};

// node_modules/framer-motion/dist/es/utils/resolve-value.mjs
var isCustomValue = (v) => {
  return Boolean(v && typeof v === "object" && v.mix && v.toValue);
};
var resolveFinalValueInKeyframes = (v) => {
  return isKeyframesTarget(v) ? v[v.length - 1] || 0 : v;
};

// node_modules/framer-motion/dist/es/value/utils/is-motion-value.mjs
var isMotionValue = (value) => Boolean(value && value.getVelocity);

// node_modules/framer-motion/dist/es/value/utils/resolve-motion-value.mjs
function resolveMotionValue(value) {
  const unwrappedValue = isMotionValue(value) ? value.get() : value;
  return isCustomValue(unwrappedValue) ? unwrappedValue.toValue() : unwrappedValue;
}

// node_modules/framer-motion/dist/es/motion/utils/use-visual-state.mjs
function makeState({ scrapeMotionValuesFromProps: scrapeMotionValuesFromProps3, createRenderState, onUpdate }, props, context, presenceContext) {
  const state2 = {
    latestValues: makeLatestValues(props, context, presenceContext, scrapeMotionValuesFromProps3),
    renderState: createRenderState()
  };
  if (onUpdate) {
    state2.onMount = (instance) => onUpdate({ props, current: instance, ...state2 });
    state2.onUpdate = (visualElement) => onUpdate(visualElement);
  }
  return state2;
}
var makeUseVisualState = (config) => (props, isStatic) => {
  const context = (0, import_react18.useContext)(MotionContext);
  const presenceContext = (0, import_react18.useContext)(PresenceContext);
  const make = () => makeState(config, props, context, presenceContext);
  return isStatic ? make() : useConstant(make);
};
function makeLatestValues(props, context, presenceContext, scrapeMotionValues) {
  const values = {};
  const motionValues = scrapeMotionValues(props, {});
  for (const key in motionValues) {
    values[key] = resolveMotionValue(motionValues[key]);
  }
  let { initial, animate } = props;
  const isControllingVariants$1 = isControllingVariants(props);
  const isVariantNode$1 = isVariantNode(props);
  if (context && isVariantNode$1 && !isControllingVariants$1 && props.inherit !== false) {
    if (initial === void 0)
      initial = context.initial;
    if (animate === void 0)
      animate = context.animate;
  }
  let isInitialAnimationBlocked = presenceContext ? presenceContext.initial === false : false;
  isInitialAnimationBlocked = isInitialAnimationBlocked || initial === false;
  const variantToSet = isInitialAnimationBlocked ? animate : initial;
  if (variantToSet && typeof variantToSet !== "boolean" && !isAnimationControls(variantToSet)) {
    const list2 = Array.isArray(variantToSet) ? variantToSet : [variantToSet];
    for (let i = 0; i < list2.length; i++) {
      const resolved = resolveVariantFromProps(props, list2[i]);
      if (resolved) {
        const { transitionEnd, transition, ...target } = resolved;
        for (const key in target) {
          let valueTarget = target[key];
          if (Array.isArray(valueTarget)) {
            const index = isInitialAnimationBlocked ? valueTarget.length - 1 : 0;
            valueTarget = valueTarget[index];
          }
          if (valueTarget !== null) {
            values[key] = valueTarget;
          }
        }
        for (const key in transitionEnd) {
          values[key] = transitionEnd[key];
        }
      }
    }
  }
  return values;
}

// node_modules/framer-motion/dist/es/render/html/utils/keys-transform.mjs
var transformPropOrder = [
  "transformPerspective",
  "x",
  "y",
  "z",
  "translateX",
  "translateY",
  "translateZ",
  "scale",
  "scaleX",
  "scaleY",
  "rotate",
  "rotateX",
  "rotateY",
  "rotateZ",
  "skew",
  "skewX",
  "skewY"
];
var transformProps = new Set(transformPropOrder);

// node_modules/framer-motion/dist/es/render/dom/utils/is-css-variable.mjs
var checkStringStartsWith = (token) => (key) => typeof key === "string" && key.startsWith(token);
var isCSSVariableName = /* @__PURE__ */ checkStringStartsWith("--");
var startsAsVariableToken = /* @__PURE__ */ checkStringStartsWith("var(--");
var isCSSVariableToken = (value) => {
  const startsWithToken = startsAsVariableToken(value);
  if (!startsWithToken)
    return false;
  return singleCssVariableRegex.test(value.split("/*")[0].trim());
};
var singleCssVariableRegex = /var\(--(?:[\w-]+\s*|[\w-]+\s*,(?:\s*[^)(\s]|\s*\((?:[^)(]|\([^)(]*\))*\))+\s*)\)$/iu;

// node_modules/framer-motion/dist/es/render/dom/value-types/get-as-type.mjs
var getValueAsType = (value, type) => {
  return type && typeof value === "number" ? type.transform(value) : value;
};

// node_modules/framer-motion/dist/es/utils/clamp.mjs
var clamp = (min, max, v) => {
  if (v > max)
    return max;
  if (v < min)
    return min;
  return v;
};

// node_modules/framer-motion/dist/es/value/types/numbers/index.mjs
var number = {
  test: (v) => typeof v === "number",
  parse: parseFloat,
  transform: (v) => v
};
var alpha = {
  ...number,
  transform: (v) => clamp(0, 1, v)
};
var scale = {
  ...number,
  default: 1
};

// node_modules/framer-motion/dist/es/value/types/numbers/units.mjs
var createUnitType = (unit) => ({
  test: (v) => typeof v === "string" && v.endsWith(unit) && v.split(" ").length === 1,
  parse: parseFloat,
  transform: (v) => `${v}${unit}`
});
var degrees = /* @__PURE__ */ createUnitType("deg");
var percent = /* @__PURE__ */ createUnitType("%");
var px = /* @__PURE__ */ createUnitType("px");
var vh = /* @__PURE__ */ createUnitType("vh");
var vw = /* @__PURE__ */ createUnitType("vw");
var progressPercentage = {
  ...percent,
  parse: (v) => percent.parse(v) / 100,
  transform: (v) => percent.transform(v * 100)
};

// node_modules/framer-motion/dist/es/render/dom/value-types/number-browser.mjs
var browserNumberValueTypes = {
  // Border props
  borderWidth: px,
  borderTopWidth: px,
  borderRightWidth: px,
  borderBottomWidth: px,
  borderLeftWidth: px,
  borderRadius: px,
  radius: px,
  borderTopLeftRadius: px,
  borderTopRightRadius: px,
  borderBottomRightRadius: px,
  borderBottomLeftRadius: px,
  // Positioning props
  width: px,
  maxWidth: px,
  height: px,
  maxHeight: px,
  top: px,
  right: px,
  bottom: px,
  left: px,
  // Spacing props
  padding: px,
  paddingTop: px,
  paddingRight: px,
  paddingBottom: px,
  paddingLeft: px,
  margin: px,
  marginTop: px,
  marginRight: px,
  marginBottom: px,
  marginLeft: px,
  // Misc
  backgroundPositionX: px,
  backgroundPositionY: px
};

// node_modules/framer-motion/dist/es/render/dom/value-types/transform.mjs
var transformValueTypes = {
  rotate: degrees,
  rotateX: degrees,
  rotateY: degrees,
  rotateZ: degrees,
  scale,
  scaleX: scale,
  scaleY: scale,
  scaleZ: scale,
  skew: degrees,
  skewX: degrees,
  skewY: degrees,
  distance: px,
  translateX: px,
  translateY: px,
  translateZ: px,
  x: px,
  y: px,
  z: px,
  perspective: px,
  transformPerspective: px,
  opacity: alpha,
  originX: progressPercentage,
  originY: progressPercentage,
  originZ: px
};

// node_modules/framer-motion/dist/es/render/dom/value-types/type-int.mjs
var int = {
  ...number,
  transform: Math.round
};

// node_modules/framer-motion/dist/es/render/dom/value-types/number.mjs
var numberValueTypes = {
  ...browserNumberValueTypes,
  ...transformValueTypes,
  zIndex: int,
  size: px,
  // SVG
  fillOpacity: alpha,
  strokeOpacity: alpha,
  numOctaves: int
};

// node_modules/framer-motion/dist/es/render/html/utils/build-transform.mjs
var translateAlias = {
  x: "translateX",
  y: "translateY",
  z: "translateZ",
  transformPerspective: "perspective"
};
var numTransforms = transformPropOrder.length;
function buildTransform(latestValues, transform, transformTemplate) {
  let transformString = "";
  let transformIsDefault = true;
  for (let i = 0; i < numTransforms; i++) {
    const key = transformPropOrder[i];
    const value = latestValues[key];
    if (value === void 0)
      continue;
    let valueIsDefault = true;
    if (typeof value === "number") {
      valueIsDefault = value === (key.startsWith("scale") ? 1 : 0);
    } else {
      valueIsDefault = parseFloat(value) === 0;
    }
    if (!valueIsDefault || transformTemplate) {
      const valueAsType = getValueAsType(value, numberValueTypes[key]);
      if (!valueIsDefault) {
        transformIsDefault = false;
        const transformName = translateAlias[key] || key;
        transformString += `${transformName}(${valueAsType}) `;
      }
      if (transformTemplate) {
        transform[key] = valueAsType;
      }
    }
  }
  transformString = transformString.trim();
  if (transformTemplate) {
    transformString = transformTemplate(transform, transformIsDefault ? "" : transformString);
  } else if (transformIsDefault) {
    transformString = "none";
  }
  return transformString;
}

// node_modules/framer-motion/dist/es/render/html/utils/build-styles.mjs
function buildHTMLStyles(state2, latestValues, transformTemplate) {
  const { style, vars, transformOrigin } = state2;
  let hasTransform2 = false;
  let hasTransformOrigin = false;
  for (const key in latestValues) {
    const value = latestValues[key];
    if (transformProps.has(key)) {
      hasTransform2 = true;
      continue;
    } else if (isCSSVariableName(key)) {
      vars[key] = value;
      continue;
    } else {
      const valueAsType = getValueAsType(value, numberValueTypes[key]);
      if (key.startsWith("origin")) {
        hasTransformOrigin = true;
        transformOrigin[key] = valueAsType;
      } else {
        style[key] = valueAsType;
      }
    }
  }
  if (!latestValues.transform) {
    if (hasTransform2 || transformTemplate) {
      style.transform = buildTransform(latestValues, state2.transform, transformTemplate);
    } else if (style.transform) {
      style.transform = "none";
    }
  }
  if (hasTransformOrigin) {
    const { originX = "50%", originY = "50%", originZ = 0 } = transformOrigin;
    style.transformOrigin = `${originX} ${originY} ${originZ}`;
  }
}

// node_modules/framer-motion/dist/es/render/svg/utils/path.mjs
var dashKeys = {
  offset: "stroke-dashoffset",
  array: "stroke-dasharray"
};
var camelKeys = {
  offset: "strokeDashoffset",
  array: "strokeDasharray"
};
function buildSVGPath(attrs, length, spacing = 1, offset = 0, useDashCase = true) {
  attrs.pathLength = 1;
  const keys = useDashCase ? dashKeys : camelKeys;
  attrs[keys.offset] = px.transform(-offset);
  const pathLength = px.transform(length);
  const pathSpacing = px.transform(spacing);
  attrs[keys.array] = `${pathLength} ${pathSpacing}`;
}

// node_modules/framer-motion/dist/es/render/svg/utils/transform-origin.mjs
function calcOrigin(origin, offset, size) {
  return typeof origin === "string" ? origin : px.transform(offset + size * origin);
}
function calcSVGTransformOrigin(dimensions, originX, originY) {
  const pxOriginX = calcOrigin(originX, dimensions.x, dimensions.width);
  const pxOriginY = calcOrigin(originY, dimensions.y, dimensions.height);
  return `${pxOriginX} ${pxOriginY}`;
}

// node_modules/framer-motion/dist/es/render/svg/utils/build-attrs.mjs
function buildSVGAttrs(state2, {
  attrX,
  attrY,
  attrScale,
  originX,
  originY,
  pathLength,
  pathSpacing = 1,
  pathOffset = 0,
  // This is object creation, which we try to avoid per-frame.
  ...latest
}, isSVGTag2, transformTemplate) {
  buildHTMLStyles(state2, latest, transformTemplate);
  if (isSVGTag2) {
    if (state2.style.viewBox) {
      state2.attrs.viewBox = state2.style.viewBox;
    }
    return;
  }
  state2.attrs = state2.style;
  state2.style = {};
  const { attrs, style, dimensions } = state2;
  if (attrs.transform) {
    if (dimensions)
      style.transform = attrs.transform;
    delete attrs.transform;
  }
  if (dimensions && (originX !== void 0 || originY !== void 0 || style.transform)) {
    style.transformOrigin = calcSVGTransformOrigin(dimensions, originX !== void 0 ? originX : 0.5, originY !== void 0 ? originY : 0.5);
  }
  if (attrX !== void 0)
    attrs.x = attrX;
  if (attrY !== void 0)
    attrs.y = attrY;
  if (attrScale !== void 0)
    attrs.scale = attrScale;
  if (pathLength !== void 0) {
    buildSVGPath(attrs, pathLength, pathSpacing, pathOffset, false);
  }
}

// node_modules/framer-motion/dist/es/render/html/utils/create-render-state.mjs
var createHtmlRenderState = () => ({
  style: {},
  transform: {},
  transformOrigin: {},
  vars: {}
});

// node_modules/framer-motion/dist/es/render/svg/utils/create-render-state.mjs
var createSvgRenderState = () => ({
  ...createHtmlRenderState(),
  attrs: {}
});

// node_modules/framer-motion/dist/es/render/svg/utils/is-svg-tag.mjs
var isSVGTag = (tag2) => typeof tag2 === "string" && tag2.toLowerCase() === "svg";

// node_modules/framer-motion/dist/es/render/html/utils/render.mjs
function renderHTML(element, { style, vars }, styleProp, projection) {
  Object.assign(element.style, style, projection && projection.getProjectionStyles(styleProp));
  for (const key in vars) {
    element.style.setProperty(key, vars[key]);
  }
}

// node_modules/framer-motion/dist/es/render/svg/utils/camel-case-attrs.mjs
var camelCaseAttributes = /* @__PURE__ */ new Set([
  "baseFrequency",
  "diffuseConstant",
  "kernelMatrix",
  "kernelUnitLength",
  "keySplines",
  "keyTimes",
  "limitingConeAngle",
  "markerHeight",
  "markerWidth",
  "numOctaves",
  "targetX",
  "targetY",
  "surfaceScale",
  "specularConstant",
  "specularExponent",
  "stdDeviation",
  "tableValues",
  "viewBox",
  "gradientTransform",
  "pathLength",
  "startOffset",
  "textLength",
  "lengthAdjust"
]);

// node_modules/framer-motion/dist/es/render/svg/utils/render.mjs
function renderSVG(element, renderState, _styleProp, projection) {
  renderHTML(element, renderState, void 0, projection);
  for (const key in renderState.attrs) {
    element.setAttribute(!camelCaseAttributes.has(key) ? camelToDash(key) : key, renderState.attrs[key]);
  }
}

// node_modules/framer-motion/dist/es/projection/styles/scale-correction.mjs
var scaleCorrectors = {};
function addScaleCorrector(correctors) {
  Object.assign(scaleCorrectors, correctors);
}

// node_modules/framer-motion/dist/es/motion/utils/is-forced-motion-value.mjs
function isForcedMotionValue(key, { layout: layout2, layoutId }) {
  return transformProps.has(key) || key.startsWith("origin") || (layout2 || layoutId !== void 0) && (!!scaleCorrectors[key] || key === "opacity");
}

// node_modules/framer-motion/dist/es/render/html/utils/scrape-motion-values.mjs
function scrapeMotionValuesFromProps(props, prevProps, visualElement) {
  var _a;
  const { style } = props;
  const newValues = {};
  for (const key in style) {
    if (isMotionValue(style[key]) || prevProps.style && isMotionValue(prevProps.style[key]) || isForcedMotionValue(key, props) || ((_a = visualElement === null || visualElement === void 0 ? void 0 : visualElement.getValue(key)) === null || _a === void 0 ? void 0 : _a.liveStyle) !== void 0) {
      newValues[key] = style[key];
    }
  }
  return newValues;
}

// node_modules/framer-motion/dist/es/render/svg/utils/scrape-motion-values.mjs
function scrapeMotionValuesFromProps2(props, prevProps, visualElement) {
  const newValues = scrapeMotionValuesFromProps(props, prevProps, visualElement);
  for (const key in props) {
    if (isMotionValue(props[key]) || isMotionValue(prevProps[key])) {
      const targetKey = transformPropOrder.indexOf(key) !== -1 ? "attr" + key.charAt(0).toUpperCase() + key.substring(1) : key;
      newValues[targetKey] = props[key];
    }
  }
  return newValues;
}

// node_modules/framer-motion/dist/es/render/svg/config-motion.mjs
function updateSVGDimensions(instance, renderState) {
  try {
    renderState.dimensions = typeof instance.getBBox === "function" ? instance.getBBox() : instance.getBoundingClientRect();
  } catch (e) {
    renderState.dimensions = {
      x: 0,
      y: 0,
      width: 0,
      height: 0
    };
  }
}
var layoutProps = ["x", "y", "width", "height", "cx", "cy", "r"];
var svgMotionConfig = {
  useVisualState: makeUseVisualState({
    scrapeMotionValuesFromProps: scrapeMotionValuesFromProps2,
    createRenderState: createSvgRenderState,
    onUpdate: ({ props, prevProps, current, renderState, latestValues }) => {
      if (!current)
        return;
      let hasTransform2 = !!props.drag;
      if (!hasTransform2) {
        for (const key in latestValues) {
          if (transformProps.has(key)) {
            hasTransform2 = true;
            break;
          }
        }
      }
      if (!hasTransform2)
        return;
      let needsMeasure = !prevProps;
      if (prevProps) {
        for (let i = 0; i < layoutProps.length; i++) {
          const key = layoutProps[i];
          if (props[key] !== prevProps[key]) {
            needsMeasure = true;
          }
        }
      }
      if (!needsMeasure)
        return;
      frame.read(() => {
        updateSVGDimensions(current, renderState);
        frame.render(() => {
          buildSVGAttrs(renderState, latestValues, isSVGTag(current.tagName), props.transformTemplate);
          renderSVG(current, renderState);
        });
      });
    }
  })
};

// node_modules/framer-motion/dist/es/render/html/config-motion.mjs
var htmlMotionConfig = {
  useVisualState: makeUseVisualState({
    scrapeMotionValuesFromProps,
    createRenderState: createHtmlRenderState
  })
};

// node_modules/framer-motion/dist/es/render/dom/use-render.mjs
var import_react21 = require("react");

// node_modules/framer-motion/dist/es/render/html/use-props.mjs
var import_react19 = require("react");
function copyRawValuesOnly(target, source, props) {
  for (const key in source) {
    if (!isMotionValue(source[key]) && !isForcedMotionValue(key, props)) {
      target[key] = source[key];
    }
  }
}
function useInitialMotionValues({ transformTemplate }, visualState) {
  return (0, import_react19.useMemo)(() => {
    const state2 = createHtmlRenderState();
    buildHTMLStyles(state2, visualState, transformTemplate);
    return Object.assign({}, state2.vars, state2.style);
  }, [visualState]);
}
function useStyle(props, visualState) {
  const styleProp = props.style || {};
  const style = {};
  copyRawValuesOnly(style, styleProp, props);
  Object.assign(style, useInitialMotionValues(props, visualState));
  return style;
}
function useHTMLProps(props, visualState) {
  const htmlProps = {};
  const style = useStyle(props, visualState);
  if (props.drag && props.dragListener !== false) {
    htmlProps.draggable = false;
    style.userSelect = style.WebkitUserSelect = style.WebkitTouchCallout = "none";
    style.touchAction = props.drag === true ? "none" : `pan-${props.drag === "x" ? "y" : "x"}`;
  }
  if (props.tabIndex === void 0 && (props.onTap || props.onTapStart || props.whileTap)) {
    htmlProps.tabIndex = 0;
  }
  htmlProps.style = style;
  return htmlProps;
}

// node_modules/framer-motion/dist/es/render/svg/use-props.mjs
var import_react20 = require("react");
function useSVGProps(props, visualState, _isStatic, Component4) {
  const visualProps = (0, import_react20.useMemo)(() => {
    const state2 = createSvgRenderState();
    buildSVGAttrs(state2, visualState, isSVGTag(Component4), props.transformTemplate);
    return {
      ...state2.attrs,
      style: { ...state2.style }
    };
  }, [visualState]);
  if (props.style) {
    const rawStyles = {};
    copyRawValuesOnly(rawStyles, props.style, props);
    visualProps.style = { ...rawStyles, ...visualProps.style };
  }
  return visualProps;
}

// node_modules/framer-motion/dist/es/render/dom/use-render.mjs
function createUseRender(forwardMotionProps = false) {
  const useRender = (Component4, props, ref, { latestValues }, isStatic) => {
    const useVisualProps = isSVGComponent(Component4) ? useSVGProps : useHTMLProps;
    const visualProps = useVisualProps(props, latestValues, isStatic, Component4);
    const filteredProps = filterProps(props, typeof Component4 === "string", forwardMotionProps);
    const elementProps = Component4 !== import_react21.Fragment ? { ...filteredProps, ...visualProps, ref } : {};
    const { children } = props;
    const renderedChildren = (0, import_react21.useMemo)(() => isMotionValue(children) ? children.get() : children, [children]);
    return (0, import_react21.createElement)(Component4, {
      ...elementProps,
      children: renderedChildren
    });
  };
  return useRender;
}

// node_modules/framer-motion/dist/es/render/components/create-factory.mjs
function createMotionComponentFactory(preloadedFeatures, createVisualElement) {
  return function createMotionComponent2(Component4, { forwardMotionProps } = { forwardMotionProps: false }) {
    const baseConfig = isSVGComponent(Component4) ? svgMotionConfig : htmlMotionConfig;
    const config = {
      ...baseConfig,
      preloadedFeatures,
      useRender: createUseRender(forwardMotionProps),
      createVisualElement,
      Component: Component4
    };
    return createRendererMotionComponent(config);
  };
}

// node_modules/framer-motion/dist/es/utils/shallow-compare.mjs
function shallowCompare(next, prev) {
  if (!Array.isArray(prev))
    return false;
  const prevLength = prev.length;
  if (prevLength !== next.length)
    return false;
  for (let i = 0; i < prevLength; i++) {
    if (prev[i] !== next[i])
      return false;
  }
  return true;
}

// node_modules/framer-motion/dist/es/render/utils/resolve-dynamic-variants.mjs
function resolveVariant(visualElement, definition, custom) {
  const props = visualElement.getProps();
  return resolveVariantFromProps(props, definition, custom !== void 0 ? custom : props.custom, visualElement);
}

// node_modules/motion-dom/dist/es/utils/supports/scroll-timeline.mjs
var supportsScrollTimeline = memo(() => window.ScrollTimeline !== void 0);

// node_modules/motion-dom/dist/es/animation/controls/BaseGroup.mjs
var BaseGroupPlaybackControls = class {
  constructor(animations2) {
    this.stop = () => this.runAll("stop");
    this.animations = animations2.filter(Boolean);
  }
  get finished() {
    return Promise.all(this.animations.map((animation) => "finished" in animation ? animation.finished : animation));
  }
  /**
   * TODO: Filter out cancelled or stopped animations before returning
   */
  getAll(propName) {
    return this.animations[0][propName];
  }
  setAll(propName, newValue) {
    for (let i = 0; i < this.animations.length; i++) {
      this.animations[i][propName] = newValue;
    }
  }
  attachTimeline(timeline, fallback) {
    const subscriptions = this.animations.map((animation) => {
      if (supportsScrollTimeline() && animation.attachTimeline) {
        return animation.attachTimeline(timeline);
      } else if (typeof fallback === "function") {
        return fallback(animation);
      }
    });
    return () => {
      subscriptions.forEach((cancel, i) => {
        cancel && cancel();
        this.animations[i].stop();
      });
    };
  }
  get time() {
    return this.getAll("time");
  }
  set time(time2) {
    this.setAll("time", time2);
  }
  get speed() {
    return this.getAll("speed");
  }
  set speed(speed) {
    this.setAll("speed", speed);
  }
  get startTime() {
    return this.getAll("startTime");
  }
  get duration() {
    let max = 0;
    for (let i = 0; i < this.animations.length; i++) {
      max = Math.max(max, this.animations[i].duration);
    }
    return max;
  }
  runAll(methodName) {
    this.animations.forEach((controls) => controls[methodName]());
  }
  flatten() {
    this.runAll("flatten");
  }
  play() {
    this.runAll("play");
  }
  pause() {
    this.runAll("pause");
  }
  cancel() {
    this.runAll("cancel");
  }
  complete() {
    this.runAll("complete");
  }
};

// node_modules/motion-dom/dist/es/animation/controls/Group.mjs
var GroupPlaybackControls = class extends BaseGroupPlaybackControls {
  then(onResolve, onReject) {
    return Promise.all(this.animations).then(onResolve).catch(onReject);
  }
};

// node_modules/motion-dom/dist/es/animation/utils/get-value-transition.mjs
function getValueTransition(transition, key) {
  return transition ? transition[key] || transition["default"] || transition : void 0;
}

// node_modules/motion-dom/dist/es/animation/generators/utils/calc-duration.mjs
var maxGeneratorDuration = 2e4;
function calcGeneratorDuration(generator) {
  let duration = 0;
  const timeStep = 50;
  let state2 = generator.next(duration);
  while (!state2.done && duration < maxGeneratorDuration) {
    duration += timeStep;
    state2 = generator.next(duration);
  }
  return duration >= maxGeneratorDuration ? Infinity : duration;
}

// node_modules/motion-dom/dist/es/animation/generators/utils/is-generator.mjs
function isGenerator(type) {
  return typeof type === "function";
}

// node_modules/motion-dom/dist/es/animation/waapi/utils/attach-timeline.mjs
function attachTimeline(animation, timeline) {
  animation.timeline = timeline;
  animation.onfinish = null;
}

// node_modules/motion-dom/dist/es/utils/is-bezier-definition.mjs
var isBezierDefinition = (easing) => Array.isArray(easing) && typeof easing[0] === "number";

// node_modules/motion-dom/dist/es/utils/supports/flags.mjs
var supportsFlags = {
  linearEasing: void 0
};

// node_modules/motion-dom/dist/es/utils/supports/memo.mjs
function memoSupports(callback, supportsFlag) {
  const memoized = memo(callback);
  return () => {
    var _a;
    return (_a = supportsFlags[supportsFlag]) !== null && _a !== void 0 ? _a : memoized();
  };
}

// node_modules/motion-dom/dist/es/utils/supports/linear-easing.mjs
var supportsLinearEasing = /* @__PURE__ */ memoSupports(() => {
  try {
    document.createElement("div").animate({ opacity: 0 }, { easing: "linear(0, 1)" });
  } catch (e) {
    return false;
  }
  return true;
}, "linearEasing");

// node_modules/motion-dom/dist/es/animation/waapi/utils/linear.mjs
var generateLinearEasing = (easing, duration, resolution = 10) => {
  let points = "";
  const numPoints = Math.max(Math.round(duration / resolution), 2);
  for (let i = 0; i < numPoints; i++) {
    points += easing(progress(0, numPoints - 1, i)) + ", ";
  }
  return `linear(${points.substring(0, points.length - 2)})`;
};

// node_modules/motion-dom/dist/es/animation/waapi/utils/easing.mjs
function isWaapiSupportedEasing(easing) {
  return Boolean(typeof easing === "function" && supportsLinearEasing() || !easing || typeof easing === "string" && (easing in supportedWaapiEasing || supportsLinearEasing()) || isBezierDefinition(easing) || Array.isArray(easing) && easing.every(isWaapiSupportedEasing));
}
var cubicBezierAsString = ([a, b, c, d]) => `cubic-bezier(${a}, ${b}, ${c}, ${d})`;
var supportedWaapiEasing = {
  linear: "linear",
  ease: "ease",
  easeIn: "ease-in",
  easeOut: "ease-out",
  easeInOut: "ease-in-out",
  circIn: /* @__PURE__ */ cubicBezierAsString([0, 0.65, 0.55, 1]),
  circOut: /* @__PURE__ */ cubicBezierAsString([0.55, 0, 1, 0.45]),
  backIn: /* @__PURE__ */ cubicBezierAsString([0.31, 0.01, 0.66, -0.59]),
  backOut: /* @__PURE__ */ cubicBezierAsString([0.33, 1.53, 0.69, 0.99])
};
function mapEasingToNativeEasing(easing, duration) {
  if (!easing) {
    return void 0;
  } else if (typeof easing === "function" && supportsLinearEasing()) {
    return generateLinearEasing(easing, duration);
  } else if (isBezierDefinition(easing)) {
    return cubicBezierAsString(easing);
  } else if (Array.isArray(easing)) {
    return easing.map((segmentEasing) => mapEasingToNativeEasing(segmentEasing, duration) || supportedWaapiEasing.easeOut);
  } else {
    return supportedWaapiEasing[easing];
  }
}

// node_modules/motion-dom/dist/es/gestures/drag/state/is-active.mjs
var isDragging = {
  x: false,
  y: false
};
function isDragActive() {
  return isDragging.x || isDragging.y;
}

// node_modules/motion-dom/dist/es/utils/resolve-elements.mjs
function resolveElements(elementOrSelector, scope, selectorCache) {
  var _a;
  if (elementOrSelector instanceof Element) {
    return [elementOrSelector];
  } else if (typeof elementOrSelector === "string") {
    let root = document;
    if (scope) {
      root = scope.current;
    }
    const elements = (_a = selectorCache === null || selectorCache === void 0 ? void 0 : selectorCache[elementOrSelector]) !== null && _a !== void 0 ? _a : root.querySelectorAll(elementOrSelector);
    return elements ? Array.from(elements) : [];
  }
  return Array.from(elementOrSelector);
}

// node_modules/motion-dom/dist/es/gestures/utils/setup.mjs
function setupGesture(elementOrSelector, options2) {
  const elements = resolveElements(elementOrSelector);
  const gestureAbortController = new AbortController();
  const eventOptions = {
    passive: true,
    ...options2,
    signal: gestureAbortController.signal
  };
  const cancel = () => gestureAbortController.abort();
  return [elements, eventOptions, cancel];
}

// node_modules/motion-dom/dist/es/gestures/hover.mjs
function filterEvents(callback) {
  return (event) => {
    if (event.pointerType === "touch" || isDragActive())
      return;
    callback(event);
  };
}
function hover(elementOrSelector, onHoverStart, options2 = {}) {
  const [elements, eventOptions, cancel] = setupGesture(elementOrSelector, options2);
  const onPointerEnter = filterEvents((enterEvent) => {
    const { target } = enterEvent;
    const onHoverEnd = onHoverStart(enterEvent);
    if (typeof onHoverEnd !== "function" || !target)
      return;
    const onPointerLeave = filterEvents((leaveEvent) => {
      onHoverEnd(leaveEvent);
      target.removeEventListener("pointerleave", onPointerLeave);
    });
    target.addEventListener("pointerleave", onPointerLeave, eventOptions);
  });
  elements.forEach((element) => {
    element.addEventListener("pointerenter", onPointerEnter, eventOptions);
  });
  return cancel;
}

// node_modules/motion-dom/dist/es/gestures/utils/is-node-or-child.mjs
var isNodeOrChild = (parent, child) => {
  if (!child) {
    return false;
  } else if (parent === child) {
    return true;
  } else {
    return isNodeOrChild(parent, child.parentElement);
  }
};

// node_modules/motion-dom/dist/es/gestures/utils/is-primary-pointer.mjs
var isPrimaryPointer = (event) => {
  if (event.pointerType === "mouse") {
    return typeof event.button !== "number" || event.button <= 0;
  } else {
    return event.isPrimary !== false;
  }
};

// node_modules/motion-dom/dist/es/gestures/press/utils/is-keyboard-accessible.mjs
var focusableElements = /* @__PURE__ */ new Set([
  "BUTTON",
  "INPUT",
  "SELECT",
  "TEXTAREA",
  "A"
]);
function isElementKeyboardAccessible(element) {
  return focusableElements.has(element.tagName) || element.tabIndex !== -1;
}

// node_modules/motion-dom/dist/es/gestures/press/utils/state.mjs
var isPressing = /* @__PURE__ */ new WeakSet();

// node_modules/motion-dom/dist/es/gestures/press/utils/keyboard.mjs
function filterEvents2(callback) {
  return (event) => {
    if (event.key !== "Enter")
      return;
    callback(event);
  };
}
function firePointerEvent(target, type) {
  target.dispatchEvent(new PointerEvent("pointer" + type, { isPrimary: true, bubbles: true }));
}
var enableKeyboardPress = (focusEvent, eventOptions) => {
  const element = focusEvent.currentTarget;
  if (!element)
    return;
  const handleKeydown = filterEvents2(() => {
    if (isPressing.has(element))
      return;
    firePointerEvent(element, "down");
    const handleKeyup = filterEvents2(() => {
      firePointerEvent(element, "up");
    });
    const handleBlur = () => firePointerEvent(element, "cancel");
    element.addEventListener("keyup", handleKeyup, eventOptions);
    element.addEventListener("blur", handleBlur, eventOptions);
  });
  element.addEventListener("keydown", handleKeydown, eventOptions);
  element.addEventListener("blur", () => element.removeEventListener("keydown", handleKeydown), eventOptions);
};

// node_modules/motion-dom/dist/es/gestures/press/index.mjs
function isValidPressEvent(event) {
  return isPrimaryPointer(event) && !isDragActive();
}
function press(elementOrSelector, onPressStart, options2 = {}) {
  const [elements, eventOptions, cancelEvents] = setupGesture(elementOrSelector, options2);
  const startPress = (startEvent) => {
    const element = startEvent.currentTarget;
    if (!isValidPressEvent(startEvent) || isPressing.has(element))
      return;
    isPressing.add(element);
    const onPressEnd = onPressStart(startEvent);
    const onPointerEnd = (endEvent, success) => {
      window.removeEventListener("pointerup", onPointerUp);
      window.removeEventListener("pointercancel", onPointerCancel);
      if (!isValidPressEvent(endEvent) || !isPressing.has(element)) {
        return;
      }
      isPressing.delete(element);
      if (typeof onPressEnd === "function") {
        onPressEnd(endEvent, { success });
      }
    };
    const onPointerUp = (upEvent) => {
      onPointerEnd(upEvent, options2.useGlobalTarget || isNodeOrChild(element, upEvent.target));
    };
    const onPointerCancel = (cancelEvent) => {
      onPointerEnd(cancelEvent, false);
    };
    window.addEventListener("pointerup", onPointerUp, eventOptions);
    window.addEventListener("pointercancel", onPointerCancel, eventOptions);
  };
  elements.forEach((element) => {
    if (!isElementKeyboardAccessible(element) && element.getAttribute("tabindex") === null) {
      element.tabIndex = 0;
    }
    const target = options2.useGlobalTarget ? window : element;
    target.addEventListener("pointerdown", startPress, eventOptions);
    element.addEventListener("focus", (event) => enableKeyboardPress(event, eventOptions), eventOptions);
  });
  return cancelEvents;
}

// node_modules/motion-dom/dist/es/gestures/drag/state/set-active.mjs
function setDragLock(axis) {
  if (axis === "x" || axis === "y") {
    if (isDragging[axis]) {
      return null;
    } else {
      isDragging[axis] = true;
      return () => {
        isDragging[axis] = false;
      };
    }
  } else {
    if (isDragging.x || isDragging.y) {
      return null;
    } else {
      isDragging.x = isDragging.y = true;
      return () => {
        isDragging.x = isDragging.y = false;
      };
    }
  }
}

// node_modules/framer-motion/dist/es/render/html/utils/keys-position.mjs
var positionalKeys = /* @__PURE__ */ new Set([
  "width",
  "height",
  "top",
  "left",
  "right",
  "bottom",
  ...transformPropOrder
]);

// node_modules/framer-motion/dist/es/frameloop/sync-time.mjs
var now;
function clearTime() {
  now = void 0;
}
var time = {
  now: () => {
    if (now === void 0) {
      time.set(frameData.isProcessing || MotionGlobalConfig.useManualTiming ? frameData.timestamp : performance.now());
    }
    return now;
  },
  set: (newTime) => {
    now = newTime;
    queueMicrotask(clearTime);
  }
};

// node_modules/framer-motion/dist/es/utils/array.mjs
function addUniqueItem(arr, item) {
  if (arr.indexOf(item) === -1)
    arr.push(item);
}
function removeItem(arr, item) {
  const index = arr.indexOf(item);
  if (index > -1)
    arr.splice(index, 1);
}

// node_modules/framer-motion/dist/es/utils/subscription-manager.mjs
var SubscriptionManager = class {
  constructor() {
    this.subscriptions = [];
  }
  add(handler) {
    addUniqueItem(this.subscriptions, handler);
    return () => removeItem(this.subscriptions, handler);
  }
  notify(a, b, c) {
    const numSubscriptions = this.subscriptions.length;
    if (!numSubscriptions)
      return;
    if (numSubscriptions === 1) {
      this.subscriptions[0](a, b, c);
    } else {
      for (let i = 0; i < numSubscriptions; i++) {
        const handler = this.subscriptions[i];
        handler && handler(a, b, c);
      }
    }
  }
  getSize() {
    return this.subscriptions.length;
  }
  clear() {
    this.subscriptions.length = 0;
  }
};

// node_modules/framer-motion/dist/es/utils/velocity-per-second.mjs
function velocityPerSecond(velocity, frameDuration) {
  return frameDuration ? velocity * (1e3 / frameDuration) : 0;
}

// node_modules/framer-motion/dist/es/value/index.mjs
var MAX_VELOCITY_DELTA = 30;
var isFloat = (value) => {
  return !isNaN(parseFloat(value));
};
var collectMotionValues = {
  current: void 0
};
var MotionValue = class {
  /**
   * @param init - The initiating value
   * @param config - Optional configuration options
   *
   * -  `transformer`: A function to transform incoming values with.
   *
   * @internal
   */
  constructor(init, options2 = {}) {
    this.version = "11.18.2";
    this.canTrackVelocity = null;
    this.events = {};
    this.updateAndNotify = (v, render = true) => {
      const currentTime = time.now();
      if (this.updatedAt !== currentTime) {
        this.setPrevFrameValue();
      }
      this.prev = this.current;
      this.setCurrent(v);
      if (this.current !== this.prev && this.events.change) {
        this.events.change.notify(this.current);
      }
      if (render && this.events.renderRequest) {
        this.events.renderRequest.notify(this.current);
      }
    };
    this.hasAnimated = false;
    this.setCurrent(init);
    this.owner = options2.owner;
  }
  setCurrent(current) {
    this.current = current;
    this.updatedAt = time.now();
    if (this.canTrackVelocity === null && current !== void 0) {
      this.canTrackVelocity = isFloat(this.current);
    }
  }
  setPrevFrameValue(prevFrameValue = this.current) {
    this.prevFrameValue = prevFrameValue;
    this.prevUpdatedAt = this.updatedAt;
  }
  /**
   * Adds a function that will be notified when the `MotionValue` is updated.
   *
   * It returns a function that, when called, will cancel the subscription.
   *
   * When calling `onChange` inside a React component, it should be wrapped with the
   * `useEffect` hook. As it returns an unsubscribe function, this should be returned
   * from the `useEffect` function to ensure you don't add duplicate subscribers..
   *
   * ```jsx
   * export const MyComponent = () => {
   *   const x = useMotionValue(0)
   *   const y = useMotionValue(0)
   *   const opacity = useMotionValue(1)
   *
   *   useEffect(() => {
   *     function updateOpacity() {
   *       const maxXY = Math.max(x.get(), y.get())
   *       const newOpacity = transform(maxXY, [0, 100], [1, 0])
   *       opacity.set(newOpacity)
   *     }
   *
   *     const unsubscribeX = x.on("change", updateOpacity)
   *     const unsubscribeY = y.on("change", updateOpacity)
   *
   *     return () => {
   *       unsubscribeX()
   *       unsubscribeY()
   *     }
   *   }, [])
   *
   *   return <motion.div style={{ x }} />
   * }
   * ```
   *
   * @param subscriber - A function that receives the latest value.
   * @returns A function that, when called, will cancel this subscription.
   *
   * @deprecated
   */
  onChange(subscription) {
    if (false) {
      warnOnce(false, `value.onChange(callback) is deprecated. Switch to value.on("change", callback).`);
    }
    return this.on("change", subscription);
  }
  on(eventName, callback) {
    if (!this.events[eventName]) {
      this.events[eventName] = new SubscriptionManager();
    }
    const unsubscribe = this.events[eventName].add(callback);
    if (eventName === "change") {
      return () => {
        unsubscribe();
        frame.read(() => {
          if (!this.events.change.getSize()) {
            this.stop();
          }
        });
      };
    }
    return unsubscribe;
  }
  clearListeners() {
    for (const eventManagers in this.events) {
      this.events[eventManagers].clear();
    }
  }
  /**
   * Attaches a passive effect to the `MotionValue`.
   *
   * @internal
   */
  attach(passiveEffect, stopPassiveEffect) {
    this.passiveEffect = passiveEffect;
    this.stopPassiveEffect = stopPassiveEffect;
  }
  /**
   * Sets the state of the `MotionValue`.
   *
   * @remarks
   *
   * ```jsx
   * const x = useMotionValue(0)
   * x.set(10)
   * ```
   *
   * @param latest - Latest value to set.
   * @param render - Whether to notify render subscribers. Defaults to `true`
   *
   * @public
   */
  set(v, render = true) {
    if (!render || !this.passiveEffect) {
      this.updateAndNotify(v, render);
    } else {
      this.passiveEffect(v, this.updateAndNotify);
    }
  }
  setWithVelocity(prev, current, delta) {
    this.set(current);
    this.prev = void 0;
    this.prevFrameValue = prev;
    this.prevUpdatedAt = this.updatedAt - delta;
  }
  /**
   * Set the state of the `MotionValue`, stopping any active animations,
   * effects, and resets velocity to `0`.
   */
  jump(v, endAnimation = true) {
    this.updateAndNotify(v);
    this.prev = v;
    this.prevUpdatedAt = this.prevFrameValue = void 0;
    endAnimation && this.stop();
    if (this.stopPassiveEffect)
      this.stopPassiveEffect();
  }
  /**
   * Returns the latest state of `MotionValue`
   *
   * @returns - The latest state of `MotionValue`
   *
   * @public
   */
  get() {
    if (collectMotionValues.current) {
      collectMotionValues.current.push(this);
    }
    return this.current;
  }
  /**
   * @public
   */
  getPrevious() {
    return this.prev;
  }
  /**
   * Returns the latest velocity of `MotionValue`
   *
   * @returns - The latest velocity of `MotionValue`. Returns `0` if the state is non-numerical.
   *
   * @public
   */
  getVelocity() {
    const currentTime = time.now();
    if (!this.canTrackVelocity || this.prevFrameValue === void 0 || currentTime - this.updatedAt > MAX_VELOCITY_DELTA) {
      return 0;
    }
    const delta = Math.min(this.updatedAt - this.prevUpdatedAt, MAX_VELOCITY_DELTA);
    return velocityPerSecond(parseFloat(this.current) - parseFloat(this.prevFrameValue), delta);
  }
  /**
   * Registers a new animation to control this `MotionValue`. Only one
   * animation can drive a `MotionValue` at one time.
   *
   * ```jsx
   * value.start()
   * ```
   *
   * @param animation - A function that starts the provided animation
   *
   * @internal
   */
  start(startAnimation) {
    this.stop();
    return new Promise((resolve2) => {
      this.hasAnimated = true;
      this.animation = startAnimation(resolve2);
      if (this.events.animationStart) {
        this.events.animationStart.notify();
      }
    }).then(() => {
      if (this.events.animationComplete) {
        this.events.animationComplete.notify();
      }
      this.clearAnimation();
    });
  }
  /**
   * Stop the currently active animation.
   *
   * @public
   */
  stop() {
    if (this.animation) {
      this.animation.stop();
      if (this.events.animationCancel) {
        this.events.animationCancel.notify();
      }
    }
    this.clearAnimation();
  }
  /**
   * Returns `true` if this value is currently animating.
   *
   * @public
   */
  isAnimating() {
    return !!this.animation;
  }
  clearAnimation() {
    delete this.animation;
  }
  /**
   * Destroy and clean up subscribers to this `MotionValue`.
   *
   * The `MotionValue` hooks like `useMotionValue` and `useTransform` automatically
   * handle the lifecycle of the returned `MotionValue`, so this method is only necessary if you've manually
   * created a `MotionValue` via the `motionValue` function.
   *
   * @public
   */
  destroy() {
    this.clearListeners();
    this.stop();
    if (this.stopPassiveEffect) {
      this.stopPassiveEffect();
    }
  }
};
function motionValue(init, options2) {
  return new MotionValue(init, options2);
}

// node_modules/framer-motion/dist/es/render/utils/setters.mjs
function setMotionValue(visualElement, key, value) {
  if (visualElement.hasValue(key)) {
    visualElement.getValue(key).set(value);
  } else {
    visualElement.addValue(key, motionValue(value));
  }
}
function setTarget(visualElement, definition) {
  const resolved = resolveVariant(visualElement, definition);
  let { transitionEnd = {}, transition = {}, ...target } = resolved || {};
  target = { ...target, ...transitionEnd };
  for (const key in target) {
    const value = resolveFinalValueInKeyframes(target[key]);
    setMotionValue(visualElement, key, value);
  }
}

// node_modules/framer-motion/dist/es/value/use-will-change/is.mjs
function isWillChangeMotionValue(value) {
  return Boolean(isMotionValue(value) && value.add);
}

// node_modules/framer-motion/dist/es/value/use-will-change/add-will-change.mjs
function addValueToWillChange(visualElement, key) {
  const willChange = visualElement.getValue("willChange");
  if (isWillChangeMotionValue(willChange)) {
    return willChange.add(key);
  }
}

// node_modules/framer-motion/dist/es/animation/optimized-appear/get-appear-id.mjs
function getOptimisedAppearId(visualElement) {
  return visualElement.props[optimizedAppearDataAttribute];
}

// node_modules/framer-motion/dist/es/utils/use-instant-transition-state.mjs
var instantAnimationState = {
  current: false
};

// node_modules/framer-motion/dist/es/easing/cubic-bezier.mjs
var calcBezier = (t, a1, a2) => (((1 - 3 * a2 + 3 * a1) * t + (3 * a2 - 6 * a1)) * t + 3 * a1) * t;
var subdivisionPrecision = 1e-7;
var subdivisionMaxIterations = 12;
function binarySubdivide(x, lowerBound, upperBound, mX1, mX2) {
  let currentX;
  let currentT;
  let i = 0;
  do {
    currentT = lowerBound + (upperBound - lowerBound) / 2;
    currentX = calcBezier(currentT, mX1, mX2) - x;
    if (currentX > 0) {
      upperBound = currentT;
    } else {
      lowerBound = currentT;
    }
  } while (Math.abs(currentX) > subdivisionPrecision && ++i < subdivisionMaxIterations);
  return currentT;
}
function cubicBezier(mX1, mY1, mX2, mY2) {
  if (mX1 === mY1 && mX2 === mY2)
    return noop;
  const getTForX = (aX) => binarySubdivide(aX, 0, 1, mX1, mX2);
  return (t) => t === 0 || t === 1 ? t : calcBezier(getTForX(t), mY1, mY2);
}

// node_modules/framer-motion/dist/es/easing/modifiers/mirror.mjs
var mirrorEasing = (easing) => (p) => p <= 0.5 ? easing(2 * p) / 2 : (2 - easing(2 * (1 - p))) / 2;

// node_modules/framer-motion/dist/es/easing/modifiers/reverse.mjs
var reverseEasing = (easing) => (p) => 1 - easing(1 - p);

// node_modules/framer-motion/dist/es/easing/back.mjs
var backOut = /* @__PURE__ */ cubicBezier(0.33, 1.53, 0.69, 0.99);
var backIn = /* @__PURE__ */ reverseEasing(backOut);
var backInOut = /* @__PURE__ */ mirrorEasing(backIn);

// node_modules/framer-motion/dist/es/easing/anticipate.mjs
var anticipate = (p) => (p *= 2) < 1 ? 0.5 * backIn(p) : 0.5 * (2 - Math.pow(2, -10 * (p - 1)));

// node_modules/framer-motion/dist/es/easing/circ.mjs
var circIn = (p) => 1 - Math.sin(Math.acos(p));
var circOut = reverseEasing(circIn);
var circInOut = mirrorEasing(circIn);

// node_modules/framer-motion/dist/es/utils/is-zero-value-string.mjs
var isZeroValueString = (v) => /^0[^.\s]+$/u.test(v);

// node_modules/framer-motion/dist/es/animation/utils/is-none.mjs
function isNone(value) {
  if (typeof value === "number") {
    return value === 0;
  } else if (value !== null) {
    return value === "none" || value === "0" || isZeroValueString(value);
  } else {
    return true;
  }
}

// node_modules/framer-motion/dist/es/value/types/utils/sanitize.mjs
var sanitize = (v) => Math.round(v * 1e5) / 1e5;

// node_modules/framer-motion/dist/es/value/types/utils/float-regex.mjs
var floatRegex = /-?(?:\d+(?:\.\d+)?|\.\d+)/gu;

// node_modules/framer-motion/dist/es/value/types/utils/is-nullish.mjs
function isNullish(v) {
  return v == null;
}

// node_modules/framer-motion/dist/es/value/types/utils/single-color-regex.mjs
var singleColorRegex = /^(?:#[\da-f]{3,8}|(?:rgb|hsl)a?\((?:-?[\d.]+%?[,\s]+){2}-?[\d.]+%?\s*(?:[,/]\s*)?(?:\b\d+(?:\.\d+)?|\.\d+)?%?\))$/iu;

// node_modules/framer-motion/dist/es/value/types/color/utils.mjs
var isColorString = (type, testProp) => (v) => {
  return Boolean(typeof v === "string" && singleColorRegex.test(v) && v.startsWith(type) || testProp && !isNullish(v) && Object.prototype.hasOwnProperty.call(v, testProp));
};
var splitColor = (aName, bName, cName) => (v) => {
  if (typeof v !== "string")
    return v;
  const [a, b, c, alpha2] = v.match(floatRegex);
  return {
    [aName]: parseFloat(a),
    [bName]: parseFloat(b),
    [cName]: parseFloat(c),
    alpha: alpha2 !== void 0 ? parseFloat(alpha2) : 1
  };
};

// node_modules/framer-motion/dist/es/value/types/color/rgba.mjs
var clampRgbUnit = (v) => clamp(0, 255, v);
var rgbUnit = {
  ...number,
  transform: (v) => Math.round(clampRgbUnit(v))
};
var rgba = {
  test: /* @__PURE__ */ isColorString("rgb", "red"),
  parse: /* @__PURE__ */ splitColor("red", "green", "blue"),
  transform: ({ red, green, blue, alpha: alpha$1 = 1 }) => "rgba(" + rgbUnit.transform(red) + ", " + rgbUnit.transform(green) + ", " + rgbUnit.transform(blue) + ", " + sanitize(alpha.transform(alpha$1)) + ")"
};

// node_modules/framer-motion/dist/es/value/types/color/hex.mjs
function parseHex(v) {
  let r = "";
  let g = "";
  let b = "";
  let a = "";
  if (v.length > 5) {
    r = v.substring(1, 3);
    g = v.substring(3, 5);
    b = v.substring(5, 7);
    a = v.substring(7, 9);
  } else {
    r = v.substring(1, 2);
    g = v.substring(2, 3);
    b = v.substring(3, 4);
    a = v.substring(4, 5);
    r += r;
    g += g;
    b += b;
    a += a;
  }
  return {
    red: parseInt(r, 16),
    green: parseInt(g, 16),
    blue: parseInt(b, 16),
    alpha: a ? parseInt(a, 16) / 255 : 1
  };
}
var hex = {
  test: /* @__PURE__ */ isColorString("#"),
  parse: parseHex,
  transform: rgba.transform
};

// node_modules/framer-motion/dist/es/value/types/color/hsla.mjs
var hsla = {
  test: /* @__PURE__ */ isColorString("hsl", "hue"),
  parse: /* @__PURE__ */ splitColor("hue", "saturation", "lightness"),
  transform: ({ hue, saturation, lightness, alpha: alpha$1 = 1 }) => {
    return "hsla(" + Math.round(hue) + ", " + percent.transform(sanitize(saturation)) + ", " + percent.transform(sanitize(lightness)) + ", " + sanitize(alpha.transform(alpha$1)) + ")";
  }
};

// node_modules/framer-motion/dist/es/value/types/color/index.mjs
var color = {
  test: (v) => rgba.test(v) || hex.test(v) || hsla.test(v),
  parse: (v) => {
    if (rgba.test(v)) {
      return rgba.parse(v);
    } else if (hsla.test(v)) {
      return hsla.parse(v);
    } else {
      return hex.parse(v);
    }
  },
  transform: (v) => {
    return typeof v === "string" ? v : v.hasOwnProperty("red") ? rgba.transform(v) : hsla.transform(v);
  }
};

// node_modules/framer-motion/dist/es/value/types/utils/color-regex.mjs
var colorRegex = /(?:#[\da-f]{3,8}|(?:rgb|hsl)a?\((?:-?[\d.]+%?[,\s]+){2}-?[\d.]+%?\s*(?:[,/]\s*)?(?:\b\d+(?:\.\d+)?|\.\d+)?%?\))/giu;

// node_modules/framer-motion/dist/es/value/types/complex/index.mjs
function test(v) {
  var _a, _b;
  return isNaN(v) && typeof v === "string" && (((_a = v.match(floatRegex)) === null || _a === void 0 ? void 0 : _a.length) || 0) + (((_b = v.match(colorRegex)) === null || _b === void 0 ? void 0 : _b.length) || 0) > 0;
}
var NUMBER_TOKEN = "number";
var COLOR_TOKEN = "color";
var VAR_TOKEN = "var";
var VAR_FUNCTION_TOKEN = "var(";
var SPLIT_TOKEN = "${}";
var complexRegex = /var\s*\(\s*--(?:[\w-]+\s*|[\w-]+\s*,(?:\s*[^)(\s]|\s*\((?:[^)(]|\([^)(]*\))*\))+\s*)\)|#[\da-f]{3,8}|(?:rgb|hsl)a?\((?:-?[\d.]+%?[,\s]+){2}-?[\d.]+%?\s*(?:[,/]\s*)?(?:\b\d+(?:\.\d+)?|\.\d+)?%?\)|-?(?:\d+(?:\.\d+)?|\.\d+)/giu;
function analyseComplexValue(value) {
  const originalValue = value.toString();
  const values = [];
  const indexes = {
    color: [],
    number: [],
    var: []
  };
  const types = [];
  let i = 0;
  const tokenised = originalValue.replace(complexRegex, (parsedValue) => {
    if (color.test(parsedValue)) {
      indexes.color.push(i);
      types.push(COLOR_TOKEN);
      values.push(color.parse(parsedValue));
    } else if (parsedValue.startsWith(VAR_FUNCTION_TOKEN)) {
      indexes.var.push(i);
      types.push(VAR_TOKEN);
      values.push(parsedValue);
    } else {
      indexes.number.push(i);
      types.push(NUMBER_TOKEN);
      values.push(parseFloat(parsedValue));
    }
    ++i;
    return SPLIT_TOKEN;
  });
  const split = tokenised.split(SPLIT_TOKEN);
  return { values, split, indexes, types };
}
function parseComplexValue(v) {
  return analyseComplexValue(v).values;
}
function createTransformer(source) {
  const { split, types } = analyseComplexValue(source);
  const numSections = split.length;
  return (v) => {
    let output = "";
    for (let i = 0; i < numSections; i++) {
      output += split[i];
      if (v[i] !== void 0) {
        const type = types[i];
        if (type === NUMBER_TOKEN) {
          output += sanitize(v[i]);
        } else if (type === COLOR_TOKEN) {
          output += color.transform(v[i]);
        } else {
          output += v[i];
        }
      }
    }
    return output;
  };
}
var convertNumbersToZero = (v) => typeof v === "number" ? 0 : v;
function getAnimatableNone(v) {
  const parsed = parseComplexValue(v);
  const transformer = createTransformer(v);
  return transformer(parsed.map(convertNumbersToZero));
}
var complex = {
  test,
  parse: parseComplexValue,
  createTransformer,
  getAnimatableNone
};

// node_modules/framer-motion/dist/es/value/types/complex/filter.mjs
var maxDefaults = /* @__PURE__ */ new Set(["brightness", "contrast", "saturate", "opacity"]);
function applyDefaultFilter(v) {
  const [name, value] = v.slice(0, -1).split("(");
  if (name === "drop-shadow")
    return v;
  const [number2] = value.match(floatRegex) || [];
  if (!number2)
    return v;
  const unit = value.replace(number2, "");
  let defaultValue = maxDefaults.has(name) ? 1 : 0;
  if (number2 !== value)
    defaultValue *= 100;
  return name + "(" + defaultValue + unit + ")";
}
var functionRegex = /\b([a-z-]*)\(.*?\)/gu;
var filter = {
  ...complex,
  getAnimatableNone: (v) => {
    const functions = v.match(functionRegex);
    return functions ? functions.map(applyDefaultFilter).join(" ") : v;
  }
};

// node_modules/framer-motion/dist/es/render/dom/value-types/defaults.mjs
var defaultValueTypes = {
  ...numberValueTypes,
  // Color props
  color,
  backgroundColor: color,
  outlineColor: color,
  fill: color,
  stroke: color,
  // Border props
  borderColor: color,
  borderTopColor: color,
  borderRightColor: color,
  borderBottomColor: color,
  borderLeftColor: color,
  filter,
  WebkitFilter: filter
};
var getDefaultValueType = (key) => defaultValueTypes[key];

// node_modules/framer-motion/dist/es/render/dom/value-types/animatable-none.mjs
function getAnimatableNone2(key, value) {
  let defaultValueType = getDefaultValueType(key);
  if (defaultValueType !== filter)
    defaultValueType = complex;
  return defaultValueType.getAnimatableNone ? defaultValueType.getAnimatableNone(value) : void 0;
}

// node_modules/framer-motion/dist/es/render/html/utils/make-none-animatable.mjs
var invalidTemplates = /* @__PURE__ */ new Set(["auto", "none", "0"]);
function makeNoneKeyframesAnimatable(unresolvedKeyframes, noneKeyframeIndexes, name) {
  let i = 0;
  let animatableTemplate = void 0;
  while (i < unresolvedKeyframes.length && !animatableTemplate) {
    const keyframe = unresolvedKeyframes[i];
    if (typeof keyframe === "string" && !invalidTemplates.has(keyframe) && analyseComplexValue(keyframe).values.length) {
      animatableTemplate = unresolvedKeyframes[i];
    }
    i++;
  }
  if (animatableTemplate && name) {
    for (const noneIndex of noneKeyframeIndexes) {
      unresolvedKeyframes[noneIndex] = getAnimatableNone2(name, animatableTemplate);
    }
  }
}

// node_modules/framer-motion/dist/es/render/dom/utils/unit-conversion.mjs
var isNumOrPxType = (v) => v === number || v === px;
var getPosFromMatrix = (matrix, pos) => parseFloat(matrix.split(", ")[pos]);
var getTranslateFromMatrix = (pos2, pos3) => (_bbox, { transform }) => {
  if (transform === "none" || !transform)
    return 0;
  const matrix3d = transform.match(/^matrix3d\((.+)\)$/u);
  if (matrix3d) {
    return getPosFromMatrix(matrix3d[1], pos3);
  } else {
    const matrix = transform.match(/^matrix\((.+)\)$/u);
    if (matrix) {
      return getPosFromMatrix(matrix[1], pos2);
    } else {
      return 0;
    }
  }
};
var transformKeys = /* @__PURE__ */ new Set(["x", "y", "z"]);
var nonTranslationalTransformKeys = transformPropOrder.filter((key) => !transformKeys.has(key));
function removeNonTranslationalTransform(visualElement) {
  const removedTransforms = [];
  nonTranslationalTransformKeys.forEach((key) => {
    const value = visualElement.getValue(key);
    if (value !== void 0) {
      removedTransforms.push([key, value.get()]);
      value.set(key.startsWith("scale") ? 1 : 0);
    }
  });
  return removedTransforms;
}
var positionalValues = {
  // Dimensions
  width: ({ x }, { paddingLeft = "0", paddingRight = "0" }) => x.max - x.min - parseFloat(paddingLeft) - parseFloat(paddingRight),
  height: ({ y }, { paddingTop = "0", paddingBottom = "0" }) => y.max - y.min - parseFloat(paddingTop) - parseFloat(paddingBottom),
  top: (_bbox, { top }) => parseFloat(top),
  left: (_bbox, { left }) => parseFloat(left),
  bottom: ({ y }, { top }) => parseFloat(top) + (y.max - y.min),
  right: ({ x }, { left }) => parseFloat(left) + (x.max - x.min),
  // Transform
  x: getTranslateFromMatrix(4, 13),
  y: getTranslateFromMatrix(5, 14)
};
positionalValues.translateX = positionalValues.x;
positionalValues.translateY = positionalValues.y;

// node_modules/framer-motion/dist/es/render/utils/KeyframesResolver.mjs
var toResolve = /* @__PURE__ */ new Set();
var isScheduled = false;
var anyNeedsMeasurement = false;
function measureAllKeyframes() {
  if (anyNeedsMeasurement) {
    const resolversToMeasure = Array.from(toResolve).filter((resolver) => resolver.needsMeasurement);
    const elementsToMeasure = new Set(resolversToMeasure.map((resolver) => resolver.element));
    const transformsToRestore = /* @__PURE__ */ new Map();
    elementsToMeasure.forEach((element) => {
      const removedTransforms = removeNonTranslationalTransform(element);
      if (!removedTransforms.length)
        return;
      transformsToRestore.set(element, removedTransforms);
      element.render();
    });
    resolversToMeasure.forEach((resolver) => resolver.measureInitialState());
    elementsToMeasure.forEach((element) => {
      element.render();
      const restore = transformsToRestore.get(element);
      if (restore) {
        restore.forEach(([key, value]) => {
          var _a;
          (_a = element.getValue(key)) === null || _a === void 0 ? void 0 : _a.set(value);
        });
      }
    });
    resolversToMeasure.forEach((resolver) => resolver.measureEndState());
    resolversToMeasure.forEach((resolver) => {
      if (resolver.suspendedScrollY !== void 0) {
        window.scrollTo(0, resolver.suspendedScrollY);
      }
    });
  }
  anyNeedsMeasurement = false;
  isScheduled = false;
  toResolve.forEach((resolver) => resolver.complete());
  toResolve.clear();
}
function readAllKeyframes() {
  toResolve.forEach((resolver) => {
    resolver.readKeyframes();
    if (resolver.needsMeasurement) {
      anyNeedsMeasurement = true;
    }
  });
}
function flushKeyframeResolvers() {
  readAllKeyframes();
  measureAllKeyframes();
}
var KeyframeResolver = class {
  constructor(unresolvedKeyframes, onComplete, name, motionValue2, element, isAsync = false) {
    this.isComplete = false;
    this.isAsync = false;
    this.needsMeasurement = false;
    this.isScheduled = false;
    this.unresolvedKeyframes = [...unresolvedKeyframes];
    this.onComplete = onComplete;
    this.name = name;
    this.motionValue = motionValue2;
    this.element = element;
    this.isAsync = isAsync;
  }
  scheduleResolve() {
    this.isScheduled = true;
    if (this.isAsync) {
      toResolve.add(this);
      if (!isScheduled) {
        isScheduled = true;
        frame.read(readAllKeyframes);
        frame.resolveKeyframes(measureAllKeyframes);
      }
    } else {
      this.readKeyframes();
      this.complete();
    }
  }
  readKeyframes() {
    const { unresolvedKeyframes, name, element, motionValue: motionValue2 } = this;
    for (let i = 0; i < unresolvedKeyframes.length; i++) {
      if (unresolvedKeyframes[i] === null) {
        if (i === 0) {
          const currentValue = motionValue2 === null || motionValue2 === void 0 ? void 0 : motionValue2.get();
          const finalKeyframe = unresolvedKeyframes[unresolvedKeyframes.length - 1];
          if (currentValue !== void 0) {
            unresolvedKeyframes[0] = currentValue;
          } else if (element && name) {
            const valueAsRead = element.readValue(name, finalKeyframe);
            if (valueAsRead !== void 0 && valueAsRead !== null) {
              unresolvedKeyframes[0] = valueAsRead;
            }
          }
          if (unresolvedKeyframes[0] === void 0) {
            unresolvedKeyframes[0] = finalKeyframe;
          }
          if (motionValue2 && currentValue === void 0) {
            motionValue2.set(unresolvedKeyframes[0]);
          }
        } else {
          unresolvedKeyframes[i] = unresolvedKeyframes[i - 1];
        }
      }
    }
  }
  setFinalKeyframe() {
  }
  measureInitialState() {
  }
  renderEndStyles() {
  }
  measureEndState() {
  }
  complete() {
    this.isComplete = true;
    this.onComplete(this.unresolvedKeyframes, this.finalKeyframe);
    toResolve.delete(this);
  }
  cancel() {
    if (!this.isComplete) {
      this.isScheduled = false;
      toResolve.delete(this);
    }
  }
  resume() {
    if (!this.isComplete)
      this.scheduleResolve();
  }
};

// node_modules/framer-motion/dist/es/utils/is-numerical-string.mjs
var isNumericalString = (v) => /^-?(?:\d+(?:\.\d+)?|\.\d+)$/u.test(v);

// node_modules/framer-motion/dist/es/render/dom/utils/css-variables-conversion.mjs
var splitCSSVariableRegex = (
  // eslint-disable-next-line redos-detector/no-unsafe-regex -- false positive, as it can match a lot of words
  /^var\(--(?:([\w-]+)|([\w-]+), ?([a-zA-Z\d ()%#.,-]+))\)/u
);
function parseCSSVariable(current) {
  const match = splitCSSVariableRegex.exec(current);
  if (!match)
    return [,];
  const [, token1, token2, fallback] = match;
  return [`--${token1 !== null && token1 !== void 0 ? token1 : token2}`, fallback];
}
var maxDepth = 4;
function getVariableValue(current, element, depth = 1) {
  invariant(depth <= maxDepth, `Max CSS variable fallback depth detected in property "${current}". This may indicate a circular fallback dependency.`);
  const [token, fallback] = parseCSSVariable(current);
  if (!token)
    return;
  const resolved = window.getComputedStyle(element).getPropertyValue(token);
  if (resolved) {
    const trimmed = resolved.trim();
    return isNumericalString(trimmed) ? parseFloat(trimmed) : trimmed;
  }
  return isCSSVariableToken(fallback) ? getVariableValue(fallback, element, depth + 1) : fallback;
}

// node_modules/framer-motion/dist/es/render/dom/value-types/test.mjs
var testValueType = (v) => (type) => type.test(v);

// node_modules/framer-motion/dist/es/render/dom/value-types/type-auto.mjs
var auto = {
  test: (v) => v === "auto",
  parse: (v) => v
};

// node_modules/framer-motion/dist/es/render/dom/value-types/dimensions.mjs
var dimensionValueTypes = [number, px, percent, degrees, vw, vh, auto];
var findDimensionValueType = (v) => dimensionValueTypes.find(testValueType(v));

// node_modules/framer-motion/dist/es/render/dom/DOMKeyframesResolver.mjs
var DOMKeyframesResolver = class extends KeyframeResolver {
  constructor(unresolvedKeyframes, onComplete, name, motionValue2, element) {
    super(unresolvedKeyframes, onComplete, name, motionValue2, element, true);
  }
  readKeyframes() {
    const { unresolvedKeyframes, element, name } = this;
    if (!element || !element.current)
      return;
    super.readKeyframes();
    for (let i = 0; i < unresolvedKeyframes.length; i++) {
      let keyframe = unresolvedKeyframes[i];
      if (typeof keyframe === "string") {
        keyframe = keyframe.trim();
        if (isCSSVariableToken(keyframe)) {
          const resolved = getVariableValue(keyframe, element.current);
          if (resolved !== void 0) {
            unresolvedKeyframes[i] = resolved;
          }
          if (i === unresolvedKeyframes.length - 1) {
            this.finalKeyframe = keyframe;
          }
        }
      }
    }
    this.resolveNoneKeyframes();
    if (!positionalKeys.has(name) || unresolvedKeyframes.length !== 2) {
      return;
    }
    const [origin, target] = unresolvedKeyframes;
    const originType = findDimensionValueType(origin);
    const targetType = findDimensionValueType(target);
    if (originType === targetType)
      return;
    if (isNumOrPxType(originType) && isNumOrPxType(targetType)) {
      for (let i = 0; i < unresolvedKeyframes.length; i++) {
        const value = unresolvedKeyframes[i];
        if (typeof value === "string") {
          unresolvedKeyframes[i] = parseFloat(value);
        }
      }
    } else {
      this.needsMeasurement = true;
    }
  }
  resolveNoneKeyframes() {
    const { unresolvedKeyframes, name } = this;
    const noneKeyframeIndexes = [];
    for (let i = 0; i < unresolvedKeyframes.length; i++) {
      if (isNone(unresolvedKeyframes[i])) {
        noneKeyframeIndexes.push(i);
      }
    }
    if (noneKeyframeIndexes.length) {
      makeNoneKeyframesAnimatable(unresolvedKeyframes, noneKeyframeIndexes, name);
    }
  }
  measureInitialState() {
    const { element, unresolvedKeyframes, name } = this;
    if (!element || !element.current)
      return;
    if (name === "height") {
      this.suspendedScrollY = window.pageYOffset;
    }
    this.measuredOrigin = positionalValues[name](element.measureViewportBox(), window.getComputedStyle(element.current));
    unresolvedKeyframes[0] = this.measuredOrigin;
    const measureKeyframe = unresolvedKeyframes[unresolvedKeyframes.length - 1];
    if (measureKeyframe !== void 0) {
      element.getValue(name, measureKeyframe).jump(measureKeyframe, false);
    }
  }
  measureEndState() {
    var _a;
    const { element, name, unresolvedKeyframes } = this;
    if (!element || !element.current)
      return;
    const value = element.getValue(name);
    value && value.jump(this.measuredOrigin, false);
    const finalKeyframeIndex = unresolvedKeyframes.length - 1;
    const finalKeyframe = unresolvedKeyframes[finalKeyframeIndex];
    unresolvedKeyframes[finalKeyframeIndex] = positionalValues[name](element.measureViewportBox(), window.getComputedStyle(element.current));
    if (finalKeyframe !== null && this.finalKeyframe === void 0) {
      this.finalKeyframe = finalKeyframe;
    }
    if ((_a = this.removedTransforms) === null || _a === void 0 ? void 0 : _a.length) {
      this.removedTransforms.forEach(([unsetTransformName, unsetTransformValue]) => {
        element.getValue(unsetTransformName).set(unsetTransformValue);
      });
    }
    this.resolveNoneKeyframes();
  }
};

// node_modules/framer-motion/dist/es/animation/utils/is-animatable.mjs
var isAnimatable = (value, name) => {
  if (name === "zIndex")
    return false;
  if (typeof value === "number" || Array.isArray(value))
    return true;
  if (typeof value === "string" && // It's animatable if we have a string
  (complex.test(value) || value === "0") && // And it contains numbers and/or colors
  !value.startsWith("url(")) {
    return true;
  }
  return false;
};

// node_modules/framer-motion/dist/es/animation/animators/utils/can-animate.mjs
function hasKeyframesChanged(keyframes2) {
  const current = keyframes2[0];
  if (keyframes2.length === 1)
    return true;
  for (let i = 0; i < keyframes2.length; i++) {
    if (keyframes2[i] !== current)
      return true;
  }
}
function canAnimate(keyframes2, name, type, velocity) {
  const originKeyframe = keyframes2[0];
  if (originKeyframe === null)
    return false;
  if (name === "display" || name === "visibility")
    return true;
  const targetKeyframe = keyframes2[keyframes2.length - 1];
  const isOriginAnimatable = isAnimatable(originKeyframe, name);
  const isTargetAnimatable = isAnimatable(targetKeyframe, name);
  warning(isOriginAnimatable === isTargetAnimatable, `You are trying to animate ${name} from "${originKeyframe}" to "${targetKeyframe}". ${originKeyframe} is not an animatable value - to enable this animation set ${originKeyframe} to a value animatable to ${targetKeyframe} via the \`style\` property.`);
  if (!isOriginAnimatable || !isTargetAnimatable) {
    return false;
  }
  return hasKeyframesChanged(keyframes2) || (type === "spring" || isGenerator(type)) && velocity;
}

// node_modules/framer-motion/dist/es/animation/animators/waapi/utils/get-final-keyframe.mjs
var isNotNull = (value) => value !== null;
function getFinalKeyframe(keyframes2, { repeat, repeatType = "loop" }, finalKeyframe) {
  const resolvedKeyframes = keyframes2.filter(isNotNull);
  const index = repeat && repeatType !== "loop" && repeat % 2 === 1 ? 0 : resolvedKeyframes.length - 1;
  return !index || finalKeyframe === void 0 ? resolvedKeyframes[index] : finalKeyframe;
}

// node_modules/framer-motion/dist/es/animation/animators/BaseAnimation.mjs
var MAX_RESOLVE_DELAY = 40;
var BaseAnimation = class {
  constructor({ autoplay = true, delay: delay2 = 0, type = "keyframes", repeat = 0, repeatDelay = 0, repeatType = "loop", ...options2 }) {
    this.isStopped = false;
    this.hasAttemptedResolve = false;
    this.createdAt = time.now();
    this.options = {
      autoplay,
      delay: delay2,
      type,
      repeat,
      repeatDelay,
      repeatType,
      ...options2
    };
    this.updateFinishedPromise();
  }
  /**
   * This method uses the createdAt and resolvedAt to calculate the
   * animation startTime. *Ideally*, we would use the createdAt time as t=0
   * as the following frame would then be the first frame of the animation in
   * progress, which would feel snappier.
   *
   * However, if there's a delay (main thread work) between the creation of
   * the animation and the first commited frame, we prefer to use resolvedAt
   * to avoid a sudden jump into the animation.
   */
  calcStartTime() {
    if (!this.resolvedAt)
      return this.createdAt;
    return this.resolvedAt - this.createdAt > MAX_RESOLVE_DELAY ? this.resolvedAt : this.createdAt;
  }
  /**
   * A getter for resolved data. If keyframes are not yet resolved, accessing
   * this.resolved will synchronously flush all pending keyframe resolvers.
   * This is a deoptimisation, but at its worst still batches read/writes.
   */
  get resolved() {
    if (!this._resolved && !this.hasAttemptedResolve) {
      flushKeyframeResolvers();
    }
    return this._resolved;
  }
  /**
   * A method to be called when the keyframes resolver completes. This method
   * will check if its possible to run the animation and, if not, skip it.
   * Otherwise, it will call initPlayback on the implementing class.
   */
  onKeyframesResolved(keyframes2, finalKeyframe) {
    this.resolvedAt = time.now();
    this.hasAttemptedResolve = true;
    const { name, type, velocity, delay: delay2, onComplete, onUpdate, isGenerator: isGenerator2 } = this.options;
    if (!isGenerator2 && !canAnimate(keyframes2, name, type, velocity)) {
      if (instantAnimationState.current || !delay2) {
        onUpdate && onUpdate(getFinalKeyframe(keyframes2, this.options, finalKeyframe));
        onComplete && onComplete();
        this.resolveFinishedPromise();
        return;
      } else {
        this.options.duration = 0;
      }
    }
    const resolvedAnimation = this.initPlayback(keyframes2, finalKeyframe);
    if (resolvedAnimation === false)
      return;
    this._resolved = {
      keyframes: keyframes2,
      finalKeyframe,
      ...resolvedAnimation
    };
    this.onPostResolved();
  }
  onPostResolved() {
  }
  /**
   * Allows the returned animation to be awaited or promise-chained. Currently
   * resolves when the animation finishes at all but in a future update could/should
   * reject if its cancels.
   */
  then(resolve2, reject) {
    return this.currentFinishedPromise.then(resolve2, reject);
  }
  flatten() {
    this.options.type = "keyframes";
    this.options.ease = "linear";
  }
  updateFinishedPromise() {
    this.currentFinishedPromise = new Promise((resolve2) => {
      this.resolveFinishedPromise = resolve2;
    });
  }
};

// node_modules/framer-motion/dist/es/utils/mix/number.mjs
var mixNumber = (from, to, progress2) => {
  return from + (to - from) * progress2;
};

// node_modules/framer-motion/dist/es/utils/hsla-to-rgba.mjs
function hueToRgb(p, q, t) {
  if (t < 0)
    t += 1;
  if (t > 1)
    t -= 1;
  if (t < 1 / 6)
    return p + (q - p) * 6 * t;
  if (t < 1 / 2)
    return q;
  if (t < 2 / 3)
    return p + (q - p) * (2 / 3 - t) * 6;
  return p;
}
function hslaToRgba({ hue, saturation, lightness, alpha: alpha2 }) {
  hue /= 360;
  saturation /= 100;
  lightness /= 100;
  let red = 0;
  let green = 0;
  let blue = 0;
  if (!saturation) {
    red = green = blue = lightness;
  } else {
    const q = lightness < 0.5 ? lightness * (1 + saturation) : lightness + saturation - lightness * saturation;
    const p = 2 * lightness - q;
    red = hueToRgb(p, q, hue + 1 / 3);
    green = hueToRgb(p, q, hue);
    blue = hueToRgb(p, q, hue - 1 / 3);
  }
  return {
    red: Math.round(red * 255),
    green: Math.round(green * 255),
    blue: Math.round(blue * 255),
    alpha: alpha2
  };
}

// node_modules/framer-motion/dist/es/utils/mix/immediate.mjs
function mixImmediate(a, b) {
  return (p) => p > 0 ? b : a;
}

// node_modules/framer-motion/dist/es/utils/mix/color.mjs
var mixLinearColor = (from, to, v) => {
  const fromExpo = from * from;
  const expo = v * (to * to - fromExpo) + fromExpo;
  return expo < 0 ? 0 : Math.sqrt(expo);
};
var colorTypes = [hex, rgba, hsla];
var getColorType = (v) => colorTypes.find((type) => type.test(v));
function asRGBA(color2) {
  const type = getColorType(color2);
  warning(Boolean(type), `'${color2}' is not an animatable color. Use the equivalent color code instead.`);
  if (!Boolean(type))
    return false;
  let model = type.parse(color2);
  if (type === hsla) {
    model = hslaToRgba(model);
  }
  return model;
}
var mixColor = (from, to) => {
  const fromRGBA = asRGBA(from);
  const toRGBA = asRGBA(to);
  if (!fromRGBA || !toRGBA) {
    return mixImmediate(from, to);
  }
  const blended = { ...fromRGBA };
  return (v) => {
    blended.red = mixLinearColor(fromRGBA.red, toRGBA.red, v);
    blended.green = mixLinearColor(fromRGBA.green, toRGBA.green, v);
    blended.blue = mixLinearColor(fromRGBA.blue, toRGBA.blue, v);
    blended.alpha = mixNumber(fromRGBA.alpha, toRGBA.alpha, v);
    return rgba.transform(blended);
  };
};

// node_modules/framer-motion/dist/es/utils/pipe.mjs
var combineFunctions = (a, b) => (v) => b(a(v));
var pipe = (...transformers) => transformers.reduce(combineFunctions);

// node_modules/framer-motion/dist/es/utils/mix/visibility.mjs
var invisibleValues = /* @__PURE__ */ new Set(["none", "hidden"]);
function mixVisibility(origin, target) {
  if (invisibleValues.has(origin)) {
    return (p) => p <= 0 ? origin : target;
  } else {
    return (p) => p >= 1 ? target : origin;
  }
}

// node_modules/framer-motion/dist/es/utils/mix/complex.mjs
function mixNumber2(a, b) {
  return (p) => mixNumber(a, b, p);
}
function getMixer(a) {
  if (typeof a === "number") {
    return mixNumber2;
  } else if (typeof a === "string") {
    return isCSSVariableToken(a) ? mixImmediate : color.test(a) ? mixColor : mixComplex;
  } else if (Array.isArray(a)) {
    return mixArray;
  } else if (typeof a === "object") {
    return color.test(a) ? mixColor : mixObject;
  }
  return mixImmediate;
}
function mixArray(a, b) {
  const output = [...a];
  const numValues = output.length;
  const blendValue = a.map((v, i) => getMixer(v)(v, b[i]));
  return (p) => {
    for (let i = 0; i < numValues; i++) {
      output[i] = blendValue[i](p);
    }
    return output;
  };
}
function mixObject(a, b) {
  const output = { ...a, ...b };
  const blendValue = {};
  for (const key in output) {
    if (a[key] !== void 0 && b[key] !== void 0) {
      blendValue[key] = getMixer(a[key])(a[key], b[key]);
    }
  }
  return (v) => {
    for (const key in blendValue) {
      output[key] = blendValue[key](v);
    }
    return output;
  };
}
function matchOrder(origin, target) {
  var _a;
  const orderedOrigin = [];
  const pointers = { color: 0, var: 0, number: 0 };
  for (let i = 0; i < target.values.length; i++) {
    const type = target.types[i];
    const originIndex = origin.indexes[type][pointers[type]];
    const originValue = (_a = origin.values[originIndex]) !== null && _a !== void 0 ? _a : 0;
    orderedOrigin[i] = originValue;
    pointers[type]++;
  }
  return orderedOrigin;
}
var mixComplex = (origin, target) => {
  const template = complex.createTransformer(target);
  const originStats = analyseComplexValue(origin);
  const targetStats = analyseComplexValue(target);
  const canInterpolate = originStats.indexes.var.length === targetStats.indexes.var.length && originStats.indexes.color.length === targetStats.indexes.color.length && originStats.indexes.number.length >= targetStats.indexes.number.length;
  if (canInterpolate) {
    if (invisibleValues.has(origin) && !targetStats.values.length || invisibleValues.has(target) && !originStats.values.length) {
      return mixVisibility(origin, target);
    }
    return pipe(mixArray(matchOrder(originStats, targetStats), targetStats.values), template);
  } else {
    warning(true, `Complex values '${origin}' and '${target}' too different to mix. Ensure all colors are of the same type, and that each contains the same quantity of number and color values. Falling back to instant transition.`);
    return mixImmediate(origin, target);
  }
};

// node_modules/framer-motion/dist/es/utils/mix/index.mjs
function mix(from, to, p) {
  if (typeof from === "number" && typeof to === "number" && typeof p === "number") {
    return mixNumber(from, to, p);
  }
  const mixer = getMixer(from);
  return mixer(from, to);
}

// node_modules/framer-motion/dist/es/animation/generators/utils/velocity.mjs
var velocitySampleDuration = 5;
function calcGeneratorVelocity(resolveValue, t, current) {
  const prevT = Math.max(t - velocitySampleDuration, 0);
  return velocityPerSecond(current - resolveValue(prevT), t - prevT);
}

// node_modules/framer-motion/dist/es/animation/generators/spring/defaults.mjs
var springDefaults = {
  // Default spring physics
  stiffness: 100,
  damping: 10,
  mass: 1,
  velocity: 0,
  // Default duration/bounce-based options
  duration: 800,
  // in ms
  bounce: 0.3,
  visualDuration: 0.3,
  // in seconds
  // Rest thresholds
  restSpeed: {
    granular: 0.01,
    default: 2
  },
  restDelta: {
    granular: 5e-3,
    default: 0.5
  },
  // Limits
  minDuration: 0.01,
  // in seconds
  maxDuration: 10,
  // in seconds
  minDamping: 0.05,
  maxDamping: 1
};

// node_modules/framer-motion/dist/es/animation/generators/spring/find.mjs
var safeMin = 1e-3;
function findSpring({ duration = springDefaults.duration, bounce = springDefaults.bounce, velocity = springDefaults.velocity, mass = springDefaults.mass }) {
  let envelope;
  let derivative;
  warning(duration <= secondsToMilliseconds(springDefaults.maxDuration), "Spring duration must be 10 seconds or less");
  let dampingRatio = 1 - bounce;
  dampingRatio = clamp(springDefaults.minDamping, springDefaults.maxDamping, dampingRatio);
  duration = clamp(springDefaults.minDuration, springDefaults.maxDuration, millisecondsToSeconds(duration));
  if (dampingRatio < 1) {
    envelope = (undampedFreq2) => {
      const exponentialDecay = undampedFreq2 * dampingRatio;
      const delta = exponentialDecay * duration;
      const a = exponentialDecay - velocity;
      const b = calcAngularFreq(undampedFreq2, dampingRatio);
      const c = Math.exp(-delta);
      return safeMin - a / b * c;
    };
    derivative = (undampedFreq2) => {
      const exponentialDecay = undampedFreq2 * dampingRatio;
      const delta = exponentialDecay * duration;
      const d = delta * velocity + velocity;
      const e = Math.pow(dampingRatio, 2) * Math.pow(undampedFreq2, 2) * duration;
      const f = Math.exp(-delta);
      const g = calcAngularFreq(Math.pow(undampedFreq2, 2), dampingRatio);
      const factor = -envelope(undampedFreq2) + safeMin > 0 ? -1 : 1;
      return factor * ((d - e) * f) / g;
    };
  } else {
    envelope = (undampedFreq2) => {
      const a = Math.exp(-undampedFreq2 * duration);
      const b = (undampedFreq2 - velocity) * duration + 1;
      return -safeMin + a * b;
    };
    derivative = (undampedFreq2) => {
      const a = Math.exp(-undampedFreq2 * duration);
      const b = (velocity - undampedFreq2) * (duration * duration);
      return a * b;
    };
  }
  const initialGuess = 5 / duration;
  const undampedFreq = approximateRoot(envelope, derivative, initialGuess);
  duration = secondsToMilliseconds(duration);
  if (isNaN(undampedFreq)) {
    return {
      stiffness: springDefaults.stiffness,
      damping: springDefaults.damping,
      duration
    };
  } else {
    const stiffness = Math.pow(undampedFreq, 2) * mass;
    return {
      stiffness,
      damping: dampingRatio * 2 * Math.sqrt(mass * stiffness),
      duration
    };
  }
}
var rootIterations = 12;
function approximateRoot(envelope, derivative, initialGuess) {
  let result = initialGuess;
  for (let i = 1; i < rootIterations; i++) {
    result = result - envelope(result) / derivative(result);
  }
  return result;
}
function calcAngularFreq(undampedFreq, dampingRatio) {
  return undampedFreq * Math.sqrt(1 - dampingRatio * dampingRatio);
}

// node_modules/framer-motion/dist/es/animation/generators/spring/index.mjs
var durationKeys = ["duration", "bounce"];
var physicsKeys = ["stiffness", "damping", "mass"];
function isSpringType(options2, keys) {
  return keys.some((key) => options2[key] !== void 0);
}
function getSpringOptions(options2) {
  let springOptions = {
    velocity: springDefaults.velocity,
    stiffness: springDefaults.stiffness,
    damping: springDefaults.damping,
    mass: springDefaults.mass,
    isResolvedFromDuration: false,
    ...options2
  };
  if (!isSpringType(options2, physicsKeys) && isSpringType(options2, durationKeys)) {
    if (options2.visualDuration) {
      const visualDuration = options2.visualDuration;
      const root = 2 * Math.PI / (visualDuration * 1.2);
      const stiffness = root * root;
      const damping = 2 * clamp(0.05, 1, 1 - (options2.bounce || 0)) * Math.sqrt(stiffness);
      springOptions = {
        ...springOptions,
        mass: springDefaults.mass,
        stiffness,
        damping
      };
    } else {
      const derived = findSpring(options2);
      springOptions = {
        ...springOptions,
        ...derived,
        mass: springDefaults.mass
      };
      springOptions.isResolvedFromDuration = true;
    }
  }
  return springOptions;
}
function spring(optionsOrVisualDuration = springDefaults.visualDuration, bounce = springDefaults.bounce) {
  const options2 = typeof optionsOrVisualDuration !== "object" ? {
    visualDuration: optionsOrVisualDuration,
    keyframes: [0, 1],
    bounce
  } : optionsOrVisualDuration;
  let { restSpeed, restDelta } = options2;
  const origin = options2.keyframes[0];
  const target = options2.keyframes[options2.keyframes.length - 1];
  const state2 = { done: false, value: origin };
  const { stiffness, damping, mass, duration, velocity, isResolvedFromDuration } = getSpringOptions({
    ...options2,
    velocity: -millisecondsToSeconds(options2.velocity || 0)
  });
  const initialVelocity = velocity || 0;
  const dampingRatio = damping / (2 * Math.sqrt(stiffness * mass));
  const initialDelta = target - origin;
  const undampedAngularFreq = millisecondsToSeconds(Math.sqrt(stiffness / mass));
  const isGranularScale = Math.abs(initialDelta) < 5;
  restSpeed || (restSpeed = isGranularScale ? springDefaults.restSpeed.granular : springDefaults.restSpeed.default);
  restDelta || (restDelta = isGranularScale ? springDefaults.restDelta.granular : springDefaults.restDelta.default);
  let resolveSpring;
  if (dampingRatio < 1) {
    const angularFreq = calcAngularFreq(undampedAngularFreq, dampingRatio);
    resolveSpring = (t) => {
      const envelope = Math.exp(-dampingRatio * undampedAngularFreq * t);
      return target - envelope * ((initialVelocity + dampingRatio * undampedAngularFreq * initialDelta) / angularFreq * Math.sin(angularFreq * t) + initialDelta * Math.cos(angularFreq * t));
    };
  } else if (dampingRatio === 1) {
    resolveSpring = (t) => target - Math.exp(-undampedAngularFreq * t) * (initialDelta + (initialVelocity + undampedAngularFreq * initialDelta) * t);
  } else {
    const dampedAngularFreq = undampedAngularFreq * Math.sqrt(dampingRatio * dampingRatio - 1);
    resolveSpring = (t) => {
      const envelope = Math.exp(-dampingRatio * undampedAngularFreq * t);
      const freqForT = Math.min(dampedAngularFreq * t, 300);
      return target - envelope * ((initialVelocity + dampingRatio * undampedAngularFreq * initialDelta) * Math.sinh(freqForT) + dampedAngularFreq * initialDelta * Math.cosh(freqForT)) / dampedAngularFreq;
    };
  }
  const generator = {
    calculatedDuration: isResolvedFromDuration ? duration || null : null,
    next: (t) => {
      const current = resolveSpring(t);
      if (!isResolvedFromDuration) {
        let currentVelocity = 0;
        if (dampingRatio < 1) {
          currentVelocity = t === 0 ? secondsToMilliseconds(initialVelocity) : calcGeneratorVelocity(resolveSpring, t, current);
        }
        const isBelowVelocityThreshold = Math.abs(currentVelocity) <= restSpeed;
        const isBelowDisplacementThreshold = Math.abs(target - current) <= restDelta;
        state2.done = isBelowVelocityThreshold && isBelowDisplacementThreshold;
      } else {
        state2.done = t >= duration;
      }
      state2.value = state2.done ? target : current;
      return state2;
    },
    toString: () => {
      const calculatedDuration = Math.min(calcGeneratorDuration(generator), maxGeneratorDuration);
      const easing = generateLinearEasing((progress2) => generator.next(calculatedDuration * progress2).value, calculatedDuration, 30);
      return calculatedDuration + "ms " + easing;
    }
  };
  return generator;
}

// node_modules/framer-motion/dist/es/animation/generators/inertia.mjs
function inertia({ keyframes: keyframes2, velocity = 0, power = 0.8, timeConstant = 325, bounceDamping = 10, bounceStiffness = 500, modifyTarget, min, max, restDelta = 0.5, restSpeed }) {
  const origin = keyframes2[0];
  const state2 = {
    done: false,
    value: origin
  };
  const isOutOfBounds = (v) => min !== void 0 && v < min || max !== void 0 && v > max;
  const nearestBoundary = (v) => {
    if (min === void 0)
      return max;
    if (max === void 0)
      return min;
    return Math.abs(min - v) < Math.abs(max - v) ? min : max;
  };
  let amplitude = power * velocity;
  const ideal = origin + amplitude;
  const target = modifyTarget === void 0 ? ideal : modifyTarget(ideal);
  if (target !== ideal)
    amplitude = target - origin;
  const calcDelta = (t) => -amplitude * Math.exp(-t / timeConstant);
  const calcLatest = (t) => target + calcDelta(t);
  const applyFriction = (t) => {
    const delta = calcDelta(t);
    const latest = calcLatest(t);
    state2.done = Math.abs(delta) <= restDelta;
    state2.value = state2.done ? target : latest;
  };
  let timeReachedBoundary;
  let spring$1;
  const checkCatchBoundary = (t) => {
    if (!isOutOfBounds(state2.value))
      return;
    timeReachedBoundary = t;
    spring$1 = spring({
      keyframes: [state2.value, nearestBoundary(state2.value)],
      velocity: calcGeneratorVelocity(calcLatest, t, state2.value),
      // TODO: This should be passing * 1000
      damping: bounceDamping,
      stiffness: bounceStiffness,
      restDelta,
      restSpeed
    });
  };
  checkCatchBoundary(0);
  return {
    calculatedDuration: null,
    next: (t) => {
      let hasUpdatedFrame = false;
      if (!spring$1 && timeReachedBoundary === void 0) {
        hasUpdatedFrame = true;
        applyFriction(t);
        checkCatchBoundary(t);
      }
      if (timeReachedBoundary !== void 0 && t >= timeReachedBoundary) {
        return spring$1.next(t - timeReachedBoundary);
      } else {
        !hasUpdatedFrame && applyFriction(t);
        return state2;
      }
    }
  };
}

// node_modules/framer-motion/dist/es/easing/ease.mjs
var easeIn = /* @__PURE__ */ cubicBezier(0.42, 0, 1, 1);
var easeOut = /* @__PURE__ */ cubicBezier(0, 0, 0.58, 1);
var easeInOut = /* @__PURE__ */ cubicBezier(0.42, 0, 0.58, 1);

// node_modules/framer-motion/dist/es/easing/utils/is-easing-array.mjs
var isEasingArray = (ease2) => {
  return Array.isArray(ease2) && typeof ease2[0] !== "number";
};

// node_modules/framer-motion/dist/es/easing/utils/map.mjs
var easingLookup = {
  linear: noop,
  easeIn,
  easeInOut,
  easeOut,
  circIn,
  circInOut,
  circOut,
  backIn,
  backInOut,
  backOut,
  anticipate
};
var easingDefinitionToFunction = (definition) => {
  if (isBezierDefinition(definition)) {
    invariant(definition.length === 4, `Cubic bezier arrays must contain four numerical values.`);
    const [x1, y1, x2, y2] = definition;
    return cubicBezier(x1, y1, x2, y2);
  } else if (typeof definition === "string") {
    invariant(easingLookup[definition] !== void 0, `Invalid easing type '${definition}'`);
    return easingLookup[definition];
  }
  return definition;
};

// node_modules/framer-motion/dist/es/utils/interpolate.mjs
function createMixers(output, ease2, customMixer) {
  const mixers = [];
  const mixerFactory = customMixer || mix;
  const numMixers = output.length - 1;
  for (let i = 0; i < numMixers; i++) {
    let mixer = mixerFactory(output[i], output[i + 1]);
    if (ease2) {
      const easingFunction = Array.isArray(ease2) ? ease2[i] || noop : ease2;
      mixer = pipe(easingFunction, mixer);
    }
    mixers.push(mixer);
  }
  return mixers;
}
function interpolate(input, output, { clamp: isClamp = true, ease: ease2, mixer } = {}) {
  const inputLength = input.length;
  invariant(inputLength === output.length, "Both input and output ranges must be the same length");
  if (inputLength === 1)
    return () => output[0];
  if (inputLength === 2 && output[0] === output[1])
    return () => output[1];
  const isZeroDeltaRange = input[0] === input[1];
  if (input[0] > input[inputLength - 1]) {
    input = [...input].reverse();
    output = [...output].reverse();
  }
  const mixers = createMixers(output, ease2, mixer);
  const numMixers = mixers.length;
  const interpolator = (v) => {
    if (isZeroDeltaRange && v < input[0])
      return output[0];
    let i = 0;
    if (numMixers > 1) {
      for (; i < input.length - 2; i++) {
        if (v < input[i + 1])
          break;
      }
    }
    const progressInRange = progress(input[i], input[i + 1], v);
    return mixers[i](progressInRange);
  };
  return isClamp ? (v) => interpolator(clamp(input[0], input[inputLength - 1], v)) : interpolator;
}

// node_modules/framer-motion/dist/es/utils/offsets/fill.mjs
function fillOffset(offset, remaining) {
  const min = offset[offset.length - 1];
  for (let i = 1; i <= remaining; i++) {
    const offsetProgress = progress(0, remaining, i);
    offset.push(mixNumber(min, 1, offsetProgress));
  }
}

// node_modules/framer-motion/dist/es/utils/offsets/default.mjs
function defaultOffset(arr) {
  const offset = [0];
  fillOffset(offset, arr.length - 1);
  return offset;
}

// node_modules/framer-motion/dist/es/utils/offsets/time.mjs
function convertOffsetToTimes(offset, duration) {
  return offset.map((o) => o * duration);
}

// node_modules/framer-motion/dist/es/animation/generators/keyframes.mjs
function defaultEasing(values, easing) {
  return values.map(() => easing || easeInOut).splice(0, values.length - 1);
}
function keyframes({ duration = 300, keyframes: keyframeValues, times, ease: ease2 = "easeInOut" }) {
  const easingFunctions = isEasingArray(ease2) ? ease2.map(easingDefinitionToFunction) : easingDefinitionToFunction(ease2);
  const state2 = {
    done: false,
    value: keyframeValues[0]
  };
  const absoluteTimes = convertOffsetToTimes(
    // Only use the provided offsets if they're the correct length
    // TODO Maybe we should warn here if there's a length mismatch
    times && times.length === keyframeValues.length ? times : defaultOffset(keyframeValues),
    duration
  );
  const mapTimeToKeyframe = interpolate(absoluteTimes, keyframeValues, {
    ease: Array.isArray(easingFunctions) ? easingFunctions : defaultEasing(keyframeValues, easingFunctions)
  });
  return {
    calculatedDuration: duration,
    next: (t) => {
      state2.value = mapTimeToKeyframe(t);
      state2.done = t >= duration;
      return state2;
    }
  };
}

// node_modules/framer-motion/dist/es/animation/animators/drivers/driver-frameloop.mjs
var frameloopDriver = (update) => {
  const passTimestamp = ({ timestamp }) => update(timestamp);
  return {
    start: () => frame.update(passTimestamp, true),
    stop: () => cancelFrame(passTimestamp),
    /**
     * If we're processing this frame we can use the
     * framelocked timestamp to keep things in sync.
     */
    now: () => frameData.isProcessing ? frameData.timestamp : time.now()
  };
};

// node_modules/framer-motion/dist/es/animation/animators/MainThreadAnimation.mjs
var generators = {
  decay: inertia,
  inertia,
  tween: keyframes,
  keyframes,
  spring
};
var percentToProgress = (percent2) => percent2 / 100;
var MainThreadAnimation = class extends BaseAnimation {
  constructor(options2) {
    super(options2);
    this.holdTime = null;
    this.cancelTime = null;
    this.currentTime = 0;
    this.playbackSpeed = 1;
    this.pendingPlayState = "running";
    this.startTime = null;
    this.state = "idle";
    this.stop = () => {
      this.resolver.cancel();
      this.isStopped = true;
      if (this.state === "idle")
        return;
      this.teardown();
      const { onStop } = this.options;
      onStop && onStop();
    };
    const { name, motionValue: motionValue2, element, keyframes: keyframes2 } = this.options;
    const KeyframeResolver$1 = (element === null || element === void 0 ? void 0 : element.KeyframeResolver) || KeyframeResolver;
    const onResolved = (resolvedKeyframes, finalKeyframe) => this.onKeyframesResolved(resolvedKeyframes, finalKeyframe);
    this.resolver = new KeyframeResolver$1(keyframes2, onResolved, name, motionValue2, element);
    this.resolver.scheduleResolve();
  }
  flatten() {
    super.flatten();
    if (this._resolved) {
      Object.assign(this._resolved, this.initPlayback(this._resolved.keyframes));
    }
  }
  initPlayback(keyframes$1) {
    const { type = "keyframes", repeat = 0, repeatDelay = 0, repeatType, velocity = 0 } = this.options;
    const generatorFactory = isGenerator(type) ? type : generators[type] || keyframes;
    let mapPercentToKeyframes;
    let mirroredGenerator;
    if (generatorFactory !== keyframes && typeof keyframes$1[0] !== "number") {
      if (false) {
        invariant(keyframes$1.length === 2, `Only two keyframes currently supported with spring and inertia animations. Trying to animate ${keyframes$1}`);
      }
      mapPercentToKeyframes = pipe(percentToProgress, mix(keyframes$1[0], keyframes$1[1]));
      keyframes$1 = [0, 100];
    }
    const generator = generatorFactory({ ...this.options, keyframes: keyframes$1 });
    if (repeatType === "mirror") {
      mirroredGenerator = generatorFactory({
        ...this.options,
        keyframes: [...keyframes$1].reverse(),
        velocity: -velocity
      });
    }
    if (generator.calculatedDuration === null) {
      generator.calculatedDuration = calcGeneratorDuration(generator);
    }
    const { calculatedDuration } = generator;
    const resolvedDuration = calculatedDuration + repeatDelay;
    const totalDuration = resolvedDuration * (repeat + 1) - repeatDelay;
    return {
      generator,
      mirroredGenerator,
      mapPercentToKeyframes,
      calculatedDuration,
      resolvedDuration,
      totalDuration
    };
  }
  onPostResolved() {
    const { autoplay = true } = this.options;
    this.play();
    if (this.pendingPlayState === "paused" || !autoplay) {
      this.pause();
    } else {
      this.state = this.pendingPlayState;
    }
  }
  tick(timestamp, sample = false) {
    const { resolved } = this;
    if (!resolved) {
      const { keyframes: keyframes3 } = this.options;
      return { done: true, value: keyframes3[keyframes3.length - 1] };
    }
    const { finalKeyframe, generator, mirroredGenerator, mapPercentToKeyframes, keyframes: keyframes2, calculatedDuration, totalDuration, resolvedDuration } = resolved;
    if (this.startTime === null)
      return generator.next(0);
    const { delay: delay2, repeat, repeatType, repeatDelay, onUpdate } = this.options;
    if (this.speed > 0) {
      this.startTime = Math.min(this.startTime, timestamp);
    } else if (this.speed < 0) {
      this.startTime = Math.min(timestamp - totalDuration / this.speed, this.startTime);
    }
    if (sample) {
      this.currentTime = timestamp;
    } else if (this.holdTime !== null) {
      this.currentTime = this.holdTime;
    } else {
      this.currentTime = Math.round(timestamp - this.startTime) * this.speed;
    }
    const timeWithoutDelay = this.currentTime - delay2 * (this.speed >= 0 ? 1 : -1);
    const isInDelayPhase = this.speed >= 0 ? timeWithoutDelay < 0 : timeWithoutDelay > totalDuration;
    this.currentTime = Math.max(timeWithoutDelay, 0);
    if (this.state === "finished" && this.holdTime === null) {
      this.currentTime = totalDuration;
    }
    let elapsed = this.currentTime;
    let frameGenerator = generator;
    if (repeat) {
      const progress2 = Math.min(this.currentTime, totalDuration) / resolvedDuration;
      let currentIteration = Math.floor(progress2);
      let iterationProgress = progress2 % 1;
      if (!iterationProgress && progress2 >= 1) {
        iterationProgress = 1;
      }
      iterationProgress === 1 && currentIteration--;
      currentIteration = Math.min(currentIteration, repeat + 1);
      const isOddIteration = Boolean(currentIteration % 2);
      if (isOddIteration) {
        if (repeatType === "reverse") {
          iterationProgress = 1 - iterationProgress;
          if (repeatDelay) {
            iterationProgress -= repeatDelay / resolvedDuration;
          }
        } else if (repeatType === "mirror") {
          frameGenerator = mirroredGenerator;
        }
      }
      elapsed = clamp(0, 1, iterationProgress) * resolvedDuration;
    }
    const state2 = isInDelayPhase ? { done: false, value: keyframes2[0] } : frameGenerator.next(elapsed);
    if (mapPercentToKeyframes) {
      state2.value = mapPercentToKeyframes(state2.value);
    }
    let { done } = state2;
    if (!isInDelayPhase && calculatedDuration !== null) {
      done = this.speed >= 0 ? this.currentTime >= totalDuration : this.currentTime <= 0;
    }
    const isAnimationFinished = this.holdTime === null && (this.state === "finished" || this.state === "running" && done);
    if (isAnimationFinished && finalKeyframe !== void 0) {
      state2.value = getFinalKeyframe(keyframes2, this.options, finalKeyframe);
    }
    if (onUpdate) {
      onUpdate(state2.value);
    }
    if (isAnimationFinished) {
      this.finish();
    }
    return state2;
  }
  get duration() {
    const { resolved } = this;
    return resolved ? millisecondsToSeconds(resolved.calculatedDuration) : 0;
  }
  get time() {
    return millisecondsToSeconds(this.currentTime);
  }
  set time(newTime) {
    newTime = secondsToMilliseconds(newTime);
    this.currentTime = newTime;
    if (this.holdTime !== null || this.speed === 0) {
      this.holdTime = newTime;
    } else if (this.driver) {
      this.startTime = this.driver.now() - newTime / this.speed;
    }
  }
  get speed() {
    return this.playbackSpeed;
  }
  set speed(newSpeed) {
    const hasChanged = this.playbackSpeed !== newSpeed;
    this.playbackSpeed = newSpeed;
    if (hasChanged) {
      this.time = millisecondsToSeconds(this.currentTime);
    }
  }
  play() {
    if (!this.resolver.isScheduled) {
      this.resolver.resume();
    }
    if (!this._resolved) {
      this.pendingPlayState = "running";
      return;
    }
    if (this.isStopped)
      return;
    const { driver = frameloopDriver, onPlay, startTime } = this.options;
    if (!this.driver) {
      this.driver = driver((timestamp) => this.tick(timestamp));
    }
    onPlay && onPlay();
    const now2 = this.driver.now();
    if (this.holdTime !== null) {
      this.startTime = now2 - this.holdTime;
    } else if (!this.startTime) {
      this.startTime = startTime !== null && startTime !== void 0 ? startTime : this.calcStartTime();
    } else if (this.state === "finished") {
      this.startTime = now2;
    }
    if (this.state === "finished") {
      this.updateFinishedPromise();
    }
    this.cancelTime = this.startTime;
    this.holdTime = null;
    this.state = "running";
    this.driver.start();
  }
  pause() {
    var _a;
    if (!this._resolved) {
      this.pendingPlayState = "paused";
      return;
    }
    this.state = "paused";
    this.holdTime = (_a = this.currentTime) !== null && _a !== void 0 ? _a : 0;
  }
  complete() {
    if (this.state !== "running") {
      this.play();
    }
    this.pendingPlayState = this.state = "finished";
    this.holdTime = null;
  }
  finish() {
    this.teardown();
    this.state = "finished";
    const { onComplete } = this.options;
    onComplete && onComplete();
  }
  cancel() {
    if (this.cancelTime !== null) {
      this.tick(this.cancelTime);
    }
    this.teardown();
    this.updateFinishedPromise();
  }
  teardown() {
    this.state = "idle";
    this.stopDriver();
    this.resolveFinishedPromise();
    this.updateFinishedPromise();
    this.startTime = this.cancelTime = null;
    this.resolver.cancel();
  }
  stopDriver() {
    if (!this.driver)
      return;
    this.driver.stop();
    this.driver = void 0;
  }
  sample(time2) {
    this.startTime = 0;
    return this.tick(time2, true);
  }
};

// node_modules/framer-motion/dist/es/animation/animators/utils/accelerated-values.mjs
var acceleratedValues = /* @__PURE__ */ new Set([
  "opacity",
  "clipPath",
  "filter",
  "transform"
  // TODO: Can be accelerated but currently disabled until https://issues.chromium.org/issues/41491098 is resolved
  // or until we implement support for linear() easing.
  // "background-color"
]);

// node_modules/framer-motion/dist/es/animation/animators/waapi/index.mjs
function startWaapiAnimation(element, valueName, keyframes2, { delay: delay2 = 0, duration = 300, repeat = 0, repeatType = "loop", ease: ease2 = "easeInOut", times } = {}) {
  const keyframeOptions = { [valueName]: keyframes2 };
  if (times)
    keyframeOptions.offset = times;
  const easing = mapEasingToNativeEasing(ease2, duration);
  if (Array.isArray(easing))
    keyframeOptions.easing = easing;
  return element.animate(keyframeOptions, {
    delay: delay2,
    duration,
    easing: !Array.isArray(easing) ? easing : "linear",
    fill: "both",
    iterations: repeat + 1,
    direction: repeatType === "reverse" ? "alternate" : "normal"
  });
}

// node_modules/framer-motion/dist/es/animation/animators/waapi/utils/supports-waapi.mjs
var supportsWaapi = /* @__PURE__ */ memo(() => Object.hasOwnProperty.call(Element.prototype, "animate"));

// node_modules/framer-motion/dist/es/animation/animators/AcceleratedAnimation.mjs
var sampleDelta = 10;
var maxDuration = 2e4;
function requiresPregeneratedKeyframes(options2) {
  return isGenerator(options2.type) || options2.type === "spring" || !isWaapiSupportedEasing(options2.ease);
}
function pregenerateKeyframes(keyframes2, options2) {
  const sampleAnimation = new MainThreadAnimation({
    ...options2,
    keyframes: keyframes2,
    repeat: 0,
    delay: 0,
    isGenerator: true
  });
  let state2 = { done: false, value: keyframes2[0] };
  const pregeneratedKeyframes = [];
  let t = 0;
  while (!state2.done && t < maxDuration) {
    state2 = sampleAnimation.sample(t);
    pregeneratedKeyframes.push(state2.value);
    t += sampleDelta;
  }
  return {
    times: void 0,
    keyframes: pregeneratedKeyframes,
    duration: t - sampleDelta,
    ease: "linear"
  };
}
var unsupportedEasingFunctions = {
  anticipate,
  backInOut,
  circInOut
};
function isUnsupportedEase(key) {
  return key in unsupportedEasingFunctions;
}
var AcceleratedAnimation = class extends BaseAnimation {
  constructor(options2) {
    super(options2);
    const { name, motionValue: motionValue2, element, keyframes: keyframes2 } = this.options;
    this.resolver = new DOMKeyframesResolver(keyframes2, (resolvedKeyframes, finalKeyframe) => this.onKeyframesResolved(resolvedKeyframes, finalKeyframe), name, motionValue2, element);
    this.resolver.scheduleResolve();
  }
  initPlayback(keyframes2, finalKeyframe) {
    let { duration = 300, times, ease: ease2, type, motionValue: motionValue2, name, startTime } = this.options;
    if (!motionValue2.owner || !motionValue2.owner.current) {
      return false;
    }
    if (typeof ease2 === "string" && supportsLinearEasing() && isUnsupportedEase(ease2)) {
      ease2 = unsupportedEasingFunctions[ease2];
    }
    if (requiresPregeneratedKeyframes(this.options)) {
      const { onComplete, onUpdate, motionValue: motionValue3, element, ...options2 } = this.options;
      const pregeneratedAnimation = pregenerateKeyframes(keyframes2, options2);
      keyframes2 = pregeneratedAnimation.keyframes;
      if (keyframes2.length === 1) {
        keyframes2[1] = keyframes2[0];
      }
      duration = pregeneratedAnimation.duration;
      times = pregeneratedAnimation.times;
      ease2 = pregeneratedAnimation.ease;
      type = "keyframes";
    }
    const animation = startWaapiAnimation(motionValue2.owner.current, name, keyframes2, { ...this.options, duration, times, ease: ease2 });
    animation.startTime = startTime !== null && startTime !== void 0 ? startTime : this.calcStartTime();
    if (this.pendingTimeline) {
      attachTimeline(animation, this.pendingTimeline);
      this.pendingTimeline = void 0;
    } else {
      animation.onfinish = () => {
        const { onComplete } = this.options;
        motionValue2.set(getFinalKeyframe(keyframes2, this.options, finalKeyframe));
        onComplete && onComplete();
        this.cancel();
        this.resolveFinishedPromise();
      };
    }
    return {
      animation,
      duration,
      times,
      type,
      ease: ease2,
      keyframes: keyframes2
    };
  }
  get duration() {
    const { resolved } = this;
    if (!resolved)
      return 0;
    const { duration } = resolved;
    return millisecondsToSeconds(duration);
  }
  get time() {
    const { resolved } = this;
    if (!resolved)
      return 0;
    const { animation } = resolved;
    return millisecondsToSeconds(animation.currentTime || 0);
  }
  set time(newTime) {
    const { resolved } = this;
    if (!resolved)
      return;
    const { animation } = resolved;
    animation.currentTime = secondsToMilliseconds(newTime);
  }
  get speed() {
    const { resolved } = this;
    if (!resolved)
      return 1;
    const { animation } = resolved;
    return animation.playbackRate;
  }
  set speed(newSpeed) {
    const { resolved } = this;
    if (!resolved)
      return;
    const { animation } = resolved;
    animation.playbackRate = newSpeed;
  }
  get state() {
    const { resolved } = this;
    if (!resolved)
      return "idle";
    const { animation } = resolved;
    return animation.playState;
  }
  get startTime() {
    const { resolved } = this;
    if (!resolved)
      return null;
    const { animation } = resolved;
    return animation.startTime;
  }
  /**
   * Replace the default DocumentTimeline with another AnimationTimeline.
   * Currently used for scroll animations.
   */
  attachTimeline(timeline) {
    if (!this._resolved) {
      this.pendingTimeline = timeline;
    } else {
      const { resolved } = this;
      if (!resolved)
        return noop;
      const { animation } = resolved;
      attachTimeline(animation, timeline);
    }
    return noop;
  }
  play() {
    if (this.isStopped)
      return;
    const { resolved } = this;
    if (!resolved)
      return;
    const { animation } = resolved;
    if (animation.playState === "finished") {
      this.updateFinishedPromise();
    }
    animation.play();
  }
  pause() {
    const { resolved } = this;
    if (!resolved)
      return;
    const { animation } = resolved;
    animation.pause();
  }
  stop() {
    this.resolver.cancel();
    this.isStopped = true;
    if (this.state === "idle")
      return;
    this.resolveFinishedPromise();
    this.updateFinishedPromise();
    const { resolved } = this;
    if (!resolved)
      return;
    const { animation, keyframes: keyframes2, duration, type, ease: ease2, times } = resolved;
    if (animation.playState === "idle" || animation.playState === "finished") {
      return;
    }
    if (this.time) {
      const { motionValue: motionValue2, onUpdate, onComplete, element, ...options2 } = this.options;
      const sampleAnimation = new MainThreadAnimation({
        ...options2,
        keyframes: keyframes2,
        duration,
        type,
        ease: ease2,
        times,
        isGenerator: true
      });
      const sampleTime = secondsToMilliseconds(this.time);
      motionValue2.setWithVelocity(sampleAnimation.sample(sampleTime - sampleDelta).value, sampleAnimation.sample(sampleTime).value, sampleDelta);
    }
    const { onStop } = this.options;
    onStop && onStop();
    this.cancel();
  }
  complete() {
    const { resolved } = this;
    if (!resolved)
      return;
    resolved.animation.finish();
  }
  cancel() {
    const { resolved } = this;
    if (!resolved)
      return;
    resolved.animation.cancel();
  }
  static supports(options2) {
    const { motionValue: motionValue2, name, repeatDelay, repeatType, damping, type } = options2;
    if (!motionValue2 || !motionValue2.owner || !(motionValue2.owner.current instanceof HTMLElement)) {
      return false;
    }
    const { onUpdate, transformTemplate } = motionValue2.owner.getProps();
    return supportsWaapi() && name && acceleratedValues.has(name) && /**
     * If we're outputting values to onUpdate then we can't use WAAPI as there's
     * no way to read the value from WAAPI every frame.
     */
    !onUpdate && !transformTemplate && !repeatDelay && repeatType !== "mirror" && damping !== 0 && type !== "inertia";
  }
};

// node_modules/framer-motion/dist/es/animation/utils/default-transitions.mjs
var underDampedSpring = {
  type: "spring",
  stiffness: 500,
  damping: 25,
  restSpeed: 10
};
var criticallyDampedSpring = (target) => ({
  type: "spring",
  stiffness: 550,
  damping: target === 0 ? 2 * Math.sqrt(550) : 30,
  restSpeed: 10
});
var keyframesTransition = {
  type: "keyframes",
  duration: 0.8
};
var ease = {
  type: "keyframes",
  ease: [0.25, 0.1, 0.35, 1],
  duration: 0.3
};
var getDefaultTransition = (valueKey, { keyframes: keyframes2 }) => {
  if (keyframes2.length > 2) {
    return keyframesTransition;
  } else if (transformProps.has(valueKey)) {
    return valueKey.startsWith("scale") ? criticallyDampedSpring(keyframes2[1]) : underDampedSpring;
  }
  return ease;
};

// node_modules/framer-motion/dist/es/animation/utils/is-transition-defined.mjs
function isTransitionDefined({ when, delay: _delay, delayChildren, staggerChildren, staggerDirection, repeat, repeatType, repeatDelay, from, elapsed, ...transition }) {
  return !!Object.keys(transition).length;
}

// node_modules/framer-motion/dist/es/animation/interfaces/motion-value.mjs
var animateMotionValue = (name, value, target, transition = {}, element, isHandoff) => (onComplete) => {
  const valueTransition = getValueTransition(transition, name) || {};
  const delay2 = valueTransition.delay || transition.delay || 0;
  let { elapsed = 0 } = transition;
  elapsed = elapsed - secondsToMilliseconds(delay2);
  let options2 = {
    keyframes: Array.isArray(target) ? target : [null, target],
    ease: "easeOut",
    velocity: value.getVelocity(),
    ...valueTransition,
    delay: -elapsed,
    onUpdate: (v) => {
      value.set(v);
      valueTransition.onUpdate && valueTransition.onUpdate(v);
    },
    onComplete: () => {
      onComplete();
      valueTransition.onComplete && valueTransition.onComplete();
    },
    name,
    motionValue: value,
    element: isHandoff ? void 0 : element
  };
  if (!isTransitionDefined(valueTransition)) {
    options2 = {
      ...options2,
      ...getDefaultTransition(name, options2)
    };
  }
  if (options2.duration) {
    options2.duration = secondsToMilliseconds(options2.duration);
  }
  if (options2.repeatDelay) {
    options2.repeatDelay = secondsToMilliseconds(options2.repeatDelay);
  }
  if (options2.from !== void 0) {
    options2.keyframes[0] = options2.from;
  }
  let shouldSkip = false;
  if (options2.type === false || options2.duration === 0 && !options2.repeatDelay) {
    options2.duration = 0;
    if (options2.delay === 0) {
      shouldSkip = true;
    }
  }
  if (instantAnimationState.current || MotionGlobalConfig.skipAnimations) {
    shouldSkip = true;
    options2.duration = 0;
    options2.delay = 0;
  }
  if (shouldSkip && !isHandoff && value.get() !== void 0) {
    const finalKeyframe = getFinalKeyframe(options2.keyframes, valueTransition);
    if (finalKeyframe !== void 0) {
      frame.update(() => {
        options2.onUpdate(finalKeyframe);
        options2.onComplete();
      });
      return new GroupPlaybackControls([]);
    }
  }
  if (!isHandoff && AcceleratedAnimation.supports(options2)) {
    return new AcceleratedAnimation(options2);
  } else {
    return new MainThreadAnimation(options2);
  }
};

// node_modules/framer-motion/dist/es/animation/interfaces/visual-element-target.mjs
function shouldBlockAnimation({ protectedKeys, needsAnimating }, key) {
  const shouldBlock = protectedKeys.hasOwnProperty(key) && needsAnimating[key] !== true;
  needsAnimating[key] = false;
  return shouldBlock;
}
function animateTarget(visualElement, targetAndTransition, { delay: delay2 = 0, transitionOverride, type } = {}) {
  var _a;
  let { transition = visualElement.getDefaultTransition(), transitionEnd, ...target } = targetAndTransition;
  if (transitionOverride)
    transition = transitionOverride;
  const animations2 = [];
  const animationTypeState = type && visualElement.animationState && visualElement.animationState.getState()[type];
  for (const key in target) {
    const value = visualElement.getValue(key, (_a = visualElement.latestValues[key]) !== null && _a !== void 0 ? _a : null);
    const valueTarget = target[key];
    if (valueTarget === void 0 || animationTypeState && shouldBlockAnimation(animationTypeState, key)) {
      continue;
    }
    const valueTransition = {
      delay: delay2,
      ...getValueTransition(transition || {}, key)
    };
    let isHandoff = false;
    if (window.MotionHandoffAnimation) {
      const appearId = getOptimisedAppearId(visualElement);
      if (appearId) {
        const startTime = window.MotionHandoffAnimation(appearId, key, frame);
        if (startTime !== null) {
          valueTransition.startTime = startTime;
          isHandoff = true;
        }
      }
    }
    addValueToWillChange(visualElement, key);
    value.start(animateMotionValue(key, value, valueTarget, visualElement.shouldReduceMotion && positionalKeys.has(key) ? { type: false } : valueTransition, visualElement, isHandoff));
    const animation = value.animation;
    if (animation) {
      animations2.push(animation);
    }
  }
  if (transitionEnd) {
    Promise.all(animations2).then(() => {
      frame.update(() => {
        transitionEnd && setTarget(visualElement, transitionEnd);
      });
    });
  }
  return animations2;
}

// node_modules/framer-motion/dist/es/animation/interfaces/visual-element-variant.mjs
function animateVariant(visualElement, variant, options2 = {}) {
  var _a;
  const resolved = resolveVariant(visualElement, variant, options2.type === "exit" ? (_a = visualElement.presenceContext) === null || _a === void 0 ? void 0 : _a.custom : void 0);
  let { transition = visualElement.getDefaultTransition() || {} } = resolved || {};
  if (options2.transitionOverride) {
    transition = options2.transitionOverride;
  }
  const getAnimation = resolved ? () => Promise.all(animateTarget(visualElement, resolved, options2)) : () => Promise.resolve();
  const getChildAnimations = visualElement.variantChildren && visualElement.variantChildren.size ? (forwardDelay = 0) => {
    const { delayChildren = 0, staggerChildren, staggerDirection } = transition;
    return animateChildren(visualElement, variant, delayChildren + forwardDelay, staggerChildren, staggerDirection, options2);
  } : () => Promise.resolve();
  const { when } = transition;
  if (when) {
    const [first, last] = when === "beforeChildren" ? [getAnimation, getChildAnimations] : [getChildAnimations, getAnimation];
    return first().then(() => last());
  } else {
    return Promise.all([getAnimation(), getChildAnimations(options2.delay)]);
  }
}
function animateChildren(visualElement, variant, delayChildren = 0, staggerChildren = 0, staggerDirection = 1, options2) {
  const animations2 = [];
  const maxStaggerDuration = (visualElement.variantChildren.size - 1) * staggerChildren;
  const generateStaggerDuration = staggerDirection === 1 ? (i = 0) => i * staggerChildren : (i = 0) => maxStaggerDuration - i * staggerChildren;
  Array.from(visualElement.variantChildren).sort(sortByTreeOrder).forEach((child, i) => {
    child.notify("AnimationStart", variant);
    animations2.push(animateVariant(child, variant, {
      ...options2,
      delay: delayChildren + generateStaggerDuration(i)
    }).then(() => child.notify("AnimationComplete", variant)));
  });
  return Promise.all(animations2);
}
function sortByTreeOrder(a, b) {
  return a.sortNodePosition(b);
}

// node_modules/framer-motion/dist/es/animation/interfaces/visual-element.mjs
function animateVisualElement(visualElement, definition, options2 = {}) {
  visualElement.notify("AnimationStart", definition);
  let animation;
  if (Array.isArray(definition)) {
    const animations2 = definition.map((variant) => animateVariant(visualElement, variant, options2));
    animation = Promise.all(animations2);
  } else if (typeof definition === "string") {
    animation = animateVariant(visualElement, definition, options2);
  } else {
    const resolvedDefinition = typeof definition === "function" ? resolveVariant(visualElement, definition, options2.custom) : definition;
    animation = Promise.all(animateTarget(visualElement, resolvedDefinition, options2));
  }
  return animation.then(() => {
    visualElement.notify("AnimationComplete", definition);
  });
}

// node_modules/framer-motion/dist/es/render/utils/get-variant-context.mjs
var numVariantProps = variantProps.length;
function getVariantContext(visualElement) {
  if (!visualElement)
    return void 0;
  if (!visualElement.isControllingVariants) {
    const context2 = visualElement.parent ? getVariantContext(visualElement.parent) || {} : {};
    if (visualElement.props.initial !== void 0) {
      context2.initial = visualElement.props.initial;
    }
    return context2;
  }
  const context = {};
  for (let i = 0; i < numVariantProps; i++) {
    const name = variantProps[i];
    const prop = visualElement.props[name];
    if (isVariantLabel(prop) || prop === false) {
      context[name] = prop;
    }
  }
  return context;
}

// node_modules/framer-motion/dist/es/render/utils/animation-state.mjs
var reversePriorityOrder = [...variantPriorityOrder].reverse();
var numAnimationTypes = variantPriorityOrder.length;
function animateList(visualElement) {
  return (animations2) => Promise.all(animations2.map(({ animation, options: options2 }) => animateVisualElement(visualElement, animation, options2)));
}
function createAnimationState(visualElement) {
  let animate = animateList(visualElement);
  let state2 = createState();
  let isInitialRender = true;
  const buildResolvedTypeValues = (type) => (acc, definition) => {
    var _a;
    const resolved = resolveVariant(visualElement, definition, type === "exit" ? (_a = visualElement.presenceContext) === null || _a === void 0 ? void 0 : _a.custom : void 0);
    if (resolved) {
      const { transition, transitionEnd, ...target } = resolved;
      acc = { ...acc, ...target, ...transitionEnd };
    }
    return acc;
  };
  function setAnimateFunction(makeAnimator) {
    animate = makeAnimator(visualElement);
  }
  function animateChanges(changedActiveType) {
    const { props } = visualElement;
    const context = getVariantContext(visualElement.parent) || {};
    const animations2 = [];
    const removedKeys = /* @__PURE__ */ new Set();
    let encounteredKeys = {};
    let removedVariantIndex = Infinity;
    for (let i = 0; i < numAnimationTypes; i++) {
      const type = reversePriorityOrder[i];
      const typeState = state2[type];
      const prop = props[type] !== void 0 ? props[type] : context[type];
      const propIsVariant = isVariantLabel(prop);
      const activeDelta = type === changedActiveType ? typeState.isActive : null;
      if (activeDelta === false)
        removedVariantIndex = i;
      let isInherited = prop === context[type] && prop !== props[type] && propIsVariant;
      if (isInherited && isInitialRender && visualElement.manuallyAnimateOnMount) {
        isInherited = false;
      }
      typeState.protectedKeys = { ...encounteredKeys };
      if (
        // If it isn't active and hasn't *just* been set as inactive
        !typeState.isActive && activeDelta === null || // If we didn't and don't have any defined prop for this animation type
        !prop && !typeState.prevProp || // Or if the prop doesn't define an animation
        isAnimationControls(prop) || typeof prop === "boolean"
      ) {
        continue;
      }
      const variantDidChange = checkVariantsDidChange(typeState.prevProp, prop);
      let shouldAnimateType = variantDidChange || // If we're making this variant active, we want to always make it active
      type === changedActiveType && typeState.isActive && !isInherited && propIsVariant || // If we removed a higher-priority variant (i is in reverse order)
      i > removedVariantIndex && propIsVariant;
      let handledRemovedValues = false;
      const definitionList = Array.isArray(prop) ? prop : [prop];
      let resolvedValues = definitionList.reduce(buildResolvedTypeValues(type), {});
      if (activeDelta === false)
        resolvedValues = {};
      const { prevResolvedValues = {} } = typeState;
      const allKeys = {
        ...prevResolvedValues,
        ...resolvedValues
      };
      const markToAnimate = (key) => {
        shouldAnimateType = true;
        if (removedKeys.has(key)) {
          handledRemovedValues = true;
          removedKeys.delete(key);
        }
        typeState.needsAnimating[key] = true;
        const motionValue2 = visualElement.getValue(key);
        if (motionValue2)
          motionValue2.liveStyle = false;
      };
      for (const key in allKeys) {
        const next = resolvedValues[key];
        const prev = prevResolvedValues[key];
        if (encounteredKeys.hasOwnProperty(key))
          continue;
        let valueHasChanged = false;
        if (isKeyframesTarget(next) && isKeyframesTarget(prev)) {
          valueHasChanged = !shallowCompare(next, prev);
        } else {
          valueHasChanged = next !== prev;
        }
        if (valueHasChanged) {
          if (next !== void 0 && next !== null) {
            markToAnimate(key);
          } else {
            removedKeys.add(key);
          }
        } else if (next !== void 0 && removedKeys.has(key)) {
          markToAnimate(key);
        } else {
          typeState.protectedKeys[key] = true;
        }
      }
      typeState.prevProp = prop;
      typeState.prevResolvedValues = resolvedValues;
      if (typeState.isActive) {
        encounteredKeys = { ...encounteredKeys, ...resolvedValues };
      }
      if (isInitialRender && visualElement.blockInitialAnimation) {
        shouldAnimateType = false;
      }
      const willAnimateViaParent = isInherited && variantDidChange;
      const needsAnimating = !willAnimateViaParent || handledRemovedValues;
      if (shouldAnimateType && needsAnimating) {
        animations2.push(...definitionList.map((animation) => ({
          animation,
          options: { type }
        })));
      }
    }
    if (removedKeys.size) {
      const fallbackAnimation = {};
      removedKeys.forEach((key) => {
        const fallbackTarget = visualElement.getBaseTarget(key);
        const motionValue2 = visualElement.getValue(key);
        if (motionValue2)
          motionValue2.liveStyle = true;
        fallbackAnimation[key] = fallbackTarget !== null && fallbackTarget !== void 0 ? fallbackTarget : null;
      });
      animations2.push({ animation: fallbackAnimation });
    }
    let shouldAnimate = Boolean(animations2.length);
    if (isInitialRender && (props.initial === false || props.initial === props.animate) && !visualElement.manuallyAnimateOnMount) {
      shouldAnimate = false;
    }
    isInitialRender = false;
    return shouldAnimate ? animate(animations2) : Promise.resolve();
  }
  function setActive(type, isActive) {
    var _a;
    if (state2[type].isActive === isActive)
      return Promise.resolve();
    (_a = visualElement.variantChildren) === null || _a === void 0 ? void 0 : _a.forEach((child) => {
      var _a2;
      return (_a2 = child.animationState) === null || _a2 === void 0 ? void 0 : _a2.setActive(type, isActive);
    });
    state2[type].isActive = isActive;
    const animations2 = animateChanges(type);
    for (const key in state2) {
      state2[key].protectedKeys = {};
    }
    return animations2;
  }
  return {
    animateChanges,
    setActive,
    setAnimateFunction,
    getState: () => state2,
    reset: () => {
      state2 = createState();
      isInitialRender = true;
    }
  };
}
function checkVariantsDidChange(prev, next) {
  if (typeof next === "string") {
    return next !== prev;
  } else if (Array.isArray(next)) {
    return !shallowCompare(next, prev);
  }
  return false;
}
function createTypeState(isActive = false) {
  return {
    isActive,
    protectedKeys: {},
    needsAnimating: {},
    prevResolvedValues: {}
  };
}
function createState() {
  return {
    animate: createTypeState(true),
    whileInView: createTypeState(),
    whileHover: createTypeState(),
    whileTap: createTypeState(),
    whileDrag: createTypeState(),
    whileFocus: createTypeState(),
    exit: createTypeState()
  };
}

// node_modules/framer-motion/dist/es/motion/features/Feature.mjs
var Feature = class {
  constructor(node) {
    this.isMounted = false;
    this.node = node;
  }
  update() {
  }
};

// node_modules/framer-motion/dist/es/motion/features/animation/index.mjs
var AnimationFeature = class extends Feature {
  /**
   * We dynamically generate the AnimationState manager as it contains a reference
   * to the underlying animation library. We only want to load that if we load this,
   * so people can optionally code split it out using the `m` component.
   */
  constructor(node) {
    super(node);
    node.animationState || (node.animationState = createAnimationState(node));
  }
  updateAnimationControlsSubscription() {
    const { animate } = this.node.getProps();
    if (isAnimationControls(animate)) {
      this.unmountControls = animate.subscribe(this.node);
    }
  }
  /**
   * Subscribe any provided AnimationControls to the component's VisualElement
   */
  mount() {
    this.updateAnimationControlsSubscription();
  }
  update() {
    const { animate } = this.node.getProps();
    const { animate: prevAnimate } = this.node.prevProps || {};
    if (animate !== prevAnimate) {
      this.updateAnimationControlsSubscription();
    }
  }
  unmount() {
    var _a;
    this.node.animationState.reset();
    (_a = this.unmountControls) === null || _a === void 0 ? void 0 : _a.call(this);
  }
};

// node_modules/framer-motion/dist/es/motion/features/animation/exit.mjs
var id = 0;
var ExitAnimationFeature = class extends Feature {
  constructor() {
    super(...arguments);
    this.id = id++;
  }
  update() {
    if (!this.node.presenceContext)
      return;
    const { isPresent, onExitComplete } = this.node.presenceContext;
    const { isPresent: prevIsPresent } = this.node.prevPresenceContext || {};
    if (!this.node.animationState || isPresent === prevIsPresent) {
      return;
    }
    const exitAnimation = this.node.animationState.setActive("exit", !isPresent);
    if (onExitComplete && !isPresent) {
      exitAnimation.then(() => onExitComplete(this.id));
    }
  }
  mount() {
    const { register } = this.node.presenceContext || {};
    if (register) {
      this.unmount = register(this.id);
    }
  }
  unmount() {
  }
};

// node_modules/framer-motion/dist/es/motion/features/animations.mjs
var animations = {
  animation: {
    Feature: AnimationFeature
  },
  exit: {
    Feature: ExitAnimationFeature
  }
};

// node_modules/framer-motion/dist/es/events/add-dom-event.mjs
function addDomEvent(target, eventName, handler, options2 = { passive: true }) {
  target.addEventListener(eventName, handler, options2);
  return () => target.removeEventListener(eventName, handler);
}

// node_modules/framer-motion/dist/es/events/event-info.mjs
function extractEventInfo(event) {
  return {
    point: {
      x: event.pageX,
      y: event.pageY
    }
  };
}
var addPointerInfo = (handler) => {
  return (event) => isPrimaryPointer(event) && handler(event, extractEventInfo(event));
};

// node_modules/framer-motion/dist/es/events/add-pointer-event.mjs
function addPointerEvent(target, eventName, handler, options2) {
  return addDomEvent(target, eventName, addPointerInfo(handler), options2);
}

// node_modules/framer-motion/dist/es/utils/distance.mjs
var distance = (a, b) => Math.abs(a - b);
function distance2D(a, b) {
  const xDelta = distance(a.x, b.x);
  const yDelta = distance(a.y, b.y);
  return Math.sqrt(xDelta ** 2 + yDelta ** 2);
}

// node_modules/framer-motion/dist/es/gestures/pan/PanSession.mjs
var PanSession = class {
  constructor(event, handlers, { transformPagePoint, contextWindow, dragSnapToOrigin = false } = {}) {
    this.startEvent = null;
    this.lastMoveEvent = null;
    this.lastMoveEventInfo = null;
    this.handlers = {};
    this.contextWindow = window;
    this.updatePoint = () => {
      if (!(this.lastMoveEvent && this.lastMoveEventInfo))
        return;
      const info2 = getPanInfo(this.lastMoveEventInfo, this.history);
      const isPanStarted = this.startEvent !== null;
      const isDistancePastThreshold = distance2D(info2.offset, { x: 0, y: 0 }) >= 3;
      if (!isPanStarted && !isDistancePastThreshold)
        return;
      const { point: point2 } = info2;
      const { timestamp: timestamp2 } = frameData;
      this.history.push({ ...point2, timestamp: timestamp2 });
      const { onStart, onMove } = this.handlers;
      if (!isPanStarted) {
        onStart && onStart(this.lastMoveEvent, info2);
        this.startEvent = this.lastMoveEvent;
      }
      onMove && onMove(this.lastMoveEvent, info2);
    };
    this.handlePointerMove = (event2, info2) => {
      this.lastMoveEvent = event2;
      this.lastMoveEventInfo = transformPoint(info2, this.transformPagePoint);
      frame.update(this.updatePoint, true);
    };
    this.handlePointerUp = (event2, info2) => {
      this.end();
      const { onEnd, onSessionEnd, resumeAnimation } = this.handlers;
      if (this.dragSnapToOrigin)
        resumeAnimation && resumeAnimation();
      if (!(this.lastMoveEvent && this.lastMoveEventInfo))
        return;
      const panInfo = getPanInfo(event2.type === "pointercancel" ? this.lastMoveEventInfo : transformPoint(info2, this.transformPagePoint), this.history);
      if (this.startEvent && onEnd) {
        onEnd(event2, panInfo);
      }
      onSessionEnd && onSessionEnd(event2, panInfo);
    };
    if (!isPrimaryPointer(event))
      return;
    this.dragSnapToOrigin = dragSnapToOrigin;
    this.handlers = handlers;
    this.transformPagePoint = transformPagePoint;
    this.contextWindow = contextWindow || window;
    const info = extractEventInfo(event);
    const initialInfo = transformPoint(info, this.transformPagePoint);
    const { point } = initialInfo;
    const { timestamp } = frameData;
    this.history = [{ ...point, timestamp }];
    const { onSessionStart } = handlers;
    onSessionStart && onSessionStart(event, getPanInfo(initialInfo, this.history));
    this.removeListeners = pipe(addPointerEvent(this.contextWindow, "pointermove", this.handlePointerMove), addPointerEvent(this.contextWindow, "pointerup", this.handlePointerUp), addPointerEvent(this.contextWindow, "pointercancel", this.handlePointerUp));
  }
  updateHandlers(handlers) {
    this.handlers = handlers;
  }
  end() {
    this.removeListeners && this.removeListeners();
    cancelFrame(this.updatePoint);
  }
};
function transformPoint(info, transformPagePoint) {
  return transformPagePoint ? { point: transformPagePoint(info.point) } : info;
}
function subtractPoint(a, b) {
  return { x: a.x - b.x, y: a.y - b.y };
}
function getPanInfo({ point }, history) {
  return {
    point,
    delta: subtractPoint(point, lastDevicePoint(history)),
    offset: subtractPoint(point, startDevicePoint(history)),
    velocity: getVelocity(history, 0.1)
  };
}
function startDevicePoint(history) {
  return history[0];
}
function lastDevicePoint(history) {
  return history[history.length - 1];
}
function getVelocity(history, timeDelta) {
  if (history.length < 2) {
    return { x: 0, y: 0 };
  }
  let i = history.length - 1;
  let timestampedPoint = null;
  const lastPoint = lastDevicePoint(history);
  while (i >= 0) {
    timestampedPoint = history[i];
    if (lastPoint.timestamp - timestampedPoint.timestamp > secondsToMilliseconds(timeDelta)) {
      break;
    }
    i--;
  }
  if (!timestampedPoint) {
    return { x: 0, y: 0 };
  }
  const time2 = millisecondsToSeconds(lastPoint.timestamp - timestampedPoint.timestamp);
  if (time2 === 0) {
    return { x: 0, y: 0 };
  }
  const currentVelocity = {
    x: (lastPoint.x - timestampedPoint.x) / time2,
    y: (lastPoint.y - timestampedPoint.y) / time2
  };
  if (currentVelocity.x === Infinity) {
    currentVelocity.x = 0;
  }
  if (currentVelocity.y === Infinity) {
    currentVelocity.y = 0;
  }
  return currentVelocity;
}

// node_modules/framer-motion/dist/es/projection/geometry/delta-calc.mjs
var SCALE_PRECISION = 1e-4;
var SCALE_MIN = 1 - SCALE_PRECISION;
var SCALE_MAX = 1 + SCALE_PRECISION;
var TRANSLATE_PRECISION = 0.01;
var TRANSLATE_MIN = 0 - TRANSLATE_PRECISION;
var TRANSLATE_MAX = 0 + TRANSLATE_PRECISION;
function calcLength(axis) {
  return axis.max - axis.min;
}
function isNear(value, target, maxDistance) {
  return Math.abs(value - target) <= maxDistance;
}
function calcAxisDelta(delta, source, target, origin = 0.5) {
  delta.origin = origin;
  delta.originPoint = mixNumber(source.min, source.max, delta.origin);
  delta.scale = calcLength(target) / calcLength(source);
  delta.translate = mixNumber(target.min, target.max, delta.origin) - delta.originPoint;
  if (delta.scale >= SCALE_MIN && delta.scale <= SCALE_MAX || isNaN(delta.scale)) {
    delta.scale = 1;
  }
  if (delta.translate >= TRANSLATE_MIN && delta.translate <= TRANSLATE_MAX || isNaN(delta.translate)) {
    delta.translate = 0;
  }
}
function calcBoxDelta(delta, source, target, origin) {
  calcAxisDelta(delta.x, source.x, target.x, origin ? origin.originX : void 0);
  calcAxisDelta(delta.y, source.y, target.y, origin ? origin.originY : void 0);
}
function calcRelativeAxis(target, relative, parent) {
  target.min = parent.min + relative.min;
  target.max = target.min + calcLength(relative);
}
function calcRelativeBox(target, relative, parent) {
  calcRelativeAxis(target.x, relative.x, parent.x);
  calcRelativeAxis(target.y, relative.y, parent.y);
}
function calcRelativeAxisPosition(target, layout2, parent) {
  target.min = layout2.min - parent.min;
  target.max = target.min + calcLength(layout2);
}
function calcRelativePosition(target, layout2, parent) {
  calcRelativeAxisPosition(target.x, layout2.x, parent.x);
  calcRelativeAxisPosition(target.y, layout2.y, parent.y);
}

// node_modules/framer-motion/dist/es/gestures/drag/utils/constraints.mjs
function applyConstraints(point, { min, max }, elastic) {
  if (min !== void 0 && point < min) {
    point = elastic ? mixNumber(min, point, elastic.min) : Math.max(point, min);
  } else if (max !== void 0 && point > max) {
    point = elastic ? mixNumber(max, point, elastic.max) : Math.min(point, max);
  }
  return point;
}
function calcRelativeAxisConstraints(axis, min, max) {
  return {
    min: min !== void 0 ? axis.min + min : void 0,
    max: max !== void 0 ? axis.max + max - (axis.max - axis.min) : void 0
  };
}
function calcRelativeConstraints(layoutBox, { top, left, bottom, right }) {
  return {
    x: calcRelativeAxisConstraints(layoutBox.x, left, right),
    y: calcRelativeAxisConstraints(layoutBox.y, top, bottom)
  };
}
function calcViewportAxisConstraints(layoutAxis, constraintsAxis) {
  let min = constraintsAxis.min - layoutAxis.min;
  let max = constraintsAxis.max - layoutAxis.max;
  if (constraintsAxis.max - constraintsAxis.min < layoutAxis.max - layoutAxis.min) {
    [min, max] = [max, min];
  }
  return { min, max };
}
function calcViewportConstraints(layoutBox, constraintsBox) {
  return {
    x: calcViewportAxisConstraints(layoutBox.x, constraintsBox.x),
    y: calcViewportAxisConstraints(layoutBox.y, constraintsBox.y)
  };
}
function calcOrigin2(source, target) {
  let origin = 0.5;
  const sourceLength = calcLength(source);
  const targetLength = calcLength(target);
  if (targetLength > sourceLength) {
    origin = progress(target.min, target.max - sourceLength, source.min);
  } else if (sourceLength > targetLength) {
    origin = progress(source.min, source.max - targetLength, target.min);
  }
  return clamp(0, 1, origin);
}
function rebaseAxisConstraints(layout2, constraints) {
  const relativeConstraints = {};
  if (constraints.min !== void 0) {
    relativeConstraints.min = constraints.min - layout2.min;
  }
  if (constraints.max !== void 0) {
    relativeConstraints.max = constraints.max - layout2.min;
  }
  return relativeConstraints;
}
var defaultElastic = 0.35;
function resolveDragElastic(dragElastic = defaultElastic) {
  if (dragElastic === false) {
    dragElastic = 0;
  } else if (dragElastic === true) {
    dragElastic = defaultElastic;
  }
  return {
    x: resolveAxisElastic(dragElastic, "left", "right"),
    y: resolveAxisElastic(dragElastic, "top", "bottom")
  };
}
function resolveAxisElastic(dragElastic, minLabel, maxLabel) {
  return {
    min: resolvePointElastic(dragElastic, minLabel),
    max: resolvePointElastic(dragElastic, maxLabel)
  };
}
function resolvePointElastic(dragElastic, label) {
  return typeof dragElastic === "number" ? dragElastic : dragElastic[label] || 0;
}

// node_modules/framer-motion/dist/es/projection/geometry/models.mjs
var createAxisDelta = () => ({
  translate: 0,
  scale: 1,
  origin: 0,
  originPoint: 0
});
var createDelta = () => ({
  x: createAxisDelta(),
  y: createAxisDelta()
});
var createAxis = () => ({ min: 0, max: 0 });
var createBox = () => ({
  x: createAxis(),
  y: createAxis()
});

// node_modules/framer-motion/dist/es/projection/utils/each-axis.mjs
function eachAxis(callback) {
  return [callback("x"), callback("y")];
}

// node_modules/framer-motion/dist/es/projection/geometry/conversion.mjs
function convertBoundingBoxToBox({ top, left, right, bottom }) {
  return {
    x: { min: left, max: right },
    y: { min: top, max: bottom }
  };
}
function convertBoxToBoundingBox({ x, y }) {
  return { top: y.min, right: x.max, bottom: y.max, left: x.min };
}
function transformBoxPoints(point, transformPoint2) {
  if (!transformPoint2)
    return point;
  const topLeft = transformPoint2({ x: point.left, y: point.top });
  const bottomRight = transformPoint2({ x: point.right, y: point.bottom });
  return {
    top: topLeft.y,
    left: topLeft.x,
    bottom: bottomRight.y,
    right: bottomRight.x
  };
}

// node_modules/framer-motion/dist/es/projection/utils/has-transform.mjs
function isIdentityScale(scale2) {
  return scale2 === void 0 || scale2 === 1;
}
function hasScale({ scale: scale2, scaleX, scaleY }) {
  return !isIdentityScale(scale2) || !isIdentityScale(scaleX) || !isIdentityScale(scaleY);
}
function hasTransform(values) {
  return hasScale(values) || has2DTranslate(values) || values.z || values.rotate || values.rotateX || values.rotateY || values.skewX || values.skewY;
}
function has2DTranslate(values) {
  return is2DTranslate(values.x) || is2DTranslate(values.y);
}
function is2DTranslate(value) {
  return value && value !== "0%";
}

// node_modules/framer-motion/dist/es/projection/geometry/delta-apply.mjs
function scalePoint(point, scale2, originPoint) {
  const distanceFromOrigin = point - originPoint;
  const scaled = scale2 * distanceFromOrigin;
  return originPoint + scaled;
}
function applyPointDelta(point, translate, scale2, originPoint, boxScale) {
  if (boxScale !== void 0) {
    point = scalePoint(point, boxScale, originPoint);
  }
  return scalePoint(point, scale2, originPoint) + translate;
}
function applyAxisDelta(axis, translate = 0, scale2 = 1, originPoint, boxScale) {
  axis.min = applyPointDelta(axis.min, translate, scale2, originPoint, boxScale);
  axis.max = applyPointDelta(axis.max, translate, scale2, originPoint, boxScale);
}
function applyBoxDelta(box, { x, y }) {
  applyAxisDelta(box.x, x.translate, x.scale, x.originPoint);
  applyAxisDelta(box.y, y.translate, y.scale, y.originPoint);
}
var TREE_SCALE_SNAP_MIN = 0.999999999999;
var TREE_SCALE_SNAP_MAX = 1.0000000000001;
function applyTreeDeltas(box, treeScale, treePath, isSharedTransition = false) {
  const treeLength = treePath.length;
  if (!treeLength)
    return;
  treeScale.x = treeScale.y = 1;
  let node;
  let delta;
  for (let i = 0; i < treeLength; i++) {
    node = treePath[i];
    delta = node.projectionDelta;
    const { visualElement } = node.options;
    if (visualElement && visualElement.props.style && visualElement.props.style.display === "contents") {
      continue;
    }
    if (isSharedTransition && node.options.layoutScroll && node.scroll && node !== node.root) {
      transformBox(box, {
        x: -node.scroll.offset.x,
        y: -node.scroll.offset.y
      });
    }
    if (delta) {
      treeScale.x *= delta.x.scale;
      treeScale.y *= delta.y.scale;
      applyBoxDelta(box, delta);
    }
    if (isSharedTransition && hasTransform(node.latestValues)) {
      transformBox(box, node.latestValues);
    }
  }
  if (treeScale.x < TREE_SCALE_SNAP_MAX && treeScale.x > TREE_SCALE_SNAP_MIN) {
    treeScale.x = 1;
  }
  if (treeScale.y < TREE_SCALE_SNAP_MAX && treeScale.y > TREE_SCALE_SNAP_MIN) {
    treeScale.y = 1;
  }
}
function translateAxis(axis, distance2) {
  axis.min = axis.min + distance2;
  axis.max = axis.max + distance2;
}
function transformAxis(axis, axisTranslate, axisScale, boxScale, axisOrigin = 0.5) {
  const originPoint = mixNumber(axis.min, axis.max, axisOrigin);
  applyAxisDelta(axis, axisTranslate, axisScale, originPoint, boxScale);
}
function transformBox(box, transform) {
  transformAxis(box.x, transform.x, transform.scaleX, transform.scale, transform.originX);
  transformAxis(box.y, transform.y, transform.scaleY, transform.scale, transform.originY);
}

// node_modules/framer-motion/dist/es/projection/utils/measure.mjs
function measureViewportBox(instance, transformPoint2) {
  return convertBoundingBoxToBox(transformBoxPoints(instance.getBoundingClientRect(), transformPoint2));
}
function measurePageBox(element, rootProjectionNode2, transformPagePoint) {
  const viewportBox = measureViewportBox(element, transformPagePoint);
  const { scroll } = rootProjectionNode2;
  if (scroll) {
    translateAxis(viewportBox.x, scroll.offset.x);
    translateAxis(viewportBox.y, scroll.offset.y);
  }
  return viewportBox;
}

// node_modules/framer-motion/dist/es/utils/get-context-window.mjs
var getContextWindow = ({ current }) => {
  return current ? current.ownerDocument.defaultView : null;
};

// node_modules/framer-motion/dist/es/gestures/drag/VisualElementDragControls.mjs
var elementDragControls = /* @__PURE__ */ new WeakMap();
var VisualElementDragControls = class {
  constructor(visualElement) {
    this.openDragLock = null;
    this.isDragging = false;
    this.currentDirection = null;
    this.originPoint = { x: 0, y: 0 };
    this.constraints = false;
    this.hasMutatedConstraints = false;
    this.elastic = createBox();
    this.visualElement = visualElement;
  }
  start(originEvent, { snapToCursor = false } = {}) {
    const { presenceContext } = this.visualElement;
    if (presenceContext && presenceContext.isPresent === false)
      return;
    const onSessionStart = (event) => {
      const { dragSnapToOrigin: dragSnapToOrigin2 } = this.getProps();
      dragSnapToOrigin2 ? this.pauseAnimation() : this.stopAnimation();
      if (snapToCursor) {
        this.snapToCursor(extractEventInfo(event).point);
      }
    };
    const onStart = (event, info) => {
      const { drag: drag2, dragPropagation, onDragStart } = this.getProps();
      if (drag2 && !dragPropagation) {
        if (this.openDragLock)
          this.openDragLock();
        this.openDragLock = setDragLock(drag2);
        if (!this.openDragLock)
          return;
      }
      this.isDragging = true;
      this.currentDirection = null;
      this.resolveConstraints();
      if (this.visualElement.projection) {
        this.visualElement.projection.isAnimationBlocked = true;
        this.visualElement.projection.target = void 0;
      }
      eachAxis((axis) => {
        let current = this.getAxisMotionValue(axis).get() || 0;
        if (percent.test(current)) {
          const { projection } = this.visualElement;
          if (projection && projection.layout) {
            const measuredAxis = projection.layout.layoutBox[axis];
            if (measuredAxis) {
              const length = calcLength(measuredAxis);
              current = length * (parseFloat(current) / 100);
            }
          }
        }
        this.originPoint[axis] = current;
      });
      if (onDragStart) {
        frame.postRender(() => onDragStart(event, info));
      }
      addValueToWillChange(this.visualElement, "transform");
      const { animationState } = this.visualElement;
      animationState && animationState.setActive("whileDrag", true);
    };
    const onMove = (event, info) => {
      const { dragPropagation, dragDirectionLock, onDirectionLock, onDrag } = this.getProps();
      if (!dragPropagation && !this.openDragLock)
        return;
      const { offset } = info;
      if (dragDirectionLock && this.currentDirection === null) {
        this.currentDirection = getCurrentDirection(offset);
        if (this.currentDirection !== null) {
          onDirectionLock && onDirectionLock(this.currentDirection);
        }
        return;
      }
      this.updateAxis("x", info.point, offset);
      this.updateAxis("y", info.point, offset);
      this.visualElement.render();
      onDrag && onDrag(event, info);
    };
    const onSessionEnd = (event, info) => this.stop(event, info);
    const resumeAnimation = () => eachAxis((axis) => {
      var _a;
      return this.getAnimationState(axis) === "paused" && ((_a = this.getAxisMotionValue(axis).animation) === null || _a === void 0 ? void 0 : _a.play());
    });
    const { dragSnapToOrigin } = this.getProps();
    this.panSession = new PanSession(originEvent, {
      onSessionStart,
      onStart,
      onMove,
      onSessionEnd,
      resumeAnimation
    }, {
      transformPagePoint: this.visualElement.getTransformPagePoint(),
      dragSnapToOrigin,
      contextWindow: getContextWindow(this.visualElement)
    });
  }
  stop(event, info) {
    const isDragging2 = this.isDragging;
    this.cancel();
    if (!isDragging2)
      return;
    const { velocity } = info;
    this.startAnimation(velocity);
    const { onDragEnd } = this.getProps();
    if (onDragEnd) {
      frame.postRender(() => onDragEnd(event, info));
    }
  }
  cancel() {
    this.isDragging = false;
    const { projection, animationState } = this.visualElement;
    if (projection) {
      projection.isAnimationBlocked = false;
    }
    this.panSession && this.panSession.end();
    this.panSession = void 0;
    const { dragPropagation } = this.getProps();
    if (!dragPropagation && this.openDragLock) {
      this.openDragLock();
      this.openDragLock = null;
    }
    animationState && animationState.setActive("whileDrag", false);
  }
  updateAxis(axis, _point, offset) {
    const { drag: drag2 } = this.getProps();
    if (!offset || !shouldDrag(axis, drag2, this.currentDirection))
      return;
    const axisValue = this.getAxisMotionValue(axis);
    let next = this.originPoint[axis] + offset[axis];
    if (this.constraints && this.constraints[axis]) {
      next = applyConstraints(next, this.constraints[axis], this.elastic[axis]);
    }
    axisValue.set(next);
  }
  resolveConstraints() {
    var _a;
    const { dragConstraints, dragElastic } = this.getProps();
    const layout2 = this.visualElement.projection && !this.visualElement.projection.layout ? this.visualElement.projection.measure(false) : (_a = this.visualElement.projection) === null || _a === void 0 ? void 0 : _a.layout;
    const prevConstraints = this.constraints;
    if (dragConstraints && isRefObject(dragConstraints)) {
      if (!this.constraints) {
        this.constraints = this.resolveRefConstraints();
      }
    } else {
      if (dragConstraints && layout2) {
        this.constraints = calcRelativeConstraints(layout2.layoutBox, dragConstraints);
      } else {
        this.constraints = false;
      }
    }
    this.elastic = resolveDragElastic(dragElastic);
    if (prevConstraints !== this.constraints && layout2 && this.constraints && !this.hasMutatedConstraints) {
      eachAxis((axis) => {
        if (this.constraints !== false && this.getAxisMotionValue(axis)) {
          this.constraints[axis] = rebaseAxisConstraints(layout2.layoutBox[axis], this.constraints[axis]);
        }
      });
    }
  }
  resolveRefConstraints() {
    const { dragConstraints: constraints, onMeasureDragConstraints } = this.getProps();
    if (!constraints || !isRefObject(constraints))
      return false;
    const constraintsElement = constraints.current;
    invariant(constraintsElement !== null, "If `dragConstraints` is set as a React ref, that ref must be passed to another component's `ref` prop.");
    const { projection } = this.visualElement;
    if (!projection || !projection.layout)
      return false;
    const constraintsBox = measurePageBox(constraintsElement, projection.root, this.visualElement.getTransformPagePoint());
    let measuredConstraints = calcViewportConstraints(projection.layout.layoutBox, constraintsBox);
    if (onMeasureDragConstraints) {
      const userConstraints = onMeasureDragConstraints(convertBoxToBoundingBox(measuredConstraints));
      this.hasMutatedConstraints = !!userConstraints;
      if (userConstraints) {
        measuredConstraints = convertBoundingBoxToBox(userConstraints);
      }
    }
    return measuredConstraints;
  }
  startAnimation(velocity) {
    const { drag: drag2, dragMomentum, dragElastic, dragTransition, dragSnapToOrigin, onDragTransitionEnd } = this.getProps();
    const constraints = this.constraints || {};
    const momentumAnimations = eachAxis((axis) => {
      if (!shouldDrag(axis, drag2, this.currentDirection)) {
        return;
      }
      let transition = constraints && constraints[axis] || {};
      if (dragSnapToOrigin)
        transition = { min: 0, max: 0 };
      const bounceStiffness = dragElastic ? 200 : 1e6;
      const bounceDamping = dragElastic ? 40 : 1e7;
      const inertia2 = {
        type: "inertia",
        velocity: dragMomentum ? velocity[axis] : 0,
        bounceStiffness,
        bounceDamping,
        timeConstant: 750,
        restDelta: 1,
        restSpeed: 10,
        ...dragTransition,
        ...transition
      };
      return this.startAxisValueAnimation(axis, inertia2);
    });
    return Promise.all(momentumAnimations).then(onDragTransitionEnd);
  }
  startAxisValueAnimation(axis, transition) {
    const axisValue = this.getAxisMotionValue(axis);
    addValueToWillChange(this.visualElement, axis);
    return axisValue.start(animateMotionValue(axis, axisValue, 0, transition, this.visualElement, false));
  }
  stopAnimation() {
    eachAxis((axis) => this.getAxisMotionValue(axis).stop());
  }
  pauseAnimation() {
    eachAxis((axis) => {
      var _a;
      return (_a = this.getAxisMotionValue(axis).animation) === null || _a === void 0 ? void 0 : _a.pause();
    });
  }
  getAnimationState(axis) {
    var _a;
    return (_a = this.getAxisMotionValue(axis).animation) === null || _a === void 0 ? void 0 : _a.state;
  }
  /**
   * Drag works differently depending on which props are provided.
   *
   * - If _dragX and _dragY are provided, we output the gesture delta directly to those motion values.
   * - Otherwise, we apply the delta to the x/y motion values.
   */
  getAxisMotionValue(axis) {
    const dragKey = `_drag${axis.toUpperCase()}`;
    const props = this.visualElement.getProps();
    const externalMotionValue = props[dragKey];
    return externalMotionValue ? externalMotionValue : this.visualElement.getValue(axis, (props.initial ? props.initial[axis] : void 0) || 0);
  }
  snapToCursor(point) {
    eachAxis((axis) => {
      const { drag: drag2 } = this.getProps();
      if (!shouldDrag(axis, drag2, this.currentDirection))
        return;
      const { projection } = this.visualElement;
      const axisValue = this.getAxisMotionValue(axis);
      if (projection && projection.layout) {
        const { min, max } = projection.layout.layoutBox[axis];
        axisValue.set(point[axis] - mixNumber(min, max, 0.5));
      }
    });
  }
  /**
   * When the viewport resizes we want to check if the measured constraints
   * have changed and, if so, reposition the element within those new constraints
   * relative to where it was before the resize.
   */
  scalePositionWithinConstraints() {
    if (!this.visualElement.current)
      return;
    const { drag: drag2, dragConstraints } = this.getProps();
    const { projection } = this.visualElement;
    if (!isRefObject(dragConstraints) || !projection || !this.constraints)
      return;
    this.stopAnimation();
    const boxProgress = { x: 0, y: 0 };
    eachAxis((axis) => {
      const axisValue = this.getAxisMotionValue(axis);
      if (axisValue && this.constraints !== false) {
        const latest = axisValue.get();
        boxProgress[axis] = calcOrigin2({ min: latest, max: latest }, this.constraints[axis]);
      }
    });
    const { transformTemplate } = this.visualElement.getProps();
    this.visualElement.current.style.transform = transformTemplate ? transformTemplate({}, "") : "none";
    projection.root && projection.root.updateScroll();
    projection.updateLayout();
    this.resolveConstraints();
    eachAxis((axis) => {
      if (!shouldDrag(axis, drag2, null))
        return;
      const axisValue = this.getAxisMotionValue(axis);
      const { min, max } = this.constraints[axis];
      axisValue.set(mixNumber(min, max, boxProgress[axis]));
    });
  }
  addListeners() {
    if (!this.visualElement.current)
      return;
    elementDragControls.set(this.visualElement, this);
    const element = this.visualElement.current;
    const stopPointerListener = addPointerEvent(element, "pointerdown", (event) => {
      const { drag: drag2, dragListener = true } = this.getProps();
      drag2 && dragListener && this.start(event);
    });
    const measureDragConstraints = () => {
      const { dragConstraints } = this.getProps();
      if (isRefObject(dragConstraints) && dragConstraints.current) {
        this.constraints = this.resolveRefConstraints();
      }
    };
    const { projection } = this.visualElement;
    const stopMeasureLayoutListener = projection.addEventListener("measure", measureDragConstraints);
    if (projection && !projection.layout) {
      projection.root && projection.root.updateScroll();
      projection.updateLayout();
    }
    frame.read(measureDragConstraints);
    const stopResizeListener = addDomEvent(window, "resize", () => this.scalePositionWithinConstraints());
    const stopLayoutUpdateListener = projection.addEventListener("didUpdate", (({ delta, hasLayoutChanged }) => {
      if (this.isDragging && hasLayoutChanged) {
        eachAxis((axis) => {
          const motionValue2 = this.getAxisMotionValue(axis);
          if (!motionValue2)
            return;
          this.originPoint[axis] += delta[axis].translate;
          motionValue2.set(motionValue2.get() + delta[axis].translate);
        });
        this.visualElement.render();
      }
    }));
    return () => {
      stopResizeListener();
      stopPointerListener();
      stopMeasureLayoutListener();
      stopLayoutUpdateListener && stopLayoutUpdateListener();
    };
  }
  getProps() {
    const props = this.visualElement.getProps();
    const { drag: drag2 = false, dragDirectionLock = false, dragPropagation = false, dragConstraints = false, dragElastic = defaultElastic, dragMomentum = true } = props;
    return {
      ...props,
      drag: drag2,
      dragDirectionLock,
      dragPropagation,
      dragConstraints,
      dragElastic,
      dragMomentum
    };
  }
};
function shouldDrag(direction, drag2, currentDirection) {
  return (drag2 === true || drag2 === direction) && (currentDirection === null || currentDirection === direction);
}
function getCurrentDirection(offset, lockThreshold = 10) {
  let direction = null;
  if (Math.abs(offset.y) > lockThreshold) {
    direction = "y";
  } else if (Math.abs(offset.x) > lockThreshold) {
    direction = "x";
  }
  return direction;
}

// node_modules/framer-motion/dist/es/gestures/drag/index.mjs
var DragGesture = class extends Feature {
  constructor(node) {
    super(node);
    this.removeGroupControls = noop;
    this.removeListeners = noop;
    this.controls = new VisualElementDragControls(node);
  }
  mount() {
    const { dragControls } = this.node.getProps();
    if (dragControls) {
      this.removeGroupControls = dragControls.subscribe(this.controls);
    }
    this.removeListeners = this.controls.addListeners() || noop;
  }
  unmount() {
    this.removeGroupControls();
    this.removeListeners();
  }
};

// node_modules/framer-motion/dist/es/gestures/pan/index.mjs
var asyncHandler = (handler) => (event, info) => {
  if (handler) {
    frame.postRender(() => handler(event, info));
  }
};
var PanGesture = class extends Feature {
  constructor() {
    super(...arguments);
    this.removePointerDownListener = noop;
  }
  onPointerDown(pointerDownEvent) {
    this.session = new PanSession(pointerDownEvent, this.createPanHandlers(), {
      transformPagePoint: this.node.getTransformPagePoint(),
      contextWindow: getContextWindow(this.node)
    });
  }
  createPanHandlers() {
    const { onPanSessionStart, onPanStart, onPan, onPanEnd } = this.node.getProps();
    return {
      onSessionStart: asyncHandler(onPanSessionStart),
      onStart: asyncHandler(onPanStart),
      onMove: onPan,
      onEnd: (event, info) => {
        delete this.session;
        if (onPanEnd) {
          frame.postRender(() => onPanEnd(event, info));
        }
      }
    };
  }
  mount() {
    this.removePointerDownListener = addPointerEvent(this.node.current, "pointerdown", (event) => this.onPointerDown(event));
  }
  update() {
    this.session && this.session.updateHandlers(this.createPanHandlers());
  }
  unmount() {
    this.removePointerDownListener();
    this.session && this.session.end();
  }
};

// node_modules/framer-motion/dist/es/motion/features/layout/MeasureLayout.mjs
var import_jsx_runtime5 = require("react/jsx-runtime");
var import_react22 = require("react");

// node_modules/framer-motion/dist/es/projection/node/state.mjs
var globalProjectionState = {
  /**
   * Global flag as to whether the tree has animated since the last time
   * we resized the window
   */
  hasAnimatedSinceResize: true,
  /**
   * We set this to true once, on the first update. Any nodes added to the tree beyond that
   * update will be given a `data-projection-id` attribute.
   */
  hasEverUpdated: false
};

// node_modules/framer-motion/dist/es/projection/styles/scale-border-radius.mjs
function pixelsToPercent(pixels, axis) {
  if (axis.max === axis.min)
    return 0;
  return pixels / (axis.max - axis.min) * 100;
}
var correctBorderRadius = {
  correct: (latest, node) => {
    if (!node.target)
      return latest;
    if (typeof latest === "string") {
      if (px.test(latest)) {
        latest = parseFloat(latest);
      } else {
        return latest;
      }
    }
    const x = pixelsToPercent(latest, node.target.x);
    const y = pixelsToPercent(latest, node.target.y);
    return `${x}% ${y}%`;
  }
};

// node_modules/framer-motion/dist/es/projection/styles/scale-box-shadow.mjs
var correctBoxShadow = {
  correct: (latest, { treeScale, projectionDelta }) => {
    const original = latest;
    const shadow = complex.parse(latest);
    if (shadow.length > 5)
      return original;
    const template = complex.createTransformer(latest);
    const offset = typeof shadow[0] !== "number" ? 1 : 0;
    const xScale = projectionDelta.x.scale * treeScale.x;
    const yScale = projectionDelta.y.scale * treeScale.y;
    shadow[0 + offset] /= xScale;
    shadow[1 + offset] /= yScale;
    const averageScale = mixNumber(xScale, yScale, 0.5);
    if (typeof shadow[2 + offset] === "number")
      shadow[2 + offset] /= averageScale;
    if (typeof shadow[3 + offset] === "number")
      shadow[3 + offset] /= averageScale;
    return template(shadow);
  }
};

// node_modules/framer-motion/dist/es/motion/features/layout/MeasureLayout.mjs
var MeasureLayoutWithContext = class extends import_react22.Component {
  /**
   * This only mounts projection nodes for components that
   * need measuring, we might want to do it for all components
   * in order to incorporate transforms
   */
  componentDidMount() {
    const { visualElement, layoutGroup, switchLayoutGroup, layoutId } = this.props;
    const { projection } = visualElement;
    addScaleCorrector(defaultScaleCorrectors);
    if (projection) {
      if (layoutGroup.group)
        layoutGroup.group.add(projection);
      if (switchLayoutGroup && switchLayoutGroup.register && layoutId) {
        switchLayoutGroup.register(projection);
      }
      projection.root.didUpdate();
      projection.addEventListener("animationComplete", () => {
        this.safeToRemove();
      });
      projection.setOptions({
        ...projection.options,
        onExitComplete: () => this.safeToRemove()
      });
    }
    globalProjectionState.hasEverUpdated = true;
  }
  getSnapshotBeforeUpdate(prevProps) {
    const { layoutDependency, visualElement, drag: drag2, isPresent } = this.props;
    const projection = visualElement.projection;
    if (!projection)
      return null;
    projection.isPresent = isPresent;
    if (drag2 || prevProps.layoutDependency !== layoutDependency || layoutDependency === void 0) {
      projection.willUpdate();
    } else {
      this.safeToRemove();
    }
    if (prevProps.isPresent !== isPresent) {
      if (isPresent) {
        projection.promote();
      } else if (!projection.relegate()) {
        frame.postRender(() => {
          const stack = projection.getStack();
          if (!stack || !stack.members.length) {
            this.safeToRemove();
          }
        });
      }
    }
    return null;
  }
  componentDidUpdate() {
    const { projection } = this.props.visualElement;
    if (projection) {
      projection.root.didUpdate();
      microtask.postRender(() => {
        if (!projection.currentAnimation && projection.isLead()) {
          this.safeToRemove();
        }
      });
    }
  }
  componentWillUnmount() {
    const { visualElement, layoutGroup, switchLayoutGroup: promoteContext } = this.props;
    const { projection } = visualElement;
    if (projection) {
      projection.scheduleCheckAfterUnmount();
      if (layoutGroup && layoutGroup.group)
        layoutGroup.group.remove(projection);
      if (promoteContext && promoteContext.deregister)
        promoteContext.deregister(projection);
    }
  }
  safeToRemove() {
    const { safeToRemove } = this.props;
    safeToRemove && safeToRemove();
  }
  render() {
    return null;
  }
};
function MeasureLayout(props) {
  const [isPresent, safeToRemove] = usePresence();
  const layoutGroup = (0, import_react22.useContext)(LayoutGroupContext);
  return (0, import_jsx_runtime5.jsx)(MeasureLayoutWithContext, { ...props, layoutGroup, switchLayoutGroup: (0, import_react22.useContext)(SwitchLayoutGroupContext), isPresent, safeToRemove });
}
var defaultScaleCorrectors = {
  borderRadius: {
    ...correctBorderRadius,
    applyTo: [
      "borderTopLeftRadius",
      "borderTopRightRadius",
      "borderBottomLeftRadius",
      "borderBottomRightRadius"
    ]
  },
  borderTopLeftRadius: correctBorderRadius,
  borderTopRightRadius: correctBorderRadius,
  borderBottomLeftRadius: correctBorderRadius,
  borderBottomRightRadius: correctBorderRadius,
  boxShadow: correctBoxShadow
};

// node_modules/framer-motion/dist/es/animation/animate/single-value.mjs
function animateSingleValue(value, keyframes2, options2) {
  const motionValue$1 = isMotionValue(value) ? value : motionValue(value);
  motionValue$1.start(animateMotionValue("", motionValue$1, keyframes2, options2));
  return motionValue$1.animation;
}

// node_modules/framer-motion/dist/es/render/dom/utils/is-svg-element.mjs
function isSVGElement(element) {
  return element instanceof SVGElement && element.tagName !== "svg";
}

// node_modules/framer-motion/dist/es/render/utils/compare-by-depth.mjs
var compareByDepth = (a, b) => a.depth - b.depth;

// node_modules/framer-motion/dist/es/render/utils/flat-tree.mjs
var FlatTree = class {
  constructor() {
    this.children = [];
    this.isDirty = false;
  }
  add(child) {
    addUniqueItem(this.children, child);
    this.isDirty = true;
  }
  remove(child) {
    removeItem(this.children, child);
    this.isDirty = true;
  }
  forEach(callback) {
    this.isDirty && this.children.sort(compareByDepth);
    this.isDirty = false;
    this.children.forEach(callback);
  }
};

// node_modules/framer-motion/dist/es/utils/delay.mjs
function delay(callback, timeout) {
  const start = time.now();
  const checkElapsed = ({ timestamp }) => {
    const elapsed = timestamp - start;
    if (elapsed >= timeout) {
      cancelFrame(checkElapsed);
      callback(elapsed - timeout);
    }
  };
  frame.read(checkElapsed, true);
  return () => cancelFrame(checkElapsed);
}

// node_modules/framer-motion/dist/es/projection/animation/mix-values.mjs
var borders = ["TopLeft", "TopRight", "BottomLeft", "BottomRight"];
var numBorders = borders.length;
var asNumber = (value) => typeof value === "string" ? parseFloat(value) : value;
var isPx = (value) => typeof value === "number" || px.test(value);
function mixValues(target, follow, lead, progress2, shouldCrossfadeOpacity, isOnlyMember) {
  if (shouldCrossfadeOpacity) {
    target.opacity = mixNumber(
      0,
      // TODO Reinstate this if only child
      lead.opacity !== void 0 ? lead.opacity : 1,
      easeCrossfadeIn(progress2)
    );
    target.opacityExit = mixNumber(follow.opacity !== void 0 ? follow.opacity : 1, 0, easeCrossfadeOut(progress2));
  } else if (isOnlyMember) {
    target.opacity = mixNumber(follow.opacity !== void 0 ? follow.opacity : 1, lead.opacity !== void 0 ? lead.opacity : 1, progress2);
  }
  for (let i = 0; i < numBorders; i++) {
    const borderLabel = `border${borders[i]}Radius`;
    let followRadius = getRadius(follow, borderLabel);
    let leadRadius = getRadius(lead, borderLabel);
    if (followRadius === void 0 && leadRadius === void 0)
      continue;
    followRadius || (followRadius = 0);
    leadRadius || (leadRadius = 0);
    const canMix = followRadius === 0 || leadRadius === 0 || isPx(followRadius) === isPx(leadRadius);
    if (canMix) {
      target[borderLabel] = Math.max(mixNumber(asNumber(followRadius), asNumber(leadRadius), progress2), 0);
      if (percent.test(leadRadius) || percent.test(followRadius)) {
        target[borderLabel] += "%";
      }
    } else {
      target[borderLabel] = leadRadius;
    }
  }
  if (follow.rotate || lead.rotate) {
    target.rotate = mixNumber(follow.rotate || 0, lead.rotate || 0, progress2);
  }
}
function getRadius(values, radiusName) {
  return values[radiusName] !== void 0 ? values[radiusName] : values.borderRadius;
}
var easeCrossfadeIn = /* @__PURE__ */ compress(0, 0.5, circOut);
var easeCrossfadeOut = /* @__PURE__ */ compress(0.5, 0.95, noop);
function compress(min, max, easing) {
  return (p) => {
    if (p < min)
      return 0;
    if (p > max)
      return 1;
    return easing(progress(min, max, p));
  };
}

// node_modules/framer-motion/dist/es/projection/geometry/copy.mjs
function copyAxisInto(axis, originAxis) {
  axis.min = originAxis.min;
  axis.max = originAxis.max;
}
function copyBoxInto(box, originBox) {
  copyAxisInto(box.x, originBox.x);
  copyAxisInto(box.y, originBox.y);
}
function copyAxisDeltaInto(delta, originDelta) {
  delta.translate = originDelta.translate;
  delta.scale = originDelta.scale;
  delta.originPoint = originDelta.originPoint;
  delta.origin = originDelta.origin;
}

// node_modules/framer-motion/dist/es/projection/geometry/delta-remove.mjs
function removePointDelta(point, translate, scale2, originPoint, boxScale) {
  point -= translate;
  point = scalePoint(point, 1 / scale2, originPoint);
  if (boxScale !== void 0) {
    point = scalePoint(point, 1 / boxScale, originPoint);
  }
  return point;
}
function removeAxisDelta(axis, translate = 0, scale2 = 1, origin = 0.5, boxScale, originAxis = axis, sourceAxis = axis) {
  if (percent.test(translate)) {
    translate = parseFloat(translate);
    const relativeProgress = mixNumber(sourceAxis.min, sourceAxis.max, translate / 100);
    translate = relativeProgress - sourceAxis.min;
  }
  if (typeof translate !== "number")
    return;
  let originPoint = mixNumber(originAxis.min, originAxis.max, origin);
  if (axis === originAxis)
    originPoint -= translate;
  axis.min = removePointDelta(axis.min, translate, scale2, originPoint, boxScale);
  axis.max = removePointDelta(axis.max, translate, scale2, originPoint, boxScale);
}
function removeAxisTransforms(axis, transforms, [key, scaleKey, originKey], origin, sourceAxis) {
  removeAxisDelta(axis, transforms[key], transforms[scaleKey], transforms[originKey], transforms.scale, origin, sourceAxis);
}
var xKeys = ["x", "scaleX", "originX"];
var yKeys = ["y", "scaleY", "originY"];
function removeBoxTransforms(box, transforms, originBox, sourceBox) {
  removeAxisTransforms(box.x, transforms, xKeys, originBox ? originBox.x : void 0, sourceBox ? sourceBox.x : void 0);
  removeAxisTransforms(box.y, transforms, yKeys, originBox ? originBox.y : void 0, sourceBox ? sourceBox.y : void 0);
}

// node_modules/framer-motion/dist/es/projection/geometry/utils.mjs
function isAxisDeltaZero(delta) {
  return delta.translate === 0 && delta.scale === 1;
}
function isDeltaZero(delta) {
  return isAxisDeltaZero(delta.x) && isAxisDeltaZero(delta.y);
}
function axisEquals(a, b) {
  return a.min === b.min && a.max === b.max;
}
function boxEquals(a, b) {
  return axisEquals(a.x, b.x) && axisEquals(a.y, b.y);
}
function axisEqualsRounded(a, b) {
  return Math.round(a.min) === Math.round(b.min) && Math.round(a.max) === Math.round(b.max);
}
function boxEqualsRounded(a, b) {
  return axisEqualsRounded(a.x, b.x) && axisEqualsRounded(a.y, b.y);
}
function aspectRatio(box) {
  return calcLength(box.x) / calcLength(box.y);
}
function axisDeltaEquals(a, b) {
  return a.translate === b.translate && a.scale === b.scale && a.originPoint === b.originPoint;
}

// node_modules/framer-motion/dist/es/projection/shared/stack.mjs
var NodeStack = class {
  constructor() {
    this.members = [];
  }
  add(node) {
    addUniqueItem(this.members, node);
    node.scheduleRender();
  }
  remove(node) {
    removeItem(this.members, node);
    if (node === this.prevLead) {
      this.prevLead = void 0;
    }
    if (node === this.lead) {
      const prevLead = this.members[this.members.length - 1];
      if (prevLead) {
        this.promote(prevLead);
      }
    }
  }
  relegate(node) {
    const indexOfNode = this.members.findIndex((member) => node === member);
    if (indexOfNode === 0)
      return false;
    let prevLead;
    for (let i = indexOfNode; i >= 0; i--) {
      const member = this.members[i];
      if (member.isPresent !== false) {
        prevLead = member;
        break;
      }
    }
    if (prevLead) {
      this.promote(prevLead);
      return true;
    } else {
      return false;
    }
  }
  promote(node, preserveFollowOpacity) {
    const prevLead = this.lead;
    if (node === prevLead)
      return;
    this.prevLead = prevLead;
    this.lead = node;
    node.show();
    if (prevLead) {
      prevLead.instance && prevLead.scheduleRender();
      node.scheduleRender();
      node.resumeFrom = prevLead;
      if (preserveFollowOpacity) {
        node.resumeFrom.preserveOpacity = true;
      }
      if (prevLead.snapshot) {
        node.snapshot = prevLead.snapshot;
        node.snapshot.latestValues = prevLead.animationValues || prevLead.latestValues;
      }
      if (node.root && node.root.isUpdating) {
        node.isLayoutDirty = true;
      }
      const { crossfade } = node.options;
      if (crossfade === false) {
        prevLead.hide();
      }
    }
  }
  exitAnimationComplete() {
    this.members.forEach((node) => {
      const { options: options2, resumingFrom } = node;
      options2.onExitComplete && options2.onExitComplete();
      if (resumingFrom) {
        resumingFrom.options.onExitComplete && resumingFrom.options.onExitComplete();
      }
    });
  }
  scheduleRender() {
    this.members.forEach((node) => {
      node.instance && node.scheduleRender(false);
    });
  }
  /**
   * Clear any leads that have been removed this render to prevent them from being
   * used in future animations and to prevent memory leaks
   */
  removeLeadSnapshot() {
    if (this.lead && this.lead.snapshot) {
      this.lead.snapshot = void 0;
    }
  }
};

// node_modules/framer-motion/dist/es/projection/styles/transform.mjs
function buildProjectionTransform(delta, treeScale, latestTransform) {
  let transform = "";
  const xTranslate = delta.x.translate / treeScale.x;
  const yTranslate = delta.y.translate / treeScale.y;
  const zTranslate = (latestTransform === null || latestTransform === void 0 ? void 0 : latestTransform.z) || 0;
  if (xTranslate || yTranslate || zTranslate) {
    transform = `translate3d(${xTranslate}px, ${yTranslate}px, ${zTranslate}px) `;
  }
  if (treeScale.x !== 1 || treeScale.y !== 1) {
    transform += `scale(${1 / treeScale.x}, ${1 / treeScale.y}) `;
  }
  if (latestTransform) {
    const { transformPerspective, rotate, rotateX, rotateY, skewX, skewY } = latestTransform;
    if (transformPerspective)
      transform = `perspective(${transformPerspective}px) ${transform}`;
    if (rotate)
      transform += `rotate(${rotate}deg) `;
    if (rotateX)
      transform += `rotateX(${rotateX}deg) `;
    if (rotateY)
      transform += `rotateY(${rotateY}deg) `;
    if (skewX)
      transform += `skewX(${skewX}deg) `;
    if (skewY)
      transform += `skewY(${skewY}deg) `;
  }
  const elementScaleX = delta.x.scale * treeScale.x;
  const elementScaleY = delta.y.scale * treeScale.y;
  if (elementScaleX !== 1 || elementScaleY !== 1) {
    transform += `scale(${elementScaleX}, ${elementScaleY})`;
  }
  return transform || "none";
}

// node_modules/framer-motion/dist/es/projection/node/create-projection-node.mjs
var metrics = {
  type: "projectionFrame",
  totalNodes: 0,
  resolvedTargetDeltas: 0,
  recalculatedProjection: 0
};
var isDebug = typeof window !== "undefined" && window.MotionDebug !== void 0;
var transformAxes = ["", "X", "Y", "Z"];
var hiddenVisibility = { visibility: "hidden" };
var animationTarget = 1e3;
var id2 = 0;
function resetDistortingTransform(key, visualElement, values, sharedAnimationValues) {
  const { latestValues } = visualElement;
  if (latestValues[key]) {
    values[key] = latestValues[key];
    visualElement.setStaticValue(key, 0);
    if (sharedAnimationValues) {
      sharedAnimationValues[key] = 0;
    }
  }
}
function cancelTreeOptimisedTransformAnimations(projectionNode) {
  projectionNode.hasCheckedOptimisedAppear = true;
  if (projectionNode.root === projectionNode)
    return;
  const { visualElement } = projectionNode.options;
  if (!visualElement)
    return;
  const appearId = getOptimisedAppearId(visualElement);
  if (window.MotionHasOptimisedAnimation(appearId, "transform")) {
    const { layout: layout2, layoutId } = projectionNode.options;
    window.MotionCancelOptimisedAnimation(appearId, "transform", frame, !(layout2 || layoutId));
  }
  const { parent } = projectionNode;
  if (parent && !parent.hasCheckedOptimisedAppear) {
    cancelTreeOptimisedTransformAnimations(parent);
  }
}
function createProjectionNode2({ attachResizeListener, defaultParent, measureScroll, checkIsScrollRoot, resetTransform }) {
  return class ProjectionNode {
    constructor(latestValues = {}, parent = defaultParent === null || defaultParent === void 0 ? void 0 : defaultParent()) {
      this.id = id2++;
      this.animationId = 0;
      this.children = /* @__PURE__ */ new Set();
      this.options = {};
      this.isTreeAnimating = false;
      this.isAnimationBlocked = false;
      this.isLayoutDirty = false;
      this.isProjectionDirty = false;
      this.isSharedProjectionDirty = false;
      this.isTransformDirty = false;
      this.updateManuallyBlocked = false;
      this.updateBlockedByResize = false;
      this.isUpdating = false;
      this.isSVG = false;
      this.needsReset = false;
      this.shouldResetTransform = false;
      this.hasCheckedOptimisedAppear = false;
      this.treeScale = { x: 1, y: 1 };
      this.eventHandlers = /* @__PURE__ */ new Map();
      this.hasTreeAnimated = false;
      this.updateScheduled = false;
      this.scheduleUpdate = () => this.update();
      this.projectionUpdateScheduled = false;
      this.checkUpdateFailed = () => {
        if (this.isUpdating) {
          this.isUpdating = false;
          this.clearAllSnapshots();
        }
      };
      this.updateProjection = () => {
        this.projectionUpdateScheduled = false;
        if (isDebug) {
          metrics.totalNodes = metrics.resolvedTargetDeltas = metrics.recalculatedProjection = 0;
        }
        this.nodes.forEach(propagateDirtyNodes);
        this.nodes.forEach(resolveTargetDelta);
        this.nodes.forEach(calcProjection);
        this.nodes.forEach(cleanDirtyNodes);
        if (isDebug) {
          window.MotionDebug.record(metrics);
        }
      };
      this.resolvedRelativeTargetAt = 0;
      this.hasProjected = false;
      this.isVisible = true;
      this.animationProgress = 0;
      this.sharedNodes = /* @__PURE__ */ new Map();
      this.latestValues = latestValues;
      this.root = parent ? parent.root || parent : this;
      this.path = parent ? [...parent.path, parent] : [];
      this.parent = parent;
      this.depth = parent ? parent.depth + 1 : 0;
      for (let i = 0; i < this.path.length; i++) {
        this.path[i].shouldResetTransform = true;
      }
      if (this.root === this)
        this.nodes = new FlatTree();
    }
    addEventListener(name, handler) {
      if (!this.eventHandlers.has(name)) {
        this.eventHandlers.set(name, new SubscriptionManager());
      }
      return this.eventHandlers.get(name).add(handler);
    }
    notifyListeners(name, ...args) {
      const subscriptionManager = this.eventHandlers.get(name);
      subscriptionManager && subscriptionManager.notify(...args);
    }
    hasListeners(name) {
      return this.eventHandlers.has(name);
    }
    /**
     * Lifecycles
     */
    mount(instance, isLayoutDirty = this.root.hasTreeAnimated) {
      if (this.instance)
        return;
      this.isSVG = isSVGElement(instance);
      this.instance = instance;
      const { layoutId, layout: layout2, visualElement } = this.options;
      if (visualElement && !visualElement.current) {
        visualElement.mount(instance);
      }
      this.root.nodes.add(this);
      this.parent && this.parent.children.add(this);
      if (isLayoutDirty && (layout2 || layoutId)) {
        this.isLayoutDirty = true;
      }
      if (attachResizeListener) {
        let cancelDelay;
        const resizeUnblockUpdate = () => this.root.updateBlockedByResize = false;
        attachResizeListener(instance, () => {
          this.root.updateBlockedByResize = true;
          cancelDelay && cancelDelay();
          cancelDelay = delay(resizeUnblockUpdate, 250);
          if (globalProjectionState.hasAnimatedSinceResize) {
            globalProjectionState.hasAnimatedSinceResize = false;
            this.nodes.forEach(finishAnimation);
          }
        });
      }
      if (layoutId) {
        this.root.registerSharedNode(layoutId, this);
      }
      if (this.options.animate !== false && visualElement && (layoutId || layout2)) {
        this.addEventListener("didUpdate", ({ delta, hasLayoutChanged, hasRelativeTargetChanged, layout: newLayout }) => {
          if (this.isTreeAnimationBlocked()) {
            this.target = void 0;
            this.relativeTarget = void 0;
            return;
          }
          const layoutTransition = this.options.transition || visualElement.getDefaultTransition() || defaultLayoutTransition;
          const { onLayoutAnimationStart, onLayoutAnimationComplete } = visualElement.getProps();
          const targetChanged = !this.targetLayout || !boxEqualsRounded(this.targetLayout, newLayout) || hasRelativeTargetChanged;
          const hasOnlyRelativeTargetChanged = !hasLayoutChanged && hasRelativeTargetChanged;
          if (this.options.layoutRoot || this.resumeFrom && this.resumeFrom.instance || hasOnlyRelativeTargetChanged || hasLayoutChanged && (targetChanged || !this.currentAnimation)) {
            if (this.resumeFrom) {
              this.resumingFrom = this.resumeFrom;
              this.resumingFrom.resumingFrom = void 0;
            }
            this.setAnimationOrigin(delta, hasOnlyRelativeTargetChanged);
            const animationOptions = {
              ...getValueTransition(layoutTransition, "layout"),
              onPlay: onLayoutAnimationStart,
              onComplete: onLayoutAnimationComplete
            };
            if (visualElement.shouldReduceMotion || this.options.layoutRoot) {
              animationOptions.delay = 0;
              animationOptions.type = false;
            }
            this.startAnimation(animationOptions);
          } else {
            if (!hasLayoutChanged) {
              finishAnimation(this);
            }
            if (this.isLead() && this.options.onExitComplete) {
              this.options.onExitComplete();
            }
          }
          this.targetLayout = newLayout;
        });
      }
    }
    unmount() {
      this.options.layoutId && this.willUpdate();
      this.root.nodes.remove(this);
      const stack = this.getStack();
      stack && stack.remove(this);
      this.parent && this.parent.children.delete(this);
      this.instance = void 0;
      cancelFrame(this.updateProjection);
    }
    // only on the root
    blockUpdate() {
      this.updateManuallyBlocked = true;
    }
    unblockUpdate() {
      this.updateManuallyBlocked = false;
    }
    isUpdateBlocked() {
      return this.updateManuallyBlocked || this.updateBlockedByResize;
    }
    isTreeAnimationBlocked() {
      return this.isAnimationBlocked || this.parent && this.parent.isTreeAnimationBlocked() || false;
    }
    // Note: currently only running on root node
    startUpdate() {
      if (this.isUpdateBlocked())
        return;
      this.isUpdating = true;
      this.nodes && this.nodes.forEach(resetSkewAndRotation);
      this.animationId++;
    }
    getTransformTemplate() {
      const { visualElement } = this.options;
      return visualElement && visualElement.getProps().transformTemplate;
    }
    willUpdate(shouldNotifyListeners = true) {
      this.root.hasTreeAnimated = true;
      if (this.root.isUpdateBlocked()) {
        this.options.onExitComplete && this.options.onExitComplete();
        return;
      }
      if (window.MotionCancelOptimisedAnimation && !this.hasCheckedOptimisedAppear) {
        cancelTreeOptimisedTransformAnimations(this);
      }
      !this.root.isUpdating && this.root.startUpdate();
      if (this.isLayoutDirty)
        return;
      this.isLayoutDirty = true;
      for (let i = 0; i < this.path.length; i++) {
        const node = this.path[i];
        node.shouldResetTransform = true;
        node.updateScroll("snapshot");
        if (node.options.layoutRoot) {
          node.willUpdate(false);
        }
      }
      const { layoutId, layout: layout2 } = this.options;
      if (layoutId === void 0 && !layout2)
        return;
      const transformTemplate = this.getTransformTemplate();
      this.prevTransformTemplateValue = transformTemplate ? transformTemplate(this.latestValues, "") : void 0;
      this.updateSnapshot();
      shouldNotifyListeners && this.notifyListeners("willUpdate");
    }
    update() {
      this.updateScheduled = false;
      const updateWasBlocked = this.isUpdateBlocked();
      if (updateWasBlocked) {
        this.unblockUpdate();
        this.clearAllSnapshots();
        this.nodes.forEach(clearMeasurements);
        return;
      }
      if (!this.isUpdating) {
        this.nodes.forEach(clearIsLayoutDirty);
      }
      this.isUpdating = false;
      this.nodes.forEach(resetTransformStyle);
      this.nodes.forEach(updateLayout);
      this.nodes.forEach(notifyLayoutUpdate);
      this.clearAllSnapshots();
      const now2 = time.now();
      frameData.delta = clamp(0, 1e3 / 60, now2 - frameData.timestamp);
      frameData.timestamp = now2;
      frameData.isProcessing = true;
      frameSteps.update.process(frameData);
      frameSteps.preRender.process(frameData);
      frameSteps.render.process(frameData);
      frameData.isProcessing = false;
    }
    didUpdate() {
      if (!this.updateScheduled) {
        this.updateScheduled = true;
        microtask.read(this.scheduleUpdate);
      }
    }
    clearAllSnapshots() {
      this.nodes.forEach(clearSnapshot);
      this.sharedNodes.forEach(removeLeadSnapshots);
    }
    scheduleUpdateProjection() {
      if (!this.projectionUpdateScheduled) {
        this.projectionUpdateScheduled = true;
        frame.preRender(this.updateProjection, false, true);
      }
    }
    scheduleCheckAfterUnmount() {
      frame.postRender(() => {
        if (this.isLayoutDirty) {
          this.root.didUpdate();
        } else {
          this.root.checkUpdateFailed();
        }
      });
    }
    /**
     * Update measurements
     */
    updateSnapshot() {
      if (this.snapshot || !this.instance)
        return;
      this.snapshot = this.measure();
    }
    updateLayout() {
      if (!this.instance)
        return;
      this.updateScroll();
      if (!(this.options.alwaysMeasureLayout && this.isLead()) && !this.isLayoutDirty) {
        return;
      }
      if (this.resumeFrom && !this.resumeFrom.instance) {
        for (let i = 0; i < this.path.length; i++) {
          const node = this.path[i];
          node.updateScroll();
        }
      }
      const prevLayout = this.layout;
      this.layout = this.measure(false);
      this.layoutCorrected = createBox();
      this.isLayoutDirty = false;
      this.projectionDelta = void 0;
      this.notifyListeners("measure", this.layout.layoutBox);
      const { visualElement } = this.options;
      visualElement && visualElement.notify("LayoutMeasure", this.layout.layoutBox, prevLayout ? prevLayout.layoutBox : void 0);
    }
    updateScroll(phase = "measure") {
      let needsMeasurement = Boolean(this.options.layoutScroll && this.instance);
      if (this.scroll && this.scroll.animationId === this.root.animationId && this.scroll.phase === phase) {
        needsMeasurement = false;
      }
      if (needsMeasurement) {
        const isRoot = checkIsScrollRoot(this.instance);
        this.scroll = {
          animationId: this.root.animationId,
          phase,
          isRoot,
          offset: measureScroll(this.instance),
          wasRoot: this.scroll ? this.scroll.isRoot : isRoot
        };
      }
    }
    resetTransform() {
      if (!resetTransform)
        return;
      const isResetRequested = this.isLayoutDirty || this.shouldResetTransform || this.options.alwaysMeasureLayout;
      const hasProjection = this.projectionDelta && !isDeltaZero(this.projectionDelta);
      const transformTemplate = this.getTransformTemplate();
      const transformTemplateValue = transformTemplate ? transformTemplate(this.latestValues, "") : void 0;
      const transformTemplateHasChanged = transformTemplateValue !== this.prevTransformTemplateValue;
      if (isResetRequested && (hasProjection || hasTransform(this.latestValues) || transformTemplateHasChanged)) {
        resetTransform(this.instance, transformTemplateValue);
        this.shouldResetTransform = false;
        this.scheduleRender();
      }
    }
    measure(removeTransform = true) {
      const pageBox = this.measurePageBox();
      let layoutBox = this.removeElementScroll(pageBox);
      if (removeTransform) {
        layoutBox = this.removeTransform(layoutBox);
      }
      roundBox(layoutBox);
      return {
        animationId: this.root.animationId,
        measuredBox: pageBox,
        layoutBox,
        latestValues: {},
        source: this.id
      };
    }
    measurePageBox() {
      var _a;
      const { visualElement } = this.options;
      if (!visualElement)
        return createBox();
      const box = visualElement.measureViewportBox();
      const wasInScrollRoot = ((_a = this.scroll) === null || _a === void 0 ? void 0 : _a.wasRoot) || this.path.some(checkNodeWasScrollRoot);
      if (!wasInScrollRoot) {
        const { scroll } = this.root;
        if (scroll) {
          translateAxis(box.x, scroll.offset.x);
          translateAxis(box.y, scroll.offset.y);
        }
      }
      return box;
    }
    removeElementScroll(box) {
      var _a;
      const boxWithoutScroll = createBox();
      copyBoxInto(boxWithoutScroll, box);
      if ((_a = this.scroll) === null || _a === void 0 ? void 0 : _a.wasRoot) {
        return boxWithoutScroll;
      }
      for (let i = 0; i < this.path.length; i++) {
        const node = this.path[i];
        const { scroll, options: options2 } = node;
        if (node !== this.root && scroll && options2.layoutScroll) {
          if (scroll.wasRoot) {
            copyBoxInto(boxWithoutScroll, box);
          }
          translateAxis(boxWithoutScroll.x, scroll.offset.x);
          translateAxis(boxWithoutScroll.y, scroll.offset.y);
        }
      }
      return boxWithoutScroll;
    }
    applyTransform(box, transformOnly = false) {
      const withTransforms = createBox();
      copyBoxInto(withTransforms, box);
      for (let i = 0; i < this.path.length; i++) {
        const node = this.path[i];
        if (!transformOnly && node.options.layoutScroll && node.scroll && node !== node.root) {
          transformBox(withTransforms, {
            x: -node.scroll.offset.x,
            y: -node.scroll.offset.y
          });
        }
        if (!hasTransform(node.latestValues))
          continue;
        transformBox(withTransforms, node.latestValues);
      }
      if (hasTransform(this.latestValues)) {
        transformBox(withTransforms, this.latestValues);
      }
      return withTransforms;
    }
    removeTransform(box) {
      const boxWithoutTransform = createBox();
      copyBoxInto(boxWithoutTransform, box);
      for (let i = 0; i < this.path.length; i++) {
        const node = this.path[i];
        if (!node.instance)
          continue;
        if (!hasTransform(node.latestValues))
          continue;
        hasScale(node.latestValues) && node.updateSnapshot();
        const sourceBox = createBox();
        const nodeBox = node.measurePageBox();
        copyBoxInto(sourceBox, nodeBox);
        removeBoxTransforms(boxWithoutTransform, node.latestValues, node.snapshot ? node.snapshot.layoutBox : void 0, sourceBox);
      }
      if (hasTransform(this.latestValues)) {
        removeBoxTransforms(boxWithoutTransform, this.latestValues);
      }
      return boxWithoutTransform;
    }
    setTargetDelta(delta) {
      this.targetDelta = delta;
      this.root.scheduleUpdateProjection();
      this.isProjectionDirty = true;
    }
    setOptions(options2) {
      this.options = {
        ...this.options,
        ...options2,
        crossfade: options2.crossfade !== void 0 ? options2.crossfade : true
      };
    }
    clearMeasurements() {
      this.scroll = void 0;
      this.layout = void 0;
      this.snapshot = void 0;
      this.prevTransformTemplateValue = void 0;
      this.targetDelta = void 0;
      this.target = void 0;
      this.isLayoutDirty = false;
    }
    forceRelativeParentToResolveTarget() {
      if (!this.relativeParent)
        return;
      if (this.relativeParent.resolvedRelativeTargetAt !== frameData.timestamp) {
        this.relativeParent.resolveTargetDelta(true);
      }
    }
    resolveTargetDelta(forceRecalculation = false) {
      var _a;
      const lead = this.getLead();
      this.isProjectionDirty || (this.isProjectionDirty = lead.isProjectionDirty);
      this.isTransformDirty || (this.isTransformDirty = lead.isTransformDirty);
      this.isSharedProjectionDirty || (this.isSharedProjectionDirty = lead.isSharedProjectionDirty);
      const isShared = Boolean(this.resumingFrom) || this !== lead;
      const canSkip = !(forceRecalculation || isShared && this.isSharedProjectionDirty || this.isProjectionDirty || ((_a = this.parent) === null || _a === void 0 ? void 0 : _a.isProjectionDirty) || this.attemptToResolveRelativeTarget || this.root.updateBlockedByResize);
      if (canSkip)
        return;
      const { layout: layout2, layoutId } = this.options;
      if (!this.layout || !(layout2 || layoutId))
        return;
      this.resolvedRelativeTargetAt = frameData.timestamp;
      if (!this.targetDelta && !this.relativeTarget) {
        const relativeParent = this.getClosestProjectingParent();
        if (relativeParent && relativeParent.layout && this.animationProgress !== 1) {
          this.relativeParent = relativeParent;
          this.forceRelativeParentToResolveTarget();
          this.relativeTarget = createBox();
          this.relativeTargetOrigin = createBox();
          calcRelativePosition(this.relativeTargetOrigin, this.layout.layoutBox, relativeParent.layout.layoutBox);
          copyBoxInto(this.relativeTarget, this.relativeTargetOrigin);
        } else {
          this.relativeParent = this.relativeTarget = void 0;
        }
      }
      if (!this.relativeTarget && !this.targetDelta)
        return;
      if (!this.target) {
        this.target = createBox();
        this.targetWithTransforms = createBox();
      }
      if (this.relativeTarget && this.relativeTargetOrigin && this.relativeParent && this.relativeParent.target) {
        this.forceRelativeParentToResolveTarget();
        calcRelativeBox(this.target, this.relativeTarget, this.relativeParent.target);
      } else if (this.targetDelta) {
        if (Boolean(this.resumingFrom)) {
          this.target = this.applyTransform(this.layout.layoutBox);
        } else {
          copyBoxInto(this.target, this.layout.layoutBox);
        }
        applyBoxDelta(this.target, this.targetDelta);
      } else {
        copyBoxInto(this.target, this.layout.layoutBox);
      }
      if (this.attemptToResolveRelativeTarget) {
        this.attemptToResolveRelativeTarget = false;
        const relativeParent = this.getClosestProjectingParent();
        if (relativeParent && Boolean(relativeParent.resumingFrom) === Boolean(this.resumingFrom) && !relativeParent.options.layoutScroll && relativeParent.target && this.animationProgress !== 1) {
          this.relativeParent = relativeParent;
          this.forceRelativeParentToResolveTarget();
          this.relativeTarget = createBox();
          this.relativeTargetOrigin = createBox();
          calcRelativePosition(this.relativeTargetOrigin, this.target, relativeParent.target);
          copyBoxInto(this.relativeTarget, this.relativeTargetOrigin);
        } else {
          this.relativeParent = this.relativeTarget = void 0;
        }
      }
      if (isDebug) {
        metrics.resolvedTargetDeltas++;
      }
    }
    getClosestProjectingParent() {
      if (!this.parent || hasScale(this.parent.latestValues) || has2DTranslate(this.parent.latestValues)) {
        return void 0;
      }
      if (this.parent.isProjecting()) {
        return this.parent;
      } else {
        return this.parent.getClosestProjectingParent();
      }
    }
    isProjecting() {
      return Boolean((this.relativeTarget || this.targetDelta || this.options.layoutRoot) && this.layout);
    }
    calcProjection() {
      var _a;
      const lead = this.getLead();
      const isShared = Boolean(this.resumingFrom) || this !== lead;
      let canSkip = true;
      if (this.isProjectionDirty || ((_a = this.parent) === null || _a === void 0 ? void 0 : _a.isProjectionDirty)) {
        canSkip = false;
      }
      if (isShared && (this.isSharedProjectionDirty || this.isTransformDirty)) {
        canSkip = false;
      }
      if (this.resolvedRelativeTargetAt === frameData.timestamp) {
        canSkip = false;
      }
      if (canSkip)
        return;
      const { layout: layout2, layoutId } = this.options;
      this.isTreeAnimating = Boolean(this.parent && this.parent.isTreeAnimating || this.currentAnimation || this.pendingAnimation);
      if (!this.isTreeAnimating) {
        this.targetDelta = this.relativeTarget = void 0;
      }
      if (!this.layout || !(layout2 || layoutId))
        return;
      copyBoxInto(this.layoutCorrected, this.layout.layoutBox);
      const prevTreeScaleX = this.treeScale.x;
      const prevTreeScaleY = this.treeScale.y;
      applyTreeDeltas(this.layoutCorrected, this.treeScale, this.path, isShared);
      if (lead.layout && !lead.target && (this.treeScale.x !== 1 || this.treeScale.y !== 1)) {
        lead.target = lead.layout.layoutBox;
        lead.targetWithTransforms = createBox();
      }
      const { target } = lead;
      if (!target) {
        if (this.prevProjectionDelta) {
          this.createProjectionDeltas();
          this.scheduleRender();
        }
        return;
      }
      if (!this.projectionDelta || !this.prevProjectionDelta) {
        this.createProjectionDeltas();
      } else {
        copyAxisDeltaInto(this.prevProjectionDelta.x, this.projectionDelta.x);
        copyAxisDeltaInto(this.prevProjectionDelta.y, this.projectionDelta.y);
      }
      calcBoxDelta(this.projectionDelta, this.layoutCorrected, target, this.latestValues);
      if (this.treeScale.x !== prevTreeScaleX || this.treeScale.y !== prevTreeScaleY || !axisDeltaEquals(this.projectionDelta.x, this.prevProjectionDelta.x) || !axisDeltaEquals(this.projectionDelta.y, this.prevProjectionDelta.y)) {
        this.hasProjected = true;
        this.scheduleRender();
        this.notifyListeners("projectionUpdate", target);
      }
      if (isDebug) {
        metrics.recalculatedProjection++;
      }
    }
    hide() {
      this.isVisible = false;
    }
    show() {
      this.isVisible = true;
    }
    scheduleRender(notifyAll = true) {
      var _a;
      (_a = this.options.visualElement) === null || _a === void 0 ? void 0 : _a.scheduleRender();
      if (notifyAll) {
        const stack = this.getStack();
        stack && stack.scheduleRender();
      }
      if (this.resumingFrom && !this.resumingFrom.instance) {
        this.resumingFrom = void 0;
      }
    }
    createProjectionDeltas() {
      this.prevProjectionDelta = createDelta();
      this.projectionDelta = createDelta();
      this.projectionDeltaWithTransform = createDelta();
    }
    setAnimationOrigin(delta, hasOnlyRelativeTargetChanged = false) {
      const snapshot = this.snapshot;
      const snapshotLatestValues = snapshot ? snapshot.latestValues : {};
      const mixedValues = { ...this.latestValues };
      const targetDelta = createDelta();
      if (!this.relativeParent || !this.relativeParent.options.layoutRoot) {
        this.relativeTarget = this.relativeTargetOrigin = void 0;
      }
      this.attemptToResolveRelativeTarget = !hasOnlyRelativeTargetChanged;
      const relativeLayout = createBox();
      const snapshotSource = snapshot ? snapshot.source : void 0;
      const layoutSource = this.layout ? this.layout.source : void 0;
      const isSharedLayoutAnimation = snapshotSource !== layoutSource;
      const stack = this.getStack();
      const isOnlyMember = !stack || stack.members.length <= 1;
      const shouldCrossfadeOpacity = Boolean(isSharedLayoutAnimation && !isOnlyMember && this.options.crossfade === true && !this.path.some(hasOpacityCrossfade));
      this.animationProgress = 0;
      let prevRelativeTarget;
      this.mixTargetDelta = (latest) => {
        const progress2 = latest / 1e3;
        mixAxisDelta(targetDelta.x, delta.x, progress2);
        mixAxisDelta(targetDelta.y, delta.y, progress2);
        this.setTargetDelta(targetDelta);
        if (this.relativeTarget && this.relativeTargetOrigin && this.layout && this.relativeParent && this.relativeParent.layout) {
          calcRelativePosition(relativeLayout, this.layout.layoutBox, this.relativeParent.layout.layoutBox);
          mixBox(this.relativeTarget, this.relativeTargetOrigin, relativeLayout, progress2);
          if (prevRelativeTarget && boxEquals(this.relativeTarget, prevRelativeTarget)) {
            this.isProjectionDirty = false;
          }
          if (!prevRelativeTarget)
            prevRelativeTarget = createBox();
          copyBoxInto(prevRelativeTarget, this.relativeTarget);
        }
        if (isSharedLayoutAnimation) {
          this.animationValues = mixedValues;
          mixValues(mixedValues, snapshotLatestValues, this.latestValues, progress2, shouldCrossfadeOpacity, isOnlyMember);
        }
        this.root.scheduleUpdateProjection();
        this.scheduleRender();
        this.animationProgress = progress2;
      };
      this.mixTargetDelta(this.options.layoutRoot ? 1e3 : 0);
    }
    startAnimation(options2) {
      this.notifyListeners("animationStart");
      this.currentAnimation && this.currentAnimation.stop();
      if (this.resumingFrom && this.resumingFrom.currentAnimation) {
        this.resumingFrom.currentAnimation.stop();
      }
      if (this.pendingAnimation) {
        cancelFrame(this.pendingAnimation);
        this.pendingAnimation = void 0;
      }
      this.pendingAnimation = frame.update(() => {
        globalProjectionState.hasAnimatedSinceResize = true;
        this.currentAnimation = animateSingleValue(0, animationTarget, {
          ...options2,
          onUpdate: (latest) => {
            this.mixTargetDelta(latest);
            options2.onUpdate && options2.onUpdate(latest);
          },
          onComplete: () => {
            options2.onComplete && options2.onComplete();
            this.completeAnimation();
          }
        });
        if (this.resumingFrom) {
          this.resumingFrom.currentAnimation = this.currentAnimation;
        }
        this.pendingAnimation = void 0;
      });
    }
    completeAnimation() {
      if (this.resumingFrom) {
        this.resumingFrom.currentAnimation = void 0;
        this.resumingFrom.preserveOpacity = void 0;
      }
      const stack = this.getStack();
      stack && stack.exitAnimationComplete();
      this.resumingFrom = this.currentAnimation = this.animationValues = void 0;
      this.notifyListeners("animationComplete");
    }
    finishAnimation() {
      if (this.currentAnimation) {
        this.mixTargetDelta && this.mixTargetDelta(animationTarget);
        this.currentAnimation.stop();
      }
      this.completeAnimation();
    }
    applyTransformsToTarget() {
      const lead = this.getLead();
      let { targetWithTransforms, target, layout: layout2, latestValues } = lead;
      if (!targetWithTransforms || !target || !layout2)
        return;
      if (this !== lead && this.layout && layout2 && shouldAnimatePositionOnly(this.options.animationType, this.layout.layoutBox, layout2.layoutBox)) {
        target = this.target || createBox();
        const xLength = calcLength(this.layout.layoutBox.x);
        target.x.min = lead.target.x.min;
        target.x.max = target.x.min + xLength;
        const yLength = calcLength(this.layout.layoutBox.y);
        target.y.min = lead.target.y.min;
        target.y.max = target.y.min + yLength;
      }
      copyBoxInto(targetWithTransforms, target);
      transformBox(targetWithTransforms, latestValues);
      calcBoxDelta(this.projectionDeltaWithTransform, this.layoutCorrected, targetWithTransforms, latestValues);
    }
    registerSharedNode(layoutId, node) {
      if (!this.sharedNodes.has(layoutId)) {
        this.sharedNodes.set(layoutId, new NodeStack());
      }
      const stack = this.sharedNodes.get(layoutId);
      stack.add(node);
      const config = node.options.initialPromotionConfig;
      node.promote({
        transition: config ? config.transition : void 0,
        preserveFollowOpacity: config && config.shouldPreserveFollowOpacity ? config.shouldPreserveFollowOpacity(node) : void 0
      });
    }
    isLead() {
      const stack = this.getStack();
      return stack ? stack.lead === this : true;
    }
    getLead() {
      var _a;
      const { layoutId } = this.options;
      return layoutId ? ((_a = this.getStack()) === null || _a === void 0 ? void 0 : _a.lead) || this : this;
    }
    getPrevLead() {
      var _a;
      const { layoutId } = this.options;
      return layoutId ? (_a = this.getStack()) === null || _a === void 0 ? void 0 : _a.prevLead : void 0;
    }
    getStack() {
      const { layoutId } = this.options;
      if (layoutId)
        return this.root.sharedNodes.get(layoutId);
    }
    promote({ needsReset, transition, preserveFollowOpacity } = {}) {
      const stack = this.getStack();
      if (stack)
        stack.promote(this, preserveFollowOpacity);
      if (needsReset) {
        this.projectionDelta = void 0;
        this.needsReset = true;
      }
      if (transition)
        this.setOptions({ transition });
    }
    relegate() {
      const stack = this.getStack();
      if (stack) {
        return stack.relegate(this);
      } else {
        return false;
      }
    }
    resetSkewAndRotation() {
      const { visualElement } = this.options;
      if (!visualElement)
        return;
      let hasDistortingTransform = false;
      const { latestValues } = visualElement;
      if (latestValues.z || latestValues.rotate || latestValues.rotateX || latestValues.rotateY || latestValues.rotateZ || latestValues.skewX || latestValues.skewY) {
        hasDistortingTransform = true;
      }
      if (!hasDistortingTransform)
        return;
      const resetValues = {};
      if (latestValues.z) {
        resetDistortingTransform("z", visualElement, resetValues, this.animationValues);
      }
      for (let i = 0; i < transformAxes.length; i++) {
        resetDistortingTransform(`rotate${transformAxes[i]}`, visualElement, resetValues, this.animationValues);
        resetDistortingTransform(`skew${transformAxes[i]}`, visualElement, resetValues, this.animationValues);
      }
      visualElement.render();
      for (const key in resetValues) {
        visualElement.setStaticValue(key, resetValues[key]);
        if (this.animationValues) {
          this.animationValues[key] = resetValues[key];
        }
      }
      visualElement.scheduleRender();
    }
    getProjectionStyles(styleProp) {
      var _a, _b;
      if (!this.instance || this.isSVG)
        return void 0;
      if (!this.isVisible) {
        return hiddenVisibility;
      }
      const styles = {
        visibility: ""
      };
      const transformTemplate = this.getTransformTemplate();
      if (this.needsReset) {
        this.needsReset = false;
        styles.opacity = "";
        styles.pointerEvents = resolveMotionValue(styleProp === null || styleProp === void 0 ? void 0 : styleProp.pointerEvents) || "";
        styles.transform = transformTemplate ? transformTemplate(this.latestValues, "") : "none";
        return styles;
      }
      const lead = this.getLead();
      if (!this.projectionDelta || !this.layout || !lead.target) {
        const emptyStyles = {};
        if (this.options.layoutId) {
          emptyStyles.opacity = this.latestValues.opacity !== void 0 ? this.latestValues.opacity : 1;
          emptyStyles.pointerEvents = resolveMotionValue(styleProp === null || styleProp === void 0 ? void 0 : styleProp.pointerEvents) || "";
        }
        if (this.hasProjected && !hasTransform(this.latestValues)) {
          emptyStyles.transform = transformTemplate ? transformTemplate({}, "") : "none";
          this.hasProjected = false;
        }
        return emptyStyles;
      }
      const valuesToRender = lead.animationValues || lead.latestValues;
      this.applyTransformsToTarget();
      styles.transform = buildProjectionTransform(this.projectionDeltaWithTransform, this.treeScale, valuesToRender);
      if (transformTemplate) {
        styles.transform = transformTemplate(valuesToRender, styles.transform);
      }
      const { x, y } = this.projectionDelta;
      styles.transformOrigin = `${x.origin * 100}% ${y.origin * 100}% 0`;
      if (lead.animationValues) {
        styles.opacity = lead === this ? (_b = (_a = valuesToRender.opacity) !== null && _a !== void 0 ? _a : this.latestValues.opacity) !== null && _b !== void 0 ? _b : 1 : this.preserveOpacity ? this.latestValues.opacity : valuesToRender.opacityExit;
      } else {
        styles.opacity = lead === this ? valuesToRender.opacity !== void 0 ? valuesToRender.opacity : "" : valuesToRender.opacityExit !== void 0 ? valuesToRender.opacityExit : 0;
      }
      for (const key in scaleCorrectors) {
        if (valuesToRender[key] === void 0)
          continue;
        const { correct, applyTo } = scaleCorrectors[key];
        const corrected = styles.transform === "none" ? valuesToRender[key] : correct(valuesToRender[key], lead);
        if (applyTo) {
          const num3 = applyTo.length;
          for (let i = 0; i < num3; i++) {
            styles[applyTo[i]] = corrected;
          }
        } else {
          styles[key] = corrected;
        }
      }
      if (this.options.layoutId) {
        styles.pointerEvents = lead === this ? resolveMotionValue(styleProp === null || styleProp === void 0 ? void 0 : styleProp.pointerEvents) || "" : "none";
      }
      return styles;
    }
    clearSnapshot() {
      this.resumeFrom = this.snapshot = void 0;
    }
    // Only run on root
    resetTree() {
      this.root.nodes.forEach((node) => {
        var _a;
        return (_a = node.currentAnimation) === null || _a === void 0 ? void 0 : _a.stop();
      });
      this.root.nodes.forEach(clearMeasurements);
      this.root.sharedNodes.clear();
    }
  };
}
function updateLayout(node) {
  node.updateLayout();
}
function notifyLayoutUpdate(node) {
  var _a;
  const snapshot = ((_a = node.resumeFrom) === null || _a === void 0 ? void 0 : _a.snapshot) || node.snapshot;
  if (node.isLead() && node.layout && snapshot && node.hasListeners("didUpdate")) {
    const { layoutBox: layout2, measuredBox: measuredLayout } = node.layout;
    const { animationType } = node.options;
    const isShared = snapshot.source !== node.layout.source;
    if (animationType === "size") {
      eachAxis((axis) => {
        const axisSnapshot = isShared ? snapshot.measuredBox[axis] : snapshot.layoutBox[axis];
        const length = calcLength(axisSnapshot);
        axisSnapshot.min = layout2[axis].min;
        axisSnapshot.max = axisSnapshot.min + length;
      });
    } else if (shouldAnimatePositionOnly(animationType, snapshot.layoutBox, layout2)) {
      eachAxis((axis) => {
        const axisSnapshot = isShared ? snapshot.measuredBox[axis] : snapshot.layoutBox[axis];
        const length = calcLength(layout2[axis]);
        axisSnapshot.max = axisSnapshot.min + length;
        if (node.relativeTarget && !node.currentAnimation) {
          node.isProjectionDirty = true;
          node.relativeTarget[axis].max = node.relativeTarget[axis].min + length;
        }
      });
    }
    const layoutDelta = createDelta();
    calcBoxDelta(layoutDelta, layout2, snapshot.layoutBox);
    const visualDelta = createDelta();
    if (isShared) {
      calcBoxDelta(visualDelta, node.applyTransform(measuredLayout, true), snapshot.measuredBox);
    } else {
      calcBoxDelta(visualDelta, layout2, snapshot.layoutBox);
    }
    const hasLayoutChanged = !isDeltaZero(layoutDelta);
    let hasRelativeTargetChanged = false;
    if (!node.resumeFrom) {
      const relativeParent = node.getClosestProjectingParent();
      if (relativeParent && !relativeParent.resumeFrom) {
        const { snapshot: parentSnapshot, layout: parentLayout } = relativeParent;
        if (parentSnapshot && parentLayout) {
          const relativeSnapshot = createBox();
          calcRelativePosition(relativeSnapshot, snapshot.layoutBox, parentSnapshot.layoutBox);
          const relativeLayout = createBox();
          calcRelativePosition(relativeLayout, layout2, parentLayout.layoutBox);
          if (!boxEqualsRounded(relativeSnapshot, relativeLayout)) {
            hasRelativeTargetChanged = true;
          }
          if (relativeParent.options.layoutRoot) {
            node.relativeTarget = relativeLayout;
            node.relativeTargetOrigin = relativeSnapshot;
            node.relativeParent = relativeParent;
          }
        }
      }
    }
    node.notifyListeners("didUpdate", {
      layout: layout2,
      snapshot,
      delta: visualDelta,
      layoutDelta,
      hasLayoutChanged,
      hasRelativeTargetChanged
    });
  } else if (node.isLead()) {
    const { onExitComplete } = node.options;
    onExitComplete && onExitComplete();
  }
  node.options.transition = void 0;
}
function propagateDirtyNodes(node) {
  if (isDebug) {
    metrics.totalNodes++;
  }
  if (!node.parent)
    return;
  if (!node.isProjecting()) {
    node.isProjectionDirty = node.parent.isProjectionDirty;
  }
  node.isSharedProjectionDirty || (node.isSharedProjectionDirty = Boolean(node.isProjectionDirty || node.parent.isProjectionDirty || node.parent.isSharedProjectionDirty));
  node.isTransformDirty || (node.isTransformDirty = node.parent.isTransformDirty);
}
function cleanDirtyNodes(node) {
  node.isProjectionDirty = node.isSharedProjectionDirty = node.isTransformDirty = false;
}
function clearSnapshot(node) {
  node.clearSnapshot();
}
function clearMeasurements(node) {
  node.clearMeasurements();
}
function clearIsLayoutDirty(node) {
  node.isLayoutDirty = false;
}
function resetTransformStyle(node) {
  const { visualElement } = node.options;
  if (visualElement && visualElement.getProps().onBeforeLayoutMeasure) {
    visualElement.notify("BeforeLayoutMeasure");
  }
  node.resetTransform();
}
function finishAnimation(node) {
  node.finishAnimation();
  node.targetDelta = node.relativeTarget = node.target = void 0;
  node.isProjectionDirty = true;
}
function resolveTargetDelta(node) {
  node.resolveTargetDelta();
}
function calcProjection(node) {
  node.calcProjection();
}
function resetSkewAndRotation(node) {
  node.resetSkewAndRotation();
}
function removeLeadSnapshots(stack) {
  stack.removeLeadSnapshot();
}
function mixAxisDelta(output, delta, p) {
  output.translate = mixNumber(delta.translate, 0, p);
  output.scale = mixNumber(delta.scale, 1, p);
  output.origin = delta.origin;
  output.originPoint = delta.originPoint;
}
function mixAxis(output, from, to, p) {
  output.min = mixNumber(from.min, to.min, p);
  output.max = mixNumber(from.max, to.max, p);
}
function mixBox(output, from, to, p) {
  mixAxis(output.x, from.x, to.x, p);
  mixAxis(output.y, from.y, to.y, p);
}
function hasOpacityCrossfade(node) {
  return node.animationValues && node.animationValues.opacityExit !== void 0;
}
var defaultLayoutTransition = {
  duration: 0.45,
  ease: [0.4, 0, 0.1, 1]
};
var userAgentContains = (string) => typeof navigator !== "undefined" && navigator.userAgent && navigator.userAgent.toLowerCase().includes(string);
var roundPoint = userAgentContains("applewebkit/") && !userAgentContains("chrome/") ? Math.round : noop;
function roundAxis(axis) {
  axis.min = roundPoint(axis.min);
  axis.max = roundPoint(axis.max);
}
function roundBox(box) {
  roundAxis(box.x);
  roundAxis(box.y);
}
function shouldAnimatePositionOnly(animationType, snapshot, layout2) {
  return animationType === "position" || animationType === "preserve-aspect" && !isNear(aspectRatio(snapshot), aspectRatio(layout2), 0.2);
}
function checkNodeWasScrollRoot(node) {
  var _a;
  return node !== node.root && ((_a = node.scroll) === null || _a === void 0 ? void 0 : _a.wasRoot);
}

// node_modules/framer-motion/dist/es/projection/node/DocumentProjectionNode.mjs
var DocumentProjectionNode = createProjectionNode2({
  attachResizeListener: (ref, notify2) => addDomEvent(ref, "resize", notify2),
  measureScroll: () => ({
    x: document.documentElement.scrollLeft || document.body.scrollLeft,
    y: document.documentElement.scrollTop || document.body.scrollTop
  }),
  checkIsScrollRoot: () => true
});

// node_modules/framer-motion/dist/es/projection/node/HTMLProjectionNode.mjs
var rootProjectionNode = {
  current: void 0
};
var HTMLProjectionNode = createProjectionNode2({
  measureScroll: (instance) => ({
    x: instance.scrollLeft,
    y: instance.scrollTop
  }),
  defaultParent: () => {
    if (!rootProjectionNode.current) {
      const documentNode = new DocumentProjectionNode({});
      documentNode.mount(window);
      documentNode.setOptions({ layoutScroll: true });
      rootProjectionNode.current = documentNode;
    }
    return rootProjectionNode.current;
  },
  resetTransform: (instance, value) => {
    instance.style.transform = value !== void 0 ? value : "none";
  },
  checkIsScrollRoot: (instance) => Boolean(window.getComputedStyle(instance).position === "fixed")
});

// node_modules/framer-motion/dist/es/motion/features/drag.mjs
var drag = {
  pan: {
    Feature: PanGesture
  },
  drag: {
    Feature: DragGesture,
    ProjectionNode: HTMLProjectionNode,
    MeasureLayout
  }
};

// node_modules/framer-motion/dist/es/gestures/hover.mjs
function handleHoverEvent(node, event, lifecycle) {
  const { props } = node;
  if (node.animationState && props.whileHover) {
    node.animationState.setActive("whileHover", lifecycle === "Start");
  }
  const eventName = "onHover" + lifecycle;
  const callback = props[eventName];
  if (callback) {
    frame.postRender(() => callback(event, extractEventInfo(event)));
  }
}
var HoverGesture = class extends Feature {
  mount() {
    const { current } = this.node;
    if (!current)
      return;
    this.unmount = hover(current, (startEvent) => {
      handleHoverEvent(this.node, startEvent, "Start");
      return (endEvent) => handleHoverEvent(this.node, endEvent, "End");
    });
  }
  unmount() {
  }
};

// node_modules/framer-motion/dist/es/gestures/focus.mjs
var FocusGesture = class extends Feature {
  constructor() {
    super(...arguments);
    this.isActive = false;
  }
  onFocus() {
    let isFocusVisible = false;
    try {
      isFocusVisible = this.node.current.matches(":focus-visible");
    } catch (e) {
      isFocusVisible = true;
    }
    if (!isFocusVisible || !this.node.animationState)
      return;
    this.node.animationState.setActive("whileFocus", true);
    this.isActive = true;
  }
  onBlur() {
    if (!this.isActive || !this.node.animationState)
      return;
    this.node.animationState.setActive("whileFocus", false);
    this.isActive = false;
  }
  mount() {
    this.unmount = pipe(addDomEvent(this.node.current, "focus", () => this.onFocus()), addDomEvent(this.node.current, "blur", () => this.onBlur()));
  }
  unmount() {
  }
};

// node_modules/framer-motion/dist/es/gestures/press.mjs
function handlePressEvent(node, event, lifecycle) {
  const { props } = node;
  if (node.animationState && props.whileTap) {
    node.animationState.setActive("whileTap", lifecycle === "Start");
  }
  const eventName = "onTap" + (lifecycle === "End" ? "" : lifecycle);
  const callback = props[eventName];
  if (callback) {
    frame.postRender(() => callback(event, extractEventInfo(event)));
  }
}
var PressGesture = class extends Feature {
  mount() {
    const { current } = this.node;
    if (!current)
      return;
    this.unmount = press(current, (startEvent) => {
      handlePressEvent(this.node, startEvent, "Start");
      return (endEvent, { success }) => handlePressEvent(this.node, endEvent, success ? "End" : "Cancel");
    }, { useGlobalTarget: this.node.props.globalTapTarget });
  }
  unmount() {
  }
};

// node_modules/framer-motion/dist/es/motion/features/viewport/observers.mjs
var observerCallbacks = /* @__PURE__ */ new WeakMap();
var observers = /* @__PURE__ */ new WeakMap();
var fireObserverCallback = (entry) => {
  const callback = observerCallbacks.get(entry.target);
  callback && callback(entry);
};
var fireAllObserverCallbacks = (entries2) => {
  entries2.forEach(fireObserverCallback);
};
function initIntersectionObserver({ root, ...options2 }) {
  const lookupRoot = root || document;
  if (!observers.has(lookupRoot)) {
    observers.set(lookupRoot, {});
  }
  const rootObservers = observers.get(lookupRoot);
  const key = JSON.stringify(options2);
  if (!rootObservers[key]) {
    rootObservers[key] = new IntersectionObserver(fireAllObserverCallbacks, { root, ...options2 });
  }
  return rootObservers[key];
}
function observeIntersection(element, options2, callback) {
  const rootInteresectionObserver = initIntersectionObserver(options2);
  observerCallbacks.set(element, callback);
  rootInteresectionObserver.observe(element);
  return () => {
    observerCallbacks.delete(element);
    rootInteresectionObserver.unobserve(element);
  };
}

// node_modules/framer-motion/dist/es/motion/features/viewport/index.mjs
var thresholdNames = {
  some: 0,
  all: 1
};
var InViewFeature = class extends Feature {
  constructor() {
    super(...arguments);
    this.hasEnteredView = false;
    this.isInView = false;
  }
  startObserver() {
    this.unmount();
    const { viewport = {} } = this.node.getProps();
    const { root, margin: rootMargin, amount = "some", once } = viewport;
    const options2 = {
      root: root ? root.current : void 0,
      rootMargin,
      threshold: typeof amount === "number" ? amount : thresholdNames[amount]
    };
    const onIntersectionUpdate = (entry) => {
      const { isIntersecting } = entry;
      if (this.isInView === isIntersecting)
        return;
      this.isInView = isIntersecting;
      if (once && !isIntersecting && this.hasEnteredView) {
        return;
      } else if (isIntersecting) {
        this.hasEnteredView = true;
      }
      if (this.node.animationState) {
        this.node.animationState.setActive("whileInView", isIntersecting);
      }
      const { onViewportEnter, onViewportLeave } = this.node.getProps();
      const callback = isIntersecting ? onViewportEnter : onViewportLeave;
      callback && callback(entry);
    };
    return observeIntersection(this.node.current, options2, onIntersectionUpdate);
  }
  mount() {
    this.startObserver();
  }
  update() {
    if (typeof IntersectionObserver === "undefined")
      return;
    const { props, prevProps } = this.node;
    const hasOptionsChanged = ["amount", "margin", "root"].some(hasViewportOptionChanged(props, prevProps));
    if (hasOptionsChanged) {
      this.startObserver();
    }
  }
  unmount() {
  }
};
function hasViewportOptionChanged({ viewport = {} }, { viewport: prevViewport = {} } = {}) {
  return (name) => viewport[name] !== prevViewport[name];
}

// node_modules/framer-motion/dist/es/motion/features/gestures.mjs
var gestureAnimations = {
  inView: {
    Feature: InViewFeature
  },
  tap: {
    Feature: PressGesture
  },
  focus: {
    Feature: FocusGesture
  },
  hover: {
    Feature: HoverGesture
  }
};

// node_modules/framer-motion/dist/es/motion/features/layout.mjs
var layout = {
  layout: {
    ProjectionNode: HTMLProjectionNode,
    MeasureLayout
  }
};

// node_modules/framer-motion/dist/es/render/dom/create-visual-element.mjs
var import_react23 = require("react");

// node_modules/framer-motion/dist/es/utils/reduced-motion/state.mjs
var prefersReducedMotion = { current: null };
var hasReducedMotionListener = { current: false };

// node_modules/framer-motion/dist/es/utils/reduced-motion/index.mjs
function initPrefersReducedMotion() {
  hasReducedMotionListener.current = true;
  if (!isBrowser)
    return;
  if (window.matchMedia) {
    const motionMediaQuery = window.matchMedia("(prefers-reduced-motion)");
    const setReducedMotionPreferences = () => prefersReducedMotion.current = motionMediaQuery.matches;
    motionMediaQuery.addListener(setReducedMotionPreferences);
    setReducedMotionPreferences();
  } else {
    prefersReducedMotion.current = false;
  }
}

// node_modules/framer-motion/dist/es/render/dom/value-types/find.mjs
var valueTypes = [...dimensionValueTypes, color, complex];
var findValueType = (v) => valueTypes.find(testValueType(v));

// node_modules/framer-motion/dist/es/render/store.mjs
var visualElementStore = /* @__PURE__ */ new WeakMap();

// node_modules/framer-motion/dist/es/render/utils/motion-values.mjs
function updateMotionValuesFromProps(element, next, prev) {
  for (const key in next) {
    const nextValue = next[key];
    const prevValue = prev[key];
    if (isMotionValue(nextValue)) {
      element.addValue(key, nextValue);
      if (false) {
        warnOnce(nextValue.version === "11.18.2", `Attempting to mix Motion versions ${nextValue.version} with 11.18.2 may not work as expected.`);
      }
    } else if (isMotionValue(prevValue)) {
      element.addValue(key, motionValue(nextValue, { owner: element }));
    } else if (prevValue !== nextValue) {
      if (element.hasValue(key)) {
        const existingValue = element.getValue(key);
        if (existingValue.liveStyle === true) {
          existingValue.jump(nextValue);
        } else if (!existingValue.hasAnimated) {
          existingValue.set(nextValue);
        }
      } else {
        const latestValue = element.getStaticValue(key);
        element.addValue(key, motionValue(latestValue !== void 0 ? latestValue : nextValue, { owner: element }));
      }
    }
  }
  for (const key in prev) {
    if (next[key] === void 0)
      element.removeValue(key);
  }
  return next;
}

// node_modules/framer-motion/dist/es/render/VisualElement.mjs
var propEventHandlers = [
  "AnimationStart",
  "AnimationComplete",
  "Update",
  "BeforeLayoutMeasure",
  "LayoutMeasure",
  "LayoutAnimationStart",
  "LayoutAnimationComplete"
];
var VisualElement = class {
  /**
   * This method takes React props and returns found MotionValues. For example, HTML
   * MotionValues will be found within the style prop, whereas for Three.js within attribute arrays.
   *
   * This isn't an abstract method as it needs calling in the constructor, but it is
   * intended to be one.
   */
  scrapeMotionValuesFromProps(_props, _prevProps, _visualElement) {
    return {};
  }
  constructor({ parent, props, presenceContext, reducedMotionConfig, blockInitialAnimation, visualState }, options2 = {}) {
    this.current = null;
    this.children = /* @__PURE__ */ new Set();
    this.isVariantNode = false;
    this.isControllingVariants = false;
    this.shouldReduceMotion = null;
    this.values = /* @__PURE__ */ new Map();
    this.KeyframeResolver = KeyframeResolver;
    this.features = {};
    this.valueSubscriptions = /* @__PURE__ */ new Map();
    this.prevMotionValues = {};
    this.events = {};
    this.propEventSubscriptions = {};
    this.notifyUpdate = () => this.notify("Update", this.latestValues);
    this.render = () => {
      if (!this.current)
        return;
      this.triggerBuild();
      this.renderInstance(this.current, this.renderState, this.props.style, this.projection);
    };
    this.renderScheduledAt = 0;
    this.scheduleRender = () => {
      const now2 = time.now();
      if (this.renderScheduledAt < now2) {
        this.renderScheduledAt = now2;
        frame.render(this.render, false, true);
      }
    };
    const { latestValues, renderState, onUpdate } = visualState;
    this.onUpdate = onUpdate;
    this.latestValues = latestValues;
    this.baseTarget = { ...latestValues };
    this.initialValues = props.initial ? { ...latestValues } : {};
    this.renderState = renderState;
    this.parent = parent;
    this.props = props;
    this.presenceContext = presenceContext;
    this.depth = parent ? parent.depth + 1 : 0;
    this.reducedMotionConfig = reducedMotionConfig;
    this.options = options2;
    this.blockInitialAnimation = Boolean(blockInitialAnimation);
    this.isControllingVariants = isControllingVariants(props);
    this.isVariantNode = isVariantNode(props);
    if (this.isVariantNode) {
      this.variantChildren = /* @__PURE__ */ new Set();
    }
    this.manuallyAnimateOnMount = Boolean(parent && parent.current);
    const { willChange, ...initialMotionValues } = this.scrapeMotionValuesFromProps(props, {}, this);
    for (const key in initialMotionValues) {
      const value = initialMotionValues[key];
      if (latestValues[key] !== void 0 && isMotionValue(value)) {
        value.set(latestValues[key], false);
      }
    }
  }
  mount(instance) {
    this.current = instance;
    visualElementStore.set(instance, this);
    if (this.projection && !this.projection.instance) {
      this.projection.mount(instance);
    }
    if (this.parent && this.isVariantNode && !this.isControllingVariants) {
      this.removeFromVariantTree = this.parent.addVariantChild(this);
    }
    this.values.forEach((value, key) => this.bindToMotionValue(key, value));
    if (!hasReducedMotionListener.current) {
      initPrefersReducedMotion();
    }
    this.shouldReduceMotion = this.reducedMotionConfig === "never" ? false : this.reducedMotionConfig === "always" ? true : prefersReducedMotion.current;
    if (false) {
      warnOnce(this.shouldReduceMotion !== true, "You have Reduced Motion enabled on your device. Animations may not appear as expected.");
    }
    if (this.parent)
      this.parent.children.add(this);
    this.update(this.props, this.presenceContext);
  }
  unmount() {
    visualElementStore.delete(this.current);
    this.projection && this.projection.unmount();
    cancelFrame(this.notifyUpdate);
    cancelFrame(this.render);
    this.valueSubscriptions.forEach((remove) => remove());
    this.valueSubscriptions.clear();
    this.removeFromVariantTree && this.removeFromVariantTree();
    this.parent && this.parent.children.delete(this);
    for (const key in this.events) {
      this.events[key].clear();
    }
    for (const key in this.features) {
      const feature = this.features[key];
      if (feature) {
        feature.unmount();
        feature.isMounted = false;
      }
    }
    this.current = null;
  }
  bindToMotionValue(key, value) {
    if (this.valueSubscriptions.has(key)) {
      this.valueSubscriptions.get(key)();
    }
    const valueIsTransform = transformProps.has(key);
    const removeOnChange = value.on("change", (latestValue) => {
      this.latestValues[key] = latestValue;
      this.props.onUpdate && frame.preRender(this.notifyUpdate);
      if (valueIsTransform && this.projection) {
        this.projection.isTransformDirty = true;
      }
    });
    const removeOnRenderRequest = value.on("renderRequest", this.scheduleRender);
    let removeSyncCheck;
    if (window.MotionCheckAppearSync) {
      removeSyncCheck = window.MotionCheckAppearSync(this, key, value);
    }
    this.valueSubscriptions.set(key, () => {
      removeOnChange();
      removeOnRenderRequest();
      if (removeSyncCheck)
        removeSyncCheck();
      if (value.owner)
        value.stop();
    });
  }
  sortNodePosition(other2) {
    if (!this.current || !this.sortInstanceNodePosition || this.type !== other2.type) {
      return 0;
    }
    return this.sortInstanceNodePosition(this.current, other2.current);
  }
  updateFeatures() {
    let key = "animation";
    for (key in featureDefinitions) {
      const featureDefinition = featureDefinitions[key];
      if (!featureDefinition)
        continue;
      const { isEnabled, Feature: FeatureConstructor } = featureDefinition;
      if (!this.features[key] && FeatureConstructor && isEnabled(this.props)) {
        this.features[key] = new FeatureConstructor(this);
      }
      if (this.features[key]) {
        const feature = this.features[key];
        if (feature.isMounted) {
          feature.update();
        } else {
          feature.mount();
          feature.isMounted = true;
        }
      }
    }
  }
  triggerBuild() {
    this.build(this.renderState, this.latestValues, this.props);
  }
  /**
   * Measure the current viewport box with or without transforms.
   * Only measures axis-aligned boxes, rotate and skew must be manually
   * removed with a re-render to work.
   */
  measureViewportBox() {
    return this.current ? this.measureInstanceViewportBox(this.current, this.props) : createBox();
  }
  getStaticValue(key) {
    return this.latestValues[key];
  }
  setStaticValue(key, value) {
    this.latestValues[key] = value;
  }
  /**
   * Update the provided props. Ensure any newly-added motion values are
   * added to our map, old ones removed, and listeners updated.
   */
  update(props, presenceContext) {
    if (props.transformTemplate || this.props.transformTemplate) {
      this.scheduleRender();
    }
    this.prevProps = this.props;
    this.props = props;
    this.prevPresenceContext = this.presenceContext;
    this.presenceContext = presenceContext;
    for (let i = 0; i < propEventHandlers.length; i++) {
      const key = propEventHandlers[i];
      if (this.propEventSubscriptions[key]) {
        this.propEventSubscriptions[key]();
        delete this.propEventSubscriptions[key];
      }
      const listenerName = "on" + key;
      const listener = props[listenerName];
      if (listener) {
        this.propEventSubscriptions[key] = this.on(key, listener);
      }
    }
    this.prevMotionValues = updateMotionValuesFromProps(this, this.scrapeMotionValuesFromProps(props, this.prevProps, this), this.prevMotionValues);
    if (this.handleChildMotionValue) {
      this.handleChildMotionValue();
    }
    this.onUpdate && this.onUpdate(this);
  }
  getProps() {
    return this.props;
  }
  /**
   * Returns the variant definition with a given name.
   */
  getVariant(name) {
    return this.props.variants ? this.props.variants[name] : void 0;
  }
  /**
   * Returns the defined default transition on this component.
   */
  getDefaultTransition() {
    return this.props.transition;
  }
  getTransformPagePoint() {
    return this.props.transformPagePoint;
  }
  getClosestVariantNode() {
    return this.isVariantNode ? this : this.parent ? this.parent.getClosestVariantNode() : void 0;
  }
  /**
   * Add a child visual element to our set of children.
   */
  addVariantChild(child) {
    const closestVariantNode = this.getClosestVariantNode();
    if (closestVariantNode) {
      closestVariantNode.variantChildren && closestVariantNode.variantChildren.add(child);
      return () => closestVariantNode.variantChildren.delete(child);
    }
  }
  /**
   * Add a motion value and bind it to this visual element.
   */
  addValue(key, value) {
    const existingValue = this.values.get(key);
    if (value !== existingValue) {
      if (existingValue)
        this.removeValue(key);
      this.bindToMotionValue(key, value);
      this.values.set(key, value);
      this.latestValues[key] = value.get();
    }
  }
  /**
   * Remove a motion value and unbind any active subscriptions.
   */
  removeValue(key) {
    this.values.delete(key);
    const unsubscribe = this.valueSubscriptions.get(key);
    if (unsubscribe) {
      unsubscribe();
      this.valueSubscriptions.delete(key);
    }
    delete this.latestValues[key];
    this.removeValueFromRenderState(key, this.renderState);
  }
  /**
   * Check whether we have a motion value for this key
   */
  hasValue(key) {
    return this.values.has(key);
  }
  getValue(key, defaultValue) {
    if (this.props.values && this.props.values[key]) {
      return this.props.values[key];
    }
    let value = this.values.get(key);
    if (value === void 0 && defaultValue !== void 0) {
      value = motionValue(defaultValue === null ? void 0 : defaultValue, { owner: this });
      this.addValue(key, value);
    }
    return value;
  }
  /**
   * If we're trying to animate to a previously unencountered value,
   * we need to check for it in our state and as a last resort read it
   * directly from the instance (which might have performance implications).
   */
  readValue(key, target) {
    var _a;
    let value = this.latestValues[key] !== void 0 || !this.current ? this.latestValues[key] : (_a = this.getBaseTargetFromProps(this.props, key)) !== null && _a !== void 0 ? _a : this.readValueFromInstance(this.current, key, this.options);
    if (value !== void 0 && value !== null) {
      if (typeof value === "string" && (isNumericalString(value) || isZeroValueString(value))) {
        value = parseFloat(value);
      } else if (!findValueType(value) && complex.test(target)) {
        value = getAnimatableNone2(key, target);
      }
      this.setBaseTarget(key, isMotionValue(value) ? value.get() : value);
    }
    return isMotionValue(value) ? value.get() : value;
  }
  /**
   * Set the base target to later animate back to. This is currently
   * only hydrated on creation and when we first read a value.
   */
  setBaseTarget(key, value) {
    this.baseTarget[key] = value;
  }
  /**
   * Find the base target for a value thats been removed from all animation
   * props.
   */
  getBaseTarget(key) {
    var _a;
    const { initial } = this.props;
    let valueFromInitial;
    if (typeof initial === "string" || typeof initial === "object") {
      const variant = resolveVariantFromProps(this.props, initial, (_a = this.presenceContext) === null || _a === void 0 ? void 0 : _a.custom);
      if (variant) {
        valueFromInitial = variant[key];
      }
    }
    if (initial && valueFromInitial !== void 0) {
      return valueFromInitial;
    }
    const target = this.getBaseTargetFromProps(this.props, key);
    if (target !== void 0 && !isMotionValue(target))
      return target;
    return this.initialValues[key] !== void 0 && valueFromInitial === void 0 ? void 0 : this.baseTarget[key];
  }
  on(eventName, callback) {
    if (!this.events[eventName]) {
      this.events[eventName] = new SubscriptionManager();
    }
    return this.events[eventName].add(callback);
  }
  notify(eventName, ...args) {
    if (this.events[eventName]) {
      this.events[eventName].notify(...args);
    }
  }
};

// node_modules/framer-motion/dist/es/render/dom/DOMVisualElement.mjs
var DOMVisualElement = class extends VisualElement {
  constructor() {
    super(...arguments);
    this.KeyframeResolver = DOMKeyframesResolver;
  }
  sortInstanceNodePosition(a, b) {
    return a.compareDocumentPosition(b) & 2 ? 1 : -1;
  }
  getBaseTargetFromProps(props, key) {
    return props.style ? props.style[key] : void 0;
  }
  removeValueFromRenderState(key, { vars, style }) {
    delete vars[key];
    delete style[key];
  }
  handleChildMotionValue() {
    if (this.childSubscription) {
      this.childSubscription();
      delete this.childSubscription;
    }
    const { children } = this.props;
    if (isMotionValue(children)) {
      this.childSubscription = children.on("change", (latest) => {
        if (this.current) {
          this.current.textContent = `${latest}`;
        }
      });
    }
  }
};

// node_modules/framer-motion/dist/es/render/html/HTMLVisualElement.mjs
function getComputedStyle(element) {
  return window.getComputedStyle(element);
}
var HTMLVisualElement = class extends DOMVisualElement {
  constructor() {
    super(...arguments);
    this.type = "html";
    this.renderInstance = renderHTML;
  }
  readValueFromInstance(instance, key) {
    if (transformProps.has(key)) {
      const defaultType = getDefaultValueType(key);
      return defaultType ? defaultType.default || 0 : 0;
    } else {
      const computedStyle = getComputedStyle(instance);
      const value = (isCSSVariableName(key) ? computedStyle.getPropertyValue(key) : computedStyle[key]) || 0;
      return typeof value === "string" ? value.trim() : value;
    }
  }
  measureInstanceViewportBox(instance, { transformPagePoint }) {
    return measureViewportBox(instance, transformPagePoint);
  }
  build(renderState, latestValues, props) {
    buildHTMLStyles(renderState, latestValues, props.transformTemplate);
  }
  scrapeMotionValuesFromProps(props, prevProps, visualElement) {
    return scrapeMotionValuesFromProps(props, prevProps, visualElement);
  }
};

// node_modules/framer-motion/dist/es/render/svg/SVGVisualElement.mjs
var SVGVisualElement = class extends DOMVisualElement {
  constructor() {
    super(...arguments);
    this.type = "svg";
    this.isSVGTag = false;
    this.measureInstanceViewportBox = createBox;
  }
  getBaseTargetFromProps(props, key) {
    return props[key];
  }
  readValueFromInstance(instance, key) {
    if (transformProps.has(key)) {
      const defaultType = getDefaultValueType(key);
      return defaultType ? defaultType.default || 0 : 0;
    }
    key = !camelCaseAttributes.has(key) ? camelToDash(key) : key;
    return instance.getAttribute(key);
  }
  scrapeMotionValuesFromProps(props, prevProps, visualElement) {
    return scrapeMotionValuesFromProps2(props, prevProps, visualElement);
  }
  build(renderState, latestValues, props) {
    buildSVGAttrs(renderState, latestValues, this.isSVGTag, props.transformTemplate);
  }
  renderInstance(instance, renderState, styleProp, projection) {
    renderSVG(instance, renderState, styleProp, projection);
  }
  mount(instance) {
    this.isSVGTag = isSVGTag(instance.tagName);
    super.mount(instance);
  }
};

// node_modules/framer-motion/dist/es/render/dom/create-visual-element.mjs
var createDomVisualElement = (Component4, options2) => {
  return isSVGComponent(Component4) ? new SVGVisualElement(options2) : new HTMLVisualElement(options2, {
    allowProjection: Component4 !== import_react23.Fragment
  });
};

// node_modules/framer-motion/dist/es/render/components/motion/create.mjs
var createMotionComponent = /* @__PURE__ */ createMotionComponentFactory({
  ...animations,
  ...gestureAnimations,
  ...drag,
  ...layout
}, createDomVisualElement);

// node_modules/framer-motion/dist/es/render/components/motion/proxy.mjs
var motion = /* @__PURE__ */ createDOMMotionComponentProxy(createMotionComponent);

// src/client/chat-a2ui/ChatRow.tsx
var import_react31 = require("react");

// src/client/chat-a2ui/row-model.ts
function asRecord(value) {
  return typeof value === "object" && value !== null ? value : void 0;
}
function readString(source, key) {
  const value = source?.[key];
  return typeof value === "string" && value.trim() !== "" ? value : void 0;
}
function readNumber(source, key) {
  const value = source?.[key];
  return typeof value === "number" && Number.isFinite(value) ? value : void 0;
}
function readFiniteNumber(value) {
  return typeof value === "number" && Number.isFinite(value) ? value : void 0;
}
function readMessage(source) {
  if (source === void 0) return void 0;
  const direct = readString(source, "message") ?? readString(source, "text") ?? readString(source, "reason") ?? readString(source, "detail");
  if (direct !== void 0) return direct;
  const raw = source["error"];
  if (typeof raw === "string" && raw.trim() !== "") return raw;
  const error = asRecord(raw);
  return readString(error, "message") ?? readString(error, "reason") ?? readString(error, "code");
}
function formatCount(value) {
  try {
    return Math.round(value).toLocaleString("zh-CN");
  } catch {
    return String(Math.round(value));
  }
}
function formatTokenUsage(usage) {
  const rec = asRecord(usage);
  if (rec === void 0) return void 0;
  const input = readNumber(rec, "inputTokens") ?? readNumber(rec, "input") ?? readNumber(rec, "promptTokens");
  const output = readNumber(rec, "outputTokens") ?? readNumber(rec, "output") ?? readNumber(rec, "completionTokens");
  const total = readNumber(rec, "totalTokens") ?? readNumber(rec, "total");
  const parts = [];
  if (input !== void 0) parts.push("\u8F93\u5165 " + formatCount(input));
  if (output !== void 0) parts.push("\u8F93\u51FA " + formatCount(output));
  if (total !== void 0 && (input === void 0 || output === void 0)) parts.push("\u5408\u8BA1 " + formatCount(total));
  if (parts.length === 0) return void 0;
  return parts.join(" \xB7 ") + " tokens";
}
function readImageAttachment(value) {
  const rec = asRecord(value);
  const attachmentId = readString(rec, "attachmentId");
  if (attachmentId === void 0) return void 0;
  const name = readString(rec, "name");
  return {
    attachmentId,
    mediaType: readString(rec, "mediaType") ?? "image/png",
    bytes: readNumber(rec, "bytes") ?? 0,
    width: readNumber(rec, "width") ?? 0,
    height: readNumber(rec, "height") ?? 0,
    ...name === void 0 ? {} : { name }
  };
}
function splitUserContent(content) {
  const parts = { texts: [], images: [], files: [], unsupported: 0 };
  if (!Array.isArray(content)) return parts;
  for (const block2 of content) {
    const rec = asRecord(block2);
    if (rec === void 0) {
      parts.unsupported += 1;
      continue;
    }
    const type = rec["type"];
    if (type === "text") {
      const text2 = readString(rec, "text");
      if (text2 !== void 0) parts.texts.push(text2);
      continue;
    }
    if (type === "image") {
      const attachment = readImageAttachment(rec["attachment"]);
      if (attachment === void 0) parts.unsupported += 1;
      else parts.images.push(attachment);
      continue;
    }
    if (type === "file") {
      const attachment = asRecord(rec["attachment"]);
      const name = readString(attachment, "name");
      if (name === void 0) parts.unsupported += 1;
      else parts.files.push({ name, bytes: readNumber(attachment, "bytes") ?? 0 });
      continue;
    }
    parts.unsupported += 1;
  }
  return parts;
}
function readContextText(data) {
  const rec = asRecord(data);
  const source = asRecord(rec?.["source"]);
  const sections = source?.["sections"];
  if (Array.isArray(sections)) {
    const lines = [];
    for (const item of sections) {
      const section = asRecord(item);
      const text2 = readString(section, "text");
      if (text2 !== void 0) lines.push(text2);
    }
    if (lines.length > 0) return lines.join("\n");
  }
  return splitUserContent(rec?.["content"]).texts.join("\n\n").trim();
}
var NOTICE_KINDS = ["turn-error", "turn-max-tokens", "model-retry", "turn-process"];
function noticeSpec(kind, data) {
  const rec = asRecord(data);
  switch (kind) {
    case "turn-error":
      return { icon: "!", title: "\u672C\u8F6E\u51FA\u9519", text: readMessage(rec) ?? "\u6267\u884C\u4E2D\u65AD\uFF0C\u53EF\u4EE5\u91CD\u8BD5\u4E00\u6B21\u3002" };
    case "turn-max-tokens":
      return { icon: "\u2026", title: "\u5DF2\u8FBE\u8F93\u51FA\u4E0A\u9650", text: "\u672C\u8F6E\u56DE\u590D\u88AB\u622A\u65AD\u3002" };
    case "model-retry": {
      const attempt = readNumber(rec, "attempt") ?? readNumber(rec, "attempts");
      const delay2 = readNumber(rec, "delayMs") ?? readNumber(rec, "delay");
      const reason = readMessage(rec);
      const bits = [];
      bits.push(attempt === void 0 ? "\u6B63\u5728\u91CD\u8BD5\u6A21\u578B\u8BF7\u6C42" : "\u7B2C " + formatCount(attempt) + " \u6B21\u5C1D\u8BD5");
      if (delay2 !== void 0) {
        bits.push(delay2 >= 1e3 ? formatCount(delay2 / 1e3) + " \u79D2\u540E\u91CD\u8BD5" : formatCount(delay2) + " \u6BEB\u79D2\u540E\u91CD\u8BD5");
      }
      if (reason !== void 0) bits.push(reason);
      return { icon: "\u21BB", title: "\u6A21\u578B\u91CD\u8BD5", text: bits.join(" \xB7 ") };
    }
    case "turn-process": {
      const text2 = readString(rec, "text") ?? readString(rec, "message") ?? readString(rec, "state");
      const step = readNumber(rec, "step") ?? readNumber(rec, "index");
      const bits = [];
      if (step !== void 0) bits.push("\u6B65\u9AA4 " + formatCount(step));
      if (text2 !== void 0) bits.push(text2);
      return { icon: "\u22EF", title: "\u5904\u7406\u8FC7\u7A0B", text: bits.length === 0 ? void 0 : bits.join(" \xB7 ") };
    }
    default:
      return { icon: "\xB7", title: kind === "" ? "\u672A\u77E5\u6D88\u606F" : kind };
  }
}
var LEGACY_KINDS = ["command", "compaction", "manual-compaction"];
function readLegacyCommand(value) {
  const rec = asRecord(value);
  const outcome = asRecord(rec?.["outcome"]);
  return {
    name: readString(rec, "name"),
    args: readString(rec, "args"),
    outcome: outcome === void 0 ? void 0 : { kind: readString(outcome, "kind"), text: readString(outcome, "text") }
  };
}
function readLegacyCompaction(value) {
  const rec = asRecord(value);
  return {
    summary: readString(rec, "summary"),
    itemCount: readNumber(rec, "shadowedItemCount"),
    tokenCount: readNumber(rec, "shadowedTokenCount")
  };
}
function readAssistantStatus(value) {
  return value === "running" || value === "settled" || value === "interrupted" ? value : void 0;
}
function collectText(blocks) {
  const parts = [];
  for (const block2 of blocks) {
    const rec = asRecord(block2);
    if (rec === void 0) continue;
    if (rec["kind"] !== "text") continue;
    const text2 = readString(rec, "text");
    if (text2 !== void 0) parts.push(text2);
  }
  return parts.join("\n\n");
}
function readToolRoot(value) {
  const rec = asRecord(value);
  return rec === void 0 ? void 0 : rec;
}
function toolStatusOf(root) {
  const hasError = root.isError === true || root.error !== void 0;
  if (hasError) return "error";
  const hasResult = root.content !== void 0;
  if (root.phase === "preparing") return "running";
  if (root.phase === "start" && !hasResult) return "running";
  return "done";
}
function isOneOf(list2, value) {
  return list2.includes(value);
}
function parseRow(kind, data) {
  if (kind === "turn-trigger") return { type: "hidden" };
  const rec = asRecord(data);
  if (rec === void 0) return { type: "unknown", kind, data };
  switch (kind) {
    case "user":
    case "steering":
      return { type: "user", kind, parts: splitUserContent(rec["content"]), time: readFiniteNumber(rec["time"]) };
    case "context":
      return { type: "context", text: readContextText(data), time: readFiniteNumber(rec["time"]) };
    case "assistant-step": {
      const blocks = Array.isArray(rec["blocks"]) ? rec["blocks"] : [];
      const status = readAssistantStatus(rec["status"]);
      return {
        type: "assistant",
        status,
        live: status === "running",
        blocks,
        time: readFiniteNumber(rec["time"]),
        copyText: collectText(blocks)
      };
    }
    case "tool-call": {
      const root = readToolRoot(rec["root"]);
      if (root === void 0) return { type: "unknown", kind, data };
      return { type: "tool", data, root, title: readString(asRecord(root), "name") ?? "", status: toolStatusOf(root) };
    }
    case "turn-tail": {
      const seq = readFiniteNumber(rec["seq"]);
      return {
        type: "turn-tail",
        seq,
        time: readFiniteNumber(rec["time"]),
        usage: formatTokenUsage(rec["tokenUsage"]),
        branchable: rec["branchUnavailable"] !== true && seq !== void 0
      };
    }
    default:
      if (isOneOf(NOTICE_KINDS, kind)) {
        return { type: "notice", kind, spec: noticeSpec(kind, data) };
      }
      if (isOneOf(LEGACY_KINDS, kind)) {
        if (kind === "command") return { type: "legacy", kind, data, command: readLegacyCommand(data) };
        if (kind === "compaction") return { type: "legacy", kind, data, compaction: readLegacyCompaction(data) };
        return {
          type: "legacy",
          kind,
          data,
          command: readLegacyCommand(rec["command"]),
          compaction: readLegacyCompaction(rec["compaction"])
        };
      }
      return { type: "unknown", kind, data };
  }
}

// src/client/chat-a2ui/AssistantBlocks.tsx
var import_react29 = require("react");

// src/client/chat-a2ui/Markdown.tsx
var import_react25 = require("react");

// node_modules/marked/lib/marked.esm.js
function _getDefaults() {
  return {
    async: false,
    breaks: false,
    extensions: null,
    gfm: true,
    hooks: null,
    pedantic: false,
    renderer: null,
    silent: false,
    tokenizer: null,
    walkTokens: null
  };
}
var _defaults = _getDefaults();
function changeDefaults(newDefaults) {
  _defaults = newDefaults;
}
var noopTest = { exec: () => null };
function edit(regex, opt = "") {
  let source = typeof regex === "string" ? regex : regex.source;
  const obj = {
    replace: (name, val) => {
      let valSource = typeof val === "string" ? val : val.source;
      valSource = valSource.replace(other.caret, "$1");
      source = source.replace(name, valSource);
      return obj;
    },
    getRegex: () => {
      return new RegExp(source, opt);
    }
  };
  return obj;
}
var other = {
  codeRemoveIndent: /^(?: {1,4}| {0,3}\t)/gm,
  outputLinkReplace: /\\([\[\]])/g,
  indentCodeCompensation: /^(\s+)(?:```)/,
  beginningSpace: /^\s+/,
  endingHash: /#$/,
  startingSpaceChar: /^ /,
  endingSpaceChar: / $/,
  nonSpaceChar: /[^ ]/,
  newLineCharGlobal: /\n/g,
  tabCharGlobal: /\t/g,
  multipleSpaceGlobal: /\s+/g,
  blankLine: /^[ \t]*$/,
  doubleBlankLine: /\n[ \t]*\n[ \t]*$/,
  blockquoteStart: /^ {0,3}>/,
  blockquoteSetextReplace: /\n {0,3}((?:=+|-+) *)(?=\n|$)/g,
  blockquoteSetextReplace2: /^ {0,3}>[ \t]?/gm,
  listReplaceTabs: /^\t+/,
  listReplaceNesting: /^ {1,4}(?=( {4})*[^ ])/g,
  listIsTask: /^\[[ xX]\] /,
  listReplaceTask: /^\[[ xX]\] +/,
  anyLine: /\n.*\n/,
  hrefBrackets: /^<(.*)>$/,
  tableDelimiter: /[:|]/,
  tableAlignChars: /^\||\| *$/g,
  tableRowBlankLine: /\n[ \t]*$/,
  tableAlignRight: /^ *-+: *$/,
  tableAlignCenter: /^ *:-+: *$/,
  tableAlignLeft: /^ *:-+ *$/,
  startATag: /^<a /i,
  endATag: /^<\/a>/i,
  startPreScriptTag: /^<(pre|code|kbd|script)(\s|>)/i,
  endPreScriptTag: /^<\/(pre|code|kbd|script)(\s|>)/i,
  startAngleBracket: /^</,
  endAngleBracket: />$/,
  pedanticHrefTitle: /^([^'"]*[^\s])\s+(['"])(.*)\2/,
  unicodeAlphaNumeric: /[\p{L}\p{N}]/u,
  escapeTest: /[&<>"']/,
  escapeReplace: /[&<>"']/g,
  escapeTestNoEncode: /[<>"']|&(?!(#\d{1,7}|#[Xx][a-fA-F0-9]{1,6}|\w+);)/,
  escapeReplaceNoEncode: /[<>"']|&(?!(#\d{1,7}|#[Xx][a-fA-F0-9]{1,6}|\w+);)/g,
  unescapeTest: /&(#(?:\d+)|(?:#x[0-9A-Fa-f]+)|(?:\w+));?/ig,
  caret: /(^|[^\[])\^/g,
  percentDecode: /%25/g,
  findPipe: /\|/g,
  splitPipe: / \|/,
  slashPipe: /\\\|/g,
  carriageReturn: /\r\n|\r/g,
  spaceLine: /^ +$/gm,
  notSpaceStart: /^\S*/,
  endingNewline: /\n$/,
  listItemRegex: (bull) => new RegExp(`^( {0,3}${bull})((?:[	 ][^\\n]*)?(?:\\n|$))`),
  nextBulletRegex: (indent) => new RegExp(`^ {0,${Math.min(3, indent - 1)}}(?:[*+-]|\\d{1,9}[.)])((?:[ 	][^\\n]*)?(?:\\n|$))`),
  hrRegex: (indent) => new RegExp(`^ {0,${Math.min(3, indent - 1)}}((?:- *){3,}|(?:_ *){3,}|(?:\\* *){3,})(?:\\n+|$)`),
  fencesBeginRegex: (indent) => new RegExp(`^ {0,${Math.min(3, indent - 1)}}(?:\`\`\`|~~~)`),
  headingBeginRegex: (indent) => new RegExp(`^ {0,${Math.min(3, indent - 1)}}#`),
  htmlBeginRegex: (indent) => new RegExp(`^ {0,${Math.min(3, indent - 1)}}<(?:[a-z].*>|!--)`, "i")
};
var newline = /^(?:[ \t]*(?:\n|$))+/;
var blockCode = /^((?: {4}| {0,3}\t)[^\n]+(?:\n(?:[ \t]*(?:\n|$))*)?)+/;
var fences = /^ {0,3}(`{3,}(?=[^`\n]*(?:\n|$))|~{3,})([^\n]*)(?:\n|$)(?:|([\s\S]*?)(?:\n|$))(?: {0,3}\1[~`]* *(?=\n|$)|$)/;
var hr = /^ {0,3}((?:-[\t ]*){3,}|(?:_[ \t]*){3,}|(?:\*[ \t]*){3,})(?:\n+|$)/;
var heading = /^ {0,3}(#{1,6})(?=\s|$)(.*)(?:\n+|$)/;
var bullet = /(?:[*+-]|\d{1,9}[.)])/;
var lheadingCore = /^(?!bull |blockCode|fences|blockquote|heading|html|table)((?:.|\n(?!\s*?\n|bull |blockCode|fences|blockquote|heading|html|table))+?)\n {0,3}(=+|-+) *(?:\n+|$)/;
var lheading = edit(lheadingCore).replace(/bull/g, bullet).replace(/blockCode/g, /(?: {4}| {0,3}\t)/).replace(/fences/g, / {0,3}(?:`{3,}|~{3,})/).replace(/blockquote/g, / {0,3}>/).replace(/heading/g, / {0,3}#{1,6}/).replace(/html/g, / {0,3}<[^\n>]+>\n/).replace(/\|table/g, "").getRegex();
var lheadingGfm = edit(lheadingCore).replace(/bull/g, bullet).replace(/blockCode/g, /(?: {4}| {0,3}\t)/).replace(/fences/g, / {0,3}(?:`{3,}|~{3,})/).replace(/blockquote/g, / {0,3}>/).replace(/heading/g, / {0,3}#{1,6}/).replace(/html/g, / {0,3}<[^\n>]+>\n/).replace(/table/g, / {0,3}\|?(?:[:\- ]*\|)+[\:\- ]*\n/).getRegex();
var _paragraph = /^([^\n]+(?:\n(?!hr|heading|lheading|blockquote|fences|list|html|table| +\n)[^\n]+)*)/;
var blockText = /^[^\n]+/;
var _blockLabel = /(?!\s*\])(?:\\.|[^\[\]\\])+/;
var def = edit(/^ {0,3}\[(label)\]: *(?:\n[ \t]*)?([^<\s][^\s]*|<.*?>)(?:(?: +(?:\n[ \t]*)?| *\n[ \t]*)(title))? *(?:\n+|$)/).replace("label", _blockLabel).replace("title", /(?:"(?:\\"?|[^"\\])*"|'[^'\n]*(?:\n[^'\n]+)*\n?'|\([^()]*\))/).getRegex();
var list = edit(/^( {0,3}bull)([ \t][^\n]+?)?(?:\n|$)/).replace(/bull/g, bullet).getRegex();
var _tag = "address|article|aside|base|basefont|blockquote|body|caption|center|col|colgroup|dd|details|dialog|dir|div|dl|dt|fieldset|figcaption|figure|footer|form|frame|frameset|h[1-6]|head|header|hr|html|iframe|legend|li|link|main|menu|menuitem|meta|nav|noframes|ol|optgroup|option|p|param|search|section|summary|table|tbody|td|tfoot|th|thead|title|tr|track|ul";
var _comment = /<!--(?:-?>|[\s\S]*?(?:-->|$))/;
var html = edit(
  "^ {0,3}(?:<(script|pre|style|textarea)[\\s>][\\s\\S]*?(?:</\\1>[^\\n]*\\n+|$)|comment[^\\n]*(\\n+|$)|<\\?[\\s\\S]*?(?:\\?>\\n*|$)|<![A-Z][\\s\\S]*?(?:>\\n*|$)|<!\\[CDATA\\[[\\s\\S]*?(?:\\]\\]>\\n*|$)|</?(tag)(?: +|\\n|/?>)[\\s\\S]*?(?:(?:\\n[ 	]*)+\\n|$)|<(?!script|pre|style|textarea)([a-z][\\w-]*)(?:attribute)*? */?>(?=[ \\t]*(?:\\n|$))[\\s\\S]*?(?:(?:\\n[ 	]*)+\\n|$)|</(?!script|pre|style|textarea)[a-z][\\w-]*\\s*>(?=[ \\t]*(?:\\n|$))[\\s\\S]*?(?:(?:\\n[ 	]*)+\\n|$))",
  "i"
).replace("comment", _comment).replace("tag", _tag).replace("attribute", / +[a-zA-Z:_][\w.:-]*(?: *= *"[^"\n]*"| *= *'[^'\n]*'| *= *[^\s"'=<>`]+)?/).getRegex();
var paragraph = edit(_paragraph).replace("hr", hr).replace("heading", " {0,3}#{1,6}(?:\\s|$)").replace("|lheading", "").replace("|table", "").replace("blockquote", " {0,3}>").replace("fences", " {0,3}(?:`{3,}(?=[^`\\n]*\\n)|~{3,})[^\\n]*\\n").replace("list", " {0,3}(?:[*+-]|1[.)]) ").replace("html", "</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)").replace("tag", _tag).getRegex();
var blockquote = edit(/^( {0,3}> ?(paragraph|[^\n]*)(?:\n|$))+/).replace("paragraph", paragraph).getRegex();
var blockNormal = {
  blockquote,
  code: blockCode,
  def,
  fences,
  heading,
  hr,
  html,
  lheading,
  list,
  newline,
  paragraph,
  table: noopTest,
  text: blockText
};
var gfmTable = edit(
  "^ *([^\\n ].*)\\n {0,3}((?:\\| *)?:?-+:? *(?:\\| *:?-+:? *)*(?:\\| *)?)(?:\\n((?:(?! *\\n|hr|heading|blockquote|code|fences|list|html).*(?:\\n|$))*)\\n*|$)"
).replace("hr", hr).replace("heading", " {0,3}#{1,6}(?:\\s|$)").replace("blockquote", " {0,3}>").replace("code", "(?: {4}| {0,3}	)[^\\n]").replace("fences", " {0,3}(?:`{3,}(?=[^`\\n]*\\n)|~{3,})[^\\n]*\\n").replace("list", " {0,3}(?:[*+-]|1[.)]) ").replace("html", "</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)").replace("tag", _tag).getRegex();
var blockGfm = {
  ...blockNormal,
  lheading: lheadingGfm,
  table: gfmTable,
  paragraph: edit(_paragraph).replace("hr", hr).replace("heading", " {0,3}#{1,6}(?:\\s|$)").replace("|lheading", "").replace("table", gfmTable).replace("blockquote", " {0,3}>").replace("fences", " {0,3}(?:`{3,}(?=[^`\\n]*\\n)|~{3,})[^\\n]*\\n").replace("list", " {0,3}(?:[*+-]|1[.)]) ").replace("html", "</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)").replace("tag", _tag).getRegex()
};
var blockPedantic = {
  ...blockNormal,
  html: edit(
    `^ *(?:comment *(?:\\n|\\s*$)|<(tag)[\\s\\S]+?</\\1> *(?:\\n{2,}|\\s*$)|<tag(?:"[^"]*"|'[^']*'|\\s[^'"/>\\s]*)*?/?> *(?:\\n{2,}|\\s*$))`
  ).replace("comment", _comment).replace(/tag/g, "(?!(?:a|em|strong|small|s|cite|q|dfn|abbr|data|time|code|var|samp|kbd|sub|sup|i|b|u|mark|ruby|rt|rp|bdi|bdo|span|br|wbr|ins|del|img)\\b)\\w+(?!:|[^\\w\\s@]*@)\\b").getRegex(),
  def: /^ *\[([^\]]+)\]: *<?([^\s>]+)>?(?: +(["(][^\n]+[")]))? *(?:\n+|$)/,
  heading: /^(#{1,6})(.*)(?:\n+|$)/,
  fences: noopTest,
  // fences not supported
  lheading: /^(.+?)\n {0,3}(=+|-+) *(?:\n+|$)/,
  paragraph: edit(_paragraph).replace("hr", hr).replace("heading", " *#{1,6} *[^\n]").replace("lheading", lheading).replace("|table", "").replace("blockquote", " {0,3}>").replace("|fences", "").replace("|list", "").replace("|html", "").replace("|tag", "").getRegex()
};
var escape = /^\\([!"#$%&'()*+,\-./:;<=>?@\[\]\\^_`{|}~])/;
var inlineCode = /^(`+)([^`]|[^`][\s\S]*?[^`])\1(?!`)/;
var br = /^( {2,}|\\)\n(?!\s*$)/;
var inlineText = /^(`+|[^`])(?:(?= {2,}\n)|[\s\S]*?(?:(?=[\\<!\[`*_]|\b_|$)|[^ ](?= {2,}\n)))/;
var _punctuation = /[\p{P}\p{S}]/u;
var _punctuationOrSpace = /[\s\p{P}\p{S}]/u;
var _notPunctuationOrSpace = /[^\s\p{P}\p{S}]/u;
var punctuation = edit(/^((?![*_])punctSpace)/, "u").replace(/punctSpace/g, _punctuationOrSpace).getRegex();
var _punctuationGfmStrongEm = /(?!~)[\p{P}\p{S}]/u;
var _punctuationOrSpaceGfmStrongEm = /(?!~)[\s\p{P}\p{S}]/u;
var _notPunctuationOrSpaceGfmStrongEm = /(?:[^\s\p{P}\p{S}]|~)/u;
var blockSkip = /\[[^[\]]*?\]\((?:\\.|[^\\\(\)]|\((?:\\.|[^\\\(\)])*\))*\)|`[^`]*?`|<[^<>]*?>/g;
var emStrongLDelimCore = /^(?:\*+(?:((?!\*)punct)|[^\s*]))|^_+(?:((?!_)punct)|([^\s_]))/;
var emStrongLDelim = edit(emStrongLDelimCore, "u").replace(/punct/g, _punctuation).getRegex();
var emStrongLDelimGfm = edit(emStrongLDelimCore, "u").replace(/punct/g, _punctuationGfmStrongEm).getRegex();
var emStrongRDelimAstCore = "^[^_*]*?__[^_*]*?\\*[^_*]*?(?=__)|[^*]+(?=[^*])|(?!\\*)punct(\\*+)(?=[\\s]|$)|notPunctSpace(\\*+)(?!\\*)(?=punctSpace|$)|(?!\\*)punctSpace(\\*+)(?=notPunctSpace)|[\\s](\\*+)(?!\\*)(?=punct)|(?!\\*)punct(\\*+)(?!\\*)(?=punct)|notPunctSpace(\\*+)(?=notPunctSpace)";
var emStrongRDelimAst = edit(emStrongRDelimAstCore, "gu").replace(/notPunctSpace/g, _notPunctuationOrSpace).replace(/punctSpace/g, _punctuationOrSpace).replace(/punct/g, _punctuation).getRegex();
var emStrongRDelimAstGfm = edit(emStrongRDelimAstCore, "gu").replace(/notPunctSpace/g, _notPunctuationOrSpaceGfmStrongEm).replace(/punctSpace/g, _punctuationOrSpaceGfmStrongEm).replace(/punct/g, _punctuationGfmStrongEm).getRegex();
var emStrongRDelimUnd = edit(
  "^[^_*]*?\\*\\*[^_*]*?_[^_*]*?(?=\\*\\*)|[^_]+(?=[^_])|(?!_)punct(_+)(?=[\\s]|$)|notPunctSpace(_+)(?!_)(?=punctSpace|$)|(?!_)punctSpace(_+)(?=notPunctSpace)|[\\s](_+)(?!_)(?=punct)|(?!_)punct(_+)(?!_)(?=punct)",
  "gu"
).replace(/notPunctSpace/g, _notPunctuationOrSpace).replace(/punctSpace/g, _punctuationOrSpace).replace(/punct/g, _punctuation).getRegex();
var anyPunctuation = edit(/\\(punct)/, "gu").replace(/punct/g, _punctuation).getRegex();
var autolink = edit(/^<(scheme:[^\s\x00-\x1f<>]*|email)>/).replace("scheme", /[a-zA-Z][a-zA-Z0-9+.-]{1,31}/).replace("email", /[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+(@)[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+(?![-_])/).getRegex();
var _inlineComment = edit(_comment).replace("(?:-->|$)", "-->").getRegex();
var tag = edit(
  "^comment|^</[a-zA-Z][\\w:-]*\\s*>|^<[a-zA-Z][\\w-]*(?:attribute)*?\\s*/?>|^<\\?[\\s\\S]*?\\?>|^<![a-zA-Z]+\\s[\\s\\S]*?>|^<!\\[CDATA\\[[\\s\\S]*?\\]\\]>"
).replace("comment", _inlineComment).replace("attribute", /\s+[a-zA-Z:_][\w.:-]*(?:\s*=\s*"[^"]*"|\s*=\s*'[^']*'|\s*=\s*[^\s"'=<>`]+)?/).getRegex();
var _inlineLabel = /(?:\[(?:\\.|[^\[\]\\])*\]|\\.|`[^`]*`|[^\[\]\\`])*?/;
var link = edit(/^!?\[(label)\]\(\s*(href)(?:(?:[ \t]*(?:\n[ \t]*)?)(title))?\s*\)/).replace("label", _inlineLabel).replace("href", /<(?:\\.|[^\n<>\\])+>|[^ \t\n\x00-\x1f]*/).replace("title", /"(?:\\"?|[^"\\])*"|'(?:\\'?|[^'\\])*'|\((?:\\\)?|[^)\\])*\)/).getRegex();
var reflink = edit(/^!?\[(label)\]\[(ref)\]/).replace("label", _inlineLabel).replace("ref", _blockLabel).getRegex();
var nolink = edit(/^!?\[(ref)\](?:\[\])?/).replace("ref", _blockLabel).getRegex();
var reflinkSearch = edit("reflink|nolink(?!\\()", "g").replace("reflink", reflink).replace("nolink", nolink).getRegex();
var inlineNormal = {
  _backpedal: noopTest,
  // only used for GFM url
  anyPunctuation,
  autolink,
  blockSkip,
  br,
  code: inlineCode,
  del: noopTest,
  emStrongLDelim,
  emStrongRDelimAst,
  emStrongRDelimUnd,
  escape,
  link,
  nolink,
  punctuation,
  reflink,
  reflinkSearch,
  tag,
  text: inlineText,
  url: noopTest
};
var inlinePedantic = {
  ...inlineNormal,
  link: edit(/^!?\[(label)\]\((.*?)\)/).replace("label", _inlineLabel).getRegex(),
  reflink: edit(/^!?\[(label)\]\s*\[([^\]]*)\]/).replace("label", _inlineLabel).getRegex()
};
var inlineGfm = {
  ...inlineNormal,
  emStrongRDelimAst: emStrongRDelimAstGfm,
  emStrongLDelim: emStrongLDelimGfm,
  url: edit(/^((?:ftp|https?):\/\/|www\.)(?:[a-zA-Z0-9\-]+\.?)+[^\s<]*|^email/, "i").replace("email", /[A-Za-z0-9._+-]+(@)[a-zA-Z0-9-_]+(?:\.[a-zA-Z0-9-_]*[a-zA-Z0-9])+(?![-_])/).getRegex(),
  _backpedal: /(?:[^?!.,:;*_'"~()&]+|\([^)]*\)|&(?![a-zA-Z0-9]+;$)|[?!.,:;*_'"~)]+(?!$))+/,
  del: /^(~~?)(?=[^\s~])((?:\\.|[^\\])*?(?:\\.|[^\s~\\]))\1(?=[^~]|$)/,
  text: /^([`~]+|[^`~])(?:(?= {2,}\n)|(?=[a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-]+@)|[\s\S]*?(?:(?=[\\<!\[`*~_]|\b_|https?:\/\/|ftp:\/\/|www\.|$)|[^ ](?= {2,}\n)|[^a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-](?=[a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-]+@)))/
};
var inlineBreaks = {
  ...inlineGfm,
  br: edit(br).replace("{2,}", "*").getRegex(),
  text: edit(inlineGfm.text).replace("\\b_", "\\b_| {2,}\\n").replace(/\{2,\}/g, "*").getRegex()
};
var block = {
  normal: blockNormal,
  gfm: blockGfm,
  pedantic: blockPedantic
};
var inline = {
  normal: inlineNormal,
  gfm: inlineGfm,
  breaks: inlineBreaks,
  pedantic: inlinePedantic
};
var escapeReplacements = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&#39;"
};
var getEscapeReplacement = (ch) => escapeReplacements[ch];
function escape2(html22, encode) {
  if (encode) {
    if (other.escapeTest.test(html22)) {
      return html22.replace(other.escapeReplace, getEscapeReplacement);
    }
  } else {
    if (other.escapeTestNoEncode.test(html22)) {
      return html22.replace(other.escapeReplaceNoEncode, getEscapeReplacement);
    }
  }
  return html22;
}
function cleanUrl(href) {
  try {
    href = encodeURI(href).replace(other.percentDecode, "%");
  } catch {
    return null;
  }
  return href;
}
function splitCells(tableRow, count) {
  const row = tableRow.replace(other.findPipe, (match, offset, str) => {
    let escaped = false;
    let curr = offset;
    while (--curr >= 0 && str[curr] === "\\") escaped = !escaped;
    if (escaped) {
      return "|";
    } else {
      return " |";
    }
  }), cells = row.split(other.splitPipe);
  let i = 0;
  if (!cells[0].trim()) {
    cells.shift();
  }
  if (cells.length > 0 && !cells.at(-1)?.trim()) {
    cells.pop();
  }
  if (count) {
    if (cells.length > count) {
      cells.splice(count);
    } else {
      while (cells.length < count) cells.push("");
    }
  }
  for (; i < cells.length; i++) {
    cells[i] = cells[i].trim().replace(other.slashPipe, "|");
  }
  return cells;
}
function rtrim(str, c, invert) {
  const l = str.length;
  if (l === 0) {
    return "";
  }
  let suffLen = 0;
  while (suffLen < l) {
    const currChar = str.charAt(l - suffLen - 1);
    if (currChar === c && !invert) {
      suffLen++;
    } else if (currChar !== c && invert) {
      suffLen++;
    } else {
      break;
    }
  }
  return str.slice(0, l - suffLen);
}
function findClosingBracket(str, b) {
  if (str.indexOf(b[1]) === -1) {
    return -1;
  }
  let level = 0;
  for (let i = 0; i < str.length; i++) {
    if (str[i] === "\\") {
      i++;
    } else if (str[i] === b[0]) {
      level++;
    } else if (str[i] === b[1]) {
      level--;
      if (level < 0) {
        return i;
      }
    }
  }
  if (level > 0) {
    return -2;
  }
  return -1;
}
function outputLink(cap, link2, raw, lexer2, rules) {
  const href = link2.href;
  const title = link2.title || null;
  const text2 = cap[1].replace(rules.other.outputLinkReplace, "$1");
  lexer2.state.inLink = true;
  const token = {
    type: cap[0].charAt(0) === "!" ? "image" : "link",
    raw,
    href,
    title,
    text: text2,
    tokens: lexer2.inlineTokens(text2)
  };
  lexer2.state.inLink = false;
  return token;
}
function indentCodeCompensation(raw, text2, rules) {
  const matchIndentToCode = raw.match(rules.other.indentCodeCompensation);
  if (matchIndentToCode === null) {
    return text2;
  }
  const indentToCode = matchIndentToCode[1];
  return text2.split("\n").map((node) => {
    const matchIndentInNode = node.match(rules.other.beginningSpace);
    if (matchIndentInNode === null) {
      return node;
    }
    const [indentInNode] = matchIndentInNode;
    if (indentInNode.length >= indentToCode.length) {
      return node.slice(indentToCode.length);
    }
    return node;
  }).join("\n");
}
var _Tokenizer = class {
  options;
  rules;
  // set by the lexer
  lexer;
  // set by the lexer
  constructor(options2) {
    this.options = options2 || _defaults;
  }
  space(src) {
    const cap = this.rules.block.newline.exec(src);
    if (cap && cap[0].length > 0) {
      return {
        type: "space",
        raw: cap[0]
      };
    }
  }
  code(src) {
    const cap = this.rules.block.code.exec(src);
    if (cap) {
      const text2 = cap[0].replace(this.rules.other.codeRemoveIndent, "");
      return {
        type: "code",
        raw: cap[0],
        codeBlockStyle: "indented",
        text: !this.options.pedantic ? rtrim(text2, "\n") : text2
      };
    }
  }
  fences(src) {
    const cap = this.rules.block.fences.exec(src);
    if (cap) {
      const raw = cap[0];
      const text2 = indentCodeCompensation(raw, cap[3] || "", this.rules);
      return {
        type: "code",
        raw,
        lang: cap[2] ? cap[2].trim().replace(this.rules.inline.anyPunctuation, "$1") : cap[2],
        text: text2
      };
    }
  }
  heading(src) {
    const cap = this.rules.block.heading.exec(src);
    if (cap) {
      let text2 = cap[2].trim();
      if (this.rules.other.endingHash.test(text2)) {
        const trimmed = rtrim(text2, "#");
        if (this.options.pedantic) {
          text2 = trimmed.trim();
        } else if (!trimmed || this.rules.other.endingSpaceChar.test(trimmed)) {
          text2 = trimmed.trim();
        }
      }
      return {
        type: "heading",
        raw: cap[0],
        depth: cap[1].length,
        text: text2,
        tokens: this.lexer.inline(text2)
      };
    }
  }
  hr(src) {
    const cap = this.rules.block.hr.exec(src);
    if (cap) {
      return {
        type: "hr",
        raw: rtrim(cap[0], "\n")
      };
    }
  }
  blockquote(src) {
    const cap = this.rules.block.blockquote.exec(src);
    if (cap) {
      let lines = rtrim(cap[0], "\n").split("\n");
      let raw = "";
      let text2 = "";
      const tokens = [];
      while (lines.length > 0) {
        let inBlockquote = false;
        const currentLines = [];
        let i;
        for (i = 0; i < lines.length; i++) {
          if (this.rules.other.blockquoteStart.test(lines[i])) {
            currentLines.push(lines[i]);
            inBlockquote = true;
          } else if (!inBlockquote) {
            currentLines.push(lines[i]);
          } else {
            break;
          }
        }
        lines = lines.slice(i);
        const currentRaw = currentLines.join("\n");
        const currentText = currentRaw.replace(this.rules.other.blockquoteSetextReplace, "\n    $1").replace(this.rules.other.blockquoteSetextReplace2, "");
        raw = raw ? `${raw}
${currentRaw}` : currentRaw;
        text2 = text2 ? `${text2}
${currentText}` : currentText;
        const top = this.lexer.state.top;
        this.lexer.state.top = true;
        this.lexer.blockTokens(currentText, tokens, true);
        this.lexer.state.top = top;
        if (lines.length === 0) {
          break;
        }
        const lastToken = tokens.at(-1);
        if (lastToken?.type === "code") {
          break;
        } else if (lastToken?.type === "blockquote") {
          const oldToken = lastToken;
          const newText = oldToken.raw + "\n" + lines.join("\n");
          const newToken = this.blockquote(newText);
          tokens[tokens.length - 1] = newToken;
          raw = raw.substring(0, raw.length - oldToken.raw.length) + newToken.raw;
          text2 = text2.substring(0, text2.length - oldToken.text.length) + newToken.text;
          break;
        } else if (lastToken?.type === "list") {
          const oldToken = lastToken;
          const newText = oldToken.raw + "\n" + lines.join("\n");
          const newToken = this.list(newText);
          tokens[tokens.length - 1] = newToken;
          raw = raw.substring(0, raw.length - lastToken.raw.length) + newToken.raw;
          text2 = text2.substring(0, text2.length - oldToken.raw.length) + newToken.raw;
          lines = newText.substring(tokens.at(-1).raw.length).split("\n");
          continue;
        }
      }
      return {
        type: "blockquote",
        raw,
        tokens,
        text: text2
      };
    }
  }
  list(src) {
    let cap = this.rules.block.list.exec(src);
    if (cap) {
      let bull = cap[1].trim();
      const isordered = bull.length > 1;
      const list2 = {
        type: "list",
        raw: "",
        ordered: isordered,
        start: isordered ? +bull.slice(0, -1) : "",
        loose: false,
        items: []
      };
      bull = isordered ? `\\d{1,9}\\${bull.slice(-1)}` : `\\${bull}`;
      if (this.options.pedantic) {
        bull = isordered ? bull : "[*+-]";
      }
      const itemRegex = this.rules.other.listItemRegex(bull);
      let endsWithBlankLine = false;
      while (src) {
        let endEarly = false;
        let raw = "";
        let itemContents = "";
        if (!(cap = itemRegex.exec(src))) {
          break;
        }
        if (this.rules.block.hr.test(src)) {
          break;
        }
        raw = cap[0];
        src = src.substring(raw.length);
        let line = cap[2].split("\n", 1)[0].replace(this.rules.other.listReplaceTabs, (t) => " ".repeat(3 * t.length));
        let nextLine = src.split("\n", 1)[0];
        let blankLine = !line.trim();
        let indent = 0;
        if (this.options.pedantic) {
          indent = 2;
          itemContents = line.trimStart();
        } else if (blankLine) {
          indent = cap[1].length + 1;
        } else {
          indent = cap[2].search(this.rules.other.nonSpaceChar);
          indent = indent > 4 ? 1 : indent;
          itemContents = line.slice(indent);
          indent += cap[1].length;
        }
        if (blankLine && this.rules.other.blankLine.test(nextLine)) {
          raw += nextLine + "\n";
          src = src.substring(nextLine.length + 1);
          endEarly = true;
        }
        if (!endEarly) {
          const nextBulletRegex = this.rules.other.nextBulletRegex(indent);
          const hrRegex = this.rules.other.hrRegex(indent);
          const fencesBeginRegex = this.rules.other.fencesBeginRegex(indent);
          const headingBeginRegex = this.rules.other.headingBeginRegex(indent);
          const htmlBeginRegex = this.rules.other.htmlBeginRegex(indent);
          while (src) {
            const rawLine = src.split("\n", 1)[0];
            let nextLineWithoutTabs;
            nextLine = rawLine;
            if (this.options.pedantic) {
              nextLine = nextLine.replace(this.rules.other.listReplaceNesting, "  ");
              nextLineWithoutTabs = nextLine;
            } else {
              nextLineWithoutTabs = nextLine.replace(this.rules.other.tabCharGlobal, "    ");
            }
            if (fencesBeginRegex.test(nextLine)) {
              break;
            }
            if (headingBeginRegex.test(nextLine)) {
              break;
            }
            if (htmlBeginRegex.test(nextLine)) {
              break;
            }
            if (nextBulletRegex.test(nextLine)) {
              break;
            }
            if (hrRegex.test(nextLine)) {
              break;
            }
            if (nextLineWithoutTabs.search(this.rules.other.nonSpaceChar) >= indent || !nextLine.trim()) {
              itemContents += "\n" + nextLineWithoutTabs.slice(indent);
            } else {
              if (blankLine) {
                break;
              }
              if (line.replace(this.rules.other.tabCharGlobal, "    ").search(this.rules.other.nonSpaceChar) >= 4) {
                break;
              }
              if (fencesBeginRegex.test(line)) {
                break;
              }
              if (headingBeginRegex.test(line)) {
                break;
              }
              if (hrRegex.test(line)) {
                break;
              }
              itemContents += "\n" + nextLine;
            }
            if (!blankLine && !nextLine.trim()) {
              blankLine = true;
            }
            raw += rawLine + "\n";
            src = src.substring(rawLine.length + 1);
            line = nextLineWithoutTabs.slice(indent);
          }
        }
        if (!list2.loose) {
          if (endsWithBlankLine) {
            list2.loose = true;
          } else if (this.rules.other.doubleBlankLine.test(raw)) {
            endsWithBlankLine = true;
          }
        }
        let istask = null;
        let ischecked;
        if (this.options.gfm) {
          istask = this.rules.other.listIsTask.exec(itemContents);
          if (istask) {
            ischecked = istask[0] !== "[ ] ";
            itemContents = itemContents.replace(this.rules.other.listReplaceTask, "");
          }
        }
        list2.items.push({
          type: "list_item",
          raw,
          task: !!istask,
          checked: ischecked,
          loose: false,
          text: itemContents,
          tokens: []
        });
        list2.raw += raw;
      }
      const lastItem = list2.items.at(-1);
      if (lastItem) {
        lastItem.raw = lastItem.raw.trimEnd();
        lastItem.text = lastItem.text.trimEnd();
      } else {
        return;
      }
      list2.raw = list2.raw.trimEnd();
      for (let i = 0; i < list2.items.length; i++) {
        this.lexer.state.top = false;
        list2.items[i].tokens = this.lexer.blockTokens(list2.items[i].text, []);
        if (!list2.loose) {
          const spacers = list2.items[i].tokens.filter((t) => t.type === "space");
          const hasMultipleLineBreaks = spacers.length > 0 && spacers.some((t) => this.rules.other.anyLine.test(t.raw));
          list2.loose = hasMultipleLineBreaks;
        }
      }
      if (list2.loose) {
        for (let i = 0; i < list2.items.length; i++) {
          list2.items[i].loose = true;
        }
      }
      return list2;
    }
  }
  html(src) {
    const cap = this.rules.block.html.exec(src);
    if (cap) {
      const token = {
        type: "html",
        block: true,
        raw: cap[0],
        pre: cap[1] === "pre" || cap[1] === "script" || cap[1] === "style",
        text: cap[0]
      };
      return token;
    }
  }
  def(src) {
    const cap = this.rules.block.def.exec(src);
    if (cap) {
      const tag2 = cap[1].toLowerCase().replace(this.rules.other.multipleSpaceGlobal, " ");
      const href = cap[2] ? cap[2].replace(this.rules.other.hrefBrackets, "$1").replace(this.rules.inline.anyPunctuation, "$1") : "";
      const title = cap[3] ? cap[3].substring(1, cap[3].length - 1).replace(this.rules.inline.anyPunctuation, "$1") : cap[3];
      return {
        type: "def",
        tag: tag2,
        raw: cap[0],
        href,
        title
      };
    }
  }
  table(src) {
    const cap = this.rules.block.table.exec(src);
    if (!cap) {
      return;
    }
    if (!this.rules.other.tableDelimiter.test(cap[2])) {
      return;
    }
    const headers = splitCells(cap[1]);
    const aligns = cap[2].replace(this.rules.other.tableAlignChars, "").split("|");
    const rows = cap[3]?.trim() ? cap[3].replace(this.rules.other.tableRowBlankLine, "").split("\n") : [];
    const item = {
      type: "table",
      raw: cap[0],
      header: [],
      align: [],
      rows: []
    };
    if (headers.length !== aligns.length) {
      return;
    }
    for (const align of aligns) {
      if (this.rules.other.tableAlignRight.test(align)) {
        item.align.push("right");
      } else if (this.rules.other.tableAlignCenter.test(align)) {
        item.align.push("center");
      } else if (this.rules.other.tableAlignLeft.test(align)) {
        item.align.push("left");
      } else {
        item.align.push(null);
      }
    }
    for (let i = 0; i < headers.length; i++) {
      item.header.push({
        text: headers[i],
        tokens: this.lexer.inline(headers[i]),
        header: true,
        align: item.align[i]
      });
    }
    for (const row of rows) {
      item.rows.push(splitCells(row, item.header.length).map((cell, i) => {
        return {
          text: cell,
          tokens: this.lexer.inline(cell),
          header: false,
          align: item.align[i]
        };
      }));
    }
    return item;
  }
  lheading(src) {
    const cap = this.rules.block.lheading.exec(src);
    if (cap) {
      return {
        type: "heading",
        raw: cap[0],
        depth: cap[2].charAt(0) === "=" ? 1 : 2,
        text: cap[1],
        tokens: this.lexer.inline(cap[1])
      };
    }
  }
  paragraph(src) {
    const cap = this.rules.block.paragraph.exec(src);
    if (cap) {
      const text2 = cap[1].charAt(cap[1].length - 1) === "\n" ? cap[1].slice(0, -1) : cap[1];
      return {
        type: "paragraph",
        raw: cap[0],
        text: text2,
        tokens: this.lexer.inline(text2)
      };
    }
  }
  text(src) {
    const cap = this.rules.block.text.exec(src);
    if (cap) {
      return {
        type: "text",
        raw: cap[0],
        text: cap[0],
        tokens: this.lexer.inline(cap[0])
      };
    }
  }
  escape(src) {
    const cap = this.rules.inline.escape.exec(src);
    if (cap) {
      return {
        type: "escape",
        raw: cap[0],
        text: cap[1]
      };
    }
  }
  tag(src) {
    const cap = this.rules.inline.tag.exec(src);
    if (cap) {
      if (!this.lexer.state.inLink && this.rules.other.startATag.test(cap[0])) {
        this.lexer.state.inLink = true;
      } else if (this.lexer.state.inLink && this.rules.other.endATag.test(cap[0])) {
        this.lexer.state.inLink = false;
      }
      if (!this.lexer.state.inRawBlock && this.rules.other.startPreScriptTag.test(cap[0])) {
        this.lexer.state.inRawBlock = true;
      } else if (this.lexer.state.inRawBlock && this.rules.other.endPreScriptTag.test(cap[0])) {
        this.lexer.state.inRawBlock = false;
      }
      return {
        type: "html",
        raw: cap[0],
        inLink: this.lexer.state.inLink,
        inRawBlock: this.lexer.state.inRawBlock,
        block: false,
        text: cap[0]
      };
    }
  }
  link(src) {
    const cap = this.rules.inline.link.exec(src);
    if (cap) {
      const trimmedUrl = cap[2].trim();
      if (!this.options.pedantic && this.rules.other.startAngleBracket.test(trimmedUrl)) {
        if (!this.rules.other.endAngleBracket.test(trimmedUrl)) {
          return;
        }
        const rtrimSlash = rtrim(trimmedUrl.slice(0, -1), "\\");
        if ((trimmedUrl.length - rtrimSlash.length) % 2 === 0) {
          return;
        }
      } else {
        const lastParenIndex = findClosingBracket(cap[2], "()");
        if (lastParenIndex === -2) {
          return;
        }
        if (lastParenIndex > -1) {
          const start = cap[0].indexOf("!") === 0 ? 5 : 4;
          const linkLen = start + cap[1].length + lastParenIndex;
          cap[2] = cap[2].substring(0, lastParenIndex);
          cap[0] = cap[0].substring(0, linkLen).trim();
          cap[3] = "";
        }
      }
      let href = cap[2];
      let title = "";
      if (this.options.pedantic) {
        const link2 = this.rules.other.pedanticHrefTitle.exec(href);
        if (link2) {
          href = link2[1];
          title = link2[3];
        }
      } else {
        title = cap[3] ? cap[3].slice(1, -1) : "";
      }
      href = href.trim();
      if (this.rules.other.startAngleBracket.test(href)) {
        if (this.options.pedantic && !this.rules.other.endAngleBracket.test(trimmedUrl)) {
          href = href.slice(1);
        } else {
          href = href.slice(1, -1);
        }
      }
      return outputLink(cap, {
        href: href ? href.replace(this.rules.inline.anyPunctuation, "$1") : href,
        title: title ? title.replace(this.rules.inline.anyPunctuation, "$1") : title
      }, cap[0], this.lexer, this.rules);
    }
  }
  reflink(src, links) {
    let cap;
    if ((cap = this.rules.inline.reflink.exec(src)) || (cap = this.rules.inline.nolink.exec(src))) {
      const linkString = (cap[2] || cap[1]).replace(this.rules.other.multipleSpaceGlobal, " ");
      const link2 = links[linkString.toLowerCase()];
      if (!link2) {
        const text2 = cap[0].charAt(0);
        return {
          type: "text",
          raw: text2,
          text: text2
        };
      }
      return outputLink(cap, link2, cap[0], this.lexer, this.rules);
    }
  }
  emStrong(src, maskedSrc, prevChar = "") {
    let match = this.rules.inline.emStrongLDelim.exec(src);
    if (!match) return;
    if (match[3] && prevChar.match(this.rules.other.unicodeAlphaNumeric)) return;
    const nextChar = match[1] || match[2] || "";
    if (!nextChar || !prevChar || this.rules.inline.punctuation.exec(prevChar)) {
      const lLength = [...match[0]].length - 1;
      let rDelim, rLength, delimTotal = lLength, midDelimTotal = 0;
      const endReg = match[0][0] === "*" ? this.rules.inline.emStrongRDelimAst : this.rules.inline.emStrongRDelimUnd;
      endReg.lastIndex = 0;
      maskedSrc = maskedSrc.slice(-1 * src.length + lLength);
      while ((match = endReg.exec(maskedSrc)) != null) {
        rDelim = match[1] || match[2] || match[3] || match[4] || match[5] || match[6];
        if (!rDelim) continue;
        rLength = [...rDelim].length;
        if (match[3] || match[4]) {
          delimTotal += rLength;
          continue;
        } else if (match[5] || match[6]) {
          if (lLength % 3 && !((lLength + rLength) % 3)) {
            midDelimTotal += rLength;
            continue;
          }
        }
        delimTotal -= rLength;
        if (delimTotal > 0) continue;
        rLength = Math.min(rLength, rLength + delimTotal + midDelimTotal);
        const lastCharLength = [...match[0]][0].length;
        const raw = src.slice(0, lLength + match.index + lastCharLength + rLength);
        if (Math.min(lLength, rLength) % 2) {
          const text22 = raw.slice(1, -1);
          return {
            type: "em",
            raw,
            text: text22,
            tokens: this.lexer.inlineTokens(text22)
          };
        }
        const text2 = raw.slice(2, -2);
        return {
          type: "strong",
          raw,
          text: text2,
          tokens: this.lexer.inlineTokens(text2)
        };
      }
    }
  }
  codespan(src) {
    const cap = this.rules.inline.code.exec(src);
    if (cap) {
      let text2 = cap[2].replace(this.rules.other.newLineCharGlobal, " ");
      const hasNonSpaceChars = this.rules.other.nonSpaceChar.test(text2);
      const hasSpaceCharsOnBothEnds = this.rules.other.startingSpaceChar.test(text2) && this.rules.other.endingSpaceChar.test(text2);
      if (hasNonSpaceChars && hasSpaceCharsOnBothEnds) {
        text2 = text2.substring(1, text2.length - 1);
      }
      return {
        type: "codespan",
        raw: cap[0],
        text: text2
      };
    }
  }
  br(src) {
    const cap = this.rules.inline.br.exec(src);
    if (cap) {
      return {
        type: "br",
        raw: cap[0]
      };
    }
  }
  del(src) {
    const cap = this.rules.inline.del.exec(src);
    if (cap) {
      return {
        type: "del",
        raw: cap[0],
        text: cap[2],
        tokens: this.lexer.inlineTokens(cap[2])
      };
    }
  }
  autolink(src) {
    const cap = this.rules.inline.autolink.exec(src);
    if (cap) {
      let text2, href;
      if (cap[2] === "@") {
        text2 = cap[1];
        href = "mailto:" + text2;
      } else {
        text2 = cap[1];
        href = text2;
      }
      return {
        type: "link",
        raw: cap[0],
        text: text2,
        href,
        tokens: [
          {
            type: "text",
            raw: text2,
            text: text2
          }
        ]
      };
    }
  }
  url(src) {
    let cap;
    if (cap = this.rules.inline.url.exec(src)) {
      let text2, href;
      if (cap[2] === "@") {
        text2 = cap[0];
        href = "mailto:" + text2;
      } else {
        let prevCapZero;
        do {
          prevCapZero = cap[0];
          cap[0] = this.rules.inline._backpedal.exec(cap[0])?.[0] ?? "";
        } while (prevCapZero !== cap[0]);
        text2 = cap[0];
        if (cap[1] === "www.") {
          href = "http://" + cap[0];
        } else {
          href = cap[0];
        }
      }
      return {
        type: "link",
        raw: cap[0],
        text: text2,
        href,
        tokens: [
          {
            type: "text",
            raw: text2,
            text: text2
          }
        ]
      };
    }
  }
  inlineText(src) {
    const cap = this.rules.inline.text.exec(src);
    if (cap) {
      const escaped = this.lexer.state.inRawBlock;
      return {
        type: "text",
        raw: cap[0],
        text: cap[0],
        escaped
      };
    }
  }
};
var _Lexer = class __Lexer {
  tokens;
  options;
  state;
  tokenizer;
  inlineQueue;
  constructor(options2) {
    this.tokens = [];
    this.tokens.links = /* @__PURE__ */ Object.create(null);
    this.options = options2 || _defaults;
    this.options.tokenizer = this.options.tokenizer || new _Tokenizer();
    this.tokenizer = this.options.tokenizer;
    this.tokenizer.options = this.options;
    this.tokenizer.lexer = this;
    this.inlineQueue = [];
    this.state = {
      inLink: false,
      inRawBlock: false,
      top: true
    };
    const rules = {
      other,
      block: block.normal,
      inline: inline.normal
    };
    if (this.options.pedantic) {
      rules.block = block.pedantic;
      rules.inline = inline.pedantic;
    } else if (this.options.gfm) {
      rules.block = block.gfm;
      if (this.options.breaks) {
        rules.inline = inline.breaks;
      } else {
        rules.inline = inline.gfm;
      }
    }
    this.tokenizer.rules = rules;
  }
  /**
   * Expose Rules
   */
  static get rules() {
    return {
      block,
      inline
    };
  }
  /**
   * Static Lex Method
   */
  static lex(src, options2) {
    const lexer2 = new __Lexer(options2);
    return lexer2.lex(src);
  }
  /**
   * Static Lex Inline Method
   */
  static lexInline(src, options2) {
    const lexer2 = new __Lexer(options2);
    return lexer2.inlineTokens(src);
  }
  /**
   * Preprocessing
   */
  lex(src) {
    src = src.replace(other.carriageReturn, "\n");
    this.blockTokens(src, this.tokens);
    for (let i = 0; i < this.inlineQueue.length; i++) {
      const next = this.inlineQueue[i];
      this.inlineTokens(next.src, next.tokens);
    }
    this.inlineQueue = [];
    return this.tokens;
  }
  blockTokens(src, tokens = [], lastParagraphClipped = false) {
    if (this.options.pedantic) {
      src = src.replace(other.tabCharGlobal, "    ").replace(other.spaceLine, "");
    }
    while (src) {
      let token;
      if (this.options.extensions?.block?.some((extTokenizer) => {
        if (token = extTokenizer.call({ lexer: this }, src, tokens)) {
          src = src.substring(token.raw.length);
          tokens.push(token);
          return true;
        }
        return false;
      })) {
        continue;
      }
      if (token = this.tokenizer.space(src)) {
        src = src.substring(token.raw.length);
        const lastToken = tokens.at(-1);
        if (token.raw.length === 1 && lastToken !== void 0) {
          lastToken.raw += "\n";
        } else {
          tokens.push(token);
        }
        continue;
      }
      if (token = this.tokenizer.code(src)) {
        src = src.substring(token.raw.length);
        const lastToken = tokens.at(-1);
        if (lastToken?.type === "paragraph" || lastToken?.type === "text") {
          lastToken.raw += "\n" + token.raw;
          lastToken.text += "\n" + token.text;
          this.inlineQueue.at(-1).src = lastToken.text;
        } else {
          tokens.push(token);
        }
        continue;
      }
      if (token = this.tokenizer.fences(src)) {
        src = src.substring(token.raw.length);
        tokens.push(token);
        continue;
      }
      if (token = this.tokenizer.heading(src)) {
        src = src.substring(token.raw.length);
        tokens.push(token);
        continue;
      }
      if (token = this.tokenizer.hr(src)) {
        src = src.substring(token.raw.length);
        tokens.push(token);
        continue;
      }
      if (token = this.tokenizer.blockquote(src)) {
        src = src.substring(token.raw.length);
        tokens.push(token);
        continue;
      }
      if (token = this.tokenizer.list(src)) {
        src = src.substring(token.raw.length);
        tokens.push(token);
        continue;
      }
      if (token = this.tokenizer.html(src)) {
        src = src.substring(token.raw.length);
        tokens.push(token);
        continue;
      }
      if (token = this.tokenizer.def(src)) {
        src = src.substring(token.raw.length);
        const lastToken = tokens.at(-1);
        if (lastToken?.type === "paragraph" || lastToken?.type === "text") {
          lastToken.raw += "\n" + token.raw;
          lastToken.text += "\n" + token.raw;
          this.inlineQueue.at(-1).src = lastToken.text;
        } else if (!this.tokens.links[token.tag]) {
          this.tokens.links[token.tag] = {
            href: token.href,
            title: token.title
          };
        }
        continue;
      }
      if (token = this.tokenizer.table(src)) {
        src = src.substring(token.raw.length);
        tokens.push(token);
        continue;
      }
      if (token = this.tokenizer.lheading(src)) {
        src = src.substring(token.raw.length);
        tokens.push(token);
        continue;
      }
      let cutSrc = src;
      if (this.options.extensions?.startBlock) {
        let startIndex = Infinity;
        const tempSrc = src.slice(1);
        let tempStart;
        this.options.extensions.startBlock.forEach((getStartIndex) => {
          tempStart = getStartIndex.call({ lexer: this }, tempSrc);
          if (typeof tempStart === "number" && tempStart >= 0) {
            startIndex = Math.min(startIndex, tempStart);
          }
        });
        if (startIndex < Infinity && startIndex >= 0) {
          cutSrc = src.substring(0, startIndex + 1);
        }
      }
      if (this.state.top && (token = this.tokenizer.paragraph(cutSrc))) {
        const lastToken = tokens.at(-1);
        if (lastParagraphClipped && lastToken?.type === "paragraph") {
          lastToken.raw += "\n" + token.raw;
          lastToken.text += "\n" + token.text;
          this.inlineQueue.pop();
          this.inlineQueue.at(-1).src = lastToken.text;
        } else {
          tokens.push(token);
        }
        lastParagraphClipped = cutSrc.length !== src.length;
        src = src.substring(token.raw.length);
        continue;
      }
      if (token = this.tokenizer.text(src)) {
        src = src.substring(token.raw.length);
        const lastToken = tokens.at(-1);
        if (lastToken?.type === "text") {
          lastToken.raw += "\n" + token.raw;
          lastToken.text += "\n" + token.text;
          this.inlineQueue.pop();
          this.inlineQueue.at(-1).src = lastToken.text;
        } else {
          tokens.push(token);
        }
        continue;
      }
      if (src) {
        const errMsg = "Infinite loop on byte: " + src.charCodeAt(0);
        if (this.options.silent) {
          console.error(errMsg);
          break;
        } else {
          throw new Error(errMsg);
        }
      }
    }
    this.state.top = true;
    return tokens;
  }
  inline(src, tokens = []) {
    this.inlineQueue.push({ src, tokens });
    return tokens;
  }
  /**
   * Lexing/Compiling
   */
  inlineTokens(src, tokens = []) {
    let maskedSrc = src;
    let match = null;
    if (this.tokens.links) {
      const links = Object.keys(this.tokens.links);
      if (links.length > 0) {
        while ((match = this.tokenizer.rules.inline.reflinkSearch.exec(maskedSrc)) != null) {
          if (links.includes(match[0].slice(match[0].lastIndexOf("[") + 1, -1))) {
            maskedSrc = maskedSrc.slice(0, match.index) + "[" + "a".repeat(match[0].length - 2) + "]" + maskedSrc.slice(this.tokenizer.rules.inline.reflinkSearch.lastIndex);
          }
        }
      }
    }
    while ((match = this.tokenizer.rules.inline.anyPunctuation.exec(maskedSrc)) != null) {
      maskedSrc = maskedSrc.slice(0, match.index) + "++" + maskedSrc.slice(this.tokenizer.rules.inline.anyPunctuation.lastIndex);
    }
    while ((match = this.tokenizer.rules.inline.blockSkip.exec(maskedSrc)) != null) {
      maskedSrc = maskedSrc.slice(0, match.index) + "[" + "a".repeat(match[0].length - 2) + "]" + maskedSrc.slice(this.tokenizer.rules.inline.blockSkip.lastIndex);
    }
    let keepPrevChar = false;
    let prevChar = "";
    while (src) {
      if (!keepPrevChar) {
        prevChar = "";
      }
      keepPrevChar = false;
      let token;
      if (this.options.extensions?.inline?.some((extTokenizer) => {
        if (token = extTokenizer.call({ lexer: this }, src, tokens)) {
          src = src.substring(token.raw.length);
          tokens.push(token);
          return true;
        }
        return false;
      })) {
        continue;
      }
      if (token = this.tokenizer.escape(src)) {
        src = src.substring(token.raw.length);
        tokens.push(token);
        continue;
      }
      if (token = this.tokenizer.tag(src)) {
        src = src.substring(token.raw.length);
        tokens.push(token);
        continue;
      }
      if (token = this.tokenizer.link(src)) {
        src = src.substring(token.raw.length);
        tokens.push(token);
        continue;
      }
      if (token = this.tokenizer.reflink(src, this.tokens.links)) {
        src = src.substring(token.raw.length);
        const lastToken = tokens.at(-1);
        if (token.type === "text" && lastToken?.type === "text") {
          lastToken.raw += token.raw;
          lastToken.text += token.text;
        } else {
          tokens.push(token);
        }
        continue;
      }
      if (token = this.tokenizer.emStrong(src, maskedSrc, prevChar)) {
        src = src.substring(token.raw.length);
        tokens.push(token);
        continue;
      }
      if (token = this.tokenizer.codespan(src)) {
        src = src.substring(token.raw.length);
        tokens.push(token);
        continue;
      }
      if (token = this.tokenizer.br(src)) {
        src = src.substring(token.raw.length);
        tokens.push(token);
        continue;
      }
      if (token = this.tokenizer.del(src)) {
        src = src.substring(token.raw.length);
        tokens.push(token);
        continue;
      }
      if (token = this.tokenizer.autolink(src)) {
        src = src.substring(token.raw.length);
        tokens.push(token);
        continue;
      }
      if (!this.state.inLink && (token = this.tokenizer.url(src))) {
        src = src.substring(token.raw.length);
        tokens.push(token);
        continue;
      }
      let cutSrc = src;
      if (this.options.extensions?.startInline) {
        let startIndex = Infinity;
        const tempSrc = src.slice(1);
        let tempStart;
        this.options.extensions.startInline.forEach((getStartIndex) => {
          tempStart = getStartIndex.call({ lexer: this }, tempSrc);
          if (typeof tempStart === "number" && tempStart >= 0) {
            startIndex = Math.min(startIndex, tempStart);
          }
        });
        if (startIndex < Infinity && startIndex >= 0) {
          cutSrc = src.substring(0, startIndex + 1);
        }
      }
      if (token = this.tokenizer.inlineText(cutSrc)) {
        src = src.substring(token.raw.length);
        if (token.raw.slice(-1) !== "_") {
          prevChar = token.raw.slice(-1);
        }
        keepPrevChar = true;
        const lastToken = tokens.at(-1);
        if (lastToken?.type === "text") {
          lastToken.raw += token.raw;
          lastToken.text += token.text;
        } else {
          tokens.push(token);
        }
        continue;
      }
      if (src) {
        const errMsg = "Infinite loop on byte: " + src.charCodeAt(0);
        if (this.options.silent) {
          console.error(errMsg);
          break;
        } else {
          throw new Error(errMsg);
        }
      }
    }
    return tokens;
  }
};
var _Renderer = class {
  options;
  parser;
  // set by the parser
  constructor(options2) {
    this.options = options2 || _defaults;
  }
  space(token) {
    return "";
  }
  code({ text: text2, lang, escaped }) {
    const langString = (lang || "").match(other.notSpaceStart)?.[0];
    const code = text2.replace(other.endingNewline, "") + "\n";
    if (!langString) {
      return "<pre><code>" + (escaped ? code : escape2(code, true)) + "</code></pre>\n";
    }
    return '<pre><code class="language-' + escape2(langString) + '">' + (escaped ? code : escape2(code, true)) + "</code></pre>\n";
  }
  blockquote({ tokens }) {
    const body = this.parser.parse(tokens);
    return `<blockquote>
${body}</blockquote>
`;
  }
  html({ text: text2 }) {
    return text2;
  }
  heading({ tokens, depth }) {
    return `<h${depth}>${this.parser.parseInline(tokens)}</h${depth}>
`;
  }
  hr(token) {
    return "<hr>\n";
  }
  list(token) {
    const ordered = token.ordered;
    const start = token.start;
    let body = "";
    for (let j = 0; j < token.items.length; j++) {
      const item = token.items[j];
      body += this.listitem(item);
    }
    const type = ordered ? "ol" : "ul";
    const startAttr = ordered && start !== 1 ? ' start="' + start + '"' : "";
    return "<" + type + startAttr + ">\n" + body + "</" + type + ">\n";
  }
  listitem(item) {
    let itemBody = "";
    if (item.task) {
      const checkbox = this.checkbox({ checked: !!item.checked });
      if (item.loose) {
        if (item.tokens[0]?.type === "paragraph") {
          item.tokens[0].text = checkbox + " " + item.tokens[0].text;
          if (item.tokens[0].tokens && item.tokens[0].tokens.length > 0 && item.tokens[0].tokens[0].type === "text") {
            item.tokens[0].tokens[0].text = checkbox + " " + escape2(item.tokens[0].tokens[0].text);
            item.tokens[0].tokens[0].escaped = true;
          }
        } else {
          item.tokens.unshift({
            type: "text",
            raw: checkbox + " ",
            text: checkbox + " ",
            escaped: true
          });
        }
      } else {
        itemBody += checkbox + " ";
      }
    }
    itemBody += this.parser.parse(item.tokens, !!item.loose);
    return `<li>${itemBody}</li>
`;
  }
  checkbox({ checked }) {
    return "<input " + (checked ? 'checked="" ' : "") + 'disabled="" type="checkbox">';
  }
  paragraph({ tokens }) {
    return `<p>${this.parser.parseInline(tokens)}</p>
`;
  }
  table(token) {
    let header = "";
    let cell = "";
    for (let j = 0; j < token.header.length; j++) {
      cell += this.tablecell(token.header[j]);
    }
    header += this.tablerow({ text: cell });
    let body = "";
    for (let j = 0; j < token.rows.length; j++) {
      const row = token.rows[j];
      cell = "";
      for (let k = 0; k < row.length; k++) {
        cell += this.tablecell(row[k]);
      }
      body += this.tablerow({ text: cell });
    }
    if (body) body = `<tbody>${body}</tbody>`;
    return "<table>\n<thead>\n" + header + "</thead>\n" + body + "</table>\n";
  }
  tablerow({ text: text2 }) {
    return `<tr>
${text2}</tr>
`;
  }
  tablecell(token) {
    const content = this.parser.parseInline(token.tokens);
    const type = token.header ? "th" : "td";
    const tag2 = token.align ? `<${type} align="${token.align}">` : `<${type}>`;
    return tag2 + content + `</${type}>
`;
  }
  /**
   * span level renderer
   */
  strong({ tokens }) {
    return `<strong>${this.parser.parseInline(tokens)}</strong>`;
  }
  em({ tokens }) {
    return `<em>${this.parser.parseInline(tokens)}</em>`;
  }
  codespan({ text: text2 }) {
    return `<code>${escape2(text2, true)}</code>`;
  }
  br(token) {
    return "<br>";
  }
  del({ tokens }) {
    return `<del>${this.parser.parseInline(tokens)}</del>`;
  }
  link({ href, title, tokens }) {
    const text2 = this.parser.parseInline(tokens);
    const cleanHref = cleanUrl(href);
    if (cleanHref === null) {
      return text2;
    }
    href = cleanHref;
    let out = '<a href="' + href + '"';
    if (title) {
      out += ' title="' + escape2(title) + '"';
    }
    out += ">" + text2 + "</a>";
    return out;
  }
  image({ href, title, text: text2, tokens }) {
    if (tokens) {
      text2 = this.parser.parseInline(tokens, this.parser.textRenderer);
    }
    const cleanHref = cleanUrl(href);
    if (cleanHref === null) {
      return escape2(text2);
    }
    href = cleanHref;
    let out = `<img src="${href}" alt="${text2}"`;
    if (title) {
      out += ` title="${escape2(title)}"`;
    }
    out += ">";
    return out;
  }
  text(token) {
    return "tokens" in token && token.tokens ? this.parser.parseInline(token.tokens) : "escaped" in token && token.escaped ? token.text : escape2(token.text);
  }
};
var _TextRenderer = class {
  // no need for block level renderers
  strong({ text: text2 }) {
    return text2;
  }
  em({ text: text2 }) {
    return text2;
  }
  codespan({ text: text2 }) {
    return text2;
  }
  del({ text: text2 }) {
    return text2;
  }
  html({ text: text2 }) {
    return text2;
  }
  text({ text: text2 }) {
    return text2;
  }
  link({ text: text2 }) {
    return "" + text2;
  }
  image({ text: text2 }) {
    return "" + text2;
  }
  br() {
    return "";
  }
};
var _Parser = class __Parser {
  options;
  renderer;
  textRenderer;
  constructor(options2) {
    this.options = options2 || _defaults;
    this.options.renderer = this.options.renderer || new _Renderer();
    this.renderer = this.options.renderer;
    this.renderer.options = this.options;
    this.renderer.parser = this;
    this.textRenderer = new _TextRenderer();
  }
  /**
   * Static Parse Method
   */
  static parse(tokens, options2) {
    const parser2 = new __Parser(options2);
    return parser2.parse(tokens);
  }
  /**
   * Static Parse Inline Method
   */
  static parseInline(tokens, options2) {
    const parser2 = new __Parser(options2);
    return parser2.parseInline(tokens);
  }
  /**
   * Parse Loop
   */
  parse(tokens, top = true) {
    let out = "";
    for (let i = 0; i < tokens.length; i++) {
      const anyToken = tokens[i];
      if (this.options.extensions?.renderers?.[anyToken.type]) {
        const genericToken = anyToken;
        const ret = this.options.extensions.renderers[genericToken.type].call({ parser: this }, genericToken);
        if (ret !== false || !["space", "hr", "heading", "code", "table", "blockquote", "list", "html", "paragraph", "text"].includes(genericToken.type)) {
          out += ret || "";
          continue;
        }
      }
      const token = anyToken;
      switch (token.type) {
        case "space": {
          out += this.renderer.space(token);
          continue;
        }
        case "hr": {
          out += this.renderer.hr(token);
          continue;
        }
        case "heading": {
          out += this.renderer.heading(token);
          continue;
        }
        case "code": {
          out += this.renderer.code(token);
          continue;
        }
        case "table": {
          out += this.renderer.table(token);
          continue;
        }
        case "blockquote": {
          out += this.renderer.blockquote(token);
          continue;
        }
        case "list": {
          out += this.renderer.list(token);
          continue;
        }
        case "html": {
          out += this.renderer.html(token);
          continue;
        }
        case "paragraph": {
          out += this.renderer.paragraph(token);
          continue;
        }
        case "text": {
          let textToken = token;
          let body = this.renderer.text(textToken);
          while (i + 1 < tokens.length && tokens[i + 1].type === "text") {
            textToken = tokens[++i];
            body += "\n" + this.renderer.text(textToken);
          }
          if (top) {
            out += this.renderer.paragraph({
              type: "paragraph",
              raw: body,
              text: body,
              tokens: [{ type: "text", raw: body, text: body, escaped: true }]
            });
          } else {
            out += body;
          }
          continue;
        }
        default: {
          const errMsg = 'Token with "' + token.type + '" type was not found.';
          if (this.options.silent) {
            console.error(errMsg);
            return "";
          } else {
            throw new Error(errMsg);
          }
        }
      }
    }
    return out;
  }
  /**
   * Parse Inline Tokens
   */
  parseInline(tokens, renderer2 = this.renderer) {
    let out = "";
    for (let i = 0; i < tokens.length; i++) {
      const anyToken = tokens[i];
      if (this.options.extensions?.renderers?.[anyToken.type]) {
        const ret = this.options.extensions.renderers[anyToken.type].call({ parser: this }, anyToken);
        if (ret !== false || !["escape", "html", "link", "image", "strong", "em", "codespan", "br", "del", "text"].includes(anyToken.type)) {
          out += ret || "";
          continue;
        }
      }
      const token = anyToken;
      switch (token.type) {
        case "escape": {
          out += renderer2.text(token);
          break;
        }
        case "html": {
          out += renderer2.html(token);
          break;
        }
        case "link": {
          out += renderer2.link(token);
          break;
        }
        case "image": {
          out += renderer2.image(token);
          break;
        }
        case "strong": {
          out += renderer2.strong(token);
          break;
        }
        case "em": {
          out += renderer2.em(token);
          break;
        }
        case "codespan": {
          out += renderer2.codespan(token);
          break;
        }
        case "br": {
          out += renderer2.br(token);
          break;
        }
        case "del": {
          out += renderer2.del(token);
          break;
        }
        case "text": {
          out += renderer2.text(token);
          break;
        }
        default: {
          const errMsg = 'Token with "' + token.type + '" type was not found.';
          if (this.options.silent) {
            console.error(errMsg);
            return "";
          } else {
            throw new Error(errMsg);
          }
        }
      }
    }
    return out;
  }
};
var _Hooks = class {
  options;
  block;
  constructor(options2) {
    this.options = options2 || _defaults;
  }
  static passThroughHooks = /* @__PURE__ */ new Set([
    "preprocess",
    "postprocess",
    "processAllTokens"
  ]);
  /**
   * Process markdown before marked
   */
  preprocess(markdown) {
    return markdown;
  }
  /**
   * Process HTML after marked is finished
   */
  postprocess(html22) {
    return html22;
  }
  /**
   * Process all tokens before walk tokens
   */
  processAllTokens(tokens) {
    return tokens;
  }
  /**
   * Provide function to tokenize markdown
   */
  provideLexer() {
    return this.block ? _Lexer.lex : _Lexer.lexInline;
  }
  /**
   * Provide function to parse tokens
   */
  provideParser() {
    return this.block ? _Parser.parse : _Parser.parseInline;
  }
};
var Marked = class {
  defaults = _getDefaults();
  options = this.setOptions;
  parse = this.parseMarkdown(true);
  parseInline = this.parseMarkdown(false);
  Parser = _Parser;
  Renderer = _Renderer;
  TextRenderer = _TextRenderer;
  Lexer = _Lexer;
  Tokenizer = _Tokenizer;
  Hooks = _Hooks;
  constructor(...args) {
    this.use(...args);
  }
  /**
   * Run callback for every token
   */
  walkTokens(tokens, callback) {
    let values = [];
    for (const token of tokens) {
      values = values.concat(callback.call(this, token));
      switch (token.type) {
        case "table": {
          const tableToken = token;
          for (const cell of tableToken.header) {
            values = values.concat(this.walkTokens(cell.tokens, callback));
          }
          for (const row of tableToken.rows) {
            for (const cell of row) {
              values = values.concat(this.walkTokens(cell.tokens, callback));
            }
          }
          break;
        }
        case "list": {
          const listToken = token;
          values = values.concat(this.walkTokens(listToken.items, callback));
          break;
        }
        default: {
          const genericToken = token;
          if (this.defaults.extensions?.childTokens?.[genericToken.type]) {
            this.defaults.extensions.childTokens[genericToken.type].forEach((childTokens) => {
              const tokens2 = genericToken[childTokens].flat(Infinity);
              values = values.concat(this.walkTokens(tokens2, callback));
            });
          } else if (genericToken.tokens) {
            values = values.concat(this.walkTokens(genericToken.tokens, callback));
          }
        }
      }
    }
    return values;
  }
  use(...args) {
    const extensions = this.defaults.extensions || { renderers: {}, childTokens: {} };
    args.forEach((pack) => {
      const opts = { ...pack };
      opts.async = this.defaults.async || opts.async || false;
      if (pack.extensions) {
        pack.extensions.forEach((ext) => {
          if (!ext.name) {
            throw new Error("extension name required");
          }
          if ("renderer" in ext) {
            const prevRenderer = extensions.renderers[ext.name];
            if (prevRenderer) {
              extensions.renderers[ext.name] = function(...args2) {
                let ret = ext.renderer.apply(this, args2);
                if (ret === false) {
                  ret = prevRenderer.apply(this, args2);
                }
                return ret;
              };
            } else {
              extensions.renderers[ext.name] = ext.renderer;
            }
          }
          if ("tokenizer" in ext) {
            if (!ext.level || ext.level !== "block" && ext.level !== "inline") {
              throw new Error("extension level must be 'block' or 'inline'");
            }
            const extLevel = extensions[ext.level];
            if (extLevel) {
              extLevel.unshift(ext.tokenizer);
            } else {
              extensions[ext.level] = [ext.tokenizer];
            }
            if (ext.start) {
              if (ext.level === "block") {
                if (extensions.startBlock) {
                  extensions.startBlock.push(ext.start);
                } else {
                  extensions.startBlock = [ext.start];
                }
              } else if (ext.level === "inline") {
                if (extensions.startInline) {
                  extensions.startInline.push(ext.start);
                } else {
                  extensions.startInline = [ext.start];
                }
              }
            }
          }
          if ("childTokens" in ext && ext.childTokens) {
            extensions.childTokens[ext.name] = ext.childTokens;
          }
        });
        opts.extensions = extensions;
      }
      if (pack.renderer) {
        const renderer2 = this.defaults.renderer || new _Renderer(this.defaults);
        for (const prop in pack.renderer) {
          if (!(prop in renderer2)) {
            throw new Error(`renderer '${prop}' does not exist`);
          }
          if (["options", "parser"].includes(prop)) {
            continue;
          }
          const rendererProp = prop;
          const rendererFunc = pack.renderer[rendererProp];
          const prevRenderer = renderer2[rendererProp];
          renderer2[rendererProp] = (...args2) => {
            let ret = rendererFunc.apply(renderer2, args2);
            if (ret === false) {
              ret = prevRenderer.apply(renderer2, args2);
            }
            return ret || "";
          };
        }
        opts.renderer = renderer2;
      }
      if (pack.tokenizer) {
        const tokenizer = this.defaults.tokenizer || new _Tokenizer(this.defaults);
        for (const prop in pack.tokenizer) {
          if (!(prop in tokenizer)) {
            throw new Error(`tokenizer '${prop}' does not exist`);
          }
          if (["options", "rules", "lexer"].includes(prop)) {
            continue;
          }
          const tokenizerProp = prop;
          const tokenizerFunc = pack.tokenizer[tokenizerProp];
          const prevTokenizer = tokenizer[tokenizerProp];
          tokenizer[tokenizerProp] = (...args2) => {
            let ret = tokenizerFunc.apply(tokenizer, args2);
            if (ret === false) {
              ret = prevTokenizer.apply(tokenizer, args2);
            }
            return ret;
          };
        }
        opts.tokenizer = tokenizer;
      }
      if (pack.hooks) {
        const hooks = this.defaults.hooks || new _Hooks();
        for (const prop in pack.hooks) {
          if (!(prop in hooks)) {
            throw new Error(`hook '${prop}' does not exist`);
          }
          if (["options", "block"].includes(prop)) {
            continue;
          }
          const hooksProp = prop;
          const hooksFunc = pack.hooks[hooksProp];
          const prevHook = hooks[hooksProp];
          if (_Hooks.passThroughHooks.has(prop)) {
            hooks[hooksProp] = (arg) => {
              if (this.defaults.async) {
                return Promise.resolve(hooksFunc.call(hooks, arg)).then((ret2) => {
                  return prevHook.call(hooks, ret2);
                });
              }
              const ret = hooksFunc.call(hooks, arg);
              return prevHook.call(hooks, ret);
            };
          } else {
            hooks[hooksProp] = (...args2) => {
              let ret = hooksFunc.apply(hooks, args2);
              if (ret === false) {
                ret = prevHook.apply(hooks, args2);
              }
              return ret;
            };
          }
        }
        opts.hooks = hooks;
      }
      if (pack.walkTokens) {
        const walkTokens2 = this.defaults.walkTokens;
        const packWalktokens = pack.walkTokens;
        opts.walkTokens = function(token) {
          let values = [];
          values.push(packWalktokens.call(this, token));
          if (walkTokens2) {
            values = values.concat(walkTokens2.call(this, token));
          }
          return values;
        };
      }
      this.defaults = { ...this.defaults, ...opts };
    });
    return this;
  }
  setOptions(opt) {
    this.defaults = { ...this.defaults, ...opt };
    return this;
  }
  lexer(src, options2) {
    return _Lexer.lex(src, options2 ?? this.defaults);
  }
  parser(tokens, options2) {
    return _Parser.parse(tokens, options2 ?? this.defaults);
  }
  parseMarkdown(blockType) {
    const parse2 = (src, options2) => {
      const origOpt = { ...options2 };
      const opt = { ...this.defaults, ...origOpt };
      const throwError = this.onError(!!opt.silent, !!opt.async);
      if (this.defaults.async === true && origOpt.async === false) {
        return throwError(new Error("marked(): The async option was set to true by an extension. Remove async: false from the parse options object to return a Promise."));
      }
      if (typeof src === "undefined" || src === null) {
        return throwError(new Error("marked(): input parameter is undefined or null"));
      }
      if (typeof src !== "string") {
        return throwError(new Error("marked(): input parameter is of type " + Object.prototype.toString.call(src) + ", string expected"));
      }
      if (opt.hooks) {
        opt.hooks.options = opt;
        opt.hooks.block = blockType;
      }
      const lexer2 = opt.hooks ? opt.hooks.provideLexer() : blockType ? _Lexer.lex : _Lexer.lexInline;
      const parser2 = opt.hooks ? opt.hooks.provideParser() : blockType ? _Parser.parse : _Parser.parseInline;
      if (opt.async) {
        return Promise.resolve(opt.hooks ? opt.hooks.preprocess(src) : src).then((src2) => lexer2(src2, opt)).then((tokens) => opt.hooks ? opt.hooks.processAllTokens(tokens) : tokens).then((tokens) => opt.walkTokens ? Promise.all(this.walkTokens(tokens, opt.walkTokens)).then(() => tokens) : tokens).then((tokens) => parser2(tokens, opt)).then((html22) => opt.hooks ? opt.hooks.postprocess(html22) : html22).catch(throwError);
      }
      try {
        if (opt.hooks) {
          src = opt.hooks.preprocess(src);
        }
        let tokens = lexer2(src, opt);
        if (opt.hooks) {
          tokens = opt.hooks.processAllTokens(tokens);
        }
        if (opt.walkTokens) {
          this.walkTokens(tokens, opt.walkTokens);
        }
        let html22 = parser2(tokens, opt);
        if (opt.hooks) {
          html22 = opt.hooks.postprocess(html22);
        }
        return html22;
      } catch (e) {
        return throwError(e);
      }
    };
    return parse2;
  }
  onError(silent, async) {
    return (e) => {
      e.message += "\nPlease report this to https://github.com/markedjs/marked.";
      if (silent) {
        const msg = "<p>An error occurred:</p><pre>" + escape2(e.message + "", true) + "</pre>";
        if (async) {
          return Promise.resolve(msg);
        }
        return msg;
      }
      if (async) {
        return Promise.reject(e);
      }
      throw e;
    };
  }
};
var markedInstance = new Marked();
function marked(src, opt) {
  return markedInstance.parse(src, opt);
}
marked.options = marked.setOptions = function(options2) {
  markedInstance.setOptions(options2);
  marked.defaults = markedInstance.defaults;
  changeDefaults(marked.defaults);
  return marked;
};
marked.getDefaults = _getDefaults;
marked.defaults = _defaults;
marked.use = function(...args) {
  markedInstance.use(...args);
  marked.defaults = markedInstance.defaults;
  changeDefaults(marked.defaults);
  return marked;
};
marked.walkTokens = function(tokens, callback) {
  return markedInstance.walkTokens(tokens, callback);
};
marked.parseInline = markedInstance.parseInline;
marked.Parser = _Parser;
marked.parser = _Parser.parse;
marked.Renderer = _Renderer;
marked.TextRenderer = _TextRenderer;
marked.Lexer = _Lexer;
marked.lexer = _Lexer.lex;
marked.Tokenizer = _Tokenizer;
marked.Hooks = _Hooks;
marked.parse = marked;
var options = marked.options;
var setOptions = marked.setOptions;
var use = marked.use;
var walkTokens = marked.walkTokens;
var parseInline = marked.parseInline;
var parser = _Parser.parse;
var lexer = _Lexer.lex;

// node_modules/dompurify/dist/purify.es.mjs
function _OverloadYield(e, d) {
  this.v = e, this.k = d;
}
function _arrayLikeToArray(r, a) {
  (null == a || a > r.length) && (a = r.length);
  for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e];
  return n;
}
function _arrayWithHoles(r) {
  if (Array.isArray(r)) return r;
}
function _iterableToArrayLimit(r, l) {
  var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"];
  if (null != t) {
    var e, n, i, u, a = [], f = true, o = false;
    try {
      if (i = (t = t.call(r)).next, 0 === l) {
        if (Object(t) !== t) return;
        f = false;
      } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = true) ;
    } catch (r2) {
      o = true, n = r2;
    } finally {
      try {
        if (!f && null != t.return && (u = t.return(), Object(u) !== u)) return;
      } finally {
        if (o) throw n;
      }
    }
    return a;
  }
}
function _nonIterableRest() {
  throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}
function _slicedToArray(r, e) {
  return _arrayWithHoles(r) || _iterableToArrayLimit(r, e) || _unsupportedIterableToArray(r, e) || _nonIterableRest();
}
function _unsupportedIterableToArray(r, a) {
  if (r) {
    if ("string" == typeof r) return _arrayLikeToArray(r, a);
    var t = {}.toString.call(r).slice(8, -1);
    return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0;
  }
}
function AsyncGenerator(e) {
  var t, n;
  function resume(t2, n2) {
    try {
      var r = e[t2](n2), o = r.value, u = o instanceof _OverloadYield;
      Promise.resolve(u ? o.v : o).then(function(n3) {
        if (u) {
          var i = "return" === t2 && o.k ? t2 : "next";
          if (!o.k || n3.done) return resume(i, n3);
          n3 = e[i](n3).value;
        }
        settle(!!r.done, n3);
      }, function(e2) {
        resume("throw", e2);
      });
    } catch (e2) {
      settle(2, e2);
    }
  }
  function settle(e2, r) {
    2 === e2 ? t.reject(r) : t.resolve({
      value: r,
      done: e2
    }), (t = t.next) ? resume(t.key, t.arg) : n = null;
  }
  this._invoke = function(e2, r) {
    return new Promise(function(o, u) {
      var i = {
        key: e2,
        arg: r,
        resolve: o,
        reject: u,
        next: null
      };
      n ? n = n.next = i : (t = n = i, resume(e2, r));
    });
  }, "function" != typeof e.return && (this.return = void 0);
}
AsyncGenerator.prototype["function" == typeof Symbol && Symbol.asyncIterator || "@@asyncIterator"] = function() {
  return this;
}, AsyncGenerator.prototype.next = function(e) {
  return this._invoke("next", e);
}, AsyncGenerator.prototype.throw = function(e) {
  return this._invoke("throw", e);
}, AsyncGenerator.prototype.return = function(e) {
  return this._invoke("return", e);
};
var entries = Object.entries;
var objectKeys = Object.keys;
var setPrototypeOf = Object.setPrototypeOf;
var isFrozen = Object.isFrozen;
var getPrototypeOf = Object.getPrototypeOf;
var getOwnPropertyDescriptor = Object.getOwnPropertyDescriptor;
var freeze = Object.freeze;
var seal = Object.seal;
var create = Object.create;
var _ref = typeof Reflect !== "undefined" && Reflect;
var apply = _ref.apply;
var construct = _ref.construct;
if (!freeze) freeze = function freeze2(x) {
  return x;
};
if (!seal) seal = function seal2(x) {
  return x;
};
if (!apply) apply = function apply2(func, thisArg) {
  for (var _len = arguments.length, args = new Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) args[_key - 2] = arguments[_key];
  return func.apply(thisArg, args);
};
if (!construct) construct = function construct2(Func) {
  for (var _len2 = arguments.length, args = new Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) args[_key2 - 1] = arguments[_key2];
  return new Func(...args);
};
var arrayForEach = unapply(Array.prototype.forEach);
var arrayLastIndexOf = unapply(Array.prototype.lastIndexOf);
var arrayPop = unapply(Array.prototype.pop);
var arrayPush = unapply(Array.prototype.push);
var arraySlice = unapply(Array.prototype.slice);
var arraySplice = unapply(Array.prototype.splice);
var arrayIsArray = Array.isArray;
var setCreate = unconstruct(Set);
var setAdd = unapply(Set.prototype.add);
var setHas = unapply(Set.prototype.has);
var stringToLowerCase = unapply(String.prototype.toLowerCase);
var stringToString = unapply(String.prototype.toString);
var stringMatch = unapply(String.prototype.match);
var stringReplace = unapply(String.prototype.replace);
var stringIndexOf = unapply(String.prototype.indexOf);
var stringTrim = unapply(String.prototype.trim);
var numberToString = unapply(Number.prototype.toString);
var booleanToString = unapply(Boolean.prototype.toString);
var bigintToString = typeof BigInt === "undefined" ? null : unapply(BigInt.prototype.toString);
var symbolToString = typeof Symbol === "undefined" ? null : unapply(Symbol.prototype.toString);
var objectHasOwnProperty = unapply(Object.prototype.hasOwnProperty);
var objectToString = unapply(Object.prototype.toString);
var regExpTestRaw = RegExp.prototype.test;
var regExpTest = function regExpTest2(regExp, value) {
  if (regExp instanceof RegExp) regExp.lastIndex = 0;
  return apply(regExpTestRaw, regExp, [value]);
};
var typeErrorCreate = unconstruct(TypeError);
function unapply(func) {
  return function(thisArg) {
    for (var _len3 = arguments.length, args = new Array(_len3 > 1 ? _len3 - 1 : 0), _key3 = 1; _key3 < _len3; _key3++) args[_key3 - 1] = arguments[_key3];
    return apply(func, thisArg, args);
  };
}
function unconstruct(Func) {
  return function() {
    for (var _len4 = arguments.length, args = new Array(_len4), _key4 = 0; _key4 < _len4; _key4++) args[_key4] = arguments[_key4];
    return construct(Func, args);
  };
}
function addToSet(set, array) {
  let transformCaseFunc = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : stringToLowerCase;
  if (setPrototypeOf) setPrototypeOf(set, null);
  if (!arrayIsArray(array)) return set;
  let l = array.length;
  while (l--) {
    let element = array[l];
    if (typeof element === "string") {
      const lcElement = transformCaseFunc(element);
      if (lcElement !== element) {
        if (!isFrozen(array)) array[l] = lcElement;
        element = lcElement;
      }
    }
    set[element] = true;
  }
  return set;
}
function cleanArray(array) {
  for (let index = 0; index < array.length; index++) if (!objectHasOwnProperty(array, index)) array[index] = null;
  return array;
}
function clone(object) {
  const newObject = create(null);
  for (const _ref2 of entries(object)) {
    var _ref3 = _slicedToArray(_ref2, 2);
    const property = _ref3[0];
    const value = _ref3[1];
    if (objectHasOwnProperty(object, property)) {
      if (arrayIsArray(value)) newObject[property] = cleanArray(value);
      else if (value && typeof value === "object" && value.constructor === Object) newObject[property] = clone(value);
      else newObject[property] = value;
    }
  }
  return newObject;
}
function cloneSet(set) {
  const newSet = create(null);
  const keys = objectKeys(set);
  let l = keys.length;
  while (l--) newSet[keys[l]] = set[keys[l]];
  return newSet;
}
function stringifyValue(value) {
  switch (typeof value) {
    case "string":
      return value;
    case "number":
      return numberToString(value);
    case "boolean":
      return booleanToString(value);
    case "bigint":
      return bigintToString ? bigintToString(value) : "0";
    case "symbol":
      return symbolToString ? symbolToString(value) : "Symbol()";
    case "undefined":
      return objectToString(value);
    case "function":
    case "object": {
      if (value === null) return objectToString(value);
      const valueAsRecord = value;
      const valueToString = lookupGetter(valueAsRecord, "toString");
      if (typeof valueToString === "function") {
        const stringified = valueToString(valueAsRecord);
        return typeof stringified === "string" ? stringified : objectToString(stringified);
      }
      return objectToString(value);
    }
    default:
      return objectToString(value);
  }
}
function lookupGetter(object, prop) {
  while (object !== null) {
    const desc = getOwnPropertyDescriptor(object, prop);
    if (desc) {
      if (desc.get) return unapply(desc.get);
      if (typeof desc.value === "function") return unapply(desc.value);
    }
    object = getPrototypeOf(object);
  }
  function fallbackValue() {
    return null;
  }
  return fallbackValue;
}
function lookupAccessor(object, prop) {
  while (object !== null) {
    const desc = getOwnPropertyDescriptor(object, prop);
    if (desc) return desc.get ? unapply(desc.get) : null;
    object = getPrototypeOf(object);
  }
  return null;
}
function isRegex(value) {
  if (!value) return false;
  try {
    regExpTest(value, "");
    return true;
  } catch (_unused) {
    return false;
  }
}
var html$1 = freeze([
  "a",
  "abbr",
  "acronym",
  "address",
  "area",
  "article",
  "aside",
  "audio",
  "b",
  "bdi",
  "bdo",
  "big",
  "blink",
  "blockquote",
  "body",
  "br",
  "button",
  "canvas",
  "caption",
  "center",
  "cite",
  "code",
  "col",
  "colgroup",
  "content",
  "data",
  "datalist",
  "dd",
  "decorator",
  "del",
  "details",
  "dfn",
  "dialog",
  "dir",
  "div",
  "dl",
  "dt",
  "element",
  "em",
  "fieldset",
  "figcaption",
  "figure",
  "font",
  "footer",
  "form",
  "h1",
  "h2",
  "h3",
  "h4",
  "h5",
  "h6",
  "head",
  "header",
  "hgroup",
  "hr",
  "html",
  "i",
  "img",
  "input",
  "ins",
  "kbd",
  "label",
  "legend",
  "li",
  "main",
  "map",
  "mark",
  "marquee",
  "menu",
  "menuitem",
  "meter",
  "nav",
  "nobr",
  "ol",
  "optgroup",
  "option",
  "output",
  "p",
  "picture",
  "pre",
  "progress",
  "q",
  "rp",
  "rt",
  "ruby",
  "s",
  "samp",
  "search",
  "section",
  "select",
  "shadow",
  "slot",
  "small",
  "source",
  "spacer",
  "span",
  "strike",
  "strong",
  "style",
  "sub",
  "summary",
  "sup",
  "table",
  "tbody",
  "td",
  "template",
  "textarea",
  "tfoot",
  "th",
  "thead",
  "time",
  "tr",
  "track",
  "tt",
  "u",
  "ul",
  "var",
  "video",
  "wbr"
]);
var svg$1 = freeze([
  "svg",
  "a",
  "altglyph",
  "altglyphdef",
  "altglyphitem",
  "animatecolor",
  "animatemotion",
  "animatetransform",
  "circle",
  "clippath",
  "defs",
  "desc",
  "ellipse",
  "filter",
  "font",
  "g",
  "glyph",
  "glyphref",
  "hkern",
  "image",
  "line",
  "lineargradient",
  "marker",
  "mask",
  "metadata",
  "mpath",
  "path",
  "pattern",
  "polygon",
  "polyline",
  "radialgradient",
  "rect",
  "stop",
  "style",
  "switch",
  "symbol",
  "text",
  "textpath",
  "title",
  "tref",
  "tspan",
  "view",
  "vkern"
]);
var svgFilters = freeze([
  "feBlend",
  "feColorMatrix",
  "feComponentTransfer",
  "feComposite",
  "feConvolveMatrix",
  "feDiffuseLighting",
  "feDisplacementMap",
  "feDistantLight",
  "feDropShadow",
  "feFlood",
  "feFuncA",
  "feFuncB",
  "feFuncG",
  "feFuncR",
  "feGaussianBlur",
  "feImage",
  "feMerge",
  "feMergeNode",
  "feMorphology",
  "feOffset",
  "fePointLight",
  "feSpecularLighting",
  "feSpotLight",
  "feTile",
  "feTurbulence"
]);
var svgDisallowed = freeze([
  "animate",
  "color-profile",
  "cursor",
  "discard",
  "font-face",
  "font-face-format",
  "font-face-name",
  "font-face-src",
  "font-face-uri",
  "foreignobject",
  "hatch",
  "hatchpath",
  "mesh",
  "meshgradient",
  "meshpatch",
  "meshrow",
  "missing-glyph",
  "script",
  "set",
  "solidcolor",
  "unknown",
  "use"
]);
var mathMl$1 = freeze([
  "math",
  "menclose",
  "merror",
  "mfenced",
  "mfrac",
  "mglyph",
  "mi",
  "mlabeledtr",
  "mmultiscripts",
  "mn",
  "mo",
  "mover",
  "mpadded",
  "mphantom",
  "mroot",
  "mrow",
  "ms",
  "mspace",
  "msqrt",
  "mstyle",
  "msub",
  "msup",
  "msubsup",
  "mtable",
  "mtd",
  "mtext",
  "mtr",
  "munder",
  "munderover",
  "mprescripts"
]);
var mathMlDisallowed = freeze([
  "maction",
  "maligngroup",
  "malignmark",
  "mlongdiv",
  "mscarries",
  "mscarry",
  "msgroup",
  "mstack",
  "msline",
  "msrow",
  "semantics",
  "annotation",
  "annotation-xml",
  "mprescripts",
  "none"
]);
var text = freeze(["#text"]);
var html2 = freeze([
  "accept",
  "action",
  "align",
  "alt",
  "autocapitalize",
  "autocomplete",
  "autopictureinpicture",
  "autoplay",
  "background",
  "bgcolor",
  "border",
  "capture",
  "cellpadding",
  "cellspacing",
  "checked",
  "cite",
  "class",
  "clear",
  "color",
  "cols",
  "colspan",
  "command",
  "commandfor",
  "controls",
  "controlslist",
  "coords",
  "crossorigin",
  "datetime",
  "decoding",
  "default",
  "dir",
  "disabled",
  "disablepictureinpicture",
  "disableremoteplayback",
  "download",
  "draggable",
  "enctype",
  "enterkeyhint",
  "exportparts",
  "face",
  "for",
  "headers",
  "height",
  "hidden",
  "high",
  "href",
  "hreflang",
  "id",
  "inert",
  "inputmode",
  "integrity",
  "ismap",
  "kind",
  "label",
  "lang",
  "list",
  "loading",
  "loop",
  "low",
  "max",
  "maxlength",
  "media",
  "method",
  "min",
  "minlength",
  "multiple",
  "muted",
  "name",
  "nonce",
  "noshade",
  "novalidate",
  "nowrap",
  "open",
  "optimum",
  "part",
  "pattern",
  "placeholder",
  "playsinline",
  "popover",
  "popovertarget",
  "popovertargetaction",
  "poster",
  "preload",
  "pubdate",
  "radiogroup",
  "readonly",
  "rel",
  "required",
  "rev",
  "reversed",
  "role",
  "rows",
  "rowspan",
  "spellcheck",
  "scope",
  "selected",
  "shape",
  "size",
  "sizes",
  "slot",
  "span",
  "srclang",
  "start",
  "src",
  "srcset",
  "step",
  "style",
  "summary",
  "tabindex",
  "title",
  "translate",
  "type",
  "usemap",
  "valign",
  "value",
  "width",
  "wrap",
  "xmlns"
]);
var svg = freeze([
  "accent-height",
  "accumulate",
  "additive",
  "alignment-baseline",
  "amplitude",
  "ascent",
  "attributename",
  "attributetype",
  "azimuth",
  "basefrequency",
  "baseline-shift",
  "begin",
  "bias",
  "by",
  "class",
  "clip",
  "clippathunits",
  "clip-path",
  "clip-rule",
  "color",
  "color-interpolation",
  "color-interpolation-filters",
  "color-profile",
  "color-rendering",
  "cx",
  "cy",
  "d",
  "dx",
  "dy",
  "diffuseconstant",
  "direction",
  "display",
  "divisor",
  "dominant-baseline",
  "dur",
  "edgemode",
  "elevation",
  "end",
  "exponent",
  "fill",
  "fill-opacity",
  "fill-rule",
  "filter",
  "filterunits",
  "flood-color",
  "flood-opacity",
  "font-family",
  "font-size",
  "font-size-adjust",
  "font-stretch",
  "font-style",
  "font-variant",
  "font-weight",
  "fx",
  "fy",
  "g1",
  "g2",
  "glyph-name",
  "glyphref",
  "gradientunits",
  "gradienttransform",
  "height",
  "href",
  "id",
  "image-rendering",
  "in",
  "in2",
  "intercept",
  "k",
  "k1",
  "k2",
  "k3",
  "k4",
  "kerning",
  "keypoints",
  "keysplines",
  "keytimes",
  "lang",
  "lengthadjust",
  "letter-spacing",
  "kernelmatrix",
  "kernelunitlength",
  "lighting-color",
  "local",
  "marker-end",
  "marker-mid",
  "marker-start",
  "markerheight",
  "markerunits",
  "markerwidth",
  "maskcontentunits",
  "maskunits",
  "max",
  "mask",
  "mask-type",
  "media",
  "method",
  "mode",
  "min",
  "name",
  "numoctaves",
  "offset",
  "operator",
  "opacity",
  "order",
  "orient",
  "orientation",
  "origin",
  "overflow",
  "paint-order",
  "path",
  "pathlength",
  "patterncontentunits",
  "patterntransform",
  "patternunits",
  "pointer-events",
  "points",
  "preservealpha",
  "preserveaspectratio",
  "primitiveunits",
  "r",
  "rx",
  "ry",
  "radius",
  "refx",
  "refy",
  "repeatcount",
  "repeatdur",
  "restart",
  "result",
  "rotate",
  "scale",
  "seed",
  "shape-rendering",
  "slope",
  "specularconstant",
  "specularexponent",
  "spreadmethod",
  "startoffset",
  "stddeviation",
  "stitchtiles",
  "stop-color",
  "stop-opacity",
  "stroke-dasharray",
  "stroke-dashoffset",
  "stroke-linecap",
  "stroke-linejoin",
  "stroke-miterlimit",
  "stroke-opacity",
  "stroke",
  "stroke-width",
  "style",
  "surfacescale",
  "systemlanguage",
  "tabindex",
  "tablevalues",
  "targetx",
  "targety",
  "transform",
  "transform-origin",
  "text-anchor",
  "text-decoration",
  "text-orientation",
  "text-rendering",
  "textlength",
  "type",
  "u1",
  "u2",
  "unicode",
  "values",
  "vector-effect",
  "viewbox",
  "visibility",
  "version",
  "vert-adv-y",
  "vert-origin-x",
  "vert-origin-y",
  "width",
  "word-spacing",
  "wrap",
  "writing-mode",
  "xchannelselector",
  "ychannelselector",
  "x",
  "x1",
  "x2",
  "xmlns",
  "y",
  "y1",
  "y2",
  "z",
  "zoomandpan"
]);
var mathMl = freeze([
  "accent",
  "accentunder",
  "align",
  "bevelled",
  "close",
  "columnalign",
  "columnlines",
  "columnspacing",
  "columnspan",
  "denomalign",
  "depth",
  "dir",
  "display",
  "displaystyle",
  "encoding",
  "fence",
  "frame",
  "height",
  "href",
  "id",
  "largeop",
  "length",
  "linethickness",
  "lquote",
  "lspace",
  "mathbackground",
  "mathcolor",
  "mathsize",
  "mathvariant",
  "maxsize",
  "minsize",
  "movablelimits",
  "notation",
  "numalign",
  "open",
  "rowalign",
  "rowlines",
  "rowspacing",
  "rowspan",
  "rspace",
  "rquote",
  "scriptlevel",
  "scriptminsize",
  "scriptsizemultiplier",
  "selection",
  "separator",
  "separators",
  "stretchy",
  "subscriptshift",
  "supscriptshift",
  "symmetric",
  "voffset",
  "width",
  "xmlns"
]);
var xml = freeze([
  "xlink:href",
  "xml:id",
  "xlink:title",
  "xml:space",
  "xmlns:xlink"
]);
var MUSTACHE_EXPR = seal(/{{[\w\W]*|^[\w\W]*}}/g);
var ERB_EXPR = seal(/<%[\w\W]*|^[\w\W]*%>/g);
var TMPLIT_EXPR = seal(/\${[\w\W]*/g);
var TMPL_MARKER_SERIALIZED = seal(/{{|}}|\${|<%|%>|&lt;%|%&gt;/);
var DATA_ATTR = seal(/^data-[\-\w.\u00B7-\uFFFF]+$/);
var ARIA_ATTR = seal(/^aria-[\-\w]+$/);
var IS_ALLOWED_URI = seal(/^(?:(?:(?:f|ht)tps?|mailto|tel|callto|sms|cid|xmpp|matrix):|[^a-z]|[a-z+.\-]+(?:[^a-z+.\-:]|$))/i);
var IS_SCRIPT_OR_DATA = seal(/^(?:\w+script|data):/i);
var ATTR_WHITESPACE = seal(/[\u0000-\u0020\u00A0\u1680\u180E\u2000-\u2029\u205F\u3000]/g);
var DOCTYPE_NAME = seal(/^html$/i);
var CUSTOM_ELEMENT = seal(/^[a-z][.\w]*(-[.\w]+)+$/i);
var ELEMENT_MARKUP_PROBE = seal(/<[/\w!]/g);
var COMMENT_MARKUP_PROBE = seal(/<[/\w]/g);
var FALLBACK_TAG_CLOSE = seal(/<\/no(script|embed|frames)/i);
var SELF_CLOSING_TAG = seal(/\/>/i);
var ATTR_VALUE_BREAKOUT = seal(/((--!?|])>)|<\/(style|script|title|xmp|textarea|noscript|iframe|noembed|noframes)/i);
var LEADING_WHITESPACE = seal(/^[\r\n\t ]+/);
var NODE_TYPE = {
  element: 1,
  text: 3,
  processingInstruction: 7,
  comment: 8,
  document: 9,
  documentFragment: 11
};
var LITERAL_TEXT_ELEMENTS = freeze(addToSet({}, [
  "style",
  "script",
  "xmp",
  "iframe",
  "noembed",
  "noframes",
  "plaintext",
  "noscript"
]));
var getGlobal = function getGlobal2() {
  return typeof window === "undefined" ? null : window;
};
var _createTrustedTypesPolicy = function _createTrustedTypesPolicy2(trustedTypes, purifyHostElement) {
  if (typeof trustedTypes !== "object" || typeof trustedTypes.createPolicy !== "function") return null;
  let suffix = null;
  const ATTR_NAME = "data-tt-policy-suffix";
  if (purifyHostElement && purifyHostElement.hasAttribute(ATTR_NAME)) suffix = purifyHostElement.getAttribute(ATTR_NAME);
  const policyName = "dompurify" + (suffix ? "#" + suffix : "");
  try {
    return trustedTypes.createPolicy(policyName, {
      createHTML(html3) {
        return html3;
      },
      createScriptURL(scriptUrl) {
        return scriptUrl;
      }
    });
  } catch (_) {
    console.warn("TrustedTypes policy " + policyName + " could not be created.");
    return null;
  }
};
var _createHooksMap = function _createHooksMap2() {
  return {
    afterSanitizeAttributes: [],
    afterSanitizeElements: [],
    afterSanitizeShadowDOM: [],
    beforeSanitizeAttributes: [],
    beforeSanitizeElements: [],
    beforeSanitizeShadowDOM: [],
    uponSanitizeAttribute: [],
    uponSanitizeElement: [],
    uponSanitizeShadowNode: []
  };
};
var _resolveSetOption = function _resolveSetOption2(cfg, key, fallback, options2) {
  return objectHasOwnProperty(cfg, key) && arrayIsArray(cfg[key]) ? addToSet(options2.base ? cloneSet(options2.base) : {}, cfg[key], options2.transform) : fallback;
};
var _resolveObjectOption = function _resolveObjectOption2(cfg, key, fallback) {
  const value = objectHasOwnProperty(cfg, key) ? cfg[key] : void 0;
  return value && typeof value === "object" ? clone(value) : fallback;
};
function createDOMPurify() {
  let window2 = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : getGlobal();
  const DOMPurify = (root) => createDOMPurify(root);
  DOMPurify.version = "3.4.18";
  DOMPurify.removed = [];
  if (!window2 || !window2.document || window2.document.nodeType !== NODE_TYPE.document || !window2.Element) {
    DOMPurify.isSupported = false;
    return DOMPurify;
  }
  let document2 = window2.document;
  const originalDocument = document2;
  const currentScript = originalDocument.currentScript;
  const HTMLTemplateElement = window2.HTMLTemplateElement, Node = window2.Node, Element2 = window2.Element, NodeFilter2 = window2.NodeFilter, DOMParser = window2.DOMParser, trustedTypes = window2.trustedTypes;
  const ElementPrototype = Element2.prototype;
  const cloneNode = lookupGetter(ElementPrototype, "cloneNode");
  const remove = lookupGetter(ElementPrototype, "remove");
  const removeAttributeNode = lookupGetter(ElementPrototype, "removeAttributeNode");
  const getNextSibling = lookupGetter(ElementPrototype, "nextSibling");
  const getChildNodes = lookupGetter(ElementPrototype, "childNodes");
  const getParentNode = lookupGetter(ElementPrototype, "parentNode");
  const getShadowRoot = lookupGetter(ElementPrototype, "shadowRoot");
  const getAttributes = lookupGetter(ElementPrototype, "attributes");
  const getNodeType = Node && Node.prototype ? lookupGetter(Node.prototype, "nodeType") : null;
  const getNodeName = Node && Node.prototype ? lookupGetter(Node.prototype, "nodeName") : null;
  const getOwnerDocument = Node && Node.prototype ? lookupGetter(Node.prototype, "ownerDocument") : null;
  const _readNodeType = function _readNodeType2(node) {
    return getNodeType ? getNodeType(node) : node.nodeType;
  };
  const _readNodeName = function _readNodeName2(node) {
    return getNodeName ? getNodeName(node) : node.nodeName;
  };
  const getNamespaceURI = lookupAccessor(ElementPrototype, "namespaceURI");
  const _readNamespaceURI = function _readNamespaceURI2(element) {
    return getNamespaceURI ? getNamespaceURI(element) : element.namespaceURI;
  };
  if (typeof HTMLTemplateElement === "function") {
    const template = document2.createElement("template");
    if (template.content && template.content.ownerDocument) document2 = template.content.ownerDocument;
  }
  let trustedTypesPolicy;
  let emptyHTML = "";
  let defaultTrustedTypesPolicy;
  let defaultTrustedTypesPolicyResolved = false;
  let IN_TRUSTED_TYPES_POLICY = 0;
  const _assertNotInTrustedTypesPolicy = function _assertNotInTrustedTypesPolicy2() {
    if (IN_TRUSTED_TYPES_POLICY > 0) throw typeErrorCreate('A configured TRUSTED_TYPES_POLICY callback (createHTML or createScriptURL) must not call DOMPurify.sanitize, as that causes infinite recursion. Do not pass a policy whose callbacks wrap DOMPurify as TRUSTED_TYPES_POLICY; see the "DOMPurify and Trusted Types" section of the README.');
  };
  const _createTrustedHTML = function _createTrustedHTML2(html3) {
    _assertNotInTrustedTypesPolicy();
    IN_TRUSTED_TYPES_POLICY++;
    try {
      return trustedTypesPolicy.createHTML(html3);
    } finally {
      IN_TRUSTED_TYPES_POLICY--;
    }
  };
  const _signOutput = function _signOutput2(html3) {
    return trustedTypesPolicy && RETURN_TRUSTED_TYPE ? _createTrustedHTML(html3) : html3;
  };
  const _createTrustedScriptURL = function _createTrustedScriptURL2(scriptUrl) {
    _assertNotInTrustedTypesPolicy();
    IN_TRUSTED_TYPES_POLICY++;
    try {
      return trustedTypesPolicy.createScriptURL(scriptUrl);
    } finally {
      IN_TRUSTED_TYPES_POLICY--;
    }
  };
  const _getDefaultTrustedTypesPolicy = function _getDefaultTrustedTypesPolicy2() {
    if (!defaultTrustedTypesPolicyResolved) {
      defaultTrustedTypesPolicy = _createTrustedTypesPolicy(trustedTypes, currentScript);
      defaultTrustedTypesPolicyResolved = true;
    }
    return defaultTrustedTypesPolicy;
  };
  const _document = document2, implementation = _document.implementation, createNodeIterator = _document.createNodeIterator, createDocumentFragment = _document.createDocumentFragment, getElementsByTagName = _document.getElementsByTagName;
  const importNode = originalDocument.importNode;
  let hooks = _createHooksMap();
  DOMPurify.isSupported = typeof entries === "function" && typeof getParentNode === "function" && implementation && implementation.createHTMLDocument !== void 0;
  const MUSTACHE_EXPR$1 = MUSTACHE_EXPR, ERB_EXPR$1 = ERB_EXPR, TMPLIT_EXPR$1 = TMPLIT_EXPR, DATA_ATTR$1 = DATA_ATTR, ARIA_ATTR$1 = ARIA_ATTR, IS_SCRIPT_OR_DATA$1 = IS_SCRIPT_OR_DATA, ATTR_WHITESPACE$1 = ATTR_WHITESPACE, CUSTOM_ELEMENT$1 = CUSTOM_ELEMENT;
  let IS_ALLOWED_URI$1 = IS_ALLOWED_URI;
  let ALLOWED_TAGS = null;
  const DEFAULT_ALLOWED_TAGS = addToSet({}, [
    ...html$1,
    ...svg$1,
    ...svgFilters,
    ...mathMl$1,
    ...text
  ]);
  let ALLOWED_ATTR = null;
  const DEFAULT_ALLOWED_ATTR = addToSet({}, [
    ...html2,
    ...svg,
    ...mathMl,
    ...xml
  ]);
  let CUSTOM_ELEMENT_HANDLING = null;
  let FORBID_TAGS = null;
  let FORBID_ATTR = null;
  const EXTRA_ELEMENT_HANDLING = Object.seal(create(null, {
    tagCheck: {
      writable: true,
      configurable: false,
      enumerable: true,
      value: null
    },
    attributeCheck: {
      writable: true,
      configurable: false,
      enumerable: true,
      value: null
    }
  }));
  let ALLOW_ARIA_ATTR = true;
  let ALLOW_DATA_ATTR = true;
  let ALLOW_UNKNOWN_PROTOCOLS = false;
  let ALLOW_SELF_CLOSE_IN_ATTR = true;
  let SAFE_FOR_TEMPLATES = false;
  let SAFE_FOR_XML = true;
  let WHOLE_DOCUMENT = false;
  let SET_CONFIG = false;
  let SET_CONFIG_ALLOWED_TAGS = null;
  let SET_CONFIG_ALLOWED_ATTR = null;
  let FORCE_BODY = false;
  let RETURN_DOM = false;
  let RETURN_DOM_FRAGMENT = false;
  let RETURN_TRUSTED_TYPE = false;
  let SANITIZE_DOM = true;
  let SANITIZE_NAMED_PROPS = false;
  const SANITIZE_NAMED_PROPS_PREFIX = "user-content-";
  let KEEP_CONTENT = true;
  let IN_PLACE = false;
  let IN_PLACE_VISITED = null;
  let USE_PROFILES = false;
  let FORBID_CONTENTS = null;
  const DEFAULT_FORBID_CONTENTS = addToSet({}, [
    "annotation-xml",
    "audio",
    "colgroup",
    "desc",
    "foreignobject",
    "head",
    "iframe",
    "math",
    "mi",
    "mn",
    "mo",
    "ms",
    "mtext",
    "noembed",
    "noframes",
    "noscript",
    "plaintext",
    "script",
    "selectedcontent",
    "style",
    "svg",
    "template",
    "thead",
    "title",
    "video",
    "xmp"
  ]);
  let DATA_URI_TAGS = null;
  const DEFAULT_DATA_URI_TAGS = addToSet({}, [
    "audio",
    "video",
    "img",
    "source",
    "image",
    "track"
  ]);
  let URI_SAFE_ATTRIBUTES = null;
  const DEFAULT_URI_SAFE_ATTRIBUTES = addToSet({}, [
    "alt",
    "class",
    "for",
    "id",
    "label",
    "name",
    "pattern",
    "placeholder",
    "role",
    "summary",
    "title",
    "value",
    "style",
    "xmlns"
  ]);
  const MATHML_NAMESPACE = "http://www.w3.org/1998/Math/MathML";
  const SVG_NAMESPACE = "http://www.w3.org/2000/svg";
  const HTML_NAMESPACE = "http://www.w3.org/1999/xhtml";
  let NAMESPACE = HTML_NAMESPACE;
  let IS_EMPTY_INPUT = false;
  let ALLOWED_NAMESPACES = null;
  const DEFAULT_ALLOWED_NAMESPACES = addToSet({}, [
    MATHML_NAMESPACE,
    SVG_NAMESPACE,
    HTML_NAMESPACE
  ], stringToString);
  const DEFAULT_MATHML_TEXT_INTEGRATION_POINTS = freeze(addToSet({}, [
    "mi",
    "mo",
    "mn",
    "ms",
    "mtext"
  ]));
  let MATHML_TEXT_INTEGRATION_POINTS = null;
  const DEFAULT_HTML_INTEGRATION_POINTS = freeze(addToSet({}, ["annotation-xml"]));
  let HTML_INTEGRATION_POINTS = null;
  const DEFAULT_CUSTOM_ELEMENT_HANDLING = freeze(create(null));
  const COMMON_SVG_AND_HTML_ELEMENTS = addToSet({}, [
    "title",
    "style",
    "font",
    "a",
    "script"
  ]);
  let PARSER_MEDIA_TYPE = null;
  const SUPPORTED_PARSER_MEDIA_TYPES = ["application/xhtml+xml", "text/html"];
  const DEFAULT_PARSER_MEDIA_TYPE = "text/html";
  let transformCaseFunc = null;
  let CONFIG = null;
  const formElement = document2.createElement("form");
  const isRegexOrFunction = function isRegexOrFunction2(testValue) {
    return testValue instanceof RegExp || testValue instanceof Function;
  };
  const _parseConfig = function _parseConfig2() {
    let cfg = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {};
    if (!cfg || typeof cfg !== "object") cfg = {};
    cfg = clone(cfg);
    PARSER_MEDIA_TYPE = SUPPORTED_PARSER_MEDIA_TYPES.indexOf(cfg.PARSER_MEDIA_TYPE) === -1 ? DEFAULT_PARSER_MEDIA_TYPE : cfg.PARSER_MEDIA_TYPE;
    transformCaseFunc = PARSER_MEDIA_TYPE === "application/xhtml+xml" ? stringToString : stringToLowerCase;
    ALLOWED_TAGS = _resolveSetOption(cfg, "ALLOWED_TAGS", DEFAULT_ALLOWED_TAGS, { transform: transformCaseFunc });
    ALLOWED_ATTR = _resolveSetOption(cfg, "ALLOWED_ATTR", DEFAULT_ALLOWED_ATTR, { transform: transformCaseFunc });
    ALLOWED_NAMESPACES = _resolveSetOption(cfg, "ALLOWED_NAMESPACES", DEFAULT_ALLOWED_NAMESPACES, { transform: stringToString });
    URI_SAFE_ATTRIBUTES = _resolveSetOption(cfg, "ADD_URI_SAFE_ATTR", DEFAULT_URI_SAFE_ATTRIBUTES, {
      transform: transformCaseFunc,
      base: DEFAULT_URI_SAFE_ATTRIBUTES
    });
    DATA_URI_TAGS = _resolveSetOption(cfg, "ADD_DATA_URI_TAGS", DEFAULT_DATA_URI_TAGS, {
      transform: transformCaseFunc,
      base: DEFAULT_DATA_URI_TAGS
    });
    FORBID_CONTENTS = _resolveSetOption(cfg, "FORBID_CONTENTS", DEFAULT_FORBID_CONTENTS, { transform: transformCaseFunc });
    FORBID_TAGS = _resolveSetOption(cfg, "FORBID_TAGS", create(null), { transform: transformCaseFunc });
    FORBID_ATTR = _resolveSetOption(cfg, "FORBID_ATTR", create(null), { transform: transformCaseFunc });
    USE_PROFILES = objectHasOwnProperty(cfg, "USE_PROFILES") ? cfg.USE_PROFILES && typeof cfg.USE_PROFILES === "object" ? clone(cfg.USE_PROFILES) : cfg.USE_PROFILES : false;
    ALLOW_ARIA_ATTR = cfg.ALLOW_ARIA_ATTR !== false;
    ALLOW_DATA_ATTR = cfg.ALLOW_DATA_ATTR !== false;
    ALLOW_UNKNOWN_PROTOCOLS = cfg.ALLOW_UNKNOWN_PROTOCOLS || false;
    ALLOW_SELF_CLOSE_IN_ATTR = cfg.ALLOW_SELF_CLOSE_IN_ATTR !== false;
    SAFE_FOR_TEMPLATES = cfg.SAFE_FOR_TEMPLATES || false;
    SAFE_FOR_XML = cfg.SAFE_FOR_XML !== false;
    WHOLE_DOCUMENT = cfg.WHOLE_DOCUMENT || false;
    RETURN_DOM = cfg.RETURN_DOM || false;
    RETURN_DOM_FRAGMENT = cfg.RETURN_DOM_FRAGMENT || false;
    RETURN_TRUSTED_TYPE = cfg.RETURN_TRUSTED_TYPE || false;
    FORCE_BODY = cfg.FORCE_BODY || false;
    SANITIZE_DOM = cfg.SANITIZE_DOM !== false;
    SANITIZE_NAMED_PROPS = cfg.SANITIZE_NAMED_PROPS || false;
    KEEP_CONTENT = cfg.KEEP_CONTENT !== false;
    IN_PLACE = cfg.IN_PLACE || false;
    IS_ALLOWED_URI$1 = isRegex(cfg.ALLOWED_URI_REGEXP) ? cfg.ALLOWED_URI_REGEXP : IS_ALLOWED_URI;
    NAMESPACE = typeof cfg.NAMESPACE === "string" ? cfg.NAMESPACE : HTML_NAMESPACE;
    MATHML_TEXT_INTEGRATION_POINTS = _resolveObjectOption(cfg, "MATHML_TEXT_INTEGRATION_POINTS", DEFAULT_MATHML_TEXT_INTEGRATION_POINTS);
    HTML_INTEGRATION_POINTS = _resolveObjectOption(cfg, "HTML_INTEGRATION_POINTS", DEFAULT_HTML_INTEGRATION_POINTS);
    const customElementHandling = _resolveObjectOption(cfg, "CUSTOM_ELEMENT_HANDLING", DEFAULT_CUSTOM_ELEMENT_HANDLING);
    CUSTOM_ELEMENT_HANDLING = create(null);
    if (objectHasOwnProperty(customElementHandling, "tagNameCheck") && isRegexOrFunction(customElementHandling.tagNameCheck)) CUSTOM_ELEMENT_HANDLING.tagNameCheck = customElementHandling.tagNameCheck;
    if (objectHasOwnProperty(customElementHandling, "attributeNameCheck") && isRegexOrFunction(customElementHandling.attributeNameCheck)) CUSTOM_ELEMENT_HANDLING.attributeNameCheck = customElementHandling.attributeNameCheck;
    if (objectHasOwnProperty(customElementHandling, "allowCustomizedBuiltInElements") && typeof customElementHandling.allowCustomizedBuiltInElements === "boolean") CUSTOM_ELEMENT_HANDLING.allowCustomizedBuiltInElements = customElementHandling.allowCustomizedBuiltInElements;
    seal(CUSTOM_ELEMENT_HANDLING);
    if (SAFE_FOR_TEMPLATES) ALLOW_DATA_ATTR = false;
    if (RETURN_DOM_FRAGMENT) RETURN_DOM = true;
    if (USE_PROFILES) {
      if ((objectHasOwnProperty(cfg, "ALLOWED_TAGS") || objectHasOwnProperty(cfg, "ALLOWED_ATTR")) && typeof console !== "undefined" && typeof console.warn === "function") console.warn("DOMPurify: USE_PROFILES overrides ALLOWED_TAGS and ALLOWED_ATTR. Do not use these options together.");
      ALLOWED_TAGS = addToSet({}, text);
      ALLOWED_ATTR = create(null);
      if (USE_PROFILES.html === true) {
        addToSet(ALLOWED_TAGS, html$1);
        addToSet(ALLOWED_ATTR, html2);
      }
      if (USE_PROFILES.svg === true) {
        addToSet(ALLOWED_TAGS, svg$1);
        addToSet(ALLOWED_ATTR, svg);
        addToSet(ALLOWED_ATTR, xml);
      }
      if (USE_PROFILES.svgFilters === true) {
        addToSet(ALLOWED_TAGS, svgFilters);
        addToSet(ALLOWED_ATTR, svg);
        addToSet(ALLOWED_ATTR, xml);
      }
      if (USE_PROFILES.mathMl === true) {
        addToSet(ALLOWED_TAGS, mathMl$1);
        addToSet(ALLOWED_ATTR, mathMl);
        addToSet(ALLOWED_ATTR, xml);
      }
    }
    EXTRA_ELEMENT_HANDLING.tagCheck = null;
    EXTRA_ELEMENT_HANDLING.attributeCheck = null;
    if (objectHasOwnProperty(cfg, "ADD_TAGS")) {
      if (typeof cfg.ADD_TAGS === "function") EXTRA_ELEMENT_HANDLING.tagCheck = cfg.ADD_TAGS;
      else if (arrayIsArray(cfg.ADD_TAGS)) {
        if (ALLOWED_TAGS === DEFAULT_ALLOWED_TAGS) ALLOWED_TAGS = cloneSet(ALLOWED_TAGS);
        addToSet(ALLOWED_TAGS, cfg.ADD_TAGS, transformCaseFunc);
      }
    }
    if (objectHasOwnProperty(cfg, "ADD_ATTR")) {
      if (typeof cfg.ADD_ATTR === "function") EXTRA_ELEMENT_HANDLING.attributeCheck = cfg.ADD_ATTR;
      else if (arrayIsArray(cfg.ADD_ATTR)) {
        if (ALLOWED_ATTR === DEFAULT_ALLOWED_ATTR) ALLOWED_ATTR = cloneSet(ALLOWED_ATTR);
        addToSet(ALLOWED_ATTR, cfg.ADD_ATTR, transformCaseFunc);
      }
    }
    if (objectHasOwnProperty(cfg, "ADD_FORBID_CONTENTS") && arrayIsArray(cfg.ADD_FORBID_CONTENTS)) {
      if (FORBID_CONTENTS === DEFAULT_FORBID_CONTENTS) FORBID_CONTENTS = cloneSet(FORBID_CONTENTS);
      addToSet(FORBID_CONTENTS, cfg.ADD_FORBID_CONTENTS, transformCaseFunc);
    }
    if (KEEP_CONTENT) ALLOWED_TAGS["#text"] = true;
    if (WHOLE_DOCUMENT) addToSet(ALLOWED_TAGS, [
      "html",
      "head",
      "body"
    ]);
    if (ALLOWED_TAGS.table) {
      ALLOWED_TAGS.tbody = true;
      delete FORBID_TAGS.tbody;
    }
    if (cfg.TRUSTED_TYPES_POLICY) {
      if (typeof cfg.TRUSTED_TYPES_POLICY.createHTML !== "function") throw typeErrorCreate('TRUSTED_TYPES_POLICY configuration option must provide a "createHTML" hook.');
      if (typeof cfg.TRUSTED_TYPES_POLICY.createScriptURL !== "function") throw typeErrorCreate('TRUSTED_TYPES_POLICY configuration option must provide a "createScriptURL" hook.');
      const previousTrustedTypesPolicy = trustedTypesPolicy;
      trustedTypesPolicy = cfg.TRUSTED_TYPES_POLICY;
      try {
        emptyHTML = _createTrustedHTML("");
      } catch (error) {
        trustedTypesPolicy = previousTrustedTypesPolicy;
        throw error;
      }
    } else if (cfg.TRUSTED_TYPES_POLICY === null) {
      trustedTypesPolicy = void 0;
      emptyHTML = "";
    } else {
      if (trustedTypesPolicy === void 0) trustedTypesPolicy = _getDefaultTrustedTypesPolicy();
      if (trustedTypesPolicy && typeof emptyHTML === "string") emptyHTML = _createTrustedHTML("");
    }
    CONFIG = freeze(cfg);
  };
  const ALL_SVG_TAGS = addToSet({}, [
    ...svg$1,
    ...svgFilters,
    ...svgDisallowed
  ]);
  const ALL_MATHML_TAGS = addToSet({}, [...mathMl$1, ...mathMlDisallowed]);
  const _checkSvgNamespace = function _checkSvgNamespace2(tagName, parentNamespace, parentTagName) {
    if (parentNamespace === HTML_NAMESPACE) return tagName === "svg";
    if (parentNamespace === MATHML_NAMESPACE) return tagName === "svg" && (parentTagName === "annotation-xml" || MATHML_TEXT_INTEGRATION_POINTS[parentTagName]);
    return Boolean(ALL_SVG_TAGS[tagName]);
  };
  const _checkMathMlNamespace = function _checkMathMlNamespace2(tagName, parentNamespace, parentTagName) {
    if (parentNamespace === HTML_NAMESPACE) return tagName === "math";
    if (parentNamespace === SVG_NAMESPACE) return tagName === "math" && HTML_INTEGRATION_POINTS[parentTagName];
    return Boolean(ALL_MATHML_TAGS[tagName]);
  };
  const _checkHtmlNamespace = function _checkHtmlNamespace2(tagName, parentNamespace, parentTagName) {
    if (parentNamespace === SVG_NAMESPACE && !HTML_INTEGRATION_POINTS[parentTagName]) return false;
    if (parentNamespace === MATHML_NAMESPACE && !MATHML_TEXT_INTEGRATION_POINTS[parentTagName]) return false;
    return !ALL_MATHML_TAGS[tagName] && (COMMON_SVG_AND_HTML_ELEMENTS[tagName] || !ALL_SVG_TAGS[tagName]);
  };
  const _checkValidNamespace = function _checkValidNamespace2(element) {
    const elementNamespace = _readNamespaceURI(element);
    const tagName = stringToLowerCase(_readNodeName(element));
    const parentNode = getParentNode(element);
    let parentNamespace = NAMESPACE;
    let parentTagName = "template";
    if (parentNode && _readNodeType(parentNode) === NODE_TYPE.element) {
      parentNamespace = _readNamespaceURI(parentNode);
      parentTagName = stringToLowerCase(_readNodeName(parentNode));
    }
    if (!ALLOWED_NAMESPACES[elementNamespace]) return false;
    if (elementNamespace === SVG_NAMESPACE) return _checkSvgNamespace(tagName, parentNamespace, parentTagName);
    if (elementNamespace === MATHML_NAMESPACE) return _checkMathMlNamespace(tagName, parentNamespace, parentTagName);
    if (elementNamespace === HTML_NAMESPACE) return _checkHtmlNamespace(tagName, parentNamespace, parentTagName);
    return PARSER_MEDIA_TYPE === "application/xhtml+xml";
  };
  const _forceRemove = function _forceRemove2(node) {
    arrayPush(DOMPurify.removed, { element: node });
    try {
      getParentNode(node).removeChild(node);
    } catch (_) {
      remove(node);
      if (!getParentNode(node)) throw typeErrorCreate("a node selected for removal could not be detached from its tree and cannot be safely returned; refusing to sanitize in place");
    }
  };
  const _stripAttributeNode = function _stripAttributeNode2(element, attribute, name) {
    try {
      removeAttributeNode(element, attribute);
    } catch (_) {
      try {
        element.removeAttribute(name);
      } catch (_2) {
      }
    }
  };
  const _neutralizeRoot = function _neutralizeRoot2(root) {
    _neutralizeSubtree(root);
    const childNodes = getChildNodes(root);
    if (childNodes) arrayForEach(arraySlice(childNodes), (child) => {
      try {
        remove(child);
      } catch (_) {
      }
    });
    if (_readNodeType(root) === NODE_TYPE.element) _stripAttributes(root, false);
  };
  const _removeAttribute = function _removeAttribute2(name, element, attr) {
    if (!attr) try {
      attr = element.getAttributeNode(name);
    } catch (_) {
      attr = null;
    }
    arrayPush(DOMPurify.removed, {
      attribute: attr || null,
      from: element
    });
    if (attr) _stripAttributeNode(element, attr, name);
    else try {
      element.removeAttribute(name);
    } catch (_) {
    }
    if (name === "is") {
      if (RETURN_DOM || RETURN_DOM_FRAGMENT) try {
        _forceRemove(element);
      } catch (_) {
      }
      else try {
        element.setAttribute(name, "");
      } catch (_) {
      }
    }
  };
  const _stripAttributes = function _stripAttributes2(element, keepAllowed) {
    const attributes = getAttributes(element);
    if (!attributes) return;
    for (let i = attributes.length - 1; i >= 0; --i) {
      const attribute = attributes[i];
      const name = attribute && attribute.name;
      if (typeof name === "string" && !(keepAllowed && ALLOWED_ATTR[transformCaseFunc(name)])) _stripAttributeNode(element, attribute, name);
    }
  };
  const _walkTree = function _walkTree2(root, visit) {
    let intoShadow = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : false;
    const stack = [root];
    while (stack.length > 0) {
      const node = stack.pop();
      if (visit(node) === false) continue;
      if (intoShadow && _readNodeType(node) === NODE_TYPE.element) {
        const shadowRoot = getShadowRoot(node);
        if (_isDocumentFragment(shadowRoot)) stack.push(shadowRoot);
      }
      const childNodes = getChildNodes(node);
      if (childNodes) for (let i = childNodes.length - 1; i >= 0; --i) stack.push(childNodes[i]);
    }
  };
  const _neutralizeSubtree = function _neutralizeSubtree2(root) {
    _walkTree(root, (node) => {
      if (_readNodeType(node) === NODE_TYPE.element) _stripAttributes(node, true);
    });
  };
  const _collectLiveNodes = function _collectLiveNodes2(root) {
    const nodes = [];
    _walkTree(root, (node) => {
      nodes.push(node);
    }, true);
    return nodes;
  };
  const _neutralizeEscapedElements = function _neutralizeEscapedElements2(root, before) {
    const reachable = setCreate();
    arrayForEach(_collectLiveNodes(root), (node) => {
      if (_readNodeType(node) === NODE_TYPE.element) setAdd(reachable, node);
    });
    arrayForEach(before, (node) => {
      if (_readNodeType(node) === NODE_TYPE.element && !setHas(reachable, node)) _stripAttributes(node, true);
    });
  };
  const _neutralizeDiscarded = function _neutralizeDiscarded2(root, before) {
    let rootRemoved = false;
    arrayForEach(DOMPurify.removed, (entry) => {
      if (entry.element) {
        rootRemoved = rootRemoved || entry.element === root;
        _neutralizeSubtree(entry.element);
      }
    });
    _neutralizeEscapedElements(root, before);
    return rootRemoved;
  };
  const MAX_UNVISITED_ROUNDS = 8;
  const _sanitizeUnvisitedNodes = function _sanitizeUnvisitedNodes2(root, before) {
    const visited = IN_PLACE_VISITED;
    let original = null;
    const getOriginal = () => {
      if (!original) {
        original = setCreate();
        arrayForEach(before, (beforeNode) => {
          setAdd(original, beforeNode);
        });
      }
      return original;
    };
    for (let round = 0; ; round++) {
      const live = _collectLiveNodes(root);
      const containers = [root];
      let pending = false;
      arrayForEach(live, (node) => {
        if (_readNodeType(node) === NODE_TYPE.documentFragment) arrayPush(containers, node);
        else if (!pending && !setHas(visited, node)) pending = setHas(getOriginal(), node);
      });
      if (!pending) return;
      if (round >= MAX_UNVISITED_ROUNDS) throw typeErrorCreate("the tree kept changing during in-place sanitization; refusing to return it");
      arrayForEach(containers, (container, index) => {
        _sanitizeUnvisitedIn(container, index > 0, root, getOriginal());
      });
    }
  };
  const _sanitizeUnvisitedIn = function _sanitizeUnvisitedIn2(container, inShadow, root, original) {
    const iterator = _createNodeIterator(container);
    let node;
    while (node = iterator.nextNode()) {
      if (!setHas(original, node) || setHas(IN_PLACE_VISITED, node)) continue;
      if (inShadow) _executeHooks(hooks.uponSanitizeShadowNode, node, null);
      _sanitizeNode(node, root);
    }
  };
  const _markVisited = function _markVisited2(node) {
    if (IN_PLACE_VISITED) setAdd(IN_PLACE_VISITED, node);
  };
  const _isPatchLinkageAttribute = function _isPatchLinkageAttribute2(lcName, lcTag) {
    if (!SAFE_FOR_XML) return false;
    if (lcName === "patchsrc") return true;
    return lcName === "for" && lcTag !== "label" && lcTag !== "output";
  };
  const _neutralizePatchLinkage = function _neutralizePatchLinkage2(root) {
    if (!SAFE_FOR_XML) return;
    _walkTree(root, (node) => {
      const nodeType = _readNodeType(node);
      if (nodeType === NODE_TYPE.processingInstruction || nodeType === NODE_TYPE.comment && regExpTest(COMMENT_MARKUP_PROBE, node.data)) {
        try {
          remove(node);
        } catch (_) {
        }
        return false;
      }
      if (nodeType === NODE_TYPE.element) {
        const element = node;
        const lcTag = transformCaseFunc(_readNodeName(node));
        try {
          if (element.hasAttribute && element.hasAttribute("patchsrc")) element.removeAttribute("patchsrc");
          if (element.hasAttribute && element.hasAttribute("for") && _isPatchLinkageAttribute("for", lcTag)) element.removeAttribute("for");
        } catch (_) {
        }
      }
      return true;
    });
  };
  const _initDocument = function _initDocument2(dirty) {
    let doc = null;
    let leadingWhitespace = null;
    if (FORCE_BODY) dirty = "<remove></remove>" + dirty;
    else {
      const matches = stringMatch(dirty, LEADING_WHITESPACE);
      leadingWhitespace = matches && matches[0];
    }
    if (PARSER_MEDIA_TYPE === "application/xhtml+xml" && NAMESPACE === HTML_NAMESPACE) dirty = '<html xmlns="http://www.w3.org/1999/xhtml"><head></head><body>' + dirty + "</body></html>";
    const dirtyPayload = trustedTypesPolicy ? _createTrustedHTML(dirty) : dirty;
    if (NAMESPACE === HTML_NAMESPACE) try {
      doc = new DOMParser().parseFromString(dirtyPayload, PARSER_MEDIA_TYPE);
    } catch (_) {
    }
    if (!doc || !doc.documentElement) {
      doc = implementation.createDocument(NAMESPACE, "template", null);
      try {
        doc.documentElement.innerHTML = IS_EMPTY_INPUT ? emptyHTML : dirtyPayload;
      } catch (_) {
      }
    }
    const body = doc.body || doc.documentElement;
    if (dirty && leadingWhitespace) body.insertBefore(document2.createTextNode(leadingWhitespace), body.childNodes[0] || null);
    if (NAMESPACE === HTML_NAMESPACE) return getElementsByTagName.call(doc, WHOLE_DOCUMENT ? "html" : "body")[0];
    return WHOLE_DOCUMENT ? doc.documentElement : body;
  };
  const _createNodeIterator = function _createNodeIterator2(root) {
    let characterDataOnly = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : false;
    const doc = getOwnerDocument ? getOwnerDocument(root) : root.ownerDocument;
    return createNodeIterator.call(doc || root, root, (characterDataOnly ? 0 : NodeFilter2.SHOW_ELEMENT) | NodeFilter2.SHOW_COMMENT | NodeFilter2.SHOW_TEXT | NodeFilter2.SHOW_PROCESSING_INSTRUCTION | NodeFilter2.SHOW_CDATA_SECTION, null);
  };
  const _stripTemplateExpressions = function _stripTemplateExpressions2(value) {
    value = stringReplace(value, MUSTACHE_EXPR$1, " ");
    value = stringReplace(value, ERB_EXPR$1, " ");
    value = stringReplace(value, TMPLIT_EXPR$1, " ");
    return value;
  };
  const _scrubTemplateExpressions2 = function _scrubTemplateExpressions(node) {
    var _node$querySelectorAl;
    _scrubOwnCharacterData(node);
    const templates = (_node$querySelectorAl = node.querySelectorAll) === null || _node$querySelectorAl === void 0 ? void 0 : _node$querySelectorAl.call(node, "template");
    if (templates) arrayForEach(templates, (tmpl) => {
      if (_isDocumentFragment(tmpl.content)) _scrubTemplateExpressions2(tmpl.content);
    });
  };
  const _scrubOwnCharacterData = function _scrubOwnCharacterData2(node) {
    node.normalize();
    const walker = _createNodeIterator(node, true);
    let currentNode = walker.nextNode();
    while (currentNode) {
      currentNode.data = _stripTemplateExpressions(currentNode.data);
      currentNode = walker.nextNode();
    }
  };
  const _isClobbered = function _isClobbered2(element) {
    const realTagName = getNodeName ? getNodeName(element) : null;
    if (typeof realTagName !== "string") return false;
    if (transformCaseFunc(realTagName) !== "form") return false;
    return typeof element.nodeName !== "string" || typeof element.textContent !== "string" || typeof element.removeChild !== "function" || element.attributes !== getAttributes(element) || typeof element.removeAttribute !== "function" || typeof element.removeAttributeNode !== "function" || typeof element.getAttributeNode !== "function" || typeof element.setAttribute !== "function" || typeof element.namespaceURI !== "string" || typeof element.insertBefore !== "function" || typeof element.hasChildNodes !== "function" || element.nodeType !== getNodeType(element) || element.childNodes !== getChildNodes(element);
  };
  const _nodeTypeOf = function _nodeTypeOf2(value) {
    if (!getNodeType || typeof value !== "object" || value === null) return null;
    try {
      const nodeType = getNodeType(value);
      return typeof nodeType === "number" ? nodeType : null;
    } catch (_) {
      return null;
    }
  };
  const _isDocumentFragment = function _isDocumentFragment2(value) {
    return _nodeTypeOf(value) === NODE_TYPE.documentFragment;
  };
  const _isNode = function _isNode2(value) {
    return _nodeTypeOf(value) !== null;
  };
  function _executeHooks(hooks2, currentNode, data) {
    if (hooks2.length === 0) return;
    arrayForEach(hooks2, (hook) => {
      hook.call(DOMPurify, currentNode, data, CONFIG);
    });
  }
  const _isUnsafeNode = function _isUnsafeNode2(currentNode, tagName, nodeType) {
    if (SAFE_FOR_XML && nodeType === NODE_TYPE.element && currentNode.hasChildNodes() && !_isNode(currentNode.firstElementChild) && regExpTest(ELEMENT_MARKUP_PROBE, currentNode.textContent) && regExpTest(ELEMENT_MARKUP_PROBE, currentNode.innerHTML)) return true;
    if (SAFE_FOR_XML && LITERAL_TEXT_ELEMENTS[tagName] && nodeType === NODE_TYPE.element && _readNamespaceURI(currentNode) === HTML_NAMESPACE && (_isNode(currentNode.firstElementChild) || typeof currentNode.textContent === "string" && regExpTest(ELEMENT_MARKUP_PROBE, currentNode.textContent))) return true;
    if (nodeType === NODE_TYPE.processingInstruction) return true;
    if (SAFE_FOR_XML && nodeType === NODE_TYPE.comment && regExpTest(COMMENT_MARKUP_PROBE, currentNode.data)) return true;
    return false;
  };
  const _matchesNameCheck = function _matchesNameCheck2(check, name) {
    if (check instanceof RegExp) return regExpTest(check, name);
    if (check instanceof Function) {
      for (var _len = arguments.length, args = new Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) args[_key - 2] = arguments[_key];
      return Boolean(check(name, ...args));
    }
    return false;
  };
  const _sanitizeDisallowedNode = function _sanitizeDisallowedNode2(currentNode, tagName, root) {
    if (!FORBID_TAGS[tagName] && _isBasicCustomElement(tagName) && _matchesNameCheck(CUSTOM_ELEMENT_HANDLING.tagNameCheck, tagName)) return false;
    if (KEEP_CONTENT && !FORBID_CONTENTS[tagName] && !FORBID_CONTENTS[stringToLowerCase(tagName)]) {
      const parentNode = getParentNode(currentNode);
      const childNodes = getChildNodes(currentNode);
      if (childNodes && parentNode) {
        const childCount = childNodes.length;
        for (let i = childCount - 1; i >= 0; --i) {
          const hoisted = currentNode === root ? cloneNode(childNodes[i], true) : childNodes[i];
          parentNode.insertBefore(hoisted, getNextSibling(currentNode));
        }
      }
    }
    _forceRemove(currentNode);
    return true;
  };
  const _forkSharedAllowlist = function _forkSharedAllowlist2(hookList, set, defaultSet, setConfigSet) {
    if (hookList.length === 0) return set;
    return set === defaultSet || set === setConfigSet ? cloneSet(set) : set;
  };
  const _handleHookDetachedNode = function _handleHookDetachedNode2(currentNode, root) {
    if (currentNode === root || getParentNode(currentNode) !== null) return false;
    if (IN_PLACE) _neutralizeSubtree(currentNode);
    return true;
  };
  const _sanitizeElements = function _sanitizeElements2(currentNode, root) {
    _markVisited(currentNode);
    _executeHooks(hooks.beforeSanitizeElements, currentNode, null);
    if (_handleHookDetachedNode(currentNode, root)) return true;
    if (_isClobbered(currentNode)) {
      _forceRemove(currentNode);
      return true;
    }
    const tagName = transformCaseFunc(_readNodeName(currentNode));
    const nodeType = _readNodeType(currentNode);
    ALLOWED_TAGS = _forkSharedAllowlist(hooks.uponSanitizeElement, ALLOWED_TAGS, DEFAULT_ALLOWED_TAGS, SET_CONFIG_ALLOWED_TAGS);
    _executeHooks(hooks.uponSanitizeElement, currentNode, {
      tagName,
      allowedTags: ALLOWED_TAGS
    });
    if (_handleHookDetachedNode(currentNode, root)) return true;
    if (_isUnsafeNode(currentNode, tagName, nodeType)) {
      _forceRemove(currentNode);
      return true;
    }
    if (FORBID_TAGS[tagName] || !(EXTRA_ELEMENT_HANDLING.tagCheck instanceof Function && EXTRA_ELEMENT_HANDLING.tagCheck(tagName)) && !ALLOWED_TAGS[tagName]) {
      const removed = _sanitizeDisallowedNode(currentNode, tagName, root);
      if (removed === false) {
        _executeHooks(hooks.afterSanitizeElements, currentNode, null);
        if (_handleHookDetachedNode(currentNode, root)) return true;
      }
      return removed;
    }
    if (nodeType === NODE_TYPE.element && !_checkValidNamespace(currentNode)) {
      _forceRemove(currentNode);
      return true;
    }
    if ((tagName === "noscript" || tagName === "noembed" || tagName === "noframes") && regExpTest(FALLBACK_TAG_CLOSE, currentNode.innerHTML)) {
      _forceRemove(currentNode);
      return true;
    }
    if (SAFE_FOR_TEMPLATES && nodeType === NODE_TYPE.text) {
      const text2 = currentNode.textContent;
      const content = _stripTemplateExpressions(text2);
      if (text2 !== content) {
        arrayPush(DOMPurify.removed, { element: currentNode.cloneNode() });
        currentNode.textContent = content;
      }
    }
    _executeHooks(hooks.afterSanitizeElements, currentNode, null);
    return _handleHookDetachedNode(currentNode, root);
  };
  const _isValidAttribute = function _isValidAttribute2(lcTag, lcName, value) {
    if (FORBID_ATTR[lcName]) return false;
    if (_isPatchLinkageAttribute(lcName, lcTag)) return false;
    if (SANITIZE_DOM && (lcName === "id" || lcName === "name") && (value in document2 || value in formElement)) return false;
    const nameIsPermitted = ALLOWED_ATTR[lcName] || EXTRA_ELEMENT_HANDLING.attributeCheck instanceof Function && EXTRA_ELEMENT_HANDLING.attributeCheck(lcName, lcTag);
    if (ALLOW_DATA_ATTR && regExpTest(DATA_ATTR$1, lcName)) return true;
    if (ALLOW_ARIA_ATTR && regExpTest(ARIA_ATTR$1, lcName)) return true;
    if (!nameIsPermitted) return _isBasicCustomElement(lcTag) && _matchesNameCheck(CUSTOM_ELEMENT_HANDLING.tagNameCheck, lcTag) && _matchesNameCheck(CUSTOM_ELEMENT_HANDLING.attributeNameCheck, lcName, lcTag) || lcName === "is" && CUSTOM_ELEMENT_HANDLING.allowCustomizedBuiltInElements && _matchesNameCheck(CUSTOM_ELEMENT_HANDLING.tagNameCheck, value);
    if (URI_SAFE_ATTRIBUTES[lcName]) return true;
    const compactValue = stringReplace(value, ATTR_WHITESPACE$1, "");
    if (regExpTest(IS_ALLOWED_URI$1, compactValue)) return true;
    if ((lcName === "src" || lcName === "xlink:href" || lcName === "href") && lcTag !== "script" && stringIndexOf(value, "data:") === 0 && DATA_URI_TAGS[lcTag]) return true;
    if (ALLOW_UNKNOWN_PROTOCOLS && !regExpTest(IS_SCRIPT_OR_DATA$1, compactValue)) return true;
    return !value;
  };
  const RESERVED_CUSTOM_ELEMENT_NAMES = addToSet({}, [
    "annotation-xml",
    "color-profile",
    "font-face",
    "font-face-format",
    "font-face-name",
    "font-face-src",
    "font-face-uri",
    "missing-glyph"
  ]);
  const _isBasicCustomElement = function _isBasicCustomElement2(tagName) {
    return !RESERVED_CUSTOM_ELEMENT_NAMES[stringToLowerCase(tagName)] && regExpTest(CUSTOM_ELEMENT$1, tagName);
  };
  const _applyTrustedTypesToAttribute = function _applyTrustedTypesToAttribute2(lcTag, lcName, namespaceURI, value) {
    if (trustedTypesPolicy && typeof trustedTypes === "object" && typeof trustedTypes.getAttributeType === "function" && !namespaceURI) switch (trustedTypes.getAttributeType(lcTag, lcName)) {
      case "TrustedHTML":
        return _createTrustedHTML(value);
      case "TrustedScriptURL":
        return _createTrustedScriptURL(value);
    }
    return value;
  };
  const _setAttributeValue = function _setAttributeValue2(currentNode, name, namespaceURI, value) {
    try {
      if (namespaceURI) currentNode.setAttributeNS(namespaceURI, name, value);
      else currentNode.setAttribute(name, value);
      if (_isClobbered(currentNode)) {
        _forceRemove(currentNode);
        return false;
      }
      return true;
    } catch (_) {
      _removeAttribute(name, currentNode);
      return false;
    }
  };
  const _isUnsafeAttributeValue = function _isUnsafeAttributeValue2(name, value) {
    if (SAFE_FOR_XML && regExpTest(ATTR_VALUE_BREAKOUT, value)) return true;
    return stringToLowerCase(name) === "attributename" && stringIndexOf(value, "href") !== -1;
  };
  const _sanitizeAttributes = function _sanitizeAttributes2(currentNode, root) {
    _executeHooks(hooks.beforeSanitizeAttributes, currentNode, null);
    if (_handleHookDetachedNode(currentNode, root)) return;
    const attributes = currentNode.attributes;
    if (!attributes || _isClobbered(currentNode)) return;
    ALLOWED_ATTR = _forkSharedAllowlist(hooks.uponSanitizeAttribute, ALLOWED_ATTR, DEFAULT_ALLOWED_ATTR, SET_CONFIG_ALLOWED_ATTR);
    const hookEvent = {
      attrName: "",
      attrValue: "",
      keepAttr: true,
      allowedAttributes: ALLOWED_ATTR,
      forceKeepAttr: void 0
    };
    let l = attributes.length;
    const lcTag = transformCaseFunc(_readNodeName(currentNode));
    while (l--) {
      const attr = attributes[l];
      const name = attr.name, namespaceURI = attr.namespaceURI, attrValue = attr.value;
      const lcName = transformCaseFunc(name);
      const initValue = attrValue;
      let value = name === "value" ? initValue : stringTrim(initValue);
      let recreatedNamedProp = false;
      hookEvent.attrName = lcName;
      hookEvent.attrValue = value;
      hookEvent.keepAttr = true;
      hookEvent.forceKeepAttr = void 0;
      _executeHooks(hooks.uponSanitizeAttribute, currentNode, hookEvent);
      value = hookEvent.attrValue;
      if (SANITIZE_NAMED_PROPS && (lcName === "id" || lcName === "name") && stringIndexOf(value, SANITIZE_NAMED_PROPS_PREFIX) !== 0) {
        _removeAttribute(name, currentNode, attr);
        value = SANITIZE_NAMED_PROPS_PREFIX + value;
        recreatedNamedProp = true;
      }
      if (_isUnsafeAttributeValue(name, value)) {
        _removeAttribute(name, currentNode, attr);
        continue;
      }
      if (hookEvent.forceKeepAttr) continue;
      if (!hookEvent.keepAttr) {
        _removeAttribute(name, currentNode, attr);
        continue;
      }
      if (!ALLOW_SELF_CLOSE_IN_ATTR && regExpTest(SELF_CLOSING_TAG, value)) {
        _removeAttribute(name, currentNode, attr);
        continue;
      }
      if (SAFE_FOR_TEMPLATES) value = _stripTemplateExpressions(value);
      if (!_isValidAttribute(lcTag, lcName, value)) {
        _removeAttribute(name, currentNode, attr);
        continue;
      }
      value = _applyTrustedTypesToAttribute(lcTag, lcName, namespaceURI, value);
      if (value !== initValue) {
        if (_setAttributeValue(currentNode, name, namespaceURI, value) && recreatedNamedProp) arrayPop(DOMPurify.removed);
      }
    }
    _executeHooks(hooks.afterSanitizeAttributes, currentNode, null);
    _handleHookDetachedNode(currentNode, root);
  };
  const _sanitizeNode = function _sanitizeNode2(node, root) {
    _sanitizeElements(node, root);
    _sanitizeAttributes(node, root);
    if (_isDocumentFragment(node.content)) _sanitizeShadowDOM2(node.content);
  };
  const _sanitizeShadowDOM2 = function _sanitizeShadowDOM(fragment) {
    let shadowNode = null;
    const shadowIterator = _createNodeIterator(fragment);
    _executeHooks(hooks.beforeSanitizeShadowDOM, fragment, null);
    while (shadowNode = shadowIterator.nextNode()) {
      _executeHooks(hooks.uponSanitizeShadowNode, shadowNode, null);
      _sanitizeNode(shadowNode, fragment);
      if (_readNodeType(shadowNode) === NODE_TYPE.element) {
        const innerSr = getShadowRoot(shadowNode);
        if (_isDocumentFragment(innerSr)) {
          _sanitizeAttachedShadowRoots(innerSr);
          _sanitizeShadowDOM2(innerSr);
        }
      }
    }
    if (SAFE_FOR_TEMPLATES) _scrubOwnCharacterData(fragment);
    _executeHooks(hooks.afterSanitizeShadowDOM, fragment, null);
  };
  const _sanitizeAttachedShadowRoots = function _sanitizeAttachedShadowRoots2(root) {
    const stack = [{
      node: root,
      shadow: null
    }];
    while (stack.length > 0) {
      const item = stack.pop();
      if (item.shadow) {
        _sanitizeShadowDOM2(item.shadow);
        continue;
      }
      const node = item.node;
      const isElement = _readNodeType(node) === NODE_TYPE.element;
      const childNodes = getChildNodes(node);
      if (childNodes) for (let i = childNodes.length - 1; i >= 0; --i) stack.push({
        node: childNodes[i],
        shadow: null
      });
      if (isElement) {
        const rootName = getNodeName ? getNodeName(node) : null;
        if (typeof rootName === "string" && transformCaseFunc(rootName) === "template") {
          const content = node.content;
          if (_isDocumentFragment(content)) stack.push({
            node: content,
            shadow: null
          });
        }
      }
      if (isElement) {
        const sr = getShadowRoot(node);
        if (_isDocumentFragment(sr)) stack.push({
          node: null,
          shadow: sr
        }, {
          node: sr,
          shadow: null
        });
      }
    }
  };
  DOMPurify.sanitize = function(dirty) {
    let cfg = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
    let body = null;
    let importedNode = null;
    let currentNode = null;
    let returnNode = null;
    IS_EMPTY_INPUT = !dirty;
    if (IS_EMPTY_INPUT) dirty = "<!-->";
    if (typeof dirty !== "string" && !_isNode(dirty)) {
      dirty = stringifyValue(dirty);
      if (typeof dirty !== "string") throw typeErrorCreate("dirty is not a string, aborting");
    }
    if (!DOMPurify.isSupported) return dirty;
    if (SET_CONFIG) {
      ALLOWED_TAGS = SET_CONFIG_ALLOWED_TAGS;
      ALLOWED_ATTR = SET_CONFIG_ALLOWED_ATTR;
    } else _parseConfig(cfg);
    DOMPurify.removed = [];
    const inPlace = IN_PLACE && typeof dirty !== "string" && _isNode(dirty);
    let inPlaceNodes = [];
    const outerVisited = IN_PLACE_VISITED;
    if (inPlace) {
      _neutralizePatchLinkage(dirty);
      const nn = _readNodeName(dirty);
      if (typeof nn === "string") {
        const tagName = transformCaseFunc(nn);
        if (!ALLOWED_TAGS[tagName] || FORBID_TAGS[tagName]) {
          _neutralizeRoot(dirty);
          throw typeErrorCreate("root node is forbidden and cannot be sanitized in-place");
        }
      }
      if (_isClobbered(dirty)) {
        _neutralizeRoot(dirty);
        throw typeErrorCreate("root node is clobbered and cannot be sanitized in-place");
      }
      inPlaceNodes = _collectLiveNodes(dirty);
      IN_PLACE_VISITED = setCreate();
    } else if (_isNode(dirty)) {
      body = _initDocument("<!---->");
      importedNode = body.ownerDocument.importNode(dirty, true);
      if (importedNode.nodeType === NODE_TYPE.element && importedNode.nodeName === "BODY") body = importedNode;
      else if (importedNode.nodeName === "HTML") body = importedNode;
      else body.appendChild(importedNode);
      _sanitizeAttachedShadowRoots(body);
    } else {
      if (!RETURN_DOM && !SAFE_FOR_TEMPLATES && !WHOLE_DOCUMENT && dirty.indexOf("<") === -1) return _signOutput(dirty);
      body = _initDocument(dirty);
      if (!body) return RETURN_DOM ? null : RETURN_TRUSTED_TYPE ? emptyHTML : "";
    }
    if (body && FORCE_BODY) _forceRemove(body.firstChild);
    const walkRoot = inPlace ? dirty : body;
    try {
      if (inPlace) _sanitizeAttachedShadowRoots(dirty);
      const nodeIterator = _createNodeIterator(walkRoot);
      while (currentNode = nodeIterator.nextNode()) _sanitizeNode(currentNode, walkRoot);
      if (inPlace) _sanitizeUnvisitedNodes(dirty, inPlaceNodes);
    } catch (error) {
      if (inPlace) {
        _neutralizeRoot(dirty);
        _neutralizeDiscarded(dirty, inPlaceNodes);
      }
      throw error;
    } finally {
      IN_PLACE_VISITED = outerVisited;
    }
    if (inPlace) {
      if (_neutralizeDiscarded(dirty, inPlaceNodes)) throw typeErrorCreate("a node selected for removal could not be safely returned; refusing to sanitize in place");
      if (SAFE_FOR_TEMPLATES) _scrubTemplateExpressions2(dirty);
      return dirty;
    }
    if (RETURN_DOM) {
      if (SAFE_FOR_TEMPLATES) _scrubTemplateExpressions2(body);
      if (RETURN_DOM_FRAGMENT) {
        returnNode = createDocumentFragment.call(body.ownerDocument);
        while (body.firstChild) returnNode.appendChild(body.firstChild);
      } else returnNode = body;
      if (ALLOWED_ATTR.shadowroot || ALLOWED_ATTR.shadowrootmode) returnNode = importNode.call(originalDocument, returnNode, true);
      return returnNode;
    }
    const serialize = () => WHOLE_DOCUMENT ? body.outerHTML : body.innerHTML;
    let serializedHTML = serialize();
    if (SAFE_FOR_TEMPLATES && regExpTest(TMPL_MARKER_SERIALIZED, serializedHTML)) {
      _scrubOwnCharacterData(body);
      serializedHTML = serialize();
    }
    if (WHOLE_DOCUMENT && ALLOWED_TAGS["!doctype"] && body.ownerDocument && body.ownerDocument.doctype && body.ownerDocument.doctype.name && regExpTest(DOCTYPE_NAME, body.ownerDocument.doctype.name)) serializedHTML = "<!DOCTYPE " + body.ownerDocument.doctype.name + ">\n" + serializedHTML;
    return _signOutput(serializedHTML);
  };
  DOMPurify.setConfig = function() {
    let cfg = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {};
    _parseConfig(cfg);
    SET_CONFIG = true;
    SET_CONFIG_ALLOWED_TAGS = ALLOWED_TAGS;
    SET_CONFIG_ALLOWED_ATTR = ALLOWED_ATTR;
  };
  DOMPurify.clearConfig = function() {
    CONFIG = null;
    SET_CONFIG = false;
    SET_CONFIG_ALLOWED_TAGS = null;
    SET_CONFIG_ALLOWED_ATTR = null;
    trustedTypesPolicy = defaultTrustedTypesPolicy;
    emptyHTML = "";
  };
  DOMPurify.isValidAttribute = function(tag2, attr, value) {
    if (!CONFIG) _parseConfig({});
    const lcTag = transformCaseFunc(tag2);
    const lcName = transformCaseFunc(attr);
    if (typeof value === "string" && (_isUnsafeAttributeValue(attr, value) || !ALLOW_SELF_CLOSE_IN_ATTR && regExpTest(SELF_CLOSING_TAG, value))) return false;
    return _isValidAttribute(lcTag, lcName, value);
  };
  DOMPurify.addHook = function(entryPoint, hookFunction) {
    if (typeof hookFunction !== "function") return;
    if (!objectHasOwnProperty(hooks, entryPoint)) return;
    arrayPush(hooks[entryPoint], hookFunction);
  };
  DOMPurify.removeHook = function(entryPoint, hookFunction) {
    if (!objectHasOwnProperty(hooks, entryPoint)) return;
    if (hookFunction !== void 0) {
      const index = arrayLastIndexOf(hooks[entryPoint], hookFunction);
      return index === -1 ? void 0 : arraySplice(hooks[entryPoint], index, 1)[0];
    }
    return arrayPop(hooks[entryPoint]);
  };
  DOMPurify.removeHooks = function(entryPoint) {
    if (!objectHasOwnProperty(hooks, entryPoint)) return;
    hooks[entryPoint] = [];
  };
  DOMPurify.removeAllHooks = function() {
    hooks = _createHooksMap();
  };
  return DOMPurify;
}
var purify_default = createDOMPurify();

// src/client/chat-a2ui/classes.ts
var cls = {
  root: "caui-root",
  viewport: "caui-viewport",
  flow: "caui-flow",
  empty: "caui-empty",
  emptyMark: "caui-empty-mark",
  emptyTitle: "caui-empty-title",
  emptyTitleText: "caui-empty-title-text",
  emptyHint: "caui-empty-hint",
  emptySuggestions: "caui-empty-suggestions",
  emptySuggestion: "caui-empty-suggestion",
  flowBlurTop: "caui-flow-blur caui-flow-blur-top",
  flowBlurBottom: "caui-flow-blur caui-flow-blur-bottom",
  row: "caui-row",
  rowUser: "caui-row-user",
  rowAssistant: "caui-row-assistant",
  rowProcess: "caui-row-process",
  rowTail: "caui-row-tail",
  rowNotice: "caui-row-notice",
  user: "caui-user",
  userBubble: "caui-user-bubble",
  userText: "caui-user-text",
  userMeta: "caui-user-meta",
  userImages: "caui-user-images",
  assistant: "caui-assistant",
  assistantText: "caui-assistant-text",
  assistantFooter: "caui-assistant-footer",
  messageActions: "caui-message-actions",
  actionButton: "caui-action-button",
  actionDone: "caui-action-done",
  streamingCursor: "caui-streaming-cursor",
  liveDot: "caui-live-dot",
  reasoning: "caui-reasoning",
  reasoningSummary: "caui-reasoning-summary",
  reasoningBody: "caui-reasoning-body",
  reasoningText: "caui-reasoning-text",
  reasoningSpinner: "caui-reasoning-spinner",
  tool: "caui-tool",
  toolHeader: "caui-tool-header",
  toolIcon: "caui-tool-icon",
  toolName: "caui-tool-name",
  toolStatus: "caui-tool-status",
  toolChevron: "caui-tool-chevron",
  toolBody: "caui-tool-body",
  toolArgs: "caui-tool-args",
  toolResult: "caui-tool-result",
  toolError: "caui-tool-error",
  toolChip: "caui-tool-chip",
  toolStatusText: "caui-tool-status-text",
  turnTail: "caui-turn-tail",
  turnTailLine: "caui-turn-tail-line",
  branchButton: "caui-branch-button",
  branchIcon: "caui-branch-icon",
  tokenUsage: "caui-token-usage",
  time: "caui-time",
  scrollButton: "caui-scroll-button",
  scrollButtonVisible: "caui-scroll-button-visible",
  image: "caui-image",
  imageButton: "caui-image-button",
  imageCaption: "caui-image-caption",
  imageLoading: "caui-image-loading",
  imageFailed: "caui-image-failed",
  lightbox: "caui-lightbox",
  lightboxImage: "caui-lightbox-image",
  lightboxClose: "caui-lightbox-close",
  context: "caui-context",
  contextSummary: "caui-context-summary",
  contextLabel: "caui-context-label",
  contextText: "caui-context-text",
  contextBody: "caui-context-body",
  contextChevron: "caui-context-chevron",
  notice: "caui-notice",
  noticeIcon: "caui-notice-icon",
  noticeText: "caui-notice-text",
  command: "caui-command",
  commandName: "caui-command-name",
  commandArgs: "caui-command-args",
  commandOutcome: "caui-command-outcome",
  compaction: "caui-compaction",
  compactionSummary: "caui-compaction-summary",
  unknown: "caui-unknown",
  unknownType: "caui-unknown-type",
  unknownBody: "caui-unknown-body",
  newChat: "caui-new-chat",
  newChatButton: "caui-new-chat-button",
  newChatIcon: "caui-new-chat-icon",
  newChatError: "caui-new-chat-error",
  markdown: "caui-markdown",
  markdownLink: "caui-markdown-link",
  chatModePage: "caui-chat-page",
  chatModeWorkspace: "caui-chat-workspace",
  chatModeStatus: "caui-chat-status",
  chatModeStatusMark: "caui-chat-status-mark",
  chatModeStatusTitle: "caui-chat-status-title",
  chatModeStatusDetail: "caui-chat-status-detail",
  chatModeStatusActions: "caui-chat-status-actions",
  chatModePrimary: "caui-chat-primary",
  chatModeSecondary: "caui-chat-secondary",
  chatModeList: "caui-chat-list",
  chatModeListWide: "caui-chat-list-wide",
  chatModeListHead: "caui-chat-list-head",
  chatModeListTitle: "caui-chat-list-title",
  chatModeListCount: "caui-chat-list-count",
  chatModeNew: "caui-chat-new",
  chatModeListBody: "caui-chat-list-body",
  chatModeRow: "caui-chat-row",
  chatModeRowActive: "caui-chat-row-active",
  chatModeRowActiveBg: "caui-chat-row-active-bg",
  chatModeRowTop: "caui-chat-row-top",
  chatModeRowTitle: "caui-chat-row-title",
  chatModeRowMeta: "caui-chat-row-meta",
  chatModeEmpty: "caui-chat-empty",
  chatModeEmptyTitle: "caui-chat-empty-title",
  chatModeEmptyHint: "caui-chat-empty-hint",
  chatModeError: "caui-chat-error",
  chatModeRetry: "caui-chat-retry",
  chatModeListEmpty: "caui-chat-list-empty",
  chatModeListEmptyTitle: "caui-chat-list-empty-title",
  chatModeListEmptyHint: "caui-chat-list-empty-hint",
  chatModeListItem: "caui-chat-list-item",
  chatModeListItemActive: "caui-chat-list-item-active",
  chatModeListItemMain: "caui-chat-list-item-main",
  chatModeListItemTitle: "caui-chat-list-item-title",
  chatModeListItemMeta: "caui-chat-list-item-meta",
  chatModeListError: "caui-chat-list-error",
  chatModeListRetry: "caui-chat-list-retry",
  chatModePanelIcon: "caui-chat-panel-icon",
  chatModePanelIconActive: "caui-chat-panel-icon-active",
  chatModeHeader: "caui-chat-header",
  chatModeHeaderMain: "caui-chat-header-main",
  chatModeTitleBlock: "caui-chat-title-block",
  chatModeTitle: "caui-chat-title",
  chatModeSubtitle: "caui-chat-subtitle",
  chatModeHeaderActions: "caui-chat-header-actions",
  chatModeIconButton: "caui-chat-icon-button",
  chatModeToolbarButton: "caui-chat-toolbar-button",
  chatModeToolbarPrimary: "caui-chat-toolbar-primary",
  chatModeNewGlyph: "caui-chat-new-glyph",
  chatModeToolbarActive: "caui-chat-toolbar-active",
  chatModeToolbarLabel: "caui-chat-toolbar-label",
  chatModeShimmer: "caui-chat-shimmer",
  chatModeMotionToggle: "caui-chat-motion-toggle",
  chatModeMotionIcon: "caui-chat-motion-icon",
  chatModeBody: "caui-chat-body",
  chatModeMain: "caui-chat-main",
  chatModeDock: "caui-chat-dock",
  chatModeDockInner: "caui-chat-dock-inner",
  chatModeDockHead: "caui-chat-dock-head",
  chatModeDockTitle: "caui-chat-dock-title",
  chatModeDockBody: "caui-chat-dock-body",
  chatModeDockConversation: "caui-chat-dock-conversation",
  chatModeBlank: "caui-chat-blank",
  chatModeBlankState: "caui-chat-blank-state",
  chatModeBlankTitle: "caui-chat-blank-title",
  chatModeBlankHint: "caui-chat-blank-hint",
  chatModeBlankOrb: "caui-chat-blank-orb"
};

// src/client/chat-a2ui/motion-preference.ts
var import_react24 = require("react");
var CHAT_MOTION_STORAGE_KEY = "chat-a2ui.motion";
var listeners = /* @__PURE__ */ new Set();
var cached = null;
var media = null;
var listening = false;
function hasWindow() {
  return typeof window !== "undefined";
}
function systemLevel() {
  if (!hasWindow()) return "full";
  try {
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "reduced" : "full";
  } catch {
    return "full";
  }
}
function readStored() {
  if (!hasWindow()) return null;
  try {
    const value = window.localStorage.getItem(CHAT_MOTION_STORAGE_KEY);
    return value === "full" || value === "reduced" ? value : null;
  } catch {
    return null;
  }
}
function resolve() {
  return readStored() ?? systemLevel();
}
function notify() {
  cached = null;
  for (const listener of listeners) listener();
}
function ensureListening() {
  if (listening || !hasWindow()) return;
  listening = true;
  try {
    media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const onSystemChange = () => {
      if (readStored() === null) notify();
    };
    if (typeof media.addEventListener === "function") {
      media.addEventListener("change", onSystemChange);
    } else if (typeof media.addListener === "function") {
      media.addListener(onSystemChange);
    }
  } catch {
    media = null;
  }
  try {
    window.addEventListener("storage", (event) => {
      if (event.key !== null && event.key !== CHAT_MOTION_STORAGE_KEY) return;
      notify();
    });
  } catch {
  }
}
function getMotionLevel() {
  if (!hasWindow()) return "full";
  ensureListening();
  if (cached === null) cached = resolve();
  return cached;
}
function subscribeMotion(listener) {
  ensureListening();
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}
function useMotionLevel() {
  return (0, import_react24.useSyncExternalStore)(subscribeMotion, getMotionLevel, () => "full");
}
function useMotionEnabled() {
  return useMotionLevel() === "full";
}

// motion.config.json
var motion_config_default = {
  tokens: {
    springs: {
      soft: {
        stiffness: 420,
        damping: 34,
        mass: 0.8
      }
    },
    dur: {
      xs: 0.12,
      sm: 0.16,
      md: 0.24,
      lg: 0.42,
      reduced: 0.14
    },
    ease: {
      out: [
        0.22,
        1,
        0.36,
        1
      ],
      linear: [
        0,
        0,
        1,
        1
      ],
      inOut: [
        0.42,
        0,
        0.58,
        1
      ]
    },
    dist: {
      sm: 6,
      md: 10
    },
    stagger: {
      tight: 4e-3,
      loose: 0.03
    },
    blur: {
      stream: 9
    },
    loop: {
      spin: 0.8,
      blink: 1.05,
      pulse: 1.6,
      orb: 5.4,
      trail: 5
    }
  },
  roles: {
    message: {
      enter: {
        spring: "soft",
        opacity: 0,
        y: 6
      },
      exit: {
        duration: "sm",
        ease: "out",
        opacity: 0,
        y: -4
      }
    },
    panel: {
      collapse: {
        spring: "soft"
      }
    },
    drawer: {
      resize: {
        spring: "soft"
      }
    },
    dialog: {
      open: {
        duration: "sm",
        ease: "out",
        opacity: 0,
        scale: 0.98
      }
    },
    text: {
      stream: {
        duration: "lg",
        ease: "out",
        blur: 9,
        stagger: 4e-3
      }
    },
    list: {
      item: {
        spring: "soft",
        opacity: 0,
        y: 4
      }
    },
    empty: {
      state: {
        duration: "md",
        ease: "out",
        opacity: 0,
        y: 8,
        stagger: 0.03
      }
    },
    affordance: {
      hover: {
        duration: "xs",
        ease: "out"
      }
    },
    system: {
      spin: {
        loop: "spin"
      },
      blink: {
        loop: "blink"
      }
    }
  },
  textEffect: {
    emptyTitle: {
      per: "char",
      preset: "blur",
      delay: 0.1,
      speedReveal: 1,
      speedSegment: 1
    },
    blankTitle: {
      per: "char",
      preset: "blur",
      delay: 0.08,
      speedReveal: 1,
      speedSegment: 1
    }
  },
  animatedGroup: {
    suggestions: {
      preset: "blur-slide",
      stagger: 0.1
    }
  },
  shimmer: {
    duration: 1,
    spread: 1,
    zDistance: 10,
    xDistance: 2,
    yDistance: -2,
    scaleDistance: 1.1,
    rotateYDistance: 10
  },
  scroll: {
    minMargin: 120,
    maxMarginRatio: 0.35,
    lead: 0.4,
    speed: 900,
    gain: 2.6,
    maxSpeed: 2600,
    speedTau: 0.35,
    holdMs: 3200,
    releaseTau: 0.45,
    instantAbove: 1600,
    ownershipTolerance: 2,
    smoothWindowMs: 900,
    userScrollWindowMs: 600,
    yieldWindowMs: 200
  },
  stream: {
    maxChars: 140,
    clipSpeed: 1e3,
    clipMin: 0.12,
    clipMax: 0.95
  },
  progressiveBlur: {
    blurLayers: 6,
    blurIntensity: 0.32
  }
};

// src/client/chat-a2ui/motion-config.ts
var DEFAULT_MOTION = {
  tokens: {
    springs: { soft: { stiffness: 420, damping: 34, mass: 0.8 } },
    dur: { xs: 0.12, sm: 0.16, md: 0.24, lg: 0.42, reduced: 0.14 },
    ease: { out: [0.22, 1, 0.36, 1], linear: [0, 0, 1, 1], inOut: [0.42, 0, 0.58, 1] },
    dist: { sm: 6, md: 10 },
    stagger: { tight: 4e-3, loose: 0.03 },
    blur: { stream: 9 },
    loop: { spin: 0.8, blink: 1.05, pulse: 1.6, orb: 5.4, trail: 5 }
  },
  roles: {
    message: {
      enter: { spring: "soft", opacity: 0, y: 6 },
      exit: { duration: "sm", ease: "out", opacity: 0, y: -4 }
    },
    panel: { collapse: { spring: "soft" } },
    drawer: { resize: { spring: "soft" } },
    dialog: { open: { duration: "sm", ease: "out", opacity: 0, scale: 0.98 } },
    text: { stream: { duration: "lg", ease: "out", blur: 9, stagger: 4e-3 } },
    list: { item: { spring: "soft", opacity: 0, y: 4 } },
    empty: { state: { duration: "md", ease: "out", opacity: 0, y: 8, stagger: 0.03 } },
    affordance: { hover: { duration: "xs", ease: "out" } },
    system: { spin: { loop: "spin" }, blink: { loop: "blink" } }
  },
  textEffect: {
    emptyTitle: { per: "char", preset: "blur", delay: 0.1, speedReveal: 1, speedSegment: 1 },
    blankTitle: { per: "char", preset: "blur", delay: 0.08, speedReveal: 1, speedSegment: 1 }
  },
  animatedGroup: { suggestions: { preset: "blur-slide", stagger: 0.1 } },
  scroll: {
    minMargin: 120,
    maxMarginRatio: 0.35,
    lead: 0.4,
    speed: 900,
    gain: 2.6,
    maxSpeed: 2600,
    speedTau: 0.35,
    holdMs: 3200,
    releaseTau: 0.45,
    instantAbove: 1600,
    ownershipTolerance: 2,
    smoothWindowMs: 900,
    userScrollWindowMs: 600,
    yieldWindowMs: 200
  },
  shimmer: {
    duration: 1,
    spread: 1,
    zDistance: 10,
    xDistance: 2,
    yDistance: -2,
    scaleDistance: 1.1,
    rotateYDistance: 10
  },
  stream: { maxChars: 140, clipSpeed: 1e3, clipMin: 0.12, clipMax: 0.95 },
  progressiveBlur: { blurLayers: 6, blurIntensity: 0.32 }
};
var TEXT_PER = ["word", "char", "line"];
var TEXT_PRESETS = ["blur", "fade-in-blur", "scale", "fade", "slide"];
var GROUP_PRESETS = [
  "fade",
  "slide",
  "scale",
  "blur",
  "blur-slide",
  "zoom",
  "flip",
  "bounce",
  "rotate",
  "swing"
];
var RULES = {};
function num(path, min, max, int2 = false) {
  RULES[path] = int2 === true ? { kind: "number", min, max, int: int2 } : { kind: "number", min, max };
}
function enm(path, values) {
  RULES[path] = { kind: "enum", values };
}
num("tokens.springs.soft.stiffness", 1, 2e3);
num("tokens.springs.soft.damping", 1, 400);
num("tokens.springs.soft.mass", 0.1, 10);
num("tokens.dur.xs", 0, 2);
num("tokens.dur.sm", 0, 2);
num("tokens.dur.md", 0, 2);
num("tokens.dur.lg", 0, 3);
num("tokens.dur.reduced", 0, 1);
RULES["tokens.ease.out"] = { kind: "ease" };
RULES["tokens.ease.linear"] = { kind: "ease" };
RULES["tokens.ease.inOut"] = { kind: "ease" };
num("tokens.dist.sm", -80, 80);
num("tokens.dist.md", -120, 120);
num("tokens.stagger.tight", 0, 1);
num("tokens.stagger.loose", 0, 1);
num("tokens.blur.stream", 0, 40);
num("tokens.loop.spin", 0.1, 6);
num("tokens.loop.blink", 0.1, 6);
num("tokens.loop.pulse", 0.2, 10);
num("tokens.loop.orb", 1, 30);
num("tokens.loop.trail", 0.2, 30);
var ROLE_TOKEN_VALUES = {
  spring: Object.keys(DEFAULT_MOTION.tokens.springs),
  duration: Object.keys(DEFAULT_MOTION.tokens.dur),
  ease: Object.keys(DEFAULT_MOTION.tokens.ease),
  loop: Object.keys(DEFAULT_MOTION.tokens.loop)
};
var ROLE_NUMBER_RANGES = {
  opacity: [0, 1],
  y: [-120, 120],
  scale: [0.5, 2],
  blur: [0, 40],
  stagger: [0, 1]
};
function collectLeafPaths(value, prefix = "") {
  if (Array.isArray(value)) return prefix === "" ? [] : [prefix];
  if (typeof value !== "object" || value === null) return prefix === "" ? [] : [prefix];
  const paths = [];
  for (const [key, child] of Object.entries(value)) {
    paths.push(...collectLeafPaths(child, prefix === "" ? key : prefix + "." + key));
  }
  return paths;
}
for (const leaf of collectLeafPaths(DEFAULT_MOTION.roles)) {
  const key = leaf.split(".").pop() ?? "";
  const path = "roles." + leaf;
  const tokenValues = ROLE_TOKEN_VALUES[key];
  if (tokenValues !== void 0) {
    enm(path, tokenValues);
    continue;
  }
  const range = ROLE_NUMBER_RANGES[key];
  if (range !== void 0) num(path, range[0], range[1]);
}
for (const key of ["emptyTitle", "blankTitle"]) {
  enm("textEffect." + key + ".per", TEXT_PER);
  enm("textEffect." + key + ".preset", TEXT_PRESETS);
  num("textEffect." + key + ".delay", 0, 2);
  num("textEffect." + key + ".speedReveal", 0.1, 8);
  num("textEffect." + key + ".speedSegment", 0.1, 8);
}
enm("animatedGroup.suggestions.preset", GROUP_PRESETS);
num("animatedGroup.suggestions.stagger", 0, 1);
num("shimmer.duration", 0.1, 6);
num("shimmer.spread", 0.1, 6);
num("shimmer.zDistance", -60, 60);
num("shimmer.xDistance", -30, 30);
num("shimmer.yDistance", -30, 30);
num("shimmer.scaleDistance", 0.2, 2);
num("shimmer.rotateYDistance", -90, 90);
num("scroll.minMargin", 0, 400);
num("scroll.maxMarginRatio", 0, 1);
num("scroll.lead", 0, 3);
num("scroll.speed", 100, 6e3);
num("scroll.gain", 0, 20);
num("scroll.maxSpeed", 200, 12e3);
num("scroll.speedTau", 0.05, 4);
num("scroll.holdMs", 0, 6e3);
num("scroll.releaseTau", 0.05, 4);
num("scroll.instantAbove", 200, 2e4);
num("scroll.ownershipTolerance", 0, 20);
num("scroll.smoothWindowMs", 0, 5e3, true);
num("scroll.userScrollWindowMs", 0, 5e3, true);
num("scroll.yieldWindowMs", 0, 5e3, true);
num("stream.maxChars", 20, 600, true);
num("stream.clipSpeed", 100, 8e3);
num("stream.clipMin", 0.02, 1);
num("stream.clipMax", 0.05, 3);
num("progressiveBlur.blurLayers", 2, 24, true);
num("progressiveBlur.blurIntensity", 0, 2);
var MOTION_PATHS = Object.keys(RULES);
function clipSeconds(delta) {
  const { clipSpeed, clipMin, clipMax } = MOTION.stream;
  const bounded = Math.abs(delta);
  if (!(bounded > 0)) return clipMin;
  return Math.min(clipMax, Math.max(clipMin, bounded / clipSpeed));
}
function getMotionPath(source, path) {
  let cursor = source;
  for (const key of path.split(".")) {
    if (typeof cursor !== "object" || cursor === null) return void 0;
    cursor = cursor[key];
  }
  return cursor;
}
function setMotionPath(target, path, value) {
  const keys = path.split(".");
  const last = keys.pop();
  if (last === void 0) return;
  let cursor = target;
  for (const key of keys) {
    if (typeof cursor !== "object" || cursor === null) return;
    cursor = cursor[key];
  }
  if (typeof cursor !== "object" || cursor === null) return;
  cursor[last] = value;
}
function cloneMotion(value) {
  return JSON.parse(JSON.stringify(value));
}
function isEase(value) {
  if (!Array.isArray(value) || value.length !== 4) return false;
  return value.every((item) => typeof item === "number" && Number.isFinite(item));
}
function normalizeMotionConfig(input) {
  const config = cloneMotion(DEFAULT_MOTION);
  const issues = [];
  for (const path of MOTION_PATHS) {
    const rule = RULES[path];
    if (rule === void 0) continue;
    const value = getMotionPath(input, path);
    if (value === void 0) {
      issues.push(path + "\uFF1A\u7F3A\u5931\uFF0C\u7528\u9ED8\u8BA4\u503C");
      continue;
    }
    if (rule.kind === "ease") {
      if (!isEase(value)) {
        issues.push(path + "\uFF1A\u9700\u8981 [x1,y1,x2,y2]\uFF0C\u7528\u9ED8\u8BA4\u503C");
        continue;
      }
      setMotionPath(config, path, value);
      continue;
    }
    if (rule.kind === "number") {
      if (typeof value !== "number" || !Number.isFinite(value)) {
        issues.push(path + "\uFF1A\u4E0D\u662F\u6709\u9650\u6570\u5B57\uFF0C\u7528\u9ED8\u8BA4\u503C");
        continue;
      }
      if (value < rule.min || value > rule.max) {
        issues.push(path + "\uFF1A" + value + " \u8D85\u51FA " + rule.min + "\u2013" + rule.max + "\uFF0C\u7528\u9ED8\u8BA4\u503C");
        continue;
      }
      if (rule.int === true && !Number.isInteger(value)) {
        issues.push(path + "\uFF1A\u9700\u8981\u6574\u6570\uFF0C\u7528\u9ED8\u8BA4\u503C");
        continue;
      }
      setMotionPath(config, path, value);
      continue;
    }
    if (typeof value !== "string" || !rule.values.includes(value)) {
      issues.push(path + "\uFF1A\u53D6\u503C " + JSON.stringify(value) + " \u4E0D\u5728\u53EF\u9009\u8303\u56F4\uFF0C\u7528\u9ED8\u8BA4\u503C");
      continue;
    }
    setMotionPath(config, path, value);
  }
  for (const path of collectLeafPaths(input)) {
    if (!(path in RULES)) issues.push(path + "\uFF1A\u672A\u77E5\u952E\uFF0C\u5DF2\u5FFD\u7565");
  }
  return { config, issues };
}
var normalized = normalizeMotionConfig(motion_config_default);
var MOTION = normalized.config;
var motionIssues = normalized.issues;
if (motionIssues.length > 0 && typeof window !== "undefined") {
  const report = ["[chat-a2ui] motion.config.json \u6709\u95EE\u9898\uFF0C\u5DF2\u6309\u9ED8\u8BA4\u503C\u515C\u5E95\uFF1A"];
  for (const issue of motionIssues) report.push("  " + issue);
  console.warn(report.join(String.fromCharCode(10)));
}
function easeToCss(ease2) {
  return "cubic-bezier(" + ease2.map((value) => Number(value.toFixed(3))).join(", ") + ")";
}
function motionCssVars(config = MOTION) {
  const roots = ".caui-root, .caui-chat-page, .caui-chat-list";
  const { tokens } = config;
  const lines = [
    "  --caui-dur-xs: " + tokens.dur.xs + "s;",
    "  --caui-dur-sm: " + tokens.dur.sm + "s;",
    "  --caui-dur-md: " + tokens.dur.md + "s;",
    "  --caui-dur-lg: " + tokens.dur.lg + "s;",
    "  --caui-dur-reduced: " + tokens.dur.reduced + "s;",
    "  --caui-ease-out: " + easeToCss(tokens.ease.out) + ";",
    "  --caui-ease-linear: " + easeToCss(tokens.ease.linear) + ";",
    "  --caui-blur-stream: " + tokens.blur.stream + "px;",
    "  --caui-loop-spin: " + tokens.loop.spin + "s;",
    "  --caui-loop-blink: " + tokens.loop.blink + "s;",
    "  --caui-loop-pulse: " + tokens.loop.pulse + "s;",
    "  --caui-loop-orb: " + tokens.loop.orb + "s;",
    // 旧变量名保留：样式表里已有引用，等 B3 清理完再删。
    "  --caui-motion-caret: " + tokens.loop.blink + "s;",
    "  --caui-motion-pulse: " + tokens.loop.pulse + "s;",
    "  --caui-motion-spin: " + tokens.loop.spin + "s;",
    "  --caui-motion-orb: " + tokens.loop.orb + "s;"
  ];
  return roots + " {\n" + lines.join("\n") + "\n}\n";
}

// src/client/chat-a2ui/motion-roles.ts
function roleSpec(id3, roles = MOTION.roles) {
  let cursor = roles;
  for (const key of id3.split(".")) {
    if (typeof cursor !== "object" || cursor === null) return {};
    cursor = cursor[key];
  }
  return typeof cursor === "object" && cursor !== null ? cursor : {};
}
function expandRole(id3, level = "full", config = MOTION) {
  const spec = roleSpec(id3, config.roles);
  const tokens = config.tokens;
  const reduced = level === "reduced";
  const baseDuration = spec.duration === void 0 ? tokens.dur.md : tokens.dur[spec.duration];
  const ease2 = spec.ease === void 0 ? tokens.ease.out : tokens.ease[spec.ease];
  const duration = reduced ? tokens.dur.reduced : baseDuration;
  const stagger = reduced ? 0 : spec.stagger ?? 0;
  const blur = reduced ? 0 : spec.blur ?? 0;
  const y = reduced ? 0 : spec.y ?? 0;
  const scale2 = reduced ? 1 : spec.scale ?? 1;
  const opacity = spec.opacity ?? 1;
  const transition = spec.spring !== void 0 && !reduced ? { type: "spring", ...tokens.springs[spec.spring] } : { duration, ease: ease2 };
  const initial = {};
  const animate = { opacity: 1 };
  const exit = {};
  if (spec.opacity !== void 0) initial.opacity = opacity;
  if (spec.y !== void 0 && !reduced) initial.y = y;
  if (spec.scale !== void 0 && !reduced) initial.scale = scale2;
  if (spec.y !== void 0 && !reduced) animate.y = 0;
  if (spec.scale !== void 0 && !reduced) animate.scale = 1;
  if (id3 === "message.exit") {
    exit.opacity = spec.opacity ?? 0;
    if (!reduced && spec.y !== void 0) exit.y = y;
  }
  if (id3 === "dialog.open") {
    exit.opacity = 0;
    if (!reduced && spec.scale !== void 0) exit.scale = scale2;
  }
  const loop = spec.loop === void 0 ? null : tokens.loop[spec.loop];
  return { initial, animate, exit, transition, duration, blur, stagger, loop };
}

// src/client/chat-a2ui/motion-hooks.ts
function useRole(id3) {
  const level = useMotionLevel();
  return expandRole(id3, level);
}
function useEnter(id3) {
  const role = useRole(id3);
  return { initial: role.initial, animate: role.animate, transition: role.transition };
}
function useStream(id3) {
  const role = useRole(id3);
  return {
    blur: role.blur,
    duration: role.duration,
    stagger: role.stagger,
    maxChars: MOTION.stream.maxChars,
    clipMin: MOTION.stream.clipMin,
    clipSeconds
  };
}

// src/client/chat-a2ui/util.ts
function cx(...values) {
  return values.filter(Boolean).join(" ");
}
function formatClock(time2) {
  try {
    return new Date(time2).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  } catch {
    return "";
  }
}
function formatBytes(bytes) {
  if (!Number.isFinite(bytes) || bytes < 0) return "";
  if (bytes < 1024) return bytes + " B";
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
  return (bytes / (1024 * 1024)).toFixed(1) + " MB";
}
function prettyJson(raw, max = 4e3) {
  let text2 = raw;
  try {
    text2 = JSON.stringify(JSON.parse(raw), null, 2);
  } catch {
  }
  return text2.length > max ? text2.slice(0, max) + "\u2026" : text2;
}
function firstLine(text2) {
  const index = text2.indexOf("\n");
  return index < 0 ? text2 : text2.slice(0, index);
}

// src/client/chat-a2ui/Markdown.tsx
var import_jsx_runtime6 = require("react/jsx-runtime");
var ALLOWED_PROTOCOLS = /* @__PURE__ */ new Set(["http:", "https:", "mailto:"]);
var CARET_HTML = '<span class="' + cls.streamingCursor + '" aria-hidden="true"></span>';
var SANITIZE_CONFIG = {
  ADD_ATTR: ["target", "rel"],
  FORBID_ATTR: ["style", "srcset", "formaction"],
  FORBID_TAGS: ["script", "style", "iframe", "object", "embed", "form", "input", "button", "textarea", "select", "link", "meta"]
};
function escapeHtml(value) {
  const text2 = typeof value === "string" ? value : String(value ?? "");
  return text2.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");
}
function safeHref(raw) {
  if (typeof raw !== "string") return null;
  const value = raw.trim();
  if (value === "") return null;
  try {
    const url = new URL(value);
    return ALLOWED_PROTOCOLS.has(url.protocol.toLowerCase()) ? value : null;
  } catch {
    return null;
  }
}
var renderer = {
  link({ href, title, tokens }) {
    const label = this.parser.parseInline(tokens);
    const target = safeHref(href);
    if (target === null) return label;
    const titleAttr = typeof title === "string" && title !== "" ? ' title="' + escapeHtml(title) + '"' : "";
    return '<a class="' + cls.markdownLink + '" href="' + escapeHtml(target) + '"' + titleAttr + ' target="_blank" rel="noopener noreferrer">' + label + "</a>";
  },
  image({ href, text: text2, title }) {
    const target = safeHref(href);
    const alt = escapeHtml(typeof text2 === "string" ? text2 : "");
    if (target === null) return alt;
    const titleAttr = typeof title === "string" && title !== "" ? ' title="' + escapeHtml(title) + '"' : "";
    return '<img alt="' + alt + '"' + titleAttr + ' src="' + escapeHtml(target) + '" />';
  }
};
function promoteLiteralStrong(html3) {
  if (!html3.includes("**") || typeof document === "undefined") return html3;
  const template = document.createElement("template");
  template.innerHTML = html3;
  const walker = document.createTreeWalker(template.content, NodeFilter.SHOW_TEXT);
  const nodes = [];
  while (walker.nextNode()) {
    const node = walker.currentNode;
    if (!(node instanceof Text) || !node.data.includes("**")) continue;
    if (node.parentElement?.closest("code, pre") !== null) continue;
    nodes.push(node);
  }
  for (const node of nodes) {
    const pattern = /\*\*([^*]+)\*\*/g;
    const fragment = document.createDocumentFragment();
    let cursor = 0;
    let match;
    while ((match = pattern.exec(node.data)) !== null) {
      if (match.index > cursor) fragment.append(node.data.slice(cursor, match.index));
      const strong = document.createElement("strong");
      strong.textContent = match[1] ?? "";
      fragment.append(strong);
      cursor = match.index + match[0].length;
    }
    if (cursor === 0) continue;
    if (cursor < node.data.length) fragment.append(node.data.slice(cursor));
    node.replaceWith(fragment);
  }
  return template.innerHTML;
}
function hardenLinks(html3) {
  if (!html3.includes("<a") || typeof document === "undefined") return html3;
  const template = document.createElement("template");
  template.innerHTML = html3;
  for (const anchor of template.content.querySelectorAll("a[href]")) {
    const target = safeHref(anchor.getAttribute("href"));
    if (target === null) {
      anchor.removeAttribute("href");
      continue;
    }
    anchor.setAttribute("href", target);
    anchor.setAttribute("target", "_blank");
    anchor.setAttribute("rel", "noopener noreferrer");
  }
  return template.innerHTML;
}
var markdownParser = new Marked({ async: false, breaks: true, gfm: true, renderer });
function renderMarkdown(text2) {
  if (typeof text2 !== "string" || text2.trim() === "") return "";
  let html3;
  try {
    html3 = markdownParser.parse(text2, { async: false });
  } catch {
    html3 = "<p>" + escapeHtml(text2) + "</p>";
  }
  try {
    const clean = purify_default.sanitize(html3, SANITIZE_CONFIG);
    return hardenLinks(promoteLiteralStrong(clean));
  } catch {
    return "";
  }
}
var STREAM_CHAR_CLASS = "caui-md-stream-char";
function animateStreamTail(host, count, staggerSeconds) {
  if (count <= 0) return;
  const walker = host.ownerDocument.createTreeWalker(host, NodeFilter.SHOW_TEXT);
  const nodes = [];
  while (walker.nextNode()) {
    const node = walker.currentNode;
    if (node instanceof Text && node.data.length > 0 && /\S/.test(node.data)) nodes.push(node);
  }
  if (nodes.length === 0) return;
  const ranges = [];
  let remaining = count;
  for (let index = nodes.length - 1; index >= 0 && remaining > 0; index -= 1) {
    const node = nodes[index];
    const length = node.data.length;
    const take = Math.min(length, remaining);
    ranges.push({ node, start: length - take, end: length });
    remaining -= take;
  }
  ranges.reverse();
  let charIndex = 0;
  for (const range of ranges) {
    const parent = range.node.parentNode;
    if (parent === null) continue;
    let target;
    try {
      if (range.end < range.node.data.length) range.node.splitText(range.end);
      target = range.node.splitText(range.start);
    } catch {
      continue;
    }
    const fragment = host.ownerDocument.createDocumentFragment();
    for (const char of target.data) {
      const span = host.ownerDocument.createElement("span");
      span.className = STREAM_CHAR_CLASS;
      if (staggerSeconds > 0) span.style.animationDelay = (charIndex * staggerSeconds).toFixed(3) + "s";
      span.textContent = char;
      fragment.appendChild(span);
      charIndex += 1;
    }
    parent.replaceChild(fragment, target);
  }
}
var Markdown = (0, import_react25.memo)(function Markdown2({ text: text2, streaming = false, tail = false, className }) {
  const stream = useStream("text.stream");
  const reduced = useMotionLevel() === "reduced";
  const hostRef = (0, import_react25.useRef)(null);
  const seenRef = (0, import_react25.useRef)(0);
  const prevTextRef = (0, import_react25.useRef)(null);
  const html3 = (0, import_react25.useMemo)(() => {
    const base = renderMarkdown(text2);
    return streaming ? base + CARET_HTML : base;
  }, [text2, streaming]);
  (0, import_react25.useLayoutEffect)(() => {
    const host = hostRef.current;
    if (host === null) {
      seenRef.current = 0;
      return;
    }
    const total = host.textContent === null ? 0 : host.textContent.length;
    const previousTotal = seenRef.current;
    seenRef.current = total;
    const previousText = prevTextRef.current;
    prevTextRef.current = text2;
    const firstRun = previousText === null;
    const grew = !firstRun && text2.length > previousText.length;
    if (!grew && !(firstRun && (streaming || tail))) return;
    if (reduced) return;
    const grown = grew ? total - previousTotal : total;
    if (grown <= 0) return;
    animateStreamTail(host, Math.min(grown, stream.maxChars), stream.stagger);
  }, [html3, streaming, tail, text2, stream.stagger, reduced]);
  const [clip, setClip] = (0, import_react25.useState)(null);
  const clipRef = (0, import_react25.useRef)(null);
  const clipActive = tail || streaming;
  (0, import_react25.useLayoutEffect)(() => {
    if (!clipActive || reduced) {
      if (clip !== null) setClip(null);
      return;
    }
    const element = clipRef.current;
    if (element === null) return;
    const next = Math.round(element.scrollHeight);
    if (next <= 0) return;
    if (clip !== null && clip.height === next) return;
    const previous = clip === null ? next : clip.height;
    const duration = clip === null ? stream.clipMin : stream.clipSeconds(next - previous);
    setClip({ height: next, duration });
  }, [html3, clipActive, clip, reduced]);
  const style = {
    "--caui-stream-duration": stream.duration + "s",
    "--caui-stream-blur": stream.blur + "px"
  };
  const clipStyle = clip === null ? void 0 : { height: clip.height + "px", transitionDuration: clip.duration + "s" };
  return /* @__PURE__ */ (0, import_jsx_runtime6.jsx)(
    "div",
    {
      ref: clipRef,
      className: cx("caui-md-clip", clip !== null && "caui-md-clip-animated"),
      style: clipStyle,
      children: /* @__PURE__ */ (0, import_jsx_runtime6.jsx)(
        "div",
        {
          ref: hostRef,
          className: cx(cls.markdown, className),
          style,
          dangerouslySetInnerHTML: { __html: html3 }
        }
      )
    }
  );
});

// src/client/chat-a2ui/Reasoning.tsx
var import_react27 = require("react");

// src/client/chat-a2ui/motion-primitives/vendor/CollapsibleBody.tsx
var import_react26 = require("react");
var import_jsx_runtime7 = require("react/jsx-runtime");
function CollapsibleBody({ open, id: id3, className, children }) {
  const fallbackId = (0, import_react26.useId)();
  const enabled = useMotionEnabled();
  const collapse = useRole("panel.collapse").transition;
  return /* @__PURE__ */ (0, import_jsx_runtime7.jsx)("div", { className: "caui-collapsible", children: /* @__PURE__ */ (0, import_jsx_runtime7.jsx)(AnimatePresence, { initial: false, children: open ? /* @__PURE__ */ (0, import_jsx_runtime7.jsx)(
    motion.div,
    {
      id: id3 ?? fallbackId,
      className: cx("caui-collapsible-inner", className),
      initial: { height: 0, opacity: 0 },
      animate: { height: "auto", opacity: 1 },
      exit: { height: 0, opacity: 0 },
      transition: enabled ? collapse : { duration: 0 },
      style: { overflow: "hidden" },
      children
    },
    "body"
  ) : null }) });
}

// src/client/chat-a2ui/Reasoning.tsx
var import_jsx_runtime8 = require("react/jsx-runtime");
function Reasoning({ text: text2, streaming }) {
  const [open, setOpen] = (0, import_react27.useState)(false);
  const bodyId = (0, import_react27.useId)() + "-reasoning";
  const isStreaming = streaming === true;
  const body = text2.trim() === "" ? "\u6B63\u5728\u601D\u8003\u2026" : text2;
  return /* @__PURE__ */ (0, import_jsx_runtime8.jsxs)("div", { className: cls.reasoning, "data-streaming": isStreaming ? "true" : void 0, children: [
    /* @__PURE__ */ (0, import_jsx_runtime8.jsxs)(
      "button",
      {
        type: "button",
        className: cls.reasoningSummary,
        "data-open": open ? "true" : "false",
        "aria-expanded": open,
        "aria-controls": open ? bodyId : void 0,
        onClick: () => setOpen((value) => !value),
        children: [
          isStreaming ? /* @__PURE__ */ (0, import_jsx_runtime8.jsx)("span", { className: cls.reasoningSpinner, "aria-hidden": "true", title: "\u751F\u6210\u4E2D" }) : null,
          /* @__PURE__ */ (0, import_jsx_runtime8.jsx)("span", { children: "\u601D\u8003\u8FC7\u7A0B" })
        ]
      }
    ),
    /* @__PURE__ */ (0, import_jsx_runtime8.jsx)(CollapsibleBody, { open, id: bodyId, className: cls.reasoningBody, children: /* @__PURE__ */ (0, import_jsx_runtime8.jsx)("div", { className: cls.reasoningText, children: body }) })
  ] });
}

// src/client/chat-a2ui/ChatImage.tsx
var import_react28 = require("react");
var import_react_dom = require("react-dom");

// src/client/chat-a2ui/motion.ts
var spring2 = { type: "spring", ...MOTION.tokens.springs.soft };
var layoutSpring = spring2;
function reducedMotion() {
  return getMotionLevel() === "reduced";
}

// src/client/chat-a2ui/ChatImage.tsx
var import_jsx_runtime9 = require("react/jsx-runtime");
function toDimension(value) {
  return Number.isFinite(value) && value > 0 ? Math.round(value) : void 0;
}
function ChatImage({ attachment, loadImage, alt }) {
  const [open, setOpen] = (0, import_react28.useState)(false);
  const [failed, setFailed] = (0, import_react28.useState)(false);
  const [loading, setLoading] = (0, import_react28.useState)(true);
  const [src, setSrc] = (0, import_react28.useState)(null);
  const triggerRef = (0, import_react28.useRef)(null);
  const closeRef = (0, import_react28.useRef)(null);
  const dialog = useEnter("dialog.open");
  const dialogExit = useRole("dialog.open").exit;
  (0, import_react28.useEffect)(() => {
    let alive = true;
    setSrc(null);
    setFailed(false);
    setLoading(true);
    setOpen(false);
    const settle = (value) => {
      if (!alive) return;
      if (value === null || value === "") {
        setFailed(true);
      } else {
        setSrc(value);
      }
      setLoading(false);
    };
    let result;
    try {
      result = loadImage(attachment);
    } catch {
      settle(null);
      return () => {
        alive = false;
      };
    }
    if (typeof result === "string") {
      settle(result);
      return () => {
        alive = false;
      };
    }
    Promise.resolve(result).then(settle, () => {
      settle(null);
    });
    return () => {
      alive = false;
    };
  }, [attachment.attachmentId, attachment.width, attachment.height, loadImage]);
  const fallbackLabel = attachment.name !== void 0 && attachment.name !== "" ? attachment.name : "\u56FE\u7247";
  const label = alt !== void 0 && alt.trim() !== "" ? alt : fallbackLabel;
  const captionParts = [];
  if (attachment.name !== void 0 && attachment.name !== "") captionParts.push(attachment.name);
  const sizeText = formatBytes(attachment.bytes);
  if (sizeText !== "") captionParts.push(sizeText);
  const caption = captionParts.join(" \xB7 ");
  const close = (0, import_react28.useCallback)(() => setOpen(false), []);
  (0, import_react28.useEffect)(() => {
    if (failed) setOpen(false);
  }, [failed]);
  (0, import_react28.useEffect)(() => {
    if (!open) return;
    if (typeof document === "undefined") return;
    const doc = document;
    const body = doc.body;
    const previousOverflow = body.style.overflow;
    body.style.overflow = "hidden";
    closeRef.current?.focus();
    const onKeyDown = (event) => {
      if (event.key !== "Escape") return;
      event.stopPropagation();
      setOpen(false);
    };
    doc.addEventListener("keydown", onKeyDown, true);
    return () => {
      doc.removeEventListener("keydown", onKeyDown, true);
      body.style.overflow = previousOverflow;
      triggerRef.current?.focus();
    };
  }, [open]);
  if (loading && src === null) {
    return /* @__PURE__ */ (0, import_jsx_runtime9.jsx)(
      "figure",
      {
        className: cx(cls.image, cls.imageLoading),
        "aria-busy": "true",
        "aria-label": label + " \u52A0\u8F7D\u4E2D",
        style: toDimension(attachment.width) === void 0 || toDimension(attachment.height) === void 0 ? void 0 : { aspectRatio: toDimension(attachment.width) + " / " + toDimension(attachment.height) },
        children: /* @__PURE__ */ (0, import_jsx_runtime9.jsx)("span", { children: "\u52A0\u8F7D\u56FE\u7247\u2026" })
      }
    );
  }
  if (src === null || failed) {
    return /* @__PURE__ */ (0, import_jsx_runtime9.jsxs)(
      "figure",
      {
        className: cx(cls.image, cls.imageFailed),
        role: "img",
        "aria-label": label + " \u52A0\u8F7D\u5931\u8D25",
        title: attachment.name,
        children: [
          /* @__PURE__ */ (0, import_jsx_runtime9.jsxs)(
            "svg",
            {
              viewBox: "0 0 16 16",
              width: "14",
              height: "14",
              "aria-hidden": "true",
              focusable: "false",
              fill: "none",
              stroke: "currentColor",
              strokeWidth: 1.3,
              strokeLinecap: "round",
              strokeLinejoin: "round",
              children: [
                /* @__PURE__ */ (0, import_jsx_runtime9.jsx)("path", { d: "M8 2.6 14 13.4H2L8 2.6Z" }),
                /* @__PURE__ */ (0, import_jsx_runtime9.jsx)("path", { d: "M8 6.4v3.2M8 11.3v.6" })
              ]
            }
          ),
          /* @__PURE__ */ (0, import_jsx_runtime9.jsx)("span", { children: "\u56FE\u7247\u52A0\u8F7D\u5931\u8D25" })
        ]
      }
    );
  }
  return /* @__PURE__ */ (0, import_jsx_runtime9.jsxs)("figure", { className: cls.image, children: [
    /* @__PURE__ */ (0, import_jsx_runtime9.jsx)(
      "button",
      {
        ref: triggerRef,
        type: "button",
        className: cls.imageButton,
        title: label,
        "aria-label": "\u67E5\u770B\u5927\u56FE\uFF1A" + label,
        onClick: () => setOpen(true),
        children: /* @__PURE__ */ (0, import_jsx_runtime9.jsx)(
          "img",
          {
            src,
            alt: label,
            width: toDimension(attachment.width),
            height: toDimension(attachment.height),
            loading: "lazy",
            decoding: "async",
            draggable: false,
            onError: () => setFailed(true)
          }
        )
      }
    ),
    caption === "" ? null : /* @__PURE__ */ (0, import_jsx_runtime9.jsx)("figcaption", { className: cls.imageCaption, children: caption }),
    typeof document === "undefined" ? null : (0, import_react_dom.createPortal)(
      /* @__PURE__ */ (0, import_jsx_runtime9.jsx)(AnimatePresence, { children: open ? /* @__PURE__ */ (0, import_jsx_runtime9.jsxs)(
        motion.div,
        {
          className: cls.lightbox,
          role: "dialog",
          "aria-modal": "true",
          "aria-label": "\u56FE\u7247\u9884\u89C8\uFF1A" + label,
          initial: dialog.initial,
          animate: dialog.animate,
          exit: dialogExit,
          transition: dialog.transition,
          onClick: close,
          children: [
            /* @__PURE__ */ (0, import_jsx_runtime9.jsx)(
              motion.img,
              {
                className: cls.lightboxImage,
                src,
                alt: label,
                initial: { scale: 0.97, opacity: 0.6 },
                animate: { scale: 1, opacity: 1 },
                exit: { scale: 0.98, opacity: 0 },
                transition: spring2,
                onClick: (event) => event.stopPropagation()
              }
            ),
            /* @__PURE__ */ (0, import_jsx_runtime9.jsx)(
              "button",
              {
                ref: closeRef,
                type: "button",
                className: cls.lightboxClose,
                "aria-label": "\u5173\u95ED\u9884\u89C8",
                title: "\u5173\u95ED\uFF08Esc\uFF09",
                onClick: (event) => {
                  event.stopPropagation();
                  close();
                },
                children: /* @__PURE__ */ (0, import_jsx_runtime9.jsx)(
                  "svg",
                  {
                    viewBox: "0 0 16 16",
                    width: "16",
                    height: "16",
                    "aria-hidden": "true",
                    focusable: "false",
                    fill: "none",
                    stroke: "currentColor",
                    strokeWidth: 1.6,
                    strokeLinecap: "round",
                    children: /* @__PURE__ */ (0, import_jsx_runtime9.jsx)("path", { d: "M4 4l8 8M12 4l-8 8" })
                  }
                )
              }
            )
          ]
        },
        "lightbox"
      ) : null }),
      document.body
    )
  ] });
}

// src/client/chat-a2ui/AssistantBlocks.tsx
var import_jsx_runtime10 = require("react/jsx-runtime");
function otherLabel(block2) {
  if (typeof block2 === "object" && block2 !== null) {
    const type = block2["type"];
    if (typeof type === "string" && type !== "") return type;
  }
  return "\u672A\u77E5\u5185\u5BB9";
}
var AssistantBlocks = (0, import_react29.memo)(function AssistantBlocks2({ blocks, status, live = false, loadImage }) {
  if (!Array.isArray(blocks) || blocks.length === 0) return null;
  const streaming = status === "running";
  const lastIndex = blocks.length - 1;
  const rendered = blocks.map((block2, index) => {
    if (typeof block2 !== "object" || block2 === null) {
      return /* @__PURE__ */ (0, import_jsx_runtime10.jsx)("div", { className: cls.unknown, children: /* @__PURE__ */ (0, import_jsx_runtime10.jsx)("span", { className: cls.unknownType, children: otherLabel(block2) }) }, index);
    }
    switch (block2.kind) {
      case "text":
        return /* @__PURE__ */ (0, import_jsx_runtime10.jsx)("div", { className: cls.assistantText, children: /* @__PURE__ */ (0, import_jsx_runtime10.jsx)(
          Markdown,
          {
            text: block2.text,
            streaming: streaming && index === lastIndex,
            tail: live && index === lastIndex
          }
        ) }, index);
      case "reasoning":
        return /* @__PURE__ */ (0, import_jsx_runtime10.jsx)(Reasoning, { text: block2.text, streaming: streaming && index === lastIndex }, index);
      case "tool-call":
        return null;
      case "image":
        return /* @__PURE__ */ (0, import_jsx_runtime10.jsx)(ChatImage, { attachment: block2.attachment, loadImage }, index);
      default:
        return /* @__PURE__ */ (0, import_jsx_runtime10.jsxs)("div", { className: cls.unknown, children: [
          /* @__PURE__ */ (0, import_jsx_runtime10.jsx)("span", { className: cls.unknownType, children: otherLabel(block2.block) }),
          /* @__PURE__ */ (0, import_jsx_runtime10.jsx)("span", { className: cls.unknownBody, children: "\u6682\u4E0D\u652F\u6301\u7684\u5185\u5BB9\u5757" })
        ] }, index);
    }
  });
  return /* @__PURE__ */ (0, import_jsx_runtime10.jsx)(import_jsx_runtime10.Fragment, { children: rendered });
});

// src/client/chat-a2ui/BranchButton.tsx
var import_jsx_runtime11 = require("react/jsx-runtime");
function BranchButton({ disabled, onBranch }) {
  return /* @__PURE__ */ (0, import_jsx_runtime11.jsx)(
    "button",
    {
      type: "button",
      className: cls.branchButton,
      title: "\u4ECE\u6B64\u5206\u652F",
      "aria-label": "\u4ECE\u6B64\u5206\u652F",
      disabled: disabled === true,
      onClick: (event) => {
        event.stopPropagation();
        if (disabled === true) return;
        onBranch();
      },
      children: /* @__PURE__ */ (0, import_jsx_runtime11.jsxs)(
        "svg",
        {
          className: cls.branchIcon,
          viewBox: "0 0 16 16",
          width: "14",
          height: "14",
          "aria-hidden": "true",
          focusable: "false",
          fill: "none",
          stroke: "currentColor",
          strokeWidth: 1.4,
          strokeLinecap: "round",
          strokeLinejoin: "round",
          children: [
            /* @__PURE__ */ (0, import_jsx_runtime11.jsx)("circle", { cx: "4.2", cy: "3.6", r: "1.5" }),
            /* @__PURE__ */ (0, import_jsx_runtime11.jsx)("circle", { cx: "4.2", cy: "12.4", r: "1.5" }),
            /* @__PURE__ */ (0, import_jsx_runtime11.jsx)("circle", { cx: "11.8", cy: "5", r: "1.5" }),
            /* @__PURE__ */ (0, import_jsx_runtime11.jsx)("path", { d: "M4.2 5.1v5.8" }),
            /* @__PURE__ */ (0, import_jsx_runtime11.jsx)("path", { d: "M11.8 6.5v.6a3 3 0 0 1-3 3H8.2" })
          ]
        }
      )
    }
  );
}

// src/client/chat-a2ui/ToolCard.tsx
var import_react30 = require("react");
var import_jsx_runtime12 = require("react/jsx-runtime");
var STATUS_TEXT = {
  running: "\u8FD0\u884C\u4E2D",
  done: "\u5DF2\u5B8C\u6210",
  error: "\u5931\u8D25"
};
var PREVIEW_LIMIT = 80;
var BODY_LIMIT = 6e3;
function isRecord(value) {
  return typeof value === "object" && value !== null;
}
function blockToText(block2) {
  const record = block2;
  const type = typeof record.type === "string" ? record.type : "";
  if (type === "text" || type === "reasoning") {
    return typeof record.text === "string" ? record.text : "";
  }
  if (type === "image" || type === "file") {
    const attachment = record.attachment;
    const name = isRecord(attachment) && typeof attachment.name === "string" ? attachment.name : "";
    const kind = type === "image" ? "\u56FE\u7247" : "\u6587\u4EF6";
    return name === "" ? "\uFF3B" + kind + "\uFF3D" : "\uFF3B" + kind + "\uFF1A" + name + "\uFF3D";
  }
  if (type === "tool-call") {
    const name = typeof record.name === "string" ? record.name : "\u5DE5\u5177\u8C03\u7528";
    const args = typeof record.arguments === "string" ? record.arguments : "";
    return args === "" ? name : name + " " + prettyJson(args, 1200);
  }
  try {
    return JSON.stringify(block2, null, 2);
  } catch {
    return "\uFF3B\u65E0\u6CD5\u5C55\u793A\u7684\u5185\u5BB9\u5757\uFF3D";
  }
}
function contentToText(content) {
  if (content === void 0 || content.length === 0) return "";
  const parts = [];
  for (const block2 of content) {
    const text2 = blockToText(block2);
    if (text2.trim() !== "") parts.push(text2);
  }
  return parts.join("\n\n");
}
function argsPreview(argsRaw) {
  if (argsRaw === void 0) return "";
  const line = firstLine(argsRaw).replace(/\s+/g, " ").trim();
  if (line === "") return "";
  return line.length > PREVIEW_LIMIT ? line.slice(0, PREVIEW_LIMIT) + "\u2026" : line;
}
function errorSummary(error) {
  if (error === void 0) return "\u5DE5\u5177\u8C03\u7528\u5931\u8D25";
  const parts = [];
  for (const part of [error.name, error.code, error.reason]) {
    if (typeof part === "string" && part.trim() !== "") parts.push(part.trim());
  }
  return parts.length === 0 ? "\u5DE5\u5177\u8C03\u7528\u5931\u8D25" : parts.join(" \xB7 ");
}
function ToolCard({ root, title, status }) {
  const [open, setOpen] = (0, import_react30.useState)(false);
  const bodyId = (0, import_react30.useId)() + "-tool";
  const label = title ?? root.name;
  const state2 = status ?? toolStatusOf(root);
  const argsText = root.argsRaw === void 0 ? "" : prettyJson(root.argsRaw, 4e3);
  const hasArgs = argsText.trim() !== "";
  const preview = argsPreview(root.argsRaw);
  const resultText = contentToText(root.content);
  const hasError = root.isError === true || root.error !== void 0;
  const statusText = STATUS_TEXT[state2];
  const kind = root.kind !== void 0 && root.kind.trim() !== "" ? root.kind.trim() : "";
  const occurredError = errorSummary(root.error);
  return /* @__PURE__ */ (0, import_jsx_runtime12.jsxs)(
    "div",
    {
      className: cls.tool,
      "data-state": state2,
      "data-open": open ? "true" : "false",
      "data-error": hasError ? "true" : void 0,
      children: [
        /* @__PURE__ */ (0, import_jsx_runtime12.jsxs)(
          "button",
          {
            type: "button",
            className: cls.toolHeader,
            "aria-expanded": open,
            "aria-controls": open ? bodyId : void 0,
            "aria-label": label + "\uFF08" + statusText + "\uFF09\uFF0C" + (open ? "\u6536\u8D77" : "\u5C55\u5F00") + "\u8BE6\u60C5",
            onClick: () => setOpen((value) => !value),
            children: [
              /* @__PURE__ */ (0, import_jsx_runtime12.jsxs)(
                "svg",
                {
                  className: cls.toolIcon,
                  viewBox: "0 0 16 16",
                  width: "15",
                  height: "15",
                  "aria-hidden": "true",
                  focusable: "false",
                  fill: "none",
                  stroke: "currentColor",
                  strokeWidth: 1.4,
                  strokeLinecap: "round",
                  strokeLinejoin: "round",
                  children: [
                    /* @__PURE__ */ (0, import_jsx_runtime12.jsx)("rect", { x: "2.2", y: "3", width: "11.6", height: "10", rx: "2" }),
                    /* @__PURE__ */ (0, import_jsx_runtime12.jsx)("path", { d: "M4.8 6.4 6.6 8l-1.8 1.6M8.2 9.9h3" })
                  ]
                }
              ),
              /* @__PURE__ */ (0, import_jsx_runtime12.jsx)("span", { className: cls.toolStatus, "data-state": state2, "aria-hidden": "true" }),
              /* @__PURE__ */ (0, import_jsx_runtime12.jsx)("span", { className: cls.toolName, children: label }),
              kind === "" ? null : /* @__PURE__ */ (0, import_jsx_runtime12.jsx)("span", { className: cls.toolChip, children: kind }),
              /* @__PURE__ */ (0, import_jsx_runtime12.jsx)("span", { className: cls.toolStatusText, "data-state": state2, "aria-hidden": "true", children: statusText }),
              preview === "" ? null : /* @__PURE__ */ (0, import_jsx_runtime12.jsx)("span", { className: cls.toolArgs, children: preview }),
              /* @__PURE__ */ (0, import_jsx_runtime12.jsx)(
                "svg",
                {
                  className: cls.toolChevron,
                  "data-open": open ? "true" : "false",
                  viewBox: "0 0 12 12",
                  width: "12",
                  height: "12",
                  "aria-hidden": "true",
                  focusable: "false",
                  fill: "none",
                  stroke: "currentColor",
                  strokeWidth: 1.5,
                  strokeLinecap: "round",
                  strokeLinejoin: "round",
                  children: /* @__PURE__ */ (0, import_jsx_runtime12.jsx)("path", { d: "M4.5 2.5 8 6l-3.5 3.5" })
                }
              )
            ]
          }
        ),
        /* @__PURE__ */ (0, import_jsx_runtime12.jsxs)(CollapsibleBody, { open, id: bodyId, className: cls.toolBody, children: [
          hasArgs ? /* @__PURE__ */ (0, import_jsx_runtime12.jsx)("pre", { className: cls.toolArgs, children: argsText }) : null,
          hasError ? /* @__PURE__ */ (0, import_jsx_runtime12.jsx)("pre", { className: cx(cls.toolResult, cls.toolError), children: occurredError }) : null,
          resultText.trim() === "" ? null : /* @__PURE__ */ (0, import_jsx_runtime12.jsx)("pre", { className: cls.toolResult, children: prettyJson(resultText, BODY_LIMIT) }),
          !hasArgs && !hasError && resultText.trim() === "" ? /* @__PURE__ */ (0, import_jsx_runtime12.jsx)("span", { className: cls.toolChip, children: "\u6682\u65E0\u8BE6\u7EC6\u5185\u5BB9" }) : null
        ] })
      ]
    }
  );
}

// src/client/chat-a2ui/ChatRow.tsx
var import_jsx_runtime13 = require("react/jsx-runtime");
function safeIso(time2) {
  if (time2 === void 0 || !Number.isFinite(time2)) return void 0;
  try {
    return new Date(time2).toISOString();
  } catch {
    return void 0;
  }
}
function truncate(text2, max) {
  return text2.length > max ? text2.slice(0, max).trimEnd() + "\u2026" : text2;
}
function RowFrame({ kind, variant, children }) {
  return /* @__PURE__ */ (0, import_jsx_runtime13.jsx)("div", { className: cx(cls.row, variant), "data-kind": kind, children });
}
function ContextRow({ view: view2 }) {
  const [open, setOpen] = (0, import_react31.useState)(false);
  const bodyId = (0, import_react31.useId)() + "-context";
  const text2 = view2.text;
  if (text2 === "") return null;
  const time2 = view2.time;
  return /* @__PURE__ */ (0, import_jsx_runtime13.jsx)(RowFrame, { kind: "context", variant: cls.rowNotice, children: /* @__PURE__ */ (0, import_jsx_runtime13.jsxs)("div", { className: cls.context, children: [
    /* @__PURE__ */ (0, import_jsx_runtime13.jsxs)(
      "button",
      {
        type: "button",
        className: cls.contextSummary,
        "aria-expanded": open,
        "aria-controls": open ? bodyId : void 0,
        onClick: () => setOpen((value) => !value),
        children: [
          /* @__PURE__ */ (0, import_jsx_runtime13.jsx)("span", { className: cls.contextLabel, children: "\u5DF2\u6CE8\u5165\u4E0A\u4E0B\u6587" }),
          time2 === void 0 ? null : /* @__PURE__ */ (0, import_jsx_runtime13.jsx)("time", { className: cls.time, dateTime: safeIso(time2), children: formatClock(time2) }),
          /* @__PURE__ */ (0, import_jsx_runtime13.jsx)("span", { className: cls.contextChevron, "aria-hidden": "true" })
        ]
      }
    ),
    /* @__PURE__ */ (0, import_jsx_runtime13.jsx)(CollapsibleBody, { open, id: bodyId, className: cls.contextBody, children: /* @__PURE__ */ (0, import_jsx_runtime13.jsx)("pre", { className: cls.contextText, children: text2 }) })
  ] }) });
}
function UserRow({ view: view2, loadImage }) {
  const parts = view2.parts;
  const time2 = view2.time;
  const label = view2.kind === "steering" ? "\u5F15\u5BFC" : void 0;
  const hasBubble = parts.texts.length > 0 || parts.files.length > 0 || parts.unsupported > 0;
  return /* @__PURE__ */ (0, import_jsx_runtime13.jsx)(RowFrame, { kind: view2.kind, variant: cls.rowUser, children: /* @__PURE__ */ (0, import_jsx_runtime13.jsxs)("div", { className: cls.user, children: [
    parts.images.length === 0 ? null : /* @__PURE__ */ (0, import_jsx_runtime13.jsx)("div", { className: cls.userImages, children: parts.images.map((attachment, index) => /* @__PURE__ */ (0, import_jsx_runtime13.jsx)(ChatImage, { attachment, loadImage }, attachment.attachmentId + ":" + index)) }),
    !hasBubble ? null : /* @__PURE__ */ (0, import_jsx_runtime13.jsxs)("div", { className: cls.userBubble, children: [
      parts.texts.map((text2, index) => /* @__PURE__ */ (0, import_jsx_runtime13.jsx)("div", { className: cls.userText, children: text2 }, "text:" + index)),
      parts.files.map((file, index) => /* @__PURE__ */ (0, import_jsx_runtime13.jsx)("div", { className: cls.toolChip, children: file.bytes > 0 ? file.name + " \xB7 " + formatBytes(file.bytes) : file.name }, "file:" + index)),
      parts.unsupported === 0 ? null : /* @__PURE__ */ (0, import_jsx_runtime13.jsx)("div", { className: cls.unknownType, children: "+" + parts.unsupported + " \u4E2A\u4E0D\u652F\u6301\u7684\u5185\u5BB9\u5757" })
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime13.jsxs)("div", { className: cls.userMeta, children: [
      label === void 0 ? null : /* @__PURE__ */ (0, import_jsx_runtime13.jsx)("span", { children: label }),
      time2 === void 0 ? null : /* @__PURE__ */ (0, import_jsx_runtime13.jsx)("time", { className: cls.time, dateTime: safeIso(time2), children: formatClock(time2) })
    ] })
  ] }) });
}
function CopyButton({ text: text2 }) {
  const [copied, setCopied] = (0, import_react31.useState)(false);
  const timer = (0, import_react31.useRef)(void 0);
  (0, import_react31.useEffect)(() => () => {
    if (timer.current !== void 0) window.clearTimeout(timer.current);
  }, []);
  const copy = () => {
    const clipboard = navigator.clipboard;
    if (clipboard === void 0) return;
    void clipboard.writeText(text2).then(() => {
      setCopied(true);
      if (timer.current !== void 0) window.clearTimeout(timer.current);
      timer.current = window.setTimeout(() => {
        setCopied(false);
      }, 1400);
    }).catch(() => {
    });
  };
  return /* @__PURE__ */ (0, import_jsx_runtime13.jsx)("div", { className: cls.messageActions, children: /* @__PURE__ */ (0, import_jsx_runtime13.jsx)(
    "button",
    {
      type: "button",
      className: cx(cls.actionButton, copied && cls.actionDone),
      onClick: copy,
      "aria-label": "\u590D\u5236\u56DE\u590D\u5185\u5BB9",
      children: copied ? "\u5DF2\u590D\u5236" : "\u590D\u5236"
    }
  ) });
}
function AssistantRow({ view: view2, loadImage, running }) {
  return /* @__PURE__ */ (0, import_jsx_runtime13.jsx)(RowFrame, { kind: "assistant-step", variant: cls.rowAssistant, children: /* @__PURE__ */ (0, import_jsx_runtime13.jsxs)("div", { className: cls.assistant, children: [
    /* @__PURE__ */ (0, import_jsx_runtime13.jsx)(AssistantBlocks, { blocks: view2.blocks, status: view2.status, live: running, loadImage }),
    /* @__PURE__ */ (0, import_jsx_runtime13.jsxs)("div", { className: cls.assistantFooter, children: [
      view2.live ? /* @__PURE__ */ (0, import_jsx_runtime13.jsx)("span", { className: cls.liveDot, "aria-hidden": "true" }) : null,
      !view2.live && view2.status === "interrupted" ? /* @__PURE__ */ (0, import_jsx_runtime13.jsx)("span", { className: cls.time, children: "\u5DF2\u4E2D\u65AD" }) : null,
      view2.time === void 0 ? null : /* @__PURE__ */ (0, import_jsx_runtime13.jsx)("time", { className: cls.time, dateTime: safeIso(view2.time), children: formatClock(view2.time) }),
      !view2.live && view2.copyText !== "" ? /* @__PURE__ */ (0, import_jsx_runtime13.jsx)(CopyButton, { text: view2.copyText }) : null
    ] })
  ] }) });
}
function ToolRow({ view: view2 }) {
  return /* @__PURE__ */ (0, import_jsx_runtime13.jsx)(RowFrame, { kind: "tool-call", variant: cls.rowProcess, children: /* @__PURE__ */ (0, import_jsx_runtime13.jsx)(ToolCard, { root: view2.root, title: view2.title, status: view2.status }) });
}
function TurnTailRow({ view: view2, running, forkAt }) {
  const seq = view2.seq;
  const onBranch = () => {
    if (seq === void 0) return;
    try {
      void Promise.resolve(forkAt(seq)).catch((error) => {
        console.warn("[chat-a2ui] \u4ECE\u8BE5\u8F6E\u5206\u652F\u5931\u8D25", error);
      });
    } catch (error) {
      console.warn("[chat-a2ui] \u4ECE\u8BE5\u8F6E\u5206\u652F\u5931\u8D25", error);
    }
  };
  return /* @__PURE__ */ (0, import_jsx_runtime13.jsx)(RowFrame, { kind: "turn-tail", variant: cls.rowTail, children: /* @__PURE__ */ (0, import_jsx_runtime13.jsxs)("div", { className: cls.turnTail, children: [
    /* @__PURE__ */ (0, import_jsx_runtime13.jsx)("span", { className: cls.turnTailLine, "aria-hidden": "true" }),
    view2.time === void 0 ? null : /* @__PURE__ */ (0, import_jsx_runtime13.jsx)("time", { className: cls.time, dateTime: safeIso(view2.time), children: formatClock(view2.time) }),
    view2.usage === void 0 ? null : /* @__PURE__ */ (0, import_jsx_runtime13.jsx)("span", { className: cls.tokenUsage, children: view2.usage }),
    view2.branchable ? /* @__PURE__ */ (0, import_jsx_runtime13.jsx)(BranchButton, { disabled: running, onBranch }) : null
  ] }) });
}
function CommandBody({ view: view2 }) {
  return /* @__PURE__ */ (0, import_jsx_runtime13.jsxs)("div", { className: cls.command, children: [
    /* @__PURE__ */ (0, import_jsx_runtime13.jsx)("span", { className: cls.commandName, children: view2.name === void 0 ? "\u547D\u4EE4" : "/" + view2.name }),
    view2.args === void 0 ? null : /* @__PURE__ */ (0, import_jsx_runtime13.jsx)("span", { className: cls.commandArgs, children: view2.args }),
    view2.outcome === void 0 ? null : /* @__PURE__ */ (0, import_jsx_runtime13.jsx)("span", { className: cx(cls.commandOutcome, view2.outcome.kind === "error" && cls.toolError), children: view2.outcome.text ?? (view2.outcome.kind === "error" ? "\u5931\u8D25" : "\u5B8C\u6210") })
  ] });
}
function CompactionBody({ view: view2 }) {
  const bits = [];
  if (view2.itemCount !== void 0) bits.push("\u6298\u53E0 " + formatCount(view2.itemCount) + " \u6761\u6D88\u606F");
  if (view2.tokenCount !== void 0) bits.push("\u7EA6 " + formatCount(view2.tokenCount) + " tokens");
  return /* @__PURE__ */ (0, import_jsx_runtime13.jsxs)("div", { className: cls.compaction, children: [
    /* @__PURE__ */ (0, import_jsx_runtime13.jsx)("div", { className: cls.compactionSummary, children: view2.summary === void 0 ? "\u4E0A\u4E0B\u6587\u5DF2\u538B\u7F29" : truncate(view2.summary, 480) }),
    bits.length === 0 ? null : /* @__PURE__ */ (0, import_jsx_runtime13.jsx)("div", { className: cls.time, children: bits.join(" \xB7 ") })
  ] });
}
function ManualCompactionBody({ view: view2 }) {
  return /* @__PURE__ */ (0, import_jsx_runtime13.jsxs)(RowFrame, { kind: "manual-compaction", variant: cls.rowNotice, children: [
    view2.command === void 0 ? null : /* @__PURE__ */ (0, import_jsx_runtime13.jsx)(CommandBody, { view: view2.command }),
    view2.compaction === void 0 ? null : /* @__PURE__ */ (0, import_jsx_runtime13.jsx)(CompactionBody, { view: view2.compaction })
  ] });
}
var LEGACY_RENDERERS = {
  command: (view2) => /* @__PURE__ */ (0, import_jsx_runtime13.jsx)(RowFrame, { kind: "command", variant: cls.rowNotice, children: /* @__PURE__ */ (0, import_jsx_runtime13.jsx)(CommandBody, { view: view2.command ?? {} }) }),
  compaction: (view2) => /* @__PURE__ */ (0, import_jsx_runtime13.jsx)(RowFrame, { kind: "compaction", variant: cls.rowNotice, children: /* @__PURE__ */ (0, import_jsx_runtime13.jsx)(CompactionBody, { view: view2.compaction ?? {} }) }),
  "manual-compaction": (view2) => /* @__PURE__ */ (0, import_jsx_runtime13.jsx)(ManualCompactionBody, { view: view2 })
};
function LegacyRow({ view: view2 }) {
  return LEGACY_RENDERERS[view2.kind](view2);
}
function NoticeRow({ view: view2 }) {
  const errorTone = view2.spec.icon === "!";
  return /* @__PURE__ */ (0, import_jsx_runtime13.jsx)(RowFrame, { kind: view2.kind, variant: cls.rowNotice, children: /* @__PURE__ */ (0, import_jsx_runtime13.jsxs)("div", { className: cls.notice, role: errorTone ? "alert" : void 0, children: [
    /* @__PURE__ */ (0, import_jsx_runtime13.jsx)("span", { className: cls.noticeIcon, "aria-hidden": "true", children: view2.spec.icon }),
    /* @__PURE__ */ (0, import_jsx_runtime13.jsxs)("span", { className: cx(cls.noticeText, errorTone && cls.toolError), children: [
      /* @__PURE__ */ (0, import_jsx_runtime13.jsx)("strong", { children: view2.spec.title }),
      view2.spec.text === void 0 ? null : /* @__PURE__ */ (0, import_jsx_runtime13.jsx)("span", { children: " \xB7 " + view2.spec.text })
    ] })
  ] }) });
}
function UnknownRow({ view: view2 }) {
  const rec = asRecord(view2.data);
  const type = readString(rec, "type") ?? (view2.kind === "" ? "unknown" : view2.kind);
  const hint = readString(rec, "text") ?? readString(rec, "message");
  return /* @__PURE__ */ (0, import_jsx_runtime13.jsx)(RowFrame, { kind: view2.kind === "" ? "unknown" : view2.kind, variant: cls.rowNotice, children: /* @__PURE__ */ (0, import_jsx_runtime13.jsxs)("div", { className: cls.unknown, children: [
    /* @__PURE__ */ (0, import_jsx_runtime13.jsx)("span", { className: cls.unknownType, children: type }),
    /* @__PURE__ */ (0, import_jsx_runtime13.jsx)("span", { className: cls.unknownBody, children: hint === void 0 ? "\u6B64\u6D88\u606F\u6682\u4E0D\u652F\u6301\u5C55\u793A" : truncate(hint, 240) })
  ] }) });
}
var RENDERERS = {
  user: (view2, env) => /* @__PURE__ */ (0, import_jsx_runtime13.jsx)(UserRow, { view: view2, loadImage: env.loadImage }),
  context: (view2) => /* @__PURE__ */ (0, import_jsx_runtime13.jsx)(ContextRow, { view: view2 }),
  assistant: (view2, env) => /* @__PURE__ */ (0, import_jsx_runtime13.jsx)(AssistantRow, { view: view2, loadImage: env.loadImage, running: env.running }),
  tool: (view2) => /* @__PURE__ */ (0, import_jsx_runtime13.jsx)(ToolRow, { view: view2 }),
  "turn-tail": (view2, env) => /* @__PURE__ */ (0, import_jsx_runtime13.jsx)(TurnTailRow, { view: view2, running: env.running, forkAt: env.forkAt }),
  notice: (view2) => /* @__PURE__ */ (0, import_jsx_runtime13.jsx)(NoticeRow, { view: view2 }),
  legacy: (view2) => /* @__PURE__ */ (0, import_jsx_runtime13.jsx)(LegacyRow, { view: view2 }),
  hidden: () => null,
  unknown: (view2) => /* @__PURE__ */ (0, import_jsx_runtime13.jsx)(UnknownRow, { view: view2 })
};
var ChatRow = (0, import_react31.memo)(function ChatRow2(props) {
  const { nodeKey, useChat, loadImage, forkAt, running } = props;
  const node = useChat((snapshot) => snapshot.nodes.get(nodeKey));
  if (node === void 0 || node === null) return null;
  if (node.visibility === "hidden") return null;
  const view2 = parseRow(typeof node.kind === "string" ? node.kind : "", node.data);
  const render = RENDERERS[view2.type];
  return render(view2, { loadImage, forkAt, running });
});

// src/client/chat-a2ui/ScrollToBottom.tsx
var import_react32 = require("react");

// src/client/chat-a2ui/scroll-follow.ts
var MAX_FRAME_SECONDS = 0.064;
var GROWTH_EPSILON = 1.5;
var MARGIN_MAX_SPEED = 600;
function createFollowState(at, height = 0, position = 0) {
  return {
    position,
    margin: 0,
    rate: 0,
    ratePeak: 0,
    height,
    at,
    growthAt: Number.NEGATIVE_INFINITY
  };
}
function clamp2(value, low, high) {
  return Math.min(high, Math.max(low, value));
}
function stepFollow(state2, input) {
  const { height, viewport, at, config } = input;
  const dt = clamp2((at - state2.at) / 1e3, 0, MAX_FRAME_SECONDS);
  const tau = Math.max(config.speedTau, 0.05);
  const raw = height - state2.height;
  const delta = raw >= GROWTH_EPSILON ? raw : 0;
  const instant = dt > 0 ? delta / dt : 0;
  const smooth = dt > 0 ? 1 - Math.exp(-dt / tau) : 0;
  const rate = Math.max(0, state2.rate + (instant - state2.rate) * smooth);
  const grew = delta > 0;
  const growthAt = grew ? at : state2.growthAt;
  const active = grew || at - growthAt < config.holdMs;
  const maxMargin = Math.max(0, config.maxMarginRatio * viewport);
  const ratePeak = Math.max(rate, state2.ratePeak * Math.exp(-dt / 2));
  const marginTarget = active ? clamp2(Math.max(config.minMargin, ratePeak * config.lead), 0, maxMargin) : 0;
  const marginSlew = clamp2(marginTarget - state2.margin, -MARGIN_MAX_SPEED * dt, MARGIN_MAX_SPEED * dt);
  const margin = clamp2(state2.margin + marginSlew, 0, maxMargin);
  const bottom = Math.max(0, height - viewport);
  const target = Math.max(0, bottom - margin);
  const distance2 = target - state2.position;
  const speed = Math.min(config.maxSpeed, config.speed + Math.abs(distance2) * config.gain);
  const step = clamp2(distance2, -speed * dt, speed * dt);
  const position = clamp2(state2.position + step, 0, bottom);
  const idle = Math.abs(target - position) < 0.5 && margin < 0.5;
  const nextState = {
    position: idle ? target : position,
    margin,
    rate: idle ? 0 : rate,
    ratePeak: idle ? 0 : ratePeak,
    height,
    at,
    growthAt
  };
  return { state: nextState, position: nextState.position, target, margin, rate, idle };
}

// src/client/chat-a2ui/follow-controller.ts
var STICK_THRESHOLD = 40;
function defaultNow() {
  return typeof performance === "object" ? performance.now() : Date.now();
}
function createFollowController(target, options2) {
  const config = options2.config ?? MOTION.scroll;
  const now2 = options2.now ?? defaultNow;
  const ownership = options2.ownership;
  let stick = true;
  let outer = false;
  let follow = null;
  let lastTickAt = 0;
  let userScrollAt = 0;
  let programmaticUntil = 0;
  let lastTop = null;
  const setStick = (next) => {
    if (stick === next) return;
    stick = next;
    options2.onStickChange?.(next);
  };
  const cancelTween = () => {
    follow = null;
  };
  const writeTop = (top) => {
    target.writeTop(top);
    ownership.write(target.readTop());
  };
  const jump = (behavior = "auto") => {
    setStick(true);
    cancelTween();
    const content = target.readContent();
    if (behavior === "smooth" && typeof target.smoothTo === "function") {
      programmaticUntil = now2() + config.smoothWindowMs;
      if (!target.smoothTo(content, "smooth")) writeTop(content);
      else ownership.write(target.readTop());
      return;
    }
    writeTop(content);
  };
  const attach = () => {
    lastTop = target.readTop();
    ownership.write(lastTop);
    cancelTween();
    userScrollAt = 0;
    programmaticUntil = 0;
  };
  const reset = () => {
    cancelTween();
    lastTickAt = 0;
    lastTop = null;
    userScrollAt = 0;
    programmaticUntil = 0;
    setStick(true);
  };
  const step = () => {
    const at = now2();
    const viewport = target.readViewport();
    const content = target.readContent();
    const frameMs = lastTickAt === 0 ? 0 : Math.max(0, at - lastTickAt);
    lastTickAt = at;
    const busyUser = at - userScrollAt < config.userScrollWindowMs;
    if (!busyUser && content - viewport - target.readTop() > config.instantAbove) {
      if (stick) writeTop(content);
      cancelTween();
      return false;
    }
    const actualTop = target.readTop();
    const verdict = ownership.classify(actualTop);
    if (verdict.source === "external") {
      lastTop = actualTop;
      userScrollAt = at;
      options2.onExternal?.({ top: actualTop, delta: verdict.delta, stick, direction: verdict.direction });
      if (verdict.direction === "up" && stick) {
        cancelTween();
        options2.onUnstick?.({ by: "scroll", delta: verdict.delta });
        setStick(false);
        return true;
      }
    }
    if (!stick) {
      options2.onFrame?.({
        top: Math.round(actualTop),
        content: Math.round(content),
        margin: 0,
        target: Math.round(Math.max(0, content - viewport)),
        rate: 0,
        moved: 0,
        dt: Math.round(frameMs),
        stick: 0
      });
      return false;
    }
    const state2 = follow ?? createFollowState(at, content, actualTop);
    const result = stepFollow(state2, { height: content, viewport, at, config });
    follow = result.state;
    const before = target.readTop();
    target.writeTop(result.position);
    ownership.write(target.readTop());
    const moved = target.readTop() - before;
    options2.onFrame?.({
      top: Math.round(target.readTop()),
      content: Math.round(content),
      margin: Math.round(result.margin),
      target: Math.round(result.target),
      rate: Math.round(result.rate),
      moved: Math.round(moved),
      dt: Math.round(frameMs),
      stick: 1
    });
    return !result.idle;
  };
  const onIntent = (kind, deltaY = 0) => {
    options2.onUnstick?.({ by: kind, delta: deltaY });
    if (!stick) return;
    programmaticUntil = now2() + config.yieldWindowMs;
    cancelTween();
    setStick(false);
  };
  const onScroll = () => {
    const currentTop = target.readTop();
    const delta = lastTop === null ? 0 : currentTop - lastTop;
    lastTop = currentTop;
    const verdict = ownership.classify(currentTop);
    if (verdict.source === "ours") return;
    userScrollAt = now2();
    const content = target.readContent();
    const viewport = target.readViewport();
    const distance2 = content - currentTop - viewport;
    const wasSticking = stick;
    if (distance2 <= STICK_THRESHOLD && verdict.direction === "down") {
      programmaticUntil = 0;
      setStick(true);
      if (!wasSticking) return;
    }
    if (distance2 <= STICK_THRESHOLD) return;
    if (now2() < programmaticUntil) return;
    if (delta < -config.ownershipTolerance) {
      options2.onUnstick?.({ by: "scroll", delta });
      programmaticUntil = 0;
      cancelTween();
      setStick(false);
    }
  };
  return {
    get sticking() {
      return stick;
    },
    get outer() {
      return outer;
    },
    jump,
    step,
    onScroll,
    onIntent,
    attach,
    reset
  };
}

// src/client/chat-a2ui/scroll-ownership.ts
var OUTER_SCROLL_SELECTOR = "[data-conversation-scroll]";
function resolveScroller({ container, forceInner = false }) {
  if (container === null) return { element: null, reason: "container" };
  if (forceInner) return { element: container, reason: "declared" };
  const outer = container.closest(OUTER_SCROLL_SELECTOR);
  if (outer instanceof HTMLElement) return { element: outer, reason: "outer" };
  return { element: container, reason: "container" };
}
function directionOf(delta) {
  if (delta < 0) return "up";
  if (delta > 0) return "down";
  return "none";
}
function createOwnership({ tolerance, initial }) {
  let baseline = initial === void 0 ? null : initial;
  return {
    get tolerance() {
      return tolerance;
    },
    get baseline() {
      return baseline;
    },
    write(top) {
      baseline = top;
    },
    classify(top) {
      if (baseline === null) return { source: "ours", delta: 0, direction: "none" };
      const delta = top - baseline;
      const source = Math.abs(delta) <= tolerance ? "ours" : "external";
      return { source, delta, direction: directionOf(delta) };
    }
  };
}

// src/client/chat-a2ui/scroll-frame.ts
var FOLLOW_FRAME_KEYS = [
  "top",
  "content",
  "margin",
  "target",
  "rate",
  "moved",
  "dt",
  "stick"
];
function frameRecord(frame2) {
  const record = {};
  for (const key of FOLLOW_FRAME_KEYS) record[key] = frame2[key];
  return record;
}

// src/client/chat-a2ui/scroll-probe.ts
var RING = 6e3;
var STATE_KEY = "__cauiProbeState";
function state() {
  if (typeof window === "undefined") return null;
  const scope = window;
  const existing = scope[STATE_KEY];
  if (existing !== void 0) return existing;
  const created = {
    entries: [],
    active: false,
    installed: false,
    hud: null,
    hudAt: 0,
    lastTickAt: 0,
    fpsFrames: 0,
    fpsAt: 0,
    fps: 0
  };
  scope[STATE_KEY] = created;
  return created;
}
function probeEnabled() {
  if (typeof window === "undefined") return false;
  try {
    if (window.location.hash.toLowerCase().includes("caui-probe")) return true;
    return window.localStorage.getItem("caui:probe") === "1";
  } catch {
    return false;
  }
}
function probeLogged() {
  return state()?.active === true;
}
function probeLog(kind, data = {}) {
  const current = state();
  if (current === null || !current.active) return;
  current.entries.push({ t: Math.round(performance.now()), kind, ...data });
  if (current.entries.length > RING) current.entries.splice(0, current.entries.length - RING);
}
function probeTick(frame2) {
  const current = state();
  if (current === null || !current.active) return;
  const now2 = performance.now();
  if (now2 - current.lastTickAt < 50) return;
  current.lastTickAt = now2;
  probeLog("tick", frameRecord(frame2));
}
function probeHud(lines) {
  const current = state();
  if (current === null || !current.active) return;
  const now2 = performance.now();
  current.fpsFrames += 1;
  if (current.fpsAt === 0) current.fpsAt = now2;
  if (now2 - current.hudAt < 100) return;
  current.hudAt = now2;
  const elapsed = now2 - current.fpsAt;
  if (elapsed >= 500) {
    current.fps = Math.round(current.fpsFrames * 1e3 / elapsed);
    current.fpsFrames = 0;
    current.fpsAt = now2;
  }
  if (current.hud === null || !current.hud.isConnected) installHud(current);
  if (current.hud !== null) {
    current.hud.textContent = lines.concat("fps " + current.fps + " \xB7 " + current.entries.length + " \u6761").join("\n");
  }
}
function installHud(current) {
  if (typeof document === "undefined") return;
  const existing = document.querySelector("#caui-probe-hud");
  if (existing instanceof HTMLElement) {
    current.hud = existing;
    return;
  }
  const element = document.createElement("div");
  element.id = "caui-probe-hud";
  element.setAttribute("aria-hidden", "true");
  element.style.cssText = [
    "position: fixed",
    "right: 12px",
    "bottom: 12px",
    "z-index: 9999",
    "padding: 6px 8px",
    "border-radius: 6px",
    "background: rgba(12, 16, 22, 0.78)",
    "color: #8ef0d4",
    "font: 11px/1.45 ui-monospace, SFMono-Regular, Consolas, monospace",
    "white-space: pre",
    "pointer-events: none",
    "box-shadow: 0 6px 20px rgba(0, 0, 0, 0.25)"
  ].join(";");
  element.textContent = "caui probe";
  document.body.appendChild(element);
  current.hud = element;
}
function removeHud() {
  const current = state();
  if (current === null) return;
  if (current.hud !== null) current.hud.remove();
  current.hud = null;
  const existing = document.querySelector("#caui-probe-hud");
  if (existing !== null) existing.remove();
}
function probeInstall() {
  if (typeof window === "undefined") return;
  const current = state();
  if (current === null || current.installed || !probeEnabled()) return;
  current.installed = true;
  current.active = true;
  const api = {
    on: () => {
      current.active = true;
      return "on";
    },
    off: () => {
      current.active = false;
      removeHud();
      return "off";
    },
    clear: () => {
      current.entries = [];
      return "cleared";
    },
    tail: (count = 40) => JSON.stringify(current.entries.slice(-count), null, 1),
    dump: () => JSON.stringify(current.entries, null, 1),
    overlay: (show = true) => {
      if (show) installHud(current);
      else removeHud();
      return show ? "on" : "off";
    },
    save: (name = "caui-probe.json") => {
      try {
        const blob = new Blob([JSON.stringify(current.entries, null, 1)], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        const anchor = document.createElement("a");
        anchor.href = url;
        anchor.download = name;
        anchor.click();
        setTimeout(() => URL.revokeObjectURL(url), 2e3);
        return "saved " + current.entries.length;
      } catch (error) {
        return "save failed: " + String(error);
      }
    },
    /** 打一条自定义标记（例如 scrolled=a 之类的场景切分）。 */
    mark: (kind = "mark", data = "") => {
      probeLog(kind, { note: data });
      return "marked " + kind;
    },
    /** 打一条会话切换标记：B4「切会话单次落位」只有打了标记才判。 */
    session: (id3 = "") => {
      probeLog("session", { id: String(id3).slice(0, 12) });
      return "session " + id3;
    },
    /** 模拟用户上滚（给自动化用）。 */
    scrollUp: (px2 = 180) => {
      const target = findProbeViewport();
      if (target === null) return "no scroller";
      target.scrollTop = Math.max(0, target.scrollTop - px2);
      return "top " + Math.round(target.scrollTop);
    },
    /**
     * 按「验收标准」检查当前这份日志，返回每条判据的通过情况。
     * 这是唯一需要看的东西：`__cauiProbe.check()` 一行就能说清过没过。
     */
    check: () => JSON.stringify(checkEntries(current.entries), null, 1)
  };
  const onError = (event) => {
    probeLog("error", { message: String(event.message ?? "").slice(0, 140) });
  };
  const onRejection = (event) => {
    probeLog("error", { message: String(event.reason ?? "").slice(0, 140) });
  };
  window.addEventListener("error", onError);
  window.addEventListener("unhandledrejection", onRejection);
  window.__cauiProbe = api;
  probeLog("install", { hash: window.location.hash.slice(0, 40) });
}
var LIMITS = {
  /** A3：距真底部 ≤ 1px。 */
  settle: 1,
  /** B1：用户上滚后的观察窗。 */
  quietMs: 500,
  /** B2：上滚后 1s 内漂移 ≤ 2px。 */
  driftMs: 1e3,
  drift: 2,
  /** B3：用户往下滚超过 2px 才允许重新吸附。 */
  restick: 2,
  /** B4：落位之后要求静止的帧数。 */
  landingFrames: 10,
  /** C2：生成期间底部余量。 */
  marginC2: 120,
  /** 证据下限：少于这么多帧直接不算过。 */
  minTicks: 10
};
function num2(entry, key) {
  const value = Number(entry[key] ?? 0);
  return Number.isFinite(value) ? value : 0;
}
function within(entries2, from, windowMs, kind) {
  return entries2.filter((entry) => entry.kind === kind && entry.t >= from && entry.t < from + windowMs);
}
function checkEntries(entries2) {
  const ticks = entries2.filter((entry) => entry.kind === "tick");
  const unsticks = entries2.filter((entry) => entry.kind === "unstick");
  const unverified = [];
  const limit = MOTION.scroll.maxSpeed;
  const maxVelocity = ticks.reduce((max, entry) => {
    const dt = num2(entry, "dt");
    if (dt <= 0) return max;
    return Math.max(max, Math.abs(num2(entry, "moved")) / dt * 1e3);
  }, 0);
  const lastTick = ticks[ticks.length - 1];
  const lastIndex = lastTick === void 0 ? -1 : entries2.lastIndexOf(lastTick);
  const takenOver = lastTick !== void 0 && (num2(lastTick, "stick") === 0 || entries2.slice(lastIndex + 1).some((entry) => entry.kind === "unstick"));
  const gap = lastTick === void 0 || takenOver ? null : Math.abs(num2(lastTick, "target") - num2(lastTick, "top"));
  const settleMeasured = gap !== null;
  if (!settleMeasured) unverified.push("A3");
  const followed = ticks.filter((entry) => num2(entry, "stick") === 1);
  const minMargin = followed.length === 0 ? null : followed.reduce((min, entry) => Math.min(min, num2(entry, "margin")), Number.POSITIVE_INFINITY);
  const marginFloor = MOTION.scroll.minMargin * 0.6;
  if (minMargin === null) unverified.push("A4");
  let quietViolations = 0;
  let driftMax = 0;
  for (const unstick of unsticks) {
    const at = unstick.t;
    const quietTicks = within(entries2, at, LIMITS.quietMs, "tick");
    if (quietTicks.some((entry) => Math.abs(num2(entry, "moved")) >= 1)) quietViolations += 1;
    const driftTicks = within(entries2, at, LIMITS.driftMs, "tick");
    const drift = driftTicks.reduce((sum, entry) => sum + Math.abs(num2(entry, "moved")), 0);
    driftMax = Math.max(driftMax, drift);
  }
  const quietMeasured = unsticks.length > 0;
  if (!quietMeasured) {
    unverified.push("B1");
    unverified.push("B2");
  }
  let resticks = 0;
  let suspicious = 0;
  for (let index = 1; index < entries2.length; index += 1) {
    const entry = entries2[index];
    const previous = entries2[index - 1];
    if (entry === void 0 || previous === void 0) continue;
    if (entry.kind !== "scroll" || previous.kind !== "scroll") continue;
    if (Number(previous.stick) === 0 && Number(entry.stick) === 1) {
      resticks += 1;
      const written = num2(entry, "w");
      if (num2(entry, "top") <= written + LIMITS.restick) suspicious += 1;
    }
  }
  const marks = entries2.filter((entry) => entry.kind === "session");
  let landings = 0;
  let landingOk = true;
  let landingMeasured = marks.length > 0;
  for (const mark of marks) {
    const after = entries2.slice(entries2.indexOf(mark) + 1);
    const landingAt = after.findIndex((entry) => entry.kind === "scroll");
    if (landingAt < 0) {
      landingMeasured = false;
      continue;
    }
    const frames = after.slice(landingAt).filter((entry) => entry.kind === "tick").slice(0, LIMITS.landingFrames);
    if (frames.length < LIMITS.landingFrames) {
      landingMeasured = false;
      continue;
    }
    landings += 1;
    if (frames.some((entry) => Math.abs(num2(entry, "moved")) > 1)) landingOk = false;
  }
  if (!landingMeasured) unverified.push("B4");
  const errors = entries2.filter((entry) => entry.kind === "error").length;
  const enough = ticks.length >= LIMITS.minTicks;
  const moveOk = maxVelocity <= limit;
  const settleOk = settleMeasured && (gap ?? Number.POSITIVE_INFINITY) <= LIMITS.settle;
  const marginOk = minMargin !== null && minMargin >= marginFloor && minMargin >= LIMITS.marginC2;
  const quietOk = quietViolations === 0;
  const driftOk = driftMax <= LIMITS.drift;
  const restickOk = suspicious === 0;
  const errorsOk = errors === 0;
  const complete = enough && unverified.length === 0;
  const pass = complete && moveOk && settleOk && marginOk && quietOk && driftOk && restickOk && landingOk && errorsOk;
  return {
    pass,
    complete,
    unverified,
    evidence: { ticks: ticks.length, enough },
    move: { maxVelocity: Math.round(maxVelocity), limit, ok: moveOk },
    settle: { gap: gap === null ? null : Math.round(gap), limit: LIMITS.settle, ok: settleOk, measured: settleMeasured },
    margin: { min: minMargin === null ? null : Math.round(minMargin), floor: Math.round(marginFloor), c2: LIMITS.marginC2, ok: marginOk, measured: minMargin !== null },
    quiet: { unsticks: unsticks.length, violations: quietViolations, windowMs: LIMITS.quietMs, ok: quietOk, measured: quietMeasured },
    drift: { max: Math.round(driftMax), limit: LIMITS.drift, ok: driftOk, measured: quietMeasured },
    restick: { resticks, suspicious, threshold: LIMITS.restick, ok: restickOk, measured: resticks > 0 },
    switchLanding: { landings, ok: landingMeasured ? landingOk : false, measured: landingMeasured },
    errors: { count: errors, ok: errorsOk }
  };
}
function findProbeViewport() {
  if (typeof document === "undefined") return null;
  const container = document.querySelector("." + cls.viewport);
  if (!(container instanceof HTMLElement)) return null;
  return resolveScroller({ container }).element;
}

// src/client/chat-a2ui/ScrollToBottom.tsx
var import_jsx_runtime14 = require("react/jsx-runtime");
var useIsoLayoutEffect = typeof window === "undefined" ? import_react32.useEffect : import_react32.useLayoutEffect;
function targetOf(element) {
  return {
    readTop: () => element.scrollTop,
    readContent: () => element.scrollHeight,
    readViewport: () => element.clientHeight,
    writeTop: (top) => {
      element.scrollTop = top;
    },
    smoothTo: (top, behavior) => {
      if (typeof element.scrollTo !== "function") return false;
      try {
        element.scrollTo({ top, behavior });
        return true;
      } catch {
        return false;
      }
    }
  };
}
function useStickToBottom({
  containerRef,
  contentRef,
  revision,
  forceInner = false
}) {
  const [atBottom, setAtBottom] = (0, import_react32.useState)(true);
  const [outer, setOuter] = (0, import_react32.useState)(false);
  const controllerRef = (0, import_react32.useRef)(null);
  const ownerRef = (0, import_react32.useRef)(null);
  const tweenRef = (0, import_react32.useRef)(null);
  const ownershipRef = (0, import_react32.useRef)(null);
  const primedRef = (0, import_react32.useRef)(false);
  const logTopRef = (0, import_react32.useRef)(0);
  const resolveOwner = (0, import_react32.useCallback)(() => {
    const base = containerRef.current;
    if (base === null) return { element: null, outer: false };
    const resolved = resolveScroller({ container: base, forceInner });
    return { element: resolved.element, outer: resolved.reason === "outer" };
  }, [containerRef, forceInner]);
  const ensureController = (0, import_react32.useCallback)(() => {
    const resolved = resolveOwner();
    if (resolved.element === null) return null;
    if (ownershipRef.current === null) {
      ownershipRef.current = createOwnership({ tolerance: MOTION.scroll.ownershipTolerance });
    }
    const existing = controllerRef.current;
    if (existing !== null && ownerRef.current === resolved.element) return existing;
    const ownership = ownershipRef.current;
    const controller = createFollowController(targetOf(resolved.element), {
      ownership,
      onStickChange: (stick) => {
        setAtBottom(stick);
      },
      onFrame: (frame2) => {
        probeTick(frame2);
      },
      onExternal: (info) => {
        probeLog("external", {
          top: Math.round(info.top),
          delta: Math.round(info.delta),
          stick: info.stick ? 1 : 0
        });
      },
      onUnstick: (info) => {
        probeLog("unstick", info.delta === void 0 ? { by: info.by } : { by: info.by, delta: Math.round(info.delta) });
      }
    });
    ownerRef.current = resolved.element;
    setOuter(resolved.outer);
    controller.attach();
    controllerRef.current = controller;
    return controller;
  }, [resolveOwner]);
  const runFrame = (0, import_react32.useCallback)(() => {
    tweenRef.current = null;
    const controller = controllerRef.current;
    if (controller === null) return;
    const more = controller.step();
    const owner = ownerRef.current;
    if (owner !== null) {
      probeHud([
        "top " + Math.round(owner.scrollTop) + "  content " + Math.round(owner.scrollHeight),
        "stick " + (controller.sticking ? "on" : "off")
      ]);
    }
    if (!more) return;
    if (typeof requestAnimationFrame !== "function") return;
    tweenRef.current = requestAnimationFrame(runFrame);
  }, []);
  const scheduleStep = (0, import_react32.useCallback)(() => {
    if (typeof requestAnimationFrame !== "function") return;
    if (tweenRef.current !== null) return;
    tweenRef.current = requestAnimationFrame(runFrame);
  }, [runFrame]);
  const cancelTween = (0, import_react32.useCallback)(() => {
    if (tweenRef.current !== null && typeof cancelAnimationFrame === "function") {
      cancelAnimationFrame(tweenRef.current);
    }
    tweenRef.current = null;
  }, []);
  const scrollToBottom = (0, import_react32.useCallback)((behavior = "smooth") => {
    const controller = ensureController();
    if (controller === null) return;
    primedRef.current = true;
    cancelTween();
    const resolved = reducedMotion() ? "auto" : behavior;
    controller.jump(resolved);
    scheduleStep();
  }, [ensureController, cancelTween, scheduleStep]);
  useIsoLayoutEffect(() => {
    const controller = ensureController();
    if (controller === null) return;
    if (!controller.sticking) return;
    if (!primedRef.current) {
      primedRef.current = true;
      controller.jump("auto");
      return;
    }
    scheduleStep();
  }, [revision, ensureController, scheduleStep]);
  useIsoLayoutEffect(() => {
    probeInstall();
    const controller = ensureController();
    if (controller === null) return;
    const owner = ownerRef.current;
    if (owner === null) return;
    const content = contentRef.current;
    logTopRef.current = owner.scrollTop;
    const scheduleFollow = () => {
      scheduleStep();
    };
    const onScroll = () => {
      const top = owner.scrollTop;
      const delta = top - logTopRef.current;
      logTopRef.current = top;
      const baseline = ownershipRef.current?.baseline ?? top;
      const verdict = ownershipRef.current?.classify(top);
      probeLog("scroll", {
        top: Math.round(top),
        delta: Math.round(delta),
        w: Math.round(baseline),
        ours: verdict?.source === "ours" ? 1 : 0,
        stick: controller.sticking ? 1 : 0,
        h: Math.round(owner.scrollHeight)
      });
      const wasSticking = controller.sticking;
      controller.onScroll();
      if (!wasSticking && controller.sticking) scheduleStep();
    };
    const onWheel = (event) => {
      if (event.deltaY >= 0) return;
      controller.onIntent("wheel", event.deltaY);
      scheduleStep();
    };
    const onTouchStart = () => {
      controller.onIntent("touch");
      scheduleStep();
    };
    owner.addEventListener("scroll", onScroll, { passive: true });
    owner.addEventListener("wheel", onWheel, { passive: true });
    owner.addEventListener("touchstart", onTouchStart, { passive: true });
    const mutation = typeof MutationObserver === "function" ? new MutationObserver((records) => {
      if (probeLogged()) {
        const flow = contentRef.current;
        const rows = flow === null ? null : flow.querySelectorAll(".caui-row");
        const lastRow = rows === null || rows.length === 0 ? null : rows[rows.length - 1] ?? null;
        probeLog("mut", {
          n: records.length,
          h: Math.round(owner.scrollHeight),
          top: Math.round(owner.scrollTop),
          rows: rows === null ? null : rows.length,
          lastH: lastRow === null ? null : Math.round(lastRow.getBoundingClientRect().height)
        });
      }
      scheduleFollow();
    }) : null;
    mutation?.observe(content ?? owner, {
      childList: true,
      characterData: true,
      subtree: true
    });
    const resize = typeof ResizeObserver === "function" ? new ResizeObserver(() => scheduleFollow()) : null;
    if (resize !== null) {
      resize.observe(owner);
      if (content !== null) resize.observe(content);
    }
    return () => {
      owner.removeEventListener("scroll", onScroll);
      owner.removeEventListener("wheel", onWheel);
      owner.removeEventListener("touchstart", onTouchStart);
      cancelTween();
      mutation?.disconnect();
      resize?.disconnect();
    };
  }, [containerRef, contentRef, revision, ensureController, scheduleStep, cancelTween]);
  return { atBottom, outer, scrollToBottom };
}
function ScrollToBottomButton({ atBottom, onScrollToBottom }) {
  return /* @__PURE__ */ (0, import_jsx_runtime14.jsx)(
    "button",
    {
      type: "button",
      className: cx(cls.scrollButton, !atBottom && cls.scrollButtonVisible),
      onClick: onScrollToBottom,
      "aria-label": "\u56DE\u5230\u5E95\u90E8",
      title: "\u56DE\u5230\u5E95\u90E8",
      children: /* @__PURE__ */ (0, import_jsx_runtime14.jsx)(
        "svg",
        {
          viewBox: "0 0 16 16",
          width: "16",
          height: "16",
          "aria-hidden": "true",
          focusable: "false",
          fill: "none",
          stroke: "currentColor",
          strokeWidth: 1.6,
          strokeLinecap: "round",
          strokeLinejoin: "round",
          children: /* @__PURE__ */ (0, import_jsx_runtime14.jsx)("path", { d: "M8 3.5v8M4.6 8.4 8 11.8l3.4-3.4" })
        }
      )
    }
  );
}

// src/client/chat-a2ui/styles/base.ts
var BASE_CSS = `
/* =============================================================================
   dsh-chat-a2ui \xB7 \u4F1A\u8BDD\u89C6\u56FE\u6837\u5F0F\u8868
   1. \u7ED3\u6784\uFF1Aroot\uFF08flex \u5217\uFF09> viewport\uFF08\u6EDA\u52A8\uFF09> flow\uFF08\u6D88\u606F\u6D41\uFF09
   2. \u989C\u8272\uFF1A\u4F18\u5148\u8BFB DSH \u8BBE\u8BA1\u53D8\u91CF --dsw-*\uFF0C\u5168\u90E8\u5E26\u4EAE\u8272\u56DE\u9000\u503C
   3. \u4E3B\u9898\uFF1Aprefers-color-scheme + \u5BBF\u4E3B [data-theme="dark"|"light"]
   4. \u65AD\u70B9\uFF1A640px \u4EE5\u4E0B\u6536\u7D27\u7559\u767D\u3001\u9690\u85CF\u6B21\u8981\u4FE1\u606F
   ============================================================================= */

/* ---------------------------------------------------------------------------
   \u4F5C\u7528\u57DF\u4E0E\u8BBE\u8BA1\u53D8\u91CF\u6865\u63A5
   --------------------------------------------------------------------------- */
.caui-root {
  --caui-fg: var(--dsw-alias-label-primary, #1c1c22);
  --caui-bg: var(--dsw-alias-bg-base, #ffffff);
  --caui-card: var(--dsw-alias-bg-layer-1, #ffffff);
  --caui-subtle: var(--dsw-subtle, rgba(28, 28, 34, 0.045));
  --caui-subtle-hover: var(--dsw-subtle-hover, rgba(28, 28, 34, 0.08));
  --caui-muted: var(--dsw-alias-label-secondary, #6a6a76);
  --caui-border: var(--dsw-alias-border-l2, rgba(28, 28, 34, 0.12));
  --caui-border-strong: var(--dsw-alias-border-l4, rgba(28, 28, 34, 0.24));
  --caui-accent: var(--dsw-alias-state-business-primary, #4c5bd4);
  --caui-accent-fg: var(--dsw-accent-foreground, #ffffff);
  --caui-danger: var(--dsw-danger, #d33b3b);
  --caui-ok: var(--dsw-success, #2f9e6b);
  --caui-warn: var(--dsw-warning, #b7791f);
  --caui-radius: var(--dsw-radius, 12px);
  --caui-radius-sm: var(--dsw-radius-sm, 8px);
  --caui-mono: var(--dsw-font-mono, ui-monospace, SFMono-Regular, "SF Mono", Menlo, Consolas,
      "Liberation Mono", "Courier New", monospace);
  --caui-sans: var(--dsw-font-sans, ui-sans-serif, system-ui, -apple-system, "Segoe UI",
      "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", sans-serif);
  --caui-shadow: var(--dsw-shadow-popover, 0 10px 30px rgba(15, 18, 42, 0.12));

  position: relative;
  display: flex;
  flex: 1 1 auto;
  flex-direction: column;
  width: 100%;
  height: 100%;
  min-width: 0;
  min-height: 0;
  overflow: hidden;
  background: var(--caui-bg);
  color: var(--caui-fg);
  font-family: var(--caui-sans);
  font-size: 15px;
  line-height: 1.6;
  text-align: left;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-rendering: optimizeLegibility;
}

.caui-root *,
.caui-root *::before,
.caui-root *::after {
  box-sizing: border-box;
}

.caui-root :focus-visible {
  outline: 2px solid var(--caui-accent);
  outline-offset: 2px;
}

/* ---------------------------------------------------------------------------
   \u9AA8\u67B6\uFF1A\u6EDA\u52A8\u5BB9\u5668\u4E0E\u6D88\u606F\u6D41
   --------------------------------------------------------------------------- */
.caui-viewport {
  position: relative;
  flex: 1 1 auto;
  min-height: 0;
  overflow-x: hidden;
  overflow-y: auto;
  overscroll-behavior-y: contain;
  /* \u4E0D\u8981\u5728\u8FD9\u91CC\u5199 scroll-behavior: smooth\uFF1A\u7A0B\u5E8F\u5316\u8D34\u5E95\u9700\u8981\u77AC\u65F6\u8D4B\u503C */
  scrollbar-width: thin;
  scrollbar-color: var(--caui-border-strong) transparent;
}

.caui-viewport::-webkit-scrollbar {
  width: 10px;
  height: 10px;
}

.caui-viewport::-webkit-scrollbar-track {
  background: transparent;
}

.caui-viewport::-webkit-scrollbar-thumb {
  background: var(--caui-border-strong);
  background-clip: content-box;
  border: 3px solid transparent;
  border-radius: 999px;
}

.caui-viewport::-webkit-scrollbar-thumb:hover {
  background: var(--caui-muted);
  background-clip: content-box;
}

.caui-flow {
  display: flex;
  flex-direction: column;
  gap: 18px;
  width: 100%;
  /* \u8BA9\u7A7A\u6001\u80FD\u5782\u76F4\u5C45\u4E2D\uFF1Aflow \u81F3\u5C11\u94FA\u6EE1\u4E00\u5C4F\uFF0C\u7A7A\u6001\u9762\u677F\u518D\u7528 flex: 1 \u6491\u5F00 */
  min-height: 100%;
  max-width: 820px;
  margin: 0 auto;
  padding: 22px 20px 32px;
}

/* \u539F\u751F conversation \u7684 Chat UI tab \u7531 [data-conversation-scroll] \u62E5\u6709\u6EDA\u52A8\u3002
   \u6B64\u65F6\u8BA9\u6839\u8282\u70B9\u6309\u5185\u5BB9\u81EA\u7136\u589E\u9AD8\uFF0C\u672B\u5C3E\u7559\u51FA composer \u7684\u9AD8\u5EA6\uFF0C
   \u56DE\u5230\u5E95\u90E8\u6309\u94AE\u6539\u4E3A\u56FA\u5B9A\u5B9A\u4F4D\uFF0C\u907F\u514D\u548C\u5185\u5C42\u6EDA\u52A8\u5BB9\u5668\u53E0\u5728\u4E00\u8D77\u3002 */
.caui-root[data-scroll-owner="outer"] {
  flex: 0 0 auto;
  height: auto;
  overflow: visible;
}

.caui-root[data-scroll-owner="outer"] .caui-viewport {
  flex: 0 0 auto;
  overflow: visible;
}

.caui-root[data-scroll-owner="outer"] .caui-flow {
  /* \u5916\u5C42\u6EDA\u52A8\u65F6\u8F93\u5165\u6846\u662F\u6D6E\u5C42\uFF0C\u7ED9\u6D88\u606F\u6D41\u672B\u5C3E\u7559\u51FA\u9ED8\u8BA4 composer \u9AD8\u5EA6\u3002 */
  padding-bottom: var(--caui-composer-clearance, 270px);
}

.caui-root[data-scroll-owner="outer"] .caui-scroll-button {
  position: fixed;
  right: 24px;
  bottom: 184px;
  margin: 0;
}


/* ---------------------------------------------------------------------------
   Chat \u6A21\u5F0F\uFF1A\u72EC\u7ACB\u4E3B\u9762\u677F + \u4FA7\u680F\u4F1A\u8BDD\u5217\u8868
   --------------------------------------------------------------------------- */
.caui-chat-page,
.caui-chat-list {
  --caui-fg: var(--dsw-alias-label-primary, #1c1c22);
  --caui-bg: var(--dsw-alias-bg-base, #ffffff);
  --caui-card: var(--dsw-alias-bg-layer-1, #ffffff);
  --caui-subtle: var(--dsw-subtle, rgba(28, 28, 34, 0.045));
  --caui-subtle-hover: var(--dsw-subtle-hover, rgba(28, 28, 34, 0.08));
  --caui-muted: var(--dsw-alias-label-secondary, #6a6a76);
  --caui-border: var(--dsw-alias-border-l2, rgba(28, 28, 34, 0.12));
  --caui-border-strong: var(--dsw-alias-border-l4, rgba(28, 28, 34, 0.24));
  --caui-accent: var(--dsw-alias-state-business-primary, #4c5bd4);
  --caui-accent-fg: var(--dsw-accent-foreground, #ffffff);
  --caui-danger: var(--dsw-danger, #d33b3b);
  --caui-radius: var(--dsw-radius, 12px);
  --caui-radius-sm: var(--dsw-radius-sm, 8px);
  --caui-shadow: var(--dsw-shadow-popover, 0 10px 30px rgba(15, 18, 42, 0.12));
  --caui-sans: var(--dsw-font-sans, ui-sans-serif, system-ui, -apple-system, "Segoe UI",
      "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", sans-serif);

  color: var(--caui-fg);
  font-family: var(--caui-sans);
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

.caui-chat-page *,
.caui-chat-page *::before,
.caui-chat-page *::after,
.caui-chat-list *,
.caui-chat-list *::before,
.caui-chat-list *::after {
  box-sizing: border-box;
}

.caui-chat-page :focus-visible,
.caui-chat-list :focus-visible {
  outline: 2px solid var(--caui-accent);
  outline-offset: 2px;
}

/* ---------------------------------------------------------------------------
   \u6697\u8272\u4E3B\u9898\uFF1A\u7CFB\u7EDF\u504F\u597D + \u5BBF\u4E3B\u663E\u5F0F\u4E3B\u9898
   --------------------------------------------------------------------------- */
@media (prefers-color-scheme: dark) {
  .caui-root {
    --caui-fg: var(--dsw-foreground, #e9e9ef);
    --caui-bg: var(--dsw-background, #141419);
    --caui-card: var(--dsw-card, var(--dsw-surface, #1b1b22));
    --caui-subtle: var(--dsw-subtle, rgba(255, 255, 255, 0.055));
    --caui-subtle-hover: var(--dsw-subtle-hover, rgba(255, 255, 255, 0.095));
    --caui-muted: var(--dsw-muted-foreground, #9a9aa8);
    --caui-border: var(--dsw-border, rgba(255, 255, 255, 0.12));
    --caui-border-strong: var(--dsw-border-strong, rgba(255, 255, 255, 0.22));
    --caui-accent: var(--dsw-accent, #8b93ff);
    --caui-accent-fg: var(--dsw-accent-foreground, #101018);
    --caui-danger: var(--dsw-danger, #ff7b7b);
    --caui-ok: var(--dsw-success, #57c99a);
    --caui-warn: var(--dsw-warning, #e0b05a);
    --caui-shadow: var(--dsw-shadow-popover, 0 10px 30px rgba(0, 0, 0, 0.5));
  }
}

[data-theme="dark"] .caui-root,
.caui-root[data-theme="dark"] {
  --caui-fg: var(--dsw-foreground, #e9e9ef);
  --caui-bg: var(--dsw-background, #141419);
  --caui-card: var(--dsw-card, var(--dsw-surface, #1b1b22));
  --caui-subtle: var(--dsw-subtle, rgba(255, 255, 255, 0.055));
  --caui-subtle-hover: var(--dsw-subtle-hover, rgba(255, 255, 255, 0.095));
  --caui-muted: var(--dsw-muted-foreground, #9a9aa8);
  --caui-border: var(--dsw-border, rgba(255, 255, 255, 0.12));
  --caui-border-strong: var(--dsw-border-strong, rgba(255, 255, 255, 0.22));
  --caui-accent: var(--dsw-accent, #8b93ff);
  --caui-accent-fg: var(--dsw-accent-foreground, #101018);
  --caui-danger: var(--dsw-danger, #ff7b7b);
  --caui-ok: var(--dsw-success, #57c99a);
  --caui-warn: var(--dsw-warning, #e0b05a);
  --caui-shadow: var(--dsw-shadow-popover, 0 10px 30px rgba(0, 0, 0, 0.5));
}

@media (prefers-color-scheme: dark) {
  .caui-chat-page,
  .caui-chat-list {
    --caui-fg: var(--dsw-foreground, #e9e9ef);
    --caui-bg: var(--dsw-background, #141419);
    --caui-card: var(--dsw-card, var(--dsw-surface, #1b1b22));
    --caui-subtle: var(--dsw-subtle, rgba(255, 255, 255, 0.055));
    --caui-subtle-hover: var(--dsw-subtle-hover, rgba(255, 255, 255, 0.095));
    --caui-muted: var(--dsw-muted-foreground, #9a9aa8);
    --caui-border: var(--dsw-border, rgba(255, 255, 255, 0.12));
    --caui-border-strong: var(--dsw-border-strong, rgba(255, 255, 255, 0.22));
    --caui-accent: var(--dsw-accent, #8b93ff);
    --caui-accent-fg: var(--dsw-accent-foreground, #101018);
    --caui-danger: var(--dsw-danger, #ff7b7b);
    --caui-shadow: var(--dsw-shadow-popover, 0 10px 30px rgba(0, 0, 0, 0.5));
  }
}

[data-theme="dark"] .caui-chat-page,
[data-theme="dark"] .caui-chat-list,
.caui-chat-page[data-theme="dark"],
.caui-chat-list[data-theme="dark"] {
  --caui-fg: var(--dsw-foreground, #e9e9ef);
  --caui-bg: var(--dsw-background, #141419);
  --caui-card: var(--dsw-card, var(--dsw-surface, #1b1b22));
  --caui-subtle: var(--dsw-subtle, rgba(255, 255, 255, 0.055));
  --caui-subtle-hover: var(--dsw-subtle-hover, rgba(255, 255, 255, 0.095));
  --caui-muted: var(--dsw-muted-foreground, #9a9aa8);
  --caui-border: var(--dsw-border, rgba(255, 255, 255, 0.12));
  --caui-border-strong: var(--dsw-border-strong, rgba(255, 255, 255, 0.22));
  --caui-accent: var(--dsw-accent, #8b93ff);
  --caui-accent-fg: var(--dsw-accent-foreground, #101018);
  --caui-danger: var(--dsw-danger, #ff7b7b);
  --caui-shadow: var(--dsw-shadow-popover, 0 10px 30px rgba(0, 0, 0, 0.5));
}

/* \u5BBF\u4E3B\u660E\u786E\u8981\u6C42\u4EAE\u8272\u65F6\uFF0C\u538B\u8FC7\u7CFB\u7EDF\u6697\u8272\u504F\u597D */
[data-theme="light"] .caui-root,
.caui-root[data-theme="light"] {
  --caui-fg: var(--dsw-alias-label-primary, #1c1c22);
  --caui-bg: var(--dsw-alias-bg-base, #ffffff);
  --caui-card: var(--dsw-alias-bg-layer-1, #ffffff);
  --caui-subtle: var(--dsw-subtle, rgba(28, 28, 34, 0.045));
  --caui-subtle-hover: var(--dsw-subtle-hover, rgba(28, 28, 34, 0.08));
  --caui-muted: var(--dsw-alias-label-secondary, #6a6a76);
  --caui-border: var(--dsw-alias-border-l2, rgba(28, 28, 34, 0.12));
  --caui-border-strong: var(--dsw-alias-border-l4, rgba(28, 28, 34, 0.24));
  --caui-accent: var(--dsw-alias-state-business-primary, #4c5bd4);
  --caui-accent-fg: var(--dsw-accent-foreground, #ffffff);
  --caui-danger: var(--dsw-danger, #d33b3b);
  --caui-ok: var(--dsw-success, #2f9e6b);
  --caui-warn: var(--dsw-warning, #b7791f);
  --caui-shadow: var(--dsw-shadow-popover, 0 10px 30px rgba(15, 18, 42, 0.12));
}

/* ---------------------------------------------------------------------------
   B Soft glass\uFF08\u539F P0.6 \u89C6\u89C9\u5C42\uFF09\u5DF2\u5E76\u56DE\u672C\u5757
   --------------------------------------------------------------------------- */

/* B Soft glass \u7684\u8BBE\u8BA1\u53D8\u91CF\uFF1A\u73BB\u7483\u5E95\u8272\u3001\u63CF\u8FB9\u3001\u9634\u5F71\u3001\u5706\u89D2\u4E0E 4 \u4E2A\u5FAA\u73AF\u65F6\u957F */

.caui-root,
.caui-chat-page,
.caui-chat-list {
  --caui-glass-bg: rgba(255, 255, 255, 0.72);
  --caui-glass-bg-strong: rgba(255, 255, 255, 0.88);
  --caui-glass-border: rgba(255, 255, 255, 0.58);
  --caui-glass-line: rgba(20, 23, 40, 0.10);
  --caui-glass-shadow: 0 18px 48px rgba(20, 23, 40, 0.12);
  --caui-glass-shadow-soft: 0 8px 24px rgba(20, 23, 40, 0.08);
  --caui-glass-blur: 18px;
  --caui-radius-card: 14px;
  --caui-radius-panel: 16px;
  --caui-shimmer-base: var(--caui-muted);
  --caui-shimmer-highlight: var(--caui-fg);
  --caui-accent-soft: color-mix(in srgb, var(--caui-accent) 13%, transparent);
  /* 4 \u4E2A\u5FAA\u73AF\u52A8\u753B\u7684\u65F6\u957F\uFF1A\u9ED8\u8BA4\u503C\u5728\u8FD9\u91CC\uFF0C\u8FD0\u884C\u65F6\u7531 motion.config.json \u8986\u76D6
     \uFF08useChatStyles \u6CE8\u5165 data-caui-motion-vars\uFF09\u3002\u9996\u5E27 / \u65E0 JS \u4E5F\u4ECD\u6709\u52A8\u753B\u3002 */
  --caui-motion-caret: 1.05s;
  --caui-motion-pulse: 1.6s;
  --caui-motion-spin: 0.8s;
  --caui-motion-orb: 5.4s;
}

@supports not (backdrop-filter: blur(1px)) {
  .caui-root,
  .caui-chat-page,
  .caui-chat-list {
    --caui-glass-bg: var(--caui-card);
    --caui-glass-bg-strong: var(--caui-card);
    --caui-glass-blur: 0px;
  }
}

.caui-text-effect {
  margin: 0;
}

.caui-text-effect-line {
  display: block;
}

.caui-text-effect-segment,
.caui-text-effect-char {
  display: inline-block;
  white-space: pre;
}

.caui-text-scramble {
  display: inline-block;
}

.caui-sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}

@media (prefers-color-scheme: dark) {
  .caui-root:not([data-theme="light"]),
  .caui-chat-page:not([data-theme="light"]),
  .caui-chat-list:not([data-theme="light"]) {
    --caui-glass-bg: rgba(24, 24, 30, 0.72);
    --caui-glass-bg-strong: rgba(24, 24, 30, 0.88);
    --caui-glass-border: rgba(255, 255, 255, 0.09);
    --caui-glass-line: rgba(255, 255, 255, 0.10);
    --caui-glass-shadow: 0 18px 48px rgba(0, 0, 0, 0.42);
    --caui-glass-shadow-soft: 0 8px 24px rgba(0, 0, 0, 0.28);
    --caui-shimmer-base: #747482;
    --caui-shimmer-highlight: #ffffff;
  }

  .caui-chat-page:not([data-theme="light"]) {
    background:
      radial-gradient(1100px 520px at 12% -8%, rgba(90, 104, 255, 0.18), transparent 62%),
      radial-gradient(900px 480px at 100% 0%, rgba(50, 170, 165, 0.12), transparent 58%),
      var(--caui-bg);
  }
}

[data-theme="dark"] .caui-root,
[data-theme="dark"] .caui-chat-page,
[data-theme="dark"] .caui-chat-list,
.caui-root[data-theme="dark"],
.caui-chat-page[data-theme="dark"],
.caui-chat-list[data-theme="dark"] {
  --caui-glass-bg: rgba(24, 24, 30, 0.72);
  --caui-glass-bg-strong: rgba(24, 24, 30, 0.88);
  --caui-glass-border: rgba(255, 255, 255, 0.09);
  --caui-glass-line: rgba(255, 255, 255, 0.10);
  --caui-glass-shadow: 0 18px 48px rgba(0, 0, 0, 0.42);
  --caui-glass-shadow-soft: 0 8px 24px rgba(0, 0, 0, 0.28);
  --caui-shimmer-base: #747482;
  --caui-shimmer-highlight: #ffffff;
}

[data-theme="dark"] .caui-chat-page,
.caui-chat-page[data-theme="dark"] {
  background:
    radial-gradient(1100px 520px at 12% -8%, rgba(90, 104, 255, 0.18), transparent 62%),
    radial-gradient(900px 480px at 100% 0%, rgba(50, 170, 165, 0.12), transparent 58%),
    var(--caui-bg);
}

[data-theme="light"] .caui-root,
[data-theme="light"] .caui-chat-page,
[data-theme="light"] .caui-chat-list,
.caui-root[data-theme="light"],
.caui-chat-page[data-theme="light"],
.caui-chat-list[data-theme="light"] {
  --caui-glass-bg: rgba(255, 255, 255, 0.72);
  --caui-glass-bg-strong: rgba(255, 255, 255, 0.88);
  --caui-glass-border: rgba(255, 255, 255, 0.58);
  --caui-glass-line: rgba(20, 23, 40, 0.10);
  --caui-glass-shadow: 0 18px 48px rgba(20, 23, 40, 0.12);
  --caui-glass-shadow-soft: 0 8px 24px rgba(20, 23, 40, 0.08);
  --caui-shimmer-base: var(--caui-muted);
  --caui-shimmer-highlight: var(--caui-fg);
}

[data-theme="light"] .caui-chat-page,
.caui-chat-page[data-theme="light"] {
  background:
    radial-gradient(1100px 520px at 12% -8%, rgba(110, 123, 255, 0.14), transparent 62%),
    radial-gradient(900px 480px at 100% 0%, rgba(90, 200, 190, 0.10), transparent 58%),
    var(--caui-bg);
}

/* ---------------------------------------------------------------------------
   \u5BBF\u4E3B\u6697\u8272\u4E3B\u9898\uFF1Abody[data-ds-dark-theme]
   \u5BBF\u4E3B\u628A\u6DF1\u8272\u6536\u5728 body \u5C5E\u6027\u4E0A\uFF0C\u4E0D\u662F [data-theme]\uFF0C\u4E5F\u4E0D\u4E00\u5B9A\u547D\u4E2D
   prefers-color-scheme\uFF1B\u8FD9\u91CC\u76F4\u63A5\u8BFB\u5BBF\u4E3B\u7684 alias token\uFF0C\u4FDD\u8BC1\u4E0E\u5916\u58F3\u4E00\u81F4\u3002
   --------------------------------------------------------------------------- */
body[data-ds-dark-theme] .caui-root,
body[data-ds-dark-theme] .caui-chat-page,
body[data-ds-dark-theme] .caui-chat-list {
  --caui-fg: var(--dsw-alias-label-primary, #e9e9ef);
  --caui-bg: var(--dsw-alias-bg-base, #151517);
  --caui-card: var(--dsw-alias-bg-layer-1, #1f1f23);
  --caui-subtle: rgba(255, 255, 255, 0.055);
  --caui-subtle-hover: rgba(255, 255, 255, 0.10);
  --caui-muted: var(--dsw-alias-label-secondary, #a1a1aa);
  --caui-border: var(--dsw-alias-border-l2, rgba(255, 255, 255, 0.12));
  --caui-border-strong: var(--dsw-alias-border-l4, rgba(255, 255, 255, 0.20));
  --caui-accent: #4d6bfe;
  --caui-accent-fg: #ffffff;
  --caui-danger: #ff7b7b;
  --caui-ok: #57c99a;
  --caui-warn: #e0b05a;
  --caui-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
  --caui-glass-bg: rgba(24, 24, 30, 0.72);
  --caui-glass-bg-strong: rgba(24, 24, 30, 0.88);
  --caui-glass-border: rgba(255, 255, 255, 0.10);
  --caui-glass-line: rgba(255, 255, 255, 0.10);
  --caui-glass-shadow: 0 18px 48px rgba(0, 0, 0, 0.42);
  --caui-glass-shadow-soft: 0 8px 24px rgba(0, 0, 0, 0.28);
  --caui-shimmer-base: #747482;
  --caui-shimmer-highlight: #ffffff;
}

body[data-ds-dark-theme] .caui-chat-page {
  background:
    radial-gradient(1100px 520px at 12% -8%, rgba(77, 107, 254, 0.18), transparent 62%),
    radial-gradient(900px 480px at 100% 0%, rgba(50, 170, 165, 0.12), transparent 58%),
    var(--caui-bg);
}

body[data-ds-dark-theme] .caui-user-bubble {
  border: 1px solid rgba(255, 255, 255, 0.12);
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.35);
}

body[data-ds-dark-theme] .caui-empty-mark {
  background:
    radial-gradient(circle at 32% 24%, rgba(255, 255, 255, 0.22), transparent 34%),
    linear-gradient(145deg, color-mix(in srgb, var(--caui-accent) 42%, var(--caui-card)), var(--caui-card));
  box-shadow: 0 18px 44px rgba(0, 0, 0, 0.42), inset 0 1px 0 rgba(255, 255, 255, 0.18);
}`;

// src/client/chat-a2ui/styles/flow.ts
var FLOW_CSS = `

/* ---------------------------------------------------------------------------
   \u7A7A\u6001
   --------------------------------------------------------------------------- */
.caui-empty {
  display: flex;
  flex: 1 1 auto;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 10px;
  max-width: 460px;
  min-height: 280px;
  margin: 0 auto;
  padding: 56px 24px;
  text-align: center;
}

.caui-empty-mark {
  display: grid;
  place-items: center;
  width: 44px;
  height: 44px;
  border: 1px solid var(--caui-border);
  border-radius: 14px;
  background: var(--caui-subtle);
  color: var(--caui-accent);
  font-size: 20px;
  line-height: 1;
}

.caui-empty-title {
  color: var(--caui-fg);
  font-size: 17px;
  font-weight: 600;
  letter-spacing: 0.01em;
}

.caui-empty-hint {
  max-width: 34em;
  color: var(--caui-muted);
  font-size: 13px;
  line-height: 1.65;
}

/* ---------------------------------------------------------------------------
   \u884C\u5BB9\u5668
   --------------------------------------------------------------------------- */
.caui-row {
  display: flex;
  width: 100%;
  min-width: 0;
}

.caui-row > * {
  min-width: 0;
}

.caui-row-user {
  justify-content: flex-end;
}

.caui-row-assistant {
  justify-content: flex-start;
}

.caui-row-process {
  align-items: flex-start;
  justify-content: flex-start;
  color: var(--caui-muted);
  font-size: 12.5px;
}

.caui-row-tail {
  justify-content: center;
}

.caui-row-notice {
  justify-content: center;
}

/* ---------------------------------------------------------------------------
   \u7528\u6237\u6D88\u606F
   --------------------------------------------------------------------------- */
.caui-user {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 6px;
  max-width: min(680px, 86%);
}

.caui-user-bubble {
  max-width: 100%;
  padding: 10px 14px;
  border-radius: 16px 16px 4px 16px;
  background: var(--caui-accent);
  color: var(--caui-accent-fg);
  box-shadow: 0 1px 2px rgba(15, 18, 42, 0.08);
}

.caui-user-text {
  font-size: 14.5px;
  line-height: 1.65;
  overflow-wrap: anywhere;
  white-space: pre-wrap;
}

.caui-user-bubble .caui-markdown code,
.caui-user-bubble .caui-markdown pre {
  border-color: transparent;
  background: rgba(0, 0, 0, 0.18);
  color: inherit;
}

.caui-user-bubble .caui-markdown a,
.caui-user-bubble .caui-markdown-link {
  color: inherit;
  text-decoration: underline;
}

.caui-user-meta {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 0 2px;
  color: var(--caui-muted);
  font-size: 11px;
}

.caui-user-images {
  display: flex;
  flex-wrap: wrap;
  align-items: flex-end;
  justify-content: flex-end;
  gap: 8px;
  max-width: 100%;
}

/* \u7528\u6237\u4FA7\u7684\u56FE\u7247\u8BF4\u660E\u8DDF\u6C14\u6CE1\u4E00\u6837\u9760\u53F3 */
.caui-user-images .caui-image-caption {
  text-align: right;
}

/* \u9644\u4EF6\u5FBD\u6807\u5728\u6C14\u6CE1\u91CC\u8981\u80FD\u8BFB\uFF1A\u6C14\u6CE1\u5E95\u8272\u672C\u8EAB\u662F\u5F3A\u8C03\u8272\uFF0C\u8FD9\u91CC\u6362\u6210\u534A\u900F\u660E\u9ED1\u8272\u5E95\u3002 */
.caui-user-bubble .caui-tool-chip {
  border-color: transparent;
  background: rgba(0, 0, 0, 0.18);
  color: inherit;
}

/* ---------------------------------------------------------------------------
   Assistant \u6D88\u606F
   --------------------------------------------------------------------------- */
.caui-assistant {
  display: flex;
  flex-direction: column;
  gap: 12px;
  width: 100%;
  min-width: 0;
}

.caui-assistant-text {
  min-width: 0;
  font-size: 15px;
  line-height: 1.72;
  overflow-wrap: anywhere;
}

.caui-assistant-footer {
  display: flex;
  align-items: center;
  gap: 8px;
  min-height: 24px;
  color: var(--caui-muted);
  font-size: 11.5px;
  opacity: 0;
  transition: opacity var(--caui-dur-sm) var(--caui-ease-out);
}

.caui-row:hover .caui-assistant-footer,
.caui-row:focus-within .caui-assistant-footer,
.caui-assistant-footer:focus-within {
  opacity: 1;
}

.caui-message-actions {
  display: flex;
  align-items: center;
  gap: 2px;
}

.caui-action-button {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 3px 7px;
  border: 1px solid transparent;
  border-radius: 7px;
  background: transparent;
  color: var(--caui-muted);
  font: inherit;
  font-size: 11.5px;
  line-height: 1.4;
  cursor: pointer;
  appearance: none;
  -webkit-appearance: none;
  transition: background var(--caui-dur-xs) var(--caui-ease-out), color var(--caui-dur-xs) var(--caui-ease-out), border-color var(--caui-dur-xs) var(--caui-ease-out);
}

.caui-action-button:hover {
  border-color: var(--caui-border);
  background: var(--caui-subtle-hover);
  color: var(--caui-fg);
}

.caui-action-button:active {
  transform: translateY(0.5px);
}

.caui-action-button:disabled {
  opacity: 0.45;
  cursor: default;
}

.caui-action-button svg {
  flex: none;
  width: 13px;
  height: 13px;
}

.caui-action-done,
.caui-action-button.caui-action-done {
  color: var(--caui-ok);
}

/* 4 \u4E2A\u5FAA\u73AF\u52A8\u753B\u7684\u65F6\u957F\u6765\u81EA motion.config.json\uFF08--caui-motion-*\uFF09\uFF0C
   \u8FD9\u91CC\u53EA\u7559\u540D\u79F0\u4E0E\u8282\u594F\u51FD\u6570\uFF1B\u6CA1\u6CE8\u5165\u53D8\u91CF\u65F6\u7528\u62EC\u53F7\u91CC\u7684\u9ED8\u8BA4\u503C\u3002 */
.caui-streaming-cursor {
  display: inline-block;
  width: 0.5em;
  height: 1.05em;
  margin-left: 2px;
  border-radius: 1px;
  background: currentColor;
  vertical-align: -0.16em;
  animation-name: caui-caret-blink;
  animation-duration: var(--caui-motion-caret, 1.05s);
  animation-timing-function: steps(2, start);
  animation-iteration-count: infinite;
}

/* \u6D41\u5F0F\u5757\u7684\u9AD8\u5EA6\u8865\u95F4\uFF1A\u65B0\u5185\u5BB9\u6574\u5757\u5230\u8FBE\u65F6\uFF0C\u5148\u505C\u4F4F\u9AD8\u5EA6\u518D\u957F\u5230\u76EE\u6807\uFF0C
   \u8BA9\u6587\u5B57\u4ECE\u4E0B\u8FB9\u7F18\u4E00\u884C\u884C\u957F\u51FA\u6765\u3002\u65F6\u957F\u6309\u8DDD\u79BB\u7B97\uFF0C\u7531 Markdown \u5185\u8054\u7ED9\u51FA\uFF08transitionDuration\uFF09\u3002 */
.caui-md-clip {
  overflow: hidden;
}

.caui-md-clip-animated {
  transition-property: height;
  transition-timing-function: var(--caui-ease-out, cubic-bezier(0.22, 1, 0.36, 1));
}

/* \u6D41\u5F0F\u5C3E\u5DF4\uFF1A\u9010\u5B57\u6A21\u7CCA\u6E10\u5165\u3002\u65F6\u957F\u4E0E\u6A21\u7CCA\u534A\u5F84\u6765\u81EA motion.config.json \u7684 stream.*\uFF0C
   \u7531 Markdown \u7EC4\u4EF6\u5185\u8054\u6210 --caui-stream-* \u4E24\u4E2A\u53D8\u91CF\u3002 */
.caui-md-stream-char {
  animation-name: caui-md-stream-in;
  animation-duration: var(--caui-stream-duration, 0.42s);
  animation-timing-function: var(--caui-ease-out, cubic-bezier(0.22, 1, 0.36, 1));
  animation-fill-mode: both;
}

@keyframes caui-md-stream-in {
  from {
    opacity: 0.12;
    filter: blur(var(--caui-stream-blur, 6px));
  }

  to {
    opacity: 1;
    filter: blur(0);
  }
}

.caui-live-dot {
  display: inline-block;
  flex: none;
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: var(--caui-accent);
  animation-name: caui-pulse;
  animation-duration: var(--caui-motion-pulse, 1.6s);
  animation-timing-function: ease-in-out;
  animation-iteration-count: infinite;
}

/* ---------------------------------------------------------------------------
   \u601D\u8003\u8FC7\u7A0B
   --------------------------------------------------------------------------- */
.caui-reasoning {
  width: 100%;
  overflow: hidden;
  border: 1px solid var(--caui-border);
  border-radius: var(--caui-radius-sm);
  background: var(--caui-subtle);
}

.caui-reasoning-summary {
  position: relative;
  display: flex;
  align-items: center;
  gap: 6px;
  width: 100%;
  padding: 8px 28px 8px 11px;
  border: 0;
  background: transparent;
  color: var(--caui-muted);
  font: inherit;
  font-size: 12.5px;
  font-weight: 500;
  text-align: left;
  cursor: pointer;
  transition: background var(--caui-dur-xs) var(--caui-ease-out), color var(--caui-dur-xs) var(--caui-ease-out);
}

.caui-reasoning-summary:hover {
  background: var(--caui-subtle-hover);
  color: var(--caui-fg);
}

.caui-reasoning-summary::after {
  content: "";
  position: absolute;
  top: 50%;
  right: 12px;
  width: 5px;
  height: 5px;
  margin-top: -3px;
  border-right: 1.5px solid currentColor;
  border-bottom: 1.5px solid currentColor;
  transform: rotate(45deg);
  transition: transform var(--caui-dur-sm) var(--caui-ease-out);
}

.caui-reasoning-summary[data-open="true"]::after {
  margin-top: -1px;
  transform: rotate(-135deg);
}

.caui-reasoning-body {
  overflow: hidden;
}

.caui-reasoning-text {
  max-height: 260px;
  padding: 0 12px 10px;
  overflow-y: auto;
  color: var(--caui-muted);
  font-size: 12.5px;
  line-height: 1.65;
  overflow-wrap: anywhere;
  white-space: pre-wrap;
  scrollbar-width: thin;
  scrollbar-color: var(--caui-border-strong) transparent;
}

.caui-reasoning-spinner {
  display: inline-block;
  flex: none;
  width: 12px;
  height: 12px;
  border: 2px solid var(--caui-border-strong);
  border-top-color: var(--caui-accent);
  border-radius: 50%;
  animation-name: caui-spin;
  animation-duration: var(--caui-motion-spin, 0.8s);
  animation-timing-function: linear;
  animation-iteration-count: infinite;
}

/* ---------------------------------------------------------------------------
   \u5DE5\u5177\u8C03\u7528\u5361\u7247
   --------------------------------------------------------------------------- */
.caui-tool {
  width: 100%;
  overflow: hidden;
  border: 1px solid var(--caui-border);
  border-radius: var(--caui-radius-sm);
  background: var(--caui-card);
}

.caui-tool[data-error="true"] {
  border-color: rgba(211, 59, 59, 0.42);
}

.caui-tool-header {
  display: flex;
  align-items: center;
  gap: 8px;
  width: 100%;
  padding: 8px 10px;
  border: 0;
  background: transparent;
  color: var(--caui-fg);
  font: inherit;
  text-align: left;
  cursor: pointer;
  appearance: none;
  -webkit-appearance: none;
  transition: background var(--caui-dur-xs) var(--caui-ease-out);
}

.caui-tool-header:hover {
  background: var(--caui-subtle);
}

.caui-tool-header:focus-visible {
  outline-offset: -2px;
}

.caui-tool-icon {
  flex: none;
  width: 15px;
  height: 15px;
  color: var(--caui-muted);
}

.caui-tool-status {
  display: inline-block;
  flex: none;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--caui-border-strong);
}

.caui-tool-status[data-state="running"] {
  width: 12px;
  height: 12px;
  border: 2px solid var(--caui-border-strong);
  border-top-color: var(--caui-accent);
  background: transparent;
  animation-name: caui-spin;
  animation-duration: var(--caui-motion-spin, 0.8s);
  animation-timing-function: linear;
  animation-iteration-count: infinite;
}

.caui-tool-status[data-state="error"] {
  background: var(--caui-danger);
}

.caui-tool-name {
  flex: none;
  max-width: 42%;
  overflow: hidden;
  color: var(--caui-fg);
  font-family: var(--caui-mono);
  font-size: 12.5px;
  font-weight: 600;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.caui-tool-chip {
  display: inline-flex;
  align-items: center;
  width: fit-content;
  max-width: 100%;
  flex: none;
  overflow: hidden;
  padding: 1px 6px;
  border: 1px solid var(--caui-border);
  border-radius: 999px;
  background: var(--caui-subtle);
  color: var(--caui-muted);
  font-size: 10.5px;
  line-height: 1.5;
  white-space: nowrap;
}

/* \u5934\u90E8\u4E00\u884C\u53C2\u6570\u9884\u89C8\uFF08\u624B\u673A\u7AEF\u9690\u85CF\uFF0C\u89C1\u6587\u4EF6\u672B\u5C3E\u65AD\u70B9\uFF09 */
.caui-tool-args {
  flex: 1 1 auto;
  min-width: 0;
  overflow: hidden;
  color: var(--caui-muted);
  font-family: var(--caui-mono);
  font-size: 11.5px;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.caui-tool-chevron {
  display: inline-flex;
  flex: none;
  width: 12px;
  height: 12px;
  color: var(--caui-muted);
  transition: transform var(--caui-dur-sm) var(--caui-ease-out);
}

.caui-tool-chevron[data-open="true"] {
  transform: rotate(90deg);
}

.caui-tool-body {
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 10px 12px 12px;
  overflow: hidden;
  border-top: 1px solid var(--caui-border);
  background: var(--caui-bg);
}

.caui-tool-body .caui-tool-args,
.caui-tool-body .caui-tool-result {
  display: block;
  max-height: 260px;
  margin: 0;
  padding: 8px 10px;
  overflow-x: auto;
  overflow-y: auto;
  border: 1px solid var(--caui-border);
  border-radius: var(--caui-radius-sm);
  background: var(--caui-subtle);
  color: var(--caui-fg);
  font-family: var(--caui-mono);
  font-size: 11.5px;
  line-height: 1.55;
  overflow-wrap: anywhere;
  white-space: pre-wrap;
  tab-size: 2;
}

.caui-tool-result {
  color: var(--caui-fg);
}

.caui-tool-body .caui-tool-result.caui-tool-error {
  border-color: rgba(211, 59, 59, 0.35);
  background: rgba(211, 59, 59, 0.07);
  color: var(--caui-danger);
}

/* ---------------------------------------------------------------------------
   \u672C\u8F6E\u7ED3\u675F\u884C\uFF08\u65F6\u95F4 / \u5206\u652F / token\uFF09
   --------------------------------------------------------------------------- */
.caui-turn-tail {
  display: flex;
  align-items: center;
  gap: 10px;
  min-height: 22px;
  width: 100%;
  color: var(--caui-muted);
  font-size: 11px;
}

.caui-turn-tail-line {
  flex: 1 1 auto;
  min-width: 12px;
  height: 1px;
  background: linear-gradient(
    to right,
    transparent,
    var(--caui-border) 12%,
    var(--caui-border) 88%,
    transparent
  );
}

.caui-branch-button {
  display: inline-flex;
  flex: none;
  align-items: center;
  justify-content: center;
  width: 22px;
  height: 22px;
  padding: 0;
  border: 1px solid transparent;
  border-radius: 6px;
  background: transparent;
  color: var(--caui-muted);
  font: inherit;
  cursor: pointer;
  appearance: none;
  -webkit-appearance: none;
  transition: background var(--caui-dur-xs) var(--caui-ease-out), color var(--caui-dur-xs) var(--caui-ease-out), border-color var(--caui-dur-xs) var(--caui-ease-out);
}

.caui-branch-button:hover:not(:disabled) {
  border-color: var(--caui-border);
  background: var(--caui-subtle-hover);
  color: var(--caui-accent);
}

.caui-branch-button:disabled {
  opacity: 0.4;
  cursor: default;
}

.caui-branch-icon {
  flex: none;
  width: 14px;
  height: 14px;
}

.caui-token-usage {
  flex: none;
  color: var(--caui-muted);
  font-variant-numeric: tabular-nums;
  letter-spacing: 0.01em;
}

.caui-time {
  flex: none;
  color: var(--caui-muted);
  font-variant-numeric: tabular-nums;
}

/* ---------------------------------------------------------------------------
   \u56DE\u5230\u5E95\u90E8
   --------------------------------------------------------------------------- */
/* \u6309\u94AE\u5728\u6EDA\u52A8\u5BB9\u5668\u5185\u90E8\uFF08.caui-flow \u4E4B\u540E\uFF09\uFF0C\u6240\u4EE5\u7528 sticky \u800C\u4E0D\u662F absolute\uFF1A
   absolute \u7684\u5B9A\u4F4D\u57FA\u51C6\u662F\u6EDA\u52A8\u5BB9\u5668\u7684 padding box\uFF0C\u4F1A\u8DDF\u7740\u5185\u5BB9\u4E00\u8D77\u6EDA\u8D70\uFF1B
   sticky \u7684\u5B9A\u4F4D\u57FA\u51C6\u662F\u6EDA\u52A8\u89C6\u53E3\uFF0C\u624D\u80FD\u771F\u6B63\u300C\u8D34\u5728\u5E95\u90E8\u300D\u3002
   \u6C34\u5E73\u5C45\u4E2D\u9760\u5757\u7EA7\u5143\u7D20\u7684 auto \u5916\u8FB9\u8DDD\u3002 */
.caui-scroll-button {
  position: sticky;
  bottom: 20px;
  z-index: 5;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  /* \u8D1F\u7684\u4E0A\u5916\u8FB9\u8DDD\u628A\u5B83\u4ECE\u6B63\u5E38\u6D41\u91CC\u6536\u56DE\u53BB\uFF0C\u907F\u514D\u7ED9\u6EDA\u52A8\u533A\u51ED\u7A7A\u591A\u51FA 32px \u7A7A\u767D */
  margin: -32px auto 0;
  padding: 0;
  border: 1px solid var(--caui-border);
  border-radius: 999px;
  background: var(--caui-card);
  color: var(--caui-muted);
  box-shadow: var(--caui-shadow);
  cursor: pointer;
  opacity: 0;
  pointer-events: none;
  visibility: hidden;
  transform: translateY(4px);
  transition: opacity var(--caui-dur-sm) var(--caui-ease-out), transform var(--caui-dur-sm) var(--caui-ease-out), visibility var(--caui-dur-sm) var(--caui-ease-out),
    color var(--caui-dur-xs) var(--caui-ease-out);
  appearance: none;
  -webkit-appearance: none;
}

.caui-scroll-button:hover {
  color: var(--caui-fg);
}

.caui-scroll-button svg {
  width: 16px;
  height: 16px;
}

.caui-scroll-button-visible {
  opacity: 1;
  pointer-events: auto;
  visibility: visible;
  transform: translateY(0);
}

/* ---------------------------------------------------------------------------
   \u56FE\u7247\u4E0E\u706F\u7BB1
   --------------------------------------------------------------------------- */
.caui-image {
  display: inline-flex;
  flex-direction: column;
  gap: 4px;
  /* \u56FE\u7247\u6309\u94AE\u7684 max-content \u6309\u539F\u56FE\u5BBD\u5EA6\u7B97\uFF08640px\uFF09\uFF0C\u53EA\u9760 img \u7684 max-width \u6536\u4E0D\u56DE\u6765\uFF0C
     \u4F1A\u628A\u5916\u5C42 figure \u6491\u6210\u7070\u8272\u7A7A\u6761\u3002\u8FD9\u91CC\u628A\u56FE\u5BB9\u5668\u4E5F\u9489\u5230 380\uFF0C\u56FE\u7247\u6309\u5B9E\u9645\u5BBD\u5EA6\u53F3\u5BF9\u9F50\u3002 */
  max-width: min(100%, 380px);
  margin: 0;
}

.caui-image-button {
  display: block;
  max-width: 100%;
  padding: 0;
  border: 1px solid var(--caui-border);
  border-radius: var(--caui-radius-sm);
  background: var(--caui-subtle);
  line-height: 0;
  cursor: zoom-in;
  overflow: hidden;
  appearance: none;
  -webkit-appearance: none;
}

.caui-image-button:hover {
  border-color: var(--caui-border-strong);
}

.caui-image-button img {
  display: block;
  width: auto;
  height: auto;
  max-width: min(100%, 380px);
  max-height: 320px;
  object-fit: contain;
}

.caui-image.caui-image-loading {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
  width: min(100%, 380px);
  min-height: 88px;
  padding: 12px;
  border: 1px dashed var(--caui-border);
  border-radius: var(--caui-radius-sm);
  background: var(--caui-subtle);
  color: var(--caui-muted);
  font-size: 11.5px;
  line-height: 1.5;
}

.caui-image-caption {
  max-width: 100%;
  overflow: hidden;
  color: inherit;
  font-size: 11px;
  line-height: 1.5;
  opacity: 0.72;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.caui-image.caui-image-failed {
  display: inline-flex;
  flex-direction: row;
  align-items: center;
  gap: 6px;
  padding: 6px 10px;
  border: 1px dashed var(--caui-border-strong);
  border-radius: var(--caui-radius-sm);
  background: var(--caui-subtle);
  color: var(--caui-muted);
  font-size: 11.5px;
  line-height: 1.5;
}

.caui-image-failed svg {
  flex: none;
  width: 14px;
  height: 14px;
}

/* ---------------------------------------------------------------------------
   \u63D0\u793A\u6761
   --------------------------------------------------------------------------- */
.caui-notice {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  max-width: 100%;
  padding: 8px 12px;
  border: 1px solid var(--caui-border);
  border-radius: var(--caui-radius-sm);
  background: var(--caui-subtle);
  color: var(--caui-muted);
  font-size: 12px;
  line-height: 1.55;
}

.caui-notice-icon {
  flex: none;
  width: 14px;
  height: 14px;
  margin-top: 1px;
  color: var(--caui-warn);
}

.caui-notice-text {
  min-width: 0;
  overflow-wrap: anywhere;
}

/* ---------------------------------------------------------------------------
   \u4E0A\u4E0B\u6587\u6CE8\u5165\uFF1A\u7CFB\u7EDF\u65C1\u767D\uFF0C\u6298\u53E0\u663E\u793A\uFF0C\u4E0D\u5360\u7528\u6237\u6C14\u6CE1
   --------------------------------------------------------------------------- */
.caui-context {
  width: min(100%, 680px);
  border: 1px solid var(--caui-border);
  border-radius: var(--caui-radius-sm);
  background: var(--caui-subtle);
  color: var(--caui-muted);
  font-size: 12px;
  line-height: 1.55;
}

.caui-context-summary {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px 10px;
  list-style: none;
  cursor: pointer;
  color: var(--caui-muted);
}

.caui-context-summary::-webkit-details-marker {
  display: none;
}

.caui-context-summary::before {
  content: '\u2301';
  flex: none;
  width: 14px;
  text-align: center;
  color: var(--caui-border-strong);
}

.caui-context-label {
  font-weight: 500;
}

.caui-context-summary .caui-time {
  margin-left: auto;
}

.caui-context-text {
  margin: 0;
  padding: 0 10px 8px 32px;
  max-height: 240px;
  overflow: auto;
  white-space: pre-wrap;
  overflow-wrap: anywhere;
  color: var(--caui-muted);
  font-family: var(--caui-sans);
  font-size: 12px;
}

/* ---------------------------------------------------------------------------
   \u547D\u4EE4 / \u538B\u7F29 / \u672A\u77E5\u8282\u70B9
   --------------------------------------------------------------------------- */
.caui-command {
  display: inline-flex;
  align-items: baseline;
  gap: 6px;
  max-width: 100%;
  padding: 6px 10px;
  border: 1px solid var(--caui-border);
  border-radius: var(--caui-radius-sm);
  background: var(--caui-subtle);
  color: var(--caui-fg);
  font-family: var(--caui-mono);
  font-size: 12px;
  line-height: 1.5;
}

.caui-command-name {
  flex: none;
  color: var(--caui-accent);
  font-weight: 600;
}

.caui-command-args {
  min-width: 0;
  overflow: hidden;
  color: var(--caui-muted);
  text-overflow: ellipsis;
  white-space: nowrap;
}

.caui-command-outcome {
  flex: none;
  color: var(--caui-muted);
  font-size: 11px;
}

.caui-command-outcome[data-outcome="success"] {
  color: var(--caui-ok);
}

.caui-command-outcome[data-outcome="error"] {
  color: var(--caui-danger);
}

.caui-compaction {
  display: flex;
  flex-direction: column;
  gap: 4px;
  max-width: 100%;
  padding: 8px 12px;
  border: 1px dashed var(--caui-border-strong);
  border-radius: var(--caui-radius-sm);
  background: var(--caui-subtle);
  color: var(--caui-muted);
  font-size: 12px;
  line-height: 1.55;
}

.caui-compaction-summary {
  max-height: 220px;
  overflow-y: auto;
  overflow-wrap: anywhere;
  white-space: pre-wrap;
  scrollbar-width: thin;
  scrollbar-color: var(--caui-border-strong) transparent;
}

.caui-unknown {
  max-width: 100%;
  padding: 6px 10px;
  border: 1px dashed var(--caui-border);
  border-radius: var(--caui-radius-sm);
  color: var(--caui-muted);
  font-size: 11.5px;
}

.caui-unknown-type {
  font-family: var(--caui-mono);
}

.caui-unknown-body {
  max-height: 160px;
  margin: 4px 0 0;
  overflow: auto;
  font-family: var(--caui-mono);
  font-size: 11px;
  white-space: pre-wrap;
}

/* ---------------------------------------------------------------------------
   \u65B0\u5EFA\u4F1A\u8BDD
   --------------------------------------------------------------------------- */
.caui-new-chat {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  padding: 24px;
}

.caui-new-chat-button {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 8px 14px;
  border: 1px solid var(--caui-border);
  border-radius: var(--caui-radius);
  background: var(--caui-card);
  color: var(--caui-fg);
  font: inherit;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  box-shadow: var(--caui-shadow);
  appearance: none;
  -webkit-appearance: none;
  transition: background var(--caui-dur-xs) var(--caui-ease-out), border-color var(--caui-dur-xs) var(--caui-ease-out), transform var(--caui-dur-xs) var(--caui-ease-out);
}

.caui-new-chat-button:hover:not(:disabled) {
  border-color: var(--caui-border-strong);
  background: var(--caui-subtle);
}

.caui-new-chat-button:active:not(:disabled) {
  transform: translateY(0.5px);
}

.caui-new-chat-button:disabled {
  opacity: 0.55;
  cursor: default;
}

.caui-new-chat-icon {
  flex: none;
  width: 14px;
  height: 14px;
}

.caui-new-chat-error {
  color: var(--caui-danger);
  font-size: 11.5px;
  line-height: 1.5;
}

/* ---------------------------------------------------------------------------
   Markdown
   --------------------------------------------------------------------------- */
.caui-markdown {
  font-size: 15px;
  line-height: 1.72;
  overflow-wrap: anywhere;
}

.caui-markdown > :first-child {
  margin-top: 0;
}

.caui-markdown > :last-child {
  margin-bottom: 0;
}

.caui-markdown p {
  margin: 0 0 10px;
}

.caui-markdown h1,
.caui-markdown h2,
.caui-markdown h3,
.caui-markdown h4,
.caui-markdown h5,
.caui-markdown h6 {
  margin: 18px 0 8px;
  font-weight: 600;
  line-height: 1.35;
}

.caui-markdown h1 {
  font-size: 1.35em;
}

.caui-markdown h2 {
  font-size: 1.2em;
}

.caui-markdown h3 {
  font-size: 1.08em;
}

.caui-markdown h4,
.caui-markdown h5,
.caui-markdown h6 {
  font-size: 1em;
}

.caui-markdown strong {
  font-weight: 600;
}

.caui-markdown em {
  font-style: italic;
}

.caui-markdown ul,
.caui-markdown ol {
  margin: 0 0 10px;
  padding-left: 1.45em;
}

.caui-markdown li {
  margin: 3px 0;
}

.caui-markdown li > ul,
.caui-markdown li > ol {
  margin: 3px 0;
}

.caui-markdown blockquote {
  margin: 10px 0;
  padding: 2px 0 2px 12px;
  border-left: 3px solid var(--caui-border-strong);
  color: var(--caui-muted);
}

.caui-markdown blockquote > :first-child {
  margin-top: 0;
}

.caui-markdown blockquote > :last-child {
  margin-bottom: 0;
}

.caui-markdown code {
  padding: 1px 5px;
  border-radius: 5px;
  background: var(--caui-subtle);
  font-family: var(--caui-mono);
  font-size: 0.9em;
}

.caui-markdown pre {
  margin: 10px 0;
  padding: 10px 12px;
  overflow-x: auto;
  border: 1px solid var(--caui-border);
  border-radius: var(--caui-radius-sm);
  background: var(--caui-subtle);
  font-family: var(--caui-mono);
  font-size: 12.5px;
  line-height: 1.6;
  tab-size: 2;
}

.caui-markdown pre code {
  padding: 0;
  border: 0;
  background: transparent;
  font-size: inherit;
  white-space: pre;
  overflow-wrap: normal;
}

.caui-markdown table {
  width: 100%;
  margin: 10px 0;
  border-collapse: collapse;
  font-size: 13.5px;
}

.caui-markdown th,
.caui-markdown td {
  padding: 6px 10px;
  border: 1px solid var(--caui-border);
  text-align: left;
  vertical-align: top;
}

.caui-markdown th {
  background: var(--caui-subtle);
  font-weight: 600;
}

.caui-markdown a,
.caui-markdown-link {
  color: var(--caui-accent);
  text-decoration: underline;
  text-decoration-thickness: 1px;
  text-underline-offset: 2px;
}

.caui-markdown a:hover,
.caui-markdown-link:hover {
  text-decoration-thickness: 2px;
}

.caui-markdown img {
  max-width: 100%;
  height: auto;
  border-radius: 8px;
}

.caui-markdown hr {
  margin: 14px 0;
  border: 0;
  border-top: 1px solid var(--caui-border);
}

.caui-markdown kbd {
  padding: 1px 5px;
  border: 1px solid var(--caui-border);
  border-bottom-width: 2px;
  border-radius: 5px;
  background: var(--caui-subtle);
  font-family: var(--caui-mono);
  font-size: 0.85em;
}

/* ---------------------------------------------------------------------------
   \u52A8\u753B
   --------------------------------------------------------------------------- */
@keyframes caui-spin {
  to {
    transform: rotate(360deg);
  }
}

@keyframes caui-caret-blink {
  0%,
  45% {
    opacity: 1;
  }

  55%,
  100% {
    opacity: 0;
  }
}

@keyframes caui-pulse {
  0%,
  100% {
    opacity: 0.35;
    transform: scale(0.85);
  }

  50% {
    opacity: 1;
    transform: scale(1);
  }
}

/* ---------------------------------------------------------------------------
   \u51CF\u5C11\u52A8\u6001\u6548\u679C\uFF1A\u53EA\u4FDD\u7559\u5FC5\u8981\u7684\u4E00\u5E27\uFF0C\u907F\u514D\u524D\u5EAD\u4E0D\u9002
   --------------------------------------------------------------------------- */
@media (prefers-reduced-motion: reduce) {
  /* \u53EA\u5173\u5E38\u9A7B\u5FAA\u73AF\u52A8\u753B\uFF1Bhover / \u7126\u70B9\u7528\u7684\u989C\u8272\u4E0E\u80CC\u666F\u8FC7\u6E21\u4FDD\u7559\u3002
     \u8FD9\u91CC\u7BA1\u7684\u662F data-motion \u8FD8\u6CA1\u5199\u4E0A\u53BB\u7684\u9996\u5E27\uFF0C\u4E4B\u540E\u7531 [data-motion="reduced"] \u63A5\u7BA1\u3002 */
  .caui-root:not([data-motion="full"]) .caui-empty-mark,
  .caui-chat-page:not([data-motion="full"]) .caui-empty-mark,
  .caui-chat-page:not([data-motion="full"]) .caui-chat-blank-orb,
  .caui-root:not([data-motion="full"]) .caui-live-dot,
  .caui-root:not([data-motion="full"]) .caui-reasoning-spinner,
  .caui-root:not([data-motion="full"]) .caui-tool-status[data-state="running"] {
    animation: none !important;
  }

  .caui-root:not([data-motion="full"]) .caui-streaming-cursor {
    animation: none !important;
    opacity: 0.8;
  }
}

@media (hover: none) {
  .caui-assistant-footer {
    opacity: 1;
  }
}

/* ---------------------------------------------------------------------------
   B Soft glass\uFF08\u539F P0.6 \u89C6\u89C9\u5C42\uFF09\u5DF2\u5E76\u56DE\u672C\u5757
   --------------------------------------------------------------------------- */

.caui-flow {
  max-width: 780px;
  gap: 20px;
  padding: 26px 22px 38px;
}

.caui-assistant {
  gap: 13px;
}

.caui-user-text {
  font-size: 14.5px;
  line-height: 1.68;
}

.caui-reasoning,
.caui-tool,
.caui-context,
.caui-notice,
.caui-command,
.caui-compaction {
  border-color: var(--caui-glass-border);
  border-radius: var(--caui-radius-card);
  background: var(--caui-glass-bg);
  box-shadow: var(--caui-glass-shadow-soft);
  backdrop-filter: blur(12px) saturate(140%);
  -webkit-backdrop-filter: blur(12px) saturate(140%);
}

.caui-reasoning-summary {
  padding: 10px 32px 10px 12px;
  font-size: 12.5px;
}

.caui-reasoning-body,
.caui-reasoning-text {
  min-width: 0;
}

.caui-reasoning-text {
  padding: 0 13px 12px;
}

.caui-tool {
  position: relative;
}

.caui-tool-header {
  gap: 8px;
  padding: 10px 12px;
}

.caui-tool-name {
  font-size: 12.5px;
}

.caui-tool-status-text {
  flex: none;
  overflow: hidden;
  color: var(--caui-muted);
  font-size: 10.5px;
  line-height: 1.4;
  white-space: nowrap;
}

.caui-tool-status-text[data-state="error"] {
  color: var(--caui-danger);
}

.caui-tool-status-text[data-state="running"] {
  color: var(--caui-accent);
}

.caui-tool-body {
  gap: 9px;
  padding: 12px 13px 13px;
  border-top-color: var(--caui-glass-line);
  background: color-mix(in srgb, var(--caui-card) 78%, transparent);
}

.caui-tool-body .caui-tool-args,
.caui-tool-body .caui-tool-result {
  border-color: var(--caui-glass-line);
  border-radius: 10px;
}

.caui-border-trail {
  position: absolute;
  inset: 0;
  z-index: 1;
  overflow: hidden;
  border: 1px solid transparent;
  border-radius: inherit;
  pointer-events: none;
  mask-clip: padding-box, border-box;
  mask-composite: intersect;
  -webkit-mask-clip: padding-box, border-box;
  -webkit-mask-composite: source-in;
  mask-image: linear-gradient(transparent, transparent), linear-gradient(#000, #000);
  -webkit-mask-image: linear-gradient(transparent, transparent), linear-gradient(#000, #000);
}

.caui-border-trail-dot {
  position: absolute;
  aspect-ratio: 1;
  border-radius: 999px;
}

.caui-tool-header,
.caui-tool-body {
  position: relative;
  z-index: 2;
}

/* ---------------------------------------------------------------------------
   \u8FC7\u7A0B\u884C\uFF08\u601D\u8003 / \u5DE5\u5177\u8C03\u7528\uFF09
   \u4E4B\u524D\u6BCF\u4E2A\u8FC7\u7A0B\u5757\u90FD\u662F\u4E00\u5F20\u94FA\u6EE1\u6574\u5217\u7684\u957F\u6761\u5361\u7247\uFF0C\u6D41\u5F0F\u65F6\u4E00\u5C4F\u80FD\u53E0\u51FA\u4E03\u516B\u6761\uFF0C
   \u628A\u6B63\u6587\u6324\u6210\u788E\u7247\u3002\u8FD9\u91CC\u6539\u6210\u5185\u5BB9\u5BBD\u7684\u65C1\u6CE8\u884C\uFF1A\u6CA1\u6709\u5361\u7247\u5E95\u3001\u6CA1\u6709\u63CF\u8FB9\uFF0C
   \u53EA\u5728\u5C55\u5F00\u65F6\u7528\u4E00\u6761\u5DE6\u4FA7\u7EC6\u7EBF\u628A\u7EC6\u8282\u6302\u4E0A\u53BB\u3002
   --------------------------------------------------------------------------- */
.caui-reasoning,
.caui-tool {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  align-self: flex-start;
  width: auto;
  max-width: 100%;
  overflow: visible;
  border: 0;
  border-radius: 0;
  background: transparent;
  box-shadow: none;
  backdrop-filter: none;
  -webkit-backdrop-filter: none;
}

.caui-reasoning-summary:hover,
.caui-tool-header:hover {
  background: transparent;
  color: var(--caui-fg);
}

.caui-reasoning-summary::after {
  right: 2px;
}

/* \u5185\u5BB9\u5BBD\u7684\u884C\u4E0D\u8BE5\u518D\u628A\u5DE5\u5177\u540D\u622A\u6210 web_sear\u2026\uFF0C\u7701\u7565\u53F7\u7559\u7ED9\u6B63\u6587\u91CC\u7684\u957F\u53C2\u6570\u3002
   \u57FA\u7840\u6837\u5F0F\u91CC\u7684 max-width: 42% \u662F\u6309\u6574\u884C\u5BBD\u5EA6\u7B97\u7684\uFF0C\u5BF9\u5185\u5BB9\u5BBD\u7684\u8868\u5934\u6CA1\u6709\u610F\u4E49\uFF0C\u8FD9\u91CC\u653E\u5F00\u3002 */
.caui-tool-header .caui-tool-name {
  flex: 0 0 auto;
  max-width: none;
  overflow: visible;
  text-overflow: clip;
}

/* kind \u5FBD\u6807\u662F\u5361\u7247\u65F6\u4EE3\u7684\u88C5\u9970\uFF0C\u65C1\u6CE8\u884C\u91CC\u53EA\u7559\u540D\u5B57\u548C\u72B6\u6001 */
.caui-tool-header .caui-tool-chip {
  display: none;
}

.caui-tool-body,
.caui-reasoning-body {
  width: 100%;
  margin-top: 4px;
  padding: 6px 0 4px 10px;
  border-top: 0;
  border-left: 1px solid var(--caui-glass-line);
  background: transparent;
}

.caui-reasoning-text {
  padding: 0;
}

/* \u8FDE\u7EED\u7684\u8FC7\u7A0B\u884C\u5F7C\u6B64\u9760\u8FD1\uFF0C\u6B63\u6587\u524D\u540E\u4ECD\u4FDD\u7559\u547C\u5438\uFF1A\u76F8\u90BB\u8FC7\u7A0B\u884C 20 \u2192 10px */
.caui-row-process {
  margin-block: -5px;
}

.caui-row:has(> .caui-assistant > .caui-reasoning):not(:has(.caui-assistant-text)) {
  margin-block: -5px;
}

/* \u53EA\u6709\u601D\u8003\u3001\u6CA1\u6709\u6B63\u6587\u7684 assistant \u884C\u4E0D\u9700\u8981\u9875\u811A\uFF0C\u5B83\u539F\u672C\u8FD8\u5360\u7740 24px */
.caui-assistant:not(:has(.caui-assistant-text)) > .caui-assistant-footer {
  display: none;
}

/* \u63D0\u793A\u884C\u540C\u7406\uFF1A\u65C1\u6CE8\u4E0D\u662F\u5361\u7247 */
.caui-row-notice {
  justify-content: flex-start;
}

.caui-notice {
  padding: 0;
  border: 0;
  background: transparent;
  box-shadow: none;
  backdrop-filter: none;
  -webkit-backdrop-filter: none;
  font-size: 12px;
}

.caui-context {
  width: min(100%, 680px);
  overflow: hidden;
}

.caui-context-summary {
  display: flex;
  align-items: center;
  gap: 8px;
  width: 100%;
  padding: 9px 12px;
  border: 0;
  background: transparent;
  color: var(--caui-muted);
  font: inherit;
  font-size: 12px;
  text-align: left;
  cursor: pointer;
}

.caui-context-summary:hover {
  color: var(--caui-fg);
}

.caui-context-summary .caui-time {
  margin-left: auto;
}

.caui-context-chevron {
  flex: none;
  width: 6px;
  height: 6px;
  margin-right: 2px;
  border-right: 1.5px solid currentColor;
  border-bottom: 1.5px solid currentColor;
  transform: rotate(45deg);
  transition: transform var(--caui-dur-sm) var(--caui-ease-out);
}

.caui-context-summary[aria-expanded="true"] .caui-context-chevron {
  transform: rotate(225deg);
}

.caui-context-body {
  min-width: 0;
}

.caui-context-text {
  padding: 0 12px 10px 34px;
}

.caui-empty {
  position: relative;
  gap: 12px;
  min-height: 320px;
  padding: 48px 24px 44px;
}

.caui-empty::before {
  content: "";
  position: absolute;
  top: 18%;
  left: 50%;
  width: 260px;
  height: 260px;
  border-radius: 999px;
  background: radial-gradient(circle, color-mix(in srgb, var(--caui-accent) 18%, transparent), transparent 68%);
  transform: translateX(-50%);
  pointer-events: none;
}

.caui-empty-mark {
  position: relative;
  z-index: 1;
  width: 58px;
  height: 58px;
  border: 1px solid var(--caui-glass-border);
  border-radius: 20px;
  background:
    radial-gradient(circle at 32% 24%, rgba(255, 255, 255, 0.92), transparent 34%),
    linear-gradient(145deg, color-mix(in srgb, var(--caui-accent) 30%, var(--caui-card)), var(--caui-card));
  box-shadow: 0 18px 44px color-mix(in srgb, var(--caui-accent) 22%, transparent), inset 0 1px 0 rgba(255, 255, 255, 0.6);
  color: var(--caui-accent);
  font-size: 23px;
  animation-name: caui-orb-breathe;
  animation-duration: var(--caui-motion-orb, 5.4s);
  animation-timing-function: ease-in-out;
  animation-iteration-count: infinite;
}

.caui-empty-title {
  position: relative;
  z-index: 1;
  color: var(--caui-fg);
  font-size: 24px;
  font-weight: 650;
  line-height: 1.2;
  letter-spacing: -0.02em;
}

.caui-empty-title .caui-text-effect {
  margin: 0;
}

.caui-empty-hint {
  position: relative;
  z-index: 1;
  max-width: 35em;
  font-size: 13px;
  line-height: 1.65;
}

.caui-empty-suggestions {
  position: relative;
  z-index: 1;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  gap: 8px;
  max-width: 580px;
  margin-top: 6px;
}

.caui-empty-suggestion {
  padding: 7px 12px;
  border: 1px solid var(--caui-glass-border);
  border-radius: 999px;
  background: var(--caui-glass-bg);
  box-shadow: var(--caui-glass-shadow-soft);
  color: var(--caui-muted);
  font-size: 12.5px;
  line-height: 1.45;
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
}

.caui-progressive-blur {
  position: absolute;
  inset: 0;
  z-index: 2;
  pointer-events: none;
}

.caui-flow-blur {
  top: 0;
  bottom: auto;
  left: 0;
  right: 0;
  height: 46px;
}

.caui-flow-blur-bottom {
  top: auto;
  bottom: 0;
}

.caui-progressive-blur-layer {
  position: absolute;
  inset: 0;
  border-radius: inherit;
}

@supports not ((backdrop-filter: blur(1px)) or (-webkit-backdrop-filter: blur(1px))) {
  .caui-flow-blur {
    display: none;
  }
}

.caui-scroll-button {
  border-color: var(--caui-glass-border);
  background: var(--caui-glass-bg-strong);
  box-shadow: var(--caui-glass-shadow);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
}

/* \u51CF\u5C11\u52A8\u6001\uFF1A\u53EA\u505C\u6389\u300C\u4E00\u76F4\u8F6C\u300D\u548C\u300C\u4F4D\u79FB/\u7F29\u653E\u300D\u7684\u90A3\u51E0\u5904\uFF0C
   \u989C\u8272\u4E0E\u80CC\u666F\u8FC7\u6E21\u4FDD\u7559 \u2014\u2014 \u5168\u5C40\u628A transition-duration \u538B\u5230 1ms \u4F1A\u8BA9 hover
   \u53D8\u6210\u786C\u5207\uFF0C\u6BD4\u6709\u8FC7\u6E21\u66F4\u751F\u786C\uFF0C\u4E5F\u4F1A\u8FDE\u5E26\u62B9\u6389\u7126\u70B9\u6001\u53CD\u9988\u3002 */
.caui-root[data-motion="reduced"] .caui-empty-mark,
.caui-root[data-motion="reduced"] .caui-chat-blank-orb,
.caui-root[data-motion="reduced"] .caui-live-dot,
.caui-root[data-motion="reduced"] .caui-reasoning-spinner,
.caui-root[data-motion="reduced"] .caui-tool-status[data-state="running"],
.caui-chat-page[data-motion="reduced"] .caui-empty-mark,
.caui-chat-page[data-motion="reduced"] .caui-chat-blank-orb,
.caui-chat-page[data-motion="reduced"] .caui-live-dot,
.caui-chat-page[data-motion="reduced"] .caui-reasoning-spinner,
.caui-chat-page[data-motion="reduced"] .caui-tool-status[data-state="running"] {
  animation: none;
}

.caui-root[data-motion="reduced"] .caui-streaming-cursor,
.caui-chat-page[data-motion="reduced"] .caui-streaming-cursor {
  animation: none;
  opacity: 0.8;
}

/* \u6D41\u5F0F\u5C3E\u5DF4\u7684\u6A21\u7CCA\u6E10\u5165\u5728 reduced \u6863\u76F4\u63A5\u4E0D\u64AD\uFF08\u6587\u5B57\u7167\u5E38\u51FA\u73B0\uFF09 */
.caui-root[data-motion="reduced"] .caui-md-stream-char,
.caui-chat-page[data-motion="reduced"] .caui-md-stream-char {
  animation: none;
}

@keyframes caui-orb-breathe {
  0%,
  100% {
    transform: translateY(0) scale(1);
    filter: saturate(1);
  }

  50% {
    transform: translateY(-3px) scale(1.035);
    filter: saturate(1.12);
  }
}
/* ---------------------------------------------------------------------------
   \u54CD\u5E94\u5F0F\uFF1A\u672C\u8868\u9762\u81EA\u5DF1\u7684\u7A84\u5C4F\u89C4\u5219 + \u8986\u76D6\uFF0C\u548C\u5B83\u7684\u57FA\u7840\u89C4\u5219\u653E\u5728\u540C\u4E00\u4E2A\u6587\u4EF6\u91CC

   \u4EE5\u524D\u8FD9\u4E9B\u6563\u5728 misc.ts \u7684\u4E24\u4E2A 640 \u65AD\u70B9\u91CC\uFF0C\u9760\u300C\u8C01\u6392\u5728\u540E\u9762\u8C01\u8D62\u300D\u538B\u4F4F\u5F7C\u6B64\uFF1B
   \u73B0\u5728\u6309\u8868\u9762\u5F52\u4F4D\uFF1A\u5A92\u4F53\u67E5\u8BE2\u91CC\u662F\u7A84\u5C4F\u503C\uFF0C\u7D27\u8DDF\u5176\u540E\u7684\u662F\u8986\u76D6\uFF08\u540C\u4E00\u4EFD\u6587\u4EF6\u3001\u540C\u4E00\u6BB5\u8BDD
   \u5C31\u80FD\u8BFB\u5B8C\u987A\u5E8F\uFF09\u3002\u7EA7\u8054\u7ED3\u679C\u7531 tests/style-split.test.ts \u7684\u7EA7\u8054\u7B49\u4EF7\u6027\u5728 448 \u4E2A
   \u72B6\u6001\u4E0B\u9010\u6761\u76EF\u4F4F\u3002
   --------------------------------------------------------------------------- */

@media (max-width: 640px) {
  /* \u4E24\u7EC4\u5408\u5E76\u6210\u4E00\u5757\uFF0C\u987A\u5E8F\u7167\u539F\u6837\uFF1A\u5148\u662F P0.6 \u90A3\u4E00\u7EC4\u7684\u503C\uFF0C\u518D\u662F\u66F4\u65E9\u7684 640 \u65AD\u70B9\u7684\u503C\u3002
     \u540C\u540D\u7684\u4E24\u6761\u90FD\u7559\u7740\u2014\u2014\u540E\u5199\u7684\u8D62\uFF0C\u548C\u5408\u5E76\u524D\u300C\u540E\u4E00\u4E2A\u5757\u8D62\u300D\u5B8C\u5168\u7B49\u4EF7\uFF0C
     \u4E5F\u56E0\u6B64\u89C4\u5219\u6E05\u5355\u80FD\u4E0E\u57FA\u7EBF\u9010\u6761\u5BF9\u4E0A\uFF08\u6CA1\u6709\u5077\u5077\u5220\u6389\u4EFB\u4F55\u4E00\u6761\u58F0\u660E\uFF09\u3002 */

  .caui-flow {
    gap: 14px;
    padding: 14px 12px 24px;
  }

  .caui-empty {
    padding: 40px 16px;
  }

  .caui-user {
    max-width: 92%;
  }

  .caui-user-bubble {
    padding: 9px 12px;
    border-radius: 14px 14px 4px 14px;
  }

  .caui-user-text,
  .caui-assistant-text,
  .caui-markdown {
    font-size: 14.5px;
  }

  .caui-tool-header {
    gap: 6px;
    padding: 8px;
  }

  .caui-tool-name {
    max-width: 56%;
  }

  .caui-tool-args {
    display: none;
  }

  .caui-tool-body .caui-tool-args {
    display: block;
  }

  .caui-scroll-button {
    bottom: 14px;
    width: 34px;
    height: 34px;
  }

  .caui-token-usage {
    display: none;
  }

  .caui-markdown pre {
    font-size: 12px;
    padding: 8px 10px;
  }

  /* \u2014\u2014 \u66F4\u65E9\u7684 640 \u65AD\u70B9\uFF08\u539F\u672C\u5728 misc.ts \u66F4\u9760\u540E\u7684\u4F4D\u7F6E\uFF09 \u2014\u2014 */

  .caui-flow {
    gap: 16px;
    padding: 18px 14px 30px;
  }

  .caui-empty {
    min-height: 260px;
    padding: 36px 18px 32px;
  }

  .caui-empty-title {
    font-size: 21px;
  }

  .caui-empty-suggestion {
    padding: 6px 10px;
    font-size: 12px;
  }

  .caui-tool-status-text {
    display: none;
  }
}

/* \u8986\u76D6\uFF1A\u5BBD\u5C4F\u5C3A\u5BF8\u5728\u7A84\u5C4F\u4E0B\u4ECD\u7136\u6210\u7ACB\uFF0C\u6240\u4EE5\u5199\u5728\u5A92\u4F53\u67E5\u8BE2\u4E4B\u540E\uFF08\u540C\u6587\u4EF6\u5185\u5C31\u8FD1\uFF09 */

.caui-assistant-text,
.caui-markdown {
  font-size: 15.5px;
  line-height: 1.75;
}

.caui-user {
  max-width: min(680px, 84%);
  gap: 7px;
}

.caui-user-bubble {
  padding: 11px 15px;
  border-radius: 18px 18px 6px 18px;
  background:
    linear-gradient(135deg, color-mix(in srgb, var(--caui-accent) 86%, #ffffff), var(--caui-accent));
  box-shadow: 0 10px 24px color-mix(in srgb, var(--caui-accent) 22%, transparent);
}

.caui-reasoning-summary,
.caui-tool-header {
  width: auto;
  max-width: 100%;
  padding: 2px 14px 2px 0;
  gap: 6px;
  color: var(--caui-muted);
  font-size: 12px;
}
`;

// src/client/chat-a2ui/styles/composer.ts
var COMPOSER_CSS = `

/* A blank Chat Session keeps the resident composer, but its views area renders
   nothing (the native guard hides it while blank). Pin the composer to the
   floor and show a Chat-specific empty state above it instead of the native
   onboarding Hero. */
.caui-chat-blank [data-conversation-scroll] {
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
}

.caui-chat-blank-state {
  position: absolute;
  inset: 0 0 190px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 0 32px;
  text-align: center;
  pointer-events: none;
}

.caui-chat-blank-title {
  font-size: 20px;
  font-weight: 600;
  letter-spacing: -0.01em;
  color: var(--caui-fg);
}

.caui-chat-blank-hint {
  max-width: 420px;
  font-size: 13px;
  line-height: 1.6;
  color: var(--caui-muted);
}

/* The embedded Conversation factory always mounts its resident composer;
   the dock only needs the trajectory body. */
.caui-chat-dock-conversation [data-conversation-region="composer"] {
  display: none !important;
}

/* ---------------------------------------------------------------------------
   B Soft glass\uFF08\u539F P0.6 \u89C6\u89C9\u5C42\uFF09\u5DF2\u5E76\u56DE\u672C\u5757
   --------------------------------------------------------------------------- */

.caui-chat-blank-state {
  gap: 10px;
  inset: 0 0 190px;
}

.caui-chat-blank-orb {
  width: 46px;
  height: 46px;
  margin-bottom: 2px;
  border: 1px solid var(--caui-glass-border);
  border-radius: 16px;
  background:
    radial-gradient(circle at 32% 24%, rgba(255, 255, 255, 0.9), transparent 34%),
    linear-gradient(145deg, color-mix(in srgb, var(--caui-accent) 26%, var(--caui-card)), var(--caui-card));
  box-shadow: 0 14px 36px color-mix(in srgb, var(--caui-accent) 18%, transparent);
  animation-name: caui-orb-breathe;
  animation-duration: var(--caui-motion-orb, 5.4s);
  animation-timing-function: ease-in-out;
  animation-iteration-count: infinite;
}

.caui-chat-blank-title {
  font-size: 26px;
  font-weight: 650;
  letter-spacing: -0.025em;
}

.caui-chat-blank-title .caui-text-effect {
  margin: 0;
}`;

// src/client/chat-a2ui/styles/list.ts
var LIST_CSS = `

.caui-chat-a2ui-dot {
  width: 6px;
  height: 6px;
  border-radius: 999px;
  background: var(--caui-muted);
}

/* \u5DE6\u680F Chat \u4F1A\u8BDD\u5217\u8868 ---------------------------------------------------- */
.caui-chat-list {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  min-height: 0;
  padding: 10px 8px 12px;
  font-size: 13px;
}

.caui-chat-list-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  padding: 4px 6px 8px;
}

.caui-chat-list-title {
  color: var(--caui-muted);
  font-size: 10.5px;
  font-weight: 600;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.caui-chat-list-count {
  min-width: 18px;
  padding: 0 5px;
  border-radius: 999px;
  background: var(--caui-subtle);
  color: var(--caui-muted);
  font-size: 10.5px;
  line-height: 17px;
  text-align: center;
}

.caui-chat-new {
  display: flex;
  flex: 0 0 auto;
  align-items: center;
  gap: 7px;
  width: 100%;
  height: 34px;
  margin-bottom: 8px;
  padding: 0 10px;
  border: 1px dashed var(--caui-border-strong);
  border-radius: var(--caui-radius-sm);
  background: transparent;
  color: var(--caui-fg);
  font: inherit;
  font-size: 12.5px;
  text-align: left;
  cursor: pointer;
  transition: background-color 120ms ease, border-color 120ms ease;
}

.caui-chat-new:hover {
  border-color: var(--caui-accent);
  background: var(--caui-subtle);
}

.caui-chat-list-body {
  display: flex;
  flex: 1 1 auto;
  flex-direction: column;
  gap: 2px;
  min-height: 0;
  overflow-x: hidden;
  overflow-y: auto;
  scrollbar-width: thin;
}

.caui-chat-row {
  display: flex;
  flex: 0 0 auto;
  flex-direction: column;
  gap: 2px;
  width: 100%;
  padding: 7px 8px;
  border: 1px solid transparent;
  border-radius: var(--caui-radius-sm);
  background: transparent;
  color: var(--caui-fg);
  font: inherit;
  text-align: left;
  cursor: pointer;
  transition: background-color 120ms ease, border-color 120ms ease;
}

.caui-chat-row:hover {
  background: var(--caui-subtle);
}

.caui-chat-row-active {
  border-color: var(--caui-border);
  background: var(--caui-subtle);
}

.caui-chat-row-top {
  display: flex;
  align-items: center;
  gap: 6px;
  min-width: 0;
}

.caui-chat-row-title {
  overflow: hidden;
  flex: 1 1 auto;
  font-size: 12.5px;
  font-weight: 500;
  line-height: 1.4;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.caui-chat-row-meta {
  display: flex;
  align-items: center;
  gap: 6px;
  padding-left: 13px;
  color: var(--caui-muted);
  font-size: 10.5px;
  line-height: 1.35;
}

.caui-chat-empty {
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 28px 10px;
  text-align: center;
}

.caui-chat-empty-title {
  font-size: 12.5px;
  font-weight: 500;
}

.caui-chat-empty-hint {
  color: var(--caui-muted);
  font-size: 11.5px;
  line-height: 1.55;
}

.caui-chat-error {
  display: flex;
  flex: 0 0 auto;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  margin-top: 8px;
  padding: 7px 8px;
  border: 1px solid color-mix(in srgb, var(--caui-danger) 35%, transparent);
  border-radius: var(--caui-radius-sm);
  color: var(--caui-danger);
  font-size: 11.5px;
  line-height: 1.45;
}

.caui-chat-retry {
  flex: 0 0 auto;
  padding: 2px 6px;
  border: 0;
  border-radius: 5px;
  background: transparent;
  color: inherit;
  font: inherit;
  text-decoration: underline;
  cursor: pointer;
}

.caui-chat-panel-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 18px;
  height: 18px;
  color: currentColor;
}

/* ---------------------------------------------------------------------------
   B Soft glass\uFF08\u539F P0.6 \u89C6\u89C9\u5C42\uFF09\u5DF2\u5E76\u56DE\u672C\u5757
   --------------------------------------------------------------------------- */

/* \u5DE6\u680F Chat \u5217\u8868\u5361\u7247\u3002
   \u5BBF\u4E3B\u7ED9\u63D2\u69FD\u533A\u57DF\u7684\u662F padding-left:4px / margin-right:-12px \u7684\u4E0D\u5BF9\u79F0\u51FA\u8840\u533A\uFF0C
   \u76F4\u63A5\u628A\u5361\u7247\u94FA\u4E0A\u53BB\u4F1A\u6BD4\u539F\u751F\u5BFC\u822A\u884C\u66F4\u5BBD\u3001\u66F4\u9760\u53F3\u3002\u8FD9\u91CC\u7528 margin \u628A\u5B83\u6536\u56DE\u5230
   \u539F\u751F\u4FA7\u680F\u9879\u7684\u6C9F\u69FD\u4E0A\uFF08\u4FA7\u680F 280 \u2192 \u9879 14..266\uFF09\uFF0C\u56DB\u8FB9 6px \u5782\u76F4\u3001\u5BF9\u9F50\u7559\u767D\u3002 */
.caui-chat-list {
  width: auto;
  min-width: 0;
  height: auto;
  margin: 6px 14px 6px 2px;
  padding: 6px 8px 8px;
  overflow: hidden;
  border: 1px solid var(--caui-glass-border);
  border-radius: var(--caui-radius-panel);
  background: var(--caui-glass-bg);
  box-shadow: var(--caui-glass-shadow-soft);
  backdrop-filter: blur(var(--caui-glass-blur)) saturate(140%);
  -webkit-backdrop-filter: blur(var(--caui-glass-blur)) saturate(140%);
}

.caui-chat-list-head {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 2px 8px 8px;
}

.caui-chat-list-title {
  font-size: 11px;
  font-weight: 650;
  letter-spacing: 0.075em;
}

.caui-chat-list-count {
  margin-left: auto;
  min-width: 20px;
  padding: 0 6px;
  border: 1px solid var(--caui-glass-border);
  background: var(--caui-glass-bg-strong);
  font-size: 10.5px;
  line-height: 18px;
  font-variant-numeric: tabular-nums;
}

.caui-chat-motion-toggle {
  display: inline-flex;
  flex: none;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  padding: 0;
  border: 1px solid transparent;
  border-radius: 8px;
  background: transparent;
  color: var(--caui-muted);
  cursor: pointer;
  transition: background var(--caui-dur-xs) var(--caui-ease-out), color var(--caui-dur-xs) var(--caui-ease-out), border-color var(--caui-dur-xs) var(--caui-ease-out);
}

.caui-chat-motion-toggle:hover {
  border-color: var(--caui-glass-border);
  background: var(--caui-glass-bg-strong);
  color: var(--caui-fg);
}

.caui-chat-motion-icon {
  display: grid;
  place-items: center;
  width: 16px;
  height: 16px;
  font-size: 12px;
  line-height: 1;
}

.caui-chat-new {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  gap: 6px;
  width: 100%;
  height: 40px;
  margin: 0 0 8px;
  padding: 0 8px;
  border: 1px solid var(--caui-glass-border);
  border-radius: 12px;
  background: var(--caui-glass-bg-strong);
  box-shadow: var(--caui-glass-shadow-soft);
  color: var(--caui-fg);
  font-size: 13px;
  font-weight: 550;
  transition: background var(--caui-dur-sm) var(--caui-ease-out), border-color var(--caui-dur-sm) var(--caui-ease-out), box-shadow var(--caui-dur-sm) var(--caui-ease-out);
}

.caui-chat-new:hover {
  border-color: var(--caui-accent);
  background: var(--caui-accent-soft);
  color: var(--caui-accent);
  box-shadow: 0 10px 26px rgba(20, 23, 40, 0.12);
}

/* \u300C+\u300D\u653E\u5728\u884C\u5C3E\u800C\u4E0D\u662F\u884C\u9996\uFF1A\u884C\u9996\u7559\u7ED9\u6587\u5B57\uFF0C\u624D\u80FD\u548C\u4F1A\u8BDD\u6807\u9898\u5BF9\u9F50 */
.caui-chat-new::after {
  content: "+";
  margin-left: auto;
  color: var(--caui-accent);
  font-size: 15px;
  line-height: 1;
  opacity: 0.75;
}

/* \u6EDA\u52A8\u6761\u4F1A\u4ECE\u884C\u5BBD\u91CC\u5403\u6389 10px\uFF0C\u5BFC\u81F4\u884C\u4E0E\u300C\u65B0\u5BF9\u8BDD\u300D/\u8868\u5934\u53F3\u8FB9\u7F18\u5DEE\u4E00\u622A\u3002
   \u8FD9\u91CC\u628A\u5B83\u6536\u6389\uFF0C\u6EDA\u52A8\u4ECD\u8D70\u6EDA\u8F6E / \u89E6\u63A7\u677F / \u952E\u76D8\u3002 */
.caui-chat-list-body {
  gap: 3px;
  padding: 0;
  scrollbar-width: none;
}

.caui-chat-list-body::-webkit-scrollbar {
  width: 0;
  height: 0;
}

.caui-chat-row {
  position: relative;
  isolation: isolate;
  display: flex;
  width: 100%;
  min-height: 46px;
  flex-direction: column;
  justify-content: center;
  gap: 1px;
  padding: 7px 8px;
  overflow: hidden;
  border: 1px solid transparent;
  border-radius: 12px;
  background: transparent;
  transition: background var(--caui-dur-sm) var(--caui-ease-out), border-color var(--caui-dur-sm) var(--caui-ease-out);
}

.caui-chat-row:hover:not(.caui-chat-row-active) {
  border-color: var(--caui-glass-border);
  background: var(--caui-glass-bg);
}

.caui-chat-row-active {
  border-color: transparent;
  background: transparent;
}

.caui-chat-row-active-bg {
  position: absolute;
  inset: 0;
  z-index: 0;
  border: 1px solid var(--caui-glass-border);
  border-radius: inherit;
  background:
    linear-gradient(135deg, var(--caui-accent-soft), transparent 46%),
    var(--caui-glass-bg-strong);
  box-shadow: inset 2px 0 0 var(--caui-accent), var(--caui-glass-shadow-soft);
}

.caui-chat-row-top,
.caui-chat-row-meta {
  position: relative;
  z-index: 1;
}

.caui-chat-row-title {
  font-size: 13px;
  font-weight: 520;
}

.caui-chat-row-active .caui-chat-row-title {
  font-weight: 650;
}

.caui-chat-row-meta {
  padding-left: 0;
  font-size: 11px;
}

.caui-chat-list-body::-webkit-scrollbar {
  width: 8px;
}

.caui-chat-list-body::-webkit-scrollbar-thumb {
  border: 3px solid transparent;
  border-radius: 999px;
  background: var(--caui-border-strong);
  background-clip: content-box;
}
/* ---------------------------------------------------------------------------
   \u54CD\u5E94\u5F0F\uFF1A\u5DE6\u680F\u81EA\u5DF1\u7684\u7A84\u5C4F\u89C4\u5219\uFF08\u4E0E\u57FA\u7840\u89C4\u5219\u540C\u6587\u4EF6\uFF09

   \u987A\u5E8F\u662F\u7167\u642C\u5408\u5E76\u524D\u7684\uFF1A640 \u90A3\u6761\u539F\u672C\u5728\u524D\u3001900 \u90A3\u6761\u5728\u540E\uFF0C\u800C 640 \u7684\u5185\u5BB9\u4E5F\u547D\u4E2D
   900 \u7684\u6761\u4EF6\uFF0C\u6240\u4EE5 900 \u7684\u503C\u5728\u7A84\u5C4F\u4E0B\u53CD\u800C\u8D62\u3002\u8FD9\u91CC\u4FDD\u6301\u540C\u4E00\u987A\u5E8F\uFF0C\u7EA7\u8054\u7ED3\u679C\u4E0D\u53D8\uFF1B
   tests/style-split.test.ts \u7684\u7EA7\u8054\u7B49\u4EF7\u6027\u4F1A\u76EF\u4F4F\u3002
   --------------------------------------------------------------------------- */

@media (max-width: 640px) {
  .caui-chat-list {
    padding: 6px 4px 10px;
  }

  .caui-chat-new {
    height: 38px;
  }

  .caui-chat-row {
    min-height: 44px;
  }
}

@media (max-width: 900px) {
  /* \u53EA\u6536\u7D27\u5185\u8FB9\u8DDD\uFF1A\u6A2A\u5411\u90A3\u4E24\u5904 margin \u662F\u5BF9\u9F50\u5BBF\u4E3B\u6C9F\u69FD\u7528\u7684\uFF0C\u4E0E\u7A97\u53E3\u5BBD\u5EA6\u65E0\u5173 */
  .caui-chat-list {
    padding: 6px 6px 6px;
  }
}

`;

// src/client/chat-a2ui/styles/lightbox.ts
var LIGHTBOX_CSS = `

/* \u706F\u7BB1\uFF08portal \u5230 document.body\uFF0C\u6240\u4EE5\u4E0D\u5957 .caui-root\uFF0C\u4E5F\u4E0D\u8BFB --caui-* \u53D8\u91CF\uFF09 */
.caui-lightbox {
  position: fixed;
  inset: 0;
  z-index: 2147483000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
  background: rgba(9, 9, 12, 0.82);
  -webkit-backdrop-filter: blur(6px);
  backdrop-filter: blur(6px);
}

.caui-lightbox-image {
  display: block;
  width: auto;
  height: auto;
  max-width: min(96vw, 1400px);
  max-height: 90vh;
  border-radius: 10px;
  background: #0b0b10;
  box-shadow: 0 24px 80px rgba(0, 0, 0, 0.45);
  object-fit: contain;
}

.caui-lightbox-close {
  position: absolute;
  top: max(16px, env(safe-area-inset-top));
  right: 16px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 38px;
  height: 38px;
  padding: 0;
  border: 1px solid rgba(255, 255, 255, 0.24);
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.12);
  color: #ffffff;
  cursor: pointer;
  appearance: none;
  -webkit-appearance: none;
  transition: background var(--caui-dur-xs) var(--caui-ease-out), border-color var(--caui-dur-xs) var(--caui-ease-out);
}

.caui-lightbox-close:hover {
  border-color: rgba(255, 255, 255, 0.4);
  background: rgba(255, 255, 255, 0.2);
}

.caui-lightbox-close:focus-visible {
  outline: 2px solid rgba(255, 255, 255, 0.85);
  outline-offset: 2px;
}
/* ---------------------------------------------------------------------------
   \u54CD\u5E94\u5F0F\uFF1A\u706F\u7BB1\u81EA\u5DF1\u7684\u7A84\u5C4F\u89C4\u5219\uFF08\u8FD9\u4E00\u5757\u662F\u9876\u5C42\u9009\u62E9\u5668\uFF0C\u4E0D\u5957 .caui-root\uFF09
   --------------------------------------------------------------------------- */

@media (max-width: 640px) {
  .caui-lightbox {
    padding: 12px;
  }

  .caui-lightbox-close {
    top: max(10px, env(safe-area-inset-top));
    right: 10px;
  }
}
`;

// src/client/chat-a2ui/styles/misc.ts
var MISC_CSS = `

.caui-chat-page {
  position: relative;
  display: flex;
  flex: 1 1 auto;
  flex-direction: column;
  width: 100%;
  height: 100%;
  min-width: 0;
  min-height: 0;
  overflow: hidden;
  background: var(--caui-bg);
  font-size: 15px;
  line-height: 1.6;
  text-align: left;
}

.caui-chat-workspace {
  display: flex;
  flex: 1 1 auto;
  flex-direction: column;
  width: 100%;
  height: 100%;
  min-width: 0;
  min-height: 0;
}

/* \u5934\u90E8\uFF1A\u8FD4\u56DE\u3001\u6807\u9898\u3001\u539F\u751F\u52A8\u4F5C\u3001\u8F68\u8FF9\u5F00\u5173 -------------------------------- */
.caui-chat-header {
  display: flex;
  flex: 0 0 auto;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  min-height: 56px;
  padding: 8px 14px;
  border-bottom: 1px solid var(--caui-border);
  background: var(--caui-bg);
}

.caui-chat-header-main {
  display: flex;
  flex: 1 1 auto;
  align-items: center;
  gap: 8px;
  min-width: 0;
}

.caui-chat-title-block {
  display: flex;
  flex-direction: column;
  gap: 1px;
  min-width: 0;
}

.caui-chat-title {
  display: flex;
  align-items: center;
  gap: 7px;
  min-width: 0;
  font-size: 14.5px;
  font-weight: 600;
  line-height: 1.35;
  letter-spacing: -0.01em;
}

.caui-chat-title > span:last-child {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.caui-chat-subtitle {
  color: var(--caui-muted);
  font-size: 11.5px;
  line-height: 1.4;
}

.caui-chat-header-actions {
  display: flex;
  flex: 0 0 auto;
  align-items: center;
  gap: 4px;
  min-width: 0;
}

.caui-chat-icon-button {
  display: inline-flex;
  flex: 0 0 auto;
  align-items: center;
  justify-content: center;
  width: 30px;
  height: 30px;
  padding: 0;
  border: 0;
  border-radius: var(--caui-radius-sm);
  background: transparent;
  color: var(--caui-muted);
  cursor: pointer;
  transition: background-color 120ms ease, color 120ms ease;
}

.caui-chat-icon-button:hover {
  background: var(--caui-subtle-hover);
  color: var(--caui-fg);
}

.caui-chat-toolbar-button {
  display: inline-flex;
  flex: 0 0 auto;
  align-items: center;
  gap: 5px;
  height: 30px;
  padding: 0 9px;
  border: 1px solid transparent;
  border-radius: var(--caui-radius-sm);
  background: transparent;
  color: var(--caui-muted);
  font: inherit;
  font-size: 12px;
  line-height: 1;
  white-space: nowrap;
  cursor: pointer;
  transition: background-color 120ms ease, border-color 120ms ease, color 120ms ease;
}

.caui-chat-new-glyph {
  font-size: 15px;
  line-height: 1;
}

.caui-chat-toolbar-button:hover:not(:disabled) {
  background: var(--caui-subtle);
  color: var(--caui-fg);
}

.caui-chat-toolbar-active {
  border-color: var(--caui-border);
  background: var(--caui-subtle);
  color: var(--caui-fg);
}

.caui-chat-toolbar-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.caui-chat-body {
  position: relative;
  display: flex;
  flex: 1 1 auto;
  align-items: stretch;
  min-width: 0;
  min-height: 0;
}

.caui-chat-main {
  position: relative;
  display: flex;
  flex: 1 1 auto;
  flex-direction: column;
  min-width: 0;
  min-height: 0;
}

/* \u53F3\u4FA7\u8F68\u8FF9\u680F\uFF1A\u9ED8\u8BA4\u6298\u53E0\uFF0C\u5C55\u5F00\u65F6\u7531 Framer Motion \u9A71\u52A8\u5BBD\u5EA6 --------------- */
.caui-chat-dock {
  position: relative;
  flex: 0 0 auto;
  min-width: 0;
  overflow: hidden;
  border-left: 1px solid var(--caui-border);
  background: var(--caui-bg);
}

.caui-chat-dock-inner {
  display: flex;
  flex-direction: column;
  width: 360px;
  height: 100%;
  min-height: 0;
}

.caui-chat-dock-head {
  display: flex;
  flex: 0 0 auto;
  align-items: center;
  justify-content: space-between;
  height: 48px;
  padding: 0 8px 0 14px;
  border-bottom: 1px solid var(--caui-border);
}

.caui-chat-dock-title {
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  color: var(--caui-muted);
}

.caui-chat-dock-body {
  flex: 1 1 auto;
  min-height: 0;
  overflow: hidden;
}

.caui-chat-dock-conversation {
  display: flex;
  flex-direction: column;
  height: 100%;
  min-height: 0;
}

/* \u72B6\u6001\u9875 ---------------------------------------------------------------- */
.caui-chat-status {
  display: flex;
  flex: 1 1 auto;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 48px 24px;
  text-align: center;
}

.caui-chat-status-mark {
  display: grid;
  place-items: center;
  width: 42px;
  height: 42px;
  margin-bottom: 4px;
  border: 1px solid var(--caui-border);
  border-radius: 999px;
  background: var(--caui-subtle);
  color: var(--caui-accent);
  font-size: 17px;
}

.caui-chat-status-title {
  font-size: 15px;
  font-weight: 600;
}

.caui-chat-status-detail {
  max-width: 420px;
  color: var(--caui-muted);
  font-size: 13px;
}

.caui-chat-status-actions {
  display: flex;
  gap: 8px;
  margin-top: 8px;
}

.caui-chat-primary,
.caui-chat-secondary {
  height: 32px;
  padding: 0 14px;
  border-radius: var(--caui-radius-sm);
  font: inherit;
  font-size: 13px;
  cursor: pointer;
}

.caui-chat-primary {
  border: 1px solid var(--caui-accent);
  background: var(--caui-accent);
  color: var(--caui-accent-fg);
}

.caui-chat-secondary {
  border: 1px solid var(--caui-border);
  background: transparent;
  color: var(--caui-fg);
}

/* \u54CD\u5E94\u5F0F\uFF1A\u7A84\u5C4F\u628A\u8F68\u8FF9\u6539\u6210\u8986\u76D6\u5C42 ------------------------------------------ */
@media (max-width: 900px) {
  .caui-chat-toolbar-label {
    display: none;
  }

  .caui-chat-toolbar-button {
    padding: 0 7px;
  }

  /* \u5BBD\u5EA6\u7531 ChatWorkspace \u7684 framer\uFF08animate={{ width: 360 }}\uFF09\u72EC\u5360\u5199\u51FA\uFF1A
     \u8FD9\u91CC\u4E0D\u5199 width\uFF0C\u4E5F\u4E0D\u52A0 !important\uFF0C\u53EA\u7528 max-width \u515C\u4F4F\u7A84\u5C4F\u3002 */
  .caui-chat-dock {
    position: absolute;
    z-index: 20;
    top: 0;
    right: 0;
    bottom: 0;
    max-width: min(88vw, 360px);
    box-shadow: var(--caui-shadow);
  }

  .caui-chat-dock-inner {
    width: 100%;
  }
}

@media (max-width: 640px) {
  .caui-chat-header {
    min-height: 50px;
    padding: 6px 8px;
  }

  .caui-chat-subtitle {
    display: none;
  }
}

@media (prefers-reduced-motion: reduce) {
  .caui-chat-page:not([data-motion="full"]) *,
  .caui-chat-list:not([data-motion="full"]) * {
    transition-duration: 1ms !important;
  }
}

/* ---------------------------------------------------------------------------
   \u79FB\u52A8\u7AEF\uFF1A\u6536\u7D27\u7559\u767D\u3001\u9690\u85CF\u6B21\u8981\u4FE1\u606F
   --------------------------------------------------------------------------- */
/* ---------------------------------------------------------------------------
   B Soft glass\uFF08\u539F P0.6 \u89C6\u89C9\u5C42\uFF09\u5DF2\u5E76\u56DE\u672C\u5757
   --------------------------------------------------------------------------- */

.caui-chat-page {
  background:
    radial-gradient(1100px 520px at 12% -8%, rgba(110, 123, 255, 0.14), transparent 62%),
    radial-gradient(900px 480px at 100% 0%, rgba(90, 200, 190, 0.10), transparent 58%),
    var(--caui-bg);
}

.caui-chat-workspace {
  background: transparent;
}

.caui-chat-header {
  position: relative;
  z-index: 3;
  min-height: 60px;
  padding: 10px 16px;
  border-bottom: 1px solid var(--caui-glass-border);
  background: var(--caui-glass-bg);
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.42), var(--caui-glass-shadow-soft);
  backdrop-filter: blur(var(--caui-glass-blur)) saturate(150%);
  -webkit-backdrop-filter: blur(var(--caui-glass-blur)) saturate(150%);
}

.caui-chat-header-main {
  gap: 9px;
}

.caui-chat-title {
  font-size: 15px;
  font-weight: 650;
  letter-spacing: -0.015em;
}

.caui-chat-subtitle {
  color: var(--caui-muted);
  font-size: 11.5px;
  min-height: 15px;
}

.caui-chat-shimmer {
  display: inline-block;
  perspective: 500px;
  font-size: inherit;
  line-height: inherit;
}

.caui-shimmer-char {
  display: inline-block;
  white-space: pre;
  transform-style: preserve-3d;
}

.caui-chat-header-actions {
  gap: 6px;
}

.caui-chat-icon-button {
  width: 32px;
  height: 32px;
  border: 1px solid transparent;
  border-radius: 10px;
}

.caui-chat-toolbar-button {
  height: 34px;
  padding: 0 11px;
  border-radius: 10px;
  font-size: 12.5px;
}

.caui-chat-toolbar-primary {
  border-color: var(--caui-glass-border);
  background: var(--caui-glass-bg-strong);
  color: var(--caui-fg);
  box-shadow: var(--caui-glass-shadow-soft);
}

.caui-chat-toolbar-primary:hover:not(:disabled) {
  border-color: var(--caui-accent);
  background: var(--caui-accent-soft);
  color: var(--caui-accent);
}

.caui-chat-toolbar-active {
  border-color: var(--caui-glass-border);
  background: var(--caui-glass-bg-strong);
  color: var(--caui-fg);
  box-shadow: var(--caui-glass-shadow-soft);
}

.caui-chat-dock {
  border-left: 1px solid var(--caui-glass-border);
  background: var(--caui-glass-bg);
  box-shadow: var(--caui-glass-shadow);
  backdrop-filter: blur(var(--caui-glass-blur)) saturate(140%);
  -webkit-backdrop-filter: blur(var(--caui-glass-blur)) saturate(140%);
}

.caui-chat-dock-head {
  height: 52px;
  border-bottom-color: var(--caui-glass-border);
}

.caui-chat-main :is(
  button[aria-label^="\u8BBF\u95EE\u6A21\u5F0F"],
  button[aria-label^="\u6743\u9650\u6A21\u5F0F"],
  button[aria-label^="Access mode"],
  button[aria-label^="Permission"],
  [data-slot="conversation.input.permission"]
) {
  display: none !important;
}

.caui-chat-status-mark {
  border-color: var(--caui-glass-border);
  background: var(--caui-glass-bg-strong);
  box-shadow: var(--caui-glass-shadow-soft);
}

.caui-chat-primary {
  border-color: var(--caui-accent);
  background: var(--caui-accent);
  box-shadow: 0 10px 24px color-mix(in srgb, var(--caui-accent) 24%, transparent);
}

.caui-chat-secondary {
  border-color: var(--caui-glass-border);
  background: var(--caui-glass-bg);
}

@media (max-width: 900px) {
  .caui-chat-header {
    padding: 9px 12px;
  }

  .caui-chat-toolbar-button {
    padding: 0 9px;
  }
}

@media (max-width: 640px) {
  .caui-chat-header-main {
    gap: 6px;
  }

  .caui-chat-title {
    font-size: 14px;
  }
}

}`;

// src/client/chat-a2ui/style.ts
var CHAT_STYLE_ATTR = "data-dsh-chat-a2ui";
var MOTION_VARS_ATTR = "data-caui-motion-vars";
var CHAT_CSS = [
  BASE_CSS,
  FLOW_CSS,
  COMPOSER_CSS,
  LIST_CSS,
  LIGHTBOX_CSS,
  MISC_CSS
].join("\n");
var injectedDocs = /* @__PURE__ */ new WeakSet();
function useChatStyles() {
  if (typeof document === "undefined") return;
  const doc = document;
  if (injectedDocs.has(doc)) return;
  const head = doc.head;
  if (head === null || head === void 0) return;
  if (head.querySelector("style[" + CHAT_STYLE_ATTR + "]") === null) {
    const element = doc.createElement("style");
    element.setAttribute(CHAT_STYLE_ATTR, "");
    element.textContent = CHAT_CSS;
    head.appendChild(element);
  }
  if (head.querySelector("style[" + MOTION_VARS_ATTR + "]") === null) {
    const vars = doc.createElement("style");
    vars.setAttribute(MOTION_VARS_ATTR, "");
    vars.textContent = motionCssVars();
    head.appendChild(vars);
  }
  injectedDocs.add(doc);
}

// src/client/chat-a2ui/motion-scope.ts
function useMotionAttribute() {
  const level = useMotionLevel();
  return { "data-motion": level };
}

// src/client/chat-a2ui/motion-primitives/vendor/AnimatedGroup.tsx
var import_react33 = __toESM(require("react"), 1);
var import_jsx_runtime15 = require("react/jsx-runtime");
var presetSpring = { type: "spring", ...MOTION.tokens.springs.soft };
var defaultContainerVariants = { visible: { transition: { staggerChildren: 0.1 } } };
var defaultItemVariants = { hidden: { opacity: 0 }, visible: { opacity: 1 } };
var presetVariants = {
  fade: {},
  slide: { hidden: { y: 20 }, visible: { y: 0 } },
  scale: { hidden: { scale: 0.8 }, visible: { scale: 1 } },
  blur: { hidden: { filter: "blur(4px)" }, visible: { filter: "blur(0px)" } },
  "blur-slide": { hidden: { filter: "blur(4px)", y: 20 }, visible: { filter: "blur(0px)", y: 0 } },
  zoom: { hidden: { scale: 0.5 }, visible: { scale: 1, transition: presetSpring } },
  flip: { hidden: { rotateX: -90 }, visible: { rotateX: 0, transition: presetSpring } },
  bounce: { hidden: { y: -50 }, visible: { y: 0, transition: presetSpring } },
  rotate: { hidden: { rotate: -180 }, visible: { rotate: 0, transition: presetSpring } },
  swing: { hidden: { rotate: -10 }, visible: { rotate: 0, transition: presetSpring } }
};
var addDefaultVariants = (variants) => ({
  hidden: { ...defaultItemVariants.hidden, ...variants.hidden },
  visible: { ...defaultItemVariants.visible, ...variants.visible }
});
function motionTag(as) {
  if (typeof as === "string") {
    const tags = motion;
    return tags[as] ?? motion.div;
  }
  return motion.div;
}
function AnimatedGroup({ children, className, variants, preset, as = "div", asChild = "div" }) {
  const selectedVariants = {
    item: addDefaultVariants(preset === void 0 ? {} : presetVariants[preset] ?? {}),
    container: addDefaultVariants(defaultContainerVariants)
  };
  const containerVariants = variants?.container ?? selectedVariants.container;
  const itemVariants = variants?.item ?? selectedVariants.item;
  const MotionComponent = (0, import_react33.useMemo)(() => motionTag(as), [as]);
  const MotionChild = (0, import_react33.useMemo)(() => motionTag(asChild), [asChild]);
  return /* @__PURE__ */ (0, import_jsx_runtime15.jsx)(MotionComponent, { initial: "hidden", animate: "visible", variants: containerVariants, className: cx("caui-animated-group", className), children: import_react33.default.Children.map(children, (child, index) => /* @__PURE__ */ (0, import_jsx_runtime15.jsx)(MotionChild, { variants: itemVariants, children: child }, index)) });
}

// src/client/chat-a2ui/motion-primitives/vendor/ProgressiveBlur.tsx
var import_jsx_runtime16 = require("react/jsx-runtime");
var GRADIENT_ANGLES = { top: 0, right: 90, bottom: 180, left: 270 };
function ProgressiveBlur({
  direction = "bottom",
  blurLayers = 8,
  className,
  blurIntensity = 0.25,
  ...rest
}) {
  const layers = Math.max(blurLayers, 2);
  const segmentSize = 1 / (layers + 1);
  const angle = GRADIENT_ANGLES[direction];
  return /* @__PURE__ */ (0, import_jsx_runtime16.jsx)("div", { ...rest, className: cx("caui-progressive-blur", className), "aria-hidden": "true", children: Array.from({ length: layers }).map((_, index) => {
    const gradientStops = [index * segmentSize, (index + 1) * segmentSize, (index + 2) * segmentSize, (index + 3) * segmentSize].map((pos, posIndex) => "rgba(255, 255, 255, " + (posIndex === 1 || posIndex === 2 ? 1 : 0) + ") " + pos * 100 + "%");
    const gradient = "linear-gradient(" + angle + "deg, " + gradientStops.join(", ") + ")";
    return /* @__PURE__ */ (0, import_jsx_runtime16.jsx)(
      "div",
      {
        className: "caui-progressive-blur-layer",
        style: {
          maskImage: gradient,
          WebkitMaskImage: gradient,
          backdropFilter: "blur(" + index * blurIntensity + "px)",
          WebkitBackdropFilter: "blur(" + index * blurIntensity + "px)"
        }
      },
      index
    );
  }) });
}

// src/client/chat-a2ui/motion-primitives/vendor/TextEffect.tsx
var import_react34 = __toESM(require("react"), 1);
var import_jsx_runtime17 = require("react/jsx-runtime");
var defaultStaggerTimes = { char: 0.03, word: 0.05, line: 0.1 };
var defaultContainerVariants2 = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.05 } },
  exit: { transition: { staggerChildren: 0.05, staggerDirection: -1 } }
};
var defaultItemVariants2 = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
  exit: { opacity: 0 }
};
var presetVariants2 = {
  blur: {
    container: defaultContainerVariants2,
    item: { hidden: { opacity: 0, filter: "blur(12px)" }, visible: { opacity: 1, filter: "blur(0px)" }, exit: { opacity: 0, filter: "blur(12px)" } }
  },
  "fade-in-blur": {
    container: defaultContainerVariants2,
    item: { hidden: { opacity: 0, y: 20, filter: "blur(12px)" }, visible: { opacity: 1, y: 0, filter: "blur(0px)" }, exit: { opacity: 0, y: 20, filter: "blur(12px)" } }
  },
  scale: {
    container: defaultContainerVariants2,
    item: { hidden: { opacity: 0, scale: 0 }, visible: { opacity: 1, scale: 1 }, exit: { opacity: 0, scale: 0 } }
  },
  fade: {
    container: defaultContainerVariants2,
    item: { hidden: { opacity: 0 }, visible: { opacity: 1 }, exit: { opacity: 0 } }
  },
  slide: {
    container: defaultContainerVariants2,
    item: { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 }, exit: { opacity: 0, y: 20 } }
  }
};
function motionTag2(as) {
  const tags = motion;
  return tags[as] ?? motion.div;
}
var AnimationComponent = import_react34.default.memo(function AnimationComponent2({ segment, variants, per, segmentWrapperClassName }) {
  const content = per === "line" ? /* @__PURE__ */ (0, import_jsx_runtime17.jsx)(motion.span, { variants, className: "caui-text-effect-line", children: segment }) : per === "word" ? /* @__PURE__ */ (0, import_jsx_runtime17.jsx)(motion.span, { "aria-hidden": "true", variants, className: "caui-text-effect-segment", children: segment }) : /* @__PURE__ */ (0, import_jsx_runtime17.jsx)(motion.span, { className: "caui-text-effect-segment", children: segment.split("").map((char, charIndex) => /* @__PURE__ */ (0, import_jsx_runtime17.jsx)(motion.span, { "aria-hidden": "true", variants, className: "caui-text-effect-char", children: char }, "char-" + charIndex)) });
  if (segmentWrapperClassName === void 0) return content;
  return /* @__PURE__ */ (0, import_jsx_runtime17.jsx)("span", { className: cx(per === "line" ? "caui-text-effect-line" : "caui-text-effect-segment", segmentWrapperClassName), children: content });
});
var splitText = (text2, per) => per === "line" ? text2.split("\n") : text2.split(/(\s+)/);
var hasTransition = (variant) => {
  if (variant === void 0 || variant === null) return false;
  return typeof variant === "object" && "transition" in variant;
};
var createVariantsWithTransition = (baseVariants, transition) => {
  if (transition === void 0) return baseVariants;
  const { exit: _exit, ...mainTransition } = transition;
  return {
    ...baseVariants,
    visible: {
      ...baseVariants.visible,
      transition: {
        ...hasTransition(baseVariants.visible) ? baseVariants.visible.transition : {},
        ...mainTransition
      }
    },
    exit: {
      ...baseVariants.exit,
      transition: {
        ...hasTransition(baseVariants.exit) ? baseVariants.exit.transition : {},
        ...mainTransition,
        staggerDirection: -1
      }
    }
  };
};
function TextEffect({
  children,
  per = "word",
  as = "p",
  variants,
  className,
  preset = "fade",
  delay: delay2 = 0,
  speedReveal = 1,
  speedSegment = 1,
  trigger = true,
  onAnimationComplete,
  onAnimationStart,
  segmentWrapperClassName,
  containerTransition,
  segmentTransition,
  style
}) {
  const segments = splitText(children, per);
  const MotionTag = motionTag2(as);
  const baseVariants = presetVariants2[preset] ?? { container: defaultContainerVariants2, item: defaultItemVariants2 };
  const stagger = defaultStaggerTimes[per] / speedReveal;
  const baseDuration = 0.3 / speedSegment;
  const customStagger = hasTransition(variants?.container?.visible ?? {}) ? (variants?.container?.visible).transition?.staggerChildren : void 0;
  const customDelay = hasTransition(variants?.container?.visible ?? {}) ? (variants?.container?.visible).transition?.delayChildren : void 0;
  const computedVariants = {
    container: createVariantsWithTransition(variants?.container ?? baseVariants.container, {
      staggerChildren: customStagger ?? stagger,
      delayChildren: customDelay ?? delay2,
      ...containerTransition,
      exit: { staggerChildren: customStagger ?? stagger, staggerDirection: -1 }
    }),
    item: createVariantsWithTransition(variants?.item ?? baseVariants.item, {
      duration: baseDuration,
      ...segmentTransition
    })
  };
  return /* @__PURE__ */ (0, import_jsx_runtime17.jsx)(AnimatePresence, { mode: "popLayout", initial: false, children: /* @__PURE__ */ (0, import_jsx_runtime17.jsxs)(
    MotionTag,
    {
      initial: trigger ? "hidden" : false,
      animate: "visible",
      exit: "exit",
      variants: computedVariants.container,
      className: cx("caui-text-effect", className),
      onAnimationComplete,
      onAnimationStart,
      style,
      children: [
        per !== "line" ? /* @__PURE__ */ (0, import_jsx_runtime17.jsx)("span", { className: "caui-sr-only", children }) : null,
        segments.map((segment, index) => /* @__PURE__ */ (0, import_jsx_runtime17.jsx)(
          AnimationComponent,
          {
            segment,
            variants: computedVariants.item,
            per,
            segmentWrapperClassName
          },
          per + "-" + index + "-" + segment
        ))
      ]
    }
  ) });
}

// src/client/chat-a2ui/scroll-context.ts
var import_react35 = require("react");
var ChatInnerScrollContext = (0, import_react35.createContext)(false);
function useChatInnerScroll() {
  return (0, import_react35.useContext)(ChatInnerScrollContext);
}

// src/client/constants.ts
var CHAT_VIEW_ID = "chat-a2ui";
var CHAT_PRESET_ID = "chat";
var CHAT_VIEW_LABEL = "Chat UI";
var CHAT_PANEL_ID = "chat-a2ui";
var CHAT_PANEL_LABEL = "Chat";
var CHAT_MODE_SOURCE = "chatMode";

// src/client/chat-a2ui/ChatA2UIView.tsx
var import_jsx_runtime18 = require("react/jsx-runtime");
var RowErrorBoundary = class extends import_react36.Component {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  componentDidCatch(error) {
    console.error("[chat-a2ui] \u6D88\u606F\u884C\u6E32\u67D3\u5931\u8D25", error);
  }
  render() {
    if (this.state.failed) {
      return /* @__PURE__ */ (0, import_jsx_runtime18.jsx)("div", { className: cx(cls.row, cls.rowNotice), children: /* @__PURE__ */ (0, import_jsx_runtime18.jsxs)("div", { className: cls.notice, role: "alert", children: [
        /* @__PURE__ */ (0, import_jsx_runtime18.jsx)("span", { className: cls.noticeIcon, "aria-hidden": "true", children: "!" }),
        /* @__PURE__ */ (0, import_jsx_runtime18.jsx)("span", { className: cx(cls.noticeText, cls.toolError), children: "\u6B64\u6D88\u606F\u6E32\u67D3\u5931\u8D25" })
      ] }) });
    }
    return this.props.children;
  }
};
var SUGGESTIONS = [
  "\u7528\u4E09\u53E5\u8BDD\u89E3\u91CA\u4E00\u4E0B\u8FD9\u4E2A\u89C6\u56FE\u9002\u5408\u505A\u4EC0\u4E48\u3002",
  "\u5E2E\u6211\u628A\u4E00\u4E2A\u6A21\u7CCA\u7684\u60F3\u6CD5\u6574\u7406\u6210\u4E09\u6761\u5F85\u529E\u3002",
  "\u6BD4\u8F83\u4E24\u79CD\u65B9\u6848\uFF0C\u5404\u8BF4\u4E00\u4E2A\u4F18\u70B9\u548C\u4E00\u4E2A\u7F3A\u70B9\u3002"
];
function EmptyChat({ animated }) {
  return /* @__PURE__ */ (0, import_jsx_runtime18.jsxs)("div", { className: cls.empty, "aria-label": "\u5F00\u59CB\u804A\u5929", children: [
    /* @__PURE__ */ (0, import_jsx_runtime18.jsx)("div", { className: cls.emptyMark, "aria-hidden": "true", children: "\u2726" }),
    /* @__PURE__ */ (0, import_jsx_runtime18.jsx)("div", { className: cls.emptyTitle, "aria-hidden": "true", children: /* @__PURE__ */ (0, import_jsx_runtime18.jsx)(TextEffect, { as: "div", ...MOTION.textEffect.emptyTitle, trigger: animated, children: "\u5F00\u59CB\u804A\u5929" }) }),
    /* @__PURE__ */ (0, import_jsx_runtime18.jsx)("div", { className: cls.emptyHint, children: "\u7EAF\u5BF9\u8BDD\u6A21\u5F0F\uFF1A\u53EA\u804A\u5929\u548C\u67E5\u8D44\u6599\uFF0C\u4E0D\u5199\u6587\u4EF6\u3001\u4E0D\u8DD1\u547D\u4EE4\u3002\u8F93\u5165\u6846\u5728\u4E0B\u65B9\uFF0C\u968F\u65F6\u53EF\u4EE5\u5F00\u59CB\u3002" }),
    animated ? /* @__PURE__ */ (0, import_jsx_runtime18.jsx)(
      AnimatedGroup,
      {
        preset: MOTION.animatedGroup.suggestions.preset,
        className: cls.emptySuggestions,
        variants: {
          container: {
            visible: { transition: { staggerChildren: MOTION.animatedGroup.suggestions.stagger } }
          }
        },
        children: SUGGESTIONS.map((text2) => /* @__PURE__ */ (0, import_jsx_runtime18.jsx)("div", { className: cls.emptySuggestion, children: text2 }, text2))
      }
    ) : /* @__PURE__ */ (0, import_jsx_runtime18.jsx)("div", { className: cls.emptySuggestions, children: SUGGESTIONS.map((text2) => /* @__PURE__ */ (0, import_jsx_runtime18.jsx)("div", { className: cls.emptySuggestion, children: text2 }, text2)) })
  ] });
}
function ChatA2UIView(props) {
  const { useChat, useSession, loadImage, forkAt } = props;
  useChatStyles();
  const order = useChat((snapshot) => snapshot.order);
  const running = useSession((snapshot) => snapshot.running) === true;
  const openState = useSession((snapshot) => snapshot.openState);
  const motionLevel = useMotionLevel();
  const animated = motionLevel === "full";
  const motionAttrs = useMotionAttribute();
  const containerRef = (0, import_react36.useRef)(null);
  const contentRef = (0, import_react36.useRef)(null);
  const keys = Array.isArray(order) ? order : [];
  const forceInner = useChatInnerScroll();
  const { atBottom, outer, scrollToBottom } = useStickToBottom({
    containerRef,
    contentRef,
    revision: keys.length,
    forceInner
  });
  const enter = useEnter("message.enter");
  const exit = useRole("message.exit").exit;
  return /* @__PURE__ */ (0, import_jsx_runtime18.jsxs)(
    "div",
    {
      className: cls.root,
      "data-chat-view": CHAT_VIEW_ID,
      "data-scroll-owner": forceInner || !outer ? "inner" : "outer",
      ...motionAttrs,
      children: [
        /* @__PURE__ */ (0, import_jsx_runtime18.jsxs)("div", { className: cls.viewport, ref: containerRef, children: [
          /* @__PURE__ */ (0, import_jsx_runtime18.jsx)(
            "div",
            {
              className: cls.flow,
              ref: contentRef,
              role: "log",
              "aria-live": "off",
              "aria-label": "\u5BF9\u8BDD\u6D88\u606F",
              "aria-busy": running,
              children: keys.length === 0 ? openState === "cold" || openState === "loading" ? /* @__PURE__ */ (0, import_jsx_runtime18.jsx)("div", { className: cls.empty, "aria-busy": "true", children: /* @__PURE__ */ (0, import_jsx_runtime18.jsx)("div", { className: cls.emptyHint, children: "\u8F7D\u5165\u5BF9\u8BDD\u2026" }) }) : openState === "error" ? /* @__PURE__ */ (0, import_jsx_runtime18.jsxs)("div", { className: cls.empty, children: [
                /* @__PURE__ */ (0, import_jsx_runtime18.jsx)("div", { className: cls.emptyTitle, children: "\u5386\u53F2\u52A0\u8F7D\u5931\u8D25" }),
                /* @__PURE__ */ (0, import_jsx_runtime18.jsx)("div", { className: cls.emptyHint, children: "\u53EF\u4EE5\u5207\u5230\u201C\u5BF9\u8BDD\u201D\u6807\u7B7E\u67E5\u770B\u9519\u8BEF\u8BE6\u60C5\uFF0C\u6216\u91CD\u65B0\u6253\u5F00\u8FD9\u4E2A\u4F1A\u8BDD\u3002" })
              ] }) : /* @__PURE__ */ (0, import_jsx_runtime18.jsx)(EmptyChat, { animated }) : /* @__PURE__ */ (0, import_jsx_runtime18.jsx)(AnimatePresence, { initial: false, children: keys.map((key) => /* @__PURE__ */ (0, import_jsx_runtime18.jsx)(
                motion.div,
                {
                  layout: animated && !running,
                  initial: enter.initial,
                  animate: enter.animate,
                  exit,
                  transition: enter.transition,
                  children: /* @__PURE__ */ (0, import_jsx_runtime18.jsx)(RowErrorBoundary, { children: /* @__PURE__ */ (0, import_jsx_runtime18.jsx)(
                    ChatRow,
                    {
                      nodeKey: key,
                      useChat,
                      loadImage,
                      forkAt,
                      running
                    }
                  ) })
                },
                key
              )) })
            }
          ),
          /* @__PURE__ */ (0, import_jsx_runtime18.jsx)(ScrollToBottomButton, { atBottom, onScrollToBottom: scrollToBottom })
        ] }),
        forceInner && /* @__PURE__ */ (0, import_jsx_runtime18.jsxs)(import_jsx_runtime18.Fragment, { children: [
          /* @__PURE__ */ (0, import_jsx_runtime18.jsx)(ProgressiveBlur, { direction: "top", className: cls.flowBlurTop, blurLayers: MOTION.progressiveBlur.blurLayers, blurIntensity: MOTION.progressiveBlur.blurIntensity }),
          /* @__PURE__ */ (0, import_jsx_runtime18.jsx)(ProgressiveBlur, { direction: "bottom", className: cls.flowBlurBottom, blurLayers: MOTION.progressiveBlur.blurLayers, blurIntensity: MOTION.progressiveBlur.blurIntensity })
        ] })
      ]
    }
  );
}

// src/client/chat-mode/ChatPage.tsx
var import_react38 = require("react");

// src/client/chat-mode/useChatMode.ts
var import_react37 = require("react");
function useChatMode(controller) {
  return (0, import_react37.useSyncExternalStore)(
    controller.subscribe,
    controller.getSnapshot,
    controller.getSnapshot
  );
}

// src/client/chat-mode/ChatPage.tsx
var import_jsx_runtime19 = require("react/jsx-runtime");
function StatusPage({ title, detail, action }) {
  return /* @__PURE__ */ (0, import_jsx_runtime19.jsx)("div", { className: cls.chatModePage, children: /* @__PURE__ */ (0, import_jsx_runtime19.jsxs)("div", { className: cls.chatModeStatus, role: "status", children: [
    /* @__PURE__ */ (0, import_jsx_runtime19.jsx)("div", { className: cls.chatModeStatusMark, "aria-hidden": "true", children: "\u2726" }),
    /* @__PURE__ */ (0, import_jsx_runtime19.jsx)("div", { className: cls.chatModeStatusTitle, children: title }),
    /* @__PURE__ */ (0, import_jsx_runtime19.jsx)("div", { className: cls.chatModeStatusDetail, children: detail }),
    action
  ] }) });
}
function ChatPage({ controller, sessions, SessionProvider, renderSlot }) {
  useChatStyles();
  const mode = useChatMode(controller);
  const motionAttrs = useMotionAttribute();
  const [entry, setEntry] = (0, import_react38.useState)(null);
  const [retainError, setRetainError] = (0, import_react38.useState)(null);
  const activeId = mode.activeSessionId;
  (0, import_react38.useEffect)(() => {
    controller.mount();
    return () => {
      controller.unmount();
    };
  }, [controller]);
  (0, import_react38.useEffect)(() => {
    if (activeId === null) {
      setEntry(null);
      setRetainError(null);
      return;
    }
    if (typeof sessions.retain !== "function") {
      setRetainError("\u5F53\u524D\u5BBF\u4E3B\u6CA1\u6709\u63D0\u4F9B\u72EC\u7ACB\u4F1A\u8BDD\u7ED1\u5B9A\u3002");
      return;
    }
    let reference;
    try {
      reference = sessions.retain(activeId, { source: CHAT_MODE_SOURCE });
    } catch (error) {
      console.warn("[chat-a2ui] \u7ED1\u5B9A Chat \u4F1A\u8BDD\u5931\u8D25\uFF1A", error);
      setRetainError("\u7ED1\u5B9A\u5BF9\u8BDD\u5931\u8D25\uFF0C\u8BF7\u91CD\u8BD5\u3002");
      return;
    }
    setRetainError(null);
    setEntry({ id: activeId, reference });
    return () => {
      reference.release();
    };
  }, [activeId, sessions]);
  if (mode.phase === "error" && activeId === null) {
    return /* @__PURE__ */ (0, import_jsx_runtime19.jsx)(
      StatusPage,
      {
        title: "\u5BF9\u8BDD\u6CA1\u6709\u6253\u5F00",
        detail: mode.error ?? "\u65B0\u5EFA\u5BF9\u8BDD\u5931\u8D25\uFF0C\u8BF7\u91CD\u8BD5\u3002",
        action: /* @__PURE__ */ (0, import_jsx_runtime19.jsxs)("div", { className: cls.chatModeStatusActions, children: [
          /* @__PURE__ */ (0, import_jsx_runtime19.jsx)("button", { type: "button", className: cls.chatModePrimary, onClick: () => {
            void controller.retry();
          }, children: "\u91CD\u8BD5" }),
          /* @__PURE__ */ (0, import_jsx_runtime19.jsx)("button", { type: "button", className: cls.chatModeSecondary, onClick: () => {
            controller.back();
          }, children: "\u8FD4\u56DE\u5BF9\u8BDD" })
        ] })
      }
    );
  }
  if (retainError !== null) {
    return /* @__PURE__ */ (0, import_jsx_runtime19.jsx)(
      StatusPage,
      {
        title: "\u5BF9\u8BDD\u6CA1\u6709\u6253\u5F00",
        detail: retainError,
        action: /* @__PURE__ */ (0, import_jsx_runtime19.jsxs)("div", { className: cls.chatModeStatusActions, children: [
          /* @__PURE__ */ (0, import_jsx_runtime19.jsx)("button", { type: "button", className: cls.chatModePrimary, onClick: () => {
            void controller.retry();
          }, children: "\u91CD\u8BD5" }),
          /* @__PURE__ */ (0, import_jsx_runtime19.jsx)("button", { type: "button", className: cls.chatModeSecondary, onClick: () => {
            controller.back();
          }, children: "\u8FD4\u56DE\u5BF9\u8BDD" })
        ] })
      }
    );
  }
  if (activeId === null || mode.phase === "opening" || entry === null || entry.id !== activeId) {
    return /* @__PURE__ */ (0, import_jsx_runtime19.jsx)(
      StatusPage,
      {
        title: "\u6B63\u5728\u6253\u5F00\u5BF9\u8BDD",
        detail: "\u51C6\u5907\u597D\u4E0A\u4E0B\u6587\u540E\u5C31\u4F1A\u663E\u793A\u6D88\u606F\u3002"
      }
    );
  }
  if (SessionProvider === void 0) {
    return /* @__PURE__ */ (0, import_jsx_runtime19.jsx)(
      StatusPage,
      {
        title: "\u5BF9\u8BDD\u5BB9\u5668\u672A\u5C31\u7EEA",
        detail: "\u5BBF\u4E3B\u6CA1\u6709\u6CE8\u5165 SessionProvider\uFF1B\u8FD9\u901A\u5E38\u662F\u63D2\u4EF6\u58F0\u660E\u7F3A\u5C11 session \u5B50\u69FD\u5BFC\u81F4\u7684\u3002"
      }
    );
  }
  return /* @__PURE__ */ (0, import_jsx_runtime19.jsx)("div", { className: cls.chatModePage, "data-chat-panel": CHAT_PANEL_ID, ...motionAttrs, children: /* @__PURE__ */ (0, import_jsx_runtime19.jsx)(SessionProvider, { session: entry.reference, children: renderSlot("chat-a2ui.conversation", { controller }) }) });
}

// src/client/chat-mode/ChatPanelIcon.tsx
var import_jsx_runtime20 = require("react/jsx-runtime");
function ChatPanelIcon({ size = 18, active = false }) {
  return /* @__PURE__ */ (0, import_jsx_runtime20.jsx)(
    "span",
    {
      className: cx(cls.chatModePanelIcon, active && cls.chatModePanelIconActive),
      "data-chat-mode-icon": "",
      "aria-hidden": "true",
      children: /* @__PURE__ */ (0, import_jsx_runtime20.jsxs)(
        "svg",
        {
          viewBox: "0 0 20 20",
          width: size,
          height: size,
          fill: "none",
          stroke: "currentColor",
          strokeWidth: "1.55",
          strokeLinecap: "round",
          strokeLinejoin: "round",
          focusable: "false",
          children: [
            /* @__PURE__ */ (0, import_jsx_runtime20.jsx)("path", { d: "M3.25 9.4c0-3.2 2.65-5.8 5.92-5.8h1.66c3.27 0 5.92 2.6 5.92 5.8s-2.65 5.8-5.92 5.8H8.1l-3.62 2.05.5-3.02A5.56 5.56 0 0 1 3.25 9.4Z" }),
            /* @__PURE__ */ (0, import_jsx_runtime20.jsx)("path", { d: "M7.1 8.2h5.8M7.1 11.2h3.4", opacity: "0.62" })
          ]
        }
      )
    }
  );
}

// src/client/chat-mode/ChatWorkspace.tsx
var import_react39 = require("react");

// src/client/chat-a2ui/motion-primitives/vendor/TextShimmerWave.tsx
var import_jsx_runtime21 = require("react/jsx-runtime");
function motionTag3(as) {
  if (typeof as === "string") {
    const tags = motion;
    return tags[as] ?? motion.span;
  }
  return motion.span;
}
function TextShimmerWave({
  children,
  as: Component4 = "span",
  className,
  duration = 1,
  zDistance = 10,
  xDistance = 2,
  yDistance = -2,
  spread = 1,
  scaleDistance = 1.1,
  rotateYDistance = 10,
  transition,
  style,
  ...rest
}) {
  const MotionComponent = motionTag3(Component4);
  return /* @__PURE__ */ (0, import_jsx_runtime21.jsx)(
    MotionComponent,
    {
      ...rest,
      className: cx("caui-text-shimmer-wave", className),
      style: { color: "var(--caui-shimmer-base)", ...style },
      children: children.split("").map((char, index) => {
        const delay2 = index * duration * (1 / spread) / Math.max(children.length, 1);
        return /* @__PURE__ */ (0, import_jsx_runtime21.jsx)(
          motion.span,
          {
            className: "caui-shimmer-char",
            initial: { translateZ: 0, scale: 1, rotateY: 0, color: "var(--caui-shimmer-base)" },
            animate: {
              translateZ: [0, zDistance, 0],
              translateX: [0, xDistance, 0],
              translateY: [0, yDistance, 0],
              scale: [1, scaleDistance, 1],
              rotateY: [0, rotateYDistance, 0],
              color: ["var(--caui-shimmer-base)", "var(--caui-shimmer-highlight)", "var(--caui-shimmer-base)"]
            },
            transition: {
              duration,
              repeat: Infinity,
              repeatDelay: children.length * 0.05 / spread,
              delay: delay2,
              ease: MOTION.tokens.ease.inOut,
              ...transition
            },
            children: char
          },
          index
        );
      })
    }
  );
}

// src/client/chat-mode/host-affordance.ts
var NEW_SESSION_LABELS = ["\u65B0\u5EFA\u4F1A\u8BDD", "New session"];
var NEW_SESSION_CONTROL_SELECTOR = [
  ...NEW_SESSION_LABELS.map((label) => `button[aria-label="${label}"]`),
  'button[aria-keyshortcuts*="Alt+N"]',
  'button[aria-keyshortcuts*="Alt+Meta+N"]'
].join(", ");
function isNewSessionControl(target) {
  if (target === null || typeof target !== "object") return false;
  const element = target;
  if (typeof element.closest !== "function") return false;
  return element.closest(NEW_SESSION_CONTROL_SELECTOR) !== null;
}
function findNewSessionControls(root) {
  const found = [];
  for (const element of root.querySelectorAll("button")) {
    if (isNewSessionControl(element)) found.push(element);
  }
  return found;
}
function isNewSessionShortcut(event) {
  if (event.repeat === true) return false;
  if (typeof event.getModifierState === "function" && event.getModifierState("AltGraph")) return false;
  if (event.shiftKey) return false;
  if (!event.ctrlKey && !event.metaKey && !event.altKey) return false;
  if (event.code === "KeyN") return true;
  return event.key.toLowerCase() === "n";
}
function describeAffordances() {
  return "\u70B9\u51FB\u5224\u636E " + NEW_SESSION_CONTROL_SELECTOR + "\uFF1B\u5FEB\u6377\u952E\u5224\u636E Ctrl/\u2318/Alt \u4EFB\u4E00\u4FEE\u9970\u952E + N\uFF08\u4E0D\u542B Shift\uFF0C\u8DF3\u8FC7\u957F\u6309\u91CD\u590D\u4E0E AltGr\uFF1B\u7269\u7406\u952E KeyN \u6216\u952E\u503C n\uFF09";
}

// src/client/chat-mode/ChatWorkspace.tsx
var import_jsx_runtime22 = require("react/jsx-runtime");
function FixedChatModeView(props) {
  return /* @__PURE__ */ (0, import_jsx_runtime22.jsx)(import_jsx_runtime22.Fragment, { children: props.renderSlot("conversation.session", { view: CHAT_VIEW_ID }) });
}
function FixedTrajectoryView(props) {
  return /* @__PURE__ */ (0, import_jsx_runtime22.jsx)(import_jsx_runtime22.Fragment, { children: props.renderSlot("conversation.session", { view: "trajectory" }) });
}
function PanelGlyph({ open }) {
  return /* @__PURE__ */ (0, import_jsx_runtime22.jsxs)("svg", { viewBox: "0 0 16 16", width: "15", height: "15", fill: "none", stroke: "currentColor", strokeWidth: "1.5", strokeLinecap: "round", strokeLinejoin: "round", "aria-hidden": "true", children: [
    /* @__PURE__ */ (0, import_jsx_runtime22.jsx)("rect", { x: "1.8", y: "2.6", width: "12.4", height: "10.8", rx: "2" }),
    /* @__PURE__ */ (0, import_jsx_runtime22.jsx)("path", { d: open ? "M10.2 2.8v10.4" : "M5.8 2.8v10.4" })
  ] });
}
function BackGlyph() {
  return /* @__PURE__ */ (0, import_jsx_runtime22.jsx)("svg", { viewBox: "0 0 16 16", width: "16", height: "16", fill: "none", stroke: "currentColor", strokeWidth: "1.6", strokeLinecap: "round", strokeLinejoin: "round", "aria-hidden": "true", children: /* @__PURE__ */ (0, import_jsx_runtime22.jsx)("path", { d: "M9.8 3.6 5.4 8l4.4 4.4" }) });
}
var AFFORDANCE_PROBE_MS = 800;
var lastAffordanceWarn = "";
function checkNewSessionAffordances() {
  if (findNewSessionControls(document).length > 0) {
    lastAffordanceWarn = "";
    return;
  }
  const signature = describeAffordances();
  if (lastAffordanceWarn === signature) return;
  lastAffordanceWarn = signature;
  console.warn(
    "[chat-a2ui] \u9875\u9762\u4E0A\u627E\u4E0D\u5230\u5BBF\u4E3B\u7684\u65B0\u5EFA\u4F1A\u8BDD\u63A7\u4EF6\uFF0C\u6355\u83B7\u9636\u6BB5\u7684\u62E6\u622A\u53EF\u80FD\u5DF2\u5931\u6548\u3002\u5F53\u524D\u5224\u636E\uFF1A" + signature + "\u3002\u5BBF\u4E3B UI \u53EF\u80FD\u5DF2\u6539\uFF0C\u8BF7\u66F4\u65B0 src/client/chat-mode/host-affordance.ts\u3002\uFF08\u4FA7\u680F\u88AB\u6536\u8D77\uFF0C\u6216\u5F53\u524D\u8BBF\u95EE\u5FEB\u7167\u4E0D\u542B session/create \u65F6\uFF0C\u8FD9\u6761\u544A\u8B66\u5C5E\u6B63\u5E38\u3002\uFF09"
  );
}
function ChatWorkspace({
  sessionId,
  controller,
  useSession,
  useSessions,
  renderFactorySlot
}) {
  useChatStyles();
  const session = useSession((value) => value);
  const title = useSessions((state2) => state2.byId[sessionId]?.displayTitle);
  const [trajectoryOpen, setTrajectoryOpen] = (0, import_react39.useState)(false);
  const motionLevel = useMotionLevel();
  const animated = motionLevel === "full";
  const motionAttrs = useMotionAttribute();
  const toggleTrajectory = (0, import_react39.useCallback)(() => {
    setTrajectoryOpen((open) => !open);
  }, []);
  (0, import_react39.useEffect)(() => {
    probeLog("session", { id: sessionId.slice(0, 12) });
  }, [sessionId]);
  (0, import_react39.useEffect)(() => {
    const onClick = (event) => {
      if (!isNewSessionControl(event.target)) return;
      event.preventDefault();
      event.stopPropagation();
      void controller.enterNew();
    };
    const onKeyDown = (event) => {
      if (!isNewSessionShortcut(event)) return;
      event.preventDefault();
      event.stopPropagation();
      void controller.enterNew();
    };
    document.addEventListener("click", onClick, true);
    window.addEventListener("keydown", onKeyDown, true);
    return () => {
      document.removeEventListener("click", onClick, true);
      window.removeEventListener("keydown", onKeyDown, true);
    };
  }, [controller]);
  (0, import_react39.useEffect)(() => {
    const timer = window.setTimeout(checkNewSessionAffordances, AFFORDANCE_PROBE_MS);
    return () => {
      window.clearTimeout(timer);
    };
  }, []);
  const shownTitle = typeof title === "string" && title.trim().length > 0 ? title.trim() : "\u65B0\u5BF9\u8BDD";
  const running = session.running === true;
  return /* @__PURE__ */ (0, import_jsx_runtime22.jsxs)(
    "div",
    {
      className: cx(cls.chatModeWorkspace, session.blank === true && cls.chatModeBlank),
      "data-chat-panel": CHAT_PANEL_ID,
      "data-chat-workspace": "",
      ...motionAttrs,
      children: [
        /* @__PURE__ */ (0, import_jsx_runtime22.jsxs)("header", { className: cls.chatModeHeader, "data-chat-mode-header": "", children: [
          /* @__PURE__ */ (0, import_jsx_runtime22.jsxs)("div", { className: cls.chatModeHeaderMain, children: [
            /* @__PURE__ */ (0, import_jsx_runtime22.jsx)(
              "button",
              {
                type: "button",
                className: cls.chatModeIconButton,
                "aria-label": "\u8FD4\u56DE\u666E\u901A\u5BF9\u8BDD",
                title: "\u8FD4\u56DE\u666E\u901A\u5BF9\u8BDD",
                onClick: () => {
                  controller.back();
                },
                children: /* @__PURE__ */ (0, import_jsx_runtime22.jsx)(BackGlyph, {})
              }
            ),
            /* @__PURE__ */ (0, import_jsx_runtime22.jsxs)("div", { className: cls.chatModeTitleBlock, children: [
              /* @__PURE__ */ (0, import_jsx_runtime22.jsxs)("div", { className: cls.chatModeTitle, children: [
                running && /* @__PURE__ */ (0, import_jsx_runtime22.jsx)("span", { className: cls.liveDot, "aria-label": "\u6B63\u5728\u751F\u6210" }),
                /* @__PURE__ */ (0, import_jsx_runtime22.jsx)("span", { children: shownTitle })
              ] }),
              /* @__PURE__ */ (0, import_jsx_runtime22.jsx)("div", { className: cls.chatModeSubtitle, children: running && animated ? /* @__PURE__ */ (0, import_jsx_runtime22.jsx)("span", { "aria-label": "\u6B63\u5728\u751F\u6210\u2026", children: /* @__PURE__ */ (0, import_jsx_runtime22.jsx)(TextShimmerWave, { as: "span", className: cls.chatModeShimmer, "aria-hidden": "true", ...MOTION.shimmer, children: "\u6B63\u5728\u751F\u6210\u2026" }) }) : running ? "\u6B63\u5728\u751F\u6210\u2026" : "Chat \u6A21\u5F0F" })
            ] })
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime22.jsxs)("div", { className: cls.chatModeHeaderActions, children: [
            /* @__PURE__ */ (0, import_jsx_runtime22.jsxs)(
              "button",
              {
                type: "button",
                className: cx(cls.chatModeToolbarButton, cls.chatModeToolbarPrimary),
                "aria-label": "\u65B0\u5BF9\u8BDD",
                title: "\u65B0\u5BF9\u8BDD",
                onClick: () => {
                  void controller.enterNew();
                },
                children: [
                  /* @__PURE__ */ (0, import_jsx_runtime22.jsx)("span", { className: cls.chatModeNewGlyph, "aria-hidden": "true", children: "\uFF0B" }),
                  /* @__PURE__ */ (0, import_jsx_runtime22.jsx)("span", { className: cls.chatModeToolbarLabel, children: "\u65B0\u5BF9\u8BDD" })
                ]
              }
            ),
            /* @__PURE__ */ (0, import_jsx_runtime22.jsxs)(
              "button",
              {
                type: "button",
                className: cx(cls.chatModeToolbarButton, trajectoryOpen && cls.chatModeToolbarActive),
                "aria-label": trajectoryOpen ? "\u6536\u8D77\u8F68\u8FF9" : "\u6253\u5F00\u8F68\u8FF9",
                "aria-pressed": trajectoryOpen,
                title: "\u8F68\u8FF9",
                onClick: toggleTrajectory,
                children: [
                  /* @__PURE__ */ (0, import_jsx_runtime22.jsx)(PanelGlyph, { open: trajectoryOpen }),
                  /* @__PURE__ */ (0, import_jsx_runtime22.jsx)("span", { className: cls.chatModeToolbarLabel, children: "\u8F68\u8FF9" })
                ]
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime22.jsxs)("div", { className: cls.chatModeBody, children: [
          /* @__PURE__ */ (0, import_jsx_runtime22.jsxs)("div", { className: cls.chatModeMain, children: [
            /* @__PURE__ */ (0, import_jsx_runtime22.jsx)(ChatInnerScrollContext.Provider, { value: true, children: renderFactorySlot("conversation.content", { variant: "main", phase: "active", hero: false }, {
              slots: { views: FixedChatModeView }
            }) }),
            session.blank === true && /* @__PURE__ */ (0, import_jsx_runtime22.jsxs)("div", { className: cls.chatModeBlankState, "aria-hidden": "true", children: [
              /* @__PURE__ */ (0, import_jsx_runtime22.jsx)("div", { className: cls.chatModeBlankOrb }),
              /* @__PURE__ */ (0, import_jsx_runtime22.jsx)("div", { className: cls.chatModeBlankTitle, children: /* @__PURE__ */ (0, import_jsx_runtime22.jsx)(TextEffect, { as: "div", ...MOTION.textEffect.blankTitle, trigger: animated, children: "\u5F00\u59CB\u804A\u5929" }) }),
              /* @__PURE__ */ (0, import_jsx_runtime22.jsx)("div", { className: cls.chatModeBlankHint, children: "\u7EAF\u5BF9\u8BDD\u6A21\u5F0F\uFF1A\u53EA\u804A\u5929\u548C\u67E5\u8D44\u6599\uFF0C\u4E0D\u5199\u6587\u4EF6\u3001\u4E0D\u8DD1\u547D\u4EE4\u3002" }),
              /* @__PURE__ */ (0, import_jsx_runtime22.jsx)("div", { className: cls.chatModeBlankHint, children: "\u8F93\u5165\u6846\u5DF2\u5C31\u7EEA\uFF0C\u968F\u65F6\u53EF\u4EE5\u5F00\u59CB\u3002" })
            ] })
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime22.jsx)(AnimatePresence, { initial: false, children: trajectoryOpen && /* @__PURE__ */ (0, import_jsx_runtime22.jsx)(
            motion.aside,
            {
              className: cls.chatModeDock,
              "aria-label": "\u8F68\u8FF9",
              initial: animated ? { width: 0, opacity: 0 } : false,
              animate: { width: 360, opacity: 1 },
              exit: animated ? { width: 0, opacity: 0 } : { opacity: 0, width: 0 },
              transition: animated ? layoutSpring : { duration: 0 },
              children: /* @__PURE__ */ (0, import_jsx_runtime22.jsxs)("div", { className: cls.chatModeDockInner, children: [
                /* @__PURE__ */ (0, import_jsx_runtime22.jsxs)("div", { className: cls.chatModeDockHead, children: [
                  /* @__PURE__ */ (0, import_jsx_runtime22.jsx)("span", { className: cls.chatModeDockTitle, children: "\u8F68\u8FF9" }),
                  /* @__PURE__ */ (0, import_jsx_runtime22.jsx)(
                    "button",
                    {
                      type: "button",
                      className: cls.chatModeIconButton,
                      "aria-label": "\u6536\u8D77\u8F68\u8FF9",
                      title: "\u6536\u8D77\u8F68\u8FF9",
                      onClick: toggleTrajectory,
                      children: /* @__PURE__ */ (0, import_jsx_runtime22.jsx)("svg", { viewBox: "0 0 16 16", width: "14", height: "14", fill: "none", stroke: "currentColor", strokeWidth: "1.6", strokeLinecap: "round", "aria-hidden": "true", children: /* @__PURE__ */ (0, import_jsx_runtime22.jsx)("path", { d: "m4 4 8 8M12 4l-8 8" }) })
                    }
                  )
                ] }),
                /* @__PURE__ */ (0, import_jsx_runtime22.jsx)("div", { className: cls.chatModeDockBody, children: /* @__PURE__ */ (0, import_jsx_runtime22.jsx)("div", { className: cls.chatModeDockConversation, children: renderFactorySlot("conversation.content", { variant: "embedded", phase: "active", hero: false }, {
                  slots: { views: FixedTrajectoryView }
                }) }) })
              ] })
            },
            "trajectory"
          ) })
        ] })
      ]
    }
  );
}

// src/client/session/actions.ts
function resolvePresetId(deps) {
  return deps.presetId ?? CHAT_PRESET_ID;
}
function isSessionId(value) {
  return typeof value === "string" && value.length > 0;
}
async function createChatSession(deps, _parentSessionId) {
  const { sessions } = deps;
  const options2 = { agentPreset: resolvePresetId(deps) };
  const workspaceId = deps.chatWorkspaceId?.();
  if (workspaceId !== void 0) options2.workspaceId = workspaceId;
  let created;
  try {
    created = await sessions.create(options2);
  } catch (error) {
    console.warn("[chat-a2ui] \u65B0\u5EFA\u5BF9\u8BDD\u5931\u8D25\uFF1A", error);
    return void 0;
  }
  if (!isSessionId(created)) {
    console.warn("[chat-a2ui] \u65B0\u5EFA\u5BF9\u8BDD\u5931\u8D25\uFF1A\u5BBF\u4E3B\u6CA1\u6709\u8FD4\u56DE\u4F1A\u8BDD id");
    return void 0;
  }
  return created;
}
async function forkChatAt(deps, sessionId, seq) {
  let child;
  try {
    child = await deps.sessions.fork({ sessionId, atSeq: seq, increaseTitle: true });
  } catch (error) {
    console.warn("[chat-a2ui] \u4ECE\u8BE5\u8F6E\u5206\u652F\u5931\u8D25\uFF1A", error);
    return void 0;
  }
  if (!isSessionId(child)) {
    console.warn("[chat-a2ui] \u4ECE\u8BE5\u8F6E\u5206\u652F\u5931\u8D25\uFF1A\u5BBF\u4E3B\u6CA1\u6709\u8FD4\u56DE\u4F1A\u8BDD id");
    return void 0;
  }
  return child;
}

// src/client/chat-mode/select.ts
function timestampOf(row) {
  return typeof row.updatedAt === "number" && Number.isFinite(row.updatedAt) ? row.updatedAt : 0;
}
function titleOf(row) {
  const title = row.displayTitle ?? row.title;
  return typeof title === "string" && title.trim().length > 0 ? title.trim() : "\u672A\u547D\u540D\u5BF9\u8BDD";
}
function listChatSessions(snapshot, presetId = CHAT_PRESET_ID) {
  const rows = [];
  snapshot.ids.forEach((id3, order) => {
    const row = snapshot.byId[id3];
    if (row === void 0) return;
    if (row.projectionValues?.agentPreset !== presetId) return;
    rows.push({
      id: id3,
      title: titleOf(row),
      updatedAt: timestampOf(row),
      running: row.running === true,
      blank: row.blank === true,
      order
    });
  });
  rows.sort((left, right) => {
    if (left.updatedAt !== right.updatedAt) return right.updatedAt - left.updatedAt;
    return left.order - right.order;
  });
  return rows.map(({ order: _order, ...row }) => row);
}
function pickChatSession(rows, currentId) {
  if (typeof currentId === "string" && rows.some((row) => row.id === currentId)) return currentId;
  return rows[0]?.id;
}

// src/client/chat-mode/controller.ts
var INITIAL_STATE = {
  mounted: false,
  activeSessionId: null,
  phase: "idle",
  error: null,
  pendingNew: false
};
function readSnapshot(sessions) {
  try {
    return sessions.list.getSnapshot();
  } catch (error) {
    console.warn("[chat-a2ui] \u8BFB\u53D6\u4F1A\u8BDD\u5FEB\u7167\u5931\u8D25\uFF1A", error);
    return null;
  }
}
var ChatModeController = class {
  deps;
  state = INITIAL_STATE;
  listeners = /* @__PURE__ */ new Set();
  mounted = false;
  generation = 0;
  creating = null;
  pendingNewPromise = null;
  resolvePendingNew = null;
  /**
   * 本控制器自己创建过的会话 id（有上限）。
   *
   * 空会话在宿主里可能**还没有** agentPreset 投影，于是 listChatSessions 过滤后看不到它。
   * 如果 ensureActive 只认过滤后的列表，那么每次切回 Chat 面板都会以为「一个都没有」
   * 而再建一个空会话——这就是「反复自动创建空对话」。所以自动路径必须同时认
   * 「宿主快照里还在」和「我们自己刚建过」这两种事实。
   */
  createdIds = /* @__PURE__ */ new Set();
  constructor(deps) {
    this.deps = deps;
  }
  /** Stable snapshot reader for useSyncExternalStore. */
  getSnapshot = () => this.state;
  /** Stable subscriber for useSyncExternalStore. */
  subscribe = (listener) => {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  };
  /** Replace one or more state fields and notify every reader. */
  setState(patch) {
    this.state = { ...this.state, ...patch };
    for (const listener of this.listeners) listener();
  }
  /** Resolve a pending enterNew() call once the panel has created or failed. */
  finishPending(value) {
    const resolve2 = this.resolvePendingNew;
    this.resolvePendingNew = null;
    this.pendingNewPromise = null;
    resolve2?.(value);
  }
  /** Mount the page: install the list, pick a Chat Session, create one if needed. */
  mount() {
    if (this.mounted) return;
    this.mounted = true;
    this.generation += 1;
    const generation = this.generation;
    this.setState({ mounted: true, phase: "opening", error: null });
    void this.ensureActive(generation);
  }
  /** Withdraw the page-owned sidebar occupant but keep the last selection. */
  unmount() {
    if (!this.mounted) return;
    this.mounted = false;
    this.generation += 1;
    this.finishPending(void 0);
    this.setState({ mounted: false, phase: "idle", error: null, pendingNew: false });
  }
  /** Pick the stored active Session, the newest Chat Session, or create one. */
  async ensureActive(generation) {
    const snapshot = readSnapshot(this.deps.sessions);
    const rows = snapshot === null ? [] : listChatSessions(snapshot);
    if (!this.mounted || generation !== this.generation) return;
    if (this.state.pendingNew) {
      await this.createNew(void 0, generation);
      return;
    }
    const currentId = this.state.activeSessionId;
    const stillKnown = currentId !== null && (this.createdIds.has(currentId) || snapshot?.byId[currentId] !== void 0);
    if (stillKnown) {
      this.setState({ activeSessionId: currentId, phase: "ready", error: null });
      return;
    }
    const target = pickChatSession(rows, currentId);
    if (target !== void 0) {
      this.setState({ activeSessionId: target, phase: "ready", error: null });
      return;
    }
    await this.createNew(void 0, generation);
  }
  /**
   * Create a Chat Session and make it active.
   * Repeated calls share the in-flight creation so double clicks cannot create
   * two Sessions.
   */
  async createNew(parentSessionId, generation = this.generation) {
    if (this.creating !== null) return this.creating;
    const run = this.createNewRun(parentSessionId, generation);
    this.creating = run;
    try {
      return await run;
    } finally {
      if (this.creating === run) this.creating = null;
    }
  }
  /** 记一个自己建过的会话：自动路径靠它避免重复创建（只留最近 50 个）。 */
  rememberCreated(sessionId) {
    this.createdIds.add(sessionId);
    if (this.createdIds.size > 50) {
      const oldest = this.createdIds.values().next().value;
      if (oldest !== void 0) this.createdIds.delete(oldest);
    }
  }
  /** Actual creation body, split out so createNew can own the in-flight promise. */
  async createNewRun(parentSessionId, generation) {
    this.setState({ phase: "opening", error: null });
    try {
      await this.deps.ensureChatWorkspace?.();
    } catch (error) {
      console.warn("[chat-a2ui] \u51C6\u5907 Chat \u5DE5\u4F5C\u533A\u5931\u8D25\uFF1A", error);
    }
    const created = await createChatSession({
      sessions: this.deps.sessions,
      workspaces: this.deps.workspaces,
      chatWorkspaceId: this.deps.chatWorkspaceId
    }, parentSessionId);
    const current = this.mounted && generation === this.generation;
    if (created !== void 0) {
      this.rememberCreated(created);
      this.setState({
        activeSessionId: created,
        phase: current ? "ready" : "idle",
        error: null,
        pendingNew: false
      });
    } else {
      this.setState(current ? { phase: "error", error: "\u65B0\u5EFA\u5BF9\u8BDD\u5931\u8D25\uFF0C\u8BF7\u91CD\u8BD5", pendingNew: false } : { phase: "idle", pendingNew: false });
    }
    this.finishPending(created);
    return created;
  }
  /**
   * New-chat action shared by the Chat header, the native header button, and
   * the sidebar's new-session intercept. When Chat is not open yet it asks
   * the layout to open the panel and resolves after the page creates the
   * Session, so callers can still report failures.
   */
  enterNew() {
    if (this.creating !== null) return this.creating;
    if (this.mounted) return this.createNew(this.state.activeSessionId ?? void 0);
    if (this.pendingNewPromise !== null) return this.pendingNewPromise;
    this.pendingNewPromise = new Promise((resolve2) => {
      this.resolvePendingNew = resolve2;
    });
    this.setState({ pendingNew: true, error: null });
    this.deps.layout.selectPanel(CHAT_PANEL_ID);
    return this.pendingNewPromise;
  }
  /** Activate a Session without touching the native mainView or panel. */
  openSession(sessionId) {
    if (sessionId.length === 0) return;
    this.setState({ activeSessionId: sessionId, phase: "ready", error: null });
  }
  /** Fork a completed turn and activate the child. */
  async branch(sessionId, seq) {
    const child = await forkChatAt({ sessions: this.deps.sessions }, sessionId, seq);
    if (child === void 0) return void 0;
    this.setState({ activeSessionId: child, phase: "ready", error: null });
    if (!this.mounted) this.deps.layout.selectPanel(CHAT_PANEL_ID);
    return child;
  }
  /** Retry after a creation error. */
  retry() {
    if (!this.mounted) {
      this.mount();
      return Promise.resolve(void 0);
    }
    return this.createNew(this.state.activeSessionId ?? void 0);
  }
  /** Return to the native conversation panel. */
  back() {
    this.deps.layout.selectPanel(null);
  }
};

// src/client/chat-mode/chat-workspace.ts
var CHAT_PATHS_GLOBAL = "__DSH_CHAT_A2UI_PATHS__";
function readInjectedChatPaths(scope = globalThis) {
  if (typeof scope !== "object" || scope === null) return {};
  const raw = scope[CHAT_PATHS_GLOBAL];
  if (typeof raw !== "object" || raw === null) return {};
  const value = raw.chatWorkspace;
  return typeof value === "string" && value.length > 0 ? { chatWorkspace: value } : {};
}
function normalizeWorkspacePath(path) {
  const unified = path.replace(/\\/g, "/").replace(/\/+$/, "");
  return /^[A-Za-z]:/.test(unified) ? unified.toLowerCase() : unified;
}
async function ensureChatWorkspace(workspaces, path) {
  if (typeof path !== "string" || path.length === 0) return void 0;
  const wanted = normalizeWorkspacePath(path);
  try {
    const items = workspaces.list.getSnapshot().items;
    const existing = items.find((item) => typeof item.path === "string" && normalizeWorkspacePath(item.path) === wanted);
    if (existing !== void 0) return existing.workspaceId;
  } catch (error) {
    console.warn("[chat-a2ui] \u8BFB\u53D6\u5DE5\u4F5C\u533A\u5217\u8868\u5931\u8D25\uFF1A", error);
    return void 0;
  }
  if (typeof workspaces.create !== "function") return void 0;
  try {
    const created = await workspaces.create({ path });
    return created.workspaceId;
  } catch (error) {
    console.warn("[chat-a2ui] \u6CE8\u518C Chat \u5DE5\u4F5C\u533A\u5931\u8D25\uFF1A", error);
    return void 0;
  }
}

// src/client/session/NewChatButton.tsx
var import_react40 = require("react");
var import_jsx_runtime23 = require("react/jsx-runtime");
var FAILURE_TEXT = "\u65B0\u5EFA\u5BF9\u8BDD\u5931\u8D25\uFF0C\u8BF7\u91CD\u8BD5";
function NewChatButton({ sessionId, createChat }) {
  useChatStyles();
  const [pending, setPending] = (0, import_react40.useState)(false);
  const [error, setError] = (0, import_react40.useState)(null);
  const handleClick = (0, import_react40.useCallback)(() => {
    if (pending) return;
    setPending(true);
    setError(null);
    void (async () => {
      try {
        const created = await createChat();
        if (created === void 0) setError(FAILURE_TEXT);
      } catch (cause) {
        console.warn("[chat-a2ui] \u65B0\u5BF9\u8BDD\u5931\u8D25\uFF1A", cause);
        setError(FAILURE_TEXT);
      } finally {
        setPending(false);
      }
    })();
  }, [createChat, pending]);
  return /* @__PURE__ */ (0, import_jsx_runtime23.jsxs)("div", { className: cls.newChat, "data-session-id": sessionId, children: [
    /* @__PURE__ */ (0, import_jsx_runtime23.jsxs)(
      "button",
      {
        type: "button",
        className: cls.newChatButton,
        title: "\u65B0\u5EFA\u5BF9\u8BDD\u5E76\u5207\u6362\u5230 Chat \u89C6\u56FE",
        "aria-label": "\u65B0\u5BF9\u8BDD",
        "aria-busy": pending,
        disabled: pending,
        onClick: handleClick,
        children: [
          pending ? (
            // 复用 classes.ts 里已登记的旋转指示器样式，不新增未定义的 class。
            /* @__PURE__ */ (0, import_jsx_runtime23.jsx)("span", { className: cx(cls.newChatIcon, cls.reasoningSpinner), "aria-hidden": "true" })
          ) : /* @__PURE__ */ (0, import_jsx_runtime23.jsx)("span", { className: cls.newChatIcon, "aria-hidden": "true", children: /* @__PURE__ */ (0, import_jsx_runtime23.jsx)(
            "svg",
            {
              viewBox: "0 0 16 16",
              width: "14",
              height: "14",
              fill: "none",
              stroke: "currentColor",
              strokeWidth: "1.6",
              strokeLinecap: "round",
              role: "presentation",
              focusable: "false",
              children: /* @__PURE__ */ (0, import_jsx_runtime23.jsx)("path", { d: "M8 3.2v9.6M3.2 8h9.6" })
            }
          ) }),
          /* @__PURE__ */ (0, import_jsx_runtime23.jsx)("span", { children: "\u65B0\u5BF9\u8BDD" })
        ]
      }
    ),
    /* @__PURE__ */ (0, import_jsx_runtime23.jsx)("span", { className: cls.newChatError, "aria-live": "polite", children: error ?? "" })
  ] });
}

// src/client/index.tsx
var inject = [
  "slots",
  "sessions",
  "workspaces",
  "layout",
  "uiConversation",
  "uiWorkspace"
];
function imageUrl(ctx, sessionId, attachment) {
  return ctx.uiConversation.imageUrl(sessionId, attachment);
}
function apply3(ctx) {
  const injected = readInjectedChatPaths();
  let chatWorkspaceId;
  let ensuring = null;
  const ensure = async () => {
    if (chatWorkspaceId !== void 0) return;
    if (ensuring === null) ensuring = ensureChatWorkspace(ctx.workspaces, injected.chatWorkspace);
    const id3 = await ensuring;
    ensuring = null;
    if (id3 !== void 0) chatWorkspaceId = id3;
  };
  const controller = new ChatModeController({
    sessions: ctx.sessions,
    workspaces: ctx.workspaces,
    layout: ctx.layout,
    ensureChatWorkspace: ensure,
    chatWorkspaceId: () => chatWorkspaceId
  });
  const branchFromView = (sessionId, seq) => {
    const state2 = controller.getSnapshot();
    if (state2.mounted && state2.activeSessionId === sessionId) {
      void controller.branch(sessionId, seq);
      return;
    }
    void forkChatAt({ sessions: ctx.sessions }, sessionId, seq).then((child) => {
      if (child !== void 0) ctx.uiWorkspace.openSession(child);
    }).catch((error) => {
      console.warn("[chat-a2ui] \u5206\u652F\u5931\u8D25\uFF1A", error);
    });
  };
  ctx.slots.inject("main", () => {
    const disposePanel = ctx.slots.register({
      name: "main",
      key: CHAT_PANEL_ID,
      children: {
        "chat-a2ui.conversation": { kind: "single", scope: "session" }
      },
      inject: () => ({ controller, sessions: ctx.sessions })
    }, ChatPage);
    const disposeBody = ctx.slots.register({
      name: "chat-a2ui.conversation",
      inject: () => ({ controller })
    }, ChatWorkspace);
    return () => {
      disposeBody();
      disposePanel();
    };
  });
  ctx.slots.inject("sidebar.panellist", () => ctx.slots.register({
    name: "sidebar.panellist",
    id: CHAT_PANEL_ID,
    order: 5,
    label: () => CHAT_PANEL_LABEL
  }, ChatPanelIcon));
  ctx.slots.inject("conversation.view", () => ctx.slots.register({
    name: "conversation.view",
    id: CHAT_VIEW_ID,
    order: 1,
    label: CHAT_VIEW_LABEL,
    inject: (sessionId) => ({
      loadImage: (attachment) => imageUrl(ctx, sessionId, attachment),
      forkAt: (seq) => {
        branchFromView(sessionId, seq);
      }
    })
  }, ChatA2UIView));
  ctx.slots.inject("conversation.session.header.actions", () => ctx.slots.register({
    name: "conversation.session.header.actions",
    id: "chat-a2ui-new",
    order: 20,
    inject: () => ({
      createChat: () => controller.enterNew()
    })
  }, NewChatButton));
}
return module.exports; } });
