//app.js
App({
  onLaunch: function () {
    //调用API从本地缓存中获取数据
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)
     var that = this;
        wx.login({    
        success: function(res){ 
            if(res.code) {     
                wx.request({    
                    url: 'https://api.weixin.qq.com/sns/jscode2session?appid='+that.globalData.appid+'&secret='+that.globalData.secret+'&js_code='+res.code+'&grant_type=authorization_code',    
                    data: {},    
                    method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT    
                    // header: {}, // 设置请求的 header    
                    success: function(res){   
                        that.globalData.openId=res.data.openid;        
                    }    
                });  
            }else {  
                console.log('获取用户登录态失败！' + res.errMsg)  
            }            
        }    
      });   
  },
  
  getUserInfo:function(cb){
    var that = this
    if(this.globalData.userInfo){
      typeof cb == "function" && cb(this.globalData.userInfo)
    }else{
      //调用登录接口
      wx.login({
        success: function () {
          wx.getUserInfo({
            success: function (res) {
              that.globalData.userInfo = res.userInfo
              wx.request({//上传openId跟nickName
                url: 'https://scutweixie.cc/submission/submission.php',
                data: {openId:that.globalData.openId,nickName:that.globalData.userInfo.nickName},
                method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
                header: { 
               "Content-Type": "application/x-www-form-urlencoded"
                }
          })
              typeof cb == "function" && cb(that.globalData.userInfo)
            }
          })
        }
      })
      
    }
  },
  globalData:{
    appid:'wx2b47fd1eb28dc8c2',
    secret:'9d48bf8c43a50d62e3225ab429fe40af',
    userInfo:'',
    openId:''
  }
})