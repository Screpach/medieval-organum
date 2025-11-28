import React from 'react';
import { getInterval } from '../core/Interval';
import { getMotionType } from '../core/TheoryUtils';

export const AnalysisPanel = ({ chant, organum, style }) => {
  if (!organum || organum.length === 0) return null;

  const rows = chant.map((cNote, i) => {
    const oNote = organum[i];
    if (!oNote) return null;

    const interval = getInterval(oNote, cNote); // Organum to Chant
    
    let motion = '-';
    if (i > 0) {
      const prevC = chant[i-1];
      const prevO = organum[i-1];
      motion = getMotionType(
        { cantus: prevC, organum: prevO }, 
        { cantus: cNote, organum: oNote }
      );
    }

    return (
      <tr key={i}>
        <td>{i + 1}</td>
        <td>{cNote.toString()}</td>
        <td>{oNote.toString()}</td>
        <td>{interval.size} ({interval.quality})</td>
        <td>{motion}</td>
      </tr>
    );
  });

  return (
    <div style={{ marginTop: '20px', border: '1px solid #ccc', padding: '10px', maxHeight: '200px', overflowY: 'auto' }}>
      <h4>Theoretical Analysis ({style})</h4>
      <table style={{ width: '100%', fontSize: '0.9rem', textAlign: 'left' }}>
        <thead>
          <tr>
            <th>#</th>
            <th>Chant</th>
            <th>Organum</th>
            <th>Interval</th>
            <th>Motion</th>
          </tr>
        </thead>
        <tbody>
          {rows}
        </tbody>
      </table>
    </div>
  );
};
