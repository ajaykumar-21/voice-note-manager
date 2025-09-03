import React, { useEffect, useState } from "react";
import { api } from "../services/api";
import Recorder from "../components/Recorder";

function Home() {
  const [notes, setNotes] = useState([]);

  useEffect(() => {
    const loadingNotes = async () => {
      try {
        const res = await api.get("/notes");
        // console.log(res.data);
        setNotes(res.data);
      } catch (error) {
        console.error("Failed to load notes", error);
        alert("Failed to load notes");
      }
    };
    loadingNotes();
  }, []);

  // add newly created note to list (from Recorder)
  const handleCreated = (note) => setNotes((prev) => [note, ...prev]);

  return (
    <div className="container">
      <h1 className="h1">Voice Notes</h1>
      <Recorder onCreated={handleCreated} />
    </div>
  );
}

export default Home;
