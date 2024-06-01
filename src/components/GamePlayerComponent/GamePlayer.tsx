import { useContext, useEffect, useState } from "react";
import { getGame } from "../../utils/gameHelperFunctions";
import { GlobalContext } from "../../context/Store";
import { WebContainer } from "@webcontainer/api";
import { files } from "./files";
import { RingLoader } from "react-spinners";

const webcontainerInstance = await WebContainer.boot({ coep: "require-corp" });

const GamePlayer = ({ id }: { id: string }) => {
  const { signer } = useContext(GlobalContext)!;
  const [url, setUrl] = useState<string>();

  const installDependencies = async () => {
    const installProcess = await webcontainerInstance.spawn("npm", ["install"]);
    installProcess.output.pipeTo(
      new WritableStream({
        write(data) {
          console.log(data);
        },
      })
    );
    return installProcess.exit;
  };

  const startDevServer = async () => {
    await webcontainerInstance.spawn("node", ["unzipper.js"]);
    await webcontainerInstance.spawn("ls", ["game", "-l"]);
    const lss = await webcontainerInstance.spawn("serve", ["-s", "game"]);

    lss.output.pipeTo(
      new WritableStream({
        write(data) {
          console.log(data);
        },
      })
    );
    webcontainerInstance.on("server-ready", (port, url) => {
      console.log(`Server is ready at ${url} on port ${port}`);
      setUrl(url);
    });
  };

  const openIndexedDB = () => {
    return new Promise<IDBDatabase>((resolve, reject) => {
      const request = indexedDB.open("GameDatabase", 1);

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        db.createObjectStore("games", { keyPath: "id" });
      };

      request.onsuccess = () => {
        resolve(request.result);
      };

      request.onerror = (event) => {
        reject(event);
      };
    });
  };

  const getGameFromIndexedDB = async (db: IDBDatabase, gameId: string) => {
    return new Promise<Uint8Array | null>((resolve, reject) => {
      const transaction = db.transaction(["games"], "readonly");
      const store = transaction.objectStore("games");
      const request = store.get(gameId);

      request.onsuccess = () => {
        if (request.result) {
          resolve(request.result.data);
        } else {
          resolve(null);
        }
      };

      request.onerror = (event) => {
        reject(event);
      };
    });
  };

  const saveGameToIndexedDB = async (
    db: IDBDatabase,
    gameId: string,
    data: Uint8Array
  ) => {
    return new Promise<void>((resolve, reject) => {
      const transaction = db.transaction(["games"], "readwrite");
      const store = transaction.objectStore("games");
      const request = store.put({ id: gameId, data: data });

      request.onsuccess = () => {
        resolve();
      };

      request.onerror = (event) => {
        reject(event);
      };
    });
  };

  const fetchGame = async () => {
    const db = await openIndexedDB();
    let game = await getGameFromIndexedDB(db, id);

    if (!game) {
      const { decryptedGame } = await getGame(id, signer!);
      game = new Uint8Array(await decryptedGame.arrayBuffer());
      await saveGameToIndexedDB(db, id, game);
    }

    await webcontainerInstance.mount(files);
    await webcontainerInstance.mount({
      "game.zip": {
        file: {
          contents: game,
        },
      },
    });

    const exitCode = await installDependencies();
    if (exitCode !== 0) {
      throw new Error("Installation failed");
    }

    startDevServer();
  };

  useEffect(() => {
    if (!signer) return;
    if (id === "") return;
    fetchGame();
  }, [id, signer]);

  return (
    <div className="w-full h-full overflow-hidden">
      {url == null ? (
        <div className="flex h-3/5 w-full mt-24 text-white justify-center items-center">
          <RingLoader color="white" />
        </div>
      ) : (
        <div className={`h-[90%] w-full`}>
          <iframe src={url} width="100%" height="100%" />
        </div>
      )}
    </div>
  );
};

export default GamePlayer;
