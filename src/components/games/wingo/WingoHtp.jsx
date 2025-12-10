import React from 'react';
import './WingoHtp.css';

const WingoHtp = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div>
    <div class="modal-overlay"></div>
    <div className="modal">
      <div className="modal-header">
        <p>How to play</p>
      </div>
      <div className="modal-body">
        <p>
        30 seconds 1 issue, 25 seconds to order, 5 seconds waiting for the draw. It opens all day. The total number of trade is 2880 issues.
          {/* <span></span>
          If you spend 100 to trade, after deducting service fee 2%, contract amount: 98<br />
          <span></span>
          1. Select green: if the result shows 1,3,7,9 you will get (98*2)=196; If the result shows 5, you will get (98*1.5) 147.<br />
          <span></span>
          2. Select red: if the result shows 2, 4, 6, you will get (98*2)=196; If the result shows 0, you will get (98*1.5) 147.<br />
          <span></span>
          3. Select violet: if the result shows 0 or 5, you will get (98*2)=196.<br /> */}
        </p>
        <p>
        if you spend 100 to trade, after deducting service fee 2%, contract amount : 98
          {/* <span></span>
          5. Select big: if the result shows 5, 6, 7, 8, 9 you will get (98*2)=196.<br />
          <span></span>
          6. Select small: if the result shows 0, 1, 2, 3, 4 you will get (98*2)=196.<br /> */}
        </p>
        <p>1. Select green: if the result shows 1,3,7,9 you will get (98*2)=196;If the result shows 5, you will get (98*1.5) 147</p>
        <p>2. Select red: if the result shows 2,4,6,8 you will get (98*2)=196 ;If the result shows 0, you will get  (98*1.5) 147</p>
        <p>3. Select violet: if the result shows 0 or 5, you will get (98*2)=196</p>
        <p>4. Select number: if the result is the same as the number you selected, you will get (98*9)=882</p>
        <p>5. Select big: if the result shows 5,6,7,8,9 you will get (98*2)=196</p>
        <p>6. Select small: if the result shows 0,1,2,3,4 you will get (98*2)=196</p>
      </div>
      <div className="modal-footer">
        <div className="close-button" onClick={onClose}>
          Close
        </div>
      </div>
    </div>
    </div>
  );
};

export default WingoHtp;
