import React, { useState, useRef, useContext } from "react";
import { useSwipeable } from "react-swipeable";
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import { styled } from '@mui/material/styles';
import { useNavigate } from "react-router-dom";
import { CQ9, EVO_Electronic, JDB, JILI, MG, PG } from "../../data/GameImg";
import { GameContext } from "../../context/GameContext";
import Button from '@mui/material/Button';
// Styled Components
const ScrollContainer = styled(Box)({
    width: "100%",
    overflow: "hidden",
    position: "relative",
    // transform: "skew(-3deg)",
    // "& > *": {
    //     transform: "skew(3deg)", // Counter-skew inner content
    // },
})

const TabsWrapper = styled(Box)({
    display: "flex",
    overflowX: "auto",
    scrollBehavior: "smooth",
    scrollbarWidth: "none",
    //  border: "1px solid #fde4bc",
    background: "linear-gradient(180deg,rgba(232,142,52,.5) 0%,rgba(106,94,86,.2) 100%)",

    "&::-webkit-scrollbar": {
        display: "none",
    },
    "msOverflowStyle": "none",
    // transform: "skew(-3deg)",
    // "& > *": {
    //     transform: "skew(3deg)", // Counter-skew inner content
    // },
    borderRadius: "5px",

})

const TabButton = styled(Box)(({ active }) => ({
    padding: "8px 14px",
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    position: "relative",
    whiteSpace: "nowrap",
    // Remove border-radius
    borderRadius: "5px",
    transition: "all 0.3s ease",
    background: active
        ? "linear-gradient(180deg, #FED358 0%, #FFB472 100%)"
        : "transparent",
    // Transform the container into a parallelogram
    // transform: "skew(-3deg)",
    // "& > *": {
    //     transform: "skew(3deg)", // Counter-skew the content
    // },
    // border: active ? "1px solid #ffffff" : "transparent"
}))

const Label = styled("span")(({ active }) => ({
    color: active ? "#05012b" : "#B79C8B",
    fontSize: "14px",
    fontWeight: active ? "600" : "400",
}))

