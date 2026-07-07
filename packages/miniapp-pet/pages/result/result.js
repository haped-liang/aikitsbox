Page({
  data:{petType:'',duration:'',symptoms:[],causes:[],urgency:'',severity:0,homeCare:[],needVet:false,vetReason:'',isEmergency:false},
  onLoad(o){
    try{const d=JSON.parse(decodeURIComponent(o.data));this.setData(d)}catch(e){wx.showToast({title:'加载失败',icon:'none'})}
  },
  onShareAppMessage(){return{title:`我家${this.data.petType}的健康报告｜AI宠物医生`,path:'/pages/index/index'}},
});
