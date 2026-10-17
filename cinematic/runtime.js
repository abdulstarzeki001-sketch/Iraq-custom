// Load the optional React experience independently of the legacy business logic.
// If external modules are blocked, the original forms and financial logic remain usable.
import('./main.js').catch((err)=>{console.warn('Cinematic layer unavailable; operational pages remain usable.',err);document.documentElement.classList.add('cc-fallback');});
