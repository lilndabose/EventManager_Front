/* eslint-disable react/prop-types */
import DataTable from 'react-data-table-component';
import { useState,useEffect } from 'react'
import api from '../../../config/api';
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { saveNotification } from '../../../utils/notifications';

export default function EventsRequests() {
  const loggedUser = JSON.parse(sessionStorage.getItem("logged_user"));
  const [pending, setPending] = useState(true);
  const [activeSearchItem,setActiveSearchItem] = useState('name');
  const [data,setData] = useState([]);
  const [tempData,setTempData] = useState([]);
  const [isCancelEvent,setIsCancelEvent] = useState(false);
  const [search,setSearch] = useState('')
  const [viewEvent,setViewEvent] = useState("created")
  const [receivedInvitations, setReceivedInvitations] = useState([]);
  const [prevData,setPrevData] = useState([])

  const customStyles = {
    headCells: {
      style: {
        backgroundColor: '#21827f',
        color: 'white',
        fontSize:'18px',
        fontWeight:'bold'
      },
    },
    cells: {
      style: {
        borderBottom: '1px solid #69c0bd',
        fontSize: '16px',
        borderRight: '1px solid #69c0bd'
      },
    },
  };

  const columns = [
    {
      name: "Username",
      selector: row => row.username,
      sortable: true
    },
    {
      name: 'Event Name',
      selector: row => row.name,
      sortable: true,
    },
    {
      name: 'Description',
      selector: row => row.description,
      sortable: true,
    },
    {
      name: 'Location',
      selector: row => row.location,
      sortable: true,
    },
    {
      name: 'Date',
      selector: row => row.date,
      sortable: true,
    },
    {
      name: 'time',
      selector: row => row.time,
      sortable: true,
    },
    {
      name: 'Status',
      selector: row => row.status,
      sortable: true,
    }
  ];
  
  
  const getUserEvents = async (data) => {
    try {
      const res = await api.get(`/users/${loggedUser.id}`);
      if (res.data?.events) {
        let arr = data.filter((item)=>{
          const itemId = Number(item?.event_id)
          let result = false;
          res.data?.events.forEach((itm)=>{
            if(Number(itm?.id) == itemId && loggedUser?.email !== item?.user_email){
                result = true;
                return;
            }
          })

          return result;
        })

        arr = arr.map((item)=> { return {...item,date: item?.date?.split(" ")[0],time: item?.date?.split(" ")[1], id: Number(item?.id), event_id: Number(item?.event_id)}})
        
        setReceivedInvitations([...arr]);
      }
    } catch (err) {
      toast("Error occured while fetching created Events", {
        type: "error",
      });
    }
  };

  const getUsersRequests = async ()=>{
    try{
      const res = await api.get(`/invitations/users?email=${loggedUser.email}`);
      if(res.data){
        const arr  = res.data.map((item)=> {
          return {
            ...item,
            date: item?.date?.split(" ")[0],
            time: item?.date?.split(" ")[1],
          }
        })
        setData([...arr]);
        setPrevData([...arr])
      }
      else 
        setData([])
    }catch(err){
      toast("Error occured while fetching created Events", {
        type: "error",
      });
    }
  }

  const getAllInvitations = async ()=>{
       try{
        const res = await api.get(`/invitations`);
        getUserEvents(res.data);
      }catch(err){
        toast("Error occured while fetching all invitations requests", {
          type: "error",
        });
      }
  }

  const deleteRow = async(row)=>{
    if(row.selectedCount > 0){
      setIsCancelEvent(true);
      const data = row.selectedRows
      try{
        const res = await api.delete(`/invitations/${Number(data?.id)}`);
        if(res.status == 200){
          toast("Request deleted successfully !!!", {
            type: "success",
            onClose: ()=>{
              window.location.reload();
            }
          });
        }
      }catch(err){
        toast("An error occured while deleting request try again", {
          type: "error",
        });
      }

    }else{
      setIsCancelEvent(false)
    }
    


    // const selectedElement = row?.selectedRows[0];
    console.log(row)
  }

  const filterData=(value)=>{
    setSearch(value);
    let arr = []
    switch(activeSearchItem){
      case 'name':
        arr = data.filter((item)=> item?.name?.toLowerCase().includes(value.toString().toLowerCase()));
        break;
      case 'location':
        arr = data.filter((item)=> item?.location?.toLowerCase().includes(value.toString().toLowerCase()));
        break;
      case 'status':
        arr = data.filter((item)=> item?.status?.toLowerCase().includes(value.toString().toLowerCase()));
        break;
      case 'date':
        arr = data.filter((item)=> item?.date?.toString() == value.toString());
        break;
      default:
        break;
    }

    setTempData([...arr]);
  }


  const toggleView=(text)=>{
    if(text === 'created'){
      const arr = [...prevData]
      setData([...arr]);
    }else{
      setData([...receivedInvitations])
    }

    setViewEvent(text)
  }

  useEffect(() => {
    getUsersRequests();
    getAllInvitations();
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
            type={activeSearchItem !=='date' ? 'text' : 'date'}
            className="block w-full p-4 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-primary-light focus:border-primary-light dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-light dark:focus:border-primary-light"
            placeholder="Search Event ..."
            required
            value={search}
            onChange={(e)=> filterData(e.target.value)}
          />
          <button
            type="submit"
            className="text-white absolute end-2.5 bottom-2.5 bg-primary-dark hover:bg-primary-dark focus:ring-4 focus:outline-none focus:ring-primary-light font-medium rounded-lg text-sm px-4 py-2 dark:bg-primary-dark dark:hover:bg-primary-dark dark:focus:ring-primary-dark"
          >
            Search
          </button>
        </div>
      </div>

      <div className='w-full h-auto my-4 flex flex-row items-center justify-center'>
        <h3 className='mr-2'>Search by:</h3>
        <div className='w-2/6 flex flex-row items-center justify-center'>
        <div onClick={()=> setActiveSearchItem('name')} className={`mr-1 text-center flex justify-center items-center w-full max-w-xs p-2 px-4 cursor-pointer text-gray-500 ${activeSearchItem == 'name' ? 'bg-primary-light text-white' : 'bg-white'} rounded-full shadow-sm border dark:text-gray-400 dark:bg-gray-800`}>
          <span>Name</span>
        </div>
        <div onClick={()=> setActiveSearchItem('location')} className={`mr-1 text-center flex justify-center items-center w-full max-w-xs p-2 px-4 cursor-pointer text-gray-500 ${activeSearchItem == 'location' ? 'bg-primary-light text-white' : 'bg-white'} rounded-full shadow-sm border dark:text-gray-400 dark:bg-gray-800`}>
          <span>Location</span>
        </div>
        <div onClick={()=> setActiveSearchItem('date')} className={`mr-1 text-center flex justify-center items-center w-full max-w-xs p-2 px-4 cursor-pointer text-gray-500 ${activeSearchItem == 'date' ? 'bg-primary-light text-white' : 'bg-white'} rounded-full shadow-sm border dark:text-gray-400 dark:bg-gray-800`}>
          <span>Date</span>
        </div>
        <div onClick={()=> setActiveSearchItem('status')} className={`mr-1 text-center flex justify-center items-center w-full max-w-xs p-2 px-4 cursor-pointer text-gray-500 ${activeSearchItem == 'status' ? 'bg-primary-light text-white' : 'bg-white'} rounded-full shadow-sm border dark:text-gray-400 dark:bg-gray-800`}>
          <span>Status</span>
        </div>
        </div>
      </div>

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
              <span>My Requests</span>
            </div>

            <div
              onClick={() => toggleView('invitation')}
              className={`mr-1 text-center flex justify-center items-center w-[400px] max-w-xs p-2 px-6 cursor-pointer text-gray-500 ${
                viewEvent == "invitation"
                  ? "bg-primary-light text-white"
                  : "bg-white"
              } rounded-full shadow-sm border dark:text-gray-400 dark:bg-gray-800`}
            >
              <span>Received Invitations</span>
            </div>
            
          </div>
        </div>
        {
      isCancelEvent &&
      <button className='p-2 bg-red-500 hover:bg-red-700 text-white rounded-md float-right my-2 mr-2 cursor-pointer'>
        Delete Request
      </button>
     }
      </div>

     
      <DataTable
        columns={columns}
        data={search ? tempData : viewEvent === 'created' ? data : receivedInvitations}
        pagination
        selectableRows={viewEvent === 'created' ? true : false }
        selectableRowsSingle
        onSelectedRowsChange={(item)=> deleteRow(item)}
        progressPending={pending}
        expandableRows = {viewEvent === 'created' ? false : true}
        expandableRowsComponent={ExpandedComponent}
        customStyles={customStyles}
      />
      <ToastContainer />
    </div>
  );
}


const ExpandedComponent = ({ data }) => {
  const loggedUser = JSON.parse(sessionStorage.getItem("logged_user"));
  const eventId = data?.event_id;
  const status = data?.status;

  const [attendees,setAttendees] = useState([])
  const [isLoaded,setIsLoaded] = useState(false)

  const toggleRequest = async (action)=>{
    if(action === 'accept'){
      try{
        const res = await api.put(`/invitations/${Number(data?.id)}`,{status: 'accepted'});
        if(res.status == 200){
          const sendNotifStatus = await saveNotification(loggedUser?.id, `Your request to join ${data?.name} has been accepted`,data?.user_email);
          if(sendNotifStatus == 200 || sendNotifStatus == 201){
            toast("Invitation request accepted and notification sent to user !!!", {
              type: "success",
              onClose: ()=>{
                window.location.reload();
              }
            });
          }
          
        }
      }catch(err){
        toast("An error occured try again", {
          type: "error",
        });
      }
    }else{
      try{
        const res = await api.put(`/invitations/${Number(data?.id)}`,{status: 'declined'});
        const sendNotifStatus = await saveNotification(loggedUser?.id, `Your request to join ${data?.name} has been declined`,data?.user_email);
        if(res.status == 200){
          if(sendNotifStatus == 200 || sendNotifStatus == 201){
            toast("Invitation request declined and user has been notified !!!", {
              type: "success",
            });
          }
        }
      }catch(err){
        toast("An error occured try again", {
          type: "error",
        });
      }
    }
  }

  if(status === 'pending'){
    return   <div className='w-full h-auto p-2 flex flex-row'>
                <button onClick={()=> toggleRequest('accept')} className="p-2 bg-green-500 hover:bg-green-700 text-white rounded-md float-right my-2 mr-2 cursor-pointer">
                      Accept Request
                    </button>
              <button onClick={()=> toggleRequest('decline')} className="p-2 bg-red-500 hover:bg-red-700 text-white rounded-md float-right my-2 mr-2 cursor-pointer">
                      Decline Request
                    </button>
            </div>
  }

  const getListOfAttendees = async ()=>{
    try{
        const res = await api.get(`/invitations/attendees/${eventId}`)
        if(res.status == 200){
          setAttendees([...res.data])
          setIsLoaded(true)
        }
    }catch(err){
      toast('An error when fetching attendees of event',{
        type:'error'
      })
    }
  }

  if(status == 'accepted'){
    if(!isLoaded){
      getListOfAttendees();
    }
  }

  return(
    <>
      {status == 'accepted' && 
        <div className='w-full h-auto p-2 flex flex-row items-around'>
          <h3 className='text-green-700 font-bold text-xl'>Attendees: </h3>
          {
            attendees?.map((item,index)=>(
              <span key={index} className='p-1 rounded bg-yellow-500 text-white mx-1'>{item}</span>
            ))
          }
        </div>
      }
      {status == 'declined' && <h3 className='text-red-500'>Request Declined !!!</h3>}
    </>
  )
};