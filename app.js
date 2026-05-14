// ═══════════════════════════════════════════════════════════════
// DATA
// ═══════════════════════════════════════════════════════════════
const PIECE_KEYS=['knight','alfil','leaper','antelope','dabbaba','wazir','ferz','zebra'];
const MOVES={
  knight:  [[-2,-1],[-2,1],[-1,-2],[-1,2],[1,-2],[1,2],[2,-1],[2,1]],
  alfil:   [[-2,-2],[-2,2],[2,-2],[2,2]],
  leaper:  [[-3,0],[3,0],[0,-3],[0,3]],
  antelope:[[-4,-3],[-4,3],[4,-3],[4,3],[-3,-4],[-3,4],[3,-4],[3,4]],
  dabbaba: [[-2,0],[2,0],[0,-2],[0,2]],
  wazir:   [[-1,0],[1,0],[0,-1],[0,1]],
  ferz:    [[-1,-1],[-1,1],[1,-1],[1,1]],
  zebra:   [[-2,-3],[-2,3],[2,-3],[2,3],[-3,-2],[-3,2],[3,-2],[3,2]],
};
const PIECE_INFO={
  knight:  {label:'Knight',   desc:'L-shape jump: 2 orthogonal + 1 sideways. Leaps over pieces.'},
  alfil:   {label:'Alfil',    desc:'Diagonal jump exactly 2 squares. Leaps over pieces.'},
  leaper:  {label:'Leaper',   desc:'Orthogonal jump exactly 3 squares. Leaps over pieces.'},
  antelope:{label:'Antelope', desc:'L-jump 4+3 squares. Longer-range knight.'},
  dabbaba: {label:'Dabbaba',  desc:'Orthogonal jump exactly 2 squares. Leaps over pieces.'},
  wazir:   {label:'Wazir',    desc:'One step orthogonally: up / down / left / right.'},
  ferz:    {label:'Ferz',     desc:'One step diagonally in any of 4 directions.'},
  zebra:   {label:'Zebra',    desc:'L-jump 3+2 squares. Wider version of the knight.'},
};
const PIECE_ICONS={
  knight:'♞',
  alfil:'◇',
  leaper:'⊕',
  antelope:'◈',
  dabbaba:'▫',
  wazir:'✛',
  ferz:'✕',
  zebra:'◆',
};
const TN=['Red','Blue','Green','Purple','Orange','Teal','Coral','Gray','Violet','Cyan'];
const TC=['#E24B4A','#378ADD','#639922','#7F77DD','#EF9F27','#1D9E75','#E27A5A','#888780','#9B59B6','#00BCD4'];

// OEIS refs for trapped pieces (known results)
const TRAPPED_OEIS={
  knight:'A316667 — 2016 steps, final square 2084',
  zebra:'no OEIS entry yet — computed here',
  antelope:'no OEIS entry yet — computed here',
};

