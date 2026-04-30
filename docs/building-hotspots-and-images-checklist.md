# 五个新建筑热点拆分与图片命名清单

> 目标：把午门、太和殿、文华殿、武英殿、乾清宫做成类似“东北角楼”的建筑详情页。每个建筑不建议直接整段堆文案，而是拆成“建筑概览 + 热点构件 + 技术参数 + 文化意义 + AI 讲解上下文”。

## 一、总体开发建议

1. **东北角楼继续保留 3D 模型交互**：现有 `corner-tower.glb` 只适合角楼，不要给其他建筑误用。
2. **五个新建筑先做图文热点页**：如果暂时没有对应 GLB 模型，右侧区域用“建筑主图 + 热点导航 + 局部细节图”替代 3D。
3. **每个热点尽量控制在 6–8 个**：太多会影响页面阅读，也会让 AI 上下文过长。
4. **图片优先级**：先找“建筑整体外观图”，再找“结构局部图”，最后找“内部陈设 / 历史功能图”。
5. **图片命名必须和热点一一对应**：不要使用 `platform`、`roof`、`main-hall` 这类容易和中文热点脱节的英文泛称。
6. **统一命名规则**：图片文件使用 `建筑拼音-热点拼音.jpg`，热点 ID 与图片名保持一致。
7. **午门术语修正**：午门下部承托结构建议使用“墩台”或“墩台与门洞”，不要再用“城台”作为热点名；“城台”容易导致找图困难，也不如“墩台”贴近午门介绍中的常用表述。

推荐数据字段写法：

```ts
{
  id: "wumen-duntai-mendong",
  title: "墩台与门洞",
  image: "/images/buildings/wumen-duntai-mendong.jpg"
}
```

对应关系必须清楚：

```txt
热点 title = 墩台与门洞
热点 id = wumen-duntai-mendong
图片文件 = wumen-duntai-mendong.jpg
图片路径 = /images/buildings/wumen-duntai-mendong.jpg
```

建议统一把五个建筑的热点图片放在：

```txt
public/images/buildings/
```

---

## 二、午门热点设计

### 页面定位

午门适合做成“皇权入口 + 礼制门阙 + 五凤楼形制”的主题。重点不是内部陈设，而是墩台、门洞等级、主楼、雁翅楼、阙亭和仪式通道。

### 主图建议

| 用途 | 建议文件名 | 图片内容 |
|---|---|---|
| 午门详情页主图 | `wumen-zhutu.jpg` | 午门整体正面图，最好能看到主楼、雁翅楼、阙亭和下部墩台 |

### 热点与图片命名

| 热点 ID | 热点名称 | 类型 | 页面说明重点 | 图片文件名 | 图片路径 |
|---|---|---|---|---|---|
| `wumen-duntai-mendong` | 墩台与门洞 | 外部结构 | 午门下部高大墩台、正面三门、承托上部主楼，是“五凤楼”形制的基础 | `wumen-duntai-mendong.jpg` | `/images/buildings/wumen-duntai-mendong.jpg` |
| `wumen-zhulou` | 主楼 | 外部结构 | 面阔九间、进深五间、重檐庑殿顶、黄琉璃瓦、钟鼓明廊 | `wumen-zhulou.jpg` | `/images/buildings/wumen-zhulou.jpg` |
| `wumen-yanchilou` | 东西雁翅楼 | 外部结构 | “凹”字形展开、环抱空间、单檐歇山顶、辅助防御与展览空间 | `wumen-yanchilou.jpg` | `/images/buildings/wumen-yanchilou.jpg` |
| `wumen-queting` | 四座阙亭 | 外部结构 | 四角重檐攒尖顶、四隅拱卫、丰富午门天际线 | `wumen-queting.jpg` | `/images/buildings/wumen-queting.jpg` |
| `wumen-mingsan-anwu` | 明三暗五 | 礼制空间 | 正面三门、两侧隐藏掖门，形成“明三暗五”的门洞制度与通行秩序 | `wumen-mingsan-anwu.jpg` | `/images/buildings/wumen-mingsan-anwu.jpg` |
| `wumen-zhongmen-yudao` | 中门御道 | 礼制空间 | 皇帝专属通道，皇后大婚和殿试前三甲可特殊通行，体现尊卑秩序 | `wumen-zhongmen-yudao.jpg` | `/images/buildings/wumen-zhongmen-yudao.jpg` |
| `wumen-dougong-hexicaihua` | 斗拱与和玺彩画 | 工艺细节 | 斗拱承重、梁枋彩画、皇家等级装饰，体现城门建筑的礼制规格 | `wumen-dougong-hexicaihua.jpg` | `/images/buildings/wumen-dougong-hexicaihua.jpg` |

