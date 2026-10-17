/* Iraq-custom shared, accessible navigation. Progressive enhancement only. */
(() => {
  "use strict";
  const path=location.pathname.toLowerCase();
  const page=path.includes("document")?"document":path.includes("traders")?"traders":path.includes("form")?"form":"home";
  document.body.classList.add("site-premium","page-"+page);
  const I={
    home:'<rect x="3" y="3" width="8" height="8" rx="1.2"/><rect x="13" y="3" width="8" height="8" rx="1.2"/><rect x="3" y="13" width="8" height="8" rx="1.2"/><rect x="13" y="13" width="8" height="8" rx="1.2"/>',
    form:'<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6M8 13h8M8 17h6"/>',
    traders:'<path d="M4 21v-3a4 4 0 0 1 4-4h8a4 4 0 0 1 4 4v3"/><circle cx="12" cy="7" r="4"/>',
    document:'<rect x="4" y="3" width="16" height="18" rx="2"/><path d="M8 8h8M8 12h8M8 16h5"/>'
  };
  const icon=(name)=>'<svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">'+I[name]+'</svg>';
  const pages=[
    ["home","الرئيسية","index.html"],
    ["form","إنشاء وثيقة","form.html"],
    ["traders","التجار والحسابات","traders.html"],
    ["document","المعاينة","document.html"]
  ];
  const current={home:["دليل الشركات والمعاملات","ابحث عن شركتك وأنشئ مستندات الحمولة من مكان واحد.","بحث الشركات","إدارة المعاملات","واجهة عربية واضحة"],form:["إنشاء وثيقة جديدة","أدخل بيانات السائق والحمولة والشركة بخطوات منظمة وحقول سهلة القراءة.","بيانات الحمولة","إدخال منظم","حفظ الوثائق"],traders:["إدارة التجار وكشوف الحساب","تابع المستحقات والقبوضات والرصيد مع كشف حساب مرتب وسهل المراجعة.","إدارة التجار","الحركات المالية","كشوف الحساب"],document:["معاينة وطباعة الوثيقة","راجع البيانات ثم احفظ صورة الوثيقة أو ملف PDF، مع الحفاظ على مقاسات A4 الأصلية.","A4 للطباعة","تصدير PDF","قراءة واضحة"]}[page];
  const nav=(dock=false)=>pages.map(([id,label,href])=>{
    const active=id===page?' aria-current="page"':'';
    const txt=dock?(id==="form"?"إنشاء":id==="traders"?"الحسابات":id==="document"?"الوثيقة":label):label;
    return '<a class="'+(dock?'site-docklink':'site-navlink')+'" href="'+href+'"'+active+'>'+icon(id)+'<span>'+txt+'</span></a>';
  }).join('');
  const logo='<svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M4 19h16M5 16V7l7-4 7 4v9M9 9h6M9 12h6"/><path d="M10 19v-4h4v4"/></svg>';
  const top=document.createElement("header");
  top.id="site-topbar";
  top.innerHTML='<div class="site-topbar-inner"><a class="site-brand" href="index.html"><span class="site-brand-logo">'+logo+'</span><span><span class="site-brand-title" style="display:block">بوابة كمارك العراق</span><span class="site-brand-subtitle" style="display:block">إدارة الوثائق والمعاملات</span></span></a><nav class="site-header-nav" aria-label="التنقل الرئيسي">'+nav()+'</nav><div class="site-topbar-aside"><span class="site-topbar-tag"><span></span>نظام إدارة الوثائق</span></div></div>';
  const hero=document.createElement("section");
  hero.className="site-hero";
  hero.setAttribute("aria-label","عنوان الصفحة");
  hero.innerHTML='<div class="site-hero-text"><p class="site-hero-kicker">IRAQ CUSTOMS  /  WORKSPACE</p><h1>'+current[0]+'</h1><p class="site-hero-description">'+current[1]+'</p><div class="site-hero-pills"><span>'+current[2]+'</span><span>'+current[3]+'</span><span>'+current[4]+'</span></div></div><div class="site-hero-symbol">'+icon(page)+'</div>';
  const dock=document.createElement("nav");
  dock.id="site-bottomnav";
  dock.setAttribute("aria-label","التنقل السريع");
  dock.innerHTML=nav(true);
  const mount=()=>{
    const topTarget=document.body.firstElementChild;
    document.body.insertBefore(top,topTarget);
    top.insertAdjacentElement("afterend",hero);
    document.body.appendChild(dock);
    // No modification to form elements, stored data or the document/PDF tree.
  };
  if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",mount,{once:true});else mount();
})();
