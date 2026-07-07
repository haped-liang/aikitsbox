/**
 * 疫苗提醒页
 * 选择宠物类型 → 自动生成疫苗接种时间表 → 到期提醒
 */
Page({
  data:{
    petType:'',
    petBirth:'',
    schedules:{
      '🐶 狗狗':[
        {name:'犬瘟热疫苗',age:'6-8周',note:'第一针',done:false},
        {name:'犬细小病毒疫苗',age:'6-8周',note:'第一针，通常与犬瘟热联苗',done:false},
        {name:'犬瘟热+细小 加强针',age:'10-12周',note:'第二针联苗',done:false},
        {name:'狂犬病疫苗',age:'12-16周',note:'法定必须接种',done:false},
        {name:'犬瘟热+细小 年度加强',age:'每年',note:'此后每年加强一次',done:false},
        {name:'狂犬病 年度加强',age:'每年',note:'此后每年一次（部分地区要求）',done:false},
      ],
      '🐱 猫猫':[
        {name:'猫三联(猫瘟+疱疹+杯状)',age:'6-8周',note:'第一针',done:false},
        {name:'猫三联加强针',age:'10-12周',note:'第二针',done:false},
        {name:'狂犬病疫苗',age:'12-16周',note:'法定/建议接种',done:false},
        {name:'猫三联 年度加强',age:'每年',note:'此后每年加强一次',done:false},
      ],
      '🐰 兔兔':[
        {name:'兔病毒性出血症疫苗',age:'10-12周',note:'兔瘟疫苗',done:false},
        {name:'巴氏杆菌疫苗',age:'10-12周',note:'建议接种',done:false},
      ],
    },
    showSchedule:false,
    currentSchedule:[],
  },

  selectPet(e){
    const pt=e.currentTarget.dataset.type;
    const schedule=this.data.schedules[pt]||[];
    this.setData({petType:pt,showSchedule:true,currentSchedule:schedule});
  },

  toggleDone(e){
    const idx=e.currentTarget.dataset.idx;
    const schedule=[...this.data.currentSchedule];
    schedule[idx].done=!schedule[idx].done;
    this.setData({currentSchedule:schedule});
  },
});
