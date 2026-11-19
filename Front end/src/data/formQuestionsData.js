/**
 * Complete Form Questions, Branches & Options (Phase 2 - V8 Specification)
 * Derived directly from IMC Factory Challenges & Requests Specification
 */

// 1. Request Types
export const REQUEST_TYPES = [
  {
    code: 'challenge',
    label: 'عندي تحدٍ فني أو مشكلة',
    desc: 'عطل مفاجئ، فاقد إنتاج، هادر في الخامات، مشاكل صيانة أو عيوب جودة متكررة.',
    icon: '⚙️',
  },
  {
    code: 'improve',
    label: 'عايز أحسّن حاجة في المصنع',
    desc: 'زيادة الطاقة الإنتاجية، خفض استهلاك الطاقة، أتمتة مرحلة، أو رفع كفاءة خطوط التشغيل.',
    icon: '📈',
  },
  {
    code: 'idea',
    label: 'عندي فكرة منتج أو تطوير',
    desc: 'فكرة منتج جديد، تطوير خامة أو تركيبة مبتكرة، أو استغلال اقتصادي للمخلفات.',
    icon: '💡',
  },
  {
    code: 'localize',
    label: 'عايز أصنّع بديلًا مستوردًا',
    desc: 'تصنيع محلي لقطعة غيار، خامة، ماكينة، أو مكوّن بديل عن الاستيراد.',
    icon: '🏭',
  },
  {
    code: 'lab',
    label: 'محتاج فحصًا أو اختبارًا',
    desc: 'تحاليل كيميائية، اختبارات شد وصلادة، مطابقة مواصفات قياسية، أو فحص بيئي.',
    icon: '🔬',
  },
];

// 2. Challenge Areas (مشكلة فنية) - 14 Areas
export const CHALLENGE_AREAS = [
  { code: 'production', label: 'الإنتاج وكفاءة التشغيل', icon: '⚙️' },
  { code: 'machines', label: 'المعدات والهندسة الميكانيكية', icon: '🔧' },
  { code: 'electric', label: 'الكهرباء والطاقة', icon: '⚡' },
  { code: 'utilities', label: 'مرافق التشغيل والتبريد والحرارة', icon: '💨' },
  { code: 'materials', label: 'الخامات والتركيبات والكيمياء', icon: '🧪' },
  { code: 'quality', label: 'الجودة وعيوب المنتج', icon: '🎯' },
  { code: 'design', label: 'تصميم المنتج والتعبئة والتغليف', icon: '📦' },
  { code: 'automation', label: 'التحكم الآلي والرقمنة والقياس', icon: '💻' },
  { code: 'lab', label: 'المعامل والاختبارات الفنية', icon: '🔬' },
  { code: 'environment', label: 'المياه والصرف والمخلفات وكفاءة الموارد', icon: '🌱' },
  { code: 'storage', label: 'التخزين والتداول واللوجستيات الفنية', icon: '🏬' },
  { code: 'safety', label: 'السلامة الفنية وبيئة التشغيل', icon: '🦺' },
  { code: 'skills', label: 'الخبرة الفنية وإجراءات التشغيل', icon: '👥' },
  { code: 'unclear', label: 'مش قادر أحدد الجزء المتأثر', icon: '❓' },
];

