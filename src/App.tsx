import { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ChevronRight, ArrowLeft, RotateCcw, HelpCircle, ChevronLeft } from 'lucide-react';
import { PalaceDataChartsSection, PalacePaintingChartsPage } from './components/PalaceDataCharts';
import { Building3DCanvas, type BuildingHotspotPick } from './components/Building3DCanvas';
import { BuildingImageHotspot, type ImageHotspotPick } from './components/BuildingImageHotspot';
import { AiGuidePanel } from './components/AiGuidePanel';
import { ErrorBoundary } from './components/ErrorBoundary';
import { HotspotDetailCards } from './components/HotspotDetailCards';
import { cn } from './lib/utils';
import './App.css';

type PageType = 'intro' | 'map' | 'detail' | 'painting';

interface HotspotData {
  id: string;
  name: string;
  shortDesc: string;
  type?: string;
  image?: string;
  positionLabel?: string;
  functionSummary?: string;
  observeTip?: string;
  position: { x: number; y: number; z?: number };
  content: {
    title: string;
    description: string;
    details: string[];
    specs: { label: string; value: string }[];
    cultural?: string;
    deepVisuals?: {
      lineArt?: { src: string; alt: string; caption: string };
      exterior?: { src: string; alt: string; caption: string };
    };
  };
}

interface BuildingData {
  id: string;
  name: string;
  subtitle: string;
  description: string;
  detailType: '3d' | 'image' | 'placeholder';
  image?: string;
  mainImage?: string;
  hotspots: HotspotData[];
  overview: string;
  technical?: string[];
  cultural?: string;
  aiContext?: string;
}

const cornerTowerHotspots: HotspotData[] = [
  {
    id: 'xumizuo',
    name: '须弥座台基',
    shortDesc: '青白石雕刻的等级台基',
    position: { x: 0, y: -1.5, z: 0 },
    content: {
      title: '须弥座台基',
      description: '角楼自身的基座采用等级森严的须弥座台基，整体由青白石雕刻而成。台基上可见束腰、上下枋、仰覆莲瓣等层次，既承托上部木构，也强化宫城转角处的礼制秩序。',
      details: [
        '台基边缘环绕青白石勾栏，栏板、望柱和台阶共同形成稳定的基座边界。',
        '束腰部位通过上下枋夹持，形成清晰的横向分层，让沉重的城台显得更有秩序。',
        '莲瓣纹样与石作收边提升了台基的装饰等级，呼应角楼黄琉璃屋顶的皇家属性。',
        '从平面关系看，台基需要适应宫墙转角与角楼主体的交接，兼顾观景、防御和结构受力。',
        '临护城河一侧更强调稳固与防御，朝向宫城内部的一侧则更突出仪式性和建筑观赏性。',
      ],
      specs: [
        { label: '材质', value: '青白石' },
        { label: '构造层次', value: '束腰、上下枋、莲瓣纹' },
        { label: '空间关系', value: '城墙转角与角楼主体衔接' },
        { label: '功能', value: '承托、排水、礼制象征' },
      ],
      cultural: '须弥座台基让角楼在城防建筑之外，也呈现出宫廷建筑的等级秩序。',
      deepVisuals: {
        lineArt: {
          src: '/images/xumizuo-line.png',
          alt: '须弥座台基结构线稿',
          caption: '结构线稿：台基剖面与立面构造示意',
        },
        exterior: {
          src: '/images/xumizuo-exterior.png',
          alt: '故宫角楼须弥座台基实景',
          caption: '实景照片：角楼台基与城台青白石栏杆',
        },
      },
    },
  },
  {
    id: 'waiqiang',
    name: '外墙',
    shortDesc: '红墙青砖的防御围护',
    position: { x: 1.2, y: 0, z: 1.2 },
    content: {
      title: '外墙',
      description: '角楼的外墙作为建筑的外层围护结构，虽无承重作用（整体为纯木构框架），却兼具防御、围护与装饰功能。外墙采用上下分阶设计，下肩为青砖，上身为紫禁城标志性的红墙，与屋顶黄琉璃瓦形成故宫建筑经典的红墙黄瓦配色。',
      details: [
        '外墙采用上下分阶设计，下肩部分由青砖砌筑而成，青砖质地坚硬、耐磨耐用，能够有效抵御外界的碰撞与侵蚀。',
        '上身部分采用紫禁城标志性的红墙，色彩浓郁庄重，与屋顶的黄琉璃瓦形成鲜明对比。',
        '外墙整体不承担主体承重作用，角楼的主要受力体系仍为内部纯木构框架。',
        '红墙、青砖与黄琉璃瓦共同构成故宫建筑经典配色，使角楼兼具防卫设施的厚重感与皇家建筑的礼制气质。',
      ],
      specs: [
        { label: '下部材质', value: '青砖' },
        { label: '上身做法', value: '紫禁城红墙' },
        { label: '结构属性', value: '围护结构，非主体承重' },
        { label: '功能', value: '围护、防御、装饰' },
        { label: '色彩关系', value: '红墙与黄琉璃瓦对比' },
      ],
      cultural: '外墙把角楼的防御边界、围护需求与宫廷色彩秩序结合起来，让建筑在实用功能之外呈现出鲜明的皇家气派。',
      deepVisuals: {
        exterior: {
          src: '/images/waiqiang-exterior.png',
          alt: '故宫角楼红墙与黄琉璃瓦实景',
          caption: '实景照片：红墙、青砖下肩与黄琉璃瓦共同形成角楼外墙的围护与色彩层次',
        },
      },
    },
  },
  {
    id: 'jianchuang',
    name: '箭窗',
    shortDesc: '兼顾瞭望与防御',
    position: { x: -1.2, y: 0.5, z: 1.2 },
    content: {
      title: '箭窗',
      description: '箭窗分布在角楼墙体之上，是防御功能与建筑立面秩序结合的细节。它们既服务瞭望与射击，也承担必要的采光与通风。',
      details: [
        '箭窗洞口尺度克制，既保证使用功能，也避免削弱墙体完整性。',
        '窗洞在立面上重复排列，形成规整的节奏感。',
        '外侧开口与内部窗格共同控制视线方向，使空间兼具防御和观察功能。',
        '箭窗细部让厚重墙体获得更丰富的层次，而不是单一封闭的红墙面。',
      ],
      specs: [
        { label: '功能', value: '瞭望、防御、采光' },
        { label: '立面效果', value: '重复排列、节奏化开口' },
        { label: '构造特点', value: '小尺度开口与厚墙结合' },
      ],
      cultural: '箭窗体现了角楼在宫城防御体系中的实用属性，也让立面细节具有可读的军事意味。',
    },
  },
  {
    id: 'wuding',
    name: '屋顶体系',
    shortDesc: '多脊歇山屋顶',
    position: { x: 0, y: 2, z: 0 },
    content: {
      title: '屋顶体系',
      description: '屋顶是角楼最具视觉冲击力的部分，以“三重檐、多歇山、十字脊、七十二条脊、二十八翼角”为核心特征，被誉为中国古代屋顶建筑的典范。角楼屋顶由多个歇山顶巧妙穿插、十字交叉构成，既呈现复杂的结构组织，也展示出极强的装饰表现力。',
      details: [
        '屋顶核心为三重檐十字脊结构，由两个歇山顶在90度角相交，并通过山花、博脊等处理形成复杂的屋面组合。',
        '整体形成10个山花面、56个坡面，通高可达27.5米；民间所称“九梁十八柱，七十二条脊”并非精确构件计数，而是凸显屋顶结构繁杂的形象说法。',
        '上层檐为十字交叉歇山顶，四面均显山花，四条正脊在中心交汇，托起铜鎏金葫芦形宝顶，成为整座角楼的视觉焦点。',
        '中层檐四面各衔接一个歇山抱厦，四角延伸出垂脊，多脊相互勾连，形成错落有致的层次感。',
        '下层檐围绕方形平面形成完整檐口体系，四角延伸出岔脊与博脊，与中层檐斗拱相互呼应，共同构成华丽的檐下群落。',
        '屋脊装饰涵盖正脊、垂脊、戗脊、博脊、围脊等多种类型，龙吻、吞脊剑、背兽、火焰珠和走兽序列兼具装饰性与镇火避灾的寓意。',
        '角楼采用皇家专用黄琉璃瓦，瓦当与滴水雕有龙纹，既保证屋顶防水性能，也彰显皇家建筑的尊贵地位。',
        '全楼设有28个翼角和16个窝角，飞檐起翘陡峭、出挑深远，减轻了建筑厚重感，形成“飞檐翘角”的经典景观。',
      ],
      specs: [
        { label: '核心特征', value: '三重檐、多歇山、十字脊' },
        { label: '山花与坡面', value: '10个山花面、56个坡面' },
        { label: '通高', value: '约27.5米（城台地面至宝顶）' },
        { label: '屋脊类型', value: '正脊、垂脊、戗脊、博脊、围脊' },
        { label: '翼角数量', value: '28个翼角、16个窝角' },
        { label: '屋面材料', value: '黄琉璃瓦，瓦当与滴水饰龙纹' },
        { label: '民间概括', value: '九梁十八柱，七十二条脊' },
      ],
      cultural: '角楼屋顶将防御建筑的实用性、皇家礼制的等级感和古代工匠的结构智慧融为一体。复杂的屋脊、翼角与吻兽不仅形成强烈的视觉记忆，也体现出中国古代木构屋顶在力学、排水、装饰和象征意义上的综合成就。',
      deepVisuals: {
        lineArt: {
          src: '/images/wuding-line.png',
          alt: '故宫角楼屋顶体系结构线稿',
          caption: '结构线稿：三重檐、多歇山、十字脊、山花、斗拱、格扇门窗与须弥座等屋顶及立面构造关系',
        },
        exterior: {
          src: '/images/wuding-exterior.png',
          alt: '故宫角楼黄琉璃瓦屋顶实景',
          caption: '实景照片：黄琉璃瓦、正脊、垂脊、吻兽与飞檐翘角细节',
        },
      },
    },
  },
  {
    id: 'dougong',
    name: '斗拱体系',
    shortDesc: '屋檐与梁架之间的过渡层',
    position: { x: 1.5, y: 1, z: 1.5 },
    content: {
      title: '斗拱体系',
      description: '斗拱位于屋檐与梁架之间，是中国古代木构建筑中连接结构功能与装饰美学的重要构件。角楼斗拱承担出檐、承托、分散荷载和组织檐下节奏的多重作用。',
      details: [
        '斗、拱、升等构件层层叠加，将屋面荷载传递至梁架和柱网。',
        '出挑的斗拱延长屋檐，帮助保护墙体免受雨水侵蚀。',
        '檐下斗拱与彩画结合，让结构构件也成为视觉装饰的一部分。',
        '不同层级屋檐下的斗拱尺度和密度，共同塑造角楼复杂但有序的立面层次。',
      ],
      specs: [
        { label: '核心构件', value: '斗、拱、升' },
        { label: '结构作用', value: '承托、分散荷载、出檐' },
        { label: '视觉作用', value: '形成檐下层次与节奏' },
      ],
      cultural: '斗拱体系让角楼的结构逻辑直接转化为可见的装饰秩序，体现古代木构建筑“结构即审美”的特征。',
    },
  },
  {
    id: 'liangjia',
    name: '梁架与木构',
    shortDesc: '内部承重骨架',
    position: { x: 0, y: 0.5, z: 0 },
    content: {
      title: '梁架与木构',
      description: '梁架与木构是角楼稳定性的核心。角楼内部空间需要兼顾防御瞭望、人员活动和屋顶承托，因此梁架组织必须在复杂屋顶与开敞空间之间取得平衡。',
      details: [
        '木构构件通过榫卯关系相互咬合，减少对金属连接件的依赖。',
        '梁架将屋顶重量传递到柱网和台基，保证复杂屋面体系的稳定。',
        '内部空间保持相对开敞，便于瞭望、防守和通行。',
        '榫卯节点允许木构在受力时具有一定弹性，提升整体抗震和耐久表现。',
      ],
      specs: [
        { label: '连接方式', value: '榫卯结构' },
        { label: '受力路径', value: '屋顶至梁架、柱网、台基' },
        { label: '空间特点', value: '开敞、通透、便于瞭望' },
      ],
      cultural: '梁架与木构体现了古代工匠对材料、力学和空间秩序的综合掌控。',
    },
  },
  {
    id: 'caizuo',
    name: '室内装饰',
    shortDesc: '彩画与天花细节',
    position: { x: -0.5, y: 1, z: -0.5 },
    content: {
      title: '室内装饰',
      description: '室内装饰虽然服务于角楼的实际功能，但依然延续皇家建筑的审美体系。梁枋、天花、彩画与细部构件共同构成内部空间的礼制氛围。',
      details: [
        '彩画常以青、绿、红、金等色彩组织空间，增强室内层次。',
        '梁枋和天花的图案让木构构件获得装饰性表达。',
        '内部不以繁复陈设取胜，而是通过结构和彩画呈现克制的华丽感。',
        '装饰细节与外部红墙黄瓦相互呼应，使角楼内外风格保持统一。',
      ],
      specs: [
        { label: '装饰类型', value: '彩画、天花、梁枋细部' },
        { label: '主色关系', value: '青、绿、红、金' },
        { label: '表达重点', value: '礼制、秩序、皇家审美' },
      ],
      cultural: '室内装饰说明角楼并非纯粹军事设施，而是宫城建筑系统中兼具实用与礼制审美的节点。',
    },
  },
];

