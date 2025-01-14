/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable react-hooks/exhaustive-deps */
'use client';

import { Button } from '@/components/ui/button';
import React, { useEffect } from 'react';
import { toast, Toaster } from "sonner";

interface IMoveSet {
  used: boolean;
  value: number;
}

const Home: React.FC = () => {
  const [moveSets, setMoveSets] = React.useState<IMoveSet[]>([]);

  const init = () => {
    const saved = localStorage.getItem('dice-alternative');
    if (saved) {
      setMoveSets(JSON.parse(saved));
      toast.success("Move sets loaded from local storage");
    } else {
      generateMoveSets();
    }
  }

  const generateMoveSets = () => {
    const newMoveSets: IMoveSet[] = Array.from({ length: 200 }, () => ({
      used: false,
      value: Math.floor(Math.random() * (6 - 1) + 1),
    }));
    setMoveSets(newMoveSets);
    toast.success("New move sets generated");
  }

  const saveMoveSets = () => {
    localStorage.setItem('dice-alternative', JSON.stringify(moveSets));
    toast.success("Move sets saved to local storage");
  }

  const clearMoveSets = () => {
    localStorage.removeItem('dice-alternative');
    generateMoveSets();
    toast.success("Move sets cleared");
  }

  const useMoveSets = (id: number) => {
    const lastUsed = moveSets.filter((moveSet) => moveSet.used).length
    if (id !== lastUsed) {
      toast.error(
        "You can only use the next move set after your last move set"
      );
      return;
    }

    const newMoveSets = [...moveSets];
    newMoveSets.forEach((moveSet: IMoveSet, index) => {
      if (index === id) {
        moveSet.used = true;
      }
    });
    setMoveSets(newMoveSets);
    saveMoveSets();
  }

  useEffect(() => {
    init();
  }, []);

  return (
    <>
      <div className="min-h-screen w-full bg-zinc-800 p-6">
        <div className="container mx-auto w-full min-h-[300px] flex justify-center gap-4 flex-col my-6">
          <h1 className="text-5xl text-zinc-100 leading-relaxed">
            Dice Alternative
          </h1>
          <div className="max-w-[800px] mb-6">
            <p className="text-lg text-zinc-300 leading-relaxed">
              Generate pre defined move set value without rolling your dice.
              Every time you reload the page, it will generate up to 200 move
              set value. Click save to mark the seed and it will saved to your
              local storage. So you wont lose the pattern. Next you can use the
              value iteratively for move, attack, or any action on your game.
              There is no luck because its already defined your move set. Click
              the tile to mark as used.
            </p>
          </div>
          <div className="flex items-center w-full gap-4">
            <Button
              onClick={saveMoveSets}
              className="bg-zinc-200 text-zinc-900 hover:bg-zinc-300"
            >
              Save Move Set
            </Button>
            <Button
              onClick={clearMoveSets}
              className="bg-zinc-200 text-zinc-900 hover:bg-zinc-300"
            >
              Clear Move Set
            </Button>
          </div>
        </div>
        <div className="container mx-auto grid grid-cols-6 md:grid-cols-10 gap-2 mb-8">
          {moveSets.map((moveSet: IMoveSet, index: number) => (
            <Button
              key={index}
              className={`w-full h-full bg-zinc-700 border border-zinc-800 flex justify-center items-center text-zinc-100 ${
                moveSet.used ? "opacity-50" : "cursor-pointer"
              }`}
              onClick={() => useMoveSets(index)}
              disabled={moveSet.used}
            >
              <span>{moveSet.value}</span>
            </Button>
          ))}
        </div>
      </div>
      <Toaster />
    </>
  );
}

export default Home;