import React, { useState } from "react";
import { NavLink } from "react-router-dom";

const Instruction = () => {
  const [isChecked, setIsChecked] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleStartExam = () => {
    if (!isChecked) {
      setErrorMessage("Please select the checkbox.");
    } else {
      setErrorMessage("");
      // Navigate to "/exam" when the checkbox is selected
      window.location.href = "/exam";
    }
  };

  const handleCheckboxChange = () => {
    setIsChecked(!isChecked);
    if (errorMessage) {
      setErrorMessage("");
    }
  };

  return (
      <div className="h-screen overflow-auto ">
      <div className=" border-2 border-gray-100 shadow-lg mt-5 ml-5 mr-5 ">
        <h1 className="font-bold">Exam Instructions:</h1>

        <ol className="list-decimal pl-6">
        <li>The duration of this exam is 60 minutes.</li>
        <li>
          Allow adequate time to complete this exam in one sitting before the
          due date and time. Late submission may not be accepted.
        </li>
        <li>
          There are 20 questions in this exam and they will be presented one at
          a time.
        </li>
        <li>Each question is worth the same/different marks.</li>
        <li>You can review and change answers before the quiz finishes.</li>
        <li>The result will be declared at the end of the quiz.</li>
      </ol>

      <h1 className="font-bold">Examination Conduct:</h1>

      <ol className="list-decimal pl-6">
        <li>
          You are not permitted to have on your desk or on your person any
          unauthorized material during this examination. This includes but is
          not limited to:
          <ul className="list-disc pl-6">
            <li>Mobile phones</li>
            <li>Smart watches and bands</li>
            <li>
              Electronic devices (including additional monitors, earphones,
              headphones, etc.)
            </li>
            <li>Headwear (hats, hoodies including religious headwear)</li>
            <li>Draft paper (unless permitted)</li>
            <li>Textbooks (unless specified)</li>
            <li>Notes (unless specified)</li>
          </ul>
        </li>
        <li>
          You are not permitted to leave your seat during the exam. Please
          ensure you use the toilet before the exam starts if necessary.
        </li>
        <li>
          You will need to be in a quiet space for the duration of your exam
          with no interruptions.
        </li>
        <li>
          You will need to check all your equipment to ensure that they are set
          up correctly.
        </li>
        <li>
          You must only attempt this exam once. Any additional attempts should
          only be used in the event where a serious technical issue has occurred
          and supporting evidence supporting this will be required.
        </li>
        <li>
          You are not permitted to obtain assistance by improper means or ask
          for help from or give help to any other person.
        </li>
        <li>
          You are not permitted to take screenshots, record the screen, copy and
          paste question or answer, or otherwise attempt to take any of the
          content of this exam out of the exam for any purpose.
        </li>
        <li className="font-bold">
          If you try to open any new tab or leave the exam tab, you will be
          terminated.
        </li>
        <li>
          Misconduct action will be taken against you if you breach company
          rules.
        </li>
      </ol>

      <div className="my-5 flex justify-center items-center">
        <input
          type="checkbox"
          id="checkbox"
          className="mr-2"
          checked={isChecked}
          onChange={handleCheckboxChange}
        />
        <label htmlFor="checkbox" className="font-bold">
          I agree to the terms and conditions
        </label>
      </div>

      {errorMessage && (
        <p className="text-red-500 text-center mb-4">{errorMessage}</p>
      )}

      <div className=" my-5 flex justify-center">
        <button
          type="submit"
           className="w-full md:w-1/2 font-bold py-2 text-white bg-blue-600 rounded-md hover:bg-blue-00"
            onClick={handleStartExam}
        >
          Start Exam
        </button>
      </div>
    </div>
</div>
  );
};

export default Instruction;