cornerTowerHotspots.forEach((hotspot) => {
  const defaults: Record<string, Pick<HotspotData, 'positionLabel' | 'functionSummary' | 'observeTip'>> = {
    xumizuo: {
      positionLabel: '建筑下部台基',
      functionSummary: '承托楼体、组织排水并表达礼制等级',
      observeTip: '请从低角度观察台基与城墙转角的衔接关系',
    },
    waiqiang: {
      positionLabel: '建筑外侧围护',
      functionSummary: '围护、防御与红墙黄瓦的视觉秩序',
      observeTip: '请环绕模型观察墙体、箭窗与屋檐的层次',
    },
    jianchuang: {
      positionLabel: '墙体开口部位',
      functionSummary: '兼顾瞭望、防御、采光与立面节奏',
      observeTip: '请从侧面观察箭窗开口与厚重墙体的比例',
    },
    wuding: {
      positionLabel: '建筑上部屋顶',
      functionSummary: '排水、防护、视觉中心与等级表达',
      observeTip: '请俯看屋脊交错关系，再转到侧面观察飞檐层次',
    },
    dougong: {
      positionLabel: '屋檐与梁架之间',
      functionSummary: '承托出檐、分散荷载并形成檐下装饰秩序',
      observeTip: '请放大檐下区域，观察斗、拱、梁枋如何层叠',
    },
    liangjia: {
      positionLabel: '内部木构骨架',
      functionSummary: '传递屋顶荷载并稳定复杂屋面体系',
      observeTip: '请旋转模型寻找屋顶与柱网之间的受力关系',
    },
    caizuo: {
      positionLabel: '室内与梁枋装饰',
      functionSummary: '以彩画和天花组织礼制审美与空间氛围',
      observeTip: '请对照构件说明理解装饰如何依附于木构体系',
    },
  };

  Object.assign(hotspot, defaults[hotspot.id] ?? {
    positionLabel: '三维模型构件',
    functionSummary: hotspot.shortDesc,
    observeTip: '请旋转模型，从整体层次中定位该构件',
  });
});

const CUSTOM_FORBIDDEN_CITY_MAP = '/images/custom-palace-map.png';
const CUSTOM_MAP_SIZE = { width: 1879, height: 837 };

const FORBIDDEN_CITY_MAP_MARKERS = [
  { id: 'wumen', name: '午门', x: 332, y: 630 },
  { id: 'taihe_dian', name: '太和殿', x: 740, y: 430 },
  { id: 'qianqing_gong', name: '乾清宫', x: 1122, y: 252 },
  { id: 'wenhua_dian', name: '文华殿', x: 723, y: 716 },
  { id: 'wuying_dian', name: '武英殿', x: 385, y: 372 },
  { id: 'corner_tower', name: '东北角楼', x: 1794, y: 312 },
] as const;

const buildingImage = (fileName: string) => `/images/buildings/${fileName}`;

function makeImageHotspot({
  id,
  name,
  type,
  summary,
  position,
  details,
  technical,
  cultural,
  image,
}: {
  id: string;
  name: string;
  type: string;
  summary: string;
  position: { x: number; y: number };
  details: string[];
  technical: { label: string; value: string }[];
  cultural: string;
  image?: string;
}): HotspotData {
  const hotspotImage = image ?? buildingImage(`${id}.jpg`);

  return {
    id,
    name,
    type,
    shortDesc: type,
    image: hotspotImage,
    position,
    content: {
      title: name,
      description: summary,
      details,
      specs: technical,
      cultural,
      deepVisuals: {
        exterior: {
          src: hotspotImage,
          alt: name,
          caption: `${name}局部图：${summary}`,
        },
      },
    },
  };
}

const wumenHotspots: HotspotData[] = [
  makeImageHotspot({
    id: 'wumen-duntai-mendong',
    name: '墩台与门洞',
    type: '外部结构',
    summary: '高大的红色墩台承托上部城楼，正面三门与两侧掖门共同形成午门“明三暗五”的通行秩序。',
    position: { x: 50, y: 87 },
    image: buildingImage('wumen-zhutu.jpg'),
    details: ['墩台是午门五凤楼形制的基础，兼具承托、防御和礼制界面的作用。', '正面三门面向宫城中轴，两侧掖门隐藏在转折处，形成等级分明的入宫路径。', '门洞空间把建筑体量、通行制度和皇城入口形象压缩在同一界面上。'],
    technical: [{ label: '构成', value: '红色墩台、正面三门、两侧掖门' }, { label: '制度', value: '明三暗五' }, { label: '功能', value: '承托城楼、控制通行、强化入口仪式' }],
    cultural: '午门的墩台与门洞把皇城入口转化为可见的等级秩序，是紫禁城权力边界的第一重表达。',
  }),
  makeImageHotspot({
    id: 'wumen-zhulou',
    name: '主楼',
    type: '外部结构',
    summary: '午门主楼居中高耸，重檐庑殿顶与黄琉璃瓦构成紫禁城正门最醒目的礼制形象。',
    position: { x: 50, y: 76 },
    details: ['主楼面阔九间、进深五间，尺度与数字都指向皇家建筑的高等级。', '重檐庑殿顶强化中轴正门的庄重感，远观时成为午门天际线核心。', '楼上钟鼓曾服务颁诏、典礼等仪式场景。'],
    technical: [{ label: '面阔', value: '九间' }, { label: '进深', value: '五间' }, { label: '屋顶', value: '重檐庑殿顶' }],
    cultural: '主楼把午门从单纯门阙提升为皇权发布与仪式观看的建筑舞台。',
  }),
  makeImageHotspot({
    id: 'wumen-yanchilou',
    name: '东西雁翅楼',
    type: '空间格局',
    summary: '两翼雁翅楼向东西展开，使午门平面呈“凹”字形，形成环抱式的宫门空间。',
    position: { x: 20, y: 62 },
    details: ['雁翅楼连接主楼与两端阙亭，延展了午门正立面的横向气势。', '展开的两翼增强了门前空间的围合感，也让人流在进入紫禁城前先被仪式空间组织。', '单檐歇山顶与主楼高低错落，构成五凤楼形象的重要侧翼。'],
    technical: [{ label: '平面', value: '凹字形展开' }, { label: '屋顶', value: '单檐歇山顶' }, { label: '作用', value: '连接主楼、围合门前空间' }],
    cultural: '雁翅楼让午门具有“展开而环抱”的入口姿态，既有防御边界，也有礼仪引导。',
  }),
  makeImageHotspot({
    id: 'wumen-queting',
    name: '四座阙亭',
    type: '外部结构',
    summary: '四座阙亭分列两翼端部，以重檐攒尖顶丰富午门的天际线，完成“五凤楼”形象。',
    position: { x: 63, y: 78 },
    details: ['阙亭位于雁翅楼四隅，是午门轮廓中最灵动的竖向节点。', '重檐攒尖顶与主楼屋顶形成等级和节奏差异。', '四亭拱卫主楼，使入口建筑带有更强的宫阙象征。'],
    technical: [{ label: '数量', value: '四座' }, { label: '屋顶', value: '重檐攒尖顶' }, { label: '空间角色', value: '拱卫主楼、丰富天际线' }],
    cultural: '阙亭强化了午门的宫阙意味，使紫禁城正门呈现被礼制秩序编排过的华丽边界。',
  }),
  makeImageHotspot({
    id: 'wumen-zhongmen-yudao',
    name: '中门御道',
    type: '礼制空间',
    summary: '中门与御道位于轴线核心，体现皇帝专属通行以及特殊礼仪场景中的等级例外。',
    position: { x: 50, y: 94 },
    details: ['午门中门通常为皇帝专用，皇后大婚、殿试前三甲等少数场景可获得特殊通行资格。', '御道把门洞、广场和宫城中轴连接为连续的礼仪路线。', '通行资格的差异让空间本身成为制度文本。'],
    technical: [{ label: '位置', value: '午门中轴' }, { label: '通行', value: '皇帝专属为主，少数典礼例外' }, { label: '功能', value: '组织礼仪路线' }],
    cultural: '中门御道将尊卑秩序直接写入行走路径，是午门最清晰的制度性空间。',
  }),
];

