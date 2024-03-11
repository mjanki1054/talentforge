import { NavLink, useParams, useNavigate } from "react-router-dom";
import { ViewListIcon } from "@heroicons/react/solid";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";

function ManualQues() {
    const token = localStorage.getItem("token");
    const { id } = useParams();
    const navigate = useNavigate();

    const handleFormSubmit = async () => {
        try {
            const questions = [
                {
                    question: document.getElementById("question").value,
                    options: [
                        `A. ${document.getElementById("a").value}`,
                        `B. ${document.getElementById("b").value}`,
                        `C. ${document.getElementById("c").value}`,
                        `D. ${document.getElementById("d").value}`,
                    ],
                    correctAnswer: document.getElementById("correctAnswer").value,
                },
                // Add more question objects as needed
            ];

            const data = {
                questions,
            };

            const response = await axios.post(
                `http://localhost:5000/api/v1/questioncreate/${id}`,
                data,
                {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            toast.success("Added Questions successfully!", {
                position: toast.POSITION.TOP_CENTER, // Position the toast at the top center of the screen
                autoClose: 2000, // Automatically close the toast after 3000 milliseconds (3 seconds)
                className: "mt-10",
            });
            setTimeout(() => {
                navigate("/questionset/add");
            }, 3000);
            console.log(response.data, "apt.js"); // You can handle the response as per your requirements
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <>
            <ToastContainer />
            <div className=" mt-5 w-full px-10 overflow-hidden">
                <div className="flex relative justify-between items-center mb-2">
                    <NavLink to="/questionset/add" className="m-2 font-bold items-center">
                        Add Question
                    </NavLink>
                    <NavLink to="/questionset/add">
                        <button className="flex items-center text-white bg-blue-600 px-2 rounded-md">
                            <ViewListIcon className="h-5 w-5" />
                            <h1 className="font-bold ml-2 py-1">LIST</h1>
                        </button>
                    </NavLink>
                </div>
                <form className=" border border-blue-300 shadow-lg px-10 rounded-xl">
                    <div className="mb-2">
                        <label htmlFor="question" className="block mb-1 font-medium mt-1">
                            Question
                        </label>
                        {/* <input type='text' id='question' name='question' className=" w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-500">
              </input> */}
                        <textarea
                            id="question"
                            name="question"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-500"
                        />
                    </div>
                    <h1>Options</h1>
                    <div className="flex">
                        <div className="mb-2 w-1/2 mr-2">
                            <span className="flex items-center">
                                <label htmlFor="a" className="block my-1 font-medium ml-2">
                                    A.
                                </label>
                            </span>
                            <textarea
                                id="a"
                                name="a"
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-500"
                            />
                        </div>
                        <div className="mb-2 w-1/2 mr-2">
                            <span className="flex items-center">
                                <label htmlFor="b" className="block my-1 font-medium ml-2">
                                    B.
                                </label>
                            </span>
                            <textarea
                                id="b"
                                name="b"
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-500"
                            />
                        </div>
                    </div>
                    <div className="flex">
                        <div className="mb-2 w-1/2 mr-2">
                            <span className="flex items-center">
                                <label htmlFor="c" className="block my-1 font-medium ml-2">
                                    C.
                                </label>
                            </span>
                            <textarea
                                id="c"
                                name="c"
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-500"
                            />
                        </div>
                        <div className="mb-2 w-1/2 mr-2">
                            <span className="flex items-center">
                                <label htmlFor="d" className="block my-1 font-medium ml-2">
                                    D.
                                </label>
                            </span>
                            <textarea
                                id="d"
                                name="d"
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-500"
                            />
                        </div>
                    </div>
                    <div className="mb-2">
                        <label htmlFor="correctAnswer" className="block mb-1 font-medium">
                            Correct Answer
                        </label>
                        <textarea
                            id="correctAnswer"
                            name="correctAnswer"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-500"
                        />
                    </div>
                    <div className="my-4 pb-10">
                        <button
                            onClick={handleFormSubmit}
                            type="button"
                            className="w-full font-bold px-4 py-2 text-white bg-blue-700 rounded-md hover:bg-blue-600"
                        >
                            SUBMIT
                        </button>
                    </div>
                </form>
            </div>
        </>
    );
}

export default ManualQues;