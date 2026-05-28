import MatrixLoadingProgressIndicator from "../MatrixLoadingProgressIndicator";
import GView from "@/src/common/GView";

export function TableLoading() {
  return (
    <GView>
      <MatrixLoadingProgressIndicator height={41} />
    </GView>
  );
}
