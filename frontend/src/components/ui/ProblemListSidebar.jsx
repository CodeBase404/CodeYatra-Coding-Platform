import { X } from "lucide-react";
import ProblemsList from "./ProblemsList";

const ProblemListSidebar = ({ isOpen, onClose }) => {
  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 h-[100vh] z-100"
          onClick={onClose}
        ></div>
      )}

      <div
        className={`fixed top-0 left-0 z-[100] h-[100vh] w-[90vw] max-w-[45vw]  bg-white dark:bg-[#1e1e1e] shadow-lg transform transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between p-4 border-b border-gray-300 dark:border-gray-700">
          <h2 className="text-lg font-semibold text-black dark:text-white">
            Problem List
          </h2>
          <button onClick={onClose} className="cursor-pointer">
            <X />
          </button>
        </div>

        <div className="p-2 h-[calc(100%-60px)] overflow-y-auto">
          <ProblemsList onClose={onClose} descHideFromSidebar={true}/>
        </div>
      </div>
    </>
  );
};

export default ProblemListSidebar;
