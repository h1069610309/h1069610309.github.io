/**
项目相关属性
 */
 
layui.define(['layer'],function(exports){
  exports('public', {
  	//服务端IP
	serverIP:"http://wei:8080"
	
	,ajaxMethod:'post'  	//ajax默认请求方式
  	,AUTHORIZATION:sessionStorage.getItem('AUTHORIZATION')
    ,loginPage:"/layui/views/user/login.html"
  	,imgMaxSize:1024*3 //图片最大体积(3M)
  	,LOGIN_NOTLOGIN:"未登录" // 服务器端判断未登录字符串对比
  	,LOGIN_NOTROLE:"没有权限"
  	,ajax:function(options,data,callback){
  		var _this = this;
  		var $=layui.$;
  		if(!options.hasOwnProperty("async")){ //不传默认异步
  			options.async=true;
  		}
  		if(!data.hasOwnProperty("AUTHORIZATION")){//不传使用默认值
  			data.AUTHORIZATION = this.AUTHORIZATION;
  		}
  		//判断是否有登录token
  		if(!data.AUTHORIZATION){
  			top.location.href = _this.loginPage;
  			return false;
  		}
  		$.ajax({
			type: options.type?options.type:_this.ajaxMethod,//默认不传使用public默认
			url: options.url,
			async: options.async,
			data: data,
			success: function(result) {
				if(!result.suc){
					if(result.msg){
						layer.msg(result.msg,{icon: 2});
					}
					//登录过期，未登录状态需要重新登录
					if(result.msg == _this.LOGIN_NOTLOGIN ){
						top.location.href = _this.loginPage;
						return false;
					}
					if(result.msg == _this.LOGIN_NOTROLE){
						return false;
					}
				}
				if(typeof callback == "function"){
					callback(result);
				}
			}
  		});
  	}
  	/**
	 * @param {Object} userInfo
	 * 保存本地用户信息
	 */
	,saveUser:function(userInfo){
  		if(userInfo){
  			sessionStorage.setItem("curUser",JSON.stringify(userInfo));
  		}
  		if(userInfo && userInfo.token){
  			sessionStorage.setItem('AUTHORIZATION',userInfo.token);
  		}
  		
  	},
	/**
	 * 删除本地保存的用户信息
	 */
	delUser:function(){
  		sessionStorage.removeItem("curUser");
  		sessionStorage.removeItem('AUTHORIZATION');
  	},
	/**
	 * 获取本地用户信息
	 */
	getUser:function(){
  		return JSON.parse(sessionStorage.getItem("curUser"));
  	},
  	/**
  	 * 登出
  	 */
  	logout:function(){
  		var _this = this;
  		_this.ajax({
  			url:_this.serverIP+"/shiro/logout"
  		},{},function(res){
  			if(res.suc){
  				_this.delUser();
  				top.location.href = _this.loginPage;
  				return false;
  			}
  		});
  	}
  });
});
