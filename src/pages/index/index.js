//index.js
//获取应用实例
var app = getApp()
Page({
  data: {
    j:1,
    source:['','',''],
    userInfo: {},
    sum: 0,
    items: [
      {name: 'news', value: '新闻'},
      {name: 'interesting', value: '趣事'},
      {name: 'lost', value: '失物'},
      {name: 'other', value: '其它'},
    ]
  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },

  onLoad: function () {
    console.log('onLoad')
    var that = this
    //调用应用实例的方法获取全局数据
    app.getUserInfo(function(userInfo){
      //更新数据
      that.setData({
        userInfo:userInfo
      })
    })
  },

   addImage: function() {//添加图片
     var that=this;
     wx.chooseImage({
     count: 3-that.data.sum,
     sizeType: ['original'],
     sourceType: ['album', 'camera'],
     success: function (res) {
        var tempFilePaths = res.tempFilePaths;
        if(that.data.sum == 2){//有两张图片时
          that.data.sum = 3;
          that.data.source[2] = tempFilePaths[0];
          that.setData({
            sum:3,
            source:that.data.source
          })
        }
        if(that.data.sum == 1){//只有一张图片时
          that.data.sum = tempFilePaths.length+1;
          that.data.source[1] = tempFilePaths[0];
          if(tempFilePaths.length > 1){
            that.data.source[2] = tempFilePaths[1];
          }
          that.setData({
            sum:that.data.sum,
            source:that.data.source
          })
        }
        if(that.data.sum == 0){//没有图片时
          that.setData({
            sum:tempFilePaths.length,
            source:tempFilePaths
          })
        }
        },
      })
   },
   
   changeImage0: function(){//改变第一张图片
     var that = this;
     that.changeOneImage(0);
   },

   changeImage1: function(){//改变第二张图片
     var that = this;
     that.changeOneImage(1);
   },

   changeImage2: function(){//改变第三张图片
     var that = this;
     that.changeOneImage(2);
   },

   changeOneImage: function(Nub){//改变一张图片
     var that=this;
     wx.chooseImage({
       count: 1,
       sizeType: ['original'],
       sourceType: ['album', 'camera'],
       success: function (res) {
         var tempFilePaths = res.tempFilePaths;
         that.data.source[Nub]=tempFilePaths[0];
         that.setData({
           source:that.data.source
         })
       },
     })
   },

   uploadImage: function(i){//上传图片
     var that = this;
     wx.uploadFile({
      url: 'https://scutweixie.cc/submission', //这里路径可能不对
      filePath: that.data.source[i],
      name: 'image',
      success: function(res){
        i++;
        if(i<that.data.source.length){
          that.uploadImage(i)
        }
      }
    })
   },

   formSubmit: function(e) {//提交
    var that = this;
    if(e.detail.value.input.length == 0||e.detail.value.radioGroup.length==0){
      console.log('类别及投稿内容不能为空')
      }
    else{
      wx.request({//POST
      url: 'https://scutweixie.cc/submission/submission.php',
      header: { 
       "Content-Type": "application/x-www-form-urlencoded"
      },
      method: "POST",
      data:{
        select:e.detail.value.radioGroup,
        input:e.detail.value.input
      },
      success: function(res){//上传成功
        console.log('form发生了submit事件，携带数据为：',e.detail.value);
        wx.redirectTo({
          url: '../index/success'//跳转到成功提交的页面
        });
        if(that.data.sum>0)//有图片时上传图片
          that.uploadImage(0);
        },
      fail: function(res){//上传失败
        console.log("fail")
        }
      })
    }
  }
})
