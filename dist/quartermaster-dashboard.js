function e(e,t,i,o){var s,n=arguments.length,r=n<3?t:null===o?o=Object.getOwnPropertyDescriptor(t,i):o;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)r=Reflect.decorate(e,t,i,o);else for(var a=e.length-1;a>=0;a--)(s=e[a])&&(r=(n<3?s(r):n>3?s(t,i,r):s(t,i))||r);return n>3&&r&&Object.defineProperty(t,i,r),r}"function"==typeof SuppressedError&&SuppressedError;const t=globalThis,i=t.ShadowRoot&&(void 0===t.ShadyCSS||t.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,o=Symbol(),s=new WeakMap;let n=class{constructor(e,t,i){if(this._$cssResult$=!0,i!==o)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=e,this.t=t}get styleSheet(){let e=this.o;const t=this.t;if(i&&void 0===e){const i=void 0!==t&&1===t.length;i&&(e=s.get(t)),void 0===e&&((this.o=e=new CSSStyleSheet).replaceSync(this.cssText),i&&s.set(t,e))}return e}toString(){return this.cssText}};const r=(e,...t)=>{const i=1===e.length?e[0]:t.reduce((t,i,o)=>t+(e=>{if(!0===e._$cssResult$)return e.cssText;if("number"==typeof e)return e;throw Error("Value passed to 'css' function must be a 'css' function result: "+e+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(i)+e[o+1],e[0]);return new n(i,e,o)},a=i?e=>e:e=>e instanceof CSSStyleSheet?(e=>{let t="";for(const i of e.cssRules)t+=i.cssText;return(e=>new n("string"==typeof e?e:e+"",void 0,o))(t)})(e):e,{is:l,defineProperty:c,getOwnPropertyDescriptor:d,getOwnPropertyNames:u,getOwnPropertySymbols:h,getPrototypeOf:p}=Object,m=globalThis,_=m.trustedTypes,g=_?_.emptyScript:"",v=m.reactiveElementPolyfillSupport,f=(e,t)=>e,y={toAttribute(e,t){switch(t){case Boolean:e=e?g:null;break;case Object:case Array:e=null==e?e:JSON.stringify(e)}return e},fromAttribute(e,t){let i=e;switch(t){case Boolean:i=null!==e;break;case Number:i=null===e?null:Number(e);break;case Object:case Array:try{i=JSON.parse(e)}catch(e){i=null}}return i}},$=(e,t)=>!l(e,t),b={attribute:!0,type:String,converter:y,reflect:!1,useDefault:!1,hasChanged:$};Symbol.metadata??=Symbol("metadata"),m.litPropertyMetadata??=new WeakMap;let w=class extends HTMLElement{static addInitializer(e){this._$Ei(),(this.l??=[]).push(e)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(e,t=b){if(t.state&&(t.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(e)&&((t=Object.create(t)).wrapped=!0),this.elementProperties.set(e,t),!t.noAccessor){const i=Symbol(),o=this.getPropertyDescriptor(e,i,t);void 0!==o&&c(this.prototype,e,o)}}static getPropertyDescriptor(e,t,i){const{get:o,set:s}=d(this.prototype,e)??{get(){return this[t]},set(e){this[t]=e}};return{get:o,set(t){const n=o?.call(this);s?.call(this,t),this.requestUpdate(e,n,i)},configurable:!0,enumerable:!0}}static getPropertyOptions(e){return this.elementProperties.get(e)??b}static _$Ei(){if(this.hasOwnProperty(f("elementProperties")))return;const e=p(this);e.finalize(),void 0!==e.l&&(this.l=[...e.l]),this.elementProperties=new Map(e.elementProperties)}static finalize(){if(this.hasOwnProperty(f("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(f("properties"))){const e=this.properties,t=[...u(e),...h(e)];for(const i of t)this.createProperty(i,e[i])}const e=this[Symbol.metadata];if(null!==e){const t=litPropertyMetadata.get(e);if(void 0!==t)for(const[e,i]of t)this.elementProperties.set(e,i)}this._$Eh=new Map;for(const[e,t]of this.elementProperties){const i=this._$Eu(e,t);void 0!==i&&this._$Eh.set(i,e)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(e){const t=[];if(Array.isArray(e)){const i=new Set(e.flat(1/0).reverse());for(const e of i)t.unshift(a(e))}else void 0!==e&&t.push(a(e));return t}static _$Eu(e,t){const i=t.attribute;return!1===i?void 0:"string"==typeof i?i:"string"==typeof e?e.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise(e=>this.enableUpdating=e),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(e=>e(this))}addController(e){(this._$EO??=new Set).add(e),void 0!==this.renderRoot&&this.isConnected&&e.hostConnected?.()}removeController(e){this._$EO?.delete(e)}_$E_(){const e=new Map,t=this.constructor.elementProperties;for(const i of t.keys())this.hasOwnProperty(i)&&(e.set(i,this[i]),delete this[i]);e.size>0&&(this._$Ep=e)}createRenderRoot(){const e=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return((e,o)=>{if(i)e.adoptedStyleSheets=o.map(e=>e instanceof CSSStyleSheet?e:e.styleSheet);else for(const i of o){const o=document.createElement("style"),s=t.litNonce;void 0!==s&&o.setAttribute("nonce",s),o.textContent=i.cssText,e.appendChild(o)}})(e,this.constructor.elementStyles),e}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach(e=>e.hostConnected?.())}enableUpdating(e){}disconnectedCallback(){this._$EO?.forEach(e=>e.hostDisconnected?.())}attributeChangedCallback(e,t,i){this._$AK(e,i)}_$ET(e,t){const i=this.constructor.elementProperties.get(e),o=this.constructor._$Eu(e,i);if(void 0!==o&&!0===i.reflect){const s=(void 0!==i.converter?.toAttribute?i.converter:y).toAttribute(t,i.type);this._$Em=e,null==s?this.removeAttribute(o):this.setAttribute(o,s),this._$Em=null}}_$AK(e,t){const i=this.constructor,o=i._$Eh.get(e);if(void 0!==o&&this._$Em!==o){const e=i.getPropertyOptions(o),s="function"==typeof e.converter?{fromAttribute:e.converter}:void 0!==e.converter?.fromAttribute?e.converter:y;this._$Em=o;const n=s.fromAttribute(t,e.type);this[o]=n??this._$Ej?.get(o)??n,this._$Em=null}}requestUpdate(e,t,i,o=!1,s){if(void 0!==e){const n=this.constructor;if(!1===o&&(s=this[e]),i??=n.getPropertyOptions(e),!((i.hasChanged??$)(s,t)||i.useDefault&&i.reflect&&s===this._$Ej?.get(e)&&!this.hasAttribute(n._$Eu(e,i))))return;this.C(e,t,i)}!1===this.isUpdatePending&&(this._$ES=this._$EP())}C(e,t,{useDefault:i,reflect:o,wrapped:s},n){i&&!(this._$Ej??=new Map).has(e)&&(this._$Ej.set(e,n??t??this[e]),!0!==s||void 0!==n)||(this._$AL.has(e)||(this.hasUpdated||i||(t=void 0),this._$AL.set(e,t)),!0===o&&this._$Em!==e&&(this._$Eq??=new Set).add(e))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(e){Promise.reject(e)}const e=this.scheduleUpdate();return null!=e&&await e,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(const[e,t]of this._$Ep)this[e]=t;this._$Ep=void 0}const e=this.constructor.elementProperties;if(e.size>0)for(const[t,i]of e){const{wrapped:e}=i,o=this[t];!0!==e||this._$AL.has(t)||void 0===o||this.C(t,void 0,i,o)}}let e=!1;const t=this._$AL;try{e=this.shouldUpdate(t),e?(this.willUpdate(t),this._$EO?.forEach(e=>e.hostUpdate?.()),this.update(t)):this._$EM()}catch(t){throw e=!1,this._$EM(),t}e&&this._$AE(t)}willUpdate(e){}_$AE(e){this._$EO?.forEach(e=>e.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(e)),this.updated(e)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(e){return!0}update(e){this._$Eq&&=this._$Eq.forEach(e=>this._$ET(e,this[e])),this._$EM()}updated(e){}firstUpdated(e){}};w.elementStyles=[],w.shadowRootOptions={mode:"open"},w[f("elementProperties")]=new Map,w[f("finalized")]=new Map,v?.({ReactiveElement:w}),(m.reactiveElementVersions??=[]).push("2.1.2");const z=globalThis,k=e=>e,A=z.trustedTypes,x=A?A.createPolicy("lit-html",{createHTML:e=>e}):void 0,S="$lit$",C=`lit$${Math.random().toFixed(9).slice(2)}$`,q="?"+C,E=`<${q}>`,N=document,T=()=>N.createComment(""),P=e=>null===e||"object"!=typeof e&&"function"!=typeof e,M=Array.isArray,I="[ \t\n\f\r]",U=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,j=/-->/g,O=/>/g,R=RegExp(`>|${I}(?:([^\\s"'>=/]+)(${I}*=${I}*(?:[^ \t\n\f\r"'\`<>=]|("|')|))|$)`,"g"),D=/'/g,H=/"/g,L=/^(?:script|style|textarea|title)$/i,F=(e=>(t,...i)=>({_$litType$:e,strings:t,values:i}))(1),W=Symbol.for("lit-noChange"),Q=Symbol.for("lit-nothing"),Z=new WeakMap,B=N.createTreeWalker(N,129);function K(e,t){if(!M(e)||!e.hasOwnProperty("raw"))throw Error("invalid template strings array");return void 0!==x?x.createHTML(t):t}const V=(e,t)=>{const i=e.length-1,o=[];let s,n=2===t?"<svg>":3===t?"<math>":"",r=U;for(let t=0;t<i;t++){const i=e[t];let a,l,c=-1,d=0;for(;d<i.length&&(r.lastIndex=d,l=r.exec(i),null!==l);)d=r.lastIndex,r===U?"!--"===l[1]?r=j:void 0!==l[1]?r=O:void 0!==l[2]?(L.test(l[2])&&(s=RegExp("</"+l[2],"g")),r=R):void 0!==l[3]&&(r=R):r===R?">"===l[0]?(r=s??U,c=-1):void 0===l[1]?c=-2:(c=r.lastIndex-l[2].length,a=l[1],r=void 0===l[3]?R:'"'===l[3]?H:D):r===H||r===D?r=R:r===j||r===O?r=U:(r=R,s=void 0);const u=r===R&&e[t+1].startsWith("/>")?" ":"";n+=r===U?i+E:c>=0?(o.push(a),i.slice(0,c)+S+i.slice(c)+C+u):i+C+(-2===c?t:u)}return[K(e,n+(e[i]||"<?>")+(2===t?"</svg>":3===t?"</math>":"")),o]};class G{constructor({strings:e,_$litType$:t},i){let o;this.parts=[];let s=0,n=0;const r=e.length-1,a=this.parts,[l,c]=V(e,t);if(this.el=G.createElement(l,i),B.currentNode=this.el.content,2===t||3===t){const e=this.el.content.firstChild;e.replaceWith(...e.childNodes)}for(;null!==(o=B.nextNode())&&a.length<r;){if(1===o.nodeType){if(o.hasAttributes())for(const e of o.getAttributeNames())if(e.endsWith(S)){const t=c[n++],i=o.getAttribute(e).split(C),r=/([.?@])?(.*)/.exec(t);a.push({type:1,index:s,name:r[2],strings:i,ctor:"."===r[1]?te:"?"===r[1]?ie:"@"===r[1]?oe:ee}),o.removeAttribute(e)}else e.startsWith(C)&&(a.push({type:6,index:s}),o.removeAttribute(e));if(L.test(o.tagName)){const e=o.textContent.split(C),t=e.length-1;if(t>0){o.textContent=A?A.emptyScript:"";for(let i=0;i<t;i++)o.append(e[i],T()),B.nextNode(),a.push({type:2,index:++s});o.append(e[t],T())}}}else if(8===o.nodeType)if(o.data===q)a.push({type:2,index:s});else{let e=-1;for(;-1!==(e=o.data.indexOf(C,e+1));)a.push({type:7,index:s}),e+=C.length-1}s++}}static createElement(e,t){const i=N.createElement("template");return i.innerHTML=e,i}}function Y(e,t,i=e,o){if(t===W)return t;let s=void 0!==o?i._$Co?.[o]:i._$Cl;const n=P(t)?void 0:t._$litDirective$;return s?.constructor!==n&&(s?._$AO?.(!1),void 0===n?s=void 0:(s=new n(e),s._$AT(e,i,o)),void 0!==o?(i._$Co??=[])[o]=s:i._$Cl=s),void 0!==s&&(t=Y(e,s._$AS(e,t.values),s,o)),t}class J{constructor(e,t){this._$AV=[],this._$AN=void 0,this._$AD=e,this._$AM=t}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(e){const{el:{content:t},parts:i}=this._$AD,o=(e?.creationScope??N).importNode(t,!0);B.currentNode=o;let s=B.nextNode(),n=0,r=0,a=i[0];for(;void 0!==a;){if(n===a.index){let t;2===a.type?t=new X(s,s.nextSibling,this,e):1===a.type?t=new a.ctor(s,a.name,a.strings,this,e):6===a.type&&(t=new se(s,this,e)),this._$AV.push(t),a=i[++r]}n!==a?.index&&(s=B.nextNode(),n++)}return B.currentNode=N,o}p(e){let t=0;for(const i of this._$AV)void 0!==i&&(void 0!==i.strings?(i._$AI(e,i,t),t+=i.strings.length-2):i._$AI(e[t])),t++}}class X{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(e,t,i,o){this.type=2,this._$AH=Q,this._$AN=void 0,this._$AA=e,this._$AB=t,this._$AM=i,this.options=o,this._$Cv=o?.isConnected??!0}get parentNode(){let e=this._$AA.parentNode;const t=this._$AM;return void 0!==t&&11===e?.nodeType&&(e=t.parentNode),e}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(e,t=this){e=Y(this,e,t),P(e)?e===Q||null==e||""===e?(this._$AH!==Q&&this._$AR(),this._$AH=Q):e!==this._$AH&&e!==W&&this._(e):void 0!==e._$litType$?this.$(e):void 0!==e.nodeType?this.T(e):(e=>M(e)||"function"==typeof e?.[Symbol.iterator])(e)?this.k(e):this._(e)}O(e){return this._$AA.parentNode.insertBefore(e,this._$AB)}T(e){this._$AH!==e&&(this._$AR(),this._$AH=this.O(e))}_(e){this._$AH!==Q&&P(this._$AH)?this._$AA.nextSibling.data=e:this.T(N.createTextNode(e)),this._$AH=e}$(e){const{values:t,_$litType$:i}=e,o="number"==typeof i?this._$AC(e):(void 0===i.el&&(i.el=G.createElement(K(i.h,i.h[0]),this.options)),i);if(this._$AH?._$AD===o)this._$AH.p(t);else{const e=new J(o,this),i=e.u(this.options);e.p(t),this.T(i),this._$AH=e}}_$AC(e){let t=Z.get(e.strings);return void 0===t&&Z.set(e.strings,t=new G(e)),t}k(e){M(this._$AH)||(this._$AH=[],this._$AR());const t=this._$AH;let i,o=0;for(const s of e)o===t.length?t.push(i=new X(this.O(T()),this.O(T()),this,this.options)):i=t[o],i._$AI(s),o++;o<t.length&&(this._$AR(i&&i._$AB.nextSibling,o),t.length=o)}_$AR(e=this._$AA.nextSibling,t){for(this._$AP?.(!1,!0,t);e!==this._$AB;){const t=k(e).nextSibling;k(e).remove(),e=t}}setConnected(e){void 0===this._$AM&&(this._$Cv=e,this._$AP?.(e))}}class ee{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(e,t,i,o,s){this.type=1,this._$AH=Q,this._$AN=void 0,this.element=e,this.name=t,this._$AM=o,this.options=s,i.length>2||""!==i[0]||""!==i[1]?(this._$AH=Array(i.length-1).fill(new String),this.strings=i):this._$AH=Q}_$AI(e,t=this,i,o){const s=this.strings;let n=!1;if(void 0===s)e=Y(this,e,t,0),n=!P(e)||e!==this._$AH&&e!==W,n&&(this._$AH=e);else{const o=e;let r,a;for(e=s[0],r=0;r<s.length-1;r++)a=Y(this,o[i+r],t,r),a===W&&(a=this._$AH[r]),n||=!P(a)||a!==this._$AH[r],a===Q?e=Q:e!==Q&&(e+=(a??"")+s[r+1]),this._$AH[r]=a}n&&!o&&this.j(e)}j(e){e===Q?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,e??"")}}class te extends ee{constructor(){super(...arguments),this.type=3}j(e){this.element[this.name]=e===Q?void 0:e}}class ie extends ee{constructor(){super(...arguments),this.type=4}j(e){this.element.toggleAttribute(this.name,!!e&&e!==Q)}}class oe extends ee{constructor(e,t,i,o,s){super(e,t,i,o,s),this.type=5}_$AI(e,t=this){if((e=Y(this,e,t,0)??Q)===W)return;const i=this._$AH,o=e===Q&&i!==Q||e.capture!==i.capture||e.once!==i.once||e.passive!==i.passive,s=e!==Q&&(i===Q||o);o&&this.element.removeEventListener(this.name,this,i),s&&this.element.addEventListener(this.name,this,e),this._$AH=e}handleEvent(e){"function"==typeof this._$AH?this._$AH.call(this.options?.host??this.element,e):this._$AH.handleEvent(e)}}class se{constructor(e,t,i){this.element=e,this.type=6,this._$AN=void 0,this._$AM=t,this.options=i}get _$AU(){return this._$AM._$AU}_$AI(e){Y(this,e)}}const ne=z.litHtmlPolyfillSupport;ne?.(G,X),(z.litHtmlVersions??=[]).push("3.3.3");const re=globalThis;class ae extends w{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){const e=super.createRenderRoot();return this.renderOptions.renderBefore??=e.firstChild,e}update(e){const t=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(e),this._$Do=((e,t,i)=>{const o=i?.renderBefore??t;let s=o._$litPart$;if(void 0===s){const e=i?.renderBefore??null;o._$litPart$=s=new X(t.insertBefore(T(),e),e,void 0,i??{})}return s._$AI(e),s})(t,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return W}}ae._$litElement$=!0,ae.finalized=!0,re.litElementHydrateSupport?.({LitElement:ae});const le=re.litElementPolyfillSupport;le?.({LitElement:ae}),(re.litElementVersions??=[]).push("4.2.2");const ce={attribute:!0,type:String,converter:y,reflect:!1,hasChanged:$},de=(e=ce,t,i)=>{const{kind:o,metadata:s}=i;let n=globalThis.litPropertyMetadata.get(s);if(void 0===n&&globalThis.litPropertyMetadata.set(s,n=new Map),"setter"===o&&((e=Object.create(e)).wrapped=!0),n.set(i.name,e),"accessor"===o){const{name:o}=i;return{set(i){const s=t.get.call(this);t.set.call(this,i),this.requestUpdate(o,s,e,!0,i)},init(t){return void 0!==t&&this.C(o,void 0,e,t),t}}}if("setter"===o){const{name:o}=i;return function(i){const s=this[o];t.call(this,i),this.requestUpdate(o,s,e,!0,i)}}throw Error("Unsupported decorator location: "+o)};function ue(e){return(t,i)=>"object"==typeof i?de(e,t,i):((e,t,i)=>{const o=t.hasOwnProperty(i);return t.constructor.createProperty(i,e),o?Object.getOwnPropertyDescriptor(t,i):void 0})(e,t,i)}function he(e){return ue({...e,state:!0,attribute:!1})}const pe="quartermaster",me=new WeakMap,_e=[2e3,5e3,15e3,3e4];function ge(e,t){t.unsubscribe=e.subscribeMessage(e=>{t.snapshot=e,t.error=void 0,t.attempts=0,t.listeners.forEach(t=>t(e))},{type:`${pe}/subscribe`}).catch(i=>{if(t.error=i,t.listeners.forEach(e=>e(void 0,i)),me.get(e)===t&&t.listeners.size){const i=_e[Math.min(t.attempts,_e.length-1)];t.attempts+=1,t.retry=setTimeout(()=>{t.retry=void 0,ge(e,t)},i)}})}function ve(e,t){let i=me.get(e);i?i.listeners.add(t):(i={listeners:new Set,attempts:0},me.set(e,i),i.listeners.add(t),ge(e,i));const o=i;return(o.snapshot||o.error)&&t(o.snapshot,o.error),()=>{o.listeners.delete(t)&&!o.listeners.size&&(me.get(e)===o&&me.delete(e),void 0!==o.retry&&(clearTimeout(o.retry),o.retry=void 0),o.unsubscribe?.then(e=>e?.()).catch(()=>{}))}}var fe={strategy_name:"Quartermaster",strategy_description:"Inventory by zone, essentials, shopping list and proposals to confirm.",title:"Quartermaster",missing_integration:"The Quartermaster integration is not installed. Install it from the Marketplace, then reload this dashboard.",not_loaded:"The Quartermaster integration is installed but not set up or not running. Add it under Settings → Devices & services, then reload this dashboard.",too_old:"The installed Quartermaster integration is too old for this dashboard. Update it from the Marketplace, then reload this dashboard.",incompatible:"This dashboard does not support the Quartermaster API version {version}. Update the dashboard and the integration together.",view_overview:"Overview",view_shopping:"Shopping list",view_essentials:"Essentials",view_zones:"Zones",view_proposals:"Proposals",view_inventory:"Inventory",view_expiry:"Expiry",view_history:"History",overview_heading:"At a glance",go_shopping:"Go shopping",tile_to_buy:"To buy",tile_suggestions:"Suggested",tile_expiring:"Expiring",tile_pending_proposals:"To confirm",shopping_mode_until:"Shopping mode until {time}",no_zones:"No zones yet. Add one with Zone management in the Zones view, or with the quartermaster.add_zone action.",card_suggestions:"Suggestions",card_suggestions_description:"Products worth buying, with the reason, and one-tap add to the shopping list.",card_essentials:"Essentials",card_essentials_description:"Products you always want at home: present, minimum, target and status.",card_proposals:"Proposals",card_proposals_description:"Changes recognized from photos and receipts, to confirm, correct or reject.",card_inventory:"Inventory",card_inventory_description:"Products by zone with quick plus and minus.",card_history:"History",card_history_description:"Latest stock movements, with undo.",card_zone:"Zone",card_zone_description:"Last check, last image, show mode and products of one zone, with Check now.",card_photo:"Photo upload",card_photo_description:"Take or pick a photo of a zone or of a receipt and let Quartermaster count the products.",editor_title:"Title",editor_zone:"Zone ID",editor_zone_helper:"The zone_id from the integration, for example fridge.",editor_limit:"Number of movements",zone_required:"Set the zone of this card (zone).",loading:"Loading…",read_only:"You can view this, but only users allowed to write can change it.",error_generic:"Something went wrong: {message}",save:"Save",cancel:"Cancel",add:"Add",edit:"Edit",remove:"Remove",decrease:"{product}: remove 1",increase:"{product}: add 1",suggestions_empty:"Nothing to suggest right now.",suggestion_added:"{product} added to the shopping list.",reason_below_target:"you have {have}, you usually keep {target}",reason_stale_zone_one:"{zone} has not been updated for {days} day",reason_stale_zone_other:"{zone} has not been updated for {days} days",reason_finished_recently:"you finished it on {date}",reason_unknown:"suggested",essentials_empty:"No essentials yet.",col_product:"Product",col_present:"Present",col_min:"Min",col_target:"Target",col_status:"Status",min_stock:"Minimum",target_stock:"Target",status_to_buy:"To buy",status_low:"Low",status_ok:"OK",add_essential:"Add an essential",choose_product:"Choose a product",min_required:"Set a minimum stock.",target_below_min:"The target cannot be below the minimum.",remove_essential:"Remove from essentials",proposals_empty:"No proposals to confirm.",proposal_from:"{zone}, {time}",proposal_camera:"Camera, {zone}, {time}",movement_taken:"taken: {amount} · {left} would be left",movement_returned:"put back: {amount} (undoes the take)",taken_quantity:"Quantity taken",confirm:"Confirm",unknown_sighting:"Something",unclear_sighting:"Seen by a camera, not clear enough to record. Reject it, or send a photo of the shelf.",proposal_unknown_zone:"Unknown zone",unknown_product:"Not recognized: {seen}",seen_as:"seen as {seen}",confidence:"{percent} sure",correct:"Correct",confirm_selected:"Confirm selected",confirm_seen:"Confirm what was seen",confirm_all:"Confirm all",reject:"Reject",not_seen_item:"Not seen: set to zero only if ticked",not_seen:"Not seen: {products}",needs_product:"Correct it with a product, or as a new product, to apply it; otherwise it waits.",quantity:"Quantity",product:"Product",inventory_empty:"No products in this zone.",new_product:"New product",name:"Name",name_required:"Enter a name.",unit:"Unit",default_zone:"Zone",essential:"Essential",initial_quantity:"Quantity now",set_quantity:"Set quantity",best_before:"best before {date}",product_added:"{product} added.",edit_product:"Edit product",category:"Category",shelf_life:"Shelf life (days)",best_before_label:"Best before",product_saved:"{product} saved.",move_to:"Move to",move:"Move",moved:"{product} moved.",archive:"Archive",archive_confirm:"Archive {product}? Its stock goes to zero and it leaves the lists; you can undo it from History.",confirm_archive:"Yes, archive",archived_done:"{product} archived.",archived_products:"Archived",bring_back:"Bring back",brought_back:"{product} is back.",no_zone:"No zone",history_empty:"No movements yet.",undo:"Undo",undone:"Undone",kind_purchase:"Purchase",kind_consume:"Consumed",kind_inventory:"Count",kind_correction:"Correction",kind_undo:"Undo",kind_import:"Import",kind_move:"Moved",kind_archive:"Archived",channel_alexa:"Alexa",channel_assist:"Assist",channel_telegram:"Telegram",channel_dashboard:"Dashboard",channel_camera:"Camera",channel_service:"Automation",channel_scheduler:"Scheduled",zone_updated:"Updated {time}",zone_never_updated:"Never updated",source_camera:"Camera",source_manual:"Manual",source_ledger:"List check (no photos)",source_camera_show:"Show to camera",photo_zone:"Zone",photo_choose:"Take or choose a photo",photo_preparing:"Preparing the photo…",photo_analyzing:"Analyzing the photo…",photo_android_note:"In the Home Assistant Android app this opens the gallery only: take the photo with the camera app first, or send it to the Telegram bot.",photo_proposal_one:"{count} change to confirm in Proposals.",photo_proposal_other:"{count} changes to confirm in Proposals.",photo_applied_one:"{count} change recorded.",photo_applied_other:"{count} changes recorded.",photo_no_changes:"No changes found.",photo_unusable:"The photo cannot be used: {issues}",photo_not_seen:"Expected but not seen: {products}",photo_unknown:"Not recognized: {products}",photo_too_large:"The photo is still over 2 MB after resizing. Try a smaller or simpler photo.",photo_unreadable:"This file cannot be read as an image.",error_unauthorized:"You are not allowed to change the inventory.",error_not_loaded:"The Quartermaster integration is not running.",error_too_large:"The photo is over 2 MB.",error_invalid_image:"The photo could not be sent.",error_zone_not_found:"No zone called {zone}.",error_product_not_found:"No product called {product}.",error_product_exists:"A product called {product} already exists.",error_daily_limit:"The daily limit of {limit} image analyses is reached.",error_ai_task_missing:"Choose an AI Task entity for images in the Quartermaster options.",error_image_rejected:"The image cannot be analyzed: {issue}.",error_analysis_failed:"The image analysis failed: {error}",error_nothing_to_undo:"There is no movement to undo.",error_proposal_not_found:"This proposal is no longer pending.",error_target_below_min:"The target stock of {product} is below its minimum stock.",error_min_stock_required:"An essential product needs a minimum stock: {product}.",error_not_in_stock:"{product} is not in stock in any zone.",error_invalid_quantity:"The quantity {quantity} is not valid.",tile_photo_requests:"Photo requests",tile_analyses:"AI analyses today",tile_analyses_limit:"AI analyses today (limit {limit})",reason_running_out_one:"at your usual pace{pace} it runs out within {days} day",reason_running_out_other:"at your usual pace{pace} it runs out within {days} days",reason_running_out_today:"at your usual pace{pace} it runs out today",running_out_pace:" ({per_day} a day)",zone_last_check:"Last check {time}: {status}",zone_never_checked:"Never checked",check_status_updated:"updated",check_status_photo_requested:"photo requested",check_status_list_sent:"list sent to go through",check_status_failed:"failed",zone_in_error:"The last check of this zone failed.",zone_photo_requested:"A photo of this zone was requested {time}.",zone_image_alt:"Last image analyzed for {zone}",show_armed_until:"Show mode on until {time}",show_off:"Show mode off",last_show:"Last shown: {product}, {time}",check_now:"Check now",check_started:"Check of {zone} started.",arm_show:"Arm show mode",show_armed:"Show mode on for {zone}: show a product to the camera.",source_passage:"Passage camera",proposal_purchase:"Purchase, {time}",bought:"bought: {amount}",proposal_image_alt:"Image sent for this proposal",photo_kind:"Photo of",photo_kind_zone:"A zone",photo_kind_receipt:"A receipt",receipt_proposal_one:"{count} purchase to confirm in Proposals.",receipt_proposal_other:"{count} purchases to confirm in Proposals.",receipt_no_items:"No purchases found on the receipt.",card_zones:"Zone management",card_zones_description:"Add, edit and remove zones and their sources (cameras, show to camera, passage).",zones_empty:"No zones yet.",new_zone:"New zone",aliases:"Other names (comma separated)",zone_added:"Zone {zone} added. Reload the dashboard to see its section.",zone_saved:"Zone {zone} saved.",zone_removed:"Zone {zone} removed. Reload the dashboard to update the views.",delete:"Delete",delete_zone_confirm:"Delete the zone {zone}? This cannot be undone.",check_schedule:"Check schedule (cron)",reminder_days:"Reminder after days without updates",confidence_threshold:"Confidence threshold (0–1)",sources:"Sources, in order",no_sources:"No sources.",source_type:"Source type",add_source:"Add source",move_up:"{source}: move up",move_down:"{source}: move down",remove_source:"{source}: remove",privacy_notice:"Frames from this camera can show people. Only the area set in Area goes to the AI provider, and frames are deleted right after the analysis.",privacy_ack:"I have read this and want to enable it",default_option:"Default",field_entity_id:"Camera",field_roi:"Area (x1, y1, x2, y2 from 0 to 1)",field_max_checks_per_day:"Checks per day at most",field_trigger_entity:"Trigger entity",field_trigger_state:"Trigger state",field_trigger_delay_seconds:"Delay after the trigger (seconds)",field_min_interval_minutes:"Minimum interval (minutes)",field_capture:"Capture",field_window_seconds:"Window (seconds)",field_burst_interval_seconds:"Burst interval (seconds)",field_max_frames_to_model:"Frames sent to the AI at most",field_cooldown_seconds:"Pause between analyses (seconds)",field_max_per_day:"Analyses per day at most",field_min_confidence:"Minimum confidence (0–1)",field_hours:"Active hours (HH:MM-HH:MM)",field_announce:"Announce to (notify entities, comma separated)",field_active:"Active",field_check_days:"Days between list checks (0 = only on request)",field_arm_minutes:"Show mode duration (minutes)",field_match_window_seconds:"Match window (seconds)",option_auto:"Automatic",option_burst:"Burst of snapshots",option_clip:"Video clip",option_always:"Always",option_when_armed:"Only when armed",option_off:"Off (door closed)",option_on:"On",source_required:"{source}: fill in {field}.",source_invalid_number:"{source}: {field} must be a number.",source_invalid_roi:"{source}: the area must be four numbers from 0 to 1 (x1, y1, x2, y2) with x1 < x2 and y1 < y2.",zone_invalid_number:"{field} must be a number.",error_invalid_source:"Source {index} is not valid: {error}"};const ye={en:fe,it:{strategy_name:"Quartermaster",strategy_description:"Inventario per zona, essenziali, lista della spesa e proposte da confermare.",title:"Quartermaster",missing_integration:"L'integrazione Quartermaster non è installata. Installala dal Marketplace, poi ricarica questa dashboard.",not_loaded:"L'integrazione Quartermaster è installata ma non è configurata o non è in funzione. Aggiungila da Impostazioni → Dispositivi e servizi, poi ricarica questa dashboard.",too_old:"L'integrazione Quartermaster installata è troppo vecchia per questa dashboard. Aggiornala dal Marketplace, poi ricarica questa dashboard.",incompatible:"Questa dashboard non supporta la versione {version} dell'API di Quartermaster. Aggiorna insieme la dashboard e l'integrazione.",view_overview:"Panoramica",view_shopping:"Lista della spesa",view_essentials:"Essenziali",view_zones:"Zone",view_proposals:"Proposte",view_inventory:"Inventario",view_expiry:"Scadenze",view_history:"Storico",overview_heading:"In sintesi",go_shopping:"Vado a fare la spesa",tile_to_buy:"Da comprare",tile_suggestions:"Suggeriti",tile_expiring:"In scadenza",tile_pending_proposals:"Da confermare",shopping_mode_until:"Modalità spesa fino alle {time}",no_zones:"Nessuna zona per ora. Aggiungine una con Gestione zone nella vista Zone, o con l'azione quartermaster.add_zone.",card_suggestions:"Suggeriti",card_suggestions_description:"Prodotti da comprare con il motivo, da aggiungere alla lista con un tocco.",card_essentials:"Essenziali",card_essentials_description:"Prodotti che devono esserci sempre: presente, minima, obiettivo e stato.",card_proposals:"Proposte",card_proposals_description:"Variazioni riconosciute da foto e scontrini, da confermare, correggere o rifiutare.",card_inventory:"Inventario",card_inventory_description:"Prodotti per zona con più e meno rapidi.",card_history:"Storico",card_history_description:"Ultimi movimenti, con annullamento.",card_zone:"Zona",card_zone_description:"Ultimo controllo, ultima immagine, modalità mostra prodotto e prodotti di una zona, con Controlla ora.",card_photo:"Caricamento foto",card_photo_description:"Scatta o scegli una foto di una zona o di uno scontrino e lascia che Quartermaster conti i prodotti.",editor_title:"Titolo",editor_zone:"ID della zona",editor_zone_helper:"Lo zone_id dell'integrazione, per esempio frigo.",editor_limit:"Numero di movimenti",zone_required:"Imposta la zona di questa card (zone).",loading:"Caricamento…",read_only:"Puoi vedere questi dati, ma solo gli utenti autorizzati alla scrittura possono modificarli.",error_generic:"Qualcosa è andato storto: {message}",save:"Salva",cancel:"Annulla",add:"Aggiungi",edit:"Modifica",remove:"Rimuovi",decrease:"{product}: togli 1",increase:"{product}: aggiungi 1",suggestions_empty:"Nessun suggerimento al momento.",suggestion_added:"{product} aggiunto alla lista della spesa.",reason_below_target:"ne hai {have}, di solito ne tieni {target}",reason_stale_zone_one:"la zona {zone} non è aggiornata da {days} giorno",reason_stale_zone_other:"la zona {zone} non è aggiornata da {days} giorni",reason_finished_recently:"l'hai finito il {date}",reason_unknown:"suggerito",essentials_empty:"Nessun essenziale per ora.",col_product:"Prodotto",col_present:"Presenti",col_min:"Minima",col_target:"Obiettivo",col_status:"Stato",min_stock:"Scorta minima",target_stock:"Obiettivo",status_to_buy:"Da comprare",status_low:"In calo",status_ok:"A posto",add_essential:"Aggiungi un essenziale",choose_product:"Scegli un prodotto",min_required:"Imposta una scorta minima.",target_below_min:"L'obiettivo non può essere sotto la scorta minima.",remove_essential:"Togli dagli essenziali",proposals_empty:"Nessuna proposta da confermare.",proposal_from:"{zone}, {time}",proposal_camera:"Telecamera, {zone}, {time}",movement_taken:"preso: {amount} · ne resterebbero {left}",movement_returned:"rimesso: {amount} (annulla il prelievo)",taken_quantity:"Quantità presa",confirm:"Conferma",unknown_sighting:"Qualcosa",unclear_sighting:"Visto da una telecamera, non abbastanza chiaro da registrare. Rifiutalo, o manda una foto dello scaffale.",proposal_unknown_zone:"Zona sconosciuta",unknown_product:"Non riconosciuto: {seen}",seen_as:"visto come {seen}",confidence:"sicuro al {percent}",correct:"Correggi",confirm_selected:"Conferma selezionati",confirm_seen:"Conferma i visti",confirm_all:"Conferma tutto",reject:"Rifiuta",not_seen_item:"Non visto: azzerato solo se spuntato",not_seen:"Non visti: {products}",needs_product:"Correggila con un prodotto, o come nuovo prodotto, per applicarla; altrimenti resta in attesa.",quantity:"Quantità",product:"Prodotto",inventory_empty:"Nessun prodotto in questa zona.",new_product:"Nuovo prodotto",name:"Nome",name_required:"Inserisci un nome.",unit:"Unità",default_zone:"Zona",essential:"Essenziale",initial_quantity:"Quantità attuale",set_quantity:"Imposta quantità",best_before:"scade il {date}",product_added:"{product} aggiunto.",edit_product:"Modifica prodotto",category:"Categoria",shelf_life:"Durata (giorni)",best_before_label:"Da consumarsi entro",product_saved:"{product} salvato.",move_to:"Sposta in",move:"Sposta",moved:"{product} spostato.",archive:"Archivia",archive_confirm:"Archiviare {product}? Le scorte vanno a zero ed esce dalle liste; puoi annullare dalla Cronologia.",confirm_archive:"Sì, archivia",archived_done:"{product} archiviato.",archived_products:"Archiviati",bring_back:"Ripristina",brought_back:"{product} è tornato.",no_zone:"Senza zona",history_empty:"Nessun movimento per ora.",undo:"Annulla",undone:"Annullato",kind_purchase:"Acquisto",kind_consume:"Consumo",kind_inventory:"Conteggio",kind_correction:"Correzione",kind_undo:"Annullamento",kind_import:"Importazione",kind_move:"Spostamento",kind_archive:"Archiviazione",channel_alexa:"Alexa",channel_assist:"Assist",channel_telegram:"Telegram",channel_dashboard:"Dashboard",channel_camera:"Telecamera",channel_service:"Automazione",channel_scheduler:"Programmato",zone_updated:"Aggiornata {time}",zone_never_updated:"Mai aggiornata",source_camera:"Telecamera",source_manual:"Manuale",source_ledger:"Controllo a elenco (senza foto)",source_camera_show:"Mostra alla telecamera",photo_zone:"Zona",photo_choose:"Scatta o scegli una foto",photo_preparing:"Preparo la foto…",photo_analyzing:"Analizzo la foto…",photo_android_note:"Nell'app Android di Home Assistant si apre solo la galleria: scatta prima la foto con l'app fotocamera, oppure inviala al bot Telegram.",photo_proposal_one:"{count} variazione da confermare in Proposte.",photo_proposal_other:"{count} variazioni da confermare in Proposte.",photo_applied_one:"{count} variazione registrata.",photo_applied_other:"{count} variazioni registrate.",photo_no_changes:"Nessuna variazione trovata.",photo_unusable:"La foto non è utilizzabile: {issues}",photo_not_seen:"Attesi ma non visti: {products}",photo_unknown:"Non riconosciuti: {products}",photo_too_large:"La foto supera ancora i 2 MB dopo il ridimensionamento. Prova una foto più piccola o più semplice.",photo_unreadable:"Questo file non si può leggere come immagine.",error_unauthorized:"Non hai il permesso di modificare l'inventario.",error_not_loaded:"L'integrazione Quartermaster non è in funzione.",error_too_large:"La foto supera i 2 MB.",error_invalid_image:"Non è stato possibile inviare la foto.",error_zone_not_found:"Nessuna zona chiamata {zone}.",error_product_not_found:"Nessun prodotto chiamato {product}.",error_product_exists:"Esiste già un prodotto chiamato {product}.",error_daily_limit:"Hai raggiunto il limite giornaliero di {limit} analisi di immagini.",error_ai_task_missing:"Scegli un'entità AI Task per le immagini nelle opzioni di Quartermaster.",error_image_rejected:"L'immagine non si può analizzare: {issue}.",error_analysis_failed:"L'analisi dell'immagine non è riuscita: {error}",error_nothing_to_undo:"Non c'è nessun movimento da annullare.",error_proposal_not_found:"Questa proposta non è più in attesa.",error_target_below_min:"L'obiettivo di {product} è sotto la scorta minima.",error_min_stock_required:"Un prodotto essenziale ha bisogno di una scorta minima: {product}.",error_not_in_stock:"{product} non è presente in nessuna zona.",error_invalid_quantity:"La quantità {quantity} non è valida.",tile_photo_requests:"Foto richieste",tile_analyses:"Analisi AI di oggi",tile_analyses_limit:"Analisi AI di oggi (limite {limit})",reason_running_out_one:"al ritmo solito{pace} finisce entro {days} giorno",reason_running_out_other:"al ritmo solito{pace} finisce entro {days} giorni",reason_running_out_today:"al ritmo solito{pace} finisce oggi",running_out_pace:" ({per_day} al giorno)",zone_last_check:"Ultimo controllo {time}: {status}",zone_never_checked:"Mai controllata",check_status_updated:"aggiornata",check_status_photo_requested:"foto richiesta",check_status_list_sent:"elenco inviato per il controllo",check_status_failed:"non riuscito",zone_in_error:"L'ultimo controllo di questa zona non è riuscito.",zone_photo_requested:"È stata chiesta una foto di questa zona {time}.",zone_image_alt:"Ultima immagine analizzata di {zone}",show_armed_until:"Modalità mostra prodotto attiva fino alle {time}",show_off:"Modalità mostra prodotto spenta",last_show:"Ultimo prodotto mostrato: {product}, {time}",check_now:"Controlla ora",check_started:"Controllo di {zone} avviato.",arm_show:"Accendi mostra prodotto",show_armed:"Modalità mostra prodotto attiva per {zone}: mostra un prodotto alla telecamera.",source_passage:"Telecamera di passaggio",proposal_purchase:"Acquisto, {time}",bought:"acquistato: {amount}",proposal_image_alt:"Immagine inviata per questa proposta",photo_kind:"Foto di",photo_kind_zone:"Una zona",photo_kind_receipt:"Uno scontrino",receipt_proposal_one:"{count} acquisto da confermare in Proposte.",receipt_proposal_other:"{count} acquisti da confermare in Proposte.",receipt_no_items:"Nessun acquisto trovato nello scontrino.",card_zones:"Gestione zone",card_zones_description:"Aggiungi, modifica e togli zone e fonti (telecamere, mostra alla telecamera, passaggio).",zones_empty:"Nessuna zona per ora.",new_zone:"Nuova zona",aliases:"Altri nomi (separati da virgole)",zone_added:"Zona {zone} aggiunta. Ricarica la dashboard per vederne la sezione.",zone_saved:"Zona {zone} salvata.",zone_removed:"Zona {zone} eliminata. Ricarica la dashboard per aggiornare le viste.",delete:"Elimina",delete_zone_confirm:"Eliminare la zona {zone}? Non si può annullare.",check_schedule:"Orari dei controlli (cron)",reminder_days:"Promemoria dopo giorni senza aggiornamenti",confidence_threshold:"Soglia di affidabilità (0–1)",sources:"Fonti, in ordine",no_sources:"Nessuna fonte.",source_type:"Tipo di fonte",add_source:"Aggiungi fonte",move_up:"{source}: sposta su",move_down:"{source}: sposta giù",remove_source:"{source}: togli",privacy_notice:"Le immagini di questa telecamera possono mostrare persone. Al fornitore di AI va solo la parte indicata in Area, e le immagini vengono cancellate subito dopo l'analisi.",privacy_ack:"Ho letto e voglio attivarla",default_option:"Predefinito",field_entity_id:"Telecamera",field_roi:"Area (x1, y1, x2, y2 da 0 a 1)",field_max_checks_per_day:"Controlli al giorno al massimo",field_trigger_entity:"Entità di attivazione",field_trigger_state:"Stato di attivazione",field_trigger_delay_seconds:"Attesa dopo l'attivazione (secondi)",field_min_interval_minutes:"Intervallo minimo (minuti)",field_capture:"Acquisizione",field_window_seconds:"Finestra (secondi)",field_burst_interval_seconds:"Intervallo tra gli scatti (secondi)",field_max_frames_to_model:"Immagini inviate all'AI al massimo",field_cooldown_seconds:"Pausa tra le analisi (secondi)",field_max_per_day:"Analisi al giorno al massimo",field_min_confidence:"Affidabilità minima (0–1)",field_hours:"Orario attivo (HH:MM-HH:MM)",field_announce:"Annuncia a (entità notify, separate da virgole)",field_active:"Attiva",field_check_days:"Giorni tra i controlli a elenco (0 = solo su richiesta)",field_arm_minutes:"Durata della modalità mostra prodotto (minuti)",field_match_window_seconds:"Finestra di abbinamento (secondi)",option_auto:"Automatica",option_burst:"Raffica di istantanee",option_clip:"Clip video",option_always:"Sempre",option_when_armed:"Solo quando accesa",option_off:"Spento (porta chiusa)",option_on:"Acceso",source_required:"{source}: compila {field}.",source_invalid_number:"{source}: {field} deve essere un numero.",source_invalid_roi:"{source}: l'area deve essere di quattro numeri da 0 a 1 (x1, y1, x2, y2) con x1 < x2 e y1 < y2.",zone_invalid_number:"{field} deve essere un numero.",error_invalid_source:"La fonte {index} non è valida: {error}"}};function $e(e){return(e??"en").toLowerCase().split("-")[0]}function be(e){return ye[$e(e)]??fe}function we(e,t={}){return e.replace(/\{(\w+)\}/g,(e,i)=>i in t?String(t[i]):e)}class ze{constructor(e){this.strings=be(e),this.locale=e&&$e(e)in ye?e:"en"}t(e,t){return we(this.strings[e],t)}plural(e,t,i={}){const o=`${e}_one`,s="one"===new Intl.PluralRules(this.locale).select(t)&&o in this.strings?o:`${e}_other`;return we(this.strings[s],{count:this.number(t),...i})}number(e){return new Intl.NumberFormat(this.locale,{maximumFractionDigits:2}).format(e)}percent(e){return new Intl.NumberFormat(this.locale,{style:"percent",maximumFractionDigits:0}).format(e)}date(e){const[t,i,o]=e.slice(0,10).split("-").map(Number);if(!t||!i||!o)return e;const s=new Date(Date.UTC(t,i-1,o)),n=(new Date).getFullYear()===t;return new Intl.DateTimeFormat(this.locale,{day:"numeric",month:"long",...n?{}:{year:"numeric"},timeZone:"UTC"}).format(s)}time(e){const t=new Date(e);return Number.isNaN(t.getTime())?e:new Intl.DateTimeFormat(this.locale,{hour:"2-digit",minute:"2-digit"}).format(t)}dateTime(e){const t=new Date(e);return Number.isNaN(t.getTime())?e:new Intl.DateTimeFormat(this.locale,{day:"numeric",month:"short",hour:"2-digit",minute:"2-digit"}).format(t)}relative(e,t=new Date){const i=new Date(e);if(Number.isNaN(i.getTime()))return e;const o=(i.getTime()-t.getTime())/1e3,s=[["day",86400],["hour",3600],["minute",60]],n=new Intl.RelativeTimeFormat(this.locale,{numeric:"auto"});for(const[e,t]of s)if(Math.abs(o)>=t)return n.format(Math.round(o/t),e);return n.format(0,"minute")}list(e){return new Intl.ListFormat(this.locale,{type:"conjunction"}).format(e)}reason(e){switch(e.reason){case"below_target":return this.t("reason_below_target",{have:this.number(e.have),target:this.number(e.target??0)});case"stale_zone":{const t=e.days??0;return this.plural("reason_stale_zone",t,{zone:e.zone??"",days:this.number(t)})}case"finished_recently":return this.t("reason_finished_recently",{date:e.date?this.date(e.date):""});case"running_out":{const t="number"==typeof e.per_day&&e.per_day>0?this.t("running_out_pace",{per_day:this.number(e.per_day)}):"",i=Math.max(0,Math.ceil(e.days_left??0));return 0===i?this.t("reason_running_out_today",{pace:t}):this.plural("reason_running_out",i,{pace:t,days:this.number(i)})}default:return this.t("reason_unknown")}}error(e){const t=e??{},i=t.translation_placeholders??{};for(const e of[t.translation_key,t.code]){const t=`error_${e}`;if(e&&t in this.strings)return this.t(t,i)}const o=t.message??(e instanceof Error?e.message:"string"==typeof e?e:"");return this.t("error_generic",{message:o||"?"})}}function ke(){return new ze(document.documentElement.lang||navigator.language)}function Ae(e,t,i,o){if(customElements.get(e))return;customElements.define(e,t);const s=ke();window.customCards=window.customCards??[],window.customCards.push({type:e,name:`Quartermaster: ${s.t(i)}`,description:s.t(o),preview:!1,documentationURL:"https://github.com/samuelebistoletti/HomeAssistant-Quartermaster-Dashboard"})}const xe={name:"title",selector:{text:{}}},Se={name:"zone",selector:{text:{}}};function Ce(e,t=!1){const i={title:"editor_title",zone:"editor_zone",limit:"editor_limit"};return{schema:e.map(e=>"zone"===e.name&&t?{...e,required:!0}:e),computeLabel:e=>{const t=i[e.name];return t?ke().t(t):void 0},computeHelper:e=>"zone"===e.name?ke().t("editor_zone_helper"):void 0}}class qe extends ae{constructor(){super(...arguments),this.config={type:""},this.busy=!1,this.images=new Map}setConfig(e){if(!e)throw new Error("Invalid configuration");this.config={...e}}getCardSize(){return 4}getGridOptions(){return{columns:12,min_columns:6,rows:"auto"}}get l(){const e=this.hass?.language;return this.localizer&&this.localizerLanguage===e||(this.localizer=new ze(e),this.localizerLanguage=e),this.localizer}get canWrite(){return!0===this.snapshot?.can_write}connectedCallback(){super.connectedCallback(),this.subscribe()}disconnectedCallback(){super.disconnectedCallback(),this.unsubscribe?.(),this.unsubscribe=void 0,this.connection=void 0}willUpdate(e){e.has("hass")&&this.subscribe()}subscribe(){const e=this.hass?.connection;e&&this.isConnected&&e!==this.connection&&(this.unsubscribe?.(),this.connection=e,this.unsubscribe=ve(e,(e,t)=>{this.snapshot=e,this.loadError=t,this.snapshotChanged()}))}snapshotChanged(){}async action(e,t,i){if(!this.hass)return!1;this.busy=!0,this.notice=void 0;try{return await this.hass.callService(pe,e,t),i&&(this.notice={text:i,error:!1}),!0}catch(e){return this.notice={text:this.l.error(e),error:!0},!1}finally{this.busy=!1}}image(e,t){const i=`${JSON.stringify(e)}@${t}`;return!this.images.has(i)&&this.hass&&(this.images.set(i,null),async function(e,t){try{const i=await e.callWS({type:`${pe}/image`,...t});if(!i?.data)return;return`data:${i.content_type||"image/jpeg"};base64,${i.data}`}catch{return}}(this.hass,e).then(e=>{this.images.set(i,e??null),this.requestUpdate()})),this.images.get(i)??void 0}showError(e){this.notice={text:e,error:!0}}product(e){return this.snapshot?.products.find(t=>t.product_id===e)}zoneName(e){return this.snapshot?.zones.find(t=>t.zone_id===e)?.name??e??""}amount(e,t){if(null===e)return"–";const i=this.l.number(e);return t?`${i} ${t}`:i}cardTitle(){return this.config.title??this.l.t(this.titleKey)}render(){let e;return e=this.loadError?F`<p class="error" role="alert">${this.l.error(this.loadError)}</p>`:this.snapshot?this.renderContent(this.snapshot):F`<p class="muted">${this.l.t("loading")}</p>`,F`
      <ha-card>
        <div class="header">${this.cardTitle()}</div>
        <div class="content">
          ${e}
          ${this.snapshot&&!this.canWrite&&this.hasWriteControls()?F`<p class="muted read-only">${this.l.t("read_only")}</p>`:Q}
          <div class="notice" aria-live="polite">
            ${this.notice?F`<p class=${this.notice.error?"error":"success"} role=${this.notice.error?"alert":"status"}>
                  ${this.notice.text}
                </p>`:Q}
          </div>
        </div>
      </ha-card>
    `}hasWriteControls(){return!0}static{this.styles=r`
    :host {
      display: block;
    }
    ha-card {
      display: block;
      height: 100%;
      overflow: hidden;
    }
    .header {
      font-size: var(--ha-card-header-font-size, 1.25rem);
      font-weight: 500;
      color: var(--ha-card-header-color, var(--primary-text-color));
      padding-block: 16px 8px;
      padding-inline: 16px;
    }
    .content {
      padding-block: 0 16px;
      padding-inline: 16px;
      color: var(--primary-text-color);
    }
    p {
      margin-block: 8px;
    }
    .muted {
      color: var(--secondary-text-color);
    }
    .error {
      color: var(--error-color);
    }
    .success {
      color: var(--success-color, var(--primary-color));
    }
    ul.rows {
      list-style: none;
      margin: 0;
      padding: 0;
    }
    ul.rows > li {
      display: flex;
      align-items: center;
      gap: 8px;
      min-height: 48px;
      padding-block: 6px;
      border-block-end: 1px solid var(--divider-color);
    }
    ul.rows > li:last-child {
      border-block-end: none;
    }
    ul.rows > li.wrap {
      flex-wrap: wrap;
    }
    .full {
      flex-basis: 100%;
    }
    .grow {
      flex: 1 1 0;
      min-width: 0;
    }
    .name {
      overflow-wrap: anywhere;
    }
    .secondary {
      color: var(--secondary-text-color);
      font-size: 0.875rem;
    }
    button {
      font: inherit;
      min-height: 44px;
      min-width: 44px;
      padding-block: 0;
      padding-inline: 16px;
      border-radius: 22px;
      border: 1px solid var(--divider-color);
      background: var(--card-background-color);
      color: var(--primary-color);
      cursor: pointer;
    }
    button.primary {
      background: var(--primary-color);
      color: var(--text-primary-color);
      border-color: var(--primary-color);
    }
    button.icon {
      padding: 0;
      width: 44px;
      font-size: 1.4rem;
      line-height: 1;
    }
    button.danger {
      color: var(--error-color);
    }
    button:disabled {
      opacity: 0.4;
      cursor: default;
    }
    button:focus-visible,
    input:focus-visible,
    select:focus-visible {
      outline: 2px solid var(--primary-color);
      outline-offset: 2px;
    }
    input,
    select {
      font: inherit;
      min-height: 44px;
      box-sizing: border-box;
      padding-inline: 8px;
      border-radius: 8px;
      border: 1px solid var(--divider-color);
      background: var(--card-background-color);
      color: var(--primary-text-color);
    }
    input[type="number"] {
      width: 6em;
    }
    input[type="checkbox"] {
      min-height: 24px;
      width: 24px;
      height: 24px;
      accent-color: var(--primary-color);
    }
    label {
      display: inline-flex;
      flex-direction: column;
      gap: 4px;
      font-size: 0.875rem;
      color: var(--secondary-text-color);
    }
    label.inline {
      flex-direction: row;
      align-items: center;
      gap: 8px;
    }
    .form {
      display: flex;
      flex-wrap: wrap;
      align-items: flex-end;
      gap: 8px;
      padding-block: 8px;
    }
    .actions {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
      padding-block: 8px;
    }
    .badge {
      display: inline-block;
      padding-block: 2px;
      padding-inline: 8px;
      border-radius: 12px;
      font-size: 0.8rem;
      border: 1px solid currentColor;
      white-space: nowrap;
    }
    .badge.to_buy {
      color: var(--error-color);
    }
    .badge.low {
      color: var(--warning-color);
    }
    .badge.ok {
      color: var(--success-color, var(--secondary-text-color));
    }
    img.crop {
      display: block;
      max-width: 100%;
      max-height: 240px;
      object-fit: contain;
      border-radius: 8px;
      margin-block: 8px;
      background: var(--secondary-background-color);
    }
    h3 {
      font-size: 1rem;
      font-weight: 500;
      margin-block: 16px 4px;
    }
  `}}e([ue({attribute:!1})],qe.prototype,"hass",void 0),e([he()],qe.prototype,"config",void 0),e([he()],qe.prototype,"snapshot",void 0),e([he()],qe.prototype,"loadError",void 0),e([he()],qe.prototype,"notice",void 0),e([he()],qe.prototype,"busy",void 0);const Ee={to_buy:"status_to_buy",low:"status_low",ok:"status_ok"};function Ne(e){if(""===e.trim())return;const t=Number(e.replace(",","."));return Number.isFinite(t)&&t>=0?t:Number.NaN}class Te extends qe{constructor(){super(...arguments),this.titleKey="card_essentials",this.adding=!1}static getStubConfig(){return{}}static getConfigForm(){return Ce([xe])}field(e){const t=this.renderRoot.querySelector(`[name="${e}"]`);return t?.value??""}async save(e,t){const i=Ne(this.field(`${t}-min`)),o=Ne(this.field(`${t}-target`));if(void 0===i||Number.isNaN(i)||void 0!==o&&Number.isNaN(o))return void this.showError(this.l.t("min_required"));if(void 0!==o&&o<i)return void this.showError(this.l.t("target_below_min"));const s={product:e,essential:!0,min_stock:i};void 0!==o&&(s.target_stock=o),await this.action("set_essential",s)&&(this.editing=void 0,this.adding=!1)}async add(){const e=this.field("add-product");e?await this.save(e,"add"):this.showError(this.l.t("choose_product"))}renderEditor(e){return F`
      <div class="form">
        <label>
          ${this.l.t("min_stock")}
          <input name="edit-min" type="number" inputmode="decimal" min="0" step="any"
            .value=${null===e.min_stock?"":String(e.min_stock)} />
        </label>
        <label>
          ${this.l.t("target_stock")}
          <input name="edit-target" type="number" inputmode="decimal" min="0" step="any"
            .value=${null===e.target_stock?"":String(e.target_stock)} />
        </label>
        <button class="primary" ?disabled=${this.busy}
          @click=${()=>this.save(String(e.product_id),"edit")}>${this.l.t("save")}</button>
        <button ?disabled=${this.busy} @click=${()=>this.editing=void 0}>
          ${this.l.t("cancel")}
        </button>
        <button class="danger" ?disabled=${this.busy}
          @click=${async()=>{await this.action("set_essential",{product:String(e.product_id),essential:!1})&&(this.editing=void 0)}}>${this.l.t("remove_essential")}</button>
      </div>
    `}renderAdd(e){const t=e.products.filter(e=>!e.essential).sort((e,t)=>e.name.localeCompare(t.name,this.l.locale));return this.adding?F`
      <h3>${this.l.t("add_essential")}</h3>
      <div class="form">
        <label>
          ${this.l.t("product")}
          <select name="add-product">
            <option value="">${this.l.t("choose_product")}</option>
            ${t.map(e=>F`<option value=${String(e.product_id)}>${e.name}</option>`)}
          </select>
        </label>
        <label>
          ${this.l.t("min_stock")}
          <input name="add-min" type="number" inputmode="decimal" min="0" step="any" value="1" />
        </label>
        <label>
          ${this.l.t("target_stock")}
          <input name="add-target" type="number" inputmode="decimal" min="0" step="any" />
        </label>
        <button class="primary" ?disabled=${this.busy} @click=${()=>this.add()}>
          ${this.l.t("add")}
        </button>
        <button @click=${()=>this.adding=!1}>${this.l.t("cancel")}</button>
      </div>
    `:F`<div class="actions">
        <button ?disabled=${!t.length} @click=${()=>this.adding=!0}>
          ${this.l.t("add_essential")}
        </button>
      </div>`}renderContent(e){const t=e.products.filter(e=>e.essential).sort((e,t)=>e.name.localeCompare(t.name,this.l.locale));return F`
      ${t.length?F`<ul class="rows">
            ${t.map(t=>{const i=function(e,t){return t.to_buy.some(t=>t.product_id===e.product_id)||null!==e.min_stock&&e.total<e.min_stock?"to_buy":null!==e.target_stock&&e.total<e.target_stock?"low":"ok"}(t,e),o=[`${this.l.t("col_present")} ${this.amount(t.total,t.unit)}`,`${this.l.t("col_min")} ${null===t.min_stock?"–":this.l.number(t.min_stock)}`,`${this.l.t("col_target")} ${null===t.target_stock?"–":this.l.number(t.target_stock)}`];return F`
                <li class="wrap" data-product=${t.product_id}>
                  <div class="grow">
                    <div class="name">${t.name}</div>
                    <div class="secondary">${o.join(" · ")}</div>
                  </div>
                  <span class="badge ${i}">${this.l.t(Ee[i])}</span>
                  ${this.canWrite&&this.editing!==t.product_id?F`<button class="edit" @click=${()=>this.editing=t.product_id}>
                        ${this.l.t("edit")}
                      </button>`:Q}
                  ${this.canWrite&&this.editing===t.product_id?F`<div class="full">${this.renderEditor(t)}</div>`:Q}
                </li>
              `})}
          </ul>`:F`<p class="muted">${this.l.t("essentials_empty")}</p>`}
      ${this.canWrite?this.renderAdd(e):Q}
    `}}e([he()],Te.prototype,"editing",void 0),e([he()],Te.prototype,"adding",void 0),Ae("quartermaster-essentials-card",Te,"card_essentials","card_essentials_description");class Pe extends qe{constructor(){super(...arguments),this.titleKey="card_history",this.request=0}static getStubConfig(){return{}}static getConfigForm(){return Ce([xe,{name:"limit",selector:{number:{min:1,max:500,mode:"box"}}}])}snapshotChanged(){this.load()}async load(){if(!this.hass||!this.snapshot)return;const e=++this.request,t=Math.min(Math.max(Number(this.config.limit)||50,1),500);try{const i=await this.hass.callWS({type:`${pe}/journal`,limit:t});e===this.request&&(this.entries=i.entries)}catch(t){e===this.request&&this.showError(this.l.error(t))}}label(e,t){const i=`${e}_${t}`;return i in this.l.strings?this.l.t(i):t}renderContent(){if(!this.entries)return F`<p class="muted">${this.l.t("loading")}</p>`;if(!this.entries.length)return F`<p class="muted">${this.l.t("history_empty")}</p>`;const e=new Set;return F`
      <ul class="rows">
        ${this.entries.map(t=>{const i=t.operation_id,o=null!==i&&!e.has(i);null!==i&&e.add(i);const s=o&&!t.undone&&"undo"!==t.kind&&this.canWrite,n=this.product(t.product_id),r=`${t.delta>0?"+":t.delta<0?"−":"±"}${this.l.number(Math.abs(t.delta))}`,a=[this.label("kind",t.kind),`${r} → ${this.amount(t.quantity_after,n?.unit)}`,t.zone??this.zoneName(t.zone_id),this.label("channel",t.channel)].filter(Boolean);return F`
            <li data-entry=${t.id}>
              <div class="grow">
                <div class="name">${t.product??n?.name??"?"}</div>
                <div class="secondary">${this.l.dateTime(t.ts)} · ${a.join(" · ")}</div>
              </div>
              ${t.undone?F`<span class="badge">${this.l.t("undone")}</span>`:Q}
              ${s?F`<button class="undo" ?disabled=${this.busy}
                    @click=${()=>this.action("undo_last",{operation_id:i})}>
                    ${this.l.t("undo")}
                  </button>`:Q}
            </li>
          `})}
      </ul>
    `}}e([he()],Pe.prototype,"entries",void 0),Ae("quartermaster-history-card",Pe,"card_history","card_history_description");class Me extends qe{constructor(){super(...arguments),this.titleKey="card_inventory",this.adding=!1}static getStubConfig(){return{}}static getConfigForm(){return Ce([xe,Se])}value(e){return this.renderRoot.querySelector(`[name="${e}"]`)?.value??""}checked(e){return this.renderRoot.querySelector(`[name="${e}"]`)?.checked??!1}number(e){return Number(this.value(e).replace(",","."))}adjust(e,t,i){return this.action("adjust_stock",{product:String(e.product_id),operation:i,quantity:1,zone:t.zone_id})}close(){this.editing=void 0,this.archiving=void 0}async setQuantity(e,t){const i=this.number("set-quantity");if(!Number.isFinite(i)||i<0)return void this.showError(this.l.t("error_invalid_quantity",{quantity:this.value("set-quantity")}));const o={product:String(e.product.product_id),quantity:i,zone:t.zone_id},s=this.value("set-best-before");s&&s!==(e.level.best_before??"")&&(o.best_before=s),await this.action("set_stock",o)&&this.close()}async saveProduct(e){const t=e=>this.value(e).trim()||null,i=this.value("edit-aliases").split(",").map(e=>e.trim()).filter(Boolean),o=this.value("edit-shelf-life").trim(),s=o?Math.round(this.number("edit-shelf-life")):null;if(null!==s&&!(s>=1))return void this.showError(this.l.t("error_invalid_quantity",{quantity:o}));const n=t("edit-name");if(!n)return void this.showError(this.l.t("name_required"));const r={name:n,category:t("edit-category"),unit:t("edit-unit"),default_zone:t("edit-zone"),shelf_life_days:s},a={name:e.name,category:e.category,unit:e.unit,default_zone:e.default_zone_id,shelf_life_days:e.shelf_life_days??null},l={product:String(e.product_id)};for(const[e,t]of Object.entries(r))t!==a[e]&&(l[e]=t);i.join(",")!==e.aliases.join(",")&&(l.aliases=i),1!==Object.keys(l).length?await this.action("update_product",l,this.l.t("product_saved",{product:n}))&&this.close():this.close()}async move(e,t){const i=this.value("move-zone"),o=this.number("move-quantity");if(!Number.isFinite(o)||o<=0||o>e.level.quantity)return void this.showError(this.l.t("error_invalid_quantity",{quantity:this.value("move-quantity")}));const s={product:String(e.product.product_id),from_zone:t.zone_id,to_zone:i};o<e.level.quantity&&(s.quantity=o),await this.action("move_stock",s,this.l.t("moved",{product:e.product.name}))&&this.close()}async archive(e){await this.action("archive_product",{product:String(e.product_id)},this.l.t("archived_done",{product:e.name}))&&this.close()}bringBack(e,t){return this.action("archive_product",{product:String(e),archived:!1},this.l.t("brought_back",{product:t}))}async addProduct(){const e=this.value("new-name").trim();if(!e)return void this.showError(this.l.t("name_required"));const t=this.value("new-zone"),i=this.value("new-unit").trim(),o=Number(this.value("new-quantity").replace(",",".")||"0"),s=this.checked("new-essential"),n=Number(this.value("new-min").replace(",",".")||"1"),r={name:e,essential:s};t&&(r.default_zone=t),i&&(r.unit=i),s&&(r.min_stock=Number.isFinite(n)?n:1),await this.action("add_product",r,this.l.t("product_added",{product:e}))&&(t&&Number.isFinite(o)&&o>0&&await this.action("set_stock",{product:e,quantity:o,zone:t},this.l.t("product_added",{product:e})),this.adding=!1)}renderQuantityForm(e,t){return F`<div class="form full quantity-form">
      <label>
        ${this.l.t("quantity")}
        <input name="set-quantity" type="number" inputmode="decimal" min="0" step="any"
          .value=${String(e.level.quantity)} />
      </label>
      <label>
        ${this.l.t("best_before_label")}
        <input name="set-best-before" type="date" .value=${e.level.best_before??""} />
      </label>
      <button class="primary" ?disabled=${this.busy}
        @click=${()=>this.setQuantity(e,t)}>${this.l.t("save")}</button>
      <button @click=${()=>this.close()}>${this.l.t("cancel")}</button>
    </div>`}renderProductForm(e,t){return F`<div class="form full product-form">
      <h4>${this.l.t("edit_product")}</h4>
      <label>${this.l.t("name")}
        <input name="edit-name" type="text" autocomplete="off" .value=${e.name} /></label>
      <label>${this.l.t("aliases")}
        <input name="edit-aliases" type="text" autocomplete="off"
          .value=${e.aliases.join(", ")} /></label>
      <label>${this.l.t("category")}
        <input name="edit-category" type="text" autocomplete="off"
          .value=${e.category??""} /></label>
      <label>${this.l.t("unit")}
        <input name="edit-unit" type="text" autocomplete="off" .value=${e.unit??""} /></label>
      <label>
        ${this.l.t("default_zone")}
        <select name="edit-zone">
          <option value="">–</option>
          ${t.zones.map(t=>F`<option value=${t.zone_id}
              ?selected=${t.zone_id===e.default_zone_id}>${t.name}</option>`)}
        </select>
      </label>
      <label>${this.l.t("shelf_life")}
        <input name="edit-shelf-life" type="number" inputmode="numeric" min="1" step="1"
          .value=${e.shelf_life_days?String(e.shelf_life_days):""} /></label>
      <button class="primary save-product" ?disabled=${this.busy}
        @click=${()=>this.saveProduct(e)}>${this.l.t("save")}</button>
    </div>`}renderMoveForm(e,t,i){const o=i.zones.filter(e=>e.zone_id!==t.zone_id);return e.level.quantity<=0||!o.length?Q:F`<div class="form full move-form">
      <label>
        ${this.l.t("move_to")}
        <select name="move-zone">
          ${o.map(e=>F`<option value=${e.zone_id}>${e.name}</option>`)}
        </select>
      </label>
      <label>
        ${this.l.t("quantity")}
        <input name="move-quantity" type="number" inputmode="decimal" min="0" step="any"
          .value=${String(e.level.quantity)} />
      </label>
      <button class="move" ?disabled=${this.busy}
        @click=${()=>this.move(e,t)}>${this.l.t("move")}</button>
    </div>`}renderArchive(e){return this.archiving!==e.product_id?F`<div class="actions full">
        <button class="danger archive" @click=${()=>this.archiving=e.product_id}>
          ${this.l.t("archive")}
        </button>
      </div>`:F`<div class="actions full">
      <p class="secondary">${this.l.t("archive_confirm",{product:e.name})}</p>
      <button class="danger archive-confirm" ?disabled=${this.busy}
        @click=${()=>this.archive(e)}>${this.l.t("confirm_archive")}</button>
      <button @click=${()=>this.archiving=void 0}>${this.l.t("cancel")}</button>
    </div>`}renderRow(e,t,i){const{product:o,level:s}=e,n=`${o.product_id}@${t?.zone_id??""}`,r=[this.amount(s.quantity,o.unit)];s.best_before&&r.push(this.l.t("best_before",{date:this.l.date(s.best_before)}));const a=this.editing===n&&this.canWrite;return F`
      <li class="wrap" data-product=${o.product_id}>
        <div class="grow">
          <div class="name">${o.name}</div>
          <div class="secondary">${r.join(" · ")}</div>
        </div>
        ${this.canWrite?F`
              ${t?F`
                    <button class="icon minus" aria-label=${this.l.t("decrease",{product:o.name})}
                      ?disabled=${this.busy||s.quantity<=0}
                      @click=${()=>this.adjust(o,t,"consume")}>−</button>
                    <button class="icon plus" aria-label=${this.l.t("increase",{product:o.name})}
                      ?disabled=${this.busy} @click=${()=>this.adjust(o,t,"purchase")}>+</button>
                  `:Q}
              <button class="icon edit" aria-label=${`${this.l.t("edit_product")}: ${o.name}`}
                title=${this.l.t("edit_product")}
                @click=${()=>{this.archiving=void 0,this.editing=this.editing===n?void 0:n}}>✎</button>
            `:Q}
        ${a?F`
              ${t?this.renderQuantityForm(e,t):Q}
              ${this.renderProductForm(o,i)}
              ${t?this.renderMoveForm(e,t,i):Q}
              ${this.renderArchive(o)}
            `:Q}
      </li>
    `}rows(e,t){const i=new Set(t.zones.map(e=>e.zone_id));return t.products.flatMap(t=>{const o=t.stock.filter(t=>t.zone_id===e);if(o.length)return o.map(e=>({product:t,level:e}));const s=t.default_zone_id&&i.has(t.default_zone_id)?t.default_zone_id:null;return t.stock.length||s!==e?[]:[{product:t,level:{zone_id:e??"",quantity:0,best_before:null,updated:null}}]}).sort((e,t)=>e.product.name.localeCompare(t.product.name,this.l.locale))}renderZone(e,t,i){const o=this.rows(e.zone_id,t);return F`
      ${i?F`<h3>${e.name}</h3>`:Q}
      ${o.length?F`<ul class="rows">${o.map(i=>this.renderRow(i,e,t))}</ul>`:F`<p class="muted">${this.l.t("inventory_empty")}</p>`}
    `}renderWithoutZone(e){const t=this.rows(null,e);return t.length?F`
      <h3>${this.l.t("no_zone")}</h3>
      <ul class="rows">${t.map(t=>this.renderRow(t,null,e))}</ul>
    `:Q}renderArchived(e){const t=e.archived_products??[];return t.length&&this.canWrite?F`
      <h3>${this.l.t("archived_products")}</h3>
      <ul class="rows archived">
        ${t.map(e=>F`<li data-archived=${e.product_id}>
            <div class="grow name">${e.name}</div>
            <button class="bring-back" ?disabled=${this.busy}
              @click=${()=>this.bringBack(e.product_id,e.name)}>${this.l.t("bring_back")}</button>
          </li>`)}
      </ul>
    `:Q}renderAdd(e){if(!this.adding)return F`<div class="actions">
        <button class="new-product" @click=${()=>this.adding=!0}>${this.l.t("new_product")}</button>
      </div>`;const t=this.config.zone;return F`
      <h3>${this.l.t("new_product")}</h3>
      <div class="form">
        <label>${this.l.t("name")}<input name="new-name" type="text" autocomplete="off" /></label>
        <label>
          ${this.l.t("default_zone")}
          <select name="new-zone">
            <option value="">–</option>
            ${e.zones.map(e=>F`<option value=${e.zone_id} ?selected=${e.zone_id===t}>${e.name}</option>`)}
          </select>
        </label>
        <label>${this.l.t("unit")}<input name="new-unit" type="text" autocomplete="off" /></label>
        <label>
          ${this.l.t("initial_quantity")}
          <input name="new-quantity" type="number" inputmode="decimal" min="0" step="any" value="0" />
        </label>
        <label class="inline"><input name="new-essential" type="checkbox" />${this.l.t("essential")}</label>
        <label>
          ${this.l.t("min_stock")}
          <input name="new-min" type="number" inputmode="decimal" min="0" step="any" value="1" />
        </label>
        <button class="primary" ?disabled=${this.busy} @click=${()=>this.addProduct()}>
          ${this.l.t("add")}
        </button>
        <button @click=${()=>this.adding=!1}>${this.l.t("cancel")}</button>
      </div>
    `}renderContent(e){const t=this.config.zone?e.zones.filter(e=>e.zone_id===this.config.zone):e.zones;return this.config.zone&&!t.length?F`<p class="error">${this.l.t("error_zone_not_found",{zone:this.config.zone})}</p>`:F`
      ${t.map(t=>this.renderZone(t,e,!this.config.zone))}
      ${this.config.zone?Q:this.renderWithoutZone(e)}
      ${this.canWrite?this.renderAdd(e):Q}
      ${this.config.zone?Q:this.renderArchived(e)}
    `}}e([he()],Me.prototype,"editing",void 0),e([he()],Me.prototype,"adding",void 0),e([he()],Me.prototype,"archiving",void 0),Ae("quartermaster-inventory-card",Me,"card_inventory","card_inventory_description");class Ie extends Error{constructor(e){super(`Image is ${e} bytes after encoding`),this.bytes=e,this.name="ImageTooLargeError"}}class Ue extends Error{constructor(e){super("The file cannot be decoded as an image",{cause:e}),this.name="ImageUnreadableError"}}function je(e){let t="";for(let i=0;i<e.length;i+=32768)t+=String.fromCharCode(...e.subarray(i,i+32768));return btoa(t)}async function Oe(e,t={}){const i=t.maxSide??1280,o=t.quality??.8,s=t.maxBytes??2097152;let n;try{n=await createImageBitmap(e,{imageOrientation:"from-image"})}catch(e){throw new Ue(e)}try{const{width:e,height:t}=function(e,t,i=1280){const o=Math.max(e,t);if(o<=i)return{width:e,height:t};const s=i/o;return{width:Math.max(1,Math.round(e*s)),height:Math.max(1,Math.round(t*s))}}(n.width,n.height,i),r=document.createElement("canvas");r.width=e,r.height=t;const a=r.getContext("2d");if(!a)throw new Ue;a.imageSmoothingQuality="high",a.drawImage(n,0,0,e,t);const l=await function(e,t){return new Promise((i,o)=>{e.toBlob(e=>e?i(e):o(new Ue),"image/jpeg",t)})}(r,o);if(l.size>s)throw new Ie(l.size);return{base64:je(new Uint8Array(await l.arrayBuffer())),bytes:l.size,width:e,height:t}}finally{n.close()}}class Re extends qe{constructor(){super(...arguments),this.titleKey="card_photo",this.phase="idle",this.kind="zone",this.android=function(e=navigator.userAgent){return/android/i.test(e)}()}static getStubConfig(){return{}}static getConfigForm(){return Ce([xe,Se])}selectedZone(e){const t=e.zones.map(e=>e.zone_id);for(const e of[this.zone,this.config.zone])if(e&&t.includes(e))return e;return t[0]}async upload(e){const t=e.target,i=t.files?.[0],o="receipt"===this.kind,s=this.snapshot?this.selectedZone(this.snapshot):void 0;if(i&&(s||o)&&this.hass){this.notice=void 0,this.result=void 0,this.receipt=void 0,this.phase="preparing";try{const e=await Oe(i);this.phase="analyzing",o?this.receipt=await this.hass.callWS({type:`${pe}/upload_photo`,kind:"receipt",image:e.base64}):this.result=await this.hass.callWS({type:`${pe}/upload_photo`,zone:s,image:e.base64})}catch(e){e instanceof Ie?this.showError(this.l.t("photo_too_large")):e instanceof Ue?this.showError(this.l.t("photo_unreadable")):this.showError(this.l.error(e))}finally{this.phase="idle",t.value=""}}}itemText(e){return`${e.product??this.l.t("unknown_product",{seen:e.seen_as})}: ${null===e.current?"–":this.l.number(e.current)} → ${this.amount(e.proposed,e.unit)}`}renderReceipt(e){const t=e.items??[],i=e.unknown??[];return F`<div class="result">
      ${null!==e.proposal_id&&t.length?F`<p>${this.l.plural("receipt_proposal",t.length)}</p>
            <ul class="rows">
              ${t.map(e=>F`<li>
                  ${e.product??this.l.t("unknown_product",{seen:e.seen_as})}:
                  ${this.amount(e.proposed,e.unit)}
                </li>`)}
            </ul>`:F`<p>${this.l.t("receipt_no_items")}</p>`}
      ${i.length?F`<p class="secondary">${this.l.t("photo_unknown",{products:this.l.list(i)})}</p>`:Q}
    </div>`}renderResult(e){const t=[];return e.image_usable||t.push(F`<p class="error">
          ${this.l.t("photo_unusable",{issues:this.l.list(e.image_issues??[])})}
        </p>`),e.applied.length&&t.push(F`<p class="success">${this.l.plural("photo_applied",e.applied.length)}</p>`),null!==e.proposal_id&&e.proposed.length&&t.push(F`<p>${this.l.plural("photo_proposal",e.proposed.length)}</p>
          <ul class="rows">
            ${e.proposed.map(e=>F`<li>${this.itemText(e)}</li>`)}
          </ul>`),!e.image_usable||e.applied.length||e.proposed.length||t.push(F`<p>${this.l.t("photo_no_changes")}</p>`),e.not_seen.length&&t.push(F`<p class="secondary">${this.l.t("photo_not_seen",{products:this.l.list(e.not_seen)})}</p>`),e.unknown.length&&t.push(F`<p class="secondary">${this.l.t("photo_unknown",{products:this.l.list(e.unknown)})}</p>`),F`<div class="result">${t}</div>`}renderContent(e){if(!this.canWrite)return Q;const t=this.selectedZone(e),i="idle"!==this.phase,o="receipt"===this.kind,s=F`<label>
      ${this.l.t("photo_kind")}
      <select name="kind" ?disabled=${i}
        @change=${e=>{this.kind=e.target.value,this.result=void 0,this.receipt=void 0}}>
        <option value="zone" ?selected=${!o}>${this.l.t("photo_kind_zone")}</option>
        <option value="receipt" ?selected=${o}>${this.l.t("photo_kind_receipt")}</option>
      </select>
    </label>`;return e.zones.length||o?F`
      <div class="form">
        ${s}
        ${o?Q:F`<label>
              ${this.l.t("photo_zone")}
              <select name="zone" ?disabled=${i}
                @change=${e=>this.zone=e.target.value}>
                ${e.zones.map(e=>F`<option value=${e.zone_id} ?selected=${e.zone_id===t}>${e.name}</option>`)}
              </select>
            </label>`}
        <label class="pick ${i?"disabled":""}">
          <span>${this.l.t("photo_choose")}</span>
          <input type="file" accept="image/*" capture="environment" ?disabled=${i}
            @change=${e=>this.upload(e)} />
        </label>
      </div>
      ${this.android?F`<p class="secondary android-note">${this.l.t("photo_android_note")}</p>`:Q}
      ${i?F`<p class="muted" role="status">
            ${this.l.t("preparing"===this.phase?"photo_preparing":"photo_analyzing")}
          </p>`:Q}
      ${this.result&&!i?this.renderResult(this.result):Q}
      ${this.receipt&&!i?this.renderReceipt(this.receipt):Q}
    `:F`<div class="form">${s}</div>
        <p class="muted">${this.l.t("no_zones")}</p>`}static{this.styles=[qe.styles,r`
      label.pick {
        position: relative;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        min-height: 48px;
        padding-inline: 20px;
        border-radius: 24px;
        background: var(--primary-color);
        color: var(--text-primary-color);
        font-size: 1rem;
        cursor: pointer;
      }
      label.pick:focus-within {
        outline: 2px solid var(--primary-color);
        outline-offset: 2px;
      }
      label.pick.disabled {
        opacity: 0.4;
        cursor: default;
      }
      label.pick input {
        position: absolute;
        inset: 0;
        opacity: 0;
        width: 100%;
        height: 100%;
        cursor: inherit;
      }
    `]}}e([he()],Re.prototype,"zone",void 0),e([he()],Re.prototype,"phase",void 0),e([he()],Re.prototype,"kind",void 0),e([he()],Re.prototype,"result",void 0),e([he()],Re.prototype,"receipt",void 0),Ae("quartermaster-photo-card",Re,"card_photo","card_photo_description");class De extends qe{constructor(){super(...arguments),this.titleKey="card_proposals",this.choices=new Map}static getStubConfig(){return{}}static getConfigForm(){return Ce([xe])}choice(e){let t=this.choices.get(e.proposal_id);return t||(t={excluded:He(e),correcting:new Set,creating:new Set},this.choices.set(e.proposal_id,t)),t}toggle(e,t){e.delete(t)||e.add(t),this.choices=new Map(this.choices)}setCreating(e,t,i){i?e.creating.add(t):e.creating.delete(t),this.choices=new Map(this.choices)}value(e){return this.renderRoot.querySelector(`[name="${e}"]`)?.value??""}async confirm(e,t=!1){const i=this.choice(e),o=e.items.filter(e=>t?!e.missing:!i.excluded.has(e.key)).map(e=>e.key),s=[...i.correcting].filter(e=>o.includes(e)).map(t=>{const o={key:t},s=`p${e.proposal_id}-k${t}`,n=this.value(`${s}-product`),r=Number(this.value(`${s}-quantity`).replace(",","."));if(i.creating.has(t)){o.new_product=!0;const e=this.value(`${s}-name`).trim(),t=this.value(`${s}-zone`);e&&(o.name=e),t&&(o.zone=t)}else n&&(o.product=n);return Number.isFinite(r)&&r>=0&&(o.quantity=r),o}),n={proposal_id:e.proposal_id,decision:"confirm"};(o.length!==e.items.length||e.items.some(e=>e.missing))&&(n.items=o),s.length&&(n.corrections=s),await this.action("confirm_pending",n)&&this.choices.delete(e.proposal_id)}async confirmMovement(e,t){const i={proposal_id:e.proposal_id,decision:"confirm"};if(this.choice(e).correcting.has(t.key)){const o=this.value(`p${e.proposal_id}-k${t.key}-moved`),s=Number(o.replace(",","."));if(!Number.isFinite(s)||s<=0)return void this.showError(this.l.t("error_invalid_quantity",{quantity:o}));i.corrections=[{key:t.key,moved:s}]}await this.action("confirm_pending",i)&&this.choices.delete(e.proposal_id)}async reject(e){await this.action("confirm_pending",{proposal_id:e.proposal_id,decision:"reject"})&&this.choices.delete(e.proposal_id)}renderItem(e,t,i){const o=this.choice(e),s=!o.excluded.has(t.key),n=o.correcting.has(t.key),r=n&&o.creating.has(t.key),a=t.product??this.l.t("unknown_product",{seen:t.seen_as}),l="purchase"===e.kind,c=null===t.current?"–":this.l.number(t.current),d=`p${e.proposal_id}-k${t.key}`,u=[...i.products].sort((e,t)=>e.name.localeCompare(t.name,this.l.locale));return F`
      <li class="wrap" data-key=${t.key}>
        ${this.canWrite?F`<input type="checkbox" .checked=${s} aria-label=${a}
              @change=${()=>this.toggle(o.excluded,t.key)} />`:Q}
        <div class="grow">
          <div class="name">${a}</div>
          <div class="secondary">
            ${l?this.l.t("bought",{amount:this.amount(t.proposed,t.unit)}):`${c} → ${this.amount(t.proposed,t.unit)}`}
            · ${t.missing?this.l.t("not_seen_item"):this.l.t("confidence",{percent:this.l.percent(t.confidence)})}
            ${t.product&&t.seen_as&&t.seen_as!==t.product?F`· ${this.l.t("seen_as",{seen:t.seen_as})}`:Q}
          </div>
          ${null===t.product_id&&s&&!n&&this.canWrite?F`<div class="secondary error">${this.l.t("needs_product")}</div>`:Q}
        </div>
        ${this.canWrite?F`<button class="correct" @click=${()=>this.toggle(o.correcting,t.key)}>
              ${n?this.l.t("cancel"):this.l.t("correct")}
            </button>`:Q}
        ${n?F`<div class="form full">
              <label>
                ${this.l.t("product")}
                <select name=${`${d}-product`}
                  @change=${e=>this.setCreating(o,t.key,"new"===e.target.value)}>
                  <option value="">${t.product??this.l.t("choose_product")}</option>
                  ${"camera"===e.channel?Q:F`<option value=${"new"} ?selected=${r}>
                        ➕ ${this.l.t("new_product")}
                      </option>`}
                  ${u.map(e=>F`<option value=${String(e.product_id)}>${e.name}</option>`)}
                </select>
              </label>
              ${r?F`<label>
                    ${this.l.t("name")}
                    <input name=${`${d}-name`} type="text" autocomplete="off"
                      .value=${t.seen_as} />
                  </label>`:Q}
              ${r&&l?F`<label>
                    ${this.l.t("default_zone")}
                    <select name=${`${d}-zone`}>
                      <option value="">–</option>
                      ${i.zones.map(e=>F`<option value=${e.zone_id}>${e.name}</option>`)}
                    </select>
                  </label>`:Q}
              <label>
                ${this.l.t("quantity")}
                <input name=${`${d}-quantity`} type="number" inputmode="decimal" min="0"
                  step="any" .value=${String(t.proposed)} />
              </label>
            </div>`:Q}
      </li>
    `}renderMovement(e,t){const i=this.choice(e),o=i.correcting.has(t.key)&&"taken"===t.notes,s=t.moved??0,n=t.product??t.seen_as,r="taken"===t.notes?this.l.t("movement_taken",{amount:this.amount(s,t.unit),left:this.amount(Math.max((t.current??0)-s,0),t.unit)}):this.l.t("movement_returned",{amount:this.amount(s,t.unit)});return F`
      <ul class="rows">
        <li class="wrap" data-key=${t.key}>
          <div class="grow">
            <div class="name">${n}</div>
            <div class="secondary">
              ${r} · ${this.l.t("confidence",{percent:this.l.percent(t.confidence)})}
            </div>
          </div>
          ${this.canWrite&&"taken"===t.notes?F`<button class="correct" @click=${()=>this.toggle(i.correcting,t.key)}>
                ${o?this.l.t("cancel"):this.l.t("correct")}
              </button>`:Q}
          ${o?F`<div class="form full">
                <label>
                  ${this.l.t("taken_quantity")}
                  <input name=${`p${e.proposal_id}-k${t.key}-moved`} type="number"
                    inputmode="decimal" min="0" step="any" .value=${String(s)} />
                </label>
              </div>`:Q}
        </li>
      </ul>
      ${this.canWrite?F`<div class="actions">
            <button class="primary confirm-movement" ?disabled=${this.busy}
              @click=${()=>this.confirmMovement(e,t)}>${this.l.t("confirm")}</button>
            <button class="danger reject" ?disabled=${this.busy}
              @click=${()=>this.reject(e)}>${this.l.t("reject")}</button>
          </div>`:Q}
    `}renderUnclear(e){return F`
      <ul class="rows">
        ${e.items.map(e=>F`<li data-key=${e.key}>
            <div class="grow">
              <div class="name">${e.seen_as||this.l.t("unknown_sighting")}</div>
              <div class="secondary">${this.l.t("unclear_sighting")}</div>
            </div>
          </li>`)}
      </ul>
      ${this.canWrite?F`<div class="actions">
            <button class="danger reject" ?disabled=${this.busy}
              @click=${()=>this.reject(e)}>${this.l.t("reject")}</button>
          </div>`:Q}
    `}renderContent(e){return e.proposals.length?F`${e.proposals.map(t=>{const i=this.l.relative(t.created),o=t.zone_id?this.zoneName(t.zone_id):this.l.t("proposal_unknown_zone"),s="camera"===t.channel,n="purchase"===t.kind?this.l.t("proposal_purchase",{time:i}):this.l.t(s?"proposal_camera":"proposal_from",{zone:o,time:i});if("movement"===t.kind&&t.items.length)return F`<section data-proposal=${t.proposal_id}>
          <h3>${n}</h3>
          ${this.renderMovement(t,t.items[0])}
        </section>`;if(s&&t.items.every(e=>null===e.proposed))return F`<section data-proposal=${t.proposal_id}>
          <h3>${n}</h3>
          ${this.renderUnclear(t)}
        </section>`;const r=t.has_image?this.image({proposal_id:t.proposal_id},""):void 0,a=this.choice(t),l=t.items.length-a.excluded.size,c=!function(e,t){return e.size===t.size&&[...e].every(e=>t.has(e))}(a.excluded,He(t)),d=t.items.some(e=>!e.missing);return F`
        <section data-proposal=${t.proposal_id}>
          <h3>${n}</h3>
          ${r?F`<img class="crop" src=${r} alt=${this.l.t("proposal_image_alt")} />`:Q}
          <ul class="rows">
            ${t.items.map(i=>this.renderItem(t,i,e))}
          </ul>
          ${t.not_seen.length?F`<p class="secondary">
                ${this.l.t("not_seen",{products:this.l.list(t.not_seen)})}
              </p>`:Q}
          ${this.canWrite?F`<div class="actions">
                ${d?F`<button class="primary confirm-all" ?disabled=${this.busy}
                      @click=${()=>this.confirm(t,!0)}>
                      ${this.l.t(function(e){return e.items.some(e=>e.missing)}(t)?"confirm_seen":"confirm_all")}
                    </button>`:Q}
                ${c?F`<button class="confirm-selected" ?disabled=${this.busy||!l}
                      @click=${()=>this.confirm(t)}>
                      ${this.l.t("confirm_selected")}
                    </button>`:Q}
                <button class="danger reject" ?disabled=${this.busy}
                  @click=${()=>this.reject(t)}>${this.l.t("reject")}</button>
              </div>`:Q}
        </section>
      `})}`:F`<p class="muted">${this.l.t("proposals_empty")}</p>`}}function He(e){return new Set(e.items.filter(e=>e.missing).map(e=>e.key))}e([he()],De.prototype,"choices",void 0),Ae("quartermaster-proposals-card",De,"card_proposals","card_proposals_description");Ae("quartermaster-suggestions-card",class extends qe{constructor(){super(...arguments),this.titleKey="card_suggestions"}static getStubConfig(){return{}}static getConfigForm(){return Ce([xe])}renderContent(e){return e.suggestions.length?F`
      <ul class="rows">
        ${e.suggestions.map(e=>{const t=this.product(e.product_id),i=t?.name??String(e.product_id);return F`
            <li>
              <div class="grow">
                <div class="name">${i}</div>
                <div class="secondary reason">${this.l.reason(e)}</div>
              </div>
              ${this.canWrite?F`<button
                    class="icon primary"
                    aria-label=${`${this.l.t("add")}: ${i}`}
                    title=${this.l.t("add")}
                    ?disabled=${this.busy}
                    @click=${()=>this.action("add_to_shopping_list",{product:String(e.product_id),from_suggestion:!0},this.l.t("suggestion_added",{product:i}))}
                  >
                    +
                  </button>`:""}
            </li>
          `})}
      </ul>
    `:F`<p class="muted">${this.l.t("suggestions_empty")}</p>`}},"card_suggestions","card_suggestions_description");Ae("quartermaster-zone-card",class extends qe{constructor(){super(...arguments),this.titleKey="card_zone"}static getStubConfig(){return{zone:""}}static getConfigForm(){return Ce([Se],!0)}setConfig(e){if(!e?.zone)throw new Error(ke().t("zone_required"));super.setConfig(e)}getGridOptions(){return{columns:12,min_columns:3,rows:"auto"}}cardTitle(){return this.config.title?this.config.title:this.snapshot?this.zoneName(this.config.zone):this.l.t(this.titleKey)}translated(e,t){const i=`${e}${t}`;return i in this.l.strings?this.l.t(i):t}renderCheck(e){const t=e.last_check;if(void 0===e.last_check)return Q;if(!t)return F`<p class="secondary last-check">${this.l.t("zone_never_checked")}</p>`;const i=this.translated("check_status_",t.status),o="number"==typeof t.overall_confidence?this.l.t("confidence",{percent:this.l.percent(t.overall_confidence)}):"";return F`<p class="secondary last-check">
      ${this.l.t("zone_last_check",{time:this.l.relative(t.ts),status:i})}
      ${o?F` · ${o}`:Q}
    </p>`}renderShow(e){if(!e.sources.includes("camera_show"))return Q;const t=e.show_armed_until,i=t&&new Date(t).getTime()>Date.now(),o=e.last_show;return F`<p class="secondary show-state">
      ${i?this.l.t("show_armed_until",{time:this.l.time(t)}):this.l.t("show_off")}
      ${o?.product?F`<br />${this.l.t("last_show",{product:o.product,time:this.l.relative(o.ts)})}${o.action?F` · ${this.translated("kind_",o.action)}${"number"==typeof o.quantity?` ${this.l.number(o.quantity)}`:""}`:Q}`:Q}
    </p>`}renderContent(e){const t=e.zones.find(e=>e.zone_id===this.config.zone);if(!t)return F`<p class="error">${this.l.t("error_zone_not_found",{zone:this.config.zone??""})}</p>`;const i=t.sources.map(e=>this.translated("source_",e)),o=e.photo_requests?.find(e=>e.zone_id===t.zone_id),s=t.has_image?this.image({zone_id:t.zone_id},t.last_check?.ts??t.updated??""):void 0,n=e.products.flatMap(e=>e.stock.filter(e=>e.zone_id===t.zone_id&&e.quantity>0).map(t=>({product:e,level:t}))).sort((e,t)=>e.product.name.localeCompare(t.product.name,this.l.locale));return F`
      <p class="secondary updated">
        ${t.updated?this.l.t("zone_updated",{time:this.l.relative(t.updated)}):this.l.t("zone_never_updated")}
        ${i.length?F` · ${i.join(", ")}`:Q}
      </p>
      ${this.renderCheck(t)}
      ${t.in_error?F`<p class="error in-error">${this.l.t("zone_in_error")}</p>`:Q}
      ${o?F`<p class="photo-request">
            ${this.l.t("zone_photo_requested",{time:this.l.relative(o.created)})}
          </p>`:Q}
      ${s?F`<img class="crop" src=${s} alt=${this.l.t("zone_image_alt",{zone:t.name})} />`:Q}
      ${this.renderShow(t)}
      ${this.canWrite?F`<div class="actions">
            <button class="check" ?disabled=${this.busy}
              @click=${()=>this.action("check_zone",{zone:t.zone_id},this.l.t("check_started",{zone:t.name}))}>${this.l.t("check_now")}</button>
            ${t.sources.includes("camera_show")?F`<button class="arm" ?disabled=${this.busy}
                  @click=${()=>this.action("arm_show_mode",{zone:t.zone_id},this.l.t("show_armed",{zone:t.name}))}>${this.l.t("arm_show")}</button>`:Q}
          </div>`:Q}
      ${n.length?F`<ul class="rows">
            ${n.map(({product:e,level:t})=>F`<li>
                <span class="grow name">${e.name}</span>
                <span class="secondary">${this.amount(t.quantity,e.unit)}</span>
              </li>`)}
          </ul>`:F`<p class="muted">${this.l.t("inventory_empty")}</p>`}
    `}},"card_zone","card_zone_description");const Le=["camera","camera_show","passage","manual","ledger"],Fe=new Set(["camera_show","passage"]),We=(e,t,i)=>({name:e,kind:"number",integer:!0,min:t,max:i,step:1}),Qe=(e,t,i)=>({name:e,kind:"number",min:t,max:i,step:"any"}),Ze={name:"entity_id",kind:"entity",domains:["camera"],required:!0},Be={name:"roi",kind:"roi"},Ke=[Ze,{name:"trigger_entity",kind:"entity",domains:["event","binary_sensor"],required:!0},Be,{name:"capture",kind:"select",options:["auto","burst","clip"]},Qe("window_seconds",1,30),Qe("burst_interval_seconds",.2,5),We("max_frames_to_model",1,8),We("cooldown_seconds",0,3600),We("max_per_day",1,500),Qe("min_confidence",0,1),{name:"hours",kind:"text"},{name:"announce",kind:"list",domains:["notify"]}],Ve={camera:[Ze,Be,We("max_checks_per_day",1,96),{name:"trigger_entity",kind:"entity",domains:["binary_sensor"]},{name:"trigger_state",kind:"select",options:["off","on"]},We("trigger_delay_seconds",0,120),We("min_interval_minutes",1,1440)],camera_show:[...Ke,{name:"active",kind:"select",options:["when_armed","always"]},We("arm_minutes",1,240)],passage:[...Ke,We("match_window_seconds",10,3600)],manual:[],ledger:[We("check_days",0,365)]};function Ge(e){return Ve[e]??[]}function Ye(e){return null==e?"":Array.isArray(e)?e.map(String).join(", "):String(e)}function Je(e){const t={};for(const i of Ge(e.type))t[i.name]=Ye(e[i.name]);return{base:{...e},text:t}}function Xe(e){return e.split(",").map(e=>e.trim()).filter(Boolean)}function et(e){const t=Xe(e).map(e=>Number(e.replace(/\s/g,"")));if(4===t.length&&!t.some(e=>!Number.isFinite(e)||e<0||e>1)&&!(t[0]>=t[2]||t[1]>=t[3]))return t}function tt(e){const t=Number(e.trim().replace(",","."));return""!==e.trim()&&Number.isFinite(t)?t:void 0}function it(e){const t={...e.base},i=new Set;for(const o of Ge(e.base.type)){const s=(e.text[o.name]??"").trim();if(s)switch(o.kind){case"number":{const e=tt(s);if(void 0===e||o.integer&&!Number.isInteger(e))return{problem:"invalid_number",field:o.name};t[o.name]=e;break}case"roi":{const e=et(s);if(!e)return{problem:"invalid_roi",field:o.name};t[o.name]=e;break}case"list":t[o.name]=Xe(s);break;default:t[o.name]=s}else{if(o.required)return{problem:"required",field:o.name};i.add(o.name)}}return Object.fromEntries(Object.entries(t).filter(([e])=>!i.has(e)))}function ot(e){return"problem"in e}const st=e=>null==e?"":String(e);class nt extends qe{constructor(){super(...arguments),this.titleKey="card_zones",this.adding=!1,this.newSourceType="camera",this.privacyAck=!1}static getStubConfig(){return{}}static getConfigForm(){return Ce([xe])}label(e,t){const i=`${e}${t}`;return i in this.l.strings?this.l.t(i):t}input(e){return(this.renderRoot.querySelector(`[name="${e}"]`)?.value??"").trim()}async addZone(){const e=this.input("new-zone-name");if(!e)return void this.showError(this.l.t("name_required"));const t=Xe(this.input("new-zone-aliases"));await this.action("add_zone",{name:e,aliases:t},this.l.t("zone_added",{zone:e}))&&(this.adding=!1)}async removeZone(e){await this.action("remove_zone",{zone:e.zone_id},this.l.t("zone_removed",{zone:e.name}))&&(this.deleting=void 0)}edit(e){this.deleting=void 0,this.adding=!1,this.privacyAck=!1,this.notice=void 0,this.editing={zoneId:e.zone_id,name:e.name,aliases:e.aliases.join(", "),checkSchedule:st(e.check_schedule),reminderDays:st(e.reminder_days),confidenceThreshold:st(e.confidence_threshold),sources:e.source_details?.map(e=>Je(e))}}changeSources(e){if(!this.editing?.sources)return;const t=[...this.editing.sources];e(t),this.editing={...this.editing,sources:t}}move(e,t){this.changeSources(i=>{const o=e+t;o<0||o>=i.length||([i[e],i[o]]=[i[o],i[e]])})}addSource(){const e=this.newSourceType;Fe.has(e)&&!this.privacyAck||(this.changeSources(t=>t.push(Je({type:e}))),this.privacyAck=!1)}sourceLabel(e,t){return`${e+1}. ${this.label("source_",t)}`}zoneData(e,t){const i=t.name.trim();if(!i)return void this.showError(this.l.t("name_required"));const o={zone:e.zone_id,name:i,aliases:Xe(t.aliases)};if(t.sources){const e=[];for(const[i,o]of t.sources.entries()){const t=it(o);if(ot(t)){const e={source:this.sourceLabel(i,o.base.type),field:this.label("field_","invalid_roi"===t.problem?"roi":t.field)};return void this.showError(this.l.t(`source_${t.problem}`,e))}e.push(t)}o.sources=e}"check_schedule"in e&&(o.check_schedule=t.checkSchedule.trim()||null);const s=[["reminder_days",t.reminderDays,"reminder_days"],["confidence_threshold",t.confidenceThreshold,"confidence_threshold"]];for(const[t,i,n]of s){if(!(t in e))continue;if(!i.trim()){o[t]=null;continue}const s=tt(i);if(void 0===s||"reminder_days"===t&&!Number.isInteger(s))return void this.showError(this.l.t("zone_invalid_number",{field:this.l.t(n)}));o[t]=s}return o}async save(e){if(!this.editing)return;const t=this.zoneData(e,this.editing);t&&await this.action("set_zone",t,this.l.t("zone_saved",{zone:String(t.name)}))&&(this.editing=void 0)}datalistId(e){return`entities-${e.join("-")}`}renderDatalists(){const e=new Set;for(const t of Object.values(Ve))for(const i of t)i.domains&&e.add(i.domains.join(","));const t=Object.keys(this.hass?.states??{}).sort();return[...e].map(e=>{const i=e.split(",");return F`<datalist id=${this.datalistId(i)}>
        ${t.filter(e=>i.includes(e.split(".")[0])).map(e=>F`<option value=${e}>${this.hass?.states?.[e]?.attributes.friendly_name??""}</option>`)}
      </datalist>`})}renderField(e,t,i){const o=`s${t}-${i.name}`,s=e.text[i.name]??"",n=t=>{e.text[i.name]=t.target.value},r=this.label("field_",i.name);let a;switch(i.kind){case"select":a=F`<select name=${o} @change=${n}>
          <option value="" ?selected=${!s}>${this.l.t("default_option")}</option>
          ${(i.options??[]).map(e=>F`<option value=${e} ?selected=${s===e}>
              ${this.label("option_",e)}
            </option>`)}
        </select>`;break;case"number":a=F`<input name=${o} type="number" inputmode="decimal"
          min=${i.min??""} max=${i.max??""} step=${i.step??"any"}
          .value=${s} @input=${n} />`;break;case"entity":case"list":a=F`<input name=${o} type="text" autocomplete="off"
          list=${i.domains?this.datalistId(i.domains):""}
          ?required=${!0===i.required} .value=${s} @input=${n} />`;break;default:a=F`<input name=${o} type="text" autocomplete="off"
          inputmode=${"roi"===i.kind?"decimal":"text"}
          placeholder=${"roi"===i.kind?"0, 0, 1, 1":"hours"===i.name?"07:00-23:00":""}
          .value=${s} @input=${n} />`}return F`<label class="field">${r}${i.required?" *":""}${a}</label>`}renderSources(e){const t=e.sources;if(!t)return Q;const i=Fe.has(this.newSourceType);return F`
      <h3>${this.l.t("sources")}</h3>
      ${t.length?Q:F`<p class="muted">${this.l.t("no_sources")}</p>`}
      <ol class="sources">
        ${t.map((e,i)=>{const o=this.sourceLabel(i,e.base.type);return F`<li class="source" data-index=${i}>
            <div class="source-head">
              <span class="grow name">${o}</span>
              <button class="icon up" ?disabled=${0===i}
                aria-label=${this.l.t("move_up",{source:o})}
                title=${this.l.t("move_up",{source:o})}
                @click=${()=>this.move(i,-1)}>↑</button>
              <button class="icon down" ?disabled=${i===t.length-1}
                aria-label=${this.l.t("move_down",{source:o})}
                title=${this.l.t("move_down",{source:o})}
                @click=${()=>this.move(i,1)}>↓</button>
              <button class="icon danger remove-source"
                aria-label=${this.l.t("remove_source",{source:o})}
                title=${this.l.t("remove_source",{source:o})}
                @click=${()=>this.changeSources(e=>e.splice(i,1))}>×</button>
            </div>
            <div class="form fields">
              ${Ge(e.base.type).map(t=>this.renderField(e,i,t))}
            </div>
          </li>`})}
      </ol>
      <div class="form add-source">
        <label class="field">
          ${this.l.t("source_type")}
          <select name="new-source-type"
            @change=${e=>{this.newSourceType=e.target.value,this.privacyAck=!1}}>
            ${Le.map(e=>F`<option value=${e} ?selected=${e===this.newSourceType}>
                ${this.label("source_",e)}
              </option>`)}
          </select>
        </label>
        ${i?F`<div class="privacy full" role="note">
              <p>${this.l.t("privacy_notice")}</p>
              <label class="inline">
                <input type="checkbox" name="privacy-ack" .checked=${this.privacyAck}
                  @change=${e=>this.privacyAck=e.target.checked} />
                ${this.l.t("privacy_ack")}
              </label>
            </div>`:Q}
        <button class="add-source-button" ?disabled=${i&&!this.privacyAck}
          @click=${()=>this.addSource()}>${this.l.t("add_source")}</button>
      </div>
    `}renderEditor(e,t){const i=(e,i,o={})=>F`<label class="field">
        ${this.l.t(i)}
        <input name=${`zone-${e}`} type=${o.number?"number":"text"}
          inputmode=${o.number?"decimal":"text"} step=${o.step??"any"}
          placeholder=${o.placeholder??""} .value=${String(t[e]??"")}
          @input=${i=>{t[e]=i.target.value}} />
      </label>`;return F`<div class="editor full">
      ${this.renderDatalists()}
      <div class="form fields">
        ${i("name","name")}
        ${i("aliases","aliases")}
        ${"check_schedule"in e?i("checkSchedule","check_schedule",{placeholder:"0 19 * * *"}):Q}
        ${"reminder_days"in e?i("reminderDays","reminder_days",{number:!0,step:"1"}):Q}
        ${"confidence_threshold"in e?i("confidenceThreshold","confidence_threshold",{number:!0,step:"0.05"}):Q}
      </div>
      ${this.renderSources(t)}
      <div class="actions">
        <button class="primary save" ?disabled=${this.busy} @click=${()=>this.save(e)}>
          ${this.l.t("save")}
        </button>
        <button class="cancel" @click=${()=>this.editing=void 0}>${this.l.t("cancel")}</button>
      </div>
    </div>`}renderZone(e){const t=e.sources.map(e=>this.label("source_",e)),i=this.editing?.zoneId===e.zone_id?this.editing:void 0;return F`<li class="wrap" data-zone=${e.zone_id}>
      <div class="grow">
        <div class="name">${e.name}</div>
        <div class="secondary">${[e.zone_id,...t].join(" · ")}</div>
      </div>
      ${this.canWrite&&!i?F`<button class="edit" @click=${()=>this.edit(e)}>${this.l.t("edit")}</button>
            <button class="danger delete"
              @click=${()=>{this.editing=void 0,this.deleting=e.zone_id}}>${this.l.t("delete")}</button>`:Q}
      ${this.deleting===e.zone_id?F`<div class="full confirm" role="alert">
            <p>${this.l.t("delete_zone_confirm",{zone:e.name})}</p>
            <div class="actions">
              <button class="primary danger-fill confirm-delete" ?disabled=${this.busy}
                @click=${()=>this.removeZone(e)}>${this.l.t("delete")}</button>
              <button class="cancel" @click=${()=>this.deleting=void 0}>
                ${this.l.t("cancel")}
              </button>
            </div>
          </div>`:Q}
      ${i?this.renderEditor(e,i):Q}
    </li>`}renderContent(e){return F`
      ${e.zones.length?F`<ul class="rows">${e.zones.map(e=>this.renderZone(e))}</ul>`:F`<p class="muted">${this.l.t("zones_empty")}</p>`}
      ${this.canWrite?this.adding?F`<div class="form new-zone-form">
              <label class="field">${this.l.t("name")}
                <input name="new-zone-name" type="text" autocomplete="off" />
              </label>
              <label class="field">${this.l.t("aliases")}
                <input name="new-zone-aliases" type="text" autocomplete="off" />
              </label>
              <div class="actions full">
                <button class="primary add-zone" ?disabled=${this.busy}
                  @click=${()=>this.addZone()}>${this.l.t("add")}</button>
                <button class="cancel" @click=${()=>this.adding=!1}>
                  ${this.l.t("cancel")}
                </button>
              </div>
            </div>`:F`<div class="actions">
              <button class="new-zone"
                @click=${()=>{this.adding=!0,this.editing=void 0,this.deleting=void 0}}>${this.l.t("new_zone")}</button>
            </div>`:Q}
    `}static{this.styles=[qe.styles,r`
      label.field {
        flex: 1 1 220px;
        min-width: 0;
      }
      label.field input,
      label.field select {
        width: 100%;
      }
      .editor {
        padding-block: 8px;
      }
      ol.sources {
        list-style: none;
        margin: 0;
        padding: 0;
      }
      li.source {
        border: 1px solid var(--divider-color);
        border-radius: 12px;
        padding: 8px;
        margin-block: 8px;
      }
      .source-head {
        display: flex;
        align-items: center;
        gap: 4px;
      }
      .privacy {
        border-inline-start: 4px solid var(--warning-color);
        padding-inline: 12px;
      }
      button.danger-fill {
        background: var(--error-color);
        border-color: var(--error-color);
        color: var(--text-primary-color);
      }
    `]}}e([he()],nt.prototype,"adding",void 0),e([he()],nt.prototype,"deleting",void 0),e([he()],nt.prototype,"editing",void 0),e([he()],nt.prototype,"newSourceType",void 0),e([he()],nt.prototype,"privacyAck",void 0),Ae("quartermaster-zones-card",nt,"card_zones","card_zones_description");const rt=pe,at="quartermaster",lt="quartermaster-suggestions-card",ct="quartermaster-essentials-card",dt="quartermaster-proposals-card",ut="quartermaster-inventory-card",ht="quartermaster-history-card",pt="quartermaster-zone-card",mt="quartermaster-photo-card",_t="quartermaster-zones-card",gt={overview:"mdi:view-dashboard-outline",shopping:"mdi:cart-outline",essentials:"mdi:star-outline",zones:"mdi:fridge-outline",proposals:"mdi:check-decagram-outline",inventory:"mdi:package-variant-closed",expiry:"mdi:calendar-clock",history:"mdi:history"};function vt(e,t=window.location.pathname){return`/${t.split("/").filter(Boolean)[0]??"lovelace"}/${e}`}function ft(e,t,i){return{title:e,views:[{title:t,path:"overview",type:"sections",sections:[{type:"grid",cards:[{type:"markdown",content:i}]}]}]}}const yt=e=>({type:"heading",heading:e});class $t extends HTMLElement{static async generate(e,t){const i=new ze(t.language),o=e.title??i.t("title");if(!t.config.components.includes(rt))return ft(o,i.t("title"),i.t("missing_integration"));let s;try{s=await t.callWS({type:`${pe}/snapshot`})}catch(e){const t=e?.code,s="unknown_command"===t?"too_old":"not_loaded";return ft(o,i.t("title"),i.t(s))}return 1!==s.api_version?ft(o,i.t("title"),i.t("incompatible",{version:String(s.api_version)})):{title:o,views:bt(s,i)}}}function bt(e,t){const i=t=>e.entities[t]??void 0,o=(e,t,i)=>({title:t,path:e,icon:gt[e],type:"sections",sections:i}),s=(e,t={})=>({type:`custom:${e}`,...t}),n=e.zones,r={type:"grid",cards:[{type:"markdown",content:t.t("no_zones")}]},a=(e,o)=>{const s=i(e);return s?[{type:"tile",entity:s,name:t.t(`tile_${e}`),tap_action:{action:"navigate",navigation_path:vt(o)},grid_options:{columns:6}}]:[]},l=[yt(t.t("overview_heading")),...a("to_buy","shopping"),...a("suggestions","shopping"),...a("expiring","expiry"),...a("photo_requests","zones"),...a("pending_proposals","proposals")],c=i("analyses_today");if(c){const i=e.daily_analysis_limit;l.push({type:"tile",entity:c,name:"number"==typeof i?t.t("tile_analyses_limit",{limit:t.number(i)}):t.t("tile_analyses"),icon:"mdi:image-search-outline",grid_options:{columns:6}})}const d=i("start_shopping");d&&e.can_write&&l.push({type:"button",entity:d,name:t.t("go_shopping"),icon:"mdi:cart-arrow-right",show_state:!1,tap_action:{action:"perform-action",perform_action:"button.press",target:{entity_id:d}}});const u=i("shopping_list"),h=[];u&&h.push({type:"grid",cards:[yt(t.t("view_shopping")),{type:"todo-list",entity:u}]}),h.push({type:"grid",cards:[s(lt)]});const p=n.map(t=>({type:"grid",cards:[s(pt,{zone:t.zone_id}),...e.can_write?[s(mt,{zone:t.zone_id})]:[]]})),m=e.can_write?[{type:"grid",cards:[s(_t)]}]:[],_=n.length?n.map(e=>({type:"grid",cards:[s(ut,{zone:e.zone_id,title:e.name})]})):[{type:"grid",cards:[s(ut)]}],g=i("expiry"),v=g?[{type:"grid",cards:[{type:"calendar",entities:[g],initial_view:"listWeek"}]}]:[];return[o("overview",t.t("view_overview"),[{type:"grid",cards:l}]),o("shopping",t.t("view_shopping"),h),o("essentials",t.t("view_essentials"),[{type:"grid",cards:[s(ct)]}]),o("zones",t.t("view_zones"),[...n.length?p:[r],...m]),o("proposals",t.t("view_proposals"),[{type:"grid",cards:[s(dt)]}]),o("inventory",t.t("view_inventory"),_),o("expiry",t.t("view_expiry"),v),o("history",t.t("view_history"),[{type:"grid",cards:[s(ht)]}])]}const wt=`ll-strategy-dashboard-${at}`;if(!customElements.get(wt)){customElements.define(wt,$t);const e=be(document.documentElement.lang||navigator.language);window.customStrategies=window.customStrategies??[],window.customStrategies.push({type:at,strategyType:"dashboard",name:e.strategy_name,description:e.strategy_description,documentationURL:"https://github.com/samuelebistoletti/HomeAssistant-Quartermaster-Dashboard"})}
