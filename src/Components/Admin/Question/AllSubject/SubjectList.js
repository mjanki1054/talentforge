import React, { useState, useEffect } from "react";
import { NavLink, useParams } from "react-router-dom";

const SubjectList = () => {
  const [subjects, setSubjects] = useState([]);
  const params = useParams();
  const questionSetId = params?.id;

  useEffect(() => {
    fetchSubjects();
  }, []);

  const fetchSubjects = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/v1/questionset");
      const data = await response.json();
      console.log(data, "line no 82");

      // Find the question set object that matches the selected questionSetId
      const selectedQuestionSet = data.find((questionSet) => questionSet._id === questionSetId);
      if (!selectedQuestionSet) {
        console.log("Question set not found");
        return;
      }

      // Extract the subject names from the selected question set and store them in an array
      const subjectNames = selectedQuestionSet.subject.map((subject) => subject.subjectName);
      // Extract the corresponding question numbers from the selected question set and store them in an array
      const questionNumbers = selectedQuestionSet.questionNo;
      // Create an array of objects combining subject name and question number
      const subjectData = subjectNames.map((subject, index) => ({
        name: subject,
        questionNo: questionNumbers[index],
      }));
      // Set the subjects state with the array of subject data
      setSubjects(subjectData);
    } catch (error) {
      console.log("Error fetching subjects:", error);
    }
  };

  return (
    <>
      <div className="container mx-auto px-40 pt-12">
        <h1 className="m-2 font-bold items-center">Subjects</h1>
        {subjects.map((subject) => {
          console.log("subjectName:", subject.name);
          console.log("questionNumber:", subject.questionNo);

          return (
            <NavLink
              key={subject.name}
              to={{
                pathname: `/questionset/subject/${subject.name}/${questionSetId}`,
                state: { subjectName: subject.name, questionNumber: subject.questionNo },
              }}
            >
              <div className="mt-4">
                <button className="w-full font-bold items-center border shadow-lg p-2 rounded-md hover:bg-blue-100">
                  {subject.name} (Total Questions: {subject.questionNo})
                </button>
              </div>
            </NavLink>
          );
        })}

      </div>
    </>
  );
};

export default SubjectList;
