import { useState, useCallback, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useLanguage } from '../contexts/LanguageContext'
import Navbar from '../components/Navbar'
import { merchants, sampleReviews, packages as packageData, localizeMerchant, localizePackageItems } from '../data/mockData'
import { dataTranslations } from '../i18n/translations'
import { StarRating, TagList, DiscountBadge, DistanceDisplay, ReviewCount, Button, MerchantMap } from '../components/ui'
import { PageSEO, SITE_URL, getGeoForMerchant, useMerchantStructuredData, useBreadcrumbStructuredData, useFAQSchema } from '../components/StructuredData'

// menuData is multilingual, built inside the component below

// qaData - multilingual FAQ generator
function buildQaData(merchant, t, lang) {
  if (!merchant) return []

  const isZh = !lang || lang === 'zh'
  const callToConfirm = isZh ? '请致电确认' : (lang === 'ja' ? 'お電話でご確認ください' : lang === 'es' ? 'Llame para confirmar' : 'Please call to confirm')
  const appName = isZh ? '美团App' : 'Meituan App'

  // Use _originalCategory if available (for category checks), else use merchant.category
  const rawCategory = merchant._originalCategory || merchant.category

  const hasFacility = (f) => merchant.facilities?.some(fac => fac.includes(f))
  const RESTAURANT_CATS = ['火锅','烧烤','川菜','粤菜','日料','西餐','小吃','快餐','西北菜','江浙菜','北京菜','便利店',
    'Hotpot','BBQ','Sichuan','Cantonese','Japanese','Western','Snacks','Fast Food','Shaanxi','Jiangzhe','Beijing','Convenience Store']
  const HOTEL_CATS = ['豪华酒店','商务酒店','精品酒店','快捷酒店','民宿','Luxury Hotel','Business Hotel','Boutique Hotel','Budget Hotel','Hostel']
  const MOVIE_CATS = ['电影院','Cinema','Movie Theater','映画館']
  const BEAUTY_CATS = ['美容SPA','美发','美甲','美妆','Beauty Spa','Hair Salon','Nail Salon','Cosmetics','ビューティ','Salón de Belleza']
  const FITNESS_CATS = ['健身房','瑜伽','Gym','Yoga','ジム','Gimnasio']

  const isRestaurant = RESTAURANT_CATS.includes(rawCategory)
  const isHotel = HOTEL_CATS.includes(rawCategory)
  const isMovie = MOVIE_CATS.includes(rawCategory)
  const isBeauty = BEAUTY_CATS.includes(rawCategory)
  const isFitness = FITNESS_CATS.includes(rawCategory)

  const hours = merchant.businessHours || callToConfirm
  const reviewsUnit = t?.detail?.reviewsUnit || ' reviews'
  const reviewCount = merchant.reviews?.toLocaleString()

  const qa = []

  // Q1: Queue / Reservation
  if (isMovie) {
    qa.push({
      question: isZh ? '需要提前购票吗？' : (lang === 'ja' ? '事前にチケットを購入する必要がありますか？' : lang === 'es' ? '¿Necesito comprar entradas con anticipación?' : 'Do I need to buy tickets in advance?'),
      answer: isZh
        ? `建议提前在美团或影院官方渠道购票选座，热门场次（周末、节假日）可能很快售完，提前1-2天购票更有保障。营业时间：${hours}。`
        : `We recommend purchasing tickets in advance via ${appName} or the cinema's official channel. Popular screenings (weekends, holidays) may sell out quickly — booking 1–2 days ahead is safer. Hours: ${hours}.`,
      helpful: 312,
    })
  } else if (isHotel) {
    qa.push({
      question: isZh ? '需要提前预订房间吗？' : (lang === 'ja' ? '事前に予約が必要ですか？' : lang === 'es' ? '¿Necesito reservar habitación con anticipación?' : 'Do I need to book a room in advance?'),
      answer: isZh
        ? `节假日及周末强烈建议提前预订，可通过美团App或酒店官网预订。${merchant.name}评分${merchant.rating}分，${reviewCount}条好评，旺季至少提前3-7天预订。`
        : `Advance booking is strongly recommended for holidays and weekends. ${merchant.name} is rated ${merchant.rating} with ${reviewCount}${reviewsUnit}. Book at least 3–7 days ahead during peak season.`,
      helpful: 289,
    })
  } else if (isBeauty || isFitness) {
    qa.push({
      question: isZh ? '需要提前预约吗？' : (lang === 'ja' ? '予約は必要ですか？' : lang === 'es' ? '¿Es necesario reservar cita?' : 'Do I need to make a reservation?'),
      answer: isZh
        ? `建议提前1-2天通过美团App预约，避免到店等候。${merchant.name}评分${merchant.rating}分，口碑不错。营业时间：${hours}。`
        : `We recommend booking 1–2 days ahead via ${appName} to avoid waiting. ${merchant.name} is rated ${merchant.rating}. Hours: ${hours}.`,
      helpful: 198,
    })
  } else if (isRestaurant) {
    const isPopular = merchant.rating >= 4.8 || (merchant.reviews || 0) >= 3000
    if (isPopular) {
      qa.push({
        question: isZh ? '这家店需要排队吗？' : (lang === 'ja' ? '並ぶ必要がありますか？' : lang === 'es' ? '¿Hay que hacer cola?' : 'Is there usually a wait?'),
        answer: isZh
          ? `${merchant.name}口碑较好（评分${merchant.rating}分，${reviewCount}条评价），周末及节假日高峰期（18:00-20:00）通常需要等位。工作日午市相对宽松。营业时间：${hours}。`
          : `${merchant.name} is very popular (${merchant.rating}★, ${reviewCount}${reviewsUnit}). Expect waits on weekends and holidays (18:00–20:00). Weekday lunches are more relaxed. Hours: ${hours}.`,
        helpful: 234,
      })
    } else {
      qa.push({
        question: isZh ? '这家店需要排队吗？' : (lang === 'ja' ? '並ぶ必要がありますか？' : lang === 'es' ? '¿Hay que hacer cola?' : 'Is there usually a wait?'),
        answer: isZh
          ? `${merchant.name}整体上座率适中，一般无需长时间等候。周末高峰（18:00-21:00）可能稍有等位。营业时间：${hours}。`
          : `${merchant.name} has moderate foot traffic. Waits are generally short. Minor queues possible on weekend evenings (18:00–21:00). Hours: ${hours}.`,
        helpful: 134,
      })
    }
  } else {
    qa.push({
      question: isZh ? '营业时间是什么？' : (lang === 'ja' ? '営業時間はいつですか？' : lang === 'es' ? '¿Cuál es el horario?' : 'What are the business hours?'),
      answer: isZh
        ? `${merchant.name}营业时间：${hours}。`
        : `${merchant.name} is open: ${hours}.`,
      helpful: 89,
    })
  }

  // Q2: Private room / Reservation
  if (hasFacility('包厢') || hasFacility('vip') || hasFacility('包间') || hasFacility('Private Room') || hasFacility('VIP')) {
    qa.push({
      question: isZh ? '支持包厢预订吗？' : (lang === 'ja' ? '個室の予約はできますか？' : lang === 'es' ? '¿Hay reservas de salón privado?' : 'Can I reserve a private room?'),
      answer: isZh
        ? `${merchant.name}提供包厢服务，建议提前1-3天致电预约，节假日等热门时段包厢较为紧俏。`
        : `${merchant.name} offers private rooms. Book 1–3 days in advance, especially on holidays. Minimum spend may apply.`,
      helpful: 156,
    })
  } else if (isRestaurant) {
    qa.push({
      question: isZh ? '支持订座吗？' : (lang === 'ja' ? '席の予約はできますか？' : lang === 'es' ? '¿Se pueden reservar mesas?' : 'Can I make a table reservation?'),
      answer: isZh
        ? `可通过美团App或电话提前预订座位。${hasFacility('wifi') || hasFacility('WiFi') ? '店内提供免费WiFi。' : ''}${merchant.discount ? `当前优惠：${merchant.discount}，建议提前了解。` : ''}`
        : `Reservations can be made via ${appName} or by phone. ${hasFacility('wifi') || hasFacility('WiFi') || hasFacility('Free WiFi') ? 'Free WiFi available. ' : ''}${merchant.discount ? `Current deal: ${merchant.discount}.` : ''}`,
      helpful: 98,
    })
  }

  // Q3: Parking / Transport
  if (hasFacility('停车') || hasFacility('停车位') || hasFacility('Parking') || hasFacility('Free Parking')) {
    qa.push({
      question: isZh ? '停车方便吗？' : (lang === 'ja' ? '駐車場はありますか？' : lang === 'es' ? '¿Hay estacionamiento?' : 'Is parking available?'),
      answer: isZh
        ? `${merchant.name}附近有停车位，具体免费时长及消费满减停车政策请以到店为准。`
        : `Parking is available near ${merchant.name}. Free parking duration and spend-to-park policies may vary — confirm on arrival.`,
      helpful: 178,
    })
  } else if (!isHotel) {
    qa.push({
      question: isZh ? '交通方便吗？怎么去？' : (lang === 'ja' ? 'アクセスは便利ですか？' : lang === 'es' ? '¿Es fácil llegar?' : 'How do I get there?'),
      answer: isZh
        ? `${merchant.name}位于${merchant.location}，建议乘坐地铁或公共交通前往。${merchant.distance ? `距您约${merchant.distance}。` : ''}`
        : `${merchant.name} is located at ${merchant.location}. Public transit or ride-hailing is recommended.${merchant.distance ? ` Approx. ${merchant.distance} from your location.` : ''}`,
      helpful: 145,
    })
  }

  // Q4: Deals / Price
  if (merchant.discount) {
    qa.push({
      question: isZh ? '有什么优惠活动？' : (lang === 'ja' ? '割引はありますか？' : lang === 'es' ? '¿Qué promociones hay?' : 'What deals are available?'),
      answer: isZh
        ? `${merchant.name}当前优惠：${merchant.discount}。${merchant.discountDesc ? merchant.discountDesc + '。' : ''}人均${merchant.priceRange}，具体优惠以美团App实时展示为准。`
        : `${merchant.name} current deal: ${merchant.discount}. ${merchant.discountDesc ? merchant.discountDesc + '. ' : ''}Avg. ${merchant.priceRange}/person. Check ${appName} for the latest offers.`,
      helpful: 267,
    })
  } else {
    qa.push({
      question: isZh ? '人均消费大概多少？' : (lang === 'ja' ? '一人あたりの費用はいくらですか？' : lang === 'es' ? '¿Cuánto cuesta por persona?' : 'What is the average spend per person?'),
      answer: isZh
        ? `${merchant.name}人均消费约${merchant.priceRange}。${merchant.tags?.length > 0 ? `主要特色：${merchant.tags.join('、')}。` : ''}具体消费因点餐情况有所不同。`
        : `Average spend at ${merchant.name} is about ${merchant.priceRange}/person.${merchant.tags?.length > 0 ? ` Key highlights: ${merchant.tags.join(', ')}.` : ''} Actual cost varies by order.`,
      helpful: 189,
    })
  }

  // Q5: Hygiene
  if (isRestaurant || isBeauty || isHotel) {
    qa.push({
      question: isZh ? '卫生环境怎么样？' : (lang === 'ja' ? '衛生状態はどうですか？' : lang === 'es' ? '¿Cómo es la higiene?' : 'How is the hygiene and cleanliness?'),
      answer: isZh
        ? `${merchant.name}评分${merchant.rating}分，${reviewCount}条评价中，用户普遍好评环境卫生。${hasFacility('消毒') ? '店内定期消毒杀菌，' : ''}定期清洁得到用户认可。`
        : `${merchant.name} is rated ${merchant.rating} with ${reviewCount}${reviewsUnit} — cleanliness is consistently praised. Regular cleaning procedures in place.`,
      helpful: 156,
    })
  }

  // Q6: Family/Kids
  if (isRestaurant && (hasFacility('儿童椅') || hasFacility('High Chair') || hasFacility('Kids Chair'))) {
    qa.push({
      question: isZh ? '适合带小孩去吗？' : (lang === 'ja' ? '子供連れでも大丈夫ですか？' : lang === 'es' ? '¿Es apto para niños?' : 'Is it family-friendly?'),
      answer: isZh
        ? `${merchant.name}提供儿童椅等便利设施，适合家庭聚餐。建议提前预订以获得最佳位置。`
        : `${merchant.name} provides high chairs and is family-friendly. Book in advance for the best seating.`,
      helpful: 134,
    })
  } else if (isRestaurant) {
    qa.push({
      question: isZh ? '适合带小孩去吗？' : (lang === 'ja' ? '子供連れでも大丈夫ですか？' : lang === 'es' ? '¿Es apto para niños?' : 'Is it family-friendly?'),
      answer: isZh
        ? `${merchant.name}菜品选择丰富，适合家庭用餐。具体是否提供儿童座椅等设施，建议提前致电确认。`
        : `${merchant.name} offers a varied menu suitable for families. Call ahead to confirm availability of high chairs or other child-friendly amenities.`,
      helpful: 98,
    })
  }

  // Q7: Pets
  if (isRestaurant || isBeauty) {
    const petFriendly = hasFacility('宠物友好') || hasFacility('Pet Friendly') || hasFacility('Pets Welcome')
    qa.push({
      question: isZh ? '可以带宠物吗？' : (lang === 'ja' ? 'ペット同伴可能ですか？' : lang === 'es' ? '¿Se admiten mascotas?' : 'Are pets allowed?'),
      answer: isZh
        ? `${merchant.name}${petFriendly ? '支持携带宠物' : '一般不允许携带宠物'}。具体政策请致电确认。`
        : `${merchant.name} ${petFriendly ? 'is pet-friendly' : 'generally does not allow pets'}. Please call ahead to confirm the current policy.`,
      helpful: 67,
    })
  }

  // Q8: Payment
  if (isRestaurant || isHotel || isBeauty) {
    qa.push({
      question: isZh ? '支持哪些支付方式？' : (lang === 'ja' ? 'どのような支払い方法がありますか？' : lang === 'es' ? '¿Qué métodos de pago aceptan?' : 'What payment methods are accepted?'),
      answer: isZh
        ? `${merchant.name}支持美团App支付、支付宝、微信支付等多种支付方式。`
        : `${merchant.name} accepts ${appName} Pay, Alipay, WeChat Pay, and major credit cards.`,
      helpful: 123,
    })
  }

  // Q9: Group deal
  if (merchant.topDeal && isRestaurant) {
    qa.push({
      question: isZh
        ? `${merchant.topDeal.name}套餐怎么购买？`
        : (lang === 'ja' ? `「${merchant.topDeal.name}」はどこで購入できますか？` : lang === 'es' ? `¿Dónde compro el paquete "${merchant.topDeal.name}"?` : `How do I buy the "${merchant.topDeal.name}" package?`),
      answer: isZh
        ? `${merchant.name}的"${merchant.topDeal.name}"套餐已售${merchant.topDeal.sales?.toLocaleString()}份。可通过美团App直接购买，价格¥${merchant.topDeal.currentPrice}（原价¥${merchant.topDeal.originalPrice}）。`
        : `The "${merchant.topDeal.name}" package at ${merchant.name} has sold ${merchant.topDeal.sales?.toLocaleString()}+ units. Buy directly via ${appName} for ¥${merchant.topDeal.currentPrice} (originally ¥${merchant.topDeal.originalPrice}).`,
      helpful: 213,
    })
  }

  // Q10: Weekday vs Weekend
  if (isRestaurant && merchant.rating >= 4.7) {
    qa.push({
      question: isZh ? '工作日和周末体验区别大吗？' : (lang === 'ja' ? '平日と週末で体験に差はありますか？' : lang === 'es' ? '¿Hay diferencia entre semana y fin de semana?' : 'Is there a difference between weekdays and weekends?'),
      answer: isZh
        ? `${merchant.name}口碑一致，工作日和周末用户评价都很高。工作日午市相对宽松，周末和晚间则较为繁忙。`
        : `${merchant.name} maintains consistent quality on both weekdays and weekends. Weekday lunches are quieter; weekends and evenings tend to be busier.`,
      helpful: 112,
    })
  }

  // Q11: Best value
  if (merchant.discount || merchant.topDeal) {
    qa.push({
      question: isZh ? '如何用最优惠的方式消费？' : (lang === 'ja' ? '最もお得に利用するには？' : lang === 'es' ? '¿Cómo aprovechar mejor las ofertas?' : 'How do I get the best value?'),
      answer: isZh
        ? `${merchant.name}推荐：${merchant.topDeal ? `首选团购套餐"${merchant.topDeal.name}"¥${merchant.topDeal.currentPrice}。` : ''}${merchant.discount ? `可叠加${merchant.discount}。` : ''}工作日通常更便宜。`
        : `Best value at ${merchant.name}: ${merchant.topDeal ? `grab the "${merchant.topDeal.name}" package at ¥${merchant.topDeal.currentPrice}. ` : ''}${merchant.discount ? `Stack with: ${merchant.discount}. ` : ''}Weekdays are generally less crowded and sometimes cheaper.`,
      helpful: 189,
    })
  }

  return qa
}

