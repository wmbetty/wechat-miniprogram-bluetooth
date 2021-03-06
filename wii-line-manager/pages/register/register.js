var app = getApp();
var md5 = require('../../comm/script/md5.js');
Page({
    data: {
        phone:'',
        checkCode:'',
        isShowCheckcode:true,
        isGetCheckCode:false,
        timeCount:60,
        timeStamp:0
    },
    onLoad:function(option){

    },
    submit: function(e) {
        if (e.timeStamp-this.data.timeStamp<2000) {return}
        this.setData({
          timeStamp:e.timeStamp
        });
        var that = this;
        var appValue = app.globalData.app;
        var platform = app.globalData.platform;
        var ver = app.globalData.ver;
        if (this.data.phone&&this.data.checkCode) {
            wx.request({
                url: app.globalData.url+'/bkSmsCode/bkSmsCodeCheck?sid='+this.data.sid,
                method:'POST',
                data: {
                    'mobilePhone':this.data.phone,
                    'code':md5(this.data.checkCode),
                    'app':appValue,
                    'platform':platform,
                    'ver':ver
                },
                header: {
                    'content-type': 'application/x-www-form-urlencoded'
                },
                success: function(res) {
                    if (res.data.code=="10000") {
                        wx.navigateTo({
                            url: '../register2/register2?phone='+that.data.phone
                        });
                    }else{
                        wx.showModal({
                            title: '提示',
                            content: '验证码输入错误',
                            showCancel:false,
                            success: function(res) {
                              if (res.confirm) {
                                console.log('用户点击确定')
                              }
                            }
                        })
                    }
                }
            })
        }else{
            wx.showModal({
                title: '提示',
                content: '手机号.密码.验证码不能为空',
                showCancel:false,
                success: function(res) {
                  if (res.confirm) {
                    console.log('用户点击确定')
                  }
                }
            })
        }
    },
    getCheckCode: function(e){
        var that = this;
        var appValue = app.globalData.app;
        var platform = app.globalData.platform;
        var ver = app.globalData.ver;
        var phone = this.data.phone;
        if (this.data.isGetCheckCode) {return false;}
        if (/^(13[0-9]|14[5|7]|15[0|1|2|3|5|6|7|8|9]|18[0|1|2|3|5|6|7|8|9])\d{8}$/.test(phone)) {
            wx.request({
                url: app.globalData.url+'/customer/phoneVerify?sid='+this.data.sid,
                method:'POST',
                data: {
                    'mobilePhone':phone,
                    'app':appValue,
                    'platform':platform,
                    'ver':ver
                },
                header: {
                    'content-type': 'application/x-www-form-urlencoded'
                },
                success: function(res) {
                    if (res.data.code=="10000") {
                        wx.request({
                            url: app.globalData.url+'/bkSmsCode/bkSmsCodeSend?sid='+that.data.sid,
                            method:'POST',
                            data: {
                                'mobilePhone':phone,
                                'app':appValue,
                                'platform':platform,
                                'ver':ver
                            },
                            header: {
                                'content-type': 'application/x-www-form-urlencoded'
                            },
                            success: function(res) {
                                if (res.data.code=="10000") {
                                    that.setData({
                                        isGetCheckCode:true,
                                        timeCount:60
                                    });
                                    var timer = setInterval(function(){
                                        var a = --that.data.timeCount;
                                        if (a>=1) {
                                            that.setData({
                                                timeCount:a
                                            });
                                        }else{
                                            that.setData({
                                                isGetCheckCode:false,
                                                timeCount:60
                                            });
                                            clearInterval(timer);
                                        }
                                    },1000);
                                }else{
                                    wx.showToast({
                                        title: '获取验证码失败',
                                        icon: 'fail',
                                        duration: 2000
                                    })
                                }
                            }
                        })
                    }else{
                        wx.showToast({
                            title: '该手机号已注册',
                            icon: 'fail',
                            duration: 2000
                        })
                    }
                }
            })

        }else{
            wx.showModal({
                title: '提示',
                content: '请输入正确的手机号',
                showCancel:false,
                success: function(res) {
                  if (res.confirm) {
                    console.log('用户点击确定')
                  }
                }
            })
        }
    },
    bindPhone:function(e){
        var value = e.detail.value;
        this.setData({
            phone : value
        });
    },
    bindCheckCode:function(e){
        var value = e.detail.value;
        this.setData({
            checkCode : value
        });
    },
    goLogin:function(e){
        wx.redirectTo({
            url:"../../pages/login/login"
        })
    }
})