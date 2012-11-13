/*
 //查询用户的朋友，即相互关注
  ！must complete setting
 */
var setting ={
  email : '',      //weibo email
  password : '',     //weibo password
  uid : ''              //the uid of  user you intend to inquiry
}
var weibo = require("weiboapi")
var EventProxy =require('eventproxy')
var proxy = new EventProxy()
proxy.assign("fans", "follow", function (fans, follow) {
	var obj = {},friends={}
    for(var i=0;i<fans.length;i++){
    	obj[fans[i].uid] = true
    }
    for(i=0;i<follow.length;i++){
    	if(obj[follow[i].uid]){
    		friends[follow[i].uid] = {
    			              fnick : follow[i].fnick ,
                              sex : follow[i].sex
                              }
    	}
    }
    debugger
})

weibo.login(setting.email,setting.password,function(err,API){
	if(!err){
		var fans = [],follow = []
		API.getFans(setting.uid,1,function(err,result){
			if(err) API.getFans(setting.uid,result.page,arguments.callee)
			else{
				if( result.page < result.count){
					fans = fans.concat(result.data)
				    API.getFans(setting.uid,result.page+1,arguments.callee)
				}else{
					proxy.trigger("fans", fans)
				}
			}
		})
		API.getFollow(setting.uid,1,function(err,result){
			if(err) {
				API.getFollow(setting.uid,result.page,arguments.callee)
			}else{
				if( result.page < result.count){
					follow = follow.concat(result.data)
				    API.getFollow(setting.uid,result.page+1,arguments.callee)
				}else{
					proxy.trigger("follow", follow)
				}
			}
		})
	}
})