const MODES={
  '2k':{label:'2 Knights',g:'Multiple Knights',rps:false,
    desc:'Red & black knights alternate, each placed on the lowest spiral number not attacked by the other. The classic Numberphile setup.',
    teams:[{name:'Red knight',color:'#E24B4A',piece:'knight',avoids:[1]},{name:'Black knight',color:'#2C2C2A',piece:'knight',avoids:[0]}]},
  '3k':{label:'3 Knights',g:'Multiple Knights',rps:false,
    desc:'Three knights alternate. Each avoids squares attacked by either of the other two.',
    teams:[{name:'Red',color:'#E24B4A',piece:'knight',avoids:[1,2]},{name:'Blue',color:'#378ADD',piece:'knight',avoids:[0,2]},{name:'Green',color:'#639922',piece:'knight',avoids:[0,1]}]},
  '4k':{label:'4 Knights',g:'Multiple Knights',rps:false,
    desc:'Four knight colours, each avoiding all three others.',
    teams:[{name:'Red',color:'#E24B4A',piece:'knight',avoids:[1,2,3]},{name:'Blue',color:'#378ADD',piece:'knight',avoids:[0,2,3]},{name:'Green',color:'#639922',piece:'knight',avoids:[0,1,3]},{name:'Purple',color:'#7F77DD',piece:'knight',avoids:[0,1,2]}]},
  '5k':{label:'5 Knights',g:'Multiple Knights',rps:false,
    desc:'Five knight colours, each avoiding all four others.',
    teams:[{name:'Red',color:'#E24B4A',piece:'knight',avoids:[1,2,3,4]},{name:'Blue',color:'#378ADD',piece:'knight',avoids:[0,2,3,4]},{name:'Green',color:'#639922',piece:'knight',avoids:[0,1,3,4]},{name:'Purple',color:'#7F77DD',piece:'knight',avoids:[0,1,2,4]},{name:'Orange',color:'#EF9F27',piece:'knight',avoids:[0,1,2,3]}]},
  'alfil_leaper':{label:'Alfil + Leaper',g:'Mixed Pieces',rps:false,
    desc:'Black alfil (±2 diagonal) vs orange leaper (±3 orthogonal).',
    teams:[{name:'Black alfil',color:'#2C2C2A',piece:'alfil',avoids:[1]},{name:'Orange leaper',color:'#EF9F27',piece:'leaper',avoids:[0]}]},
  'kn_ant':{label:'Knight + Antelope',g:'Mixed Pieces',rps:false,
    desc:'Black knight vs cyan antelope (4-3 leaper). "Like star destroyers."',
    teams:[{name:'Black knight',color:'#2C2C2A',piece:'knight',avoids:[1]},{name:'Cyan antelope',color:'#1D9E75',piece:'antelope',avoids:[0]}]},
  'kn_zeb':{label:'Knight + Zebra',g:'Mixed Pieces',rps:false,
    desc:'Black knight vs red zebra (2-3 leaper). "Mandelbrot-level coolness."',
    teams:[{name:'Black knight',color:'#2C2C2A',piece:'knight',avoids:[1]},{name:'Red zebra',color:'#E24B4A',piece:'zebra',avoids:[0]}]},
  'kn_dab_waz':{label:'Knight+Dabbaba+Wazir×2',g:'Mixed Pieces',rps:false,
    desc:'Four-piece: knight, dabbaba, and two wazirs — each avoids all others.',
    teams:[{name:'Black knight',color:'#2C2C2A',piece:'knight',avoids:[1,2,3]},{name:'Red dabbaba',color:'#E24B4A',piece:'dabbaba',avoids:[0,2,3]},{name:'Cyan wazir',color:'#1D9E75',piece:'wazir',avoids:[0,1,3]},{name:'Purple wazir',color:'#7F77DD',piece:'wazir',avoids:[0,1,2]}]},
  'waz_ferz':{label:'Wazir+Ferz ×2 each',g:'Mixed Pieces',rps:false,
    desc:'Two wazirs vs two ferzes. "How is this happening?"',
    teams:[{name:'Black wazir',color:'#2C2C2A',piece:'wazir',avoids:[1,2,3]},{name:'Red ferz',color:'#E24B4A',piece:'ferz',avoids:[0,2,3]},{name:'Cyan wazir',color:'#1D9E75',piece:'wazir',avoids:[0,1,3]},{name:'Purple ferz',color:'#7F77DD',piece:'ferz',avoids:[0,1,2]}]},
  'rps_kn':{label:'RPS: Knights',g:'Rock-Paper-Scissors',rps:true,
    desc:'Rock-Paper-Scissors knights. Each team only avoids the one team that beats it — NOT all opponents.',
    teams:[{name:'Rock',color:'#888780',piece:'knight',avoids:[1]},{name:'Paper',color:'#E24B4A',piece:'knight',avoids:[2]},{name:'Scissors',color:'#378ADD',piece:'knight',avoids:[0]}]},
  'rps_mix':{label:'RPS: Knight/Zebra/Antelope',g:'Rock-Paper-Scissors',rps:true,
    desc:'RPS with different piece types: Rock=knight, Paper=zebra, Scissors=antelope.',
    teams:[{name:'Rock: knight',color:'#888780',piece:'knight',avoids:[1]},{name:'Paper: zebra',color:'#E24B4A',piece:'zebra',avoids:[2]},{name:'Scissors: antelope',color:'#378ADD',piece:'antelope',avoids:[0]}]},
  'rps_wkf':{label:'RPS: Wazir/Knight/Ferz',g:'Rock-Paper-Scissors',rps:true,
    desc:'RPS with very different ranges: Rock=wazir, Paper=knight, Scissors=ferz.',
    teams:[{name:'Rock: wazir',color:'#888780',piece:'wazir',avoids:[1]},{name:'Paper: knight',color:'#E24B4A',piece:'knight',avoids:[2]},{name:'Scissors: ferz',color:'#378ADD',piece:'ferz',avoids:[0]}]},
  // ── Trapped Knight modes ──
  'tk_knight':{label:'Trapped Knight ♞',g:'Trapped',trapped:true,piece:'knight',
    desc:'A single knight starts at spiral square 1 and always moves to the lowest-numbered unvisited square it can reach. On the infinite Ulam spiral it gets trapped after exactly 2016 moves (OEIS A316667). The trail below shows early moves in blue → late moves in red.'},
  'tk_zebra':{label:'Trapped Zebra ◆',g:'Trapped',trapped:true,piece:'zebra',
    desc:'A zebra (3+2 L-jump) follows the same greedy rule: always move to the lowest-numbered unvisited reachable square. Wider leaps mean a different trapping geometry — click Generate to discover how many moves it survives.'},
  'tk_antelope':{label:'Trapped Antelope ◈',g:'Trapped',trapped:true,piece:'antelope',
    desc:'An antelope (4+3 L-jump) follows the greedy lowest-unvisited rule. Its long range creates an unusually sparse trail before eventually closing in on itself.'},
  'cm':{label:'Custom — Mixed pieces',g:'Custom',rps:false,custom:true,
    desc:'Design your own: pick up to 10 teams each with any piece. All teams avoid all others.'},
  'cr':{label:'Custom — RPS cycle',g:'Custom',rps:true,custom:true,
    desc:'Design your own RPS cycle: 3–10 teams. Each team only avoids the next in the cycle.'},
};
const MODE_GROUPS=[
  {label:'Trapped',         keys:['tk_knight','tk_zebra','tk_antelope']},
  {label:'Multiple Knights',keys:['2k','3k','4k','5k']},
  {label:'Mixed Pieces',    keys:['alfil_leaper','kn_ant','kn_zeb','kn_dab_waz','waz_ferz']},
  {label:'Rock-Paper-Scissors',keys:['rps_kn','rps_mix','rps_wkf']},
  {label:'Custom',          keys:['cm','cr']},
];
const SIZE_GROUPS=[
  {label:'Instant',      sizes:[16,32,64,128,256,512,1024], warn:0},
  {label:'Moderate',     sizes:[2048,4096],                 warn:1},
  {label:'⚠ Slow',       sizes:[8192,16384],                warn:2},
  {label:'✗ Not feasible',sizes:[32768,65536],              warn:3},
];
const ELI_TEXT={
  16:`<p>Squares on an infinite chessboard are numbered using an <strong>Ulam spiral</strong> — starting at 1 in the centre, spiralling outward. This app has two completely different games that both use that numbered board.</p>
<p><strong>Competitive placement</strong> (Multiple Knights, Mixed Pieces, RPS modes): two or more knight armies take turns <em>placing</em> a piece on the lowest unoccupied square the enemy cannot jump to. No piece ever gets stuck — there is always a free square further out. The mystery is that after thousands of placements a huge striped pattern appears, even though each piece only looked one move ahead.</p>
<p><strong>Trapped Knight / Zebra / Antelope</strong>: one single piece starts at square 1 and <em>moves</em> each turn to the lowest-numbered square it can reach that it has not visited before. It leaves a trail of visited squares behind it. Eventually every square within jumping distance has already been visited and the piece cannot move — it is genuinely trapped. A standard knight gets trapped after exactly <strong>2,016 moves</strong>.</p>
<p>At small scales competitive placement looks messy. But zoom out to <strong>10,000+ squares</strong> and distinct stripes appear. At a <strong>million squares</strong>, black dominates two quadrants and red two others, with thin "undecided" strips between. None of the pieces "know" the global pattern — it emerges purely from local rules.</p>`,
  32:`<p>This app explores two distinct phenomena that both use a spiral-ordered chessboard.</p>
<p><strong>Competitive sequential placement</strong> (Multiple Knights, Mixed Pieces, RPS): armies alternate placing pieces on the lowest available square not attacked by an opponent. No piece ever gets stuck — the frontier always advances. The mutual avoidance creates effective long-range correlations: pieces placed early constrain pieces placed at large distances. <strong>Phase separation</strong> emerges — the system spontaneously breaks symmetry into large territorial domains.</p>
<p><strong>Trapped leapers</strong> (Trapped Knight / Zebra / Antelope): a single piece executes a <em>greedy walk</em>, always jumping to the lowest unvisited reachable square. Its own trail eventually encircles it and it cannot move. The knight terminates after <strong>2,016 steps</strong> on square 2,084 (OEIS A316667). This is not a placement game — it is a finite sequence with a definite end.</p>
<p>The phenomenon mirrors <strong>ferromagnetic domain formation</strong> in physics, <strong>Turing reaction-diffusion patterns</strong> in biology (leopard spots, fish stripes), and <strong>Wolfram's elementary cellular automata</strong> (Rule 110 produces class-4 complexity from a one-line rule). The spiral ordering is the crucial ingredient — it determines which symmetry breaks and how. Different piece geometries produce qualitatively different large-scale patterns.</p>`,
  64:`<p>Two structurally different problems share this interface.</p>
<p><strong>Competitive placement</strong>: let f: ℕ → ℤ² be the Ulam spiral bijection. Define a two-colouring C: ℕ → {R,B} by greedy algorithm: C(n)=R if f(n) is not in the attack set of any m&lt;n with C(m)=B, symmetrically for B. The resulting colouring exhibits <strong>spontaneous symmetry breaking</strong> — despite C(1)=B being the only asymmetry, the large-scale pattern violates the 8-fold dihedral symmetry of the knight graph. Domain walls scale as O(√n) relative to domain size O(n), consistent with ξ ~ √n — analogous to the 2D Ising model at T<sub>c</sub>. The system is Wolfram <strong>Class 4</strong>.</p>
<p><strong>Trapped leaper</strong>: define a walk W: ℕ → ℤ² where W(0)=f(1) and W(t+1)=f(min{k : f(k) ∈ N(W(t)), k ∉ {snum(W(s)) : s≤t}}), where N(p) is the set of squares reachable in one move from p. The walk is finite: the greedy-minimum strategy guarantees the piece excavates a region around low-numbered squares until it is encircled by its own trail. For the standard knight, |W|=2016 and W terminates at f(2084). The sequence (snum(W(t))) is OEIS A316667. No piece is ever "placed" — all squares remain available to any future step except those already in the trail.</p>
<p>The effect persists for all knight-like leapers but changes qualitatively for pieces with different symmetry groups. Computationally discovered by Jonas Karlsson, reported to Neil Sloane — a surprise even to combinatorial number theorists.</p>`,
};