const gamesDataWithSVG = {
    JILI: {
        name: "JILI",
        games: JILI,
        icon: (isSelected) => (
            <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="2 2 75 30"
                width="45"
                // height="20"
                fill={isSelected ? "#05012b" : "#b79c8b"}
            >
                <symbol
                    id="icon-JILI"
                    viewBox="4 12 90 25"
                    fill={isSelected ? "#05012b" : "#b79c8b"}
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path
                        d="M25.2238 34.1448V15.0757C25.2238 14.5836 24.7361 14.4605 24.2974 14.4605C23.7827 14.4605 22.7534 14.4605 22.7534 13.5378C22.7534 12.3076 23.371 12.3076 23.6798 12.3076H34.7968C35.1056 12.3076 35.4145 12.6151 35.4145 13.5378C35.4144 14.153 34.7968 14.4605 34.488 14.4605C33.5616 14.4605 33.5616 15.0757 33.5616 15.0757V32.2994C33.5616 34.1448 32.3264 35.3751 30.4735 36.6053C28.1299 38.1615 25.3268 38.1432 23.9886 37.8356V35.3751C23.9886 35.3751 25.2238 34.7599 25.2238 34.1448Z"
                        fill={isSelected ? "#05012b" : "#b79c8b"}
                    />
                    <path
                        d="M16.8861 35.0675C18.1213 36.9129 21.2093 37.8356 22.4446 37.8356V35.6826C21.3123 35.7852 21.0089 35.1341 21.2093 35.0675C23.9886 34.1448 24.2974 31.9918 23.9886 30.7616C23.7639 29.8664 22.1358 26.7632 18.7389 27.9935C15.6132 29.1255 15.4126 32.866 16.8861 35.0675Z"
                        fill={isSelected ? "#05012b" : "#b79c8b"}
                    />
                    <path
                        d="M37.2673 13.2303C37.2673 12.5508 37.8203 12 38.5025 12H49.0019C49.6841 12 50.2372 12.5508 50.2372 13.2303V13.3926C50.2372 13.8586 49.9728 14.2846 49.5544 14.493L48.3843 15.0757V34.7599L49.3926 35.0947C49.897 35.2621 50.2372 35.7323 50.2372 36.2618V36.6053C50.2372 37.2848 49.6841 37.8356 49.0019 37.8356H38.5025C37.8203 37.8356 37.2673 37.2848 37.2673 36.6053V36.2618C37.2673 35.7323 37.6075 35.2621 38.1119 35.0947L39.1201 34.7599V15.0757L37.9501 14.493C37.5316 14.2846 37.2673 13.8586 37.2673 13.3926V13.2303Z"
                        fill={isSelected ? "#05012b" : "#b79c8b"}
                    />
                    <path
                        d="M71.8536 13.2303C71.8536 12.5508 72.4067 12 73.0889 12H83.5883C84.2705 12 84.8235 12.5508 84.8235 13.2303V13.3926C84.8235 13.8586 84.5592 14.2846 84.1407 14.493L82.9707 15.0757V34.7599L83.9789 35.0947C84.4833 35.2621 84.8235 35.7323 84.8235 36.2618V36.6053C84.8235 37.2848 84.2705 37.8356 83.5883 37.8356H73.0889C72.4067 37.8356 71.8536 37.2848 71.8536 36.6053V36.2618C71.8536 35.7323 72.1939 35.2621 72.6983 35.0947L73.7065 34.7599V15.0757L72.5365 14.493C72.118 14.2846 71.8536 13.8586 71.8536 13.3926V13.2303Z"
                        fill={isSelected ? "#05012b" : "#b79c8b"}
                    />
                    <path
                        d="M52.09 13.2303C52.09 12.5508 52.643 12 53.3252 12H63.8247C64.5069 12 65.0599 12.5508 65.0599 13.2303V13.3926C65.0599 13.8586 64.7956 14.2846 64.3771 14.493L63.2071 15.0757V37.8356H53.3252C52.643 37.8356 52.09 37.2848 52.09 36.6053V36.2618C52.09 35.7323 52.4302 35.2621 52.9346 35.0947L53.9429 34.7599V15.0757L52.7728 14.493C52.3544 14.2846 52.09 13.8586 52.09 13.3926V13.2303Z"
                        fill={isSelected ? "#05012b" : "#b79c8b"}
                    />
                    <path
                        d="M67.2215 32.607C68.2297 31.2013 68.8428 29.6645 69.1471 28.767C69.2998 28.3165 69.7181 27.9935 70.1956 27.9935C70.7702 27.9935 71.236 28.4574 71.236 29.0298V37.8356H63.8247V35.3751C63.8247 35.3751 65.6775 34.7599 67.2215 32.607Z"
                        fill={isSelected ? "#05012b" : "#b79c8b"}
                    />
                </symbol>
                {/* Reference the symbol here */}
                <use href="#icon-JILI" fill={isSelected ? "#05012b" : "#b79c8b"} />
            </svg>
        )
    },
    CQ9: {
        name: "CQ9",
        games: CQ9,
        icon: (isSelected) => (
            <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="10 10 85 30"
                width="45"
                height="25"
                fill={isSelected ? "#05012b" : "#b79c8b"}
            >
                <path d="M39.6316 26.4505C39.6591 26.7809 39.6926 27.1027 39.7253 27.4171C39.9128 29.2203 40.0747 30.777 38.9306 32.2873C35.5213 36.5138 30.9671 37.7817 26.7849 37.7817C19.724 37.7817 14 32.1049 14 25.1022C14 18.0995 19.724 12.4227 26.7849 12.4227C30.3496 12.4227 33.8418 14.3153 36.1605 16.6492C35.5213 17.4945 34.4559 18.5511 34.006 19.1713C32.2862 17.1141 29.6899 15.8039 26.7849 15.8039C21.6069 15.8039 17.4093 19.9669 17.4093 25.1022C17.4093 30.2375 21.6069 34.4005 26.7849 34.4005C29.6964 34.4005 33.5361 33.4811 36.1605 30.5967C37.3142 29.3287 37.1924 28.9701 37.2259 28.4834C38.2887 27.6247 38.8285 26.8982 39.6316 26.4505Z" />
                <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M49.3716 37.7817C56.4325 37.7817 62.1565 32.1049 62.1565 25.1022C62.1565 18.0995 56.4325 12.4227 49.3716 12.4227C42.3107 12.4227 36.5867 18.0995 36.5867 25.1022C36.5867 32.1049 42.3107 37.7817 49.3716 37.7817ZM49.3716 34.4005C54.5496 34.4005 58.7472 30.2375 58.7472 25.1022C58.7472 19.9669 54.5496 15.8039 49.3716 15.8039C44.1936 15.8039 39.996 19.9669 39.996 25.1022C39.996 30.2375 44.1936 34.4005 49.3716 34.4005Z"
                />
                <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M74.9414 32.2873C80.5902 32.2873 85.1694 27.7458 85.1694 22.1436C85.1694 16.5415 80.5902 12 74.9414 12C69.2927 12 64.7135 16.5415 64.7135 22.1436C64.7135 27.7458 69.2927 32.2873 74.9414 32.2873ZM74.9414 28.9061C78.7073 28.9061 81.7601 25.8784 81.7601 22.1436C81.7601 18.4089 78.7073 15.3812 74.9414 15.3812C71.1756 15.3812 68.1228 18.4089 68.1228 22.1436C68.1228 25.8784 71.1756 28.9061 74.9414 28.9061Z"
                />
                <path d="M49.3716 26.5815C45.9623 26.5815 43.2633 26.9337 42.3399 27.2155C42.553 28.0608 43.6184 30.5967 43.6184 30.5967C43.6184 30.5967 53.3833 28.5724 58.7472 32.7099C66.4182 38.627 72.8106 38.2044 75.3676 37.7817C77.9246 37.3591 81.547 36.0911 83.6778 32.0759C85.8086 28.0608 85.1694 22.1436 85.1694 22.1436H83.6778L80.6946 30.174C80.9077 31.2306 77.8394 34.0624 73.2368 34.4005C67.4836 34.8232 64.5323 32.171 61.0911 29.9627C57.4687 27.6381 53.6332 26.5815 49.3716 26.5815Z" />
            </svg>
        )
    },
    MG: {
        name: "MG",
        games: MG,
        icon: (isSelected) => (
            <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="2 0 52 25"
                width="45"
                // height="20"
                fill={isSelected ? "#05012b" : "#b79c8b"}
            >
                <symbol
                    id="icon-MG"
                    viewBox="4 12 90 25"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M50 45C61.0457 45 70 36.0457 70 25C70 13.9543 61.0457 5 50 5C38.9543 5 30 13.9543 30 25C30 27.0918 30.3211 29.1085 30.9168 31.0037C30.9236 30.9921 30.9307 30.9808 30.938 30.9698C33.2837 28.1303 37.2986 22.4097 38.7158 19.8587C40.5677 16.5254 42.4195 12.5748 43.1602 10.9698C43.4072 10.476 44.1973 9.19195 45.3825 9.48825C46.5041 9.76866 46.4979 11.322 46.494 12.2924C46.4938 12.3473 46.4936 12.4004 46.4936 12.4513C46.4936 13.8504 46.4497 15.5277 46.4026 17.3261C46.2128 24.5723 45.9716 33.7832 48.3454 34.6735C49.8962 35.2552 55.0108 26.1548 57.2331 19.1178C57.2534 19.0568 57.2735 18.9959 57.2935 18.9351C57.6388 17.8882 57.966 16.8957 59.0862 16.8957C60.0458 16.8957 60.1791 17.8669 60.3916 19.4162C60.4416 19.7803 60.4959 20.1764 60.5664 20.5993C60.5913 20.7488 60.6179 20.9133 60.6466 21.0911C61.0448 23.5555 61.8521 28.5514 64.2701 30.9696C65.5794 32.279 65.7516 33.5622 62.7886 31.34C62.2948 30.9696 60.5664 29.4882 59.8257 26.5252C59.0849 23.5622 58.4936 23.9324 58.3454 24.6733C57.9751 26.5252 52.7899 38.0069 48.7158 38.0069C42.888 38.0069 43.2868 28.384 43.4794 23.7355C43.5072 23.0664 43.5306 22.5004 43.5306 22.0809C43.5306 18.7476 41.6788 22.0809 40.5677 24.3032C40.4276 24.5833 40.2358 24.9794 40.0038 25.4587C38.5045 28.556 35.323 35.1283 33.5286 36.3475C37.1365 41.5746 43.1682 45 50 45Z"
                        fill={isSelected ? "#05012b" : "#b79c8b"}
                    />
                </symbol>
                {/* Reference the symbol here */}
                <use href="#icon-MG" />
            </svg>
        )
    },

    PG: {
        name: "PG",
        games: PG,
        icon: (isSelected) => (
            <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="2 2 75 30"
                width="45"
                // height="20"
                fill={isSelected ? "#05012b" : "#b79c8b"}
            >
                <symbol
                    id="icon-PG"
                    viewBox="4 12 90 25"
                    fill={isSelected ? "#05012b" : "#b79c8b"}
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path
                        d="M71.4286 11H57.9592V13.3636H55.5102V16.9091H51.8367V32.2727H55.5102V34.6364H57.9592V37H75.102V34.6364H77.551V32.2727H80V21.6364H66.5306V26.3636H75.102V28.7273H73.8776V29.9091H71.4286V32.2727H61.6327V29.9091H60.4082V28.7273H57.9592V19.2727H60.4082V15.7273H72.6531V19.2727H77.551V14.5455H76.3265V13.3636H71.4286V11Z"
                        fill={isSelected ? "#05012b" : "#b79c8b"}
                    />
                    <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M20 13.3636H22.449V11H45.7143V14.5455H44.4898V16.9091H48.1633V26.3636H44.4898V29.9091H39.5918V32.2727H26.1224V37H20V13.3636ZM24.898 15.7273H39.5918V19.2727H42.0408V24H39.5918V27.5455H24.898V15.7273Z"
                        fill={isSelected ? "#05012b" : "#b79c8b"}
                    />
                </symbol>
                <use href="#icon-PG" fill={isSelected ? "#05012b" : "#b79c8b"} />
            </svg>
        )
    },
    EVO_Electronic: {
        name: "EVO_Electronic",
        games: EVO_Electronic,
        icon: (isSelected) => (
            <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="2 0 52 25"
                width="45"
            // height="25"
            >
                <symbol
                    id="icon-EVO_Electronic"
                    viewBox="4 12 90 25"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path
                        d="M69.5 6.52637C68.1848 9.64453 66.9503 12.5478 65.7424 15.4621C65.5432 15.9423 65.146 16.025 64.73 16.1284C53.6686 18.883 42.6049 21.6312 31.5476 24.4012C30.7533 24.6 30.4817 24.4811 30.5076 23.6228C30.5671 21.645 30.5801 19.6619 30.5029 17.6852C30.467 16.769 30.7592 16.3898 31.682 16.1577C40.978 13.8203 50.2622 11.4374 59.5494 9.0672C62.7702 8.24457 65.9904 7.42252 69.5 6.52637Z"
                        fill={isSelected ? "#05012b" : "#b79c8b"}
                    />
                    <path
                        d="M62.8898 21.7534C61.7413 24.5068 60.6689 27.0706 59.6053 29.6373C59.4191 30.0871 59.0785 30.2325 58.6054 30.2951C49.5115 31.4997 40.4182 32.7089 31.3296 33.9526C30.6626 34.044 30.5076 33.9199 30.5158 33.2955C30.5453 31.1895 30.5483 29.083 30.5141 26.977C30.5035 26.3359 30.7386 26.1073 31.3838 26.0211C41.7994 24.6234 52.2114 23.2039 62.8898 21.7534Z"
                        fill={isSelected ? "#05012b" : "#b79c8b"}
                    />
                    <path
                        d="M57.2866 35.6123C56.1965 38.1692 55.1553 40.6026 54.1241 43.0394C53.9309 43.4967 53.5461 43.4599 53.1536 43.4599C45.9212 43.4576 38.6887 43.4479 31.4569 43.4737C30.6909 43.4766 30.5159 43.2204 30.5294 42.5299C30.5701 40.5107 30.5524 38.4903 30.5383 36.4705C30.5347 35.9564 30.5548 35.5985 31.2701 35.6002C39.8837 35.6186 48.498 35.6123 57.2866 35.6123Z"
                        fill={isSelected ? "#05012b" : "#b79c8b"}
                    />
                </symbol>
                {/* Reference the symbol here */}
                <use href="#icon-EVO_Electronic" fill={isSelected ? "#05012b" : "#b79c8b"} />
            </svg>
        )
    },

    JDB: {
        name: "JDB",
        games: JDB,
        icon: (isSelected) => (
            <svg
                className="svg-icon icon-JDB gameIcon gameIcon"
                viewBox="10 5 85 30"
                width="45"
                height="25"
                fill={isSelected ? "#05012b" : "#b79c8b"}
            >
                <path
                    d="M42.384 8H32.5708L35.9396 12.7454L31.2521 31.8799C31.1056 32.3391 30.579 33.9005 29.0557 35.2476C27.5325 36.5946 25.1011 35.9109 24.0758 35.4007C23.3429 36.4722 21 39.8399 21 39.8399C21 39.8399 24.8837 42.11 30.0809 40.2991C33.1561 39.2276 35.646 35.4007 36.2325 32.7984L42.384 8Z"
                    fill={isSelected ? "#05012b" : "#b79c8b"}
                />
                <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M42.8229 8.15308L72.702 8C74.7525 8 79 9.98999 79 14.5823C79 18.103 77.0959 20.2461 76.0707 20.8584L76.0773 20.8661C76.5202 21.3804 77.5353 22.559 77.5353 25.9099C77.5353 30.043 72.9949 33.8699 68.4544 33.8699H40.4794L45.8987 12.8984L42.8229 8.15308ZM50.8785 12.7454L46.7775 28.8184L46.8117 28.8214C48.5785 28.9753 51.9227 29.2667 54.8331 27.5938C57.7624 25.9099 60.6917 21.7769 60.5453 17.6438C60.3988 13.5107 57.1766 12.7454 55.2725 12.7454H50.8785ZM70.4134 23.3076H63.914C63.3281 25.7568 61.2776 28.0529 60.2523 28.9714C62.216 28.9714 65.4706 28.8952 67.3863 28.8503L67.3873 28.8503C68.186 28.8316 68.7517 28.8183 68.8938 28.8183C70.0656 28.8184 72.8582 27.8999 72.702 25.4507C72.5848 23.6138 71.2373 23.3077 70.4134 23.3076ZM65.0857 18.4092H70.9993C71.9696 18.4092 74.0202 17.6438 74.0202 15.5007C74.0202 13.3577 72.7477 12.7454 71.3838 12.7454C71.1506 12.7454 70.0853 12.7454 68.7325 12.7454C67.2818 12.7454 65.5005 12.7454 64.0605 12.7454C64.6463 13.8169 65.2322 16.2661 65.0857 18.4092Z"
                    fill={isSelected ? "#05012b" : "#b79c8b"}
                />
            </svg>
        )
    },
    G9: {
        name: "G9",
        games: [
            { id: 1, imgSrc: "/assets/slots/g9_777Diamonds.webp", game: "Game 1" },
            { id: 2, imgSrc: "/assets/slots/g9_777res.webp", game: "Game 2" },
            { id: 3, imgSrc: "/assets/slots/g9_ageofSteam.webp", game: "Game 2" },
            { id: 4, imgSrc: "/assets/slots/g9_cardSlots.webp", game: "Game 2" },
            { id: 5, imgSrc: "/assets/slots/g9_goldRushMaster.webp", game: "Game 2" },
            { id: 6, imgSrc: "/assets/slots/g9_777Diamonds.webp", game: "Game 2" },
        ],
        icon: (isSelected) => (
            <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="8 2 75 42"
                width="38"
                // height="20"
                fill={isSelected ? "#05012b" : "#b79c8b"}
            >
                <path d="M43.6878 16.486C44.5405 14.0391 46.1748 12.4697 46.8854 11.9909C38.1732 2.7693 28.1653 10.0802 27.283 17.0882C25.9854 27.3945 33.8635 30.6662 38.4513 30.6662L33.0293 40.3516H40.2586C42.7456 35.563 47.8864 25.6521 48.5537 24.3175C49.221 22.9828 49.4104 21.6558 49.8049 20.634C53.1415 11.9909 62.2707 14.0303 64.6805 16.9492L68.3414 12.9177C56.3854 3.00071 45.6538 13.1256 44.1976 20.0079C42.8032 26.8329 32.646 25.7584 33.0293 18.803C33.407 13.8247 39.6057 11.7761 42.8756 15.5488L43.6878 16.486Z" />
                <path d="M46.0512 31.1766L49.4805 24.7815C50.0349 28.6069 52.9674 31.6586 56.766 32.3736C57.7703 32.5626 58.8014 32.5807 59.8117 32.4264L60.6743 32.2946C63.3042 31.8928 65.4877 30.0524 66.329 27.5286L66.7195 26.3571H58.2853V20.5181H72.5585C74.3604 29.3329 67.8713 37.6762 58.8842 38.0996L58.2853 38.1278C53.3837 38.1278 48.8268 35.6058 46.224 31.4523L46.0512 31.1766Z" />
            </svg>
        )
    },
};


