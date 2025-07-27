import { useDispatch, useSelector } from "react-redux";
import Calendar from "../components/ui/Calender";
import DailyProblem from "../components/ui/DailyProblem";
import ProblemsList from "../components/ui/ProblemsList";
import { getAllSubmissions } from "../features/problem/problemThunks";
import { useEffect, useState } from "react";

function ProblemSet() {
  const [selectedDate, setSelectedDate] = useState(null);
  const { allSubmission } = useSelector((state) => state.problems);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getAllSubmissions());
  }, [dispatch]);

  return (
    <div className="min-h-screen px-2 w-full pt-16 md:pt-20 dark:bg-neutral/10">
      <div className="lg:w-[90%] mx-auto">
        <div className="flex md:flex-row flex-col items-center md:justify-between gap-5 w-full pb-1">
          <div className="w-[100%]">
          <DailyProblem />
          </div>
          <div className="w-[50%]">
          <Calendar
            selectedDate={selectedDate}
            onDateSelect={setSelectedDate}
            allSubmission={allSubmission}
          />
          </div>
        </div>
        <ProblemsList />
      </div>
    </div>
  );
}

export default ProblemSet;
