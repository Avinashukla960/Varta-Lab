/* =====================================================================
   VARTALAB — seed data: skills, lessons, users, contests, communities, events
   (extracted from the original single-file index.html; classic script,
    shares the global scope — files are loaded in numeric order)
   ===================================================================== */
/* ============ SEED DATA ============ */
const SKILLS=[
  {id:"tenses",name:"Tenses",cat:"Grammar",lv:"Core"},
  {id:"articles",name:"Articles",cat:"Grammar",lv:"Core"},
  {id:"prep",name:"Prepositions",cat:"Grammar",lv:"Core"},
  {id:"svo",name:"Sentence Structure",cat:"Grammar",lv:"Core"},
  {id:"cond",name:"Conditionals",cat:"Grammar",lv:"Advanced"},
  {id:"reported",name:"Reported Speech",cat:"Grammar",lv:"Advanced"},
  {id:"vocab",name:"Vocabulary",cat:"Lexis",lv:"Core"},
  {id:"cohesion",name:"Cohesion & Linking",cat:"Writing",lv:"Advanced"}
];

const LESSONS=[
  {id:"l-tenses",skill:"tenses",title:"Present Perfect: talking about experience",diff:"Intermediate",tag:"IELTS",
   expl:"The present perfect links the past to now. We form it with <b>have/has + past participle</b>. Use it for life experience, recent actions with a present result, and unfinished time ('so far', 'this week').",
   examples:["I have visited Goa twice.","She has just finished her homework.","We have lived here since 2020."],
   questions:[
     {q:"Choose the correct sentence.",opts:["I have went to the market.","I have gone to the market.","I has gone to the market.","I have go to the market."],a:1,expl:"The past participle of 'go' is 'gone'. 'Have' is used with 'I', giving 'I have gone'."},
     {q:"___ you ever ___ to a music festival?",opts:["Did / go","Have / been","Have / went","Has / be"],a:1,expl:"'Ever' signals life experience, so we use the present perfect 'Have you ever been'."}
   ]},
  {id:"l-articles",skill:"articles",title:"Articles: a, an, the",diff:"Beginner",tag:"General",
   expl:"Use <b>a</b> before consonant sounds, <b>an</b> before vowel sounds, and <b>the</b> when the listener already knows which thing we mean.",
   examples:["I saw a dog.","He is an engineer.","The sun rises in the east."],
   questions:[
     {q:"She bought ___ umbrella.",opts:["a","an","the","no article"],a:1,expl:"'Umbrella' starts with a vowel sound (/ʌ/), so we use 'an'."},
     {q:"I need ___ help with my homework.",opts:["a","an","the","no article"],a:3,expl:"'Help' is an uncountable noun used generally, so no article is needed."}
   ]},
  {id:"l-preps",skill:"prep",title:"Prepositions of time and place",diff:"Intermediate",tag:"IELTS",
   expl:"Use <b>in</b> for months, years and large areas; <b>on</b> for days and dates; <b>at</b> for clock times and very specific points.",
   examples:["The meeting is at 9 am.","We go on holiday in July.","I live on the second floor."],
   questions:[
     {q:"The course starts ___ Monday.",opts:["in","on","at","by"],a:1,expl:"Use 'on' for days of the week."},
     {q:"I'll see you ___ the morning.",opts:["on","at","in","for"],a:2,expl:"Use 'in' with parts of the day like the morning, afternoon and evening."}
   ]},
  {id:"l-svo",skill:"svo",title:"Word order: subject–verb–object",diff:"Beginner",tag:"General",
   expl:"English statements usually follow <b>Subject + Verb + Object</b> (SVO). Adjectives go before the noun and adverbs of frequency go before the main verb.",
   examples:["She reads books.","They often travel.","He drives a red car."],
   questions:[
     {q:"Arrange correctly: 'She / every day / English / studies'",opts:["She studies English every day.","She studies every day English.","She every day studies English.","English she studies every day."],a:0,expl:"SVO order plus time at the end: 'She studies English every day.'"}
   ]},
  {id:"l-cond",skill:"cond",title:"First & second conditionals",diff:"Advanced",tag:"IELTS",
   expl:"<b>First conditional</b> (real future): If + present, will + verb. <b>Second conditional</b> (unreal/hypothetical): If + past, would + verb.",
   examples:["If it rains, I will stay home.","If I were rich, I would travel the world."],
   questions:[
     {q:"If I ___ more time, I would learn a new language.",opts:["have","had","will have","would have"],a:1,expl:"Second conditional uses past simple in the if-clause: 'If I had more time'."}
   ]},
  {id:"l-reported",skill:"reported",title:"Reported speech",diff:"Advanced",tag:"Interview",
   expl:"When we report what someone said, we usually shift tenses back one step and change pronouns and time expressions.",
   examples:["He said, 'I am tired.' → He said he was tired.","'I will go.' → She said she would go."],
   questions:[
     {q:"She said, 'I like coffee.' → She said that she ___ coffee.",opts:["likes","liked","will like","like"],a:1,expl:"Present simple shifts back to past simple in reported speech: 'liked'."}
   ]}
];

