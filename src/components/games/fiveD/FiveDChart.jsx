import React, { useState, useEffect } from "react"
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    Pagination,
    Tabs,
    Divider,
    Tab,
    TableRow,
    Paper,
    Typography,
    Box,
    Grid,
    useMediaQuery, Button
} from "@mui/material"
import { styled } from "@mui/material/styles"
import ArrowBackIosRoundedIcon from "@mui/icons-material/ArrowBackIosRounded"
import ArrowForwardIosRoundedIcon from "@mui/icons-material/ArrowForwardIosRounded"
import boxa from "../../../assets/fived/charta.webp"
import boxb from "../../../assets/fived/chartb.webp"
import boxc from "../../../assets/fived/chartc.webp"
import boxd from "../../../assets/fived/chartd.webp"
import boxe from "../../../assets/fived/charte.webp"

const chart = [boxa, boxb, boxc, boxd, boxe]

// Styled Components
const StyledTableCell = styled(TableCell)(({ theme }) => ({
    padding: "4px 4px",
    borderBottom: "none",
    fontSize: "12px",
    "&:last-child": {
        paddingRight: "5px",
    },
}))

const StyledTableRow = styled(TableRow)(({ theme }) => ({
    "& td, & th": {
        borderBottom: "none",
    },
}))

const StyledTab = styled(Tab)(({ selected, index }) => ({
    minWidth: selected ? "52px" : "25px",
    padding: "4px 16px",
    fontWeight: "bold",
    fontSize: "16px",
    color: selected ? "transparent" : "#FDE4BC",
    backgroundColor: selected ? "#323738" : "#382e35",
    backgroundImage: selected ? `url(${chart[index]})` : "none",
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
    borderRadius: "20px 20px 0px 0px",
    margin: "0 2.5px",
}))

const TabWrapper = styled(Box)(({ theme }) => ({
    backgroundColor: "#323738",
    borderRadius: "10px",
    padding: "16px",
    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
}))