const taihedianHotspots: HotspotData[] = [
  makeImageHotspot({ id: 'taihedian-san-ceng-hanbaiyu-taiji', name: '三层汉白玉台基', type: '外部结构', summary: '三层汉白玉台基托举太和殿，使最高礼制建筑在广场中获得层层抬升的视觉威仪。', position: { x: 50, y: 76 }, details: ['台基以三层须弥座展开，配合栏板、望柱、螭首排水和御路石雕。', '层层抬升让殿身脱离地面，强化大典空间的中心性。', '白石台基与红柱黄瓦形成强烈的皇家色彩对比。'], technical: [{ label: '层数', value: '三层' }, { label: '材料', value: '汉白玉' }, { label: '构件', value: '栏杆、螭首、御路石' }], cultural: '三层台基不仅承托建筑，也把外朝最高礼制的等级感转化为可见的高度差。' }),
  makeImageHotspot({ id: 'taihedian-dianshen-shiyi-kaijian', name: '殿身与十一开间', type: '外部结构', summary: '太和殿面阔十一间、进深五间，巨大的木构体量体现外朝核心建筑的最高规制。', position: { x: 49, y: 45 }, details: ['十一开间形成宏阔正立面，强化中轴对称和国家大典的空间尺度。', '柱网、梁架与殿内空间共同服务大型典仪和仪仗陈设。', '殿身尺度与三层台基、屋顶等级共同构成太和殿的最高形象。'], technical: [{ label: '面阔', value: '十一间' }, { label: '进深', value: '五间' }, { label: '结构', value: '木构柱网与梁架' }], cultural: '十一开间使太和殿区别于其他殿宇，成为紫禁城外朝权力中心的尺度宣言。' }),
  makeImageHotspot({ id: 'taihedian-zhongyan-wudian-ding', name: '重檐庑殿顶', type: '礼制空间', summary: '重檐庑殿顶是古代殿宇屋顶中的最高等级，与黄琉璃瓦共同塑造太和殿的至尊形象。', position: { x: 51, y: 20 }, details: ['庑殿顶四面出坡，重檐形式增加建筑的层次和高度。', '正脊、垂脊、吻兽与走兽序列共同服务屋面收边和礼制象征。', '黄琉璃瓦在阳光下强化外朝核心建筑的视觉识别。'], technical: [{ label: '屋顶等级', value: '重檐庑殿顶' }, { label: '屋面', value: '黄琉璃瓦' }, { label: '装饰', value: '吻兽、走兽、脊饰' }], cultural: '重檐庑殿顶让太和殿成为故宫屋顶等级秩序的最高样本。' }),
  makeImageHotspot({ id: 'taihedian-dougong-tixi', name: '斗拱体系', type: '工艺细节', summary: '斗拱位于柱网与屋檐之间，承担出檐、传力和营造等级装饰的多重作用。', position: { x: 72, y: 36 }, details: ['斗拱把屋面荷载传递至梁架和柱网，并扩大屋檐出挑。', '密集的檐下构件形成节奏化阴影，丰富殿身立面。', '彩画与斗拱结合，使结构节点同时具有装饰意义。'], technical: [{ label: '构件', value: '斗、拱、升' }, { label: '功能', value: '承托、传力、出檐' }, { label: '表现', value: '檐下等级装饰' }], cultural: '太和殿斗拱把力学结构和皇家审美合并为一套可观看的等级系统。' }),
  makeImageHotspot({ id: 'taihedian-yizhang-chenshe', name: '仪仗陈设', type: '礼制空间', summary: '殿前宝象、甪端、仙鹤、香亭、日晷和嘉量等陈设共同构成大典的礼仪环境。', position: { x: 24, y: 64 }, details: ['仪仗陈设分布在殿前台基与月台附近，服务国家大典的视觉秩序。', '日晷、嘉量象征时间与度量，体现王朝制度化治理。', '铜兽与香亭将神圣性、秩序感和仪式气氛集中在殿前空间。'], technical: [{ label: '陈设', value: '日晷、嘉量、香亭、铜兽' }, { label: '位置', value: '殿前月台与台基' }, { label: '功能', value: '仪式陈设与制度象征' }], cultural: '仪仗陈设让太和殿前空间不只是广场，而是国家礼制被逐件展开的现场。' }),
  makeImageHotspot({ id: 'taihedian-hexicaihua', name: '和玺彩画', type: '工艺细节', summary: '和玺彩画以龙凤纹和青绿金色调装饰梁枋，是皇家最高等级彩画体系之一。', position: { x: 68, y: 49 }, details: ['梁枋彩画与斗拱、檐下空间相互衔接，形成连续装饰带。', '龙凤纹样和金色线条强调皇家建筑的等级。', '彩画既保护木构表面，也承担礼制表达和视觉识别。'], technical: [{ label: '类型', value: '和玺彩画' }, { label: '纹样', value: '龙凤、云纹、金线' }, { label: '位置', value: '梁枋与檐下构件' }], cultural: '和玺彩画让太和殿的木构表面成为皇家权力和工艺等级的视觉文本。' }),
];

const wenhuadianHotspots: HotspotData[] = [
  makeImageHotspot({ id: 'wenhuadian-zhudian-xingzhi', name: '主殿形制', type: '外部结构', summary: '文华殿主殿尺度克制而规整，呈现外朝东路文治空间的典雅气质。', position: { x: 50, y: 52 }, details: ['主殿以院落式布局组织，与太和殿的宏大典礼尺度形成区分。', '面阔五间、进深三间的格局适合讲学、典籍和文治活动。', '建筑形象庄重但不夸张，符合文华殿的文教属性。'], technical: [{ label: '面阔', value: '五间' }, { label: '进深', value: '三间' }, { label: '布局', value: '院落式主殿' }], cultural: '文华殿主殿形制强调文治空间的秩序与含蓄，而非最高典礼空间的压迫感。' }),
  makeImageHotspot({ id: 'wenhuadian-danyan-wudian-ding', name: '单檐庑殿顶', type: '外部结构', summary: '单檐庑殿顶保持较高礼制等级，同时以克制尺度契合文华殿的典雅定位。', position: { x: 51, y: 25 }, details: ['屋顶等级高于一般建筑，但低于重檐核心殿宇。', '黄琉璃瓦与红墙柱色延续故宫建筑基本色彩秩序。', '单檐处理让文华殿更显平稳内敛。'], technical: [{ label: '屋顶', value: '单檐庑殿顶' }, { label: '屋面', value: '黄琉璃瓦' }, { label: '气质', value: '高等级但克制' }], cultural: '单檐庑殿顶体现“文”的庄重与节制，避免与外朝三大殿的最高礼制混同。' }),
  makeImageHotspot({ id: 'wenhuadian-zuowen-youwu-geju', name: '左文右武格局', type: '空间格局', summary: '文华殿居外朝东路，与西路武英殿相对，形成紫禁城“左文右武”的空间秩序。', position: { x: 24, y: 68 }, details: ['文华殿与武英殿分列外朝东西两翼，围绕中轴形成文武分置。', '这种位置关系把政治、教育和军政功能纳入宫城整体格局。', '东侧文华殿更强调讲学、典籍与文治象征。'], technical: [{ label: '方位', value: '外朝东路' }, { label: '对应', value: '西路武英殿' }, { label: '格局', value: '左文右武' }], cultural: '左文右武格局说明紫禁城的空间不是随意排列，而是把治理理念写进方位关系。' }),
  makeImageHotspot({ id: 'wenhuadian-jingyan-jiangxue', name: '经筵讲学', type: '历史功能', summary: '文华殿与经筵讲学、皇帝听讲经史和儒家经典教育密切相关。', position: { x: 70, y: 58 }, details: ['经筵讲学是皇帝与文臣围绕经史展开的制度化学习活动。', '讲学空间连接皇权、文臣集团与儒家政治理念。', '文华殿因此成为外朝东路最具文治意味的节点。'], technical: [{ label: '活动', value: '经筵讲学' }, { label: '参与者', value: '皇帝、讲官、文臣' }, { label: '主题', value: '经史与治国之道' }], cultural: '经筵讲学让文华殿成为皇权接受经典约束与文臣进言的象征性空间。' }),
  makeImageHotspot({ id: 'wenhuadian-dianji-shuhua-zhancheng', name: '典籍书画展陈', type: '近现代功能', summary: '故宫博物院成立后，文华殿逐渐承担典籍、书画等文化展陈功能。', position: { x: 78, y: 77 }, details: ['近现代展陈延续了文华殿与文献、书画之间的文化联系。', '从宫廷讲学空间转为博物馆展览空间，功能改变但文脉延续。', '观众可在此理解宫廷文化生产和保存的连续性。'], technical: [{ label: '现代功能', value: '典籍、书画类展陈' }, { label: '空间转化', value: '宫廷空间至博物馆空间' }, { label: '展示主题', value: '文献与艺术' }], cultural: '文华殿的展陈功能使“文治”从帝王教育转化为公众共享的文化资源。' }),
];

