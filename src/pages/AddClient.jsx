import React, { useContext, useState, useEffect, useCallback } from 'react'
import { TextField, Button, Box, createMuiTheme, useTheme } from '@mui/material'
import { useForm } from "react-hook-form";
import { useNavigate } from 'react-router-dom';
import { getFirebaseError } from '../services/error-codes';
import { CommonContext } from '../contexts/CommonContext'
import { createNewClient } from '../services/api';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import MenuItem from '@mui/material/MenuItem';
import { GoogleMap, useJsApiLoader, Marker, Autocomplete } from '@react-google-maps/api';
import { Geolocation } from '@capacitor/geolocation';
import { AuthContext } from '../contexts/AuthContext';

const placesLibrary = ["places"];


function AddClient() {

  const containerStyle = {
    width: '90vw',
    height: '400px'
  };

  const navigate = useNavigate()

  const { showLoader, hideLoader, showAlert, showSnackbar } = useContext(CommonContext)
  const [loading, setLoading] = useState(true)
  const { register : registerClient, handleSubmit : submitclient, reset : resetclient, formState : {errors:clientErrors}, setValue, setFocus } = useForm()

  const [clientType, setClientType] = useState('Restaurant')
  const [mainItem, setMainItem]     = useState(1)
  const [subItem, setSubItem]       = useState(1)
  const [volume, setVolume]         = useState(1)
  const [selItemPrice, setSelItemPrice]   = useState(0)

  const [itemPrices, setItemPrices] = useState({})
  const [showAddLocation, setShowAddLocation] = useState(false)

  const [clientTypes, setClientTypes] = useState(['Restaurant', 'Super Market', 'Meat Shop', 'Gym', 'Export Order'])
  const [latLong, setLatLong] = useState(null)
  const [searchResult, setSearchResult] = useState("Result: none");
  const {getUserId} = useContext(AuthContext)

  useEffect(() => {
    printCurrentPosition()
  }, [])

  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: "AIzaSyCK7GQwFpewtRosu4F4n8xNShe-sDeAd48",
    libraries: placesLibrary
  })

  const [map, setMap] = useState(null)

  const onUnmount = useCallback(function callback(map) {
    setMap(null)
  }, [])
  
  const onLoad = useCallback(function callback(map) {
    const bounds = new window.google.maps.LatLngBounds(window['currentLocation']);
    map.fitBounds(bounds);
    setMap(map)
  }, [])

  const mapPositionChanged = (e) => {
    setLatLong({
      lat : e.lat(),
      lng : e.lng()
    })
  }

  function onAutoCompleteLoad(autocomplete) {
    setSearchResult(autocomplete);
  }

  function onPlaceChanged() {
    if (searchResult != null) {
      const place = searchResult.getPlace();
      console.log("===", place.geometry.location.lat(), place.geometry.location.lng())
      const name = place.name;
      const status = place.business_status;
      const formattedAddress = place.formatted_address;
      // console.log(place);
      

      window['currentLocation'] = {
        lat : place.geometry.location.lat(),
        lng : place.geometry.location.lng()
      }
      setLatLong(window['currentLocation'])

      console.log(`Name: ${name}`);
      console.log(`Business Status: ${status}`);
      console.log(`Formatted Address: ${formattedAddress}`);
      setValue('address', formattedAddress)
      setFocus('address')
    } else {
      showAlert("Please enter address for map", "error")
    }
  }


  const printCurrentPosition = async() => {

    const coordinates = await Geolocation.getCurrentPosition()

    console.log('Current position:', coordinates)
    setLatLong({
      lat : coordinates.coords.latitude,
      lng : coordinates.coords.longitude
    })
    window['currentLocation'] = {
      lat : coordinates.coords.latitude,
      lng : coordinates.coords.longitude
    }
  }


  const [mainItems, setMainItems] = useState({
      3: 'Tender Country Chicken',
      4: 'Classic Country Chicken',
      5: 'Kadaknath',
      6: 'Warrior',
      7: 'Eggs',
      8: 'Pickles'
    })

  const [subItems, setSubItems] = useState({
      1: 'Live Bird',
      2: 'Fresh Meat',
      3: 'Smoked With Turmeric',
      4: 'Skinless',
      5: 'Chicken Boneless',
      6: 'Brown Eggs',
      7: 'Country Eggs',
      8: 'Pickle With Bone',
      9: 'Pickle Boneless'
    })

  const [volumes, setVolumes] = useState({
      1: '3 Kg',
      2: '5 Kg',
      3: '10 Kg',
      4: '6 Pack',
      5: '30 Pack',
      6: '10 Gm (pickle)',
      7: '250 Gm (pickle)',
      8: '1 Kg (pickle)'
    })


  const createclient = async(data) => {
    const clientData = {

      name       : data.clientName,
      mobileNo   : data.mobileNo,
      address    : data.address,
      email      : data.email,
      clientType : clientType,

      staffName   : data.staffName,
      staffMobile : data.staffMobile,

      deliveryContactName : data.deliveryContactName,
      deliveryContactNo   : data.deliveryContactNo,

      itemPrices : itemPrices,
      createdBy : await getUserId(),
      location : latLong,

      timeStamp : Date.now()
    }
    showLoader()
    createNewClient(clientData).then(() => {
      hideLoader()
      showSnackbar("client created successfully")
      setLoading(true)
      resetclient()
      setMainItem(1)
      setSubItem(1)
      setVolume(1)
      setSelItemPrice(0)
      setItemPrices({})
      
    }).catch((error) => {
      hideLoader()
      showSnackbar(getFirebaseError(error), "error")
    })
  }

  const addItemPrice = async() => {
    if (!mainItem || !subItem || !volume || !selItemPrice) {
      showSnackbar("Please fill all details", "error")
      return
    }

    let newItemPrice = itemPrices
    newItemPrice[mainItem] = itemPrices[mainItem] || {}
    newItemPrice[mainItem][subItem] = itemPrices[mainItem][subItem] || {}
    newItemPrice[mainItem][subItem][volume] = Number(selItemPrice)
    setItemPrices({...newItemPrice})
    // setMainItem(null)
    // setSubItem(null)
    // setVolume(null)
    setSelItemPrice('')
  }

  return (
    <Box sx={{padding:'4vw'}}>

        <h4>New farmer onboarding</h4>

        <form onSubmit={submitclient(createclient)}>

          <Box sx={{fontSize:'20px', pb:1, mb:2, borderBottom:'1px solid #eaeaea'}}>
            Farmer Details
          </Box>
          <Box mb={3}>
            <TextField
              placeholder="Enter farmer name"
              label="Farmer Name"
              variant="outlined"
              fullWidth
              autoFocus
              autoComplete='off'
              name="clientName"
              {...registerClient("clientName", {
                required: "Required field"
              })}
              error={Boolean(clientErrors?.clientName)}
              helperText={clientErrors?.clientName?.message}
            />
          </Box>

          <Box mb={3}>
              <TextField
                placeholder="Enter farmer mobile number"
                label="Mobile Number"
                variant="outlined"
                fullWidth
                autoComplete='off'
                name="mobileNo"
                {...registerClient("mobileNo", {
                  required: "Required field",
                  pattern: {
                    value: /^[7896]\d{9}$/,
                    message: "Invalid mobile number",
                  },
                })}
                error={Boolean(clientErrors?.mobileNo)}
                helperText={clientErrors?.mobileNo?.message}
              />
            </Box>


            <Box mb={3}>
              <TextField
                placeholder="Enter your email"
                label="Email ID"
                variant="outlined"
                fullWidth
                autoComplete='off'
                name="email"
                {...registerClient("email", {
                  required: "Required field",
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: "Invalid email address",
                  },
                })}
                error={Boolean(clientErrors?.email)}
                helperText={clientErrors?.email?.message}
              />
            </Box>

            {/* <Box mb={3}>
              <Select
                labelId="demo-select-small"
                placeholder="Client Type"
                fullWidth
                IconComponent={() => (
                  <ArrowDropDownIcon />
                )}
                value={clientType}
                onChange={(e) => setClientType(e.target.value)}>
                {
                  clientTypes.map((item) => {
                    return (
                      <MenuItem key={item} value={item}>{item}</MenuItem>
                    )
                  })
                }
              </Select>
            </Box> */}
            
            <Button variant='contained' sx={{mb:2}} onClick={() =>  setShowAddLocation(true)}>
              Add Location
            </Button>

            {
            showAddLocation ? 
            <Box sx={{display:'flex', flexDirection:'column'}}>
              <Box sx={{mt:2, mb:2}}>
                Add Address Location
              </Box>
              
              <Box> 
              <Autocomplete onLoad={onAutoCompleteLoad} onPlaceChanged={onPlaceChanged}>
                <input
                  type="text"
                  placeholder="Search for your location"
                  style={{
                    boxSizing: `border-box`,
                    border: `1px solid transparent`,
                    width: `100%`,
                    height: `32px`,
                    padding: `0 12px`,
                    borderRadius: `3px`,
                    boxShadow: `0 2px 6px rgba(0, 0, 0, 0.3)`,
                    fontSize: `14px`,
                    marginBottom:'20px',
                    outline: `none`,
                    textOverflow: `ellipses`
                  }}
                />
              </Autocomplete>
              <Box mb={3}>
           
                  {
                    isLoaded ? 
                    (
                      <GoogleMap
                        mapContainerStyle={containerStyle}
                        onLoad={onLoad}
                        center={latLong}
                        options={{mapTypeControl: false, fullscreenControl:false, minZoom:15}}
                        onUnmount={onUnmount}
                      >
                        <Marker position={latLong} draggable={true} onDrag={(e) => mapPositionChanged(e.latLng) } />                             
                      </GoogleMap>
                  ) : <></>
                  }
                </Box>
              </Box>
              </Box> : null
            }

            <Box mb={3}>
              <TextField
                placeholder="Enter address"
                label="Address"
                variant="outlined"
                fullWidth
                name="address"
                multiline
                rows={4}
                {...registerClient("address", {
                  required: "Required field"
                })}
                error={Boolean(clientErrors?.address)}
                helperText={clientErrors?.address?.message}
              />
            </Box>
            
            <Box sx={{fontSize:'20px', pb:1, mb:2, borderBottom:'1px solid #eaeaea'}}>
              Pricing Details
            </Box>

            <Box>
              {
                Object.keys(itemPrices).map((mainItem, index) => {
                  return <Box sx={{fontSize:'22px'}} key={index}>{mainItems[mainItem]} 
                    {
                      Object.keys(itemPrices[mainItem]).map((subItem, index) => {
                        return <Box sx={{fontSize:'20px', display:'flex', flexDirection:'column', marginTop:'10px', marginBottom:'20px', justifyContent:'space-between', padding:'0 20px'}} key={index}>
                        <b>{subItems[subItem]}</b>  
                        {
                          Object.keys(itemPrices[mainItem][subItem]).map((volume, index) => {
                            return <Box sx={{fontSize:'20px', marginTop:'2px'}} key={index}> 
                              {volumes[volume]} - ₹ {itemPrices[mainItem][subItem][volume]} /-
                            </Box>
                          })
                        }
                        </Box>
                      })
                    }
                  </Box>
                })
              }
            </Box>
            <Box sx={{fontSize:'15px', pb:1, mb:2, mt:3, borderBottom:'1px solid #eaeaea'}}>
              Add Item Price
            </Box>
            
            <Box mb={3}>
              <Select
                  labelId="demo-select-small"
                  placeholder="Category"
                  fullWidth
                  IconComponent={() => (
                    <ArrowDropDownIcon />
                  )}
                  value={mainItem}
                  onChange={(e) => setMainItem(e.target.value)}>
                  {
                    Object.keys(mainItems).map((item) => {
                      return (
                        <MenuItem key={item} value={item}>{mainItems[item]}</MenuItem>
                      )
                    })
                  }
                </Select>
            </Box>

            <Box mb={3}>
              <Select
                  labelId="demo-select-small"
                  placeholder="Sub Category"
                  fullWidth
                  IconComponent={() => (
                    <ArrowDropDownIcon />
                  )}
                  value={subItem}
                  onChange={(e) => setSubItem(e.target.value)}>
                  {
                    Object.keys(subItems).map((item) => {
                      return (
                        <MenuItem key={item} value={item}>{subItems[item]}</MenuItem>
                      )
                    })
                  }
                </Select>
            </Box>


            <Box mb={3}>
              <Select
                  labelId="demo-select-small"
                  placeholder="Volume"
                  fullWidth
                  IconComponent={() => (
                    <ArrowDropDownIcon />
                  )}
                  value={volume}
                  onChange={(e) => setVolume(e.target.value)}>
                  {
                    Object.keys(volumes).map((item) => {
                      return (
                        <MenuItem key={item} value={item}>{volumes[item]}</MenuItem>
                      )
                    })
                  }
                </Select>
            </Box>

            <Box mb={3}>
              <TextField
                placeholder="Price"
                label="Price"
                variant="outlined"
                fullWidth
                value={selItemPrice}
                type='number'
                onChange={(e) => setSelItemPrice(e.target.value)}
                autoComplete='off'
              />
            </Box>

            <Box mb={3}>
              <Button variant='outlined' onClick={() => addItemPrice()}>
                Add Price
              </Button>
            </Box>


            <Box sx={{fontSize:'20px', pb:1, mb:2, borderBottom:'1px solid #eaeaea'}}>
              Staff Details
            </Box>

            <Box mb={3}>
              <TextField
                placeholder="Enter staff name"
                label="Staff Name"
                variant="outlined"
                fullWidth
                autoComplete='off'
                name="staffName"
                {...registerClient("staffName", {
                  required: "Required field"
                })}
                error={Boolean(clientErrors?.staffName)}
                helperText={clientErrors?.staffName?.message}
              />
            </Box>

            <Box mb={3}>
              <TextField
                placeholder="Enter staff mobile"
                label="Staff Mobile No"
                variant="outlined"
                fullWidth
                autoComplete='off'
                name="staffName"
                {...registerClient("staffMobile", {
                  required: "Required field",
                  pattern: {
                    value: /^[7896]\d{9}$/,
                    message: "Invalid mobile number",
                  },
                })}
                error={Boolean(clientErrors?.staffMobile)}
                helperText={clientErrors?.staffMobile?.message}
              />
            </Box>

            <Box sx={{fontSize:'20px', pb:1, mb:2, borderBottom:'1px solid #eaeaea'}}>
              Delivery Time Contact Details
            </Box>

            <Box mb={3}>
              <TextField
                placeholder="Enter Delivery Contact name"
                label="Delivery Contact Name"
                variant="outlined"
                fullWidth
                autoComplete='off'
                name="deliveryContactName"
                {...registerClient("deliveryContactName", {
                  required: "Required field"
                })}
                error={Boolean(clientErrors?.deliveryContactName)}
                helperText={clientErrors?.deliveryContactName?.message}
              />
            </Box>

            <Box mb={3}>
              <TextField
                placeholder="Enter delivery contact number"
                label="Delivery Contact Number"
                variant="outlined"
                fullWidth
                autoComplete='off'
                name="deliveryContactNo"
                {...registerClient("deliveryContactNo", {
                  required: "Required field",
                  pattern: {
                    value: /^[7896]\d{9}$/,
                    message: "Invalid mobile number",
                  },
                })}
                error={Boolean(clientErrors?.deliveryContactNo)}
                helperText={clientErrors?.deliveryContactNo?.message}
              />
            </Box>
          
          <Box>
            <Button type="submit" variant="contained" fullWidth>
              Submit
            </Button>
          </Box>
          
        </form>

    </Box>
  )
}

export default AddClient
