//login regist logout
var d_uid=1;
var d_nickname="游客";
var u_id=d_uid;
var u_nickname=d_nickname;
var u_password;
var u_photo;
var hasShowNoLogin=false;
var htmlCode='\
    <div class="cover display-none login-cover" onclick="closeLogin()">\
      <div class="block cover-block" onclick="stopBubble(event)">\
        <div class="block-title">登录<span class="glyphicon glyphicon-remove cover-close" onclick="closeCover(this.parent(3))"></span></div>\
        <div class="input-wrapper">\
          <div class="input-item clearfix">\
            <span class="glyphicon glyphicon-user"></span>\
            <input type="text" jet-name="nickname" jet-valid="notnull" placeholder="用户名"/>\
          </div>\
          <div class="input-item clearfix">\
            <span class="glyphicon glyphicon glyphicon-lock"></span>\
            <input type="password" jet-name="password" jet-valid="notnull" placeholder="密码"/>\
          </div>\
          <jh jet-name="method">login</jh>\
          <div class="button div-center" onclick="login()">确认</div>\
          <span class="go-regist" onclick="goRegist()">前往注册</span>\
        </div>\
      </div>\
    </div>\
    <div class="cover display-none regist-cover" onclick="closeRegist()">\
      <div class="block cover-block" onclick="stopBubble(event)">\
        <div class="block-title">注册<span class="glyphicon glyphicon-remove cover-close" onclick="closeCover(this.parent(3))"></span></div>\
        <div class="input-wrapper">\
          <div class="input-item clearfix">\
            <span class="glyphicon glyphicon-user"></span>\
            <input type="text" jet-name="nickname" jet-valid="notnull" placeholder="用户名"/>\
          </div>\
          <div class="input-item clearfix">\
            <span class="glyphicon glyphicon-lock"></span>\
            <input type="password" jet-name="password" jet-valid="notnull" placeholder="密码"/>\
          </div>\
          <div class="input-item clearfix">\
            <span class="glyphicon glyphicon-ok-circle"></span>\
            <input type="password" jet-name="passwordAgain" placeholder="确认密码"/>\
          </div>\
          <div class="input-item clearfix">\
            <span class="glyphicon glyphicon-heart"></span>\
            <select placeholder="性别" jet-name="sex">\
              <option value="1">男</option>\
              <option value="0">女</option>\
            </select>\
          </div>\
          <div class="input-item clearfix">\
            <span class="glyphicon glyphicon-calendar"></span>\
            <input type="date" jet-name="birthday" jet-valid="date" placeholder="生日"/>\
          </div>\
          <div class="input-item clearfix">\
            <span class="glyphicon glyphicon-envelope"></span>\
            <input type="text" jet-name="email" jet-valid="email null" placeholder="邮箱"/>\
          </div>\
          <jh jet-name="method">regist</jh>\
          <div class="button div-center" onclick="regist()">确认</div>\
        </div>\
      </div>\
    </div>\
';
J.ready(function(){
  J.body().append(J.new("div").html(htmlCode).initValid());
  initLoginEvent();
  if(initLogin()){
    S(".login .text").txt(u_nickname);
  }else{
    J.class("user-center").hide();
    J.class("logout").hide();
  }
});
function initLoginEvent(){
  J.class("login").clk(openLogin);
  J.class("regist").clk(openRegist);
  J.class("logout").clk(logout);
}
function closeLogin(){
  closeCover(J.class("login-cover").clear());
}
function closeRegist(){
  closeCover(J.class("regist-cover").clear());
}
function openLogin(){
  J.class("login-cover").select("[jet-name=method]").txt("login");
  openCover(J.class("login-cover"));
}
function openRegist(){
  J.class("regist-cover").select("[jet-name=method]").txt("regist");
  openCover(J.class("regist-cover"));
}
function regist(){
  J.class("regist-cover").validate(function(data){
    if(data.password==data.passwordAgain){
      delete data.passwordAgain;
      jsonp(data,function(res){
        if(res=="true"){
          closeRegist();
          J.class("login-cover").set(data);
          openLogin();
          J.show("注册成功");
        }else if(res=="false"){
          J.show("服务器出错，注册失败。","error");
        }else{
          J.show("该用户名已被注册。","error");
        }
      });
    }else{
      J.show("两次密码输入不一致！","error")
    }
  });
}
function login(){
  J.class("login-cover").validate(function(data){
    jsonp(data,function(res){
      if(res){
        closeLogin();
        S(".login .text").txt(data.nickname);
        J.class("user-center").show();
        J.class("logout").show();
        initUserInfo(data);
      }
    },"登录");
  });
}
function logout(){
  setUserCookie({});
  J.class("user-center").hide();
  J.class("logout").hide();
  setSpin(J.id("set"));
  u_id=d_uid;
  u_nickname=d_nickname;
  J.select("[jet-name=u_id]").txt(d_uid);
  S(".login .text").txt("登录");
  J.show("已退出登录");
}
function initUserInfo(data){
  data.method="getUserInfo";
  jsonp(data,function(res){
    setUserCookie(res[0]);
    J.select("[jet-name=u_id]").txt(res[0].id);
  },null,false);
}
function setUserCookie(json){
  J.cookie("nickname",json.nickname,10);
  u_nickname=json.nickname;
  J.cookie("id",json.id,10);
  u_id=json.id;
  J.cookie("password",json.password,10);
  u_password=json.password;
  J.cookie("photo",json.photo,10);
  u_photo=json.photo;
}
function initLogin(){
  if(checkCookie()){
    var data={
      nickname:J.cookie("nickname"),
      password:J.cookie("password"),
      method:"login"
    }
    jsonp(data,function(res){
      if(res){
        S(".login .text").txt(data.nickname);
        J.class("user-center").show();
        J.class("logout").show();
        initUserInfo(data);
      }
    },null,false);
    return true;
  }else{
    return false;
  }
}
function checkCookie(){
  var nickname=J.cookie("nickname");
  var password=J.cookie("password");
  if(nickname==""||password==""){
    return false;
  }else{
    return true;
  }
}
function showNoLogin(){
  if(!hasShowNoLogin&&!checkCookie()){
    J.confirm("您当前是游客身份，是否登录?",function(){
      openLogin();
    });
    hasShowNoLogin=true;
  }
}
function goRegist(){
  closeLogin();
  openRegist();
}
