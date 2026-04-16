import { useEffect, useRef, useState } from 'react';
import type { EChartsOption } from 'echarts';
import ReactECharts from 'echarts-for-react';

/**
 * 紫禁数读 · 国风数据可视化严格色板（仅用于系列、轴线、文字）
 * 宫墙朱红 / 琉璃明黄 / 边框暗金 / 徽墨黑 / 点翠绿 / 霁蓝
 */
export const PALACE_VIZ = {
  cinnabar: '#8B2323',
  brightGold: '#D4AF37',
  borderGold: '#CDBA96',
  ink: '#1A1A1A',
  jade: '#4A6B5D',
  azure: '#3A4B5C',
  /** 卡片毛玻璃底色，用于扇区描边、tooltip 底等，不替代上述六色作系列色 */
  paper: '#F4F1E1',
} as const;

const C = PALACE_VIZ;
const SERIES_COLORS = [C.cinnabar, C.brightGold, C.jade, C.azure, C.borderGold, C.ink] as const;

const axisLine = { lineStyle: { color: C.borderGold, width: 1 } };
const axisLabel = { color: C.ink, fontSize: 10 };
const splitLine = { lineStyle: { color: `${C.borderGold}55`, type: 'dashed' as const } };
const tooltipBase = {
  backgroundColor: `${C.paper}f2`,
  borderColor: C.borderGold,
  textStyle: { color: C.ink, fontSize: 12 },
};

function LazyEChart({ option, height }: { option: EChartsOption; height: number }) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(false);

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            setActive(true);
            io.disconnect();
          }
        });
      },
      { root: null, rootMargin: '100px 0px', threshold: 0.02 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={wrapRef} className="w-full shrink-0" style={{ height }}>
      {active ? (
        <ReactECharts option={option} style={{ height, width: '100%' }} opts={{ renderer: 'svg' }} />
      ) : (
        <div
          className="flex h-full w-full items-center justify-center rounded-lg border border-dashed border-[#CDBA96]/80 bg-[#F4F1E1]/40 text-xs text-[#1A1A1A]/55"
          aria-hidden
        >
          滚动至此加载图表…
        </div>
      )}
    </div>
  );
}

const chartCardClass =
  'flex flex-col rounded-xl border border-[#CDBA96] bg-[#F4F1E1]/80 p-4 shadow-md backdrop-blur-md ' +
  'transition-all duration-300 ease-out will-change-transform ' +
  'hover:-translate-y-2 hover:scale-[1.02] hover:shadow-2xl';

/* ---------- Mock 数据（可替换为文献考据后的真实数据） ---------- */

const MOCK_WOOD_ROSE = [
  { value: 28, name: '楠木', itemStyle: { color: C.cinnabar } },
  { value: 22, name: '柏木', itemStyle: { color: C.brightGold } },
  { value: 18, name: '松木', itemStyle: { color: C.jade } },
  { value: 14, name: '杉木', itemStyle: { color: C.azure } },
  { value: 10, name: '硬杂木', itemStyle: { color: C.borderGold } },
  { value: 8, name: '其它材种', itemStyle: { color: C.ink } },
];

const MOCK_SUNBURST = {
  name: '紫禁城',
  itemStyle: { color: C.borderGold },
  children: [
    {
      name: '外朝',
      itemStyle: { color: C.cinnabar },
      children: [
        {
          name: '礼仪典礼',
          itemStyle: { color: C.brightGold },
          children: [
            { name: '重檐庑殿顶', value: 6, itemStyle: { color: C.cinnabar } },
            { name: '重檐歇山顶', value: 4, itemStyle: { color: C.jade } },
            { name: '攒尖顶', value: 3, itemStyle: { color: C.azure } },
          ],
        },
        {
          name: '衙署值房',
          itemStyle: { color: C.jade },
          children: [
            { name: '单檐歇山顶', value: 8, itemStyle: { color: C.brightGold } },
            { name: '悬山顶', value: 5, itemStyle: { color: C.borderGold } },
          ],
        },
      ],
    },
    {
      name: '内廷',
      itemStyle: { color: C.azure },
      children: [
        {
          name: '寝居游憩',
          itemStyle: { color: C.brightGold },
          children: [
            { name: '硬山顶', value: 12, itemStyle: { color: C.jade } },
            { name: '卷棚顶', value: 7, itemStyle: { color: C.cinnabar } },
            { name: '攒尖顶', value: 5, itemStyle: { color: C.azure } },
          ],
        },
        {
          name: '园林游廊',
          itemStyle: { color: C.jade },
          children: [
            { name: '悬山顶', value: 9, itemStyle: { color: C.borderGold } },
            { name: '歇山顶', value: 6, itemStyle: { color: C.cinnabar } },
          ],
        },
      ],
    },
  ],
};

