import DataTable from "react-data-table-component";
import { useState, useEffect } from "react";
import api from "../../../config/api";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Modal from 'react-modal';
import AddEvent from '../subcomponents/AddEvent'
import SendInvitation from "../subcomponents/SendInvitation";
import { saveNotification } from "../../../utils/notifications";


const customModalStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
    width: '50%',
    height: '80%'
  },
};
const customModalInvitationStyles = {
    top: '50%',
    left: '80%',
    right: 'auto',
    bottom: 'auto',
    marginLeft: '-50%',
    transform: 'translate(-50%, -80%)',
}

export default function EventsTab() {
  const loggedUser = JSON.parse(sessionStorage.getItem("logged_user"));
  const [pending, setPending] = useState(true);
  const [activeSearchItem, setActiveSearchItem] = useState("name");
  const [data, setData] = useState([]);
  const [prevData,setPrevData] = useState([]);
  const [tempData, setTempData] = useState([]);
  const [isUpdateEvent, setIsUpdateEvent] = useState(false);
  const [search, setSearch] = useState("");
  const [viewEvent,setViewEvent] = useState("created")
  const [upcomingEvents,setUpcomingEvents] = useState([]);
  let subtitle;
  const [modalIsOpen, setIsOpen] =  useState(false);
  const [selectedItem,setSelectedItem] = useState(null)

  function openModal() {
    setIsOpen(true);
  }

  function afterOpenModal() {
    // references are now sync'd and can be accessed.
    subtitle.style.color = '#f00';
  }

  function closeModal() {
    setIsOpen(false);
  }


  const customStyles = {
    headCells: {
      style: {
        backgroundColor: "#21827f",
        color: "white",
        fontSize: "18px",
        fontWeight: "bold",
      },
    },
    cells: {
      style: {
        borderBottom: "1px solid #69c0bd",
        fontSize: "16px",
        borderRight: "1px solid #69c0bd",
      },
    },
  };

  const columns = [
    {
      name: "Name",
      selector: (row) => row.name,
      sortable: true,
    },
    {
      name: "Description",
      selector: (row) => row.description,
      sortable: true,
    },
    {
      name: "Location",
      selector: (row) => row.location,
      sortable: true,
    },
    {
      name: "Date",
      selector: (row) => row.date,
      sortable: true,
    },
    {
      name: "time",
      selector: (row) => row.time,
      sortable: true,
    },
  ];

  const getUserEvents = async () => {
    try {
      const res = await api.get(`/users/${loggedUser.id}`);
      if (res.data?.events) {
        setData([...res.data.events])
        setPrevData([...res.data.events])
      }
    } catch (err) {
      toast("Error occured while fetching created Events", {
        type: "error",
      });
    }
  };

  const getUpcomingEvents=async()=>{
    try {
      const res = await api.get(`/events/upcoming/${loggedUser.id}`);
      setUpcomingEvents([...res.data])
    } catch (err) {
      toast("Error occured while fetching upcoming Events", {
        type: "error",
      });
    }
  }

  const updateRow = async (row) => {
    if (row.selectedCount > 0) {
      setIsUpdateEvent(true);
      setSelectedItem(row?.selectedRows[0]);
    }
    else {
      setIsUpdateEvent(false);
      setSelectedItem(null);
    }
  };

  const filterData = (value) => {
    setSearch(value);
    let arr = [];
    let currentList = viewEvent === 'created' ? [...data] : [...upcomingEvents]
    switch (activeSearchItem) {
      case "name":
        arr = currentList.filter((item) =>
          item?.name?.toLowerCase().includes(value.toString().toLowerCase())
        );
        break;
      case "location":
        arr = currentList.filter((item) =>
          item?.location?.toLowerCase().includes(value.toString().toLowerCase())
        );
        break;
      case "date":
        arr = currentList.filter((item) => item?.date?.toString() == value.toString());
        break;
      default:
        break;
    }

    setTempData([...arr]);
  };

  const toggleView=(text)=>{
    if(text === 'created'){
      const arr = [...prevData]
      setData([...arr]);
    }else{
      setData([...upcomingEvents])
    }

    setViewEvent(text)
  } 

  const deleteEvent=async()=>{
    if(selectedItem==null) return;

    try{
      const res = await api.delete(`/events/${Number(selectedItem?.id)}`);
      if(res.status == 200 || res.status == 201){
        const notifStatus = await saveNotification(loggedUser?.id, selectedItem?.name + " event deleted !!!",'all');
        if(notifStatus == 200 || notifStatus==201){
          toast("Deleted Event Successfully  and sent notified all participants !!!",{
            type: 'success',
            onClose: ()=>{
              window.location.reload();
            }
          })
        }
      }
    }catch(err){
      toast("An error occured when deleting the event try again !!!",{
        type: 'error'
      })
    }
  } 

  const updateEvent=async()=>{
    if(selectedItem==null) return;

    try{
      const res = await api.update(`/events/${Number(selectedItem?.id)}`);
      if(res.status == 200){
        toast("Updated Event Successfully !!!",{
          type: 'success'
        })
      }
    }catch(err){
      toast("An error occured when updating the event try again !!!",{
        type: 'error'
      })
    }
  } 

  useEffect(() => {
    getUserEvents();
    getUpcomingEvents();
    const timeout = setTimeout(() => {
      setPending(false);
    }, 1000);
    return () => clearTimeout(timeout);
  }, []);

  return (
    <div className="w-full h-full">
      <div className="max-w-lg mx-auto mb-2">
        <label
          htmlFor="default-search"
          className="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white"
        >
          Search
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
            <svg
              className="w-4 h-4 text-gray-500 dark:text-gray-400"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 20 20"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
              />
            </svg>
          </div>
          <input
            id="default-search"
            type={activeSearchItem !== "date" ? "text" : "date"}
            className="block w-full p-4 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-primary-light focus:border-primary-light dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-light dark:focus:border-primary-light"
            placeholder="Search Event ..."
            required
            value={search}
            onChange={(e) => filterData(e.target.value)}
          />
          <button
            type="submit"
            className="text-white absolute end-2.5 bottom-2.5 bg-primary-dark hover:bg-primary-dark focus:ring-4 focus:outline-none focus:ring-primary-light font-medium rounded-lg text-sm px-4 py-2 dark:bg-primary-dark dark:hover:bg-primary-dark dark:focus:ring-primary-dark"
          >
            Search
          </button>
        </div>
      </div>

      <div className="w-full h-auto my-4 flex flex-row items-center justify-center">
        <h3 className="mr-2">Search by:</h3>
        <div className="w-2/6 flex flex-row items-center justify-center">
          <div
            onClick={() => setActiveSearchItem("name")}
            className={`mr-1 text-center flex justify-center items-center w-full max-w-xs p-2 px-4 cursor-pointer text-gray-500 ${
              activeSearchItem == "name"
                ? "bg-primary-light text-white"
                : "bg-white"
            } rounded-full shadow-sm border dark:text-gray-400 dark:bg-gray-800`}
          >
            <span>Name</span>
          </div>
          <div
            onClick={() => setActiveSearchItem("location")}
            className={`mr-1 text-center flex justify-center items-center w-full max-w-xs p-2 px-4 cursor-pointer text-gray-500 ${
              activeSearchItem == "location"
                ? "bg-primary-light text-white"
                : "bg-white"
            } rounded-full shadow-sm border dark:text-gray-400 dark:bg-gray-800`}
          >
            <span>Location</span>
          </div>
          <div
            onClick={() => setActiveSearchItem("date")}
            className={`mr-1 text-center flex justify-center items-center w-full max-w-xs p-2 px-4 cursor-pointer text-gray-500 ${
              activeSearchItem == "date"
                ? "bg-primary-light text-white"
                : "bg-white"
            } rounded-full shadow-sm border dark:text-gray-400 dark:bg-gray-800`}
          >
            <span>Date</span>
          </div>
        </div>
      </div>

      {/* start modal */}

      <Modal
        isOpen={modalIsOpen}
        onAfterOpen={afterOpenModal}
        onRequestClose={closeModal}
        style={customModalStyles}
        contentLabel="Add New Event"
      >
        <div className="w-full h-full flex">
            <AddEvent />
        </div>
      </Modal>

      {/* End of modal */}
      <div className="w-full h-auto p-2 flex justify-between items-center">
        <div className="w-3/5 flex flex-row items-center justify-start">
          <h3 className="mr-2 font-bold">View Events:</h3>
          <div className="w-auto flex flex-row items-center justify-center">
          <div
              onClick={() => toggleView('created')}
              className={`mr-1 text-center flex justify-center items-center w-full max-w-xs p-2 px-2 cursor-pointer text-gray-500 ${
                viewEvent == "created"
                  ? "bg-primary-light text-white"
                  : "bg-white"
              } rounded-full shadow-sm border dark:text-gray-400 dark:bg-gray-800`}
            >
              <span>My Events</span>
            </div>

            <div
              onClick={() => toggleView('upcoming')}
              className={`mr-1 text-center flex justify-center items-center w-[300px] max-w-xs p-2 px-6 cursor-pointer text-gray-500 ${
                viewEvent == "upcoming"
                  ? "bg-primary-light text-white"
                  : "bg-white"
              } rounded-full shadow-sm border dark:text-gray-400 dark:bg-gray-800`}
            >
              <span>Upcoming events</span>
            </div>
            
          </div>
        </div>
        {isUpdateEvent && (
          <>
            <button onClick={()=> deleteEvent()} className="p-2 bg-red-500 hover:bg-red-700 text-white rounded-md float-right my-2 mr-2 cursor-pointer">
              Delete Event
            </button>
          </>
        )}
        {!isUpdateEvent && (
          <button onClick={openModal} className="p-2 bg-yellow-700 hover:bg-yellow-500 text-white rounded-md float-right my-2 mr-2 cursor-pointer">
            Add New Event
          </button>
        )}
        
      </div>
      <DataTable
        columns={columns}
        data={search ? tempData : viewEvent === 'created' ? data : upcomingEvents}
        pagination
        selectableRows = {viewEvent === 'created' ? true : false}
        selectableRowsSingle
        onSelectedRowsChange={(item) => updateRow(item)}
        progressPending={pending}
        expandableRows = {viewEvent === 'created' ? true : false}
        expandableRowsComponent={ExpandedComponent}
        customStyles={customStyles}
      />
      <ToastContainer />
    </div>
  );
}

