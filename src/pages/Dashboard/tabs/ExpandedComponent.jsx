import api from "../../../config/api";
import { toast } from "react-toastify";

export const ExpandedComponent = ({ data }) => {
  const toggleRequest = async (action) => {
    if (action === "accept") {
      try {
        const res = await api.put(`/invitations/${Number(data?.id)}`, {
          status: "accepted",
        });
        if (res.status == 200) {
          toast("Invitation request accepted !!!", {
            type: "success",
          });
        }
      } catch (err) {
        toast("An error occured try again", {
          type: "error",
        });
      }
    }
  };

  return (
    {
      data,
      status,
    } === "pending" && (
      <div className="w-full h-auto p-2 flex flex-row">
        <button
          onClick={() => toggleRequest("accept")}
          className="p-2 bg-green-500 hover:bg-green-700 text-white rounded-md float-right my-2 mr-2 cursor-pointer"
        >
          Accept Request
        </button>
        <button
          onClick={() => toggleRequest("decline")}
          className="p-2 bg-red-500 hover:bg-red-700 text-white rounded-md float-right my-2 mr-2 cursor-pointer"
        >
          Decline Request
        </button>
      </div>
    )
  );
};
