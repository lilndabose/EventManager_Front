import { useEffect,useState } from "react";
import { removeNotification } from "../../../utils/notifications";
import { ToastContainer,toast } from "react-toastify";

export default function NotificationsTab() {
  const [notificationList,setNotificationList] = useState([]);

  const deleteNotification=async(id)=>{
    const status = await removeNotification(id);
    if(status == 200 || status == 201){
      let arr = notificationList?.filter((item)=> item.id === id) 
      toast('Deleted Notification successfully !!!',{
        type:'success'
      })

      setNotificationList([...arr]);
    }else{
      toast('An error occured when deleting notification !!!',{
        type:'error'
      })
    }
  }

  useEffect(()=>{
    var interval = setInterval(()=>{
      if(sessionStorage.getItem('my_notifications')){
        const notif = JSON.parse(sessionStorage.getItem('my_notifications'))
        setNotificationList([...notif])
      }
    },5000)

    return ()=> clearInterval(interval);
  },[])

  return (
    <div>
      <h1 className="text-center font-bold text-3xl mb-4">My notifications</h1>

      {
      [...new Set([...notificationList])]?.map((notif,index)=>(

          <div
          key={index}
        className="flex items-center justify-between p-4 mb-2 text-sm text-blue-800 border border-blue-300 rounded-lg bg-blue-50 dark:bg-gray-800 dark:text-blue-400 dark:border-blue-800"
        role="alert"
      >
        <svg
          className="flex-shrink-0 inline w-4 h-4 me-3"
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z" />
        </svg>
        <span className="sr-only">Info</span>
        <div>
          <span className="font-medium">{notif?.message}</span>
        </div>

        <span onClick={()=>deleteNotification(notif?.id)} className="float-right font-bold text-xl bg-red-500 hover:bg-red-700 rounded-full text-white w-[20px] h-[20px] overflow-hidden flex justify-center items-center cursor-pointer">
          &times;
        </span>
      </div>

        ))
      }

      <ToastContainer />
      
    </div>
  );
}
