import React, { useEffect, useState, useContext } from 'react'
import {auth} from '../firebase'
import { signOut } from "firebase/auth";
import { useCookies } from 'react-cookie'
import { useNavigate } from 'react-router-dom';
import { CommonContext } from './CommonContext';
import { removeUserCache, unRegisterToken } from '../services/api';
import { Preferences } from '@capacitor/preferences';

export const AuthContext = React.createContext()

export const AuthContextProvider = (props) => {

  const [userProfileData, setUserProfileData] = useState({})
  const [cookies, setCookie, removeCookie] = useCookies(['userId', 'isAdmin', 'deviceToken'])
  // const [isAdmin, setIsAdmin] = useState(false)
  const { showLoader, hideLoader, showAlert } = useContext(CommonContext)
  const [userId, setUserId] = useState(null)

  const navigate = useNavigate()

  const value = {
    logout,
    userProfileData,
    setUserProfileData,
    userLoggedIn,
    isUserLoggedIn,
    getUserId,
    setDeviceTokenCookie,
    getDeviceTokenCookie,
    getUserRole,
    getUserProfile
  }

  function setDeviceTokenCookie(token) {
    setCookie('deviceToken', token.replace(/[^a-zA-Z0-9]/g, ""), { path: '/'})
  }

  function getDeviceTokenCookie() {
    if (cookies.deviceToken) return cookies.deviceToken
    else return null
  }

  async function userLoggedIn(userId, role, userProfile) {
    if (!userId) return
    await Preferences.set({
      key: 'userId',
      value: userId,
    })
    setUserId(userId)
    setCookie('userProfile', userProfile, { path: '/'})
    setCookie('userId', userId, { path: '/'})
    setCookie('userRole', role, { path: '/'})
  }

  async function isUserLoggedIn() {
    
    if (cookies.userId) return true

    const { value } = await Preferences.get({ key: 'userId' })

    if (value) {
      console.log("User ID found in cap preferences", value)
      setUserId(value)
      return true
    } else {
      console.log("User ID not found in cap preferences")
      return false
    }
}


async function getUserId() {

  if (cookies.userId) return cookies.userId

  const { value } = await Preferences.get({ key: 'userId' })
  if (value) {
    return value
  } else {
    logout()
  }
}

async function getUserRole() {
  if (cookies.userRole) return cookies.userRole
  else logout()
}

async function getUserProfile() {
  if (cookies.userProfile) return cookies.userProfile
  else logout()
}

async function logout() {
  showLoader()
  signOut(auth).then(async () => {
    hideLoader()
    removeUserCache()

    removeCookie('userId')
    removeCookie('userRole')
    removeCookie('userProfile')

    await Preferences.remove({ key: 'userId' })
    navigate("/", {replace:true})
  }).catch((error) => {
    hideLoader()
    showAlert("Failed to logout")
  })
}

  return(
    <AuthContext.Provider value={value}>
      {props.children}
    </AuthContext.Provider>
  )
}