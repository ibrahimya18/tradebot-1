export const AlgorithmSettings = ({
    algorithmSettings,
    updateAlgorithmSettings,
    setSelectedAlgorithm
  }) => {
    const currentAlgo = algorithmSettings.selectedAlgorithm;
    const settings = algorithmSettings[currentAlgo];
  
    const handleSettingChange = (key, value) => {
      updateAlgorithmSettings(currentAlgo, {
        [key]: parseFloat(value)
      });
    };
  
    return (
      <div className="bg-gray-50 p-4 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-4">Algorithm Configuration</h3>
        
        <div className="mb-4">
          <label className="block mb-1">Active Algorithm: </label>
          <select 
            value={currentAlgo}
            onChange={(e) => setSelectedAlgorithm(e.target.value)}
            className="w-full p-2 border rounded"
          >
            <option value="meanReversion">Mean Reversion</option>
            <option value="breakout">Breakout</option>
          </select>
        </div>
  
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="space-y-1">
            <label className="block text-sm font-medium">Lookback Period</label>
            <input
              type="number"
              value={settings.lookbackPeriod}
              onChange={(e) => handleSettingChange('lookbackPeriod', e.target.value)}
              className="w-full p-2 border rounded"
            />
          </div>
  
          <div className="space-y-1">
            <label className="block text-sm font-medium">Risk Percentage</label>
            <input
              type="number"
              step="0.1"
              value={settings.riskPercentage}
              onChange={(e) => handleSettingChange('riskPercentage', e.target.value)}
              className="w-full p-2 border rounded"
            />
          </div>
  
          <div className="space-y-1">
            <label className="block text-sm font-medium">Leverage</label>
            <input
              type="number"
              value={settings.leverage}
              onChange={(e) => handleSettingChange('leverage', e.target.value)}
              className="w-full p-2 border rounded"
            />
          </div>
  
          {currentAlgo === 'meanReversion' && (
            <div className="space-y-1">
              <label className="block text-sm font-medium">Std Dev Threshold</label>
              <input
                type="number"
                step="0.1"
                value={settings.stdDevThreshold}
                onChange={(e) => handleSettingChange('stdDevThreshold', e.target.value)}
                className="w-full p-2 border rounded"
              />
            </div>
          )}
  
          {currentAlgo === 'breakout' && (
            <div className="space-y-1">
              <label className="block text-sm font-medium">Breakout Threshold</label>
              <input
                type="number"
                step="0.01"
                min="0.9"
                max="1.1"
                value={settings.breakoutThreshold}
                onChange={(e) => handleSettingChange('breakoutThreshold', e.target.value)}
                className="w-full p-2 border rounded"
              />
            </div>
          )}
  
          <div className="space-y-1">
            <label className="block text-sm font-medium">Take Profit (%)</label>
            <input
              type="number"
              step="0.1"
              value={settings.takeProfit}
              onChange={(e) => handleSettingChange('takeProfit', e.target.value)}
              className="w-full p-2 border rounded"
            />
          </div>
  
          <div className="space-y-1">
            <label className="block text-sm font-medium">Stop Loss (%)</label>
            <input
              type="number"
              step="0.1"
              value={settings.stopLoss}
              onChange={(e) => handleSettingChange('stopLoss', e.target.value)}
              className="w-full p-2 border rounded"
            />
          </div>
        </div>
      </div>
    );
  };