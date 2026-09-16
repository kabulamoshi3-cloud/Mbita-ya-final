"use client";

import { useState, useEffect } from "react";
import Button from "@/components/ui/Button";

interface Appointment {
  id: string;
  studentId: string | null;
  guestName: string | null;
  guestEmail: string | null;
  date: string;
  startTime: string;
  endTime: string;
  purpose: string;
  status: string;
  zoomUrl: string | null;
  notes: string | null;
  createdAt: string;
}

interface AvailabilitySlot {
  id: string;
  dayOfWeek: number;
  startTime: string;
  endTime: string;
  active: boolean;
}

const DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

export default function SchedulingAdminPage() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [slots, setSlots] = useState<AvailabilitySlot[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"appointments" | "availability">("appointments");

  const [slotForm, setSlotForm] = useState({
    dayOfWeek: 1,
    startTime: "09:00",
    endTime: "10:00",
  });

  useEffect(() => {
    fetchAppointments();
    fetchSlots();
  }, []);

  async function fetchAppointments() {
    try {
      const res = await fetch("/api/scheduling/book");
      if (res.ok) {
        const data = await res.json();
        setAppointments(data);
      }
    } catch (error) {
      console.error("Failed to fetch appointments", error);
    } finally {
      setLoading(false);
    }
  }

  async function fetchSlots() {
    try {
      const res = await fetch("/api/scheduling/availability");
      if (res.ok) {
        const data = await res.json();
        setSlots(data.slots);
      }
    } catch (error) {
      console.error("Failed to fetch slots", error);
    }
  }

  async function updateAppointmentStatus(id: string, status: string) {
    try {
      const res = await fetch("/api/scheduling/book", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status }),
      });
      
      if (res.ok) {
        await fetchAppointments();
      }
    } catch (error) {
      console.error("Failed to update appointment", error);
    }
  }

  async function createSlot(e: React.FormEvent) {
    e.preventDefault();
    
    try {
      const res = await fetch("/api/scheduling/availability", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(slotForm),
      });
      
      if (res.ok) {
        await fetchSlots();
        setSlotForm({ dayOfWeek: 1, startTime: "09:00", endTime: "10:00" });
      }
    } catch (error) {
      console.error("Failed to create slot", error);
    }
  }

  async function deleteSlot(id: string) {
    if (!confirm("Delete this time slot?")) return;
    
    try {
      const res = await fetch(`/api/scheduling/availability?id=${id}`, {
        method: "DELETE",
      });
      
      if (res.ok) {
        await fetchSlots();
      }
    } catch (error) {
      console.error("Failed to delete slot", error);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-lg text-navy-600">Loading...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-navy-900">Scheduling Management</h1>
        <p className="text-navy-600 mt-1">Manage appointments and availability</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="text-3xl font-bold text-navy-900">{appointments.length}</div>
          <div className="text-sm text-navy-600">Total Appointments</div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="text-3xl font-bold text-navy-900">
            {appointments.filter(a => a.status === 'pending').length}
          </div>
          <div className="text-sm text-navy-600">Pending</div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="text-3xl font-bold text-navy-900">
            {appointments.filter(a => a.status === 'confirmed').length}
          </div>
          <div className="text-sm text-navy-600">Confirmed</div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="text-3xl font-bold text-navy-900">{slots.length}</div>
          <div className="text-sm text-navy-600">Available Slots</div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="flex gap-8">
          <button
            onClick={() => setActiveTab("appointments")}
            className={`pb-4 text-sm font-medium border-b-2 ${
              activeTab === "appointments"
                ? "border-primary text-primary"
                : "border-transparent text-navy-600 hover:text-navy-900"
            }`}
          >
            Appointments
          </button>
          <button
            onClick={() => setActiveTab("availability")}
            className={`pb-4 text-sm font-medium border-b-2 ${
              activeTab === "availability"
                ? "border-primary text-primary"
                : "border-transparent text-navy-600 hover:text-navy-900"
            }`}
          >
            Availability Slots
          </button>
        </nav>
      </div>

      {/* Appointments Tab */}
      {activeTab === "appointments" && (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-navy-600 uppercase">
                  Guest/Student
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-navy-600 uppercase">
                  Date & Time
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-navy-600 uppercase">
                  Purpose
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-navy-600 uppercase">
                  Status
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-navy-600 uppercase">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {appointments.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-navy-500">
                    No appointments yet
                  </td>
                </tr>
              ) : (
                appointments.map((appt) => (
                  <tr key={appt.id}>
                    <td className="px-6 py-4">
                      <div className="font-medium text-navy-900">
                        {appt.guestName || "Student"}
                      </div>
                      {appt.guestEmail && (
                        <div className="text-sm text-navy-600">{appt.guestEmail}</div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-navy-600">
                      {new Date(appt.date).toLocaleDateString()}
                      <br />
                      {appt.startTime} - {appt.endTime}
                    </td>
                    <td className="px-6 py-4 text-sm text-navy-600">{appt.purpose}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 py-1 text-xs font-semibold rounded-full ${
                          appt.status === "confirmed"
                            ? "bg-green-100 text-green-800"
                            : appt.status === "pending"
                            ? "bg-yellow-100 text-yellow-800"
                            : appt.status === "completed"
                            ? "bg-blue-100 text-blue-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {appt.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                      {appt.status === "pending" && (
                        <>
                          <button
                            onClick={() => updateAppointmentStatus(appt.id, "confirmed")}
                            className="text-green-600 hover:text-green-800 mr-3"
                          >
                            Confirm
                          </button>
                          <button
                            onClick={() => updateAppointmentStatus(appt.id, "cancelled")}
                            className="text-red-600 hover:text-red-800"
                          >
                            Cancel
                          </button>
                        </>
                      )}
                      {appt.status === "confirmed" && (
                        <button
                          onClick={() => updateAppointmentStatus(appt.id, "completed")}
                          className="text-blue-600 hover:text-blue-800"
                        >
                          Mark Complete
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Availability Tab */}
      {activeTab === "availability" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Create Slot Form */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-bold text-navy-900 mb-4">Add Time Slot</h2>
            <form onSubmit={createSlot} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-navy-700 mb-1">
                  Day of Week
                </label>
                <select
                  value={slotForm.dayOfWeek}
                  onChange={(e) => setSlotForm({ ...slotForm, dayOfWeek: parseInt(e.target.value) })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                >
                  {DAYS.map((day, index) => (
                    <option key={index} value={index}>
                      {day}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-navy-700 mb-1">
                  Start Time
                </label>
                <input
                  type="time"
                  value={slotForm.startTime}
                  onChange={(e) => setSlotForm({ ...slotForm, startTime: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-navy-700 mb-1">
                  End Time
                </label>
                <input
                  type="time"
                  value={slotForm.endTime}
                  onChange={(e) => setSlotForm({ ...slotForm, endTime: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                />
              </div>

              <Button type="submit" className="w-full">Add Slot</Button>
            </form>
          </div>

          {/* Slots List */}
          <div className="lg:col-span-2 bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-bold text-navy-900 mb-4">Current Slots</h2>
            <div className="space-y-3">
              {slots.length === 0 ? (
                <p className="text-navy-500 text-center py-8">No slots configured yet</p>
              ) : (
                slots.map((slot) => (
                  <div
                    key={slot.id}
                    className="flex items-center justify-between p-4 border border-gray-200 rounded-lg"
                  >
                    <div>
                      <div className="font-medium text-navy-900">
                        {DAYS[slot.dayOfWeek]}
                      </div>
                      <div className="text-sm text-navy-600">
                        {slot.startTime} - {slot.endTime}
                      </div>
                    </div>
                    <button
                      onClick={() => deleteSlot(slot.id)}
                      className="text-red-600 hover:text-red-800 text-sm font-medium"
                    >
                      Delete
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