// ═══════════════════════════════════════════════════════════════
// POPULATE SELECTS
// ═══════════════════════════════════════════════════════════════
(()=>{
  const msel=document.getElementById('modeSelect');
  for(const g of MODE_GROUPS){
    const og=document.createElement('optgroup'); og.label=g.label;
    for(const k of g.keys){
      const o=document.createElement('option'); o.value=k; o.textContent=MODES[k].label;
      og.appendChild(o);
    }
    msel.appendChild(og);
  }
  msel.value='2k';
  const ssel=document.getElementById('sizeSelect');
  for(const sg of SIZE_GROUPS){
    const og=document.createElement('optgroup'); og.label=sg.label;
    for(const n of sg.sizes){
      const o=document.createElement('option'); o.value=n;
      o.textContent=n.toLocaleString();
      if(n===16) o.selected=true;
      og.appendChild(o);
    }
    ssel.appendChild(og);
  }
})();

// ═══════════════════════════════════════════════════════════════
// CORE ALGORITHM — competitive placement
// ═══════════════════════════════════════════════════════════════
function getAttacks(piece,r,c,n){
  const res=[];
  for(const[dr,dc]of MOVES[piece]){const nr=r+dr,nc=c+dc;if(nr>=0&&nr<n&&nc>=0&&nc<n)res.push(nr*n+nc);}
  return res;
}
// Ulam spiral: right→UP→left→down
function genSpiral(n){
  const pos=new Int32Array(n*n+1);
  const snum=(n<=300)?new Int32Array(n*n):null;
  const DR=[0,-1,0,1],DC=[1,0,-1,0];
  let r=Math.floor((n-1)/2),c=Math.floor((n-1)/2),dir=0,k=1;
  pos[k]=r*n+c; if(snum)snum[r*n+c]=k; k++;
  for(let steps=1;k<=n*n;steps++){
    for(let rep=0;rep<2&&k<=n*n;rep++){
      for(let i=0;i<steps&&k<=n*n;i++){
        const nr=r+DR[dir],nc=c+DC[dir];
        if(nr>=0&&nr<n&&nc>=0&&nc<n){r=nr;c=nc;pos[k]=r*n+c;if(snum)snum[r*n+c]=k;k++;}
      }
      dir=(dir+1)%4;
    }
  }
  return{pos,snum};
}
function simulate(n,teams){
  const{pos,snum}=genSpiral(n); const total=n*n;
  const cg=new Int8Array(total).fill(-1);
  const placed=new Uint8Array(total);
  const forb=teams.map(()=>new Uint8Array(total));
  const next=new Array(teams.length).fill(1);
  const avoiders=teams.map(()=>[]);
  teams.forEach((t,i)=>t.avoids.forEach(j=>avoiders[j].push(i)));
  for(let t=0;t<total;t++){
    const ti=t%teams.length,fb=forb[ti];
    for(let num=next[ti];num<=total;num++){
      next[ti]=num+1; const idx=pos[num];
      if(placed[idx]||fb[idx]) continue;
      cg[idx]=ti; placed[idx]=1;
      const r2=Math.floor(idx/n),c2=idx%n;
      for(const aidx of getAttacks(teams[ti].piece,r2,c2,n))
        for(const aj of avoiders[ti]) forb[aj][aidx]=1;
      break;
    }
  }
  return{cg,snum};
}

// ═══════════════════════════════════════════════════════════════
// CORE ALGORITHM — trapped piece
// ═══════════════════════════════════════════════════════════════
// Board must be large enough to contain the full path.
// 401×401 covers ±200 cells from centre — sufficient for all known trapped paths.
const TRAPPED_N = 401;

function simulateTrapped(piece){
  const N=TRAPPED_N, total=N*N;
  const DR=[0,-1,0,1], DC=[1,0,-1,0];
  // snumFull[gridIndex] = spiral number at that cell
  const snumFull=new Int32Array(total);
  let r=Math.floor((N-1)/2), c=Math.floor((N-1)/2), dir=0, k=1;
  snumFull[r*N+c]=k; k++;
  for(let steps=1;k<=total;steps++){
    for(let rep=0;rep<2&&k<=total;rep++){
      for(let i=0;i<steps&&k<=total;i++){
        const nr=r+DR[dir], nc=c+DC[dir];
        if(nr>=0&&nr<N&&nc>=0&&nc<N){r=nr;c=nc;snumFull[r*N+c]=k;k++;}
      }
      dir=(dir+1)%4;
    }
  }
  // posArr[spiralNum] = grid index
  const posArr=new Int32Array(total+1);
  for(let i=0;i<total;i++) posArr[snumFull[i]]=i;

  const visited=new Uint8Array(total);
  const path=[]; // {spiralNum, idx, row, col}
  const MAX_STEPS=500000; // safeguard

  let curIdx=posArr[1];
  visited[curIdx]=1;
  path.push({spiralNum:1,idx:curIdx,row:Math.floor(curIdx/N),col:curIdx%N});

  while(path.length<MAX_STEPS){
    const {row:cr,col:cc}=path[path.length-1];
    let bestNum=Infinity, bestIdx=-1, bestR=-1, bestC=-1;
    for(const[dr,dc]of MOVES[piece]){
      const nr=cr+dr, nc=cc+dc;
      if(nr<0||nr>=N||nc<0||nc>=N) continue;
      const nIdx=nr*N+nc;
      if(visited[nIdx]) continue;
      const sn=snumFull[nIdx];
      if(sn>0&&sn<bestNum){bestNum=sn;bestIdx=nIdx;bestR=nr;bestC=nc;}
    }
    if(bestIdx===-1) break;
    visited[bestIdx]=1;
    path.push({spiralNum:bestNum,idx:bestIdx,row:bestR,col:bestC});
  }
  return{path,N,snumFull};
}