// Challenge Symptoms per Area
export const CHALLENGE_SYMPTOMS = {
  production: [
    { code: 'low_output', label: 'الإنتاج أقل من المعتاد' },
    { code: 'slow_line', label: 'سرعة التشغيل أبطأ من المتوقع' },
    { code: 'micro_stops', label: 'توقفات قصيرة ومتكررة' },
    { code: 'bottleneck', label: 'انتظار أو تكدس بين مراحل الإنتاج' },
    { code: 'high_scrap', label: 'فاقد أو إعادة تشغيل كثيرة' },
    { code: 'long_changeover', label: 'تغيير المنتج أو إعداد الخط يستغرق وقتًا طويلًا' },
    { code: 'unstable_output', label: 'كمية الإنتاج تتغير من وردية لأخرى' },
  ],
  machines: [
    { code: 'machine_breakdown', label: 'ماكينة تتعطل أو تتوقف فجأة' },
    { code: 'vibration', label: 'اهتزاز أو صوت غير معتاد' },
    { code: 'overheat', label: 'سخونة أعلى من المعتاد' },
    { code: 'wear', label: 'تآكل أو تلف قطع متكرر' },
    { code: 'spare_part', label: 'قطعة غيار غير متوفرة أو لا تعيش طويلًا' },
    { code: 'machine_accuracy', label: 'الماكينة لا تحافظ على الدقة' },
    { code: 'setup_problem', label: 'ضبط الماكينة يتكرر أو يأخذ وقتًا' },
    { code: 'machine_capacity', label: 'قدرة الماكينة لا تكفي الاحتياج' },
  ],
  electric: [
    { code: 'power_outage', label: 'انقطاع الكهرباء عن المصنع أو جزء منه' },
    { code: 'machine_trip', label: 'ماكينات أو قواطع تفصل كهربائيًا' },
    { code: 'voltage', label: 'إضاءة أو جهد غير مستقر' },
    { code: 'motor_issue', label: 'موتور يسحب تيارًا أو يسخن بشكل غير طبيعي' },
    { code: 'energy_spike', label: 'استهلاك الطاقة ارتفع دون سبب واضح' },
    { code: 'power_cost', label: 'تكلفة الطاقة مرتفعة مقارنة بالإنتاج' },
    { code: 'peak_load', label: 'أحمال الذروة تسبب توقفًا أو قيودًا' },
  ],
  utilities: [
    { code: 'water_low', label: 'المياه غير كافية أو ضغطها غير ثابت' },
    { code: 'water_quality', label: 'جودة المياه تؤثر على التشغيل' },
    { code: 'steam_low', label: 'ضغط البخار أو تدفقه غير مستقر' },
    { code: 'air_compressed', label: 'الهواء المضغوط لا يكفي أو ضغطه يتغير' },
    { code: 'gas_issue', label: 'إمداد الغاز أو الوقود غير منتظم' },
    { code: 'cooling', label: 'التبريد غير كافٍ أو غير ثابت' },
    { code: 'heating', label: 'التسخين أو توزيع الحرارة غير منتظم' },
    { code: 'leak', label: 'تسرب مياه أو بخار أو هواء مضغوط' },
  ],
  materials: [
    { code: 'raw_variability', label: 'خواص الخامة تختلف من دفعة لأخرى' },
    { code: 'raw_rejection', label: 'خامة لا تحقق المواصفات المطلوبة' },
    { code: 'formulation', label: 'تركيبة المادة أو نسب الخلط لا تعطي النتيجة المطلوبة' },
    { code: 'chemical_reaction', label: 'التفاعل أو المعالجة الكيميائية غير مستقرة' },
    { code: 'corrosion', label: 'تآكل أو تفاعل غير مرغوب فيه' },
    { code: 'alternative_material', label: 'نحتاج بديلًا تقنيًا لخامة مستوردة' },
    { code: 'shelf_life', label: 'الخامة أو المنتج يفقد خواصه أثناء التخزين' },
    { code: 'material_consumption', label: 'استهلاك الخامة أعلى من المعتاد' },
  ],
  quality: [
    { code: 'reject_rate', label: 'نسبة عيوب أو منتجات مرفوضة مرتفعة' },
    { code: 'dimension', label: 'أبعاد المنتج غير دقيقة أو غير ثابتة' },
    { code: 'finish', label: 'سطح أو لون أو شكل المنتج غير مطابق' },
    { code: 'strength', label: 'متانة أو أداء المنتج أقل من المطلوب' },
    { code: 'batch_variation', label: 'النتيجة تختلف من دفعة لأخرى' },
    { code: 'customer_return', label: 'شكاوى أو مرتجعات بسبب عيب فني' },
    { code: 'contamination', label: 'تلوث أو شوائب في المنتج' },
    { code: 'test_conflict', label: 'نتائج اختبارات الجودة غير متطابقة' },
  ],
  design: [
    { code: 'product_function', label: 'المنتج لا يؤدي الوظيفة المطلوبة' },
    { code: 'design_complex', label: 'تصميم المنتج صعب التصنيع أو التجميع' },
    { code: 'pack_damage', label: 'العبوات تتلف أو تتشوه' },
    { code: 'pack_seal', label: 'مشكلات الغلق أو إحكام العبوة' },
    { code: 'pack_material', label: 'خامة التغليف لا تحافظ على المنتج' },
    { code: 'prototype', label: 'نحتاج نموذجًا أوليًا أو إعادة تصميم' },
    { code: 'product_life', label: 'العمر الافتراضي للمنتج أقل من المطلوب' },
  ],
  automation: [
    { code: 'sensor', label: 'حساسات أو قراءات غير مستقرة' },
    { code: 'plc', label: 'نظام التحكم أو الـPLC يتصرف بشكل غير متوقع' },
    { code: 'manual', label: 'العمل اليدوي يسبب بطئًا أو اختلاف نتائج' },
    { code: 'untracked', label: 'لا توجد بيانات كافية لمتابعة أداء الخط' },
    { code: 'systems_integration', label: 'الماكينات أو الأنظمة لا تتبادل البيانات' },
    { code: 'traceability', label: 'صعوبة تتبع الخامات والدفعات' },
    { code: 'robotics', label: 'نحتاج أتمتة خطوة متكررة أو خطرة' },
    { code: 'machine_monitor', label: 'لا نستطيع اكتشاف الأعطال قبل وقوعها' },
  ],
  lab: [
    { code: 'need_testing', label: 'محتاجين تحليلًا أو اختبارًا غير متاح' },
    { code: 'test_method', label: 'غير متأكدين من طريقة الاختبار المناسبة' },
    { code: 'calibration', label: 'قراءات الأجهزة تحتاج تحققًا أو معايرة' },
    { code: 'validation', label: 'نحتاج التأكد من صلاحية منتج أو خامة' },
    { code: 'material_characterization', label: 'نحتاج قياس خواص مادة أو سطح' },
    { code: 'microbiological', label: 'نحتاج اختبارًا ميكروبيولوجيًا أو فحص تلوث' },
    { code: 'product_compliance', label: 'نحتاج التحقق من مطابقة مواصفات فنية' },
  ],
  environment: [
    { code: 'waste_high', label: 'مخلفات التصنيع أكثر من المتوقع' },
    { code: 'waste_use', label: 'نبحث عن طريقة لاستغلال المخلفات' },
    { code: 'effluent', label: 'خصائص الصرف الصناعي تحتاج تحسينًا' },
    { code: 'emissions', label: 'انبعاثات أو روائح غير مرغوبة' },
    { code: 'water_consumption', label: 'استهلاك المياه مرتفع' },
    { code: 'heat_recovery', label: 'حرارة أو طاقة مهدرة يمكن استرجاعها' },
    { code: 'recycling', label: 'خامة أو منتج يصعب إعادة تدويره' },
  ],
  storage: [
    { code: 'storage_damage', label: 'الخامات أو المنتجات تتلف في المخزن' },
    { code: 'handling_damage', label: 'التلف يحدث أثناء النقل الداخلي أو المناولة' },
    { code: 'inventory_loss', label: 'فاقد أو اختلاف في الكميات أثناء التخزين' },
    { code: 'cold_chain', label: 'درجات الحرارة في التخزين أو النقل غير ثابتة' },
    { code: 'packing_efficiency', label: 'التعبئة أو التحميل بطيئان أو بهما فاقد' },
    { code: 'supply_technical', label: 'مكوّن فني يصعب توفيره بالمواصفات المطلوبة' },
  ],
  safety: [
    { code: 'unsafe_machine', label: 'حركة ماكينة أو جزء مكشوف يسبب خطرًا' },
    { code: 'heat_hazard', label: 'حرارة غير طبيعية أو خطر حريق' },
    { code: 'chemical_leak', label: 'تسرب أو تعرض لمادة خطرة' },
    { code: 'dust_fumes', label: 'أتربة أو أبخرة تؤثر على بيئة التشغيل' },
    { code: 'ergonomics', label: 'مهمة يدوية مرهقة أو متكررة تسبب إصابات' },
    { code: 'noise', label: 'ضوضاء أو اهتزاز شديد' },
  ],
  skills: [
    { code: 'skills_gap', label: 'الخط يحتاج مهارة فنية غير متوفرة' },
    { code: 'operator_variation', label: 'نتائج التشغيل تختلف حسب العامل' },
    { code: 'no_standard', label: 'لا توجد طريقة تشغيل ثابتة ومكتوبة' },
    { code: 'training_equipment', label: 'نحتاج تدريبًا عمليًا على ماكينة أو تقنية' },
    { code: 'new_process', label: 'صعوبة تشغيل عملية أو تقنية جديدة' },
  ],
  unclear: [
    { code: 'unclear_symptom', label: 'فيه تغيير أو مشكلة لكن السبب والمجال مش واضحين' },
  ],
};

