import React from 'react'

const SpinnerLoader = () => {
  return (
    <div role="status">
      <svg
        aria-hidden="true"
        className="inline w-6 h-6 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
        viewBox="0 0 100 101"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M100 50.5C100 78.3 77.6 100.5 50 100.5C22.4 100.5 0 78.3 0 50.5C0 22.7 22.4 0.5 50 0.5C77.6 0.5 100 22.7 100 50.5ZM9.1 50.5C9.1 73.1 27.4 91.4 50 91.4C72.6 91.4 90.9 73.1 90.9 50.5C90.9 27.9 72.6 9.6 50 9.6C27.4 9.6 9.1 27.9 9.1 50.5Z"
          fill="currentColor"
        />
        <path
          d="M93.9 39.0C96.8 38.3 98.5 35.2 97.6 32.3C95.2 24.5 90.6 17.4 84.3 11.6C77.9 5.8 70.2 1.6 61.7 0.1C59.0 -0.4 56.3 1.2 55.6 4.1C54.9 7.0 56.6 9.9 59.3 10.5C66.6 12.1 73.3 15.6 78.7 20.6C84.1 25.6 88.2 31.9 90.3 38.8C91.1 41.7 93.9 39.0 93.9 39.0Z"
          fill="currentFill"
        />
      </svg>
      <span className="sr-only">Loading...</span>
    </div>
  );
}

export default SpinnerLoader