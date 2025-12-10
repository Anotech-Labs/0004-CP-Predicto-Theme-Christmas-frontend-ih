import React from "react";
import "./Stage.css";
import crownone from "/assets/stage/crown1.webp";
import crowntwo from "/assets/stage/crown2.webp";
import crownthree from "/assets/stage/crown3.webp";
import four from "/assets/stage/1-a6662edb.webp";
import five from "/assets/stage/5-ab77b716.webp";
import six from "/assets/stage/8-ea087ede.webp";
import seven from "/assets/stage/11-925c456e.webp";
import eight from "/assets/stage/8-ea087ede.webp";
import { Divider } from "@mui/material";
function Stage() {
  return (
    <>
      <div className="container">
        <div className="stagebox">
          {/* <div className="winner">
            <div className="icondiv">
             
              <div className="idimg">
                <img src={six} alt="" />
              </div>

            </div>
            <div
              className="name"
            >
              Mem***NCU
            </div>
            <div className="price" style={{ color: "#D6AC2A" }}>₹79,028,360.00</div>
          </div>
          <div className="winner">
            <div id="top" className="icondiv">
           
              <div className="idimg2">
                <img src={five} alt="" />
              </div>

            </div>
            <div
              className="name2"
            >
              Mem***NYQ
            </div>
            <div className="price" style={{ color: "#8095B6" }}>₹5,169,804.28</div>
          </div>
          <div className="winner">
            <div className="icondiv">
            
              <div className="idimg3">
                <img src={four} alt="" />
              </div>

            </div>
            <div
              className="name3"
            >
              Mem***IKK
            </div>
            <div className="price" style={{ color: "#B75C36" }}>₹1,617,872.00</div>
          </div> */}
        </div>
        <div className="runnerup">
          <div className="fourfive">
            <div style={{ display: "flex", flexDirection: "row", alignItems: "center", }}>
              <div className="position">4</div>
              <div style={{ display: "flex", flexDirection: "row", alignItems: "center" }}>
                <div className="img">
                  <img src={seven} alt="" />
                </div>
                <div className="details">
                  <span className="runner-up-name">
                    Mem***RLG
                  </span>
                </div>
              </div>
            </div>
            <div className="win" style={{  }}>
              <span>₹450,800.00</span>
            </div>
          </div>
          {/* <Divider sx={{ width: "90%" }}></Divider> */}
          <div className="fourfive">
            <div style={{ display: "flex", flexDirection: "row", alignItems: "center", }}>
              <div className="position">5</div>
              <div style={{ display: "flex", flexDirection: "row", alignItems: "center" }}>
                <div className="img">
                  <img src={seven} alt="" />
                </div>
                <div className="details">
                  <span className="runner-up-name">
                    Mem***RLG
                  </span>
                </div>
              </div>
            </div>
            <div className="win" style={{ }}>
              <span>₹450,800.00</span>
            </div>
          </div>
          <div className="fourfive">
            <div style={{ display: "flex", flexDirection: "row", alignItems: "center", }}>
              <div className="position">6</div>
              <div style={{ display: "flex", flexDirection: "row", alignItems: "center" }}>
                <div className="img">
                  <img src={seven} alt="" />
                </div>
                <div className="details">
                  <span className="runner-up-name">
                    Mem***RLG
                  </span>
                </div>
              </div>
            </div>
            <div className="win" style={{}}>
              <span>₹450,800.00</span>
            </div>
          </div>
          <div className="fourfive">
            <div style={{ display: "flex", flexDirection: "row", alignItems: "center", }}>
              <div className="position">7</div>
              <div style={{ display: "flex", flexDirection: "row", alignItems: "center" }}>
                <div className="img">
                  <img src={seven} alt="" />
                </div>
                <div className="details">
                  <span className="runner-up-name">
                    Mem***RLG
                  </span>
                </div>
              </div>
            </div>
            <div className="win" style={{  }}>
              <span>₹450,800.00</span>
            </div>
          </div>
          <div className="fourfive">
            <div style={{ display: "flex", flexDirection: "row", alignItems: "center",  }}>
              <div className="position">8</div>
              <div style={{ display: "flex", flexDirection: "row", alignItems: "center" }}>
                <div className="img">
                  <img src={seven} alt="" />
                </div>
                <div className="details">
                  <span className="runner-up-name">
                    Mem***RLG
                  </span>
                </div>
              </div>
            </div>
            <div className="win" style={{ }}>
              <span>₹450,800.00</span>
            </div>
          </div>
          <div className="fourfive">
            <div style={{ display: "flex", flexDirection: "row", alignItems: "center", }}>
              <div className="position">9</div>
              <div style={{ display: "flex", flexDirection: "row", alignItems: "center" }}>
                <div className="img">
                  <img src={seven} alt="" />
                </div>
                <div className="details">
                  <span className="runner-up-name">
                    Mem***RLG
                  </span>
                </div>
              </div>
            </div>
            <div className="win" style={{  }}>
              <span>₹450,800.00</span>
            </div>
          </div>
          <div className="fourfive">
            <div style={{ display: "flex", flexDirection: "row", alignItems: "center", }}>
              <div className="position">10</div>
              <div style={{ display: "flex", flexDirection: "row", alignItems: "center" }}>
                <div className="img">
                  <img src={eight} alt="" />
                </div>
                <div className="details">
                  <span className="runner-up-name">
                    Mem***BKP
                  </span>
                </div>
              </div>
            </div>
            <div className="win" style={{  }}>
              <span>₹424,348.00</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Stage;