### 午门必须找的图片

1. `wumen-zhutu.jpg`：午门整体正面图，适合做详情页主图。
2. `wumen-duntai-mendong.jpg`：午门下部高大红色墩台与正面三个门洞。可以直接从午门正面整体图中裁剪下半部分。
3. `wumen-zhulou.jpg`：午门主楼正面或近景图，重点看上方重檐庑殿顶和黄琉璃瓦。
4. `wumen-yanchilou.jpg`：东西雁翅楼，最好是能看出“凹”字形展开的斜侧视角。
5. `wumen-queting.jpg`：午门四角阙亭 / 角亭局部图。
6. `wumen-mingsan-anwu.jpg`：能说明“明三暗五”的图片。若找不到单张照片，可以用午门背面、平面示意图或自己在午门正面图上做标注。
7. `wumen-zhongmen-yudao.jpg`：中门和御道图，重点展示居中的礼仪通道。
8. `wumen-dougong-hexicaihua.jpg`：斗拱或梁枋彩画细节图。

### 午门找图关键词

```txt
午门 墩台
午门 门洞
午门 明三暗五
午门 五凤楼
午门 主楼
午门 雁翅楼
午门 阙亭
午门 斗拱 彩画
```

> 注意：不要再搜索“午门城台”作为主要关键词。更建议搜索“午门 墩台”“午门 门洞”“午门 五凤楼”，或者直接使用午门整体正面图裁剪出“墩台与门洞”局部。

---

## 三、太和殿热点设计

### 页面定位

太和殿适合做成“最高礼制建筑 + 外朝核心 + 皇家大典空间”的主题。它应该是这几座新建筑中最隆重、信息层级最高的一页。

### 主图建议

| 用途 | 建议文件名 | 图片内容 |
|---|---|---|
| 太和殿详情页主图 | `taihedian-zhutu.jpg` | 太和殿整体正面图，最好能看到三层台基与重檐屋顶 |

### 热点与图片命名

| 热点 ID | 热点名称 | 类型 | 页面说明重点 | 图片文件名 | 图片路径 |
|---|---|---|---|---|---|
| `taihedian-san-ceng-hanbaiyu-taiji` | 三层汉白玉台基 | 外部结构 | 三台、须弥座、汉白玉栏杆、螭首排水、御道石雕 | `taihedian-san-ceng-hanbaiyu-taiji.jpg` | `/images/buildings/taihedian-san-ceng-hanbaiyu-taiji.jpg` |
| `taihedian-dianshen-shiyi-kaijian` | 殿身与十一开间 | 外部结构 | 面阔十一间、进深五间、72 根巨柱、木构梁架 | `taihedian-dianshen-shiyi-kaijian.jpg` | `/images/buildings/taihedian-dianshen-shiyi-kaijian.jpg` |
| `taihedian-zhongyan-wudian-ding` | 重檐庑殿顶 | 外部结构 | 最高等级屋顶、黄色琉璃瓦、正吻、檐角走兽 | `taihedian-zhongyan-wudian-ding.jpg` | `/images/buildings/taihedian-zhongyan-wudian-ding.jpg` |
| `taihedian-dougong-tixi` | 斗拱体系 | 工艺结构 | 承托屋顶、传递荷载、榫卯连接、等级规范 | `taihedian-dougong-tixi.jpg` | `/images/buildings/taihedian-dougong-tixi.jpg` |
| `taihedian-jinqi-baozuo` | 金漆宝座 | 内部陈设 | 宝座、雕龙屏风、缠龙柱、皇权中心 | `taihedian-jinqi-baozuo.jpg` | `/images/buildings/taihedian-jinqi-baozuo.jpg` |
| `taihedian-jinzhuan-pudi` | 金砖铺地 | 内部工艺 | 苏州金砖、铺墁工艺、乌金质感、湿度调节 | `taihedian-jinzhuan-pudi.jpg` | `/images/buildings/taihedian-jinzhuan-pudi.jpg` |
| `taihedian-yizhang-chenshe` | 仪仗陈设 | 礼制陈设 | 宝象、甪端、仙鹤、香亭、日晷、嘉量 | `taihedian-yizhang-chenshe.jpg` | `/images/buildings/taihedian-yizhang-chenshe.jpg` |
| `taihedian-hexicaihua` | 和玺彩画 | 装饰工艺 | 梁枋彩画、龙凤图案、青蓝金色彩、皇家等级 | `taihedian-hexicaihua.jpg` | `/images/buildings/taihedian-hexicaihua.jpg` |