// ═══════════════════════════════════════════════════════════════
// RENDERING — competitive placement
// ═══════════════════════════════════════════════════════════════
const canvas=document.getElementById('canvas');
const ctx=canvas.getContext('2d');
function canvasSz(){const a=document.getElementById('app'),s=getComputedStyle(a);return a.clientWidth-parseFloat(s.paddingLeft)-parseFloat(s.paddingRight);}
function hexToRGB(h){return[parseInt(h.slice(1,3),16),parseInt(h.slice(3,5),16),parseInt(h.slice(5,7),16)];}
function luma(h){const[r,g,b]=hexToRGB(h);return 0.299*r+0.587*g+0.114*b;}
function render(n,cg,snum,teams,shape){
  const sz=canvasSz();
  canvas.width=sz; canvas.height=sz; canvas.style.width=sz+'px'; canvas.style.height=sz+'px';
  const colors=['#f0efea',...teams.map(t=>t.color)];
  const cellPx=sz/n;
  ctx.fillStyle='#f0efea'; ctx.fillRect(0,0,sz,sz);
  if(cellPx>=1){
    const showNums=snum&&cellPx>=8;
    if(showNums){const fp=Math.max(6,Math.min(Math.floor(cellPx*.42),14));ctx.font=`${fp}px monospace`;ctx.textAlign='center';ctx.textBaseline='middle';}
    for(let r=0;r<n;r++) for(let c=0;c<n;c++){
      const ti=cg[r*n+c],col=colors[ti+1];
      const x0=Math.floor(c*sz/n),y0=Math.floor(r*sz/n),x1=Math.floor((c+1)*sz/n),y1=Math.floor((r+1)*sz/n),w=x1-x0,h=y1-y0;
      ctx.fillStyle=col;
      if(shape==='circle'){ctx.beginPath();ctx.arc(x0+w/2,y0+h/2,Math.min(w,h)*.4,0,Math.PI*2);ctx.fill();}
      else ctx.fillRect(x0,y0,w,h);
      if(showNums){ctx.fillStyle=luma(col)<128?'rgba(255,255,255,.8)':'rgba(0,0,0,.5)';ctx.fillText(String(snum[r*n+c]),x0+w/2,y0+h/2);}
    }
  } else {
    const rgbs=colors.map(hexToRGB),img=ctx.createImageData(sz,sz),d=img.data;
    for(let py=0;py<sz;py++) for(let px=0;px<sz;px++){
      const[R,G,B]=rgbs[cg[Math.floor(py*n/sz)*n+Math.floor(px*n/sz)]+1];
      const i=(py*sz+px)*4; d[i]=R;d[i+1]=G;d[i+2]=B;d[i+3]=255;
    }
    ctx.putImageData(img,0,0);
  }
}

// ═══════════════════════════════════════════════════════════════
// RENDERING — trapped path
// Blue (early) → Red (late), green start, amber trapped square
// ═══════════════════════════════════════════════════════════════
function renderTrapped(pathData,shape){
  const{path,N}=pathData;
  const sz=canvasSz();
  canvas.width=sz; canvas.height=sz; canvas.style.width=sz+'px'; canvas.style.height=sz+'px';

  // Bounding box of all path cells + padding
  let minR=N,maxR=0,minC=N,maxC=0;
  for(const{row,col}of path){
    if(row<minR)minR=row; if(row>maxR)maxR=row;
    if(col<minC)minC=col; if(col>maxC)maxC=col;
  }
  const pad=4;
  minR=Math.max(0,minR-pad); maxR=Math.min(N-1,maxR+pad);
  minC=Math.max(0,minC-pad); maxC=Math.min(N-1,maxC+pad);
  const viewR=maxR-minR+1, viewC=maxC-minC+1;

  // Build color lookup: idx → rgb string (gradient blue→red)
  const pathColor=new Map();
  const n=path.length;
  for(let i=0;i<n;i++){
    const t=n>1?i/(n-1):0;
    // Blue (#4FC3F7) → Red (#E53935)
    const R=Math.round(79+(229-79)*t);
    const G=Math.round(195+(57-195)*t);
    const B=Math.round(247+(53-247)*t);
    pathColor.set(path[i].idx,`rgb(${R},${G},${B})`);
  }
  pathColor.set(path[0].idx,'#43A047');       // start: green
  if(n>1) pathColor.set(path[n-1].idx,'#FF8F00'); // trapped: amber

  ctx.fillStyle='#f0efea';
  ctx.fillRect(0,0,sz,sz);

  for(let r=minR;r<=maxR;r++){
    for(let c=minC;c<=maxC;c++){
      const idx=r*N+c;
      const onPath=pathColor.has(idx);
      const col=onPath?pathColor.get(idx):'#e8e7e2';
      const x0=Math.floor((c-minC)*sz/viewC);
      const y0=Math.floor((r-minR)*sz/viewR);
      const x1=Math.floor((c-minC+1)*sz/viewC);
      const y1=Math.floor((r-minR+1)*sz/viewR);
      const w=x1-x0, h=y1-y0;
      ctx.fillStyle=col;
      if(shape==='circle'){
        ctx.beginPath();
        ctx.arc(x0+w/2,y0+h/2,Math.min(w,h)*0.4,0,Math.PI*2);
        ctx.fill();
      } else {
        ctx.fillRect(x0,y0,w,h);
      }
      // Ring on start and trapped squares
      if(idx===path[0].idx||(n>1&&idx===path[n-1].idx)){
        const lw=Math.max(1.5,Math.min(w,h)*0.12);
        ctx.strokeStyle=idx===path[0].idx?'#1B5E20':'#BF360C';
        ctx.lineWidth=lw;
        if(shape==='circle'){
          ctx.beginPath();
          ctx.arc(x0+w/2,y0+h/2,Math.min(w,h)*0.4,0,Math.PI*2);
          ctx.stroke();
        } else {
          const ins=lw/2;
          ctx.strokeRect(x0+ins,y0+ins,w-2*ins,h-2*ins);
        }
      }
    }
  }
}

// ═══════════════════════════════════════════════════════════════
// PIECE DIAGRAM
// ═══════════════════════════════════════════════════════════════
const GS=11,GC=5,GCPX=11;
function buildDiagram(piece){
  const atk=new Set();
  for(const[dr,dc]of MOVES[piece]){const r=GC+dr,c=GC+dc;if(r>=0&&r<GS&&c>=0&&c<GS)atk.add(r*GS+c);}
  const g=document.createElement('div'); g.className='pgrid';
  g.style.gridTemplateColumns=`repeat(${GS},${GCPX}px)`; g.style.gridTemplateRows=`repeat(${GS},${GCPX}px)`;
  for(let i=0;i<GS*GS;i++){const cell=document.createElement('div');const isC=i===GC*GS+GC,isA=atk.has(i);cell.style.cssText=`border-radius:1px;background:${isC?'#2c2c2a':isA?'#5a9e4a':'#f0efea'}`;g.appendChild(cell);}
  return g;
}

