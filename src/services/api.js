import { collection, doc, getDoc, getDocs, query, setDoc, updateDoc, increment, orderBy, where, deleteDoc, arrayRemove } from "firebase/firestore";
import { db } from '../firebase'
import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";
import { useContext } from "react";
import { AuthContext } from "../contexts/AuthContext";
import { makeStyles } from "@mui/material";

let userDataCache = null

export const setUserData = (async(userData) => {
  const userCollRef = collection(db, 'users')

  return new Promise((resolve, reject)=> {
    setDoc(doc(userCollRef, userData.uid), userData).then((querySnapshot) => {
      resolve(userData)
    }).catch((error)=> {
      reject(error)
    })
  })
})

export const createNewUser = (async(userData) => {
  return new Promise(async(resolve, reject) => {
    const orderResp = await fetch(`${process.env.REACT_APP_SERVER_URL}/createNewuser`, {
      "method": "POST",
      "headers": {
        "content-type": "application/json",
        "accept": "application/json"
      },
      "body": JSON.stringify({
        userData : userData
      })
    }).then((response) => response.json())
    .then(function(data) { 
      resolve(data)
    })
    .catch((error) => {
      console.log(error)
      reject(error)
    }); 
  })
})

export const deleteUserApi = ((userData, groupName) => { 
  const userCollRef = collection(db, 'users')

  //TODO - should handle error responses properly
  unRegisterToken(userData.deviceToken, [groupName]).then(async()=> {
    console.log("Removing device from notifications : ", userData.deviceToken, groupName)
  }).catch(async(error) => {
    console.log("Some unexpected error occured")
  })

  if (userData.groups.length == 1) {
    return new Promise((resolve, reject)=> {
      deleteDoc(doc(userCollRef, userData.mobileNo)).then((querySnapshot) => {
        resolve(userData)
      }).catch((error)=> {
        reject(error)
      })
    })
  } else {
    return new Promise((resolve, reject)=> {
      updateDoc(doc(userCollRef, userData.mobileNo), {groups : arrayRemove(groupName)}).then((querySnapshot) => {
        resolve({})
      }).catch((error)=> {
        reject(error)
      })
    })
  }

})

// Should remove id and fetch from cookie
export const getUserData = (async(id, verifyToken) => {
  // console.log("getting user data for : ", id)
  // if (userDataCache) 
  // {
  //   if (userDataCache.mobileNo == id) {
  //     // console.log("User cache exists : ", userDataCache)
  //     return userDataCache
  //   }
  // }

  return new Promise((resolve, reject)=> {
    getDoc(doc(db, `users/${id}`)).then((querySnapshot) => {

      const deviceToken = document.cookie.replace(/(?:(?:^|.*;\s*)deviceToken\s*\=\s*([^;]*).*$)|^.*$/, "$1");
      if (verifyToken && deviceToken && (deviceToken != querySnapshot.data().deviceToken.replace(/[^a-zA-Z0-9]/g, ""))) {
        resolve({
          multiLoginError :true
        })
      }

      resolve(querySnapshot.data())
      //TODO - remove

      userDataCache = querySnapshot.data()
    }).catch((error)=> {
      reject(null)
    })
  })
})

export const removeUserCache = (() => {
  userDataCache = null
})

export const getUserDataByUrl = (async(id) => {

  return new Promise((resolve, reject)=> {
    getDocs(query(collection(db, "users"), where("userUrlId", "==", id))).then((querySnapshot) => {
      let userData = null
      querySnapshot.forEach((doc) => {
        userData = doc.data()
      })
      if (userData)
        resolve(userData)
      else  
        reject(null)
    }).catch((error) => {
      reject(error)
    })
  })
})

export const updateUserData = (async(userData, uid) => {
  const userCollRef = collection(db, 'users')
  return new Promise((resolve, reject)=> {
    updateDoc(doc(userCollRef, uid), userData).then((querySnapshot) => {
      resolve(userData)
      removeUserCache()
    }).catch((error)=> {
      reject(error)
    })
  })
})

