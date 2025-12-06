/**
 * HealthBadge Component
 * 
 * Displays a circular badge with segmented ring design showing health status.
 * The badge features a gray base circle with a colored overlay showing status.
 * 
 * @component
 * @param {string} status - Health status ("A", "B", "C", or "-")
 * @param {boolean} isFirst - Whether this is the first badge in a series
 * @returns {JSX.Element} Health badge component
 */
import { useMemo } from "react";

const HealthBadge = ({ status, isFirst = false }) => {
  const badgeSize = 28;
  const ringWidth = 2.5;
  const outerRadius = badgeSize / 2 - 0.5;
  const innerRadius = outerRadius - ringWidth;
  const center = badgeSize / 2 + 0.5;

  const badgeConfig = useMemo(() => {
    if (!status || status === "-") {
      return {
        ringColor: "#9CA3AF",
        text: "-",
        showColoredRing: false,
      };
    }

    const isGreen = status === "A";
    const isOrange = status === "B" || status === "C";
    const ringColor = isGreen ? "#029262" : isOrange ? "#FF7E17" : "#9CA3AF";

    return {
      ringColor,
      text: status,
      showColoredRing: true,
    };
  }, [status]);

  const circumference = 2 * Math.PI * outerRadius;
  const quarterArc = circumference / 4;
  const threeQuarterArc = (circumference * 3) / 4;

  return (
    <span
      className="inline-flex items-center justify-center relative"
      style={{
        marginLeft: isFirst ? "6px" : "6px",
        width: `${badgeSize}px`,
        height: `${badgeSize}px`,
      }}
    >
      <svg
        width={badgeSize}
        height={badgeSize}
        viewBox={`0 0 ${badgeSize} ${badgeSize}`}
        className="absolute"
      >
        {/* Gray circle - always shows (unfilled) */}
        <circle
          cx={center}
          cy={center}
          r={outerRadius}
          fill="none"
          stroke="#9CA3AF"
          strokeWidth={ringWidth}
        />
        {/* Colored circle - overlaps gray, showing 3/4 from 3 to 12 o'clock */}
        {badgeConfig.showColoredRing && (
          <circle
            cx={center}
            cy={center}
            r={outerRadius}
            fill="none"
            stroke={badgeConfig.ringColor}
            strokeWidth={ringWidth}
            strokeDasharray={`${threeQuarterArc} ${quarterArc}`}
            strokeDashoffset={-Math.PI * outerRadius * 0.5 - quarterArc}
            strokeLinecap="round"
          />
        )}
      </svg>
      <span
        className="absolute rounded-full flex items-center justify-center"
        style={{
          width: `${innerRadius * 2}px`,
          height: `${innerRadius * 2}px`,
          backgroundColor: "transparent",
        }}
      >
        <span className="text-xs font-semibold" style={{ color: "#9CA3AF" }}>
          {badgeConfig.text}
        </span>
      </span>
    </span>
  );
};

export default HealthBadge;