// ═══════════════════════════════════════════════════════════════
// ELI-8 VISUALIZER
// ═══════════════════════════════════════════════════════════════
let eli8Data=null, eli8Step=0;
function buildEli8Data(){
  if(eli8Data) return;
  const N=7, teams=MODES['2k'].teams;
  const{pos,snum}=genSpiral(N); const total=N*N;
  const placed=new Uint8Array(total);
  const forb=teams.map(()=>new Uint8Array(total));
  const next=new Array(teams.length).fill(1);
  const avoiders=teams.map(()=>[]); teams.forEach((t,i)=>t.avoids.forEach(j=>avoiders[j].push(i)));
  const allPla=[];
  const steps=[{placements:[],skipped:[],allForbidden:null,enemyTi:-1,newIdx:-1,newNum:-1,
    desc:'The board is numbered in a <strong>spiral</strong> from the centre outward — square 1 in the middle, then 2, 3… winding outward like a clock spring. Two knight armies will take turns, each claiming the <strong>lowest-numbered square the enemy cannot reach</strong>.'}];

  for(let t=0;t<total;t++){
    const ti=t%2, enemyTi=1-ti, fb=forb[ti];
    const allForbidden=new Uint8Array(fb);
    const skipped=[];
    let placedIdx=-1, placedNum=-1;

    for(let num=next[ti];num<=total;num++){
      next[ti]=num+1;
      const idx=pos[num];
      if(placed[idx]) continue;
      if(fb[idx]){
        let blockerPlaIdx=-1;
        const r2=Math.floor(idx/N), c2=idx%N;
        for(let pi=allPla.length-1;pi>=0;pi--){
          const ep=allPla[pi];
          if(ep.ti!==ti && getAttacks(ep.piece,ep.row,ep.col,N).includes(idx)){
            blockerPlaIdx=pi; break;
          }
        }
        skipped.push({idx,num,blockerPlaIdx});
        continue;
      }
      placed[idx]=1;
      const row=Math.floor(idx/N), col=idx%N;
      for(const aidx of getAttacks(teams[ti].piece,row,col,N))
        for(const aj of avoiders[ti]) forb[aj][aidx]=1;
      allPla.push({idx,ti,num,row,col,piece:teams[ti].piece});
      placedIdx=idx; placedNum=num;
      break;
    }
    if(placedIdx<0) break;

    const tCol=ti===0?'#E24B4A':'#2C2C2A';
    const tName=`<strong style="color:${tCol}">${ti===0?'Red':'Black'}</strong>`;
    const eName=ti===0?'Black':'Red';
    let desc;
    if(skipped.length===0){
      if(t===0) desc=`${tName} places at square <strong>${placedNum}</strong> (the centre). No enemies exist yet.`;
      else desc=`${tName} places at square <strong>${placedNum}</strong>. Not within a knight's jump of any ${eName} piece — safe.`;
    } else {
      const s0=skipped[0];
      const blocker=s0.blockerPlaIdx>=0?allPla[s0.blockerPlaIdx]:null;
      const bStr=blocker?`The <strong style="color:${blocker.ti===0?'#E24B4A':'#2C2C2A'}">${eName} knight at square ${blocker.num}</strong>`:`An ${eName} knight`;
      const more=skipped.length>1?` ${skipped.length-1} more square${skipped.length>2?'s':''} similarly blocked.`:' ';
      desc=`${tName} tries square <strong>${s0.num}</strong> — blocked. ${bStr} can jump there.${more}Moving to square <strong>${placedNum}</strong> instead.`;
    }
    steps.push({placements:[...allPla],skipped,allForbidden,enemyTi,newIdx:placedIdx,newNum:placedNum,desc});
  }
  eli8Data={steps,snum,N};
}

function renderEli8Board(container,stepIdx){
  const{steps,snum,N}=eli8Data; const step=steps[stepIdx]; const CELL=28;
  const pm=new Map(step.placements.map(p=>[p.idx,p]));
  const skippedIdxs=new Set(step.skipped.map(s=>s.idx));
  const blockerCellIdxs=new Set(
    step.skipped.map(s=>s.blockerPlaIdx>=0?step.placements[s.blockerPlaIdx]?.idx:-1).filter(i=>i>=0)
  );
  const eTi=step.enemyTi;
  const eCol=eTi>=0?MODES['2k'].teams[eTi].color:null;
  const[eR,eG,eB]=eCol?hexToRGB(eCol):[0,0,0];

  function blockStyle(opacity){
    const bg=`rgba(${eR},${eG},${eB},${opacity})`;
    const blR=eR*opacity+248*(1-opacity), blG=eG*opacity+247*(1-opacity), blB=eB*opacity+244*(1-opacity);
    const blLuma=0.299*blR+0.587*blG+0.114*blB;
    const tc=blLuma<155?'rgba(255,255,255,0.85)':`rgba(${Math.round(eR*0.45)},${Math.round(eG*0.22)},${Math.round(eB*0.22)},0.9)`;
    return{bg,tc};
  }

  const g=document.createElement('div');
  g.style.cssText=`display:inline-grid;grid-template-columns:repeat(${N},${CELL}px);gap:1.5px;background:#c8c6c0;border:1.5px solid #c8c6c0;border-radius:4px;padding:1.5px`;

  for(let r=0;r<N;r++) for(let c=0;c<N;c++){
    const idx=r*N+c, num=snum?snum[idx]:idx+1;
    const p=pm.get(idx);
    const isNew=idx===step.newIdx;
    const isSkipped=skippedIdxs.has(idx);
    const isBlocker=blockerCellIdxs.has(idx);
    const isOtherBlocked=!p&&!isSkipped&&step.allForbidden&&step.allForbidden[idx];

    const cell=document.createElement('div');
    let bg,tc;

    if(isSkipped&&eCol){
      const s=blockStyle(0.70); bg=s.bg; tc=s.tc;
    } else if(isOtherBlocked&&eCol){
      const s=blockStyle(0.30); bg=s.bg; tc=s.tc;
    } else if(p){
      bg=p.ti===0?'#E24B4A':'#2C2C2A'; tc='rgba(255,255,255,.88)';
    } else {
      bg='#f8f7f4'; tc='#c8c6c0';
    }

    const outNew=isNew?'outline:2.5px solid #5a9e4a;outline-offset:-3px;':'';
    const outBlk=(!isNew&&isBlocker&&p)?'outline:2.5px solid #E8A000;outline-offset:-3px;':'';

    cell.style.cssText=`width:${CELL}px;height:${CELL}px;background:${bg};color:${tc};display:flex;align-items:center;justify-content:center;font-size:${p?'11px':'9px'};font-weight:${p?'600':'normal'};border-radius:2px;${outNew||outBlk}`;
    cell.textContent=String(num);
    g.appendChild(cell);
  }
  container.innerHTML=''; container.appendChild(g);
}