const MOCK_FUNNEL = [
  { value: 100, name: '屋顶瓦面荷载', itemStyle: { color: C.cinnabar } },
  { value: 78, name: '檩条传递', itemStyle: { color: C.brightGold } },
  { value: 58, name: '斗栱层（栌斗·散斗·昂·栱）', itemStyle: { color: C.jade } },
  { value: 38, name: '梁架承托', itemStyle: { color: C.azure } },
  { value: 22, name: '立柱与柱础', itemStyle: { color: C.borderGold } },
];

const MOCK_STACK_SCENES = ['皇家宫殿', '宗教建筑', '园林游廊'];
const MOCK_STACK_HEXI = [42, 8, 5];
const MOCK_STACK_XUANZI = [18, 22, 35];
const MOCK_STACK_SUSHI = [3, 12, 28];

const MOCK_LINE_YEARS = [
  '永乐始建',
  '嘉靖重修',
  '万历缮治',
  '康熙重建（太和殿等）',
  '乾隆大缮',
  '光绪晚期',
];
/** 巨型材采伐难度指数（示意） */
const MOCK_LINE_TIMBER = [32, 38, 45, 58, 62, 78];
/** 木构拼接工艺复杂度指数（示意） */
const MOCK_LINE_JOINERY = [28, 35, 42, 55, 68, 72];

/** [占地面积(千㎡示意), 台基高度(m示意), 重要性→气泡面积系数, 名称] */
const MOCK_SCATTER = [
  [2.38, 8.1, 42, '太和殿'],
  [1.4, 5.2, 28, '乾清宫'],
  [1.1, 4.8, 24, '坤宁宫'],
  [0.85, 3.6, 18, '保和殿'],
  [0.62, 2.9, 14, '中和殿'],
  [0.48, 2.4, 12, '体仁阁'],
  [0.35, 1.9, 9, '军机处值房'],
  [0.28, 1.5, 8, '值庐'],
];

const MOCK_TREE = {
  name: '榫卯类型总汇',
  itemStyle: { color: C.cinnabar, borderColor: C.borderGold },
  children: [
    {
      name: '固定垂直构件',
      itemStyle: { color: C.brightGold },
      children: [
        { name: '管脚榫', value: 1, itemStyle: { color: C.jade } },
        { name: '套顶榫', value: 1, itemStyle: { color: C.azure } },
      ],
    },
    {
      name: '水平与交叉结合',
      itemStyle: { color: C.jade },
      children: [
        { name: '卯口（直卯·燕尾卯口）', value: 1, itemStyle: { color: C.cinnabar } },
        { name: '十字刻口搭交', value: 1, itemStyle: { color: C.brightGold } },
      ],
    },
    {
      name: '延伸与拉结',
      itemStyle: { color: C.azure },
      children: [
        { name: '燕尾榫', value: 1, itemStyle: { color: C.borderGold } },
        { name: '箍头榫', value: 1, itemStyle: { color: C.cinnabar } },
      ],
    },
    {
      name: '梁枋与柱头',
      itemStyle: { color: C.borderGold },
      children: [
        { name: '馒头榫', value: 1, itemStyle: { color: C.jade } },
        { name: '透榫·半榫', value: 1, itemStyle: { color: C.azure } },
      ],
    },
  ],
};

/* ---------- ECharts option 工厂 ---------- */

