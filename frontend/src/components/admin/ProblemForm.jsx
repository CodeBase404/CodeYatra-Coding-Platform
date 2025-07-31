import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import axiosClient from "../../utils/axiosClient";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ChevronDown, ChevronUp, Plus, Trash } from "lucide-react";
import { useDispatch } from "react-redux";
import { setShowCreateModal } from "../../features/ui/uiSlice";

const problemSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  difficulty: z.enum(["easy", "medium", "hard"]),
  tags: z.enum(["array", "string", "linkedList", "graph", "dp"]),
  visibleTestCases: z
    .array(
      z.object({
        input: z.string().min(1, "Input is required"),
        output: z.string().min(1, "Output is required"),
        explanation: z.string().min(1, "Explanation is required"),
      })
    )
    .min(1, "At least one visible test case required"),
  hiddenTestCases: z
    .array(
      z.object({
        input: z.string().min(1, "Input is required"),
        output: z.string().min(1, "Output is required"),
      })
    )
    .min(1, "At least one hidden test case required"),
  startCode: z
    .array(
      z.object({
        language: z.enum(["cpp", "java", "javascript"]),
        initialCode: z.string().min(1, "Initial code is required"),
      })
    )
    .length(3, "All three languages required"),
  referenceSolution: z
    .array(
      z.object({
        language: z.enum(["cpp", "java", "javascript"]),
        completeCode: z.string().min(1, "Complete code is required"),
      })
    )
    .length(3, "All three languages required"),
});

