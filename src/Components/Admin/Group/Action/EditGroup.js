import React, { useState, useEffect } from "react";
import { NavLink, useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { ViewListIcon } from "@heroicons/react/solid";

const GroupEdit = () => {
  const [group, setGroup] = useState({
    groupname: "",
    numbers: "",
    candidates: [],
    candidateNames: [],
  });
  const [selectedCandidates, setSelectedCandidates] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const [availableCandidates, setAvailableCandidates] = useState([]);
  const { groupname, numbers } = group;
  const { id } = useParams();
  const navigate = useNavigate();

  const fetchGroupDetails = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/v1/groups/${id}`);
      const groupData = response.data.group;
      setGroup(groupData);

      const selectedCandidateIds = groupData.candidates.map((candidate) => candidate.toString());
      setSelectedCandidates(selectedCandidateIds);
    } catch (error) {
      console.log("Error:", error);
    }
  };

  const fetchAvailableCandidates = async () => {
    try {
      const responseCandidates = await axios.get("http://localhost:5000/api/v1/users");
      const responseGroups = await axios.get("http://localhost:5000/api/v1/groups");

      const candidates = responseCandidates.data?.normalUsers || [];
      const groups = responseGroups.data?.groups || [];

      // Get the IDs of candidates already assigned to other groups
      const assignedCandidates = groups.reduce((assigned, group) => {
        if (group._id !== id) {
          return assigned.concat(group.candidates.map((candidate) => candidate._id));
        }
        return assigned;
      }, []);

      // Filter candidates who are not already assigned to any other group
      const unassignedCandidates = candidates.filter((candidate) => {
        return !assignedCandidates.includes(candidate._id);
      });

      setAvailableCandidates(unassignedCandidates);
    } catch (error) {
      console.error("Error fetching candidates:", error);
    }
  };


  const togglePopup = () => {
    setShowPopup(!showPopup);
  };

  const handleCheckboxChange = (candidateId) => {
    if (selectedCandidates.includes(candidateId)) {
      setSelectedCandidates(selectedCandidates.filter((id) => id !== candidateId));
    } else {
      setSelectedCandidates([...selectedCandidates, candidateId]);
    }
  };

  const handleClose = () => {
    setSelectedCandidates(group.candidates.map((candidate) => candidate._id));
    togglePopup();
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setGroup({ ...group, candidates: selectedCandidates });
    togglePopup();
  };

  const formSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateGroupDetails();
      navigate("/group/add"); // Navigate to a different route after updating
    } catch (error) {
      console.log("Error:", error);
    }
  };

  const updateGroupDetails = async () => {
    try {
      await axios.put(`http://localhost:5000/api/v1/update/groups/${id}`, group);
    } catch (error) {
      console.log("Error:", error);
    }
  };

  useEffect(() => {
    fetchGroupDetails();
    fetchAvailableCandidates();
  }, []);

  useEffect(() => {
    setGroup((prevGroup) => ({
      ...prevGroup,
      candidateNames: selectedCandidates.map((candidateId) =>
        availableCandidates.find((candidate) => candidate._id === candidateId)?.name
      ),
    }));
  }, [selectedCandidates, availableCandidates]);



  return (
    <>
      <div className="container pl-8 pr-6 mx-auto pt-6">
        <div className="flex justify-end items-center mb-4">
          <NavLink to="/group/add">
            <button className="flex items-center bg-blue-500 hover:bg-blue-700 text-white py-2 px-4 rounded-md">
              <ViewListIcon className="h-5 w-5 mr-1" />
              Group List
            </button>
          </NavLink>
        </div>
        <form onSubmit={updateGroupDetails} className='bg-white shadow-md px-2 pt-4 rounded-md mt-2 px-6'>
          <div className="flex">
            <div className="mb-4 w-1/2 mr-4">
              <label htmlFor="groupname" className="block mb-1 font-medium text-gray-600 text-sm">
                GROUP NAME
              </label>
              <input
                type="text"
                name="groupname"
                id="groupname"
                className={`w-full px-3 py-1.5 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-600`}
                value={groupname}
                onChange={(e) => setGroup({ ...group, groupname: e.target.value })}
              />
            </div>
            <div className="mb-4 w-1/2">
              <label htmlFor="numbers" className="block mb-1 font-medium text-gray-600 text-sm">
                TOTAL NO. OF CANDIDATES
              </label>
              <input
                type="text"
                name="numbers"
                id="numbers"
                className={`w-full px-3 py-1.5 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-600`}
                value={numbers}
                onChange={(e) => setGroup({ ...group, numbers: e.target.value })}
              />
            </div>
          </div>

          <div className="mb-4">
            <label
              htmlFor="candidates"
              className="block mb-1 font-medium text-gray-600 text-sm"
            >
              CANDIDATES NAME
            </label>

            <input
              type="text"
              id="candidates"
              name="candidates"
              disabled
              value={group.candidateNames ? group.candidateNames.join(", ") : ""}
              className="w-full px-3 py-1.5 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-600"
            />



          </div>


          <button
            type="button"
            className="w-1/2 font-bold px-4 py-2 text-white bg-blue-500 rounded-md hover:bg-blue-600 mb-4"
            onClick={togglePopup}
          >
            Edit Candidates
          </button>


          <div className="mt-6">
            <button
              onClick={formSubmit}
              type="submit"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-500 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Update
            </button>
          </div>
        </form>
      </div>

      {
        showPopup && (
          <div className="fixed inset-0 flex justify-center items-center bg-gray-500 bg-opacity-50">
            <div className="bg-white rounded-lg shadow-lg p-4">
              <div className="max-h-64 overflow-y-auto overflow-x-hidden scrollbar-thin scrollbar-thumb-gray-300">
                <table className="table-auto">
                  <thead className="sticky top-0 bg-white">
                    <tr>
                      <th className="px-4 py-2">Candidates</th>
                    </tr>
                  </thead>

                  <tbody className="block">
                    {availableCandidates.map((candidate) => (
                      <tr key={candidate._id}>
                        <td className="flex items-center space-x-4 mb-2">
                          <input
                            type="checkbox"
                            id={candidate._id}
                            name={candidate._id}
                            value={candidate._id}
                            checked={selectedCandidates.includes(candidate._id)}
                            onChange={() => handleCheckboxChange(candidate._id)}
                            className="h-4 w-4 text-blue-500 focus:ring-blue-400 border-gray-300 rounded"
                          />
                          <label htmlFor={candidate._id} className="block text-sm font-medium text-gray-700">
                            {candidate.name}
                          </label>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="flex justify-end">
                <button
                  className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 mt-4"
                  onClick={handleClose}
                >
                  Cancel
                </button>

                <button
                  className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 mt-4 ml-4"
                  onClick={handleSubmit}
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        )
      }
    </>
  );
};

export default GroupEdit;