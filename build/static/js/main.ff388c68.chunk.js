(window.webpackJsonp=window.webpackJsonp||[]).push([[0],{17:function(e,t,n){e.exports=n(43)},42:function(e,t,n){},43:function(e,t,n){"use strict";n.r(t);var a=n(0),i=n.n(a),l=n(10),s=n.n(l),r=n(11),o=n(12),f=n(15),c=n(13),u=n(2),d=n(16),m=n(14),p=n.n(m),h=(n(42),["liha","kana","kala","kasvis"]),y=["pasta","peruna","riisi","salaatti","bataatti"],E=["slow","normal","fast"],b=function(e){return-1!==h.indexOf(e)?"main":-1!==y.indexOf(e)?"side":"speed"},k=function(e){function t(e){var n,a=this;return Object(r.a)(this,t),(n=Object(f.a)(this,Object(c.a)(t).call(this,e))).FilterSelected=function(){return n.state.filtersPressed.map(function(e,t){return i.a.createElement("button",{onClick:n.DeactivateFilter.bind(Object(u.a)(n),e),key:t},e)})},n.FilterAvailable=function(){return i.a.createElement("h6",null,i.a.createElement("p",null,i.a.createElement(function(){return n.state.maintypefilter.off.map(function(e,t){return i.a.createElement("button",{onClick:n.ActivateFilter.bind(Object(u.a)(n),e),key:t},e)})},null)),i.a.createElement("p",null,i.a.createElement(function(){return n.state.sidetypefilter.off.map(function(e,t){return i.a.createElement("button",{onClick:n.ActivateFilter.bind(Object(u.a)(n),e),key:t},e)})},null)),i.a.createElement("p",null,i.a.createElement(function(){return n.state.speedtypefilter.off.map(function(e,t){return i.a.createElement("button",{onClick:n.ActivateFilter.bind(Object(u.a)(n),e),key:t},e)})},null)))},n.NameLink=function(e){var t=e.food;return""===t.link?i.a.createElement("td",null,t.name):i.a.createElement("td",null,i.a.createElement("a",{href:t.link},t.name))},n.SelectFood=function(e){console.log("syodaan nakojaan "+e.name)},n.FoodTable=function(e){return e.foods.map(function(e,t){return i.a.createElement("tr",{key:t},i.a.createElement("td",{className:"maintype_table"},e.maintype),i.a.createElement("td",{className:"sidetype_table"},e.sidetype),i.a.createElement(a.NameLink,{food:e}),i.a.createElement("td",{onClick:n.SelectFood.bind(Object(u.a)(n),e)},"PICKME"))})},n.state={foods:[],latestfoods:[],filtersPressed:[],maintypefilter:{on:[],off:h},sidetypefilter:{on:[],off:y},speedtypefilter:{on:[],off:E}},n}return Object(d.a)(t,e),Object(o.a)(t,[{key:"componentDidMount",value:function(){var e=this;p.a.get("https://kisaeeheifoodpicker.herokuapp.com").then(function(t){e.setState({foods:t.data})})}},{key:"DeactivateFilter",value:function(e){this.setState({filtersPressed:this.state.filtersPressed.filter(function(t){return t!==e})}),"main"===b(e)?this.setState({maintypefilter:{on:this.state.maintypefilter.on.filter(function(t){return t!==e}),off:this.state.maintypefilter.off.concat(e)}}):"side"===b(e)?this.setState({sidetypefilter:{on:this.state.sidetypefilter.on.filter(function(t){return t!==e}),off:this.state.sidetypefilter.off.concat(e)}}):this.setState({speedtypefilter:{on:this.state.speedtypefilter.on.filter(function(t){return t!==e}),off:this.state.speedtypefilter.off.concat(e)}}),console.log(this.state)}},{key:"ActivateFilter",value:function(e){"main"===b(e)?this.setState({filtersPressed:this.state.filtersPressed.concat(e),maintypefilter:{on:this.state.maintypefilter.on.concat(e),off:this.state.maintypefilter.off.filter(function(t){return t!==e})}}):"side"===b(e)?this.setState({filtersPressed:this.state.filtersPressed.concat(e),sidetypefilter:{on:this.state.sidetypefilter.on.concat(e),off:this.state.sidetypefilter.off.filter(function(t){return t!==e})}}):this.setState({filtersPressed:this.state.filtersPressed.concat(e),speedtypefilter:{on:this.state.speedtypefilter.on.concat(e),off:this.state.speedtypefilter.off.filter(function(t){return t!==e})}}),console.log(this.state)}},{key:"slowestFood",value:function(){for(var e=600,t=this.state.speedtypefilter.on,n=0;n<t.length;n++)"fast"===t[n]?e=30:"normal"===t[n]&&(e=60);return e}},{key:"FilteredFoods",value:function(){var e=this;if(0===this.state.filtersPressed.length)return this.state.foods;var t=0===this.state.maintypefilter.on.length?this.state.maintypefilter.off:this.state.maintypefilter.on,n=0===this.state.sidetypefilter.on.length?this.state.sidetypefilter.off:this.state.sidetypefilter.on;return this.state.foods.filter(function(a){return-1!==t.indexOf(a.maintype)&&-1!==n.indexOf(a.sidetype)&&a.time<e.slowestFood()})}},{key:"render",value:function(){return i.a.createElement("div",null,i.a.createElement("h3",null,"Filter selected"),i.a.createElement(this.FilterSelected,null),i.a.createElement("h3",null,"Filters available"),i.a.createElement(this.FilterAvailable,null),i.a.createElement("table",null,i.a.createElement("tbody",null,i.a.createElement("tr",null,i.a.createElement("th",null,"main"),i.a.createElement("th",null,"side"),i.a.createElement("th",null,"name"),i.a.createElement("th",null,"Choose")),i.a.createElement(this.FoodTable,{foods:this.FilteredFoods()}))))}}]),t}(i.a.Component);s.a.render(i.a.createElement(k,null),document.getElementById("root"))}},[[17,1,2]]]);
//# sourceMappingURL=main.ff388c68.chunk.js.map