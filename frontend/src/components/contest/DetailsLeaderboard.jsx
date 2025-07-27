import { useDispatch, useSelector } from "react-redux";
import { useEffect} from "react";
import { UserRow } from "./UserRow";
import { useParams } from "react-router";
import { socket } from "../../utils/socket";
import { setLeaderboard } from "../../features/contest/contestSlice";
import toast from "react-hot-toast";
import { Clock, Target, TrendingUp, Trophy, Users } from "lucide-react";
import { ContestTimer } from "./ContestTimer";
import { fetchAllContests } from "../../features/contest/contestThunks";

const DetailsLeaderboard = () => {
  const { contestId } = useParams();
  const { user } = useSelector((state) => state.auth);
  const {
    contests,
    leaderboard: allLeaderboards,
    leaderboardProblems: allProblems,
  } = useSelector((state) => state.contests);
  const dispatch = useDispatch();

  const leaderboardData = allLeaderboards[contestId] || [];
  const problemOrder = allProblems[contestId] || [];

  useEffect(() => {
    if (!contests || contests.length === 0) {
      dispatch(fetchAllContests());
    }
  }, [dispatch, contests]);

  const getContestStatus = (startTime, endTime) => {
    const now = new Date().getTime();
    const start = new Date(startTime).getTime();
    const end = new Date(endTime).getTime();

    if (now < start) return "upcoming";
    if (now >= start && now <= end) return "live";
    return "ended";
  };

  const liveContest = contests.find(
    (contest) =>
      contest._id === contestId &&
      getContestStatus(contest.startTime, contest.endTime) === "live"
  );

  console.log();

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_BACKEND}/contest/${contestId}/leaderboard`,
          {
            credentials: "include",
          }
        );

        const result = await response.json();
        console.log("Leaderboard result:", result);
        const updatedLeaderboard = result.leaderboard.map((u) => ({
          ...u,
          isCurrentUser: u.userId === user._id,
        }));

        dispatch(
          setLeaderboard({
            contestId,
            data: updatedLeaderboard,
            leaderboardProblems: result.problems,
          })
        );
      } catch (error) {
        console.error("Error fetching leaderboard:", error);
      }
    };

    if (!contestId) return;
    if (!socket.connected) socket.connect();

    socket.emit("join-contest", contestId);
    fetchLeaderboard();

    socket.on("leaderboard:update", (updated) => {
      const tagCurrentUser = (leaderboard, userId) =>
        leaderboard.map((u) => ({
          ...u,
          isCurrentUser: u.userId === userId,
        }));

      dispatch(
        setLeaderboard({
          contestId,
          data: tagCurrentUser(updated, user._id),
          leaderboardProblems: allProblems[contestId] || [],
        })
      );
      toast.success("Leaderboard updated");
    });

    return () => {
      socket.off("leaderboard:update");
      socket.emit("leave-contest", contestId);
    };
  }, [contestId, dispatch]);

  const currentUser = leaderboardData.find((u) => u.isCurrentUser);
  const otherUsers = leaderboardData.filter((u) => !u.isCurrentUser);

  return (
    <div className="min-h-screen">
      <div className="bg-gradient-to-r from-rose-800 to-rose-800  dark:from-neutral  dark:via-black/85  dark:to-neutral backdrop-blur border-b border-gray-700 sticky top-0 z-10  pt-12">
        <div className="absolute inset-0 bg-black/20"></div>

        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-white/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-white/5 rounded-full blur-3xl"></div>
        </div>
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-orange-500/20 rounded-xl">
                <Trophy className="w-8 h-8 text-orange-400" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white">
                  Contest Leaderboard
                </h1>
                <div className="flex items-center gap-4 mt-2 text-sm text-gray-400">
                  <div className="flex items-center gap-1">
                    <Users className="w-4 h-4" />
                    <span>
                      {liveContest?.registrations?.length} participants
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    last update at 3:00
                  </div>
                </div>
              </div>
            </div>

            {liveContest && (
              <ContestTimer
                startTime={liveContest?.startTime}
                endTime={liveContest?.endTime}
              />
            )}
          </div>

          <div className="mt-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-white dark:bg-gray-800/40 backdrop-blur rounded-xl p-4 border border-gray-700">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-500/20 rounded-lg">
                    <Users className="w-5 h-5 text-blue-400" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-blue-500">
                      {liveContest?.registrations?.length}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      Participants
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800/40 backdrop-blur rounded-xl p-4 border border-gray-700">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-green-500/20 rounded-lg">
                    <Target className="w-5 h-5 text-green-400" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-green-500">
                      {problemOrder.length}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      Problems
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800/40 backdrop-blur rounded-xl p-4 border border-gray-700">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-yellow-500/20 rounded-lg">
                    <TrendingUp className="w-5 h-5 text-yellow-400" />
                  </div>
                  <div>
                    <div className="text-sm text-gray-400">Top Score</div>
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800/40 backdrop-blur rounded-xl p-4 border border-gray-700">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-purple-500/20 rounded-lg">
                    <Clock className="w-5 h-5 text-purple-400" />
                  </div>
                  <div>
                    <div className="text-sm text-gray-400">Avg Score</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="min-h-110 mt-10 rounded-xl overflow-hidden border dark:border-gray-100/10 w-[90%] mx-auto">
        <table className="w-full">
          <thead className="dark:text-white">
            <tr>
              <th>Rank</th>
              <th>Name</th>
              <th>Score</th>
              <th>Finish Time</th>

              {/* Dynamic problem columns */}
              {problemOrder.map((_, i) => (
                <th className="text-left" key={i}>
                  Q{i + 1}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {leaderboardData.length === 0 ? (
              <tr>
                <td
                  colSpan={4 + problemOrder.length}
                  className="text-center py-6 text-gray-400 h-100"
                >
                  No problems solved yet.
                </td>
              </tr>
            ) : (
              <>
                {currentUser && (
                  <UserRow user={currentUser} problemOrder={problemOrder} />
                )}
                {currentUser && (
                  <tr>
                    <td colSpan={8}>
                      <div className="border-t border-gray-600"></div>
                    </td>
                  </tr>
                )}
                {otherUsers.map((user) => (
                  <UserRow
                    key={user.userId}
                    user={user}
                    problemOrder={problemOrder}
                  />
                ))}
              </>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DetailsLeaderboard;
