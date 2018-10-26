
var a_id,a_name;
var defaultPhoto="assets/images/defaultPhoto.png";
J.ready(function(){
  if(J.id("text").html().trim()==""){
    var data=J.urlParam()
    a_id=data.id;
    a_name=data.name;
    loadText();
  }
  bindComment();
  bindArticle();
  initFaceBox();
  setToolBoxPos();
  J.class("wechat-public").event({
    "onmouseover":"J.class('wechat-img').fadeIn()",
    "onmouseleave":"J.class('wechat-img').fadeOut()"
  });
  J.id("setWrapper").clk(function(){
    setSpin(this);
  })
  J.id("zoomImageCover").clk("J.id('zoomImageCover').fadeOut()");
  J.jetName("a_id").txt(a_id);
  J.jetName("u_id").txt(u_id);
  addWatch();
})
function bindZoom(obj){
  J.id("zoomImage").attr("src",obj.attr("src"));
  var rate=obj.hei()/obj.wid();
  var height=rate*J.width();
  var top=(J.height()-height)/2;
  if(top<0){
    //alert(1)
    var width=J.height()/rate;
    J.class("pinch-zoom-container").css("margin-top","0px");
    J.id("zoomImage").css({
      "height":(J.height()-10)+"px",
      "width":width+"px",
      "margin":"5px "+(J.width()-width)/2+"px"
    });
  }else{
    J.class("pinch-zoom-container").css("margin-top",top+"px");
    J.id("zoomImage").css({
      "height":"100%",
      "width":"98%",
      "margin":"0 1%"
    });
  }
  openCover(J.id("zoomImageCover"));
}
function loadText(){
  $("#text").load("article/"+a_name+".html",function(){
    var text=J.id("text");
    if(J.isMobile()){ 
      $('div.pinch-zoom').each(function () {
        new RTP.PinchZoom($(this), {});
      });
      text.findTag("img").clk("bindZoom(this)");
    }else{
      text.findTag("pre").attr("contenteditable",true);
    }
    J.name("description").attr("content",J.id("hideDes").txt());
    J.name("keywords").attr("content",J.id("hideKeyWords").txt());
    J.id("title").txt(J.id("hideTitle").txt());
    Jcode.init();
  });
}
function setToolBoxPos(){
  if(J.width()>900){
    J.id("toolBox").css({
      right:(J.width()*0.15-60)+"px",
      bottom:((J.height()-212)/2)+"px"
    })
  }else{
    J.id("toolBox").css({
      right:"5px",
      bottom:((J.height()-135)/2)+"px"
    })
  }
}
function addWatch(){
  jsonp({
    method:"addWatch",
    id:a_id
  },function(data){
    if(data){
      J.class("watch-num").txt(parseInt(J.class("watch-num").txt())+1);
    }
  },null,false);
}
function bindArticle(){
  jsonp({
    method:"getArticle",
    id:a_id
  },function(data){
    data[0].date=toDate(data[0].date);
    J.set("title",data[0]);
    if(data[0].top==1){
      J.id("articleTop").removeClass("display-none");
    }
    if(data[0].star==1){
      J.id("articleStar").removeClass("display-none");
    }
    J.class("prise-num").txt(data[0].prise_num);
    J.tag("title").text=data[0].title+"--(Blog theajack)";
  },null,false);
}
function initFaceBox(){
  J.class("face-box").each(function(box){
    box.prev().clk(function(){
      if(this.attr("data-show")=="true"){
        this.attr("data-show","false");
        this.next().fadeOut(null,'fast');
      }else{
        this.attr("data-show","true");
        this.next().fadeIn(null,'fast');
      }
    });
    for(var i=1;i<=40;i++){
      box.append(J.new("img.face-item[src=assets/images/rabbit/rabbit ("+i+").gif][rt="+i+"][onclick=addFace(this)]"));
    }
  });
  J.class("c-link").clk(function(){
    var obj=this;
    J.input({
      title:"添加链接",
      text:["链接地址","链接文字"],
      default:["http://",null],
      valid:["url",null],
      placeholder:["请填写正确的url地址","默认值为链接地址"],
  　},function(data){
      if(data[1]==""){
        data[1]=data[0];
      }
      var area=obj.parent().next();
      area.append(J.new("span.span-link[contenteditable=false][onclick=J.jump('"+data[0]+"')]").txt(data[1])).html(area.html()+"&nbsp;");
    });
  });
  J.class("c-image").clk(develop);
}
function addFace(obj){
  obj.parent(2).next().append(J.new("img.rabbit[src="+obj.attr("src")+"][rt="+obj.attr("rt")+"]"));
  obj.parent().fadeOut(null,'fast').prev().attr("data-show","false");
}

