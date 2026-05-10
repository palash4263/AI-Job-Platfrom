import { useDropzone } from "react-dropzone";
import { FaCheckCircle, FaCloudUploadAlt, FaFilePdf } from "react-icons/fa";

const ResumeUpload = ({ uploadedResume, setUploadedResume }) => {
  const onDrop = (acceptedFiles) => {
    const file = acceptedFiles[0];

    if (file) {
      setUploadedResume(file);
    }
  };

  const { getInputProps, getRootProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "application/pdf": [".pdf"],
    },
  });

  return (
    <section className="rounded-2xl border border-white/10 bg-[#0a1728] p-5">
      <div
        {...getRootProps()}
        className={`grid min-h-56 cursor-pointer place-items-center rounded-xl border border-dashed p-6 text-center transition ${
          isDragActive
            ? "border-emerald-300 bg-emerald-400/10"
            : "border-white/15 bg-white/[0.035] hover:border-emerald-300/60 hover:bg-emerald-400/[0.06]"
        }`}
      >
        <input {...getInputProps()} />

        <div>
          <div className="mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-emerald-400 text-2xl text-slate-950">
            <FaCloudUploadAlt />
          </div>
          <h3 className="mt-5 text-xl font-black text-white">
            Drop your resume here
          </h3>
          <p className="mt-2 max-w-md text-sm leading-6 text-slate-400">
            Upload a PDF resume to extract skills, score the profile, and match
            jobs automatically.
          </p>
          <button
            className="mt-5 rounded-xl bg-white px-5 py-3 text-sm font-black text-slate-950 transition hover:bg-emerald-300"
            type="button"
          >
            Choose PDF
          </button>
        </div>
      </div>

      {uploadedResume && (
        <div className="mt-4 flex items-center gap-3 rounded-xl border border-emerald-300/20 bg-emerald-400/10 p-4">
          <FaFilePdf className="text-2xl text-emerald-300" />
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-bold text-white">
              {uploadedResume.name}
            </p>
            <p className="text-xs text-slate-400">Ready for analysis</p>
          </div>
          <FaCheckCircle className="text-emerald-300" />
        </div>
      )}
    </section>
  );
};

export default ResumeUpload;
