import { TextField, Button, Box, createMuiTheme, useTheme, FormControl, Paper } from '@mui/material'
import { useForm } from "react-hook-form";
import { useLocation, useNavigate } from 'react-router-dom';
import ComponentLoader from '../components/ComponentLoader';
import { useContext, useEffect, useState } from 'react';
import CallIcon from '@mui/icons-material/Call';
import { getOrders, getTransactionData, getViewCustomerOrdersData } from '../services/api';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import InsertInvitationIcon from '@mui/icons-material/InsertInvitation';
import InputAdornment from '@mui/material/InputAdornment';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { CommonContext } from '../contexts/CommonContext';


function ViewCustomerOrders() {

  const navigate = useNavigate()
  const location = useLocation()

  const { register, handleSubmit, control, reset, formState : {errors:errors} } = useForm()
  const { showLoader, hideLoader, showAlert, showSnackbar } = useContext(CommonContext)
  const [customerOrders, setCustomerOrders] = useState([])
  const [dateTime, setDateTime]         = useState()
  const [mobileNo, setMobileNo] = useState('')

  useEffect(() => {
    
    console.log(location.state)
  }, [])

  const getUserOrdersData = async() => {

    // if (!dateTime) {
    //   showSnackbar("Please select date and time", "error")
    //   return
    // }

    showLoader()
    // let selectedDate = new Date(dateTime)
    // selectedDate.setHours(0,0,0,0)
    let data = {
      customerId: mobileNo,
    };
    // if (location?.state?.clientId) data.clientId = location.state.clientId

    getViewCustomerOrdersData(data).then((response) => {
      console.log(response)
      setCustomerOrders(response)
      hideLoader()
    })

  }

  return (
    
    <Box sx={{padding:'4vw'}}>
      <Box mb={2} mt={4} sx={{fontSize:'20px', fontWeight:'bold'}}>
        Customer Orders
      </Box>
      <Box mb={3} mt={2}>
          {/* <Box mb={1}>
            Select delivery date and time
          </Box> */}
         
          <Box mb={3}>
                <TextField
                  placeholder="Enter customer mobile number"
                  label="Mobile Number"
                  variant="outlined"
                  
                  autoComplete='off'
                  onChange={(event) => setMobileNo(event.target.value)}

                  type="number"
                  name="mobileNo"
                  // {...register("mobileNo", {
                  //   required: "Required field",
                  //   pattern: {
                  //     value: /^[7896]\d{9}$/,
                  //     message: "Invalid mobile number",
                  //   },
                  // })}
                  // error={Boolean(errors?.mobileNo)}
                  // helperText={errors?.mobileNo?.message}
                />
              </Box>
              <Box mt={1}>
            <Button  variant="contained" onClick={() => getUserOrdersData()}>
              Search
            </Button>
          </Box>
                        
          {/* <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DateTimePicker
              renderInput={(props) => <TextField sx={{width:'100%'}} {...props} />}
              inputFormat="DD/MM/YYYY"
              value={dateTime}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="end">
                    <InsertInvitationIcon />
                  </InputAdornment>
                )
              }}
              
              onChange={(newValue) => {
                setDateTime(newValue)
              }}
            />
          </LocalizationProvider> */}
          
        </Box>
        <Box>
          {
            customerOrders.length ? 
            <Box>
              {
                customerOrders.map((item, index) => {
                  return <Paper sx={{display:'flex', flexDirection:'column', margin:'10px 0', padding:'10px'}}
                  onClick={() => navigate('/orderDetail', {state : item})} key={index}>
                  <Box mb={1} sx={{fontWeight:'bold'}}>
                     Name :&nbsp;
                    {item.f_name}
                  </Box>
                  <Box mb={1} sx={{textTransform:'capitalize'}}>
                    Order ID : {item.order_id}
                  </Box>  
                  <Box mb={1} sx={{textTransform:'capitalize', color:'#a4243d'}}>
                    Status : {item.order_status}
                  </Box>  
                  <Box mb={1} sx={{fontWeight:'bold'}}>
                   ₹ {item.order_amount + item.shipping_cost}
                  </Box>
                  <Box mb={1} sx={{fontSize:'10px'}}>
                    {item.order_date}
                  </Box>


          <Box sx={{display:'flex', flexDirection:'column', mb:2}}>
            <Box sx={{width:'60%', marginTop:'10px'}}>
              Delivery Address: 
            </Box>
            <Box sx={{width:'100%', marginTop:'2px'}}>
              { item.shippingAddressDataa.length > 0 &&
                item.shippingAddressDataa[0].contact_person_name + ', ' 
                +  item.shippingAddressDataa[0].address + ', ' 
                +  item.shippingAddressDataa[0].city + ', '
                + item.shippingAddressDataa[0].state + ', '
                + item.shippingAddressDataa[0].zip
              }
            </Box>
          </Box>

          {
            item.deliveryPersonInfo?.length ?
            <Box sx={{mb:2}}>
              <Box>
                Delivery Partner Assigned :                     
              </Box>
              <Box>
                { item.deliveryPersonInfo[0].firstName + ' ' + item.deliveryPersonInfo[0].lastName}
              </Box>
              <Box>
                { item.deliveryPersonInfo[0].phone}
              </Box>
            </Box> : null
          } 


          <Box sx={{display:'flex', fontWeight:'bold', fontSize:'12px'}} mb={1}>
            <Box sx={{width:'50%'}}>
              Item Name
            </Box>
            <Box sx={{width:'15%'}}>
              Price
            </Box>
            <Box sx={{width:'15%', textAlign:'center'}}>
              Qty
            </Box>
            <Box sx={{width:'20%', textAlign:'right'}}>
              Total
            </Box>
          </Box>
          

                  {
            item.products.map((item, index) => {
              return <Box key={index} sx={{display:'flex', fontSize:'12px'}} mb={1}>
                <Box sx={{width:'50%', textTransform:'capitalize'}}>
                  {item.name.toLowerCase()}
                </Box>
                <Box sx={{width:'15%'}}>
                ₹{item.price}
                </Box>
                <Box sx={{width:'15%', textAlign:'center'}}>
                  {item.quantity}
                </Box>
                <Box sx={{width:'20%', textAlign:'right'}}>
                ₹ {item.quantity * item.price}
                </Box>









              </Box>
            })
          }



<Box sx={{display:'flex', borderTop:'1px solid #eaeaea', justifyContent:'space-between', fontSize:'12px'}} pt={2}>
            <Box sx={{width:'50%'}}>
            Coupon Discount
            </Box>
            <Box sx={{width:'15%'}}>

            </Box>
            <Box sx={{width:'20%', textAlign:'right'}}>
            - ₹ {
                (item?.coupon_discount_amount || 0)
              }
            </Box>
          </Box>


          <Box sx={{display:'flex', justifyContent:'space-between', fontSize:'12px'}} mt={1}>
            <Box sx={{width:'50%'}}>
            Delivery Cost 
            </Box>
            <Box sx={{width:'15%'}}>

            </Box>
            <Box sx={{width:'20%', textAlign:'right'}}>
             ₹ {
                item?.shipping_cost
              }

            </Box>
          </Box>


          <Box sx={{display:'flex', fontWeight:'bold', borderTop:'1px solid #eaeaea', fontSize:'12px'}} mt={1} pt={1}>
            <Box sx={{width:'50%'}}>
              Total
            </Box>
            <Box sx={{width:'15%'}}>

            </Box>
            <Box sx={{width:'15%', textAlign:'center'}}>
              &nbsp;
            </Box>
            <Box sx={{width:'20%', textAlign:'right'}}>
             ₹ {
                item.order_amount + item.shipping_cost
              }
            </Box>
          </Box>


                </Paper>
                })
              }
            </Box> : 
            <Box>
              <Paper sx={{padding:'20PX 0', textAlign:'center', marginTop:'10px'}}>
                No orders found
              </Paper> 
            </Box>
            
          }
        </Box>
    </Box>
  )
}

export default ViewCustomerOrders
