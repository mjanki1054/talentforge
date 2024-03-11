import React from "react";
import { FaUsers } from "react-icons/fa";
import { MdOutlineSubject, MdDashboard } from "react-icons/md";
import { BsFillPersonFill } from "react-icons/bs";
import ComputerIcon from "@mui/icons-material/Computer";
import QuestionAnswerIcon from "@mui/icons-material/QuestionAnswer";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import VideoCameraFrontIcon from "@mui/icons-material/VideoCameraFront";
import SettingsSuggestIcon from "@mui/icons-material/SettingsSuggest";
import LogoutIcon from "@mui/icons-material/Logout";
import { NavLink, useLocation,useNavigate} from "react-router-dom";

import "../css/sidebar.css";

const Leftbar = () => {
    const location = useLocation();
    let navigate=useNavigate();

    return (
        <div className="flex h-screen">
            <div className="sidebar sm:w-[192px]">
                <ul className="list-none">
                    <li
                        className={`my-px flex items-center py-2 px-5 ${location.pathname === "/admin/home"
                            ? "bg-blue-500 text-white"
                            : ""
                            }`}
                    >
                        <MdDashboard className="w-5 h-5 mr-4" />

                        <NavLink to="/admin/home">Dashboard</NavLink>
                    </li>

                    <li
                        className={`my-px flex items-center py-2 px-5 ${location.pathname.startsWith('/candidate/')
                            ? 'bg-blue-500 text-white'
                            : ''
                            }`}
                    >
                        <BsFillPersonFill className="w-5 h-5 mr-4" />
                        <NavLink to="/candidate/add">Candidate</NavLink>
                    </li>

                    <li
                        className={`my-px flex items-center py-2 px-5 ${location.pathname.startsWith('/group/')
                            ? "bg-blue-500 text-white"
                            : ""
                            }`}
                    >
                        <FaUsers className="w-5 h-5 mr-4" />

                        <NavLink to="/group/add">Group</NavLink>
                    </li>
                    <li
                        className={`my-px flex items-center py-2 px-5  ${location.pathname.startsWith('/subject/')
                            ? "bg-blue-500 text-white"
                            : ""
                            }`}
                    >
                        <MdOutlineSubject className="w-5 h-5 mr-4" />

                        <NavLink to="/subject/add">Subject</NavLink>
                    </li>

                    <li
                        className={`my-px flex items-center py-2 px-5  ${location.pathname.startsWith('/questionset/') ||location.pathname.startsWith('/form')
                        ||location.pathname.startsWith('/questionset/view/')
                            ? "bg-blue-500 text-white"
                            : ""
                            }`}
                    >
                        <QuestionAnswerIcon className="w-5 h-5 mr-3" />

                        <NavLink to="/questionset/add">Question</NavLink>
                    </li>

                    <li
                        className={`my-px flex items-center py-2 px-5 ${location.pathname.startsWith('/exam/')
                            ? "bg-blue-500 text-white"
                            : ""
                            }`}
                    >
                        <ComputerIcon className="w-5 h-5 mr-3" />

                        <NavLink to="/exam/add">Exam</NavLink>
                    </li>
                    <li className={`my-px flex items-center py-2 px-5  ${location.pathname.startsWith('/results/')
                        ? "bg-blue-500 text-white"
                        : ""
                        }`}>
                        <ReceiptLongIcon className="w-5 h-5 mr-3" />

                        <NavLink to="/results/">Results</NavLink>
                    </li>

                    <li className={`my-px flex items-center py-2 px-5  ${location.pathname.startsWith('/examproctoring/')
                        ? "bg-blue-500 text-white"
                        : ""
                        }`} >
                        <VideoCameraFrontIcon className="w-5 h-5 mr-3" />

                        <span>Exam Proctoring</span>
                    </li>

                    <li
                        className={`my-px flex items-center py-2 px-5  ${location.pathname.startsWith('/setting/') ? "bg-blue-500 text-white" : ""
                            }`}
                    >
                        <SettingsSuggestIcon className="w-5 h-5 mr-3" />

                        <NavLink to="/setting/">Setting</NavLink>
                    </li>

                    
                </ul>
            </div>
        </div>
    );
};

export default Leftbar;