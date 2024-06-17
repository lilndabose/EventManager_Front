import { MyContext } from "../components/context/MyContext";
import { useContext, useEffect, useState } from "react";
import { ToastContainer,toast } from "react-toastify";
import { useParams } from "react-router-dom";
import { SERVER_URL } from "../config/api";
import { CgCalendar } from "react-icons/cg";
import { FaLocationPin } from "react-icons/fa6";
import api from "../config/api";
import "react-toastify/dist/ReactToastify.css";
import NavBar from "../components/NavBar";

export default function EventDetail() {
  const params = useParams();
  const { eventsList } = useContext(MyContext);
  const [event, setEvent] = useState({});
  const [joining, setJoining] = useState(false);
  const [isCommenting,setIsCommenting] = useState(false)
  const [comment,setComment] = useState('')
  const [eventComments,setEventComments] = useState([])
  const loggedUser = JSON.parse(sessionStorage.getItem("logged_user"));

  useEffect(() => {
    let evt = eventsList.find((item) => item.id == params.id);
    if (evt) {
      sessionStorage.setItem("event", JSON.stringify(evt));
      setEvent({ ...evt });
    } else if (sessionStorage.getItem("event")) {
      evt = sessionStorage.getItem("event");
      setEvent(JSON.parse(evt));
    }

    const interval = setInterval(()=>{
      fetchEventComment()
    },5000)

    return ()=> clearInterval(interval);
  }, []);

  // function to join event
  const joinEvent = async () => {
    setJoining(true);
    const body = {
      userEmail: loggedUser.email,
      eventId: event.id,
      status: "pending",
    };
    try {
      const res = await api.post("/invitations", body);
      if (res.status === 201 || res.status === 200) {
        toast("Your invitation has been sent successfully !!!", {
          type: "success",
        });
      }
    } catch (err) {
      let message = "An error occured while sending your invitation try again";
      if (err.response.status == 400) {
        message =
          "Sorry you have already sent invitation to this event can't send twice wait for validation please";
      }
      toast(message, {
        type: "error",
      });
    } finally {
      setJoining(false);
    }
  };

  const fetchEventComment=async()=>{
    const event = JSON.parse( sessionStorage.getItem("event"))
    try{
      const res = await api.get(`/comments/events/${event?.id}`)
      if(res.status == 200){
        console.log("EventComments: ",res.data)
        setEventComments([...res.data])
      }
    }catch(err){
      toast("Error fetching comments !!!",{
        type:'error'
      })
    }
  }

  const onSubmit=async(e)=>{
    e.preventDefault();
    if(!comment) return;
    try{
      const d = new Date();
      const body = {
        userId: loggedUser?.id,
        eventId: event?.id,
        message: comment,
        date: d.getMonth()+"-"+d.getDay()+"-"+d.getFullYear()+ " " + d.getHours()+":"+d.getMinutes()
      }

      const res = await api.post("/comments",body)
      if(res.status == 200 || res.status == 201){
        fetchEventComment()
        setComment('')
      }
    }catch(err){
      toast("Sorry couldn't send comment try again !!!",{
        type:'error'
      })
    }
  }

  return (
    <div className="w-screen h-full flex-col">
      <div className="w-full h-60 flex flex-col justify-center items-center bg-hero-bg bg-center bg-no-repeat bg-cover backdrop-blur-md">
        <div className="w-full h-full flex flex-col justify-around items-center bg-black opacity-65">
          <NavBar />

          <div className="w-10/12 h-40 mb-12 flex flex-col justify-center items-center text-white">
            <h1 className="font-bold text-3xl">View Event Details</h1>
            <span className="text-center mt-4">
              Welcome to EventMaster, your ultimate partner in creating
              unforgettable experiences. Whether you are planning a corporate
              event,
              <br />
              View all the informations relative to choosen events and join
              event if interested
            </span>
          </div>
        </div>
      </div>

      <div className="w-full h-[550px] flex flex-row justify-around items-center">
        <img
          className={`rounded-t-md  w-${isCommenting ? '2/6': '2/5'}`}
          src={`${SERVER_URL}/${event?.image}`}
          alt=""
        />
        <div className={`w-${isCommenting ? '3/6':'2/5'} h-[100%] flex flex-col justify-around items-start`}>
          {
            !isCommenting ?
            <>
            <div className="w-full flex justify-between items-center">
            <h1 className="mb-1 text-3xl flex self-center text-center font-bold tracking-tight text-primary-light dark:text-white">
              {event?.name}
            </h1>
            <button
                type="button"
                onClick={() => setIsCommenting(true)}
                className={`mt-2 text-white bg-yellow-500 hover:bg-yellow-300
              focus:ring-4 focus:outline-none focus:ring-primary-light font-medium rounded-lg 
              text-sm px-5 py-2.5 text-center dark:bg-yellow-500 dark:hover:bg-yellow-500 
              dark:focus:ring-yellow-500`}
              >
                Comment Event
              </button>
          </div>

          <p className="flex self-center font-bold text-gray-700 dark:text-gray-400">
            {event?.description}
          </p>
          <div className="w-auto h-auto flex p-4 flex-col justify-center items-center self-end">
            <p className="mb-2 font-normal text-gray-700 dark:text-gray-400 flex justify-start items-center">
              <CgCalendar />
              {new Date(event?.date).toDateString()}
            </p>
            <p className="mb-2 font-normal text-gray-700 dark:text-gray-400 flex justify-start items-center">
              <FaLocationPin />
              {event?.location}
            </p>
            {!joining ? (
              <button
                type="button"
                onClick={() => joinEvent()}
                className={`mt-2 text-white bg-primary-dark hover:bg-primary-light 
              focus:ring-4 focus:outline-none focus:ring-primary-light font-medium rounded-lg 
              text-sm px-5 py-2.5 text-center dark:bg-primary-dark dark:hover:bg-primary-light 
              dark:focus:ring-primary-light`}
              >
                Join Event
              </button>
            ) : (
              <button
                disabled
                className="mt-2 text-white bg-gray-500 p-2 rounded "
              >
                Joining ...
              </button>
            )}
          </div>
            </> 
            :
            <div className="w-full h-5/6 border border-gray-300 rounded flex items-center flex-col">
              <div className="w-full flex items-center justify-evenly mb-2">
                  <h1 className="text-center text-xl font-bold text-gray-500 overflow-hidden">Event Comment Section</h1>
                  <h3 onClick={()=> setIsCommenting((isCommenting)=> !isCommenting)} className="text-red-500 underline cursor-pointer">Close Comment</h3>
              </div>

              {/* comments here */}
              <div className="w-11/12 h-5/6 flex flex-col self-center overflow-y-scroll" style={{overflowY:'scroll'}}>

                {
                  eventComments?.map((item,index)=>(
                    
                      item.userId !== loggedUser?.id ?
                      <div key={item?.message + index.toString()} className="mb-1 flex flex-col w-[fit-content] h-[fit-content] px-2 rounded bg-primary-light text-white" style={{minHeight: "70px"}}>
                        <span className="text-xs text-yellow-700">{item?.username}</span>
                        <h3 className="font-normal text-sm py-1">{item?.message} </h3>
                        <span className="text-xs text-yellow-700 flex self-end py-1  overflow-hidden">{new Date(item?.date).toDateString()}</span>
                      </div>

                      :
                      <div key={item?.message + index.toString()} className="mb-1 flex flex-col w-[fit-content] h-[fit-content] px-2 rounded bg-gray-900 text-white self-end mr-2" style={{minHeight: "70px"}}>
                      <span className="text-xs text-yellow-500">{item?.username}</span>
                      <h3 className="font-normal text-sm py-1">{item?.message} </h3>
                      <span className="text-xs text-yellow-500 flex self-end py-1  overflow-hidden">{new Date(item?.date).toDateString()}</span>
                    </div>
                    
                  ))
                }
                  

              </div>
              {/* End comment */}
              <form className="w-11/12 h-1/6 flex justify-center items-center" onSubmit={onSubmit}>
                  <input className="w-10/12 border p-2 rounded mr-2" placeholder="Enter comment here ..." value={comment} onChange={(e)=> setComment(e.target.value)}/>
                  <button
                    type="submit"
                    className={`text-white bg-primary-dark hover:bg-primary-light 
                      focus:ring-4 focus:outline-none focus:ring-primary-light font-medium rounded-lg 
                      text-sm px-5 py-1.5 text-center dark:bg-primary-dark dark:hover:bg-primary-light 
                      dark:focus:ring-primary-light`}
                  >
                Post comment
              </button>
              </form>
            </div>
          }
        </div>
      </div>
      <ToastContainer />
    </div>
  );
}
