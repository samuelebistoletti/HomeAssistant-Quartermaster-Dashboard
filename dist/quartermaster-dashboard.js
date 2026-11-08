function t(t,e,i,o){var s,n=arguments.length,r=n<3?e:null===o?o=Object.getOwnPropertyDescriptor(e,i):o;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)r=Reflect.decorate(t,e,i,o);else for(var a=t.length-1;a>=0;a--)(s=t[a])&&(r=(n<3?s(r):n>3?s(e,i,r):s(e,i))||r);return n>3&&r&&Object.defineProperty(e,i,r),r}"function"==typeof SuppressedError&&SuppressedError;const e=globalThis,i=e.ShadowRoot&&(void 0===e.ShadyCSS||e.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,o=Symbol(),s=new WeakMap;let n=class{constructor(t,e,i){if(this._$cssResult$=!0,i!==o)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t,this.t=e}get styleSheet(){let t=this.o;const e=this.t;if(i&&void 0===t){const i=void 0!==e&&1===e.length;i&&(t=s.get(e)),void 0===t&&((this.o=t=new CSSStyleSheet).replaceSync(this.cssText),i&&s.set(e,t))}return t}toString(){return this.cssText}};const r=(t,...e)=>{const i=1===t.length?t[0]:e.reduce((e,i,o)=>e+(t=>{if(!0===t._$cssResult$)return t.cssText;if("number"==typeof t)return t;throw Error("Value passed to 'css' function must be a 'css' function result: "+t+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(i)+t[o+1],t[0]);return new n(i,t,o)},a=i?t=>t:t=>t instanceof CSSStyleSheet?(t=>{let e="";for(const i of t.cssRules)e+=i.cssText;return(t=>new n("string"==typeof t?t:t+"",void 0,o))(e)})(t):t,{is:l,defineProperty:c,getOwnPropertyDescriptor:d,getOwnPropertyNames:h,getOwnPropertySymbols:u,getPrototypeOf:p}=Object,m=globalThis,_=m.trustedTypes,g=_?_.emptyScript:"",y=m.reactiveElementPolyfillSupport,f=(t,e)=>t,v={toAttribute(t,e){switch(e){case Boolean:t=t?g:null;break;case Object:case Array:t=null==t?t:JSON.stringify(t)}return t},fromAttribute(t,e){let i=t;switch(e){case Boolean:i=null!==t;break;case Number:i=null===t?null:Number(t);break;case Object:case Array:try{i=JSON.parse(t)}catch(t){i=null}}return i}},$=(t,e)=>!l(t,e),b={attribute:!0,type:String,converter:v,reflect:!1,useDefault:!1,hasChanged:$};Symbol.metadata??=Symbol("metadata"),m.litPropertyMetadata??=new WeakMap;let w=class extends HTMLElement{static addInitializer(t){this._$Ei(),(this.l??=[]).push(t)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(t,e=b){if(e.state&&(e.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(t)&&((e=Object.create(e)).wrapped=!0),this.elementProperties.set(t,e),!e.noAccessor){const i=Symbol(),o=this.getPropertyDescriptor(t,i,e);void 0!==o&&c(this.prototype,t,o)}}static getPropertyDescriptor(t,e,i){const{get:o,set:s}=d(this.prototype,t)??{get(){return this[e]},set(t){this[e]=t}};return{get:o,set(e){const n=o?.call(this);s?.call(this,e),this.requestUpdate(t,n,i)},configurable:!0,enumerable:!0}}static getPropertyOptions(t){return this.elementProperties.get(t)??b}static _$Ei(){if(this.hasOwnProperty(f("elementProperties")))return;const t=p(this);t.finalize(),void 0!==t.l&&(this.l=[...t.l]),this.elementProperties=new Map(t.elementProperties)}static finalize(){if(this.hasOwnProperty(f("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(f("properties"))){const t=this.properties,e=[...h(t),...u(t)];for(const i of e)this.createProperty(i,t[i])}const t=this[Symbol.metadata];if(null!==t){const e=litPropertyMetadata.get(t);if(void 0!==e)for(const[t,i]of e)this.elementProperties.set(t,i)}this._$Eh=new Map;for(const[t,e]of this.elementProperties){const i=this._$Eu(t,e);void 0!==i&&this._$Eh.set(i,t)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(t){const e=[];if(Array.isArray(t)){const i=new Set(t.flat(1/0).reverse());for(const t of i)e.unshift(a(t))}else void 0!==t&&e.push(a(t));return e}static _$Eu(t,e){const i=e.attribute;return!1===i?void 0:"string"==typeof i?i:"string"==typeof t?t.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise(t=>this.enableUpdating=t),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(t=>t(this))}addController(t){(this._$EO??=new Set).add(t),void 0!==this.renderRoot&&this.isConnected&&t.hostConnected?.()}removeController(t){this._$EO?.delete(t)}_$E_(){const t=new Map,e=this.constructor.elementProperties;for(const i of e.keys())this.hasOwnProperty(i)&&(t.set(i,this[i]),delete this[i]);t.size>0&&(this._$Ep=t)}createRenderRoot(){const t=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return((t,o)=>{if(i)t.adoptedStyleSheets=o.map(t=>t instanceof CSSStyleSheet?t:t.styleSheet);else for(const i of o){const o=document.createElement("style"),s=e.litNonce;void 0!==s&&o.setAttribute("nonce",s),o.textContent=i.cssText,t.appendChild(o)}})(t,this.constructor.elementStyles),t}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach(t=>t.hostConnected?.())}enableUpdating(t){}disconnectedCallback(){this._$EO?.forEach(t=>t.hostDisconnected?.())}attributeChangedCallback(t,e,i){this._$AK(t,i)}_$ET(t,e){const i=this.constructor.elementProperties.get(t),o=this.constructor._$Eu(t,i);if(void 0!==o&&!0===i.reflect){const s=(void 0!==i.converter?.toAttribute?i.converter:v).toAttribute(e,i.type);this._$Em=t,null==s?this.removeAttribute(o):this.setAttribute(o,s),this._$Em=null}}_$AK(t,e){const i=this.constructor,o=i._$Eh.get(t);if(void 0!==o&&this._$Em!==o){const t=i.getPropertyOptions(o),s="function"==typeof t.converter?{fromAttribute:t.converter}:void 0!==t.converter?.fromAttribute?t.converter:v;this._$Em=o;const n=s.fromAttribute(e,t.type);this[o]=n??this._$Ej?.get(o)??n,this._$Em=null}}requestUpdate(t,e,i,o=!1,s){if(void 0!==t){const n=this.constructor;if(!1===o&&(s=this[t]),i??=n.getPropertyOptions(t),!((i.hasChanged??$)(s,e)||i.useDefault&&i.reflect&&s===this._$Ej?.get(t)&&!this.hasAttribute(n._$Eu(t,i))))return;this.C(t,e,i)}!1===this.isUpdatePending&&(this._$ES=this._$EP())}C(t,e,{useDefault:i,reflect:o,wrapped:s},n){i&&!(this._$Ej??=new Map).has(t)&&(this._$Ej.set(t,n??e??this[t]),!0!==s||void 0!==n)||(this._$AL.has(t)||(this.hasUpdated||i||(e=void 0),this._$AL.set(t,e)),!0===o&&this._$Em!==t&&(this._$Eq??=new Set).add(t))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(t){Promise.reject(t)}const t=this.scheduleUpdate();return null!=t&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(const[t,e]of this._$Ep)this[t]=e;this._$Ep=void 0}const t=this.constructor.elementProperties;if(t.size>0)for(const[e,i]of t){const{wrapped:t}=i,o=this[e];!0!==t||this._$AL.has(e)||void 0===o||this.C(e,void 0,i,o)}}let t=!1;const e=this._$AL;try{t=this.shouldUpdate(e),t?(this.willUpdate(e),this._$EO?.forEach(t=>t.hostUpdate?.()),this.update(e)):this._$EM()}catch(e){throw t=!1,this._$EM(),e}t&&this._$AE(e)}willUpdate(t){}_$AE(t){this._$EO?.forEach(t=>t.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(t)),this.updated(t)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(t){return!0}update(t){this._$Eq&&=this._$Eq.forEach(t=>this._$ET(t,this[t])),this._$EM()}updated(t){}firstUpdated(t){}};w.elementStyles=[],w.shadowRootOptions={mode:"open"},w[f("elementProperties")]=new Map,w[f("finalized")]=new Map,y?.({ReactiveElement:w}),(m.reactiveElementVersions??=[]).push("2.1.2");const z=globalThis,k=t=>t,A=z.trustedTypes,x=A?A.createPolicy("lit-html",{createHTML:t=>t}):void 0,S="$lit$",E=`lit$${Math.random().toFixed(9).slice(2)}$`,C="?"+E,N=`<${C}>`,q=document,T=()=>q.createComment(""),P=t=>null===t||"object"!=typeof t&&"function"!=typeof t,M=Array.isArray,U="[ \t\n\f\r]",I=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,O=/-->/g,R=/>/g,H=RegExp(`>|${U}(?:([^\\s"'>=/]+)(${U}*=${U}*(?:[^ \t\n\f\r"'\`<>=]|("|')|))|$)`,"g"),j=/'/g,L=/"/g,D=/^(?:script|style|textarea|title)$/i,Q=(t=>(e,...i)=>({_$litType$:t,strings:e,values:i}))(1),W=Symbol.for("lit-noChange"),F=Symbol.for("lit-nothing"),B=new WeakMap,Z=q.createTreeWalker(q,129);function K(t,e){if(!M(t)||!t.hasOwnProperty("raw"))throw Error("invalid template strings array");return void 0!==x?x.createHTML(e):e}const V=(t,e)=>{const i=t.length-1,o=[];let s,n=2===e?"<svg>":3===e?"<math>":"",r=I;for(let e=0;e<i;e++){const i=t[e];let a,l,c=-1,d=0;for(;d<i.length&&(r.lastIndex=d,l=r.exec(i),null!==l);)d=r.lastIndex,r===I?"!--"===l[1]?r=O:void 0!==l[1]?r=R:void 0!==l[2]?(D.test(l[2])&&(s=RegExp("</"+l[2],"g")),r=H):void 0!==l[3]&&(r=H):r===H?">"===l[0]?(r=s??I,c=-1):void 0===l[1]?c=-2:(c=r.lastIndex-l[2].length,a=l[1],r=void 0===l[3]?H:'"'===l[3]?L:j):r===L||r===j?r=H:r===O||r===R?r=I:(r=H,s=void 0);const h=r===H&&t[e+1].startsWith("/>")?" ":"";n+=r===I?i+N:c>=0?(o.push(a),i.slice(0,c)+S+i.slice(c)+E+h):i+E+(-2===c?e:h)}return[K(t,n+(t[i]||"<?>")+(2===e?"</svg>":3===e?"</math>":"")),o]};class G{constructor({strings:t,_$litType$:e},i){let o;this.parts=[];let s=0,n=0;const r=t.length-1,a=this.parts,[l,c]=V(t,e);if(this.el=G.createElement(l,i),Z.currentNode=this.el.content,2===e||3===e){const t=this.el.content.firstChild;t.replaceWith(...t.childNodes)}for(;null!==(o=Z.nextNode())&&a.length<r;){if(1===o.nodeType){if(o.hasAttributes())for(const t of o.getAttributeNames())if(t.endsWith(S)){const e=c[n++],i=o.getAttribute(t).split(E),r=/([.?@])?(.*)/.exec(e);a.push({type:1,index:s,name:r[2],strings:i,ctor:"."===r[1]?et:"?"===r[1]?it:"@"===r[1]?ot:tt}),o.removeAttribute(t)}else t.startsWith(E)&&(a.push({type:6,index:s}),o.removeAttribute(t));if(D.test(o.tagName)){const t=o.textContent.split(E),e=t.length-1;if(e>0){o.textContent=A?A.emptyScript:"";for(let i=0;i<e;i++)o.append(t[i],T()),Z.nextNode(),a.push({type:2,index:++s});o.append(t[e],T())}}}else if(8===o.nodeType)if(o.data===C)a.push({type:2,index:s});else{let t=-1;for(;-1!==(t=o.data.indexOf(E,t+1));)a.push({type:7,index:s}),t+=E.length-1}s++}}static createElement(t,e){const i=q.createElement("template");return i.innerHTML=t,i}}function Y(t,e,i=t,o){if(e===W)return e;let s=void 0!==o?i._$Co?.[o]:i._$Cl;const n=P(e)?void 0:e._$litDirective$;return s?.constructor!==n&&(s?._$AO?.(!1),void 0===n?s=void 0:(s=new n(t),s._$AT(t,i,o)),void 0!==o?(i._$Co??=[])[o]=s:i._$Cl=s),void 0!==s&&(e=Y(t,s._$AS(t,e.values),s,o)),e}class J{constructor(t,e){this._$AV=[],this._$AN=void 0,this._$AD=t,this._$AM=e}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(t){const{el:{content:e},parts:i}=this._$AD,o=(t?.creationScope??q).importNode(e,!0);Z.currentNode=o;let s=Z.nextNode(),n=0,r=0,a=i[0];for(;void 0!==a;){if(n===a.index){let e;2===a.type?e=new X(s,s.nextSibling,this,t):1===a.type?e=new a.ctor(s,a.name,a.strings,this,t):6===a.type&&(e=new st(s,this,t)),this._$AV.push(e),a=i[++r]}n!==a?.index&&(s=Z.nextNode(),n++)}return Z.currentNode=q,o}p(t){let e=0;for(const i of this._$AV)void 0!==i&&(void 0!==i.strings?(i._$AI(t,i,e),e+=i.strings.length-2):i._$AI(t[e])),e++}}class X{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(t,e,i,o){this.type=2,this._$AH=F,this._$AN=void 0,this._$AA=t,this._$AB=e,this._$AM=i,this.options=o,this._$Cv=o?.isConnected??!0}get parentNode(){let t=this._$AA.parentNode;const e=this._$AM;return void 0!==e&&11===t?.nodeType&&(t=e.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,e=this){t=Y(this,t,e),P(t)?t===F||null==t||""===t?(this._$AH!==F&&this._$AR(),this._$AH=F):t!==this._$AH&&t!==W&&this._(t):void 0!==t._$litType$?this.$(t):void 0!==t.nodeType?this.T(t):(t=>M(t)||"function"==typeof t?.[Symbol.iterator])(t)?this.k(t):this._(t)}O(t){return this._$AA.parentNode.insertBefore(t,this._$AB)}T(t){this._$AH!==t&&(this._$AR(),this._$AH=this.O(t))}_(t){this._$AH!==F&&P(this._$AH)?this._$AA.nextSibling.data=t:this.T(q.createTextNode(t)),this._$AH=t}$(t){const{values:e,_$litType$:i}=t,o="number"==typeof i?this._$AC(t):(void 0===i.el&&(i.el=G.createElement(K(i.h,i.h[0]),this.options)),i);if(this._$AH?._$AD===o)this._$AH.p(e);else{const t=new J(o,this),i=t.u(this.options);t.p(e),this.T(i),this._$AH=t}}_$AC(t){let e=B.get(t.strings);return void 0===e&&B.set(t.strings,e=new G(t)),e}k(t){M(this._$AH)||(this._$AH=[],this._$AR());const e=this._$AH;let i,o=0;for(const s of t)o===e.length?e.push(i=new X(this.O(T()),this.O(T()),this,this.options)):i=e[o],i._$AI(s),o++;o<e.length&&(this._$AR(i&&i._$AB.nextSibling,o),e.length=o)}_$AR(t=this._$AA.nextSibling,e){for(this._$AP?.(!1,!0,e);t!==this._$AB;){const e=k(t).nextSibling;k(t).remove(),t=e}}setConnected(t){void 0===this._$AM&&(this._$Cv=t,this._$AP?.(t))}}class tt{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(t,e,i,o,s){this.type=1,this._$AH=F,this._$AN=void 0,this.element=t,this.name=e,this._$AM=o,this.options=s,i.length>2||""!==i[0]||""!==i[1]?(this._$AH=Array(i.length-1).fill(new String),this.strings=i):this._$AH=F}_$AI(t,e=this,i,o){const s=this.strings;let n=!1;if(void 0===s)t=Y(this,t,e,0),n=!P(t)||t!==this._$AH&&t!==W,n&&(this._$AH=t);else{const o=t;let r,a;for(t=s[0],r=0;r<s.length-1;r++)a=Y(this,o[i+r],e,r),a===W&&(a=this._$AH[r]),n||=!P(a)||a!==this._$AH[r],a===F?t=F:t!==F&&(t+=(a??"")+s[r+1]),this._$AH[r]=a}n&&!o&&this.j(t)}j(t){t===F?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,t??"")}}class et extends tt{constructor(){super(...arguments),this.type=3}j(t){this.element[this.name]=t===F?void 0:t}}class it extends tt{constructor(){super(...arguments),this.type=4}j(t){this.element.toggleAttribute(this.name,!!t&&t!==F)}}class ot extends tt{constructor(t,e,i,o,s){super(t,e,i,o,s),this.type=5}_$AI(t,e=this){if((t=Y(this,t,e,0)??F)===W)return;const i=this._$AH,o=t===F&&i!==F||t.capture!==i.capture||t.once!==i.once||t.passive!==i.passive,s=t!==F&&(i===F||o);o&&this.element.removeEventListener(this.name,this,i),s&&this.element.addEventListener(this.name,this,t),this._$AH=t}handleEvent(t){"function"==typeof this._$AH?this._$AH.call(this.options?.host??this.element,t):this._$AH.handleEvent(t)}}class st{constructor(t,e,i){this.element=t,this.type=6,this._$AN=void 0,this._$AM=e,this.options=i}get _$AU(){return this._$AM._$AU}_$AI(t){Y(this,t)}}const nt=z.litHtmlPolyfillSupport;nt?.(G,X),(z.litHtmlVersions??=[]).push("3.3.3");const rt=globalThis;class at extends w{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){const t=super.createRenderRoot();return this.renderOptions.renderBefore??=t.firstChild,t}update(t){const e=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(t),this._$Do=((t,e,i)=>{const o=i?.renderBefore??e;let s=o._$litPart$;if(void 0===s){const t=i?.renderBefore??null;o._$litPart$=s=new X(e.insertBefore(T(),t),t,void 0,i??{})}return s._$AI(t),s})(e,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return W}}at._$litElement$=!0,at.finalized=!0,rt.litElementHydrateSupport?.({LitElement:at});const lt=rt.litElementPolyfillSupport;lt?.({LitElement:at}),(rt.litElementVersions??=[]).push("4.2.2");const ct={attribute:!0,type:String,converter:v,reflect:!1,hasChanged:$},dt=(t=ct,e,i)=>{const{kind:o,metadata:s}=i;let n=globalThis.litPropertyMetadata.get(s);if(void 0===n&&globalThis.litPropertyMetadata.set(s,n=new Map),"setter"===o&&((t=Object.create(t)).wrapped=!0),n.set(i.name,t),"accessor"===o){const{name:o}=i;return{set(i){const s=e.get.call(this);e.set.call(this,i),this.requestUpdate(o,s,t,!0,i)},init(e){return void 0!==e&&this.C(o,void 0,t,e),e}}}if("setter"===o){const{name:o}=i;return function(i){const s=this[o];e.call(this,i),this.requestUpdate(o,s,t,!0,i)}}throw Error("Unsupported decorator location: "+o)};function ht(t){return(e,i)=>"object"==typeof i?dt(t,e,i):((t,e,i)=>{const o=e.hasOwnProperty(i);return e.constructor.createProperty(i,t),o?Object.getOwnPropertyDescriptor(e,i):void 0})(t,e,i)}function ut(t){return ht({...t,state:!0,attribute:!1})}const pt="quartermaster",mt=new WeakMap;var _t={strategy_name:"Quartermaster",strategy_description:"Inventory by zone, essentials, shopping list and proposals to confirm.",title:"Quartermaster",missing_integration:"The Quartermaster integration is not installed. Install it from the Marketplace, then reload this dashboard.",not_loaded:"The Quartermaster integration is installed but not set up or not running. Add it under Settings → Devices & services, then reload this dashboard.",too_old:"The installed Quartermaster integration is too old for this dashboard. Update it from the Marketplace, then reload this dashboard.",incompatible:"This dashboard does not support the Quartermaster API version {version}. Update the dashboard and the integration together.",view_overview:"Overview",view_shopping:"Shopping list",view_essentials:"Essentials",view_zones:"Zones",view_proposals:"Proposals",view_inventory:"Inventory",view_expiry:"Expiry",view_history:"History",overview_heading:"At a glance",go_shopping:"Go shopping",tile_to_buy:"To buy",tile_suggestions:"Suggested",tile_expiring:"Expiring",tile_pending_proposals:"To confirm",shopping_mode_until:"Shopping mode until {time}",no_zones:"No zones yet. Add one with the quartermaster.add_zone action or from the integration.",card_suggestions:"Suggestions",card_suggestions_description:"Products worth buying, with the reason, and one-tap add to the shopping list.",card_essentials:"Essentials",card_essentials_description:"Products you always want at home: present, minimum, target and status.",card_proposals:"Proposals",card_proposals_description:"Changes recognized from photos, to confirm, correct or reject.",card_inventory:"Inventory",card_inventory_description:"Products by zone with quick plus and minus.",card_history:"History",card_history_description:"Latest stock movements, with undo.",card_zone:"Zone",card_zone_description:"Last update and products of one zone.",card_photo:"Photo upload",card_photo_description:"Take or pick a photo of a zone and let Quartermaster count the products.",editor_title:"Title",editor_zone:"Zone ID",editor_zone_helper:"The zone_id from the integration, for example fridge.",editor_limit:"Number of movements",zone_required:"Set the zone of this card (zone).",loading:"Loading…",read_only:"You can view this, but only users allowed to write can change it.",error_generic:"Something went wrong: {message}",save:"Save",cancel:"Cancel",add:"Add",edit:"Edit",remove:"Remove",decrease:"{product}: remove 1",increase:"{product}: add 1",suggestions_empty:"Nothing to suggest right now.",suggestion_added:"{product} added to the shopping list.",reason_below_target:"you have {have}, you usually keep {target}",reason_stale_zone_one:"{zone} has not been updated for {days} day",reason_stale_zone_other:"{zone} has not been updated for {days} days",reason_finished_recently:"you finished it on {date}",reason_unknown:"suggested",essentials_empty:"No essentials yet.",col_product:"Product",col_present:"Present",col_min:"Min",col_target:"Target",col_status:"Status",min_stock:"Minimum",target_stock:"Target",status_to_buy:"To buy",status_low:"Low",status_ok:"OK",add_essential:"Add an essential",choose_product:"Choose a product",min_required:"Set a minimum stock.",target_below_min:"The target cannot be below the minimum.",remove_essential:"Remove from essentials",proposals_empty:"No proposals to confirm.",proposal_from:"{zone}, {time}",proposal_unknown_zone:"Unknown zone",unknown_product:"Not recognized: {seen}",seen_as:"seen as {seen}",confidence:"{percent} sure",correct:"Correct",confirm_selected:"Confirm selected",confirm_all:"Confirm all",reject:"Reject",not_seen:"Not seen: {products}",needs_product:"Choose the product to apply this item.",quantity:"Quantity",product:"Product",inventory_empty:"No products in this zone.",new_product:"New product",name:"Name",name_required:"Enter a name.",unit:"Unit",default_zone:"Zone",essential:"Essential",initial_quantity:"Quantity now",set_quantity:"Set quantity",best_before:"best before {date}",product_added:"{product} added.",history_empty:"No movements yet.",undo:"Undo",undone:"Undone",kind_purchase:"Purchase",kind_consume:"Consumed",kind_inventory:"Count",kind_correction:"Correction",kind_undo:"Undo",kind_import:"Import",channel_alexa:"Alexa",channel_assist:"Assist",channel_telegram:"Telegram",channel_dashboard:"Dashboard",channel_camera:"Camera",channel_service:"Automation",channel_scheduler:"Scheduled",zone_updated:"Updated {time}",zone_never_updated:"Never updated",source_camera:"Camera",source_manual:"Manual",source_camera_show:"Show to camera",photo_zone:"Zone",photo_choose:"Take or choose a photo",photo_preparing:"Preparing the photo…",photo_analyzing:"Analyzing the photo…",photo_android_note:"In the Home Assistant Android app this opens the gallery only: take the photo with the camera app first, or send it to the Telegram bot.",photo_proposal_one:"{count} change to confirm in Proposals.",photo_proposal_other:"{count} changes to confirm in Proposals.",photo_applied_one:"{count} change recorded.",photo_applied_other:"{count} changes recorded.",photo_no_changes:"No changes found.",photo_unusable:"The photo cannot be used: {issues}",photo_not_seen:"Expected but not seen: {products}",photo_unknown:"Not recognized: {products}",photo_too_large:"The photo is still over 2 MB after resizing. Try a smaller or simpler photo.",photo_unreadable:"This file cannot be read as an image.",error_unauthorized:"You are not allowed to change the inventory.",error_not_loaded:"The Quartermaster integration is not running.",error_too_large:"The photo is over 2 MB.",error_invalid_image:"The photo could not be sent.",error_zone_not_found:"No zone called {zone}.",error_product_not_found:"No product called {product}.",error_product_exists:"A product called {product} already exists.",error_daily_limit:"The daily limit of {limit} image analyses is reached.",error_ai_task_missing:"Choose an AI Task entity for images in the Quartermaster options.",error_image_rejected:"The image cannot be analyzed: {issue}.",error_analysis_failed:"The image analysis failed: {error}",error_nothing_to_undo:"There is no movement to undo.",error_proposal_not_found:"This proposal is no longer pending.",error_target_below_min:"The target stock of {product} is below its minimum stock.",error_min_stock_required:"An essential product needs a minimum stock: {product}.",error_not_in_stock:"{product} is not in stock in any zone.",error_invalid_quantity:"The quantity {quantity} is not valid."};const gt={en:_t,it:{strategy_name:"Quartermaster",strategy_description:"Inventario per zona, essenziali, lista della spesa e proposte da confermare.",title:"Quartermaster",missing_integration:"L'integrazione Quartermaster non è installata. Installala dal Marketplace, poi ricarica questa dashboard.",not_loaded:"L'integrazione Quartermaster è installata ma non è configurata o non è in funzione. Aggiungila da Impostazioni → Dispositivi e servizi, poi ricarica questa dashboard.",too_old:"L'integrazione Quartermaster installata è troppo vecchia per questa dashboard. Aggiornala dal Marketplace, poi ricarica questa dashboard.",incompatible:"Questa dashboard non supporta la versione {version} dell'API di Quartermaster. Aggiorna insieme la dashboard e l'integrazione.",view_overview:"Panoramica",view_shopping:"Lista della spesa",view_essentials:"Essenziali",view_zones:"Zone",view_proposals:"Proposte",view_inventory:"Inventario",view_expiry:"Scadenze",view_history:"Storico",overview_heading:"In sintesi",go_shopping:"Vado a fare la spesa",tile_to_buy:"Da comprare",tile_suggestions:"Suggeriti",tile_expiring:"In scadenza",tile_pending_proposals:"Da confermare",shopping_mode_until:"Modalità spesa fino alle {time}",no_zones:"Nessuna zona per ora. Aggiungine una con l'azione quartermaster.add_zone o dall'integrazione.",card_suggestions:"Suggeriti",card_suggestions_description:"Prodotti da comprare con il motivo, da aggiungere alla lista con un tocco.",card_essentials:"Essenziali",card_essentials_description:"Prodotti che devono esserci sempre: presente, minima, obiettivo e stato.",card_proposals:"Proposte",card_proposals_description:"Variazioni riconosciute dalle foto, da confermare, correggere o rifiutare.",card_inventory:"Inventario",card_inventory_description:"Prodotti per zona con più e meno rapidi.",card_history:"Storico",card_history_description:"Ultimi movimenti, con annullamento.",card_zone:"Zona",card_zone_description:"Ultimo aggiornamento e prodotti di una zona.",card_photo:"Caricamento foto",card_photo_description:"Scatta o scegli una foto di una zona e lascia che Quartermaster conti i prodotti.",editor_title:"Titolo",editor_zone:"ID della zona",editor_zone_helper:"Lo zone_id dell'integrazione, per esempio frigo.",editor_limit:"Numero di movimenti",zone_required:"Imposta la zona di questa card (zone).",loading:"Caricamento…",read_only:"Puoi vedere questi dati, ma solo gli utenti autorizzati alla scrittura possono modificarli.",error_generic:"Qualcosa è andato storto: {message}",save:"Salva",cancel:"Annulla",add:"Aggiungi",edit:"Modifica",remove:"Rimuovi",decrease:"{product}: togli 1",increase:"{product}: aggiungi 1",suggestions_empty:"Nessun suggerimento al momento.",suggestion_added:"{product} aggiunto alla lista della spesa.",reason_below_target:"ne hai {have}, di solito ne tieni {target}",reason_stale_zone_one:"la zona {zone} non è aggiornata da {days} giorno",reason_stale_zone_other:"la zona {zone} non è aggiornata da {days} giorni",reason_finished_recently:"l'hai finito il {date}",reason_unknown:"suggerito",essentials_empty:"Nessun essenziale per ora.",col_product:"Prodotto",col_present:"Presenti",col_min:"Minima",col_target:"Obiettivo",col_status:"Stato",min_stock:"Scorta minima",target_stock:"Obiettivo",status_to_buy:"Da comprare",status_low:"In calo",status_ok:"A posto",add_essential:"Aggiungi un essenziale",choose_product:"Scegli un prodotto",min_required:"Imposta una scorta minima.",target_below_min:"L'obiettivo non può essere sotto la scorta minima.",remove_essential:"Togli dagli essenziali",proposals_empty:"Nessuna proposta da confermare.",proposal_from:"{zone}, {time}",proposal_unknown_zone:"Zona sconosciuta",unknown_product:"Non riconosciuto: {seen}",seen_as:"visto come {seen}",confidence:"sicuro al {percent}",correct:"Correggi",confirm_selected:"Conferma selezionati",confirm_all:"Conferma tutto",reject:"Rifiuta",not_seen:"Non visti: {products}",needs_product:"Scegli il prodotto per applicare questa voce.",quantity:"Quantità",product:"Prodotto",inventory_empty:"Nessun prodotto in questa zona.",new_product:"Nuovo prodotto",name:"Nome",name_required:"Inserisci un nome.",unit:"Unità",default_zone:"Zona",essential:"Essenziale",initial_quantity:"Quantità attuale",set_quantity:"Imposta quantità",best_before:"scade il {date}",product_added:"{product} aggiunto.",history_empty:"Nessun movimento per ora.",undo:"Annulla",undone:"Annullato",kind_purchase:"Acquisto",kind_consume:"Consumo",kind_inventory:"Conteggio",kind_correction:"Correzione",kind_undo:"Annullamento",kind_import:"Importazione",channel_alexa:"Alexa",channel_assist:"Assist",channel_telegram:"Telegram",channel_dashboard:"Dashboard",channel_camera:"Telecamera",channel_service:"Automazione",channel_scheduler:"Programmato",zone_updated:"Aggiornata {time}",zone_never_updated:"Mai aggiornata",source_camera:"Telecamera",source_manual:"Manuale",source_camera_show:"Mostra alla telecamera",photo_zone:"Zona",photo_choose:"Scatta o scegli una foto",photo_preparing:"Preparo la foto…",photo_analyzing:"Analizzo la foto…",photo_android_note:"Nell'app Android di Home Assistant si apre solo la galleria: scatta prima la foto con l'app fotocamera, oppure inviala al bot Telegram.",photo_proposal_one:"{count} variazione da confermare in Proposte.",photo_proposal_other:"{count} variazioni da confermare in Proposte.",photo_applied_one:"{count} variazione registrata.",photo_applied_other:"{count} variazioni registrate.",photo_no_changes:"Nessuna variazione trovata.",photo_unusable:"La foto non è utilizzabile: {issues}",photo_not_seen:"Attesi ma non visti: {products}",photo_unknown:"Non riconosciuti: {products}",photo_too_large:"La foto supera ancora i 2 MB dopo il ridimensionamento. Prova una foto più piccola o più semplice.",photo_unreadable:"Questo file non si può leggere come immagine.",error_unauthorized:"Non hai il permesso di modificare l'inventario.",error_not_loaded:"L'integrazione Quartermaster non è in funzione.",error_too_large:"La foto supera i 2 MB.",error_invalid_image:"Non è stato possibile inviare la foto.",error_zone_not_found:"Nessuna zona chiamata {zone}.",error_product_not_found:"Nessun prodotto chiamato {product}.",error_product_exists:"Esiste già un prodotto chiamato {product}.",error_daily_limit:"Hai raggiunto il limite giornaliero di {limit} analisi di immagini.",error_ai_task_missing:"Scegli un'entità AI Task per le immagini nelle opzioni di Quartermaster.",error_image_rejected:"L'immagine non si può analizzare: {issue}.",error_analysis_failed:"L'analisi dell'immagine non è riuscita: {error}",error_nothing_to_undo:"Non c'è nessun movimento da annullare.",error_proposal_not_found:"Questa proposta non è più in attesa.",error_target_below_min:"L'obiettivo di {product} è sotto la scorta minima.",error_min_stock_required:"Un prodotto essenziale ha bisogno di una scorta minima: {product}.",error_not_in_stock:"{product} non è presente in nessuna zona.",error_invalid_quantity:"La quantità {quantity} non è valida."}};function yt(t){return(t??"en").toLowerCase().split("-")[0]}function ft(t){return gt[yt(t)]??_t}function vt(t,e={}){return t.replace(/\{(\w+)\}/g,(t,i)=>i in e?String(e[i]):t)}class $t{constructor(t){this.strings=ft(t),this.locale=t&&yt(t)in gt?t:"en"}t(t,e){return vt(this.strings[t],e)}plural(t,e,i={}){const o=`${t}_one`,s="one"===new Intl.PluralRules(this.locale).select(e)&&o in this.strings?o:`${t}_other`;return vt(this.strings[s],{count:this.number(e),...i})}number(t){return new Intl.NumberFormat(this.locale,{maximumFractionDigits:2}).format(t)}percent(t){return new Intl.NumberFormat(this.locale,{style:"percent",maximumFractionDigits:0}).format(t)}date(t){const[e,i,o]=t.slice(0,10).split("-").map(Number);if(!e||!i||!o)return t;const s=new Date(Date.UTC(e,i-1,o)),n=(new Date).getFullYear()===e;return new Intl.DateTimeFormat(this.locale,{day:"numeric",month:"long",...n?{}:{year:"numeric"},timeZone:"UTC"}).format(s)}time(t){const e=new Date(t);return Number.isNaN(e.getTime())?t:new Intl.DateTimeFormat(this.locale,{hour:"2-digit",minute:"2-digit"}).format(e)}dateTime(t){const e=new Date(t);return Number.isNaN(e.getTime())?t:new Intl.DateTimeFormat(this.locale,{day:"numeric",month:"short",hour:"2-digit",minute:"2-digit"}).format(e)}relative(t,e=new Date){const i=new Date(t);if(Number.isNaN(i.getTime()))return t;const o=(i.getTime()-e.getTime())/1e3,s=[["day",86400],["hour",3600],["minute",60]],n=new Intl.RelativeTimeFormat(this.locale,{numeric:"auto"});for(const[t,e]of s)if(Math.abs(o)>=e)return n.format(Math.round(o/e),t);return n.format(0,"minute")}list(t){return new Intl.ListFormat(this.locale,{type:"conjunction"}).format(t)}reason(t){switch(t.reason){case"below_target":return this.t("reason_below_target",{have:this.number(t.have),target:this.number(t.target??0)});case"stale_zone":{const e=t.days??0;return this.plural("reason_stale_zone",e,{zone:t.zone??"",days:this.number(e)})}case"finished_recently":return this.t("reason_finished_recently",{date:t.date?this.date(t.date):""});default:return this.t("reason_unknown")}}error(t){const e=t??{},i=e.translation_placeholders??{};for(const t of[e.translation_key,e.code]){const e=`error_${t}`;if(t&&e in this.strings)return this.t(e,i)}const o=e.message??(t instanceof Error?t.message:"string"==typeof t?t:"");return this.t("error_generic",{message:o||"?"})}}function bt(){return new $t(document.documentElement.lang||navigator.language)}function wt(t,e,i,o){if(customElements.get(t))return;customElements.define(t,e);const s=bt();window.customCards=window.customCards??[],window.customCards.push({type:t,name:`Quartermaster: ${s.t(i)}`,description:s.t(o),preview:!1,documentationURL:"https://github.com/samuelebistoletti/HomeAssistant-Quartermaster-Dashboard"})}const zt={name:"title",selector:{text:{}}},kt={name:"zone",selector:{text:{}}};function At(t,e=!1){const i={title:"editor_title",zone:"editor_zone",limit:"editor_limit"};return{schema:t.map(t=>"zone"===t.name&&e?{...t,required:!0}:t),computeLabel:t=>{const e=i[t.name];return e?bt().t(e):void 0},computeHelper:t=>"zone"===t.name?bt().t("editor_zone_helper"):void 0}}class xt extends at{constructor(){super(...arguments),this.config={type:""},this.busy=!1}setConfig(t){if(!t)throw new Error("Invalid configuration");this.config={...t}}getCardSize(){return 4}getGridOptions(){return{columns:12,min_columns:6,rows:"auto"}}get l(){const t=this.hass?.language;return this.localizer&&this.localizerLanguage===t||(this.localizer=new $t(t),this.localizerLanguage=t),this.localizer}get canWrite(){return!0===this.snapshot?.can_write}connectedCallback(){super.connectedCallback(),this.subscribe()}disconnectedCallback(){super.disconnectedCallback(),this.unsubscribe?.(),this.unsubscribe=void 0,this.connection=void 0}willUpdate(t){t.has("hass")&&this.subscribe()}subscribe(){const t=this.hass?.connection;t&&this.isConnected&&t!==this.connection&&(this.unsubscribe?.(),this.connection=t,this.unsubscribe=function(t,e){let i=mt.get(t);if(!i){const e={listeners:new Set};i=e,mt.set(t,e),e.unsubscribe=t.subscribeMessage(t=>{e.snapshot=t,e.error=void 0,e.listeners.forEach(e=>e(t))},{type:`${pt}/subscribe`}).catch(i=>{e.error=i,e.listeners.forEach(t=>t(void 0,i)),mt.get(t)===e&&mt.delete(t)})}const o=i;return o.listeners.add(e),(o.snapshot||o.error)&&e(o.snapshot,o.error),()=>{o.listeners.delete(e)&&!o.listeners.size&&(mt.get(t)===o&&mt.delete(t),o.unsubscribe?.then(t=>t?.()).catch(()=>{}))}}(t,(t,e)=>{this.snapshot=t,this.loadError=e,this.snapshotChanged()}))}snapshotChanged(){}async action(t,e,i){if(!this.hass)return!1;this.busy=!0,this.notice=void 0;try{return await this.hass.callService(pt,t,e),i&&(this.notice={text:i,error:!1}),!0}catch(t){return this.notice={text:this.l.error(t),error:!0},!1}finally{this.busy=!1}}showError(t){this.notice={text:t,error:!0}}product(t){return this.snapshot?.products.find(e=>e.product_id===t)}zoneName(t){return this.snapshot?.zones.find(e=>e.zone_id===t)?.name??t??""}amount(t,e){const i=this.l.number(t);return e?`${i} ${e}`:i}cardTitle(){return this.config.title??this.l.t(this.titleKey)}render(){let t;return t=this.loadError?Q`<p class="error" role="alert">${this.l.error(this.loadError)}</p>`:this.snapshot?this.renderContent(this.snapshot):Q`<p class="muted">${this.l.t("loading")}</p>`,Q`
      <ha-card>
        <div class="header">${this.cardTitle()}</div>
        <div class="content">
          ${t}
          ${this.snapshot&&!this.canWrite&&this.hasWriteControls()?Q`<p class="muted read-only">${this.l.t("read_only")}</p>`:F}
          <div class="notice" aria-live="polite">
            ${this.notice?Q`<p class=${this.notice.error?"error":"success"} role=${this.notice.error?"alert":"status"}>
                  ${this.notice.text}
                </p>`:F}
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
    h3 {
      font-size: 1rem;
      font-weight: 500;
      margin-block: 16px 4px;
    }
  `}}t([ht({attribute:!1})],xt.prototype,"hass",void 0),t([ut()],xt.prototype,"config",void 0),t([ut()],xt.prototype,"snapshot",void 0),t([ut()],xt.prototype,"loadError",void 0),t([ut()],xt.prototype,"notice",void 0),t([ut()],xt.prototype,"busy",void 0);const St={to_buy:"status_to_buy",low:"status_low",ok:"status_ok"};function Et(t){if(""===t.trim())return;const e=Number(t.replace(",","."));return Number.isFinite(e)&&e>=0?e:Number.NaN}class Ct extends xt{constructor(){super(...arguments),this.titleKey="card_essentials",this.adding=!1}static getStubConfig(){return{}}static getConfigForm(){return At([zt])}field(t){const e=this.renderRoot.querySelector(`[name="${t}"]`);return e?.value??""}async save(t,e){const i=Et(this.field(`${e}-min`)),o=Et(this.field(`${e}-target`));if(void 0===i||Number.isNaN(i)||void 0!==o&&Number.isNaN(o))return void this.showError(this.l.t("min_required"));if(void 0!==o&&o<i)return void this.showError(this.l.t("target_below_min"));const s={product:t,essential:!0,min_stock:i};void 0!==o&&(s.target_stock=o),await this.action("set_essential",s)&&(this.editing=void 0,this.adding=!1)}async add(){const t=this.field("add-product");t?await this.save(t,"add"):this.showError(this.l.t("choose_product"))}renderEditor(t){return Q`
      <div class="form">
        <label>
          ${this.l.t("min_stock")}
          <input name="edit-min" type="number" inputmode="decimal" min="0" step="any"
            .value=${null===t.min_stock?"":String(t.min_stock)} />
        </label>
        <label>
          ${this.l.t("target_stock")}
          <input name="edit-target" type="number" inputmode="decimal" min="0" step="any"
            .value=${null===t.target_stock?"":String(t.target_stock)} />
        </label>
        <button class="primary" ?disabled=${this.busy}
          @click=${()=>this.save(String(t.product_id),"edit")}>${this.l.t("save")}</button>
        <button ?disabled=${this.busy} @click=${()=>this.editing=void 0}>
          ${this.l.t("cancel")}
        </button>
        <button class="danger" ?disabled=${this.busy}
          @click=${async()=>{await this.action("set_essential",{product:String(t.product_id),essential:!1})&&(this.editing=void 0)}}>${this.l.t("remove_essential")}</button>
      </div>
    `}renderAdd(t){const e=t.products.filter(t=>!t.essential).sort((t,e)=>t.name.localeCompare(e.name,this.l.locale));return this.adding?Q`
      <h3>${this.l.t("add_essential")}</h3>
      <div class="form">
        <label>
          ${this.l.t("product")}
          <select name="add-product">
            <option value="">${this.l.t("choose_product")}</option>
            ${e.map(t=>Q`<option value=${String(t.product_id)}>${t.name}</option>`)}
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
    `:Q`<div class="actions">
        <button ?disabled=${!e.length} @click=${()=>this.adding=!0}>
          ${this.l.t("add_essential")}
        </button>
      </div>`}renderContent(t){const e=t.products.filter(t=>t.essential).sort((t,e)=>t.name.localeCompare(e.name,this.l.locale));return Q`
      ${e.length?Q`<ul class="rows">
            ${e.map(e=>{const i=function(t,e){return e.to_buy.some(e=>e.product_id===t.product_id)||null!==t.min_stock&&t.total<t.min_stock?"to_buy":null!==t.target_stock&&t.total<t.target_stock?"low":"ok"}(e,t),o=[`${this.l.t("col_present")} ${this.amount(e.total,e.unit)}`,`${this.l.t("col_min")} ${null===e.min_stock?"–":this.l.number(e.min_stock)}`,`${this.l.t("col_target")} ${null===e.target_stock?"–":this.l.number(e.target_stock)}`];return Q`
                <li class="wrap" data-product=${e.product_id}>
                  <div class="grow">
                    <div class="name">${e.name}</div>
                    <div class="secondary">${o.join(" · ")}</div>
                  </div>
                  <span class="badge ${i}">${this.l.t(St[i])}</span>
                  ${this.canWrite&&this.editing!==e.product_id?Q`<button class="edit" @click=${()=>this.editing=e.product_id}>
                        ${this.l.t("edit")}
                      </button>`:F}
                  ${this.canWrite&&this.editing===e.product_id?Q`<div class="full">${this.renderEditor(e)}</div>`:F}
                </li>
              `})}
          </ul>`:Q`<p class="muted">${this.l.t("essentials_empty")}</p>`}
      ${this.canWrite?this.renderAdd(t):F}
    `}}t([ut()],Ct.prototype,"editing",void 0),t([ut()],Ct.prototype,"adding",void 0),wt("quartermaster-essentials-card",Ct,"card_essentials","card_essentials_description");class Nt extends xt{constructor(){super(...arguments),this.titleKey="card_history",this.request=0}static getStubConfig(){return{}}static getConfigForm(){return At([zt,{name:"limit",selector:{number:{min:1,max:500,mode:"box"}}}])}snapshotChanged(){this.load()}async load(){if(!this.hass||!this.snapshot)return;const t=++this.request,e=Math.min(Math.max(Number(this.config.limit)||50,1),500);try{const i=await this.hass.callWS({type:`${pt}/journal`,limit:e});t===this.request&&(this.entries=i.entries)}catch(e){t===this.request&&this.showError(this.l.error(e))}}label(t,e){const i=`${t}_${e}`;return i in this.l.strings?this.l.t(i):e}renderContent(){if(!this.entries)return Q`<p class="muted">${this.l.t("loading")}</p>`;if(!this.entries.length)return Q`<p class="muted">${this.l.t("history_empty")}</p>`;const t=new Set;return Q`
      <ul class="rows">
        ${this.entries.map(e=>{const i=e.operation_id,o=null!==i&&!t.has(i);null!==i&&t.add(i);const s=o&&!e.undone&&"undo"!==e.kind&&this.canWrite,n=this.product(e.product_id),r=`${e.delta>0?"+":e.delta<0?"−":"±"}${this.l.number(Math.abs(e.delta))}`,a=[this.label("kind",e.kind),`${r} → ${this.amount(e.quantity_after,n?.unit)}`,e.zone??this.zoneName(e.zone_id),this.label("channel",e.channel)].filter(Boolean);return Q`
            <li data-entry=${e.id}>
              <div class="grow">
                <div class="name">${e.product??n?.name??"?"}</div>
                <div class="secondary">${this.l.dateTime(e.ts)} · ${a.join(" · ")}</div>
              </div>
              ${e.undone?Q`<span class="badge">${this.l.t("undone")}</span>`:F}
              ${s?Q`<button class="undo" ?disabled=${this.busy}
                    @click=${()=>this.action("undo_last",{operation_id:i})}>
                    ${this.l.t("undo")}
                  </button>`:F}
            </li>
          `})}
      </ul>
    `}}t([ut()],Nt.prototype,"entries",void 0),wt("quartermaster-history-card",Nt,"card_history","card_history_description");class qt extends xt{constructor(){super(...arguments),this.titleKey="card_inventory",this.adding=!1}static getStubConfig(){return{}}static getConfigForm(){return At([zt,kt])}value(t){return this.renderRoot.querySelector(`[name="${t}"]`)?.value??""}checked(t){return this.renderRoot.querySelector(`[name="${t}"]`)?.checked??!1}adjust(t,e,i){return this.action("adjust_stock",{product:String(t.product_id),operation:i,quantity:1,zone:e.zone_id})}async setQuantity(t,e){const i=Number(this.value("set-quantity").replace(",","."));!Number.isFinite(i)||i<0?this.showError(this.l.t("error_invalid_quantity",{quantity:this.value("set-quantity")})):await this.action("set_stock",{product:String(t.product_id),quantity:i,zone:e.zone_id})&&(this.editing=void 0)}async addProduct(){const t=this.value("new-name").trim();if(!t)return void this.showError(this.l.t("name_required"));const e=this.value("new-zone"),i=this.value("new-unit").trim(),o=Number(this.value("new-quantity").replace(",",".")||"0"),s=this.checked("new-essential"),n=Number(this.value("new-min").replace(",",".")||"1"),r={name:t,essential:s};e&&(r.default_zone=e),i&&(r.unit=i),s&&(r.min_stock=Number.isFinite(n)?n:1),await this.action("add_product",r,this.l.t("product_added",{product:t}))&&(e&&Number.isFinite(o)&&o>0&&await this.action("set_stock",{product:t,quantity:o,zone:e},this.l.t("product_added",{product:t})),this.adding=!1)}renderRow(t,e,i){const o=`${t.product_id}@${i.zone_id}`,s=[this.amount(e.quantity,t.unit)];return e.best_before&&s.push(this.l.t("best_before",{date:this.l.date(e.best_before)})),Q`
      <li class="wrap" data-product=${t.product_id}>
        <div class="grow">
          <div class="name">${t.name}</div>
          <div class="secondary">${s.join(" · ")}</div>
        </div>
        ${this.canWrite?Q`
              <button class="icon minus" aria-label=${this.l.t("decrease",{product:t.name})}
                ?disabled=${this.busy||e.quantity<=0}
                @click=${()=>this.adjust(t,i,"consume")}>−</button>
              <button class="icon plus" aria-label=${this.l.t("increase",{product:t.name})}
                ?disabled=${this.busy} @click=${()=>this.adjust(t,i,"purchase")}>+</button>
              <button class="icon edit" aria-label=${`${this.l.t("set_quantity")}: ${t.name}`}
                title=${this.l.t("set_quantity")}
                @click=${()=>this.editing=this.editing===o?void 0:o}>✎</button>
            `:F}
        ${this.editing===o&&this.canWrite?Q`<div class="form full">
              <label>
                ${this.l.t("quantity")}
                <input name="set-quantity" type="number" inputmode="decimal" min="0" step="any"
                  .value=${String(e.quantity)} />
              </label>
              <button class="primary" ?disabled=${this.busy}
                @click=${()=>this.setQuantity(t,i)}>${this.l.t("save")}</button>
              <button @click=${()=>this.editing=void 0}>${this.l.t("cancel")}</button>
            </div>`:F}
      </li>
    `}renderZone(t,e,i){const o=e.products.flatMap(e=>e.stock.filter(e=>e.zone_id===t.zone_id).map(t=>({product:e,level:t}))).sort((t,e)=>t.product.name.localeCompare(e.product.name,this.l.locale));return Q`
      ${i?Q`<h3>${t.name}</h3>`:F}
      ${o.length?Q`<ul class="rows">${o.map(({product:e,level:i})=>this.renderRow(e,i,t))}</ul>`:Q`<p class="muted">${this.l.t("inventory_empty")}</p>`}
    `}renderAdd(t){if(!this.adding)return Q`<div class="actions">
        <button class="new-product" @click=${()=>this.adding=!0}>${this.l.t("new_product")}</button>
      </div>`;const e=this.config.zone;return Q`
      <h3>${this.l.t("new_product")}</h3>
      <div class="form">
        <label>${this.l.t("name")}<input name="new-name" type="text" autocomplete="off" /></label>
        <label>
          ${this.l.t("default_zone")}
          <select name="new-zone">
            <option value="">–</option>
            ${t.zones.map(t=>Q`<option value=${t.zone_id} ?selected=${t.zone_id===e}>${t.name}</option>`)}
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
    `}renderContent(t){const e=this.config.zone?t.zones.filter(t=>t.zone_id===this.config.zone):t.zones;return this.config.zone&&!e.length?Q`<p class="error">${this.l.t("error_zone_not_found",{zone:this.config.zone})}</p>`:Q`
      ${e.map(e=>this.renderZone(e,t,!this.config.zone))}
      ${this.canWrite?this.renderAdd(t):F}
    `}}t([ut()],qt.prototype,"editing",void 0),t([ut()],qt.prototype,"adding",void 0),wt("quartermaster-inventory-card",qt,"card_inventory","card_inventory_description");class Tt extends Error{constructor(t){super(`Image is ${t} bytes after encoding`),this.bytes=t,this.name="ImageTooLargeError"}}class Pt extends Error{constructor(t){super("The file cannot be decoded as an image",{cause:t}),this.name="ImageUnreadableError"}}function Mt(t){let e="";for(let i=0;i<t.length;i+=32768)e+=String.fromCharCode(...t.subarray(i,i+32768));return btoa(e)}async function Ut(t,e={}){const i=e.maxSide??1280,o=e.quality??.8,s=e.maxBytes??2097152;let n;try{n=await createImageBitmap(t,{imageOrientation:"from-image"})}catch(t){throw new Pt(t)}try{const{width:t,height:e}=function(t,e,i=1280){const o=Math.max(t,e);if(o<=i)return{width:t,height:e};const s=i/o;return{width:Math.max(1,Math.round(t*s)),height:Math.max(1,Math.round(e*s))}}(n.width,n.height,i),r=document.createElement("canvas");r.width=t,r.height=e;const a=r.getContext("2d");if(!a)throw new Pt;a.imageSmoothingQuality="high",a.drawImage(n,0,0,t,e);const l=await function(t,e){return new Promise((i,o)=>{t.toBlob(t=>t?i(t):o(new Pt),"image/jpeg",e)})}(r,o);if(l.size>s)throw new Tt(l.size);return{base64:Mt(new Uint8Array(await l.arrayBuffer())),bytes:l.size,width:t,height:e}}finally{n.close()}}class It extends xt{constructor(){super(...arguments),this.titleKey="card_photo",this.phase="idle",this.android=function(t=navigator.userAgent){return/android/i.test(t)}()}static getStubConfig(){return{}}static getConfigForm(){return At([zt,kt])}selectedZone(t){const e=t.zones.map(t=>t.zone_id);for(const t of[this.zone,this.config.zone])if(t&&e.includes(t))return t;return e[0]}async upload(t){const e=t.target,i=e.files?.[0],o=this.snapshot?this.selectedZone(this.snapshot):void 0;if(i&&o&&this.hass){this.notice=void 0,this.result=void 0,this.phase="preparing";try{const t=await Ut(i);this.phase="analyzing",this.result=await this.hass.callWS({type:`${pt}/upload_photo`,zone:o,image:t.base64})}catch(t){t instanceof Tt?this.showError(this.l.t("photo_too_large")):t instanceof Pt?this.showError(this.l.t("photo_unreadable")):this.showError(this.l.error(t))}finally{this.phase="idle",e.value=""}}}itemText(t){return`${t.product??this.l.t("unknown_product",{seen:t.seen_as})}: ${null===t.current?"–":this.l.number(t.current)} → ${this.amount(t.proposed,t.unit)}`}renderResult(t){const e=[];return t.image_usable||e.push(Q`<p class="error">
          ${this.l.t("photo_unusable",{issues:this.l.list(t.image_issues??[])})}
        </p>`),t.applied.length&&e.push(Q`<p class="success">${this.l.plural("photo_applied",t.applied.length)}</p>`),null!==t.proposal_id&&t.proposed.length&&e.push(Q`<p>${this.l.plural("photo_proposal",t.proposed.length)}</p>
          <ul class="rows">
            ${t.proposed.map(t=>Q`<li>${this.itemText(t)}</li>`)}
          </ul>`),!t.image_usable||t.applied.length||t.proposed.length||e.push(Q`<p>${this.l.t("photo_no_changes")}</p>`),t.not_seen.length&&e.push(Q`<p class="secondary">${this.l.t("photo_not_seen",{products:this.l.list(t.not_seen)})}</p>`),t.unknown.length&&e.push(Q`<p class="secondary">${this.l.t("photo_unknown",{products:this.l.list(t.unknown)})}</p>`),Q`<div class="result">${e}</div>`}renderContent(t){if(!this.canWrite)return F;if(!t.zones.length)return Q`<p class="muted">${this.l.t("no_zones")}</p>`;const e=this.selectedZone(t),i="idle"!==this.phase;return Q`
      <div class="form">
        <label>
          ${this.l.t("photo_zone")}
          <select name="zone" ?disabled=${i}
            @change=${t=>this.zone=t.target.value}>
            ${t.zones.map(t=>Q`<option value=${t.zone_id} ?selected=${t.zone_id===e}>${t.name}</option>`)}
          </select>
        </label>
        <label class="pick ${i?"disabled":""}">
          <span>${this.l.t("photo_choose")}</span>
          <input type="file" accept="image/*" capture="environment" ?disabled=${i}
            @change=${t=>this.upload(t)} />
        </label>
      </div>
      ${this.android?Q`<p class="secondary android-note">${this.l.t("photo_android_note")}</p>`:F}
      ${i?Q`<p class="muted" role="status">
            ${this.l.t("preparing"===this.phase?"photo_preparing":"photo_analyzing")}
          </p>`:F}
      ${this.result&&!i?this.renderResult(this.result):F}
    `}static{this.styles=[xt.styles,r`
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
    `]}}t([ut()],It.prototype,"zone",void 0),t([ut()],It.prototype,"phase",void 0),t([ut()],It.prototype,"result",void 0),wt("quartermaster-photo-card",It,"card_photo","card_photo_description");class Ot extends xt{constructor(){super(...arguments),this.titleKey="card_proposals",this.choices=new Map}static getStubConfig(){return{}}static getConfigForm(){return At([zt])}choice(t){let e=this.choices.get(t);return e||(e={excluded:new Set,correcting:new Set},this.choices.set(t,e)),e}toggle(t,e){t.delete(e)||t.add(e),this.choices=new Map(this.choices)}value(t){return this.renderRoot.querySelector(`[name="${t}"]`)?.value??""}async confirm(t,e){const i=this.choice(t.proposal_id),o=t.items.map(t=>t.key).filter(t=>e||!i.excluded.has(t)),s=[...i.correcting].filter(t=>o.includes(t)).map(e=>{const i={key:e},o=this.value(`p${t.proposal_id}-k${e}-product`),s=Number(this.value(`p${t.proposal_id}-k${e}-quantity`).replace(",","."));return o&&(i.product=o),Number.isFinite(s)&&s>=0&&(i.quantity=s),i}),n={proposal_id:t.proposal_id,decision:"confirm"};o.length!==t.items.length&&(n.items=o),s.length&&(n.corrections=s),await this.action("confirm_pending",n)&&this.choices.delete(t.proposal_id)}async reject(t){await this.action("confirm_pending",{proposal_id:t.proposal_id,decision:"reject"})&&this.choices.delete(t.proposal_id)}renderItem(t,e,i){const o=this.choice(t.proposal_id),s=!o.excluded.has(e.key),n=o.correcting.has(e.key),r=e.product??this.l.t("unknown_product",{seen:e.seen_as}),a=null===e.current?"–":this.l.number(e.current),l=`p${t.proposal_id}-k${e.key}`,c=[...i.products].sort((t,e)=>t.name.localeCompare(e.name,this.l.locale));return Q`
      <li class="wrap" data-key=${e.key}>
        ${this.canWrite?Q`<input type="checkbox" .checked=${s} aria-label=${r}
              @change=${()=>this.toggle(o.excluded,e.key)} />`:F}
        <div class="grow">
          <div class="name">${r}</div>
          <div class="secondary">
            ${a} → ${this.amount(e.proposed,e.unit)}
            · ${this.l.t("confidence",{percent:this.l.percent(e.confidence)})}
            ${e.product&&e.seen_as&&e.seen_as!==e.product?Q`· ${this.l.t("seen_as",{seen:e.seen_as})}`:F}
          </div>
          ${null===e.product_id&&s&&!n&&this.canWrite?Q`<div class="secondary error">${this.l.t("needs_product")}</div>`:F}
        </div>
        ${this.canWrite?Q`<button class="correct" @click=${()=>this.toggle(o.correcting,e.key)}>
              ${n?this.l.t("cancel"):this.l.t("correct")}
            </button>`:F}
        ${n?Q`<div class="form full">
              <label>
                ${this.l.t("product")}
                <select name=${`${l}-product`}>
                  <option value="">${e.product??this.l.t("choose_product")}</option>
                  ${c.map(t=>Q`<option value=${String(t.product_id)}>${t.name}</option>`)}
                </select>
              </label>
              <label>
                ${this.l.t("quantity")}
                <input name=${`${l}-quantity`} type="number" inputmode="decimal" min="0"
                  step="any" .value=${String(e.proposed)} />
              </label>
            </div>`:F}
      </li>
    `}renderContent(t){return t.proposals.length?Q`${t.proposals.map(e=>{const i=e.zone_id?this.zoneName(e.zone_id):this.l.t("proposal_unknown_zone"),o=this.choice(e.proposal_id),s=e.items.length-o.excluded.size;return Q`
        <section data-proposal=${e.proposal_id}>
          <h3>${this.l.t("proposal_from",{zone:i,time:this.l.relative(e.created)})}</h3>
          <ul class="rows">
            ${e.items.map(i=>this.renderItem(e,i,t))}
          </ul>
          ${e.not_seen.length?Q`<p class="secondary">
                ${this.l.t("not_seen",{products:this.l.list(e.not_seen)})}
              </p>`:F}
          ${this.canWrite?Q`<div class="actions">
                <button class="primary confirm-all" ?disabled=${this.busy}
                  @click=${()=>this.confirm(e,!0)}>${this.l.t("confirm_all")}</button>
                ${o.excluded.size?Q`<button class="confirm-selected" ?disabled=${this.busy||!s}
                      @click=${()=>this.confirm(e,!1)}>
                      ${this.l.t("confirm_selected")}
                    </button>`:F}
                <button class="danger reject" ?disabled=${this.busy}
                  @click=${()=>this.reject(e)}>${this.l.t("reject")}</button>
              </div>`:F}
        </section>
      `})}`:Q`<p class="muted">${this.l.t("proposals_empty")}</p>`}}t([ut()],Ot.prototype,"choices",void 0),wt("quartermaster-proposals-card",Ot,"card_proposals","card_proposals_description");wt("quartermaster-suggestions-card",class extends xt{constructor(){super(...arguments),this.titleKey="card_suggestions"}static getStubConfig(){return{}}static getConfigForm(){return At([zt])}renderContent(t){return t.suggestions.length?Q`
      <ul class="rows">
        ${t.suggestions.map(t=>{const e=this.product(t.product_id),i=e?.name??String(t.product_id);return Q`
            <li>
              <div class="grow">
                <div class="name">${i}</div>
                <div class="secondary reason">${this.l.reason(t)}</div>
              </div>
              ${this.canWrite?Q`<button
                    class="icon primary"
                    aria-label=${`${this.l.t("add")}: ${i}`}
                    title=${this.l.t("add")}
                    ?disabled=${this.busy}
                    @click=${()=>this.action("add_to_shopping_list",{product:String(t.product_id),from_suggestion:!0},this.l.t("suggestion_added",{product:i}))}
                  >
                    +
                  </button>`:""}
            </li>
          `})}
      </ul>
    `:Q`<p class="muted">${this.l.t("suggestions_empty")}</p>`}},"card_suggestions","card_suggestions_description");wt("quartermaster-zone-card",class extends xt{constructor(){super(...arguments),this.titleKey="card_zone"}static getStubConfig(){return{zone:""}}static getConfigForm(){return At([kt],!0)}setConfig(t){if(!t?.zone)throw new Error(bt().t("zone_required"));super.setConfig(t)}getGridOptions(){return{columns:12,min_columns:3,rows:"auto"}}hasWriteControls(){return!1}cardTitle(){return this.config.title?this.config.title:this.snapshot?this.zoneName(this.config.zone):this.l.t(this.titleKey)}renderContent(t){const e=t.zones.find(t=>t.zone_id===this.config.zone);if(!e)return Q`<p class="error">${this.l.t("error_zone_not_found",{zone:this.config.zone??""})}</p>`;const i=e.sources.map(t=>{const e=`source_${t}`;return e in this.l.strings?this.l.t(e):t}),o=t.products.flatMap(t=>t.stock.filter(t=>t.zone_id===e.zone_id&&t.quantity>0).map(e=>({product:t,level:e}))).sort((t,e)=>t.product.name.localeCompare(e.product.name,this.l.locale));return Q`
      <p class="secondary updated">
        ${e.updated?this.l.t("zone_updated",{time:this.l.relative(e.updated)}):this.l.t("zone_never_updated")}
        ${i.length?Q` · ${i.join(", ")}`:F}
      </p>
      ${o.length?Q`<ul class="rows">
            ${o.map(({product:t,level:e})=>Q`<li>
                <span class="grow name">${t.name}</span>
                <span class="secondary">${this.amount(e.quantity,t.unit)}</span>
              </li>`)}
          </ul>`:Q`<p class="muted">${this.l.t("inventory_empty")}</p>`}
    `}},"card_zone","card_zone_description");const Rt=pt,Ht="quartermaster",jt="quartermaster-suggestions-card",Lt="quartermaster-essentials-card",Dt="quartermaster-proposals-card",Qt="quartermaster-inventory-card",Wt="quartermaster-history-card",Ft="quartermaster-zone-card",Bt="quartermaster-photo-card",Zt={overview:"mdi:view-dashboard-outline",shopping:"mdi:cart-outline",essentials:"mdi:star-outline",zones:"mdi:fridge-outline",proposals:"mdi:check-decagram-outline",inventory:"mdi:package-variant-closed",expiry:"mdi:calendar-clock",history:"mdi:history"};function Kt(t,e=window.location.pathname){return`/${e.split("/").filter(Boolean)[0]??"lovelace"}/${t}`}function Vt(t,e,i){return{title:t,views:[{title:e,path:"overview",type:"sections",sections:[{type:"grid",cards:[{type:"markdown",content:i}]}]}]}}const Gt=t=>({type:"heading",heading:t});class Yt extends HTMLElement{static async generate(t,e){const i=new $t(e.language),o=t.title??i.t("title");if(!e.config.components.includes(Rt))return Vt(o,i.t("title"),i.t("missing_integration"));let s;try{s=await e.callWS({type:`${pt}/snapshot`})}catch(t){const e=t?.code,s="unknown_command"===e?"too_old":"not_loaded";return Vt(o,i.t("title"),i.t(s))}return 1!==s.api_version?Vt(o,i.t("title"),i.t("incompatible",{version:String(s.api_version)})):{title:o,views:Jt(s,i)}}}function Jt(t,e){const i=e=>t.entities[e]??void 0,o=(t,e,i)=>({title:e,path:t,icon:Zt[t],type:"sections",sections:i}),s=(t,e={})=>({type:`custom:${t}`,...e}),n=t.zones,r={type:"grid",cards:[{type:"markdown",content:e.t("no_zones")}]},a=(t,o)=>{const s=i(t);return s?[{type:"tile",entity:s,name:e.t(`tile_${t}`),tap_action:{action:"navigate",navigation_path:Kt(o)},grid_options:{columns:6}}]:[]},l=[Gt(e.t("overview_heading")),...a("to_buy","shopping"),...a("suggestions","shopping"),...a("expiring","expiry"),...a("pending_proposals","proposals")],c=i("start_shopping");c&&t.can_write&&l.push({type:"button",entity:c,name:e.t("go_shopping"),icon:"mdi:cart-arrow-right",show_state:!1,tap_action:{action:"perform-action",perform_action:"button.press",target:{entity_id:c}}});const d=i("shopping_list"),h=[];d&&h.push({type:"grid",cards:[Gt(e.t("view_shopping")),{type:"todo-list",entity:d}]}),h.push({type:"grid",cards:[s(jt)]});const u=n.map(e=>({type:"grid",cards:[s(Ft,{zone:e.zone_id}),...t.can_write?[s(Bt,{zone:e.zone_id})]:[]]})),p=n.length?n.map(t=>({type:"grid",cards:[s(Qt,{zone:t.zone_id,title:t.name})]})):[{type:"grid",cards:[s(Qt)]}],m=i("expiry"),_=m?[{type:"grid",cards:[{type:"calendar",entities:[m],initial_view:"listWeek"}]}]:[];return[o("overview",e.t("view_overview"),[{type:"grid",cards:l}]),o("shopping",e.t("view_shopping"),h),o("essentials",e.t("view_essentials"),[{type:"grid",cards:[s(Lt)]}]),o("zones",e.t("view_zones"),n.length?u:[r]),o("proposals",e.t("view_proposals"),[{type:"grid",cards:[s(Dt)]}]),o("inventory",e.t("view_inventory"),p),o("expiry",e.t("view_expiry"),_),o("history",e.t("view_history"),[{type:"grid",cards:[s(Wt)]}])]}const Xt=`ll-strategy-dashboard-${Ht}`;if(!customElements.get(Xt)){customElements.define(Xt,Yt);const t=ft(document.documentElement.lang||navigator.language);window.customStrategies=window.customStrategies??[],window.customStrategies.push({type:Ht,strategyType:"dashboard",name:t.strategy_name,description:t.strategy_description,documentationURL:"https://github.com/samuelebistoletti/HomeAssistant-Quartermaster-Dashboard"})}
