const story=document.querySelector('.story'),world=document.querySelector('.world'),stage=document.querySelector('.stage'),beats=[...document.querySelectorAll('.beat')],nav=[...document.querySelectorAll('.chapters a')],reduced=matchMedia('(prefers-reduced-motion: reduce)'),motion=document.querySelector('#motion'),play=document.querySelector('#play'),controls=document.querySelector('.player-controls');
const clamp=(x,a=0,b=1)=>Math.max(a,Math.min(b,x)),mix=(a,b,t)=>a+(b-a)*t;
const color=(a,b,t)=>a.map((v,i)=>Math.round(mix(v,b[i],t)));
const rgb=a=>'rgb('+a.join(',')+')';
// One persistent pair; only their position, scale and visibility changes.
const keys=[
{gx:0,gy:0,gs:1,go:1,dx:0,dy:0,ds:1,doo:1,camera:1,material:0,proposal:0,criterion:0,player:0,garden:0},
{gx:-4,gy:9,gs:.96,go:1,dx:105,dy:0,ds:.95,doo:0,camera:1,material:1,proposal:0,criterion:0,player:0,garden:0},
{gx:-7,gy:6,gs:.99,go:1,dx:105,dy:0,ds:.95,doo:0,camera:1.1,material:0,proposal:1,criterion:0,player:0,garden:.1},
{gx:-4,gy:1,gs:.95,go:1,dx:-3,dy:1,ds:.95,doo:1,camera:1,material:0,proposal:0,criterion:1,player:0,garden:1},
{gx:0,gy:0,gs:.95,go:1,dx:0,dy:0,ds:.95,doo:1,camera:.9,material:0,proposal:0,criterion:0,player:1,garden:.5}];
let positions=[],storyTop=0,storyBottom=0,pageBottom=1,raf=0,paused=false,playing=true,current=0;
function measure(){positions=beats.map(e=>e.getBoundingClientRect().top+scrollY);const r=story.getBoundingClientRect();storyTop=r.top+scrollY;storyBottom=r.bottom+scrollY;pageBottom=Math.max(1,document.documentElement.scrollHeight-innerHeight);schedule()}
function render(){raf=0;let index=0;while(index<positions.length-1&&scrollY>=positions[index+1])index++;let t=index===4?0:clamp((scrollY-positions[index])/(positions[index+1]-positions[index]));current=index+t;t=t*t*(3-2*t);
const onScreen=scrollY+innerHeight>storyTop&&scrollY<storyBottom&&!document.hidden;
document.body.classList.toggle('scene-live',onScreen&&!paused&&!reduced.matches);document.body.classList.toggle('gaucho-live',onScreen&&!paused&&!reduced.matches);document.body.classList.toggle('dama-live',onScreen&&!paused&&!reduced.matches&&(current<.85||current>2.1));document.body.classList.toggle('dance-held',current>3.5&&!playing);document.body.classList.toggle('resting',paused||document.hidden);
if(!paused){const night=matchMedia("(prefers-color-scheme: dark)").matches?1:reduced.matches?0:clamp((current-2.05)/.85),paper=[251,246,238],blue=[15,23,48],bg=color(paper,blue,night);document.body.style.setProperty('--page-bg',rgb(bg));document.body.style.setProperty('--section-bg',rgb(color([238,227,199],[22,32,63],night)));document.body.style.setProperty('--page-ink',night>.53?'#fbf6ee':'#111e42');document.body.style.setProperty('--page-accent',night>.53?'#d9a749':'#83665a');document.body.style.setProperty('--page-line',night>.53?'#d9a74955':'#83665a3b');document.body.style.setProperty('--night',night.toFixed(4));document.body.classList.toggle('dusk',night>.53);
if(!reduced.matches){const a=keys[index],b=keys[Math.min(4,index+1)];for(const k of Object.keys(a))world.style.setProperty('--'+k,mix(a[k],b[k],t).toFixed(4));const journey=clamp(current/4),small=innerWidth<=600,tablet=innerWidth<=1000&&!small;stage.style.setProperty('--sun-x',(small?mix(75,87,journey):tablet?mix(72,87,journey):mix(24,85,journey)).toFixed(3));stage.style.setProperty('--sun-y',(small?18-Math.sin(journey*Math.PI)*2:tablet?13-Math.sin(journey*Math.PI)*3:17-Math.sin(journey*Math.PI)*6).toFixed(3));stage.style.setProperty('--sun-r',mix(-12,12,journey).toFixed(3));}}
const visiblePlayer=current>3.65&&onScreen&&!reduced.matches;controls.hidden=!visiblePlayer;controls.inert=!visiblePlayer;
const active=Math.min(4,Math.floor(current+.3));nav.forEach((a,i)=>{if(i===active)a.setAttribute('aria-current','location');else a.removeAttribute('aria-current')});document.documentElement.style.setProperty('--reading',clamp(scrollY/pageBottom));}
function schedule(){if(!raf)raf=requestAnimationFrame(render)}
function flush(){if(raf)cancelAnimationFrame(raf);render()}
document.body.classList.add('enhanced');motion.hidden=false;addEventListener('scroll',schedule,{passive:true});addEventListener('resize',measure);document.addEventListener('visibilitychange',schedule);reduced.addEventListener('change',measure);
motion.addEventListener('click',()=>{paused=!paused;motion.setAttribute('aria-pressed',String(paused));motion.textContent=paused?'Reanudar movimiento':'Pausar movimiento';flush()});
play.addEventListener('click',()=>{playing=!playing;play.setAttribute('aria-pressed',String(playing));play.setAttribute('aria-label',playing?'Pausar el baile ilustrado':'Reproducir el baile ilustrado');play.innerHTML=playing?'Ⅱ <span>Pausar</span>':'▷ <span>Reproducir</span>';flush()});
document.fonts.ready.then(measure);new ResizeObserver(measure).observe(story);measure();