function optionRose(): EChartsOption {
  return {
    backgroundColor: 'transparent',
    textStyle: { color: C.ink },
    tooltip: { ...tooltipBase, trigger: 'item' },
    legend: {
      bottom: 0,
      textStyle: { color: C.ink, fontSize: 10 },
      itemWidth: 10,
      itemHeight: 10,
    },
    series: [
      {
        name: '木材',
        type: 'pie',
        radius: [16, '68%'],
        center: ['50%', '46%'],
        roseType: 'area',
        itemStyle: { borderColor: C.paper, borderWidth: 1 },
        label: { color: C.ink, fontSize: 10 },
        data: MOCK_WOOD_ROSE,
      },
    ],
  };
}

function optionRadar(): EChartsOption {
  return {
    backgroundColor: 'transparent',
    textStyle: { color: C.ink },
    tooltip: { ...tooltipBase },
    legend: {
      bottom: 0,
      data: ['太和殿', '乾清宫', '坤宁宫'],
      textStyle: { color: C.ink, fontSize: 10 },
    },
    radar: {
      indicator: [
        { name: '开间尺度', max: 12 },
        { name: '台基层数', max: 4 },
        { name: '屋脊兽档数', max: 11 },
        { name: '殿顶等级', max: 10 },
        { name: '庭院进深', max: 10 },
      ],
      center: ['50%', '48%'],
      radius: '58%',
      axisName: { color: C.ink, fontSize: 10 },
      axisLine: { lineStyle: { color: C.borderGold } },
      splitLine: { lineStyle: { color: C.borderGold } },
      splitArea: {
        show: true,
        areaStyle: {
          color: [`${C.borderGold}22`, `${C.borderGold}0d`],
        },
      },
    },
    series: [
      {
        type: 'radar',
        data: [
          {
            value: [11, 3, 10, 10, 9],
            name: '太和殿',
            areaStyle: { color: `${C.cinnabar}33` },
            lineStyle: { color: C.cinnabar, width: 2 },
            itemStyle: { color: C.cinnabar },
          },
          {
            value: [9, 2, 7, 8, 8],
            name: '乾清宫',
            areaStyle: { color: `${C.brightGold}33` },
            lineStyle: { color: C.brightGold, width: 2 },
            itemStyle: { color: C.brightGold },
          },
          {
            value: [8, 2, 7, 7, 7],
            name: '坤宁宫',
            areaStyle: { color: `${C.jade}33` },
            lineStyle: { color: C.jade, width: 2 },
            itemStyle: { color: C.jade },
          },
        ],
      },
    ],
  };
}

function optionSunburst(): EChartsOption {
  return {
    backgroundColor: 'transparent',
    textStyle: { color: C.ink },
    tooltip: { ...tooltipBase, trigger: 'item' },
    series: [
      {
        type: 'sunburst',
        data: [MOCK_SUNBURST],
        radius: ['12%', '88%'],
        center: ['50%', '52%'],
        itemStyle: { borderRadius: 4, borderWidth: 1, borderColor: C.paper },
        label: { color: C.ink, fontSize: 9 },
        levels: [
          {},
          { r0: '12%', r: '32%', itemStyle: { borderWidth: 2 } },
          { r0: '32%', r: '58%', label: { rotate: 'tangential' } },
          { r0: '58%', r: '88%', label: { position: 'outside', fontSize: 9 } },
        ],
      },
    ],
  };
}

function optionFunnel(): EChartsOption {
  return {
    backgroundColor: 'transparent',
    textStyle: { color: C.ink },
    tooltip: { ...tooltipBase, trigger: 'item' },
    series: [
      {
        type: 'funnel',
        left: '8%',
        top: 24,
        bottom: 8,
        width: '84%',
        min: 10,
        max: 100,
        sort: 'descending',
        gap: 4,
        label: {
          show: true,
          position: 'inside',
          color: C.paper,
          fontSize: 10,
        },
        data: MOCK_FUNNEL,
      },
    ],
  };
}

