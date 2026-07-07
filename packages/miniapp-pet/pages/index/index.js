/**
 * 宠物症状自查首页
 * 选择宠物→勾选症状→AI分析→给出建议+紧急程度
 */
const app=getApp();

Page({
  data:{
    quota:3,
    step:1, // 1=选宠物 2=选症状 3=AI分析中
    petType:'',
    petAge:'',
    petBreed:'',
    petWeight:'',

    // 症状选择(按身体区域分组)
    symptomGroups:[
      {name:'🍽️ 饮食消化',items:['食欲不振','呕吐','腹泻','便秘','饮水量异常','吞食异物','口臭/流口水']},
      {name:'🫁 呼吸系统',items:['咳嗽','打喷嚏','流鼻涕','呼吸困难','喘气急促','鼻子干燥/龟裂']},
      {name:'🧴 皮肤毛发',items:['脱毛/斑秃','皮肤红肿','瘙痒/频繁抓挠','皮屑增多','肿块/疙瘩','耳朵异味/瘙痒']},
      {name:'👁️ 眼耳口鼻',items:['眼睛红肿/流泪','眼屎增多','耳朵耷拉','牙龈红肿','牙齿发黄/松动']},
      {name:'🏃 行为异常',items:['精神萎靡','不愿走动/跛行','异常狂躁','频繁舔舐某处','躲避主人','睡眠异常增多']},
      {name:'💩 排泄异常',items:['尿频/尿急','尿血','排便困难','肛门腺异常','随地排泄（已训练）']},
    ],
    selectedSymptoms:[],
    duration:'',  // 症状持续多久
    extraNote:'',

    // 结果
    isAnalyzing:false,
    result:null,
    petTypes:app.globalData.petTypes,
    durations:['今天刚开始','1-3天','3-7天','1周以上','反复出现'],
  },

  onShow(){this.setData({quota:app.getQuota()})},

  // 选择宠物类型
  selectPet(e){this.setData({petType:e.currentTarget.dataset.type,step:2})},

  // 填写基本信息
  onAgeInput(e){this.setData({petAge:e.detail.value})},
  onBreedInput(e){this.setData({petBreed:e.detail.value})},
  onWeightInput(e){this.setData({petWeight:e.detail.value})},

  // 勾选/取消症状
  toggleSymptom(e){
    const s=e.currentTarget.dataset.symptom;
    let selected=[...this.data.selectedSymptoms];
    const idx=selected.indexOf(s);
    idx>-1?selected.splice(idx,1):selected.push(s);
    this.setData({selectedSymptoms:selected});
  },

  // 选择持续时间
  selectDuration(e){this.setData({duration:e.currentTarget.dataset.d})},
  onNoteInput(e){this.setData({extraNote:e.detail.value})},

  // 开始分析
  async startAnalysis(){
    const {selectedSymptoms,petType,duration}=this.data;
    if(!petType){wx.showToast({title:'请先选择宠物类型',icon:'none'});return}
    if(!selectedSymptoms.length){wx.showToast({title:'请至少选择一个症状',icon:'none'});return}
    if(!app.useQuota()){wx.showToast({title:'今日免费次数用完，明天再来',icon:'none'});return}

    this.setData({isAnalyzing:true,quota:app.getQuota()});
    wx.vibrateShort({type:'medium'});

    // 紧急症状检测(本地规则，不依赖AI)
    const emergencySigns=['呼吸困难','尿血','吞食异物','异常狂躁'];
    const isEmergency=selectedSymptoms.some(s=>emergencySigns.includes(s));

    try{
      const result=await this.aiAnalyze();
      result.isEmergency=isEmergency;
      this.setData({result,isAnalyzing:false});

      wx.navigateTo({url:`/pages/result/result?data=${encodeURIComponent(JSON.stringify({
        ...result,petType,duration,selectedSymptoms
      }))}`});
    }catch(e){
      wx.showToast({title:'分析失败，请重试',icon:'none'});
      this.setData({isAnalyzing:false});
    }
  },

  // AI分析(模拟)
  async aiAnalyze(){
    await new Promise(r=>setTimeout(r,1500));
    const {selectedSymptoms}=this.data;
    return {
      possibleCauses:['饮食不当/食物过敏','细菌/真菌感染','环境应激反应'],
      urgencyLevel:selectedSymptoms.length>3?'⚠️ 建议尽快就医':'🟡 建议持续观察',
      severity:selectedSymptoms.length>3?7:4, // 1-10
      homeCare:['保持充足饮水，观察精神状态','暂停喂食新零食/新粮，回归日常饮食','检查居住环境温湿度是否适宜','记录症状变化，拍照留档'],
      needVet:selectedSymptoms.length>3||selectedSymptoms.includes('呼吸困难'),
      vetReason:selectedSymptoms.length>3?'多项症状同时出现，建议专业诊断':'',
    };
  },

  // 返回上一步
  back(){this.setData({step:Math.max(1,this.data.step-1),selectedSymptoms:[],duration:'',extraNote:''})},

  reset(){this.setData({step:1,petType:'',selectedSymptoms:[],duration:'',extraNote:'',result:null})},
});