// Challenge Symptom Detail questions per Area (with symptom-level exceptions)
export const CHALLENGE_SYMPTOM_DETAILS = {
  // Symptom level overrides
  'SYM:low_output': {
    question: 'شكل انخفاض الإنتاج أقرب لإيه؟',
    options: [
      'الخط يعمل لكن الناتج أقل',
      'توقفات قصيرة متكررة',
      'تكدس أو انتظار بين المراحل',
      'زيادة فاقد أو إعادة تشغيل',
    ],
  },
  'SYM:power_outage': {
    question: 'الانقطاع بيأثر على إيه؟',
    options: [
      'كل المصنع',
      'خط أو منطقة محددة',
      'ماكينة واحدة أو مجموعة صغيرة',
      'المشكلة مرتبطة بوقت تشغيل أحمال معينة',
    ],
  },
  'SYM:voltage': {
    question: 'إيه اللي بتلاحظه وقت المشكلة؟',
    options: [
      'إضاءة تضعف أو تومض',
      'ماكينة تفصل وترجع تشتغل',
      'موتورات تسخن أو أداؤها يتغير',
      'قراءة جهد تتغير',
    ],
  },
  'SYM:energy_spike': {
    question: 'الاستهلاك زاد إمتى؟',
    options: [
      'بالتدريج',
      'بعد إضافة معدة جديدة',
      'مع تشغيل خطوط معينة',
      'بشكل مفاجئ',
    ],
  },
  'SYM:raw_variability': {
    question: 'إيه اللي بيتغير بين دفعات الخام؟',
    options: [
      'اللون أو الشكل',
      'التركيب أو النقاوة',
      'القوة أو المرونة',
      'الرطوبة أو اللزوجة',
      'أداء الخام في التشغيل',
    ],
  },
  'SYM:reject_rate': {
    question: 'نوع العيب الأكثر تكرارًا؟',
    options: [
      'أبعاد غير صحيحة',
      'شكل أو لون أو سطح غير مطابق',
      'ضعف في الأداء أو المتانة',
      'تلوث أو شوائب',
      'عيوب مختلفة غير متشابهة',
    ],
  },
  'SYM:unclear_symptom': {
    question: 'إيه أول حاجة لاحظت إنها اتغيرت؟',
    options: [
      'معدل الإنتاج',
      'جودة المنتج',
      'الأعطال والتوقفات',
      'استهلاك المواد أو الطاقة',
      'ملاحظات العملاء أو العاملين',
    ],
  },

  // Default Area level questions
  production: {
    question: 'فين بيظهر ضعف الأداء بشكل أساسي؟',
    options: [
      'على خط إنتاج كامل',
      'في مرحلة أو محطة محددة',
      'على ماكينة محددة',
      'يختلف بين المنتجات أو الورديات',
    ],
  },
  machines: {
    question: 'أكثر شيء واضح في أداء المعدة؟',
    options: [
      'توقف أو عطل مفاجئ',
      'دقة أو جودة تشغيل أقل',
      'سخونة أو اهتزاز أو ضوضاء',
      'العطل يتكرر بعد الإصلاح',
      'صعوبة توفير جزء أو صيانته',
    ],
  },
  electric: {
    question: 'التأثير الكهربائي بيظهر فين؟',
    options: [
      'كل المصنع',
      'خط إنتاج أو قسم',
      'ماكينة أو موتور محدد',
      'وقت تشغيل معدات معينة',
    ],
  },
  utilities: {
    question: 'المرفق المتأثر غالبًا؟',
    options: [
      'مياه',
      'غاز أو وقود',
      'هواء مضغوط',
      'بخار',
      'تبريد أو تسخين',
    ],
  },
  materials: {
    question: 'في أي مرحلة تظهر مشكلة الخامة؟',
    options: [
      'عند الاستلام أو الاختبار',
      'أثناء الخلط أو المعالجة',
      'أثناء التصنيع',
      'بعد التصنيع أو أثناء التخزين',
    ],
  },
  quality: {
    question: 'في أي وقت يظهر عيب الجودة؟',
    options: [
      'خلال الإنتاج',
      'عند اختبار المنتج',
      'بعد التعبئة أو التخزين',
      'بعد وصوله للعميل',
    ],
  },
  design: {
    question: 'ما الجزء المرتبط بتحدي التصميم؟',
    options: [
      'وظيفة المنتج',
      'الشكل والأبعاد',
      'المكونات والتجميع',
      'العبوة والتغليف',
      'التجربة والنموذج الأولي',
    ],
  },
  automation: {
    question: 'ما وضع العملية حاليًا؟',
    options: [
      'يدوية في أغلبها',
      'آلية لكن التحكم غير مستقر',
      'الماكينات تعمل ولا توجد متابعة بيانات',
      'توجد أنظمة منفصلة غير مترابطة',
    ],
  },
  lab: {
    question: 'ما نوع النتيجة المعملية المطلوبة؟',
    options: [
      'تركيب أو تحليل كيميائي',
      'خواص ميكانيكية أو فيزيائية',
      'قياس أبعاد أو معايرة',
      'ميكروبيولوجي أو تلوث',
      'اختبار أداء أو عمر افتراضي',
    ],
  },
  environment: {
    question: 'أين تظهر المشكلة البيئية أو فاقد الموارد؟',
    options: [
      'صرف صناعي ومياه',
      'مخلفات صلبة',
      'انبعاثات وروائح',
      'استهلاك موارد أو طاقة',
      'مشكلة إعادة تدوير',
    ],
  },
  storage: {
    question: 'متى أو أين يحدث التأثر؟',
    options: [
      'أثناء التخزين',
      'أثناء النقل داخل المصنع',
      'أثناء التعبئة والتحميل',
      'أثناء التوريد من المورد',
    ],
  },
  safety: {
    question: 'أين توجد المخاطرة الرئيسية؟',
    options: [
      'معدات أو حركة ميكانيكية',
      'كهرباء أو حرارة',
      'كيماويات أو غازات',
      'أتربة أو ضوضاء',
      'طريقة أداء المهمة',
    ],
  },
  skills: {
    question: 'أين تظهر فجوة المهارات أو التشغيل؟',
    options: [
      'تشغيل ماكينة أو خط',
      'ضبط الجودة',
      'الصيانة الفنية',
      'تطبيق تقنية جديدة',
      'إجراءات تشغيل غير موحدة',
    ],
  },
  unclear: {
    question: 'إيه العلامة اللي خلتك تحس إن في مشكلة؟',
    options: [
      'نتيجة الإنتاج تغيرت',
      'جودة المنتجات تغيرت',
      'التكاليف أو الاستهلاك زادت',
      'شكاوى أو ملاحظات من فريق العمل أو العملاء',
      'مشكلة بتظهر في أكثر من جزء',
    ],
  },
};

// 3. Improve Areas (تحسين أداء) - 13 Areas
export const IMPROVE_AREAS = [
  { code: 'production', label: 'الإنتاج وكفاءة العمليات', icon: '⚙️' },
  { code: 'machines', label: 'تطوير أداء المعدات', icon: '🔧' },
  { code: 'electric', label: 'كفاءة الطاقة والكهرباء', icon: '⚡' },
  { code: 'utilities', label: 'المياه والهواء والتبريد والحرارة', icon: '💨' },
  { code: 'materials', label: 'تطوير الخامات والتركيبات', icon: '🧪' },
  { code: 'quality', label: 'رفع جودة المنتج', icon: '🎯' },
  { code: 'design', label: 'تصميم وتطوير المنتجات والتغليف', icon: '📦' },
  { code: 'automation', label: 'الأتمتة والتحكم والرقمنة', icon: '💻' },
  { code: 'lab', label: 'تطوير القياس والاختبارات', icon: '🔬' },
  { code: 'environment', label: 'كفاءة الموارد والاستدامة', icon: '🌱' },
  { code: 'storage', label: 'تحسين التخزين والمناولة', icon: '🏬' },
  { code: 'safety', label: 'رفع مستوى السلامة', icon: '🦺' },
  { code: 'skills', label: 'تطوير التشغيل والمهارات الفنية', icon: '👥' },
];

