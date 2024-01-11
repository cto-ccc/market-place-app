import React, { useEffect, useState } from 'react';
import { Box , TextField } from '@mui/material';
import {useForm } from "react-hook-form"

const EditProductPrice = () => {
  const [productDetails, setProductDetails] = useState(0);
  const {handleSubmit : updateProductSubmit , formState : {errors : productError} , register : registerProducts} = useForm()

  useEffect( async()=>{
    const newPrice = await fetch(`https://api.countrychickenco.in/v2/getLanding` , {
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
    const data = await newPrice.json();
    setProductDetails(data)
  },[])

  console.log(productDetails);


const onUpdateSubmit  = ()=>{

}

  return (
      <form onSubmit={updateProductSubmit(onUpdateSubmit)} style={{ maxWidth : "500px" , margin: "auto"}}>
          <Box mt={"70px"}  flex flexDirection={"column"}>
          <Box sx={{fontSize:'20px', pb:1, mb:2, borderBottom:'1px solid #eaeaea'}}>
            Product Details
          </Box>
            <Box mb={3}>
              <TextField
                label="Title"
                variant="outlined"
                
                autoFocus
                autoComplete='off'
                name="title"
                value={productDetails.title}
                {...registerProducts("title", {
                  required: "Required field"
                })}
                error={Boolean(productError?.title)}
                helperText={productError?.title?.message}
              />
              <TextField
                label="MRP"
                variant="outlined"
                
                autoFocus
                autoComplete='off'
                name="mrp"
                value={productDetails.title}
                {...registerProducts("mrp", {
                  required: "Required field"
                })}
                error={Boolean(productError?.title)}
                helperText={productError?.title?.message}
              />
              <TextField
                label="Price"
                variant="outlined"
                
                autoFocus
                autoComplete='off'
                name="price"
                value={productDetails.title}
                {...registerProducts("price", {
                  required: "Required field"
                })}
                error={Boolean(productError?.title)}
                helperText={productError?.title?.message}
              />
            </Box>
          </Box>  
      </form>
  );
};

export default EditProductPrice;