export const uploadImage = (async(fileData, fileMetadata, fileName, path) => {
  const storage = getStorage();
  const storageRef = ref(storage, `${path}/${fileName}`);

  let metadata = {
    contentType: fileMetadata.type,
  };

  return new Promise((resolve, reject) => {
    uploadBytes(storageRef, fileData, metadata).then((snapshot) => {
      getDownloadURL(snapshot.ref).then((downloadURL) => {
        resolve(downloadURL)
      })
    })
  })
})

export const sendNewNotification = (async(data) => {

  const alertCollRef = collection(db, 'alerts'),
        alertId = doc(alertCollRef).id
  data.uid = alertId

  return new Promise(async(resolve, reject) => {
    const orderResp = await fetch(`${process.env.REACT_APP_SERVER_URL}/sendNotification`, {
      "method": "POST",
      "headers": {
        "content-type": "application/json",
        "accept": "application/json"
      },
      "body": JSON.stringify(data)
    }).then((response) => response.json())
    .then(function(data) { 
      resolve(data)
    })
    .catch((error) => {
      console.log(error)
      reject(error)
    }); 
  })
})

export const refreshNoti = (async(data) => {
  return new Promise(async(resolve, reject) => {
    const orderResp = await fetch(`${process.env.REACT_APP_SERVER_URL}/refreshNotifications`, {
      "method": "POST",
      "headers": {
        "content-type": "application/json",
        "accept": "application/json"
      },
      "body": JSON.stringify(data)
    }).then((response) => response.json())
    .then(function(data) { 
      resolve(data)
    })
    .catch((error) => {
      console.log(error)
      reject(error)
    }); 
  })
})

export const registerToken = (async(tokenId, groups) => {
  return new Promise(async(resolve, reject) => {
    const orderResp = await fetch(`${process.env.REACT_APP_SERVER_URL}/subscribe`, {
      "method": "POST",
      "headers": {
        "content-type": "application/json",
        "accept": "application/json"
      },
      "body": JSON.stringify({
        tokenId : tokenId,
        groups : groups
      })
    }).then((response) => response.json())
    .then(function(data) { 
      resolve(data)
    })
    .catch((error) => {
      console.log(error)
      reject(error)
    }); 
  })
})


export const unRegisterToken = (async(tokenId, groups) => {
  return new Promise(async(resolve, reject) => {
    const orderResp = await fetch(`${process.env.REACT_APP_SERVER_URL}/unsubscribe`, {
      "method": "POST",
      "headers": {
        "content-type": "application/json",
        "accept": "application/json"
      },
      "body": JSON.stringify({
        tokenId : tokenId,
        groups : groups
      })
    }).then((response) => response.json())
    .then(function(data) { 
      resolve(data)
    })
    .catch((error) => {
      console.log(error)
      reject(error)
    }); 
  })
})




export const getAlerts = (async(fromTs, toTs, groups) => {
  return new Promise((resolve, reject) => {
    getDocs(query( collection(db, `alerts`),
                   where('timeStamp', '<', toTs),
                   where('timeStamp', '>', fromTs),
                   orderBy('timeStamp', 'desc')
                 )
            ).then((querySnapshot) => {
      let eventItems = []
      querySnapshot.forEach((doc) => {
        if (groups.includes(doc.data().topic))
          eventItems.push(doc.data())      
      })
      resolve(eventItems)
    }).catch(()=> {
      reject([])
    })
  })
})


export const getUsersByGroup = (async(groupId) => {
  return new Promise((resolve, reject) => {
    getDocs(query(collection(db, `users`),  where("groups", "array-contains", groupId))).then((querySnapshot) => {
      let eventItems = []
      querySnapshot.forEach((doc) => {
        eventItems.push(doc.data())      
      })
      resolve(eventItems)
    }).catch((error)=> {
      reject(error)
    })
  })
})

