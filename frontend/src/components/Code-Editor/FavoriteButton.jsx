import { Star } from "lucide-react";
import axiosClient from "../../utils/axiosClient";
import { useDispatch, useSelector } from "react-redux";
import {
  addFavoriteLocally,
  removeFavoriteLocally,
} from "../../features/problem/problemsSlice";

const FavoriteButton = ({ problemId }) => {
  const dispatch = useDispatch();
  const { favProblems } = useSelector((state) => state.problems);

  const isFavorite = favProblems.some((p) => p._id === problemId);

  console.log(isFavorite);

  const toggleFavorite = async () => {
    try {
      await axiosClient.post(`/problem/favorite/${problemId}`);

      if (isFavorite) {
        dispatch(removeFavoriteLocally(problemId));
      } else {
        dispatch(addFavoriteLocally({ _id: problemId }));
      }
    } catch (err) {
      console.error("Failed to toggle favorite", err);
    }
  };

  return (
    <button
      onClick={toggleFavorite}
      title={isFavorite ? "Remove from Favorites" : "Add to Favorites"}
      className="cursor-pointer"
    >
      <Star
        className={
          isFavorite ? "text-yellow-500 fill-yellow-500" : "text-gray-500"
        }
        fill={isFavorite ? "currentColor" : "none"}
        size={20}
      />
    </button>
  );
};

export default FavoriteButton;
