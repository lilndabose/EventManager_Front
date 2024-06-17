/* eslint-disable react/prop-types */
import { useState } from "react";

export default function SendInvitation({
  sendInvitation,
  setSelectedUsers,
  usersList,
  selectedUsers,
  data,
  closeModal
}) {

 const [value,setValue] = useState('Select user ...')

  const getSelectedUser=(id)=>{
    const user = usersList.find((item)=> item?.id == Number(id));
    setSelectedUsers((prevUsers)=> [...prevUsers,{eventId: data?.id, userEmail: user?.email,status: "pending"}]);
    setValue('Select user ...')
  }

  const removeUser=(index)=>{
    let arr = [...selectedUsers];
    arr = arr.filter((item,idx)=> idx!== index);
    setSelectedUsers([...arr])
  }

  return (
    <div className="w-1/3 h-2/5 border-2 border-red-500 self-center p-4 flex flex-col items-center justify-around">
      <div className="w-full h-3/5 flex justify-center items-center flex-col">
        <h2 className="font-bold text-gray-900 text-xl">Send Invitation To: </h2>

        <div className="w-full h-2/5 flex border border-gray-200 rounded items-center flex-wrap">
            
          {
            selectedUsers?.map((user,index)=>(
                <div key={user?.username + index.toString()} className="w-auto h-1/2 p-1 m-1 overflow-hidden flex items-center justify-center bg-blue-700 rounded-full">
                    <span className="text-white font-normal text-xs">{usersList.find((item)=> item.email == user?.userEmail)?.username}</span>
                    <span onClick={()=> removeUser(index)} className="hover:cursor-pointer ml-1 flex items-center justify-center overflow-hidden  text-blue-700 text-lg font-bold w-[15px] h-[15px] bg-white rounded-full">&times;</span>
                </div>
            ))
          }
            
            <select value={value} className={`${value.includes('Select user') ? 'text-gray-500':''} border-none outline-none w-full`} onChange={(e)=> getSelectedUser(e.target.value)}>
                <option className="text-gray-100">Select user ...</option>
                {
                    usersList?.map((item)=>(
                        <option key={item?.id} value={item?.id}>{item?.username}</option>
                    ))
                }
            </select>
        </div>

      </div>

      <div className="w-full h-2/5 flex justify-around items-center">
        <button
          onClick={() => sendInvitation()}
          className="p-2 w-2/5 bg-primary-dark hover:bg-primary-light text-white rounded-md float-right cursor-pointer"
        >
          Send Invitation
        </button>
        <button
          onClick={() => closeModal()}
          className="p-2 w-2/5 bg-blue-900 hover:bg-blue-500 text-white rounded-md float-right cursor-pointer"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