export const IMPROVE_SYMPTOMS = {
  production: [
    { code: 'raise_throughput', label: 'زيادة الطاقة الإنتاجية أو عدد الوحدات' },
    { code: 'shorter_cycle', label: 'تقليل زمن دورة التصنيع' },
    { code: 'reduce_setup', label: 'تقليل وقت تغيير المنتج وإعداد الخط' },
    { code: 'balance_flow', label: 'تحسين انسياب الإنتاج بين المراحل' },
    { code: 'better_planning', label: 'تحسين تخطيط وجدولة التشغيل' },
  ],
  machines: [
    { code: 'upgrade_machine', label: 'تحديث ماكينة أو رفع كفاءتها' },
    { code: 'increase_reliability', label: 'زيادة اعتمادية المعدات' },
    { code: 'predictive_maintenance', label: 'تطوير الصيانة الاستباقية' },
    { code: 'improve_precision', label: 'رفع دقة تشغيل الماكينة' },
  ],
  electric: [
    { code: 'save_power', label: 'خفض استهلاك الكهرباء' },
    { code: 'better_load', label: 'تحسين إدارة الأحمال' },
    { code: 'power_quality', label: 'تحسين استقرار التغذية للمعدات' },
    { code: 'energy_monitor', label: 'تركيب قياس ومتابعة ذكية للطاقة' },
  ],
  utilities: [
    { code: 'water_efficiency', label: 'ترشيد المياه في التشغيل' },
    { code: 'cooling_efficiency', label: 'رفع كفاءة التبريد' },
    { code: 'heat_recovery', label: 'استرجاع الحرارة المهدرة' },
    { code: 'compressed_air', label: 'رفع كفاءة الهواء المضغوط' },
  ],
  materials: [
    { code: 'improve_formulation', label: 'تحسين تركيبة منتج أو خامة' },
    { code: 'material_substitute', label: 'تجربة خامة بديلة' },
    { code: 'increase_yield', label: 'رفع كفاءة استخدام الخامة' },
    { code: 'material_properties', label: 'تحسين خواص مادة' },
  ],
  quality: [
    { code: 'stable_quality', label: 'زيادة ثبات الجودة بين الدفعات' },
    { code: 'reduce_rejects', label: 'خفض نسبة المنتجات المرفوضة' },
    { code: 'process_control', label: 'تطوير ضبط الجودة أثناء التصنيع' },
    { code: 'improve_testing', label: 'تحسين أسلوب اختبار الجودة' },
  ],
  design: [
    { code: 'redesign_product', label: 'إعادة تصميم منتج قائم' },
    { code: 'lighter_product', label: 'تقليل وزن المنتج دون فقد الأداء' },
    { code: 'better_package', label: 'تحسين العبوة والحماية' },
    { code: 'better_assembly', label: 'تسهيل تجميع المكونات' },
  ],
  automation: [
    { code: 'automatic_line', label: 'أتمتة مرحلة من الإنتاج' },
    { code: 'monitor_process', label: 'متابعة الماكينات والبيانات لحظيًا' },
    { code: 'robot_assist', label: 'استخدام نظام آلي في المناولة' },
    { code: 'connect_systems', label: 'ربط المعدات والأنظمة' },
    { code: 'smart_sensors', label: 'تطوير القياسات والتحكم الذكي' },
  ],
  lab: [
    { code: 'faster_test', label: 'تقليل زمن الاختبارات' },
    { code: 'new_test', label: 'تطوير أسلوب اختبار جديد' },
    { code: 'better_calibration', label: 'رفع دقة القياس والمعايرة' },
  ],
  environment: [
    { code: 'waste_recovery', label: 'تحويل المخلفات إلى منتج نافع' },
    { code: 'reduce_emissions', label: 'خفض الانبعاثات' },
    { code: 'reuse_water', label: 'إعادة استخدام المياه' },
    { code: 'circular_materials', label: 'تدوير أو إعادة استخدام المواد' },
  ],
  storage: [
    { code: 'better_handling', label: 'رفع كفاءة المناولة الداخلية' },
    { code: 'better_storage', label: 'تحسين ظروف التخزين' },
    { code: 'less_damage', label: 'تقليل التلف أثناء النقل الداخلي' },
  ],
  safety: [
    { code: 'safer_machinery', label: 'زيادة أمان الماكينات' },
    { code: 'safer_chemical_use', label: 'تحسين التعامل مع المواد الخطرة' },
    { code: 'ergonomic_design', label: 'تقليل الإجهاد البدني للعاملين' },
  ],
  skills: [
    { code: 'standardize_methods', label: 'توحيد أساليب التشغيل' },
    { code: 'technical_training', label: 'رفع مهارات فريق التشغيل' },
    { code: 'knowledge_transfer', label: 'نقل معرفة تقنية جديدة' },
  ],
};

export const IMPROVE_SYMPTOM_DETAILS = {
  production: {
    question: 'أين سيُنفذ التحسين؟',
    options: ['خط إنتاج كامل', 'مرحلة في الخط', 'ماكينة محددة', 'التخطيط بين عدة خطوط'],
  },
  machines: {
    question: 'نوع المعدة المستهدفة',
    options: ['ماكينة تصنيع', 'معدات مناولة', 'مضخات أو ضواغط', 'معدات أخرى'],
  },
  electric: {
    question: 'ما الجزء المستهدف؟',
    options: ['استهلاك المعدات', 'التغذية الكهربائية', 'نظام مراقبة الطاقة', 'أحمال ومواعيد التشغيل'],
  },
  utilities: {
    question: 'ما المرفق المستهدف؟',
    options: ['المياه', 'الهواء المضغوط', 'التبريد', 'التسخين أو البخار'],
  },
  materials: {
    question: 'ما نوع الخامة الأقرب؟',
    options: ['معادن', 'بوليمرات أو بلاستيك', 'كيماويات أو تركيبات', 'مواد غذائية', 'مواد أخرى'],
  },
  quality: {
    question: 'أين ستظهر فائدة التحسين؟',
    options: ['جودة خامات الداخل', 'أثناء التصنيع', 'الفحص النهائي', 'المنتج لدى العميل'],
  },
  design: {
    question: 'التحسين يخص؟',
    options: ['منتج نهائي', 'جزء أو مكوّن', 'العبوة', 'طريقة التجميع'],
  },
  automation: {
    question: 'أين تريد تطبيق الحل؟',
    options: ['على ماكينة', 'على خط إنتاج', 'في قياس ومراقبة البيانات', 'بين عدة أنظمة'],
  },
  lab: {
    question: 'ما الذي تود تحسينه؟',
    options: ['دقة القياس', 'سرعة الفحص', 'طريقة اختبار جديدة', 'توثيق النتائج'],
  },
  environment: {
    question: 'أي مورد أو أثر تريد تحسينه؟',
    options: ['المياه', 'المواد الخام', 'الطاقة', 'المخلفات والانبعاثات'],
  },
  storage: {
    question: 'موضع التحسين',
    options: ['المخزن', 'النقل الداخلي', 'التحميل والتفريغ', 'التعبئة'],
  },
  safety: {
    question: 'نطاق التحسين',
    options: ['الماكينات', 'المواد الكيميائية', 'موقع العمل', 'المهام اليدوية'],
  },
  skills: {
    question: 'المجال المستهدف',
    options: ['تشغيل المعدات', 'الصيانة', 'الجودة', 'تقنية جديدة'],
  },
};

// 4. Opportunity Types for Idea & Localize
export const IDEA_OPPORTUNITY_TYPES = [
  { code: 'new_product', label: 'منتج جديد' },
  { code: 'improved_product', label: 'تحسين منتج موجود' },
  { code: 'new_process', label: 'طريقة تصنيع أو عملية جديدة' },
  { code: 'new_machine', label: 'تطوير ماكينة أو أداة' },
  { code: 'material_innovation', label: 'تطوير خامة أو تركيبة' },
  { code: 'digital_solution', label: 'حل تحكم أو رقمنة' },
  { code: 'recycle_innovation', label: 'استفادة مبتكرة من المخلفات' },
];

export const LOCALIZE_OPPORTUNITY_TYPES = [
  { code: 'import_part', label: 'قطعة غيار أو مكوّن' },
  { code: 'import_material', label: 'خامة أو مادة كيميائية' },
  { code: 'import_machine', label: 'ماكينة أو معدة' },
  { code: 'import_product', label: 'منتج نهائي' },
  { code: 'import_electronics', label: 'دائرة أو مكوّن إلكتروني' },
  { code: 'import_pack', label: 'عبوة أو مادة تغليف' },
];

