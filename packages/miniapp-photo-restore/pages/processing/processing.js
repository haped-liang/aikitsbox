/**
 * AI修复处理中页面
 * 动画步骤+情感文案，让等待变成期待
 */
Page({
  data:{
    photoPath:'',
    progress:0,
    step:0,
    steps:[
      {icon:'🔍',text:'正在分析照片...',detail:'识别照片的年代和损伤类型'},
      {icon:'🧹',text:'AI降噪处理中...',detail:'去除噪点、划痕和折痕'},
      {icon:'🎨',text:'智能上色还原...',detail:'根据年代特征恢复原始色彩'},
      {icon:'✨',text:'细节增强优化...',detail:'提升分辨率，锐化面部细节'},
      {icon:'✅',text:'修复完成！',detail:''},
    ],
    tips:[
      '每一张老照片都是一段被遗忘的时光',
      'AI正在努力还原那些泛黄的记忆',
      '当年拍这张照片的人，一定很珍惜这一刻',
      '照片会褪色，但爱不会',
      '最好的修复，是让回忆重新发光',
    ],
    currentTip:0,
  },

  onLoad(options){
    const photoPath=decodeURIComponent(options.photo);
    this.setData({photoPath});
    this.startProcessing();
  },

  startProcessing(){
    // 轮换提示语
    let tipIdx=0;
    const tipTimer=setInterval(()=>{
      tipIdx=(tipIdx+1)%this.data.tips.length;
      this.setData({currentTip:tipIdx});
    },2000);

    // 模拟处理进度（实际接入API后替换）
    let progress=0;
    let step=0;
    const timer=setInterval(()=>{
      progress+=Math.random()*15+5;
      if(progress>=100){progress=100;clearInterval(timer);clearInterval(tipTimer);}

      // 根据进度切换步骤
      if(progress>20&&step===0)step=1;
      if(progress>40&&step===1)step=2;
      if(progress>70&&step===2)step=3;
      if(progress>=100&&step===3)step=4;

      this.setData({progress:Math.min(100,Math.round(progress)),step});

      // 处理完成
      if(progress>=100){
        setTimeout(()=>{
          wx.navigateTo({url:`/pages/result/result?photo=${encodeURIComponent(this.data.photoPath)}`});
        },800);
      }
    },300);

    this.setData({_timer:timer,_tipTimer:tipTimer});
  },

  onUnload(){
    if(this.data._timer)clearInterval(this.data._timer);
    if(this.data._tipTimer)clearInterval(this.data._tipTimer);
  },
});
