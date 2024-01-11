import { TextField, Button, Box, createMuiTheme, InputLabel, useTheme, FormControl, Paper, MenuItem } from '@mui/material'
import { useForm } from "react-hook-form";
import { Link, useLocation, useNavigate } from 'react-router-dom';
import ComponentLoader from '../components/ComponentLoader';
import { useContext, useEffect, useState } from 'react';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import { getClientDetails, updateOrderStatus } from '../services/api';
import { CommonContext } from '../contexts/CommonContext';
import CallIcon from '@mui/icons-material/Call';
import Navigate from '../assets/navigation.png'
import {AppLauncher} from '@capacitor/app-launcher';


const styles = {
  circleIcon : {
    borderRadius:'10px',
    padding:'8px',
    // background:'#a4243d',
    color:'#a4243d',
    border:'1px solid #a4243d'
  },
  menuImg : {
    width:'30px'
  },
  menuItemCont : {
    padding:'10px',
    width:'30px',
    height : '30px',
    border:'1px solid #bdbbbb',
    borderRadius:'10px',
    boxShadow:'0 0 12px 2px #eaeaea',
    marginBottom:'15px'
  }
}

function OrderDetails() {

  const location = useLocation()
  const [loading, setLoading]         = useState(true)
  const [clientDet, setClientDet]     = useState(null)
  const [orderStatus, setOrderStatus] = useState('')
  const { showLoader, hideLoader, showAlert, showSnackbar } = useContext(CommonContext)

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
    console.log(location.state)
    getClientInfo()
  }, [])

  const getClientInfo = async() => {
      getClientDetails(location.state.clientId).then((response) => {
        console.log(response)
        setClientDet(response)
        setLoading(false)
      })  
    
  }

  const changeOrderStatus = async() => {

    updateOrderStatus({status : orderStatus}, location.state.orderId).then((response) => {
      console.log(response)
      showSnackbar("Order status updated successfully")
    }).catch((error) => {
      showSnackbar("Failed to update order status", "error")
    })  
  }

  function callMe(number) {
    window.open(`tel:${number}`, '_self')
  }

  async function goToMap() {
    await AppLauncher.openUrl({url: `http://maps.google.com/maps?q=${location.state.location.lat},${location.state.location.lng}`});
  }

  return (
    <Box sx={{padding:'4vw'}}>
      {
        loading ? <ComponentLoader /> :
        <Box>
          <Box mb={2} mt={4} sx={{fontSize:'20px'}}>
          Order Details
        </Box>
        <Paper>
          <Box sx={{display:'flex', flexDirection:'column', padding:'10px'}}>
            <Box sx={{marginBottom:'5px', fontSize:'20px', fontWeight:'bold'}}>
              {clientDet.name}
            </Box>
            <Box sx={{marginBottom:'5px'}}>
              {clientDet.mobileNo}
            </Box>
            <Box sx={{marginBottom:'5px'}}>
              {clientDet.email}
            </Box>
            <Box sx={{marginBottom:'20px'}}>
              {clientDet.address}
            </Box>
            <Box style={styles.menuItemCont} onClick={() => goToMap()}>
              <img src={Navigate} style={styles.menuImg}/>
            </Box>
            <Box sx={{paddingBottom:'5px', borderBottom:'1px solid #eaeaea', fontSize:'17px', fontWeight:'500'}}>
              Staff Details
            </Box>
            <Box sx={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
              <Box sx={{display:'flex', flexDirection:'column'}}>
                <Box sx={{margin:'5px 0'}}>
                  {clientDet.staffName}
                </Box>
                <Box>
                  {clientDet.staffMobile}
                </Box>
              </Box>
              <Box sx={{marginTop:'10px'}}>
                <CallIcon style={styles.circleIcon} onClick={() => callMe(clientDet.staffMobile)}/>
              </Box>
            </Box>
            
            <Box sx={{paddingBottom:'5px', borderBottom:'1px solid #eaeaea', marginTop:'15px', fontSize:'17px', fontWeight:'500'}}>
              Delivery Contact Details
            </Box>
            <Box sx={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
              <Box sx={{display:'flex', flexDirection:'column'}}>
                <Box sx={{margin:'5px 0'}}>
                  {clientDet.deliveryContactName}
                </Box>
                <Box>
                  {clientDet.deliveryContactNo}
                </Box>
              </Box>
              <Box sx={{marginTop:'10px'}}>
                <CallIcon style={styles.circleIcon} onClick={() => callMe(clientDet.deliveryContactNo)}/>
              </Box>
            </Box>
          
          </Box>
        </Paper>
        <Paper sx={{padding:'15px', marginBottom:'15px', marginTop:'10px'}}>

        {
            Object.keys(location.state.orderItems).map((mainItem, index) => {
              return <Box sx={{fontSize:'20px'}} key={index}> <b>{mainItems[mainItem]}</b>  
                {
                  Object.keys(location.state.orderItems[mainItem]).map((subItem, index) => {
                    return <Box sx={{fontSize:'18px', display:'flex', flexDirection:'column', marginTop:'10px', marginBottom:'20px', justifyContent:'space-between', padding:'0 20px'}} key={index}>
                    <b>{subItems[subItem]}</b>  
                    {
                      Object.keys(location.state.orderItems[mainItem][subItem]).map((volume, index) => {
                        return <Box sx={{display:'flex', fontSize:'20px', marginTop:'2px', justifyContent:'space-between'}} key={index}> 
                          <Box>
                            {volumes[volume]}
                          </Box>
                          <Box>
                          ₹ {location.state.orderItems[mainItem][subItem][volume]} /-
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
            !Object.keys(location.state.orderItems).length ? "No items added" : 
            <Box sx={{display:'flex', fontSize:'20px', marginTop:'2px', justifyContent:'space-between', padding:'20px', borderTop:'1px solid #eaeaea'}}>
              <Box>Total</Box> <Box> ₹ {location.state.orderPrice} /-</Box> 
            </Box>
          }

          {/* <Box sx={{display:'flex', fontWeight:'bold'}} mb={1}>
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
            location.state.orderItems.map((item, index) => {
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
                location.state.orderItems.reduce((accumulator, item) => {
                  return accumulator + item.itemQty;
                }, 0)
              }
            </Box>
            <Box sx={{width:'20%'}}>
              {
                location.state.orderItems.reduce((accumulator, item) => {
                  return accumulator + (item.itemPrice * item.itemQty);
                }, 0)
              }
            </Box> */}
          {/* </Box> */}
        </Paper>   

        <Paper sx={{padding:'15px', marginBottom:'15px', marginTop:'15px'}}>
          Order Status : {location.state.status}
          <Box sx={{marginTop:'10px'}}>
            <FormControl fullWidth>  
            <InputLabel id="demo-select-small">Change Status</InputLabel>
              <Select
                value={orderStatus}
                labelId="demo-select-small"
                placeholder="Status"
                required
                defaultValue={location.state.status}
                onChange={(e) => setOrderStatus(e.target.value)}
                label="Status">
                <MenuItem value={'CREATED'}>Created</MenuItem>
                <MenuItem value={'PROCESSING'}>Processing</MenuItem>
                <MenuItem value={'IN_TRANSIT'}>In Transit</MenuItem>
                <MenuItem value={'DELIVERED'}>Delivered</MenuItem>
                <MenuItem value={'CANCELLED'}>Cancelled</MenuItem>
              </Select>
            </FormControl>
          </Box>
          <Box sx={{display:'flex', justifyContent:'center', marginTop:'15px'}}>
            <Button variant="contained" onClick={() => changeOrderStatus()}>
              Submit
            </Button>
          </Box>
        </Paper>     
        </Box>
      }
        
    </Box>
  )
}

export default OrderDetails
