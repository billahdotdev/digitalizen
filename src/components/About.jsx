"use client"

import { motion } from "framer-motion"
import { ExternalLink } from "react-feather"

const About = ({ navigateTo }) => {
  return (
    <motion.div
      className="section about-section"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5 }}
    >
      <div className="content-wrapper">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          About Brandotory
        </motion.h2>

        <div className="about-content">
          <motion.div
            className="founder-info"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            <div className="founder-image">
              <div className="image-placeholder"></div>
            </div>
            <div className="founder-details">
              <h3>Masum Billah</h3>
              <p className="founder-title">Web Developer & Brand Strategist</p>
              <a href="https://billah.dev" target="_blank" rel="noopener noreferrer" className="personal-site-link">
                billah.dev <ExternalLink size={14} />
              </a>
            </div>
          </motion.div>

          <motion.div
            className="company-story"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
          >
            <p>
              Brandotory was founded with a vision to help businesses establish a strong digital presence through
              innovative web solutions and strategic brand development.
            </p>
            <p>
              With years of experience in web development and brand consulting, we understand the unique challenges
              businesses face in the digital landscape. Our approach combines technical expertise with creative design
              to deliver solutions that not only look great but also drive results.
            </p>
            <p>
              We believe in building long-term relationships with our clients, working closely with them to understand
              their goals and create tailored strategies that help them succeed.
            </p>
          </motion.div>

          <motion.div
            className="values-section"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.5 }}
          >
            <h3>Our Values</h3>
            <div className="values-grid">
              <div className="value-card">
                <h4>Innovation</h4>
                <p>Embracing new technologies and creative approaches</p>
              </div>
              <div className="value-card">
                <h4>Quality</h4>
                <p>Delivering excellence in every project we undertake</p>
              </div>
              <div className="value-card">
                <h4>Integrity</h4>
                <p>Building trust through honest and transparent practices</p>
              </div>
              <div className="value-card">
                <h4>Collaboration</h4>
                <p>Working together to achieve exceptional results</p>
              </div>
            </div>
          </motion.div>
        </div>

        <motion.div
          className="section-nav"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7, duration: 0.5 }}
        >
          <button className="nav-button" onClick={() => navigateTo("services")}>
            Our Services
          </button>
          <button className="nav-button" onClick={() => navigateTo("contact")}>
            Contact
          </button>
        </motion.div>
      </div>
    </motion.div>
  )
}

export default About

