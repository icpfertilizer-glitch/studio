import { MonitorView } from "@/components/monitor-view";
import { getFirebaseAdmin } from "@/lib/firebase/firebase-admin";
import type { Room } from "@/types";

async function getRooms() {
    try {
        const admin = getFirebaseAdmin();
        const db = admin.database();
        const snapshot = await db.ref('rooms').get();
        if (snapshot.exists()) {
            const roomsData = snapshot.val();
            return Object.entries(roomsData).map(([id, value]) => ({
                id,
                ...(value as Omit<Room, 'id'>)
            })).filter(room => room.isActive);
        }
        return [];
    } catch (error) {
        console.error("Failed to fetch rooms for monitor:", error);
        return [];
    }
}

export default async function MonitorPage() {
  const rooms = await getRooms();

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <MonitorView initialRooms={rooms} />
    </div>
  );
}
