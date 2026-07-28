export default function AtsScoreCard({ atsData }) {

  if (!atsData) return null;

  return (
    <div className="db-panel" style={{ padding: "25px" }}>

      <h2
        style={{
          color: "#00f5ff",
          marginBottom: "20px",
          fontFamily: "Orbitron"
        }}
      >
        ATS ANALYZER
      </h2>

      <div
        style={{
          display: "flex",
          gap: "30px",
          flexWrap: "wrap"
        }}
      >

        <div>
          <h1
            style={{
              color: "#00ff88",
              fontSize: "48px"
            }}
          >
            {atsData.atsScore}
          </h1>

          <p>ATS SCORE</p>
        </div>

        <div style={{ flex: 1 }}>

          <div>
            Keyword Match :
            {atsData.keywordScore}%
          </div>

          <div>
            Formatting :
            {atsData.formattingScore}%
          </div>

          <div>
            Experience :
            {atsData.experienceScore}%
          </div>

          <div>
            Education :
            {atsData.educationScore}%
          </div>

        </div>

      </div>

    </div>
  );
}