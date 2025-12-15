"use client";
import { useState } from "react";
import BoostModal from "./BoostModal";
import BoostStatusCard from "./BoostStatusCard";

export default function DashboardBoostSection({ user }) {
  const [showBoostModal, setShowBoostModal] = useState(false);

  const handleBoostSuccess = () => {
    setShowBoostModal(false);
    // Refresh the page to show updated data
    window.location.reload();
  };

  return (
    <>
      <BoostStatusCard
        user={user}
        onBoostClick={() => setShowBoostModal(true)}
      />

      <BoostModal
        isOpen={showBoostModal}
        onClose={() => setShowBoostModal(false)}
        currentBalance={user.mcrtBalance || 500}
        onBoostSuccess={handleBoostSuccess}
      />
    </>
  );
}
