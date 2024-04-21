import { Box, Button, Input, Modal } from '@material-ui/core';
import React, { useState, useEffect } from 'react';
import Post from './components/Post';
import { auth, db } from "./Firebase"
import "./App.css"
import SignIn from './components/SignIn';
import style from './style';
import ImageUpload from './components/ImageUpload';
import InstagramEmbed from 'react-instagram-embed';

function App() {
  const [posts, setPosts] = useState([]);
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useState(null);

  useEffect(() => {
    db
      .collection('posts')
      .orderBy("timestamp", "desc")
      .onSnapshot(snapshot => {
        setPosts(snapshot.docs.map(doc =>
        ({
          id: doc.id,
          post: doc.data()
        })
        ))
      })
  }, [posts])

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((authUser) => {
      if (authUser) {
        console.log(authUser)
        console.log(user)
        setUser(authUser)
        setUserName(authUser.displayName)
      }
      else {
        setUser(null)
      }
    })

    return () => {
      unsubscribe();
    }
  }, [userName, user])

  const submitDetails = (event) => {
    event.preventDefault();
    auth.createUserWithEmailAndPassword(email, password)
      .then((authUser) => {
        return authUser.user.updateProfile({
          displayName: userName
        })
      })
      .catch((error) => {
        alert(error.message);
      })
    setOpen(false);
  }

  return (
    <div>
      <div>
        <div className='page_header'>
          <h2>Instagram</h2>
          {
            (user) ?
              <Button onClick={() => auth.signOut()}>Log Out</Button>
              :
              <>
                <Button onClick={() => setOpen(true)}>Sign Up</Button>
                <SignIn
                  email={email}
                  password={password}
                  setEmail={setEmail}
                  setPassword={setPassword} />
              </>
          }
        </div>

        <Modal
          open={open}
          onClose={() => setOpen(false)}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={style}>
            <form className="app__form">
              <Input
                placeholder="User Name"
                onChange={e => setUserName(e.target.value)}
                value={userName}
              />
              <Input
                placeholder="Email"
                onChange={e => setEmail(e.target.value)}
                value={email}
              />
              <Input
                placeholder="password"
                onChange={e => setPassword(e.target.value)}
                value={password}
                type="password"
              />
              <Button type="submit" onClick={submitDetails}>
                Sign Up
              </Button>
            </form>
          </Box>
        </Modal>
        <div className="app__posts">
          {
            posts.map(({ id, post }) => {
              return <Post signInUser={userName} postId={id} key={id} userName={post.userName}
                imageUrl={post.imageUrl}
                caption={post.caption} />
            })
          }
          <InstagramEmbed
            url={"https://www.instagram.com/p/COHlpSIs6WD/"}
            clientAccessToken={"1068148143638626|a9b9853d87fb33cdc31ac2ad0426818d"}
            maxWidth={20}
            hideCaption={true}
            containerTagName="div"
            protocol=""
            injectScript
            onLoading={() => { }}
            onSuccess={() => { }}
            onAfterRender={() => { }}
            key={"https://www.instagram.com/p/COHlpSIs6WD/"}
          />
        </div>
        {user && user.displayName
          ?
          <ImageUpload userName={user.displayName} />
          :
          <p>You need to sign in for uploading posts</p>
        }
      </div>
    </div>
  );
}
export default App;