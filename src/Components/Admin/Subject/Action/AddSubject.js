import React from 'react'
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import ListSubject from "./ListSubject"
import TaskAltSharpIcon from '@mui/icons-material/TaskAltSharp';
import axios from 'axios';
const initialValue = {
    subjectName: '',
    description: '',

}

const AddSubject = () => {

    const [Subject, setSubject] = useState(initialValue);
    //changes
    const [subjectList, setSubjectList] = useState([]);
    const [status, setStatus] = useState();
    const [errors, setErrors] = useState({});
    const [showMessage, setShowMessage] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    const { subjectName, description } = Subject;
    let navigate = useNavigate();

    const onValueChange = (e) => {
        if (e.target.name === 'subjectName') {
          if (e.target.value.length < 4 || e.target.value.length > 30) {
            setErrors((prevErrors) => ({ ...prevErrors, subjectName: 'Subject Name should be between 4 and 30 characters' }));
          } else {
            setErrors((prevErrors) => ({ ...prevErrors, subjectName: '' }));
          }
        } else if (e.target.name === 'description') {
          if (e.target.value.length < 30 || e.target.value.length > 60) {
            setErrors((prevErrors) => ({ ...prevErrors, description: 'Description should be between 30 and 60 characters' }));
          } else {
            setErrors((prevErrors) => ({ ...prevErrors, description: '' }));
          }
        }

        setSubject({ ...Subject, [e.target.name]: e.target.value });
      };

    const validateForm = () => {
        let formIsValid = true;
        let newErrors = {};

        if (!Subject.subjectName) {
            formIsValid = false;
            newErrors.subjectName = 'Subject is required';
        }

        if (!Subject.description) {
            formIsValid = false;
            newErrors.description = 'Description is required';
        }

        setErrors(newErrors);
        return formIsValid;
    };

    const addSubject = async (e) => {
        e.preventDefault();
        if (!validateForm()) {
            return;
        }
        try {

            const response = await axios.post('http://localhost:5000/api/v1/createSubject', Subject);
            console.log(response.data); // log the response for debugging purposes
            // clear the form after submitting the data
            setSubject({
                subjectName,
                description
            });
            setSubjectList([...subjectList, response.data]); // add the new subject to the subject list
            setTimeout(() => {
                setStatus(true);
            }, 1000);

            setTimeout(() => {
                setShowMessage(false); // Hide the message after 1 second
            }, 1000);
            setSubmitted(true); // Set submitted state to true

            setShowMessage(true); // Show the message after successful submission
        } catch (error) {
            console.log(error);
        }
        navigate('/subject/add');
    };

    if (status) {
        return <AddSubject />
    }

    return (
        <>
            <div className='container mb-[60px]'>
                <div className="container pl-8 pr-6 mx-auto pt-6">
                    <form className='bg-white shadow-md px-2 pt-4 rounded-md mt-2 px-6 pb-4'>
                        <div className="flex items-center">
                            <div className="mb-4">
                                <p className="pb-4 font-bold text-gray-600">ADD SUBJECT</p>
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
                        <div className='mb-4 w-4/4 mr-4'>
                            <label htmlFor='name' className='block mb-1 font-medium text-gray-600 text-sm'>SUBJECT NAME</label>
                            <input
                                type='text'
                                id='subjectName'
                                name='subjectName'
                                className={`w-full px-3 py-1.5 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-600 ${errors.subjectName ? 'border-red-500' : ''
                            }`}
                                value={subjectName}
                                onChange={onValueChange}
                            />
                            {errors.subjectName && (
                                <p className='text-red-500 text-sm'>{errors.subjectName}</p>
                            )}
                        </div>
                        <div className="mb-4 w-4/4 mr-4">
                            <label htmlFor="description" className="block mb-1 font-medium text-gray-600 text-sm">
                                DESCRIPTION
                            </label>
                            <textarea
                                id="description"
                                name="description"
                                rows="3"
                                className={`w-full px-3 py-1.5 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-600 ${errors.description ? 'border-red-500' : ''
                            }`}
                                value={description}
                                onChange={onValueChange}
                            ></textarea>
                            {errors.description && (
                                <p className='text-red-500 text-sm'>{errors.description}</p>
                            )}
                        </div>
                        <div className='mb-4'>
                            <button type='button' className='px-4 py-2 mt-2 mb-6 rounded-md text-white bg-blue-500 hover:bg-blue-600' onClick={addSubject}>
                                Submit
                            </button>
                            <button
                                type="reset"
                                onClick={() => {
                                    setSubject(initialValue);
                                }}
                                className='ml-6 px-4 py-2 rounded-md text-white bg-gray-400 hover:bg-gray-600'
                            >
                                Reset
                            </button>
                        </div>
                    </form>
                </div>
                <ListSubject />
            </div >
        </>
    )
}

export default AddSubject