export const editAlertApi = (async(alertData) => {
    const alertCollRef = collection(db, 'alerts')
    return new Promise((resolve, reject)=> {
      updateDoc(doc(alertCollRef, alertData.uid), {body : alertData.newBody}).then((querySnapshot) => {
        resolve({})
      }).catch((error)=> {
        reject(error)
      })
    })
})


export const saveVideosApi = (async(videos) => {
  const globalCollRef = collection(db, 'globals')
    return new Promise((resolve, reject)=> {
      updateDoc(doc(globalCollRef,'globals'), {videoLinks : videos}).then((querySnapshot) => {
        resolve({})
      }).catch((error)=> {
        console.log(error)
        reject(error)
      })
    })
})

export const getGlobals = (async() => {
  return new Promise((resolve, reject) => {
    getDocs(query(collection(db, `globals`))).then((querySnapshot) => {
      let eventItems = []
      querySnapshot.forEach((doc) => {
        eventItems.push(doc.data())      
      })
      resolve(eventItems[0])
    }).catch((error)=> {
      reject(error)
    })
  })
})

export const updateBannerLinks = (async(bannerLinks) => {
  const globalCollRef = collection(db, 'globals')
    return new Promise((resolve, reject)=> {
      updateDoc(doc(globalCollRef,'globals'), {bannerLinks : bannerLinks}).then((querySnapshot) => {
        resolve({})
      }).catch((error)=> {
        console.log(error)
        reject(error)
      })
    })
})

export const checkAppUpdates = (async(versionData) => {
  return new Promise(async(resolve, reject) => {
    const appUpdateResp = await fetch(`${process.env.REACT_APP_SERVER_URL}/appVersionCheck`, {
      "method": "POST",
      "headers": {
        "content-type": "application/json",
        "accept": "application/json"
      },
      "body": JSON.stringify({
        appVersion : versionData.appVersion
      })
    }).then((response) => response.json())
    .then(function(data) { 
      resolve(data)
    })
    .catch((error) => {
      console.log(error)
      reject(error)
    }); 
  })
})


// export const getInputTheme = () => {
//   return {
//     inputBox : {
//       "& .MuiOutlinedInput-input" : {
//         color:'white !important'
//       },
//       "& .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline": {
//         borderColor: "white"
//       },
//       "&:hover .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline": {
//         borderColor: "white"
//       },
//       "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline": {
//         borderColor: "white"
//       },
//       "& .MuiOutlinedInput-input": {
//         color: "white"
//       },
//       "&:hover .MuiOutlinedInput-input": {
//         color: "white"
//       },
//       "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-input": {
//         color: "white"
//       },
//       "& .MuiInputLabel-outlined": {
//         color: "white"
//       },
//       "&:hover .MuiInputLabel-outlined": {
//         color: "white"
//       },
//       "& .MuiInputLabel-outlined.Mui-focused": {
//         color: "white"
//       }
//     }
//   }
// }


export const createNewClient = (async(clientData) => {
  const clientCollRef = collection(db, 'clients')
  const clientId = doc(clientCollRef).id
  clientData.clientId = clientId
  return new Promise((resolve, reject)=> {
    setDoc(doc(clientCollRef, clientId), clientData).then((querySnapshot) => {
      
      fetch(`${process.env.REACT_APP_SERVER_URL}/sendNotification`, {
        "method": "POST",
        "headers": {
          "content-type": "application/json",
          "accept": "application/json"
        },
        "body": JSON.stringify({
          topic : 'newclients',
          title : `New client created`,
          body : `${clientData.name} ${clientData.clientType} is added`
        })
      })

      resolve({})
    }).catch((error)=> {
      reject(error)
    })
  })
})

