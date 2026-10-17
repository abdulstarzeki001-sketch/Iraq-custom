import React from 'react';
import {createRoot} from 'react-dom/client';
import Portal from './Portal.js';
const node=document.getElementById('cinematic-root');
if(node)createRoot(node).render(<React.StrictMode><Portal/></React.StrictMode>);
