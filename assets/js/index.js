
var articles=[{
  id:"12",
  title:"微信小游戏开发之获取微信好友数据",
  name:"smallgame",
  date:"2018-04-12",
  author:"theajack",
  watch_num:0,
  comment_num:0,
  prise_num:0
},{
  id:"10",
  title:"基于Nodejs的七牛云上传资源解决方案",
  name:"nodeqiniu",
  date:"2017-07-13",
  author:"theajack",
  watch_num:0,
  comment_num:0,
  prise_num:0
},{
  id:"7",
  title:"获取汉字的拼音和笔画数的js库",
  name:"cnchar",
  date:"2017-03-29",
  author:"theajack",
  watch_num:0,
  comment_num:0,
  prise_num:0
},{
  id:"3",
  title:"jsonp跨域的客户端服务器搭建",
  name:"jsonp",
  date:"2017-03-16",
  author:"theajack",
  watch_num:0,
  comment_num:0,
  prise_num:0
}];

J.ready(function(){
  
  bindData(articles);
  jsonp("getAllArticle",function(data){
    J.id("list").empty().html('<div class="block-title">全部文章</div>');
    bindData(data.reverse());
  },null,false);
  J.class("wechat-public").event({
    "onmouseover":"J.class('wechat-img').fadeIn()",
    "onmouseleave":"J.class('wechat-img').fadeOut()"
  });
  J.id("setWrapper").clk(function(){
    setSpin(this);
  })
  //setFooterPos();
})
function bindData(data){
    data.each(function(item){
      bindOneData(item);
    });
    if(J.id("top").child().length>1){
      J.id("top").child(1).addClass("no-border");
    }else{
      J.id("top").append(noContent.clone());
    }
    if(data.length>0){
      J.id("list").child(1).addClass("no-border");}
    else{
      J.id("list").append(noContent.clone());
    }
}
function bindOneData(item){
	var aitem=J.new("div.a-item");
		var title=J.new("div.i-title[onclick=J.jump('article.html?id="+item.id+"&name="+item.name+"')]").html(item.title);
		var info=J.new("div.i-info.clearfix");
		info.append([
			geneInfo(toDate(item.date),"ii-block","calendar"),
			geneInfo(item.author,"ii-block","user").addClass("d-hide mobile"),
			geneInfo(item.watch_num,"ii-block","eye-open"),
			geneInfo(item.comment_num,"ii-block","comment"),
			geneInfo(item.prise_num,"ii-block","thumbs-up")
		]);
		if(item.top==1){info.append(geneInfo("置顶","ii-block darker","eject"))};
		if(item.star==1){info.append(geneInfo("加精","ii-block darker","star"))};
	aitem.append([title,info]);
	if(item.top==1||item.star==1){
		J.id("top").append(aitem.clone());
	}
  J.id("list").append(aitem);
}
function geneInfo(content,classname,icon){
	var info=J.new("div."+classname);
		var icon=J.new("span.glyphicon.glyphicon-"+icon);
		var text=J.new("span").txt(content);
	info.append([icon,text]);
	return info;
}
function setFooterPos(){
  if(J.height()-J.id("header").hei()-J.id("footer").hei()>J.id("content").hei()){
    J.id("footer").addClass("bottom");
  }else{
    J.id("footer").removeClass("bottom");
  }
}
window.onresize=setFooterPos;