import { Box,Container,VStack,Button,HStack,Input} from "@chakra-ui/react";
import Messege from "./Components/Messege";
import {onAuthStateChanged, getAuth,GoogleAuthProvider,signInWithPopup,signOut } from "firebase/auth";
import { app } from "./firebase";
import { useEffect, useRef, useState } from "react";

import { getFirestore,addDoc, collection, serverTimestamp,onSnapshot,query ,orderBy} from "firebase/firestore";



const auth = getAuth(app)
const db = getFirestore(app);


const loginHandler = ()=>
{
  const provider = new GoogleAuthProvider();

  signInWithPopup(auth,provider)
}

const LogOutHandler =()=>
{
   signOut(auth);
}




function App() {

 


const [user,setuser] = useState(false);

const [message,setmessage] = useState("");

const [Messages,setmessages] = useState([]);

const divforscroll = useRef(null);


const submitHandler = async (e)=>
{
  e.preventDefault();
  try {

   await addDoc(collection(db ,"Messages"),{text:message,uid:user.uid,uri:user.photoURL,createdAt:serverTimestamp()});

   setmessage("");

   divforscroll.current.scrollIntoView({behaviour : "smooth"});

  } catch (error) {
      alert(error)
  }
}

useEffect(()=>
{

const q = query(collection(db,"Messages"),orderBy("createdAt","asc"));

 const Unsubscribe=onAuthStateChanged(auth,(data)=>
 {
  setuser(data);
 });


const unsubscribeforMessage = onSnapshot(q,(snap)=>{
  setmessages(snap.docs.map((item)=>
  { 
    const id = item.data();
    return {id,...item.data()}
  }))
 })


 return()=>
 {
  Unsubscribe();
  unsubscribeforMessage();
}
 
},[])


  return <Box bg={"red.50"}>
    {
      user?(
        <Container height ={"100vh"}bg={'white'}>     
       <VStack h="full" paddingY={'4'}>
        <Button colorScheme={"red"} w={'full'} onClick={LogOutHandler}>LogOut</Button>

              
       <VStack height={'full'} width={'full'} overflow={"auto"} css={{"&::-webkit-scrollbar":{display:"none"}}}>
       { 
       Messages.map((item)=>
       (
        <Messege key={item.id} user={item.uid===user.uid?"me":"other"} text ={item.text} uri={item.uri}/>
       ))
       }
        <div ref={divforscroll}></div>
       </VStack>
        <form style={{width:'100%'}} onSubmit={submitHandler}>
       <HStack>
        <Input value={message} onChange={(e)=>setmessage(e.target.value)} placeholder={"Enter the message"}/>
        <Button colorScheme={'purple'} type={'submit'}>Send</Button>
       </HStack>
       </form>
       </VStack>
      
       
    </Container>
      ):<VStack justifyContent={"center"} h={"100vh"} bg={"white"} >
        <h2>CHAT APP</h2>
        <Button bg={"red.100"} transformY={'-10px'} transition={"all 0.5s"} onClick={loginHandler}>Sign in with Google</Button>
      </VStack>
    }
  </Box>
}

export default App;