const wuyingdianHotspots: HotspotData[] = [
  makeImageHotspot({ id: 'wuyingdian-zhudian-xingzhi', name: '主殿形制', type: '外部结构', summary: '武英殿主殿稳重刚健，与东侧文华殿相对，构成外朝西路的重要建筑节点。', position: { x: 50, y: 52 }, details: ['主殿采用规整院落格局，尺度与文华殿相近。', '形制稳重，适合承载军政议事、修书和展陈等多重功能。', '西路位置使其在外朝格局中承担“武”的一侧。'], technical: [{ label: '面阔', value: '五间' }, { label: '进深', value: '三间' }, { label: '格局', value: '外朝西路院落' }], cultural: '武英殿主殿把“武”的治理功能纳入礼制建筑，而不是脱离宫廷秩序的军事空间。' }),
  makeImageHotspot({ id: 'wuyingdian-danyan-wudian-ding', name: '单檐庑殿顶', type: '外部结构', summary: '单檐庑殿顶和黄琉璃瓦体现较高建筑等级，整体气质庄重而不张扬。', position: { x: 52, y: 24 }, details: ['屋顶形式与文华殿相呼应，体现东西两翼建筑的对称关系。', '单檐处理避免与中轴最高殿宇争夺礼制中心。', '屋顶、斗拱和梁枋共同塑造稳定的立面秩序。'], technical: [{ label: '屋顶', value: '单檐庑殿顶' }, { label: '屋面', value: '黄琉璃瓦' }, { label: '等级', value: '高等级外朝配殿' }], cultural: '武英殿屋顶体现西路殿宇的礼制身份，也保持对中轴核心的从属关系。' }),
  makeImageHotspot({ id: 'wuyingdian-dougong-liangfang', name: '斗拱与梁枋', type: '工艺细节', summary: '斗拱与梁枋共同组织檐下节奏，展现武英殿规整克制的木构工艺。', position: { x: 68, y: 42 }, details: ['斗拱承托屋檐并将荷载传递至梁架。', '梁枋彩画强化建筑等级，同时保持西路空间的沉稳气质。', '构件节奏让主殿立面更有秩序。'], technical: [{ label: '构件', value: '斗拱、梁枋、彩画' }, { label: '功能', value: '承托、传力、装饰' }, { label: '表现', value: '规整克制' }], cultural: '这些工艺细节说明武英殿同样属于精细的皇家木构系统，而非单纯功能建筑。' }),
  makeImageHotspot({ id: 'wuyingdian-junzheng-yishi', name: '军政议事', type: '历史功能', summary: '武英殿曾与明代政务、军政议事等活动相关，体现“武”被纳入宫廷治理体系。', position: { x: 26, y: 66 }, details: ['武英殿的“武”并非单指作战，而是指军政、政务和决策空间。', '宫廷通过空间分区把文治与武备置于同一礼制格局中。', '相关功能使武英殿成为外朝西路具有政治性的节点。'], technical: [{ label: '历史功能', value: '军政议事、政务活动' }, { label: '空间属性', value: '外朝西路' }, { label: '治理关系', value: '文武分置并行' }], cultural: '军政议事功能让武英殿呈现从“武”到“治”的转化，反映宫廷治理的复合结构。' }),
  makeImageHotspot({ id: 'wuyingdian-shuju', name: '武英殿书局', type: '历史功能', summary: '清代武英殿书局承担典籍刊刻与整理，使武英殿从军政空间转向文化生产空间。', position: { x: 60, y: 72 }, details: ['武英殿书局参与大型典籍编纂、刊刻和校勘。', '殿宇功能从政治议事扩展为知识整理和文化生产。', '书局活动让“武英殿”成为出版史和文献史中的重要名称。'], technical: [{ label: '机构', value: '武英殿书局' }, { label: '工种', value: '编纂、校勘、刊刻' }, { label: '产出', value: '宫廷典籍与书版' }], cultural: '武英殿书局显示宫廷权力也通过典籍生产、知识整理和出版技术延续影响。' }),
  makeImageHotspot({ id: 'wuyingdian-diaoban-yinshua-gongyi', name: '雕版印刷工艺', type: '工艺细节', summary: '雕版印刷与书局功能相连，呈现宫廷典籍生产背后的技术传统。', position: { x: 78, y: 82 }, details: ['雕版印刷需要书写、刻版、刷印和装帧等环节协作。', '工艺图像帮助观众把建筑功能与具体技术过程联系起来。', '武英殿的文化价值不仅在建筑，也在其承载的知识生产机制。'], technical: [{ label: '工艺', value: '雕版印刷' }, { label: '流程', value: '写样、刻版、刷印、装帧' }, { label: '关联', value: '武英殿书局' }], cultural: '雕版印刷工艺让武英殿成为理解宫廷文化生产技术的入口。' }),
];

const qianqinggongHotspots: HotspotData[] = [
  makeImageHotspot({ id: 'qianqinggong-neiting-zhonglu', name: '内廷中路', type: '空间格局', summary: '乾清宫位于内廷中路最前端，前接外朝，后连交泰殿、坤宁宫，体现“前朝后寝”的秩序。', position: { x: 50, y: 24 }, details: ['乾清宫是后三宫之首，是外朝进入内廷后的第一个核心节点。', '它连接前朝礼制空间与后寝生活空间，具有空间转换意义。', '中路位置让乾清宫天然承担内廷权力中心的角色。'], technical: [{ label: '位置', value: '内廷中路前端' }, { label: '前后关系', value: '前接外朝，后连交泰殿、坤宁宫' }, { label: '格局', value: '前朝后寝' }], cultural: '内廷中路让乾清宫区别于外朝大殿，它是皇帝日常权力运行进入后寝空间的关键节点。' }),
  makeImageHotspot({ id: 'qianqinggong-yuetai-yuanluo', name: '月台与院落', type: '外部空间', summary: '殿前月台与院落组织乾清宫的内廷正殿空间，突出寝宫与理政合一的场所感。', position: { x: 50, y: 78 }, details: ['月台、配殿与廊庑共同围合出内廷正殿前的过渡空间。', '此处不只是台基构造，更是日常召见、礼仪和通行的组织界面。', '院落尺度较外朝收敛，带有更强的内廷生活和管理属性。'], technical: [{ label: '构成', value: '月台、院落、配殿、廊庑' }, { label: '功能', value: '组织通行、召见与内廷仪式' }, { label: '气质', value: '内廷正殿空间' }], cultural: '月台与院落把乾清宫的“寝”和“政”连接起来，显示内廷权力并不只发生在殿内。' }),
  makeImageHotspot({ id: 'qianqinggong-jiujian-dianshen', name: '九间殿身', type: '建筑规制', summary: '乾清宫面阔九间、进深五间，体现内廷最高规格，但不等同于太和殿的外朝最高典礼尺度。', position: { x: 50, y: 48 }, details: ['九间殿身暗合“九五之尊”的数字象征。', '内廷正殿规格很高，但功能重点在寝居、召见和日常理政。', '与太和殿十一开间相比，乾清宫更强调内廷核心而非国家大典广场。'], technical: [{ label: '面阔', value: '九间' }, { label: '进深', value: '五间' }, { label: '属性', value: '内廷最高规格之一' }], cultural: '九间殿身体现皇帝在内廷的中心位置，同时保留乾清宫作为日常权力空间的独特性。' }),
  makeImageHotspot({ id: 'qianqinggong-qiju-lizheng', name: '起居理政空间', type: '历史功能', summary: '乾清宫既是皇帝寝宫，也曾是批阅奏章、召见臣工和处理日常政务的空间。', position: { x: 30, y: 58 }, details: ['明代至清初，乾清宫长期承担皇帝寝居与日常理政功能。', '寝宫与政务空间重合，说明帝王日常生活与国家治理难以分离。', '雍正以后皇帝常居养心殿，但乾清宫典仪和象征功能仍然重要。'], technical: [{ label: '功能', value: '寝居、批阅奏章、召见臣工' }, { label: '时期', value: '明代至清初尤为突出' }, { label: '空间性质', value: '寝政合一' }], cultural: '起居理政空间是乾清宫区别于太和殿的关键，它呈现的是日常权力如何持续运转。' }),
  makeImageHotspot({ id: 'qianqinggong-zhengda-guangming', name: '正大光明匾', type: '制度象征', summary: '“正大光明”匾是乾清宫最具辨识度的视觉符号，连接皇权正统、政治公开性和空间象征。', position: { x: 52, y: 38 }, details: ['匾额悬于殿内核心视线位置，成为乾清宫最重要的象征物之一。', '其文字含义强调君主政治的正当性和公开性。', '匾额背后又与秘密立储制度发生联系，使其兼具道德象征和制度节点。'], technical: [{ label: '位置', value: '乾清宫殿内核心视线' }, { label: '文字', value: '正大光明' }, { label: '关联', value: '秘密立储制度' }], cultural: '正大光明匾把道德政治、皇权正统和皇位传承制度压缩在一个高度可识别的视觉符号中。' }),
  makeImageHotspot({ id: 'qianqinggong-jianchu-mixia', name: '建储密匣', type: '制度象征', summary: '清代秘密立储制度确立后，建储密匣藏于“正大光明”匾后，使乾清宫成为皇位传承制度的象征空间。', position: { x: 70, y: 43 }, details: ['雍正以后秘密立储成为清代皇位传承的重要制度。', '建储密匣藏于匾后，将继承人信息与乾清宫空间绑定。', '这一安排减少公开争储，也让乾清宫具有制度档案的特殊意义。'], technical: [{ label: '制度', value: '秘密立储' }, { label: '藏置', value: '正大光明匾后' }, { label: '对象', value: '皇位继承人密旨' }], cultural: '建储密匣让乾清宫不只是寝宫，而成为清代皇位传承制度被空间化保存的地方。' }),
  makeImageHotspot({ id: 'qianqinggong-yuanzhuang-chenlie', name: '原状陈列', type: '近现代功能', summary: '故宫博物院开放后，乾清宫作为宫廷原状陈列空间，保留帝王生活与理政场景的历史层次。', position: { x: 35, y: 72 }, details: ['原状陈列让观众看到宝座、屏风、匾额和室内陈设之间的整体关系。', '展陈重点不是单件文物，而是宫廷空间和权力场景的复原感。', '博物馆语境下的乾清宫继续承担历史解释功能。'], technical: [{ label: '现代功能', value: '宫廷原状陈列' }, { label: '展示对象', value: '宝座、屏风、匾额、室内陈设' }, { label: '展示方式', value: '空间整体陈列' }], cultural: '原状陈列使乾清宫的寝居、理政和制度象征转化为公众可阅读的历史现场。' }),
];

