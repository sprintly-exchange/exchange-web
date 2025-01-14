import React from 'react';
import { useNavigate } from 'react-router-dom';
import YouTubeChannelVideos from './components/media/YouTubeChannelLink';

function Home() {
    const navigate = useNavigate();

    const handleGetStartedClick = () => {
        navigate('/signup');
    };

    React.useEffect(() => {
        // Apply styles globally for scrolling
        const style = document.createElement('style');
        style.innerHTML = `
            html, body {
                height: 100%;
                margin: 0;
                padding: 0;
                overflow-y: auto; /* Ensure vertical scrolling */
            }
        `;
        document.head.appendChild(style);
        
        return () => {
            // Clean up styles when component unmounts
            document.head.removeChild(style);
        };
    }, []);
    
    return (
        <div style={{
            height: '100%',    // Ensure the container takes up the full height
            display: 'flex',
            flexDirection: 'column',
        }}>
            {/* Hero Section */}
            <section className="hero" style={{
                background: "url('hero-bg.jpg') center/cover no-repeat",
                color: '#fff',
                textAlign: 'center',
                padding: '1rem 1rem',
            }}>
                <h1>Welcome to Sprinlty Exchange</h1><br></br>
                   <button className="btn"
                    onClick={handleGetStartedClick}
                    style={{
                        backgroundColor: '#fff',
                        color: '#333',
                        padding: '0.8rem 1.2rem',
                        border: 'none',
                        fontSize: '1rem',
                        cursor: 'pointer'
                    }}>
                    Get Started
                </button>
              

                        </section>

            {/* Featured Sections */}
            <section className="features" style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: '2rem',
                padding: '1rem',
                justifyContent: 'center',
                backgroundColor: '#f9f9f9',
                flexGrow: 1,  // This ensures that this section takes up available space
            }}>
                {["image1.png", "image2.png", "image3.png"].map((image, index) => (
                    <div key={index} className="feature" style={{
                        flex: '1',
                        minWidth: '280px',
                        maxWidth: '350px',
                        background: '#fff',
                        padding: '1.5rem',
                        boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
                        borderRadius: '8px',
                        textAlign: 'center',
                        color: '#333',
                    }}>
                        <img src={image} alt={`Feature ${index + 1}`} style={{ width: '100%', marginBottom: '1rem' }} />
                        <h3>{["Simplify, Automate, and Scale Your B2B Integrations", "Seamless Integration for Your Entire Ecosystem", "Boost Efficiency with Seamless Integration"][index]}</h3>
                        <p>{[
                            "Connect, automate, and scale your enterprise systems with seamless B2B integrations. Simplify complex workflows and unlock new efficiencies—no coding required.",
                            "Visualize your tools effortlessly connected through our platform. Our intuitive interface links CRM, ERP, and more into a unified network, ensuring seamless data flow and enhanced efficiency across your business.",
                            "Cut integration time by 70% and streamline your processes to save valuable resources. Ensure smooth, efficient data flow across all your business systems and rely on our enterprise-grade security and compliance to protect your data with top industry standards."
                        ][index]}</p>
                    </div>
                ))}
            </section>
            
            <section style={{
                        width: '100%',          // Ensure it takes up the full width of the container
                        height: 'auto',         // Auto height to maintain aspect ratio
                        maxWidth: 'auto',      // Max width to make sure it's not too large on bigger screens
                        aspectRatio: '16 / 9',  // Maintain a 16:9 aspect ratio for the embedded videos
                        overflow: 'hidden',
                        borderRadius: '8px',
                    }}>
                <YouTubeChannelVideos></YouTubeChannelVideos>
            </section>
            

            {/* Footer Section */}
            <footer style={{
                backgroundColor: '#333',
                color: '#fff',
                textAlign: 'center',
                padding: '1rem',
                marginTop: '2rem',
            }}>
                <p>&copy; 2024 Sprinlty Exchange. All rights reserved.</p>
                <p>
                    <strong>Contact Us:</strong> 
                    Email: <a href="mailto:info@sprintly-exchange.com" style={{ color: '#fff', textDecoration: 'underline' }}>info@sprintly-exchange.com</a> Phone: +4676 033 4777
                </p>
            </footer>

            {/* Responsive Styling */}
            <style jsx>{`
                @media (max-width: 768px) {
                    .hero {
                        padding: 3rem 1rem;
                    }
                    .features {
                        flex-direction: column;
                        padding: 1rem;
                        gap: 1.5rem;
                    }
                    .feature {
                        max-width: 100%;
                        padding: 1rem;
                    }
                    .btn {
                        padding: 0.6rem 1rem;
                        font-size: 0.9rem;
                    }
                }
                @media (max-width: 480px) {
                    .hero h1 {
                        font-size: 1.8rem;
                    }
                    .hero p {
                        font-size: 1rem;
                    }
                    .feature h3 {
                        font-size: 1.2rem;
                    }
                    .feature p {
                        font-size: 0.9rem;
                    }
                }
            `}</style>

        </div>
        
    );
}

export default Home;
