import React from 'react'
import ComputerIcon from "@mui/icons-material/Computer";
import GroupsIcon from "@mui/icons-material/Groups";
import PersonIcon from "@mui/icons-material/Person";
import QuestionAnswerIcon from "@mui/icons-material/QuestionAnswer";

function index(props) {
  const formatExtraText = (extraText) => {
    const parts = extraText.split(" ");
    const value = parts[0];
    const remainingText = parts.slice(1).join(" ");

    const valueColor = {
      "+50": "text-blue-400",
      "+10": "text-emerald-400",
      "+100": "text-rose-400",
      "+20": "text-fuchsia-500",
    };

    return (
      <h3 className="text-sm">
        <span className={valueColor[value]}>
          {" "}
          <strong>{value}</strong>
        </span>{" "}
        <span className="text-gray-600">{remainingText}</span>
      </h3>
    );
  };

  let iconComponent;

  switch (props.icon) {
    case "computer":
      iconComponent = (
        <ComputerIcon className="text-white ml-4 mx-3 my-2" fontSize="large" />
      );
      break;
    case "people":
      iconComponent = (
        <GroupsIcon className="text-white ml-4 mx-3 my-2" fontSize="large" />
      );
      break;
    case "person":
      iconComponent = (
        <PersonIcon className="text-white ml-4 mx-3 my-2" fontSize="large" />
      );
      break;
    case "question":
      iconComponent = (
        <QuestionAnswerIcon className="text-white ml-4 mx-3 my-2" fontSize="large" />
      );
      break;

    default:
      iconComponent = (
        <QuestionAnswerIcon className="text-white ml-4 mx-3 my-2" fontSize="large" />
      );
      break;
  }

  return (
    <div className="relative bg-white shadow-lg rounded-xl p-5 mr-2 col-span-1">
      <div
        className={`absolute left-0.5rem mt-[-35px] ${props.bgColor} rounded-lg`}
      >
        <div className="p-3 w-[90px] h-[80px] shadow-lg rounded-lg">
          {iconComponent}
        </div>
      </div>
      <div className="flex items-center justify-end">
        <div className="text-right">
          <p className="text-gray-600 text-md">{props.text}</p>
          <h3 className="text-2xl">{props.storage}</h3>
        </div>
      </div>

      <hr className="my-4 border-t border-gray-300 mx-2" />
      <div className="flex">
        <a href="#pablo" className=" text-gray-500 ml-2">
          {formatExtraText(props.extraText)}
        </a>
      </div>
    </div>
  );
}

export default index;