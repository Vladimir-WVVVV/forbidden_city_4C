import { useState } from 'react';

export type ImageHotspotPick = {
  id: string;
  name: string;
  shortDesc: string;
  image?: string;
  position: { x: number; y: number; z?: number };
  content: {
    title: string;
    description: string;
  };
};

type BuildingImageHotspotProps = {
  buildingId: string;
  buildingName: string;
  mainImage: string;
  hotspots: ImageHotspotPick[];
  selectedHotspotId: string | null;
  onSelectHotspot: (hotspot: ImageHotspotPick) => void;
};

const BUILDING_VISUAL_PROFILES: Record<string, { kicker: string; title: string; description: string; axis: string }> = {
  wumen: {
    kicker: 'IMPERIAL GATE',
    title: '门阙轴线观察',
    description: '从中轴御道向上看午门，辨认门洞、主楼与两翼展开的五凤楼格局。',
    axis: '皇权入口 / 通行秩序',
  },
  taihe_dian: {
    kicker: 'CEREMONY CORE',
    title: '大典层级观察',
    description: '沿台基、殿身、屋顶和殿前陈设向上阅读太和殿的最高礼制层级。',
    axis: '外朝核心 / 国家大典',
  },
  wenhua_dian: {
    kicker: 'LITERATI COURT',
    title: '文治院落观察',
    description: '以更安静的视角看主殿、讲学与典籍展陈，理解外朝东路的文治气质。',
    axis: '经筵讲学 / 典籍书画',
  },
  wuying_dian: {
    kicker: 'WESTERN WORKSHOP',
    title: '武政书局观察',
    description: '把主殿形制、军政议事、书局与印刷工艺串联起来，看“武”如何转向文化生产。',
    axis: '西路武政 / 宫廷出版',
  },
  qianqing_gong: {
    kicker: 'INNER COURT',
    title: '寝政合一观察',
    description: '围绕内廷中路、正大光明匾与建储密匣，阅读乾清宫的日常权力运行。',
    axis: '内廷正寝 / 皇位传承',
  },
};

export function BuildingImageHotspot({
  buildingId,
  buildingName,
  mainImage,
  hotspots,
  selectedHotspotId,
  onSelectHotspot,
}: BuildingImageHotspotProps) {
  const [imageFailed, setImageFailed] = useState(false);
  const selectedHotspot = hotspots.find((hotspot) => hotspot.id === selectedHotspotId) ?? hotspots[0];
  const profile = BUILDING_VISUAL_PROFILES[buildingId] ?? {
    kicker: 'PALACE VIEW',
    title: '建筑主图热点交互',
    description: '点击图中热点，查看对应构件、空间与历史功能说明。',
    axis: buildingName,
  };

  return (
    <section className={`building-image-hotspot building-image-hotspot--${buildingId}`} aria-label={`${buildingName}建筑主图热点交互`}>
      <div className="image-hotspot-heading">
        <div>
          <span className="image-hotspot-kicker">{profile.kicker}</span>
          <h2>{profile.title}</h2>
          <p>{profile.description}</p>
        </div>
        <span className="image-hotspot-axis">{profile.axis}</span>
      </div>

      <div className="building-image-stage">
        <img
          className="building-main-image"
          src={mainImage}
          alt={`${buildingName}主图`}
          loading="lazy"
          onError={(event) => {
            event.currentTarget.classList.add('is-missing');
            setImageFailed(true);
          }}
        />
        {imageFailed && (
          <div className="image-fallback-message" role="alert">
            建筑图片暂时加载失败，请稍后重试。
          </div>
        )}

        {hotspots.map((hotspot, index) => {
          const active = hotspot.id === selectedHotspot?.id;
          return (
            <button
              key={hotspot.id}
              type="button"
              className={`image-hotspot-marker ${active ? 'active' : ''}`}
              style={{
                left: `${hotspot.position.x}%`,
                top: `${hotspot.position.y}%`,
              }}
              title={hotspot.name}
              aria-pressed={active}
              aria-label={`查看${hotspot.name}`}
              onClick={() => onSelectHotspot(hotspot)}
            >
              <span className="image-hotspot-index">{index + 1}</span>
              <span className="image-hotspot-label">{hotspot.name}</span>
            </button>
          );
        })}
        <div className="image-hotspot-mapnote">
          <span>{buildingName}</span>
          <strong>{selectedHotspot?.name ?? '建筑热点'}</strong>
        </div>
      </div>

      <div className="image-hotspot-nav" aria-label={`${buildingName}热点快速切换`}>
        {hotspots.map((hotspot, index) => {
          const active = hotspot.id === selectedHotspot?.id;
          return (
            <button
              key={hotspot.id}
              type="button"
              className={`image-hotspot-nav-item ${active ? 'active' : ''}`}
              onClick={() => onSelectHotspot(hotspot)}
            >
              <span>{String(index + 1).padStart(2, '0')}</span>
              {hotspot.name}
            </button>
          );
        })}
      </div>

      {selectedHotspot && (
        <article className="hotspot-preview-card">
          {selectedHotspot.image ? (
            <img
              className="hotspot-preview-image"
              src={selectedHotspot.image}
              alt={selectedHotspot.name}
              loading="lazy"
              onError={(event) => {
                event.currentTarget.style.display = 'none';
              }}
            />
          ) : (
            <div className="hotspot-preview-empty">该热点暂未配置局部图片</div>
          )}
          <div className="hotspot-preview-copy">
            <span className="hotspot-preview-type">{selectedHotspot.shortDesc}</span>
            <h3>{selectedHotspot.content.title}</h3>
            <p>{selectedHotspot.content.description}</p>
          </div>
        </article>
      )}
    </section>
  );
}