// eslint-disable-next-line react/prop-types
const ExpandedComponent = ({ data }) => {
  const loggedUser = JSON.parse(sessionStorage.getItem("logged_user"));
  const usersList = JSON.parse(sessionStorage.getItem("usersList"));
  const [selectedUsers,setSelectedUsers] = useState([])

  let subtitle;
  const [modalIsOpen, setIsOpen] =  useState(false);

  function openModal() {
    setIsOpen(true);
  }

  function afterOpenModal() {
    // references are now sync'd and can be accessed.
    subtitle.style.color = '#f00';
  }

  function closeModal() {
    setIsOpen(false);
  }

  const sendInvitation = async () =>{
    try{
      const res = await api.post("/invitations/all",selectedUsers);
      if(res.status == 201 || res.status == 200){
        const context = selectedUsers.map((user)=>{
          return user?.userEmail
        })
        // eslint-disable-next-line react/prop-types
        const status = await saveNotification(loggedUser?.id,`You have been invited to join ${data?.name} event`,context);
        if(status == 200 || status == 201){
          toast("Invitation sent to users successfully !!!", {
            type: "success", 
          });
        }else{{
          toast("An error occured when sending Invitation user !!!", {
            type: "error", 
          });
        }}
        setSelectedUsers([])
      }
    }catch(err){
      console.error(err)
      toast("An error while sending invitations to users try again !!!", {
        type: "error",
      });
    }
  }
  
  return(
    <div className="w-full h-auto flex items-start justify-start">
      <button onClick={openModal} className="ml-2 p-2 bg-yellow-700 hover:bg-yellow-500 text-white rounded-md float-right my-2 mr-2 cursor-pointer">
          Send Event Invitation
      </button>
      <Modal
        isOpen={modalIsOpen}
        onAfterOpen={afterOpenModal}
        onRequestClose={closeModal}
        style={customModalInvitationStyles}
        contentLabel="Send Event Invitation"
      >
        <div className="w-full h-full flex items-center self-center justify-center">
            <SendInvitation sendInvitation={sendInvitation} selectedUsers={selectedUsers} setSelectedUsers={setSelectedUsers} usersList={usersList} data={data} closeModal={closeModal}/>
        </div>
      </Modal>

      <ToastContainer />
    </div>
  )
};
