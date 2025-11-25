'use client';

import { useState } from 'react';

interface GameReport {
  id: number;
  gameId: string;
  title: string;
  description: string;
  image: string;
  reportReason: string;
  reportedAt: string;
  status: 'pending' | 'resolved';
}

const mockReports: GameReport[] = [
  {
    id: 1,
    gameId: 'game-001',
    title: 'Battle Royale Extreme',
    description: 'An intense battle royale game with 100 players',
    image: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=400',
    reportReason: 'Offensive content',
    reportedAt: '2025-11-20',
    status: 'pending'
  },
  {
    id: 2,
    gameId: 'game-002',
    title: 'Puzzle Master',
    description: 'Solve challenging puzzles and unlock new levels',
    image: 'https://images.unsplash.com/photo-1606503153255-59d7f9ceb4dc?w=400',
    reportReason: 'Incorrect game details',
    reportedAt: '2025-11-21',
    status: 'pending'
  },
  {
    id: 3,
    gameId: 'game-003',
    title: 'Racing Thunder',
    description: 'High-speed racing action with stunning graphics',
    image: 'https://images.unsplash.com/photo-1511882150382-421056c89033?w=400',
    reportReason: 'Offensive content',
    reportedAt: '2025-11-22',
    status: 'pending'
  }
];

export default function AdminReportsPage() {
  const [reports, setReports] = useState<GameReport[]>(mockReports);
  const [selected, setSelected] = useState<number | null>(null);

  function markResolved(id: number) {
    setReports(prev => prev.map(r =>
      r.id === id ? { ...r, status: 'resolved' } : r
    ));
    setSelected(null);
  }

  function deleteReport(id: number) {
    if (!confirm('Delete this report and associated game?')) return;
    setReports(prev => prev.filter(r => r.id !== id));
    setSelected(null);
  }

  const pending = reports.filter(r => r.status === 'pending');
  const selectedReport = reports.find(r => r.id === selected);

  return (
    <main style={{ padding: '2rem' }}>
      <h2>Game Reports Admin Panel</h2>
      {pending.length === 0 ? (
        <p>No pending reports</p>
      ) : (
        <ul>
          {pending.map(report => (
            <li key={report.id} style={{ marginBottom: '1rem' }}>
              <strong>{report.title}</strong> <span>({report.reportReason})</span>
              <button style={{ marginLeft: '1rem' }} onClick={() => setSelected(report.id)}>
                Review
              </button>
            </li>
          ))}
        </ul>
      )}

      {selectedReport && (
        <section style={{ border: '1px solid #ddd', padding: '1rem', marginTop: '2rem' }}>
          <h3>Report Details</h3>
          <p><strong>Title:</strong> {selectedReport.title}</p>
          <p><strong>Description:</strong> {selectedReport.description}</p>
          <p><strong>Reason:</strong> {selectedReport.reportReason}</p>
          <p><strong>Date:</strong> {selectedReport.reportedAt}</p>
          <img src={selectedReport.image} alt={selectedReport.title} style={{ width: '200px' }} />

          <div style={{ marginTop: '1rem' }}>
            <button onClick={() => markResolved(selectedReport.id)}>
              Mark as Resolved
            </button>
            <button onClick={() => deleteReport(selectedReport.id)} style={{ marginLeft: '1rem', color: 'red' }}>
              Delete
            </button>
            <button onClick={() => setSelected(null)} style={{ marginLeft: '1rem' }}>
              Close
            </button>
          </div>
        </section>
      )}
    </main>
  );
}

