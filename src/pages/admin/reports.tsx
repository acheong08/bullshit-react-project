'use client';
import { useState } from 'react';

// Game report type definition
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
export function AdminReportsPage() {
  const [reports, setReports] = useState<GameReport[]>(mockReports);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const selectedReport = reports.find(r => r.id === selectedId);
  const [editValues, setEditValues] = useState<Omit<GameReport, 'id' | 'gameId' | 'status' | 'reportReason' | 'reportedAt'> | null>(null);

  // Select a report and start editing
  function startEditing(report: GameReport) {
    setSelectedId(report.id);
    setEditValues({
      title: report.title,
      description: report.description,
      image: report.image,
    });
  }

  // Save edits to local state
  function saveEdits() {
    if (selectedId && editValues) {
      setReports(prev =>
        prev.map(report =>
          report.id === selectedId
            ? { ...report, ...editValues }
            : report
        )
      );
      setSelectedId(null);
      setEditValues(null);
    }
  }

  function markResolved(id: number) {
    setReports(prev =>
      prev.map(report =>
        report.id === id ? { ...report, status: 'resolved' } : report
      )
    );
    setSelectedId(null);
    setEditValues(null);
  }

  function deleteReport(id: number) {
    if (window.confirm('Are you sure you want to delete this game?')) {
      setReports(prev => prev.filter(report => report.id !== id));
      setSelectedId(null);
      setEditValues(null);
    }
  }

  function cancelEdit() {
    setSelectedId(null);
    setEditValues(null);
  }

  return (
    <main style={{ padding: '2rem', maxWidth: 700, margin: 'auto' }}>
      <h2>Game Reports Admin Panel</h2>
      <ul>
        {reports.filter(r => r.status === 'pending').map(report => (
          <li key={report.id} style={{ marginBottom: 15 }}>
            <strong>{report.title}</strong> ({report.reportReason})
            <button style={{ marginLeft: 10 }} onClick={() => startEditing(report)}>
              Review & Edit
            </button>
          </li>
        ))}
      </ul>
      {selectedReport && editValues && (
        <section style={{ border: '1px solid #ddd', marginTop: 30, padding: 15 }}>
          <h3>Edit Game Details</h3>
          <label>
            Title:<br />
            <input
              type="text"
              value={editValues.title}
              onChange={e => setEditValues(edit => edit ? { ...edit, title: e.target.value } : edit)}
              style={{ width: '100%', marginBottom: 8 }}
            />
          </label><br />
          <label>
            Description:<br />
            <textarea
              value={editValues.description}
              onChange={e => setEditValues(edit => edit ? { ...edit, description: e.target.value } : edit)}
              rows={3}
              style={{ width: '100%', marginBottom: 8 }}
            />
          </label><br />
          <label>
            Image URL:<br />
            <input
              type="text"
              value={editValues.image}
              onChange={e => setEditValues(edit => edit ? { ...edit, image: e.target.value } : edit)}
              style={{ width: '100%', marginBottom: 8 }}
            />
          </label><br />
          <img src={editValues.image} alt={editValues.title} style={{ width: '200px', marginBottom: 12 }} />
          <div>
            <button onClick={saveEdits}>Save Changes</button>
            <button onClick={() => markResolved(selectedReport.id)} style={{ marginLeft: 10 }}>Mark as Resolved</button>
            <button onClick={() => deleteReport(selectedReport.id)} style={{ color: 'red', marginLeft: 10 }}>Delete</button>
            <button onClick={cancelEdit} style={{ marginLeft: 10 }}>Cancel</button>
          </div>
        </section>
      )}
    </main>
  );
}

