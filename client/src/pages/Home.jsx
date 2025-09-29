import React from 'react'
import MainBanner from '../components/MainBanner'
import Categories from '../components/Categories'
import BestSeller from '../components/BestSeller'
import BottomBanner from '../components/BottomBanner'
import NewsLetter from '../components/NewsLetter'
import Modal from '../components/Modal/Modal'
import { useState } from 'react'

const Home = () => {
  const [currentPage, setCurrentPage] = useState("login");
  const [openAuthModal, setOpenAuthModal] = useState(false);

  return (
    <div className='mt-10'>
      <MainBanner />
      <Categories />
      <BestSeller />
      <BottomBanner />
      <NewsLetter />

      <Modal
        isOpen={openAuthModal}
        onClose={() => {
          setOpenAuthModal(false);
          setCurrentPage("login");
        }}

        hideHeader
      ></Modal>
    </div>
  )
}

export default Home