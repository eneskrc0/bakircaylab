// Visitor counter (GoatCounter): count Ana sayfa, Biz Kimiz and Amacımız as separate pages.
(function(){
var page=function(){var h=location.hash;return h==='#biz-kimiz'?'/biz-kimiz':h==='#amacimiz'?'/amacimiz':'/'};var last=page();window.goatcounter={path:function(){return page()}};window.addEventListener('hashchange',function(){var now=page();if(now===last)return;last=now;if(window.goatcounter&&window.goatcounter.count)window.goatcounter.count({path:now,title:document.title})})})();
