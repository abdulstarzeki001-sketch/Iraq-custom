import React, {useEffect, useRef, useState, Suspense, lazy} from 'react';
import {motion, AnimatePresence, useReducedMotion} from 'motion/react';

const Scene = lazy(() => import('./scene.js'));
const PAGES = [
  {key:'home', href:'/', name:'الرئيسية', short:'الرئيسية', icon:'◈', en:'PORTAL'},
  {key:'form', href:'/form.html', name:'إنشاء وثيقة', short:'وثيقة جديدة', icon:'✦', en:'CREATE'},
  {key:'traders', href:'/traders.html', name:'التجار والحسابات', short:'الحسابات', icon:'▦', en:'LEDGER'},
  {key:'document', href:'/document', name:'معاينة الوثيقة', short:'المعاينة', icon:'▤', en:'DOCUMENT'}
] as const;
type PageKey = typeof PAGES[number]['key'];
const pageFromPath = ():PageKey => {
  const p=location.pathname.toLowerCase();
  if (p.includes('document')) return 'document';
  if (p.includes('traders')) return 'traders';
  if (p.includes('form')) return 'form';
  return 'home';
};

function Icon({name}: {name:string}){
  if(name==='arrow')return <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7"><path d="M17 7 7 17M7 7h10v10"/></svg>;
  if(name==='spark')return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7"><path d="m12 2 2.4 7.6L22 12l-7.6 2.4L12 22l-2.4-7.6L2 12l7.6-2.4L12 2Z"/></svg>;
  if(name==='menu')return <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M4 7h16M4 12h16M4 17h16"/></svg>;
  return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="m5 12 5 5L20 7"/></svg>;
}
function Reveal({children,delay=0, className=''}:{children:React.ReactNode;delay?:number;className?:string}){
  const reduce=useReducedMotion();
  return <motion.div className={className} initial={reduce?false:{opacity:0,y:25}} animate={{opacity:1,y:0}} transition={{duration:reduce?0:0.78,delay,ease:[0.22,1,0.36,1]}}>{children}</motion.div>;
}
function OrbitalFallback(){return <div className="cc-orbital" aria-hidden="true"><div className="cc-orbital-grid"/><div className="cc-orbit cc-orbit-a"/><div className="cc-orbit cc-orbit-b"/><div className="cc-orbit cc-orbit-c"/><div className="cc-globe"><div className="cc-globe-glow"/><span>IQ</span><small>CUSTOMS · SYSTEM</small></div><i className="cc-node cc-node-a"/><i className="cc-node cc-node-b"/><i className="cc-node cc-node-c"/></div>}
function ImmersiveVisual(){
 const [renderScene,setScene]=useState(false);const [requested,setRequested]=useState(false);const reduce=useReducedMotion();
 useEffect(()=>{const on=()=>{if(!reduce && window.innerWidth>=1000 && !(navigator as Navigator & {connection?: {saveData?: boolean}}).connection?.saveData)setScene(true)}; on();const m=window.matchMedia('(min-width:1000px)');m.addEventListener?.('change',on);return()=>m.removeEventListener?.('change',on)},[reduce]);
 return <div className="cc-visual" aria-label="مشهد مداري تفاعلي ثلاثي الأبعاد"><OrbitalFallback/>{(renderScene||requested)&&<Suspense fallback={null}><Scene/></Suspense>}<button className="cc-visual-control" type="button" onClick={()=>{setRequested(x=>!x);setScene(x=>!x)}}>{renderScene||requested?'إيقاف المشهد ثلاثي الأبعاد':'تفعيل تجربة 3D'} <span aria-hidden="true">✧</span></button><span className="cc-visual-caption">INTERACTIVE / ORBITAL INTERFACE</span></div>
}
function Header({active}:{active:PageKey}){
  const [menu,setMenu]=useState(false);
  return <header className="cc-header" dir="rtl"><div className="cc-header-inner"><a className="cc-brand" href="/" aria-label="العودة للرئيسية"><span className="cc-brand-symbol"><span>✳</span></span><span className="cc-brand-words"><b>IRAQ <em>CUSTOMS</em></b><small>نظام إدارة الوثائق والشحنات</small></span></a>
    <nav className="cc-desktop-nav" aria-label="التنقل الرئيسي">{PAGES.map(p=><a key={p.key} href={p.href} className={active===p.key?'cc-nav-active':''} aria-current={active===p.key?'page':undefined}>{p.name}</a>)}</nav>
    <div className="cc-header-actions"><span className="cc-live-dot"><i/>واجهة تشغيل</span><button type="button" aria-label="فتح القائمة" aria-expanded={menu} className="cc-menu-button" onClick={()=>setMenu(v=>!v)}><Icon name="menu"/></button><a className="cc-header-cta" href="/form.html">إنشاء وثيقة <Icon name="arrow"/></a></div></div>
    <AnimatePresence>{menu&&<motion.nav className="cc-mobile-menu" initial={{opacity:0,height:0}} animate={{opacity:1,height:'auto'}} exit={{opacity:0,height:0}}>{PAGES.map(p=><a key={p.key} href={p.href}>{p.name}<span>{p.en}</span></a>)}</motion.nav>}</AnimatePresence>
  </header>
}
function HomeHero(){
 return <><section className="cc-hero" aria-labelledby="cc-main-title"><div className="cc-hero-copy"><Reveal><div className="cc-eyebrow"><span className="cc-eyebrow-line"/> DIGITAL OPERATIONS / IRAQ 2026</div></Reveal>
 <Reveal delay={0.12}><h1 id="cc-main-title">إدارة الجمارك،<br/><span>برؤيةٍ جديدة.</span></h1></Reveal>
 <Reveal delay={0.22}><p className="cc-hero-description">مساحة عمل ذكية لإدارة بيانات الشركات، تجهيز وثائق الشحنات، ومراجعة كشوف الحسابات. واجهة واحدة، تفاصيل دقيقة، وتنقّل بلا تعقيد.</p></Reveal>
 <Reveal delay={0.3}><div className="cc-hero-actions"><a className="cc-primary-btn" href="#companySearchGate"><span>ابدأ البحث عن شركة</span><Icon name="arrow"/></a><a className="cc-secondary-btn" href="/form.html">إنشاء وثيقة <span>↗</span></a></div></Reveal>
 <Reveal delay={0.42}><div className="cc-hero-foot"><div><strong>01</strong><span>الشركات</span></div><i/><div><strong>02</strong><span>الوثائق</span></div><i/><div><strong>03</strong><span>الحسابات</span></div></div></Reveal>
 </div><Reveal delay={0.17} className="cc-hero-art"><ImmersiveVisual/></Reveal></section><section className="cc-services" aria-label="أقسام النظام"><div className="cc-services-title"><span>BUILT FOR YOUR WORKFLOW</span><strong>كل أدواتك. في مسار واحد.</strong></div><div className="cc-service-grid">{[
 {n:'01',icon:'◇',title:'دليل الشركات',desc:'بحث سريع للوصول إلى بيانات الشركة والإجازة.',href:'#companySearchGate'},
 {n:'02',icon:'▤',title:'الوثائق والشحنات',desc:'إنشاء المستندات ومراجعتها وتجهيزها للطباعة.',href:'/form.html'},
 {n:'03',icon:'◫',title:'الحسابات المالية',desc:'الرجوع إلى التجار والحركات وكشوف الحساب.',href:'/traders.html'}
 ].map((c,i)=><motion.a key={c.n} className="cc-service-card" href={c.href} whileHover={{y:-5}} transition={{type:'spring',stiffness:190,damping:19}}><div className="cc-service-card-top"><span>{c.n} / MODULE</span><b>{c.icon}</b></div><h3>{c.title}</h3><p>{c.desc}</p><span className="cc-service-link">استكشف <Icon name="arrow"/></span></motion.a>)}</div></section></>
}
const pageData:Record<Exclude<PageKey,'home'>,{eyebrow:string,title:string,accent:string,desc:string}>={
 form:{eyebrow:'CREATE / DOCUMENT FLOW',title:'وثيقتك. بخطوات',accent:'أكثر وضوحاً.',desc:'أدخل بيانات الشحنة، راجع معلومات الشركة ثم جهّز وثيقتك دون التأثير على البيانات المحفوظة.'},
 traders:{eyebrow:'FINANCE / ACCOUNT CENTER',title:'حساباتك. في',accent:'صورة أشمل.',desc:'إدارة التجار والقبوضات والحسابات ضمن مساحة عمل مرتبة، مع الحفاظ على كشوف الطباعة.'},
 document:{eyebrow:'PREVIEW / A4 OUTPUT',title:'دقة المستند.',accent:'حتى آخر ملليمتر.',desc:'معاينة وثيقتك وطباعتها مع الحفاظ على أبعاد A4 والـQR والملاحظات داخل الورقة.'}
};
function PageIntro({page}:{page:Exclude<PageKey,'home'>}){const d=pageData[page];return <section className="cc-page-intro"><Reveal><div className="cc-eyebrow"><span className="cc-eyebrow-line"/>{d.eyebrow}</div><h1>{d.title} <span>{d.accent}</span></h1><p>{d.desc}</p></Reveal><div className="cc-page-intro-stamp" aria-hidden="true">✳ <span>IC/26</span></div></section>}
function Dock({active}:{active:PageKey}){return <nav className="cc-dock" aria-label="التنقل السريع"><div className="cc-dock-inner">{PAGES.map(p=><a key={p.key} className={active===p.key?'cc-dock-active':''} href={p.href} aria-current={active===p.key?'page':undefined}><span className="cc-dock-icon">{p.icon}</span><small>{p.short}</small></a>)}</div></nav>}
function Background(){return <div className="cc-ambient" aria-hidden="true"><span className="cc-aurora cc-aurora-one"/><span className="cc-aurora cc-aurora-two"/><span className="cc-ambient-grid"/><span className="cc-vignette"/></div>}
function ScrollProgress(){const ref=useRef<HTMLDivElement|null>(null);useEffect(()=>{let raf=0;const on=()=>{if(raf)return;raf=requestAnimationFrame(()=>{raf=0;const h=document.documentElement.scrollHeight-innerHeight;const p=h>0?scrollY/h:0;if(ref.current)ref.current.style.transform=`scaleX(${Math.min(1,p)})`})};addEventListener('scroll',on,{passive:true});on();return()=>{removeEventListener('scroll',on);cancelAnimationFrame(raf)}},[]);return <div ref={ref} className="cc-scroll-progress"/>}
function Portal(){const active=pageFromPath();useEffect(()=>{document.body.classList.add('cc-redesigned','cc-page-'+active);const anchor=document.getElementById('cc-after-hero');if(active==='home'&&anchor){anchor.setAttribute('tabindex','-1')}return()=>{document.body.classList.remove('cc-redesigned','cc-page-'+active)}},[active]);
 useEffect(()=>{if(matchMedia('(prefers-reduced-motion: reduce)').matches||window.innerWidth<850)return;let ctx:any;let cancelled=false;const start=async()=>{try{const [{gsap},{ScrollTrigger}]=await Promise.all([import('gsap'),import('gsap/ScrollTrigger')]);if(cancelled)return;gsap.registerPlugin(ScrollTrigger);ctx=gsap.context(()=>{gsap.fromTo('.cc-service-card',{opacity:0,y:22},{opacity:1,y:0,duration:.75,stagger:.13,ease:'power2.out',scrollTrigger:{trigger:'.cc-services',start:'top 85%',once:true}})})}catch{}};start();return()=>{cancelled=true;ctx?.revert?.()}},[active]);
 return <><Background/><ScrollProgress/><Header active={active}/>{active==='home'?<HomeHero/>:<PageIntro page={active}/>}<Dock active={active}/><div className="cc-overview-foot" dir="rtl"><span>IRAQ CUSTOMS / WORKSPACE</span><span>واجهة مساعدة للعمليات — لا تشكل تحققاً حكومياً من الوثائق</span></div></>;
}
export default Portal;
