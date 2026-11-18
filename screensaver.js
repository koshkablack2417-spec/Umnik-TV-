(function(){
  var IDLE=5*60*1000, ROTATE=30000, timer=null, slide=null, active=false, index=0;
  var photos=[
    "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1920&q=85",
    "https://images.unsplash.com/photo-1470770841072-f978cf4d019e?auto=format&fit=crop&w=1920&q=85",
    "https://images.unsplash.com/photo-1470252649378-9c29740c9fa8?auto=format&fit=crop&w=1920&q=85",
    "https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=1920&q=85"
  ];
  function make(){var box=document.getElementById("umnik-saver");if(box)return box;box=document.createElement("div");box.id="umnik-saver";box.innerHTML='<div class="saver-brand">УМНИК TV</div><div class="saver-info"><div class="saver-time" id="umnik-saver-time"></div><div class="saver-date" id="umnik-saver-date"></div></div><div class="saver-hint">Нажми любую кнопку, чтобы продолжить</div>';document.body.appendChild(box);return box;}
  function clock(){var d=new Date(),t=document.getElementById("umnik-saver-time"),dt=document.getElementById("umnik-saver-date");if(t)t.innerHTML=("0"+d.getHours()).slice(-2)+":"+("0"+d.getMinutes()).slice(-2);if(dt){var days=["воскресенье","понедельник","вторник","среда","четверг","пятница","суббота"],months=["января","февраля","марта","апреля","мая","июня","июля","августа","сентября","октября","ноября","декабря"];dt.innerHTML=days[d.getDay()]+", "+d.getDate()+" "+months[d.getMonth()];}}
  function photo(){var b=make();b.style.backgroundImage="url('"+photos[index%photos.length]+"')";index++;}
  function close(){if(!active)return;active=false;var b=make();b.className="";if(slide){window.clearInterval(slide);slide=null;}reset();}
  function open(){if(active)return;active=true;var b=make();photo();b.className="on";clock();if(slide)window.clearInterval(slide);slide=window.setInterval(function(){photo();clock();},ROTATE);}
  function reset(){if(timer)window.clearTimeout(timer);if(!active)timer=window.setTimeout(open,IDLE);}
  function activity(e){if(active){close();if(e&&e.preventDefault)e.preventDefault();}else reset();}
  var events=["mousemove","mousedown","keydown","touchstart","click"];
  for(var i=0;i<events.length;i++){if(document.addEventListener)document.addEventListener(events[i],activity,false);}
  if(window.addEventListener){window.addEventListener("focus",reset,false);window.addEventListener("load",reset,false);}
  make();reset();
})();