// 5. Lab Knowledge & Test Areas (15 Areas & Tests)
export const LAB_KNOWLEDGE_OPTIONS = [
  { code: 'exact', label: 'أعرف الاختبار بالتحديد', desc: 'لديك اسم محدد للاختبار أو التحليل المطلوب.' },
  { code: 'area', label: 'أعرف مجال الاختبار فقط', desc: 'مثل الاختبارات الميكانيكية أو الكيميائية دون معرفة اسم الاختبار الدقيق.' },
  { code: 'goal', label: 'أعرف الخاصية المطلوب قياسها', desc: 'مثل معرفة تركيب المادة أو قياس المتانة أو فحص التلوث.' },
];

export const LAB_TEST_AREAS = [
  { code: 'chemical', label: 'التحاليل الكيميائية وتركيب المواد' },
  { code: 'mechanical', label: 'القوة والمتانة والاختبارات الميكانيكية' },
  { code: 'thermal', label: 'الاختبارات الحرارية' },
  { code: 'electrical', label: 'الاختبارات الكهربائية والإلكترونية' },
  { code: 'physical', label: 'الخواص الفيزيائية' },
  { code: 'microbiology', label: 'التحاليل الميكروبيولوجية' },
  { code: 'metallurgy', label: 'المعادن والبنية المجهرية' },
  { code: 'ndt', label: 'الفحص غير الإتلافي' },
  { code: 'environment', label: 'التحاليل البيئية والمياه' },
  { code: 'packaging', label: 'التغليف والعبوات' },
  { code: 'textiles', label: 'النسيج والجلود' },
  { code: 'food', label: 'الأغذية والمنتجات الحيوية' },
  { code: 'calibration', label: 'المعايرة والقياسات' },
  { code: 'compliance', label: 'اختبارات الأداء والمطابقة' },
  { code: 'coatings', label: 'الدهانات والطلاءات والمواد اللاصقة' },
];

export const LAB_TESTS_BY_AREA = {
  chemical: [
    { code: 'composition', label: 'تحليل العناصر أو التركيب الكيميائي' },
    { code: 'purity', label: 'قياس النقاوة والشوائب' },
    { code: 'concentration', label: 'تحديد تركيز مادة أو مكون' },
    { code: 'heavy_metals', label: 'قياس المعادن الثقيلة' },
    { code: 'organic', label: 'تحليل مركبات عضوية' },
    { code: 'ph_acidity', label: 'قياس الحموضة أو القلوية' },
    { code: 'unknown_identification', label: 'التعرف على مادة مجهولة' },
  ],
  mechanical: [
    { code: 'tensile', label: 'اختبار الشد' },
    { code: 'compression', label: 'اختبار الضغط' },
    { code: 'hardness', label: 'اختبار الصلادة' },
    { code: 'impact', label: 'اختبار الصدمات' },
    { code: 'bending', label: 'اختبار الانحناء' },
    { code: 'fatigue', label: 'اختبار الكلل أو الأحمال المتكررة' },
    { code: 'wear', label: 'مقاومة التآكل والاحتكاك' },
    { code: 'load', label: 'اختبار تحمل الأحمال' },
  ],
  thermal: [
    { code: 'heat_resistance', label: 'مقاومة درجات الحرارة المرتفعة' },
    { code: 'thermal_stability', label: 'الثبات الحراري' },
    { code: 'conductivity', label: 'التوصيل الحراري' },
    { code: 'thermal_expansion', label: 'التمدد الحراري' },
    { code: 'flame', label: 'سلوك الاشتعال والحريق' },
    { code: 'cooling', label: 'أداء التبريد والعزل' },
  ],
  electrical: [
    { code: 'insulation', label: 'اختبار العزل الكهربائي' },
    { code: 'dielectric', label: 'تحمل الجهد الكهربائي' },
    { code: 'resistance', label: 'قياس المقاومة أو الموصلية' },
    { code: 'motor', label: 'اختبار أداء محرك كهربائي' },
    { code: 'electronics', label: 'اختبار مكونات إلكترونية' },
    { code: 'grounding', label: 'فحص التأريض' },
    { code: 'battery', label: 'اختبار بطارية أو وحدة تخزين' },
  ],
  physical: [
    { code: 'density', label: 'قياس الكثافة' },
    { code: 'viscosity', label: 'قياس اللزوجة' },
    { code: 'porosity', label: 'قياس المسامية' },
    { code: 'dimensions', label: 'الأبعاد والسُمك' },
    { code: 'moisture', label: 'قياس الرطوبة' },
    { code: 'surface', label: 'خواص السطح والملمس' },
    { code: 'optical', label: 'اللون والخواص البصرية' },
  ],
  microbiology: [
    { code: 'micro_count', label: 'العد الميكروبي' },
    { code: 'bacteria', label: 'الكشف عن بكتيريا محددة' },
    { code: 'mold', label: 'الفطريات والخمائر' },
    { code: 'sterility', label: 'اختبار التعقيم' },
    { code: 'hygiene', label: 'اختبار النظافة والتلوث' },
  ],
  metallurgy: [
    { code: 'alloy', label: 'تحليل تركيب سبيكة' },
    { code: 'microstructure', label: 'فحص البنية المجهرية' },
    { code: 'corrosion', label: 'اختبار التآكل الكيميائي' },
    { code: 'heat_treatment', label: 'فحص المعالجة الحرارية' },
    { code: 'coating_thickness', label: 'قياس سُمك الطلاء المعدني' },
  ],
  ndt: [
    { code: 'ultrasonic', label: 'فحص بالموجات فوق الصوتية' },
    { code: 'radiography', label: 'فحص بالأشعة' },
    { code: 'magnetic', label: 'فحص جسيمات مغناطيسية' },
    { code: 'penetrant', label: 'فحص سوائل متغلغلة' },
    { code: 'visual', label: 'فحص بصري صناعي' },
  ],
  environment: [
    { code: 'water', label: 'تحليل مياه عملية الإنتاج' },
    { code: 'wastewater', label: 'تحليل صرف صناعي' },
    { code: 'emissions', label: 'قياس انبعاثات' },
    { code: 'waste', label: 'تحليل مخلفات صناعية' },
    { code: 'air', label: 'قياس جودة الهواء' },
  ],
  packaging: [
    { code: 'burst', label: 'تحمل الضغط أو الانفجار' },
    { code: 'seal', label: 'سلامة اللحام أو الغلق' },
    { code: 'barrier', label: 'نفاذية الأكسجين أو الرطوبة' },
    { code: 'drop', label: 'اختبار السقوط' },
    { code: 'compression_pack', label: 'الضغط على العبوات' },
    { code: 'migration', label: 'هجرة مواد من العبوة إلى المحتوى' },
  ],
  textiles: [
    { code: 'fabric_tensile', label: 'متانة شد النسيج' },
    { code: 'colorfast', label: 'ثبات الألوان' },
    { code: 'abrasion', label: 'مقاومة الاحتكاك' },
    { code: 'shrinkage', label: 'الانكماش' },
    { code: 'fiber', label: 'تركيب الألياف' },
    { code: 'waterproof', label: 'مقاومة الماء' },
  ],
  food: [
    { code: 'nutrients', label: 'التركيب الغذائي' },
    { code: 'shelf_life', label: 'الثبات والعمر التخزيني' },
    { code: 'food_safety', label: 'ملوثات الغذاء' },
    { code: 'fat_moisture', label: 'دهون أو رطوبة أو بروتين' },
    { code: 'sensory', label: 'تقييم الخواص الحسية' },
  ],
  calibration: [
    { code: 'temp_cal', label: 'معايرة الحرارة' },
    { code: 'pressure_cal', label: 'معايرة الضغط' },
    { code: 'electrical_cal', label: 'معايرة كهربائية' },
    { code: 'mass_cal', label: 'معايرة الكتلة والوزن' },
    { code: 'length_cal', label: 'معايرة الأبعاد' },
    { code: 'flow_cal', label: 'معايرة التدفق' },
  ],
  compliance: [
    { code: 'performance', label: 'تقييم أداء المنتج' },
    { code: 'reliability', label: 'اختبار الاعتمادية والعمر الافتراضي' },
    { code: 'spec_compliance', label: 'اختبار مطابقة مواصفة' },
    { code: 'prototype', label: 'اختبار نموذج أولي' },
    { code: 'comparative', label: 'مقارنة أداء منتجين' },
  ],
  coatings: [
    { code: 'adhesion', label: 'التصاق الطلاء أو اللاصق' },
    { code: 'thickness_coat', label: 'سمك الطلاء' },
    { code: 'weather', label: 'مقاومة العوامل الجوية' },
    { code: 'chemical_resistance', label: 'مقاومة المواد الكيميائية' },
    { code: 'drying', label: 'زمن الجفاف أو التصلب' },
  ],
};

