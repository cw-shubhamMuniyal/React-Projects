import { Button, Input } from '@material-ui/core'
import React, { useState } from 'react'
import { db, storage } from '../Firebase';
import firebase from 'firebase';
import "../Imageupload.css"

function ImageUpload({userName}) {
    const [image, setImage] = useState("");
    const [progress, setProgress] = useState(0);
    const [caption, setCaption] = useState("");

    const handleChange = (event) => {
        if(event.target.files[0]) {
            setImage(event.target.files[0]);
        }
    }
    const uploadPost = (event) => {
        event.preventDefault();
        const uploadTask = storage.ref(`images/${image.name}`)
            .put(image);
        uploadTask.on(
            "state_changed",
            (snapshot) => {
                const progress = Math.round(
                    (snapshot.bytesTransferred / snapshot.totalBytes) * 100 
                )
                setProgress(progress)
            },
            (error) => {
                console.log(error)
                alert(error.message)
            },
            (complete) => {
                storage
                    .ref("images")
                    .child(image.name)
                    .getDownloadURL()
                    .then(url => {
                        db.collection("posts").add({
                            timestamp: firebase.firestore.FieldValue.serverTimestamp(),
                            caption: caption,
                            imageUrl: url,
                            userName: userName
                        })
                    })
                setProgress(0)
                setCaption("")
                setImage("")
            })
    }
    return (
    <form className='imageupload'>
        <progress max="100" value={progress} />
        <Input type='file' onChange={handleChange}/>
        <Input type="text" placeholder='Enter caption' value={caption} onChange={(event) => setCaption(event.target.value)}/>
        <Button type="button" onClick={uploadPost}>Upload</Button>
    </form>
    );
}

export default ImageUpload