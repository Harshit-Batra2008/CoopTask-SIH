import React from 'react';

function getScoreColor(score) {
  if (score >= 85) return '#1B5E3B';
  if (score >= 70) return '#16a34a';
  if (score >= 40) return '#d97706';
  return '#dc2626';
}

function getScoreLabel(score) {
  if (score >= 85) return 'Excellent';
  if (score >= 70) return 'Strong';
  if (score >= 55) return 'Good';
  if (score >= 40) return 'Fair';
  return 'Weak';
}

export function MatchScoreBar({ score, size = 'md', showLabel = true }) {
  const color = getScoreColor(score);
  const label = getScoreLabel(score);

  if (size === 'sm') {
    return (
      <div className="ct-match-score" style={{ gap: 6 }}>
        <div style={{
          width: 28, height: 28, borderRadius: '50%', border: `3px solid ${color}`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '0.65rem', fontWeight: 700, color,
        }}>
          {score}
        </div>
        {showLabel && <span className="ct-match-label" style={{ color }}>{label}</span>}
      </div>
    );
  }

  const radius = size === 'lg' ? 36 : 28;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;
  const svgSize = (radius + 6) * 2;

  return (
    <div className="ct-match-score">
      <div className="ct-match-circle" style={{ width: svgSize, height: svgSize }}>
        <svg width={svgSize} height={svgSize}>
          <circle className="ct-match-circle-bg" cx={svgSize / 2} cy={svgSize / 2} r={radius} />
          <circle
            className="ct-match-circle-fill"
            cx={svgSize / 2} cy={svgSize / 2} r={radius}
            stroke={color}
            strokeDasharray={circumference}
            strokeDashoffset={offset}
          />
        </svg>
        <span className={`ct-match-value ct-match-value-${size === 'lg' ? 'md' : 'sm'}`}>{score}</span>
      </div>
      {showLabel && (
        <div>
          <div className="ct-match-label" style={{ color }}>{label} match</div>
          <div className="ct-text-xs ct-text-muted">{score} / 100</div>
        </div>
      )}
    </div>
  );
}

export function MatchBreakdown({ breakdown }) {
  if (!breakdown) return null;

  const items = [
    { key: 'skill', ...breakdown.skill },
    { key: 'distance', ...breakdown.distance },
    { key: 'workload', ...breakdown.workload },
  ];

  return (
    <div className="ct-match-breakdown">
      {items.map((item) => {
        const pct = item.max > 0 ? (item.score / item.max) * 100 : 0;
        const color = getScoreColor(pct);
        return (
          <div key={item.key} className="ct-match-bar">
            <div className="ct-match-bar-header">
              <span className="ct-match-bar-label">{item.label}</span>
              <span className="ct-match-bar-value">{item.score}/{item.max}</span>
            </div>
            <div className="ct-match-bar-track">
              <div className="ct-match-bar-fill" style={{ width: `${pct}%`, background: color }} />
            </div>
            {item.detail && <div className="ct-text-xs ct-text-muted">{item.detail}</div>}
          </div>
        );
      })}
    </div>
  );
}