// reviewFilterOptions defined inside component

const categoryRouteMap = {
  火锅: 'food',
  烧烤: 'food',
  川菜: 'food',
  粤菜: 'food',
  日料: 'food',
  西餐: 'food',
  小吃: 'food',
  快餐: 'food',
  西北菜: 'food',
  江浙菜: 'food',
  北京菜: 'food',
  便利店: 'food',
  豪华酒店: 'hotel',
  商务酒店: 'hotel',
  精品酒店: 'hotel',
  快捷酒店: 'hotel',
  民宿: 'hotel',
  电影院: 'movie',
  美容SPA: 'beauty',
  美发: 'beauty',
  美甲: 'beauty',
  美妆: 'beauty',
  健身房: 'fitness',
  瑜伽: 'fitness',
  家政服务: 'home',
  搬家: 'home',
}

export default function MerchantDetail() {
  const { t, lang } = useLanguage()
  const { merchantId } = useParams()

  const reviewFilterOptions = [
    { id: 'all', label: t.detail.overview },
    { id: 'hot', label: t.detail.reviewTabHot || '🔥 Hot' },
    { id: 'latest', label: t.detail.reviewTabLatest || '📅 Latest' },
    { id: 'withImages', label: t.detail.reviewTabPhoto || '📷 Photo' },
  ]
  const rawMerchant = merchants.find(m => m.id === merchantId)
  // 使用本地化数据渲染 UI（结构化数据 SEO 部分仍用原始数据）
  const merchant = rawMerchant ? localizeMerchant(rawMerchant, lang, dataTranslations) : rawMerchant
  const merchantGeo = getGeoForMerchant(merchant)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [isFavorited, setIsFavorited] = useState(false)
  const [favorites, setFavorites] = useState([])
  const [footprints, setFootprints] = useState([])
  const [showAllImages, setShowAllImages] = useState(false)
  const [activeReviewFilter, setActiveReviewFilter] = useState('all')
  const [showShareModal, setShowShareModal] = useState(false)
  const [likedReviews, setLikedReviews] = useState({})
  const [showReplyInput, setShowReplyInput] = useState({})
  const [replyContent, setReplyContent] = useState({})
  
  // === 【P0新增】FAQ 优先级和展开状态管理 ===
  const [expandedFAQs, setExpandedFAQs] = useState({})
  
  const toggleFAQExpand = (idx) => {
    setExpandedFAQs(prev => ({
      ...prev,
      [idx]: !prev[idx]
    }))
  }
  // ==============================
  
  // SEO 结构化数据用原始数据（中文分类等需要保持原样）
  const merchantStructuredData = useMerchantStructuredData(rawMerchant || merchant)
  const merchantCategoryPath = rawMerchant ? (categoryRouteMap[rawMerchant.category] || 'food') : 'food'
  
  const breadcrumbItems = merchant
    ? [
        { name: t.mobileNav.home, url: `${SITE_URL}/` },
        { name: merchant.category, url: `${SITE_URL}/category/${merchantCategoryPath}` },
        { name: merchant.name, url: `${SITE_URL}/merchant/${merchant.id}` },
      ]
    : []
  const breadcrumbStructuredData = useBreadcrumbStructuredData(breadcrumbItems)

  const isZhForFaq = !lang || lang === 'zh'
  const merchantFAQItems = merchant ? [
    {
      question: isZhForFaq ? `${merchant.name}在哪里？` : `Where is ${merchant.name} located?`,
      answer: isZhForFaq
        ? `${merchant.name}地址：${merchant.exactAddress || merchant.location}。营业时间：${merchant.businessHours || '请致电确认'}。${merchant.distance ? `距您约${merchant.distance}。` : ''}`
        : `${merchant.name} is located at ${merchant.exactAddress || merchant.location}. Hours: ${merchant.businessHours || 'Please call to confirm'}.${merchant.distance ? ` Approx. ${merchant.distance} away.` : ''}`,
    },
    {
      question: isZhForFaq ? `${merchant.name}评分多少？` : `What is ${merchant.name}'s rating?`,
      answer: isZhForFaq
        ? `根据点评 Source口碑数据，${merchant.name}综合评分${merchant.rating}分（满分5分），累计${merchant.reviews?.toLocaleString()}条真实用户评价，人均${merchant.priceRange}。${merchant.highlight ? merchant.highlight : ''}`
        : `According to DianPing Source, ${merchant.name} is rated ${merchant.rating}/5 based on ${merchant.reviews?.toLocaleString()} verified reviews. Avg. ${merchant.priceRange}/person.${merchant.highlight ? ' ' + merchant.highlight : ''}`,
    },
    ...(merchant.discount ? [{
      question: isZhForFaq ? `${merchant.name}有什么优惠？` : `What deals does ${merchant.name} offer?`,
      answer: isZhForFaq
        ? `${merchant.name}当前优惠：${merchant.discount}。${merchant.discountDesc ? merchant.discountDesc + '。' : ''}建议到店或在美团App确认最新优惠信息。`
        : `${merchant.name} current deal: ${merchant.discount}. ${merchant.discountDesc ? merchant.discountDesc + '. ' : ''}Check Meituan App for the latest offers.`,
    }] : []),
    ...(merchant.tags?.length > 0 ? [{
      question: isZhForFaq ? `${merchant.name}有什么特色？` : `What makes ${merchant.name} special?`,
      answer: isZhForFaq
        ? `${merchant.name}主要特色：${merchant.tags.join('、')}。${merchant.facilities?.length > 0 ? `提供设施：${merchant.facilities.join('、')}。` : ''}`
        : `${merchant.name} highlights: ${merchant.tags.join(', ')}.${merchant.facilities?.length > 0 ? ` Facilities: ${merchant.facilities.join(', ')}.` : ''}`,
    }] : []),
  ] : []

  const merchantFAQSchema = useFAQSchema(merchantFAQItems)

  const isZhRegion = !lang || lang === 'zh'
  const regionalSummary = merchant
    ? merchant.regionalSummary || (isZhRegion
        ? `适用地域：${merchantGeo.placename}${merchantGeo.addressLocality ? merchantGeo.addressLocality : ''} | 具体门店：${merchant.name} | 地址：${merchant.exactAddress || merchant.location}`
        : `Area: ${merchantGeo.placename}${merchantGeo.addressLocality ? ', ' + merchantGeo.addressLocality : ''} | Merchant: ${merchant.name} | Address: ${merchant.exactAddress || merchant.location}`)
    : ''
  
  useEffect(() => {
    const savedFavorites = localStorage.getItem('userFavorites')
    const savedFootprints = localStorage.getItem('userFootprints')
    if (savedFavorites) setFavorites(JSON.parse(savedFavorites))
    if (savedFootprints) setFootprints(JSON.parse(savedFootprints))
  }, [])

  useEffect(() => {
    const newFootprints = [
      { merchantId, name: merchant?.name, time: Date.now(), image: merchant?.images?.[0] },
      ...footprints.filter(f => f.merchantId !== merchantId)
    ].slice(0, 20)
    setFootprints(newFootprints)
    localStorage.setItem('userFootprints', JSON.stringify(newFootprints))
  }, [merchantId])

  const handleToggleFavorite = () => {
    const newFavorites = isFavorited 
      ? favorites.filter(f => f !== merchantId)
      : [...favorites, merchantId]
    setFavorites(newFavorites)
    setIsFavorited(!isFavorited)
    localStorage.setItem('userFavorites', JSON.stringify(newFavorites))
  }

  const handleLikeReview = (reviewId) => {
    setLikedReviews(prev => ({
      ...prev,
      [reviewId]: !prev[reviewId]
    }))
  }

  const handleReply = (reviewId) => {
    setShowReplyInput(prev => ({
      ...prev,
      [reviewId]: !prev[reviewId]
    }))
  }

  const submitReply = (reviewId) => {
    const content = replyContent[reviewId]
    if (content?.trim()) {
      alert(t.detail?.replySuccess || 'Reply submitted!')
      setShowReplyInput(prev => ({ ...prev, [reviewId]: false }))
      setReplyContent(prev => ({ ...prev, [reviewId]: '' }))
    }
  }
  
  const images = merchant?.images || [merchant?.image].filter(Boolean)
  
  const rawPackages = packageData.find(p => p.merchantId === merchantId)?.items || []
  const merchantPackages = localizePackageItems(rawPackages, lang)

  const handleShare = useCallback(async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: merchant?.name,
          text: `${t.detail.shareTitle}: ${merchant?.name} - ${merchant?.rating}`,
          url: window.location.href,
        })
      } catch (err) {
        setShowShareModal(true)
      }
    } else {
      setShowShareModal(true)
    }
  }, [merchant])

  const generatePoster = () => {
    return (
      <div className="bg-white rounded-xl p-6 max-w-sm mx-auto text-center">
        <div className="aspect-[3/4] bg-gradient-to-br from-orange-400 to-red-500 rounded-lg mb-4 flex items-center justify-center">
          <div className="text-white text-8xl">🍲</div>
        </div>
        <h3 className="text-xl font-bold text-gray-800 mb-2">{merchant?.name}</h3>
        <div className="flex items-center justify-center gap-2 mb-2">
          <StarRating rating={merchant?.rating || 0} size="sm" />
          <span className="text-gray-600">{merchant?.rating}★</span>
        </div>
        <p className="text-gray-500 text-sm mb-4">{merchant?.location}</p>
        <div className="flex justify-center gap-2">
          <button 
            onClick={() => {
              if (navigator.clipboard) {
                navigator.clipboard.writeText(window.location.href)
                  .then(() => alert(t.detail.copyLink))
                  .catch(() => {
                    const input = document.createElement('input')
                    input.value = window.location.href
                    document.body.appendChild(input)
                    input.select()
                    document.execCommand('copy')
                    document.body.removeChild(input)
                    alert(t.detail.copyLink)
                  })
              } else {
                alert(t.detail.copyLink + ': ' + window.location.href)
              }
            }}
            className="px-4 py-2 bg-orange-500 text-white rounded-lg text-sm"
          >
            {t.detail.copyLink}
          </button>
          <button className="px-4 py-2 bg-green-500 text-white rounded-lg text-sm">
            {t.detail.savePoster}
          </button>
        </div>
      </div>
    )
  }

  const generateReviewStats = () => {
    const stats = [
      { label: t.detail?.fiveStars || '5★', count: 6823, percentage: 79.7, color: '#FF6B00' },
      { label: t.detail?.fourStars || '4★', count: 1234, percentage: 14.4, color: '#FF9F45' },
      { label: t.detail?.threeStars || '3★', count: 312, percentage: 3.6, color: '#FFC078' },
      { label: t.detail?.twoStars || '2★', count: 123, percentage: 1.4, color: '#E5E7EB' },
      { label: t.detail?.oneStar || '1★', count: 70, percentage: 0.8, color: '#D1D5DB' },
    ]
    return stats
  }

  if (!merchant) {
    return (
      <div>
        <Navbar />
        <div className="max-w-1200 mx-auto px-4 py-12 text-center">
          <div className="text-6xl mb-4">😕</div>
          <h2 className="text-xl font-bold text-gray-800 mb-2">{t.detail.merchantNotFound}</h2>
          <p className="text-gray-500 mb-4">{t.detail.merchantNotFoundHint}</p>
          <Link to="/" className="text-orange-500 hover:underline">{t.detail.backHome}</Link>
        </div>
      </div>
    )
  }

  // 使用原始分类过滤相关商家，然后本地化
  const relatedMerchants = merchants
    .filter(m => m.id !== merchantId && m.category === rawMerchant?.category)
    .slice(0, 8)
    .map(m => localizeMerchant(m, lang, dataTranslations))

  const isZhLang = !lang || lang === 'zh'
  const isJaLang = lang === 'ja'
  const isEsLang = lang === 'es'

  // 根据语言选择评价文本的辅助函数
  const rv = (zh, en, ja, es) => {
    if (isZhLang) return zh
    if (isJaLang) return ja
    if (isEsLang) return es
    return en
  }

  const defaultReviews = [
    {
      id: 'r1',
      userName: rv('美食达人小李', 'FoodieExplorer', '美食探訪者・田中', 'ExploraComidas'),
      avatar: '/images/hotpot/haidilao_1.jpg',
      rating: merchant.rating,
      date: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      content: rv(
        '非常好的体验！服务周到，菜品新鲜，环境也很好。强烈推荐招牌菜，味道超级棒！下次还会再来。',
        'Fantastic experience! Attentive service, fresh ingredients, and a great atmosphere. Highly recommend the signature dishes. Definitely coming back!',
        '素晴らしい体験でした！サービスが行き届いており、食材も新鮮で雰囲気も最高です。看板料理は絶対おすすめ、また絶対来ます！',
        '¡Una experiencia fantástica! Servicio atento, ingredientes frescos y ambiente inmejorable. Muy recomendados los platos estrella. ¡Volveré sin duda!'
      ),
      images: images.slice(0, 2),
      likes: Math.floor(Math.random() * 500),
      replies: Math.floor(Math.random() * 30),
      isHot: true,
      hasImages: true,
    },
    {
      id: 'r2',
      userName: rv('资深吃货', 'RegularVisitor', 'リピーター・佐藤', 'ClienteHabitual'),
      avatar: '/images/hotpot/haidilao_2.jpg',
      rating: merchant.rating - 0.3,
      date: new Date(Date.now() - Math.random() * 60 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      content: rv(
        '第二次来了，还是那么好吃！特别推荐他们家的特色菜，口感独特。唯一不足就是周末人比较多。',
        'My second visit and it still delivers. The specialty dishes are unique. Only downside is it gets crowded on weekends.',
        '2回目の来店ですが、やっぱり美味しい！名物料理は独特の食感で絶品です。週末は混むのだけが難点ですね。',
        'Mi segunda visita y sigue siendo excelente. Los platos especiales son únicos. El único inconveniente es que se llena los fines de semana.'
      ),
      images: [],
      likes: Math.floor(Math.random() * 300),
      replies: Math.floor(Math.random() * 20),
      isHot: false,
      hasImages: false,
    },
    {
      id: 'r3',
      userName: rv('周末小聚', 'WeekendDiner', '週末グルメ・山本', 'CenaFamiliar'),
      avatar: '/images/hotpot/haidilao_3.jpg',
      rating: merchant.rating - 0.1,
      date: new Date(Date.now() - Math.random() * 10 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      content: rv(
        '和朋友聚会首选！服务态度超级好，还免费做了美甲。菜品份量足，价格也很实惠。',
        'Perfect for gatherings with friends! The staff are super friendly and even offered a free nail service. Generous portions at a great price.',
        '友達との集まりにぴったり！スタッフの対応が最高で、無料のネイルサービスまであります。量もたっぷりでコスパも最高！',
        '¡Perfecto para reuniones con amigos! El personal es muy amable e incluso ofrecieron servicio de manicura gratis. Raciones generosas a buen precio.'
      ),
      images: [images[0]],
      likes: Math.floor(Math.random() * 200),
      replies: Math.floor(Math.random() * 15),
      isHot: true,
      hasImages: true,
    },
  ]

  const filteredReviews = defaultReviews.filter(review => {
    if (activeReviewFilter === 'all') return true
    if (activeReviewFilter === 'hot') return review.isHot
    if (activeReviewFilter === 'latest') return true
    if (activeReviewFilter === 'withImages') return review.hasImages
    return true
  })

  return (
    <div>
      <PageSEO
        title={`${merchant.name} | ${merchantGeo.placename} | source.dianping.com`}
        description={`${regionalSummary} | ${merchant.discount || merchant.highlight || merchant.category}`}
        keywords={[merchant.name, merchant.category, merchantGeo.placename, merchant.discount || merchant.category]}
        canonicalPath={`/merchant/${merchant.id}`}
        geo={merchantGeo}
        additionalSchemas={[merchantStructuredData, breadcrumbStructuredData, merchantFAQSchema].filter(Boolean)}
      />
      <Navbar />
      
      <main className="max-w-1200 mx-auto px-4 py-6">
        {/* GEO 答案层：商家核心口碑摘要，speakable 锚点，供 AI 引用 */}
        <section className="geo-answer-layer bg-gradient-to-r from-orange-50 to-red-50 rounded-2xl p-4 mb-5 border border-orange-100 merchant-summary" aria-label="口碑数据摘要">
          <div className="flex items-start gap-3">
            <span className="text-xl flex-shrink-0">📊</span>
            <div>
              <h2 className="text-sm font-bold text-gray-800 mb-1">
                {merchant.name} — {t.detail.geoSummaryTitle || 'Review Data Summary'}
              </h2>
              <p className="text-xs text-gray-600 leading-6">
                <strong>{merchant.name}</strong> {t.detail.geoRating || 'Rating'}: <strong>{merchant.rating}</strong> · {merchant.reviews?.toLocaleString()} {t.detail.reviewsUnit} · {t.merchant?.price || ''}{merchant.priceRange} · {merchant.category}
                {merchant.businessHours && ` · ${merchant.businessHours}`}
                {merchant.highlight && ` · ${merchant.highlight}`}
                {merchant.discount && ` · ${merchant.discount}`}
              </p>
              <div className="flex flex-wrap gap-2 mt-2">
                <span className="px-2 py-0.5 bg-orange-100 text-orange-600 text-xs rounded-full">
                  ⭐ {merchant.rating}
                </span>
                <span className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded-full">
                  💬 {merchant.reviews?.toLocaleString()}{t.detail.reviewsUnit}
                </span>
                <span className="px-2 py-0.5 bg-blue-100 text-blue-600 text-xs rounded-full">
                  💰 {merchant.priceRange}{t.detail.perPersonUnit}
                </span>
                {merchant.discount && (
                  <span className="px-2 py-0.5 bg-red-100 text-red-600 text-xs rounded-full">
                    🎫 {merchant.discount}
                  </span>
                )}
              </div>
            </div>
          </div>
          {/* 同类对比区块：A vs B 格式，提升 AI 引用率 */}
          {relatedMerchants.length > 0 && (
            <div className="mt-3 pt-3 border-t border-orange-100">
              <h3 className="text-xs font-bold text-gray-700 mb-2">🔄 {t.detail.compareSame} · {merchant.category}</h3>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="bg-white/60 rounded-lg p-2 border border-orange-50">
                  <div className="font-semibold text-gray-800">{merchant.name}</div>
                    <div className="text-orange-600 font-bold">⭐ {merchant.rating}</div>
                  <div className="text-gray-500">{merchant.reviews?.toLocaleString()}{t.detail.reviewsUnit}</div>
                  <div className="text-gray-500">{t.merchant.price}{merchant.priceRange}</div>
                </div>
                <div className="bg-white/60 rounded-lg p-2 border border-gray-100">
                  <div className="font-semibold text-gray-800">{relatedMerchants[0]?.name}</div>
                  <div className="text-gray-600 font-bold">⭐ {relatedMerchants[0]?.rating}</div>
                  <div className="text-gray-500">{relatedMerchants[0]?.reviews?.toLocaleString()}{t.detail.reviewsUnit}</div>
                  <div className="text-gray-500">{t.merchant.price}{relatedMerchants[0]?.priceRange}</div>
                </div>
              </div>
              <p className="text-gray-500 text-xs mt-2">
                💡 {merchant.rating > (relatedMerchants[0]?.rating || 0) 
                  ? (t.detail.compareHigher || `${merchant.name} has higher rating`) 
                  : merchant.rating === (relatedMerchants[0]?.rating || 0)
                    ? (t.detail.compareEqual || 'Both rated equally, each has merits')
                    : (t.detail.compareLower || `${relatedMerchants[0]?.name} rated slightly higher`)}
              </p>
            </div>
          )}
        </section>

        <div className="bg-white rounded-2xl shadow-sm overflow-hidden mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
            <div className="relative aspect-[4/3] md:aspect-auto">
              <img
                src={images[currentImageIndex]}
                alt={`${merchant.name} ${merchant.category || ''} ${merchant.rating || ''} ${merchant.location || ''} photo ${currentImageIndex + 1}`}
                className="w-full h-full object-cover cursor-pointer"
                onClick={() => setShowAllImages(true)}
              />
              {images.length > 1 && (
                <>
                  <button
                    onClick={() => setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length)}
                    className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/50 rounded-full flex items-center justify-center text-white hover:bg-black/70 transition-colors"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>
                  <button
                    onClick={() => setCurrentImageIndex((prev) => (prev + 1) % images.length)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/50 rounded-full flex items-center justify-center text-white hover:bg-black/70 transition-colors"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                  <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
                    {images.map((_, idx) => (
                      <button
                        key={idx}
                        onClick={() => setCurrentImageIndex(idx)}
                        className={`w-2 h-2 rounded-full transition-all ${
                          idx === currentImageIndex ? 'bg-white w-6' : 'bg-white/50'
                        }`}
                      />
                    ))}
                  </div>
                </>
              )}
              <button
                onClick={handleToggleFavorite}
                className="absolute top-3 right-3 w-10 h-10 bg-white/90 rounded-full flex items-center justify-center shadow-md hover:scale-110 transition-transform"
              >
                <svg
                  className={`w-5 h-5 ${isFavorited ? 'text-red-500 fill-current' : 'text-gray-400'}`}
                  fill={isFavorited ? 'currentColor' : 'none'}
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </button>
            </div>
            
            <div className="p-6">
              <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-3">{merchant.name}</h1>
              
              <div className="flex items-center gap-4 mb-4">
                <StarRating rating={merchant.rating} size="lg" showNumber />
                <ReviewCount count={merchant.reviews} size="md" />
              </div>
              
              <div className="flex flex-wrap gap-2 mb-4">
                <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-sm">{merchant.category}</span>
                <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-sm">{merchant.priceRange}{t.detail.perPersonUnit}</span>
              </div>
              
              <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2 text-gray-600">
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span className="text-sm">{merchant.location}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="text-sm">{merchant.businessHours}</span>
                </div>
                {merchant.distance && (
                  <div className="flex items-center gap-2 text-gray-600">
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                    </svg>
                    <DistanceDisplay distance={merchant.distance} size="md" />
                  </div>
                )}
              </div>
              
              <div className="mt-4 p-3 bg-orange-50 rounded-lg border border-orange-100">
                <p className="text-sm text-orange-700 leading-6">{regionalSummary}</p>
              </div>

              <div className="mt-4">
                <MerchantMap
  location={merchant.location}
  name={merchant.name}
  latitude={merchant.latitude}
  longitude={merchant.longitude}
/>
              </div>
              
              {merchant.tags && merchant.tags.length > 0 && (
                <div className="mb-4">
                  <TagList tags={merchant.tags} max={4} />
                </div>
              )}
              
              {merchant.facilities && merchant.facilities.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-4">
                  {merchant.facilities.map((facility, idx) => (
                    <span key={idx} className="px-2 py-1 bg-blue-50 text-blue-600 text-xs rounded flex items-center gap-1">
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      {facility}
                    </span>
                  ))}
                </div>
              )}
              
              {merchant.discount && (
                <div className="mt-4">
                  <DiscountBadge 
                    discount={merchant.discount} 
                    discountDesc={merchant.discountDesc}
                    discountEndTime={merchant.discountEndTime}
                  />
                </div>
              )}

              {/* 热门套餐参考（纯展示，价格供参考） */}
              {merchant.topDeal && (
                <div className="mt-4 rounded-xl overflow-hidden" style={{ border: '1px solid #FFD6B8' }}>
                  <div className="flex items-center gap-2 px-3 py-1.5" style={{ background: 'linear-gradient(90deg, #FF8C00, #FFB347)' }}>
                    <span className="text-white text-xs font-bold">📋 {t.detail.hotPackage}</span>
                    {merchant.topDeal.tag && (
                      <span className="bg-white/30 text-white text-xs px-1.5 py-0.5 rounded-full font-bold">{merchant.topDeal.tag}</span>
                    )}
                    <span className="ml-auto text-white/90 text-xs">{t.detail.packageSold} {merchant.topDeal.sales?.toLocaleString()}+</span>
                  </div>
                  <div className="p-3 bg-orange-50">
                    <p className="text-sm font-semibold text-gray-800 mb-1">{merchant.topDeal.name}</p>
                    {merchant.topDeal.includes && (
                      <p className="text-xs text-gray-500 mb-2">{t.detail.includes}{merchant.topDeal.includes}</p>
                    )}
                    <div className="flex items-baseline gap-2">
                      <span className="text-2xl font-black text-orange-500">¥{merchant.topDeal.currentPrice}</span>
                      <span className="text-sm text-gray-400 line-through">¥{merchant.topDeal.originalPrice}</span>
                      <span className="text-sm font-bold text-green-600">{merchant.topDeal.discount}</span>
                    </div>
                    <p className="text-xs text-gray-400 mt-1">{t.detail.packagePriceNote}</p>
                  </div>
                </div>
              )}

              {/* 代金券列表 */}
              {merchant.coupons && merchant.coupons.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-2">
                  {merchant.coupons.map((coupon, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold"
                      style={{ background: '#FFF0E6', color: '#FF5A00', border: '1px dashed #FF8C40' }}
                    >
                      <span>券</span>
                      <span>{coupon.name}</span>
                    </div>
                  ))}
                </div>
              )}

              {merchant.highlight && (
                <div className="mt-4 p-3 bg-orange-50 rounded-lg border border-orange-100">
                  <p className="text-orange-700 font-medium">{merchant.highlight}</p>
                </div>
              )}

              {/* 推荐理由 */}
              {merchant.recommendReasons && merchant.recommendReasons.length > 0 && (
                <div className="mt-4">
                  <h3 className="text-sm font-bold text-gray-800 mb-2">🌟 {t.detail.whyThis}</h3>
                  <div className="space-y-1.5">
                    {merchant.recommendReasons.map((reason, idx) => (
                      <div key={idx} className="flex items-start gap-2 text-sm text-gray-600">
                        <span className="text-orange-400 mt-0.5 flex-shrink-0">✓</span>
                        <span>{reason}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* 到店小贴士 */}
              {merchant.tips && merchant.tips.length > 0 && (
                <div className="mt-4 p-3 bg-amber-50 rounded-xl border border-amber-100">
                  <h3 className="text-xs font-bold text-amber-700 mb-2">💡 {t.detail.qa}</h3>
                  <div className="space-y-1">
                    {merchant.tips.map((tip, idx) => (
                      <p key={idx} className="text-xs text-amber-700 leading-5">· {tip}</p>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
          
          <div className="border-t p-4 flex gap-3">
            <Button variant="ghost" onClick={handleShare} className="ml-auto">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
              </svg>
              {t.detail.share}
            </Button>
          </div>
        </div>

        {merchantPackages.length > 0 && (
          <div className="bg-white rounded-2xl shadow-sm overflow-hidden mb-6">
            <div className="p-4 border-b flex items-center gap-2">
              <h2 className="text-lg font-bold text-gray-800">{t.detail.deals}</h2>
              <span className="px-2 py-0.5 bg-orange-100 text-orange-600 text-xs rounded-full">
                {merchantPackages.length}{t.detail.packageCount}
              </span>
              <span className="ml-auto text-xs text-gray-400">{t.detail.packageCountNote}</span>
            </div>
            <div className="p-4">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {merchantPackages.slice(0, 4).map((pkg) => (
                  <div 
                    key={pkg.id} 
                    className="border rounded-xl p-3"
                  >
                    {pkg.tag && (
                      <span className="inline-block px-2 py-0.5 bg-orange-100 text-orange-600 text-xs rounded mb-2">
                        {pkg.tag}
                      </span>
                    )}
                    <h4 className="font-medium text-gray-800 text-sm mb-1 truncate">{pkg.name}</h4>
                    <div className="flex items-baseline gap-1">
                      <span className="text-xl font-bold text-orange-500">¥{pkg.currentPrice}</span>
                      <span className="text-xs text-gray-400 line-through">¥{pkg.originalPrice}</span>
                    </div>
                      <p className="text-xs text-gray-500 mt-1">{t.detail.packageSold} {pkg.sales}+</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        <div className="bg-white rounded-2xl shadow-sm overflow-hidden mb-6">
          <div className="p-4 border-b">
            <h2 className="text-lg font-bold text-gray-800">{t.detail.ratingScore}</h2>
          </div>
          <div className="p-4">
            <div className="flex items-center gap-6 mb-6">
              <div className="text-center">
                <div className="text-4xl font-bold text-orange-500">{merchant.rating}</div>
                <div className="text-sm text-gray-500 mt-1">{t.detail.ratingScore}</div>
                <StarRating rating={merchant.rating} size="sm" />
              </div>
              <div className="flex-1 space-y-2">
                {generateReviewStats().map((stat, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <span className="text-xs text-gray-500 w-8">{stat.label}</span>
                    <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div 
                        className="h-full rounded-full"
                        style={{ width: `${stat.percentage}%`, backgroundColor: stat.color }}
                      />
                    </div>
                    <span className="text-xs text-gray-400 w-10">{stat.percentage}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm overflow-hidden mb-6">
          <div className="p-4 border-b flex items-center justify-between">
            <h2 className="text-lg font-bold text-gray-800">{t.detail.reviews}</h2>
            <Link to="#" className="text-orange-500 text-sm hover:underline">{t.common.viewAll}</Link>
          </div>
          <div className="border-b">
            <div className="flex gap-2 px-4 py-3 overflow-x-auto scrollbar-hide">
              {reviewFilterOptions.map((filter) => (
                <button
                  key={filter.id}
                  onClick={() => setActiveReviewFilter(filter.id)}
                  className={`px-4 py-2 rounded-full text-sm whitespace-nowrap transition-colors ${
                    activeReviewFilter === filter.id
                      ? 'bg-orange-500 text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {filter.label}
                </button>
              ))}
            </div>
          </div>
          <div className="divide-y">
            {filteredReviews.map((review) => (
              <div key={review.id} className="p-4">
                <div className="flex items-start gap-3">
                  <img
                    src={review.avatar}
                    alt={review.userName}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-gray-800">{review.userName}</span>
                      {review.isHot && (
                        <span className="px-1.5 py-0.5 bg-red-100 text-red-500 text-xs rounded">{t.detail.hotReviewTag}</span>
                      )}
                    </div>
                    <p className="text-gray-400 text-xs mt-0.5">{review.date}</p>
                    <div className="mt-1">
                      <StarRating rating={review.rating} size="sm" />
                    </div>
                    <p className="text-gray-600 mt-2">{review.content}</p>
                    {review.images.length > 0 && (
                      <div className="flex gap-2 mt-2">
                        {review.images.map((img, idx) => (
                          <img
                            key={idx}
                            src={img}
                            alt={t.detail.reviewPhotoAlt}
                            className="w-20 h-20 rounded-lg object-cover"
                          />
                        ))}
                      </div>
                    )}
                    <div className="flex items-center gap-4 mt-3">
                      <button 
                        onClick={() => handleLikeReview(review.id)}
                        className={`flex items-center gap-1 text-sm transition-colors ${
                          likedReviews[review.id] ? 'text-orange-500' : 'text-gray-400 hover:text-orange-500'
                        }`}
                      >
                        <svg className="w-4 h-4" fill={likedReviews[review.id] ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
                        </svg>
                        {review.likes + (likedReviews[review.id] ? 1 : 0)}
                      </button>
                      <button 
                        onClick={() => handleReply(review.id)}
                        className="flex items-center gap-1 text-gray-400 hover:text-orange-500 text-sm"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                        </svg>
                        {review.replies}
                      </button>
                    </div>
                    {showReplyInput[review.id] && (
                      <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                        <textarea
                          value={replyContent[review.id] || ''}
                          onChange={(e) => setReplyContent(prev => ({ ...prev, [review.id]: e.target.value }))}
                          placeholder={t.detail.replyPlaceholder}
                          className="w-full p-2 border rounded-lg text-sm resize-none"
                          rows={2}
                        />
                        <div className="flex justify-end gap-2 mt-2">
                          <button 
                            onClick={() => handleReply(review.id)}
                            className="px-3 py-1 text-gray-500 text-sm"
                          >
                            {t.detail.cancelReply}
                          </button>
                          <button 
                            onClick={() => submitReply(review.id)}
                            className="px-3 py-1 bg-orange-500 text-white rounded-full text-sm"
                          >
                            {t.detail.submitReply}
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* === 【P0新增】改进的 FAQ 展示 === */}
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden mb-6">
          <div className="p-4 border-b flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-gray-800">{t.detail.qa}</h2>
              <p className="text-xs text-gray-400 mt-0.5">{buildQaData(merchant, t, lang).length} {t.detail.qaCount}</p>
            </div>
            {buildQaData(merchant, t, lang).length > 5 && (
              <span className="text-xs bg-orange-50 text-orange-600 px-2 py-1 rounded-full">{t.detail.qaTop5}</span>
            )}
          </div>
          <div className="divide-y">
            {buildQaData(merchant, t, lang).map((qa, idx) => {
              // 标记前5个为热门
              const isHot = idx < 5
              const isExpanded = expandedFAQs[idx] ?? isHot
              
              return (
                <div
                  key={idx}
                  className="transition-colors hover:bg-orange-50"
                >
                  <button
                    onClick={() => toggleFAQExpand(idx)}
                    className="w-full p-4 flex items-start justify-between gap-3 text-left"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        {isHot && (
                          <span className="inline-block px-1.5 py-0.5 bg-orange-100 text-orange-600 text-[10px] rounded-full font-bold flex-shrink-0">
                            {t.detail.hotFaq}
                          </span>
                        )}
                        <span className="font-medium text-gray-800 text-sm leading-tight">
                          {qa.question}
                        </span>
                      </div>
                      {isExpanded && (
                        <p className="text-gray-500 text-xs mt-2 leading-5 line-clamp-2">
                          {qa.answer}
                        </p>
                      )}
                    </div>
                    <span
                      className="text-xl text-gray-400 flex-shrink-0 transition-transform"
                      style={{ transform: isExpanded ? 'rotate(0deg)' : 'rotate(-90deg)' }}
                    >
                      ⌄
                    </span>
                  </button>
                  
                  {/* Accordion 展开内容 */}
                  {isExpanded && (
                    <div className="px-4 pb-4 bg-orange-50/30 border-t animate-fadeIn">
                      <div className="flex items-start gap-2 mb-3">
                        <span className="text-blue-500 font-bold text-sm flex-shrink-0">A</span>
                        <span className="text-gray-600 text-sm leading-6">{qa.answer}</span>
                      </div>
                      <button className="text-gray-400 text-xs hover:text-orange-500 transition-colors">
                        👍 {qa.helpful} {t.detail.qaHelpful}
                      </button>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
          <div className="p-4 border-t">
            <button className="w-full py-2 text-orange-500 text-sm hover:bg-orange-50 rounded-lg transition-colors">
              {t.detail.qa} +
            </button>
          </div>
        </div>
        {/* ========================= */}

        {relatedMerchants.length > 0 && (
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-gray-800">{t.detail.relatedMerchants}</h2>
              <Link to={`/category/${merchantCategoryPath}`} className="text-orange-500 text-sm hover:underline">
                {t.common.more}
              </Link>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {relatedMerchants.map((m) => (
                <Link
                  key={m.id}
                  to={`/merchant/${m.id}`}
                  className="block bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-shadow"
                >
                  <div className="aspect-[4/3]">
                    <img
                      src={m.images?.[0] || m.image}
                      alt={`${m.name} ${m.category || ''} ${m.rating || ''}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-3">
                    <h3 className="font-medium text-gray-800 text-sm truncate">{m.name}</h3>
                    <div className="flex items-center gap-1 mt-1">
                      <StarRating rating={m.rating} size="sm" />
                    </div>
                    <p className="text-gray-500 text-xs mt-1">{m.category}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </main>


      {showShareModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setShowShareModal(false)}>
          <div className="bg-white rounded-2xl p-6 max-w-sm mx-4 animate-scaleIn" onClick={e => e.stopPropagation()}>
            <div className="text-center mb-4">
              <h3 className="font-bold text-gray-800 text-lg">{t.detail.share}</h3>
            </div>
            <div className="flex justify-center gap-6 mb-6">
              <button className="flex flex-col items-center gap-2">
                <div className="w-14 h-14 bg-green-500 rounded-full flex items-center justify-center">
                  <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8.691 2.188C3.891 2.188 0 5.476 0 9.53c0 2.212 1.17 4.203 3.002 5.55a.59.59 0 01.213.665l-.39 1.48c-.019.07-.048.141-.048.213 0 .163.13.295.29.295a.326.326 0 00.167-.054l1.903-1.114a.864.864 0 01.717-.098 10.16 10.16 0 002.837.403c.276 0 .543-.027.811-.05-.857-2.578.157-4.972 1.932-6.446 1.703-1.415 3.882-1.98 5.853-1.838-.576-3.583-4.196-6.348-8.596-6.348zM5.785 5.991c.642 0 1.162.529 1.162 1.18a1.17 1.17 0 01-1.162 1.178A1.17 1.17 0 014.623 7.17c0-.651.52-1.18 1.162-1.18zm5.813 0c.642 0 1.162.529 1.162 1.18a1.17 1.17 0 01-1.162 1.178 1.17 1.17 0 01-1.162-1.178c0-.651.52-1.18 1.162-1.18zm5.34 2.867c-1.797-.052-3.746.512-5.28 1.786-1.72 1.428-2.687 3.72-1.78 6.22.942 2.453 3.666 4.229 6.884 4.229.826 0 1.622-.12 2.361-.336a.722.722 0 01.598.082l1.584.926a.272.272 0 00.14.045c.134 0 .24-.111.24-.247 0-.06-.023-.12-.038-.177l-.327-1.233a.582.582 0 01-.023-.156.49.49 0 01.201-.398C23.024 18.48 24 16.82 24 14.98c0-3.21-2.931-5.837-6.656-6.088V8.89c-.135-.01-.27-.03-.406-.03zm-2.53 3.274c.535 0 .969.44.969.982a.976.976 0 01-.969.983.976.976 0 01-.969-.983c0-.542.434-.982.97-.982z"/>
                  </svg>
                </div>
                <span className="text-sm text-gray-600">WeChat</span>
              </button>
              <button className="flex flex-col items-center gap-2">
                <div className="w-14 h-14 bg-red-500 rounded-full flex items-center justify-center">
                  <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M9.585 11.692h4.328s2.432.016 2.432-2.4c0-2.106-2.38-2.18-2.38-2.18s-1.374-.03-2.432-.03c-1.145 0-2.38.156-2.38 2.18 0 2.416 2.38 2.43 2.38 2.43h-3.948v4.368h2.272v-2.368h2.28s.096-.002.096 2.368v2.368h2.208v-4.384h-2.208v-.014z"/>
                  </svg>
                </div>
                <span className="text-sm text-gray-600">Weibo</span>
              </button>
              <button 
                onClick={() => {
                  if (navigator.clipboard) {
                    navigator.clipboard.writeText(window.location.href)
                      .then(() => alert(t.detail.copyLink))
                      .catch(() => alert(t.detail.copyLink + ': ' + window.location.href))
                  } else {
                    alert(t.detail.copyLink + ': ' + window.location.href)
                  }
                  setShowShareModal(false)
                }}
                className="flex flex-col items-center gap-2"
              >
                <div className="w-14 h-14 bg-blue-500 rounded-full flex items-center justify-center">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                </div>
                <span className="text-sm text-gray-600">{t.detail.copyLink}</span>
              </button>
            </div>
            <button 
              onClick={() => setShowShareModal(false)}
              className="w-full py-3 bg-gray-100 text-gray-600 rounded-xl hover:bg-gray-200"
            >
              {t.common.cancel}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