### 太和殿必须找的图片

1. `taihedian-zhutu.jpg`：太和殿整体正面图，建议用作详情页主图。
2. `taihedian-san-ceng-hanbaiyu-taiji.jpg`：三层汉白玉台基与栏杆图。
3. `taihedian-dianshen-shiyi-kaijian.jpg`：太和殿殿身正面图，能体现面阔和体量。
4. `taihedian-zhongyan-wudian-ding.jpg`：重檐庑殿顶、正吻或檐角走兽图。
5. `taihedian-dougong-tixi.jpg`：太和殿斗拱局部图。
6. `taihedian-jinqi-baozuo.jpg`：金漆宝座和室内空间图。
7. `taihedian-jinzhuan-pudi.jpg`：金砖铺地图。
8. `taihedian-yizhang-chenshe.jpg`：宝象、甪端、仙鹤、香亭、日晷、嘉量等陈设图。
9. `taihedian-hexicaihua.jpg`：和玺彩画或缠龙柱细节图。

---

## 四、文华殿热点设计

### 页面定位

文华殿适合做成“东侧文治空间 + 经筵讲学 + 书卷气建筑”的主题。它的视觉语气应更典雅、内敛，不要像太和殿一样过度强调“至尊”。

### 主图建议

| 用途 | 建议文件名 | 图片内容 |
|---|---|---|
| 文华殿详情页主图 | `wenhuadian-zhutu.jpg` | 文华殿整体外观图，最好能看到院落与主殿 |

### 热点与图片命名

| 热点 ID | 热点名称 | 类型 | 页面说明重点 | 图片文件名 | 图片路径 |
|---|---|---|---|---|---|
| `wenhuadian-zhudian-xingzhi` | 主殿形制 | 外部结构 | 面阔五间、进深三间、院落式布局、文治空间 | `wenhuadian-zhudian-xingzhi.jpg` | `/images/buildings/wenhuadian-zhudian-xingzhi.jpg` |
| `wenhuadian-danyan-wudian-ding` | 单檐庑殿顶 | 外部结构 | 等级较高但低于重檐核心建筑，体现克制礼制 | `wenhuadian-danyan-wudian-ding.jpg` | `/images/buildings/wenhuadian-danyan-wudian-ding.jpg` |
| `wenhuadian-dougong-liangfang` | 斗拱与梁枋 | 工艺结构 | 承重、视觉节奏、次等级礼制秩序 | `wenhuadian-dougong-liangfang.jpg` | `/images/buildings/wenhuadian-dougong-liangfang.jpg` |
| `wenhuadian-zuowen-youwu-geju` | 左文右武格局 | 空间礼制 | 文华殿在东、武英殿在西，形成文武并举 | `wenhuadian-zuowen-youwu-geju.jpg` | `/images/buildings/wenhuadian-zuowen-youwu-geju.jpg` |
| `wenhuadian-jingyan-jiangxue` | 经筵讲学 | 历史功能 | 皇帝听讲经史、文臣进讲、儒家经典教育 | `wenhuadian-jingyan-jiangxue.jpg` | `/images/buildings/wenhuadian-jingyan-jiangxue.jpg` |
| `wenhuadian-dianji-shuhua-zhancheng` | 典籍书画展陈 | 近现代功能 | 故宫博物院后转为书画、典籍类展示空间 | `wenhuadian-dianji-shuhua-zhancheng.jpg` | `/images/buildings/wenhuadian-dianji-shuhua-zhancheng.jpg` |
| `wenhuadian-caihua-wenya-fengge` | 彩画与文雅风格 | 装饰工艺 | 青、绿、金主调，含蓄典雅、书卷气 | `wenhuadian-caihua-wenya-fengge.jpg` | `/images/buildings/wenhuadian-caihua-wenya-fengge.jpg` |

