import React, { useContext, useEffect, useState } from 'react'
import { Box, Button} from '@mui/material'
import { useNavigate } from 'react-router-dom'
import { CommonContext } from '../contexts/CommonContext'

import NavHeader from '../components/NavHeader'
import { logAction } from '../services/api'
import ComponentLoader from '../components/ComponentLoader'
import DoctorImg from '../assets/doctor.png'
import BreedingImg from '../assets/breeding.png'
import FeedImg from '../assets/feed.png'
import VaccineImg from '../assets/vaccine.png'
import Hatcheries from '../assets/hatcheries.png'

const styles = {

  posterCont : {
    textAlign:'center',
    borderRadius:'10px',
    boxShadow:'0px 0px 10px 0px #eaeaea',
    margin:'0 5px',
    fontSize:'17px',
    fontWeight:'bold',
    marginBottom:'30px',
    textAlign:'center',
    display:'flex',
    flexDirection:'column',
    alignItems:'center',
    width:'min-content'
  },
  topCatCont : {
    display:'inline-grid', 
    marginBottom:'20px',
    gridTemplateColumns: 'auto auto',
    width:'92vw',
    padding:'0 4vw'
  },
  posterImg : {
    // width:'100%',
    // height:'140px',
    width:'100px',
    marginBottom:'10px',
    boxShadow:'0 0 5px 0px #b3b1b1',
    borderRadius:'2px'
  }
}

function AllCategories() {

  const { isDesktop } = useContext(CommonContext)
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)


  useEffect(() => {
    // fetchCartData()
    // logAction('ALL_CATEGORIES', 'cart')
    setTimeout(() => {
      setLoading(false)
    }, 1000)
  }, [])

  return (
    <>
      {
        loading ? 
        <Box sx={{padding:'4vw'}}> <ComponentLoader /> </Box>
         :
        <>
        <NavHeader />
 
         <Box sx={{padding: isDesktop ? '3vw 3vw 1vw 2vw' : '10vh 4vw 4vw 4vw' , fontSize:'20px', fontWeight:'bold', display:'grid', color:'#a4243d'}}>
           All Categories
         </Box>
 
         <Box sx={isDesktop ? styles.topCatContDesk : styles.topCatCont}>
           <Box style={isDesktop ? styles.posterContDesk : styles.posterCont} 
             onClick={() => navigate('/allFarmers')}>
             <img src={BreedingImg} style={isDesktop ? styles.posterImgDesk : styles.posterImg} />
             <Box>
              Breeding
             </Box>
           </Box>
           <Box style={isDesktop ? styles.posterContDesk : styles.posterCont} 
             onClick={() => navigate('/allFarmers')}>
             <img src={Hatcheries} style={isDesktop ? styles.posterImgDesk : styles.posterImg} />
             Hatcheries
           </Box>
           <Box style={isDesktop ? styles.posterContDesk : styles.posterCont} 
             onClick={() => navigate('/allFarmers')}>
             <img src={DoctorImg} style={isDesktop ? styles.posterImgDesk : styles.posterImg} />
             Vet
           </Box>
           <Box style={isDesktop ? styles.posterContDesk : styles.posterCont} 
             onClick={() => navigate('/allFarmers')}>
             <img src={FeedImg} style={isDesktop ? styles.posterImgDesk : styles.posterImg}/>
             Feed
           </Box>
           <Box style={isDesktop ? styles.posterContDesk : styles.posterCont} 
             onClick={() => navigate('/allFarmers')}>
             <img src={VaccineImg} style={isDesktop ? styles.posterImgDesk : styles.posterImg}/>
             Vaccine and Medicine
           </Box>
         </Box>
     </>
      }
    </>

  )
}

export default AllCategories