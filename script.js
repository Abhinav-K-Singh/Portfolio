(function(){
  var reduce = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
  var $ = function(s){return document.querySelector(s)};

  /* preloader */
  var pre=$('#pre'), bar=$('#preBar'), num=$('#preNum');
  function hidePre(){pre.classList.add('done');setTimeout(function(){pre.style.display='none'},800)}
  if(reduce){pre.style.display='none'}
  else{
    var t0=performance.now(), dur=1100;
    (function tick(now){
      var p=Math.min(1,((now||performance.now())-t0)/dur);
      var v=Math.round(p*100);
      bar.style.width=v+'%'; num.textContent=String(v).padStart(3,'0')+'%';
      if(p<1) requestAnimationFrame(tick); else hidePre();
    })(t0);
    setTimeout(hidePre,2500);
  }

  /* theme toggle */
  $('#theme').addEventListener('click',function(){
    var r=document.documentElement, cur=r.getAttribute('data-theme');
    var dark = cur ? cur==='dark' : (window.matchMedia && matchMedia('(prefers-color-scheme: dark)').matches);
    r.setAttribute('data-theme', dark?'light':'dark');
  });

  /* cursor-tracking avatar */
  var head=$('#head'), body=$('#body'), pl=$('#pl'), pr=$('#pr'), stage=$('#stage');
  var tx=0,ty=0,cx=0,cy=0;
  function aim(x,y){
    var r=stage.getBoundingClientRect();
    var dx=(x-(r.left+r.width/2))/Math.max(r.width,300);
    var dy=(y-(r.top+r.height*0.35))/Math.max(r.height,300);
    tx=Math.max(-1,Math.min(1,dx*1.6)); ty=Math.max(-1,Math.min(1,dy*1.6));
  }
  if(!reduce){
    window.addEventListener('pointermove',function(e){aim(e.clientX,e.clientY)},{passive:true});
    (function frame(){
      cx+=(tx-cx)*0.12; cy+=(ty-cy)*0.12;
      head.setAttribute('transform','translate('+(cx*9).toFixed(2)+' '+(cy*5).toFixed(2)+') rotate('+(cx*5).toFixed(2)+' 200 200)');
      body.setAttribute('transform','translate('+(cx*3).toFixed(2)+' 0)');
      var px=cx*5, py=cy*4;
      pl.setAttribute('cx',178+px);pl.setAttribute('cy',142+py);
      pr.setAttribute('cx',222+px);pr.setAttribute('cy',142+py);
      requestAnimationFrame(frame);
    })();
    /* blink */
    var lids=[$('#lidL'),$('#lidR')];
    (function blink(){
      lids.forEach(function(l){l.setAttribute('height',26)});
      setTimeout(function(){lids.forEach(function(l){l.setAttribute('height',0)})},120);
      setTimeout(blink,2500+Math.random()*2500);
    })();
  }

  /* medallion tabs */
  var data={
    bronze:{t:'Bronze: raw landing',p:'Files arrive exactly as the source sent them. Nothing is thrown away, so any run can be replayed.',l:['1000+ files ingested and tracked each day','Structured and semi-structured sources','Orchestrated with Azure Data Factory and Control-M','Stored in Azure Data Lake Storage']},
    silver:{t:'Silver: cleaned and trusted',p:'Data is validated, de-duplicated and standardised. Sensitive fields are protected before anyone downstream sees them.',l:['Data quality validation checks','Masking and encryption across 10M+ sensitive records','Spark SQL transformations tuned for speed','Monitoring tied to SLAs']},
    gold:{t:'Gold: ready for reporting',p:'Modelled tables that analysts and finance teams query directly. They are fast, documented and consistent.',l:['35% faster analytical queries','Delivered to Snowflake for enterprise reporting','Documented transformation specs','Version-controlled and deployed through Azure DevOps CI/CD']}
  };
  var tabs=document.querySelectorAll('.layer'), det=$('#detail');
  function show(k){
    tabs.forEach(function(b){b.setAttribute('aria-selected',b.dataset.l===k)});
    var d=data[k];
    det.innerHTML='<span class="label">Layer</span><h3></h3><p></p><ul></ul>';
    det.querySelector('h3').textContent=d.t; det.querySelector('p').textContent=d.p;
    var ul=det.querySelector('ul'); d.l.forEach(function(x){var li=document.createElement('li');li.textContent=x;ul.appendChild(li)});
  }
  tabs.forEach(function(b){
    b.addEventListener('click',function(){show(b.dataset.l)});
    b.addEventListener('mouseenter',function(){show(b.dataset.l)});
  });
  show('bronze');

  /* mobile menu */
  var hdr=$('#hdr'), burger=$('#burger');
  burger.addEventListener('click',function(){var o=hdr.classList.toggle('menu-open');burger.setAttribute('aria-expanded',o)});
  document.querySelectorAll('nav ul a').forEach(function(a){a.addEventListener('click',function(){hdr.classList.remove('menu-open');burger.setAttribute('aria-expanded','false')})});

  /* scroll progress */
  var prog=$('#prog');
  function onScroll(){var h=document.documentElement.scrollHeight-innerHeight;prog.style.transform='scaleX('+(h>0?Math.min(1,scrollY/h):0)+')'}
  addEventListener('scroll',onScroll,{passive:true});onScroll();

  /* scroll reveal (movement only, text stays visible) */
  var rv=document.querySelectorAll('.sec-head,.metrics,.about,.med,.runner,.gitwrap,.sqlbox,.projects,.reco,.contact>*');
  if('IntersectionObserver' in window&&!reduce){
    var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}})},{threshold:.08});
    rv.forEach(function(n){n.classList.add('rv');io.observe(n)});
  }

  /* count-up for metrics */
  var nums=document.querySelectorAll('.metrics strong');
  if('IntersectionObserver' in window&&!reduce){
    var co=new IntersectionObserver(function(es){es.forEach(function(e){
      if(!e.isIntersecting)return; co.unobserve(e.target);
      var el=e.target,n=+el.dataset.n,s=el.dataset.s,t0=performance.now();
      (function step(now){var p=Math.min(1,(now-t0)/1400),v=Math.round(n*(1-Math.pow(1-p,3)));el.textContent=v+s;if(p<1)requestAnimationFrame(step)})(t0);
    })},{threshold:.6});
    nums.forEach(function(n){co.observe(n)});
  }

  /* cursor glow + card tilt (mouse only) */
  var glow=$('#glow');
  if(matchMedia('(pointer:fine)').matches&&!reduce){
    addEventListener('pointermove',function(e){glow.style.opacity=1;glow.style.transform='translate('+e.clientX+'px,'+e.clientY+'px)'},{passive:true});
    document.querySelectorAll('.proj,.cert,.award').forEach(function(c){
      c.addEventListener('pointermove',function(e){var r=c.getBoundingClientRect(),x=(e.clientX-r.left)/r.width-.5,y=(e.clientY-r.top)/r.height-.5;c.style.transform='perspective(700px) rotateY('+(x*7).toFixed(2)+'deg) rotateX('+(-y*7).toFixed(2)+'deg) translateY(-4px)'});
      c.addEventListener('pointerleave',function(){c.style.transform=''});
    });
  }

  /* data-flow canvas: records drift Bronze -> Silver -> Gold */
  var cv=$('#flow'),ctx=cv.getContext('2d'),W=0,H=0,P=[],mx=-999,my=-999,cols=[],vis=true,fr=0;
  function getCols(){var s=getComputedStyle(document.documentElement);cols=['--bronze','--silver','--gold'].map(function(k){return s.getPropertyValue(k).trim()||'#888'})}
  function spawn(r){return{x:r?Math.random()*W:-12,y:Math.random()*H,v:.35+Math.random()*1,s:1.2+Math.random()*2.4,o:Math.random()*6}}
  function size(){var r=cv.getBoundingClientRect(),d=Math.min(2,devicePixelRatio||1);W=r.width;H=r.height;cv.width=W*d;cv.height=H*d;ctx.setTransform(d,0,0,d,0,0);P=[];var n=Math.min(260,Math.round(W*H/8000));for(var i=0;i<n;i++)P.push(spawn(true));getCols()}
  function draw(){
    ctx.clearRect(0,0,W,H);
    for(var i=0;i<P.length;i++){var p=P[i];
      p.x+=reduce?0:p.v; p.y+=reduce?0:Math.sin(p.x*.012+p.o)*.35;
      var dx=p.x-mx,dy=p.y-my,d2=dx*dx+dy*dy;
      if(d2<12100&&d2>1){var f=(110-Math.sqrt(d2))/110;p.x+=dx/Math.sqrt(d2)*f*3;p.y+=dy/Math.sqrt(d2)*f*3}
      if(p.x>W+12)P[i]=spawn(false);
      var t=p.x/W;ctx.fillStyle=cols[t<.34?0:t<.67?1:2];
      ctx.globalAlpha=.25+.6*Math.min(1,p.v/1.2);
      var len=t<.34?p.s*3.4:t<.67?p.s*2.2:p.s*1.2;
      ctx.fillRect(p.x,p.y,len,p.s*(t<.34?.7:t<.67?1:1.4));
    }
    ctx.globalAlpha=1;
  }
  function loop(){if(vis){fr++;if(fr%90===0)getCols();draw()}requestAnimationFrame(loop)}
  size();draw();
  if(!reduce){
    addEventListener('resize',function(){size()});
    $('.hero').addEventListener('pointermove',function(e){var r=cv.getBoundingClientRect();mx=e.clientX-r.left;my=e.clientY-r.top},{passive:true});
    $('.hero').addEventListener('pointerleave',function(){mx=my=-999});
    if('IntersectionObserver' in window)new IntersectionObserver(function(es){vis=es[0].isIntersecting}).observe(cv);
    loop();
  }

  /* pipeline simulation */
  var nodes=document.querySelectorAll('.node'),rfill=$('#rfill'),rcount=$('#rcount'),term=$('#term'),runBtn=$('#run'),running=false,ran=false;
  var logs=[['ADF','trigger daily_load: 1000+ files detected',0,'--muted'],['BRONZE','raw files landed in ADLS',1,'--bronze'],['SILVER','data quality checks passed',2,'--silver'],['SILVER','masking and encryption applied to sensitive fields',2,'--silver'],['GOLD','Spark SQL transforms complete, runtime down 35%',3,'--gold'],['SNOWFLAKE','published for reporting. SLA met',4,'--accent']];
  function setCount(n){rcount.textContent=n.toLocaleString('en-US')}
  function tween(to){var from=+rcount.textContent.replace(/,/g,'')||0,t0=performance.now();(function st(now){var p=Math.min(1,(now-t0)/550);setCount(Math.round(from+(to-from)*p));if(p<1)requestAnimationFrame(st)})(t0)}
  function addLine(l){var d=document.createElement('div'),t=document.createElement('span');t.className='tg';t.style.color='var('+l[3]+')';t.textContent='['+l[0]+'] ';d.appendChild(t);d.appendChild(document.createTextNode(l[1]));term.appendChild(d)}
  function paint(i){nodes.forEach(function(n,k){n.className='node'+(k<logs[i][2]?' done':k===logs[i][2]?' on':'')});rfill.style.width=Math.round((i+1)/logs.length*100)+'%'}
  function finish(){nodes.forEach(function(n){n.className='node done'});running=false;runBtn.disabled=false;runBtn.textContent='↻ Run again';var d=document.createElement('div');d.textContent='$ done. 10,000,000 records, 0 failures.';term.appendChild(d)}
  function run(){
    if(running)return;running=true;ran=true;runBtn.disabled=true;term.textContent='';nodes.forEach(function(n){n.className='node'});rfill.style.width='0';setCount(0);
    var i=0;
    (function next(){
      if(i>=logs.length){finish();return}
      addLine(logs[i]);paint(i);tween(Math.round(10000000*(i+1)/logs.length));i++;
      setTimeout(next,reduce?0:800);
    })();
  }
  runBtn.addEventListener('click',run);
  if('IntersectionObserver' in window&&!reduce){new IntersectionObserver(function(es,o){if(es[0].isIntersecting&&!ran){o.disconnect();run()}},{threshold:.5}).observe($('.runner'))}

  /* commit filters */
  var fb=document.querySelectorAll('.fbtn'),cm=document.querySelectorAll('.commit');
  fb.forEach(function(b){b.addEventListener('click',function(){
    fb.forEach(function(x){x.setAttribute('aria-pressed',x===b)});
    cm.forEach(function(c){c.hidden=!(b.dataset.f==='all'||c.dataset.t===b.dataset.f||c.dataset.t==='init'&&b.dataset.f==='all')});
  })});

  /* skills as SQL */
  var tools=[['Azure Databricks','Cloud & storage'],['Azure Data Factory','Cloud & storage'],['Azure Data Lake Storage','Cloud & storage'],['Snowflake','Cloud & storage'],['Azure DevOps','Cloud & storage'],['PySpark','Processing & languages'],['Spark SQL','Processing & languages'],['SQL','Processing & languages'],['Python','Processing & languages'],['Git','Engineering practices'],['CI/CD','Engineering practices'],['Data quality validation','Engineering practices'],['Pipeline documentation','Engineering practices'],['Databricks Workflows','Orchestration & tools'],['Control-M','Orchestration & tools'],['SSMS','Orchestration & tools']];
  var cats=['All'].concat(tools.map(function(t){return t[1]}).filter(function(c,i,a){return a.indexOf(c)===i}));
  var catBox=$('#cats'),tb=$('#tb'),sq=$('#sqlq'),cnt=$('#cnt'),curCat='All';
  function drawSql(){
    var rows=tools.filter(function(t){return curCat==='All'||t[1]===curCat});
    sq.innerHTML='';
    function kw(t){var e=document.createElement('span');e.className='kw';e.textContent=t;return e}
    function tx(t){return document.createTextNode(t)}
    sq.appendChild(kw('SELECT'));sq.appendChild(tx(' tool, category\n'));sq.appendChild(kw('FROM'));sq.appendChild(tx(' abhinav.toolbox'));
    if(curCat!=='All'){sq.appendChild(tx('\n'));sq.appendChild(kw('WHERE'));sq.appendChild(tx(' category = '));var st=document.createElement('span');st.className='str';st.textContent="'"+curCat+"'";sq.appendChild(st)}
    sq.appendChild(tx(';'));
    tb.innerHTML='';
    rows.forEach(function(t,i){var tr=document.createElement('tr');if(!reduce){tr.className='rin';tr.style.animationDelay=(i*30)+'ms'}
      [String(i+1).padStart(2,'0'),t[0],t[1]].forEach(function(v){var td=document.createElement('td');td.textContent=v;tr.appendChild(td)});tb.appendChild(tr)});
    cnt.textContent='('+rows.length+' rows)';
    catBox.querySelectorAll('.fbtn').forEach(function(b){b.setAttribute('aria-pressed',b.dataset.c===curCat)});
  }
  cats.forEach(function(c){var b=document.createElement('button');b.type='button';b.className='fbtn';b.dataset.c=c;b.textContent=c;b.addEventListener('click',function(){curCat=c;drawSql()});catBox.appendChild(b)});
  drawSql();

  /* resume download */
  document.querySelectorAll('[data-resume]').forEach(function(a){
    a.addEventListener('click',async function(e){
      if(!(window.claude&&claude.use))return;
      e.preventDefault();
      var name='Abhinav_Kumar_Singh_Resume.pdf';
      try{
        var d=await claude.use('downloads');
        if(d){var r=await fetch(name);var blob=await r.blob();await d.save({filename:name,data:blob});return}
      }catch(err){if(err&&err.code==='declined')return}
      var l=document.createElement('a');l.href=name;l.target='_blank';l.rel='noopener';document.body.appendChild(l);l.click();l.remove();
    });
  });

  /* copy buttons */
  document.querySelectorAll('[data-copy]').forEach(function(b){
    b.addEventListener('click',function(){
      var node=document.getElementById(b.dataset.copy), txt=node.textContent;
      function sel(){var r=document.createRange();r.selectNodeContents(node);var s=getSelection();s.removeAllRanges();s.addRange(r)}
      var done=function(m){b.textContent=m;setTimeout(function(){b.textContent='Copy'},1600)};
      if(navigator.clipboard&&navigator.clipboard.writeText){navigator.clipboard.writeText(txt).then(function(){done('Copied')},function(){sel();done('Selected')})}
      else{sel();done('Selected')}
    });
  });
})();
