import { TextField, Button, Box, createMuiTheme, useTheme, FormControl, Paper } from '@mui/material'
import { useForm } from "react-hook-form";
import { json, useLocation, useNavigate } from 'react-router-dom';
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
  const [orderDataInfo, setOrderDataInfo]         = useState()

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
      let newTxnResponse = []
      response.transactions.map((txn) => {
        txn.orderData = JSON.parse(txn.orderData)
        //txn.addressDetails=JSON.parse(txn.addressDetails)
        // txn.storeDetails=JSON.parse(txn.storeDetails)
        newTxnResponse.push(txn)
      })
      setTransactions(newTxnResponse)
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
                  Transaction Id  : &nbsp;
                     {item.txnId} 
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
                    {item.orderAmount}{' ₹'}
                  </Box>
                  <Box mb={1}>
                  Payment Mode : &nbsp;
                     {item.orderData?.paymentMode}
                  </Box> 

                  <Box mb={1}>
                   Delivery Type : &nbsp;
                     {item.orderData?.deliveryType}
                  </Box>
                  <Box mb={1}>
                   Shipping Cost : &nbsp;
                     {item.orderData?.shippingCost}{' ₹'}
                  </Box> 

                  <Box mb={1}>
                   Order Status : &nbsp;
                     {item.orderData?.status}
                  </Box> 
                  <Box mb={1}>
                   Customer Name : &nbsp;
                     {item.orderData?.addressDetails?.userName} 
                     
                  </Box> 
                  <Box mb={1}>
                   Address Details : &nbsp;
                     {item.orderData?.addressDetails?.houseDetails} {', '}
                     {item.orderData?.addressDetails?.landmark} {', '}
                     {item.orderData?.addressDetails?.streetDetails} {', '}
                     {item.orderData?.addressDetails?.pincode}
                  </Box> 

                  <Box mb={1}>
                   Coupon Code : &nbsp;
                     {item.orderData?.couponCode} 
                  </Box> 

                  <Box mb={1}>
                   Coupon Discount Amount : &nbsp;
                     {item.orderData?.couponDiscountAmount} 
                  </Box>
                  <Box mb={1}>
                   Store Name : &nbsp;
                   {item.orderData?.storeDetails?.storeName}
                  </Box>
                  

                  <Box mb={1}>
                   Product Information : &nbsp;
                     {/* {item.orderData?.itemDetails[0]?.name}  */}
                  
                  
                  
                  {item.orderData?.itemDetails.map((data, index) => (
                <Box mb={1} key={index}>
                 
                 Name :{data?.name}{', '}Price : {data?.price}{', '}Qty: {data?.count}{','}
                </Box>
              ))}
</Box> 
                   

                  
                  {/* {item.orderData?.addressDetails && item.orderData?.addressDetails.map(data=>{
                    <Box mb={1}>
                    Order Data : &nbsp;
                    {data}
                  </Box>
                  })} */}
                              
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
