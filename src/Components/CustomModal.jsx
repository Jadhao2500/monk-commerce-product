/* eslint-disable react/prop-types */
import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
// import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

export default function CustomModal({open,cancelButton,submitButton,onModalClose=()=>{},onModalSubmit,modalTitle,children}) {


  return (
    <React.Fragment>
      <Dialog
        open={open}
        onClose={onModalClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{modalTitle}</DialogTitle>
        <DialogContent>
          {/* <DialogContentText id="alert-dialog-description">
            Let Google help apps determine location. This means sending
            anonymous location data to Google, even when no apps are running.
          </DialogContentText> */}
          {children}
        </DialogContent>
        <DialogActions>
          {cancelButton && (
            <Button onClick={onModalClose} variant="outlined">
              {cancelButton}
            </Button>
          )}
          {submitButton && (
            <Button
              onClick={onModalSubmit}
              autoFocus
              variant="contained"
              color="success"
            >
              {submitButton}
            </Button>
          )}
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}