### 文华殿必须找的图片

1. `wenhuadian-zhutu.jpg`：文华殿整体外观图。
2. `wenhuadian-zhudian-xingzhi.jpg`：文华殿主殿形制图。
3. `wenhuadian-danyan-wudian-ding.jpg`：文华殿单檐庑殿顶图。
4. `wenhuadian-dougong-liangfang.jpg`：文华殿斗拱 / 梁枋 / 彩画局部图。
5. `wenhuadian-zuowen-youwu-geju.jpg`：故宫平面位置图，用来说明“东文西武”。
6. `wenhuadian-jingyan-jiangxue.jpg`：经筵讲学相关图；如果找不到，可以用典籍、讲学空间、展陈说明图替代。
7. `wenhuadian-dianji-shuhua-zhancheng.jpg`：文华殿展厅或典籍书画展陈图。
8. `wenhuadian-caihua-wenya-fengge.jpg`：文华殿彩画或装饰细节图。

---

## 五、武英殿热点设计

### 页面定位

武英殿适合做成“西侧武政空间 + 武英殿书局 + 从军政到文化生产”的主题。它不是单纯讲军事，而是讲“武”如何被纳入礼制，又如何转化为典籍刊刻和文化空间。

### 主图建议

| 用途 | 建议文件名 | 图片内容 |
|---|---|---|
| 武英殿详情页主图 | `wuyingdian-zhutu.jpg` | 武英殿整体外观图，最好能看到院落与主殿 |

### 热点与图片命名

| 热点 ID | 热点名称 | 类型 | 页面说明重点 | 图片文件名 | 图片路径 |
|---|---|---|---|---|---|
| `wuyingdian-zhudian-xingzhi` | 主殿形制 | 外部结构 | 面阔五间、进深三间、院落格局、稳重刚健 | `wuyingdian-zhudian-xingzhi.jpg` | `/images/buildings/wuyingdian-zhudian-xingzhi.jpg` |
| `wuyingdian-danyan-wudian-ding` | 单檐庑殿顶 | 外部结构 | 黄琉璃瓦、次于中轴核心殿宇、庄重不张扬 | `wuyingdian-danyan-wudian-ding.jpg` | `/images/buildings/wuyingdian-danyan-wudian-ding.jpg` |
| `wuyingdian-dougong-liangfang` | 斗拱与梁枋 | 工艺结构 | 斗拱承重、梁枋彩画、规整克制 | `wuyingdian-dougong-liangfang.jpg` | `/images/buildings/wuyingdian-dougong-liangfang.jpg` |
| `wuyingdian-zuowen-youwu-geju` | 左文右武格局 | 空间礼制 | 武英殿在西，与文华殿对称，体现文武分序 | `wuyingdian-zuowen-youwu-geju.jpg` | `/images/buildings/wuyingdian-zuowen-youwu-geju.jpg` |
| `wuyingdian-junzheng-yishi` | 军政议事 | 历史功能 | 明代政务、军事议事、武臣体系 | `wuyingdian-junzheng-yishi.jpg` | `/images/buildings/wuyingdian-junzheng-yishi.jpg` |
| `wuyingdian-shuju` | 武英殿书局 | 历史功能 | 刻印典籍、编纂大型文献、整理书版 | `wuyingdian-shuju.jpg` | `/images/buildings/wuyingdian-shuju.jpg` |
| `wuyingdian-diaoban-yinshua-gongyi` | 雕版印刷工艺 | 工艺传统 | 与书局功能相连，体现文化生产技术 | `wuyingdian-diaoban-yinshua-gongyi.jpg` | `/images/buildings/wuyingdian-diaoban-yinshua-gongyi.jpg` |
| `wuyingdian-shuhua-dianji-zhanting` | 书画典籍展厅 | 近现代功能 | 故宫博物院后的书画、雕版印刷展陈 | `wuyingdian-shuhua-dianji-zhanting.jpg` | `/images/buildings/wuyingdian-shuhua-dianji-zhanting.jpg` |

