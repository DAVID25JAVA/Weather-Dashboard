# 🌦️ Weather Dashboard (Skyvault)

A modern, responsive **Weather Dashboard Web App** built using **ReactJS** that integrates with the **Open-Meteo API** to display real-time and historical weather insights with interactive charts.

---

## 🚀 Live Demo
👉 (Add your deployed link here - Vercel)

---

## 📌 Features

### 📍 1. Auto Location Detection
- Fetches user location using browser GPS
- Reverse geocoding to display city name
- Fallback to default location (New Delhi)

---

### 🌤️ 2. Current Weather Dashboard (Page 1)

Displays weather data for current or selected date:

- 🌡️ Temperature (Min / Max / Current)
- 💧 Humidity
- 🌧️ Precipitation
- 🌬️ Wind Speed
- 👁️ Visibility
- ☀️ UV Index
- 🌅 Sunrise & Sunset (IST)
- 🌫️ Air Quality:
  - PM10
  - PM2.5
  - CO, NO2, SO2
  - AQI Indicator

---

### 📊 3. Hourly Data Visualization

Interactive charts for:
- Temperature
- Humidity
- Precipitation
- Visibility
- Wind Speed
- PM10 & PM2.5 (combined)

✔ Zoom in / Zoom out  
✔ Horizontal scroll  
✔ Responsive charts  

---

### 📈 4. Historical Data Analysis (Page 2)

- Select custom date range
- Visualize trends using charts:

- 🌡️ Temperature (Min / Max / Mean)
- 🌅 Sunrise & Sunset trends
- 🌧️ Precipitation (Bar chart)
- 💨 Wind Speed + Direction
- 🔴 Air Quality (PM10 & PM2.5)

---

## 🧠 Tech Stack

- **Frontend:** ReactJS  
- **Routing:** React Router DOM  
- **Charts:** Recharts  
- **Date Handling:** date-fns  
- **Styling:** Tailwind CSS  
- **API:** Open-Meteo API  

---

## 🔌 API Integration

### 🌦️ Weather API
- Current, hourly, and daily weather data

### 🌫️ Air Quality API
- PM10, PM2.5, CO, NO2, SO2
- AQI values

### 📊 Historical API
- Daily weather trends
- Aggregated air quality data

---

## ⚠️ Important Notes

- ❌ Future dates are not supported by API
- ⚠️ Large date ranges may fail (API limitation)
- ✅ Recommended historical range: **30–90 days**
- 📍 Location permission required for accurate data

---

## ⚡ Performance Optimizations

- Parallel API calls using `Promise.all`
- Skeleton loading UI
- Optimized chart rendering
- Minimal re-renders using React hooks

---

## 📦 Installation & Setup

```bash
git clone https://github.com/your-username/weather-dashboard.git
cd weather-dashboard
npm install
npm run dev

