import { useState } from "react";
import { useReactMediaRecorder } from "react-media-recorder";
import { api } from "../services/api";

function Recorder({ onCreated }) {
  const { status, startRecording, stopRecording, mediaBlobUrl } =
    useReactMediaRecorder({ audio: true });

  const isRecording = status === "recording";
  const [isUploading, setIsUploading] = useState(false);
  const [readyToUpload, setReadyToUpload] = useState(false);

  const handleStop = () => {
    stopRecording();
    setReadyToUpload(true);
  };

  const handleUpload = async () => {
    // console.log(mediaBlobUrl);
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

      setReadyToUpload(false);
    } catch (err) {
      console.error("Upload failed", err);
      alert("Failed to upload/transcribe audio");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="card" style={{ textAlign: "center" }}>
      {/* Start / Stop buttons */}
      {!isRecording && !readyToUpload && (
        <button
          className="btn dark headerBtn"
          onClick={startRecording}
          disabled={isUploading}
        >
          Start Recording
        </button>
      )}

      {isRecording && (
        <button
          className="btn gray headerBtn"
          onClick={handleStop}
          disabled={isUploading}
        >
          Stop & Save
        </button>
      )}

      {/* Upload button (only after recording is saved) */}
      {!isRecording && readyToUpload && mediaBlobUrl && (
        <div className="wrapper">
          <audio src={mediaBlobUrl} controls style={{ marginTop: 8 }} />
          <button
            onClick={handleUpload}
            className="btn dark headerBtn"
            style={{ marginTop: 8 }}
            disabled={isUploading}
          >
            {isUploading ? "Uploading…" : "Upload & Transcribe"}
          </button>
        </div>
      )}

      <p className="small" style={{ marginTop: 8 }}>
        {isRecording
          ? "Recording…"
          : readyToUpload
          ? "Review and upload your note."
          : "Record a voice note; it will be transcribed automatically."}
      </p>
    </div>
  );
}

export default Recorder;