/* ---------- Formulario de contacto ---------- */
// TODO: pegar acá el endpoint del servicio de formularios (por ejemplo Formspree: 'https://formspree.io/f/xxxxxxx').
// Mientras esté vacío, el formulario arma el correo con los datos y abre el programa de correo de la persona.
const FORM_ENDPOINT='';
const FALLBACK_EMAIL='hola@pampamaind.com'; // TODO: confirmar el correo
const form=document.querySelector('#contact-form');
if(form){
  const status=document.querySelector('#form-status'),gracias=document.querySelector('#form-gracias'),enviar=form.querySelector('.enviar');
  const reglas={
    nombre:v=>v?'':'Escribí tu nombre y apellido.',
    telefono:v=>!v?'Dejanos un teléfono de contacto.':v.replace(/\D/g,'').length>=8?'':'Revisá el teléfono: parece incompleto.',
    correo:v=>!v?'Dejanos un correo para responderte.':/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)?'':'Revisá el correo: parece incompleto.',
    empresa:v=>v?'':'Indicá el nombre de tu empresa o negocio.',
    mensaje:v=>v?'':'Contanos en qué te podemos ayudar.'};
  const check=n=>{const el=form.elements[n],msg=reglas[n](el.value.trim());document.querySelector('#e-'+n).textContent=msg;el.setAttribute('aria-invalid',msg?'true':'false');return !msg};
  Object.keys(reglas).forEach(n=>form.elements[n].addEventListener('input',()=>{if(form.elements[n].getAttribute('aria-invalid')==='true')check(n)}));
  const listo=(nombre,texto)=>{document.querySelector('#gracias-nombre').textContent=nombre.split(' ')[0];if(texto)document.querySelector('#gracias-texto').textContent=texto;form.hidden=true;gracias.hidden=false;gracias.focus()};
  form.addEventListener('submit',e=>{
    e.preventDefault();status.textContent='';
    if(form.elements.web.value)return; // trampa para bots
    const malos=Object.keys(reglas).filter(n=>!check(n));
    if(malos.length){form.elements[malos[0]].focus();return}
    const d={};['nombre','telefono','correo','empresa','asunto','mensaje'].forEach(n=>d[n]=form.elements[n].value.trim());
    if(!FORM_ENDPOINT){
      const cuerpo='Nombre y apellido: '+d.nombre+'\nTeléfono: '+d.telefono+'\nCorreo: '+d.correo+'\nEmpresa: '+d.empresa+'\nAsunto: '+d.asunto+'\n\n'+d.mensaje;
      location.href='mailto:'+FALLBACK_EMAIL+'?subject='+encodeURIComponent('Consulta desde la web: '+d.asunto)+'&body='+encodeURIComponent(cuerpo);
      listo(d.nombre,'Se abrió tu programa de correo con el mensaje listo. Envialo y te respondemos en el día hábil.');return}
    enviar.disabled=true;
    fetch(FORM_ENDPOINT,{method:'POST',headers:{Accept:'application/json','Content-Type':'application/json'},body:JSON.stringify(d)})
      .then(r=>{if(!r.ok)throw new Error(r.status);listo(d.nombre)})
      .catch(()=>{status.textContent='No pudimos enviar el mensaje. Probá de nuevo en un momento.'})
      .finally(()=>{enviar.disabled=false});
  });
}