export const getClients = (async() => {
  return new Promise((resolve, reject) => {
    getDocs(query(collection(db, `clients`))).then((querySnapshot) => {
      let eventItems = []
      querySnapshot.forEach((doc) => {
        eventItems.push(doc.data())      
      })
      resolve(eventItems)
    }).catch((error)=> {
      reject(error)
    })
  })
})

export const getClientDetails = (async(clientId) => {
  return new Promise((resolve, reject) => {
    getDocs(query(collection(db, `clients`), where("clientId", "==", clientId))).then((querySnapshot) => {
      let eventItems = []
      querySnapshot.forEach((doc) => {
        eventItems.push(doc.data())      
      })
      resolve(eventItems[0])
    }).catch((error)=> {
      reject(error)
    })
  })
})

export const updateClientData = (async(clientData, clientId) => {
  const clientsCollRef = collection(db, 'clients')
  return new Promise((resolve, reject)=> {
    updateDoc(doc(clientsCollRef, clientId), clientData).then((querySnapshot) => {
      resolve(clientData)
    }).catch((error)=> {
      reject(error)
    })
  })
})

export const createNewOrder = (async(orderData) => {
  const orderCollRef = collection(db, 'orders')
  const orderId = doc(orderCollRef).id
  orderData.orderId = orderId
  return new Promise((resolve, reject)=> {
    setDoc(doc(orderCollRef, orderId), orderData).then((querySnapshot) => {

      updateClientData({totalOrdersAmount : increment(orderData.orderPrice), totalOrdersCount : increment(1)}, orderData.clientId).then(() => {
        
        fetch(`${process.env.REACT_APP_SERVER_URL}/sendNotification`, {
          "method": "POST",
          "headers": {
            "content-type": "application/json",
            "accept": "application/json"
          },
          "body": JSON.stringify({
            topic : 'neworders',
            title : `New order created for ${orderData.clientName}`,
            body : `₹ ${orderData.orderPrice} order added`
          })
        })

        resolve({})
      }).catch((err) => {
        reject(err)
      })

    }).catch((error)=> {
      reject(error)
    })
  })
})

export const getOrders = (async(data) => {
  console.log(data)
  return new Promise((resolve, reject) => {
    getDocs(query(collection(db, `orders`),  where("dateStamp", "==", data.dateStamp))).then((querySnapshot) => {
      let eventItems = []
      querySnapshot.forEach((doc) => {
        if (data.clientId) {
          if(doc.data().clientId == data.clientId) eventItems.push(doc.data())  
        } else {
          eventItems.push(doc.data())  
        }
      })
      resolve(eventItems)
    }).catch(()=> {
      reject([])
    })
  })
})

export const getPayments = (async(data) => {
  console.log(data)
  return new Promise((resolve, reject) => {
    getDocs(query(collection(db, `payments`),  where("dateStamp", "==", data.dateStamp))).then((querySnapshot) => {
      let eventItems = []
      querySnapshot.forEach((doc) => {
        if (data.clientId) {
          if(doc.data().clientId == data.clientId) eventItems.push(doc.data())  
        } else {
          eventItems.push(doc.data())  
        }
      })
      resolve(eventItems)
    }).catch((error)=> {
      reject([])
    })
  })
})

export const updateOrderStatus = (async(orderData, orderId) => {
  const userCollRef = collection(db, 'orders')
  return new Promise((resolve, reject)=> {
    updateDoc(doc(userCollRef, orderId), orderData).then((querySnapshot) => {
      resolve(orderData)
    }).catch((error)=> {
      reject(error)
    })
  })
})