const NumberTableWithLines = ({ historyData, selectedTab }) => {
    const isSmallScreen = useMediaQuery("(max-width:500px)")
    const isMiddleScreen = useMediaQuery("(max-width:600px)")

    const columns = [
        { id: "period", label: "Period", width: isMiddleScreen ? "50%" : "30%" },
        { id: "result", label: "Number", width: isMiddleScreen ? "50%" : "70%" },
    ]

    // Helper function to get section value based on selected tab
    const getSectionValue = (row, tab) => {
        const sections = ["sectionA", "sectionB", "sectionC", "sectionD", "sectionE"]
        return row[sections[tab]]
    }

    // Helper function to get size value based on selected tab
    const getSizeValue = (row, tab) => {
        const sizes = ["sizeA", "sizeB", "sizeC", "sizeD", "sizeE"]
        return row[sizes[tab]]
    }

    // Helper function to get parity value based on selected tab
    const getParityValue = (row, tab) => {
        const parities = ["parityA", "parityB", "parityC", "parityD", "parityE"]
        return row[parities[tab]]
    }

    const renderNumbers = (row) => {
        const sectionValue = getSectionValue(row, selectedTab)
        const sizeValue = getSizeValue(row, selectedTab)
        const parityValue = getParityValue(row, selectedTab)

        return (
            <Box sx={{ display: "flex", alignItems: "center" }}>
                {/* Render all numbers from 0-9 */}
                {[...Array(10).keys()].map((num) => (
                    <div
                        key={num}
                        style={{
                            width: "13.5px",
                            height: "15px",
                            borderRadius: "50%",
                            border: num === sectionValue ? "1px solid #D23838" : "1px solid #BBBBBB",
                            display: "flex",
                            fontSize: "10px",
                            alignItems: "center",
                            justifyContent: "center",
                            margin: isSmallScreen ? "0 2px" : "0 1.8px",
                            aspectRatio: "1 / 1",
                            background: num === sectionValue ? "#D23838" : "transparent",
                            color: num === sectionValue ? "#000000" : "#BBBBBB",
                            zIndex: num === sectionValue ? 1 : 0,
                        }}
                    >
                        {num}
                    </div>
                ))}

                {/* High/Low indicator always after the 9th ball */}
                <div
                    style={{
                        background: sizeValue === "BIG" ? "#DD9138" : "#5088D3",
                        color: "white",
                        width: "14px",
                        height: "15px",
                        borderRadius: "50%",
                        // marginLeft: isSmallScreen ? "5px" : "10px",
                        marginLeft: "3px",
                        display: "flex",
                        fontSize: "10px",
                        alignItems: "center",
                        justifyContent: "center",
                        border: sizeValue === "BIG" ? "1px solid #DD9138" : "1px solid #5088D3",
                    }}
                >
                    {sizeValue === "BIG" ? "H" : "L"}
                </div>

                {/* Odd/Even indicator */}
                <div
                    style={{
                        background: parityValue === "ODD" ? "#17B15E" : "transparent",
                        color: parityValue === "EVEN" ? "#9B48DB" : "white",
                        width: "14px",
                        height: "15px",
                        borderRadius: "50%",
                        marginLeft: "1px",
                        border: parityValue === "EVEN" ? "1px solid #9B48DB" : "1px solid #17B15E",
                        display: "flex",
                        fontSize: "10px",
                        alignItems: "center",
                        justifyContent: "center",
                    }}
                >
                    {parityValue === "EVEN" ? "E" : "O"}
                </div>
            </Box>
        )
    }

    return (
        <Grid container px={0} sx={{ mt: 4 }}>
            {columns.map((column, index) => (
                <Grid
                    item
                    key={column.id}
                    sx={{
                        width: column.width,
                        backgroundColor: "#cf7c10",
                        color: "white",
                        padding: "4% 5.6%",
                        borderTopLeftRadius: index === 0 ? "5px" : "0",
                        borderTopRightRadius: index === columns.length - 1 ? "5px" : "0",
                        fontWeight: "bold",
                        display: "flex",
                        fontSize: "0.9rem",
                        alignItems: "center",
                        justifyContent: "center",
                    }}
                >
                    {column.label}
                </Grid>
            ))}
            <Divider />
            <Grid
                container
                direction="row"
                alignItems="left"
                backgroundColor="#323738"
                sx={{
                    borderRadius: "10px",
                    justifyContent: "space-evenly"
                }}
            >
                <div className="relative">
                    {historyData && historyData.map((row, rowIndex) => (
                        <Box sx={{ width: "75%", my: 1, alignItems: "center" }}>
                            <Box
                                key={row.periodId}
                                sx={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                    position: "relative",
                                    paddingBottom: "5px",
                                    mt: 3,
                                }}
                            >
                                <Box
                                    style={{
                                        fontSize: isSmallScreen ? "9px" : "12px",
                                        color: "#FDE4BC",
                                        paddingLeft: isSmallScreen ? "0%" : isMiddleScreen ? "5%" : "0%"
                                    }}
                                >
                                    {row.periodId}
                                </Box>
                                <Box
                                    style={{
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "flex-start",
                                        // width: isMiddleScreen ? "50%" : "70%",
                                    }}
                                >
                                    {renderNumbers(row)}
                                </Box>

                                {/* Drawing connecting lines between numbers */}
                                {rowIndex < historyData.length - 1 && (
                                    <svg
                                        style={{
                                            position: "absolute",
                                            top: -5,
                                            left:isSmallScreen ? "80px" : isMiddleScreen ? "120px" : "105px",
                                            overflow: "visible",
                                            transform: "rotate(3deg)",
                                        }}
                                    >
                                        <path
                                            d={`M${getSectionValue(historyData[rowIndex], selectedTab) * 20 + 10} 15 
                                        L${getSectionValue(historyData[rowIndex + 1], selectedTab) * 20 + 16} 60`}
                                            stroke="#D23838"
                                            fill="transparent"
                                        />
                                    </svg>
                                )}
                            </Box>
                        </Box>
                    ))}
                </div>
            </Grid>
        </Grid>
    )
}

