"use client";

import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import HorizontalLayout from "@/components/layout/HorizontalLayout";
import MentorDashboard from "@/components/dashboards/MentorDashboard";
import { Spin, Alert } from "antd";

function MentorDashboardContent() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "loading") return;
    if (!session) {
      router.push("/auth/login");
      return;
    }

    if (session.user.role !== "mentor") {
      router.push("/unauthorized");
      return;
    }
  }, [session, status, router]);

  if (status === "loading") {
    return (
      <HorizontalLayout>
        <div style={{ textAlign: "center", padding: "50px" }}>
          <Spin size="large" />
        </div>
      </HorizontalLayout>
    );
  }

  if (!session) {
    return (
      <HorizontalLayout>
        <Alert
          message="សូមចូលប្រើប្រាស់ប្រព័ន្ធជាមុនសិន"
          type="error"
          showIcon
        />
      </HorizontalLayout>
    );
  }

  return (
    <HorizontalLayout>
      <MentorDashboard />
    </HorizontalLayout>
  );
}

export default function MentorDashboardPage() {
  return <MentorDashboardContent />;
}
