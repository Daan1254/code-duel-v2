import { useCreateGame } from "@/api/endpoints/game/game";
import { useRouter } from "next/router";
import { useEffect, useRef } from "react";
import { TypeAnimation } from "react-type-animation";

export default function Game() {
  const { mutateAsync: createGame } = useCreateGame();
  const router = useRouter();
  const isQuerying = useRef(false);

  useEffect(() => {
    if (isQuerying.current) return;
    isQuerying.current = true;

    const fetchGame = async () => {
      console.log("fetching game");
      const game = await createGame();
      if (game) {
        router.push(`/game/${game.id}`);
      }
    };
    fetchGame();
  }, [createGame, router]);

  return (
    <div className="w-full h-screen flex items-center justify-center flex-col gap-4 bg-background">
      <h1 className="text-3xl font-bold text-white">
        Joining a game{" "}
        <TypeAnimation
          sequence={[".", 100, "..", 100, "...", 100]}
          repeat={Infinity}
          speed={2}
        />
      </h1>
    </div>
  );
}