const BUILDINGS_BY_ID: Record<string, BuildingData> = {
  wumen: {
    id: 'wumen',
    name: '午门',
    detailType: 'image',
    subtitle: '皇权入口与五凤楼形制',
    description: '紫禁城正门',
    image: '/images/wumen-zhutu.jpg',
    mainImage: '/images/wumen-zhutu.jpg',
    overview: '午门为紫禁城正门，平面呈“凹”字形，由高大墩台、主楼、东西雁翅楼和四座阙亭共同构成“五凤楼”形象。它既是进入皇城的空间界面，也是颁诏、献俘和重大典礼中呈现皇权秩序的重要门阙。',
    technical: ['凹字形平面', '明三暗五门洞制度', '主楼面阔九间、进深五间', '重檐庑殿顶与四隅阙亭'],
    cultural: '午门通过门洞通行、城楼形制和中轴御道，把皇权入口转化为清晰可读的礼制空间。',
    aiContext: '午门主题：皇权入口、礼制门阙、五凤楼、明三暗五、中门御道。',
    hotspots: wumenHotspots,
  },
  taihe_dian: {
    id: 'taihe_dian',
    name: '太和殿',
    detailType: 'image',
    subtitle: '外朝核心与最高礼制建筑',
    description: '明清举行大典的场所',
    image: buildingImage('taihedian-zhutu.jpg'),
    mainImage: buildingImage('taihedian-zhutu.jpg'),
    overview: '太和殿俗称“金銮殿”，是紫禁城外朝三大殿之首，也是宫城内体量与等级最高的殿宇。三层汉白玉台基、十一开间殿身、重檐庑殿顶和殿前仪仗陈设共同营造出国家大典的最高礼制场景。',
    technical: ['三层汉白玉台基', '面阔十一间、进深五间', '重檐庑殿顶', '和玺彩画与高等级斗拱'],
    cultural: '太和殿的价值集中在外朝最高典礼空间，体现国家礼制、皇权中心和营造规制的最高等级。',
    aiContext: '太和殿主题：外朝核心、最高礼制、国家大典、三层台基、十一开间、重檐庑殿顶。',
    hotspots: taihedianHotspots,
  },
  qianqing_gong: {
    id: 'qianqing_gong',
    name: '乾清宫',
    detailType: 'image',
    subtitle: '内廷后三宫之首',
    description: '皇帝寝宫与理政空间',
    image: buildingImage('qianqinggong-zhutu.jpg'),
    mainImage: buildingImage('qianqinggong-zhutu.jpg'),
    overview: '乾清宫为内廷后三宫之首，位于内廷中路最前端，前接外朝、后连交泰殿与坤宁宫。它的核心不是外朝最高大典，而是皇帝寝居、日常理政、正大光明匾和秘密立储制度共同构成的内廷权力运行空间。',
    technical: ['内廷中路前端', '面阔九间、进深五间', '月台与院落组织内廷正殿空间', '正大光明匾后关联建储密匣'],
    cultural: '乾清宫突出“前朝后寝”“寝政合一”和皇位传承制度，是理解清宫日常权力与原状陈列的重要建筑。',
    aiContext: '乾清宫主题：内廷正寝、寝宫与理政合一、正大光明匾、秘密立储、建储密匣、原状陈列。',
    hotspots: qianqinggongHotspots,
  },
  wuying_dian: {
    id: 'wuying_dian',
    name: '武英殿',
    detailType: 'image',
    subtitle: '外朝西路殿宇',
    description: '西路文献与典籍空间',
    image: buildingImage('wuyingdian-zhutu.jpg'),
    mainImage: buildingImage('wuyingdian-zhutu.jpg'),
    overview: '武英殿位于紫禁城外朝西路，与东侧文华殿形成“左文右武”的对称格局。它曾关联军政议事，清代又因武英殿书局、典籍刊刻和雕版印刷而成为宫廷文化生产的重要空间。',
    technical: ['外朝西路院落', '主殿面阔五间、进深三间', '单檐庑殿顶', '武英殿书局与雕版印刷功能'],
    cultural: '武英殿展示的是“武”如何被纳入礼制，又如何转化为修书、刻书和文化生产。',
    aiContext: '武英殿主题：外朝西路、左文右武、军政议事、武英殿书局、雕版印刷、书画典籍展陈。',
    hotspots: wuyingdianHotspots,
  },
  wenhua_dian: {
    id: 'wenhua_dian',
    name: '文华殿',
    detailType: 'image',
    subtitle: '外朝东路殿宇',
    description: '东路典学空间',
    image: buildingImage('wenhuadian-zhutu.jpg'),
    mainImage: buildingImage('wenhuadian-zhutu.jpg'),
    overview: '文华殿位于紫禁城外朝东路，与西侧武英殿相对，形成“左文右武”的格局。它的主题更偏向文治、经筵讲学、皇子教育和典籍书画展陈，建筑气质典雅内敛，不以太和殿式的最高典礼尺度取胜。',
    technical: ['外朝东路院落', '主殿面阔五间、进深三间', '单檐庑殿顶', '经筵讲学与典籍书画展陈功能'],
    cultural: '文华殿把文治讲学和宫廷典籍传统安置在外朝东路，是理解紫禁城文教空间的重要节点。',
    aiContext: '文华殿主题：外朝东路、文治讲学、经筵、左文右武、典籍书画展陈。',
    hotspots: wenhuadianHotspots,
  },
  corner_tower: {
    id: 'corner_tower',
    name: '东北角楼',
    detailType: '3d',
    subtitle: '九梁十八柱七十二条脊',
    description: '紫禁城城池防卫设施',
    image: '/images/corner-tower.jpg',
    overview: '紫禁城垣四隅角楼为城池防卫与礼制象征并重的木构高层建筑，东北角楼与护城河、城墙共同构成宫城防御景观。',
    hotspots: cornerTowerHotspots,
  },
};

const GUIDE_BUILDINGS = Object.values(BUILDINGS_BY_ID);

function getBuildingCapability(building: BuildingData) {
  if (building.detailType === '3d') {
    return {
      label: '3D 深度探索',
      support: '支持：三维模型 / 构件热点 / 线稿实景对照 / AI 讲解',
      badges: ['重点样本', '推荐体验'],
    };
  }

  if (building.detailType === 'image') {
    return {
      label: '图文导览',
      support: '支持：建筑图片 / 基础介绍 / 文化说明',
      badges: ['图片详情'],
    };
  }

  return {
    label: '资料建设中',
    support: '后续将补充图文导览内容',
    badges: ['待开放'],
  };
}

