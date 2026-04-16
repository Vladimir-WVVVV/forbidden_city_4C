import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '../lib/utils';

interface SpecItem {
  label: string;
  value: string;
}

interface HotspotDetailCardsProps {
  details: string[];
  specs: SpecItem[];
  cultural?: string;
}

type CardId = 'details' | 'specs' | 'cultural';

export function HotspotDetailCards({ details, specs, cultural }: HotspotDetailCardsProps) {
  const [openCards, setOpenCards] = useState<Record<CardId, boolean>>({
    details: false,
    specs: false,
    cultural: false,
  });

  const toggleCard = (id: CardId) => {
    setOpenCards((current) => ({ ...current, [id]: !current[id] }));
  };

  const cards = [
    {
      id: 'details' as const,
      title: '详细说明',
      hint: '展开查看构件形制、结构关系与观察要点。',
      available: details.length > 0,
      content: (
        <ul className="detail-list">
          {details.map((detail, index) => (
            <li key={index}>{detail}</li>
          ))}
        </ul>
      ),
    },
    {
      id: 'specs' as const,
      title: '技术参数',
      hint: '展开查看材质、构造层次、功能等信息。',
      available: specs.length > 0,
      content: (
        <div className="specs-grid">
          {specs.map((spec, index) => (
            <div key={index} className="spec-item">
              <span className="spec-label">{spec.label}</span>
              <span className="spec-value">{spec.value}</span>
            </div>
          ))}
        </div>
      ),
    },
    {
      id: 'cultural' as const,
      title: '文化意义',
      hint: '展开查看这一细节在礼制、审美与宫城秩序中的含义。',
      available: Boolean(cultural),
      content: <p className="section-content">{cultural}</p>,
    },
  ].filter((card) => card.available);

  return (
    <div className="hotspot-fold-card-list" aria-label="热点下半部分折叠内容">
      {cards.map((card) => {
        const isOpen = openCards[card.id];
        const contentId = `hotspot-card-${card.id}`;

        return (
          <article key={card.id} className={cn('hotspot-fold-card', isOpen && 'is-open')}>
            <button
              type="button"
              className="hotspot-fold-card-trigger"
              aria-expanded={isOpen}
              aria-controls={contentId}
              onClick={() => toggleCard(card.id)}
            >
              <span className="hotspot-fold-card-copy">
                <span className="hotspot-fold-card-title">{card.title}</span>
                <span className="hotspot-fold-card-hint">{card.hint}</span>
              </span>
              <span className="hotspot-fold-card-action">
                {isOpen ? '收起' : '展开'}
                <ChevronDown size={18} className="hotspot-fold-card-icon" aria-hidden="true" />
              </span>
            </button>

            {isOpen && (
              <div id={contentId} className="hotspot-fold-card-body">
                {card.content}
              </div>
            )}
          </article>
        );
      })}
    </div>
  );
}
