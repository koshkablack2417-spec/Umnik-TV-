(function(){
  function trim(s){return String(s||"").replace(/^\s+|\s+$/g,"");}
  function parse(text){
    var lines=text.split(/\r?\n/),items=[],meta=null,i,line,m;
    for(i=0;i<lines.length;i++){
      line=trim(lines[i]);
      if(line.indexOf("#EXTINF:")===0){
        m=line.match(/group-title="([^"]*)"/);
        meta={name:trim(line.substring(line.lastIndexOf(",")+1))||"Канал "+(items.length+1),group:m?m[1]:""};
      }else if(line&&line.charAt(0)!=="#"&&meta){
        meta.url=line;
        if(/^https?:\/\//i.test(line)){items.push(meta);}
        meta=null;
      }
    }
    return items;
  }
  document.addEventListener("change",function(event){
    var input=event.target;
    if(!input||input.id!=="m3uFile"||!input.files||!input.files[0])return;
    if(!window.FileReader){alert("Этот браузер не поддерживает чтение M3U-файлов. Попробуй внешнее устройство.");return;}
    var reader=new FileReader();
    reader.onload=function(){
      var channels=parse(reader.result);
      if(!channels.length){alert("В файле не найдено HTTP(S)-адресов каналов M3U.");return;}
      try{localStorage.setItem("unektv-channels",JSON.stringify(channels));}
      catch(e){alert("Не удалось сохранить список: память браузера недоступна.");return;}
      alert("Сохранено каналов: "+channels.length+". Страница перезагрузится.");
      window.location.reload();
    };
    reader.onerror=function(){alert("Не удалось прочитать выбранный файл.");};
    reader.readAsText(input.files[0]);
  },false);
  document.addEventListener("change",function(event){
    if(event.target&&event.target.id==="epgFile"&&event.target.files&&event.target.files[0]){
      alert("Файл программы выбран. Парсер XMLTV будет добавлен после проверки формата на целевом телевизоре.");
    }
  },false);
})();