function updateEli8(){
  const{steps}=eli8Data; const step=steps[eli8Step];
  renderEli8Board(document.getElementById('eli8Brd'),eli8Step);
  document.getElementById('eli8Desc').innerHTML=step.desc;
  document.getElementById('eli8Num').textContent=`Step ${eli8Step} of ${steps.length-1}`;
  document.getElementById('eli8Prv').disabled=eli8Step===0;
  document.getElementById('eli8Nxt').disabled=eli8Step===steps.length-1;
  const eTi=step.enemyTi, eCol=eTi>=0?MODES['2k'].teams[eTi].color:null;
  const[eR,eG,eB]=eCol?hexToRGB(eCol):[150,150,148];
  const legTried=document.getElementById('eli8LegTried');
  const legOther=document.getElementById('eli8LegOther');
  if(legTried) legTried.style.background=eCol?`rgba(${eR},${eG},${eB},0.80)`:'transparent';
  if(legOther) legOther.style.background=eCol?`rgba(${eR},${eG},${eB},0.50)`:'transparent';
}

// ═══════════════════════════════════════════════════════════════
// ELI CONTENT
// ═══════════════════════════════════════════════════════════════
function showEli(level){
  document.getElementById('eliSelect').value=level;
  const el=document.getElementById('eliContent');
  if(level==8){
    buildEli8Data(); eli8Step=0;
    el.innerHTML=`<p>Picture a giant chessboard where every square has a number. The numbers start at 1 in the very middle and wind outward like a snail's shell: 2, 3, 4… all the way to the edge.<br><br>This app shows two cool things you can do with that board.</p><p><strong>Thing 1 — Two armies:</strong> A <strong>Red knight</strong> and a <strong>Black knight</strong> take turns. Each picks the square with the <strong>smallest number</strong> that the other knight <strong>can't jump to</strong>. That's the whole rule. Do it thousands of times and something magical happens: the board splits into big red patches and big black patches, even though neither knight was trying to build patches. <em>Step through below to watch it start!</em></p><p><strong>Thing 2 — One trapped knight:</strong> One single knight starts on square 1 and every turn jumps to the <strong>nearest unvisited square</strong> it can reach. It leaves a trail of visited squares behind. Eventually every square nearby is already in the trail — the knight is stuck and can't go anywhere. A normal chess knight gets stuck after exactly <strong>2,016 jumps</strong>. That's why it's called the Trapped Knight!</p>
<div class="eli8-card">
  <div class="eli8-board-col">
    <div id="eli8Brd"></div>
    <div class="eli8-nav">
      <button id="eli8Prv">◀ Prev</button>
      <span class="eli8-step" id="eli8Num"></span>
      <button id="eli8Nxt">Next ▶</button>
    </div>
  </div>
  <div class="eli8-info-col">
    <div class="eli8-stephead">Step by step</div>
    <div class="eli8-desc" id="eli8Desc"></div>
    <div class="eli8-legend" style="margin-top:10px;flex-direction:column;gap:5px">
      <span class="eli8-key"><span class="eli8-dot" style="background:#E24B4A"></span>Red placed</span>
      <span class="eli8-key"><span class="eli8-dot" style="background:#2C2C2A"></span>Black placed</span>
      <span class="eli8-key"><span class="eli8-dot" style="background:#2C2C2A;outline:2px solid #E8A000;outline-offset:-2px"></span>Enemy causing block (amber ring)</span>
      <span class="eli8-key"><span class="eli8-dot" id="eli8LegTried"></span>Tried this turn — blocked</span>
      <span class="eli8-key"><span class="eli8-dot" id="eli8LegOther"></span>Also in enemy's reach</span>
      <span class="eli8-key"><span class="eli8-dot" style="background:#E24B4A;outline:2px solid #5a9e4a;outline-offset:-2px"></span>Just placed (green ring)</span>
    </div>
  </div>
</div>`;
    updateEli8();
    document.getElementById('eli8Prv').addEventListener('click',()=>{if(eli8Step>0){eli8Step--;updateEli8();}});
    document.getElementById('eli8Nxt').addEventListener('click',()=>{if(eli8Step<eli8Data.steps.length-1){eli8Step++;updateEli8();}});
  } else {
    el.innerHTML=ELI_TEXT[level]||'';
  }
}

// ═══════════════════════════════════════════════════════════════
// TOOLTIP
// ═══════════════════════════════════════════════════════════════
const tip=document.getElementById('tip'),tn=document.getElementById('tn'),td=document.getElementById('td'),tg=document.getElementById('tg');
function showTip(e,team){tn.textContent=team.name;tn.style.color=team.color;td.textContent=PIECE_INFO[team.piece].label+' — '+PIECE_INFO[team.piece].desc;tg.innerHTML='';tg.appendChild(buildDiagram(team.piece));tip.style.display='block';moveTip(e);}
function moveTip(e){const tw=tip.offsetWidth||170,th=tip.offsetHeight||190;tip.style.left=Math.min(e.clientX+14,window.innerWidth-tw-8)+'px';tip.style.top=Math.max(8,Math.min(e.clientY-10,window.innerHeight-th-8))+'px';}
function hideTip(){tip.style.display='none';}

// ═══════════════════════════════════════════════════════════════
// TEAM LEGEND
// ═══════════════════════════════════════════════════════════════
function updateTleg(teams){
  const el=document.getElementById('tleg'); el.innerHTML='';
  teams.forEach(t=>{const item=document.createElement('span');item.className='ti';item.innerHTML=`<span class="ts" style="background:${t.color}"></span>${t.name}`;item.addEventListener('mouseenter',e=>showTip(e,t));item.addEventListener('mousemove',moveTip);item.addEventListener('mouseleave',hideTip);el.appendChild(item);});
}
function showRpsNote(teams,show){
  const el=document.getElementById('rpsNote');
  if(!show||!teams||teams.length<3){el.style.display='none';return;}
  const cycle=teams.map(t=>t.name).concat(teams[0].name).join(' → ');
  const rules=teams.map(t=>`<strong>${t.name}</strong> avoids <strong>${teams[t.avoids[0]].name}</strong>`).join(' &nbsp;·&nbsp; ');
  el.style.display='block';
  el.innerHTML=`<strong>RPS mode:</strong> Turns cycle: ${cycle}. Each team avoids only its predator. &nbsp; ${rules}`;
}

