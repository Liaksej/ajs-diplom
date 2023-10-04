(()=>{"use strict";var e={};function t(e,t){const a=[...Array(t-2)].map(((e,a)=>t+t*a)),s=[...Array(t-2)].map(((e,a)=>t*a+2*t-1)),i=[...Array(t-2)].map(((e,t)=>t+1)),r=[...Array(t-2)].map(((e,a)=>t**2-t+a+1));return a.includes(e)?"left":s.includes(e)?"right":i.includes(e)?"top":r.includes(e)?"bottom":0===e?"top-left":e===t**2-1?"bottom-right":e===t-1?"top-right":e===t**2-t?"bottom-left":"center"}function a(e,t,a){return function(e,t,a){const s=a%t,i=Math.floor(a/t),r=[];for(let a=-e;a<=e;a++)for(let l=-e;l<=e;l++)if(Math.abs(l)===Math.abs(a)||0===l||0===a){const c=i+a,n=s+l;n>=0&&n<t&&c>=0&&c<t&&Math.abs(n-s)<=e&&Math.abs(c-i)<=e&&r.push(c*t+n)}return r}(e.passArea,t,a)}function s(e,t,a){return function(e,t,a){const s=a%t,i=Math.floor(a/t),r=[];for(let a=0-e;a<=e;a++)for(let l=0-e;l<=e;l++)if(Math.abs(l)+Math.abs(a)<=2*e){const e=i+a,c=s+l;c>=0&&c<t&&e>=0&&e<t&&r.push(e*t+c)}return r}(e.attackArea,t,a)}function i(e,t,a){const[s,i]=[t%e,Math.floor(t/e)],[r,l]=[a%e,Math.floor(a/e)];return Math.sqrt(Math.abs(r-s)**2+Math.abs(l-i)**2)}function r(e,t){let a=e**2-1;const s=[],i=(a+1)/e;for(let r=0;r<i;r++)"gamer"===t&&s.push(a-e+2,a-e+1),"enemy"===t&&s.push(a,a-1),a-=e;return s}e.m={},e.u=e=>e+".js",e.o=(e,t)=>Object.prototype.hasOwnProperty.call(e,t),e.p="",e.b=document.baseURI||self.location.href;class l{boardSize;container;boardEl;cells;cellClickListeners;cellEnterListeners;cellLeaveListeners;newGameListeners;saveGameListeners;loadGameListeners;newGameEl;loadGameEl;saveGameEl;constructor(){this.boardSize=P,this.container=null,this.boardEl=null,this.cells=[],this.cellClickListeners=[],this.cellEnterListeners=[],this.cellLeaveListeners=[],this.newGameListeners=[],this.saveGameListeners=[],this.loadGameListeners=[],this.newGameEl=null,this.saveGameEl=null,this.loadGameEl=null}bindToDOM(e){if(!(e instanceof HTMLElement))throw new Error("container is not HTMLElement");this.container=e}drawUi(e){if(this.checkBinding(),this.container instanceof HTMLElement){this.container.innerHTML='\n      <div class="controls">\n        <button data-id="action-restart" class="btn">New Game</button>\n        <button data-id="action-save" class="btn">Save Game</button>\n        <button data-id="action-load" class="btn">Load Game</button>\n      </div>\n      <div class="board-container" style="position: relative">\n        <div data-id="board" class="board"></div>\n      </div>\n    ',this.newGameEl=this.container.querySelector("[data-id=action-restart]"),this.saveGameEl=this.container.querySelector("[data-id=action-save]"),this.loadGameEl=this.container.querySelector("[data-id=action-load]"),localStorage.getItem("state")?this.loadGameEl?.removeAttribute("disabled"):this.loadGameEl?.setAttribute("disabled","true"),this.newGameEl?.addEventListener("click",(e=>this.onNewGameClick(e))),this.saveGameEl?.addEventListener("click",(e=>this.onSaveGameClick(e))),this.loadGameEl?.addEventListener("click",(e=>this.onLoadGameClick(e))),this.boardEl=this.container.querySelector("[data-id=board]"),this.boardEl?.classList.add(e);for(let e=0;e<this.boardSize**2;e+=1){const a=document.createElement("div");a.classList.add("cell","map-tile",`map-tile-${t(e,this.boardSize)}`),a.addEventListener("mouseenter",(e=>this.onCellEnter(e))),a.addEventListener("mouseleave",(e=>this.onCellLeave(e))),a.addEventListener("click",(e=>this.onCellClick(e))),this.boardEl?.appendChild(a)}this.boardEl&&(this.cells=Array.from(this.boardEl.children))}}redrawPositions(e){for(const e of this.cells)e.innerHTML="";for(const a of e){const e=this.boardEl?.children[a.position],s=document.createElement("div");s.classList.add("character",a.character.type);const i=document.createElement("div");i.classList.add("health-level");const r=document.createElement("div");r.classList.add("health-level-indicator","health-level-indicator-"+((t=a.character.health)<15?"critical":t<50?"normal":"high")),r.style.width=`${a.character.health}%`,i.appendChild(r),s.appendChild(i),e?.appendChild(s)}var t}addCellEnterListener(e){this.cellEnterListeners.push(e)}addCellLeaveListener(e){this.cellLeaveListeners.push(e)}addCellClickListener(e){this.cellClickListeners.push(e)}addNewGameListener(e){this.newGameListeners.push(e)}addSaveGameListener(e){this.saveGameListeners.push(e)}addLoadGameListener(e){this.loadGameListeners.push(e)}onCellEnter(e){e.preventDefault();const t=this.cells.indexOf(e.currentTarget);this.cellEnterListeners.forEach((e=>e.call(null,t)))}onCellLeave(e){e.preventDefault();const t=this.cells.indexOf(e.currentTarget);this.cellLeaveListeners.forEach((e=>e.call(null,t)))}onCellClick(e){e.preventDefault();const t=e.currentTarget;if(-1===this.cells.indexOf(t))return;const a=this.cells.indexOf(e.currentTarget);this.cellClickListeners.forEach((e=>e.call(null,a)))}onNewGameClick(e){e.preventDefault(),this.newGameListeners.forEach((t=>t(e)))}onSaveGameClick(e){e.preventDefault(),this.saveGameListeners.forEach((t=>t(e))),localStorage.getItem("state")?this.loadGameEl?.removeAttribute("disabled"):this.loadGameEl?.setAttribute("disabled","true")}onLoadGameClick(e){e.preventDefault(),this.loadGameListeners.forEach((t=>t(e))),localStorage.getItem("state")?this.loadGameEl?.removeAttribute("disabled"):this.loadGameEl?.setAttribute("disabled","true")}static showError(e){alert(e)}selectCell(e,t="yellow"){this.deselectCell(),this.cells[e].classList.add("selected",`selected-${t}`)}selectEnemyCell(e,t="red"){this.deselectEnemyCell(),this.cells[e].classList.add("selected",`selected-${t}`)}selectEmptyCell(e,t="green"){this.deselectEmptyCell(),this.cells[e].classList.add("selected",`selected-${t}`)}deselectCell(){this.cells.forEach((e=>e.classList.remove("selected")))}deselectAllCells(){this.cells.forEach((e=>e.classList.remove("selected","selected-red","selected-green","selected-yellow")))}deselectEnemyCell(){this.cells.filter((e=>e.classList.contains("selected-red"))).forEach((e=>e.classList.remove("selected")))}deselectEmptyCell(){this.cells.filter((e=>e.classList.contains("selected-green"))).forEach((e=>e.classList.remove("selected")))}showCellTooltip(e,t){this.cells[t].title=e}hideCellTooltip(e){this.cells[e].title=""}showDamage(e,t){return new Promise((a=>{const s=this.cells[e],i=document.createElement("span");i.textContent=t.toString(),i.classList.add("damage"),s.appendChild(i),i.addEventListener("animationend",(()=>{s.removeChild(i),a()}))}))}setCursor(e){this.boardEl&&(this.boardEl.style.cursor=e)}checkSelectedCell(){return this.cells.some((e=>e.classList.contains("selected")))}findSelectedCell(){return this.cells.map(((e,t)=>e.classList.contains("selected")?t:null)).filter((e=>null!==e))}checkEmptyCell(e){return 0===this.cells[e].childElementCount}checkBinding(){if(null===this.container)throw new Error("GamePlay not bind to DOM")}changeTheme(e){const t=this.container?.querySelector(".board");t?.classList.remove("prairie","desert","arctic","mountain"),t?.classList.add(e)}checkSelectedEmptyCell(){return this.cells.some((e=>e.classList.contains("selected-yellow")&&0===e.children.length))}checkSelectedemptyEnemyCell(){return this.cells.some((e=>e.classList.contains("selected-red")&&0===e.children.length))}drawScore(e){const t=document.querySelector(".score");if(t)return void(t.innerHTML=`<span>${e.gamer.toFixed(1)}</span> : <span>${e.computer.toFixed(1)}</span>`);const a=document.createElement("div");a.classList.add("score"),a.innerHTML=`<span>${e.gamer.toFixed(1)}</span> : <span>${e.computer.toFixed(1)}</span>`,document.body.insertBefore(a,document.body.firstElementChild)}}const c="prairie",n="desert",o="arctic",h="mountain";class m{character;position;attackField;moveField;boardSize;constructor(e,t){this.character=e,this.position=t,this.boardSize=P,this.attackField=s(this.character,this.boardSize,this.position),this.moveField=a(this.character,this.boardSize,this.position)}changePosition(e){e!==this.position&&(this.position=e,this.attackField=s(this.character,this.boardSize,this.position),this.moveField=a(this.character,this.boardSize,this.position))}}class d{level;attack;defence;health;type;passArea;attackArea;constructor(e,t){if(this.level=e,this.attack=0,this.defence=0,this.health=50,this.type=t,this.passArea=0,this.attackArea=0,new.target===d)throw new TypeError("Cannot construct Character instances directly")}levelUp(e){if(1!==e)for(let t=0;t<e;t++)this.attack=Math.max(this.attack,this.attack*(80+this.health)/100),this.defence=Math.max(this.defence,this.defence*(80+this.health)/100)}healthUp(){const e=this.health+80;this.health=e>100?100:e,this.level<4&&(this.level=this.level+1)}}class u extends d{passArea;attackArea;constructor(e){super(e,"bowman"),this.attack=25,this.defence=25,this.levelUp(e),this.passArea=2,this.attackArea=2}levelUp(e){super.levelUp(e)}}class p extends d{passArea=4;attackArea=1;constructor(e){super(e,"swordsman"),this.attack=40,this.defence=10,this.levelUp(e),this.passArea=4,this.attackArea=1}levelUp(e){super.levelUp(e)}}class g extends d{passArea;attackArea;constructor(e){super(e,"magician"),this.attack=10,this.defence=40,this.levelUp(e),this.passArea=1,this.attackArea=4}levelUp(e){super.levelUp(e)}}class v extends d{passArea=4;attackArea=1;constructor(e){super(e,"undead"),this.attack=40,this.defence=10,this.levelUp(e),this.passArea=4,this.attackArea=1}levelUp(e){super.levelUp(e)}}class S extends d{passArea;attackArea;constructor(e){super(e,"vampire"),this.attack=25,this.defence=25,this.levelUp(e),this.passArea=2,this.attackArea=2}levelUp(e){super.levelUp(e)}}class y extends d{passArea;attackArea;constructor(e){super(e,"daemon"),this.attack=10,this.defence=10,this.levelUp(e),this.passArea=1,this.attackArea=4}levelUp(e){super.levelUp(e)}}class f{characters;constructor(e){this.characters=e}static checkGamerCharacters(e){return["swordsman","bowman","magician"].includes(e)}static checkComputerCharacters(e){return["undead","vampire","daemon"].includes(e)}}function C(e,t,a){const s=[],i=function*(e,t){for(;;){const a=Math.floor(Math.random()*e.length),s=Math.floor(Math.random()*t)+1,i=new e[a](s);yield i}}(e,t);for(let e=0;e<a;e++)s.push(i.next().value);return new f(s)}const E="auto",w="pointer",L="crosshair",k="not-allowed";class b{turn;level;positions;isGameEnd;previousScores;maxScore;constructor(){this.turn="gamer",this.level=1,this.positions=[],this.isGameEnd=!1,this.previousScores={gamer:0,computer:0},this.maxScore={gamer:0,computer:0}}async setPreviousScores(){this.previousScores={gamer:await this.calculateOverallScore(this.positions,"gamer"),computer:await this.calculateOverallScore(this.positions,"computer")}}async getMaxScore(){const e={gamer:await this.calculateOverallScore(this.positions,"gamer"),computer:await this.calculateOverallScore(this.positions,"computer")},t=this.maxScore;let a=t.gamer,s=t.computer;if(e.gamer<this.previousScores.gamer)s+=this.previousScores.gamer-e.gamer;else{if(!(e.computer<this.previousScores.computer))return;a+=this.previousScores.computer-e.computer}this.previousScores=e,this.maxScore={gamer:a,computer:s}}from(e){this.turn="gamer"===e.turn?"computer":"gamer"}loadData(e){this.turn=e.turn,this.level=e.level,this.isGameEnd=e.isGameEnd,this.maxScore=e.maxScore;const t={swordsman:p,bowman:u,magician:g,undead:v,vampire:S,daemon:y};this.positions=e.positions.map((e=>{const a=t[e.character.type];if(!a)throw new Error(`Unknown character type: ${e.character.type}`);const s=new a(e.character.level);return s.health=e.character.health,s.attack=e.character.attack,s.defence=e.character.defence,new m(s,e.position)}))}async calculateOverallScore(t,a,s=.1,i=.2,r=.7){return new Promise(((l,c)=>{const n=new Worker(new URL(e.p+e.u(429),e.b));n.postMessage({positionedCharacters:t,team:a,healthWeight:s,attackWeight:i,levelWeight:r}),n.onmessage=e=>{l(e.data)},n.onerror=e=>{c(e)}}))}}const P=8,G=new l;G.bindToDOM(document.querySelector("#game-container"));const A=new class{storage;constructor(e){this.storage=e}save(e){try{const t=JSON.stringify(e),a=new Uint8Array(new ArrayBuffer(t.length));for(let e=0;e<t.length;e++)a[e]=t.charCodeAt(e);const s=btoa(String.fromCharCode.apply(null,Array.from(a)));this.storage.setItem("state",s)}catch(e){throw new Error("Failed to save state: "+e)}}load(){const e=this.storage.getItem("state");if(!e)throw new Error("No state data found in storage");try{const t=atob(e),a=t.length,s=new Uint8Array(new ArrayBuffer(a));for(let e=0;e<a;e++)s[e]=t.charCodeAt(e);const i=(new TextDecoder).decode(s);return JSON.parse(i)}catch(e){throw new Error("Invalid state")}}}(localStorage),M=new class{gamePlay;stateService;gameState;themesSelector=[c,n,o,h];constructor(e,t){this.gamePlay=e,this.stateService=t,this.gameState=new b,this.gameState.level=1,this.gameState.isGameEnd=!1,this.gameState.positions=[...this.creatEnemyTeams(2,this.gameState.level),...this.creatGamerTeams(2,this.gameState.level)]}async init(){this.gamePlay.drawUi(this.themesSelector[0]),this.gamePlay.redrawPositions(this.gameState.positions),this.gamePlay.addCellEnterListener(this.onCellEnter.bind(this)),this.gamePlay.addCellLeaveListener(this.onCellLeave.bind(this)),this.gamePlay.addCellClickListener(this.onCellClick.bind(this)),this.gamePlay.addNewGameListener(this.newGame.bind(this)),this.gamePlay.addSaveGameListener(this.onSaveGame.bind(this)),this.gamePlay.addLoadGameListener(this.onLoadGame.bind(this)),await this.gameState.setPreviousScores(),await this.updateMaxScores()}async onCellClick(e){if(this.gameState.isGameEnd)return;const t=this.getSelectedCharacter(),a=this.getPosition(e);if(!a||!f.checkGamerCharacters(a.character.type))return a&&t?.attackField.includes(e)&&f.checkComputerCharacters(a.character.type)?this.causeDamage(t,a,e):void(void 0===a&&t?.moveField.includes(e)?await this.changeCell(t,e):l.showError("Ошибка... Недопустимое действие"));this.gamePlay.selectCell(e)}async causeDamage(e,t,a){const s=Math.max(e?.character.attack-t.character.defence,.1*e?.character.attack);await this.gamePlay.showDamage(a,s),t.character.health=t.character.health-s;const i=this.gameState.positions.length;this.gameState.positions=this.gameState.positions.filter((e=>e.character.health>0)),await this.newLevel(),this.gamePlay.redrawPositions(this.gameState.positions),await this.updateMaxScores(),this.selectedCellsChecker(i),this.gameState.from(this.gameState),"computer"===this.gameState.turn&&this.computerPass()}async changeCell(e,t){e?.changePosition(t),f.checkGamerCharacters(e?.character.type)&&(this.gamePlay.deselectAllCells(),this.gamePlay.selectCell(t)),this.gameState.from(this.gameState),this.gamePlay.redrawPositions(this.gameState.positions),await this.updateMaxScores(),"computer"===this.gameState.turn&&this.computerPass()}onCellEnter(e){if(this.gameState.isGameEnd)return;const t=this.getPosition(e),a=this.getSelectedCharacter();t?(this.gamePlay.showCellTooltip(this.createTooltipMessage(e),e),f.checkGamerCharacters(t.character.type)&&this.gamePlay.setCursor(w),a&&this.gamePlay.checkSelectedCell()&&f.checkComputerCharacters(t.character.type)&&a.attackField.includes(e)&&(this.gamePlay.setCursor(L),this.gamePlay.selectEnemyCell(e))):a&&this.gamePlay.checkEmptyCell(e)?a.moveField.includes(e)?(this.gamePlay.deselectEnemyCell(),this.gamePlay.setCursor(w),this.gamePlay.selectEmptyCell(e)):this.gamePlay.setCursor(k):(this.gamePlay.setCursor(E),this.gamePlay.deselectEnemyCell())}onCellLeave(e){this.gamePlay.hideCellTooltip(e),this.gamePlay.deselectEmptyCell()}getPosition(e){return this.gameState.positions.find((t=>t.position===e))}getSelectedCharacter(){return this.gameState.positions.find((e=>this.gamePlay.findSelectedCell().includes(e.position)))}createTooltipMessage(e){const t=this.gameState.positions.find((t=>t.position===e));return`🎖 ${t?.character.level} ⚔ ${t?.character.attack} 🛡 ${t?.character.defence} ❤ ${t?.character.health}`}creatEnemyTeams(e,t){const a=[v,S,y],s=r(this.gamePlay.boardSize,"enemy");return C(a,t,e).characters.map((e=>{const t=s.splice(Math.floor(Math.random()*s.length),1)[0];return new m(e,t)}))}creatGamerTeams(e,t,a=[]){const s=[u,p,g],i=r(this.gamePlay.boardSize,"gamer"),l=C(s,t,e-a.length);return l.characters.push(...a),l.characters.map((e=>{const t=i.splice(Math.floor(Math.random()*i.length),1)[0];return new m(e,t)}))}computerPass(){const e=this.gameState.positions.filter((e=>f.checkGamerCharacters(e.character.type))),t=this.gameState.positions.filter((e=>f.checkComputerCharacters(e.character.type)));this.computerAttackLogic(e,t)||this.moveTowardsEnemy(e,t)}computerAttackLogic(e,t){let a=[];if(t.forEach((t=>{e.forEach((e=>{t.attackField.includes(e.position)&&a.push([t,e])}))})),a.length>0){a.forEach((([e,t],s)=>{a.length>1&&e.character.health<t.character.health&&(a=a.filter(((e,t)=>t!==s)))})),a.forEach((([e,t],s)=>{a.length>1&&e.character.attack<t.character.attack&&(a=a.filter(((e,t)=>t!==s)))})),a.forEach((([e,t],s)=>{a.length>1&&e.character.defence<t.character.defence&&(a=a.filter(((e,t)=>t!==s)))}));const[e,t]=a[Math.floor(Math.random()*a.length)];return this.causeDamage(e,t,t.position)}return null}async moveTowardsEnemy(e,t){const a=this.gamePlay.boardSize,s={enemy:null,distance:1/0,computerPosition:null};if(t.forEach((t=>{e.forEach((e=>{const r=i(a,t.position,e.position);s.distance>r&&(s.distance=r,s.enemy=e,s.computerPosition=t)}))})),null!==s.enemy&&s.distance!==1/0&&null!==s.computerPosition){const e=s.enemy.position;let t=s.computerPosition.moveField;t=t.filter((e=>this.gamePlay.checkEmptyCell(e)));const r=t.reduce(((t,r)=>s.distance<i(a,t,e)?r:t));await this.changeCell(s.computerPosition,r),this.selectedCellsChecker()}}selectedCellsChecker(e){return e&&this.gameState.positions.length<e&&this.gamePlay.checkSelectedEmptyCell()?this.gamePlay.deselectAllCells():this.gamePlay.checkSelectedemptyEnemyCell()?this.gamePlay.deselectEnemyCell():void 0}async newLevel(){const e=this.gameState.positions.filter((e=>f.checkComputerCharacters(e.character.type))),t=this.gameState.positions.filter((e=>f.checkGamerCharacters(e.character.type)));if(0===t.length)return this.gameOver();if(0===e.length){if(4===this.gameState.level)return this.gameOver();this.gameState.level=this.gameState.level+1;const e=this.gameState.level;this.gameState.positions.forEach((t=>{t.character.levelUp(e),t.character.healthUp()})),this.gameState.turn="computer";const a=t.map((e=>e.character));this.gameState.positions=[...this.creatEnemyTeams(1+e,e),...this.creatGamerTeams(1+e,e,a)],this.gamePlay.changeTheme(this.themesSelector[e-1]),await this.gameState.setPreviousScores(),this.gamePlay.deselectAllCells()}}gameOver(){this.gameState.isGameEnd=!0,this.gamePlay.deselectAllCells(),this.gamePlay.setCursor(E),this.gameState.positions=[]}async newGame(){this.gameState=new b,this.gameState.positions=[...this.creatEnemyTeams(2,this.gameState.level),...this.creatGamerTeams(2,this.gameState.level)],this.gamePlay.changeTheme(this.themesSelector[0]),this.gamePlay.redrawPositions(this.gameState.positions),await this.gameState.setPreviousScores(),await this.updateMaxScores(),this.gamePlay.deselectAllCells()}onSaveGame(){const e={turn:this.gameState.turn,level:this.gameState.level,positions:this.gameState.positions,isGameEnd:this.gameState.isGameEnd,maxScore:this.gameState.maxScore};this.stateService.save(e)}async onLoadGame(){this.gameState.loadData(this.stateService.load()),this.gamePlay.deselectAllCells(),this.gamePlay.redrawPositions(this.gameState.positions),await this.gameState.setPreviousScores(),await this.updateMaxScores(),this.gamePlay.changeTheme(this.themesSelector[this.gameState.level-1])}async updateMaxScores(){await this.gameState.getMaxScore(),this.gamePlay.drawScore(this.gameState.maxScore)}}(G,A);M.init()})();