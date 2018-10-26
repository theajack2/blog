var isMobile=true;
//var url="http://localhost:50866/theajack/default.aspx";
//var url="http://localhost:1010/"
var url="http://15h97945z7.iok.la";
var noContent=J.new("div.no-content").html('\
    <img src="assets/images/rabbit/rabbit (26).gif" rt="26" onclick="addFace(this)">\
    <span>暂无内容</span>');
J.ready(function(){
  J.lang("chinese");
  J.noteStyle("gray");
});
function jsonp(json,callback,text,needShow){
  if(needShow!=false)
    J.show("正在请求...","info");
  if(json.constructor==String){
    json={method:json};
  }
  J.jsonp({
    url:url,
    data:json,
    dataType:"json",
    success:function(data){
      if(callback!=undefined){
        if(text==undefined){
          callback(data.value);
        }else{
          switch(data.value){
            case "true":
              if(callback.constructor==Function){
                callback(true);
                if(text!=undefined){
                  J.show(text+"成功！")
                }
              }else{
                J.show(callback+"成功！")
              };break;
            case "false":
              if(callback.constructor==Function){
                callback(false);
                if(text!=undefined){
                  J.show(text+"失败！","error")
                }
              }else{
                J.show(callback+"失败！","error")
              };break;
            case "error":J.show("服务器运行异常","error");break;
            default:callback(data.value);break;
          }
        }
      }
    },
    time:20000,
    timeout:function(err){
      J.show(err.message,"error");
    },
    message:"请求超时"
  });
}
function lockScroll(){
  J.body().event({
    'ontouchmove':function (event) {
      event.preventDefault();
    },
    'onmousewheel':function (event) {
      event.preventDefault();
    }
  })
}
function unlockScroll(){
  J.body().event({
    'ontouchmove':function(){},
    'onmousewheel':function(){}
  })
}function getNowDate() {
    var date = new Date();
    var seperator1 = "-";
    var seperator2 = ":";
    var month = date.getMonth() + 1;
    var strDate = date.getDate();
    if (month >= 1 && month <= 9) {
        month = "0" + month;
    }
    if (strDate >= 0 && strDate <= 9) {
        strDate = "0" + strDate;
    }
    var currentdate = date.getFullYear() + seperator1 + month + seperator1 + strDate
            + " " + checkNum(date.getHours()) + seperator2 + checkNum(date.getMinutes())
            + seperator2 + checkNum(date.getSeconds());
    return currentdate;
}
function checkNum(num){
  if (num >= 0 && num <= 9) {
    num = "0" + num;
  }
  return num;
}
function toDate(d){
  return d.split("T")[0];
}
function toDatetime(d){
  return d.replace("T"," ");
}


function setSpin(obj){
  if(obj.data("spin")!=true){
    if(!isMobile){
      obj.spin();
    }
    obj.data("spin",true);
    J.id("menuWrapper").fadeIn(null,"fast");
  }else{
    if(!isMobile){
      obj.stopSpin();
    }
    obj.data("spin",false);
    J.id("menuWrapper").fadeOut(null,"fast");
  }
}
function stopBubble(e){
  if(e&&e.stopPropagation){
    e.stopPropagation();
  }else{
    window.event.cancelBubble=true;
  }
}
function develop(){
  J.show("暂不支持。","info")
}
function openCover(obj,bubble){
  lockScroll();
  obj.fadeIn();
  if(bubble){
    obj.event({
      'ontouchmove':function (event) {
        stopBubble(event);
      },
      'onmousewheel':function (event) {
        stopBubble(event);
      }
    })
    J.body().css("overflow","hidden");
  }
}
function closeCover(obj,bubble){
  unlockScroll();
  obj.fadeOut();
  
  if(bubble){
    J.body().css("overflow","auto");
  }
}