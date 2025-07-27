import ContestForm from "./ContestForm ";
import { useDispatch, useSelector } from "react-redux";
import { Plus, Trophy } from "lucide-react";
import Modal from "../ui/Modal";
import AllContest from "../ui/AllContests";
import { setShowCreateModal } from "../../features/ui/uiSlice";

function Contest() {
   const { showCreateModal } = useSelector((state) => state.ui);
   const dispatch = useDispatch();

  return (
    <>
      <div className="text-slate-400 text-sm w-full space-y-2 mt-6 mx-auto h-full">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex items-center gap-2">
            <Trophy className="w-12 h-12 text-blue-600 mx-auto" />
            <div className="space-y-1">
            <h1 className="text-3xl font-bold text-gray-900">
              Programming Contests
            </h1>
            <p className="pl-0.5 text-gray-600">
              Discover and participate in coding challenges
            </p>
            </div>
          </div>
          <button
            onClick={() => dispatch(setShowCreateModal(true))}
            className="btn  btn-secondary btn-dash hover:text-white"
          >
            <Plus className="h-4 w-4" />
            Create Contest
          </button>
        </div>
        <div>
          <AllContest />
        </div>
      </div>

      <Modal
        isOpen={!!showCreateModal}
        onClose={() => dispatch(setShowCreateModal(false))}
        title={
          <div className="flex items-center gap-2">
            <Trophy className="w-12 h-12 text-blue-600 mx-auto" />
            <h1 className="text-3xl font-bold text-gray-900">
              Create New Contest
            </h1>
          </div>
        }
        size="xl"
      >
        {showCreateModal && (
          <ContestForm />
        )}
      </Modal>
    </>
  );
}

export default Contest;
