
import { AnimatePresence } from 'framer-motion';
import { useGameState } from './hooks/useGameState';
import SetupScreen from './components/SetupScreen';
import ActionScreen from './components/ActionScreen';
import SummaryScreen from './components/SummaryScreen';
import './index.css';
import './App.css';

function App() {
  const { state, startGame, drawNext, resetKeepConfig, goToSetup, resetFull, goToSummary } = useGameState();
  const { phase, config, results } = state;

  return (
    <div className="app">
      <AnimatePresence mode="wait">
        {phase === 'setup' && (
          <SetupScreen
            key="setup"
            initialConfig={config}
            onStart={startGame}
          />
        )}

        {phase === 'action' && (
          <ActionScreen
            key="action"
            config={config}
            results={results}
            totalPlayers={config.totalPlayers}
            onDraw={drawNext}
            onViewSummary={goToSummary}
            onGoToSetup={goToSetup}
          />
        )}

        {phase === 'summary' && (
          <SummaryScreen
            key="summary"
            config={config}
            results={results}
            onReset={resetKeepConfig}
            onNewSetup={resetFull}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

export default App;
