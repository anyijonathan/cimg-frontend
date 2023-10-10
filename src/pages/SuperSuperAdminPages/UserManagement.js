import React, { useState, useEffect } from "react";
import Notification from "../../components/Notification";
import { ArrowRight, UserIcon } from "../../icons";
import FormInput from "../../components/FormInput";
import Button from "../../components/Button";
import FormSelect from "../../components/FormSelect";
import { Modal } from "flowbite-react";
import ActionModal from "../../components/Modals/ActionModal";
import { useDispatch, useSelector } from "react-redux";
import {
  CreateUser,
  getAllUsers,
  RemoveUser,
  setId,
  userMgtSelector,
} from "../../Redux/Slices/userMgtSlice";
import { userOptions } from "../../utils/constants";
import { Pagination } from "@windmill/react-ui";
import { userSelector } from "../../Redux/Slices/authSlice";

const UserManagement = () => {
  const { emailAddress, userName, userRole } = useSelector(userSelector);
  //const {userId} = useSelector(userMgtSelector);

  const dispatch = useDispatch();

  const [notificationText, setNotificationText] = useState("");
  const [status, setStatus] = useState("");
  const [openTab, setOpenTab] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isActionModalOpen, setIsActionModalOpen] = useState(false);
  const [actionReceiver, setActionReceiver] = useState("");
  const [actionType, setActionType] = useState("");
  const [usersList, setUsersList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [buttonText, setButtonText] = useState("Create User");
  const [disabled, setDisabled] = useState(false);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("");
  const [page, setPage] = useState(1);
  const [data, setData] = useState([]);
  const [userId, setUserId] = useState(null);

  const setTabOne = () => {
    setOpenTab(1);
  };

  const setTabTwo = () => {
    setOpenTab(2);
  };

  function openModal() {
    setIsModalOpen(true);
  }

  function closeModal() {
    setIsModalOpen(false);
  }

  function openRemoveUserModal(id) {
    setUserId(id);
    setActionType("remove");
    setActionReceiver("user");
    setIsActionModalOpen(true);
  }

  function closeActionModal() {
    setIsActionModalOpen(false);
  }

  const handleEmailChange = (e) => {
    const { value } = e.target;
    setEmail(value);
  };

  const handleFullNameChange = (e) => {
    const { value } = e.target;
    setFullName(value);
  };

  const handleRoleChange = (e) => {
    const { value } = e.target;
   
    setRole(value);
  };

  // Function handling New user creation
  async function createNewUser() {
    const data = {
      fullName: fullName,
      emailAddress: email,
      role: role,
    };

    setDisabled(true);
    setIsLoading(true);
    setButtonText("creating new user...");

    let responseData = await CreateUser(data,emailAddress,userRole);
    if (responseData.code !== "00") {
      setDisabled(false);
      setIsLoading(false);
      setButtonText("create new user");
      closeModal();
      setStatus("failure");
      setNotificationText(responseData.description);

      setTimeout(() => {
        setStatus("");
        setNotificationText("");
      }, 3000);
    } else {
      setDisabled(false);
      setIsLoading(false);
      setButtonText("create new user");
      closeModal();
      setStatus("success");
      setNotificationText(responseData.description);
      setFullName("")
      setEmail("")
      setRole("")
   
      setTimeout(() => {
        setStatus("");
        setNotificationText("");
      }, 3000);
      fetchUserList();
    }
  }

  // FUNCTION FOR REMOVING A USER
  async function removeUser() {
    let id = userId;
    const data = {
      fullName: fullName,
      emailAddress: email,
      role: role,
    };
    try {
      setDisabled(true);
      setIsLoading(true);
      await RemoveUser(id,emailAddress,userRole);
      setIsActionModalOpen(false);
      setStatus("success");
      setNotificationText(`${actionReceiver} ${actionType}d successfully`);
      setDisabled(false);
      setIsLoading(false);

      setTimeout(() => {
        setStatus("");
        setNotificationText("");
      }, 3000);
      fetchUserList();
    } catch (error) {
      setIsActionModalOpen(false);
      setDisabled(false);
      setIsLoading(false);
      setStatus("failure");
      setNotificationText("User removel failed, please try again");
    }
  }

  // GETTING USER LIST ON PAGE LOAD
  const fetchUserList = async () => {
    try {
      let responseData = await getAllUsers(emailAddress,userRole);
  
      setUsersList(responseData.dataList);
      setData(
        responseData.dataList.slice(
          (page - 1) * resultsPerPage,
          page * resultsPerPage
        )
      );
    } catch (error) {
      setStatus("failure");
      setNotificationText("couldn't fetch User list, kindly refresh page");
    }
  };

  useEffect(() => {
    fetchUserList();
  }, [page]);

  const resultsPerPage = 5;
  const totalResults = usersList.length;

  // pagination change control
  function onPageChange(p) {
    setPage(p);
  }

  // on page change, load new sliced data
  // here you would make another server request for new data
  /*    useEffect(() => {
   
    
    }, [page]) */

  return (
    <div className="font-circular-std">
      {/*  -----------------------------------------------MODAL START---------------------------------------------------  */}
      <Modal
        show={isModalOpen}
        onClose={closeModal}
        popup={true}
        size="lg"
        position="center"
      >
        <Modal.Header>
          <div className="p-6">
            <h3 className="w-[90%] text-lg font-bold text-black-secondary">
              Add New User
            </h3>
          </div>
          <div className="md:w-[27.75rem] pb-10">
            <hr />
          </div>
        </Modal.Header>

        <Modal.Body>
          <div className="space-y-6">
            <FormInput
              onChange={handleFullNameChange}
              label="Full Name"
              placeholder="Enter full name"
            />
            <FormInput
              onChange={handleEmailChange}
              label="Email Address"
              placeholder="Enter email address"
            />
            <FormSelect
              onChange={handleRoleChange}
              className="w-full md:w-[27.25rem] h-12"
              label="Role"
              options={userOptions}
            />
          </div>
        </Modal.Body>
        <Modal.Footer>
          <div className="flex justify-between w-full">
            <Button
              isLoading={isLoading}
              disabled={disabled}
              onClick={createNewUser}
            >
              {buttonText}
            </Button>
          </div>
        </Modal.Footer>
      </Modal>

      <ActionModal
        onClose={closeActionModal}
        show={isActionModalOpen}
        modalClose={closeActionModal}
        actionReceiver={actionReceiver}
        actionType={actionType}
        modalAction={removeUser}
        isLoading={isLoading}
        disabled={disabled}
      />

      {/* ----------------------------------------Modal End ----------------------------------------------- */}

      <Notification notificationText={notificationText} status={status} />
      <h2 className="text-xl font-bold text-black-secondary pb-9">Profile Management</h2>
      <div className="h-[48.75rem] bg-white grid grid-cols-5">
        <div className="col-span-1 border-r border-opacity-10 border-black-secondary">
          <ul className="pt-14 pl-10">
            <li>
              <button
                href=""
                onClick={setTabOne}
                className={`${
                  openTab === 1
                    ? "text-purple-primary"
                    : "text-black-secondary opacity-70"
                }  inline-flex items-center pl-6 w-full h-12 text-sm font-normal transition-colors duration-150`}
              >
                Manage users
                <ArrowRight
                  className={`${openTab === 1 ? "flex" : "hidden"} ml-4`}
                />
              </button>
            </li>

            <li>
              <button
                href=""
                onClick={setTabTwo}
                className={`${
                  openTab === 2
                    ? "text-purple-primary"
                    : "text-black-secondary opacity-70"
                }  inline-flex items-center pl-6 w-full h-12 text-sm font-normal transition-colors duration-150`}
              >
                Basic information
                <ArrowRight
                  className={`${openTab === 2 ? "flex" : "hidden"} ml-4`}
                />
              </button>
            </li>
          </ul>
        </div>

        <div className="col-span-4">
          <div className={openTab === 1 ? "block" : "hidden"}>
            <div className="mt-16 pl-16">
              <div className="flex justify-between mb-10">
                <h2 className="text-base self-center font-bold text-black-secondary">
                  Manage Users
                </h2>
                <button
                  onClick={openModal}
                  className="pl-6 py-3 pr-6 border border-purple-secondary rounded font-circular-std outline-none focus:border-purple-secondary focus:ring-purple-200 ease-in-out duration-150"
                >
                  <p className="linear-gradient-text text-sm font-normal">
                    + Add New User
                  </p>
                </button>
              </div>
              <table className="w-full text-left">
                <thead className="text-sm text-black-primary opacity-70 bg-gray-300">
                  <tr>
                    <th scope="col" className="py-3 px-6">
                      Name
                    </th>
                    <th scope="col" className="py-3 px-6">
                      Email Address
                    </th>
                    <th scope="col" className="py-3 px-6">
                      Role
                    </th>
                    <th scope="col" className="py-3 px-6">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody className="text-sm bg-other-background">
                  {data.map((user, i) => (
                    <tr
                      key={i}
                      className="bg-white text-black-secondary border-b py-4 px-6"
                    >
                      <td className="py-6 px-6 font-medium whitespace-nowrap">
                        {user.fullName}
                      </td>
                      <td className="py-6 px-6">{user.emailAddress}</td>
                      <td className="py-6 px-6">{user.role}</td>
                      <td className="py-6 px-6">
                        <button
                          onClick={() => openRemoveUserModal(user.id)}
                          className="text-base font-[450] text-red-primary opacity-70"
                        >
                          Remove
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>

                <Pagination
                  totalResults={totalResults}
                  resultsPerPage={resultsPerPage}
                  label="Table navigation"
                  onChange={onPageChange}
                />
              </table>
            </div>
          </div>
          <div className={openTab === 2 ? "block" : "hidden"}>
            <div className="mt-16 pl-16">
              <UserIcon className="h-24 w-24 mb-24" />
              <FormInput
                className="mb-9"
                label="Display name"
                placeholder={userName}
                readOnly="readOnly"
              />
              <FormInput
                className="mb-14"
                label="Email"
                placeholder={emailAddress}
                readOnly="readOnly"
              />
              <Button disabled className="newfee-button">
                Update
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserManagement;
