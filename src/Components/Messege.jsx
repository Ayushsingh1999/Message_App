import React from 'react'
import { HStack,Avatar,Text } from "@chakra-ui/react";

const Messege = ({text,url,user="other"}) => {
  return (
       
 <HStack bg="gray.100" borderRadius={"base"} paddingX={'4'} paddingY={user==="me"?"4":"2"} alignSelf={user === "me" ? "flex-end":"flex-start"}>
    {
        user==="other" && <Avatar src ={url} />
    }
        <Text>{text}</Text>
    {
        user==="me" && <Avatar src ={url} />
    }

 </HStack>

  )
}

export default Messege;