function optionStackBar(): EChartsOption {
  return {
    backgroundColor: 'transparent',
    textStyle: { color: C.ink },
    tooltip: {
      ...tooltipBase,
      trigger: 'axis',
      axisPointer: { type: 'shadow' },
    },
    legend: {
      bottom: 0,
      textStyle: { color: C.ink, fontSize: 10 },
    },
    grid: { left: '10%', right: '6%', top: 16, bottom: 52, containLabel: true },
    xAxis: {
      type: 'category',
      data: MOCK_STACK_SCENES,
      axisLine,
      axisLabel,
    },
    yAxis: {
      type: 'value',
      name: '使用面积占比',
      nameTextStyle: { color: C.ink, fontSize: 10 },
      axisLine,
      axisLabel,
      splitLine,
    },
    series: [
      {
        name: '和玺彩画',
        type: 'bar',
        stack: 'area',
        emphasis: { focus: 'series' },
        itemStyle: { color: C.cinnabar },
        data: MOCK_STACK_HEXI,
      },
      {
        name: '旋子彩画',
        type: 'bar',
        stack: 'area',
        emphasis: { focus: 'series' },
        itemStyle: { color: C.brightGold },
        data: MOCK_STACK_XUANZI,
      },
      {
        name: '苏式彩画',
        type: 'bar',
        stack: 'area',
        emphasis: { focus: 'series' },
        itemStyle: { color: C.jade },
        data: MOCK_STACK_SUSHI,
      },
    ],
  };
}

function optionLine(): EChartsOption {
  return {
    backgroundColor: 'transparent',
    textStyle: { color: C.ink },
    tooltip: { ...tooltipBase, trigger: 'axis' },
    legend: {
      bottom: 0,
      textStyle: { color: C.ink, fontSize: 10 },
    },
    grid: { left: '12%', right: '8%', top: 28, bottom: 56, containLabel: true },
    xAxis: {
      type: 'category',
      data: MOCK_LINE_YEARS,
      axisLine,
      axisLabel: { ...axisLabel, rotate: 28, interval: 0 },
    },
    yAxis: {
      type: 'value',
      name: '指数（示意）',
      min: 0,
      max: 100,
      nameTextStyle: { color: C.ink, fontSize: 10 },
      axisLine,
      axisLabel,
      splitLine,
    },
    series: [
      {
        name: '巨型材采伐难度',
        type: 'line',
        smooth: true,
        symbol: 'circle',
        symbolSize: 7,
        lineStyle: { color: C.cinnabar, width: 2 },
        itemStyle: { color: C.cinnabar },
        data: MOCK_LINE_TIMBER,
      },
      {
        name: '木构拼接工艺复杂度',
        type: 'line',
        smooth: true,
        symbol: 'diamond',
        symbolSize: 7,
        lineStyle: { color: C.azure, width: 2 },
        itemStyle: { color: C.azure },
        data: MOCK_LINE_JOINERY,
      },
    ],
  };
}

function optionScatter(): EChartsOption {
  const scatterData = MOCK_SCATTER.map((d, i) => {
    const [x, y, imp, name] = d;
    const isMain = name === '太和殿';
    return {
      value: [x, y, imp, name] as (number | string)[],
      itemStyle: isMain
        ? { color: C.cinnabar, borderColor: C.brightGold, borderWidth: 2, opacity: 0.9 }
        : {
            color: SERIES_COLORS[i % SERIES_COLORS.length],
            borderColor: C.borderGold,
            borderWidth: 1,
            opacity: 0.88,
          },
    };
  });

  return {
    backgroundColor: 'transparent',
    textStyle: { color: C.ink },
    tooltip: {
      ...tooltipBase,
      trigger: 'item',
      formatter: (params: unknown) => {
        const p = params as { value?: (number | string)[] };
        const v = p.value ?? [];
        const name = typeof v[3] === 'string' ? v[3] : '';
        return `${name}<br/>占地约 ${v[0]} 千㎡（示意）<br/>台基高约 ${v[1]} m（示意）`;
      },
    },
    grid: { left: '12%', right: '10%', top: 20, bottom: 28, containLabel: true },
    xAxis: {
      type: 'value',
      name: '占地面积（千㎡·示意）',
      nameTextStyle: { color: C.ink, fontSize: 10 },
      axisLine,
      axisLabel,
      splitLine,
    },
    yAxis: {
      type: 'value',
      name: '须弥座台基高度（m·示意）',
      nameTextStyle: { color: C.ink, fontSize: 10 },
      axisLine,
      axisLabel,
      splitLine,
    },
    series: [
      {
        type: 'scatter',
        symbolSize: (raw: unknown) => {
          const v = Array.isArray(raw) ? raw : [];
          const s = typeof v[2] === 'number' ? v[2] : 12;
          return Math.max(10, Math.sqrt(s) * 2.2);
        },
        label: {
          show: true,
          formatter: (params) => {
            const v = params.value;
            if (Array.isArray(v) && typeof v[3] === 'string') return v[3];
            return '';
          },
          position: 'top',
          color: C.ink,
          fontSize: 9,
        },
        data: scatterData,
      },
    ],
  };
}

