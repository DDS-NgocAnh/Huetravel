(window.webpackJsonp=window.webpackJsonp||[]).push([[3],{127:function(e,t,n){"use strict";t.a=n.p+"assets/img/flower.30323aa8579c2171493519aafd942e43.png"},128:function(e,t,n){"use strict";t.a=n.p+"assets/img/rock.2d506a59ea4729f0801b8a78617d483b.png"},129:function(e,t,n){"use strict";t.a=n.p+"assets/img/location.5f42084df6b646e665d17f099f380ca3.png"},130:function(e,t,n){"use strict";var o=n(0);function r(){return(r=Object.assign||function(e){for(var t=1;t<arguments.length;t++){var n=arguments[t];for(var o in n)Object.prototype.hasOwnProperty.call(n,o)&&(e[o]=n[o])}return e}).apply(this,arguments)}var a=o.createElement("path",{d:"M106 0v512l150-145.789L406 512V0z"});t.a=function(e){return o.createElement("svg",r({viewBox:"0 0 512 512"},e),a)}},132:function(e,t,n){"use strict";n.r(t);var o=n(0),r=n.n(o),a=n(28),s=n(16),i=(n(40),n(127)),c=n(128),u=n(129),l=n(130),f=n(2),m=n(13);function p(e){return(p="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e})(e)}function b(e,t){for(var n=0;n<t.length;n++){var o=t[n];o.enumerable=o.enumerable||!1,o.configurable=!0,"value"in o&&(o.writable=!0),Object.defineProperty(e,o.key,o)}}function d(e,t){return(d=Object.setPrototypeOf||function(e,t){return e.__proto__=t,e})(e,t)}function k(e){var t=function(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Date.prototype.toString.call(Reflect.construct(Date,[],(function(){}))),!0}catch(e){return!1}}();return function(){var n,o=_(e);if(t){var r=_(this).constructor;n=Reflect.construct(o,arguments,r)}else n=o.apply(this,arguments);return y(this,n)}}function y(e,t){return!t||"object"!==p(t)&&"function"!=typeof t?h(e):t}function h(e){if(void 0===e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return e}function _(e){return(_=Object.setPrototypeOf?Object.getPrototypeOf:function(e){return e.__proto__||Object.getPrototypeOf(e)})(e)}t.default=Object(s.b)((function(e){return{isLoggedIn:e.currentUser.isLoggedIn,currentUser:e.currentUser.userData,isOpen:e.popup.isOpen,socket:e.socket.socket}}),(function(e){return{onOpen:function(){return e({type:f.h})}}}))(function(e){!function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function");e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,writable:!0,configurable:!0}}),t&&d(e,t)}(f,e);var t,n,o,s=k(f);function f(e){var t;return function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,f),(t=s.call(this,e)).state={isBookmark:"bookmark--unnoted",successMessage:"",errorMessage:""},t.bookmark=m.a.bind(h(t)),t.toastNoti=m.i.bind(h(t)),t.isUserInArr=m.e.bind(h(t)),t.isBookmark=t.isBookmark.bind(h(t)),t}return t=f,(n=[{key:"componentDidMount",value:function(){var e=this.isBookmark(this.state,this.props);this.setState({isBookmark:e})}},{key:"isBookmark",value:function(e,t){var n=t.isLoggedIn,o=t.currentUser,r=t.info,a="bookmark--unnoted";return n&&r.notes&&(a=this.isUserInArr(r.notes,o.id)?"bookmark--noted":"bookmark--unnoted"),a}},{key:"UNSAFE_componentWillUpdate",value:function(e,t){if(this.toastNoti(t),e.isLoggedIn||(t.isBookmark="bookmark--unnoted"),e.isLoggedIn&&!this.props.isLoggedIn){var n=this.isBookmark(t,e);t.isBookmark=n}}},{key:"render",value:function(){var e=this,t=this.state.isBookmark,n=this.props.info,o="/destinations/"+n._id;return r.a.createElement("div",{className:"dest-box"},r.a.createElement("div",{className:"dest-box__bookmark"},r.a.createElement(l.a,{onClick:function(){return e.bookmark(n._id,e.props.isUserProfile)},className:t})),r.a.createElement("div",{className:"dest-box__react"},r.a.createElement("div",{className:"react-box"},r.a.createElement("img",{src:i.a,className:"react-box__icon",alt:"Flower"}),r.a.createElement("span",{className:"react-box__info"},n.flowersTotal)),r.a.createElement("div",{className:"react-box"},r.a.createElement("img",{src:c.a,className:"react-box__icon",alt:"Rock"}),r.a.createElement("span",{className:"react-box__info"},n.rocksTotal))),r.a.createElement("img",{src:n.avatar,className:"dest-box__photo",alt:"Destination photo"}),r.a.createElement("div",{className:"dest-box__info"},r.a.createElement("h4",{className:"dest-box-info__heading"},n.name),r.a.createElement("div",{className:"dest-box-info__address"},r.a.createElement("img",{src:u.a,className:"dest-box-info__address-icon",alt:"Location"}),r.a.createElement("span",{className:"dest-box-info__address-info"},n.address)),r.a.createElement(a.b,{to:o,className:"dest-box-info__btn"},r.a.createElement("div",{className:"btn-arr btn-arr--right"},"Know more ",r.a.createElement("span",{className:"btn-arr--yellow"},"→")," "))))}}])&&b(t.prototype,n),o&&b(t,o),f}(o.Component))}}]);