function AncientGuideDropdown({
  buildings,
  activeBuildingId,
  onSelectBuilding,
}: {
  buildings: BuildingData[];
  activeBuildingId?: string;
  onSelectBuilding: (building: BuildingData) => void;
}) {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;

    const handlePointerDown = (event: PointerEvent) => {
      if (!dropdownRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    window.addEventListener('pointerdown', handlePointerDown);
    return () => window.removeEventListener('pointerdown', handlePointerDown);
  }, [open]);

  return (
    <div ref={dropdownRef} className="ancient-guide">
      <button
        className="ancient-guide-trigger"
        type="button"
        aria-expanded={open}
        aria-haspopup="menu"
        onClick={() => setOpen((current) => !current)}
      >
        <span>古建导览</span>
        <ChevronRight size={16} className={cn('ancient-guide-chevron', open && 'open')} />
      </button>

      {open && (
        <div className="ancient-guide-menu" role="menu">
          {buildings.map((building) => {
            const capability = getBuildingCapability(building);
            return (
              <button
                key={building.id}
                className={cn('ancient-guide-item', activeBuildingId === building.id && 'active')}
                type="button"
                role="menuitem"
                onClick={() => {
                  onSelectBuilding(building);
                  setOpen(false);
                }}
              >
                <span className="ancient-guide-name">{building.name}</span>
                <span className="ancient-guide-desc">{building.subtitle}</span>
                <span className={`ancient-guide-type ancient-guide-type--${building.detailType}`}>{capability.label}</span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

function IntroPage({ onEnter }: { onEnter: () => void }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(bgRef.current, { filter: 'blur(20px)', scale: 1.1 }, { filter: 'blur(0px)', scale: 1, duration: 2, ease: 'power2.out' });
      gsap.fromTo(buttonRef.current, { y: 100, opacity: 0 }, { y: 0, opacity: 1, duration: 1.5, delay: 0.5, ease: 'power3.out' });
      gsap.to(buttonRef.current, { scale: 1.02, duration: 1.5, repeat: -1, yoyo: true, ease: 'power1.inOut' });
    }, containerRef);
    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef} className="intro-page">
      <div ref={bgRef} className="intro-background" />
      <div className="intro-overlay" />
      <div className="intro-content">
        <h1 className="intro-title">故宫建筑</h1>
        <p className="intro-subtitle">中国古代建筑成就 · 交互可视化</p>
        <p className="intro-positioning">从一座城，到一处构件：用交互可视化读懂紫禁城营造智慧。</p>
        <button ref={buttonRef} className="intro-button" onClick={onEnter}>
          <span>开启故宫建筑之旅</span>
          <ChevronRight className="button-icon" />
        </button>
        <div className="intro-highlights" aria-label="项目核心亮点">
          {['三维构件识读', '紫禁城空间导览', '古建筑数据可视化', 'AI 智能讲解'].map((item) => (
            <span key={item}>{item}</span>
          ))}
        </div>
      </div>
      <div className="intro-footer">
        <div className="footer-left">
          <span>数据来源：故宫博物院</span>
        </div>
        <div className="footer-right">
          <span>2026 中国大学生计算机设计大赛</span>
          <span>信息可视化设计 · 交互信息设计</span>
        </div>
      </div>
    </div>
  );
}

const CULTURE_TIDBITS = [
  {
    title: '角楼为什么这么复杂',
    tag: '九梁传说',
    body: '民间常用“九梁十八柱，七十二条脊”形容角楼，并不一定是精确构件计数，而是在说它的屋顶脊线繁复、转角精巧，远看像一座被展开的金色机关。',
  },
  {
    title: '门钉不只是装饰',
    tag: '宫门细节',
    body: '故宫大门上的门钉、铺首和门环会让人先感到“重”。这些细节既强化门扇结构，也把出入宫城这件事变成一种有仪式感的空间体验。',
  },
  {
    title: '红墙黄瓦的辨识度',
    tag: '色彩记忆',
    body: '红墙与黄琉璃瓦几乎成了故宫的视觉符号。它不只是“好看”，也让观众能迅速分辨宫城建筑的等级、边界和整体气质。',
  },
  {
    title: '瑞兽守在屋脊上',
    tag: '屋脊故事',
    body: '屋脊上的吻兽、走兽常被赋予镇火避灾、守护屋脊的寓意。它们一字排开，让屋顶既有防水收边的构造逻辑，也有神话般的想象力。',
  },
  {
    title: '一座城里的时间感',
    tag: '宫城日常',
    body: '故宫不是只在大典时存在。清晨开门、暮色落在红墙上、宫灯与门影交叠，这些日常时刻让宏大的宫城拥有更细腻的生活气息。',
  },
  {
    title: '故宫里的猫',
    tag: '今日故宫',
    body: '今天的故宫里常能看到“宫猫”的身影。它们让庄严的宫殿多了一点亲近感，也成为很多游客记住故宫的轻松入口。',
  },
] as const;

function CultureTidbitsSection() {
  return (
    <section className="w-full border-y border-[#CDBA96]/80 bg-[#f8f4e8] px-4 py-12 sm:px-6 lg:px-10" aria-labelledby="culture-tidbits-heading">
      <div className="mx-auto max-w-[1500px] rounded-lg border border-[#CDBA96]/70 bg-[#fffaf0]/70 p-5 shadow-sm sm:p-7">
        <div className="mb-9 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm font-semibold tracking-[0.28em] text-[#8B2323]">PALACE MEMORY</p>
            <h2 id="culture-tidbits-heading" className="mt-2 font-serif text-3xl font-semibold text-[#1A1A1A] md:text-4xl">
              文化拾遗
            </h2>
          </div>
          <p className="max-w-2xl text-sm leading-7 text-[#1A1A1A]/75">
            从角楼传说、屋脊瑞兽到门钉和宫猫，故宫的文化记忆不只存在于宏大的宫殿中，也藏在可被观看、触发和讲述的细节里。
          </p>
        </div>

        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {CULTURE_TIDBITS.map((item) => (
            <article key={item.title} className="flex min-h-56 flex-col rounded-lg border border-[#CDBA96] bg-white/75 p-5 shadow-sm">
              <span className="w-fit rounded-sm bg-[#8B2323] px-3 py-1 text-xs font-medium tracking-[0.16em] text-[#F4F1E1]">{item.tag}</span>
              <h3 className="mt-5 text-xl font-semibold text-[#8B2323]">{item.title}</h3>
              <p className="mt-3 flex-1 text-sm leading-7 text-[#1A1A1A]/78">{item.body}</p>
            </article>
          ))}
        </div>

        <div className="mt-8 rounded-lg border border-[#CDBA96] bg-[#faf6ec] p-5 shadow-inner">
          <div className="grid gap-4 text-sm leading-7 text-[#1A1A1A]/78 md:grid-cols-3">
            <p>
              <strong className="text-[#8B2323]">1420：</strong>
              紫禁城建成，宫城格局、中轴秩序和城防体系共同奠定故宫空间骨架。
            </p>
            <p>
              <strong className="text-[#8B2323]">明清：</strong>
              宫殿修缮、彩画更新和木构维护不断延续，使建筑在使用中保留礼制记忆。
            </p>
            <p>
              <strong className="text-[#8B2323]">今天：</strong>
              故宫从皇家宫城转化为博物院，建筑、文物和城市记忆成为公众共享的文化现场。
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

function MapPage({
  onSelectBuilding,
  onBack,
  onOpenPainting,
}: {
  onSelectBuilding: (building: BuildingData) => void;
  onBack: () => void;
  onOpenPainting: () => void;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [hoveredBuilding, setHoveredBuilding] = useState<string | null>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo('.building-marker', { scale: 0, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.5, stagger: 0.06, delay: 0.35, ease: 'back.out(1.7)' });
    }, containerRef);
    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef} className="map-page min-h-screen">
      <nav className="map-nav">
        <div className="nav-brand">
          <button className="back-btn" onClick={onBack}>
            <ArrowLeft size={20} />
          </button>
          <span className="brand-text">故宫建筑导览</span>
        </div>
        <div className="nav-actions">
          <AncientGuideDropdown buildings={GUIDE_BUILDINGS} onSelectBuilding={onSelectBuilding} />
          <button className="nav-btn" title="重置视图"><RotateCcw size={18} /></button>
          <button className="nav-btn" title="帮助"><HelpCircle size={18} /></button>
        </div>
      </nav>

      <div className="map-container">
        <div className="map-wrapper">
          <div className="map-frame" style={{ backgroundImage: `url('${CUSTOM_FORBIDDEN_CITY_MAP}')` }} role="img" aria-label="故宫平面导览图">
            <div className="map-markers-layer">
              {FORBIDDEN_CITY_MAP_MARKERS.map((pin) => {
                const building = BUILDINGS_BY_ID[pin.id];
                const capability = getBuildingCapability(building);
                return (
                  <div
                    key={pin.id}
                    className={`building-marker building-marker--${building.detailType} ${hoveredBuilding === pin.id ? 'hovered' : ''}`}
                    style={{
                      left: `${(pin.x / CUSTOM_MAP_SIZE.width) * 100}%`,
                      top: `${(pin.y / CUSTOM_MAP_SIZE.height) * 100}%`,
                    }}
                    onMouseEnter={() => setHoveredBuilding(pin.id)}
                    onMouseLeave={() => setHoveredBuilding(null)}
                    onClick={() => onSelectBuilding(building)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        onSelectBuilding(building);
                      }
                    }}
                  >
                    <div className="marker-dot" aria-hidden="true">
                      <span className="marker-ping" />
                      <span className="marker-core" />
                    </div>
                    <div className="marker-label">
                      <span className="marker-name">{pin.name}</span>
                      <span className="marker-card">
                        <strong>{building.name}</strong>
                        <em>{capability.label}</em>
                        <small>{capability.support}</small>
                        <span className="marker-badges">
                          {capability.badges.map((badge) => (
                            <b key={badge}>{badge}</b>
                          ))}
                        </span>
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      <section className="source-note" aria-label="资料来源与说明">
        <span className="source-note-title">资料来源</span>
        <p className="source-note-text">
          故宫博物院官网公开资料、《故宫建筑图典》、梁思成《中国建筑史》、于倬云《紫禁城宫殿》等资料整理。
        </p>
      </section>

      <section className="demo-route" aria-label="国赛演示推荐路线">
        <div>
          <span className="demo-route-kicker">推荐演示路线</span>
          <p>首页 → 地图导览 → 东北角楼 3D 深度探索 → 点击屋顶 / 斗栱等构件热点 → 查看线稿与实景对照 → 进入彩画专题 → 使用 AI 讲解</p>
        </div>
        <strong>东北角楼是当前三维构件识读样本，其他建筑主要提供图文导览，用于扩展紫禁城整体空间认知。</strong>
      </section>

      <PalaceDataChartsSection onOpenPainting={onOpenPainting} />

      <CultureTidbitsSection />

      <div className="map-footer">
        <span>© 紫禁营造志 | 内容仅供课程学习、交互展示与研究交流使用</span>
      </div>
    </div>
  );
}

const HOTSPOT_PRESENTATION_BY_BUILDING: Record<
  string,
  {
    title: string;
    lead: string;
    route: string;
    detailLabel: string;
    detailHint: string;
  }
> = {
  wumen: {
    title: '门阙通行线',
    lead: '先看中轴门洞，再读两翼展开；午门的热点像一条从广场进入皇城的路线。',
    route: '由下而上读入口',
    detailLabel: '门阙节点',
    detailHint: '观察它在“进入、分流、拱卫、发布”中的作用，而不只是看一个构件。',
  },
  taihe_dian: {
    title: '礼制等级梯',
    lead: '太和殿的热点按台基、殿身、屋顶、陈设层层抬升，适合像读一座大典舞台那样观看。',
    route: '由基座升至屋顶',
    detailLabel: '礼制层级',
    detailHint: '把当前热点放回国家大典现场，判断它如何强化“最高等级”。',
  },
  wenhua_dian: {
    title: '文治线索簿',
    lead: '文华殿不追求压迫性的宏大，热点更像几条文脉线索：形制、方位、讲学与展陈。',
    route: '由建筑进入文脉',
    detailLabel: '文治线索',
    detailHint: '关注空间如何服务经筵讲学、典籍保存和文臣进讲，而不是只比较屋顶等级。',
  },
  wuying_dian: {
    title: '武政工艺档案',
    lead: '武英殿的热点从殿宇形制转入军政议事、书局和雕版印刷，更像一组宫廷生产档案。',
    route: '由政务转向书局',
    detailLabel: '档案条目',
    detailHint: '把它看成“功能转译”：从武政议事到修书刻印，空间如何改变用途。',
  },
  qianqing_gong: {
    title: '内廷制度暗线',
    lead: '乾清宫热点不重复屋顶和彩画，而是围绕寝政合一、正大光明匾、密匣与原状陈列展开。',
    route: '由日常进入制度',
    detailLabel: '内廷暗线',
    detailHint: '注意它和太和殿不同：这里讲的是日常权力、寝宫理政和皇位传承。',
  },
  corner_tower: {
    title: '角楼构造拆解',
    lead: '角楼热点服务三维观察，重点阅读台基、墙体、屋顶、斗拱和木构之间的结构关系。',
    route: '围绕模型旋转观察',
    detailLabel: '构造节点',
    detailHint: '对照右侧 3D 模型，观察当前构件如何参与承托、防御或装饰。',
  },
};

type HotspotReadingMode = 'route' | 'structure' | 'skyline' | 'ritual' | 'craft' | 'scene' | 'archive' | 'symbol' | 'display' | 'axis';

type HotspotReading = {
  mode: HotspotReadingMode;
  title: string;
  question: string;
  entry: string;
  keyword: string;
};

const HOTSPOT_READING_BY_ID: Record<string, HotspotReading> = {
  'wumen-duntai-mendong': { mode: 'route', title: '从门洞读秩序', question: '谁能从哪一道门进入？这个问题比门洞数量本身更重要。', entry: '看正中门洞与两侧门洞的差别', keyword: '明三暗五' },
  'wumen-zhulou': { mode: 'skyline', title: '从天际线读皇权', question: '主楼为什么必须压住整座门阙的视觉中心？', entry: '看中央重檐屋顶和楼体高度', keyword: '五凤楼核心' },
  'wumen-yanchilou': { mode: 'axis', title: '从两翼读围合', question: '雁翅楼不是陪衬，它决定了午门“凹”字形的进入感。', entry: '看东西两侧向前展开的楼体', keyword: '环抱式入口' },
  'wumen-queting': { mode: 'skyline', title: '从阙亭读拱卫', question: '小亭如何让门阙从城门变成宫阙？', entry: '看主楼两侧的竖向节点', keyword: '四隅拱卫' },
  'wumen-zhongmen-yudao': { mode: 'ritual', title: '从脚下读等级', question: '御道是一条路，也是一条把身份分开的制度线。', entry: '看中轴线与中门的连续关系', keyword: '皇帝专属' },
  'taihedian-san-ceng-hanbaiyu-taiji': { mode: 'structure', title: '从抬升读最高等级', question: '三层台基把太和殿从地面“举”成大典舞台。', entry: '看台基层级、栏杆和御路石', keyword: '三台承托' },
  'taihedian-dianshen-shiyi-kaijian': { mode: 'structure', title: '从开间读尺度', question: '十一开间让太和殿的正立面成为权力尺度。', entry: '看柱网节奏和横向展开', keyword: '十一开间' },
  'taihedian-zhongyan-wudian-ding': { mode: 'skyline', title: '从屋顶读至尊', question: '为什么最高礼制一定要被放到屋顶轮廓上？', entry: '看重檐、正脊和黄琉璃瓦', keyword: '重檐庑殿' },
  'taihedian-dougong-tixi': { mode: 'craft', title: '从檐下读结构', question: '斗拱既传力，也把结构变成可见的等级装饰。', entry: '看檐下层叠构件和梁枋交接', keyword: '承托出檐' },
  'taihedian-yizhang-chenshe': { mode: 'ritual', title: '从陈设读典礼', question: '殿前陈设让广场变成国家礼仪现场。', entry: '看月台前的铜器与仪仗布置', keyword: '大典现场' },
  'taihedian-hexicaihua': { mode: 'craft', title: '从彩画读等级', question: '彩画不是装饰余项，而是木构表面的礼制语言。', entry: '看梁枋上的龙凤纹与金线', keyword: '和玺彩画' },
  'wenhuadian-zhudian-xingzhi': { mode: 'structure', title: '从克制读文雅', question: '文华殿的价值不在巨大，而在文治空间的尺度控制。', entry: '看主殿体量与院落关系', keyword: '典雅主殿' },
  'wenhuadian-danyan-wudian-ding': { mode: 'skyline', title: '从单檐读分寸', question: '同是高等级屋顶，文华殿为什么不能像太和殿那样张扬？', entry: '看单檐屋顶的平稳轮廓', keyword: '克制礼制' },
  'wenhuadian-zuowen-youwu-geju': { mode: 'axis', title: '从方位读治理', question: '左文右武不是口号，而是被写进宫城平面的秩序。', entry: '看文华殿与武英殿的东西对应', keyword: '左文右武' },
  'wenhuadian-jingyan-jiangxue': { mode: 'scene', title: '从讲学读政治', question: '经筵讲学把皇帝、文臣和经典放进同一个空间。', entry: '想象殿内讲官进讲的场景', keyword: '经筵制度' },
  'wenhuadian-dianji-shuhua-zhancheng': { mode: 'display', title: '从展陈读延续', question: '博物馆展陈让文华殿的文脉从帝王教育转向公众阅读。', entry: '看展厅如何承接典籍书画主题', keyword: '文脉开放' },
  'wuyingdian-zhudian-xingzhi': { mode: 'structure', title: '从稳重读西路', question: '武英殿的主殿形制把“武”安放进礼制院落。', entry: '看主殿与院落的对称秩序', keyword: '西路主殿' },
  'wuyingdian-danyan-wudian-ding': { mode: 'skyline', title: '从屋顶读从属', question: '它有等级，但不能越过中轴核心殿宇。', entry: '看单檐庑殿顶的克制轮廓', keyword: '高而不越' },
  'wuyingdian-dougong-liangfang': { mode: 'craft', title: '从梁枋读工艺', question: '这里的精彩在檐下，而不是只在屋顶。', entry: '看斗拱、梁枋和彩画的连续关系', keyword: '檐下工艺' },
  'wuyingdian-junzheng-yishi': { mode: 'scene', title: '从议事读武政', question: '“武”在这里指治理中的军政判断，而不只是战场。', entry: '想象臣工入殿议事的动线', keyword: '军政空间' },
  'wuyingdian-shuju': { mode: 'archive', title: '从书局读生产', question: '一座殿宇如何变成宫廷知识生产机器？', entry: '看书局、典籍和刊刻之间的关系', keyword: '武英殿书局' },
  'wuyingdian-diaoban-yinshua-gongyi': { mode: 'craft', title: '从雕版读技术', question: '刻版、刷印、装帧让宫廷文化变成可复制的书。', entry: '看印刷流程中的手工痕迹', keyword: '雕版印刷' },
  'qianqinggong-neiting-zhonglu': { mode: 'axis', title: '从中路读内廷', question: '乾清宫的位置决定了它是外朝进入内廷后的权力转折点。', entry: '看前接外朝、后连后三宫的关系', keyword: '内廷中路' },
  'qianqinggong-yuetai-yuanluo': { mode: 'route', title: '从院落读日常', question: '这里的月台不是最高典礼台，而是召见、通行和内廷秩序的界面。', entry: '看殿前空间与配殿廊庑', keyword: '寝政界面' },
  'qianqinggong-jiujian-dianshen': { mode: 'structure', title: '从九间读正寝', question: '九间殿身说明它规格很高，但高在内廷正寝。', entry: '看正立面开间和殿身体量', keyword: '九五之尊' },
  'qianqinggong-qiju-lizheng': { mode: 'scene', title: '从起居读权力', question: '皇帝生活和处理政务并不总是分开的。', entry: '想象寝居、批阅和召见叠合的空间', keyword: '寝政合一' },
  'qianqinggong-zhengda-guangming': { mode: 'symbol', title: '从匾额读正统', question: '四个字为什么能成为乾清宫最强的政治符号？', entry: '看匾额所在的核心视线位置', keyword: '正大光明' },
  'qianqinggong-jianchu-mixia': { mode: 'symbol', title: '从密匣读传承', question: '继承人的名字被藏在匾后，空间因此参与制度运行。', entry: '看匾额背后与密旨的关系', keyword: '秘密立储' },
  'qianqinggong-yuanzhuang-chenlie': { mode: 'display', title: '从陈列读现场', question: '原状陈列展示的不是单件文物，而是权力生活的空间关系。', entry: '看宝座、屏风、匾额和陈设整体', keyword: '原状陈列' },
};

function getHotspotReading(hotspot: HotspotData): HotspotReading {
  if (HOTSPOT_READING_BY_ID[hotspot.id]) {
    return HOTSPOT_READING_BY_ID[hotspot.id];
  }

  if (hotspot.type?.includes('工艺')) {
    return { mode: 'craft', title: '从工艺读细节', question: '这个节点把材料、技法和审美连在一起。', entry: hotspot.name, keyword: hotspot.type };
  }
  if (hotspot.type?.includes('礼制') || hotspot.type?.includes('制度')) {
    return { mode: 'ritual', title: '从制度读空间', question: '这个节点的重点是它如何把身份和秩序可视化。', entry: hotspot.name, keyword: hotspot.type };
  }
  return { mode: 'structure', title: '从构造读建筑', question: '先看它在整体形制中的位置，再看它承担的功能。', entry: hotspot.name, keyword: hotspot.type ?? hotspot.shortDesc };
}

function DetailPage({
  building,
  onBack,
  onSelectBuilding,
}: {
  building: BuildingData;
  onBack: () => void;
  onSelectBuilding: (building: BuildingData) => void;
}) {
  const [selectedHotspot, setSelectedHotspot] = useState<HotspotData | null>(null);
  const [viewMode, setViewMode] = useState<'overview' | 'detail'>('overview');
  const [deepZoneVisible, setDeepZoneVisible] = useState(false);
  const [exploredHotspotIds, setExploredHotspotIds] = useState<Set<string>>(() => new Set());
  const containerRef = useRef<HTMLDivElement>(null);
  const isDetailExpanded = viewMode === 'detail';
  const hasModel = building.detailType === '3d';
  const isImageDetail = building.detailType === 'image';
  const isPlaceholder = building.detailType === 'placeholder';
  const hotspotPresentation = HOTSPOT_PRESENTATION_BY_BUILDING[building.id] ?? HOTSPOT_PRESENTATION_BY_BUILDING.corner_tower;
  const selectedHotspotIndex = selectedHotspot ? building.hotspots.findIndex((hotspot) => hotspot.id === selectedHotspot.id) : -1;
  const selectedHotspotReading = selectedHotspot ? getHotspotReading(selectedHotspot) : null;
  const overviewAiContext = [
    building.subtitle,
    building.overview,
    building.technical?.join('；'),
    building.cultural,
    building.aiContext,
  ]
    .filter(Boolean)
    .join('\n');
  const hotspotAiContext = selectedHotspot
    ? [
        selectedHotspot.content.description,
        selectedHotspot.content.details.join('；'),
        selectedHotspot.content.cultural,
      ]
        .filter(Boolean)
        .join('\n')
    : overviewAiContext;
  const guideSteps = hasModel
    ? {
        title: '如何读懂角楼？',
        steps: ['① 旋转模型，观察整体屋顶层次', '② 点击热点，识别关键构件', '③ 对照线稿与实景，理解构造与礼制含义'],
      }
    : {
        title: '如何浏览该建筑？',
        steps: ['① 查看建筑主图，建立整体印象', '② 阅读基础介绍，理解空间功能', '③ 结合文化说明，认识其礼制含义'],
      };

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo('.detail-left-panel', { x: -50, opacity: 0 }, { x: 0, opacity: 1, duration: 0.8, ease: 'power3.out' });
      gsap.fromTo('.detail-right-panel', { x: 50, opacity: 0 }, { x: 0, opacity: 1, duration: 0.8, ease: 'power3.out' });
    }, containerRef);
    return () => ctx.revert();
  }, []);

  useEffect(() => {
    if (!isDetailExpanded) {
      const id = requestAnimationFrame(() => setDeepZoneVisible(false));
      return () => cancelAnimationFrame(id);
    }
    const id = requestAnimationFrame(() => setDeepZoneVisible(true));
    return () => cancelAnimationFrame(id);
  }, [isDetailExpanded, selectedHotspot?.id]);

  useEffect(() => {
    const id = requestAnimationFrame(() => {
      setSelectedHotspot(building.hotspots[0] ?? null);
      setViewMode('overview');
      setDeepZoneVisible(false);
      setExploredHotspotIds(new Set());
    });
    return () => cancelAnimationFrame(id);
  }, [building.id, building.hotspots]);

  const handleHotspotClick = (hotspot: BuildingHotspotPick | ImageHotspotPick) => {
    const full = building.hotspots.find((h) => h.id === hotspot.id);
    if (!full) return;
    setSelectedHotspot(full);
    setViewMode('detail');
    if (hasModel) {
      setExploredHotspotIds((current) => new Set(current).add(full.id));
    }
  };

  const handleBackToOverview = () => {
    setViewMode('overview');
    setDeepZoneVisible(false);
    setTimeout(() => setSelectedHotspot(building.hotspots[0] ?? null), 300);
  };

  if (isPlaceholder) {
    return (
      <div ref={containerRef} className="detail-page">
        <nav className="detail-nav">
          <div className="nav-brand">
            <button className="back-btn" onClick={onBack}>
              <ArrowLeft size={20} />
              <span>返回地图</span>
            </button>
            <span className="building-name">{building.name}</span>
          </div>
          <div className="nav-actions">
            <AncientGuideDropdown buildings={GUIDE_BUILDINGS} activeBuildingId={building.id} onSelectBuilding={onSelectBuilding} />
          </div>
        </nav>
        <main className="placeholder-detail">
          <div className="placeholder-detail-copy">
            <span>资料建设中</span>
            <h1>{building.name}</h1>
            <p>该建筑详情正在建设中。你可以先体验东北角楼的 3D 深度识读，或返回地图查看其他建筑。</p>
            <div className="placeholder-actions">
              <button type="button" className="secondary-action" onClick={onBack}>返回地图</button>
              <button type="button" className="primary-action" onClick={() => onSelectBuilding(BUILDINGS_BY_ID.corner_tower)}>
                前往东北角楼 3D 探索
              </button>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div ref={containerRef} className="detail-page">
      <nav className="detail-nav">
        <div className="nav-brand">
          <button className="back-btn" onClick={onBack}>
            <ArrowLeft size={20} />
            <span>返回地图</span>
          </button>
          <span className="building-name">{building.name}</span>
        </div>
        <div className="nav-actions">
          <AncientGuideDropdown
            buildings={GUIDE_BUILDINGS}
            activeBuildingId={building.id}
            onSelectBuilding={onSelectBuilding}
          />
          <button className="nav-btn"><RotateCcw size={18} /></button>
          <button className="nav-btn"><HelpCircle size={18} /></button>
        </div>
      </nav>

      <div className="detail-content">
        <div
          className={cn(
            'detail-left-panel flex h-full min-h-0 shrink-0 flex-col overflow-y-auto transition-all duration-700 ease-in-out',
            'w-full md:w-[35%]',
            isDetailExpanded && 'md:w-[60%]'
          )}
        >
          {viewMode === 'overview' ? (
            <div className="panel-overview">
              <div className="panel-header-section">
                <h1 className="panel-title">{building.name}</h1>
                <p className="panel-subtitle">{building.subtitle}</p>
                <span className={`detail-type-badge detail-type-badge--${building.detailType}`}>
                  {getBuildingCapability(building).label}
                </span>
                <div className="divider" />
              </div>
              <div className={`reading-guide reading-guide--${building.detailType}`}>
                <h3>{guideSteps.title}</h3>
                <div>
                  {guideSteps.steps.map((step) => (
                    <span key={step}>{step}</span>
                  ))}
                </div>
              </div>
              <div className="panel-section">
                <h3 className="section-title">建筑概述</h3>
                <p className="section-content">{building.overview}</p>
              </div>
              <div className={`panel-section hotspot-section hotspot-section--${building.id}`}>
                <div className="hotspot-section-head">
                  <div>
                    <span className="hotspot-section-route">{hotspotPresentation.route}</span>
                    <h3 className="section-title">{hotspotPresentation.title}</h3>
                  </div>
                  <span className="hotspot-section-count">{building.hotspots.length} 个节点</span>
                </div>
                <p className="hotspot-section-lead">{hotspotPresentation.lead}</p>
                <div className="hotspot-list">
                  {building.hotspots.map((hotspot, index) => {
                    const reading = getHotspotReading(hotspot);
                    return (
                      <div
                        key={hotspot.id}
                        className={cn('hotspot-card', `hotspot-card--${reading.mode}`, index === 0 && 'hotspot-card--featured')}
                        onClick={() => handleHotspotClick(hotspot)}
                      >
                        <span className="hotspot-card-index">{String(index + 1).padStart(2, '0')}</span>
                        <div className="hotspot-card-content">
                          <div className="hotspot-card-name-row">
                            <span className="hotspot-card-name">{hotspot.name}</span>
                            <span className="hotspot-card-type">{reading.keyword}</span>
                          </div>
                          <span className="hotspot-card-reading">{reading.title}</span>
                          <span className="hotspot-card-desc">{reading.question}</span>
                        </div>
                        <ChevronRight size={20} className="hotspot-card-arrow" />
                      </div>
                    );
                  })}
                </div>
              </div>
              <AiGuidePanel building={building.name} context={overviewAiContext} />
            </div>
          ) : (
            selectedHotspot && (
              <div className="panel-detail flex min-h-0 flex-1 flex-col p-0">
                <div className="flex min-h-0 flex-1 flex-col items-stretch gap-0 lg:flex-row">
                  <div className="flex h-full min-h-0 min-w-0 flex-1 flex-col gap-6 overflow-y-auto p-8">
                    <div className="panel-header-section">
                      <button className="detail-back-btn" onClick={handleBackToOverview}>
                        <ChevronLeft size={20} />
                        <span>返回</span>
                      </button>
                      <div className="hotspot-detail-meta">
                        <span>{hotspotPresentation.detailLabel}</span>
                        <strong>
                          {selectedHotspotIndex >= 0 ? `${String(selectedHotspotIndex + 1).padStart(2, '0')} / ${String(building.hotspots.length).padStart(2, '0')}` : '热点'}
                        </strong>
                        <em>{selectedHotspot.type ?? selectedHotspot.shortDesc}</em>
                      </div>
                      <h1 className="panel-title">{selectedHotspot.content.title}</h1>
                      <div className="divider" />
                    </div>

                    {hasModel && selectedHotspotReading && (
                      <div className={`hotspot-reading-panel hotspot-reading-panel--${selectedHotspotReading.mode}`}>
                        <div className="hotspot-reading-mark">
                          <span>{String(Math.max(selectedHotspotIndex + 1, 1)).padStart(2, '0')}</span>
                          <strong>{selectedHotspotReading.mode.toUpperCase()}</strong>
                        </div>
                        <div className="hotspot-reading-main">
                          <span className="hotspot-reading-kicker">本热点的读法</span>
                          <h2>{selectedHotspotReading.title}</h2>
                          <p>{selectedHotspotReading.question}</p>
                          <div className="hotspot-reading-chips">
                            <span>视线入口：{selectedHotspotReading.entry}</span>
                            <span>讲解关键词：{selectedHotspotReading.keyword}</span>
                            <span>{hotspotPresentation.detailHint}</span>
                          </div>
                        </div>
                      </div>
                    )}

                    {hasModel && selectedHotspot && (
                      <div className="hotspot-progress-panel">
                        <div>
                          <span>当前识读对象</span>
                          <strong>{selectedHotspot.name}</strong>
                        </div>
                        <div>
                          <span>所在位置</span>
                          <strong>{selectedHotspot.positionLabel ?? '三维模型构件'}</strong>
                        </div>
                        <div>
                          <span>功能作用</span>
                          <strong>{selectedHotspot.functionSummary ?? selectedHotspot.shortDesc}</strong>
                        </div>
                        <div>
                          <span>观察提示</span>
                          <strong>{selectedHotspot.observeTip ?? '请旋转模型，从整体层次中定位该构件'}</strong>
                        </div>
                        <p>已探索 {exploredHotspotIds.size} / {building.hotspots.length} 个构件</p>
                      </div>
                    )}

                    <div className="panel-section">
                      <h3 className="section-title">简介</h3>
                      <p className="section-content">{selectedHotspot.content.description}</p>
                    </div>

                    {selectedHotspot.content.deepVisuals?.exterior && (
                      <div className="panel-section flex flex-col">
                        <h3 className="section-title">实景照片</h3>
                        <figure className="flex flex-col overflow-hidden rounded-xl border border-[var(--color-border)] bg-white shadow-sm">
                          <img
                            src={selectedHotspot.content.deepVisuals.exterior.src}
                            alt={selectedHotspot.content.deepVisuals.exterior.alt}
                            className="max-h-[min(480px,60vh)] w-full object-contain object-center bg-[#f5f5f5]"
                            loading="lazy"
                          />
                          <figcaption className="border-t border-[var(--color-border)] bg-[var(--color-paper)] px-3 py-2 text-center text-xs leading-relaxed text-[var(--color-gray)]">
                            {selectedHotspot.content.deepVisuals.exterior.caption}
                          </figcaption>
                        </figure>
                      </div>
                    )}

                    <HotspotDetailCards
                      key={selectedHotspot.id}
                      details={selectedHotspot.content.details}
                      specs={selectedHotspot.content.specs}
                      cultural={selectedHotspot.content.cultural}
                    />

                    <AiGuidePanel
                      building={building.name}
                      hotspot={selectedHotspot.content.title}
                      context={hotspotAiContext}
                      compact
                    />
                  </div>

                  {selectedHotspot.content.deepVisuals?.lineArt && (
                    <aside
                      className={cn(
                        'flex h-full w-full shrink-0 flex-col gap-4 overflow-y-auto border-t border-[var(--color-border)] bg-white/50 p-6 transition-opacity duration-700 ease-out lg:w-[38%] lg:border-l lg:border-t-0',
                        deepZoneVisible ? 'opacity-100' : 'pointer-events-none opacity-0'
                      )}
                      aria-hidden={!deepZoneVisible}
                    >
                      <h3 className="section-title border-0 pb-0">结构线稿图</h3>
                      <div className="flex flex-col gap-3">
                        <figure className="flex flex-col overflow-hidden rounded-lg border border-[var(--color-border)] bg-white">
                          <img
                            src={selectedHotspot.content.deepVisuals.lineArt.src}
                            alt={selectedHotspot.content.deepVisuals.lineArt.alt}
                            className="max-h-48 w-full object-contain object-left bg-[#fafafa]"
                            loading="lazy"
                          />
                          <figcaption className="px-2 py-1.5 text-[10px] leading-snug text-[var(--color-gray)]">
                            {selectedHotspot.content.deepVisuals.lineArt.caption}
                          </figcaption>
                        </figure>
                      </div>
                      <h3 className="section-title border-0 pb-0">史料文献摘录</h3>
                      <div className="flex-1 rounded-lg border border-[var(--color-border)] bg-white/80 p-4 text-sm leading-relaxed text-[var(--color-ink)]">
                        <p>
                          《工程做法》与清宫档案中多有与此类构造相应的记载，可与右侧三维示意对照研读。当前条目：
                          <strong className="text-[var(--color-primary-dark)]"> {selectedHotspot.content.title}</strong>。
                        </p>
                        <p className="mt-3 text-[var(--color-gray)]">
                          营建需合于形制，材分模数与榫卯搭接须与台基、屋架相匹配，修缮记录则散见于内务府造办处档案。
                        </p>
                      </div>
                    </aside>
                  )}
                </div>
              </div>
            )
          )}
        </div>

        <div
          className={cn(
            'detail-right-panel relative min-h-0 flex-1 transition-all duration-700 ease-in-out max-md:min-h-[42vh] md:flex-none',
            'w-full md:w-[65%]',
            isDetailExpanded && 'md:w-[40%]'
          )}
        >
          <div className="absolute inset-0 h-full w-full min-h-0">
            {hasModel ? (
              <Building3DCanvas hotspots={building.hotspots} onHotspotClick={handleHotspotClick} selectedHotspotId={selectedHotspot?.id ?? null} />
            ) : isImageDetail ? (
              <BuildingImageHotspot
                buildingId={building.id}
                buildingName={building.name}
                mainImage={building.mainImage ?? building.image ?? ''}
                hotspots={building.hotspots}
                selectedHotspotId={selectedHotspot?.id ?? null}
                onSelectHotspot={handleHotspotClick}
              />
            ) : (
              <div className="image-detail-empty">该建筑详情正在建设中。</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function App() {
  const [currentPage, setCurrentPage] = useState<PageType>('intro');
  const [selectedBuilding, setSelectedBuilding] = useState<BuildingData | null>(null);

  const handleEnter = () => {
    gsap.to('.intro-page', {
      opacity: 0,
      scale: 1.1,
      duration: 0.8,
      ease: 'power2.inOut',
      onComplete: () => setCurrentPage('map'),
    });
  };

  const handleSelectBuilding = (building: BuildingData) => {
    setSelectedBuilding(building);
    setCurrentPage('detail');
  };

  const handleBackToMap = () => {
    setCurrentPage('map');
    setSelectedBuilding(null);
  };

  const handleBackToIntro = () => {
    setCurrentPage('intro');
  };

  const handleOpenPainting = () => {
    setCurrentPage('painting');
  };

  return (
    <div className="app">
      <ErrorBoundary resetKey={`${currentPage}-${selectedBuilding?.id ?? 'none'}`}>
        {currentPage === 'intro' && <IntroPage onEnter={handleEnter} />}
        {currentPage === 'map' && (
          <MapPage
            onSelectBuilding={handleSelectBuilding}
            onBack={handleBackToIntro}
            onOpenPainting={handleOpenPainting}
          />
        )}
        {currentPage === 'detail' && selectedBuilding && (
          <DetailPage building={selectedBuilding} onBack={handleBackToMap} onSelectBuilding={handleSelectBuilding} />
        )}
        {currentPage === 'painting' && <PalacePaintingChartsPage onBack={handleBackToMap} />}
      </ErrorBoundary>
    </div>
  );
}

export default App;
