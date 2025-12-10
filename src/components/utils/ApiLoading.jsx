import { useEffect, useState, useRef } from 'react';
// Using the core dotlottie-web package
// npm install @lottiefiles/dotlottie-web

const styles = {
    overlay: {
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        backgroundColor: 'rgba(26, 26, 26, 0.8)',
        zIndex: 9999,
        pointerEvents: 'auto',
        userSelect: 'none',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
    },
    progressContainer: {
        position: 'relative',
        maxWidth: 'min(350px, 80vw)',
        height: 'clamp(10px, 2vh, 14px)',
        backgroundColor: 'rgba(255, 255, 255, 0.15)',
        borderRadius: '12px',
        overflow: 'hidden',
        margin: 'auto',
        border: '2px solid rgba(255, 255, 255, 0.2)',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3), inset 0 2px 4px rgba(255, 255, 255, 0.1)',
    },
    lottieContainer: {
        marginBottom: '20px',
        width: 'clamp(60px, 15vw, 100px)',
        height: 'clamp(60px, 15vw, 100px)',
        margin: '0 auto 20px auto',
    },
    loadingText: {
        marginBottom: '20px',
        color: '#ffffff',
        fontSize: 'clamp(16px, 4vw, 24px)',
        fontWeight: '600',
        userSelect: 'none',
        textShadow: '0 2px 8px rgba(0, 0, 0, 0.5)',
        letterSpacing: '0.5px',
    },
    progressBar: {
        height: '100%',
        backgroundColor: '#c90c0c',
        boxShadow: 'inset 0 2px 4px rgba(255, 255, 255, 0.3), 0 2px 8px rgba(201, 12, 12, 0.4)',
        position: 'relative',
        overflow: 'hidden',
        transition: 'width 0.1s ease-out',
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
        fontSize: 'clamp(10px, 2.5vw, 13px)',
        textShadow: '0 1px 3px rgba(0, 0, 0, 0.8)',
        letterSpacing: '0.5px',
        zIndex: 1,
    },
    container: {
        textAlign: 'center',
        width: '90%',
        maxWidth: '500px',
        padding: '0 20px',
    }
};

const OverlayWithProgress = ({ 
    visible = true, 
    duration = 5000, 
    animationSrc = "https://lottie.host/4db68bbd-31f6-4cd8-84eb-189de081159a/IGmMCqhzpt.lottie", // Working infinity loader
    loadingText = "",
    useLottie = true
}) => {
    const canvasRef = useRef(null);
    const dotLottieRef = useRef(null);
    
    // Add keyframes for shine animation
    useEffect(() => {
        if (!document.querySelector('#shine-animation-styles')) {
            const styleSheet = document.createElement('style');
            styleSheet.id = 'shine-animation-styles';
            styleSheet.textContent = `
                @keyframes shine {
                    0% { left: -100%; }
                    100% { left: 100%; }
                }
                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
                @keyframes pulse {
                    0%, 100% { opacity: 1; transform: translate(-50%, -50%) scale(1); }
                    50% { opacity: 0.7; transform: translate(-50%, -50%) scale(1.2); }
                }
                @keyframes bounce {
                    0%, 100% { transform: translateY(0); }
                    50% { transform: translateY(-10px); }
                }
            `;
            document.head.appendChild(styleSheet);
        }
    }, []);

    const [progress, setProgress] = useState(0);

    // Initialize Lottie animation
    useEffect(() => {
        const initLottie = async () => {
            if (useLottie && animationSrc && canvasRef.current && visible) {
                try {
                    // Dynamic import to avoid issues if package isn't installed
                    const { DotLottie } = await import('@lottiefiles/dotlottie-web');
                    
                    // Clean up previous instance
                    if (dotLottieRef.current) {
                        dotLottieRef.current.destroy();
                    }
                    
                    // Create new instance
                    dotLottieRef.current = new DotLottie({
                        autoplay: true,
                        loop: true,
                        canvas: canvasRef.current,
                        src: animationSrc,
                    });
                } catch (error) {
                    console.warn('DotLottie package not found, using CSS fallback');
                }
            }
        };

        if (visible) {
            initLottie();
        }

        return () => {
            if (dotLottieRef.current) {
                dotLottieRef.current.destroy();
                dotLottieRef.current = null;
            }
        };
    }, [visible, useLottie, animationSrc]);

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
                {/* Infinity Loader Animation */}
                <div style={styles.lottieContainer}>
                    {useLottie && animationSrc ? (
                        <canvas 
                            ref={canvasRef}
                            style={{ 
                                width: '100%', 
                                height: '100%',
                                maxWidth: '100px',
                                maxHeight: '100px'
                            }}
                            width="100"
                            height="100"
                        />
                    ) : (
                        // CSS-based loading animation fallback
                        <div style={{
                            position: 'relative',
                            width: '60px',
                            height: '60px',
                            margin: '0 auto'
                        }}>
                            {/* Outer ring */}
                            <div style={{
                                position: 'absolute',
                                width: '60px',
                                height: '60px',
                                border: '3px solid rgba(255, 255, 255, 0.2)',
                                borderTop: '3px solid #c90c0c',
                                borderRadius: '50%',
                                animation: 'spin 1.2s linear infinite',
                            }}></div>
                            {/* Inner ring */}
                            <div style={{
                                position: 'absolute',
                                top: '10px',
                                left: '10px',
                                width: '40px',
                                height: '40px',
                                border: '2px solid rgba(255, 255, 255, 0.1)',
                                borderBottom: '2px solid #ffffff',
                                borderRadius: '50%',
                                animation: 'spin 1s linear infinite reverse',
                            }}></div>
                            {/* Center dot */}
                            <div style={{
                                position: 'absolute',
                                top: '50%',
                                left: '50%',
                                transform: 'translate(-50%, -50%)',
                                width: '6px',
                                height: '6px',
                                backgroundColor: '#c90c0c',
                                borderRadius: '50%',
                                animation: 'pulse 1.5s ease-in-out infinite',
                            }}></div>
                        </div>
                    )}
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