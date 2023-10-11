import React, { useContext, useEffect, useState } from 'react'
import { Navigate, Outlet } from 'react-router-dom'
import {browserHistory} from 'react-router'
import { AuthContext } from '../contexts/AuthContext'
import Sidebar from './Sidebar'
import whatsapplogo from '../assets/whatsapp.png'
import { CommonContext } from '../contexts/CommonContext'
import ComponentLoader from './ComponentLoader'
import BottomNavBar from './BottomNavBar'


const styles = {
  mobileCont : {
    height:'100vh',
    overflowY:'scroll'
  },
  desktopCont : {
    // width : '50vw',
    overflowY:'scroll',
    marginLeft:'15vw',
    fontSize:'25px',
    height:'99vh'
  },
  whatsappCont : {
    width:'55px',
    height:'55px',
    position:'absolute',
    right:'2vw',
    bottom:'9vh',
    zIndex:'22'
  },
  outletCont : {
    height:'93vh',
    overflowY:'scroll'
  }
}

function RequireAuth() {

  const [login, setLogin] = useState(null)
  const {isUserLoggedIn} = useContext(AuthContext)
  const [loading, setLoading] = useState(true)
  const { showLoader, hideLoader, showAlert, showSnackbar } = useContext(CommonContext)

  useEffect(() => {
    showLoader()
    async function checkLogin() {
      const resp = await isUserLoggedIn()
      setLogin(resp)
      setLoading(false)
      hideLoader()
    }
    checkLogin()
  }, [login])

  function whatsappMe() {
    window.open(`https://wa.me/918374190096`, '_blank')
  }

  return (
    <>
      {
        loading ?
        <>
          <ComponentLoader />
        </> :
        <>
          {
            login ?
            <><div><div style={styles.outletCont}><Outlet /></div><div><BottomNavBar /></div> </div></>  :
            <Navigate to="/auth" replace="true"/>
          }
        </>
      }
    </>)
}

export default RequireAuth
