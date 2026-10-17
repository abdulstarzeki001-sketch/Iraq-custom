// Compiled from creative/src/Portal.tsx — see creative/src for TypeScript source.
import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import React, { useEffect, useRef, useState, Suspense, lazy } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'motion/react';
const Scene = lazy(() => import('./scene.js'));
const PAGES = [
    { key: 'home', href: '/', name: 'الرئيسية', short: 'الرئيسية', icon: '◈', en: 'PORTAL' },
    { key: 'form', href: '/form.html', name: 'إنشاء وثيقة', short: 'وثيقة جديدة', icon: '✦', en: 'CREATE' },
    { key: 'traders', href: '/traders.html', name: 'التجار والحسابات', short: 'الحسابات', icon: '▦', en: 'LEDGER' },
    { key: 'document', href: '/document', name: 'معاينة الوثيقة', short: 'المعاينة', icon: '▤', en: 'DOCUMENT' }
];
const pageFromPath = () => {
    const p = location.pathname.toLowerCase();
    if (p.includes('document'))
        return 'document';
    if (p.includes('traders'))
        return 'traders';
    if (p.includes('form'))
        return 'form';
    return 'home';
};
function Icon({ name }) {
    if (name === 'arrow')
        return _jsx("svg", { width: "17", height: "17", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "1.7", children: _jsx("path", { d: "M17 7 7 17M7 7h10v10" }) });
    if (name === 'spark')
        return _jsx("svg", { width: "18", height: "18", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "1.7", children: _jsx("path", { d: "m12 2 2.4 7.6L22 12l-7.6 2.4L12 22l-2.4-7.6L2 12l7.6-2.4L12 2Z" }) });
    if (name === 'menu')
        return _jsx("svg", { width: "22", height: "22", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "1.8", children: _jsx("path", { d: "M4 7h16M4 12h16M4 17h16" }) });
    return _jsx("svg", { width: "18", height: "18", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "1.8", children: _jsx("path", { d: "m5 12 5 5L20 7" }) });
}
function Reveal({ children, delay = 0, className = '' }) {
    const reduce = useReducedMotion();
    return _jsx(motion.div, { className: className, initial: reduce ? false : { opacity: 0, y: 25 }, animate: { opacity: 1, y: 0 }, transition: { duration: reduce ? 0 : 0.78, delay, ease: [0.22, 1, 0.36, 1] }, children: children });
}
function OrbitalFallback() { return _jsxs("div", { className: "cc-orbital", "aria-hidden": "true", children: [_jsx("div", { className: "cc-orbital-grid" }), _jsx("div", { className: "cc-orbit cc-orbit-a" }), _jsx("div", { className: "cc-orbit cc-orbit-b" }), _jsx("div", { className: "cc-orbit cc-orbit-c" }), _jsxs("div", { className: "cc-globe", children: [_jsx("div", { className: "cc-globe-glow" }), _jsx("span", { children: "IQ" }), _jsx("small", { children: "CUSTOMS \u00B7 SYSTEM" })] }), _jsx("i", { className: "cc-node cc-node-a" }), _jsx("i", { className: "cc-node cc-node-b" }), _jsx("i", { className: "cc-node cc-node-c" })] }); }
function ImmersiveVisual() {
    const [renderScene, setScene] = useState(false);
    const [requested, setRequested] = useState(false);
    const reduce = useReducedMotion();
    useEffect(() => { const on = () => { if (!reduce && window.innerWidth >= 1000 && !navigator.connection?.saveData)
        setScene(true); }; on(); const m = window.matchMedia('(min-width:1000px)'); m.addEventListener?.('change', on); return () => m.removeEventListener?.('change', on); }, [reduce]);
    return _jsxs("div", { className: "cc-visual", "aria-label": "\u0645\u0634\u0647\u062F \u0645\u062F\u0627\u0631\u064A \u062A\u0641\u0627\u0639\u0644\u064A \u062B\u0644\u0627\u062B\u064A \u0627\u0644\u0623\u0628\u0639\u0627\u062F", children: [_jsx(OrbitalFallback, {}), (renderScene || requested) && _jsx(Suspense, { fallback: null, children: _jsx(Scene, {}) }), _jsxs("button", { className: "cc-visual-control", type: "button", onClick: () => { setRequested(x => !x); setScene(x => !x); }, children: [renderScene || requested ? 'إيقاف المشهد ثلاثي الأبعاد' : 'تفعيل تجربة 3D', " ", _jsx("span", { "aria-hidden": "true", children: "\u2727" })] }), _jsx("span", { className: "cc-visual-caption", children: "INTERACTIVE / ORBITAL INTERFACE" })] });
}
function Header({ active }) {
    const [menu, setMenu] = useState(false);
    return _jsxs("header", { className: "cc-header", dir: "rtl", children: [_jsxs("div", { className: "cc-header-inner", children: [_jsxs("a", { className: "cc-brand", href: "/", "aria-label": "\u0627\u0644\u0639\u0648\u062F\u0629 \u0644\u0644\u0631\u0626\u064A\u0633\u064A\u0629", children: [_jsx("span", { className: "cc-brand-symbol", children: _jsx("span", { children: "\u2733" }) }), _jsxs("span", { className: "cc-brand-words", children: [_jsxs("b", { children: ["IRAQ ", _jsx("em", { children: "CUSTOMS" })] }), _jsx("small", { children: "\u0646\u0638\u0627\u0645 \u0625\u062F\u0627\u0631\u0629 \u0627\u0644\u0648\u062B\u0627\u0626\u0642 \u0648\u0627\u0644\u0634\u062D\u0646\u0627\u062A" })] })] }), _jsx("nav", { className: "cc-desktop-nav", "aria-label": "\u0627\u0644\u062A\u0646\u0642\u0644 \u0627\u0644\u0631\u0626\u064A\u0633\u064A", children: PAGES.map(p => _jsx("a", { href: p.href, className: active === p.key ? 'cc-nav-active' : '', "aria-current": active === p.key ? 'page' : undefined, children: p.name }, p.key)) }), _jsxs("div", { className: "cc-header-actions", children: [_jsxs("span", { className: "cc-live-dot", children: [_jsx("i", {}), "\u0648\u0627\u062C\u0647\u0629 \u062A\u0634\u063A\u064A\u0644"] }), _jsx("button", { type: "button", "aria-label": "\u0641\u062A\u062D \u0627\u0644\u0642\u0627\u0626\u0645\u0629", "aria-expanded": menu, className: "cc-menu-button", onClick: () => setMenu(v => !v), children: _jsx(Icon, { name: "menu" }) }), _jsxs("a", { className: "cc-header-cta", href: "/form.html", children: ["\u0625\u0646\u0634\u0627\u0621 \u0648\u062B\u064A\u0642\u0629 ", _jsx(Icon, { name: "arrow" })] })] })] }), _jsx(AnimatePresence, { children: menu && _jsx(motion.nav, { className: "cc-mobile-menu", initial: { opacity: 0, height: 0 }, animate: { opacity: 1, height: 'auto' }, exit: { opacity: 0, height: 0 }, children: PAGES.map(p => _jsxs("a", { href: p.href, children: [p.name, _jsx("span", { children: p.en })] }, p.key)) }) })] });
}
function HomeHero() {
    return _jsxs(_Fragment, { children: [_jsxs("section", { className: "cc-hero", "aria-labelledby": "cc-main-title", children: [_jsxs("div", { className: "cc-hero-copy", children: [_jsx(Reveal, { children: _jsxs("div", { className: "cc-eyebrow", children: [_jsx("span", { className: "cc-eyebrow-line" }), " DIGITAL OPERATIONS / IRAQ 2026"] }) }), _jsx(Reveal, { delay: 0.12, children: _jsxs("h1", { id: "cc-main-title", children: ["\u0625\u062F\u0627\u0631\u0629 \u0627\u0644\u062C\u0645\u0627\u0631\u0643\u060C", _jsx("br", {}), _jsx("span", { children: "\u0628\u0631\u0624\u064A\u0629\u064D \u062C\u062F\u064A\u062F\u0629." })] }) }), _jsx(Reveal, { delay: 0.22, children: _jsx("p", { className: "cc-hero-description", children: "\u0645\u0633\u0627\u062D\u0629 \u0639\u0645\u0644 \u0630\u0643\u064A\u0629 \u0644\u0625\u062F\u0627\u0631\u0629 \u0628\u064A\u0627\u0646\u0627\u062A \u0627\u0644\u0634\u0631\u0643\u0627\u062A\u060C \u062A\u062C\u0647\u064A\u0632 \u0648\u062B\u0627\u0626\u0642 \u0627\u0644\u0634\u062D\u0646\u0627\u062A\u060C \u0648\u0645\u0631\u0627\u062C\u0639\u0629 \u0643\u0634\u0648\u0641 \u0627\u0644\u062D\u0633\u0627\u0628\u0627\u062A. \u0648\u0627\u062C\u0647\u0629 \u0648\u0627\u062D\u062F\u0629\u060C \u062A\u0641\u0627\u0635\u064A\u0644 \u062F\u0642\u064A\u0642\u0629\u060C \u0648\u062A\u0646\u0642\u0651\u0644 \u0628\u0644\u0627 \u062A\u0639\u0642\u064A\u062F." }) }), _jsx(Reveal, { delay: 0.3, children: _jsxs("div", { className: "cc-hero-actions", children: [_jsxs("a", { className: "cc-primary-btn", href: "#companySearchGate", children: [_jsx("span", { children: "\u0627\u0628\u062F\u0623 \u0627\u0644\u0628\u062D\u062B \u0639\u0646 \u0634\u0631\u0643\u0629" }), _jsx(Icon, { name: "arrow" })] }), _jsxs("a", { className: "cc-secondary-btn", href: "/form.html", children: ["\u0625\u0646\u0634\u0627\u0621 \u0648\u062B\u064A\u0642\u0629 ", _jsx("span", { children: "\u2197" })] })] }) }), _jsx(Reveal, { delay: 0.42, children: _jsxs("div", { className: "cc-hero-foot", children: [_jsxs("div", { children: [_jsx("strong", { children: "01" }), _jsx("span", { children: "\u0627\u0644\u0634\u0631\u0643\u0627\u062A" })] }), _jsx("i", {}), _jsxs("div", { children: [_jsx("strong", { children: "02" }), _jsx("span", { children: "\u0627\u0644\u0648\u062B\u0627\u0626\u0642" })] }), _jsx("i", {}), _jsxs("div", { children: [_jsx("strong", { children: "03" }), _jsx("span", { children: "\u0627\u0644\u062D\u0633\u0627\u0628\u0627\u062A" })] })] }) })] }), _jsx(Reveal, { delay: 0.17, className: "cc-hero-art", children: _jsx(ImmersiveVisual, {}) })] }), _jsxs("section", { className: "cc-services", "aria-label": "\u0623\u0642\u0633\u0627\u0645 \u0627\u0644\u0646\u0638\u0627\u0645", children: [_jsxs("div", { className: "cc-services-title", children: [_jsx("span", { children: "BUILT FOR YOUR WORKFLOW" }), _jsx("strong", { children: "\u0643\u0644 \u0623\u062F\u0648\u0627\u062A\u0643. \u0641\u064A \u0645\u0633\u0627\u0631 \u0648\u0627\u062D\u062F." })] }), _jsx("div", { className: "cc-service-grid", children: [
                            { n: '01', icon: '◇', title: 'دليل الشركات', desc: 'بحث سريع للوصول إلى بيانات الشركة والإجازة.', href: '#companySearchGate' },
                            { n: '02', icon: '▤', title: 'الوثائق والشحنات', desc: 'إنشاء المستندات ومراجعتها وتجهيزها للطباعة.', href: '/form.html' },
                            { n: '03', icon: '◫', title: 'الحسابات المالية', desc: 'الرجوع إلى التجار والحركات وكشوف الحساب.', href: '/traders.html' }
                        ].map((c, i) => _jsxs(motion.a, { className: "cc-service-card", href: c.href, whileHover: { y: -5 }, transition: { type: 'spring', stiffness: 190, damping: 19 }, children: [_jsxs("div", { className: "cc-service-card-top", children: [_jsxs("span", { children: [c.n, " / MODULE"] }), _jsx("b", { children: c.icon })] }), _jsx("h3", { children: c.title }), _jsx("p", { children: c.desc }), _jsxs("span", { className: "cc-service-link", children: ["\u0627\u0633\u062A\u0643\u0634\u0641 ", _jsx(Icon, { name: "arrow" })] })] }, c.n)) })] })] });
}
const pageData = {
    form: { eyebrow: 'CREATE / DOCUMENT FLOW', title: 'وثيقتك. بخطوات', accent: 'أكثر وضوحاً.', desc: 'أدخل بيانات الشحنة، راجع معلومات الشركة ثم جهّز وثيقتك دون التأثير على البيانات المحفوظة.' },
    traders: { eyebrow: 'FINANCE / ACCOUNT CENTER', title: 'حساباتك. في', accent: 'صورة أشمل.', desc: 'إدارة التجار والقبوضات والحسابات ضمن مساحة عمل مرتبة، مع الحفاظ على كشوف الطباعة.' },
    document: { eyebrow: 'PREVIEW / A4 OUTPUT', title: 'دقة المستند.', accent: 'حتى آخر ملليمتر.', desc: 'معاينة وثيقتك وطباعتها مع الحفاظ على أبعاد A4 والـQR والملاحظات داخل الورقة.' }
};
function PageIntro({ page }) { const d = pageData[page]; return _jsxs("section", { className: "cc-page-intro", children: [_jsxs(Reveal, { children: [_jsxs("div", { className: "cc-eyebrow", children: [_jsx("span", { className: "cc-eyebrow-line" }), d.eyebrow] }), _jsxs("h1", { children: [d.title, " ", _jsx("span", { children: d.accent })] }), _jsx("p", { children: d.desc })] }), _jsxs("div", { className: "cc-page-intro-stamp", "aria-hidden": "true", children: ["\u2733 ", _jsx("span", { children: "IC/26" })] })] }); }
function Dock({ active }) { return _jsx("nav", { className: "cc-dock", "aria-label": "\u0627\u0644\u062A\u0646\u0642\u0644 \u0627\u0644\u0633\u0631\u064A\u0639", children: _jsx("div", { className: "cc-dock-inner", children: PAGES.map(p => _jsxs("a", { className: active === p.key ? 'cc-dock-active' : '', href: p.href, "aria-current": active === p.key ? 'page' : undefined, children: [_jsx("span", { className: "cc-dock-icon", children: p.icon }), _jsx("small", { children: p.short })] }, p.key)) }) }); }
function Background() { return _jsxs("div", { className: "cc-ambient", "aria-hidden": "true", children: [_jsx("span", { className: "cc-aurora cc-aurora-one" }), _jsx("span", { className: "cc-aurora cc-aurora-two" }), _jsx("span", { className: "cc-ambient-grid" }), _jsx("span", { className: "cc-vignette" })] }); }
function ScrollProgress() { const ref = useRef(null); useEffect(() => { let raf = 0; const on = () => { if (raf)
    return; raf = requestAnimationFrame(() => { raf = 0; const h = document.documentElement.scrollHeight - innerHeight; const p = h > 0 ? scrollY / h : 0; if (ref.current)
    ref.current.style.transform = `scaleX(${Math.min(1, p)})`; }); }; addEventListener('scroll', on, { passive: true }); on(); return () => { removeEventListener('scroll', on); cancelAnimationFrame(raf); }; }, []); return _jsx("div", { ref: ref, className: "cc-scroll-progress" }); }
