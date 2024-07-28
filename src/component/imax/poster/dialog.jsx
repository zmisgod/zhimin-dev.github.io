import React, { useEffect, useRef, useState } from 'react';
import DialogTitle from '@mui/material/DialogTitle';
import Dialog from '@mui/material/Dialog';
import PropTypes from 'prop-types';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import md5 from 'js-md5';

export default function SimpleDialog(props) {
    const { onClose, open, showType, showTitle, callbackFunction, showValue } = props;

    const [value, setValue] = React.useState('');

    useEffect(() => {
        if(showValue !=='') {
            setValue(showValue);
        } 
    }, [showValue])

    const handleClose = () => {
        if(showType !== 5) {
            onClose()
        }
    };

    const changeValue = (e) => {
        setValue(e.target.value)
    }

    const confirmBackgroundUrl = () => {
        try{
            let url = new URL(value)
            let urlVer = '333bf9289eb7169c6fa4386fd637d87f'
            if(md5(url.origin)!== urlVer) {
                throw new Error('')
            }
            callbackFunction(showType, {'url': value})
        }catch(e) {
            alert('请输出正确的url')
            return 
        }
    }

    return (
        <Dialog onClose={handleClose} open={open}>
            <DialogTitle>{showTitle}</DialogTitle>
            {
                showType === 5 ? (
                    <div style={{ padding: '0 20px', display: 'flex' }}>
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                            <TextField disabled={showValue !== ''} value={value} id="standard-basic" variant="standard" onChange={changeValue} />
                        </div>
                        <div>
                            <Button onClick={confirmBackgroundUrl}>确认</Button>
                        </div>
                    </div>
                ) : ''
            }
        </Dialog>
    );
}

SimpleDialog.propTypes = {
    onClose: PropTypes.func.isRequired,
    open: PropTypes.bool.isRequired,
    selectedValue: PropTypes.string.isRequired,
};