function optionTree(): EChartsOption {
  return {
    backgroundColor: 'transparent',
    textStyle: { color: C.ink },
    tooltip: { ...tooltipBase, trigger: 'item' },
    series: [
      {
        type: 'tree',
        data: [MOCK_TREE],
        top: '2%',
        left: '6%',
        bottom: '4%',
        right: '18%',
        symbol: 'emptyCircle',
        symbolSize: 7,
        orient: 'LR',
        expandAndCollapse: true,
        initialTreeDepth: 3,
        label: {
          position: 'left',
          verticalAlign: 'middle',
          align: 'right',
          color: C.ink,
          fontSize: 10,
        },
        leaves: {
          label: {
            position: 'right',
            verticalAlign: 'middle',
            align: 'left',
          },
        },
        lineStyle: { color: C.borderGold, width: 1.5 },
        itemStyle: { borderColor: C.borderGold },
      },
    ],
  };
}

/** 与 tailwind imperial 兼容的别名（旧引用） */
export const IMPERIAL = {
  cinnabar: PALACE_VIZ.cinnabar,
  brightGold: PALACE_VIZ.brightGold,
  borderGold: PALACE_VIZ.borderGold,
  paper: PALACE_VIZ.paper,
  ink: PALACE_VIZ.ink,
  jade: PALACE_VIZ.jade,
  bronze: C.azure,
};

type ChartDef = { id: string; title: string; subtitle: string; option: EChartsOption; height: number };

const CHARTS: ChartDef[] = [
  { id: 'A', title: '建筑木材材质占比', subtitle: '南丁格尔玫瑰图', option: optionRose(), height: 300 },
  { id: 'B', title: '核心宫殿规制等级多维对比', subtitle: '雷达图', option: optionRadar(), height: 320 },
  { id: 'C', title: '屋顶形制分布格局', subtitle: '旭日图', option: optionSunburst(), height: 340 },
  { id: 'D', title: '斗栱受力结构传导示意', subtitle: '漏斗图', option: optionFunnel(), height: 300 },
  { id: 'E', title: '彩画类型与使用场景分布', subtitle: '堆叠柱状图', option: optionStackBar(), height: 300 },
  { id: 'F', title: '明清重大修缮与材作趋势', subtitle: '折线图', option: optionLine(), height: 300 },
  { id: 'G', title: '建筑体量与台基高度分析', subtitle: '散点图', option: optionScatter(), height: 300 },
  { id: 'H', title: '榫卯结构类型分类体系', subtitle: '树图', option: optionTree(), height: 320 },
];