const Chart5D = ({ data }) => {
    const { statisticsData, historyData, chartPage, setChartPage, gameTotalPage } = data
    const pageSize = 10
    //   const [chartPage, setPage] = useState(0);
    const [selectedTab, setSelectedTab] = useState(0)
    const [currentStatisticsData, setCurrentStatisticsData] = useState(statisticsData || [
        { label: "Missing", cols: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0] },
        { label: "Frequency", cols: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0] },
        { label: "Average", cols: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0] },
    ])

    useEffect(() => {
        // Update currentStatisticsData when selectedTab changes
        // In a real app, you'd calculate these based on actual data
        const newStatisticsData = currentStatisticsData.map((row) => ({
            ...row,
            cols: row.cols.map(() => Math.floor(Math.random() * 50) + 1),
        }))
        setCurrentStatisticsData(newStatisticsData)
    }, [selectedTab])

    const handleTabChange = (event, newValue) => {
        setSelectedTab(newValue)
    }

    const handleChangePage = (event, newPage) => {
        setPage(newPage)
    }

    // Make sure historyData exists and paginate it
    const paginatedHistoryData = historyData
        ? historyData.slice(chartPage * pageSize, (chartPage + 1) * pageSize)
        : []

    return (
        <Box
            sx={{
                width: "100%",
                maxWidth: 800,
                margin: "auto",
                fontFamily: "Arial, sans-serif",
            }}
        >
            <TabWrapper>
                <Tabs
                    value={selectedTab}
                    onChange={handleTabChange}
                    TabIndicatorProps={{ style: { display: "none" } }}
                >
                    {["A", "B", "C", "D", "E"].map((label, index) => (
                        <StyledTab
                            key={index}
                            label={selectedTab === index ? "" : label}
                            selected={selectedTab === index}
                            index={selectedTab === index ? index : ""}
                        />
                    ))}
                </Tabs>
                <Divider sx={{ backgroundColor: "#3D363A" }} />
                <Box sx={{ marginTop: "16px" }}>
                    <Typography variant="body2" sx={{ mb: 1, textAlign: "start", color: "#FDE4BC" }}>
                        Statistic (last 100 Periods)
                    </Typography>
                    <TableContainer
                        component={Paper}
                        elevation={0}
                        sx={{ backgroundColor: "transparent", boxShadow: "none" }}
                    >
                        <Table size="small">
                            <TableBody>
                                {currentStatisticsData.map((row, rowIndex) => (
                                    <StyledTableRow key={rowIndex}>
                                        <StyledTableCell component="th" scope="row" sx={{ color: "#FDE4BC" }}>
                                            {row.label}
                                        </StyledTableCell>
                                        {row.cols.map((col, colIndex) => (
                                            <StyledTableCell key={colIndex} align="center" sx={{ color: "#9DA7B3" }}>
                                                {col}
                                            </StyledTableCell>
                                        ))}
                                    </StyledTableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Box>
            </TabWrapper>

            <NumberTableWithLines
                historyData={historyData}
                selectedTab={selectedTab}
            />

            {/* Pagination Section */}
            <Box
                sx={{
                    // width: "100%",
                    display: "flex",
                    justifyContent: "space-evenly",
                    marginTop: "10px",
                    backgroundColor: "#323738",
                    padding: { xs: "10px" },
                    borderRadius: "0 0 10px 10px",
                }}
            >
                <Button
                    variant="contained"
                    onClick={() => setChartPage(chartPage - 1)}
                    disabled={chartPage === 1}
                    sx={{
                        marginRight: "10px",
                        backgroundColor: "#FED358",
                        "&.Mui-disabled": {
                            backgroundColor: "#382e35", // Disabled background color
                            color: "#FDE4BC", // Optional: Change text color for better visibility
                        },
                        "&.MuiButtonBase-root": { minWidth: 0, padding: "5px 7px" },
                    }}
                >
                    <ArrowBackIosRoundedIcon style={{ color: chartPage === 1 ? "#FDE4BC" : "#323738" }} />
                </Button>
                <Grid sx={{ display: "flex", alignItems: "center", color: "#B79C8B", fontSize: "12.8px" }}>
                    {chartPage}/{gameTotalPage}
                </Grid>
                <Button
                    variant="contained"
                    onClick={() => setChartPage(chartPage + 1)}
                    disabled={chartPage === gameTotalPage}
                    sx={{
                        marginLeft: "10px",
                        backgroundColor: "#FED358",
                        "&.Mui-disabled": {
                            backgroundColor: "#382e35", // Disabled background color
                            color: "#FDE4BC", // Optional: Change text color for better visibility
                        },
                        "&.MuiButtonBase-root": { minWidth: 0, padding: "5px 7px" },
                    }}
                >
                    <ArrowForwardIosRoundedIcon style={{ color: chartPage === gameTotalPage ? "#FDE4BC" : "#323738" }} />
                </Button>
            </Box>
        </Box>
    )
}

export default Chart5D