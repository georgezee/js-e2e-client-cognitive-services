// Based on https://github.com/Sristi27/React-webcam.
import React, { useState } from 'react';
import Webcam from "react-webcam";

// const WebcamComponent = () => <Webcam />;

const videoConstraints = {
    width: 220,
    height: 200,
    facingMode: { exact: "environment" }
};

// Thanks to https://stackoverflow.com/questions/12168909/blob-from-dataurl .
function dataURItoBlob(dataURI) {
    // convert base64 to raw binary data held in a string
    // doesn't handle URLEncoded DataURIs - see SO answer #6850276 for code that does this
    var byteString = atob(dataURI.split(',')[1]);

    // separate out the mime component
    var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0]

    // write the bytes of the string to an ArrayBuffer
    var ab = new ArrayBuffer(byteString.length);

    // create a view into the buffer
    var ia = new Uint8Array(ab);

    // set the bytes of the buffer to the correct values
    for (var i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
    }

    // write the ArrayBuffer to a blob, and you're done
    var blob = new Blob([ab], {type: mimeString});
    return blob;
}

export const WebcamCapture = ({onSave}) => {

    const [image,setImage]=useState('');
    const webcamRef = React.useRef(null);

    const capture = React.useCallback(
        () => {
            const imageSrc = webcamRef.current.getScreenshot();
            var blob = dataURItoBlob(imageSrc);
            console.log("Image blob:");
            console.log(blob);
            setImage(imageSrc);
            onSave(blob);
        }, [onSave]);


    return (
        <div className="webcam-container">
            <div className="webcam-img">

                {image === '' ? <Webcam
                    audio={false}
                    height={200}
                    ref={webcamRef}
                    screenshotFormat="image/jpeg"
                    width={220}
                    videoConstraints={videoConstraints}
                /> : <img src={image} alt="Webcam view"/>}
            </div>
            <div>
                {image !== '' ?
                    <button onClick={(e) => {
                        e.preventDefault();
                        setImage('')
                    }}
                        className="webcam-btn">
                        Retake Image</button> :
                    <button onClick={(e) => {
                        e.preventDefault();
                        capture();
                    }}
                        className="webcam-btn">Capture</button>
                }
            </div>
        </div>
    );
};