const PAINTING_TOPIC_CHARTS: ChartDef[] = [
  { id: 'P1', title: '彩画类型与空间场景', subtitle: '堆叠柱状图', option: optionStackBar(), height: 360 },
  {
    id: 'P2',
    title: '彩画等级与建筑功能关系',
    subtitle: '雷达图',
    height: 360,
    option: {
      backgroundColor: 'transparent',
      color: [C.cinnabar, C.brightGold, C.jade],
      tooltip: { ...tooltipBase },
      legend: { bottom: 0, textStyle: { color: C.ink, fontSize: 11 } },
      radar: {
        center: ['50%', '48%'],
        radius: '62%',
        indicator: [
          { name: '礼制等级', max: 10 },
          { name: '贴金用量', max: 10 },
          { name: '图案复杂度', max: 10 },
          { name: '维护难度', max: 10 },
          { name: '空间覆盖', max: 10 },
        ],
        axisName: { color: C.ink, fontSize: 11 },
        axisLine: { lineStyle: { color: C.borderGold } },
        splitLine: { lineStyle: { color: C.borderGold } },
        splitArea: { areaStyle: { color: [`${C.borderGold}1f`, `${C.borderGold}0a`] } },
      },
      series: [
        {
          type: 'radar',
          data: [
            { name: '和玺彩画', value: [10, 9, 9, 8, 6], areaStyle: { color: `${C.cinnabar}30` } },
            { name: '旋子彩画', value: [7, 7, 8, 7, 9], areaStyle: { color: `${C.brightGold}30` } },
            { name: '苏式彩画', value: [5, 4, 7, 6, 8], areaStyle: { color: `${C.jade}30` } },
          ],
        },
      ],
    },
  },
  {
    id: 'P3',
    title: '彩画工艺流程拆解',
    subtitle: '漏斗图',
    height: 340,
    option: {
      backgroundColor: 'transparent',
      textStyle: { color: C.ink },
      tooltip: { ...tooltipBase, trigger: 'item' },
      series: [
        {
          type: 'funnel',
          left: '8%',
          top: 28,
          bottom: 12,
          width: '84%',
          sort: 'none',
          gap: 5,
          label: { color: C.paper, fontSize: 11 },
          data: [
            { value: 100, name: '木构基层整理', itemStyle: { color: C.azure } },
            { value: 84, name: '地仗与找平', itemStyle: { color: C.jade } },
            { value: 68, name: '起谱与沥粉', itemStyle: { color: C.borderGold } },
            { value: 52, name: '设色绘制', itemStyle: { color: C.cinnabar } },
            { value: 36, name: '贴金与罩护', itemStyle: { color: C.brightGold } },
          ],
        },
      ],
    },
  },
  {
    id: 'P4',
    title: '彩画色彩语义构成',
    subtitle: '玫瑰图',
    height: 340,
    option: {
      backgroundColor: 'transparent',
      tooltip: { ...tooltipBase, trigger: 'item' },
      legend: { bottom: 0, textStyle: { color: C.ink, fontSize: 11 } },
      series: [
        {
          name: '色彩语义',
          type: 'pie',
          roseType: 'area',
          radius: [18, '70%'],
          center: ['50%', '45%'],
          itemStyle: { borderColor: C.paper, borderWidth: 1 },
          label: { color: C.ink, fontSize: 11 },
          data: [
            { value: 30, name: '朱红：宫墙与秩序', itemStyle: { color: C.cinnabar } },
            { value: 24, name: '金：礼制与尊贵', itemStyle: { color: C.brightGold } },
            { value: 20, name: '青绿：梁枋层次', itemStyle: { color: C.jade } },
            { value: 15, name: '霁蓝：冷暖平衡', itemStyle: { color: C.azure } },
            { value: 11, name: '墨线：轮廓与收边', itemStyle: { color: C.ink } },
          ],
        },
      ],
    },
  },
];

