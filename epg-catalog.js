(function(){
  var main=document.getElementById("main"), nav=document.getElementById("nav");
  if(!main||!nav)return;
  var page="home",epg=[],channels=[],kind="movies";
  function esc(v){return String(v||"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;");}
  function time(v){var m=String(v||"").match(/^(\d{4})(\d{2})(\d{2})(\d{2})(\d{2})/);if(!m)return null;return new Date(+m[1],+m[2]-1,+m[3],+m[4],+m[5]);}
  function hh(d){return ("0"+d.getHours()).slice(-2)+":"+("0"+d.getMinutes()).slice(-2);}
  function box(title,body){return '<section class="panel"><h2>'+title+'</h2>'+body+'</section>';}
  function tile(name,desc,url,tag){return '<button class="tile" data-catalog-url="'+url+'" data-tags="'+tag+'"><span class="tile-icon">▶</span><span><span class="tile-title">'+name+'</span><span class="tile-sub">'+desc+'</span></span></button>';}
  function drawGuide(){
    var now=new Date(),list=[];
    for(var i=0;i<epg.length;i++){var a=time(epg[i].start),b=time(epg[i].stop);if(a&&b&&b>now&&a<new Date(now.getTime()+12*3600000))list.push({p:epg[i],a:a,b:b});}
    list.sort(function(x,y){return x.a-y.a;});
    var html='<h1>Программа передач</h1><div class="notice">Загрузи файл XMLTV от своего легального ТВ-провайдера. Тогда здесь появятся названия передач и точное время их начала и окончания.</div><p><input id="umnikEpgFile" class="field" type="file" accept=".xml,.xmltv,text/xml"></p>';
    if(!list.length)html+=box("Расписание","<p>Пока нет данных EPG. Без файла программы передач мы не будем придумывать расписание.</p>");
    else {var body="";for(var j=0;j<list.length;j++){var p=list[j].p,n=p.channel;for(var k=0;k<channels.length;k++){if(channels[k].tvgid===p.channel||channels[k].name===p.channel)n=channels[k].name;}body+='<div class="setting"><span><b>'+esc(n)+'</b><br>'+esc(p.title)+'</span><b>'+hh(list[j].a)+' – '+hh(list[j].b)+'</b></div>';}html+=box("Сейчас и дальше",body);}
    main.innerHTML=html;
    var input=document.getElementById("umnikEpgFile");if(input)input.onchange=function(){var file=this.files&&this.files[0];if(!file)return;var reader=new FileReader();reader.onload=function(){try{var doc=(new DOMParser()).parseFromString(reader.result,"text/xml"),nodes=doc.getElementsByTagName("programme");epg=[];for(var x=0;x<nodes.length;x++){var n=nodes[x],t=n.getElementsByTagName("title")[0];epg.push({channel:n.getAttribute("channel"),start:n.getAttribute("start"),stop:n.getAttribute("stop"),title:t?t.textContent:"Передача"});}drawGuide();}catch(e){main.innerHTML+='<p>Не удалось прочитать XMLTV-файл.</p>';}};reader.readAsText(file);};
  }
  var services=[
    {name:"RTVE Play",desc:"Фильмы, сериалы, документальные передачи и прямые каналы — бесплатно",url:"https://www.rtve.es/play/",tags:"movies series documentary"},
    {name:"Clan / RTVE Infantil",desc:"Детские программы и мультфильмы — бесплатно",url:"https://www.rtve.es/infantil/",tags:"cartoons kids"},
    {name:"Pluto TV",desc:"Бесплатные каналы, фильмы и сериалы с рекламой",url:"https://pluto.tv/",tags:"movies series cartoons"},
    {name:"Rakuten TV · Gratis",desc:"Раздел бесплатных фильмов и каналов с рекламой",url:"https://www.rakuten.tv/",tags:"movies series"},
    {name:"Plex",desc:"Бесплатные фильмы, сериалы и тематические каналы с рекламой",url:"https://watch.plex.tv/",tags:"movies series cartoons"},
    {name:"YouTube · официальные каналы",desc:"Бесплатные мультфильмы и видео от правообладателей",url:"https://www.youtube.com/",tags:"cartoons kids series"}
  ];
  function drawCatalog(which,filter){
    kind=which;var title=which==="cartoons"?"Мультфильмы":which==="series"?"Сериалы":"Фильмы";
    var html='<h1>'+title+'</h1><div class="row"><button class="action" data-filter="all">Все</button><button class="action" data-filter="kids">Детское</button><button class="action" data-filter="movies">Фильмы</button><button class="action" data-filter="series">Сериалы</button><button class="action" data-filter="cartoons">Мультфильмы</button><button class="action" data-filter="documentary">Документальные</button></div><div class="notice" style="margin-top:16px">Это каталог бесплатных официальных видеосервисов, а не пиратских копий. Бесплатный просмотр может содержать рекламу; доступность отдельных названий зависит от страны и лицензий.</div><div class="grid" style="margin-top:18px">';
    var count=0;for(var i=0;i<services.length;i++){if(filter==="all"||services[i].tags.indexOf(filter)>=0||(filter==="kids"&&services[i].tags.indexOf("kids")>=0)){html+=tile(services[i].name,services[i].desc,services[i].url,services[i].tags);count++;}}
    html+='</div><p class="muted">Мы не показываем выдуманные карточки фильмов: здесь будут появляться только проверенные названия с официальным источником.</p>';main.innerHTML=html;
  }
  function show(p){page=p;var items=nav.querySelectorAll(".nav-item");for(var i=0;i<items.length;i++)items[i].className=items[i].getAttribute("data-page")===p?"nav-item active":"nav-item";if(p==="live")drawGuide();else if(p==="movies"||p==="cartoons")drawCatalog(p,"all");}
  nav.addEventListener("click",function(e){var b=e.target;while(b&&b!==nav&&(!b.getAttribute||!b.getAttribute("data-page")))b=b.parentNode;if(!b||b===nav)return;var p=b.getAttribute("data-page");if(p==="live"||p==="movies"||p==="cartoons"){e.preventDefault();e.stopPropagation();if(e.stopImmediatePropagation)e.stopImmediatePropagation();show(p);}},true);
  main.addEventListener("click",function(e){var b=e.target;while(b&&b!==main&&(!b.getAttribute||(!b.getAttribute("data-catalog-url")&&!b.getAttribute("data-filter"))))b=b.parentNode;if(!b||b===main)return;if(b.getAttribute("data-filter")){drawCatalog(kind,b.getAttribute("data-filter"));return;}var url=b.getAttribute("data-catalog-url");if(url)window.open(url,"_blank");});
  try{channels=JSON.parse(localStorage.getItem("unektv-channels")||"[]");}catch(e){channels=[];}
  var old=window.open;window.umnikTVGuideReady=true;
})();