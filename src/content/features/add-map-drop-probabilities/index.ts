import { debounce } from "lodash";
import { ACTIVE_MAP_POOL_REVERSE } from "../../../shared/consts";
import { MapName } from "../../../shared/types/csgo-maps";
import {
  fetchMe,
  getMatchPlayersFromMatchId,
  getOpponentCaptainIdFromMatchId,
} from "../../helpers/faceit-api";
import { getMapName, getMatchroomMapsElements } from "../../helpers/matchroom";
import { memGetPlayerMapDropProbabilities } from "../../helpers/probabilities";
import { hasMappio } from "../../helpers/utils";
import createProbabilityCell from "./components/ProbabilityCell";

export default debounce(async (matchId) => {
  const matchPlayers = await getMatchPlayersFromMatchId(matchId);
  const currentUserId = await fetchMe().then((me) => me.id);
  const currentUserIsInMatch = matchPlayers.some(
    (player) => player.player_id === currentUserId
  );
  if (!currentUserIsInMatch) return;

  const opponentCaptainId = await getOpponentCaptainIdFromMatchId(
    matchId,
    currentUserId
  );
  const mapDropProbabilities = await memGetPlayerMapDropProbabilities(
    opponentCaptainId
  );

  const matchMapsElements = getMatchroomMapsElements();
  matchMapsElements.forEach((mapElement) => {
    if (hasMappio(mapElement)) return;

    const mapName = getMapName(mapElement);
    if (!mapName) return;
    const mapCodename = ACTIVE_MAP_POOL_REVERSE.get(mapName as MapName);
    if (!mapCodename) return;

    const probability = mapDropProbabilities.find(
      (map) => map.mapCodename === mapCodename
    )?.probability;
    if (!probability) return;

    const probabilityCell = createProbabilityCell({ probability });
    mapElement.append(probabilityCell);
  });
}, 300);