// Lab Goals
export const LAB_GENERAL_GOALS = [
  { code: 'composition', label: 'معرفة تركيب المادة أو المكونات' },
  { code: 'strength', label: 'قياس قوة أو متانة منتج أو مكوّن' },
  { code: 'thermal', label: 'قياس تحمل الحرارة أو التبريد' },
  { code: 'electrical', label: 'التأكد من خواص كهربائية' },
  { code: 'microbiology', label: 'التحقق من تلوث ميكروبي أو تعقيم' },
  { code: 'physical', label: 'قياس خواص فيزيائية' },
  { code: 'safety', label: 'التأكد من السلامة أو المطابقة' },
  { code: 'performance', label: 'التحقق من أداء المنتج أو النموذج' },
  { code: 'environment', label: 'قياس ملوثات أو خواص بيئية' },
  { code: 'defects', label: 'البحث عن شروخ أو عيوب داخلية' },
  { code: 'calibration', label: 'معايرة جهاز قياس' },
];

export const LAB_GOALS_BY_AREA = {
  chemical: [
    { code: 'composition', label: 'معرفة تركيب المادة أو المكونات' },
    { code: 'physical', label: 'قياس خواص فيزيائية' },
    { code: 'safety', label: 'التأكد من السلامة أو المطابقة' },
  ],
  mechanical: [
    { code: 'strength', label: 'قياس قوة أو متانة منتج أو مكوّن' },
    { code: 'performance', label: 'التحقق من أداء المنتج أو النموذج' },
    { code: 'safety', label: 'التأكد من السلامة أو المطابقة' },
  ],
  thermal: [
    { code: 'thermal', label: 'قياس تحمل الحرارة أو التبريد' },
    { code: 'safety', label: 'التأكد من السلامة أو المطابقة' },
    { code: 'performance', label: 'التحقق من أداء المنتج أو النموذج' },
  ],
  electrical: [
    { code: 'electrical', label: 'التأكد من خواص كهربائية' },
    { code: 'safety', label: 'التأكد من السلامة أو المطابقة' },
    { code: 'performance', label: 'التحقق من أداء المنتج أو النموذج' },
  ],
  physical: [
    { code: 'physical', label: 'قياس خواص فيزيائية' },
    { code: 'composition', label: 'معرفة تركيب المادة أو المكونات' },
  ],
  microbiology: [
    { code: 'microbiology', label: 'التحقق من تلوث ميكروبي أو تعقيم' },
    { code: 'safety', label: 'التأكد من السلامة أو المطابقة' },
  ],
  metallurgy: [
    { code: 'composition', label: 'معرفة تركيب المادة أو المكونات' },
    { code: 'strength', label: 'قياس قوة أو متانة منتج أو مكوّن' },
    { code: 'defects', label: 'البحث عن شروخ أو عيوب داخلية' },
  ],
  ndt: [
    { code: 'defects', label: 'البحث عن شروخ أو عيوب داخلية' },
    { code: 'safety', label: 'التأكد من السلامة أو المطابقة' },
  ],
  environment: [
    { code: 'environment', label: 'قياس ملوثات أو خواص بيئية' },
    { code: 'safety', label: 'التأكد من السلامة أو المطابقة' },
  ],
  packaging: [
    { code: 'strength', label: 'قياس قوة أو متانة منتج أو مكوّن' },
    { code: 'physical', label: 'قياس خواص فيزيائية' },
    { code: 'performance', label: 'التحقق من أداء المنتج أو النموذج' },
    { code: 'safety', label: 'التأكد من السلامة أو المطابقة' },
  ],
  textiles: [
    { code: 'strength', label: 'قياس قوة أو متانة منتج أو مكوّن' },
    { code: 'physical', label: 'قياس خواص فيزيائية' },
    { code: 'performance', label: 'التحقق من أداء المنتج أو النموذج' },
  ],
  food: [
    { code: 'composition', label: 'معرفة تركيب المادة أو المكونات' },
    { code: 'microbiology', label: 'التحقق من تلوث ميكروبي أو تعقيم' },
    { code: 'safety', label: 'التأكد من السلامة أو المطابقة' },
  ],
  calibration: [
    { code: 'calibration', label: 'معايرة جهاز قياس' },
  ],
  compliance: [
    { code: 'safety', label: 'التأكد من السلامة أو المطابقة' },
    { code: 'performance', label: 'التحقق من أداء المنتج أو النموذج' },
  ],
  coatings: [
    { code: 'physical', label: 'قياس خواص فيزيائية' },
    { code: 'strength', label: 'قياس قوة أو متانة منتج أو مكوّن' },
    { code: 'performance', label: 'التحقق من أداء المنتج أو النموذج' },
  ],
};

// Lab Subject Families and Types
export const LAB_SUBJECT_MODES = [
  { code: 'material', label: 'خامة أو مادة' },
  { code: 'product', label: 'منتج أو جزء من منتج' },
  { code: 'other', label: 'عينة أو جهاز أو شيء آخر' },
];

export const LAB_MATERIAL_FAMILIES = [
  { code: 'polymer', label: 'بلاستيك وبوليمرات ومطاط' },
  { code: 'metal', label: 'معادن وسبائك' },
  { code: 'chemical', label: 'كيماويات ومذيبات وتركيبات' },
  { code: 'ceramic', label: 'سيراميك وزجاج وأسمنت ومواد غير معدنية' },
  { code: 'composite', label: 'مواد مركبة' },
  { code: 'textile', label: 'ألياف ومنسوجات وجلود' },
  { code: 'food', label: 'مواد غذائية' },
  { code: 'coating', label: 'دهانات وطلاءات ومواد لاصقة' },
  { code: 'paper', label: 'ورق وكرتون' },
  { code: 'water', label: 'مياه وسوائل صناعية' },
  { code: 'wood', label: 'أخشاب ومواد نباتية' },
  { code: 'other', label: 'خامة أو مادة أخرى' },
];

