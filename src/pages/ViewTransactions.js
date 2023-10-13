import { TextField, Button, Box, createMuiTheme, useTheme, FormControl, Paper } from '@mui/material'
import { useForm } from "react-hook-form";
import { useLocation, useNavigate } from 'react-router-dom';
import ComponentLoader from '../components/ComponentLoader';
import { useContext, useEffect, useState } from 'react';
import CallIcon from '@mui/icons-material/Call';
import { getOrders, getTransactionData } from '../services/api';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import InsertInvitationIcon from '@mui/icons-material/InsertInvitation';
import InputAdornment from '@mui/material/InputAdornment';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { CommonContext } from '../contexts/CommonContext';


function ViewTransactions() {

  const navigate = useNavigate()
  const location = useLocation()

  const { register, handleSubmit, control, reset, formState : {errors:errors} } = useForm()
  const { showLoader, hideLoader, showAlert, showSnackbar } = useContext(CommonContext)
  const [transactions, setTransactions] = useState([])
  const [dateTime, setDateTime]         = useState()

  useEffect(() => {
    console.log(location.state)
  }, [])

  const getUserTransactionData = async(formData) => {

    // if (!dateTime) {
    //   showSnackbar("Please select date and time", "error")
    //   return
    // }

    

    showLoader()
    // let selectedDate = new Date(dateTime)
    // selectedDate.setHours(0,0,0,0)
    let data = {
      userId : formData.mobileNo
    }
    // if (location?.state?.clientId) data.clientId = location.state.clientId

    getTransactionData(data).then((response) => {
      console.log(response)
      setTransactions(response.transactions)
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
          <form onSubmit={handleSubmit(getUserTransactionData)} key={1}>
          <Box mb={3}>
                <TextField
                  placeholder="Enter your mobile number"
                  label="Mobile Number"
                  variant="outlined"
                  
                  autoComplete='off'
                 
                  type="number"
                  name="mobileNo"
                  {...register("mobileNo", {
                    required: "Required field",
                    pattern: {
                      value: /^[7896]\d{9}$/,
                      message: "Invalid mobile number",
                    },
                  })}
                  error={Boolean(errors?.mobileNo)}
                  helperText={errors?.mobileNo?.message}
                />
              </Box>
              <Box mt={1}>
            <Button type="submit" variant="contained" color="primary">
              Search
            </Button>
          </Box>
              </form>
            
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
            transactions.length ? 
            <Box>
              {
                transactions.map((item, index) => {
                  return <Paper sx={{display:'flex', flexDirection:'column', margin:'10px 0', padding:'10px'}}
                  onClick={() => navigate('/orderDetail', {state : item})} key={index}>
                  <Box mb={1} sx={{fontWeight:'bold'}}>
                    Mobile Number :&nbsp;
                    {item.custMobile}
                  </Box>
                  <Box mb={1}>
                    Transaction Initiated At : &nbsp;
                    {new Date(item.inititatedAt).toLocaleString()}
                  </Box>
                  <Box mb={1}>
                    Status : &nbsp;
                    {item.status}
                  </Box> 
                  <Box mb={1}>
                    Order Id : &nbsp;
                    {item.orderId}
                  </Box> 
                  <Box mb={1}>
                    Platform : &nbsp;
                    {item.platform}
                  </Box> 
                  <Box mb={1}>
                    Order Amount : &nbsp;
                    {item.orderAmount}
                  </Box>
                  <Box mb={1}>
                    Order Data : &nbsp;
                    {item.orderData}
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

export default ViewTransactions