### 武英殿必须找的图片

1. `wuyingdian-zhutu.jpg`：武英殿整体外观图。
2. `wuyingdian-zhudian-xingzhi.jpg`：武英殿主殿形制图。
3. `wuyingdian-danyan-wudian-ding.jpg`：武英殿屋顶图。
4. `wuyingdian-dougong-liangfang.jpg`：武英殿斗拱、梁枋或彩画局部图。
5. `wuyingdian-zuowen-youwu-geju.jpg`：故宫平面位置图，用来说明“西武”和文华殿对称关系。
6. `wuyingdian-junzheng-yishi.jpg`：军政议事相关图；如果找不到，可以用武英殿空间图或历史说明图替代。
7. `wuyingdian-shuju.jpg`：武英殿书局相关图；如果找不到，可以找“武英殿聚珍版丛书”相关图。
8. `wuyingdian-diaoban-yinshua-gongyi.jpg`：雕版印刷 / 古籍刻印工艺图。
9. `wuyingdian-shuhua-dianji-zhanting.jpg`：武英殿展厅或书画馆 / 典籍馆相关图。

---


## 六、乾清宫热点设计

### 页面定位

乾清宫适合做成“内廷正寝 + 寝政合一 + 秘密立储 + 家国同构”的主题。它不应再重复太和殿、文华殿、武英殿已经使用较多的“屋顶、斗拱、彩画、主殿形制”拆法，而应突出乾清宫作为内廷后三宫之首、皇帝日常起居与理政空间、清代秘密立储制度象征空间的独特性。

乾清宫与前面几座建筑的区分重点：午门偏“皇权入口与门阙秩序”，太和殿偏“外朝最高典礼”，文华殿偏“文治讲学”，武英殿偏“武政与书局转型”，乾清宫则偏“内廷正寝、日常理政、皇位传承制度与宫廷原状陈列”。

### 主图建议

| 用途 | 建议文件名 | 图片内容 |
|---|---|---|
| 乾清宫详情页主图 | `qianqinggong-zhutu.jpg` | 乾清宫整体正面图，最好能看到殿前月台、正殿立面、黄琉璃瓦屋顶和院落空间 |

### 热点与图片命名