export const LAB_MATERIAL_TYPES = {
  polymer: ['بولي إيثيلين (PE)', 'بولي بروبيلين (PP)', 'بولي إيثيلين تيريفثالات (PET)', 'PVC', 'مطاط صناعي', 'بلاستيك هندسي آخر'],
  metal: ['صلب أو حديد', 'ستانلس ستيل', 'ألومنيوم', 'نحاس أو سبائك نحاس', 'زنك أو معادن أخرى'],
  chemical: ['مذيب', 'حمض أو قاعدة', 'ملح أو مركب غير عضوي', 'زيوت أو مواد تشحيم', 'مادة فعالة أو مضافة', 'خلطة أو تركيبة صناعية'],
  ceramic: ['سيراميك', 'زجاج', 'أسمنت', 'حراريات', 'مسحوق معدني أو معدني غير فلزي'],
  composite: ['مركب مقوى بألياف زجاجية', 'مركب مقوى بألياف كربونية', 'مركب متعدد الطبقات', 'مركب بوليمري آخر'],
  textile: ['قطن', 'بوليستر', 'صوف', 'مزيج ألياف', 'جلد طبيعي أو صناعي'],
  food: ['مادة غذائية خام', 'مادة غذائية مصنعة', 'زيت غذائي', 'مضاف غذائي', 'مشروب أو سائل غذائي'],
  coating: ['دهان', 'طلاء معدني', 'مادة لاصقة', 'راتنج', 'حبر صناعي'],
  paper: ['ورق', 'كرتون', 'لب ورق', 'مادة تغليف ورقية'],
  water: ['مياه خام', 'مياه عمليات', 'مياه تبريد', 'صرف صناعي'],
  wood: ['خشب طبيعي', 'خشب صناعي', 'ألياف أو مادة نباتية'],
  other: ['مادة أخرى غير موجودة بالقائمة'],
};

export const LAB_PRODUCT_FAMILIES = [
  { code: 'packaging', label: 'عبوات وتغليف' },
  { code: 'mech', label: 'أجزاء ميكانيكية ومكونات' },
  { code: 'electrical', label: 'منتجات ومكونات كهربائية' },
  { code: 'building', label: 'مواد ومنتجات البناء' },
  { code: 'textiles', label: 'منسوجات وملابس وجلود' },
  { code: 'food', label: 'منتجات غذائية' },
  { code: 'plastic', label: 'منتجات بلاستيكية أو مطاطية' },
  { code: 'automotive', label: 'مكونات سيارات ونقل' },
  { code: 'medical', label: 'منتجات ومستلزمات طبية' },
  { code: 'chemicals', label: 'منتجات كيماوية ودهانات' },
  { code: 'machinery', label: 'آلات ومعدات صناعية' },
  { code: 'paper', label: 'أخشاب وورق وأثاث' },
  { code: 'other', label: 'منتج آخر' },
];

export const LAB_PRODUCT_TYPES = {
  packaging: ['زجاجة أو عبوة بلاستيكية', 'عبوة معدنية', 'عبوة زجاجية', 'كيس أو فيلم تغليف', 'كرتون أو صندوق', 'غطاء أو وسيلة إغلاق'],
  mech: ['عمود أو محور', 'ترس', 'صمام أو مضخة', 'مسمار أو وصلة', 'قطعة غيار مصنعة', 'جزء من ماكينة'],
  electrical: ['كابل أو سلك', 'قاطع أو مفتاح', 'موتور كهربائي', 'لوحة تحكم', 'حساس أو دائرة إلكترونية', 'بطارية'],
  building: ['طوب أو بلوك', 'بلاط أو سيراميك', 'مواسير أو مواسير ضغط', 'لوح أو قطاع معدني', 'مادة عزل', 'منتج خرساني'],
  textiles: ['قماش أو نسيج', 'خيط أو حبل', 'ملابس أو منتج نهائي', 'جلد أو حذاء', 'منسوجات فنية'],
  food: ['غذاء معبأ', 'منتج مجمد', 'منتج مخبوز', 'منتج ألبان', 'منتج سائل'],
  plastic: ['صينية أو حاوية بلاستيكية', 'جزء بلاستيكي مصبوب', 'أنبوب بلاستيكي', 'لوح أو فيلم بلاستيكي', 'جزء مطاطي'],
  automotive: ['جزء سيارة معدني', 'جزء بلاستيكي للسيارات', 'جزء مطاطي', 'جزء كهربائي أو إلكتروني'],
  medical: ['مستهلك طبي', 'عبوة طبية', 'أداة طبية', 'مكوّن جهاز طبي'],
  chemicals: ['منتج كيماوي مصنع', 'دهان أو طلاء', 'منظف', 'مادة لاصقة'],
  machinery: ['ماكينة أو وحدة كاملة', 'هيكل ماكينة', 'معدات رفع', 'مبادل حراري', 'مضخة أو ضاغط'],
  paper: ['علبة كرتون', 'لوح خشب أو أثاث', 'منتج ورقي', 'عبوة ورقية'],
  other: ['منتج آخر غير موجود بالقائمة'],
};

export const LAB_USAGES = [
  { code: 'product', label: 'تطوير منتج أو خامة' },
  { code: 'supplier', label: 'التحقق من جودة مورد أو خامة' },
  { code: 'quality', label: 'التحقق من جودة الإنتاج' },
  { code: 'failure', label: 'فهم سبب عطل أو عيب' },
  { code: 'standard', label: 'التحقق من مطابقة مواصفة' },
  { code: 'research', label: 'دراسة أو مشروع بحثي' },
  { code: 'localization', label: 'تقييم بديل محلي لمستورد' },
];

// 6. Impact & Benefit Codes
export const CHALLENGE_IMPACTS = [
  { code: 'production', label: 'انخفاض الإنتاج' },
  { code: 'downtime', label: 'توقف أو تعطيل التشغيل' },
  { code: 'quality', label: 'انخفاض الجودة' },
  { code: 'cost', label: 'ارتفاع تكلفة التشغيل' },
  { code: 'waste', label: 'زيادة الهالك أو المخلفات' },
  { code: 'safety', label: 'مخاطر على السلامة' },
  { code: 'delivery', label: 'تأخير التسليم' },
  { code: 'resources', label: 'زيادة استهلاك الموارد' },
];

