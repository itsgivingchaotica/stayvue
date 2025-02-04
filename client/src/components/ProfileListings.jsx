import React, { useEffect, useState } from "react";
import { fetchUserListings } from "../redux/slices/listingsSlice";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";

const ProfileListings = () => {
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    id: "",
    price: "",
    img: "",
  });
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user?.loggedInUser);
  const userListings = useSelector((state) => state.listings?.userListings);

  const handleAddListingClick = () => {
    setShowForm(!showForm);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  // const handleEditListing = (index) => {
  //   console.log(`Edit clicked for index: ${index}`);
  // };

  const handleDeleteListing = (index) => {
    const updatedListings = [...userListings];
    updatedListings.splice(index, 1);
    setUserListings(updatedListings);
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();

    // Add the form data to the list of user listings
    setUserListings([...userListings, formData]);

    // Clear the form data
    setFormData({
      title: "",
      id: "",
      price: "",
      img: "",
    });

    // Hide the form
    setShowForm(false);
  };

  useEffect(() => {
    dispatch(fetchUserListings({ userId: user?.id }));
  }, []);

  return (
    <div className="max-w mx-auto mt-8">
      <h1 className="text-center mb-4">Listings</h1>

      <button
        onClick={handleAddListingClick}
        className="w-full mb-10 bg-red-500 text-white rounded-md px-4 py-2 hover:bg-red-600 focus:outline-none focus:ring focus:border-blue-300"
      >
        {showForm ? "Hide Form" : "Add Listing"}
      </button>

      {showForm && (
        <div className="bg-white p-6 rounded-md shadow-md mb-4">
          <form onSubmit={handleFormSubmit}>
            {/* Form fields go here */}
            <label htmlFor="title">Title:</label>
            <input
              required
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              className="font-medium mt-1 p-2 border-2 border-#FF385C rounded-md w-full focus:outline-none focus:ring focus:border-blue-300"
              placeholder="Enter title"
            />

            {/* <label htmlFor="id" className='mt-4'>ID: </label>
            <input
              required
              type="text"
              id="id"
              name="id"
              value={formData.id}
              onChange={handleInputChange}
              className="font-medium mt-1 p-2 border-2 border-#FF385C rounded-md w-full focus:outline-none focus:ring focus:border-blue-300"
              placeholder="Enter ID"
            /> */}

            <label htmlFor="price" className="mt-4">
              Price Per Night:{" "}
            </label>
            <input
              required
              type="number"
              id="price"
              name="price"
              value={formData.price}
              onChange={handleInputChange}
              className="font-medium mt-1 p-2 border-2 border-#FF385C rounded-md w-full focus:outline-none focus:ring focus:border-blue-300"
              placeholder="Enter price per night"
            />

            <label htmlFor="img" className="mt-4">
              Image:{" "}
            </label>
            <input
              required
              type="text"
              id="img"
              name="img"
              value={formData.img}
              onChange={handleInputChange}
              className="font-medium mt-1 p-2 border-2 border-#FF385C rounded-md w-full focus:outline-none focus:ring focus:border-blue-300"
              placeholder="Enter image URL"
            />

            <button
              type="submit"
              className="mt-4 bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-600"
            >
              Add Listing
            </button>
          </form>
        </div>
      )}

      <ul className="grid grid-cols-1 gap-8  lg:grid-cols-3 mt-10">
        {userListings.map((userListing, index) => (
          <li
            key={index}
            className="bg-white p-8 rounded-md shadow-md w-full mb-4"
          >
            {/* <Link to={`/listings/${userListing.id}`}> */}
            <h2
              className="text-2xl font-semibold mb-2"
              style={{ cursor: "pointer" }}
            >
              {userListing.title}
            </h2>
            {/* </Link> */}

            {/* <p className="text-gray-600 text-lg">ID: {userListing.id}</p> */}
            <p className="text-gray-600 text-lg">
              Price per night: ${parseFloat(userListing.price).toFixed(2)}
            </p>
            {userListing.img && (
              <img
                src={userListing.img}
                alt={`Image for ${userListing.title}`}
                className="mt-4 w-full h-48 object-cover rounded-md"
              />
            )}
            <div className="flex justify-between mt-4">
              {/* <button
          onClick={() => handleEditListing(index)}
          className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600"
        >
          Edit
        </button> */}
              <button
                onClick={() => handleDeleteListing(index)}
                className="bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-600 w-full"
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ProfileListings;
