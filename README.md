# NETRA

NETRA is an AI-powered vision assistant designed to empower the visually impaired. By leveraging the power of Google's Gemini AI, NETRA provides real-time identification of objects, currency, and text, communicating findings through synthesized speech in a user-friendly Hinglish format.

## Features

- **Real-time Object Recognition**: Instantly identifies objects and scenes using the devise's camera.
- **Currency & Text Detection**: specialized capabilities for recognizing currency notes and reading text.
- **Hinglish Audio Feedback**: detailed yet concise audio descriptions in Hinglish (Hindi + English), tailored for the Indian context.
- **Voice-Guided Interface**: Provides auditory cues for system status (online, scanning, success, error).
- **Vibration Feedback**: Haptic feedback for user interactions and alerts.

## Tech Stack

- **Frontend**: React (v19)
- **Build Tool**: Vite
- **AI Model**: Google Gemini 2.5 Flash Lite
- **Routing**: React Router DOM

## Getting Started

Follow these instructions to set up and run the project locally.

### Prerequisites

Ensure you have [Node.js](https://nodejs.org/) installed on your machine.

### Installation

1.  Clone the repository (if applicable) or navigate to the project directory.
2.  Install the dependencies:

    ```bash
    npm install
    ```

### Environment Setup

Create a `.env` file in the root directory of the project and add your Google Gemini API key:

```env
VITE_GEMINI_API_KEY=your_api_key_here
```

> **Note**: You need a valid API key from [Google AI Studio](https://aistudio.google.com/) to use the generative AI features.

### Running the Application

Start the development server:

```bash
npm run dev
```

The application will be available at `http://localhost:5173` (or the port shown in your terminal).

## Usage

1.  **Grant Permissions**: Allow the browser to access your camera upon launching the app.
2.  **Scan**: Tap anywhere on the screen (or the video feed) to capture an image.
3.  **Listen**: The app will process the image and speak out the description in Hinglish.
