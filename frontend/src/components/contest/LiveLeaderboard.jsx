import { useEffect, useMemo, useState } from "react";
import { Trophy, ChevronRight } from "lucide-react";
import { socket } from "../../utils/socket";
import { NavLink } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { setLeaderboard } from "../../features/contest/contestSlice";

const LiveLeaderboard = ({ contestId, contestName }) => {
  const rawLeaderboard = useSelector((state) => state.contests.leaderboard);
  const dispatch = useDispatch();

  const leaderboard = useMemo(
    () => rawLeaderboard[contestId] || [],
    [rawLeaderboard, contestId]
  );

  useEffect(() => {
    if (!contestId) return;
    if (!socket.connected) socket.connect();

    socket.emit("join-contest", contestId);

    fetch(`${import.meta.env.VITE_BACKEND}/contest/${contestId}/leaderboard`, {
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => {
        dispatch(
          setLeaderboard({
            contestId,
            data: data.leaderboard,
            leaderboardProblems: data.problems,
          })
        );
      });

    socket.on("leaderboard:update", (updated) => {
      dispatch(
        setLeaderboard({
          contestId,
          data: updated,
          leaderboardProblems: rawLeaderboard[contestId]?.problems || [],
        })
      );
    });

    return () => {
      socket.off("leaderboard:update");
      socket.emit("leave-contest", contestId);
    };
  }, [contestId]);

  if (!contestId) return null;

  return (
    <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
      <div className="p-6 bg-gradient-to-r from-yellow-400 to-orange-500 text-white">
        <div className="flex items-center gap-3 mb-2">
          <Trophy className="w-6 h-6" />
          <h3 className="text-xl font-bold">Live Leaderboard</h3>
        </div>
        <p className="text-yellow-100 text-sm">
          {contestName || "Live Contest"}
        </p>
      </div>

      <div className="p-6">
        <div className="space-y-4">
          {leaderboard.length === 0 ? (
            <p className="text-gray-500 text-sm">No submissions yet.</p>
          ) : (
            leaderboard.map((user, index) => (
              <div key={user.rank} className="flex items-center gap-4">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                    user.rank === 1
                      ? "bg-yellow-500 text-white"
                      : user.rank === 2
                      ? "bg-gray-400 text-white"
                      : user.rank === 3
                      ? "bg-amber-600 text-white"
                      : "bg-gray-100 text-gray-600"
                  }`}
                >
                  {user.rank}
                </div>

                <div className="flex-1">
                  <span className="font-semibold text-gray-900">
                    {user.name}
                  </span>
                  <p className="text-sm text-gray-500">{user.finishTime}</p>
                </div>

                <div className="text-right">
                  <p className="font-bold text-gray-900">{user.score}</p>
                  <p className="text-xs text-gray-500">points</p>
                </div>
              </div>
            ))
          )}
        </div>

        <NavLink
          to={`/leaderboard/${contestId}`}
          className="w-full mt-4 text-blue-600 hover:text-blue-700 font-semibold flex items-center justify-center gap-2"
        >
          View Full Leaderboard
          <ChevronRight className="w-4 h-4" />
        </NavLink>
      </div>
    </div>
  );
};

export default LiveLeaderboard;
