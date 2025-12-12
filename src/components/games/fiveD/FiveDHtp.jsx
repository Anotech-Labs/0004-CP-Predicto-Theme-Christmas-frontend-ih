import React from 'react';

const FiveDHtp = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div style={{
      position: "fixed",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      backgroundColor: "rgba(0, 0, 0, 0.5)", /* Semi-transparent background */
      zIndex: "999" /* Behind the modal */
  }} >
    <div
      style={{
        position: 'fixed',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '290px',
        padding: '0',
        // backgroundColor: '#201d2b',
        boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.1)',
        borderRadius: '10px',
        color: 'white',
        zIndex: 1000,
      }}
    >
      <div
        style={{
          background: "linear-gradient(90deg,#24ee89,#9fe871),#111111",
          borderTopLeftRadius: '15px',
          borderTopRightRadius: '15px',
          padding: '15px',
          textAlign: 'center',
        }}
      >
        <p style={{ margin: 0, color: "#ffffff",fontSize:"16px" }}>How to play</p>
      </div>
      <div
        style={{
          padding: '0 12px',
          maxHeight: '300px',
          overflowY: 'auto',
          textAlign: 'left ',
          background:"#232626",
                    color:"#FDE4BC",
                    scrollbarWidth: "none",  // Hide scrollbar in Firefox
        msOverflowStyle: "none", // Hide scrollbar in IE/Edge
        }}
      >
        <div  style={{fontSize:"13px"}}>
          <p>5D lottery game rules</p>
          <p>Draw instructions</p>
          <p>5-digit number (00000-99999) will be drawn randomly in each period</p>
          <p>For example:</p>
          <p>The draw number for this period is 12345</p>
          <p>A=1</p>
          <p>B=2</p>
          <p>C=3</p>
          <p>D=4</p>
          <p>E=5</p>
          <p>SUM = A+B+C+D+E = 15</p>
          <br />
          <p>How to play</p>
          <p>Players can specify six outcomes of betting A, B, C, D, E and the sum</p>
          <p>A, B, C, D, E can be purchased:</p>
          <p>Number (0 1 2 3 4 5 6 7 8 9)</p>
          <p>Low (0 1 2 3 4)</p>
          <p>High (5 6 7 8 9)</p>
          <p>Odd (1 3 5 7 9)</p>
          <p>Even (0 2 4 6 8)</p>
          <p>Sum = A+B+C+D+E can be purchased:</p>
          <p>Low (0-22)</p>
          <p>High (23-45)</p>
          <p>Odd (1 3 ... 43 45)</p>
          <p>Even (0 2 ... 42 44)</p>
        </div>
      </div>
      <div
        style={{
          backgroundColor: '#232626',
          borderBottomLeftRadius: '15px',
          borderBottomRightRadius: '15px',
          padding: '20px',
          textAlign: 'center',
        }}
      >
        <div
          style={{
            background: "linear-gradient(90deg,#24ee89,#9fe871),#111111",
            padding: '10px 70px',
            width: 'fit-content',
            margin: '0 auto',
            textAlign: 'center',
            color: "white",
            cursor: 'pointer',
            borderRadius: '50px',
          }}
          onClick={onClose}
        >
          Close
        </div>
      </div>
    </div></div>
  );
};

export default FiveDHtp;