import React,{useEffect, useState} from 'react'
import axios from "axios"
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';
import ImageListItemBar from '@mui/material/ImageListItemBar';
import { Button } from '@mui/material';
import './App.css';
const List = () => {
    const [list,setList]=useState([])
    const [image,setImage]=useState(null)
    const [videoUrl, setVideoUrl] = useState('');


    useEffect(()=>{
        axios.get(`http://localhost:5000/list_files`, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
       
      })
      .then(response => {

        console.log(response)
        setList(response.data)      })


    },[])

    const shorten =(string,val)=>{
        if (string.length> val){
            return string.slice(0,val)+"..."
        }
        else {
            return string
        } 
    }
    const select =(item)=>{
        console.log(item)
        setImage(item);

    }
    const getVideo = () => {

        const backendUrl = `http://localhost:5000/video?image_name=${image}`; 
        fetch(backendUrl)
      .then(response => response.blob())
      .then(blob => {
        setVideoUrl(blob);
        console.log(blob)
      })
      .catch(error => {
        console.error('Error fetching video:', error);
      });

      };
    

  return (
   
    <div className="App">
    <header className="App-header">
        <Autocomplete
      disablePortal
      id="combo-box-demo"
      options={list}
      value={image}
      onChange={(event, newValue) => {
        setImage(newValue);
      }}
      sx={{ width: 300 }}
      renderInput={(params) => <TextField {...params} label="Image Name" />}
    />

   {image &&

       <Button variant="contained" onClick={getVideo}>
        get Video
    </Button>
    }
<br/>
{videoUrl && (
        <video controls height="500">
          <source src={URL.createObjectURL(videoUrl)} type="video/mp4" />
        </video>
      )}


<h1>List of Images:</h1>
   


      <ImageList sx={{ width: 500, height: 450 }} cols={3} rowHeight={164}>
      {list.map((item) => (
        <ImageListItem key={item} onClick={()=>select(item)}>
          <img
            src={`http://localhost:5000/images/${item}?w=164&h=164&fit=crop&auto=format`}
            srcSet={`http://localhost:5000/images/${item}?w=164&h=164&fit=crop&auto=format&dpr=2 2x`}
            alt={item.title}
            loading="lazy"
          />
          <ImageListItemBar
            title={shorten(item, 10)} 
            position="below"
          />
        </ImageListItem>
      ))}
    </ImageList>
    </header>
    </div>
  )
}

export default List











