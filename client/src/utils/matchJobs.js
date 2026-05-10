export const extractSkillsFromResume = () => {
  /*
    FAKE AI EXTRACTION
    Later backend will do real parsing
  */

  return [
    "React",
    "Next.js",
    "Tailwind",
    "JavaScript",
    "Spring Boot",
  ];
};

export const calculateMatchScore = (
  resumeSkills,
  jobSkills
) => {

  const matchedSkills = jobSkills.filter((skill) =>
    resumeSkills.includes(skill)
  );

  const score = Math.round(
    (matchedSkills.length / jobSkills.length) * 100
  );

  return {
    score,
    matchedSkills,
    missingSkills: jobSkills.filter(
      (skill) => !resumeSkills.includes(skill)
    ),
  };
};