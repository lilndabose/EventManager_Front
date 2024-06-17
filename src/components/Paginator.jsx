/* eslint-disable react/prop-types */

export default function Paginator({paginate, setPaginate,size}) {

  const togglePaginator=(action)=>{
    let start = 0;
    let stop = 0;
    if(action=='next'){
      if(paginate.stop === size) return;
       start = paginate.stop;
       stop = size - paginate.stop >= 9 ? paginate.stop + 9 : paginate.stop + (size - paginate.stop);
    }else{
      if(paginate.start <=1) return;
      stop = paginate.start;
      start = paginate.start - 9 < 9 ? 1 : paginate.start - 9;
    }

    setPaginate({
      start,
      stop
    })
  }

  return (
    <div className="flex flex-col items-center w-10/12 mb-2">
    <span className="text-sm text-gray-700 dark:text-gray-400">
      Showing{" "}
      <span className="font-semibold text-gray-900 dark:text-white">
        {paginate.start}
      </span>{" "}
      to{" "}
      <span className="font-semibold text-gray-900 dark:text-white">
        {paginate?.stop}
      </span>{" "}
      of{" "}
      <span className="font-semibold text-gray-900 dark:text-white">
        {size < 9 ? paginate?.stop : size}
      </span>{" "}
      Entries
    </span>
    <div className="inline-flex mt-2 xs:mt-0">
      <button
      onClick={()=> togglePaginator('previous')}
       className="flex items-center justify-center px-4 h-10 text-base font-medium text-white bg-primary-dark rounded-s hover:bg-primary-light dark:bg-primary-dark dark:border-primary-dark dark:text-primary-dark dark:hover:bg-primary-dark dark:hover:text-white">
        <svg
          className="w-3.5 h-3.5 me-2 rtl:rotate-180"
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 14 10"
        >
          <path
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M13 5H1m0 0 4 4M1 5l4-4"
          />
        </svg>
        Prev
      </button>
      <button 
      onClick={()=> togglePaginator('next')}
      className="flex items-center justify-center px-4 h-10 text-base font-medium text-white bg-primary-dark rounded-e hover:bg-primary-light dark:bg-primary-dark dark:border-primary-dark dark:text-primary-dark dark:hover:bg-primary-dark dark:hover:text-white">
        Next
        <svg
          className="w-3.5 h-3.5 ms-2 rtl:rotate-180"
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 14 10"
        >
          <path
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M1 5h12m0 0L9 1m4 4L9 9"
          />
        </svg>
      </button>
    </div>
  </div>
  )
}