| 热点 ID | 热点名称 | 类型 | 页面说明重点 | 图片文件名 | 图片路径 |
|---|---|---|---|---|---|
| `qianqinggong-neiting-zhonglu` | 内廷中路 | 空间格局 | 乾清宫位于内廷中路最前端，前接外朝，后连交泰殿、坤宁宫，体现“前朝后寝”的空间秩序 | `qianqinggong-neiting-zhonglu.jpg` | `/images/buildings/qianqinggong-neiting-zhonglu.jpg` |
| `qianqinggong-yuetai-yuanluo` | 月台与院落 | 外部空间 | 由主殿、月台、配殿、廊庑组成完整院落，不再单独重复“台基”热点，而是突出内廷正殿的空间组织 | `qianqinggong-yuetai-yuanluo.jpg` | `/images/buildings/qianqinggong-yuetai-yuanluo.jpg` |
| `qianqinggong-jiujian-dianshen` | 九间殿身 | 建筑规制 | 面阔九间、进深五间，暗合“九五之尊”，体现内廷最高规格，但避免与太和殿“十一开间”重复 | `qianqinggong-jiujian-dianshen.jpg` | `/images/buildings/qianqinggong-jiujian-dianshen.jpg` |
| `qianqinggong-qiju-lizheng` | 起居理政空间 | 历史功能 | 乾清宫既是皇帝寝宫，也是日常理政、批阅奏章、召见臣工之所，突出“寝政合一” | `qianqinggong-qiju-lizheng.jpg` | `/images/buildings/qianqinggong-qiju-lizheng.jpg` |
| `qianqinggong-zhengda-guangming` | 正大光明匾 | 核心符号 | “正大光明”匾是乾清宫最具辨识度的视觉符号，可引出皇权正统、政治公开性与空间象征 | `qianqinggong-zhengda-guangming.jpg` | `/images/buildings/qianqinggong-zhengda-guangming.jpg` |
| `qianqinggong-jianchu-mixia` | 建储密匣 | 制度象征 | 清代秘密立储制度确立后，建储密匣藏于“正大光明”匾后，使乾清宫成为皇位传承制度的标志性空间 | `qianqinggong-jianchu-mixia.jpg` | `/images/buildings/qianqinggong-jianchu-mixia.jpg` |
| `qianqinggong-yuanzhuang-chenlie` | 原状陈列 | 近现代功能 | 故宫博物院成立后，乾清宫作为宫廷原状陈列开放，保留帝王生活与理政场景 | `qianqinggong-yuanzhuang-chenlie.jpg` | `/images/buildings/qianqinggong-yuanzhuang-chenlie.jpg` |

### 乾清宫必须找的图片

1. `qianqinggong-zhutu.jpg`：乾清宫整体正面外观图，适合做详情页主图。
2. `qianqinggong-neiting-zhonglu.jpg`：故宫平面图或中轴线示意图，用来标出乾清宫在“外朝三大殿—乾清宫—交泰殿—坤宁宫”之间的位置。若找不到现成图，可以在故宫平面图上自行加红框或箭头。
3. `qianqinggong-yuetai-yuanluo.jpg`：乾清宫殿前月台、院落、廊庑空间图。可以从整体正面图中裁剪下半部分，突出殿前空间。
4. `qianqinggong-jiujian-dianshen.jpg`：乾清宫正立面或殿身图，重点能看出面阔开间和正殿体量。
5. `qianqinggong-qiju-lizheng.jpg`：乾清宫内部空间、宝座区域、室内陈设或理政空间图，突出“皇帝起居 + 日常理政”的复合功能。
6. `qianqinggong-zhengda-guangming.jpg`：“正大光明”匾额近景，这是乾清宫最重要、最有辨识度的图片之一。
7. `qianqinggong-jianchu-mixia.jpg`：建储密匣或秘密立储制度相关图。若找不到真实密匣图，可以使用“正大光明”匾额图进行裁剪和箭头标注，说明“密匣藏于匾后”。
8. `qianqinggong-yuanzhuang-chenlie.jpg`：乾清宫宫廷原状陈列图，最好能看到宝座、屏风、匾额、室内陈设和当前展陈状态。

### 乾清宫找图关键词

```txt
乾清宫 正面
乾清宫 外观
乾清宫 内廷中路
故宫 平面图 乾清宫
乾清宫 月台
乾清宫 院落
乾清宫 面阔九间
乾清宫 内景
乾清宫 宝座
乾清宫 正大光明 匾
乾清宫 建储密匣
乾清宫 秘密立储
乾清宫 原状陈列
```

> 注意：乾清宫不建议再把“重檐庑殿顶”“斗拱与梁枋”“金龙和玺彩画”“汉白玉台基”单独列为热点。这些内容可以放入“九间殿身”或“月台与院落”的技术说明中，避免和太和殿、文华殿、武英殿、午门的热点过度重合。

