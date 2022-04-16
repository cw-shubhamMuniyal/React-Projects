import { Avatar } from '@material-ui/core';
import React, {useEffect, useState} from 'react'
import "../Post.css"
import {db} from "../Firebase"
import firebase from 'firebase';

function Post( { signInUser, postId, userName, caption, imageUrl } ) {
  const [comments, setComments] = useState([])
  const [comment, setComment] = useState([""])

  useEffect(() => {
    let unSubscribe;
    if(postId) {
      unSubscribe = db
                    .collection("posts")
                    .doc(postId)
                    .collection("comments")
                    .orderBy("timestamp", "desc")
                    .onSnapshot((snapshot) => {
                      setComments(snapshot.docs.map((doc) => doc.data()))
                    })
    }
  
    return () => {
      unSubscribe()
    }
  }, [postId])

  const postComment = (event) => {
    event.preventDefault();
    if(signInUser) {
      db
      .collection("posts")
      .doc(postId)
      .collection("comments")
      .add({
        userName: signInUser,
        text: comment,
        timestamp: firebase.firestore.FieldValue.serverTimestamp()
      })
    }
    setComment('')
  }
  
  return (
        <div className='post'>
          <div className='post__header'>
            <Avatar
              className="post__avatar"
              alt="RafhQazi"
              src="https://www.w3schools.com/w3images/avatar6.png" />
            <h3>{userName}</h3>
          </div>
          <img src={imageUrl} alt="imageurl" className="post__image"/>
          <h4 className='post__text'><strong>{ userName }</strong>: {caption}</h4>

          <div>
              <div>
                comments
              </div>
            {
              comments.map((comment) => {
                return( 
                    <p>
                    <strong>{comment.userName}</strong>:
                    {comment.text}
                    </p>
                );
              })
            }
          </div>
          {
            signInUser && (
              <form className='post__commentBox'>
                <input
                  className='post__input'
                  type="text"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder='Add a comment'
                />
                <button
                  className='post__button'
                  type='submit'
                  disabled={!comment}
                  onClick={postComment}
                >
                  Post
                </button>
              </form>
            )
          }
        </div>
  );
}

export default Post;