function seedQuestions(cont){
  return [
    {q:"Which word is the correct form to complete: 'She ___ to the library every Saturday.'",type:"mcq",skill:"tenses",opts:["go","goes","going","gone"],a:1,score:1},
    {q:"Choose the correct article: 'He is ___ honest man.'",type:"mcq",skill:"articles",opts:["a","an","the","—"],a:1,score:1},
    {q:"Choose the best word to fill the gap: 'The population of the city has ___ rapidly.'",type:"mcq",skill:"vocab",opts:["grown","growing","grow","grew"],a:0,score:1},
    {q:"In the paragraph, which sentence best belongs after sentence 2?",type:"mcq",skill:"cohesion",opts:["Sentence A","Sentence B","Sentence C","Sentence D"],a:2,score:1}
  ];
}

const SEED={
  users:[
    {id:"u-admin",name:"Varta Admin",email:"admin@vartalab.in",ph:hash("admin123"),role:"admin",goal:"General English",level:"B1",vis:"public",avatar:"#4f46e5"},
    {id:"u-1",name:"Ananya S.",email:"ananya@example.com",ph:hash("pass123"),role:"user",goal:"IELTS",level:"B2",vis:"public",avatar:"#6d5efc",rating:1240,peak:1264},
    {id:"u-2",name:"Rahul M.",email:"rahul@example.com",ph:hash("pass123"),role:"user",goal:"Interview",level:"B1",vis:"public",avatar:"#0d9488",rating:1180,peak:1195},
    {id:"u-3",name:"Priya K.",email:"priya@example.com",ph:hash("pass123"),role:"user",goal:"Higher Studies",level:"C1",vis:"public",avatar:"#e11d48",rating:1320,peak:1340},
    {id:"u-4",name:"Dev P.",email:"dev@example.com",ph:hash("pass123"),role:"user",goal:"Speaking",level:"A2",vis:"public",avatar:"#f59e0b",rating:980,peak:990},
    {id:"u-5",name:"Ishita R.",email:"ishita@example.com",ph:hash("pass123"),role:"user",goal:"General English",level:"B1",vis:"public",avatar:"#16a34a",rating:1090,peak:1110},
    {id:"u-6",name:"Meera J.",email:"meera@example.com",ph:hash("pass123"),role:"user",goal:"Writing",level:"B2",vis:"public",avatar:"#7c3aed",rating:1150,peak:1160}
  ],
  achievements:[
    {id:"a-first",name:"First Step",desc:"Completed your diagnostic",ic:"🚀"},
    {id:"a-lesson10",name:"On a Roll",desc:"Completed 10 lessons",ic:"📚"},
    {id:"a-contest",name:"Arena Rookie",desc:"Joined your first IELTS Arena contest",ic:"⚔️"},
    {id:"a-week3",name:"Consistency",desc:"Practised 3 weeks in a row",ic:"🔥"},
    {id:"a-c1300",name:"1300 Club",desc:"Reached a rating of 1300",ic:"🏆"},
    {id:"a-com",name:"Community",desc:"Joined 3 CO-LAB communities",ic:"🤝"}
  ],
  contests:[
    {id:"c-now",title:"Weekly IELTS Arena #42",type:"IELTS",duration:20,start:Date.now()+2*864e5,end:Date.now()+9*864e5,status:"upcoming",rules:["20 minutes, single attempt","4 questions covering grammar, vocabulary & cohesion","Score-based rating update","Practice contest — NOT an official IELTS examination"],questions:seedQuestions("c-now")},
    {id:"c-prev1",title:"Weekly IELTS Arena #41",type:"IELTS",duration:20,start:Date.now()-7*864e5,end:Date.now()-6*864e5,status:"closed",questions:seedQuestions("c-prev1")},
    {id:"c-prev2",title:"Weekly IELTS Arena #40",type:"IELTS",duration:20,start:Date.now()-14*864e5,end:Date.now()-13*864e5,status:"closed",questions:seedQuestions("c-prev2")}
  ],
  communities:[
    {id:"com1",name:"IELTS Boosters",desc:"Weekly band-9 strategy sessions for IELTS aspirants.",goal:"IELTS",level:"B1+",moderator:"Varta Admin",members:[],sessions:[{t:"Band 7 Writing: Task 2 planning",d:"Sat · 6:00 PM IST","on":true}],feed:[{u:"Priya K.",t:"Great session on essay structure! Anyone want to form a 30-min group practice on Tuesday? 🗓️",ts:"2h"}]},
    {id:"com2",name:"Interview Prep Circle",desc:"Mock interview rounds, D-day mindset and body-language tips.",goal:"Interview",level:"Any",moderator:"Rahul M.",members:[],sessions:[{t:"Live mock interview — round 2",d:"Thu · 7:30 PM IST","on":true}],feed:[{u:"Dev P.",t:"Shared my latest mock answers, feedback appreciated! 🙏",ts:"5h"}]},
    {id:"com3",name:"Grammar-first Club",desc:"Daily grammar quirks, mini-quizzes and weak-area drills.",goal:"General English",level:"Beginner+",moderator:"Ananya S.",members:[],sessions:[],feed:[{u:"Ishita R.",t:"The article rule finally clicked after yesterday's session. 🎉",ts:"1d"}]},
    {id:"com4",name:"Speaking Squad",desc:"Practice speaking out loud and get gentle, structured feedback.",goal:"Speaking",level:"A2+",moderator:"Varta Admin",members:[],sessions:[{t:"Fluency circle — 15 min talks",d:"Sun · 5:00 PM IST","on":true}],feed:[{u:"Meera J.",t:"Recording myself each day is making a real difference. 💪",ts:"3h"}]}
  ],
  events:[
    {id:"e1",type:"Movie Discussion",title:"English Movie Discussion: 'Inside Out'",host:"Ananya S.",date:"Sun · 5:30 PM IST",mode:"Online",cap:20,desc:"Watch, discuss and debate emotions vocabulary in a friendly group.",reg:0},
    {id:"e2",type:"Debate",title:"Debate: Social media helps society",host:"Vartalab Team",date:"Sat · 4:00 PM IST",mode:"Online",cap:30,desc:"Structure your argument, use linking words and rebut a view.",reg:0},
    {id:"e3",type:"Interview Practice",title:"Mock Interview: 5-minute rounds",host:"Rahul M.",date:"Thu · 7:30 PM IST",mode:"Online",cap:12,desc:"One-to-one mock interviews with timed feedback.",reg:0},
    {id:"e4",type:"Poetry",title:"Poetry & Rhythm Evening",host:"Meera J.",date:"Wed · 6:00 PM IST",mode:"Online",cap:25,desc:"Read and perform short English poems; focus on stress and flow.",reg:0},
    {id:"e5",type:"Competition",title:"ACT-LAB Speaking Contest",host:"Vartalab Team",date:"Fri · 7:00 PM IST",mode:"Offline",cap:40,desc:"In-person speaking competition at the Vartalab centre.",reg:0},
    {id:"e6",type:"Dialogue",title:"Dialogue Cafe: Role-play scenarios",host:"Priya K.",date:"Tue · 6:30 PM IST",mode:"Online",cap:18,desc:"Simulated everyday and professional dialogues.",reg:0}
  ],
  leaderboard:[
    {id:"u-3",pts:1640},{id:"u-1",pts:1520},{id:"u-2",pts:1410},{id:"u-6",pts:1330},{id:"u-5",pts:1205},{id:"u-4",pts:1010}
  ],
  adminLog:[]
};
