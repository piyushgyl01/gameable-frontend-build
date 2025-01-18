// Gui.jsx
import React, { useState } from "react";
import Nav from "../navbar/Nav";
import useFetch from "../useFetch";
import QuestForm from "./QuestForm";
import "bootstrap/dist/js/bootstrap.bundle.min.js"; // Make sure the modal's JS is available

export default function Gui() {
  const { data, error, loading, refetch } = useFetch(
    "https://gameable-backend.vercel.app/quests"
  );

  // For newly created quests
  const [newQuest, setNewQuest] = useState({
    title: "",
    generations: [{ num: 1, benchmarks: [""], logs: [""] }],
  });
  const [showAddForm, setShowAddForm] = useState(false);

  // For editing: which quest is selected, if any
  const [editQuest, setEditQuest] = useState(null);

  // Keep track of any quest IDs that are deleted so we don't render them
  const [deletedQuests, setDeletedQuests] = useState([]);

  // CREATE QUEST
  const handleAdd = async () => {
    try {
      await fetch("https://gameable-backend.vercel.app/quests", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newQuest),
      });
      setShowAddForm(false);
      // Reset newQuest state
      setNewQuest({
        title: "",
        generations: [{ num: 1, benchmarks: [""], logs: [""] }],
      });
      refetch();
    } catch (error) {
      console.error("Error adding quest:", error);
    }
  };

  // DELETE QUEST
  const handleDelete = async (id) => {
    try {
      await fetch(`https://gameable-backend.vercel.app/quests/${id}`, {
        method: "DELETE",
      });
      setDeletedQuests([...deletedQuests, id]);
      refetch();
    } catch (error) {
      console.error("Error deleting quest:", error);
    }
  };

  // EDIT QUEST (show modal)
  const handleEditClick = (quest) => {
    // Make a copy so we don't accidentally mutate original data
    const questCopy = JSON.parse(JSON.stringify(quest));
    setEditQuest(questCopy);
  };

  // UPDATE QUEST (when user saves)
  const handleUpdate = async () => {
    try {
      // 1) Perform your PUT request
      await fetch(
        `https://gameable-backend.vercel.app/quests/${editQuest._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(editQuest),
        }
      );

      // 2) Update local UI
      setEditQuest(null);
      refetch();

      // 3) Manually hide the modal
      const modalElement = document.getElementById("editModal");
      const modalInstance = window.bootstrap.Modal.getInstance(modalElement);
      if (modalInstance) {
        modalInstance.hide();
      }
    } catch (error) {
      console.error("Error updating quest:", error);
    }
  };

  return (
    <>
      <Nav />
      <main className="container my-5">
        {/* Toggle Add Form Button */}
        <button
          className="btn btn-primary mb-4"
          onClick={() => {
            setShowAddForm(!showAddForm);
            if (showAddForm) {
              // Reset newQuest if user closes the form
              setNewQuest({
                title: "",
                generations: [{ num: 1, benchmarks: [""], logs: [""] }],
              });
            }
          }}
        >
          {showAddForm ? "Cancel" : "Add Quest"}
        </button>

        {/* Add Quest Form (inline) */}
        {showAddForm && (
          <div className="mb-4">
            <QuestForm
              questData={newQuest}
              setQuestData={setNewQuest}
              onSubmit={handleAdd}
              submitButtonLabel="Create Quest"
              hideSubmitButton={false} // Show the "Create Quest" button
            />
          </div>
        )}

        {/* LIST OF QUESTS */}
        <div className="row">
          {data
            ?.filter((quest) => !deletedQuests.includes(quest._id))
            .map((quest) => (
              <div className="col-12 mb-4" key={quest._id}>
                <div className="card shadow-sm">
                  <div className="card-body">
                    <div className="d-flex justify-content-between align-items-center mb-4">
                      <h4 className="card-title mb-0">{quest.title}</h4>
                      <div>
                        {/* Edit Button => triggers the modal */}
                        <button
                          className="btn btn-outline-primary me-2"
                          data-bs-toggle="modal"
                          data-bs-target="#editModal"
                          onClick={() => handleEditClick(quest)}
                        >
                          Edit
                        </button>

                        {/* Delete Button */}
                        <button
                          onClick={() => handleDelete(quest._id)}
                          className="btn btn-outline-danger"
                        >
                          Delete
                        </button>
                      </div>
                    </div>

                    {/* GENERATIONS DISPLAY */}
                    {quest.generations.map((gen) => (
                      <div
                        key={gen.num}
                        className="mb-4 p-3 border rounded bg-light"
                      >
                        <h5 className="text-primary mb-3">
                          Generation {gen.num}
                        </h5>
                        <div className="mb-3">
                          <h6 className="text-muted">Benchmarks:</h6>
                          <ul className="list-group">
                            {gen.benchmarks.map((benchmark, idx) => (
                              <li key={idx} className="list-group-item">
                                {benchmark}
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div>
                          <h6 className="text-muted">Logs:</h6>
                          <ul className="list-group">
                            {gen.logs.map((log, idx) => (
                              <li key={idx} className="list-group-item">
                                {log}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
        </div>
      </main>

      {/* ===== EDIT MODAL ===== */}
      <div
        className="modal fade"
        id="editModal"
        tabIndex="-1"
        aria-labelledby="editModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-xl">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="editModalLabel">
                Edit Quest
              </h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
                onClick={() => setEditQuest(null)}
              ></button>
            </div>
            <div className="modal-body">
              {editQuest && (
                <QuestForm
                  questData={editQuest}
                  setQuestData={setEditQuest}
                  onSubmit={handleUpdate}
                  submitButtonLabel="Update Quest"
                  hideSubmitButton={true} // <--- Hide the form's own submit button
                />
              )}
            </div>
            <div className="modal-footer">
              {/* “Close” just closes the modal without saving */}
              <button
                type="button"
                className="btn btn-secondary"
                data-bs-dismiss="modal"
                onClick={() => setEditQuest(null)}
              >
                Close
              </button>
              {/* “Save Changes” triggers handleUpdate, which closes the modal after success */}
              <button
                type="button"
                className="btn btn-primary"
                onClick={handleUpdate}
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      </div>
      {/* ===== END EDIT MODAL ===== */}
    </>
  );
}