---

## 七、图片文件最终建议命名汇总

### 午门

```txt
public/images/buildings/wumen-zhutu.jpg
public/images/buildings/wumen-duntai-mendong.jpg
public/images/buildings/wumen-zhulou.jpg
public/images/buildings/wumen-yanchilou.jpg
public/images/buildings/wumen-queting.jpg
public/images/buildings/wumen-mingsan-anwu.jpg
public/images/buildings/wumen-zhongmen-yudao.jpg
public/images/buildings/wumen-dougong-hexicaihua.jpg
```

### 太和殿

```txt
public/images/buildings/taihedian-zhutu.jpg
public/images/buildings/taihedian-san-ceng-hanbaiyu-taiji.jpg
public/images/buildings/taihedian-dianshen-shiyi-kaijian.jpg
public/images/buildings/taihedian-zhongyan-wudian-ding.jpg
public/images/buildings/taihedian-dougong-tixi.jpg
public/images/buildings/taihedian-jinqi-baozuo.jpg
public/images/buildings/taihedian-jinzhuan-pudi.jpg
public/images/buildings/taihedian-yizhang-chenshe.jpg
public/images/buildings/taihedian-hexicaihua.jpg
```

### 文华殿

```txt
public/images/buildings/wenhuadian-zhutu.jpg
public/images/buildings/wenhuadian-zhudian-xingzhi.jpg
public/images/buildings/wenhuadian-danyan-wudian-ding.jpg
public/images/buildings/wenhuadian-dougong-liangfang.jpg
public/images/buildings/wenhuadian-zuowen-youwu-geju.jpg
public/images/buildings/wenhuadian-jingyan-jiangxue.jpg
public/images/buildings/wenhuadian-dianji-shuhua-zhancheng.jpg
public/images/buildings/wenhuadian-caihua-wenya-fengge.jpg
```

### 武英殿

```txt
public/images/buildings/wuyingdian-zhutu.jpg
public/images/buildings/wuyingdian-zhudian-xingzhi.jpg
public/images/buildings/wuyingdian-danyan-wudian-ding.jpg
public/images/buildings/wuyingdian-dougong-liangfang.jpg
public/images/buildings/wuyingdian-zuowen-youwu-geju.jpg
public/images/buildings/wuyingdian-junzheng-yishi.jpg
public/images/buildings/wuyingdian-shuju.jpg
public/images/buildings/wuyingdian-diaoban-yinshua-gongyi.jpg
public/images/buildings/wuyingdian-shuhua-dianji-zhanting.jpg
```

### 乾清宫

```txt
public/images/buildings/qianqinggong-zhutu.jpg
public/images/buildings/qianqinggong-neiting-zhonglu.jpg
public/images/buildings/qianqinggong-yuetai-yuanluo.jpg
public/images/buildings/qianqinggong-jiujian-dianshen.jpg
public/images/buildings/qianqinggong-qiju-lizheng.jpg
public/images/buildings/qianqinggong-zhengda-guangming.jpg
public/images/buildings/qianqinggong-jianchu-mixia.jpg
public/images/buildings/qianqinggong-yuanzhuang-chenlie.jpg
```

---

## 八、给 Codex 的补充说明

可以把下面这段追加到 Codex 提示词里：

```txt
请按照 docs/building-hotspots-and-image-checklist.md 中的热点 ID 和图片路径接入数据。注意：午门不再使用“城台 / wumen-chengtai.jpg”这一命名，统一改为“墩台与门洞 / wumen-duntai-mendong.jpg”。乾清宫不要照抄“屋顶、斗拱、彩画、台基”这类前面建筑已经反复出现的热点，应突出“内廷中路、起居理政、正大光明匾、建储密匣、原状陈列”等差异化内容。如果实际图片暂时缺失，请不要引用不存在路径导致 404，可以先使用占位图或不渲染 img 标签。
```
