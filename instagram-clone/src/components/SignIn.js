import { Box, Button, Input, Modal } from '@material-ui/core'
import React, { useCallback, useEffect, useState } from 'react'
import { auth } from '../Firebase';
import style from '../style';

function SignIn(props) {
  const [ opensignIn, setOpensignIn ] = useState(false);
  const { email, password, setEmail, setPassword } = props;

  const signIn = (event) => {
    event.preventDefault();
    auth.signInWithEmailAndPassword(email, password)
    .catch((error) => {
      alert(error.message);
    });
    setOpensignIn(false);
  }

  const handleOpenModelSignIn = useCallback((openModel) => {
    setOpensignIn(openModel);
  }, [opensignIn])

  return (
    <>
        <Button onClick={() => handleOpenModelSignIn(true)}>Sign In</Button>
        <Modal
            open={opensignIn}
            onClose={() => handleOpenModelSignIn(false)} 
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
        >
            <Box sx={style}>
                <form className="app__form">
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
                    <Button type="submit" onClick={signIn}>
                    Sign In
                    </Button>
                </form>
            </Box>
        </Modal>
    </>
  )
}

export default SignIn