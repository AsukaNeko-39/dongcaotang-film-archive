(() => {
'use strict';
const $=s=>document.querySelector(s),$$=s=>[...document.querySelectorAll(s)],D=window.DCT_DATA;
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const asset=s=>window.DCT_ASSETS?.[s]||s;
const main=$('#main'),track=document.createElement('div');track.className='deck-stage';
const pages=[];let current=0,moving=false,motionTimer;
const heading=(k,t,p='')=>{const n=document.createElement('div');n.className='chapter-heading';n.innerHTML=`<p class="eyebrow">${k}</p><h2>${t}</h2>${p?`<p class="chapter-deck">${p}</p>`:''}`;return n;};
function page(id,title,nodes,cls='',group=id){const s=document.createElement('section');s.className='deck-page '+cls;s.id=id;s.dataset.pageTitle=title;s.dataset.group=group;s.setAttribute('aria-label',title);const c=document.createElement('div');c.className='page-content';nodes.filter(Boolean).forEach(n=>c.append(n));s.append(c);track.append(s);pages.push(s);return s;}
function originalPage(s,title,group){s.classList.add('deck-page');s.classList.remove('chapter');s.dataset.pageTitle=title;s.dataset.group=group;s.removeAttribute('aria-label');track.append(s);pages.push(s);return s;}
// Retain all original content nodes, listeners, imagery and source materials.
const hero=$('#top'),story=$('#story'),visual=$('#visual'),storyboard=$('#storyboard'),samples=$('#samples'),review=$('#review'),workflow=$('#workflow'),sound=$('.sound-section'),archive=$('#archive'),closing=$('.closing');
originalPage(hero,'封面','top');
page('story','故事与人物',[story.querySelector('.chapter-heading'),story.querySelector('.story-spread')],'','story');
page('visual','摄影与美术',[visual.querySelector('.chapter-heading'),visual.querySelector('.visual-spread')],'page-visual','visual');
page('storyboard','七段分镜',[storyboard.querySelector('.chapter-heading'),storyboard.querySelector('.scene-spread'),storyboard.querySelector('.timeline'),storyboard.querySelector('.quiet-note')],'page-dark page-storyboard','storyboard');
page('samples','五条样片记录',[samples.querySelector('.chapter-heading'),samples.querySelector('.table-shell'),samples.querySelector('.table-note')],'page-records','samples');
page('b1','战地托付与山林逃亡',[heading('B1 / 创作重点','战地托付与山林逃亡'),samples.querySelector('.b1-section')],'page-dark page-b1','samples');
page('comparison','两轮夜战样片对照',[heading('样片对照','两轮夜战样片对照','每幅画面与其已呈现效果、待优化问题对应。'),samples.querySelector('.comparison-grid'),samples.querySelector('.inline-link')],'page-comparison','samples');
const reviewHeading=review.querySelector('.chapter-heading'),reviewGrid=review.querySelector('.review-cards'),reviewNote=review.querySelector('.source-note');
const reviewItems=[...reviewGrid.querySelectorAll('.review-card')];
reviewItems.forEach((card,i)=>{const intro=card.querySelector('.issue-intro'),frame=intro.querySelector('.source-frame'),img=frame.querySelector('img'),title=intro.querySelector('h3'),button=document.createElement('button');button.type='button';button.className='review-shot source-frame';button.dataset.crop=i===2?'58,255.625,560,538':frame.dataset.crop;button.dataset.fit='cover';button.dataset.image=img.getAttribute('src');button.dataset.caption=title.textContent+' · 项目原始截图';button.setAttribute('aria-label','放大'+title.textContent+'的原始画面');button.style.aspectRatio='16/9';button.append(img);const hint=document.createElement('span');hint.className='zoom-hint';hint.textContent='放大原图 ↗';button.append(hint);const explanation=document.createElement('div');explanation.className='review-explanation';explanation.append(card.querySelector('.review-adjust'),card.querySelector('.review-check'));card.replaceChildren(button,title,explanation);card.querySelector('.review-adjust .mobile-label').textContent='调整方向';card.querySelector('.review-check .mobile-label').textContent='下一轮检查';});
reviewHeading.querySelector('h2').textContent='成片优化与下一轮检查';reviewHeading.querySelector('.chapter-deck').textContent='四个检查重点，对应画面、调整方向与下一轮标准。';
page('review','成片优化与下一轮检查',[reviewHeading,reviewGrid,reviewNote],'page-review page-review-images page-review-all','review');

page('prompt','提示词的三层结构',[heading('制作方法','提示词的三层结构'),workflow.querySelector('.prompt-spread')],'page-prompt','workflow');
page('workflow','制作流程',[workflow.querySelector('.section-heading'),workflow.querySelector('.workflow-spread')],'page-workflow','workflow');
sound.id='sound';originalPage(sound,'声音与剪辑','workflow');
const mapButton=archive.querySelector('.iteration-image'),mapFigure=mapButton.parentElement,mapViewport=document.createElement('div'),mapToolbar=document.createElement('div');
mapViewport.className='iteration-scroll';mapViewport.dataset.scrollPanel='true';mapViewport.tabIndex=0;mapViewport.setAttribute('role','region');mapViewport.setAttribute('aria-label','提示词迭代长图，上下滚动浏览');mapViewport.append(mapButton.querySelector('img'));
mapToolbar.className='iteration-toolbar';const mapHint=document.createElement('span');mapHint.textContent='图内上下滚动 · 图外滚轮翻页';mapButton.className='map-expand';mapButton.textContent='放大整图 ↗';mapToolbar.append(mapHint,mapButton);mapFigure.classList.add('iteration-browser');mapFigure.replaceChildren(mapToolbar,mapViewport);
for(const event of ['wheel','touchstart','touchend'])mapViewport.addEventListener(event,e=>e.stopPropagation(),{passive:true});
page('archive','提示词迭代地图',[heading('原始资料','提示词迭代地图'),archive.querySelector('.iteration-spread')],'page-iteration','archive');

// Long source records live in an accessible reading dialog, so presentation pages stay readable.
const materials=document.createElement('dialog');materials.id='materialsDialog';materials.className='materials-dialog';materials.setAttribute('aria-labelledby','materialsTitle');materials.innerHTML='<div class="dialog-toolbar"><h2 id="materialsTitle">完整原始资料</h2><button type="button" class="dialog-button" data-close-materials aria-label="关闭完整资料">关闭 ×</button></div><div class="materials-body"></div>';
const materialBody=materials.querySelector('.materials-body');
const materialHead=$('#promptSources');materialHead.removeAttribute('id');materialBody.append(materialHead,archive.querySelector('.source-tools'),archive.querySelector('#sourceAccordions'),archive.querySelector('#sourceEmpty'));
const notes=archive.querySelectorAll('.full-notes');notes[0].id='materialsNotes';notes[1].id='materialsCredits';materialBody.append(...notes);document.body.append(materials);
const sourceIndex=document.createElement('div');sourceIndex.className='source-index';sourceIndex.innerHTML=D.records.map(r=>`<button type="button" class="source-launch card" data-source-target="source-${r.id}" aria-haspopup="dialog"><span class="source-code">${r.id}</span><span><strong>${esc(r.title)}</strong><small>${esc(r.params)}</small></span><span class="source-launch-action">阅读全文 ↗</span></button>`).join('')+D.docs.map((d,i)=>`<button type="button" class="source-launch card" data-source-target="training-${i+1}" aria-haspopup="dialog"><span class="source-code">@${i+1}</span><span><strong>${esc(d.title)}</strong><small>培训正文与全部原文插图</small></span><span class="source-launch-action">阅读全文 ↗</span></button>`).join('');
const sourceActions=document.createElement('div');sourceActions.className='source-page-actions';sourceActions.innerHTML='<button type="button" class="outline-button" data-source-target="all">打开全部资料</button><button type="button" class="text-button dark-text" data-source-target="materialsNotes">逐页备注</button><button type="button" class="text-button dark-text" data-source-target="materialsCredits">图片出处</button>';
page('promptSources','完整提示词与培训正文',[heading('原始资料','完整提示词与培训正文','五条样片提示词、两份培训文档完整保留，点击进入阅读。'),sourceIndex,sourceActions],'page-sources','archive');
const comparisonNotes=[['爆炸、飞土与躲避动作形成近景压迫。原文评价：氛围达标。','继续核对敌我方向、掩体位置和动作衔接，解决战斗逻辑不顺畅的问题。'],['保留负伤者、协助者和战壕出口的完整位置关系。原文评价：调度更复杂。','沿刘小兵的行动路线检查视线和空间连续性，补足战斗叙事逻辑。']];
[...track.querySelectorAll('.comparison-card')].forEach((c,i)=>{const rows=c.querySelectorAll('dl>div');rows[0].querySelector('dt').textContent='画面观察';rows[0].querySelector('dd').textContent=comparisonNotes[i][0];rows[1].querySelector('dd').textContent=comparisonNotes[i][1];});
[...track.querySelectorAll('.compare-image')].forEach(b=>{b.classList.add('source-frame');b.dataset.crop='0,0,1072,550';b.dataset.fit='contain';b.dataset.sourceWidth='1072';b.dataset.sourceHeight='588';});
const allCost=[...archive.querySelectorAll('.cost-card')];
for(let g=0;g<3;g++){const gallery=document.createElement('div');gallery.className='cost-gallery';allCost.slice(g*3,g*3+3).forEach(c=>gallery.append(c));const first=String(g*3+1).padStart(2,'0'),last=String(g*3+3).padStart(2,'0');const note=document.createElement('p');note.className='source-note';note.textContent='计费字段依原始截图逐条转写。上下预览同尺寸，均可点击放大；记录包含其他示例，不作为本项目总成本。';page(`cost-${first}-${last}`,`积分记录 ${first}—${last}`,[heading('积分消耗原始记录',`积分记录 ${first}—${last}`,'计费信息与完整截图一一对应。'),gallery,note],'page-cost','archive');}
closing.id='closing';originalPage(closing,'一味侗药，一片赤诚','closing');
const oldFooter=$('.site-footer');if(oldFooter)closing.querySelector('.wrap').append(oldFooter);
main.replaceChildren(track);document.documentElement.classList.add('paged-site');main.setAttribute('tabindex','-1');

const topNav=$('.desktop-nav');
[...topNav.querySelectorAll('a')].forEach(a=>{const label=a.textContent.trim();a.setAttribute('aria-label',label);a.title=label;a.innerHTML='<span class="chapter-dot" aria-hidden="true"></span>';});
$('#openSlides').setAttribute('aria-label','浏览原稿');$('#openSlides').title='浏览原稿';$('#openSlides').innerHTML='<span class="original-label">浏览原稿</span><span aria-hidden="true">↗</span>';
const nav=document.createElement('nav');nav.className='deck-pagination minimal-pagination';nav.setAttribute('aria-label','上下翻页');nav.innerHTML='<span class="sr-only" id="deckCounter"></span><span class="sr-only" id="deckPageName"></span><label class="deck-page-picker"><span class="sr-only">跳转到页码</span><input id="deckSelect" type="number" inputmode="numeric" min="1" max="'+pages.length+'" value="1" aria-label="跳转到页码"></label><div class="deck-page-controls"><button type="button" id="deckPrev" class="page-turn-button" aria-label="上一页" title="上一页">↑</button><button type="button" id="deckNext" class="page-turn-button" aria-label="下一页" title="下一页">↓</button></div><span class="sr-only" id="deckLive" aria-live="polite"></span>';
document.body.append(nav);

const reduceMotion=matchMedia('(prefers-reduced-motion: reduce)');
function updateUI(){const p=pages[current];document.documentElement.dataset.chromeTheme=p.matches('#top,.page-dark,#sound,#closing')?'dark':p.matches('#visual,.page-review')?'sand':'paper';$('#deckCounter').textContent=`${String(current+1).padStart(2,'0')} / ${pages.length}`;$('#deckPageName').textContent=p.dataset.pageTitle;$('#deckSelect').value=String(current+1);$('#deckPrev').disabled=current===0;$('#deckNext').disabled=current===pages.length-1;$('#deckLive').textContent=`第 ${current+1} 页，共 ${pages.length} 页，${p.dataset.pageTitle}`;document.documentElement.style.setProperty('--deck-progress',`${(current+1)/pages.length*100}%`);$$('.desktop-nav a').forEach(a=>{const active=a.hash==='#'+p.dataset.group;a.classList.toggle('active',active);if(active)a.setAttribute('aria-current','location');else a.removeAttribute('aria-current');});}
function goTo(index,{hash=true,immediate=false}={}){index=Math.max(0,Math.min(pages.length-1,Number.isFinite(index)?Math.trunc(index):current));if(index===current&&pages[index].classList.contains('is-active'))return;const old=pages[current],next=pages[index],direction=index>=current?1:-1;clearTimeout(motionTimer);pages.forEach(p=>{p.classList.remove('is-leaving');if(p!==old&&p!==next)p.classList.remove('is-active');});document.documentElement.style.setProperty('--page-direction',direction);if(immediate)track.classList.add('no-motion');if(old!==next){old.classList.remove('is-active');old.classList.add('is-leaving');}current=index;next.classList.add('is-active');pages.forEach((p,i)=>{p.inert=i!==current;p.setAttribute('aria-hidden',String(i!==current));});const scroll=next.querySelector('.page-content');if(scroll)scroll.scrollTop=0;if(hash)history.replaceState(null,'','#'+next.id);updateUI();moving=!immediate&&!reduceMotion.matches;track.classList.toggle('is-transitioning',moving);requestAnimationFrame(()=>{window.DCT_REFRESH_FRAMES?.();track.classList.remove('no-motion');});motionTimer=setTimeout(()=>{old.classList.remove('is-leaving');moving=false;track.classList.remove('is-transitioning');},moving?860:0);}
function openMaterials(id='all'){$('#sourceSearch').value='';$('#sourceSearch').dispatchEvent(new Event('input',{bubbles:true}));if(!materials.open)materials.showModal();if(id!=='all'){const target=document.getElementById(id);if(target){if(target.tagName==='DETAILS')target.open=true;requestAnimationFrame(()=>target.scrollIntoView({block:'start',behavior:'instant'}));}}else materialBody.scrollTop=0;}
materials.querySelector('[data-close-materials]').addEventListener('click',()=>materials.close());
document.addEventListener('click',e=>{const source=e.target.closest('[data-source-target]');if(source){openMaterials(source.dataset.sourceTarget);return;}const link=e.target.closest('a[href^="#"]');if(!link)return;const id=decodeURIComponent(link.getAttribute('href').slice(1));if(!id)return;const target=document.getElementById(id);if(target?.classList.contains('source-entry')){e.preventDefault();openMaterials(id);return;}const index=pages.findIndex(p=>p.id===id);if(index>=0){e.preventDefault();goTo(index);return;}if(id==='main'){e.preventDefault();main.focus();}});
$('#deckPrev').addEventListener('click',()=>goTo(current-1));$('#deckNext').addEventListener('click',()=>goTo(current+1));$('#deckSelect').addEventListener('change',e=>{if(e.target.value)goTo(+e.target.value-1);else updateUI();});$('#deckSelect').addEventListener('keydown',e=>{if(e.key==='Enter'){e.preventDefault();if(e.target.value)goTo(+e.target.value-1);else updateUI();e.target.blur();}});
function onHash(){const raw=decodeURIComponent(location.hash.slice(1)),id=raw==='review-continuity'?'review':raw;const index=pages.findIndex(p=>p.id===id);if(index>=0)goTo(index,{hash:false});else if(document.getElementById(id)?.classList.contains('source-entry'))openMaterials(id);}
addEventListener('hashchange',onHash);
function canScroll(direction,el=pages[current].querySelector('.page-content,.sound-content,.wrap')){if(!el||el.scrollHeight<=el.clientHeight+8)return false;return direction>0?el.scrollTop+el.clientHeight<el.scrollHeight-2:el.scrollTop>2;}
let wheelAmount=0,wheelConsumed=false,wheelThreshold=32,lastWheelDirection=0,lastWheelEvent=-Infinity;
addEventListener('wheel',e=>{
 if(document.querySelector('dialog[open]')||e.ctrlKey||e.target.closest('input,textarea,select,[data-scroll-panel]'))return;
 const direction=Math.sign(e.deltaY);if(!direction||Math.abs(e.deltaX)>Math.abs(e.deltaY))return;
 const now=performance.now(),fresh=now-lastWheelEvent>220,reversed=lastWheelDirection!==0&&direction!==lastWheelDirection;
 // A gesture stays consumed through its entire momentum tail, however long it lasts.
 // A pause or a deliberate reversal starts a fresh gesture, without an animation lock.
 if(fresh||reversed){wheelAmount=0;wheelConsumed=false;wheelThreshold=reversed&&!fresh?48:32;}
 lastWheelDirection=direction;lastWheelEvent=now;
 const content=e.target.closest('.page-content,.sound-content');
 if(content&&pages[current].contains(content)&&canScroll(direction,content)){wheelAmount=0;wheelConsumed=true;return;}
 e.preventDefault();
 if(wheelConsumed)return;
 wheelAmount+=e.deltaY*(e.deltaMode===1?16:e.deltaMode===2?innerHeight:1);
 if(Math.abs(wheelAmount)<wheelThreshold)return;
 wheelConsumed=true;wheelAmount=0;
 const target=Math.max(0,Math.min(pages.length-1,current+direction));
 if(target!==current)goTo(target);
},{passive:false});

document.addEventListener('keydown',e=>{if(e.defaultPrevented||document.querySelector('dialog[open]')||e.target.closest('input,textarea,select,summary,[contenteditable],[data-scroll-panel]')||(e.key===' '&&e.target.closest('button,a'))||e.altKey||e.ctrlKey||e.metaKey||e.repeat)return;let target;if(e.key==='ArrowDown'||e.key==='PageDown'||(e.key===' '&&!e.shiftKey))target=current+1;else if(e.key==='ArrowUp'||e.key==='PageUp'||(e.key===' '&&e.shiftKey))target=current-1;else if(e.key==='Home')target=0;else if(e.key==='End')target=pages.length-1;else return;e.preventDefault();goTo(target);});
let touchStart=null;addEventListener('touchstart',e=>{if(document.querySelector('dialog[open]')||e.touches.length!==1)return;touchStart={x:e.touches[0].clientX,y:e.touches[0].clientY,down:canScroll(1),up:canScroll(-1)};},{passive:true});addEventListener('touchend',e=>{if(!touchStart||document.querySelector('dialog[open]'))return;const t=e.changedTouches[0],dy=touchStart.y-t.clientY,dx=touchStart.x-t.clientX,wasScrollable=dy>0?touchStart.down:touchStart.up;touchStart=null;if(!wasScrollable&&Math.abs(dy)>75&&Math.abs(dy)>Math.abs(dx)*1.35&&!canScroll(Math.sign(dy)))goTo(current+Math.sign(dy));},{passive:true});

// Crisp billing fields and the original source region are shown together, without inventing image detail.
const billing=document.createElement('dialog');billing.id='billingDialog';billing.className='billing-dialog';billing.setAttribute('aria-labelledby','billingTitle');billing.innerHTML='<div class="dialog-toolbar"><h2 id="billingTitle">计费信息</h2><button type="button" class="dialog-button" data-close-billing aria-label="关闭计费信息">关闭 ×</button></div><div class="billing-dialog-content"></div>';document.body.append(billing);
billing.querySelector('[data-close-billing]').addEventListener('click',()=>billing.close());
document.addEventListener('click',e=>{const button=e.target.closest('[data-billing-index]');if(!button)return;const r=window.DCT_BILLING[+button.dataset.billingIndex];$('#billingTitle').textContent=`记录 ${String(r.index+1).padStart(2,'0')} · ${r.label}`;billing.querySelector('.billing-dialog-content').innerHTML=`<p class="billing-explanation">计费字段依对应原始截图转写，可与下方原图局部核对。</p><dl class="billing-readable"><div><dt>帧率</dt><dd>${r.frameRate}</dd></div><div><dt>生成时间</dt><dd>${r.time}</dd></div><div><dt>消耗积分数</dt><dd>${r.points}</dd></div></dl><p class="billing-original-label">原图计费区域</p><div class="source-frame billing-original" data-crop="${r.crop}"><img src="${asset(r.src)}" alt="记录${r.index+1}的原图计费区域"></div><button type="button" class="outline-button light-button" data-image="${r.src}" data-caption="积分消耗原始记录 ${r.index+1} · ${r.label}">查看完整原始截图 ↗</button>`;billing.showModal();requestAnimationFrame(()=>window.DCT_REFRESH_FRAMES?.());});
window.DCT_REFRESH_FRAMES?.();
const initialHash=decodeURIComponent(location.hash.slice(1));const initial=pages.findIndex(p=>p.id===(initialHash==='review-continuity'?'review':initialHash));current=initial>=0?initial:0;goTo(current,{hash:false,immediate:true});if(location.hash.startsWith('#source-'))openMaterials(location.hash.slice(1));
})();
