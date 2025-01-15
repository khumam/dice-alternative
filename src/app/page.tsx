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
      <div className="min-h-screen w-full bg-white p-6">
        <div className="container mx-auto w-full min-h-[300px] flex justify-center gap-4 flex-col mt-6">
          <div className="border border-b-4 border-zinc-800 rounded-lg p-4">
            <h1 className="text-5xl text-zinc-900 leading-relaxed">
              Dice Alternative
            </h1>
          </div>
          <div className="w-full mb-6 border border-b-4 border-zinc-800 p-4 rounded-lg">
            <p className="text-lg text-zinc-700 leading-relaxed">
              Generate predefined move set values without rolling your dice.
              Every time you reload the page, it will generate up to 200 move
              set values. Click save to mark the seed, and it will be saved to your
              local storage, so you won&apos;t lose the pattern. Next, you can use the
              values iteratively for moves, attacks, or any actions in your game.
              There is no luck involved because your move set is already defined. Click
              the tile to mark it as used.
            </p>
          </div>
        </div>
        <div className="container mx-auto mb-4">
          <div className="flex items-center w-full gap-4">
            <Button
              onClick={saveMoveSets}
              className="bg-zinc-100 text-zinc-900 hover:bg-zinc-300 border border-b-4 border-zinc-800 h-[52px] font-semibold w-full"
            >
              Save Move Set
            </Button>
            <Button
              onClick={clearMoveSets}
              className="bg-zinc-100 text-zinc-900 hover:bg-zinc-300 border border-b-4 border-zinc-800 h-[52px] font-semibold w-full"
            >
              Clear Move Set
            </Button>
          </div>
        </div>
        <div className="container mx-auto grid grid-cols-4 md:grid-cols-8 gap-2 mb-8">
          {moveSets.map((moveSet: IMoveSet, index: number) => (
            <Button
              key={index}
              className={`w-full bg-zinc-100 border border-b-4 border-zinc-800 h-[52px] font-semibold flex justify-center items-center text-zinc-700 text-xl hover:bg-zinc-200 ${
                moveSet.used ? "opacity-50" : "cursor-pointer"
              }`}
              onClick={() => useMoveSets(index)}
              disabled={moveSet.used}
            >
              <span>{moveSet.used ? "-" : moveSet.value}</span>
            </Button>
          ))}
        </div>
      </div>
      <Toaster richColors />
    </>
  );
}

export default Home;