(function(t){function e(e){for(var r,c,o=e[0],s=e[1],l=e[2],u=0,f=[];u<o.length;u++)c=o[u],Object.prototype.hasOwnProperty.call(a,c)&&a[c]&&f.push(a[c][0]),a[c]=0;for(r in s)Object.prototype.hasOwnProperty.call(s,r)&&(t[r]=s[r]);d&&d(e);while(f.length)f.shift()();return i.push.apply(i,l||[]),n()}function n(){for(var t,e=0;e<i.length;e++){for(var n=i[e],r=!0,o=1;o<n.length;o++){var s=n[o];0!==a[s]&&(r=!1)}r&&(i.splice(e--,1),t=c(c.s=n[0]))}return t}var r={},a={app:0},i=[];function c(e){if(r[e])return r[e].exports;var n=r[e]={i:e,l:!1,exports:{}};return t[e].call(n.exports,n,n.exports,c),n.l=!0,n.exports}c.m=t,c.c=r,c.d=function(t,e,n){c.o(t,e)||Object.defineProperty(t,e,{enumerable:!0,get:n})},c.r=function(t){"undefined"!==typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(t,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(t,"__esModule",{value:!0})},c.t=function(t,e){if(1&e&&(t=c(t)),8&e)return t;if(4&e&&"object"===typeof t&&t&&t.__esModule)return t;var n=Object.create(null);if(c.r(n),Object.defineProperty(n,"default",{enumerable:!0,value:t}),2&e&&"string"!=typeof t)for(var r in t)c.d(n,r,function(e){return t[e]}.bind(null,r));return n},c.n=function(t){var e=t&&t.__esModule?function(){return t["default"]}:function(){return t};return c.d(e,"a",e),e},c.o=function(t,e){return Object.prototype.hasOwnProperty.call(t,e)},c.p="/";var o=window["webpackJsonp"]=window["webpackJsonp"]||[],s=o.push.bind(o);o.push=e,o=o.slice();for(var l=0;l<o.length;l++)e(o[l]);var d=s;i.push([0,"chunk-vendors"]),n()})({0:function(t,e,n){t.exports=n("56d7")},"56d7":function(t,e,n){"use strict";n.r(e);n("e260"),n("e6cf"),n("cca6"),n("a79d");var r=n("2b0e"),a=function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("v-app",[n("v-app-bar",{staticClass:"primary",attrs:{app:"",dark:""}},[n("h1",[n("span",{staticClass:"font-weight-light"},[t._v("EVENT")]),n("span",{staticClass:"font-weight-regular grey--text text--darken-4"},[t._v("PLANNER")])])]),n("v-content",{staticClass:"white"},[n("Calendar"),n("EventForm"),n("Notifications")],1)],1)},i=[],c=function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("v-container",{staticClass:"pa-4",attrs:{width:"80%"}},[n("v-row",{staticClass:"fill-height"},[n("v-col",[n("v-sheet",{staticClass:"elevation-4",attrs:{height:"64"}},[n("v-toolbar",{attrs:{flat:"",color:"white"}},[n("v-btn",{staticClass:"mr-4",attrs:{color:"primary",text:""},on:{click:t.setToday}},[t._v(" Today ")]),n("v-btn",{attrs:{fab:"",text:"",small:""},on:{click:t.prev}},[n("v-icon",{attrs:{small:""}},[t._v("mdi-chevron-left")])],1),n("v-btn",{attrs:{fab:"",text:"",small:""},on:{click:t.next}},[n("v-icon",{attrs:{small:""}},[t._v("mdi-chevron-right")])],1),n("v-toolbar-title",[t._v(t._s(t.title))]),n("v-spacer"),n("v-menu",{attrs:{bottom:"",right:""},scopedSlots:t._u([{key:"activator",fn:function(e){var r=e.on;return[n("v-btn",t._g({attrs:{text:"",color:"primary"}},r),[n("span",[t._v(t._s(t.typeToLabel[t.type]))]),n("v-icon",{attrs:{right:""}},[t._v("mdi-menu-down")])],1)]}}])},[n("v-list",[n("v-list-item",{on:{click:function(e){t.type="day"}}},[n("v-list-item-title",[t._v("Day")])],1),n("v-list-item",{on:{click:function(e){t.type="week"}}},[n("v-list-item-title",[t._v("Week")])],1),n("v-list-item",{on:{click:function(e){t.type="month"}}},[n("v-list-item-title",[t._v("Month")])],1)],1)],1)],1)],1),n("v-sheet",{attrs:{height:"750px"}},[n("v-calendar",{ref:"calendar",attrs:{color:"primary",events:t.events,"event-color":t.getEventColor,"event-margin-bottom":3,now:t.today,type:t.type,"short-intervals":!0},on:{moved:t.sendDate,"click:day":t.openFormAndSendDay,"click:event":t.showEvent,"click:more":t.viewDay,"click:date":t.viewDay,"click:interval":t.sendDateAndTime,"click:time":t.sendDateAndTime,change:t.updateRange},model:{value:t.focus,callback:function(e){t.focus=e},expression:"focus"}}),n("v-menu",{attrs:{"close-on-content-click":!1,activator:t.selectedElement,"full-width":"","offset-x":""},model:{value:t.selectedOpen,callback:function(e){t.selectedOpen=e},expression:"selectedOpen"}},[n("v-card",{attrs:{color:"grey lighten-4","min-width":"200px",flat:""}},[n("v-toolbar",{attrs:{color:t.selectedEvent.color,dark:""}},[n("v-btn",{attrs:{icon:""},on:{click:function(e){return t.editEvent(t.selectedEvent)}}},[n("v-icon",[t._v("mdi-pencil")])],1),n("v-toolbar-title",{domProps:{innerHTML:t._s(t.selectedEvent.name)}}),n("v-spacer"),n("v-btn",{attrs:{icon:""},on:{click:function(e){t.deleteDialog=!0}}},[n("v-icon",[t._v("mdi-delete")])],1),n("v-dialog",{attrs:{width:"80%"},model:{value:t.deleteDialog,callback:function(e){t.deleteDialog=e},expression:"deleteDialog"}},[t.deleteNonRecurring?n("v-card",[n("v-card-title",[t._v("Delete "+t._s(t.selectedEvent.name)+" ?")]),n("v-card-text",[t._v("Are you sure you want to delete?")]),n("v-card",{staticClass:"d-flex ma-0 pa-3",attrs:{flat:""}},[n("v-btn",{attrs:{text:"",color:"primary"},on:{click:function(e){t.deleteDialog=!1}}},[t._v(" Close ")]),n("v-spacer"),n("v-btn",{attrs:{text:"",color:"primary"},on:{click:function(e){return t.deleteSelectedEvent(t.selectedEvent)}}},[t._v(" Delete ")])],1)],1):n("v-card",[n("v-card-title",[t._v("You're deleting a "+t._s(t.selectedEvent.type)+" recurring Event "+t._s(t.selectedEvent.name))]),n("v-container",{staticClass:"d-flex px-5"},[n("v-card-text",[t._v("Do you want to delete all sibling Events too?")]),n("v-checkbox",{staticClass:"text-no-wrap",attrs:{color:"primary",label:"Delete all"},model:{value:t.deleteCheckbox,callback:function(e){t.deleteCheckbox=e},expression:"deleteCheckbox"}})],1),n("v-card",{staticClass:"d-flex ma-0 pa-3",attrs:{flat:""}},[n("v-btn",{attrs:{text:"",color:"primary"},on:{click:function(e){t.deleteDialog=!1}}},[t._v(" Close ")]),n("v-spacer"),n("v-btn",{attrs:{text:"",color:"primary"},on:{click:function(e){return t.deleteSelectedRecurringEvent(t.selectedEvent)}}},[t._v(" Delete ")])],1)],1)],1)],1),n("v-card-text",[n("span",{domProps:{innerHTML:t._s(t.selectedEvent.details)}})]),n("v-card-actions",[n("v-btn",{attrs:{text:"",color:"secondary"},on:{click:function(e){t.selectedOpen=!1}}},[t._v(" Cancel ")])],1)],1)],1)],1)],1)],1)],1)},o=[],s=(n("99af"),n("4d90"),n("a4d3"),n("4de4"),n("caad"),n("a15b"),n("d81d"),n("e439"),n("dbb4"),n("b64b"),n("ac1f"),n("2532"),n("1276"),n("159b"),n("3835")),l=n("ade3");n("3e8f");function d(t,e){var n=Object.keys(t);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(t);e&&(r=r.filter((function(e){return Object.getOwnPropertyDescriptor(t,e).enumerable}))),n.push.apply(n,r)}return n}function u(t){for(var e=1;e<arguments.length;e++){var n=null!=arguments[e]?arguments[e]:{};e%2?d(Object(n),!0).forEach((function(e){Object(l["a"])(t,e,n[e])})):Object.getOwnPropertyDescriptors?Object.defineProperties(t,Object.getOwnPropertyDescriptors(n)):d(Object(n)).forEach((function(e){Object.defineProperty(t,e,Object.getOwnPropertyDescriptor(n,e))}))}return t}var f,h=[],v=function(){return h},p=function(t){t.id?b(t):m(t)},m=function(t){var e=O(t);h.push(e)},b=function(t){h=h.filter((function(e){return e.id!==t.id})),h.push(t)},g=function(t){dt.updateOneEvent(t);var e=[];h=h.filter((function(n){if(t.recurringId===n.recurringId){var r=u({},t,{start:n.start,end:n.end,id:n.id});return e.push(r),!1}return!0})),h=h.concat(e)},y=function(t){D(t,"recurringId"),dt.deleteEvent(t)},D=function(t,e){h=h.filter((function(n){return n[e]!==t[e]}))},O=function(t){return u({},t,{id:k(h,"id")+1})},k=function(t,e){return t.reduce((function(t,n){return t[e]>=n[e]?t[e]:n[e]}),0)},E=function(t){return h.filter((function(e){return x(e,t)}))},x=function(t,e){var n=t.start.split("-"),r=Object(s["a"])(n,2),a=r[0],i=r[1],c=e.split("-"),o=Object(s["a"])(c,2),l=o[0],d=o[1];return a==l&&i==d},T={addOne:m,getAll:v,addOrUpdate:p,deleteEvent:D,getHighestAttributeInArray:k,getAllEventsInMonth:E,updateRecurringEventsinStatic:g,deleteStaticEventsAndRecurring:y},w=function(t,e){var n=t.split(" ")[0],r=S(n);return r.setDate(r.getDate()+e+1),j(r)},S=function(t){var e=t.split("-"),n=Object(s["a"])(e,3),r=n[0],a=n[1],i=n[2],c=new Date(r,+a-1,i);return c},j=function(t){return t.toISOString().substr(0,10)},C=function(t,e){var n=t.split("-"),r=Object(s["a"])(n,2),a=r[0],i=r[1],c=e.split("-"),o=Object(s["a"])(c,2),l=o[0],d=o[1];return!(a>l)&&!(i>d)},_=function(t,e){var n=e.split("-"),r=Object(s["a"])(n,2),a=r[0],i=r[1],c=1;for(c=1;new Date(a,+i-1,c).getDay()!==t;c++);return[a,i,c].join("-")},I=function(t){return S(t).getDay()},V=function(t){var e=I(t),n=t.split("-"),r=Object(s["a"])(n,3),a=r[0],i=r[1],c=(r[2],0),o="".concat(a,"-").concat(i,"-01");while(S(o)<=S(t))I(o)===e&&c++,o=P(o);return[c,e]},A=function(t,e,n){var r=0,a=n;while(t!==r){if(e===S(a).getDay()&&(r++,r===t))break;a=P(a)}return a},P=function(t){return w(t,1)},F=function(t){return S(t).getDay()>0&&S(t).getDay()<6},W=function t(e){var n=P(e);return F(n)?n:t(n)},$=function(t,e){var n=S(e),r=S(t),a=Math.abs(r-n)/1e3,i=Math.floor(a/86400);return i},M=function(t){var e=t.split("-"),n=Object(s["a"])(e,3),r=(n[0],n[1]),a=n[2],i=["","January","February","March","April","May","June","July","August","October","September","November","December"];return"".concat(i[r]," ").concat(a+R(a))},R=function(t){return t>3&&t<21?"th":["th","st","nd","rd","th","th","th","th","th","th"][t%10]},N=(f={addDaysToDate:w,doesEventStartBeforeDate:C,getWeekday:I,getFirstWeekdayOfMonth:_},Object(l["a"])(f,"getWeekday",I),Object(l["a"])(f,"getNextWeekday",W),Object(l["a"])(f,"getDifference",$),Object(l["a"])(f,"getNthWeekday",V),Object(l["a"])(f,"getNthWeekdayOfMonth",A),Object(l["a"])(f,"getMonthAndDayInWords",M),f);function q(t,e){var n=Object.keys(t);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(t);e&&(r=r.filter((function(e){return Object.getOwnPropertyDescriptor(t,e).enumerable}))),n.push.apply(n,r)}return n}function z(t){for(var e=1;e<arguments.length;e++){var n=null!=arguments[e]?arguments[e]:{};e%2?q(Object(n),!0).forEach((function(e){Object(l["a"])(t,e,n[e])})):Object.getOwnPropertyDescriptors?Object.defineProperties(t,Object.getOwnPropertyDescriptors(n)):q(Object(n)).forEach((function(e){Object.defineProperty(t,e,Object.getOwnPropertyDescriptor(n,e))}))}return t}var L=[],U=function(t){var e=B(t);L.push(e)},B=function(t){return z({},t,{recurringId:T.getHighestAttributeInArray(L,"recurringId")+1})},J=function(t){L=L.filter((function(e){return t.recurringId!==e.recurringId})),L.push(t)},H=function(t){var e;L=L.filter((function(n){return t.recurringId!==n.recurringId||(e=z({},t,{start:n.start,end:n.end}),!1)})),L.push(e)},Y=function(t){L=L.filter((function(e){return t.recurringId!==e.recurringId}))},Z=function(t){var e=lt(t);G(t),G(e)},G=function(t){var e=K(t);e&&e.forEach((function(e){var n=X(e),r=e;while(ct(n.start,t))T.addOne(n),r=n,n=X(n);J(r)}))},K=function(t){return L.filter((function(e){return!Q(e,t)}))},Q=function(t,e){var n=T.getAllEventsInMonth(e).map((function(t){return t.recurringId})).includes(t.recurringId);return n},X=function(t){var e={};switch(t.type){case"daily":case"weekly":case"custom-days":e=tt(t);break;case"monthly":e=nt(t);break;case"annualy":if(t.frequenzy){e=t;for(var n=0;n<t.frequenzy;n++)e=et(e)}else e=et(t);break;case"weekdays":e=rt(t);break}var r=z({},t,{},at(e,t));return console.log("next Event i am adding",r),r},tt=function(t){return{start:N.addDaysToDate(t.start,t.frequenzy),end:N.addDaysToDate(t.end,t.frequenzy)}},et=function(t){var e=t.start.split(" ")[0],n=t.start.split(" ")[0];return{start:ot(e),end:ot(n)}},nt=function(t){var e=N.getNthWeekday(t.start),n=Object(s["a"])(e,2),r=n[0],a=n[1],i=lt(t.start),c=N.getNthWeekdayOfMonth(r,a,i),o=N.addDaysToDate(c,st(t));return{start:c,end:o}},rt=function(t){return{start:N.getNextWeekday(t.start),end:N.getNextWeekday(t.end)}},at=function(t,e){return{start:t.start+it(e.start),end:t.end+it(e.end)}},it=function(t){var e=t.split(" ")[1];return e?" "+e:""},ct=function(t,e){return N.doesEventStartBeforeDate(t,e)},ot=function(t){var e=t.split("-"),n=Object(s["a"])(e,3),r=n[0],a=n[1],i=n[2];return[+r+1,a,i].join("-")},st=function(t){var e=t.start.split(" "),n=Object(s["a"])(e,1),r=n[0],a=t.end.split(" "),i=Object(s["a"])(a,1),c=i[0];return r===c?0:N.getDifference(c,r)},lt=function(t){var e=t.split("-"),n=Object(s["a"])(e,3),r=n[0],a=n[1];n[2];return+a+1<13?"".concat(r,"-").concat(+a+1,"-01"):"".concat(+r+1,"-01-01")},dt={applyRecurringEventsUntilEndOfNextMonth:Z,addOne:U,updateOneEvent:H,updateEvent:J,deleteEvent:Y},ut={data:function(){return{deleteDialog:!1,today:(new Date).toISOString().substr(0,10),focus:(new Date).toISOString().substr(0,10),type:"month",typeToLabel:{month:"Month",week:"Week",day:"Day"},start:null,end:null,selectedEvent:{},selectedElement:null,selectedOpen:!1,events:[],deleteCheckbox:!0}},computed:{title:function(){var t=this.start,e=this.end;if(!t||!e)return"";var n=this.monthFormatter(t),r=this.monthFormatter(e),a=n===r?"":r,i=t.year,c=e.year,o=i===c?"":c,s=t.day+this.nth(t.day),l=e.day+this.nth(e.day);switch(this.type){case"month":return"".concat(n," ").concat(i);case"week":return"".concat(n," ").concat(s," ").concat(i," - ").concat(a," ").concat(l," ").concat(o);case"day":return"".concat(n," ").concat(s," ").concat(i)}return""},deleteNonRecurring:function(){return!this.selectedEvent.recurringId},monthFormatter:function(){return this.$refs.calendar.getFormatter({timeZone:"UTC",month:"long"})}},mounted:function(){this.$refs.calendar.checkChange()},methods:{openFormAndSendDay:function(t){this.sendDate(t),xe.$emit("openForm")},deleteSelectedEvent:function(t){T.deleteEvent(t,"id"),this.deleteDialog=!1,this.selectedOpen=!1,this.refreshEvents()},deleteSelectedRecurringEvent:function(t){this.deleteCheckbox?T.deleteStaticEventsAndRecurring(t):T.deleteEvent(t,"id"),this.deleteDialog=!1,this.selectedOpen=!1,this.refreshEvents()},editEvent:function(t){xe.$emit("editEvent",t)},sendDateAndTime:function(t){this.sendDate(t);var e="".concat(String(t.hour).padStart(2,"0"),":00");xe.$emit("sendSelectedTime Start Time",e),xe.$emit("openForm")},sendDate:function(t){xe.$emit("sendSelectedDate",t.date)},refreshEvents:function(){this.events=T.getAll()},viewDay:function(t){this.focus=t.date,this.type="day",xe.$emit("sendSelectedDate",t.date)},getEventColor:function(t){return t.color},setToday:function(){this.focus=this.today},prev:function(){this.$refs.calendar.prev()},next:function(){this.$refs.calendar.next()},showEvent:function(t){var e=this,n=t.nativeEvent,r=t.event,a=function(){e.selectedEvent=r,e.selectedElement=n.target,setTimeout((function(){return e.selectedOpen=!0}),10)};this.selectedOpen?(this.selectedOpen=!1,setTimeout(a,10)):a(),n.stopPropagation()},updateRange:function(t){var e=t.start,n=t.end;this.start=e,this.end=n,dt.applyRecurringEventsUntilEndOfNextMonth(e.date)},nth:function(t){return t>3&&t<21?"th":["th","st","nd","rd","th","th","th","th","th","th"][t%10]}},created:function(){var t=this;this.refreshEvents(),xe.$on("refreshEvents",(function(){return t.refreshEvents()}))},watch:{focus:function(){xe.$emit("sendSelectedDate",this.focus)}}},ft=ut,ht=n("2877"),vt=n("6544"),pt=n.n(vt),mt=n("8336"),bt=n("a4f6"),gt=n("b0af"),yt=n("99d9"),Dt=n("ac7c"),Ot=n("62ad"),kt=n("a523"),Et=n("169a"),xt=n("132d"),Tt=n("8860"),wt=n("da13"),St=n("5d23"),jt=n("e449"),Ct=n("0fd9"),_t=n("8dd9"),It=n("2fa4"),Vt=n("71d9"),At=n("2a7f"),Pt=Object(ht["a"])(ft,c,o,!1,null,null,null),Ft=Pt.exports;pt()(Pt,{VBtn:mt["a"],VCalendar:bt["a"],VCard:gt["a"],VCardActions:yt["a"],VCardText:yt["b"],VCardTitle:yt["c"],VCheckbox:Dt["a"],VCol:Ot["a"],VContainer:kt["a"],VDialog:Et["a"],VIcon:xt["a"],VList:Tt["a"],VListItem:wt["a"],VListItemTitle:St["b"],VMenu:jt["a"],VRow:Ct["a"],VSheet:_t["a"],VSpacer:It["a"],VToolbar:Vt["a"],VToolbarTitle:At["a"]});var Wt=function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("v-row",{attrs:{justify:"end"}},[n("v-btn",{attrs:{right:"",bottom:"",fixed:"",app:"",fab:"","x-large":"",color:"primary",dark:""},on:{click:function(e){t.dialog=!0}}},[n("v-icon",{attrs:{"x-large":""}},[t._v(" mdi-plus ")])],1),n("v-dialog",{attrs:{width:"80%",fullscreen:t.$vuetify.breakpoint.xsOnly},on:{"click:outside":t.clearForm},model:{value:t.dialog,callback:function(e){t.dialog=e},expression:"dialog"}},[n("v-card",{staticClass:"pa-2"},[n("v-form",{ref:"form",model:{value:t.valid,callback:function(e){t.valid=e},expression:"valid"}},[n("v-container",{staticClass:"ms-auto"},[n("v-card-title",[n("span",{staticClass:"headline"},[t._v(t._s(t.formTitle))])]),n("v-text-field",{attrs:{dense:"",label:"Name",outlined:"",required:""},model:{value:t.nameInput,callback:function(e){t.nameInput=e},expression:"nameInput"}}),n("v-textarea",{attrs:{dense:"",label:"Description",outlined:"",clearable:""},model:{value:t.detailsInput,callback:function(e){t.detailsInput=e},expression:"detailsInput"}})],1),n("v-container",[n("v-row",[n("v-col",[n("DatePicker",{attrs:{"default-date-start":t.startDate,"default-date-end":t.endDate,label:"Event Duration"}})],1),n("v-col",[n("v-select",{attrs:{items:t.recurringOptionsWithSelectedDate,dense:"",outlined:"",label:"Recurrence",disabled:t.isEditing,"prepend-icon":"mdi-calendar-repeat"},model:{value:t.recurringOptionSelected,callback:function(e){t.recurringOptionSelected=e},expression:"recurringOptionSelected"}})],1)],1)],1),n("v-divider",{staticClass:"mb-7"}),n("v-container",[n("v-row",[n("v-col",[n("TimePicker",{attrs:{"default-time":t.startTime,label:"Start Time"}})],1),n("v-col",[n("TimePicker",{attrs:{"default-time":t.endTime,label:"End Time"}})],1)],1)],1),n("v-card-actions",[n("v-color-picker",{staticClass:"ml-5 mb-5",attrs:{value:t.color,mode:"hexa","hide-canvas":!0,"hide-mode-switch":!0,"hide-inputs":!0,"show-swatches":!0,width:"400",disabled:"",flat:"",swatches:t.colorArray},on:{"update:color":t.setColor}}),n("v-spacer"),n("v-btn",{attrs:{color:"primary",text:""},on:{click:t.clearForm}},[t._v("Close")]),n("v-btn",{attrs:{color:"primary",text:"",disabled:!t.valid},on:{click:t.submitForm}},[t._v("Save")])],1)],1)],1)],1),n("v-dialog",{attrs:{width:"80%"},model:{value:t.editDialog,callback:function(e){t.editDialog=e},expression:"editDialog"}},[n("v-card",[n("v-card-title",[t._v("You're editing "+t._s(t.currEvent.type)+" recurring Event: "+t._s(t.currEvent.name)+" ?")]),n("v-container",{staticClass:"d-flex px-5"},[n("v-card-text",[t._v("Do you want to edit all sibling Events too?")]),n("v-checkbox",{staticClass:"text-no-wrap",attrs:{color:"primary",label:"Edit all"},model:{value:t.editCheckbox,callback:function(e){t.editCheckbox=e},expression:"editCheckbox"}})],1),n("v-card",{staticClass:"d-flex ma-0 pa-3",attrs:{flat:""}},[n("v-btn",{attrs:{text:"",color:"primary"},on:{click:function(e){t.editDialog=!1}}},[t._v(" Close ")]),n("v-spacer"),n("v-btn",{attrs:{text:"",color:"primary"},on:{click:t.submitRecurringEdit}},[t._v(" Apply Changes ")])],1)],1)],1)],1)},$t=[],Mt=(n("c975"),n("b0c0"),function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("v-menu",{ref:"menu",attrs:{"close-on-content-click":t.isSecondClick,transition:"scale-transition","offset-y":"","min-width":"290px"},scopedSlots:t._u([{key:"activator",fn:function(e){var r=e.on;return[n("v-text-field",t._g({attrs:{label:t.label,"prepend-icon":"mdi-calendar",outlined:"",dense:"",readonly:""},model:{value:t.dateRangeText,callback:function(e){t.dateRangeText=e},expression:"dateRangeText"}},r))]}}]),model:{value:t.menu,callback:function(e){t.menu=e},expression:"menu"}},[n("v-date-picker",{attrs:{reactive:"",range:"","no-title":"",scrollable:""},on:{change:t.sendData},model:{value:t.dates,callback:function(e){t.dates=e},expression:"dates"}})],1)}),Rt=[],Nt={props:["label","defaultDateStart","defaultDateEnd"],data:function(){return{dates:[],menu:!1}},methods:{preventInvalidDateCombination:function(){},sendData:function(){this.isDateComboValid||this.swapDates(),xe.$emit("sendPickedDates",this.dates)},setDates:function(){this.dates=[this.defaultDateStart,this.defaultDateEnd]},formatDate:function(t){if(!t)return null;var e=t.split("-"),n=Object(s["a"])(e,3),r=n[0],a=n[1],i=n[2];return"".concat(i,"/").concat(a,"/").concat(r)},swapDates:function(){this.dates=[this.dates[1],this.dates[0]]}},watch:{dates:function(){},defaultDateStart:function(){this.setDates()},defaultDateEnd:function(){this.setDates()},menu:function(){this.menu||this.dates[0]&&!this.dates[1]&&xe.$emit("sendPickedDates",[this.dates[0],this.dates[0]])}},computed:{isDateComboValid:function(){if(this.dates[1]){var t=this.dates[0].split("-"),e=Object(s["a"])(t,3),n=e[0],r=e[1],a=e[2],i=this.dates[1].split("-"),c=Object(s["a"])(i,3),o=c[0],l=c[1],d=c[2];return!(n>o)&&(!(r>l)&&!(a>d))}return!0},dateRangeText:function(){return this.dates[0]===this.dates[1]&&(new Date).toISOString().substr(0,10)===this.dates[0]?"Today":this.dates[0]===this.dates[1]?this.formattedStartDate:[this.formattedStartDate,this.formattedEndDate].join(" ~ ")},formattedStartDate:function(){return this.formatDate(this.dates[0])},formattedEndDate:function(){return this.formatDate(this.dates[1])},isSecondClick:function(){return 2===this.dates.length}},created:function(){this.dates=[this.defaultDateStart,this.defaultDateEnd]}},qt=Nt,zt=n("2e4b"),Lt=n("8654"),Ut=Object(ht["a"])(qt,Mt,Rt,!1,null,null,null),Bt=Ut.exports;pt()(Ut,{VDatePicker:zt["a"],VMenu:jt["a"],VTextField:Lt["a"]});var Jt,Ht=function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("v-menu",{ref:"menu",attrs:{"close-on-content-click":!1,"nudge-right":40,"return-value":t.time,transition:"scale-transition","offset-y":"","max-width":"290px","min-width":"290px"},on:{"update:returnValue":function(e){t.time=e},"update:return-value":function(e){t.time=e}},scopedSlots:t._u([{key:"activator",fn:function(e){var r=e.on;return[n("v-text-field",t._g({attrs:{label:t.label,placeholder:"00:00",outlined:"",dense:"","prepend-icon":"mdi-calendar-clock",readonly:""},model:{value:t.time,callback:function(e){t.time=e},expression:"time"}},r))]}}]),model:{value:t.menu2,callback:function(e){t.menu2=e},expression:"menu2"}},[t.menu2?n("v-time-picker",{on:{"click:minute":function(e){return t.$refs.menu.save(t.time)},change:t.sendData},model:{value:t.time,callback:function(e){t.time=e},expression:"time"}}):t._e()],1)},Yt=[],Zt=(Jt={props:["label","defaultTime"],data:function(){return{time:null,menu2:!1}},watch:{clear:function(){this.time=null}},methods:{sendData:function(){xe.$emit("sendSelectedTime ".concat(this.label),this.time)}}},Object(l["a"])(Jt,"watch",{defaultTime:function(){this.time=this.defaultTime}}),Object(l["a"])(Jt,"created",(function(){this.time=this.defaultTime})),Jt),Gt=Zt,Kt=n("c964"),Qt=Object(ht["a"])(Gt,Ht,Yt,!1,null,null,null),Xt=Qt.exports;pt()(Qt,{VMenu:jt["a"],VTextField:Lt["a"],VTimePicker:Kt["b"]});var te={components:{TimePicker:Xt,DatePicker:Bt},data:function(){return{formTitle:"Add a new Event",nameInput:"",detailsInput:"",recurringOptionSelected:"Doesn't repeat",recurringOptionsToType:["none","daily","weekly","monthly","annualy","weekdays"],frequenzyForTypes:[0,1,7,0,0,0],weekdays:["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"],editDialog:!1,editCheckbox:!0,dialog:!1,selectedDate:"",startDate:"",endDate:"",startTime:null,endTime:null,color:"#F07F1D",colorArray:[["#F07F1D"],["#303030"],["#454545"],["#606060"],["#757575"],["#909090"],["#A9A9A9"]],id:void 0,recurringId:void 0}},methods:{submitRecurringEdit:function(){this.editCheckbox?T.updateRecurringEventsinStatic(this.currEvent):T.addOrUpdate(this.currEvent),this.editDialog=!1,this.clearForm(),xe.$emit("refreshEvents")},submitForm:function(){if(this.isEditing){if(this.isRepeating)return void this.openEditDialog();T.addOrUpdate(this.currEvent)}else this.isRepeating?(console.log(this.currEvent,"event i am adding"),dt.addOne(this.currEvent),dt.applyRecurringEventsUntilEndOfNextMonth(this.selectedDate),T.addOne(this.currEvent)):T.addOne(this.currEvent);this.clearForm(),xe.$emit("refreshEvents")},openEditDialog:function(){this.editDialog=!0},editEvent:function(){this.isRepeating,this.formTitle="Edit event ".concat(this.currEvent.name),this.dialog=!0},setColor:function(t){this.color=t.hex},clearForm:function(){this.dialog=!1,this.formTitle="Add a new Event",this.id=void 0,this.recurringOptionSelected="Doesn't repeat",this.resetDatePicker(),this.resetTextInputFields(),this.resetTimePickers()},resetDatePicker:function(){this.startDate=this.selectedDate,this.endDate=this.selectedDate},resetTextInputFields:function(){this.nameInput="",this.detailsInput=""},resetTimePickers:function(){this.startTime=null,this.endTime=null},setToday:function(){var t=(new Date).toISOString().substr(0,10);this.startDate=t,this.endDate=t,this.selectedDate=t}},created:function(){var t=this;this.setToday(),xe.$on("sendSelectedDate",(function(e){t.startDate=e,t.endDate=e,t.selectedDate=e})),xe.$on("sendPickedDates",(function(e){t.startDate=e[0],t.endDate=e[1]})),xe.$on("sendSelectedTime Start Time",(function(e){t.startTime=e})),xe.$on("sendSelectedTime End Time",(function(e){t.endTime=e})),xe.$on("openForm",(function(){return t.dialog=!0})),xe.$on("editEvent",(function(e){t.currEvent=e,t.editEvent()}))},watch:{selectedDate:function(){}},computed:{recurringOptionsWithSelectedDate:function(){return["Doesn't repeat","Daily","Weekly on ".concat(this.currWeekday),"Monthly on ".concat(this.currNthWeekday," ").concat(this.currWeekday),"Annually on ".concat(this.dateInWords),"Every Weekday (starting on ".concat(this.dateInWords,")")]},currWeekday:function(){return this.weekdays[N.getWeekday(this.startDate)]},currNthWeekday:function(){var t=N.getNthWeekday(this.startDate),e=Object(s["a"])(t,2),n=e[0],r=(e[1],["","first","second","third","fourth","fifth"]);return r[n]},dateInWords:function(){return N.getMonthAndDayInWords(this.startDate)},isEditing:function(){return!!this.currEvent.id},isRepeating:function(){return"none"!==this.currEvent.type},recurringType:{get:function(){var t=this.recurringOptionsWithSelectedDate.indexOf(this.recurringOptionSelected);return this.recurringOptionsToType[t]},set:function(t){var e=this.recurringOptionsToType.indexOf(t);this.recurringOptionSelected=this.recurringOptionsWithSelectedDate[e]}},frequenzy:{get:function(){var t=this.recurringOptionsWithSelectedDate.indexOf(this.recurringOptionSelected);return this.frequenzyForTypes[t]}},startTimeAutocomplete:function(){return!this.startTime&&this.endTime?" 00:00":this.startTime||this.endTime?" "+this.startTime:""},endTimeAutocomplete:function(){return this.startTime&&!this.endTime?" 23:59":this.startTime||this.endTime?" "+this.endTime:""},startDateAndTime:{get:function(){return this.startDate+this.startTimeAutocomplete},set:function(t){var e=t.split(" "),n=Object(s["a"])(e,2),r=n[0],a=n[1];this.startDate=r,a||(this.startTime=a)}},endDateAndTime:{get:function(){return this.endDate+this.endTimeAutocomplete},set:function(t){var e=t.split(" "),n=Object(s["a"])(e,2),r=n[0],a=n[1];this.endDate=r,a||(this.endTime=a)}},currEvent:{get:function(){var t={name:this.nameInput,details:this.detailsInput,start:this.startDateAndTime,end:this.endDateAndTime,id:this.id,color:this.color,type:this.recurringType,frequenzy:this.frequenzy,recurringId:this.recurringId};return t},set:function(t){this.nameInput=t.name,this.detailsInput=t.details,this.startDateAndTime=t.start,this.endDateAndTime=t.end,this.id=t.id,this.color=t.color,this.recurringType=t.type,this.recurringId=t.recurringId}}}},ee=te,ne=n("03a4"),re=n("ce7e"),ae=n("4bd4"),ie=n("b974"),ce=n("a844"),oe=Object(ht["a"])(ee,Wt,$t,!1,null,null,null),se=oe.exports;pt()(oe,{VBtn:mt["a"],VCard:gt["a"],VCardActions:yt["a"],VCardText:yt["b"],VCardTitle:yt["c"],VCheckbox:Dt["a"],VCol:Ot["a"],VColorPicker:ne["a"],VContainer:kt["a"],VDialog:Et["a"],VDivider:re["a"],VForm:ae["a"],VIcon:xt["a"],VRow:Ct["a"],VSelect:ie["a"],VSpacer:It["a"],VTextField:Lt["a"],VTextarea:ce["a"]});var le=function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("div")},de=[],ue={},fe=ue,he=Object(ht["a"])(fe,le,de,!1,null,null,null),ve=he.exports,pe={name:"App",components:{Calendar:Ft,EventForm:se,Notifications:ve},data:function(){return{}}},me=pe,be=n("7496"),ge=n("40dc"),ye=n("a75b"),De=Object(ht["a"])(me,a,i,!1,null,null,null),Oe=De.exports;pt()(De,{VApp:be["a"],VAppBar:ge["a"],VContent:ye["a"]});var ke=n("f309");r["a"].use(ke["a"]);var Ee=new ke["a"]({theme:{themes:{light:{primary:"#F07F1D",secondary:"#A3A3A3",success:"#00FA9A",info:"#1E90FF",error:"#FF1493"}}}});n.d(e,"bus",(function(){return xe})),r["a"].config.productionTip=!1;var xe=new r["a"];new r["a"]({vuetify:Ee,render:function(t){return t(Oe)}}).$mount("#app")}});
//# sourceMappingURL=app.926afbc3.js.map