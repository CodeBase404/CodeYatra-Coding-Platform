import { useEffect } from "react";
import Left from "../components/Code-Editor/Left";
import Right from "../components/Code-Editor/Right";
import Bottom from "../components/Code-Editor/Bottom";
import Split from "react-split";
import { useDispatch } from "react-redux";
import { useParams } from "react-router";
import {
  fetchSubmissionsById,
  getProblemById,
} from "../features/problem/problemThunks";
import { fetchUserProfile } from "../features/auth/authThunks";

function CodeEditor() {
  const dispatch = useDispatch();
  let { problemId, contestId } = useParams();

  useEffect(() => {
    dispatch(getProblemById(problemId));
    dispatch(fetchSubmissionsById(problemId));
  }, [problemId]);

  useEffect(() => {
    dispatch(fetchUserProfile());
  }, [dispatch]);

  return (
    <div className="min-h-screen dark:bg-neutral text-slate-100 relative z-2 pt-14">
      <Split
        className="flex flex-row h-[calc(100vh-65px)] w-[calc(100vw-10px)] m-auto"
        sizes={[45, 55]}
        minSize={0}
        gutterSize={2}
      >
        <div className="flex flex-col overflow-hidden rounded-md border border-black/10 dark:border-white/20">
          <Left problemId={problemId} />
        </div>

        <Split
          className="flex flex-col h-full select-none"
          direction="vertical"
          sizes={[60, 40]}
          minSize={0}
          gutterSize={2}
        >
          <div className="h-full overflow-hidden rounded-md border border-black/10 dark:border-white/20">
            <Right problemId={problemId} contestId={contestId} />
          </div>
          <div className="rounded-md overflow-auto scrollbar-hide border border-black/10 dark:border-white/20 ">
            <Bottom />
          </div>
        </Split>
      </Split>
    </div>
  );
}

export default CodeEditor;