function Portal() {
    const active = pageFromPath();
    useEffect(() => { document.body.classList.add('cc-redesigned', 'cc-page-' + active); const anchor = document.getElementById('cc-after-hero'); if (active === 'home' && anchor) {
        anchor.setAttribute('tabindex', '-1');
    } return () => { document.body.classList.remove('cc-redesigned', 'cc-page-' + active); }; }, [active]);
    useEffect(() => { if (matchMedia('(prefers-reduced-motion: reduce)').matches || window.innerWidth < 850)
        return; let ctx; let cancelled = false; const start = async () => { try {
        const [{ gsap }, { ScrollTrigger }] = await Promise.all([import('gsap'), import('gsap/ScrollTrigger')]);
        if (cancelled)
            return;
        gsap.registerPlugin(ScrollTrigger);
        ctx = gsap.context(() => { gsap.fromTo('.cc-service-card', { opacity: 0, y: 22 }, { opacity: 1, y: 0, duration: .75, stagger: .13, ease: 'power2.out', scrollTrigger: { trigger: '.cc-services', start: 'top 85%', once: true } }); });
    }
    catch { } }; start(); return () => { cancelled = true; ctx?.revert?.(); }; }, [active]);
    return _jsxs(_Fragment, { children: [_jsx(Background, {}), _jsx(ScrollProgress, {}), _jsx(Header, { active: active }), active === 'home' ? _jsx(HomeHero, {}) : _jsx(PageIntro, { page: active }), _jsx(Dock, { active: active }), _jsxs("div", { className: "cc-overview-foot", dir: "rtl", children: [_jsx("span", { children: "IRAQ CUSTOMS / WORKSPACE" }), _jsx("span", { children: "\u0648\u0627\u062C\u0647\u0629 \u0645\u0633\u0627\u0639\u062F\u0629 \u0644\u0644\u0639\u0645\u0644\u064A\u0627\u062A \u2014 \u0644\u0627 \u062A\u0634\u0643\u0644 \u062A\u062D\u0642\u0642\u0627\u064B \u062D\u0643\u0648\u0645\u064A\u0627\u064B \u0645\u0646 \u0627\u0644\u0648\u062B\u0627\u0626\u0642" })] })] });
}
export default Portal;