export const EXPECTED_BENEFITS = {
  improve: [
    { code: 'production_up', label: 'زيادة الإنتاجية' },
    { code: 'downtime_down', label: 'تقليل الأعطال والتوقفات' },
    { code: 'quality_up', label: 'تحسين الجودة وثبات النتائج' },
    { code: 'cost_down', label: 'خفض تكلفة التشغيل' },
    { code: 'waste_down', label: 'تقليل الهالك' },
    { code: 'resources_down', label: 'خفض استهلاك الطاقة أو الخامات' },
    { code: 'safety_up', label: 'تحسين السلامة' },
    { code: 'speed_up', label: 'تقليل زمن العملية' },
    { code: 'automation_up', label: 'تقليل الأعمال اليدوية' },
    { code: 'capacity_up', label: 'زيادة الطاقة الإنتاجية' },
  ],
  idea: [
    { code: 'new_product', label: 'تطوير منتج جديد' },
    { code: 'product_upgrade', label: 'تحسين منتج قائم' },
    { code: 'productivity_up', label: 'رفع كفاءة التشغيل' },
    { code: 'quality_up', label: 'تحسين الجودة أو الأداء' },
    { code: 'cost_down', label: 'خفض التكلفة' },
    { code: 'waste_down', label: 'تقليل الهالك' },
    { code: 'resources_down', label: 'ترشيد الطاقة والموارد' },
    { code: 'automation', label: 'زيادة الأتمتة ودقة التحكم' },
    { code: 'safety_up', label: 'تحسين السلامة' },
    { code: 'new_market', label: 'فتح تطبيق أو سوق جديد' },
    { code: 'environment', label: 'تقليل الأثر البيئي' },
  ],
  localize: [
    { code: 'import_dependency', label: 'تقليل الاعتماد على الاستيراد' },
    { code: 'local_availability', label: 'توفير المكوّن أو الخامة محليًا' },
    { code: 'lead_time', label: 'تقليل مدة التوريد' },
    { code: 'cost_down', label: 'خفض تكلفة الشراء أو التشغيل' },
    { code: 'quality_match', label: 'توفير بديل محلي بنفس المواصفات' },
    { code: 'customization', label: 'تطوير بديل يلائم احتياجات المصنع' },
    { code: 'supply_stability', label: 'تحسين استقرار التوريد' },
    { code: 'local_design', label: 'بناء قدرة تصنيع أو تصميم محلي' },
  ],
};

// 7. Desired Outcomes per Request Type
export const DESIRED_OUTCOMES = {
  challenge: [
    { code: 'diagnose', label: 'تحديد سبب المشكلة ووضع حل مناسب' },
    { code: 'fix', label: 'حل المشكلة ومنع تكرارها' },
    { code: 'productivity', label: 'استعادة الإنتاج للمستوى المطلوب' },
    { code: 'reliability', label: 'تقليل الأعطال والتوقف' },
    { code: 'quality', label: 'استعادة جودة المنتج' },
    { code: 'cost', label: 'خفض التكلفة أو الفاقد' },
    { code: 'safety', label: 'إزالة أو تقليل الخطر' },
  ],
  improve: [
    { code: 'productivity', label: 'رفع كمية الإنتاج أو سرعة الخط' },
    { code: 'reliability', label: 'رفع استقرار التشغيل' },
    { code: 'quality', label: 'تحسين الجودة' },
    { code: 'cost', label: 'خفض التكلفة أو استهلاك الموارد' },
    { code: 'prototype', label: 'تنفيذ وتحقيق جدوى تطوير العملية' },
    { code: 'safety', label: 'تحسين السلامة' },
    { code: 'automation', label: 'تطبيق أتمتة أو قياس أدق' },
  ],
  idea: [
    { code: 'prototype', label: 'تطوير نموذج أولي وتجربته' },
    { code: 'feasibility', label: 'دراسة الجدوى الفنية للفكرة' },
    { code: 'product', label: 'تطوير منتج أو خامة قابلة للاستخدام' },
    { code: 'process', label: 'تطوير طريقة تصنيع جديدة' },
    { code: 'automation', label: 'تنفيذ نظام تحكم أو رقمنة' },
    { code: 'testing', label: 'التحقق من أداء الفكرة بالاختبارات' },
  ],
  localize: [
    { code: 'feasibility', label: 'دراسة إمكانية التصنيع محليًا' },
    { code: 'prototype', label: 'تصميم أو تصنيع نموذج أولي' },
    { code: 'local', label: 'إنتاج بديل محلي مطابق للاحتياج' },
    { code: 'validation', label: 'اختبار البديل المحلي ومقارنته بالمستورد' },
    { code: 'scale', label: 'تجهيز خطوات الإنتاج المحلي على نطاق صناعي' },
  ],
};

// 8. Frequency Options (for challenge only)
export const FREQUENCY_OPTIONS = [
  { code: 'always', label: 'مستمرة معظم الوقت' },
  { code: 'daily', label: 'يوميًا أو كل وردية' },
  { code: 'weekly', label: 'عدة مرات أسبوعيًا' },
  { code: 'monthly', label: 'مرة أو مرتين شهريًا' },
  { code: 'rare', label: 'على فترات متباعدة' },
  { code: 'once', label: 'حدثت مرة واحدة' },
];

// 9. Affected Scope Options
export const AFFECTED_SCOPE_OPTIONS = [
  { code: 'plant', label: 'المصنع كله' },
  { code: 'line', label: 'خط إنتاج أو قسم' },
  { code: 'machine', label: 'ماكينة أو نقطة تشغيل' },
  { code: 'product', label: 'منتج أو دفعة محددة' },
  { code: 'multi', label: 'أكثر من مصنع تابع لنفس الشركة' },
];

// 10. Metrics Configuration
export const METRIC_CONFIG = {
  challenge: [
    {
      code: 'lost_hours',
      label: 'ساعات التوقف الحالية',
      units: ['ساعة'],
      periods: ['يوم', 'أسبوع', 'شهر'],
    },
    {
      code: 'output',
      label: 'معدل الإنتاج الحالي',
      units: ['قطعة', 'طن', 'كجم', 'لتر', 'متر', 'عبوة', 'وحدة أخرى'],
      periods: ['ساعة', 'وردية', 'يوم', 'أسبوع', 'شهر'],
    },
    {
      code: 'reject',
      label: 'نسبة الرفض أو العيوب الحالية',
      units: ['%'],
      periods: [],
    },
    {
      code: 'energy',
      label: 'استهلاك الكهرباء الحالي',
      units: ['kWh', 'MWh'],
      periods: ['يوم', 'أسبوع', 'شهر'],
    },
    {
      code: 'extra_cost',
      label: 'تكلفة إضافية حالية',
      units: ['جنيه'],
      periods: ['أسبوع', 'شهر'],
    },
    {
      code: 'waste',
      label: 'كمية الهالك الحالية',
      units: ['كجم', 'طن', 'قطعة', 'لتر'],
      periods: ['يوم', 'أسبوع', 'شهر'],
    },
    {
      code: 'lead_time',
      label: 'زمن العملية الحالي',
      units: ['دقيقة', 'ساعة', 'يوم'],
      periods: [],
    },
  ],
  benefit: [
    {
      code: 'target_output_gain',
      label: 'زيادة إنتاج مستهدفة',
      units: ['%'],
      periods: [],
    },
    {
      code: 'target_cost_saving',
      label: 'توفير مستهدف في التكلفة',
      units: ['جنيه'],
      periods: ['شهر', 'سنة'],
    },
    {
      code: 'target_waste_reduction',
      label: 'خفض مستهدف للهالك',
      units: ['%'],
      periods: [],
    },
    {
      code: 'target_energy_saving',
      label: 'خفض مستهدف لاستهلاك الطاقة',
      units: ['%'],
      periods: [],
    },
    {
      code: 'target_downtime_reduction',
      label: 'خفض مستهدف للتوقفات',
      units: ['ساعة'],
      periods: ['أسبوع', 'شهر'],
    },
    {
      code: 'target_time_reduction',
      label: 'خفض مستهدف لزمن العملية',
      units: ['%'],
      periods: [],
    },
    {
      code: 'target_local_share',
      label: 'نسبة توطين مستهدفة',
      units: ['%'],
      periods: [],
    },
  ],
};

