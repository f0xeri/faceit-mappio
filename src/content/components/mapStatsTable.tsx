/** @jsx h */
import { h } from "dom-chef";
import { ReactNode } from "react";
import { ACTIVE_MAP_POOL, ESCL } from "../../shared/consts";
import { colors } from "../../shared/theme";
import createMapStatsCell from "./mapStatsCell";

type _h = typeof h; // needed to prevent TSeslint from removing h import

const mapStatsTable = ({ stats }: { stats: any }) => {
  const mapStatsElements: ReactNode[] = [];

  ACTIVE_MAP_POOL.forEach((mapName, mapCodename) => {
    const label = mapName.substring(0, 3).toUpperCase();
    const stat = stats.get(mapCodename) || { games: "0", kd: "0" };

    const statElement = createMapStatsCell({ label, stat });

    mapStatsElements.push(statElement);
  });

  const el = (
    <div
      className={`${ESCL} mapStats`}
      style={{
        width: "100%",
        display: "flex",
        flexDirection: "column",
        borderTop: `1px solid ${colors.backgrey}`,
        color: `${colors.foregrey}`,
        fontSize: 11,
      }}
    >
      <div style={{ textAlign: "center", paddingTop: 4 }}>
        Map / Games / K/D
      </div>
      <div
        style={{
          padding: "2px 4px 4px 4px",
          minHeight: 50,
          boxSizing: "border-box",
          width: "100%",
          display: "grid",
          gap: "0px 26px",
          gridTemplateColumns: "repeat(auto-fill, minmax(72px, 1fr))",
        }}
      >
        {mapStatsElements}
      </div>
    </div>
  );

  return el;
};

export default mapStatsTable;
