import { Link } from "react-router-dom";
import { BiBell } from "react-icons/bi";
import { GiLockSpy } from "react-icons/gi";
import { useState, useEffect } from "react";
import { getMyNotifications } from "../utils/notifications";

export default function NavBar() {
  const [noticationLength, setNoticationLength] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);

  const updateNotif = (notif) => {
    const prevListCount = JSON.parse(
      sessionStorage.getItem("my_notifications")
    )?.length;
    const prevCount = JSON.parse(sessionStorage.getItem("notif_count"));
    let newCount =
      notif?.data?.length - prevListCount > 0
        ? prevCount + (notif?.data?.length - prevCount)
        : prevCount;
    sessionStorage.setItem("notif_count", newCount);
    setNoticationLength(newCount);
  };

  useEffect(() => {
    var interval = setInterval(async () => {
      const notif = await getMyNotifications();
      if (!notif.success) return;
      if (!isLoaded) {
        if (
          sessionStorage.getItem("notif_count") != null ||
          sessionStorage.getItem("notif_count") != undefined
        ) {
          updateNotif(notif);
        } else {
          sessionStorage.setItem("notif_count", notif?.data?.length);
          setNoticationLength(notif?.data?.length);
        }
      } else {
        if (sessionStorage.getItem("notif_count") != null) {
          updateNotif(notif);
        }
      }

      // eslint-disable-next-line no-unsafe-optional-chaining
      sessionStorage.setItem("my_notifications",JSON.stringify([...notif?.data]));
    }, 5000);

    setIsLoaded(true);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-10/12 h-20 flex items-center justify-between text-white">
      <Link
        to={"/"}
        className="font-bold text-2xl flex justify-center items-center"
      >
        <GiLockSpy />
        <h1 className="ml-2">EventM.</h1>
      </Link>
      <div className="flex justify-center items-center px-2">
        <Link to={"/dashboard"}>
          <button
            type="button"
            className={`ml-2 text-white bg-primary-dark hover:bg-primary-dark 
                  focus:ring-4 focus:outline-none focus:ring-primary-dark font-medium rounded-lg 
                  text-sm px-5 py-2.5 text-center dark:bg-primary-dark dark:hover:bg-primary-dark 
                  dark:focus:ring-primary-light`}
          >
            Dashboard
          </button>
        </Link>

       <Link to={"/dashboard?q=notification"} className="ml-4 w-[50px] flex cursor-pointer">
        <BiBell size={22} />
        <span className="relative text-xs w-[20px] h-[20px] overflow-hidden flex items-center justify-center p-1 rounded-full bg-white text-red-700 font-bold">
            {noticationLength}
        </span>
       </Link>

      </div>
    </div>
  );
}
