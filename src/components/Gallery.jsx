import './Gallery.css'

const projects = [
  { 
    id: 1, 
    number: '001', 
    title: 'FERTILE AGENCY', 
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1200&q=80', 
    url: '#' 
  },
  { 
    id: 2, 
    number: '002', 
    title: 'CAMILLE JUTEL', 
    image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=1200&q=80', 
    url: '#' 
  },
  { 
    id: 3, 
    number: '003', 
    title: 'AMOURATROI', 
    image: 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=1200&q=80', 
    url: '#' 
  },
  { 
    id: 4, 
    number: '004', 
    title: 'FERTILE AGENCY', 
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1200&q=80', 
    url: '#' 
  },
  { 
    id: 5, 
    number: '005', 
    title: 'CAMILLE JUTEL', 
    image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=1200&q=80', 
    url: '#' 
  },
  { 
    id: 6, 
    number: '006', 
    title: 'AMOURATROI', 
    image: 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=1200&q=80', 
    url: '#' 
  }

]

export default function Gallery() {
  // Mobile Touch Effect: Updates CSS variables for the light sheen
  const handleTouch = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.touches[0].clientX - rect.left) / rect.width) * 100;
    const y = ((e.touches[0].clientY - rect.top) / rect.height) * 100;
    e.currentTarget.style.setProperty('--mouse-x', `${x}%`);
    e.currentTarget.style.setProperty('--mouse-y', `${y}%`);
  };

  return (
    <section className="gl-archive" id="gallery">
      <div className="container">
        <div className="row-header">
          <span className="section-num">০০৩</span>
          <span className="section-title-right">{"// ল্যান্ডিং পেজ"}</span>
        </div>
        <h2 className="finder-heading">ল্যান্ডিং পেজ কি আপনার ব্যবসার গল্প বলে?</h2>
        <p className="finder-sub">
         ৩ সেকেন্ডে লোড না হলে ৪০% সেল লস। আপনি কি জানতেন?
        </p>

        <div className="gl-stack">
          {projects.map((project, i) => (
            <div 
              key={project.id} 
              className="gl-frame-wrapper" 
              style={{ '--index': i }}
            >
              <div className="gl-frame">
                {/* Frame Header */}
                <div className="gl-frame-top">
                  <div className="gl-meta">
                    <span className="gl-id">{project.number}</span>
                    <h3 className="gl-name">{project.title}</h3>
                  </div>
                  <div className="gl-status">
                    <span className="gl-pulse"></span>
                    LIVE_PREVIEW
                  </div>
                </div>

                {/* Interactive Area */}
                <a 
                  href={project.url} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="gl-window"
                  onTouchMove={handleTouch}
                >
                  <div className="gl-parallax-box">
                    <img 
                      src={project.image} 
                      alt={project.title} 
                      className="gl-img" 
                      loading="lazy" 
                    />
                  </div>
                  
                  {/* Action HUD */}
                  <div className="gl-hud">
                    <div className="gl-hud-btn">
                      <span>প্রজেক্ট দেখুন</span>
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                        <path d="M7 17L17 7M17 7H7M17 7V17" />
                      </svg>
                    </div>
                  </div>
                  
                  {/* Light Sheen Effect */}
                  <div className="gl-glass-sheen"></div>
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}