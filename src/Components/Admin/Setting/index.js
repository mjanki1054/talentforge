import { NavLink } from "react-router-dom";

import Face6Icon from "@mui/icons-material/Face6";

import ConstructionIcon from "@mui/icons-material/Construction";

const Setting = () => {
  return (
    <>
      <div className="container mx-auto px-40 pt-10 pl-16">
        <div className="mt-5">
          <NavLink to="/Setting" className="m-2 font-bold items-center">
            Settings
          </NavLink>
        </div>

        <div className="flex items-center mt-10">
          <NavLink
            to="/AddProctors"
            className="w-1/4 flex flex-col items-center"
          >
            <Face6Icon fontSize="large" style={{ fontSize: 50 }}></Face6Icon>

            <h1 className="font-bold text-center">Add Proctors</h1>
          </NavLink>

          <NavLink
            to="/setting/Account"
            className="w-1/4 flex flex-col items-center"
          >
            <ConstructionIcon
              fontSize="large"
              style={{ fontSize: 50 }}
              className=""
            ></ConstructionIcon>

            <h1 className="font-bold text-center">My Account</h1>
          </NavLink>
        </div>
      </div>
    </>
  );
};

export default Setting;
