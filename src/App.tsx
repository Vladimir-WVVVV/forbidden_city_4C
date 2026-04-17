import { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ChevronRight, ArrowLeft, RotateCcw, HelpCircle, ChevronLeft } from 'lucide-react';
import { PalaceDataChartsSection, PalacePaintingChartsPage } from './components/PalaceDataCharts';
import { Building3DCanvas, type BuildingHotspotPick } from './components/Building3DCanvas';
import { AiGuidePanel } from './components/AiGuidePanel';
import { HotspotDetailCards } from './components/HotspotDetailCards';
import { cn } from './lib/utils';
import './App.css';

type PageType = 'intro' | 'map' | 'detail' | 'painting';

interface HotspotData {
  id: string;
  name: string;
  shortDesc: string;
  position: { x: number; y: number; z: number };
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
  image: string;
  hotspots: HotspotData[];
  overview: string;
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

const BUILDINGS_BY_ID: Record<string, BuildingData> = {
  wumen: {
    id: 'wumen',
    name: '午门',
    subtitle: '紫禁城正门',
    description: '皇宫正门',
    image: '/images/wumen-gate.jpg',
    overview: '午门为紫禁城正门，平面呈“凹”形，城台与城楼相结合，是明清举行大典、颁诏与献俘等重要仪礼之处。',
    hotspots: [],
  },
  taihe_dian: {
    id: 'taihe_dian',
    name: '太和殿',
    subtitle: '紫禁城规制最高殿宇',
    description: '明清举行大典的场所',
    image: '/images/taihe-dian.jpg',
    overview: '太和殿俗称“金銮殿”，为紫禁城内体量与等级最高的殿宇，明清两代国家大典多在此举行。',
    hotspots: [],
  },
  qianqing_gong: {
    id: 'qianqing_gong',
    name: '乾清宫',
    subtitle: '内廷正殿',
    description: '皇帝寝宫与理政空间',
    image: '/images/qianqing-gong.jpg',
    overview: '乾清宫为内廷正殿，明代至清初为皇帝寝宫与日常理政空间，清代雍正后典仪功能仍十分重要。',
    hotspots: [],
  },
  wuying_dian: {
    id: 'wuying_dian',
    name: '武英殿',
    subtitle: '外朝西路殿宇',
    description: '西路文献与典籍空间',
    image: '/images/wumen-gate.jpg',
    overview: '武英殿位于紫禁城外朝西路，明清时期曾承担修书、刻书、绘画和典籍整理等功能，是宫廷文化生产的重要空间。',
    hotspots: [],
  },
  wenhua_dian: {
    id: 'wenhua_dian',
    name: '文华殿',
    subtitle: '外朝东路殿宇',
    description: '东路典学空间',
    image: '/images/taihe-dian.jpg',
    overview: '文华殿位于紫禁城外朝东路，历史上与经筵讲学、皇子教育和典籍收藏等活动相关，和西侧武英殿共同构成外朝两翼的重要节点。',
    hotspots: [],
  },
  corner_tower: {
    id: 'corner_tower',
    name: '东北角楼',
    subtitle: '九梁十八柱七十二条脊',
    description: '紫禁城城池防卫设施',
    image: '/images/corner-tower.jpg',
    overview: '紫禁城垣四隅角楼为城池防卫与礼制象征并重的木构高层建筑，东北角楼与护城河、城墙共同构成宫城防御景观。',
    hotspots: cornerTowerHotspots,
  },
};

const GUIDE_BUILDINGS = Object.values(BUILDINGS_BY_ID);

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
          {buildings.map((building) => (
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
            </button>
          ))}
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
        <button ref={buttonRef} className="intro-button" onClick={onEnter}>
          <span>开启故宫建筑之旅</span>
          <ChevronRight className="button-icon" />
        </button>
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
                return (
                  <div
                    key={pin.id}
                    className={`building-marker ${hoveredBuilding === pin.id ? 'hovered' : ''}`}
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
                      <span className="marker-desc">➔ 点击开启 3D 拆解</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      <PalaceDataChartsSection onOpenPainting={onOpenPainting} />

      <CultureTidbitsSection />

      <div className="map-footer">
        <span>© 故宫博物院 | 数据仅供学习研究使用</span>
      </div>
    </div>
  );
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
  const containerRef = useRef<HTMLDivElement>(null);
  const isDetailExpanded = viewMode === 'detail';
  const overviewAiContext = `${building.subtitle}。${building.overview}`;
  const hotspotAiContext = selectedHotspot
    ? [
        selectedHotspot.content.description,
        selectedHotspot.content.details.join('；'),
        selectedHotspot.content.cultural,
      ]
        .filter(Boolean)
        .join('\n')
    : overviewAiContext;

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
      setSelectedHotspot(null);
      setViewMode('overview');
      setDeepZoneVisible(false);
    });
    return () => cancelAnimationFrame(id);
  }, [building.id]);

  const handleHotspotClick = (hotspot: BuildingHotspotPick) => {
    const full = building.hotspots.find((h) => h.id === hotspot.id);
    if (!full) return;
    setSelectedHotspot(full);
    setViewMode('detail');
  };

  const handleBackToOverview = () => {
    setViewMode('overview');
    setDeepZoneVisible(false);
    setTimeout(() => setSelectedHotspot(null), 300);
  };

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
                <div className="divider" />
              </div>
              <div className="panel-section">
                <h3 className="section-title">建筑概述</h3>
                <p className="section-content">{building.overview}</p>
              </div>
              <div className="panel-section">
                <h3 className="section-title">建筑热点</h3>
                <div className="hotspot-list">
                  {building.hotspots.map((hotspot) => (
                    <div key={hotspot.id} className="hotspot-card" onClick={() => handleHotspotClick(hotspot)}>
                      <div className="hotspot-card-content">
                        <span className="hotspot-card-name">{hotspot.name}</span>
                        <span className="hotspot-card-desc">{hotspot.shortDesc}</span>
                      </div>
                      <ChevronRight size={20} className="hotspot-card-arrow" />
                    </div>
                  ))}
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
                      <h1 className="panel-title">{selectedHotspot.content.title}</h1>
                      <div className="divider" />
                    </div>

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
            <Building3DCanvas hotspots={building.hotspots} onHotspotClick={handleHotspotClick} selectedHotspotId={selectedHotspot?.id ?? null} />
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
    </div>
  );
}

export default App;
