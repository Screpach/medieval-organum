import React from 'react';
import { STYLES } from '../core/rules/StyleDefinitions';

export const Controls = ({ 
  style, 
  setStyle, 
  onGenerate, 
  onPlay, 
  onStop, 
  onClear,
  onExport,
  canGenerate,
  isPlaying
}) => {
  return (
    <div className="controls-container" style={{ padding: '15px', background: '#eee', display: 'flex', gap: '20px', flexWrap: 'wrap', alignItems: 'center' }}>
      
      {/* Style Selector */}
      <div className="control-group">
        <label><strong>Counterpoint Style: </strong></label>
        <select value={style} onChange={(e) => setStyle(e.target.value)}>
          <option value={STYLES.ENCHIRIADIS}>Musica Enchiriadis (c. 900)</option>
          <option value={STYLES.MICROLOGUS}>Micrologus (Guido, c. 1025)</option>
          <option value={STYLES.AD_ORGANUM}>Ad Organum Faciendum (c. 1100)</option>
        </select>
      </div>

      {/* Action Buttons */}
      <div className="control-group">
        <button onClick={onGenerate} disabled={!canGenerate} style={{ fontWeight: 'bold' }}>
          Generate Organum
        </button>
        <button onClick={onClear} style={{ marginLeft: '10px' }}>
          Reset
        </button>
      </div>

      <div className="vr" style={{ width: '1px', background: '#ccc', height: '30px' }}></div>

      {/* Playback */}
      <div className="control-group">
        {!isPlaying ? (
           <button onClick={onPlay} disabled={!canGenerate}>▶ Play</button>
        ) : (
           <button onClick={onStop}>■ Stop</button>
        )}
      </div>

      <div className="vr" style={{ width: '1px', background: '#ccc', height: '30px' }}></div>

      {/* Export */}
      <div className="control-group">
        <button onClick={onExport} disabled={!canGenerate}>Export XML/JSON</button>
      </div>

    </div>
  );
};