export const createNewPayment = (async(paymentData, userData) => {
  const paymentCollRef = collection(db, `payments`)
  paymentData.paymentId = doc(paymentCollRef).id

  return new Promise((resolve, reject)=> {
    setDoc(doc(paymentCollRef, paymentData.paymentId), paymentData).then((querySnapshot) => {
      updateClientData({paymentPaidAmount : increment(paymentData.paymentAmount)}, paymentData.clientId).then(() => {

        //Send Notification
        fetch(`${process.env.REACT_APP_SERVER_URL}/sendNotification`, {
          "method": "POST",
          "headers": {
            "content-type": "application/json",
            "accept": "application/json"
          },
          "body": JSON.stringify({
            topic : 'newpayments',
            title : `New payment for ${paymentData.clientName}`,
            body : `₹ ${paymentData.paymentAmount} payment added by ${userData.userName}`
          })
        })
        resolve({})
      }).catch((err) => {
        reject(err)
      })
    }).catch((error)=> {
      reject(error)
    })
  })
})

export const getInputTheme = () => {
  return {
   
  }
}
  
export const getUserProfileData = (async(userId) => {
  return new Promise((resolve, reject) => {
    getDoc(doc(db, `users/${userId}`)).then((querySnapshot) => {
      resolve(querySnapshot.data())
    }).catch((error)=> {
      reject(null)
    })
  })
})


export const getRecepieVideos = () => {
  return [
    {
      url : 'https://www.youtube.com/embed/0X2er6KZWjw',
      id : 1
    },
    {
      url : 'https://www.youtube.com/embed/27-Oo6ChnG4',
      id : 2
    },
    {
      url : 'https://www.youtube.com/embed/t__O2836Pak',
      id : 3
    }

  ]
}


export const getTransactionData=(async(transactionsDataParams)=>{
  return new Promise(async(resolve, reject) => {
    const orderResp = await fetch(`${process.env.REACT_APP_CCC_SERVER_URL}/v1/getAllTransactions`, {
      "method": "POST",
      "headers": {
        "content-type": "application/json",
        "accept": "application/json"
      },
      "body": JSON.stringify(transactionsDataParams)
    }).then((response) => response.json())
    .then(function(data) { 
      resolve(data)
    })
    .catch((error) => {
      console.log(error)
      reject(error)
    }); 
  })
})


export const getViewCustomerOrdersData=(async(viewCustomerOrdersDataParams)=>{
  return new Promise(async(resolve, reject) => {
    const orderResp = await fetch(`${process.env.REACT_APP_CCC_SERVER_URL}/getUserOrdersByMobile`, {
      "method": "POST",
      "headers": {
        "content-type": "application/json",
        "accept": "application/json",
        "Merchant_Key": "DF0911D0-5588-43A2-A3F2-99966F149314",
      },
      "body": JSON.stringify({
        userData: viewCustomerOrdersDataParams})
    }).then((response) => response.json())
    .then(function(data) { 
      resolve(data)
    })
    .catch((error) => {
      console.log(error)
      reject(error)
    }); 
  })
})


export const getUsersByTime=(async(data)=>{
  return new Promise(async(resolve, reject) => {
    const orderResp = await fetch(`${process.env.REACT_APP_CCC_SERVER_URL}/getUsersByTime`, {
      "method": "POST",
      "headers": {
        "content-type": "application/json",
        "accept": "application/json",
        "Merchant_Key": "DF0911D0-5588-43A2-A3F2-99966F149314",
      },
      "body": JSON.stringify({
        queryData: data})
    }).then((response) => response.json())
    .then(function(data) { 
      resolve(data)
    })
    .catch((error) => {
      console.log(error)
      reject(error)
    }); 
  })
})

export const getEnquiries=(async(data)=>{
  return new Promise(async(resolve, reject) => {
    const orderResp = await fetch(`${process.env.REACT_APP_CCC_SERVER_URL}/getContactQueries`, {
      "method": "POST",
      "headers": {
        "content-type": "application/json",
        "accept": "application/json",
        "Merchant_Key": "DF0911D0-5588-43A2-A3F2-99966F149314",
      },
      "body": JSON.stringify({
        queryData: data})
    }).then((response) => response.json())
    .then(function(data) { 
      resolve(data)
    })
    .catch((error) => {
      console.log(error)
      reject(error)
    }); 
  })
})