// ═══════════════════════════════════════════════════════════════
// PIECE LIBRARY
// ═══════════════════════════════════════════════════════════════
let usedPieces=new Set();
function renderCatalog(){
  const container=document.getElementById('pieceCatalog'); container.innerHTML='';
  PIECE_KEYS.forEach(pk=>{
    const info=PIECE_INFO[pk];
    const card=document.createElement('div'); card.className='pcard'; card.dataset.piece=pk;
    if(usedPieces.has(pk)) card.classList.add('cat-used');
    const ic=document.createElement('div');ic.className='pcard-icon';ic.textContent=PIECE_ICONS[pk]||'';
    const nm=document.createElement('div');nm.className='pcn';nm.textContent=info.label;
    const ds=document.createElement('div');ds.className='pcd';ds.textContent=info.desc;
    card.appendChild(ic);card.appendChild(nm);card.appendChild(ds);card.appendChild(buildDiagram(pk));
    container.appendChild(card);
  });
  const note=document.getElementById('libUsedNote');
  if(usedPieces.size>0){note.className='lib-used-note visible';note.textContent='Green border = pieces used in the currently selected mode.';}
  else{note.className='lib-used-note';}
}
function updateLibHighlight(){
  document.querySelectorAll('.pcard').forEach(card=>{
    card.classList.toggle('cat-used',usedPieces.has(card.dataset.piece));
  });
  const note=document.getElementById('libUsedNote');
  if(usedPieces.size>0){note.className='lib-used-note visible';note.textContent='Green border = pieces used in the currently selected mode.';}
  else{note.className='lib-used-note';}
}

// ═══════════════════════════════════════════════════════════════
// CUSTOM PANEL
// ═══════════════════════════════════════════════════════════════
const cpState={count:2,isRPS:false,pieceIdxs:new Array(10).fill(0),activeTeam:0};
function cpTeamNames(){if(!cpState.isRPS)return TN;if(cpState.count===3)return['Rock','Paper','Scissors'];return Array.from({length:10},(_,i)=>`Team ${String.fromCharCode(65+i)}`);}
function cpTeamPiece(i){return PIECE_KEYS[cpState.pieceIdxs[i]];}
function cyclePiece(ti,dir){const n=PIECE_KEYS.length;cpState.pieceIdxs[ti]=(cpState.pieceIdxs[ti]+dir+n)%n;cpState.activeTeam=ti;refreshCpRow(ti);updateCpPreview();}
function setActiveTeam(ti){cpState.activeTeam=ti;document.querySelectorAll('.cprow').forEach((r,i)=>r.classList.toggle('active',i===ti));updateCpPreview();}
function refreshCpRow(ti){const row=document.getElementById('cprow-'+ti);if(row){const pk=cpTeamPiece(ti);row.querySelector('.pnm').textContent=(PIECE_ICONS[pk]||'')+' '+PIECE_INFO[pk].label;}}
function updateCpPreview(){const ti=cpState.activeTeam,pk=cpTeamPiece(ti),info=PIECE_INFO[pk],names=cpTeamNames();document.getElementById('cpPrevLabel').textContent='Piece for '+names[ti]+':';document.getElementById('cpPrevName').textContent=(PIECE_ICONS[pk]||'')+' '+info.label;document.getElementById('cpPrevDesc').textContent=info.desc;const d=document.getElementById('cpDiag');d.innerHTML='';d.appendChild(buildDiagram(pk));}
function renderCpTeams(){
  const container=document.getElementById('cpTeams');container.innerHTML='';
  const names=cpTeamNames();
  for(let i=0;i<cpState.count;i++){
    const row=document.createElement('div');row.className='cprow'+(i===cpState.activeTeam?' active':'');row.id='cprow-'+i;
    const j=i;row.addEventListener('click',()=>setActiveTeam(j));
    const dot=document.createElement('span');dot.className='cdot';dot.style.background=TC[i];
    const nm=document.createElement('span');nm.className='cnm';nm.textContent=names[i];
    const prev=document.createElement('button');prev.className='parr';prev.textContent='◀';
    prev.addEventListener('click',e=>{e.stopPropagation();cyclePiece(j,-1);});
    const pnm=document.createElement('span');pnm.className='pnm';pnm.textContent=(PIECE_ICONS[cpTeamPiece(i)]||'')+' '+PIECE_INFO[cpTeamPiece(i)].label;
    const next=document.createElement('button');next.className='parr';next.textContent='▶';
    next.addEventListener('click',e=>{e.stopPropagation();cyclePiece(j,+1);});
    row.appendChild(dot);row.appendChild(nm);row.appendChild(prev);row.appendChild(pnm);row.appendChild(next);
    if(cpState.isRPS){const tag=document.createElement('span');tag.className='rps-tag';tag.textContent='← avoids '+names[(i+1)%cpState.count];row.appendChild(tag);}
    container.appendChild(row);
  }
}
function updateCpRpsNote(){const note=document.getElementById('cpRpsNote');if(cpState.isRPS){const names=cpTeamNames();const cycle=[...names.slice(0,cpState.count),names[0]].join(' → ');note.style.display='block';note.innerHTML=`<strong>Cycle:</strong> ${cycle}<br>Each team avoids only the next in the cycle.`;}else note.style.display='none';}
function openCustomPanel(isRPS){
  cpState.isRPS=isRPS;
  document.getElementById('customPanel').style.display='block';
  document.getElementById('cpTitle').textContent=isRPS?'Custom RPS cycle':'Custom mixed pieces';
  const min=isRPS?3:2;
  if(cpState.count<min)cpState.count=min;
  const sel=document.getElementById('cpCountSel');sel.innerHTML='';
  for(let i=min;i<=10;i++){const o=document.createElement('option');o.value=i;o.textContent=i+' teams';if(i===cpState.count)o.selected=true;sel.appendChild(o);}
  sel.onchange=()=>{cpState.count=parseInt(sel.value);cpState.activeTeam=Math.min(cpState.activeTeam,cpState.count-1);renderCpTeams();updateCpPreview();updateCpRpsNote();};
  renderCpTeams();updateCpPreview();updateCpRpsNote();
}
function getCustomTeams(){
  const names=cpTeamNames();
  return Array.from({length:cpState.count},(_,i)=>({name:names[i],color:TC[i],piece:PIECE_KEYS[cpState.pieceIdxs[i]],avoids:cpState.isRPS?[(i+1)%cpState.count]:Array.from({length:cpState.count},(_,j)=>j).filter(j=>j!==i)}));
}

// ═══════════════════════════════════════════════════════════════
// RPS MODAL
// ═══════════════════════════════════════════════════════════════
document.getElementById('rpsInfoBtn').addEventListener('click',()=>document.getElementById('rpsModal').classList.add('open'));
document.getElementById('rpsModalClose').addEventListener('click',()=>document.getElementById('rpsModal').classList.remove('open'));
document.getElementById('rpsModal').addEventListener('click',e=>{if(e.target===document.getElementById('rpsModal'))document.getElementById('rpsModal').classList.remove('open');});

