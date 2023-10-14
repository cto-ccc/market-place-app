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
      customerId: "2576",
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
        Customer Transactions
      </Box>
      <Box mb={3} mt={2}>
          <Box mb={1}>
            Select delivery date and time
          </Box>
         
          <Box mb={3}>
                <TextField
                  placeholder="Enter your mobile number"
                  label="Mobile Number"
                  variant="outlined"
                  
                  autoComplete='off'
                 
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
                        
          <LocalizationProvider dateAdapter={AdapterDayjs}>
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
          </LocalizationProvider>
          
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
                  {/* <Box mb={1}>
                    Transaction Initiated At : &nbsp;
                    {new Date(item.order_date).toLocaleString()}
                  </Box> */}
                  {/* <Box mb={1}>
                    Payment Status : &nbsp;
                    {item.payment_status}
                  </Box> 
                  <Box mb={1}>
                    Email : &nbsp;
                    {item.email}
                  </Box> 
                  <Box mb={1}>
                    Mobile : &nbsp;
                    {item.phone}
                  </Box> 
                  <Box mb={1}>
                    Payment Method : &nbsp;
                    {item.payment_method}
                  </Box> */}
                  {/* <Box mb={1}>
                    Product Data : &nbsp;
                    {item.products}
                  </Box>              */}
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
