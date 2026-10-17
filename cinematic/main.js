// Compiled from creative/src/main.tsx — see creative/src for TypeScript source.
import { jsx as _jsx } from "react/jsx-runtime";
import React from 'react';
import { createRoot } from 'react-dom/client';
import Portal from './Portal.js';
const node = document.getElementById('cinematic-root');
if (node)
    createRoot(node).render(_jsx(React.StrictMode, { children: _jsx(Portal, {}) }));
