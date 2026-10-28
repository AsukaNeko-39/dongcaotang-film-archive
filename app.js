(() => {
'use strict';
const D=window.DCT_DATA,$=s=>document.querySelector(s),$$=s=>[...document.querySelectorAll(s)];
const asset=src=>window.DCT_ASSETS?.[src]||src;
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const cropFrame=(src,alt,crop='58,112,815,538',extra='')=>`<div class="source-frame ${extra}" data-crop="${crop}"><img src="${src}" alt="${esc(alt)}" loading="lazy"></div>`;
const frameObserver=new ResizeObserver(entries=>entries.forEach(({target})=>fitFrame(target)));
function fitFrame(el){const img=el.querySelector('img');if(!img)return;const [a,b,c,d]=el.dataset.crop.split(',').map(Number),sw=img.naturalWidth||+el.dataset.sourceWidth||1280,sh=img.naturalHeight||+el.dataset.sourceHeight||589,w=el.clientWidth,h=el.clientHeight;if(!w||!h)return;const k=(el.dataset.fit==='contain'?Math.min:Math.max)(w/(c-a),h/(d-b));Object.assign(img.style,{width:sw*k+'px',height:sh*k+'px',left:((w-(c-a)*k)/2-a*k)+'px',top:((h-(d-b)*k)/2-b*k)+'px',clipPath:`inset(${b/sh*100}% ${(sw-c)/sw*100}% ${(sh-d)/sh*100}% ${a/sw*100}%)`});if(!img.dataset.frameBound){img.dataset.frameBound='true';img.addEventListener('load',()=>fitFrame(el));}}

function observeFrames(){$$('[data-crop]').forEach(el=>{frameObserver.observe(el);fitFrame(el);});}
const story=[
 ['0—4 秒','古镇与时代','群山、古镇与红军队伍。',3,'古镇'],
 ['4—8 秒','商户援红','银元、粮食、药材与药箱。',4,'侗医'],
 ['8—13 秒','雨夜求援','山林伤员与敲门求助。',3,'古镇'],
 ['13—19 秒','侗医进山','穿越关卡，入洞救治。',4,'侗医'],
 ['19—24 秒','军民同心','送药、送粮、引开搜捕。',4,'侗医'],
 ['24—27 秒','信物与告别','交换信物，伤愈归队。',5,'传承'],
 ['27—30 秒','当代传承','药坊、药田与片名。',5,'传承']
];
$('#timeline').innerHTML=story.map((s,i)=>`<button class="timeline-tab" type="button" role="tab" aria-controls="scenePanel" id="beat-${i}" aria-selected="${i===0}" tabindex="${i===0?0:-1}" data-beat="${i}"><span class="timeline-index">${String(i+1).padStart(2,'0')}</span><span class="timeline-time">${s[0]}</span><span class="timeline-title">${s[1]}</span></button>`).join('');
function setBeat(i,focus=false){const s=story[i];$('#scenePanel').setAttribute('aria-labelledby','beat-'+i);$('#sceneTime').textContent=s[0];$('#sceneTitle').textContent=s[1];$('#sceneBody').textContent=s[2];$('#sceneCaption').textContent=`项目原始样片 · ${s[4]}画面`;const frame=$('#sceneFrame');frame.dataset.crop=s[3]===5?'58,218,560,538':'58,112,815,538';frame.querySelector('img').src=asset(`assets/cost-${s[3]}.png`);frame.querySelector('img').alt=`项目原始样片中的${s[4]}画面`;fitFrame(frame);$$('[data-beat]').forEach((b,j)=>{b.setAttribute('aria-selected',String(j===i));b.tabIndex=j===i?0:-1;});if(focus){const b=$(`#beat-${i}`);b.focus({preventScroll:true});b.scrollIntoView({block:'nearest',inline:'nearest'});}}
$('#timeline').addEventListener('click',e=>{const b=e.target.closest('[data-beat]');if(b)setBeat(+b.dataset.beat);});
$('#timeline').addEventListener('keydown',e=>{const b=e.target.closest('[data-beat]');if(!b)return;let n=+b.dataset.beat;if(e.key==='ArrowRight')n=(n+1)%7;else if(e.key==='ArrowLeft')n=(n+6)%7;else if(e.key==='Home')n=0;else if(e.key==='End')n=6;else return;e.preventDefault();setBeat(n,true);});
const tableDirections=['概念宣传片','战地托付与山林逃亡','夜战完整视听分镜','刘小兵视角夜战','项目宣传片初版'];
const shortEvaluations=['节奏适中，适合预告片','人物情绪到位','氛围达标，战斗逻辑待优化','调度更复杂，战斗逻辑仍待优化','首个合格版本，结尾感染力待提升'];
$('#recordsTable').innerHTML=D.records.map((r,i)=>`<tr><td><a href="#source-${r.id}">${r.id}</a></td><td>${tableDirections[i]}</td><td>${esc(r.params.replace(/^2\.5\s*/,''))}</td><td>${shortEvaluations[i]}</td></tr>`).join('');
const issues=[
 ['光影过亮','压暗环境，以油灯、火把与天光塑造空间。','光源是否可信，冷暖与整体色调是否统一。',3],
 ['叙事视角分散','明确核心人物，围绕其所见所闻组织镜头。','敌我方向、行动路线、轴线与视线衔接。',4],
 ['转场依赖黑白','增加声音先行、动作匹配与物品转场。','环境声连续，服装、伤势、信物与道具状态一致。',5],
 ['人物情感偏弱','补足微表情和细节动作，重点独白考虑真人配音。','表演与配音情感，同时核对音乐授权。',7]
];
$('#reviewCards').innerHTML=issues.map(i=>`<article class="review-card card"><div class="issue-intro">${cropFrame(`assets/cost-${i[3]}.png`,i[0]+'的项目画面参照',i[3]===5?'58,218,560,538':'58,112,815,538')}<h3>${i[0]}</h3></div><div class="review-adjust"><span class="mobile-label">调整方向</span><p>${i[1]}</p></div><div class="review-check"><span class="mobile-label">下一轮检查</span><p>${i[2]}</p></div></article>`).join('');
const steps=[['剧本与人物','确定主角、叙事视角和冲突。'],['风格与参考','统一限定词，整理人物与场景。'],['样片试生成','用关键镜头验证表演与节奏。'],['素材修复','处理噪点、皮肤和场景一致性。'],['声音与剪辑','衔接音效、配音与转场。'],['调色与交付','统一风格，检查画面与连续性。']];
$('#workflowCards').innerHTML=steps.map((s,i)=>`<li class="card"><header><span class="step-number">${String(i+1).padStart(2,'0')}</span><h4>${s[0]}</h4></header><p>${s[1]}</p></li>`).join('');
function formatPrompt(t){return esc(t).replace(/(?=【)/g,'\n\n').replace(/(?=分镜\d{2}：)/g,'\n\n').replace(/(?=\d+(?:\.\d+)?—\d+(?:\.\d+)?秒｜)/g,'\n\n');}
function blockHTML(b){if(b.type==='image')return `<button class="image-button training-image" data-image="${b.src}" data-caption="培训文档原文插图" aria-label="放大培训文档插图"><img src="${b.src}" alt="培训文档原文插图" loading="lazy"><span class="zoom-hint">放大原图 ↗</span></button>`;if(!b.text)return '';let t=esc(b.text);if(b.type==='heading3')return `<h3>${t}</h3>`;if(b.type==='heading4')return `<h4>${t}</h4>`;return `<p class="${b.type==='bullet'?'bullet':''}">${t}</p>`;}
$('#sourceAccordions').innerHTML=D.records.map((r,i)=>`<details class="source-entry" id="source-${r.id}" data-source-index="${i}"><summary><span class="source-code">${r.id}</span><div class="source-summary-copy"><h4>${esc(r.title)}</h4><span class="source-meta">${esc(r.platform)} / ${esc(r.params)} / 完整提示词与原始评估</span></div></summary><div class="source-body"><h5>原文评估</h5><p class="source-eval">${esc(r.evaluation)}</p><h5>完整提示词</h5><div class="prompt-full">${formatPrompt(r.prompt)}</div><h5>原视频文件名</h5><p class="file-name">${esc(r.video)}</p><div class="source-actions"><button class="outline-button" data-copy-record="${i}">复制完整提示词</button><button class="outline-button" data-download-record="${i}">下载本条资料</button><a href="${D.source}?table=tbl3PJvhFoaUy0dA&amp;view=vewDSc92Po" target="_blank" rel="noreferrer">原表查看视频 ↗</a></div><details class="raw-record"><summary>查看原表完整字段</summary><pre>${esc(r.raw)}</pre></details></div></details>`).join('')+D.docs.map((d,i)=>`<details class="source-entry" id="training-${i+1}" data-doc-index="${i}"><summary><span class="source-code">${i+1===1?'@1':'@2'}</span><div class="source-summary-copy"><h4>${esc(d.title)}</h4><span class="source-meta">培训正文与原文插图完整保留</span></div></summary><div class="source-body training-block">${d.blocks.map(blockHTML).join('')}<div class="source-actions"><a href="${d.url}" target="_blank" rel="noreferrer">打开飞书子文档 ↗</a></div></div></details>`).join('');
const labels=['其他示例 · 足球少年','其他示例 · 玉石首饰','C1 · 古镇','C1 · 侗医与药箱','C1 · 当代传承','其他示例 · 梯田','夜战 · 战壕','夜战 · 山林','夜战 · 第一人称'];
const bills=['1027,361,1278,492','837,361,1089,492','1027,361,1278,492','1027,361,1278,492','1027,361,1278,492','874,361,1126,492','942,361,1195,492','938,361,1195,492','938,361,1195,492'];
const billingRecords=[
 {time:'2026-07-31 22:21',points:780},
 {time:'2026-08-02 13:55',points:780},
 {time:'2026-08-02 02:14',points:780},
 {time:'2026-08-02 02:14',points:780},
 {time:'2026-08-02 02:17',points:780},
 {time:'2026-10-13 20:05',points:90},
 {time:'2026-09-29 09:04',points:486},
 {time:'2026-09-29 09:04',points:486},
 {time:'2026-09-29 08:44',points:486}
].map((r,i)=>({...r,frameRate:24,index:i,crop:bills[i],label:labels[i],src:`assets/cost-${i+1}.png`}));
window.DCT_BILLING=billingRecords;
const billRows=r=>`<span class="bill-row"><span>帧率</span><strong>${r.frameRate}</strong></span><span class="bill-row"><span>生成时间</span><strong>${r.time}</strong></span><span class="bill-row"><span>消耗积分数</span><strong>${r.points}</strong></span>`;
$('#costGallery').innerHTML=billingRecords.map((r,i)=>`<article class="cost-card card" data-record="${i+1}"><h4><span>${String(i+1).padStart(2,'0')}</span>${r.label}</h4><div class="record-part"><p class="record-label">计费信息</p><button type="button" class="record-preview billing-preview" data-billing-index="${i}" aria-label="放大记录 ${i+1} 的计费信息"><span class="billing-sheet">${billRows(r)}</span><span class="zoom-hint">放大查看 ↗</span></button></div><div class="record-part"><p class="record-label">完整原始截图</p><button type="button" class="record-preview full-preview" data-image="${r.src}" data-caption="积分消耗原始记录 ${String(i+1).padStart(2,'0')} · ${r.label}" aria-label="放大记录 ${i+1} 的完整原始截图"><img src="${asset(r.src)}" alt="原始积分记录${i+1}，${r.label}" loading="lazy"><span class="zoom-hint">放大查看 ↗</span></button></div></article>`).join('');
$('#pageNotes').innerHTML=D.slides.map(s=>`<details class="page-note"><summary>第 ${String(s.number).padStart(2,'0')} 页 · ${esc(s.texts.find(t=>t.length>7)||s.texts[0]||'原稿')}</summary><p class="notes-label">页面文字</p><div class="slide-text">${esc(s.texts.join('\n'))}</div><p class="notes-label">原稿备注与完整资料</p><div class="notes-text">${esc(s.notes)}</div></details>`).join('');
$('#photoCredits').innerHTML=D.credits.map(q=>`<p class="credit-entry"><a href="${q.page}" target="_blank" rel="noreferrer">${esc(q.title)} ↗</a><br>${esc(q.author)} · ${esc(q.license)}<br>仅作环境、材质、文献或制作方法参考，图片按原许可保留署名与出处。</p>`).join('');
$$('img').forEach(im=>{const src=im.getAttribute('src');if(window.DCT_ASSETS?.[src])im.src=asset(src);});
observeFrames();
window.DCT_REFRESH_FRAMES=observeFrames;
// Native details keep the full source available without imposing slide-size typography.
const entries=$$('.source-entry');
function filterSources(){let q=$('#sourceSearch').value.trim().toLowerCase(),count=0;entries.forEach(el=>{const i=el.dataset.sourceIndex,j=el.dataset.docIndex;const hay=i!==undefined?D.records[+i].raw:D.docs[+j].title+' '+D.docs[+j].blocks.map(b=>b.text).join(' ');const match=!q||hay.toLowerCase().includes(q);el.hidden=!match;if(match)count++;});$('#sourceCount').textContent=`${count} / ${entries.length} 份资料`;$('#sourceEmpty').hidden=count!==0;}
$('#sourceSearch').addEventListener('input',filterSources);filterSources();
$('#expandSources').addEventListener('click',()=>{const shown=entries.filter(e=>!e.hidden);let open=shown.some(e=>!e.open);shown.forEach(e=>e.open=open);$('#expandSources').textContent=open?'收起全部':'展开全部';observeFrames();});
entries.forEach(e=>e.addEventListener('toggle',()=>{observeFrames();const shown=entries.filter(e=>!e.hidden);$('#expandSources').textContent=shown.length&&shown.every(e=>e.open)?'收起全部':'展开全部';}));
function revealHash(){const id=decodeURIComponent(location.hash.slice(1)),el=document.getElementById(id);if(el?.classList.contains('source-entry')){el.hidden=false;el.open=true;setTimeout(()=>el.scrollIntoView({block:'start'}),30);}}
window.addEventListener('hashchange',revealHash);revealHash();
let toastTimer;function toast(msg){const t=$('#toast');t.textContent=msg;t.hidden=false;clearTimeout(toastTimer);toastTimer=setTimeout(()=>t.hidden=true,2200);}
function download(name,text){const a=document.createElement('a'),url=URL.createObjectURL(new Blob([text],{type:'text/plain;charset=utf-8'}));a.href=url;a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);}
document.addEventListener('click',async e=>{let b=e.target.closest('[data-copy-record]');if(b){try{await navigator.clipboard.writeText(D.records[+b.dataset.copyRecord].prompt);toast('完整提示词已复制');}catch{const el=b.closest('.source-body').querySelector('.prompt-full'),r=document.createRange();r.selectNodeContents(el);const sel=getSelection();sel.removeAllRanges();sel.addRange(r);toast('已选中提示词，可复制选中文字');}}b=e.target.closest('[data-download-record]');if(b){const r=D.records[+b.dataset.downloadRecord];download(`侗草堂_${r.id}_完整资料.txt`,r.raw);}});
$('#downloadSources').addEventListener('click',()=>download('侗草堂_完整提示词与培训资料.txt',D.records.map(r=>r.raw).join('\n\n====================\n\n')+'\n\n'+D.docs.map(d=>d.title+'\n'+d.url+'\n\n'+d.blocks.map(b=>b.text||'[原文插图，详见网页]').join('\n\n')).join('\n\n====================\n\n')));
// Source images open at their original resolution. Esc and native dialog focus handling remain available.
const imageDialog=$('#imageDialog');
function openImage(src,caption){const im=$('#lightboxImage');im.src=asset(src);im.alt=caption;$('#imageCaption').textContent=caption;$('#lightboxStage').classList.remove('zoomed');$('#zoomImage').setAttribute('aria-pressed','false');$('#zoomImage').textContent='原尺寸查看';imageDialog.showModal();}
document.addEventListener('click',e=>{const b=e.target.closest('[data-image]');if(b)openImage(b.dataset.image,b.dataset.caption||'原始资料图片');});
$('#closeImage').addEventListener('click',()=>imageDialog.close());
$('#zoomImage').addEventListener('click',()=>{const on=$('#lightboxStage').classList.toggle('zoomed');$('#zoomImage').setAttribute('aria-pressed',String(on));$('#zoomImage').textContent=on?'适应窗口':'原尺寸查看';});
imageDialog.addEventListener('click',e=>{if(e.target===imageDialog){const r=imageDialog.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)imageDialog.close();}});
// The original sixteen pages are a second view, not a replacement for the responsive site.
const slideDialog=$('#slideDialog');let slideIndex=0;
$('#slideSelect').innerHTML=D.slides.map((s,i)=>`<option value="${i}">${String(s.number).padStart(2,'0')}</option>`).join('');
function setSlide(i){slideIndex=Math.min(15,Math.max(0,i));const s=D.slides[slideIndex];$('#slideImage').src=asset(s.src);$('#slideImage').alt=`第 ${s.number} 页原稿：${s.texts.slice(0,3).join('，')}`;$('#slideSelect').value=String(slideIndex);$('#prevSlide').disabled=slideIndex===0;$('#nextSlide').disabled=slideIndex===15;}
function openSlides(){setSlide(slideIndex);slideDialog.showModal();}
$('#openSlides').addEventListener('click',openSlides);$('#heroSlides').addEventListener('click',openSlides);$('#closeSlides').addEventListener('click',()=>slideDialog.close());$('#prevSlide').addEventListener('click',()=>setSlide(slideIndex-1));$('#nextSlide').addEventListener('click',()=>setSlide(slideIndex+1));$('#slideSelect').addEventListener('change',e=>setSlide(+e.target.value));
$('#fullscreenSlides').addEventListener('click',async()=>{try{if(document.fullscreenElement)await document.exitFullscreen();else await slideDialog.requestFullscreen();}catch{toast('当前窗口不支持全屏，仍可正常翻页');}});
slideDialog.addEventListener('close',()=>{if(document.fullscreenElement===slideDialog)document.exitFullscreen().catch(()=>{});});
document.addEventListener('keydown',e=>{if(slideDialog.open&&e.target.tagName!=='SELECT'){if(e.key==='ArrowRight'||e.key==='ArrowDown'||e.key==='PageDown'){e.preventDefault();setSlide(slideIndex+1);}else if(e.key==='ArrowLeft'||e.key==='ArrowUp'||e.key==='PageUp'){e.preventDefault();setSlide(slideIndex-1);}else if(e.key==='Home'){e.preventDefault();setSlide(0);}else if(e.key==='End'){e.preventDefault();setSlide(15);}}});
const toggle=$('#menuToggle');toggle.addEventListener('click',()=>{let open=toggle.getAttribute('aria-expanded')!=='true';toggle.setAttribute('aria-expanded',String(open));toggle.setAttribute('aria-label',open?'关闭章节导航':'打开章节导航');$('#mobileNav').hidden=!open;});
$$('#mobileNav a').forEach(a=>a.addEventListener('click',()=>{toggle.setAttribute('aria-expanded','false');toggle.setAttribute('aria-label','打开章节导航');$('#mobileNav').hidden=true;}));
const sections=$$('section.chapter[id]');const navLinks=$$('.desktop-nav a');
const observer=new IntersectionObserver(es=>{for(const e of es)if(e.isIntersecting){navLinks.forEach(a=>a.classList.toggle('active',a.hash==='#'+e.target.id));}},{rootMargin:'-12% 0px -62% 0px'});sections.forEach(s=>observer.observe(s));
let scrollTick=false;function updateProgress(){const max=document.documentElement.scrollHeight-innerHeight;$('#readingProgress').style.width=(max>0?scrollY/max*100:0)+'%';scrollTick=false;}addEventListener('scroll',()=>{if(!scrollTick){scrollTick=true;requestAnimationFrame(updateProgress);}},{passive:true});addEventListener('resize',()=>{updateProgress();observeFrames();});updateProgress();
})();

