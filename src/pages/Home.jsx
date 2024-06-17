
import EventCard from "../components/EventCard";
import Paginator from "../components/Paginator";
import { useState, useEffect } from "react";
import api from "../config/api";
import Loader from "../components/Loader";
import { MyContext } from "../components/context/MyContext";
import { useContext } from "react";
import NavBar from "../components/NavBar";

function Home() {
  const [isLoading, setIsLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [paginate, setPaginate] = useState({
    start: 1,
    stop: 9,
  });
  const { eventsList, setEventsList } = useContext(MyContext);

  const fetchEvents = async () => {
    setIsLoading(true);
    try {
      const res = await api.get("/events");
      if (res.status == 200 || res.statusText.toLocaleLowerCase() === "ok") {
        if (res?.data?.length < 9) {
          setPaginate({
            ...paginate,
            stop: res?.data?.length,
          });
        }
        setEventsList([...res.data]);
      }
    } catch (e) {
      setErrorMessage("No Event Found !!!");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchAllUsers=async ()=>{
    try{
      const res = await api.get("/users");
      if(res.status == 200 || res.status == 201){
        sessionStorage.setItem("usersList",JSON.stringify(res.data))
      }
    }catch(err){
      console.log("Error fetching users: ",err)
    }
  }

  const filterEvents = (text) => {
    setSearch(text);
  };

  useEffect(() => {
    fetchEvents();
    fetchAllUsers();
  }, []);

  return (
    <div className="w-screen h-full flex-col">
      <div className="w-full h-60 flex flex-col justify-center items-center bg-hero-bg bg-center bg-no-repeat bg-cover backdrop-blur-md">
        <div className="w-full h-full flex flex-col justify-around items-center bg-black opacity-65">
          
          <NavBar />

          <div className="w-10/12 h-40 mb-12 flex flex-col justify-center items-center text-white">
            <h1 className="font-bold text-3xl">Event Manager App</h1>
            <span className="text-center mt-4">
              Welcome to EventMaster, your ultimate partner in creating
              unforgettable experiences. Whether you are planning a corporate
              event,
              <br />a wedding, or a birthday celebration, our intuitive platform
              makes event management seamless and stress-free.
            </span>
          </div>
        </div>
      </div>

      <div className="w-full h-1/2 flex flex-col justify-center items-center">
        {/* search section */}
        <div className="absolute bottom-[62%] w-10/12 p-6 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
          <div className="relative w-full flex flex-row ">
            <input
              type="text"
              className="mr-1 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full ps-10 p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              placeholder="Search event name..."
              onChange={(e) => filterEvents(e.target.value)}
            />
            <button
              type="button"
              className="text-white bg-primary-dark hover:bg-primary-light focus:ring-4 focus:ring-primary-light font-medium rounded-lg text-sm px-8 py-3 dark:bg-primary-dark dark:hover:bg-primary-dark focus:outline-none dark:focus:ring-primary-light"
            >
              Search
            </button>
          </div>
        </div>

        {/* Display Events */}
        <div className="w-10/12 h-[auto] mt-24  mb-8 flex justify-center items-center flex-wrap">
          {/* Sample Event Card */}

          {errorMessage && <h1>{errorMessage}</h1>}
          {!search
            ? eventsList
                ?.slice(paginate.start - 1, paginate?.stop)
                ?.map((event, index) => (
                  <EventCard key={event?.id + index.toString()} event={event} />
                ))
            : eventsList
                ?.filter((event) =>
                  event?.name
                    ?.toLocaleLowerCase()
                    .includes(search.toLocaleLowerCase())
                )
                .slice(paginate.start - 1, paginate?.stop)
                ?.map((event, index) => (
                  <EventCard key={event?.id + index.toString()} event={event} />
                ))}
          {isLoading && <Loader />}
        </div>

        <Paginator
          paginate={paginate}
          setPaginate={setPaginate}
          size={eventsList?.length}
        />
      </div>
    </div>
  );
}

export default Home;
