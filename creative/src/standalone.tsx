import './tailwind.css';
import React from 'react';
import {createRoot} from 'react-dom/client';
import Portal from './Portal';
document.body.classList.add('cc-redesigned','cc-page-home');
const el=document.getElementById('cinematic-root');
if(el) createRoot(el).render(<React.StrictMode><Portal/></React.StrictMode>);
