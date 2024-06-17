
import { useEffect, useState } from "react";
import { GiLockSpy } from "react-icons/gi";
import EventsTab from "./tabs/EventsTab";
import NotificationsTab from "./tabs/NotificationsTab";
import EventsRequests from "./tabs/EventsRequests";
import { Link, useLocation } from "react-router-dom";
import { getMyNotifications } from "../../utils/notifications";

export default function Dashboard() {
  const location = useLocation();
  const loggedUser = JSON.parse(sessionStorage.getItem("logged_user"));
  const [activeTab,setActiveTab] = useState('events');
  const [noticationLength,setNoticationLength] = useState(0);
  const [isLoaded,setIsLoaded] = useState(false)

  const updateNotif=(notif)=>{
    const prevListCount = JSON.parse(sessionStorage.getItem('my_notifications'))?.length
    const prevCount = JSON.parse(sessionStorage.getItem('notif_count'))
    let newCount  = (notif?.data?.length - prevListCount) > 0 ? prevCount + (notif?.data?.length - prevCount) : prevCount
    sessionStorage.setItem("notif_count",newCount)
    setNoticationLength(newCount);
  }

  useEffect(()=>{
    if(location?.search?.includes('notification')){
      setActiveTab('notifications')
    }
  },[])

  useEffect(()=>{
    var interval = setInterval(async ()=>{
      const notif = await getMyNotifications();
      if(!notif.success) return;
      if(!isLoaded){
        if(sessionStorage.getItem('notif_count')!=null || sessionStorage.getItem('notif_count')!=undefined){
          updateNotif(notif);
        }else{
          sessionStorage.setItem("notif_count",notif?.data?.length)
          setNoticationLength(notif?.data?.length);
        }
      }else{
        if(sessionStorage.getItem('notif_count')!=null){
          updateNotif(notif);
        }
      }

      // eslint-disable-next-line no-unsafe-optional-chaining
      sessionStorage.setItem('my_notifications',JSON.stringify([...notif?.data]))
    },5000)

    setIsLoaded(true);

    return ()=> clearInterval(interval);
  },[])

  return (
    <div>
  <nav className="fixed top-0 z-50 w-full bg-white border-b border-gray-200 dark:bg-gray-800 dark:border-gray-700">
    <div className="px-3 py-3 lg:px-5 lg:pl-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center justify-start rtl:justify-end">
          <button data-drawer-target="logo-sidebar" data-drawer-toggle="logo-sidebar" aria-controls="logo-sidebar" type="button" className="inline-flex items-center p-2 text-sm text-gray-500 rounded-lg sm:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600">
            <span className="sr-only">Open sidebar</span>
            <svg className="w-6 h-6" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
              <path clipRule="evenodd" fillRule="evenodd" d="M2 4.75A.75.75 0 012.75 4h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 4.75zm0 10.5a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5a.75.75 0 01-.75-.75zM2 10a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 10z" />
            </svg>
          </button>
          <Link to={"/"} className="flex ms-2 md:me-24">
            <GiLockSpy size={40} color="#69c0bd"/>
            <span className="self-center text-xl font-semibold sm:text-2xl whitespace-nowrap dark:text-white">EventM.</span>
          </Link>
        </div>
        <div className="flex items-center">
          <div className="flex items-center ms-3">
            <div>
              <span className="text-white font-bold ml-3 w-[40px] h-[40px] rounded-full bg-primary-dark flex justify-center items-center">
                {loggedUser?.username?.substring(0,2).toUpperCase()}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </nav>
  <aside id="logo-sidebar" className="fixed top-0 left-0 z-40 w-64 h-screen pt-20 transition-transform -translate-x-full bg-white border-r border-gray-200 sm:translate-x-0 dark:bg-gray-800 dark:border-gray-700" aria-label="Sidebar">
    <div className="h-full px-3 pb-4 overflow-y-auto bg-white dark:bg-gray-800">
      <ul className="space-y-2 font-medium">
        <li onClick={()=> setActiveTab('events')}>
          <a href="#" className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group">
            <svg className="flex-shrink-0 w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 18 18">
              <path d="M6.143 0H1.857A1.857 1.857 0 0 0 0 1.857v4.286C0 7.169.831 8 1.857 8h4.286A1.857 1.857 0 0 0 8 6.143V1.857A1.857 1.857 0 0 0 6.143 0Zm10 0h-4.286A1.857 1.857 0 0 0 10 1.857v4.286C10 7.169 10.831 8 11.857 8h4.286A1.857 1.857 0 0 0 18 6.143V1.857A1.857 1.857 0 0 0 16.143 0Zm-10 10H1.857A1.857 1.857 0 0 0 0 11.857v4.286C0 17.169.831 18 1.857 18h4.286A1.857 1.857 0 0 0 8 16.143v-4.286A1.857 1.857 0 0 0 6.143 10Zm10 0h-4.286A1.857 1.857 0 0 0 10 11.857v4.286c0 1.026.831 1.857 1.857 1.857h4.286A1.857 1.857 0 0 0 18 16.143v-4.286A1.857 1.857 0 0 0 16.143 10Z" />
            </svg>
            <span className={`flex-1 ms-3 whitespace-nowrap ${activeTab == 'events' ? 'text-primary-dark font-bold text-lg':''}`}>Events</span>
          </a>
        </li>
        <li onClick={()=> setActiveTab('eventsRequests')}>
          <a href="#" className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group">
            <svg className="flex-shrink-0 w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 18 18">
              <path d="M6.143 0H1.857A1.857 1.857 0 0 0 0 1.857v4.286C0 7.169.831 8 1.857 8h4.286A1.857 1.857 0 0 0 8 6.143V1.857A1.857 1.857 0 0 0 6.143 0Zm10 0h-4.286A1.857 1.857 0 0 0 10 1.857v4.286C10 7.169 10.831 8 11.857 8h4.286A1.857 1.857 0 0 0 18 6.143V1.857A1.857 1.857 0 0 0 16.143 0Zm-10 10H1.857A1.857 1.857 0 0 0 0 11.857v4.286C0 17.169.831 18 1.857 18h4.286A1.857 1.857 0 0 0 8 16.143v-4.286A1.857 1.857 0 0 0 6.143 10Zm10 0h-4.286A1.857 1.857 0 0 0 10 11.857v4.286c0 1.026.831 1.857 1.857 1.857h4.286A1.857 1.857 0 0 0 18 16.143v-4.286A1.857 1.857 0 0 0 16.143 10Z" />
            </svg>
            <span className={`flex-1 ms-3 whitespace-nowrap ${activeTab == 'eventsRequests' ? 'text-primary-dark  font-bold text-lg':''}`}>Invitations</span>
          </a>
        </li>
        <li onClick={()=> {
          setActiveTab('notifications')
          sessionStorage.setItem("notif_count",0)
          setNoticationLength(0);
          }}>
          <a href="#" className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group">
            <svg className="flex-shrink-0 w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
              <path d="m17.418 3.623-.018-.008a6.713 6.713 0 0 0-2.4-.569V2h1a1 1 0 1 0 0-2h-2a1 1 0 0 0-1 1v2H9.89A6.977 6.977 0 0 1 12 8v5h-2V8A5 5 0 1 0 0 8v6a1 1 0 0 0 1 1h8v4a1 1 0 0 0 1 1h2a1 1 0 0 0 1-1v-4h6a1 1 0 0 0 1-1V8a5 5 0 0 0-2.582-4.377ZM6 12H4a1 1 0 0 1 0-2h2a1 1 0 0 1 0 2Z" />
            </svg>
            <span className={`flex-1 ms-3 whitespace-nowrap ${activeTab == 'notifications' ? 'text-primary-dark font-bold text-lg':''}`}>Notification</span>
            <span className="inline-flex items-center justify-center w-3 h-3 p-3 ms-3 text-sm font-medium text-blue-800 bg-blue-100 rounded-full dark:bg-blue-900 dark:text-blue-300 overflow-hidden">{noticationLength}</span>
          </a>
        </li>
      </ul>
    </div>
  </aside>
  <div className="p-4 sm:ml-64">
    <div className="p-4 border-2 border-gray-200 border-dashed rounded-lg dark:border-gray-700 mt-14">
      { activeTab === 'events' && <EventsTab /> }
      { activeTab === 'eventsRequests' && <EventsRequests /> }
      { activeTab === 'notifications' && <NotificationsTab /> }
    </div>
  </div>
</div>

  )
}
