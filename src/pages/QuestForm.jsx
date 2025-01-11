// QuestForm.jsx
import React from "react";

export default function QuestForm({
  questData,
  setQuestData,
  onSubmit,
  submitButtonLabel,
  hideSubmitButton = false, // <-- Default: false
}) {
  return (
    <div className="card p-3 mb-4">
      <h5>
        {submitButtonLabel === "Create Quest" ? "Add New Quest" : "Edit Quest"}
      </h5>

      {/* Title */}
      <div className="mb-3">
        <label className="form-label">Title:</label>
        <input
          type="text"
          className="form-control"
          value={questData.title}
          onChange={(e) =>
            setQuestData({ ...questData, title: e.target.value })
          }
        />
      </div>

      {/* Generations */}
      {questData.generations.map((gen, genIndex) => (
        <div key={genIndex} className="mb-3 p-3 border rounded">
          <div className="d-flex justify-content-between align-items-center mb-2">
            {/* Generation Number */}
            <div className="d-flex align-items-center">
              <label className="me-2">Generation #</label>
              <input
                type="number"
                className="form-control w-auto"
                value={gen.num}
                onChange={(e) => {
                  const newGenerations = [...questData.generations];
                  newGenerations[genIndex].num = parseInt(e.target.value, 10);
                  setQuestData({ ...questData, generations: newGenerations });
                }}
              />
            </div>

            {/* Remove the entire generation */}
            <button
              className="btn btn-danger"
              onClick={() => {
                const newGenerations = questData.generations.filter(
                  (_, i) => i !== genIndex
                );
                setQuestData({ ...questData, generations: newGenerations });
              }}
            >
              Remove Generation
            </button>
          </div>

          {/* Benchmarks */}
          <div className="mb-3">
            <label className="form-label">Benchmarks:</label>
            {gen.benchmarks.map((benchmark, bIndex) => (
              <div key={bIndex} className="d-flex mb-2">
                <input
                  className="form-control"
                  value={benchmark}
                  onChange={(e) => {
                    const newGenerations = [...questData.generations];
                    newGenerations[genIndex].benchmarks[bIndex] =
                      e.target.value;
                    setQuestData({ ...questData, generations: newGenerations });
                  }}
                />
                {/* Add Benchmark */}
                <button
                  className="btn btn-outline-primary ms-2"
                  onClick={() => {
                    const newGenerations = [...questData.generations];
                    newGenerations[genIndex].benchmarks.push("");
                    setQuestData({ ...questData, generations: newGenerations });
                  }}
                >
                  +
                </button>
                {/* Remove Benchmark */}
                <button
                  className="btn btn-outline-danger ms-2"
                  onClick={() => {
                    const newGenerations = [...questData.generations];
                    newGenerations[genIndex].benchmarks =
                      newGenerations[genIndex].benchmarks.filter(
                        (_, i) => i !== bIndex
                      );
                    setQuestData({ ...questData, generations: newGenerations });
                  }}
                >
                  -
                </button>
              </div>
            ))}
          </div>

          {/* Logs */}
          <div className="mb-3">
            <label className="form-label">Logs:</label>
            {gen.logs.map((log, lIndex) => (
              <div key={lIndex} className="d-flex mb-2">
                <input
                  className="form-control"
                  value={log}
                  onChange={(e) => {
                    const newGenerations = [...questData.generations];
                    newGenerations[genIndex].logs[lIndex] = e.target.value;
                    setQuestData({
                      ...questData,
                      generations: newGenerations,
                    });
                  }}
                />
                {/* Add Log */}
                <button
                  className="btn btn-outline-primary ms-2"
                  onClick={() => {
                    const newGenerations = [...questData.generations];
                    newGenerations[genIndex].logs.push("");
                    setQuestData({
                      ...questData,
                      generations: newGenerations,
                    });
                  }}
                >
                  +
                </button>
                {/* Remove Log */}
                <button
                  className="btn btn-outline-danger ms-2"
                  onClick={() => {
                    const newGenerations = [...questData.generations];
                    newGenerations[genIndex].logs =
                      newGenerations[genIndex].logs.filter(
                        (_, i) => i !== lIndex
                      );
                    setQuestData({
                      ...questData,
                      generations: newGenerations,
                    });
                  }}
                >
                  -
                </button>
              </div>
            ))}
          </div>
        </div>
      ))}

      {/* Add Generation */}
      <button
        className="btn btn-outline-secondary mb-3"
        onClick={() => {
          const newGenerations = [...questData.generations];
          newGenerations.push({
            num: newGenerations.length + 1,
            benchmarks: [""],
            logs: [""],
          });
          setQuestData({ ...questData, generations: newGenerations });
        }}
      >
        Add Generation
      </button>

      {/*
        Hide the form's "submit" button if `hideSubmitButton = true`.
        This is useful when editing in a modal (you only want "Save Changes" in the modal footer).
      */}
      {!hideSubmitButton && (
        <button className="btn btn-primary" onClick={onSubmit}>
          {submitButtonLabel}
        </button>
      )}
    </div>
  );
}
