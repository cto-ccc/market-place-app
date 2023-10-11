import { TextField, Button, Box, createMuiTheme, InputLabel, useTheme, FormControl, Paper } from '@mui/material'
import { useForm } from "react-hook-form";
import { useLocation, useNavigate } from 'react-router-dom';
import ComponentLoader from '../components/ComponentLoader';
import { useContext, useEffect, useState } from 'react';
import MenuItem from '@mui/material/MenuItem';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import InsertInvitationIcon from '@mui/icons-material/InsertInvitation';
import InputAdornment from '@mui/material/InputAdornment';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { CommonContext } from '../contexts/CommonContext';
import { createNewOrder } from '../services/api';
import { getFirebaseError } from '../services/error-codes';
import { AuthContext } from '../contexts/AuthContext';

function NewOrder() {

  const location = useLocation()
  const navigate = useNavigate()

  const { register : registerOrder, handleSubmit : submitOrder, reset : resetOrder, formState : {errors:orderErrors} } = useForm()
  const { showLoader, hideLoader, showAlert, showSnackbar } = useContext(CommonContext)
  const {getUserId} = useContext(AuthContext)

  const [selectedItem, setSelectedItem] = useState(null) 
  const [orderItems, setOrderItems]     = useState([])
  const [showAddForm, setShowAddForm]   = useState(true)
  const [clientDet, setClientDet]       = useState(null)
  const [dateTime, setDateTime]         = useState(null)
  const [showError, setShowError]       = useState(false)

  const [mainItem, setMainItem]     = useState(1)
  const [subItem, setSubItem]       = useState(1)
  const [volume, setVolume]         = useState(1)
  const [selItemPrice, setSelItemPrice]   = useState(0)
  const [itemsList, setItemsList]   = useState({})

  const [orderPrice, setOrderPrice] = useState(0)

  const [mainItems, setMainItems] = useState({
    1: 'Presidential Country Chicken',
    2: 'Supreem Country Chicken',
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

  useEffect(() => {
    setClientDet(location.state)
    console.log(location.state)
    setSelItemPrice(location.state.itemPrices[1][1][1])
  }, [])

  const submitNewOrder = async() => {

    if (!orderPrice) {
      showSnackbar("Please enter order items", "error")
      return
    }

    if (!dateTime) {
      showSnackbar("Please select date and time of delivery", "error")
      return
    }

    let dateStamp = new Date(dateTime.$d.getTime())
    dateStamp.setHours(0,0,0,0)
    const orderData = {
      deliveryTime : dateTime.$d.getTime(),
      orderItems   : itemsList,
      clientId     : clientDet.clientId,
      clientName   : clientDet.name,
      status       : 'CREATED',
      timeStamp    : Date.now(),
      dateStamp    : dateStamp.getTime(),
      createdBy    : await getUserId(),
      orderPrice   : orderPrice,
      location     : location.state.location
    }

    showLoader()
    createNewOrder(orderData).then(() => {
      hideLoader()
      showSnackbar("Order created successfully")
      navigate('/', {replace:true})
    }).catch((error) => {
      showSnackbar(getFirebaseError(error), "error")
    })
  }

  const changeMainItem = (item) => {
    setMainItem(item)
    updateItemPrice(item, subItem, volume)
  }

  const changeSubItem = (subItem) => {
    setSubItem(subItem)
    updateItemPrice(mainItem, subItem, volume)
  }

  const changeVolume = (volume) => {
    setVolume(volume)
    updateItemPrice(mainItem, subItem, volume)
  }

  const updateItemPrice = (mainItem, subItem, volume) => {
    if (!location.state.itemPrices[mainItem] 
        || !location.state.itemPrices[mainItem][subItem]
        || !location.state.itemPrices[mainItem][subItem][volume]) {

          setSelItemPrice(0)
          return
    }
    setSelItemPrice(location.state.itemPrices[mainItem][subItem][volume] || 0)
  }

  const addProduct = () => {
    if (!mainItem || !subItem || !volume || !selItemPrice) {
      showSnackbar("Invalid item details", "error")
      return
    }

    let newItemsList = itemsList
    newItemsList[mainItem] = itemsList[mainItem] || {}
    newItemsList[mainItem][subItem] = itemsList[mainItem][subItem] || {}
    newItemsList[mainItem][subItem][volume] = Number(selItemPrice)

    
    //TODO - known bug
    //If user updates the price of already added product then total price mismatches.
    //old price should be reduced first and new price should be added
    setOrderPrice(Number(orderPrice) + Number(selItemPrice))

    setItemsList({...newItemsList})
    setMainItem('')
    setSubItem('')
    setVolume('')
    setSelItemPrice('')
    setShowAddForm(false)
  }

  return (
    <Box sx={{padding:'4vw'}}>

        <Box mb={2} mt={4} sx={{fontSize:'20px'}}>
          Creating new order for : <Box sx={{fontWeight:'bold'}}>{location.state.name}</Box> 
        </Box>

        <Paper sx={{padding:'20px', marginBottom:'10px'}}>
          {
            Object.keys(itemsList).map((mainItem, index) => {
              return <Box sx={{fontSize:'20px'}} key={index}> <b>{mainItems[mainItem]}</b>  
                {
                  Object.keys(itemsList[mainItem]).map((subItem, index) => {
                    return <Box sx={{fontSize:'18px', display:'flex', flexDirection:'column', marginTop:'10px', marginBottom:'20px', justifyContent:'space-between', padding:'0 20px'}} key={index}>
                    <b>{subItems[subItem]}</b>  
                    {
                      Object.keys(itemsList[mainItem][subItem]).map((volume, index) => {
                        return <Box sx={{display:'flex', fontSize:'20px', marginTop:'2px', justifyContent:'space-between'}} key={index}> 
                          <Box>
                            {volumes[volume]}
                          </Box>
                          <Box>
                          ₹ {itemsList[mainItem][subItem][volume]} /-
                          </Box>
                        </Box>
                      })
                    }
                    </Box>
                  })
                }
              </Box>
            })
          }

          {
            !Object.keys(itemsList).length ? "No items added" : 
            <Box sx={{display:'flex', fontSize:'20px', marginTop:'2px', justifyContent:'space-between', padding:'20px', borderTop:'1px solid #eaeaea'}}>
              <Box>Total</Box> <Box> ₹ {orderPrice} /-</Box> 
            </Box>
          }
        </Paper>

          {
            orderItems.length ?
            <Box> Order Summary
            <Paper sx={{padding:'15px', marginBottom:'15px', marginTop:'10px'}}>
              <Box sx={{display:'flex', fontWeight:'bold'}} mb={1}>
                <Box sx={{width:'50%'}}>
                  Item Name
                </Box>
                <Box sx={{width:'15%'}}>
                  Price
                </Box>
                <Box sx={{width:'15%', textAlign:'center'}}>
                  Qty
                </Box>
                <Box sx={{width:'20%'}}>
                  Total
                </Box>
              </Box>

              {
                orderItems.map((item, index) => {
                  return <Box key={index} sx={{display:'flex'}} mb={1}>
                    <Box sx={{width:'50%'}}>
                      {item.itemName}
                    </Box>
                    <Box sx={{width:'15%'}}>
                      {item.itemPrice}
                    </Box>
                    <Box sx={{width:'15%', textAlign:'center'}}>
                      {item.itemQty}
                    </Box>
                    <Box sx={{width:'20%'}}>
                      {item.itemQty * item.itemPrice}
                    </Box>
                  </Box>
                })
              }

              <Box sx={{display:'flex', fontWeight:'bold', borderTop:'1px solid #eaeaea'}} mt={2} pt={2}>
                <Box sx={{width:'50%'}}>
                  Total
                </Box>
                <Box sx={{width:'15%'}}>

                </Box>
                <Box sx={{width:'15%', textAlign:'center'}}>
                  {
                    orderItems.reduce((accumulator, item) => {
                      return accumulator + item.itemQty;
                    }, 0)
                  }
                </Box>
                <Box sx={{width:'20%'}}>
                  {
                    orderItems.reduce((accumulator, item) => {
                      return accumulator + (item.itemPrice * item.itemQty);
                    }, 0)
                  }
                </Box>
              </Box>
            </Paper>
            </Box> : 
            null
          }


        <Box>
          
        </Box>

        {
          showAddForm ? 
          <Paper sx={{padding:'10px', marginTop:'10px'}}>
              <Box mb={1}>
                Add new order item
              </Box>
            <Box mb={3}>
              <Select        
                  placeholder="Category"
                  fullWidth
                  IconComponent={() => (
                    <ArrowDropDownIcon />
                  )}
                  value={mainItem}
                  onChange={(e) => changeMainItem(e.target.value)}>
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
                  placeholder="Sub Category"
                  fullWidth
                  IconComponent={() => (
                    <ArrowDropDownIcon />
                  )}
                  value={subItem}
                  onChange={(e) => changeSubItem(e.target.value)}>
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
                  placeholder="Volume"
                  fullWidth
                  IconComponent={() => (
                    <ArrowDropDownIcon />
                  )}
                  value={volume}
                  onChange={(e) => changeVolume(e.target.value)}>
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
                // disabled={!selItemPrice}
                value={selItemPrice}
                type='number'
                onChange={(e) => setSelItemPrice(e.target.value)}
                autoComplete='off'
              />
            </Box>

            <Box>
              <Button variant="outlined" onClick={() => setShowAddForm(false)}>
                Cancel
              </Button>
              <Button type="submit" variant="contained" sx={{marginLeft:'10px', width:'25vw'}} onClick={() => addProduct()}>
                Add
              </Button>
            </Box>

          </Paper> : 
            <Box >
              <Button variant="outlined" onClick={() => setShowAddForm(true)}>
                Add More Items
              </Button>
            </Box>
        }

        <Box mb={3} mt={2}>
          <Box mb={1}>
            Select delivery date and time
          </Box>
          
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DateTimePicker
              renderInput={(props) => <TextField sx={{width:'100%'}} {...props} />}
              inputFormat="DD/MM/YYYY hh:mm A"
              value={dateTime}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="end">
                    <InsertInvitationIcon />
                  </InputAdornment>
                ),
                error:showError
              }}
              
              onChange={(newValue) => {
                setDateTime(newValue)
                setShowError(false)
              }}
            />
          </LocalizationProvider>
          <Box sx={{color:'#d32f2f', fontSize:'0.80rem', marginTop:'3px', marginLeft:'14px'}}>
            {
              showError ? 'Please select date and time' : ''
            }
          </Box>
        </Box>

        <Box mt={2}>
          <Button fullWidth variant="contained" onClick={() => submitNewOrder()}>
            Create Order
          </Button>
        </Box>

    </Box>
  )
}

export default NewOrder
