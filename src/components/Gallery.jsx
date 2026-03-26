import './Gallery.css'

const projects = [
  { 
    id: 1, 
    number: '001', 
    title: 'DhakaTeez', 
    image: './images/1.jpg', 
    url: 'https://billahdotdev.github.io/dhakateez/' 
  },
  { 
    id: 2, 
    number: '002', 
    title: 'Auora', 
    image: './images/2.jpg', 
    url: 'https://billahdotdev.github.io/velore_bangla/' 
  },
  { 
    id: 3, 
    number: '003', 
    title: 'xyzxyz', 
    image: './images/3.jpg', 
    url: '#' 
  },
  { 
    id: 4, 
    number: '004', 
    title: '@billahdotdev', 
    image: './images/4.jpg', 
    url: 'https://billah.dev' 
  },
  { 
    id: 5, 
    number: '005', 
    title: 'GARMENTIK', 
    image: './images/5.jpg', 
    url: 'https://billahdotdev.github.io/garmentik/' 
  },
  { 
    id: 6, 
    number: '006', 
    title: 'resto', 
    image: './images/6.jpg', 
    url: 'https://billahdotdev.github.io/resto/' 
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
         ৩ সেকেন্ডে লোড না হলে ৪০% সেল লস। ঝুঁকিতে আছেন?
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
                    লাইভ দেখুন
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
                      <span>লাইভ দেখুন</span>
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