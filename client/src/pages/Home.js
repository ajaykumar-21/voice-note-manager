import { useEffect, useState } from "react";
import { api } from "../services/api";
import Recorder from "../components/Recorder";

function Home() {
  const [notes, setNotes] = useState([]);

  useEffect(() => {
    const getNotes = async () => {
      try {
        const res = await api.get("/notes");
        // console.log(res.data);
        setNotes(res.data);
      } catch (error) {
        console.error("Failed to load notes", error);
        alert("Failed to load notes");
      }
    };
    getNotes();
  }, []);

  // add newly created note to list
  const handleCreated = (note) => {
    setNotes((prev) => [note, ...prev]);
  };

  // update a single note
  const handleUpdate = (updated) => {
    const updatedNote = notes.map((note) =>
      note._id === updated._id ? updated : note
    );
    setNotes(updatedNote);
  };

  // delete a note
  const handleDelete = async (id) => {
    try {
      await api.delete(`/notes/${id}`);

      const deleteNote = notes.filter((note) => note._id !== id);
      setNotes(deleteNote);
    } catch (err) {
      console.error("Delete failed", err);
      alert("Delete failed");
    }
  };

  return (
    <div className="container">
      <h1 className="h1">Voice Notes</h1>
      <Recorder onCreated={handleCreated} />
    </div>
  );
}

export default Home;
