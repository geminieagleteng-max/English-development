import type { Word } from './types';

export const wordDatabase: Word[] = [
  // Technology
  {
    id: 't1',
    word: 'artificial',
    phonetic: '[ˌɑːrtɪˈfɪʃl]',
    translation: '人工的、人造的',
    example: 'Scientists are developing artificial intelligence to help doctor diagnose illnesses.',
    exampleTranslation: '科學家正在開發人工智慧，以幫助醫生診斷疾病。',
    theme: '科技與資訊'
  },
  {
    id: 't2',
    word: 'device',
    phonetic: '[dɪˈvaɪs]',
    translation: '裝置、設備',
    example: 'A smartphone is a pocket-sized device that connects us to the entire world.',
    exampleTranslation: '智慧型手機是一款口袋大小的裝置，將我們與整個世界連接起來。',
    theme: '科技與資訊'
  },
  {
    id: 't3',
    word: 'digital',
    phonetic: '[ˈdɪdʒɪtl]',
    translation: '數位的、數碼的',
    example: 'Many students prefer reading digital textbooks on their tablets.',
    exampleTranslation: '許多學生更喜歡在平板電腦上閱讀數位教科書。',
    theme: '科技與資訊'
  },
  {
    id: 't4',
    word: 'innovation',
    phonetic: '[ˌɪnəˈveɪʃn]',
    translation: '創新、改革',
    example: 'Technological innovation has changed the way we communicate with others.',
    exampleTranslation: '科技創新改變了我們與他人溝通的方式。',
    theme: '科技與資訊'
  },
  {
    id: 't5',
    word: 'software',
    phonetic: '[ˈsɔːftwer]',
    translation: '軟體',
    example: 'You need to update the antivirus software to protect your computer.',
    exampleTranslation: '你需要更新防毒軟體以保護你的電腦。',
    theme: '科技與資訊'
  },
  {
    id: 't6',
    word: 'database',
    phonetic: '[ˈdeɪtəbeɪs]',
    translation: '資料庫',
    example: 'All customer records are stored securely in our centralized database.',
    exampleTranslation: '所有客戶記錄都安全地儲存在我們的中央資料庫中。',
    theme: '科技與資訊'
  },
  {
    id: 't7',
    word: 'virtual',
    phonetic: '[ˈvɜːrtʃuəl]',
    translation: '虛擬的、實質上的',
    example: 'The museum offers a virtual tour for visitors who cannot travel there in person.',
    exampleTranslation: '該博物館為無法親自前往的遊客提供虛擬導覽。',
    theme: '科技與資訊'
  },
  {
    id: 't8',
    word: 'automatic',
    phonetic: '[ˌɔːtəˈmætɪk]',
    translation: '自動的',
    example: 'The glass doors are automatic and open as you walk toward them.',
    exampleTranslation: '這些玻璃門是自動的，當你走向它們時會打開。',
    theme: '科技與資訊'
  },
  {
    id: 't9',
    word: 'interactive',
    phonetic: '[ˌɪntərˈæktɪv]',
    translation: '互動的',
    example: 'The exhibition features many interactive displays that kids love to play with.',
    exampleTranslation: '該展覽有許多孩子們喜歡玩的互動展示。',
    theme: '科技與資訊'
  },
  {
    id: 't10',
    word: 'algorithm',
    phonetic: '[ˈælɡərɪðəm]',
    translation: '演算法',
    example: 'Social media networks use a complex algorithm to decide what posts you see.',
    exampleTranslation: '社群媒體網路使用複雜的演算法來決定你看到哪些貼文。',
    theme: '科技與資訊'
  },

  // Medical
  {
    id: 'm1',
    word: 'symptom',
    phonetic: '[ˈsɪmptəm]',
    translation: '症狀、徵兆',
    example: 'A high fever and a dry cough are common symptoms of a flu.',
    exampleTranslation: '高燒和乾咳是流感常見的症狀。',
    theme: '醫療與健康'
  },
  {
    id: 'm2',
    word: 'disease',
    phonetic: '[dɪˈziːz]',
    translation: '疾病',
    example: 'Washing your hands regularly is a simple way to prevent the spread of disease.',
    exampleTranslation: '定期洗手是預防疾病傳播的簡單方法。',
    theme: '醫療與健康'
  },
  {
    id: 'm3',
    word: 'therapy',
    phonetic: '[ˈθerəpi]',
    translation: '治療、療法',
    example: 'Music therapy is increasingly used to help patients manage anxiety and stress.',
    exampleTranslation: '音樂療法越來越多地被用於幫助患者管理焦慮和壓力。',
    theme: '醫療與健康'
  },
  {
    id: 'm4',
    word: 'vaccine',
    phonetic: '[vækˈsiːn]',
    translation: '疫苗',
    example: 'The development of the polio vaccine saved millions of lives worldwide.',
    exampleTranslation: '小兒麻痺疫苗的開發拯救了全球數百萬人的生命。',
    theme: '醫療與健康'
  },
  {
    id: 'm5',
    word: 'patient',
    phonetic: '[ˈpeɪʃnt]',
    translation: '病人、有耐心的',
    example: 'The nurse took care of the elderly patient with great kindness.',
    exampleTranslation: '護士非常親切地照顧那位年長的老病人。',
    theme: '醫療與健康'
  },
  {
    id: 'm6',
    word: 'prescription',
    phonetic: '[prɪˈskrɪpʃn]',
    translation: '處方、藥方',
    example: 'You cannot buy this medicine without a doctor\'s prescription.',
    exampleTranslation: '沒有醫生的處方，你不能購買這種藥物。',
    theme: '醫療與健康'
  },
  {
    id: 'm7',
    word: 'immunity',
    phonetic: '[ɪˈmjuːnəti]',
    translation: '免疫力、免除',
    example: 'A healthy diet and regular exercise can help boost your body\'s immunity.',
    exampleTranslation: '健康的飲食和規律的運動有助於增強你身體的免疫力。',
    theme: '醫療與健康'
  },
  {
    id: 'm8',
    word: 'infection',
    phonetic: '[ɪnˈfekʃn]',
    translation: '感染、傳染病',
    example: 'Keep the cut clean and covered to prevent a bacterial infection.',
    exampleTranslation: '保持傷口清潔並覆蓋，以防止細菌感染。',
    theme: '醫療與健康'
  },
  {
    id: 'm9',
    word: 'allergic',
    phonetic: '[əˈlɜːrdʒɪk]',
    translation: '過敏的',
    example: 'My brother is severely allergic to peanuts and always carries medicine.',
    exampleTranslation: '我弟弟對花生嚴重過敏，總是隨身攜帶藥物。',
    theme: '醫療與健康'
  },
  {
    id: 'm10',
    word: 'diagnosis',
    phonetic: '[ˌdaɪəɡˈnoʊsɪs]',
    translation: '診斷',
    example: 'Early diagnosis of the illness increases the chances of a successful cure.',
    exampleTranslation: '疾病的早期診斷增加了成功治癒的機會。',
    theme: '醫療與健康'
  },

  // Business
  {
    id: 'b1',
    word: 'contract',
    phonetic: '[ˈkɑːntrækt]',
    translation: '合約、合同、收縮',
    example: 'Before you sign the rental contract, please read all terms carefully.',
    exampleTranslation: '在您簽署租賃合約之前，請仔細閱讀所有條款。',
    theme: '商業與經濟'
  },
  {
    id: 'b2',
    word: 'budget',
    phonetic: '[ˈbʌdʒɪt]',
    translation: '預算',
    example: 'Our company has a tight budget for advertising this quarter.',
    exampleTranslation: '本季度我們公司的廣告預算很緊張。',
    theme: '商業與經濟'
  },
  {
    id: 'b3',
    word: 'consumer',
    phonetic: '[kənˈsuːmər]',
    translation: '消費者',
    example: 'Consumers are demanding healthier food options in supermarkets.',
    exampleTranslation: '消費者要求超市提供更健康的食物選擇。',
    theme: '商業與經濟'
  },
  {
    id: 'b4',
    word: 'marketing',
    phonetic: '[ˈmɑːrkɪtɪŋ]',
    translation: '行銷、市場推廣',
    example: 'Social media has become an essential tool for modern marketing.',
    exampleTranslation: '社群媒體已成為現代行銷不可或缺的工具。',
    theme: '商業與經濟'
  },
  {
    id: 'b5',
    word: 'revenue',
    phonetic: '[ˈrevənuː]',
    translation: '收入、收益、稅收',
    example: 'The new mobile game generated millions of dollars in revenue in its first week.',
    exampleTranslation: '這款新的手機遊戲在第一週就產生了數百萬美元的收入。',
    theme: '商業與經濟'
  },
  {
    id: 'b6',
    word: 'negotiate',
    phonetic: '[nɪˈɡoʊʃieɪt]',
    translation: '談判、協商',
    example: 'The labor union is trying to negotiate a higher salary for workers.',
    exampleTranslation: '工會正試圖為工人們協商更高的薪資。',
    theme: '商業與經濟'
  },
  {
    id: 'b7',
    word: 'finance',
    phonetic: '[ˈfaɪnæns]',
    translation: '金融、財務、提供資金',
    example: 'She decided to study international finance at university.',
    exampleTranslation: '她決定在大學學習國際金融。',
    theme: '商業與經濟'
  },
  {
    id: 'b8',
    word: 'asset',
    phonetic: '[ˈæset]',
    translation: '資產、有價值的東西',
    example: 'A good education is a valuable asset that stays with you forever.',
    exampleTranslation: '良好的教育是一項寶貴的資產，會永遠伴隨著你。',
    theme: '商業與經濟'
  },
  {
    id: 'b9',
    word: 'corporate',
    phonetic: '[ˈkɔːrpərət]',
    translation: '公司的、企業的',
    example: 'He decided to leave the corporate world and start his own small bakery.',
    exampleTranslation: '他決定離開公司企業界，開始經營自己的小麵包店。',
    theme: '商業與經濟'
  },
  {
    id: 'b10',
    word: 'currency',
    phonetic: '[ˈkɜːrənsi]',
    translation: '貨幣、通用性',
    example: 'When traveling to Japan, you need to exchange your money for Japanese currency.',
    exampleTranslation: '去日本旅遊時，你需要把錢兌換成日本貨幣。',
    theme: '商業與經濟'
  },

  // Daily Life
  {
    id: 'd1',
    word: 'appliance',
    phonetic: '[əˈlaɪəns]',
    translation: '家用電器、裝置',
    example: 'Modern kitchen appliances like dishwashers make housework much easier.',
    exampleTranslation: '洗碗機等現代廚房電器讓家務變得輕鬆得多。',
    theme: '日常生活與休閒'
  },
  {
    id: 'd2',
    word: 'grocery',
    phonetic: '[ˈɡroʊsəri]',
    translation: '雜貨、食品雜貨店',
    example: 'My mother goes to the grocery store every Sunday to buy fresh vegetables.',
    exampleTranslation: '我母親每星期天去雜貨店買新鮮蔬菜。',
    theme: '日常生活與休閒'
  },
  {
    id: 'd3',
    word: 'furniture',
    phonetic: '[ˈfɜːrnɪtʃər]',
    translation: '家具',
    example: 'They bought some wooden furniture, including a dining table and chairs.',
    exampleTranslation: '他們買了一些木製家具，包括一張餐桌和椅子。',
    theme: '日常生活與休閒'
  },
  {
    id: 'd4',
    word: 'recipe',
    phonetic: '[ˈresəpi]',
    translation: '食譜、秘訣',
    example: 'This chocolate cake recipe is very simple and easy to follow.',
    exampleTranslation: '這個巧克力蛋糕食譜非常簡單，很容易照著做。',
    theme: '日常生活與休閒'
  },
  {
    id: 'd5',
    word: 'commute',
    phonetic: '[kəˈmjuːt]',
    translation: '通勤、減刑',
    example: 'My father commutes to Taipei by train every morning.',
    exampleTranslation: '我父親每天早上搭火車通勤到台北。',
    theme: '日常生活與休閒'
  },
  {
    id: 'd6',
    word: 'leisure',
    phonetic: '[ˈliːʒər]',
    translation: '閒暇、悠閒',
    example: 'In her leisure time, she enjoys painting landscapes and reading novels.',
    exampleTranslation: '在閒暇時間，她喜歡畫風景畫和看小說。',
    theme: '日常生活與休閒'
  },
  {
    id: 'd7',
    word: 'routine',
    phonetic: '[ruːˈtiːn]',
    translation: '例行公事、常規',
    example: 'Exercising in the morning has become part of my daily routine.',
    exampleTranslation: '早晨運動已經成為我日常生活的一部分。',
    theme: '日常生活與休閒'
  },
  {
    id: 'd8',
    word: 'chore',
    phonetic: '[tʃɔːr]',
    translation: '雜務、日常零星工作',
    example: 'Doing the dishes is my least favorite household chore.',
    exampleTranslation: '洗碗是我最不喜歡的家事雜務。',
    theme: '日常生活與休閒'
  },
  {
    id: 'd9',
    word: 'utility',
    phonetic: '[juːˈtɪləti]',
    translation: '實用、效用、水電瓦斯費(常複數)',
    example: 'The monthly rent includes utility bills such as electricity and water.',
    exampleTranslation: '月租金包括電費、水費等公共事業水電費用。',
    theme: '日常生活與休閒'
  },
  {
    id: 'd10',
    word: 'resident',
    phonetic: '[ˈrezɪdənt]',
    translation: '居民、住院醫生',
    example: 'Local residents complained about the noise from the construction site.',
    exampleTranslation: '當地居民抱怨來自建築工地的噪音。',
    theme: '日常生活與休閒'
  },

  // Academic
  {
    id: 'a1',
    word: 'curriculum',
    phonetic: '[kəˈrɪkjələm]',
    translation: '課程、全部課程',
    example: 'The high school curriculum includes mathematics, science, and literature.',
    exampleTranslation: '高中課程包括數學、科學和文學。',
    theme: '學術與教育'
  },
  {
    id: 'a2',
    word: 'analysis',
    phonetic: '[əˈnæləsɪs]',
    translation: '分析',
    example: 'The research team did a careful analysis of the water quality data.',
    exampleTranslation: '研究團隊對水質數據進行了仔細分析。',
    theme: '學術與教育'
  },
  {
    id: 'a3',
    word: 'philosophy',
    phonetic: '[fəˈlɑːsəfi]',
    translation: '哲學、人生觀',
    example: 'Greek philosophy has had a profound influence on Western thinking.',
    exampleTranslation: '希臘哲學對西方思考產生了深遠的影響。',
    theme: '學術與教育'
  },
  {
    id: 'a4',
    word: 'theory',
    phonetic: '[ˈθiːəri]',
    translation: '理論、學說',
    example: 'Einstein is famous for developing the theory of relativity.',
    exampleTranslation: '愛因斯坦以創立相對論學說而聞名。',
    theme: '學術與教育'
  },
  {
    id: 'a5',
    word: 'assignment',
    phonetic: '[əˈsaɪnmənt]',
    translation: '作業、分配的工作',
    example: 'We must submit our history assignment before Friday afternoon.',
    exampleTranslation: '我們必須在星期五下午之前交歷史作業。',
    theme: '學術與教育'
  },
  {
    id: 'a6',
    word: 'evaluate',
    phonetic: '[ɪˈvæljueɪt]',
    translation: '評估、評價',
    example: 'Teachers use exams and projects to evaluate students\' progress.',
    exampleTranslation: '教師使用考試和專題來評估學生的進步情況。',
    theme: '學術與教育'
  },
  {
    id: 'a7',
    word: 'hypothesis',
    phonetic: '[haɪˈpɑːθəsɪs]',
    translation: '假設、假說',
    example: 'The scientists conducted experiments to test their scientific hypothesis.',
    exampleTranslation: '科學家們進行了實驗以檢驗他們的科學假設。',
    theme: '學術與教育'
  },
  {
    id: 'a8',
    word: 'scholarship',
    phonetic: '[ˈskɑːlərʃɪp]',
    translation: '獎學金、學術研究',
    example: 'She won a full scholarship to study chemistry at a top university.',
    exampleTranslation: '她贏得了全額獎學金，得以前往頂尖大學學習化學。',
    theme: '學術與教育'
  },
  {
    id: 'a9',
    word: 'discipline',
    phonetic: '[ˈdɪsəplın]',
    translation: '學科、紀律、訓練',
    example: 'Physics is a difficult discipline that requires strong mathematical skills.',
    exampleTranslation: '物理學是一門需要極強數學能力的困難學科。',
    theme: '學術與教育'
  },
  {
    id: 'a10',
    word: 'campus',
    phonetic: '[ˈkæmpəs]',
    translation: '校園',
    example: 'Our university campus is very beautiful, with many trees and a lake.',
    exampleTranslation: '我們的大學校園非常美麗，有許多樹木和一個湖泊。',
    theme: '學術與教育'
  },

  // Nature
  {
    id: 'n1',
    word: 'ecosystem',
    phonetic: '[ˈiːkoʊsɪstəm]',
    translation: '生態系統',
    example: 'The coral reef is a delicate ecosystem supporting thousands of marine species.',
    exampleTranslation: '珊瑚礁是一個脆弱的生態系統，支持著成千上萬的海洋物種。',
    theme: '自然與環境'
  },
  {
    id: 'n2',
    word: 'climate',
    phonetic: '[ˈklaɪmət]',
    translation: '氣候',
    example: 'Climate change is causing global temperatures to rise every year.',
    exampleTranslation: '氣候變遷正在導致全球氣溫逐年上升。',
    theme: '自然與環境'
  },
  {
    id: 'n3',
    word: 'conservation',
    phonetic: '[ˌkɑːnsərˈveɪʃn]',
    translation: '保護、保存、保育',
    example: 'Wildlife conservation is essential to protect endangered species from extinction.',
    exampleTranslation: '野生動物保育對於保護瀕危物種免於滅絕至關重要。',
    theme: '自然與環境'
  },
  {
    id: 'n4',
    word: 'species',
    phonetic: '[ˈspiːʃiːz]',
    translation: '物種、種類',
    example: 'Scientists discovered several new species of insects in the tropical rainforest.',
    exampleTranslation: '科學家在熱帶雨林中發現了幾種新的昆蟲物種。',
    theme: '自然與環境'
  },
  {
    id: 'n5',
    word: 'pollution',
    phonetic: '[pəˈluːʃn]',
    translation: '污染',
    example: 'Air pollution in the city can cause respiratory problems for children.',
    exampleTranslation: '城市中的空氣污染會導致兒童呼吸道問題。',
    theme: '自然與環境'
  },
  {
    id: 'n6',
    word: 'glacier',
    phonetic: '[ˈɡleɪʃər]',
    translation: '冰河、冰川',
    example: 'Many mountain glaciers are melting rapidly due to warming global temperatures.',
    exampleTranslation: '由於全球氣溫變暖，許多高山冰河正在迅速融化。',
    theme: '自然與環境'
  },
  {
    id: 'n7',
    word: 'sustainable',
    phonetic: '[səˈsteɪnəbl]',
    translation: '永續的、可持續的',
    example: 'Using solar energy is a sustainable way to power our homes.',
    exampleTranslation: '使用太陽能是為我們家園供電的永續方式。',
    theme: '自然與環境'
  },
  {
    id: 'n8',
    word: 'atmosphere',
    phonetic: '[ˈætməsfɪr]',
    translation: '大氣層、氣氛',
    example: 'The Earth\'s atmosphere protects us from harmful solar radiation.',
    exampleTranslation: '地球的大氣層保護我們免受有害太陽輻射。',
    theme: '自然與環境'
  },
  {
    id: 'n9',
    word: 'biodiversity',
    phonetic: '[ˌbaɪoʊdaɪˈvɜːrsəti]',
    translation: '生物多樣性',
    example: 'The preservation of biodiversity is key to maintaining ecological balance.',
    exampleTranslation: '保護生物多樣性是維持生態平衡的關鍵。',
    theme: '自然與環境'
  },
  {
    id: 'n10',
    word: 'extinct',
    phonetic: '[ɪkˈstɪŋkt]',
    translation: '絕種的、滅絕的',
    example: 'Dinosaurs became extinct millions of years ago, possibly due to an asteroid.',
    exampleTranslation: '恐龍在數百萬年前滅絕，可能是由於一顆小行星。',
    theme: '自然與環境'
  },

  // Food & Culture
  {
    id: 'f1',
    word: 'cuisine',
    phonetic: '[kwɪˈziːn]',
    translation: '料理、烹飪',
    example: 'Italian cuisine is famous around the world for its pizza and pasta.',
    exampleTranslation: '義大利料理以披薩和義大利麵聞名於世。',
    theme: '餐飲與文化'
  },
  {
    id: 'f2',
    word: 'heritage',
    phonetic: '[ˈherɪtɪdʒ]',
    translation: '遺產、繼承物',
    example: 'We must protect our cultural heritage, including historic temples and customs.',
    exampleTranslation: '我們必須保護我們的文化遺產，包括歷史悠久的寺廟和習俗。',
    theme: '餐飲與文化'
  },
  {
    id: 'f3',
    word: 'custom',
    phonetic: '[ˈkʌstəm]',
    translation: '風俗、習慣',
    example: 'It is a local custom to remove your shoes before entering someone\'s house.',
    exampleTranslation: '在進入別人家之前脫鞋是當地的風俗。',
    theme: '餐飲與文化'
  },
  {
    id: 'f4',
    word: 'tradition',
    phonetic: '[trəˈdɪʃn]',
    translation: '傳統',
    example: 'According to tradition, family members gather together for Chinese New Year.',
    exampleTranslation: '按照傳統，家庭成員會在農曆新年聚在一起。',
    theme: '餐飲與文化'
  },
  {
    id: 'f5',
    word: 'festival',
    phonetic: '[ˈfestɪvl]',
    translation: '節日、節慶',
    example: 'The Dragon Boat Festival is celebrated with exciting races and rice dumplings.',
    exampleTranslation: '人們用精彩的划龍舟賽和吃粽子來慶祝端午節。',
    theme: '餐飲與文化'
  },
  {
    id: 'f6',
    word: 'nutrition',
    phonetic: '[nuːˈtrɪʃn]',
    translation: '營養',
    example: 'Good nutrition is essential for growing children to develop properly.',
    exampleTranslation: '良好的營養對於發育中的兒童正常成長至關重要。',
    theme: '餐飲與文化'
  },
  {
    id: 'f7',
    word: 'diversity',
    phonetic: '[daɪˈvɜːrsəti]',
    translation: '多樣性、差異',
    example: 'Cultural diversity makes our society more interesting and vibrant.',
    exampleTranslation: '文化多樣性使我們的社會變得更加有趣和充滿活力。',
    theme: '餐飲與文化'
  },
  {
    id: 'f8',
    word: 'vegetarian',
    phonetic: '[ˌvedʒəˈteriən]',
    translation: '素食的、素食者',
    example: 'She became a vegetarian three years ago for health and environmental reasons.',
    exampleTranslation: '出於健康和環境原因，她三年前成了一名素食主義者。',
    theme: '餐飲與文化'
  },
  {
    id: 'f9',
    word: 'hospitality',
    phonetic: '[ˌhɑːspɪˈtæləti]',
    translation: '熱情好客、款待',
    example: 'We were deeply touched by the warm hospitality of the local villagers.',
    exampleTranslation: '我們被當地村民熱情好客的款待深深打動。',
    theme: '餐飲與文化'
  },
  {
    id: 'f10',
    word: 'delicacy',
    phonetic: '[ˈdelɪkəsi]',
    translation: '佳佳餚、美味、精緻',
    example: 'Pineapple cake is a famous Taiwanese delicacy that tourists love to buy.',
    exampleTranslation: '鳳梨酥是台灣著名的美味佳餚，遊客們非常喜歡購買。',
    theme: '餐飲與文化'
  }
];
