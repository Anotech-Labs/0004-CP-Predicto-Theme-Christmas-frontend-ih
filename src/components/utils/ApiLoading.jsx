import { useEffect, useState } from 'react';
import useMediaQuery from "@mui/material/useMediaQuery";

const OverlayWithProgress = ({ 
    visible = true, 
    duration = 5000, 
    loadingText = "Loading...",
}) => {
    const isSmallScreen = useMediaQuery("(max-width:600px)");
    
    const styles = {
        overlay: {
            position: 'fixed',
            top: 0,
            left: '50%',
            transform: 'translateX(-50%)',
            width: isSmallScreen ? '100%' : '444px',
            maxWidth: isSmallScreen ? '100%' : '444px',
            height: '100vh',
            backgroundColor: 'rgba(26, 26, 26, 0.95)',
            zIndex: 9999,
            pointerEvents: 'auto',
            userSelect: 'none',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
        },
        progressContainer: {
            position: 'relative',
            width: '80%',
            maxWidth: '280px',
            height: '12px',
            backgroundColor: 'rgba(255, 255, 255, 0.15)',
            borderRadius: '12px',
            overflow: 'hidden',
            margin: '0 auto',
            border: '2px solid rgba(201, 12, 12, 0.4)',
            boxShadow: '0 4px 16px rgba(0, 0, 0, 0.3)',
        },
        santaContainer: {
            marginBottom: '24px',
            width: '100px',
            height: '100px',
            margin: '0 auto 24px auto',
            position: 'relative',
        },
        loadingText: {
            marginBottom: '16px',
            color: '#ffffff',
            fontSize: '18px',
            fontWeight: '600',
            fontFamily: "'Poppins', sans-serif",
            userSelect: 'none',
            textShadow: '0 2px 8px rgba(0, 0, 0, 0.5)',
            letterSpacing: '0.5px',
        },
        progressBar: {
            height: '100%',
            background: 'linear-gradient(90deg, #c90c0c 0%, #ff4444 50%, #c90c0c 100%)',
            boxShadow: 'inset 0 2px 4px rgba(255, 255, 255, 0.3)',
            position: 'relative',
            overflow: 'hidden',
            transition: 'width 0.15s ease-out',
            borderRadius: '10px',
        },
        progressBarShine: {
            position: 'absolute',
            top: 0,
            left: '-100%',
            width: '100%',
            height: '100%',
            background: 'linear-gradient(90deg, transparent 0%, rgba(255, 255, 255, 0.4) 50%, transparent 100%)',
            animation: 'shine 1.5s infinite',
        },
        progressText: {
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            color: '#ffffff',
            fontWeight: '700',
            fontSize: '10px',
            fontFamily: "'Poppins', sans-serif",
            textShadow: '0 1px 3px rgba(0, 0, 0, 0.8)',
            zIndex: 1,
        },
        container: {
            textAlign: 'center',
            width: '90%',
            maxWidth: '400px',
            padding: '20px',
        }
    };
    
    // Add keyframes for animations
    useEffect(() => {
        if (!document.querySelector('#christmas-loading-styles')) {
            const styleSheet = document.createElement('style');
            styleSheet.id = 'christmas-loading-styles';
            styleSheet.textContent = `
                @keyframes shine {
                    0% { left: -100%; }
                    100% { left: 100%; }
                }
                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
            `;
            document.head.appendChild(styleSheet);
        }
    }, []);

    const [progress, setProgress] = useState(0);

    useEffect(() => {
        let interval;

        if (visible) {
            setProgress(0);
            
            const updateInterval = 50;
            const incrementPerUpdate = (100 / duration) * updateInterval;
            
            interval = setInterval(() => {
                setProgress(prevProgress => {
                    const newProgress = prevProgress + incrementPerUpdate;
                    
                    if (newProgress >= 99) {
                        clearInterval(interval);
                        return 99;
                    }
                    
                    return newProgress;
                });
            }, updateInterval);
        } else {
            setProgress(0);
        }

        return () => {
            if (interval) {
                clearInterval(interval);
            }
        };
    }, [visible, duration]);

    if (!visible) return null;

    return (
        <div style={styles.overlay}>
            <div style={styles.container}>
                {/* Smooth Circular Loader with Santa */}
                <div style={styles.santaContainer}>
                    {/* Outer smooth spinning ring */}
                    <div style={{
                        position: 'absolute',
                        width: '90px',
                        height: '90px',
                        left: '5px',
                        top: '5px',
                        borderRadius: '50%',
                        border: '3px solid rgba(255, 255, 255, 0.1)',
                        borderTopColor: '#c90c0c',
                        animation: 'spin 1.2s cubic-bezier(0.5, 0, 0.5, 1) infinite',
                    }}></div>
                    
                    {/* Inner smooth spinning ring */}
                    <div style={{
                        position: 'absolute',
                        top: '20px',
                        left: '20px',
                        width: '60px',
                        height: '60px',
                        borderRadius: '50%',
                        border: '3px solid rgba(255, 255, 255, 0.1)',
                        borderBottomColor: '#228B22',
                        animation: 'spin 0.9s cubic-bezier(0.5, 0, 0.5, 1) infinite reverse',
                    }}></div>
                    
                    {/* Center Santa */}
                    <div style={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        fontSize: '32px',
                        filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))',
                    }}>🎅</div>
                </div>
                
                {/* Loading Text */}
                <p style={styles.loadingText}>{loadingText}</p>
                
                {/* Progress Bar */}
                <div style={styles.progressContainer}>
                    <div
                        style={{
                            ...styles.progressBar,
                            width: `${progress}%`,
                        }}
                    >
                        <div style={styles.progressBarShine}></div>
                    </div>
                    <span style={styles.progressText}>{Math.floor(progress)}%</span>
                </div>
            </div>
        </div>
    );
};

export default OverlayWithProgress;