"use client"

import logo from "../assets/digitalizen.png"

const BrandLogo = ({ size = "default", onHover, className = "" }) => {
  const getSize = () => {
    switch (size) {
      case "small":
        return { width: 10, height: 10 }
      case "large":
        return { width: 40, height: 40 }
      default:
        return { width: 20, height: 20 }
    }
  }

  const { width, height } = getSize()

  return (
    <div
      className={`brand-logo ${className}`}
      onMouseEnter={() => onHover && onHover(true, "Brandotory")}
      onMouseLeave={() => onHover && onHover(false, "")}
    >
      <img
        src={logo || "/placeholder.svg"}
        alt="Brandotory Logo"
        width={width}
        height={height}
        className="brand-logo-image"
      />
    </div>
  )
}

export default BrandLogo

