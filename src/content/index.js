import debounceAddPlayerMapStats from "./features/addPlayerMapStats";
import { fetchMemoizedAllMatchPlayersMapStats } from "./helpers/faceit-api";
import {
  getMatchroomId,
  hasMainContentElement,
  isMatchroomOverviewLoaded,
  isMatchroomPage,
  isShadowRootLoaded,
} from "./helpers/matchroom";

const handleMutation = (mutations, observer) => {
  // If not page of interest -> do nothing
  if (!hasMainContentElement() || !isMatchroomPage()) return;

  const matchroomId = getMatchroomId();
  // Start fetching and memoize player details before page fully loaded
  fetchMemoizedAllMatchPlayersMapStats(matchroomId);

  // If page is not fully loaded yet -> do nothing
  if (!isShadowRootLoaded() || !isMatchroomOverviewLoaded()) return;

  // When page fully loaded, add player statistics
  debounceAddPlayerMapStats(matchroomId);

  mutations.forEach((mutation) => {
    mutation.addedNodes.forEach((addedNode) => {
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
