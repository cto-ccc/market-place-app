import React, { useEffect, useState } from 'react';
import { Box , Button, TextField } from '@mui/material';
import {useForm } from "react-hook-form"

const EditProductPrice = () => {
  const [productDetails, setProductDetails] = useState([]);
  const {handleSubmit : updateProductSubmit , formState : {errors : productError} , register : registerProducts} = useForm()

  useEffect( async()=>{
    const newDetails = await fetch(`https://api.countrychickenco.in/v2/getLanding` , {
      method : "POST",
      headers : {
        "Content-Type" : "application/json",

      },
      body : JSON.stringify({"userData" : {
        "packageVersion": "6.0.0",
        "platform": "web",
        "userMobile" : null
      }})
    })
    const data = await newDetails.json();
    setProductDetails(data.productsData)
  },[])

  


const onUpdateSubmit  = ()=>{

}

  return (
    <>

        <form onSubmit={updateProductSubmit(onUpdateSubmit)} style={{ maxWidth : "500px" , margin: "auto"}}>
            {productDetails.map((eachdetail)=>{
              return(<Box mt={"80px"}  flex flexDirection={"column"}>
              <Box sx={{fontSize:'20px', pb:1, mb:2 , borderBottom:'1px solid #eaeaea' , fontWeight : "600"}}>
                Product Details
              </Box>
                <Box mb={3} sx={{display : "flex" , flexDirection : "column" , gap : "10px"}}>
                  <TextField
                    label="Title"
                    variant="outlined"
                    
                    autoFocus
                    autoComplete='off'
                    name="title"
                    value={eachdetail.title}
                    {...registerProducts("title", {
                      required: "Required field"
                    })}
                    error={Boolean(productError?.title)}
                    helperText={productError?.title?.message}
                  />
                  <TextField
                    label="MRP"
                    variant="outlined"
                    type='number'
                    autoFocus
                    autoComplete='off'
                    name="mrp"
                    value={eachdetail.data.mrp}
                    {...registerProducts("mrp", {
                      required: "Required field"
                    })}
                    error={Boolean(productError?.mrp)}
                    helperText={productError?.mrp?.message}
                  />
                  <TextField
                    label="Price"
                    variant="outlined"
                    type='number'
                    autoFocus
                    autoComplete='off'
                    name="price"
                    value={eachdetail.data.price}
                    {...registerProducts("price", {
                      required: "Required field"
                    })}
                    error={Boolean(productError?.price)}
                    helperText={productError?.price?.message}
                  />
                </Box>
                <Button variant='contained' >Update</Button>
          
            </Box>
            )})}
        </form>
    </>
  );
};

export default EditProductPrice;
