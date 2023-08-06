import {useState,useRef} from "react"
import './App.css';
import axios from "axios"

import Card from '@mui/material/Card';
import CardMedia from '@mui/material/CardMedia';
import { Button, CardActionArea, CardActions, Input } from '@mui/material';

function App() {
  const [video,setVideo]=useState(null)
  const [image,setImage]=useState(null)
  let save=false
  const count=useRef(1)
  const handlechsnge=(e)=>{
    console.log(e.target.files[0])
    setVideo(e.target.files[0])
    console.log(video)
  }

const previousframe=()=>{
  console.log(count)
  count.current = count.current -1
    console.log(count)
    postvideo()

}

const saveing=()=>{
  save = true
  postvideo()

}


const nxtframe =()=>{
  console.log(count)
  count.current = count.current +1
    console.log(count)
    postvideo()

  
}
const postvideo = () => {
    if (video) {
      console.log(video)
      const formData = new FormData();
      formData.append('video', video);

      axios.post(`http://localhost:5000/?count=${count.current}&save=${save}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        responseType: 'arraybuffer', 
      })
      .then(response => {
        // console.log(response)
        const imageBase64 = btoa(new Uint8Array(response.data)
          .reduce((data, byte) => data + String.fromCharCode(byte), ''));

        setImage('data:image/jpeg;base64,' + imageBase64);
        save =false
      })
      .catch(error => {
        console.error('Error posting video:', error);
      });
    } else {
      alert("No video uploaded");
    }

}
  return (
    <div className="App">
      <header className="App-header">
      
        <Input type="file" accept=".mp4" onChange={handlechsnge} />
      
<br/>
          {video && (
            <>
<video controls>
            <source src={URL.createObjectURL(video)} type="video/mp4" />
        </video>
          <Button onClick={postvideo} variant="contained">send</Button>
          <br/>
            </>
          )}

{image &&          
      
<Card sx={{ maxWidth: 550, minWidth:350}} style={{borderRadius:"20px"}}>
<CardActionArea>
  <CardMedia
    component="img"
    height="350"
    
    alt="green iguana"
    src={image}
  />

</CardActionArea>
<CardActions style={{justifyContent: "space-between",}}>
<Button size="small" color="primary" onClick={previousframe} disabled={count.current <= 1 && true}>
    previous
  </Button>
  <Button size="small" onClick={saveing} color="primary">
    Save
  </Button>
  <Button size="small" color="primary" onClick={nxtframe} disabled={count.current >= 5 && true}>
    next
  </Button>
</CardActions>
</Card>


}
        
      </header>
    </div>
  );
}

export default App;