const PAINTING_INFO_MODULES = [
  {
    title: '色彩与纹样',
    className: 'lg:row-span-2',
    body: [
      '故宫彩画以朱红、明黄、青绿、霁蓝、墨线与贴金组织视觉层级，色彩并非单纯装饰，而是服务于建筑等级与空间识别。',
      '和玺彩画常强调龙凤、金线与严整中轴构图；旋子彩画以旋花、锦纹和连续边饰组织梁枋；苏式彩画更偏向园林空间中的山水、花鸟和叙事性图案。',
      '在观看时可以把彩画理解为“梁枋上的导览系统”：颜色提示等级，纹样提示功能，边饰和墨线负责收束构件轮廓。',
    ],
  },
  {
    title: '空间与层级',
    className: '',
    body: [
      '外朝礼仪建筑更强调庄重、对称与金色线脚，内廷寝居空间在秩序中加入更细密的装饰节奏。',
      '游廊、园林和附属建筑通常使用更灵活的构图方式，让彩画与行走路径、视线停留点共同形成空间层次。',
    ],
  },
  {
    title: '功能与礼制',
    className: '',
    body: [
      '彩画同时承担保护木构与表达礼制的双重作用。地仗、设色、贴金和罩护可以减缓木构风化，也让梁枋、斗拱、檐口形成清晰的等级秩序。',
      '图案越严整、金线越明显、主题越接近龙凤礼制，通常越接近高等级宫殿空间的视觉语言。',
    ],
  },
  {
    title: '工艺流程',
    className: 'lg:col-span-2',
    body: [
      '彩画工艺可概括为基层整理、地仗找平、起谱放样、沥粉勾线、设色绘制、贴金罩护等步骤。',
      '其中沥粉让线条隆起，贴金强化重点纹样，罩护层则让颜色与金饰获得更稳定的保存状态。',
      '从数据可视化角度看，流程图适合表达“工序递进”，雷达图适合比较“等级与复杂度”，色彩玫瑰图适合呈现“视觉语义比例”。',
    ],
  },
] as const;

