import { Filter, Plus, TrendingUp } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import ProblemsList from "../ui/ProblemsList";
import ProblemForm from "./ProblemForm";
import Modal from "../ui/Modal";
import { setShowCreateModal } from "../../features/ui/uiSlice";

function AllProblem() {
  const { problems } = useSelector((state) => state.problems);
  const { showCreateModal } = useSelector((state) => state.ui);
  const dispatch = useDispatch();

  return (
    <>
      <div className="text-slate-400 text-sm w-full space-y-8 mt-6 mx-auto h-full">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Problems
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Manage coding problems and test cases
            </p>
          </div>
          <button
            onClick={() => dispatch(setShowCreateModal(true))}
            className="btn btn-error btn-dash hover:text-white"
          >
            <Plus className="h-4 w-4" />
            Create Problem
          </button>
        </div>
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white dark:bg-white/10 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-white/5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-white">
                  Total Problems
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-yellow-400">
                  {problems.length}
                </p>
              </div>
              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                <Filter className="h-4 w-4 text-blue-600" />
              </div>
            </div>
          </div>
          <div className="bg-white dark:bg-white/10 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-white/5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-white">
                  Easy Problems
                </p>
                <p className="text-2xl font-bold text-green-600">
                  {problems.filter((p) => p.difficulty === "easy").length}
                </p>
              </div>
              <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                <TrendingUp className="h-4 w-4 text-green-600" />
              </div>
            </div>
          </div>
          <div className="bg-white dark:bg-white/10 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-white/5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-white">
                  Medium Problems
                </p>
                <p className="text-2xl font-bold text-yellow-600">
                  {problems.filter((p) => p.difficulty === "medium").length}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white dark:bg-white/10 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-white/5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-white">
                  Hard Problems
                </p>
                <p className="text-2xl font-bold text-red-600">
                  {problems.filter((p) => p.difficulty === "hard").length}
                </p>
              </div>
            </div>
          </div>
        </div>
        <ProblemsList />
      </div>
      <Modal
        isOpen={!!showCreateModal}
        onClose={() => dispatch(setShowCreateModal(false))}
        title={
          <>
            <h1 className="text-3xl font-bold mb-2">Create New Problem</h1>{" "}
            <p className="text-sm text-gray-500">
              Create a new coding problem with test cases and reference
              solutions.
            </p>
          </>
        }
        size="xl"
      >
        {showCreateModal && <ProblemForm />}
      </Modal>
    </>
  );
}

export default AllProblem;
