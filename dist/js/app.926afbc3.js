(function(t){function e(e){for(var r,c,o=e[0],s=e[1],l=e[2],u=0,f=[];u<o.length;u++)c=o[u],Object.prototype.hasOwnProperty.call(a,c)&&a[c]&&f.push(a[c][0]),a[c]=0;for(r in s)Object.prototype.hasOwnProperty.call(s,r)&&(t[r]=s[r]);d&&d(e);while(f.length)f.shift()();return i.push.apply(i,l||[]),n()}function n(){for(var t,e=0;e<i.length;e++){for(var n=i[e],r=!0,o=1;o<n.length;o++){var s=n[o];0!==a[s]&&(r=!1)}r&&(i.splice(e--,1),t=c(c.s=n[0]))}return t}var r={},a={app:0},i=[];function c(e){if(r[e])return r[e].exports;var n=r[e]={i:e,l:!1,exports:{}};return t[e].call(n.exports,n,n.exports,c),n.l=!0,n.exports}c.m=t,c.c=r,c.d=function(t,e,n){c.o(t,e)||Object.defineProperty(t,e,{enumerable:!0,get:n})},c.r=function(t){"undefined"!==typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(t,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(t,"__esModule",{value:!0})},c.t=function(t,e){if(1&e&&(t=c(t)),8&e)return t;if(4&e&&"object"===typeof t&&t&&t.__esModule)return t;var n=Object.create(null);if(c.r(n),Object.defineProperty(n,"default",{enumerable:!0,value:t}),2&e&&"string"!=typeof t)for(var r in t)c.d(n,r,function(e){return t[e]}.bind(null,r));return n},c.n=function(t){var e=t&&t.__esModule?function(){return t["default"]}:function(){return t};return c.d(e,"a",e),e},c.o=function(t,e){return Object.prototype.hasOwnProperty.call(t,e)},c.p="/";var o=window["webpackJsonp"]=window["webpackJsonp"]||[],s=o.push.bind(o);o.push=e,o=o.slice();for(var l=0;l<o.length;l++)e(o[l]);var d=s;i.push([0,"chunk-vendors"]),n()})({0:function(t,e,n){t.exports=n("56d7")},"56d7":function(t,e,n){"use strict";n.r(e);n("e260"),n("e6cf"),n("cca6"),n("a79d");var r=n("2b0e"),a=function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("v-app",[n("v-app-bar",{staticClass:"primary",attrs:{app:"",dark:""}},[n("h1",[n("span",{staticClass:"font-weight-light"},[t._v("EVENT")]),n("span",{staticClass:"font-weight-regular grey--text text--darken-4"},[t._v("PLANNER")])])]),n("v-content",{staticClass:"white"},[n("Calendar"),n("EventForm"),n("Notifications")],1)],1)},i=[],c=function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("v-container",{staticClass:"pa-4",attrs:{width:"80%"}},[n("v-row",{staticClass:"fill-height"},[n("v-col",[n("v-sheet",{staticClass:"elevation-4",attrs:{height:"64"}},[n("v-toolbar",{attrs:{flat:"",color:"white"}},[n("v-btn",{staticClass:"mr-4",attrs:{color:"primary",text:""},on:{click:t.setToday}},[t._v(" Today ")]),n("v-btn",{attrs:{fab:"",text:"",small:""},on:{click:t.prev}},[n("v-icon",{attrs:{small:""}},[t._v("mdi-chevron-left")])],1),n("v-btn",{attrs:{fab:"",text:"",small:""},on:{click:t.next}},[n("v-icon",{attrs:{small:""}},[t._v("mdi-chevron-right")])],1),n("v-toolbar-title",[t._v(t._s(t.title))]),n("v-spacer"),n("v-menu",{attrs:{bottom:"",right:""},scopedSlots:t._u([{key:"activator",fn:function(e){var r=e.on;return[n("v-btn",t._g({attrs:{text:"",color:"primary"}},r),[n("span",[t._v(t._s(t.typeToLabel[t.type]))]),n("v-icon",{attrs:{right:""}},[t._v("mdi-menu-down")])],1)]}}])},[n("v-list",[n("v-list-item",{on:{click:function(e){t.type="day"}}},[n("v-list-item-title",[t._v("Day")])],1),n("v-list-item",{on:{click:function(e){t.type="week"}}},[n("v-list-item-title",[t._v("Week")])],1),n("v-list-item",{on:{click:function(e){t.type="month"}}},[n("v-list-item-title",[t._v("Month")])],1)],1)],1)],1)],1),n("v-sheet",{attrs:{height:"750px"}},[n("v-calendar",{ref:"calendar",attrs:{color:"primary",events:t.events,"event-color":t.getEventColor,"event-margin-bottom":3,now:t.today,type:t.type,"short-intervals":!0},on:{moved:t.sendDate,"click:day":t.openFormAndSendDay,"click:event":t.showEvent,"click:more":t.viewDay,"click:date":t.viewDay,"click:interval":t.sendDateAndTime,"click:time":t.sendDateAndTime,change:t.updateRange},model:{value:t.focus,callback:function(e){t.focus=e},expression:"focus"}}),n("v-menu",{attrs:{"close-on-content-click":!1,activator:t.selectedElement,"full-width":"","offset-x":""},model:{value:t.selectedOpen,callback:function(e){t.selectedOpen=e},expression:"selectedOpen"}},[n("v-card",{attrs:{color:"grey lighten-4","min-width":"200px",flat:""}},[n("v-toolbar",{attrs:{color:t.selectedEvent.color,dark:""}},[n("v-btn",{attrs:{icon:""},on:{click:function(e){return t.editEvent(t.selectedEvent)}}},[n("v-icon",[t._v("mdi-pencil")])],1),n("v-toolbar-title",{domProps:{innerHTML:t._s(t.selectedEvent.name)}}),n("v-spacer"),n("v-btn",{attrs:{icon:""},on:{click:function(e){t.deleteDialog=!0}}},[n("v-icon",[t._v("mdi-delete")])],1),n("v-dialog",{attrs:{width:"80%"},model:{value:t.deleteDialog,callback:function(e){t.deleteDialog=e},expression:"deleteDialog"}},[t.deleteNonRecurring?n("v-card",[n("v-card-title",[t._v("Delete "+t._s(t.selectedEvent.name)+" ?")]),n("v-card-text",[t._v("Are you sure you want to delete?")]),n("v-card",{staticClass:"d-flex ma-0 pa-3",attrs:{flat:""}},[n("v-btn",{attrs:{text:"",color:"primary"},on:{click:function(e){t.deleteDialog=!1}}},[t._v(" Close ")]),n("v-spacer"),n("v-btn",{attrs:{text:"",color:"primary"},on:{click:function(e){return t.deleteSelectedEvent(t.selectedEvent)}}},[t._v(" Delete ")])],1)],1):n("v-card",[n("v-card-title",[t._v("You're deleting a "+t._s(t.selectedEvent.type)+" recurring Event "+t._s(t.selectedEvent.name))]),n("v-container",{staticClass:"d-flex px-5"},[n("v-card-text",[t._v("Do you want to delete all sibling Events too?")]),n("v-checkbox",{staticClass:"text-no-wrap",attrs:{color:"primary",label:"Delete all"},model:{value:t.deleteCheckbox,callback:function(e){t.deleteCheckbox=e},expression:"deleteCheckbox"}})],1),n("v-card",{staticClass:"d-flex ma-0 pa-3",attrs:{flat:""}},[n("v-btn",{attrs:{text:"",color:"primary"},on:{click:function(e){t.deleteDialog=!1}}},[t._v(" Close ")]),n("v-spacer"),n("v-btn",{attrs:{text:"",color:"primary"},on:{click:function(e){return t.deleteSelectedRecurringEvent(t.selectedEvent)}}},[t._v(" Delete ")])],1)],1)],1)],1),n("v-card-text",[n("span",{domProps:{innerHTML:t._s(t.selectedEvent.details)}})]),n("v-card-actions",[n("v-btn",{attrs:{text:"",color:"secondary"},on:{click:function(e){t.selectedOpen=!1}}},[t._v(" Cancel ")])],1)],1)],1)],1)],1)],1)],1)},o=[],s=(n("99af"),n("4d90"),n("a4d3"),n("4de4"),n("caad"),n("a15b"),n("d81d"),n("e439"),n("dbb4"),n("b64b"),n("ac1f"),n("2532"),n("1276"),n("159b"),n("3835")),l=n("ade3");n("3e8f");function d(t,e){var n=Object.keys(t);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(t);e&&(r=r.filter((function(e){return Object.getOwnPropertyDescriptor(t,e).enumerable}))),n.push.apply(n,r)}return n}function u(t){for(var e=1;e<arguments.length;e++){var n=null!=arguments[e]?arguments[e]:{};e%2?d(Object(n),!0).forEach((function(e){Object(l["a"])(t,e,n[e])})):Object.getOwnPropertyDescriptors?Object.defineProperties(t,Object.getOwnPropertyDescriptors(n)):d(Object(n)).forEach((function(e){Object.defineProperty(t,e,Object.getOwnPropertyDescriptor(n,e))}))}return t}var f,h=[],v=function(){return h},p=function(t){t.id?b(t):m(t)},m=function(t){var e=O(t);h.push(e)},b=function(t){h=h.filter((function(e){return e.id!==t.id})),h.push(t)},g=function(t){dt.updateOneEvent(t);var e=[];h=h.filter((function(n){if(t.recurringId===n.recurringId){var r=u({},t,{start:n.start,end:n.end,id:n.id});return e.push(r),!1}return!0})),h=h.concat(e)},y=function(t){D(t,"recurringId"),dt.deleteEvent(t)},D=function(t,e){h=h.filter((function(n){return n[e]!==t[e]}))},O=function(t){return u({},t,{id:k(h,"id")+1})},k=function(t,e){return t.reduce((function(t,n){return t[e]>=n[e]?t[e]:n[e]}),0)},E=function(t){return h.filter((function(e){return x(e,t)}))},x=function(t,e){var n=t.start.split("-"),r=Object(s["a"])(n,2),a=r[0],i=r[1],c=e.split("-"),o=Object(s["a"])(c,2),l=o[0],d=o[1];return a==l&&i==d},T={addOne:m,getAll:v,addOrUpdate:p,deleteEvent:D,getHighestAttributeInArray:k,getAllEventsInMonth:E,updateRecurringEventsinStatic:g,deleteStaticEventsAndRecurring:y},w=function(t,e){var n=t.split(" ")[0],r=S(n);return r.setDate(r.getDate()+e+1),j(r)},S=function(t){var e=t.split("-"),n=Object(s["a"])(e,3),r=n[0],a=n[1],i=n[2],c=new Date(r,+a-1,i);return c},j=function(t){return t.toISOString().substr(0,10)},C=function(t,e){var n=t.split("-"),r=Object(s["a"])(n,2),a=r[0],i=r[1],c=e.split("-"),o=Object(s["a"])(c,2),l=o[0],d=o[1];return!(a>l)&&!(i>d)},_=function(t,e){var n=e.split("-"),r=Object(s["a"])(n,2),a=r[0],i=r[1],c=1;for(c=1;new Date(a,+i-1,c).getDay()!==t;c++);return[a,i,c].join("-")},I=function(t){return S(t).getDay()},V=function(t){var e=I(t),n=t.split("-"),r=Object(s["a"])(n,3),a=r[0],i=r[1],c=(r[2],0),o="".concat(a,"-").concat(i,"-01");while(S(o)<=S(t))I(o)===e&&c++,o=P(o);return[c,e]},A=function(t,e,n){var r=0,a=n;while(t!==r){if(e===S(a).getDay()&&(r++,r===t))break;a=P(a)}return a},P=function(t){return w(t,1)},F=function(t){return S(t).getDay()>0&&S(t).getDay()<6},W=function t(e){var n=P(e);return F(n)?n:t(n)},$=function(t,e){var n=S(e),r=S(t),a=Math.abs(r-n)/1e3,i=Math.floor(a/86400);return i},M=function(t){var e=t.split("-"),n=Object(s["a"])(e,3),r=(n[0],n[1]),a=n[2],i=["","January","February","March","April","May","June","July","August","October","September","November","December"];return"".concat(i[r]," ").concat(a+R(a))},R=function(t){return t>3&&t<21?"th":["th","st","nd","rd","th","th","th","th","th","th"][t%10]},N=(f={addDaysToDate:w,doesEventStartBeforeDate:C,getWeekday:I,getFirstWeekdayOfMonth:_},Object(l["a"])(f,"getWeekday",I),Object(l["a"])(f,"getNextWeekday",W),Object(l["a"])(f,"getDifference",$),Object(l["a"])(f,"getNthWeekday",V),Object(l["a"])(f,"getNthWeekdayOfMonth",A),Object(l["a"])(f,"getMonthAndDayInWords",M),f);function q(t,e){var n=Object.keys(t);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(t);e&&(r=r.filter((function(e){return Object.getOwnPropertyDescriptor(t,e).enumerable}))),n.push.apply(n,r)}return n}function z(t){for(var e=1;e<arguments.length;e++){var n=null!=arguments[e]?arguments[e]:{};e%2?q(Object(n),!0).forEach((function(e){Object(l["a"])(t,e,n[e])})):Object.getOwnPropertyDescriptors?Object.defineProperties(t,Object.getOwnPropertyDescriptors(n)):q(Object(n)).forEach((function(e){Object.defineProperty(t,e,Object.getOwnPropertyDescriptor(n,e))}))}return t}var L=[],U=function(t){var e=B(t);L.push(e)},B=function(t){return z({},t,{recurringId:T.getHighestAttributeInArray(L,"recurringId")+1})},J=function(t){L=L.filter((function(e){return t.recurringId!==e.recurringId})),L.push(t)},H=function(t){var e;L=L.filter((function(n){return t.recurringId!==n.recurringId||(e=z({},t,{start:n.start,end:n.end}),!1)})),L.push(e)},Y=function(t){L=L.filter((function(e){return t.recurringId!==e.recurringId}))},Z=function(t){var e=lt(t);G(t),G(e)},G=function(t){var e=K(t);e&&e.forEach((function(e){var n=X(e),r=e;while(ct(n.start,t))T.addOne(n),r=n,n=X(n);J(r)}))},K=function(t){return L.filter((function(e){return!Q(e,t)}))},Q=function(t,e){var n=T.getAllEventsInMonth(e).map((function(t){return t.recurringId})).includes(t.recurringId);return n},X=function(t){var e={};switch(t.type){case"daily":case"weekly":case"custom-days":e=tt(t);break;case"monthly":e=nt(t);break;case"annualy":if(t.frequenzy){e=t;for(var n=0;n<t.frequenzy;n++)e=et(e)}else e=et(t);break;case"weekdays":e=rt(t);break}var r=z({},t,{},at(e,t));return
//# sourceMappingURL=app.926afbc3.js.map