const Slots = () => {
    const [currentCategory, setCurrentCategory] = useState("JILI");
    const [currentIndex, setCurrentIndex] = useState(0);
    const tabsRef = useRef(null);
    const itemsPerPage = 6;

    const navigate = useNavigate();
    const { handleApiClick } = useContext(GameContext);
    const currentGames = gamesDataWithSVG[currentCategory].games;
    const totalPages = Math.ceil(currentGames.length / itemsPerPage);

    const handlers = useSwipeable({
        onSwipedLeft: () => handleNext(),
        onSwipedRight: () => handlePrev(),
        trackMouse: true,
    });

    const handleNext = () => {
        setCurrentIndex((prev) => Math.min(prev + 1, totalPages - 1));
    };

    const handlePrev = () => {
        setCurrentIndex((prev) => Math.max(prev - 1, 0));
    };
    const handleAllGamesClick = () => {
        navigate("/all-slots/jili");
    };
    const centerSelectedTab = (category) => {
        if (!tabsRef.current) return;

        const tabsContainer = tabsRef.current;
        const selectedTab = tabsContainer.querySelector(`[data-category="${category}"]`);

        if (selectedTab) {
            const containerWidth = tabsContainer.offsetWidth;
            const tabWidth = selectedTab.offsetWidth;
            const tabLeft = selectedTab.offsetLeft;

            const scrollPosition = tabLeft - (containerWidth / 2) + (tabWidth / 2);

            tabsContainer.scrollTo({
                left: scrollPosition,
                behavior: 'smooth'
            });
        }
    };

    const handleCategoryChange = (category) => {
        setCurrentCategory(category);
        setCurrentIndex(0);
        setTimeout(() => centerSelectedTab(category), 0);
    };

    const visibleGames = currentGames.slice(
        currentIndex * itemsPerPage,
        (currentIndex + 1) * itemsPerPage
    );

    return (
        <Box sx={{ mt: 0 }}>
            <Box sx={{}}>
                <Grid item sx={{ display: "flex", alignItems: "center", flexShrink: 0 }}>
                    <img src="/assets/gameFilter/slots.webp" alt="" width="21px" />
                    <Typography sx={{
                        fontSize: "16px", color: "#ffffff", mx: 1, whiteSpace: "nowrap", fontWeight: "bold",
                        fontFamily: "'Times New Roman', Times,  ",
                    }}>
                        Slots
                    </Typography>
                </Grid>

                <Box sx={{
                    // background: "#011341",
                    // borderRadius: "8px",
                    mt: 1,
                    // overflow: "hidden"
                    // mx:0.4
                }}>
                    <ScrollContainer>
                        <TabsWrapper ref={tabsRef}>
                            {Object.keys(gamesDataWithSVG).map((category) => (
                                <TabButton
                                    key={category}
                                    data-category={category}
                                    active={currentCategory === category}
                                    onClick={() => handleCategoryChange(category)}
                                >
                                    {gamesDataWithSVG[category].icon(currentCategory === category)}
                                    <Label active={currentCategory === category}>
                                        {gamesDataWithSVG[category].name}
                                    </Label>
                                </TabButton>
                            ))}
                        </TabsWrapper>
                    </ScrollContainer>
                </Box>
                {/* Games Grid */}
                <Box {...handlers} sx={{ flexGrow: 1, maxWidth: 600, margin: "auto" }}>
                    <Box sx={{ paddingTop: "10px" }}>
                        <Grid container spacing={1}>
                            {visibleGames.map((game) => (
                                <Grid item xs={4} sm={4} md={4} key={game.id}>
                                    <Box
                                        sx={{
                                            position: "relative",
                                            borderRadius: "8px",
                                            textAlign: "center",
                                            cursor: "pointer",
                                        }}
                                        onClick={() => handleApiClick(game.id, currentCategory, "SLOT")}                                    >
                                        <img
                                            src={game.imgSrc}
                                            alt={game.game}
                                            style={{
                                                width: "100%",
                                                height: "auto",
                                                borderRadius: "8px",
                                            }}
                                        />
                                    </Box>
                                </Grid>
                            ))}
                        </Grid>
                    </Box>
                </Box>
                <Button onClick={handleAllGamesClick} sx={{ mt: 1, background: "linear-gradient(180deg, #FED358 0%, #FFB472 100%)", textTransform: "none", color: "#05012b", width: "100%", borderRadius: "50px",   fontFamily: "'Times New Roman', Times,  ", }}>View All</Button>

            </Box>
        </Box>
    )
}

export default Slots