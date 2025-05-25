(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const i of document.querySelectorAll('link[rel="modulepreload"]'))r(i);new MutationObserver(i=>{for(const s of i)if(s.type==="childList")for(const n of s.addedNodes)n.tagName==="LINK"&&n.rel==="modulepreload"&&r(n)}).observe(document,{childList:!0,subtree:!0});function t(i){const s={};return i.integrity&&(s.integrity=i.integrity),i.referrerpolicy&&(s.referrerPolicy=i.referrerpolicy),i.crossorigin==="use-credentials"?s.credentials="include":i.crossorigin==="anonymous"?s.credentials="omit":s.credentials="same-origin",s}function r(i){if(i.ep)return;i.ep=!0;const s=t(i);fetch(i.href,s)}})();class p{constructor(e){this.parent=e,this.defaultImage="https://via.placeholder.com/300x450?text=No+Image"}render(e,t){if(!e)return console.error("Anime data is missing"),this.renderErrorCard();const r=document.createElement("div");r.className="anime-card",r.innerHTML=this.getCardHTML(e),this.setupCardInteractions(r,e,t),this.parent.appendChild(r)}getCardHTML(e){const t=this.validateImageUrl(e.image||e.src),r=this.escapeHtml(e.title||"\u0411\u0435\u0437 \u043D\u0430\u0437\u0432\u0430\u043D\u0438\u044F"),i=e.episodes||0,s=e.rating?this.formatRating(e.rating):"";return`
            <div class="anime-card-inner">
                <div class="anime-image-container">
                    <img class="anime-cover" 
                         src="${t}" 
                         alt="${r}"
                         loading="lazy"
                         onerror="this.src='${this.defaultImage}'">
                    ${s?`<div class="anime-rating-badge">${s}</div>`:""}
                </div>
                <div class="anime-info">
                    <h3 class="anime-title" title="${r}">${r}</h3>
                    <div class="anime-meta">
                        <span class="episode-badge">${i} \u044D\u043F.</span>
                        ${e.year?`<span class="year-badge">${e.year}</span>`:""}
                    </div>
                </div>
            </div>
        `}renderErrorCard(){const e=document.createElement("div");e.className="anime-card error-card",e.innerHTML=`
            <div class="error-content">
                <img src="${this.defaultImage}" alt="\u041E\u0448\u0438\u0431\u043A\u0430 \u0437\u0430\u0433\u0440\u0443\u0437\u043A\u0438">
                <p>\u041E\u0448\u0438\u0431\u043A\u0430 \u0437\u0430\u0433\u0440\u0443\u0437\u043A\u0438 \u043A\u0430\u0440\u0442\u043E\u0447\u043A\u0438</p>
            </div>
        `,this.parent.appendChild(e)}setupCardInteractions(e,t,r){typeof r=="function"&&(e.addEventListener("click",()=>r(t)),e.classList.add("clickable"),e.setAttribute("role","button"),e.setAttribute("tabindex","0"),e.addEventListener("keydown",i=>{(i.key==="Enter"||i.key===" ")&&(i.preventDefault(),r(t))}))}validateImageUrl(e){if(!e)return this.defaultImage;try{return new URL(e),e}catch{return this.defaultImage}}escapeHtml(e){return e?e.toString().replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#039;"):""}formatRating(e){return parseFloat(e).toFixed(1)}}class u{constructor(e="http://localhost:3000"){this.baseUrl=e}getAnimes(){return`${this.baseUrl}/animes`}getFilteredAnimes(e){return`${this.baseUrl}/animes?filter=${encodeURIComponent(e)}`}getAnimeById(e){return`${this.baseUrl}/animes/${e}`}createAnime(){return`${this.baseUrl}/animes`}deleteAnime(e){return`${this.baseUrl}/animes/${e}`}updateAnime(e){return`${this.baseUrl}/animes/${e}`}}const d=new u;class m{constructor(e,t={}){this.parent=e,this.data={image:t.image||"https://via.placeholder.com/800x400?text=No+Image",title:t.title||"\u041D\u0430\u0437\u0432\u0430\u043D\u0438\u0435 \u043D\u0435 \u0443\u043A\u0430\u0437\u0430\u043D\u043E",description:t.description||"\u041E\u043F\u0438\u0441\u0430\u043D\u0438\u0435 \u043E\u0442\u0441\u0443\u0442\u0441\u0442\u0432\u0443\u0435\u0442",episodes:t.episodes||0,rating:t.rating||0,id:t.id||null}}async fetchAnimeDetails(){if(!!this.data.id)try{const e=await fetch(`${d.animeDetails}/${this.data.id}`);if(!e.ok)throw new Error(`HTTP error! status: ${e.status}`);const t=await e.json();this.data={...this.data,...t},this.render()}catch(e){console.error("\u041E\u0448\u0438\u0431\u043A\u0430 \u043F\u0440\u0438 \u0437\u0430\u0433\u0440\u0443\u0437\u043A\u0435 \u0434\u0430\u043D\u043D\u044B\u0445:",e),this.showError()}}render(){if(!this.validateData()){console.error("Invalid anime data:",this.data),this.showError();return}this.parent.innerHTML=this.getTemplate(),this.renderEpisodes(),this.setupBackButton(),this.setupEventListeners()}validateData(){return typeof this.data=="object"&&this.data!==null&&typeof this.data.image=="string"&&typeof this.data.title=="string"}getTemplate(){return`
            <div class="anime-page">
                ${this.getBackButton()}
                ${this.getPoster()}
                ${this.getTitle()}
                ${this.getMeta()}
                ${this.getDescription()}
                ${this.getEpisodesSection()}
                ${this.getLoadingIndicator()}
            </div>
        `}getBackButton(){return`
            <div class="back-container">
                <button class="back-button" id="back-button" aria-label="\u0412\u0435\u0440\u043D\u0443\u0442\u044C\u0441\u044F \u043D\u0430\u0437\u0430\u0434">
                    <span class="back-arrow">\u2190</span>
                    <span class="back-text">\u041A \u0441\u043F\u0438\u0441\u043A\u0443 \u0430\u043D\u0438\u043C\u0435</span>
                </button>
            </div>
        `}getPoster(){return`
            <div class="anime-poster">
                <img src="${this.data.image}" 
                     alt="\u041F\u043E\u0441\u0442\u0435\u0440 \u0430\u043D\u0438\u043C\u0435 ${this.data.title}"
                     loading="lazy"
                     onerror="this.onerror=null; this.src='https://via.placeholder.com/800x400?text=Image+Error'">
            </div>
        `}getTitle(){return`<h1 class="anime-title">${this.data.title}</h1>`}getMeta(){return`
            <div class="anime-meta">
                ${this.data.episodes>0?`
                    <span class="meta-badge episode-badge">
                        ${this.data.episodes} \u044D\u043F\u0438\u0437\u043E\u0434\u043E\u0432
                    </span>
                `:""}
                ${this.data.rating>0?`
                    <span class="meta-badge rating-badge">
                        ${this.data.rating.toFixed(1)}\u2605
                    </span>
                `:""}
            </div>
        `}getDescription(){return this.data.description?`
            <div class="description-section">
                <h2>\u041E\u043F\u0438\u0441\u0430\u043D\u0438\u0435</h2>
                <p class="anime-description">${this.data.description}</p>
            </div>
        `:""}getEpisodesSection(){return this.data.episodes>0?`
            <div class="episodes-section">
                <h3>\u0421\u043F\u0438\u0441\u043E\u043A \u044D\u043F\u0438\u0437\u043E\u0434\u043E\u0432:</h3>
                <div id="episodes-container" class="episodes-container"></div>
            </div>
        `:""}getLoadingIndicator(){return`
            <div id="loading-indicator" class="loading-indicator" style="display: none;">
                \u0417\u0430\u0433\u0440\u0443\u0437\u043A\u0430 \u0434\u0430\u043D\u043D\u044B\u0445...
            </div>
        `}showError(){this.parent.innerHTML=`
            <div class="error-container">
                <h2>\u041E\u0448\u0438\u0431\u043A\u0430 \u0437\u0430\u0433\u0440\u0443\u0437\u043A\u0438 \u0434\u0430\u043D\u043D\u044B\u0445</h2>
                <p>\u041F\u043E\u043F\u0440\u043E\u0431\u0443\u0439\u0442\u0435 \u043E\u0431\u043D\u043E\u0432\u0438\u0442\u044C \u0441\u0442\u0440\u0430\u043D\u0438\u0446\u0443 \u0438\u043B\u0438 \u0432\u0435\u0440\u043D\u0443\u0442\u044C\u0441\u044F \u043F\u043E\u0437\u0436\u0435</p>
                <button id="back-button" class="error-back-button">\u0412\u0435\u0440\u043D\u0443\u0442\u044C\u0441\u044F \u043D\u0430\u0437\u0430\u0434</button>
            </div>
        `,this.setupBackButton()}setupBackButton(){const e=this.parent.querySelector("#back-button");e&&e.addEventListener("click",()=>{this.parent.innerHTML="",new l(this.parent).render()})}setupEventListeners(){}renderEpisodes(){const e=this.parent.querySelector("#episodes-container");if(!(!e||this.data.episodes<=0)){e.innerHTML="";for(let t=1;t<=this.data.episodes;t++)e.appendChild(this.createEpisodeButton(t))}}createEpisodeButton(e){const t=document.createElement("button");return t.className="episode-btn",t.textContent=`\u042D\u043F\u0438\u0437\u043E\u0434 ${e}`,t.addEventListener("click",()=>this.watchEpisode(e)),t}async watchEpisode(e){try{const t=await fetch(`${d.watchEpisode}/${this.data.id}/${e}`);if(!t.ok)throw new Error(`\u041E\u0448\u0438\u0431\u043A\u0430 \u0437\u0430\u0433\u0440\u0443\u0437\u043A\u0438 \u044D\u043F\u0438\u0437\u043E\u0434\u0430: ${t.status}`);const r=await t.json();console.log("\u0414\u0430\u043D\u043D\u044B\u0435 \u044D\u043F\u0438\u0437\u043E\u0434\u0430:",r)}catch(t){console.error("\u041E\u0448\u0438\u0431\u043A\u0430 \u043F\u0440\u0438 \u0437\u0430\u0433\u0440\u0443\u0437\u043A\u0435 \u044D\u043F\u0438\u0437\u043E\u0434\u0430:",t),alert("\u041D\u0435 \u0443\u0434\u0430\u043B\u043E\u0441\u044C \u0437\u0430\u0433\u0440\u0443\u0437\u0438\u0442\u044C \u044D\u043F\u0438\u0437\u043E\u0434. \u041F\u043E\u0436\u0430\u043B\u0443\u0439\u0441\u0442\u0430, \u043F\u043E\u043F\u0440\u043E\u0431\u0443\u0439\u0442\u0435 \u043F\u043E\u0437\u0436\u0435.")}}}class g{constructor(e,t){this.parent=e,this.onClick=t}render(){const e=document.createElement("button");e.className="btn primary",e.textContent="\u0414\u043E\u0431\u0430\u0432\u0438\u0442\u044C \u0430\u043D\u0438\u043C\u0435",e.addEventListener("click",this.onClick),this.parent.appendChild(e)}}class f{constructor(e,t){this.parent=e,this.onClick=t}render(){const e=document.createElement("button");e.className="control-btn delete-btn",e.innerHTML="\xD7 \u0423\u0434\u0430\u043B\u0438\u0442\u044C \u043F\u0435\u0440\u0432\u043E\u0435",e.addEventListener("click",this.onClick),this.parent.appendChild(e)}}class v{constructor(e,t){this.parent=e,this.onClick=t}render(){const e=document.createElement("button");e.className="control-btn",e.innerHTML="\u21C5 \u0421\u043E\u0440\u0442\u0438\u0440\u043E\u0432\u0430\u0442\u044C",e.addEventListener("click",this.onClick),this.parent.appendChild(e)}}class h{constructor(e,t=-1){this.parent=e,this.id=t,this.formData={title:"",description:"",episodes:0,image:"",rating:0}}async render(){if(this.id!==-1)try{await this.loadAnimeData()}catch(e){console.error("\u041E\u0448\u0438\u0431\u043A\u0430 \u0437\u0430\u0433\u0440\u0443\u0437\u043A\u0438 \u0434\u0430\u043D\u043D\u044B\u0445:",e),this.showError("\u041D\u0435 \u0443\u0434\u0430\u043B\u043E\u0441\u044C \u0437\u0430\u0433\u0440\u0443\u0437\u0438\u0442\u044C \u0434\u0430\u043D\u043D\u044B\u0435 \u0430\u043D\u0438\u043C\u0435");return}this.parent.innerHTML=`
            <div class="redact-page">
                <div class="header">
                    <button class="back-btn" id="back-btn">\u2190 \u041D\u0430\u0437\u0430\u0434</button>
                    <h2>${this.id===-1?"\u0414\u043E\u0431\u0430\u0432\u043B\u0435\u043D\u0438\u0435":"\u0420\u0435\u0434\u0430\u043A\u0442\u0438\u0440\u043E\u0432\u0430\u043D\u0438\u0435"} \u0430\u043D\u0438\u043C\u0435</h2>
                </div>
                
                <form id="anime-form" class="anime-form">
                    <div class="form-group">
                        <label for="title">\u041D\u0430\u0437\u0432\u0430\u043D\u0438\u0435 *</label>
                        <input type="text" id="title" required 
                               value="${this.escapeHtml(this.formData.title)}">
                    </div>
                    
                    <div class="form-group">
                        <label for="image">\u0421\u0441\u044B\u043B\u043A\u0430 \u043D\u0430 \u043E\u0431\u043B\u043E\u0436\u043A\u0443</label>
                        <input type="url" id="image" 
                               value="${this.escapeHtml(this.formData.image)}">
                        <div class="image-preview" id="image-preview">
                            ${this.formData.image?`<img src="${this.escapeHtml(this.formData.image)}" alt="\u041F\u0440\u0435\u0432\u044C\u044E">`:""}
                        </div>
                    </div>
                    
                    <div class="form-group">
                        <label for="description">\u041E\u043F\u0438\u0441\u0430\u043D\u0438\u0435</label>
                        <textarea id="description">${this.escapeHtml(this.formData.description)}</textarea>
                    </div>
                    
                    <div class="form-group">
                        <label for="episodes">\u041A\u043E\u043B\u0438\u0447\u0435\u0441\u0442\u0432\u043E \u044D\u043F\u0438\u0437\u043E\u0434\u043E\u0432</label>
                        <input type="number" id="episodes" min="0" 
                               value="${this.formData.episodes}">
                    </div>
                    
                    <div class="form-group">
                        <label for="rating">\u0420\u0435\u0439\u0442\u0438\u043D\u0433 (0-10)</label>
                        <input type="number" id="rating" min="0" max="10" step="0.1"
                               value="${this.formData.rating}">
                    </div>
                    
                    <div class="form-actions">
                        <button type="submit" class="btn primary">
                            ${this.id===-1?"\u0421\u043E\u0437\u0434\u0430\u0442\u044C":"\u0421\u043E\u0445\u0440\u0430\u043D\u0438\u0442\u044C"}
                        </button>
                        <button type="button" class="btn" id="cancel-btn">\u041E\u0442\u043C\u0435\u043D\u0430</button>
                    </div>
                </form>
                
                <div id="error-message" class="error-message"></div>
            </div>
        `,this.setupPreview(),this.setupEventListeners()}async loadAnimeData(){const e=await fetch(d.getAnimeById(this.id));if(!e.ok)throw new Error(`\u041E\u0448\u0438\u0431\u043A\u0430 \u0437\u0430\u0433\u0440\u0443\u0437\u043A\u0438: ${e.status}`);const t=await e.json();this.formData={title:t.title||"",description:t.description||"",episodes:t.episodes||0,image:t.src||t.image||"",rating:t.rating||0}}setupPreview(){const e=document.getElementById("image"),t=document.getElementById("image-preview");e.addEventListener("input",()=>{const r=e.value.trim();r?t.innerHTML=`<img src="${r}" alt="\u041F\u0440\u0435\u0432\u044C\u044E \u043E\u0431\u043B\u043E\u0436\u043A\u0438" onerror="this.src='https://via.placeholder.com/300x450?text=\u041E\u0448\u0438\u0431\u043A\u0430+\u0437\u0430\u0433\u0440\u0443\u0437\u043A\u0438'">`:t.innerHTML='<div class="preview-placeholder">\u041F\u0440\u0435\u0432\u044C\u044E \u043F\u043E\u044F\u0432\u0438\u0442\u0441\u044F \u0437\u0434\u0435\u0441\u044C</div>'})}setupEventListeners(){document.getElementById("anime-form").addEventListener("submit",async e=>{e.preventDefault(),await this.handleSubmit()}),document.getElementById("cancel-btn").addEventListener("click",()=>{this.navigateBack()}),document.getElementById("back-btn").addEventListener("click",()=>{this.navigateBack()})}async handleSubmit(){const e={title:document.getElementById("title").value.trim(),description:document.getElementById("description").value.trim(),episodes:parseInt(document.getElementById("episodes").value)||0,src:document.getElementById("image").value.trim(),rating:parseFloat(document.getElementById("rating").value)||0};if(!e.title){this.showError("\u041F\u043E\u0436\u0430\u043B\u0443\u0439\u0441\u0442\u0430, \u0443\u043A\u0430\u0436\u0438\u0442\u0435 \u043D\u0430\u0437\u0432\u0430\u043D\u0438\u0435 \u0430\u043D\u0438\u043C\u0435");return}try{this.id===-1?await this._sendCreateRequest(e):await this._sendUpdateRequest(e),this.navigateBack()}catch(t){console.error("\u041E\u0448\u0438\u0431\u043A\u0430:",t),this.showError(t.message||"\u041F\u0440\u043E\u0438\u0437\u043E\u0448\u043B\u0430 \u043E\u0448\u0438\u0431\u043A\u0430 \u043F\u0440\u0438 \u0441\u043E\u0445\u0440\u0430\u043D\u0435\u043D\u0438\u0438")}}async _sendCreateRequest(e){const t=await fetch(d.createAnime(),{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(e)});if(!t.ok)throw new Error(`\u041E\u0448\u0438\u0431\u043A\u0430 \u0441\u043E\u0437\u0434\u0430\u043D\u0438\u044F: ${t.status}`);alert("\u0410\u043D\u0438\u043C\u0435 \u0443\u0441\u043F\u0435\u0448\u043D\u043E \u0434\u043E\u0431\u0430\u0432\u043B\u0435\u043D\u043E!")}async _sendUpdateRequest(e){const t=await fetch(d.updateAnimeById(this.id),{method:"PATCH",headers:{"Content-Type":"application/json"},body:JSON.stringify(e)});if(!t.ok)throw new Error(`\u041E\u0448\u0438\u0431\u043A\u0430 \u0441\u043E\u0445\u0440\u0430\u043D\u0435\u043D\u0438\u044F: ${t.status}`);alert("\u0418\u0437\u043C\u0435\u043D\u0435\u043D\u0438\u044F \u0441\u043E\u0445\u0440\u0430\u043D\u0435\u043D\u044B!")}navigateBack(){new l(this.parent).render()}showError(e){const t=document.getElementById("error-message");t&&(t.textContent=e,t.style.display="block")}escapeHtml(e){return e?e.toString().replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#039;"):""}}class l{constructor(e){this.parent=e,this.animeData=[],this.filteredAnime=[],this.sortStatus=0,this.searchDebounceTimer=null}async render(){this.parent.innerHTML=`
            <div class="main-page">
                <div class="search-container">
                    <input type="text" class="search-input" placeholder="\u041F\u043E\u0438\u0441\u043A \u0430\u043D\u0438\u043C\u0435..." id="anime-search">
                    <div class="search-results" id="search-results"></div>
                </div>
                <div class="controls-container" id="controls-container"></div>
                <div class="anime-grid" id="anime-grid"></div>
                <div class="loading-indicator" id="loading-indicator">\u0417\u0430\u0433\u0440\u0443\u0437\u043A\u0430 \u0434\u0430\u043D\u043D\u044B\u0445...</div>
            </div>
        `;try{await this.loadAnimeData(),this.initSearch(),this.initControls(),this.renderAnimeGrid()}catch(e){console.error("Render error:",e),this.showError(e)}finally{this.hideLoading()}}async deleteFirstAnime(){if(this.filteredAnime.length===0){alert("\u041D\u0435\u0442 \u044D\u043B\u0435\u043C\u0435\u043D\u0442\u043E\u0432 \u0434\u043B\u044F \u0443\u0434\u0430\u043B\u0435\u043D\u0438\u044F");return}const e=this.filteredAnime[0];if(!!confirm(`\u0423\u0434\u0430\u043B\u0438\u0442\u044C "${e.title}"?`))try{const t=await fetch(d.deleteAnime(e.id),{method:"DELETE"});if(!t.ok)throw new Error(`\u041E\u0448\u0438\u0431\u043A\u0430 \u0443\u0434\u0430\u043B\u0435\u043D\u0438\u044F: \u0441\u0442\u0430\u0442\u0443\u0441 ${t.status}`);this.animeData=this.animeData.filter(r=>r.id!==e.id),this.filteredAnime=this.filteredAnime.filter(r=>r.id!==e.id),this.renderAnimeGrid()}catch(t){console.error("Delete error:",t),alert(`\u041E\u0448\u0438\u0431\u043A\u0430 \u043F\u0440\u0438 \u0443\u0434\u0430\u043B\u0435\u043D\u0438\u0438: ${t.message}`)}}async loadAnimeData(){this.showLoading();try{const e=await fetch(d.getAnimes());if(!e.ok)throw new Error(`HTTP error ${e.status}`);const t=await e.json();let r=t;if(!Array.isArray(t))if(t.data&&Array.isArray(t.data))r=t.data;else if(t.items&&Array.isArray(t.items))r=t.items;else throw new Error("Expected array but got: "+typeof t);this.animeData=r.map(i=>({id:i.id,title:i.title||"No title",description:i.description||"",episodes:i.episodes||0,image:i.src||i.image||"placeholder.jpg",rating:i.rating||0})),this.filteredAnime=[...this.animeData]}catch(e){throw console.error("Load anime data error:",e),e}}initSearch(){const e=document.getElementById("anime-search"),t=document.getElementById("search-results");e.addEventListener("input",r=>{clearTimeout(this.searchDebounceTimer),this.searchDebounceTimer=setTimeout(()=>{const i=r.target.value.toLowerCase().trim();i.length>0?(this.filteredAnime=this.animeData.filter(s=>s.title.toLowerCase().includes(i)||s.description&&s.description.toLowerCase().includes(i)),t.innerHTML=this.filteredAnime.slice(0,5).map(s=>`
                            <div class="search-result-item" data-id="${s.id}">
                                <img src="${s.image}" alt="${s.title}" class="search-result-image">
                                <div class="search-result-info">
                                    <div class="search-result-title">${s.title}</div>
                                    <div class="search-result-meta">
                                        <span>${s.episodes} \u044D\u043F.</span>
                                        <span>${s.rating.toFixed(1)}\u2605</span>
                                    </div>
                                </div>
                            </div>
                        `).join(""),t.style.display=this.filteredAnime.length?"block":"none"):(this.filteredAnime=[...this.animeData],t.style.display="none"),this.renderAnimeGrid()},300)}),t.addEventListener("click",r=>{const i=r.target.closest(".search-result-item");if(i){const s=i.dataset.id,n=this.animeData.find(c=>c.id.toString()===s);n&&new m(this.parent,n).render()}})}initControls(){const e=document.getElementById("controls-container");new g(e,()=>{this.parent.innerHTML="",new h(this.parent,-1).render()}).render(),new v(e,()=>{this.sortStatus=this.sortStatus===1?2:1,this.filteredAnime.sort((t,r)=>this.sortStatus===1?t.title.localeCompare(r.title):r.title.localeCompare(t.title)),this.renderAnimeGrid()}).render(),new f(e,()=>this.deleteFirstAnime()).render()}renderAnimeGrid(){const e=document.getElementById("anime-grid");if(e.innerHTML="",this.filteredAnime.length===0){e.innerHTML='<p class="no-results">\u0410\u043D\u0438\u043C\u0435 \u043D\u0435 \u043D\u0430\u0439\u0434\u0435\u043D\u043E</p>';return}this.filteredAnime.forEach(t=>{new p(e).render(t,i=>{new m(this.parent,i).render()})})}showLoading(){const e=document.getElementById("loading-indicator");e&&(e.style.display="block")}hideLoading(){const e=document.getElementById("loading-indicator");e&&(e.style.display="none")}showError(e){const t=document.getElementById("anime-grid")||this.parent;t.innerHTML=`
            <div class="error-message">
                <h3>\u041E\u0448\u0438\u0431\u043A\u0430 \u0437\u0430\u0433\u0440\u0443\u0437\u043A\u0438 \u0434\u0430\u043D\u043D\u044B\u0445</h3>
                <p>${e.message}</p>
                <div class="error-details">
                    <p>\u041F\u0440\u043E\u0432\u0435\u0440\u044C\u0442\u0435:</p>
                    <ul>
                        <li>\u0421\u0435\u0440\u0432\u0435\u0440 \u0437\u0430\u043F\u0443\u0449\u0435\u043D \u043D\u0430 ${d.baseUrl}</li>
                        <li>\u042D\u043D\u0434\u043F\u043E\u0438\u043D\u0442 /animes \u0434\u043E\u0441\u0442\u0443\u043F\u0435\u043D</li>
                        <li>\u0421\u0435\u0442\u0435\u0432\u043E\u0435 \u043F\u043E\u0434\u043A\u043B\u044E\u0447\u0435\u043D\u0438\u0435 \u0430\u043A\u0442\u0438\u0432\u043D\u043E</li>
                    </ul>
                </div>
                <button id="retry-btn" class="btn">\u041F\u043E\u043F\u0440\u043E\u0431\u043E\u0432\u0430\u0442\u044C \u0441\u043D\u043E\u0432\u0430</button>
            </div>
        `,document.getElementById("retry-btn").addEventListener("click",()=>{this.render()})}}class b{constructor(e){this.root=e,this.routes={"/":l,"/main":l,"/anime/:id":m,"/edit/:id":h,"/create":h},this.currentPage=null,this.init()}init(){window.addEventListener("DOMContentLoaded",()=>{this.navigate(window.location.pathname)}),document.body.addEventListener("click",e=>{if(e.target.matches("[data-link]")){e.preventDefault();const t=e.target.getAttribute("href");this.navigate(t)}}),window.addEventListener("popstate",()=>{this.navigate(window.location.pathname,!1)})}async navigate(e,t=!0){var n,c;this.currentPage&&((c=(n=this.currentPage).unmount)==null||c.call(n),this.root.innerHTML="");const r=this.matchRoute(e);if(!r){this.show404();return}const{PageClass:i,params:s}=r;t&&window.history.pushState(null,"",e);try{this.currentPage=new i(this.root,s),await this.currentPage.render(),document.title=this.getPageTitle(this.currentPage),this.updateActiveNavLink(e)}catch(o){console.error("Page render error:",o),this.showError()}}matchRoute(e){for(const[t,r]of Object.entries(this.routes)){const i=t.split("/"),s=e.split("/");if(i.length!==s.length)continue;let n=!0;const c={};for(let o=0;o<i.length;o++)if(i[o].startsWith(":"))c[i[o].substring(1)]=s[o];else if(i[o]!==s[o]){n=!1;break}if(n)return{PageClass:r,params:c}}return null}getPageTitle(e){var t;return e instanceof l?"\u0413\u043B\u0430\u0432\u043D\u0430\u044F | \u0410\u043D\u0438\u043C\u0435 \u043A\u0430\u0442\u0430\u043B\u043E\u0433":e instanceof m?`${((t=e.data)==null?void 0:t.title)||"\u0410\u043D\u0438\u043C\u0435"} | \u0410\u043D\u0438\u043C\u0435 \u043A\u0430\u0442\u0430\u043B\u043E\u0433`:e instanceof h?e.id===-1?"\u0421\u043E\u0437\u0434\u0430\u043D\u0438\u0435 \u0430\u043D\u0438\u043C\u0435":"\u0420\u0435\u0434\u0430\u043A\u0442\u0438\u0440\u043E\u0432\u0430\u043D\u0438\u0435 \u0430\u043D\u0438\u043C\u0435":"\u0410\u043D\u0438\u043C\u0435 \u043A\u0430\u0442\u0430\u043B\u043E\u0433"}updateActiveNavLink(e){document.querySelectorAll("[data-link]").forEach(t=>{const r=t.getAttribute("href");t.classList.toggle("active",r===e)})}show404(){this.root.innerHTML=`
            <div class="error-page">
                <h1>404</h1>
                <p>\u0421\u0442\u0440\u0430\u043D\u0438\u0446\u0430 \u043D\u0435 \u043D\u0430\u0439\u0434\u0435\u043D\u0430</p>
                <a href="/" data-link>\u0412\u0435\u0440\u043D\u0443\u0442\u044C\u0441\u044F \u043D\u0430 \u0433\u043B\u0430\u0432\u043D\u0443\u044E</a>
            </div>
        `}showError(){this.root.innerHTML=`
            <div class="error-page">
                <h1>\u041E\u0448\u0438\u0431\u043A\u0430</h1>
                <p>\u041F\u0440\u043E\u0438\u0437\u043E\u0448\u043B\u0430 \u043E\u0448\u0438\u0431\u043A\u0430 \u043F\u0440\u0438 \u0437\u0430\u0433\u0440\u0443\u0437\u043A\u0435 \u0441\u0442\u0440\u0430\u043D\u0438\u0446\u044B</p>
                <a href="/" data-link>\u0412\u0435\u0440\u043D\u0443\u0442\u044C\u0441\u044F \u043D\u0430 \u0433\u043B\u0430\u0432\u043D\u0443\u044E</a>
            </div>
        `}}document.addEventListener("DOMContentLoaded",()=>{const a=document.getElementById("root");if(a){const e=new b(a);window.addEventListener("beforeunload",()=>{localStorage.setItem("lastVisitedPath",window.location.pathname)});const t=localStorage.getItem("lastVisitedPath");t&&t!==window.location.pathname&&e.navigate(t)}else console.error("Root element not found")});
