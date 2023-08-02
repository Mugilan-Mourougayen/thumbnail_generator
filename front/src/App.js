
import {useState} from "react"
import './App.css';
import axios from "axios"
function App() {
  const [video,setVideo]=useState()
  const handlechsnge=(e)=>{
    console.log(e.target.files[0])
    setVideo(e.target.files[0])
  }

  const postvideo=async()=>{
    if(video){
      const formData = new FormData();
      formData.append('video', video);
      const response = await axios.post('http://127.0.0.1:5000/', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
      console.log(response)
    }
    else{
      alert("no video uploaded")
    }
  }
  return (
    <div className="App">
      <header className="App-header">
        <button>
        <input type="file" accept=".mp4" onChange={handlechsnge} />
        </button>

          <video>
          <source src={video} type="video/mp4" />
          </video>
          <button onClick={postvideo}>send</button>
      </header>
    </div>
  );
}

export default App;
