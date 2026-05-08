"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

interface Subscriber {
  id:             string;
  name:           string;
  email:          string;
  address:        string | null;
  city:           string | null;
  subscribed_at:  string;
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    year: "numeric", month: "long", day: "numeric",
  });
}

export default function SubscribersPage() {
  const [rows, setRows]       = useState<Subscriber[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState<string | null>(null);

  useEffect(() => {
    supabase
      .from("newsletter_subscribers")
      .select("*")
      .order("subscribed_at", { ascending: false })
      .then(({ data, error }) => {
        if (error) setError(error.message);
        else setRows(data ?? []);
        setLoading(false);
      });
  }, []);

  return (
    <div className="belta-admin-content-pad" style={{ padding: "40px 48px" }}>
      {/* ── Top bar ──────────────────────────────────────────────────── */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "14px",
          marginBottom: "36px",
        }}
      >
        <h1
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "32px",
            fontWeight: 600,
            color: "#2C1810",
            margin: 0,
            lineHeight: 1.2,
          }}
        >
          Subscribers
        </h1>
        {!loading && !error && (
          <span
            style={{
              fontFamily: "var(--font-body)",
              fontSize: "12px",
              fontWeight: 500,
              padding: "4px 10px",
              borderRadius: "999px",
              background: "#E8C9C1",
              color: "#6E3610",
              letterSpacing: "0.04em",
            }}
          >
            {rows.length}
          </span>
        )}
      </div>

      {/* ── Table card ──────────────────────────────────────────────── */}
      <div
        style={{
          background: "#FBF7F0",
          border: "1px solid #E2D5C3",
          borderRadius: "14px",
          boxShadow: "0 2px 6px rgba(44,24,16,0.06)",
          overflow: "hidden",
        }}
      >
        {loading ? (
          <CellMsg>Loading…</CellMsg>
        ) : error ? (
          <CellMsg danger>{error}</CellMsg>
        ) : rows.length === 0 ? (
          <CellMsg>No subscribers yet.</CellMsg>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ background: "#EFE7DA" }}>
                  {["Name", "Email", "Address", "City", "Subscribed"].map(
                    (col) => (
                      <th
                        key={col}
                        style={{
                          padding: "11px 20px",
                          textAlign: "start",
                          fontFamily: "var(--font-body)",
                          fontSize: "11px",
                          fontWeight: 500,
                          letterSpacing: "0.08em",
                          textTransform: "uppercase",
                          color: "#5A4438",
                          borderBottom: "1px solid #E2D5C3",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {col}
                      </th>
                    )
                  )}
                </tr>
              </thead>
              <tbody>
                {rows.map((row, i) => (
                  <tr
                    key={row.id}
                    style={{
                      background: i % 2 === 0 ? "#FBF7F0" : "#F5EFE6",
                      borderBottom:
                        i < rows.length - 1 ? "1px solid #E2D5C3" : "none",
                    }}
                  >
                    <td
                      style={{
                        padding: "13px 20px",
                        fontFamily: "var(--font-body)",
                        fontSize: "14px",
                        fontWeight: 500,
                        color: "#2C1810",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {row.name}
                    </td>
                    <td
                      style={{
                        padding: "13px 20px",
                        fontFamily: "var(--font-body)",
                        fontSize: "13px",
                        color: "#5A4438",
                      }}
                    >
                      {row.email}
                    </td>
                    <td
                      style={{
                        padding: "13px 20px",
                        fontFamily: "var(--font-body)",
                        fontSize: "13px",
                        color: "#5A4438",
                      }}
                    >
                      {row.address ?? <Dash />}
                    </td>
                    <td
                      style={{
                        padding: "13px 20px",
                        fontFamily: "var(--font-body)",
                        fontSize: "13px",
                        color: "#5A4438",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {row.city ?? <Dash />}
                    </td>
                    <td
                      style={{
                        padding: "13px 20px",
                        fontFamily: "var(--font-body)",
                        fontSize: "13px",
                        color: "#8A766A",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {formatDate(row.subscribed_at)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

/* ── Sub-components ───────────────────────────────────────────────────────── */

function CellMsg({
  children,
  danger,
}: {
  children: React.ReactNode;
  danger?: boolean;
}) {
  return (
    <div
      style={{
        padding: "64px 24px",
        textAlign: "center",
        fontFamily: "var(--font-body)",
        fontSize: "14px",
        color: danger ? "#A23A26" : "#8A766A",
      }}
    >
      {children}
    </div>
  );
}

function Dash() {
  return (
    <span style={{ color: "#C9B8A3", fontSize: "13px" }}>—</span>
  );
}
