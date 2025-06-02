# React-Tetris

A modern, cyberpunk-themed Tetris game built with React and TypeScript.  
Play classic Tetris with neon visuals, music, sound effects, and responsive controls—all in your browser!

![Reactris Screenshot](./screenshot.png)

---

## 🚀 Features

- **Classic Tetris Gameplay**: Move, rotate, and drop tetrominoes to clear lines and score points.
- **Cyberpunk Visuals**: Neon colors, glowing effects, and a modern UI.
- **Music & Sound**: Background music and sound effects for moves, drops, line clears, and game over.
- **Music-Reactive Board**: The game board border pulses in sync with the music.
- **Responsive Design**: Looks great on desktop and mobile.
- **WASD & Space Controls**: Intuitive keyboard controls for fast gameplay.
- **Mute/Unmute**: Toggle background music on or off.

---

## 🎮 Controls

| Key      | Action           |
|----------|------------------|
| **A/D**  | Move Left/Right  |
| **W**    | Rotate           |
| **S**    | Soft Drop        |
| **Space**| Hard Drop        |
| **P**    | Pause/Unpause    |

---

## 🛠️ Getting Started

1. **Clone the repo:**
   ```sh
   git clone https://github.com/MrMoody098/React-Tetris.git
   cd React-Tetris/game
   ```

2. **Install dependencies:**
   ```sh
   npm install
   ```

3. **Start the development server:**
   ```sh
   npm start
   ```
   Open [http://localhost:3000](http://localhost:3000) to play!

---

## 🚢 Deploying to GitHub Pages

1. **Install gh-pages:**
   ```sh
   npm install --save gh-pages
   ```

2. **Add to your `package.json`:**
   ```json
   "homepage": "https://mrmoody098.github.io/React-Tetris",
   "scripts": {
     "predeploy": "npm run build",
     "deploy": "gh-pages -d build"
   }
   ```

3. **Deploy:**
   ```sh
   npm run deploy
   ```
   Your game will be live at:  
   [https://mrmoody098.github.io/React-Tetris](https://mrmoody098.github.io/React-Tetris)

---

## 📁 Project Structure

```
React-Tetris/
  └── game/
      ├── public/
      │   └── music1.mp3
      ├── src/
      │   ├── components/
      │   ├── utils/
      │   ├── App.tsx
      │   └── index.tsx
      ├── package.json
      └── ...
```

---

## 🧩 Customization

- **Change Music:** Replace `public/music1.mp3` with your own track.
- **Edit Theme:** Tweak colors and effects in `Tetris.css` and `GameBoard.css`.
- **Add Features:** Fork and extend the game with new mechanics or visuals!

---

## 🎨 Credits

- **Music & SFX**: [Mixkit](https://mixkit.co/) and local assets.
- **Font**: [Orbitron](https://fonts.google.com/specimen/Orbitron), [Press Start 2P](https://fonts.google.com/specimen/Press+Start+2P)
- **Inspired by**: Classic Tetris and cyberpunk aesthetics.

---

## 📝 License

MIT License.  
Feel free to fork, modify, and share!

---

Enjoy playing **Reactris**!  
If you like this project, ⭐ star the repo and share it!
