"use client";

import { useEffect, useState } from "react";

interface User {
  id: string;
  username: string;
  association: string;
}

interface Seat {
  id: number;
  association: string;
  ownerId: string | null;
  owner: User | null;
}

const getAssociationColor = (association: string): string => {

  if (association == "DSEA"){
     return "bg-[#00a6d6] border-[#000000]";
  }
  else if (association === "Link") {
    return "bg-[#FFFFFF] border-[#000000]";
  }
  else if (association === "Blueshell") {
    return "bg-[#3286f7] border-[#000000]";
  }
  else if (association === "Zephyr"){
     return "bg-[#cf363c] border-[#000000]";
  }
  else if (association === "Dorans") {
    return "bg-[#f7be15] border-[#000000]";
  }
  else if (association === "Paragon") {
     return "bg-[#000000] border-[#000000]";
  } else {
    return "bg-gray-400 border-gray-500";
  }
};

const getAssociationHoverColor = (association: string): string => {
  return "hover:bg-gray-200"; 
};

const offSeats = new Set<number>();

interface ModalState {
  isOpen: boolean;
  seat: Seat | null;
}

export default function SeatGrid() {
  const [username, setUsername] = useState<string>("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const [seats, setSeats] = useState<Seat[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [modal, setModal] = useState<ModalState>({ isOpen: false, seat: null });

  const handleConfirm = async () => {
    if (!username.trim()) return;
    
    const res = await fetch('api/users', {method: "POST", body: JSON.stringify({ username }) });
    const data= await res.json();
    const association = data.association
    function addRange(set: Set<number>, start: number, end: number) {
  for (let i = start; i <= end; i++) {
    set.add(i);
  }
}
    switch (association) {
  case "DSEA":
    addRange(offSeats, 26, 240);
    break;
  case "Link":
    addRange(offSeats, 51, 240);
    break;
  case "Zephyr":
    addRange(offSeats, 76, 240);
    break;
  case "Blueshell":
    addRange(offSeats, 101, 240);
    break;
  case "Dorans":
    addRange(offSeats, 126, 240);
    break;
  case "Paragon":
    addRange(offSeats, 151, 240);
    break;
  case "Free":
    addRange(offSeats, 1, 150);
    break;
}
    console.log(`Logged in as: ${username}`);
    
    setIsLoggedIn(true);
  };

  useEffect(() => {
    if (isLoggedIn) {
      const fetchSeats = async () => {
        try {
          const response = await fetch("/api/seats");
          if (!response.ok) throw new Error("Failed to fetch seats");
          const data = await response.json();
          setSeats(data.sort((a: Seat, b: Seat) => a.id - b.id));
        } catch (err) {
          setError(err instanceof Error ? err.message : "Unknown error");
        } finally {
          setLoading(false);
        }
      };
      fetchSeats();
    }
  }, [isLoggedIn]);

  const handleSeatClick = (seat: Seat) => {
    if (offSeats.has(seat.id)) return;
    setModal({ isOpen: true, seat });
  };

  const handleReserve = async () => {
    if (!modal.seat) return;

    const seatId = modal.seat.id 
    const res = await fetch ("api/seats",{method: "PUT", body: JSON.stringify({ seatId, username})})
    console.log(res)
    console.log(`User ${username} is reserving seat ${modal.seat.id}`);
    setModal({ isOpen: false, seat: null });
  };

  const closeModal = () => {
    setModal({ isOpen: false, seat: null });
  };

  if (!isLoggedIn) {
    return (
      <div className="flex items-center justify-center w-full min-h-screen bg-gradient-to-br from-blue-600 to-blue-900 p-8">
        <div className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full">
          <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">
            Seat Reservation
          </h1>

          <div className="space-y-4">
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter your username"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              onKeyPress={(e) => e.key === "Enter" && handleConfirm()}
            />
            <button
              onClick={handleConfirm}
              disabled={!username.trim()}
              className={`w-full py-2 px-4 rounded-lg font-medium transition ${
                !username.trim()
                  ? "bg-gray-400 text-gray-600 cursor-not-allowed"
                  : "bg-blue-500 text-white hover:bg-blue-600"
              }`}
            >
              Confirm
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center w-full h-screen bg-gradient-to-br from-blue-600 to-blue-900">
        <div className="text-white text-xl">Loading seats...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center w-full h-screen bg-gradient-to-br from-blue-600 to-blue-900">
        <div className="text-red-200 text-xl">Error: {error}</div>
      </div>
    );
  }

  const COLUMNS = 20;
  const ROWS = 12;

  return (
    <div className="flex items-center justify-center w-full min-h-screen bg-gradient-to-br from-blue-600 to-blue-900 p-8">
      <div className="flex flex-col items-center gap-8">
        <h1 className="text-4xl font-bold text-white">Seat Reservation</h1>

        <div
          className="gap-2 p-8 bg-white bg-opacity-10 rounded-lg"
          style={{
            display: "grid",
            gridTemplateColumns: `repeat(${COLUMNS}, minmax(0, 1fr))`,
            gridTemplateRows: `repeat(${ROWS}, minmax(0, 1fr))`,
            width: "fit-content",
          }}
        >
          {seats.map((seat) => {
            const isOff = offSeats.has(seat.id);
            const bgColor = isOff
              ? "bg-gray-400 border-gray-500 cursor-not-allowed"
              : `${getAssociationColor(seat.association)} border-2 cursor-pointer ${getAssociationHoverColor(seat.association)} transition-all duration-200 hover:scale-110`;

            return (
              <div
                key={seat.id}
                className={`w-8 h-8 rounded ${bgColor}`}
                title={`Seat ${seat.id} - ${seat.association}`}
                role="button"
                tabIndex={isOff ? -1 : 0}
                onClick={() => handleSeatClick(seat)}
                onKeyDown={(e) => {
                  if (!isOff && (e.key === "Enter" || e.key === " ")) {
                    handleSeatClick(seat);
                  }
                }}
              />
            );
          })}
        </div>
      </div>

      {/* Modal */}
      {modal.isOpen && modal.seat && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 max-w-sm w-full">
            <h2 className="text-2xl font-bold mb-4">Seat {modal.seat.id}</h2>

            <div className="mb-6 space-y-3">
              <div>
                <p className="text-sm text-gray-600">Association</p>
                <p className="text-lg font-semibold">{modal.seat.association}</p>
              </div>

              <div>
                <p className="text-sm text-gray-600">Owner</p>
                <p className="text-lg font-semibold">
                  {modal.seat.owner?.username || "None"}
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={closeModal}
                className="flex-1 px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 transition"
              >
                Close
              </button>

              <button
                onClick={handleReserve}
                disabled={modal.seat.owner !== null}
                className={`flex-1 px-4 py-2 rounded transition ${
                  modal.seat.owner === null
                    ? "bg-blue-500 text-white hover:bg-blue-600 cursor-pointer"
                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                }`}
              >
                Reserve
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
