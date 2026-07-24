import { useState } from "react";

type FlyingEmojis = {
  emoji: string;
  randomX: string;
  speed: string;
};
function App() {
  const [reactions, setReactions] = useState<Record<string, number>>({
    "😊": 0,
    "😒": 0,
    "💕": 0,
    "😍": 0,
    "👍": 0,
    "😘": 0,
  });
  const [flyingEmojis, setFlyingEmojis] = useState<FlyingEmojis[]>([]);

  const sendReaction = (emoji: string) => {
    const randomX = Math.floor(Math.random() * (15 - -15 + 1)) + -15 + "px";
    const speed = Math.floor(Math.random() * (6 - 4 + 1)) + 4 + "s";
    setFlyingEmojis((prev) => [...prev, { emoji, randomX, speed }]);
    console.log(flyingEmojis);
    reactions[emoji] += 1 
  };

  const [online, setOnline] = useState(0);
  return (
    <div className="min-h-screen flex items-center justify-center dark:bg-neutral-900">
      <div className="reaction-container">
        {flyingEmojis.map((item, index) => (
          <span
            key={index}
            className="reaction"
            style={
              {
                "--random-x": item.randomX,
                "--speed": item.speed,
              } as React.CSSProperties
            }
          >
            {item.emoji}
          </span>
        ))}
      </div>
      <div className="flex flex-col gap-4">
        <div className="relative px-2">
          <div className="absolute top-0.5 right-4 flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
          </div>
          <p className="text-right pr-8 text-xs uppercase tracking-widest font-medium text-neutral-400 dark:text-neutral-500">
            {online} пользователей
          </p>
        </div>

        <div className="grid grid-cols-[repeat(auto-fill,minmax(100px,1fr))] gap-3 max-w-xl">
          {Object.entries(reactions).map(([emoji, count], index) => (
            <button
              key={index}
              className="select-none flex items-center justify-center gap-3 
              dark:bg-neutral-800 bg-neutral-50 py-2 px-5 rounded-full 
              border dark:border-neutral-700 border-neutral-100 shadow-2xs
              hover:bg-neutral-100 dark:hover:bg-neutral-700"
              onClick={() => sendReaction(emoji)}
            >
              <span className="text-2xl hover:scale-105">{emoji}</span>
              <span className="text-xl font-medium dark:text-neutral-400 text-neutral-300">
                {count}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;
