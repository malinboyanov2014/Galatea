// Controlled externally — update progress state to drive the freeze
  const [progress, setProgress] = useState(0);
  <MatrixLoadingIndicator progress={progress} />
  // call setProgress(50) etc. from anywhere

  // Auto-advance — fills left-to-right over 3 seconds automatically
  <MatrixLoadingIndicator duration={3000} />

  // Both — auto-advance as fallback, but you can also push progress externally
  <MatrixLoadingIndicator progress={progress} duration={3000} />