export function PalaceDataChartsSection({ onOpenPainting }: { onOpenPainting?: () => void }) {
  return (
    <section
      className="w-full border-t border-[#CDBA96] bg-gradient-to-b from-[#F4F1E1] via-[#faf6ec] to-[#CDBA96]/15 px-4 py-12 sm:px-6 lg:px-10"
      aria-labelledby="palace-viz-heading"
    >
      <div className="mx-auto max-w-[1600px]">
        <header className="mb-10 text-center">
          <h2
            id="palace-viz-heading"
            className="font-serif text-2xl font-semibold tracking-[0.2em] text-[#8B2323] sm:text-3xl md:text-4xl"
          >
            紫禁数读：古建筑营造密码
          </h2>
          <p className="mx-auto mt-3 max-w-3xl text-sm leading-relaxed text-[#1A1A1A]/85">
            下图表数据为基于营造常识的示意统计，配色严格限定为宫墙朱红、琉璃明黄、边框暗金、徽墨黑、点翠绿与霁蓝。
            参赛时可据《故宫古建筑营造技艺》《中国建筑史》等文献替换为考据数据。
          </p>
        </header>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 md:gap-6 lg:grid-cols-4 lg:gap-7">
          {CHARTS.map((c) => {
            const isPaintingChart = c.id === 'E';
            return (
            <article
              key={c.id}
              className={`${chartCardClass} ${isPaintingChart ? 'cursor-pointer ring-2 ring-[#D4AF37]/35 hover:ring-[#8B2323]/60' : ''}`}
              role={isPaintingChart ? 'button' : undefined}
              tabIndex={isPaintingChart ? 0 : undefined}
              onClick={isPaintingChart ? onOpenPainting : undefined}
              onKeyDown={
                isPaintingChart
                  ? (e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        onOpenPainting?.();
                      }
                    }
                  : undefined
              }
            >
              <div className="mb-2 border-b border-[#CDBA96]/70 pb-2">
                <h3 className="text-sm font-semibold leading-snug text-[#1A1A1A]">
                  <span className="mr-1.5 font-mono text-[#8B2323]">{c.id}</span>
                  {c.title}
                </h3>
                <p className="mt-0.5 text-xs text-[#3A4B5C]">{c.subtitle}</p>
                {isPaintingChart && (
                  <p className="mt-1 text-xs font-medium text-[#8B2323]">点击进入故宫彩画专题</p>
                )}
              </div>
              <LazyEChart option={c.option} height={c.height} />
            </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export function PalacePaintingChartsPage({ onBack }: { onBack: () => void }) {
  return (
    <div className="h-screen overflow-y-auto bg-[#F4F1E1] text-[#1A1A1A]">
      <nav className="sticky top-0 z-20 flex items-center justify-between border-b border-[#CDBA96] bg-[#8B2323] px-6 py-4 text-white shadow-md">
        <button
          type="button"
          onClick={onBack}
          className="rounded-md border border-white/35 px-4 py-2 text-sm transition hover:bg-white/15"
        >
          返回导览地图
        </button>
        <span className="text-sm tracking-[0.22em] text-[#F4F1E1]">故宫彩画专题</span>
      </nav>

      <main className="mx-auto max-w-[1500px] px-5 py-10 sm:px-8 lg:px-12">
        <header className="mb-10">
          <p className="text-sm font-semibold tracking-[0.28em] text-[#8B2323]">CAIHUA DATA STORY</p>
          <h1 className="mt-3 font-serif text-3xl font-semibold text-[#1A1A1A] sm:text-5xl">彩画：梁枋上的礼制与色彩秩序</h1>
          <p className="mt-4 max-w-4xl text-sm leading-7 text-[#1A1A1A]/80">
            故宫彩画不只是装饰，它把建筑等级、构件保护、空间功能和视觉识别组织到同一套图案系统中。以下图表以示意数据呈现和玺、旋子、苏式彩画在不同建筑场景中的关系，可继续替换为考据后的真实统计。
          </p>
        </header>

        <section className="mb-10 grid gap-4 md:grid-cols-3">
          {[
            ['等级秩序', '彩画样式与建筑礼制等级相互对应，高等级空间更强调金线、龙纹与严整构图。'],
            ['构件保护', '地仗、设色与罩护共同延长木构寿命，使梁枋在防潮、防虫和观赏之间取得平衡。'],
            ['空间识别', '不同彩画类型帮助观众区分宫殿、游廊、园林和宗教性空间的视觉气质。'],
          ].map(([title, body]) => (
            <article key={title} className="rounded-lg border border-[#CDBA96] bg-white/70 p-5 shadow-sm">
              <h2 className="text-lg font-semibold text-[#8B2323]">{title}</h2>
              <p className="mt-2 text-sm leading-7 text-[#1A1A1A]/78">{body}</p>
            </article>
          ))}
        </section>

        <section
          className="mb-12 rounded-lg border border-[#CDBA96] bg-[#f8f4e8] bg-[radial-gradient(circle_at_top_left,rgba(205,186,150,0.28),transparent_34%),linear-gradient(180deg,rgba(255,255,255,0.42),rgba(244,241,225,0.82))] p-5 shadow-inner sm:p-7"
          aria-label="彩画信息说明模块"
        >
          <div className="grid gap-5 lg:grid-cols-[1fr_0.86fr_1.35fr]">
            {PAINTING_INFO_MODULES.map((item) => (
              <article key={item.title} className={`flex min-h-[220px] flex-col ${item.className}`}>
                <div className="mx-auto mb-4 inline-flex min-w-52 items-center justify-center gap-3 border border-[#CDBA96] bg-[#B7A57B] px-6 py-2 text-center text-sm font-semibold tracking-[0.28em] text-white shadow-sm">
                  <span className="h-2 w-2 rounded-full bg-white/85" />
                  {item.title}
                  <span className="h-2 w-2 rounded-full bg-white/85" />
                </div>
                <div className="flex flex-1 flex-col justify-center rounded-lg bg-[#d9d6cd]/62 p-5 text-sm leading-7 text-[#1A1A1A]/82 shadow-sm">
                  {item.body.map((paragraph) => (
                    <p key={paragraph} className="mb-3 last:mb-0">
                      {paragraph}
                    </p>
                  ))}
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {PAINTING_TOPIC_CHARTS.map((chart) => (
            <article key={chart.id} className="flex flex-col rounded-lg border border-[#CDBA96] bg-white/75 p-5 shadow-md">
              <div className="mb-3 border-b border-[#CDBA96]/70 pb-3">
                <h2 className="text-base font-semibold text-[#1A1A1A]">
                  <span className="mr-2 font-mono text-[#8B2323]">{chart.id}</span>
                  {chart.title}
                </h2>
                <p className="mt-1 text-xs text-[#3A4B5C]">{chart.subtitle}</p>
              </div>
              <ReactECharts option={chart.option} style={{ height: chart.height, width: '100%' }} opts={{ renderer: 'svg' }} />
            </article>
          ))}
        </section>
      </main>
    </div>
  );
}
