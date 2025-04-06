

# Smart E-Waste Management System

A full-stack web application that enables users to responsibly dispose of electronic waste (e-waste) through an intelligent and eco-conscious platform. It uses geolocation, AI-powered price prediction, and a workflow system to simplify and streamline e-waste management.

## 🌐 Repository

🔗 GitHub: [Smart E-Waste Management System](https://github.com/S-R-AMRUTHA-LAKSHMI/E-Waste-Management-System.git)

---

## 🌍 Overview

The **Smart E-Waste Management System** allows users to:

- Submit e-waste pickup requests with images.
- Automatically assign the **nearest recycling center** using the OpenStreetMap API.
- Enable field representatives to inspect and report on the item.
- Use a **custom-trained ML model** to estimate the item's price.
- Cancel requests if items are deemed non-recyclable.
- Support sustainable e-waste disposal and reduce environmental harm.

---

## 🚀 Features

- 📍 Auto-assigns nearest e-waste center (shortest distance)
- 🖼️ Image upload for item classification
- 🔍 Representative waste inspection
- 🤖 Price prediction using AI/ML
- ❌ Cancel non-recyclable waste requests
- 🌱 Encourages green and responsible waste management

---

## 🛠️ Tech Stack

| Layer        | Technology                     |
|--------------|--------------------------------|
| Frontend     | React (JavaScript)             |
| Backend      | Node.js + Express              |
| Database     | MongoDB                        |
| ML Model     | Custom-trained model (Python or API) |
| Maps & Routing | OpenStreetMap API + OSRM      |

---

## 📦 Installation

### 1. Clone the Repository

```bash
git clone https://github.com/S-R-AMRUTHA-LAKSHMI/E-Waste-Management-System.git
cd E-Waste-Management-System
```

### 2. Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file in the `backend` folder:

```env
MONGO_URI=mongodb://localhost:27017/ewaste
PORT=5000
ML_API_URL=http://localhost:5001/predict
```

Start the backend server:

```bash
npm start
```

---

### 3. Frontend Setup

```bash
cd ../frontend
npm install
```

Start the React app:

```bash
npm start
```

> The frontend will typically run on `http://localhost:3000`

---

## 🧠 ML Model Integration

- A trained model classifies e-waste and predicts its value.
- Model is exposed via an API (`ML_API_URL`) or integrated directly.
- Input: inspection report or image data  
- Output: estimated resale or recycle value

---

## 🔁 System Workflow

1. **User submits** e-waste pickup request with image and location.
2. **System assigns** the nearest center using OpenStreetMap.
3. **Representative inspects** the item and updates the status.
4. **ML model predicts** the item's value.
5. **System validates** and either proceeds or cancels the request.
6. **Item is collected** and responsibly disposed of.

---

## 🔮 Future Enhancements

- 🔔 User notifications (status updates, alerts)
- 📸 Smart bins with QR code scanning
- 💰 Green points/rewards system
- 📜 PDF invoice & digital receipt generation
- 🔐 Blockchain tracking for verified disposal

---

## 🤝 Contribution

We welcome all contributions! Feel free to fork, raise issues, or open pull requests.

---