// ═══════════════════════════════════════════════════════════════
// TRAPPED RESULT BOX
// ═══════════════════════════════════════════════════════════════
function showTrappedResult(pathData, piece){
  const{path}=pathData;
  const box=document.getElementById('trappedResult');
  const n=path.length;
  const trapped=n>1?path[n-1].spiralNum:path[0].spiralNum;
  const maxSq=path.reduce((m,p)=>Math.max(m,p.spiralNum),0);
  const first20=path.slice(0,20).map(p=>p.spiralNum).join(', ')+(n>20?', …':'');
  const oeis=TRAPPED_OEIS[piece]||'';
  const wasTrapped=n<500000;
  box.style.display='block';
  box.innerHTML=`
    <strong>${wasTrapped?'Trapped':'Not fully trapped'} after ${n.toLocaleString()} move${n!==1?'s':''}.</strong>
    ${wasTrapped?`Final square: <strong>${trapped.toLocaleString()}</strong> · Highest square visited: <strong>${maxSq.toLocaleString()}</strong>`:'(reached simulation limit)'}
    ${oeis?`<div class="trap-oeis">OEIS ${oeis}</div>`:''}
    <div class="trap-seq"><strong>Sequence:</strong> ${first20}</div>
    <div class="trap-oeis" style="margin-top:6px">
      <span style="display:inline-block;width:10px;height:10px;background:#43A047;border-radius:2px;margin-right:4px;vertical-align:middle"></span>Start (square 1) &nbsp;
      <span style="display:inline-block;width:10px;height:10px;background:#4FC3F7;border-radius:2px;margin-right:4px;vertical-align:middle"></span>Early moves &nbsp;
      <span style="display:inline-block;width:10px;height:10px;background:#E53935;border-radius:2px;margin-right:4px;vertical-align:middle"></span>Late moves &nbsp;
      <span style="display:inline-block;width:10px;height:10px;background:#FF8F00;border-radius:2px;margin-right:4px;vertical-align:middle"></span>Trapped square
    </div>`;
}
function hideTrappedResult(){document.getElementById('trappedResult').style.display='none';}

// ═══════════════════════════════════════════════════════════════
// MAIN UI
// ═══════════════════════════════════════════════════════════════
let modeKey='2k';

function isTrappedMode(){return !!(MODES[modeKey]&&MODES[modeKey].trapped);}

function syncControls(){
  const trapped=isTrappedMode();
  document.getElementById('sizeSelect').parentElement.style.display=trapped?'none':'flex';
  document.getElementById('tleg').innerHTML='';
  showRpsNote([],false);
}

document.getElementById('modeSelect').addEventListener('change',()=>{
  modeKey=document.getElementById('modeSelect').value;
  const mode=MODES[modeKey];
  document.getElementById('desc').textContent=mode.desc||'';
  hideTrappedResult();
  syncControls();
  if(mode.trapped){
    document.getElementById('customPanel').style.display='none';
    usedPieces=new Set([mode.piece]);
  } else if(mode.custom){
    openCustomPanel(mode.rps);usedPieces=new Set();updateTleg([]);showRpsNote([],false);
  } else {
    document.getElementById('customPanel').style.display='none';
    usedPieces=new Set(mode.teams.map(t=>t.piece));
    updateTleg(mode.teams);showRpsNote(mode.teams,mode.rps);
  }
  updateLibHighlight();
});

document.getElementById('understandToggle').addEventListener('click',()=>{
  const content=document.getElementById('understandContent');
  const arrow=document.getElementById('understandArrow');
  const open=content.classList.toggle('open');
  arrow.classList.toggle('open',open);
});
document.getElementById('libToggle').addEventListener('click',()=>{
  const content=document.getElementById('libContent');
  const arrow=document.getElementById('libArrow');
  const open=content.classList.toggle('open');
  arrow.classList.toggle('open',open);
});
document.getElementById('eliSelect').addEventListener('change',()=>showEli(parseInt(document.getElementById('eliSelect').value)));

function getBoardN(){return parseInt(document.getElementById('sizeSelect').value)||16;}
function getShape(){return document.getElementById('shapeSelect').value;}

function run(){
  const btn=document.getElementById('runBtn'),infoEl=document.getElementById('info');
  const mode=MODES[modeKey];

  if(mode.trapped){
    btn.disabled=true;
    infoEl.textContent=`Simulating trapped ${PIECE_INFO[mode.piece].label.toLowerCase()}…`;
    hideTrappedResult();
    setTimeout(()=>{
      try{
        const pathData=simulateTrapped(mode.piece);
        renderTrapped(pathData,getShape());
        const n=pathData.path.length;
        infoEl.textContent=`${PIECE_INFO[mode.piece].label} · ${n.toLocaleString()} moves · trapped at square ${pathData.path[n-1].spiralNum.toLocaleString()}`;
        showTrappedResult(pathData,mode.piece);
      }catch(e){infoEl.textContent='Error: '+e.message;console.error(e);}
      btn.disabled=false;
    },20);
    return;
  }

  const n=getBoardN();
  const sg=SIZE_GROUPS.find(g=>g.sizes.includes(n));
  const w=sg?sg.warn:0;
  if(w>=3){infoEl.textContent=`${n.toLocaleString()}² = ${(n*n/1e6).toFixed(0)}M cells — requires too much RAM for a browser.`;return;}
  if(w>=2&&!confirm(`${n.toLocaleString()}×${n.toLocaleString()} may use ~${(n*n*6/1e9).toFixed(1)}GB RAM and crash your browser. Continue?`))return;
  btn.disabled=true;
  hideTrappedResult();
  infoEl.textContent=`Computing ${n.toLocaleString()}×${n.toLocaleString()}…${w>=1?' (may take a while)':''}`;
  setTimeout(()=>{
    try{
      const teams=mode.custom?getCustomTeams():mode.teams;
      const{cg,snum}=simulate(n,teams);
      render(n,cg,snum,teams,getShape());
      infoEl.textContent=`${n.toLocaleString()}×${n.toLocaleString()} · ${(n*n).toLocaleString()} squares · ${teams.length} team${teams.length!==1?'s':''}`;
      updateTleg(teams); showRpsNote(teams,mode.rps||(mode.custom&&cpState.isRPS));
      if(!mode.custom){usedPieces=new Set(teams.map(t=>t.piece));updateLibHighlight();}
    }catch(e){infoEl.textContent='Error: '+e.message+' — try a smaller board.';console.error(e);}
    btn.disabled=false;
  },20);
}
document.getElementById('runBtn').addEventListener('click',run);

// ═══════════════════════════════════════════════════════════════
// INIT
// ═══════════════════════════════════════════════════════════════
(()=>{
  const mode=MODES[modeKey];
  document.getElementById('desc').textContent=mode.desc;
  usedPieces=new Set(mode.teams.map(t=>t.piece));
  updateTleg(mode.teams);
  renderCatalog();
  showEli(8);
  syncControls();
  run();
})();
