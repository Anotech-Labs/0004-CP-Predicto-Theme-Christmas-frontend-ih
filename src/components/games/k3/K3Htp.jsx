 import React from 'react'

const K3Htp = ({ isOpen, onClose }) => {
    if (!isOpen) return null

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
                width: '300px',
                padding: '0',
                // backgroundColor: '#ffffff',
                boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.1)',
                borderRadius: '15px',
                color: 'black',
                zIndex: 1000,
            }}
        >
            <div
                style={{
                    background: "linear-gradient(90deg,#24ee89,#9fe871)",
                    borderTopLeftRadius: '15px',
                    borderTopRightRadius: '15px',
                    padding: '15px',
                    textAlign: 'center',
                }}
            >
                <p style={{ margin: 0, color: "#ffffff" }}>How to play</p>
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
                <p style={{fontSize:"13px",lineHeight:"2"}}>
                    <span style={{ display: 'block', }}></span>
                    Fast 3 open with 3 numbers in each period as the opening number. The opening numbers are 111 to 666, natural numbers. No zeros in the array and the opening numbers are in no particular order. Quick 3 is to guess all or part of the 3 winning numbers.
                    <br />
                    <span style={{ display: 'block', }}>
                        Sum Value: Place a bet on the sum of three numbers.
                        <br />
                        Choose 3 same number all: For all the same three numbers, make an all-inclusive bet.
                        <br />
                        Choose 3 same number single: Choose a group of numbers in any of them to place bets.
                        <br />
                        Choose 2 Same Multiple: Place a bet on two designated same numbers and an arbitrary number among the three numbers.
                        <br />
                        Choose 2 Same Single: Place a bet on two designated same numbers and a designated different number among the three numbers.
                        <br />
                        3 numbers different
                    </span>
                </p>

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
                        backgroundImage: "linear-gradient(90deg,#24ee89,#9fe871)",
                        padding: '10px 70px',
                        width: 'fit-content',
                        margin: '0 auto',
                        textAlign: 'center',
                        color: "white",
                        cursor: 'pointer',
                        borderRadius: '50px', // Make it look more like a button
                    }}
                    onClick={onClose}
                >
                    Close
                </div>
            </div>
        </div></div>
    )
}

export default K3Htp