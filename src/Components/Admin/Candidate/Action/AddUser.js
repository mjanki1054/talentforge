import { React } from 'react'
import { useNavigate } from 'react-router-dom';
import TaskAltSharpIcon from '@mui/icons-material/TaskAltSharp';
import { useState } from 'react';
import ListUser from './ListUser';
import axios from 'axios'
const initialValue = {
    name: '',
    username: '',
    email: '',
    phone: '',
    address: '',
    role: '',
    imageUrl: '',

}


const AddUser = () => {

    const [user, setUser] = useState(initialValue);
    const [status, setStatus] = useState();
    const [errors, setErrors] = useState({});
    const [showMessage, setShowMessage] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    const { name, username, email, phone, address, role, imageUrl } = user;
    let navigate = useNavigate();

    const onValueChange = (e) => {
        if (e.target.name === 'name') {
            let value = e.target.value;
            value = value
                .split(' ')
                .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                .join(' ');
            setUser({ ...user, [e.target.name]: value });
            // Rest of the code...
        } else {
            setUser({ ...user, [e.target.name]: e.target.value });
            // Rest of the code...
        }

        if (e.target.name === 'name') {
            if (e.target.value.trim() === '') {
                setErrors({ ...errors, name: '' }); // No error when field is empty
            } else if (/^\s/.test(e.target.value)) {
                setErrors({ ...errors, name: 'Name should not start with a space' });
            } else if (!/^[a-zA-Z]+( [a-zA-Z]+)*$/.test(e.target.value)) {
                setErrors({ ...errors, name: 'Invalid Name' });
            } else {
                setErrors({ ...errors, name: '' });
            }
        }


        if (e.target.name === 'username') {
            if (!/^[a-zA-Z0-9]*$/.test(e.target.value)) {
                setErrors({ ...errors, username: 'Invalid Username' });
            } else {
                setErrors({ ...errors, username: '' });
            }
        }

        if (e.target.name === 'phone') {
            let error = '';

            if (!/^\d*$/.test(e.target.value)) {
                error = 'Invalid Phone No';
            }
            setErrors({ ...errors, phone: error });
        }

        if (e.target.name === 'address') {
            if (e.target.value.trim() === '') {
                setErrors({ ...errors, address: '' }); // No error when the field is empty
            } else if (/^\s/.test(e.target.value)) {
                setErrors({ ...errors, address: 'Address should not start with a space' });
            } else if (!/^['"\sa-zA-Z0-9,.\\-]+( ['"\sa-zA-Z0-9,.\\-]+)*$/.test(e.target.value)) {
                setErrors({ ...errors, address: 'Invalid Address' });
            } else {
                setErrors({ ...errors, address: '' });
            }
        }


        const phoneInput = document.querySelector('#phone');
        phoneInput.addEventListener('input', (event) => {
            if (event.target.value.length > 10) {
                event.target.value = event.target.value.slice(0, 10); // Truncate the input to 10 digits
            }
        });

        if (e.target.name === 'email') {
            if (!/^[\w.%+-]+@gmail\.com$/i.test(e.target.value)) {
                setErrors({ ...errors, email: 'Invalid Email' });
            } else {
                setErrors({ ...errors, email: '' });
            }
        }

        if (e.target.name === 'role') {
            setErrors({ ...errors, role: '' }); // Clear the role error field
        }
    }

    const onFileChange = (event) => {
        setUser({
            ...user,
            imageUrl: event.target.files[0],
        });
    };

    const validateForm = () => {
        let formIsValid = true;
        let newErrors = {};

        if (!user.name) {
            formIsValid = false;
            newErrors.name = 'Name is required';
        }

        if (!user.username) {
            formIsValid = false;
            newErrors.username = 'Username is required';
        }

        if (!user.email) {
            formIsValid = false;
            newErrors.email = 'Email is required';
        }

        if (!user.phone) {
            formIsValid = false;
            newErrors.phone = 'Phone number is required';
        }

        if (!user.address) {
            formIsValid = false;
            newErrors.address = 'Address is required';
        }

        if (!user.role) {
            formIsValid = false;
            newErrors.role = 'Role is required';
        }

        setErrors(newErrors);
        return formIsValid;
    };

    const addUserDetails = async (e) => {
        e.preventDefault();
        if (!validateForm()) {
            return;
        }

        try {
            const formData = new FormData();
            formData.append('name', user.name);
            formData.append('username', user.username);
            formData.append('email', user.email);
            formData.append('phone', user.phone);
            formData.append('address', user.address);
            formData.append('role', user.role);
            formData.append('imageUrl', user.imageUrl); // Assuming the image file is stored in the 'profile' field of the 'user' object

            let config = {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            };

            const response = await axios.post(
                'http://localhost:5000/api/v1/createUser',
                formData,
                config
            );

            setTimeout(() => {
                setStatus(true);
            }, 1000);

            setTimeout(() => {
                setShowMessage(false);
            }, 1000);

            console.log(response.data);
            setUser(initialValue);
            setSubmitted(true);
            setShowMessage(true);
        } catch (error) {
            console.log(error);
        }
        navigate('/candidate/add');
    };


    const clearUserDetails = (e) => {
        e.preventDefault();
        setUser(initialValue);
        setErrors({});
    }

    if (status) {
        return <AddUser />
    }

    return (
        <>
            <div className='container mb-[60px] '>
                <div className="container pl-8 pr-6 mx-auto pt-6  ">
                    <form className="bg-white  px-2 pt-4 rounded-md mt-2 px-6 shadow-lg">
                        <div className="flex items-center">
                            <div className="mb-4">
                                <p className="pb-4 font-bold text-gray-600">ADD CANDIDATE</p>
                            </div>
                            <div className="flex justify-center flex-grow">
                                {submitted && showMessage && (
                                    <div className="bg-blue-100 shadow-lg rounded-md p-2 mb-4 inline-flex items-center mr-20 fixed top-20">
                                        <p className="text-green-700 text-center text-md">
                                            <TaskAltSharpIcon className="mr-2" style={{ color: 'green' }} />
                                            Form Submitted Successfully
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className='flex'>
                            <div className='mb-4 w-1/2 mr-4'>
                                <label htmlFor='name' className='block mb-1 font-medium text-gray-600 text-sm'>NAME</label>
                                <input
                                    type='text'
                                    id='name'
                                    name='name'
                                    className={`w-full px-3 py-1.5 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-600 ${errors.name ? 'border-red-500' : ''
                                        }`}
                                    value={name}
                                    onChange={onValueChange}
                                />
                                {errors.name && (
                                    <p className='text-red-500 text-sm'>{errors.name}</p>
                                )}
                            </div>
                            <div className='mb-4 w-1/2'>
                                <label
                                    htmlFor='username'
                                    className='block mb-1 font-medium text-gray-600 text-sm'
                                >
                                    USERNAME
                                </label>
                                <input
                                    type='text'
                                    id='username'
                                    name='username'
                                    className={`w-full px-3 py-1.5 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-600 ${errors.username ? 'border-red-500' : ''
                                        }`}
                                    value={username}
                                    onChange={onValueChange}
                                />
                                {errors.username && (
                                    <p className='text-red-500 text-sm'>{errors.username}</p>
                                )}
                            </div>
                        </div>
                        <div className='flex'>
                            <div className='mb-4 w-1/2 mr-4'>
                                <label
                                    htmlFor='email'
                                    className='block mb-1 font-medium text-gray-600 text-sm'
                                >
                                    EMAIL
                                </label>
                                <input
                                    type='text'
                                    id='email'
                                    name='email'
                                    className={`w-full px-3 py-1.5 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-600 ${errors.email ? 'border-red-500' : ''
                                        }`}
                                    value={email}
                                    onChange={onValueChange}
                                />
                                {errors.email && (
                                    <p className='text-red-500 text-sm'>{errors.email}</p>
                                )}
                            </div>
                            <div className='mb-4 w-1/2'>
                                <label
                                    htmlFor='phone'
                                    className='block mb-1 font-medium text-gray-600 text-sm'
                                >
                                    PHONE NO
                                </label>
                                <input
                                    type='text'
                                    id='phone'
                                    name='phone'
                                    className={`w-full px-3 py-1.5 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-600 ${errors.phone ? 'border-red-500' : ''
                                        }`}
                                    value={[phone]}
                                    onChange={onValueChange}
                                />
                                {errors.phone && (
                                    <p className='text-red-500 text-sm'>{errors.phone}</p>
                                )}
                            </div>
                        </div>
                        <div className='flex'>
                            <div className='mb-4 w-1/2 mr-4'>
                                <label
                                    htmlFor='address'
                                    className='block mb-1 ml-1 font-medium text-gray-600 text-sm'
                                >
                                    ADDRESS
                                </label>
                                <input
                                    type='text'
                                    id='address'
                                    name='address'
                                    className={`w-full px-3 py-1.5 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-600 ${errors.address ? 'border-red-500' : ''
                                        }`}
                                    value={address}
                                    onChange={onValueChange}
                                />
                                {errors.address && (
                                    <p className='text-red-500 text-sm'>{errors.address}</p>
                                )}
                            </div>
                            <div className='mb-4 w-1/2'>
                                <label
                                    htmlFor='role'
                                    className='block mb-1 font-medium text-gray-600 text-sm'
                                >
                                    ROLE
                                </label>
                                <select
                                    id='role'
                                    name='role'
                                    value={role}
                                    onChange={onValueChange}
                                    className={`w-full px-3 py-1.5 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-600 ${errors.role ? 'border-red-500' : ''
                                        }`}
                                >
                                    <option value=''>--Select Role--</option>
                                    <option value='Admin'>Admin</option>
                                    <option value='User'>User</option>
                                </select>
                                {errors.role && (
                                    <p className='text-red-500 text-sm'>{errors.role}</p>
                                )}
                            </div>
                        </div>
                        {role === "Admin" ? (
                            <div className='flex'>
                                <div className="mb-4 w-1/2 mr-4">
                                    <label htmlFor="imageUrl" className="font-medium block mb-2 text-gray-600 text-sm">CHOOSE A PHOTO</label>
                                    <div className='container w-auto mr-4 xl:mr-2 py-1 px-1 border border-gray-300 rounded-md'>
                                        <input
                                            type="file"
                                            id="imageUrl"
                                            name="imageUrl"
                                            onChange={onFileChange}
                                        />
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className='flex'>
                                <div className="mb-4 w-1/2 mr-4">
                                    <label htmlFor="imageUrl" className="font-medium block mb-2 text-gray-600 text-sm">CHOOSE A PHOTO</label>
                                    <div className='container w-auto mr-4 xl:mr-2 py-1 px-1 border border-gray-300 rounded-md'>
                                        <input
                                            type="file"
                                            id="imageUrl"
                                            name="imageUrl"
                                            onChange={onFileChange}
                                            required
                                        />
                                    </div>
                                </div>
                            </div>

                        )}
                        <div className='mb-4'>
                            <button className='px-4 py-2 mt-2 mb-6 rounded-md text-white bg-blue-600 hover:bg-blue-700' onClick={(e) => {
                                addUserDetails(e);
                                setShowMessage(true); // Show the message on submit button click
                            }}>
                                Submit
                            </button>
                            <button className='ml-6 px-4 py-2 rounded-md text-white bg-gray-400 hover:bg-gray-600' onClick={clearUserDetails}>
                                Reset
                            </button>

                        </div>
                    </form>
                </div>
                <ListUser />
            </div>
        </>
    )
}

export default AddUser