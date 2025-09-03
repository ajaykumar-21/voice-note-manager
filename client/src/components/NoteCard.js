import { useState, useEffect } from "react";
import { api } from "../services/api";

export default function NoteCard({ note, onChange, onDelete }) {
  const [text, setText] = useState(note.transcript || "");
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [summarizing, setSummarizing] = useState(false);

  // initialize transcript when switching notes
  useEffect(() => {
    setText(note.transcript || "");
    setIsEditing(false); // reset edit mode when note changes
  }, [note]);

  // detect if user edited transcript
  const edited = text !== (note.transcript || "");

  const handleSave = async () => {
    if (!edited) {
      setIsEditing(false);
      return;
    }
    setSaving(true);
    try {
      const res = await api.put(`/notes/${note._id}`, { transcript: text });
      onChange?.(res.data); 
      setIsEditing(false); 
    } catch (err) {
      console.error("Save failed", err);
      alert("Save failed");
    } finally {
      setSaving(false);
    }
  };

  const handleSummarize = async () => {
    setSummarizing(true);
    try {
      const res = await api.post(`/notes/${note._id}/summary`);
      onChange?.(res.data);
    } catch (err) {
      console.error("Summarize failed", err);
      const msg = err?.response?.data?.error || "Summarize failed";
      alert(msg);
    } finally {
      setSummarizing(false);
    }
  };

  const summaryDisabled = !!note.summary && !edited;

  return (
    <div className="card">
      {isEditing ? (
        <textarea
          className="textarea"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Transcript..."
        />
      ) : (
        <div>
          {note.summary && (
            <div className="summary">
              <strong>Summary</strong>
              <div style={{ marginTop: 6 }}>{note.summary}</div>
            </div>
          )}
        </div>
      )}

      <div className="row" style={{ marginTop: 12 }}>
        {isEditing ? (
          <button className="btn gray" onClick={handleSave} disabled={saving}>
            {saving ? "Saving…" : "Save"}
          </button>
        ) : (
          <button className="btn gray" onClick={() => setIsEditing(true)}>
            Edit
          </button>
        )}

        <button className="btn gray" onClick={() => onDelete?.(note._id)}>
          Delete
        </button>

        {!isEditing && (
          <button
            className={`btn dark ${summaryDisabled ? "disabled" : ""}`}
            onClick={handleSummarize}
            disabled={summaryDisabled || summarizing}
          >
            {summarizing ? "Generating…" : "Generate Summary"}
          </button>
        )}
      </div>
    </div>
  );
}
