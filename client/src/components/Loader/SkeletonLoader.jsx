import React from 'react'

const SkeletonLoader = () => {
    return (
        <>
            <div role="status" className="animate-pulse space-y-4 p-4 max-w-3xl">
                <div className="h-6 bg-gray-300 rounded w-3/4 dark:bg-gray-700"></div>

                <div className="h-4 bg-gray-200 rounded w-1/2 dark:bg-gray-600"></div>

                <div className="space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-full dark:bg-gray-600"></div>
                    <div className="h-4 bg-gray-200 rounded w-11/12 dark:bg-gray-600"></div>
                    <div className="h-4 bg-gray-200 rounded w-10/12 dark:bg-gray-600"></div>
                    <div className="h-4 bg-gray-200 rounded w-5/6 dark:bg-gray-600"></div>
                </div>
            </div>

            <div role="status" className="animate-pulse space-y-4 p-4 max-w-3xl ">
                <div className="h-6 bg-gray-300 rounded w-3/4 dark:bg-gray-700"></div>

                <div className="h-4 bg-gray-200 rounded w-1/2 dark:bg-gray-600"></div>

                <div className="space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-full dark:bg-gray-600"></div>
                    <div className="h-4 bg-gray-200 rounded w-11/12 dark:bg-gray-600"></div>
                    <div className="h-4 bg-gray-200 rounded w-10/12 dark:bg-gray-600"></div>
                    <div className="h-4 bg-gray-200 rounded w-5/6 dark:bg-gray-600"></div>
                </div>
            </div>

        </>
    )
}

export default SkeletonLoader