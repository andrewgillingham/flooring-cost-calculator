import Head from "next/head";
import { useEffect, useState } from "react";
import styles from "../styles/Home.module.css";
import { useStickyState } from "../utils/hooks";
import { Room } from "../utils/interfaces";
import { ProductRow } from "../components";

const deepmerge = require("deepmerge");

export default function Home() {
  const [sqFt, setSqFt] = useState<number>(0);

  const [rooms, updateRooms] = useStickyState([], "rooms");
  const [products, updateProducts] = useStickyState([], "products");

  const clear = () => {
    const confirm = window.confirm("Are you sure you want to clear your data?");

    if (confirm) {
      updateRooms([]);
    }
  };

  const handleChange = ({ roomKey, roomObject }: { roomKey: number; roomObject: Room }) => {
    const currentRoomObj = rooms[roomKey];
    const newRoomObject = deepmerge(currentRoomObj, roomObject);

    const newRoomsObjects = [...rooms];
    newRoomsObjects[roomKey] = newRoomObject;
    updateRooms(newRoomsObjects);
  };

  const addRoom = () => {
    const emptyRoomObject: Room = {
      name: "",
      dimensions: {
        length: 0,
        width: 0,
      },
    };
    const newRooms = [...rooms];
    newRooms.push(emptyRoomObject);
    updateRooms(newRooms);
  };

  const removeRoom = ({ roomKey }: { roomKey: number }) => {
    const newRooms = [...rooms];
    newRooms.splice(roomKey, 1);
    updateRooms(newRooms);
  };

  useEffect(() => {
    const calcArea = ({ length, width }: { length: any; width: any }) => {
      return length * width;
    };
    const calcSqFootage = () => {
      const total = rooms.reduce((a: any | Room, b: any) => {
        return a?.dimensions
          ? calcArea({ length: a.dimensions.length, width: a.dimensions.width })
          : a + calcArea({ length: b.dimensions?.length, width: b.dimensions?.width });
      }, 0);
      return total;
    };
    const footage = calcSqFootage();
    setSqFt(footage);
  }, [rooms]);

  return (
    <div className={styles.container}>
      <Head>
        <title>Cost Calculator</title>
      </Head>
      <div className={styles.main}>
        <div>
          <form method="get">
            <div>
              <h2>Rooms</h2>
              {rooms.map((room: Room, k: number) => (
                <div key={k} className={styles.formrow}>
                  <label>
                    Name
                    <input
                      type="text"
                      value={room.name}
                      onChange={(e) => handleChange({ roomKey: k, roomObject: { name: e.target.value } })}
                    />
                  </label>
                  <label>
                    Length
                    <input
                      type="number"
                      value={room.dimensions?.length}
                      onChange={(e) =>
                        handleChange({ roomKey: k, roomObject: { dimensions: { length: parseInt(e.target.value) } } })
                      }
                    />
                  </label>
                  <label>
                    Width
                    <input
                      type="number"
                      value={room.dimensions?.width}
                      onChange={(e) =>
                        handleChange({ roomKey: k, roomObject: { dimensions: { width: parseInt(e.target.value) } } })
                      }
                    />
                  </label>
                  <span onClick={() => removeRoom({ roomKey: k })}>&times;</span>
                </div>
              ))}
              <p>Total Square Feet: {sqFt}</p>
            </div>
          </form>
          <div>
            <p>
              <button onClick={addRoom}>Add Room</button>
            </p>
          </div>
        </div>
        <div>
          <h2>Products</h2>
          <ProductRow title="Bona Sealer" footage={sqFt}></ProductRow>
          <ProductRow title="Bona Finish" footage={sqFt}></ProductRow>
          <ProductRow title="Vermont PolyWhey 3000 Sealer" footage={sqFt}></ProductRow>
          <ProductRow title="Vermont PolyWhey 3500 Finish" footage={sqFt}></ProductRow>
          <ProductRow title="Vermeister" footage={sqFt}></ProductRow>
          <p>
            <button onClick={clear}>Clear Data</button>
          </p>
        </div>
      </div>
    </div>
  );
}
