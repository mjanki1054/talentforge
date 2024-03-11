import React, { useState, useEffect, useRef } from "react";
import { XIcon } from "@heroicons/react/solid";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import ListGroup from "./ListGroup";
import TaskAltSharpIcon from '@mui/icons-material/TaskAltSharp';
const initialValue = {
    groupname: "",
    numbers: "",
    candidates: [],
};

function AddGroup() {
    const [group, setGroup] = useState(initialValue);
    const [groups, setGroups] = useState([]);
    const [total, setTotal] = useState("");
    const [selectedCandidateNames, setSelectedCandidateNames] = useState([]);
    const [selected, setSelected] = useState([]);
    const [showPopup, setShowPopup] = useState(false);
    const [candidates, setCandidates] = useState([]);
    const [errors, setErrors] = useState({});
    const [status, setStatus] = useState();
    const [showMessage, setShowMessage] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const numbersInputRef = useRef(null);

    useEffect(() => {
        const handleScroll = (event) => {
            const { name } = event.target;

            if (name === "numbers") {
                event.preventDefault(); // Prevent scrolling behavior
            }
        };

        // Attach the scroll event listener to the numbers input field
        const numbersInput = numbersInputRef.current;
        numbersInput.addEventListener("wheel", handleScroll);

        // Clean up the event listener when the component unmounts
        return () => {
            numbersInput.removeEventListener("wheel", handleScroll);
        };
    }, []);

    const { groupname, numbers } = group;
    let navigate = useNavigate();

    const onValueChange = (e) => {
        if (e.target.name === 'groupname') {
            let value = e.target.value;
            value = value
                .replace(/[^0-9a-zA-Z-]/g, '') // Remove any characters other than alphanumeric and hyphen
                .toUpperCase(); // Convert to uppercase

            const isValidFormat = /^20\d{0,3}-NC-(?:JAN|FEB|MAR|APR|MAY|JUN|JUL|AUG|SEP|OCT|NOV|DEC)-G\d+$/;
            const isValid = isValidFormat.test(value);

            setGroup({ ...group, [e.target.name]: value });

            if (value.trim() === '') {
                setErrors({ ...errors, groupname: '' });
            } else if (!isValid) {
                setErrors({ ...errors, groupname: "Group name should be in the format '2023-NC-JUN-G1'" });
            } else {
                setErrors({ ...errors, groupname: '' });
            }
        } else {
            setGroup({ ...group, [e.target.name]: e.target.value });
        }

        if (e.target.name === 'numbers') {
            let value = e.target.value.replace(/\D/g, ''); // Remove any non-digit characters

            if (value === '' || parseInt(value) <= 0) {
                value = '';
            }

            setGroup({ ...group, [e.target.name]: value });
            setTotal(value);

            if (value.trim() === '') {
                setErrors({ ...errors, numbers: '' });
            } else if (parseInt(value) <= 0) {
                setErrors({ ...errors, numbers: 'Total number of candidates must be a positive number.' });
            } else {
                setErrors({ ...errors, numbers: '' });
            }
        } else {
            setGroup({ ...group, [e.target.name]: e.target.value });
        }
    };
    const handleCheckboxChange = (e) => {
        const candidateId = e.target.value;
        const isChecked = e.target.checked;

        if (isChecked) {
            setSelected((prevSelected) => [...prevSelected, candidateId]);
            setSelectedCandidateNames((prevSelected) => [
                ...prevSelected,
                candidates.find((candidate) => candidate._id === candidateId)?.name || "",
            ]);
        } else {
            setSelected((prevSelected) =>
                prevSelected.filter((candidate) => candidate !== candidateId)
            );
            setSelectedCandidateNames((prevSelected) =>
                prevSelected.filter((name) => name !== candidates.find((candidate) => candidate._id === candidateId)?.name)
            );
        }
    };


    const handleClose = () => {
        setSelected([]);
        setSelectedCandidateNames([]);
        setShowPopup(false);
    };

    // added cross functionality in the candidates name
    const handleRemoveCandidate = (index) => {
        setSelectedCandidateNames((prevSelected) => {
            const newSelected = [...prevSelected];
            newSelected.splice(index, 1);
            return newSelected;
        });

        setSelected((prevSelected) => {
            const newSelected = [...prevSelected];
            newSelected.splice(index, 1);
            return newSelected;
        });
    };



    const handleSubmit = async () => {
        if (selected.length === parseInt(total)) {
            const selectedCandidateIds = selected.map((candidateId) => candidates.find((candidate) => candidate._id === candidateId)._id);

            // Check if any of the selected candidates are already present in other groups
            const response = await axios.get("http://localhost:5000/api/v1/groups");
            const groups = response.data.groups;
            const duplicateCandidates = groups.some((group) =>
                group.candidates.some((candidateId) => selectedCandidateIds.includes(candidateId))
            );

            if (duplicateCandidates) {
                alert("Some of the selected candidates are already present in other groups. Please select different candidates.");
                return;
            }

            setGroup({ ...group, candidates: selected });
            setSelectedCandidateNames(
                selected.map((candidateId) => {
                    const candidate = candidates.find(
                        (candidate) => candidate._id === candidateId
                    );
                    return candidate ? candidate.name : "";
                })
            );
            setShowPopup(false);
        } else {
            alert("Please select the correct number of candidates.");
        }
    };

    const togglePopup = async () => {
        try {
            const response = await axios.get("http://localhost:5000/api/v1/users");
            const fetchedCandidates = response.data.normalUsers;

            console.log("API Response:", response.data); // Log the API response for debugging

            if (Array.isArray(fetchedCandidates) && fetchedCandidates.length > 0) {
                // Filter candidates that are not already added to any group
                const filteredCandidates = fetchedCandidates.filter(candidate =>
                    !groups.some(group => group.candidates.some(c => c._id === candidate._id))
                );

                setCandidates(filteredCandidates);
                setSelected([]); // Clear the selected candidates
                setSelectedCandidateNames([]); // Clear the selected candidate names
                setShowPopup(!showPopup);
            } else {
                console.error("Error: No candidates found in API response.");
            }
        } catch (error) {
            console.error("Error fetching candidates:", error);
        }
    };



    useEffect(() => {
        const fetchGroups = async () => {
            try {
                const response = await axios.get("http://localhost:5000/api/v1/groups");
                const fetchedGroups = response.data.groups;
                setGroups(fetchedGroups);
            } catch (error) {
                console.error("Error fetching groups:", error);
            }
        };

        fetchGroups();
    }, []);

    const validateForm = () => {
        const errors = {};

        if (!groupname.trim()) {
            errors.groupname = "Group name is required.";
        }

        if (!numbers.trim()) {
            errors.numbers = "Total number of candidates is required.";
        } else if (isNaN(numbers)) {
            errors.numbers = "Total number of candidates must be a number.";
        } else if (selected.length !== parseInt(numbers)) {
            errors.numbers = "Please select the correct number of candidates.";
        }

        setErrors(errors);

        return Object.keys(errors).length === 0;
    };

    const addGroupDetails = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        try {
            const response = await axios.post(
                "http://localhost:5000/api/v1/createGroup",
                group
            );
            setTimeout(() => {
                setStatus(true);
            }, 1000);
            setTimeout(() => {
                setShowMessage(false); // Hide the message after 1 second
            }, 1000);
            console.log(response.data, "get response");
            setGroup(initialValue);
            setSubmitted(true); // Set submitted state to true
            setShowMessage(true);
        } catch (error) {
            console.log(error);
        }
        navigate("/group/add");
    };

    if (status) {
        return <AddGroup />
    }

    return (
        <>
            <div className='container mb-[60px]'>
                <div className="container pl-8 pr-6 mx-auto pt-6">
                    <form className='bg-white shadow-md px-2 pt-4 rounded-md mt-2 px-6'>
                        <div className="flex items-center">
                            <div className="mb-4">
                                <p className="pb-4 font-bold text-gray-600">ADD GROUP</p>
                            </div>
                            <div className="flex justify-center flex-grow">
                                {submitted && showMessage && (
                                    <div className="bg-blue-100 shadow-md rounded-md p-2 mb-4 inline-flex items-center mr-20 fixed top-20">
                                        <p className="text-green-700 text-center text-md">
                                            <TaskAltSharpIcon className="mr-2" style={{ color: 'green' }} />
                                            Form Submitted Successfully
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>
                        <div className="flex">
                            <div className="mb-4 w-1/2 mr-4">
                                <label htmlFor="groupname" className="block mb-1 font-medium text-gray-600 text-sm">
                                    Group Name
                                </label>
                                <input
                                    type="text"
                                    id="groupname"
                                    name="groupname"
                                    value={groupname}
                                    onChange={onValueChange}
                                    placeholder="2023-NC-MAY-G1"
                                    className={`w-full px-3 py-1.5 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-600 ${errors.groupname ? 'border-red-500' : ''}`}
                                />
                                {errors.groupname && (
                                    <p className="text-red-500">{errors.groupname}</p>
                                )}
                            </div>
                            <div className="mb-4 w-1/2">
                                <label htmlFor="numbers" className="block mb-1 font-medium text-gray-600 text-sm">
                                    Total No. Of Candidates
                                </label>
                                <input
                                    type="number"
                                    id="numbers"
                                    name="numbers"
                                    value={numbers}
                                    onChange={onValueChange}
                                    ref={numbersInputRef} // Assign the ref to the numbers input field
                                    className={`w-full px-3 py-1.5 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-600 ${errors.numbers ? 'border-red-500' : ''}`}
                                />
                                {errors.numbers && (
                                    <p className="text-red-500">{errors.numbers}</p>
                                )}
                            </div>
                        </div>
                        <div className="mb-4" id="candidates">
                            <label htmlFor="candidates" className="block mb-1 font-medium text-gray-600 text-sm">
                                Candidates Name
                            </label>
                            <div className={`flex flex-wrap mt-2 px-3 py-4 rounded-md border ${selected.length ? "bg-white" : "bg-gray-100"}`}>
                                {selectedCandidateNames.map((name, index) => (
                                    <div
                                        key={index}
                                        className="flex items-center bg-gray-50 text-blue-400 font-bold rounded-md px-2 py-1 mr-2 mb-2"
                                    >
                                        {name}
                                        <XIcon
                                            className="h-4 w-4 ml-1 mt-0.5 cursor-pointer text-red-400"
                                            onClick={() => handleRemoveCandidate(index)}
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>
                        <button
                            type="button"
                            onClick={togglePopup}
                            className="w-1/2 font-bold px-4 py-2 text-white bg-blue-500 rounded-md hover:bg-blue-600 mb-4"
                        >
                            Candidates
                        </button>
                        {showPopup && (
                            <div className="fixed inset-0 flex justify-center items-center bg-gray-500 bg-opacity-50">
                                <div className="bg-white rounded-lg shadow-lg p-4">
                                    <div className="max-h-64 overflow-y-auto overflow-x-hidden scrollbar-thin scrollbar-thumb-gray-300">
                                        <table className="table-auto">
                                            <thead className="sticky top-0 bg-white">
                                                <tr>
                                                    <th className="px-4 py-2">Candidates</th>
                                                    <th className="px-4 py-2">{`${selected.length}/${total || 0}`}</th>
                                                </tr>
                                            </thead>
                                            <tbody className="block">
                                                {candidates.map((candidate, index) => (
                                                    <tr key={index}>
                                                        <td className="px-4 py-2">{candidate.name}</td>
                                                        <td>
                                                            <input
                                                                type="checkbox"
                                                                className="mt-2"
                                                                value={candidate._id}
                                                                checked={selected.includes(candidate._id)}
                                                                onChange={handleCheckboxChange}
                                                                disabled={selected.length >= total && !selected.includes(candidate._id)}
                                                            />
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                    <div className="flex justify-end">
                                        <button
                                            type="button" // Change the type to "button"
                                            className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 mt-4"
                                            onClick={handleClose}
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            type="button"
                                            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 mt-4 ml-4"
                                            onClick={handleSubmit}
                                        >
                                            Save
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}
                        <div className="mb-4">
                            <button
                                type="submit"
                                onClick={(e) => {
                                    addGroupDetails(e);
                                    setShowMessage(true); // Show the message on submit button click
                                }}
                                className="w-full font-bold px-4 py-2 mb-4 text-white bg-blue-500 rounded-md hover:bg-blue-600"
                            >
                                Add Group
                            </button>
                        </div>
                    </form>
                </div>
                <ListGroup />
            </div>
        </>
    );
}

export default AddGroup