import { useState } from "react";
import { useReactMediaRecorder } from "react-media-recorder";
import { api } from "../services/api";

function Recorder({ onCreated }) {
  const { status, startRecording, stopRecording, mediaBlobUrl } =
    useReactMediaRecorder({ audio: true });

  const isRecording = status === "recording";
  const [isUploading, setIsUploading] = useState(false);

  const handleUpload = async () => {
    console.log(mediaBlobUrl);
    if (!mediaBlobUrl) return;

    setIsUploading(true);
    const blob = await fetch(mediaBlobUrl).then((r) => r.blob());
    // console.log(blob);
    const form = new FormData();
    form.append("audio", blob, "note.webm");

    try {
      const res = await api.post("/notes", form, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (onCreated) {
        onCreated(res.data);
      }
    } catch (err) {
      console.error("Upload failed", err);
      alert("Failed to upload/transcribe audio");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="card" style={{ textAlign: "center" }}>
      <button
        className={`btn ${isRecording ? "gray" : "dark"} headerBtn`}
        onClick={isRecording ? stopRecording : startRecording}
        disabled={isUploading}
      >
        {isUploading
          ? "Transcribing…"
          : isRecording
          ? "Stop & Save"
          : "Start Recording"}
      </button>

      {isRecording === false && mediaBlobUrl && (
        <button
          onClick={handleUpload}
          className="btn dark headerBtn"
          style={{ marginTop: 8 }}
          disabled={isUploading}
        >
          {isUploading ? "Uploading…" : "Upload & Transcribe"}
        </button>
      )}

      <p className="small" style={{ marginTop: 8 }}>
        {isRecording
          ? "Recording…"
          : "Record a voice note; it will be transcribed automatically."}
      </p>

      {mediaBlobUrl && (
        <audio src={mediaBlobUrl} controls style={{ marginTop: 8 }} />
      )}
    </div>
  );
}

export default Recorder;
