import { isFeatureEnabled, MappioFeature } from "../shared/settings";
import debounceAddMapDropProbabilities from "./features/add-map-drop-probabilities";
import debounceAddPlayerMapStats from "./features/add-player-map-stats";
import { memFetchAllMatchPlayersMapStats } from "./helpers/faceit-api";
import {
  getMatchroomId,
  hasMainContentElement,
  isMatchroomOverviewLoaded,
  isMatchroomPage,
  isShadowRootLoaded,
} from "./helpers/matchroom";

const handleMutation = async (
  mutations: MutationRecord[],
  observer: MutationObserver
) => {
  // If not page of interest -> do nothing
  if (!hasMainContentElement() || !isMatchroomPage()) return;

  const matchroomId = getMatchroomId();
  // Start fetching and memoize player details before page fully loaded
  memFetchAllMatchPlayersMapStats(matchroomId);

  // If page is not fully loaded yet -> do nothing
  if (!isShadowRootLoaded() || !isMatchroomOverviewLoaded()) return;

  // When page fully loaded, run feature scripts if respective features are enabled
  // Add player statistics
  if (await isFeatureEnabled(MappioFeature.PlayerMapStats))
    debounceAddPlayerMapStats(matchroomId);

  // Add map drop probabilities
  if (await isFeatureEnabled(MappioFeature.MapDropProbabilities))
    debounceAddMapDropProbabilities(matchroomId);

  mutations.forEach((mutation) => {
    mutation.addedNodes.forEach((addedNode: any) => {
      if (addedNode.shadowRoot) {
        observer.observe(addedNode.shadowRoot, {
          childList: true,
          subtree: true,
        });
      }
    });
  });
};

const observer = new MutationObserver(handleMutation);
observer.observe(document.body, { childList: true, subtree: true });