function ProblemForm({ editMode = false, problemId }) {
  const [visibleExpanded, setVisibleExpanded] = useState(false);
  const [hiddenExpanded, setHiddenExpanded] = useState(false);
  const LANGUAGES = ["cpp", "java", "javascript"];
  const [activeTab, setActiveTab] = useState(0);
  const [loading, setLoading] = useState(editMode);
  const [submitting, setSubmitting] = useState(false);
  const dispatch = useDispatch();

  const {
    register,
    control,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(problemSchema),
    defaultValues: {
      startCode: [
        { language: "cpp", initialCode: "" },
        { language: "java", initialCode: "" },
        { language: "javascript", initialCode: "" },
      ],
      referenceSolution: [
        { language: "cpp", completeCode: "" },
        { language: "java", completeCode: "" },
        { language: "javascript", completeCode: "" },
      ],
    },
  });

  const {
    fields: visibleFields,
    append: appendVisible,
    remove: removeVisible,
  } = useFieldArray({
    control,
    name: "visibleTestCases",
  });

  const {
    fields: hiddenFields,
    append: appendHidden,
    remove: removeHidden,
  } = useFieldArray({
    control,
    name: "hiddenTestCases",
  });

  const LANG_DISPLAY = {
    cpp: "C++",
    java: "Java",
    javascript: "JavaScript",
  };

  useEffect(() => {
    const fetchProblem = async () => {
      const isEditing = editMode && problemId;
      if (!isEditing) return;

      try {
        setLoading(true);
        const res = await axiosClient.get(`/problem/${problemId}`);
        
        const problem = res.data.problem;
        const normalize = (arr, key) =>
          LANGUAGES.map(
            (lang) =>
              arr.find((item) => item.language === lang) || {
                language: lang,
                [key]: "",
              }
          );

        problem.startCode = normalize(problem.startCode, "initialCode");
        problem.referenceSolution = normalize(
          problem.referenceSolution,
          "completeCode"
        );

        reset(problem); // prefill the form
      } catch (err) {
        alert("Failed to load problem");
      } finally {
        setLoading(false);
      }
    };

    fetchProblem(); 
  }, [editMode, problemId, reset]);

  const onSubmit = async (data) => {
    setSubmitting(true);
    try {
      if (editMode && problemId) {
        await axiosClient.put(`/problem/${problemId}`, data);
        alert("Problem updated successfully!");
      } else {
        await axiosClient.post("/problem", data);
        alert("Problem created successfully!");
      }
      dispatch(setShowCreateModal(false));
    } catch (error) {
      alert(`Error: ${error.response?.data?.message || error.message}`);
    }finally {
    setSubmitting(false);
  }
  };

  const values = watch();

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 pb-2 relative z-10  text-black dark:text-white">
      <form
        onSubmit={handleSubmit(onSubmit, (errors) =>
          console.log("Errors", errors)
        )}
        className="space-y-8"
      >
        {/* Basic Information */}
        <div className="rounded-xl border-2 border-white/30 dark:border-white/10 p-4 shadow-sm">
          <h2 className="text-xl font-semibold mb-4">Basic Information</h2>
          <div className="space-y-4">
            <div className="form-control">
              <label className="label py-2 px-1">
                <span className="label-text">Problem Title</span>
              </label>
              <input
                {...register("title")}
                className={`input input-bordered bg-transparent h-15 w-full rounded-lg focus:border-primary-500 focus:ring-2 focus:ring-primary-200 ${
                  errors.title && "input-error"
                }`}
                placeholder="Enter a descriptive title for the problem"
              />
              {errors.title && (
                <span className="text-error">{errors.title.message}</span>
              )}
            </div>

            <div className="form-control">
              <label className="label  py-2 px-1">
                <span className="label-text">Description</span>
              </label>
              <textarea
                {...register("description")}
                className={`textarea textarea-bordered bg-transparent rounded-lg h-32 w-full resize-y focus:border-primary-500 focus:ring-2 focus:ring-primary-200 ${
                  errors.description && "textarea-error"
                }`}
                placeholder="Provide a detailed problem statement with examples and constraints"
              />
              {errors.description && (
                <span className="text-error">{errors.description.message}</span>
              )}
            </div>

            <div className="flex gap-4">
              <div className="form-control w-1/2 flex flex-col">
                <label className="label py-2 px-1">
                  <span className="label-text">Difficulty</span>
                </label>
                <select
                  {...register("difficulty")}
                  className={`select select-bordered  bg-transparent rounded-lg ${
                    errors.difficulty && "select-error"
                  }`}
                >
                  <option className="bg-neutral" value="easy">
                    Easy
                  </option>
                  <option className="bg-neutral" value="medium">
                    Medium
                  </option>
                  <option className="bg-neutral" value="hard">
                    Hard
                  </option>
                </select>
              </div>

              <div className="form-control w-1/2 flex flex-col">
                <label className="label py-2 px-1">
                  <span className="label-text">Problem Category</span>
                </label>
                <select
                  {...register("tags")}
                  className={`select select-bordered bg-transparent rounded-lg w-full ${
                    errors.tags && "select-error"
                  }`}
                >
                  <option className="bg-neutral" value="array">
                    Array
                  </option>
                  <option className="bg-neutral" value="string">
                    String
                  </option>
                  <option className="bg-neutral" value="linkedList">
                    Linked List
                  </option>
                  <option className="bg-neutral" value="graph">
                    Graph
                  </option>
                  <option className="bg-neutral" value="dp">
                    DP
                  </option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Test Cases */}
        <div className="card shadow-lg p-4 rounded-xl border-2 border-white/30">
          <h2 className="text-xl font-semibold mb-4">Test Cases</h2>

          {/* Visible Test Cases */}
          <div
            className={`space-y-3 border border-white/15 px-4 rounded-lg ${
              errors.visibleTestCases ? "mb-1" : "mb-6"
            }`}
          >
            <div className="flex justify-between items-center">
              <h3
                className="font-medium w-full py-4"
                onClick={() => setVisibleExpanded(!visibleExpanded)}
              >
                Visible Test Cases
              </h3>
              <button
                type="button"
                onClick={() => {
                  appendVisible({ input: "", output: "", explanation: "" });
                  setVisibleExpanded(true);
                }}
                className="btn btn-sm btn-primary flex items-center"
              >
                <Plus size={16} /> <span>Add Case</span>
              </button>
              <span className="ml-2">
                {visibleExpanded ? (
                  <ChevronUp size={20} />
                ) : (
                  <ChevronDown size={20} />
                )}
              </span>
            </div>
            <AnimatePresence>
              {visibleExpanded && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden"
                >
                  <div className="p-4">
                    {visibleFields.length === 0 ? (
                      <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-white/15 p-8">
                        <p className="mb-4 text-neutral-600">
                          No visible test cases added yet
                        </p>
                        <button
                          variant="primary"
                          size="sm"
                          onClick={() =>
                            appendVisible({
                              input: "",
                              output: "",
                              explanation: "",
                            })
                          }
                          className="flex items-center gap-2 btn btn-sm btn-soft btn-primary"
                        >
                          <Plus size={16} /> <span>Add First Test Case</span>
                        </button>
                      </div>
                    ) : (
                      <div className="space-y-6">
                        {visibleFields.map((field, index) => (
                          <motion.div
                            key={field.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.2 }}
                            className="relative rounded-lg border border-neutral-200 p-5 pt-10 shadow-sm"
                          >
                            <div className="absolute right-2 top-2 mr-2 flex items-center">
                              <span className="rounded-full bg-primary-100 px-2 py-1 text-xs font-medium text-primary-800">
                                Case {index + 1}
                              </span>
                              <button
                                size="sm"
                                variant="ghost"
                                className="h-6 w-6 text-red-500 mt-1 flex items-center justify-center rounded hover:bg-red-50 hover:text-red-600"
                                onClick={() => removeVisible(index)}
                              >
                                <Trash size={16} />
                              </button>
                            </div>

                            <div className="grid gap-4 md:grid-cols-2">
                              <div className="form-control flex flex-col gap-2">
                                <label className="label font-medium text-neutral-700">
                                  Input
                                </label>
                                <textarea
                                  {...register(
                                    `visibleTestCases.${index}.input`
                                  )}
                                  className={`textarea bg-transparent textarea-bordered h-24 font-mono w-full`}
                                  placeholder="Input for this test case"
                                />
                                {errors.visibleTestCases?.[index]?.input && (
                                  <p className="mt-1 text-sm text-error">
                                    {
                                      errors.visibleTestCases[index]?.input
                                        ?.message
                                    }
                                  </p>
                                )}
                              </div>

                              <div className="form-control flex flex-col gap-2">
                                <label className="label font-medium text-neutral-700">
                                  Expected Output
                                </label>
                                <textarea
                                  {...register(
                                    `visibleTestCases.${index}.output`
                                  )}
                                  className="textarea textarea-bordered h-24 font-mono w-full bg-transparent"
                                  placeholder="Expected output for this test case"
                                />
                                {errors.visibleTestCases?.[index]?.output && (
                                  <p className="mt-1 text-sm text-error">
                                    {
                                      errors.visibleTestCases[index]?.output
                                        ?.message
                                    }
                                  </p>
                                )}
                              </div>
                            </div>

                            <div className="mt-4 flex flex-col gap-2">
                              <label className="label font-medium text-neutral-700">
                                Explanation
                              </label>
                              <textarea
                                {...register(
                                  `visibleTestCases.${index}.explanation`
                                )}
                                className="textarea textarea-bordered w-full resize-y bg-transparent"
                                placeholder="Explain how the output is derived from the input"
                              />
                              {errors.visibleTestCases?.[index]
                                ?.explanation && (
                                <p className="mt-1 text-sm text-error">
                                  {
                                    errors.visibleTestCases[index]?.explanation
                                      ?.message
                                  }
                                </p>
                              )}
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    )}

                    {errors.visibleTestCases &&
                      !Array.isArray(errors.visibleTestCases) && (
                        <p className="mt-2 pl-1 text-sm text-error">
                          {errors.visibleTestCases.message}
                        </p>
                      )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          {errors.visibleTestCases &&
            !Array.isArray(errors.visibleTestCases) && (
              <p className="mb-2 pl-1 text-sm text-error">
                {errors.visibleTestCases.message}
              </p>
            )}

          {/* Hidden Test Cases */}
          <div className="space-y-4 border border-white/15 px-4 rounded-lg">
            <div className="flex justify-between items-center">
              <h3
                className="font-medium w-full py-4"
                onClick={() => setHiddenExpanded(!hiddenExpanded)}
              >
                Hidden Test Cases
              </h3>
              <button
                type="button"
                onClick={() => {
                  appendHidden({ input: "", output: "" });
                  setHiddenExpanded(true);
                }}
                className="btn btn-sm btn-primary flex items-center"
              >
                <Plus size={16} /> <span>Add Case</span>
              </button>
              <span className="ml-2">
                {hiddenExpanded ? (
                  <ChevronUp size={20} />
                ) : (
                  <ChevronDown size={20} />
                )}
              </span>
            </div>
            <AnimatePresence>
              {hiddenExpanded && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden"
                >
                  <div className="p-4">
                    {hiddenFields.length === 0 ? (
                      <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-white/15 p-8">
                        <p className="mb-4 text-neutral-600">
                          No hidden test cases added yet
                        </p>
                        <button
                          variant="primary"
                          size="sm"
                          onClick={() =>
                            appendHidden({ input: "", output: "" })
                          }
                          className="flex items-center gap-2 btn btn-sm btn-soft btn-primary"
                        >
                          <Plus size={16} /> <span>Add First Test Case</span>
                        </button>
                      </div>
                    ) : (
                      <div className="space-y-6">
                        {hiddenFields.map((field, index) => (
                          <motion.div
                            key={field.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.2 }}
                            className="relative rounded-lg border border-neutral-200 p-5 pt-10 shadow-sm"
                          >
                            <div className="absolute right-2 top-2 flex items-center mr-2 ">
                              <span className="rounded-full bg-secondary-100 px-2 py-1 text-xs font-medium text-secondary-800">
                                Case {index + 1}
                              </span>
                              <button
                                size="sm"
                                variant="ghost"
                                className="h-6 w-6 p-0 text-red-500 flex items-center justify-center rounded-md hover:bg-red-50 hover:text-red-600"
                                onClick={() => removeHidden(index)}
                              >
                                <Trash size={16} />
                              </button>
                            </div>

                            <div className="grid gap-4 md:grid-cols-2">
                              <div className="form-control flex flex-col gap-2">
                                <label className="label font-medium text-neutral-700">
                                  Input
                                </label>
                                <textarea
                                  {...register(
                                    `hiddenTestCases.${index}.input`
                                  )}
                                  className="textarea textarea-bordered h-24 font-mono w-full bg-transparent"
                                  placeholder="Input for this test case"
                                />
                                {errors.hiddenTestCases?.[index]?.input && (
                                  <p className="mt-1 text-sm text-error">
                                    {
                                      errors.hiddenTestCases[index]?.input
                                        ?.message
                                    }
                                  </p>
                                )}
                              </div>

                              <div className="form-control flex flex-col gap-2">
                                <label className="label font-medium text-neutral-700">
                                  Expected Output
                                </label>
                                <textarea
                                  {...register(
                                    `hiddenTestCases.${index}.output`
                                  )}
                                  className="textarea textarea-bordered h-24 font-mono w-full bg-transparent"
                                  placeholder="Expected output for this test case"
                                />
                                {errors.hiddenTestCases?.[index]?.output && (
                                  <p className="mt-1 text-sm text-error">
                                    {
                                      errors.hiddenTestCases[index]?.output
                                        ?.message
                                    }
                                  </p>
                                )}
                              </div>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {errors.hiddenTestCases && !Array.isArray(errors.hiddenTestCases) && (
            <p className="mt-2 pl-1 text-sm text-error">
              {errors.hiddenTestCases.message}
            </p>
          )}
        </div>

        {/* Code Templates */}
        <div className="border-2 border-white/30 p-4 rounded-xl">
          <div className="flex flex-col px-4">
            <h2 className="text-xl font-semibold mb-2">Code Templates</h2>
          </div>
          <div className=" overflow-x-auto whitespace-nowrap mb-3">
            <div className="flex space-x-2">
              {LANGUAGES.map((lang, index) => {
                const hasError =
                  errors.startCode?.[index]?.initialCode ||
                  errors.referenceSolution?.[index]?.completeCode;
                return (
                  <div
                    className={`flex relative flex-col items-center pt-4 ${
                      hasError && "animate-bounce"
                    } select-none cursor-pointer`}
                    key={lang}
                    onClick={() => setActiveTab(index)}
                  >
                    <button
                      type="button"
                      key={lang}
                      className={`px-6 py-2 font-medium ${
                        hasError && "pb-4 pt-1 border border-error"
                      } whitespace-nowrap  transition-colors  cursor-pointer rounded-md ${
                        activeTab === index
                          ? "bg-white border-b-2 border-blue-600 text-blue-600"
                          : "text-gray-500 hover:text-blue-600"
                      }`}
                    >
                      {LANG_DISPLAY[lang]}
                    </button>
                    {hasError && (
                      <p className="text-xs absolute bottom-0 pb-1 text-error font-semibold text-center ">
                        ! Required
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Mobile dropdown */}
          <div className="md:hidden mb-3">
            <select
              className="w-full p-2 rounded bg-white/10 outline-none"
              value={activeTab}
              onChange={(e) => setActiveTab(Number(e.target.value))}
            >
              {LANGUAGES.map((lang, idx) => (
                <option
                  key={lang}
                  value={idx}
                  className=" text-white bg-neutral/90"
                >
                  {LANG_DISPLAY[lang]}
                </option>
              ))}
            </select>
          </div>

          {/* Animate Tab Content */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="space-y-4"
            >
              {/* Initial Code */}
              <div className="form-control">
                <label className="label font-semibold ml-2 mb-1">
                  Initial Code
                </label>
                <pre className="border border-black/15 dark:border-white/15 p-4 rounded-lg">
                  <textarea
                    {...register(`startCode.${activeTab}.initialCode`)}
                    className="w-full bg-transparent font-mono resize-none focus:outline-none"
                    rows={6}
                    placeholder={`Enter ${LANGUAGES[activeTab]} initial code...`}
                  />
                </pre>
              </div>
              {errors.startCode?.[activeTab]?.initialCode && (
                <p className="mt-1 text-sm text-error">
                  {errors.startCode[activeTab]?.initialCode?.message}
                </p>
              )}

              {/* Reference Code */}
              <div className="form-control">
                <label className="label font-semibold ml-2 mb-1">
                  Reference Solution
                </label>
                <pre className="border border-black/15 dark:border-white/15 p-4 rounded-lg">
                  <textarea
                    {...register(`referenceSolution.${activeTab}.completeCode`)}
                    className="w-full bg-transparent font-mono resize-none focus:outline-none"
                    rows={6}
                    placeholder={`Enter ${LANGUAGES[activeTab]} reference solution...`}
                  />
                </pre>
              </div>
              {errors.referenceSolution?.[activeTab]?.completeCode && (
                <p className="mt-1 text-sm text-error">
                  {errors.referenceSolution[activeTab]?.completeCode?.message}
                </p>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        <button
  type="submit"
  className="btn btn-primary w-full"
  disabled={submitting}
>
  {submitting ? (
    <span className="loading loading-spinner loading-sm"></span>
  ) : editMode ? (
    "Update Problem"
  ) : (
    "Create Problem"
  )}
</button>

      </form>
    </div>
  );
}

export default ProblemForm;