/*var c_data=[
  {
    "name":"theajack",
    "photo":"assets/images/bikeshare.png",
    "time":"2017-09-09 11:11:11",
    "content":"大撒反对仿盛大首发式大苏打撒",
    "reply_num":100,
    "prise_num":100,
    "reply":[{
        "name":"theajack",
        "photo":"assets/images/bikeshare.png",
        "time":"2017-09-09 11:11:11",
        "content":"大撒反对仿盛大首发式大苏打撒"
      },{
        "name":"theajack",
        "photo":"assets/images/bikeshare.png",
        "time":"2017-09-09 11:11:11",
        "content":"大撒反对仿盛大首发式大苏打撒"
      },{
        "name":"theajack",
        "photo":"assets/images/bikeshare.png",
        "time":"2017-09-09 11:11:11",
        "content":"大撒反对仿盛大首发式大苏打撒"
      }
    ]
  }
];*/
var all_data;
function bindComment(isFresh){
  jsonp({
    method:"getTopComment",
    a_id:a_id
  },function(data){
    all_data=data;
    var list=J.id("commentList");
    if(data.length==0){
      list.append(noContent.clone());
    }else{
      data.each(function(item,i){
        if(i<5){
          list.append(bindOneComment(item,i));
        }
      });
      if(data.length>=5){
        list.append(J.new("div.link.text-center[onclick=bindAllComment()]").html("查看更多评论&gt;"));
      }
      if(isFresh){
        list.css("height","auto")
      }
    }
  },null,false);
}
function bindAllComment(){
  jsonp({
    method:"getAllComment",
    a_id:a_id
  },function(data){
    all_data=data;
    openCover(J.id("allComment"),true);
    S("#floatComment .button").attr("onclick","reply(this,true)");
    var list=J.id("allCommentList");
    if(data.length==0){
      list.append(noContent.clone());
    }else{
      data.each(function(item,i){
        if(i<10){
          list.append(bindOneComment(item,i,true));
        }
      });
      if(data.length>=10){
        list.append(J.new("div.link.text-center[onclick=addComment(this)]").html("查看更多&gt;"));
      }
      //if(isFresh){
      //  list.css("height","auto")
      //}
    }
  },null,false);
}
function bindOneComment(data,index,isAll){
  var c_item=J.new("div.comment-item.clearfix");
  if(index==0){c_item.addClass("no-border");}
    var c_user=J.new("div.c-user");
      var c_photo=J.new("img.c-user-photo[src="+J.checkArg(data.photo,defaultPhoto)+"]");
      var c_name=J.new("div.c-user-name.small-text").txt(data.nickname);
    c_user.append([c_photo,c_name]);
    var c_content=J.new("div.c-content");
      var c_info=J.new("div.c-content-info.small-text").txt(J.checkArg(toDatetime(data.time),"没有日期"));
      var c_text=J.new("div.c-content-text.normal-text").html(decodeContent(data.content));
      
      var c_cp=J.new("div.clearfix");
        var c_cp_comment=J.new("div.ii-block[onclick=priseComment(this,"+isAll+")]");
          var c_cp_cicon=J.new("span.glyphicon.glyphicon-thumbs-up");
          var c_cp_cnum=J.new("span").txt(data.prise_num);
        c_cp_comment.append([c_cp_cicon,c_cp_cnum]);
        var c_cp_prise=J.new("div.ii-block[onclick=openReply(this)][bc_id="+data.id+"]");
          var c_cp_picon=J.new("span.glyphicon.glyphicon-comment");
          var c_cp_pnum=J.new("span").txt(data.reply_num);
        c_cp_prise.append([c_cp_picon,c_cp_pnum]);
      c_cp.append([c_cp_comment,c_cp_prise]);
      
    c_content.append([c_info,c_text,c_cp]);
    if(data.reply!=undefined&&data.reply.length>0){
      var c_reply=J.new("div.c-reply");
        var c_rb_title=J.new("div.block-title").txt("回复列表");
          var c_rb_switch=J.new("span.reply-switch").txt("收起").clk("switchReply(this)");
        c_rb_title.append(c_rb_switch);
      c_reply.append(c_rb_title);
        var c_rb_itemwrapper=J.new("div");
          var c_rb_all=J.new("div.display-none");
        data.reply.each(function(item,i){
          if(i<5||isAll){
            var c_r_item=geneReply(item,i);
            if(i>=5){
              c_rb_all.append(c_r_item);
            }else{
              c_rb_itemwrapper.append(c_r_item);
            }
          }
        });
      if(data.reply.length>=5){
        if(isAll){
          c_rb_itemwrapper.append(c_rb_all);
          c_rb_itemwrapper.append(J.new("div.link.text-center[onclick=addReply(this)]").html("查看全部回复&gt;"));
        }else{
          c_rb_itemwrapper.append(J.new("div.link.text-center[onclick=bindAllComment()]").html("查看更多回复&gt;"));
        }
      }
      if(data.reply.length>0)
        c_reply.append(c_rb_itemwrapper);
    c_content.append(c_reply);
    }
  c_item.append([c_user,c_content]);
  return c_item;
}
function geneReply(item,i){
  var c_r_item=J.new("div.c-reply-item");
  if(i==0){c_r_item.addClass("no-border");}
    var c_r_title=J.new("div.c-r-title");
      var c_r_photo=J.new("img.c-r-photo[src="+J.checkArg(item.photo,defaultPhoto)+"]");
      var c_r_name=J.new("span.c-r-name.small-text").txt(item.nickname);
      var c_r_time=J.new("span.c-r-name.small-text").txt(toDatetime(item.time));
    c_r_title.append([c_r_photo,c_r_name,c_r_time]);
    var c_r_content=J.new("div.c-r-content.small-text").html(decodeContent(item.content));
  return c_r_item.append([c_r_title,c_r_content]);
}
function addReply(obj){
  if(obj.html()=="查看全部回复&gt;"){
    obj.html("收起更多回复&lt");
    obj.prev().slideDown();
  }else{
    obj.html("查看全部回复&gt");
    obj.prev().slideUp();
  }
}
function addComment(obj){
  var i=obj.index();
  for(var k=i;k<i+10;k++){
    var reply=all_data[k];
    if(reply==undefined){
      obj.clk("closeAllComment()").txt("已无更多 (点击关闭)");
      break;
    }else{
      obj.before(bindOneComment(reply,null,true));
    }
  }
}
function closeAllComment(){
  closeCover(J.id('allComment'),true);
  J.id('allCommentList').empty();
  S("#floatComment .button").attr("onclick","reply()");
}
function toComment(){
  J.scrollTo(J.id("comment").top());
  J.id("comment").focus();
}
function toTop(){
  J.scrollTo(0);
}
function comment(){//评论文章
  showNoLogin();
  var data=J.id("comment").get();
  if(!data.content){
    J.show("评论不可为空","warn");
  }else{
    data.content=codeContent(data.content);
    jsonp(data,function(res){
      if(res){
        J.class("comment-num").txt(parseInt(J.class("comment-num").txt())+1);
        J.id("comment").select("[jet-name=content]").empty();
        refreshComment();
      }
    },"评论");
  }
}
function refreshComment(){
  var list=J.id("commentList");
  list.css("height",list.hei()+"px").empty().html("<div class='block-title'>评论列表</div>");
  bindComment(true);
}
//jsonp 传数据是标签会出错 还有就是尽量缩短传输内容
function codeContent(content){
  var comment=J.new("div").html(content);
  if(comment.child().length>0){
    comment.child().each(function(item){
      if(item.hasClass("rabbit")){
        item.removeAttr("src").removeAttr("class");
      }else if(item.hasClass("span-link")){
        item.removeAttr("contenteditable").removeAttr("class");;
      }
    });
    return comment.html().replaceAll("<","##").replaceAll("'","%%");
  }else{
    return content;
  }
}
function decodeContent(content){
  content=content.replaceAll("##","<").replaceAll("%%","'");;
  var con=J.new("div").html(content);
  if(con.child().length>0){
    con.child().each(function(item){
      if(item.hasAttr("rt")){
        item.addClass("rabbit").attr("src","assets/images/rabbit/rabbit ("+item.attr("rt")+").gif");
      }else if(item.hasAttr("onclick")){
        item.addClass("span-link");
      }
    })
    return con.html();
  }else{
    return content;
  }
}
function prise(){//点赞文章
  showNoLogin();
  jsonp({
    method:"prise",
    a_id:a_id,
    u_id:u_id
  },function(data){
    if(data){
      J.class("prise-num").txt(parseInt(J.class("prise-num").txt())+1);
    }
  },"点赞文章");
}
function openReply(obj){
  var list=J.id("floatComment");
  openCover(list);
  list.select("[jet-name=bc_id]").txt(obj.attr("bc_id"));
  list.findClass("reply-nickname").txt(obj.parent(2).prev().child(1).txt());
}
function reply(obj,isAll){//评论回复
  showNoLogin();
  var data=J.id("floatComment").get();
  if(!data.content){
    J.show("评论不可为空","warn");
  }else{
    data.method="replyComment";
    data.u_id=u_id;
    data.content=codeContent(data.content);
    jsonp(data,function(res){
      if(res){
        closeCover(J.id("floatComment"));
        J.id("floatComment").select("[jet-name=content]").empty();
        refreshComment();
        if(isAll){
          data.content=decodeContent(data.content);
          data.time=getNowDate();
          data.nickname=u_nickname;
          var bc_id=obj.next().txt();
          var list=S("#allCommentList [bc_id='"+bc_id+"']").parent().next();
          var num=list.prev().child(1).child(1);
          num.txt(parseInt(num.txt())+1);
          list.child(0).removeClass("no-border");
          list.child(1).prepend(geneReply(data,0));
        }
      }
    },"回复");
  }
}
function priseComment(obj,isAll){//点赞回复
  showNoLogin();
  var bc_id=obj.next().attr("bc_id");
  jsonp({
    method:"priseComment",
    bc_id:bc_id,
    u_id:u_id
  },function(data){
    if(data){
      var num=parseInt(obj.child(1).txt())+1;
      obj.child(1).txt(num);
      if(isAll)
        J.id("commentList").select("[bc_id='"+bc_id+"']").prev().child(1).txt(num);
    }
  },"点赞评论");
}
function switchReply(obj){
  obj.txt((obj.txt()=="收起")?"展开":"收起");
  obj.parent().next().slideToggle();
}
window.onresize=setToolBoxPos;