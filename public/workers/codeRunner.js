let originalConsole = {};

function setupConsole() {
  originalConsole = {
    log: console.log,
    error: console.error,
    warn: console.warn,
    info: console.info
  };

  console.log = (...args) => {
    self.postMessage({
      type: 'console',
      method: 'log',
      args: args.map(arg => typeof arg === 'object' ? JSON.stringify(arg) : String(arg))
    });
  };

  console.error = (...args) => {
    self.postMessage({
      type: 'console',
      method: 'error',
      args: args.map(arg => typeof arg === 'object' ? JSON.stringify(arg) : String(arg))
    });
  };

  console.warn = (...args) => {
    self.postMessage({
      type: 'console',
      method: 'warn',
      args: args.map(arg => typeof arg === 'object' ? JSON.stringify(arg) : String(arg))
    });
  };

  console.info = (...args) => {
    self.postMessage({
      type: 'console',
      method: 'info',
      args: args.map(arg => typeof arg === 'object' ? JSON.stringify(arg) : String(arg))
    });
  };
}

function restoreConsole() {
  console.log = originalConsole.log;
  console.error = originalConsole.error;
  console.warn = originalConsole.warn;
  console.info = originalConsole.info;
}

function executeCode(code, inputs = {}, timeout = 5000) {
  return new Promise((resolve, reject) => {
    const timeoutId = setTimeout(() => {
      reject(new Error('Code execution timeout'));
    }, timeout);

    try {
      setupConsole();

      const wrappedCode = `
        // Predefined variables/inputs
        ${Object.entries(inputs).map(([key, value]) => 
          `const ${key} = ${JSON.stringify(value)};`
        ).join('\n')}
        
        // User's code
        ${code}
      `;

      const result = eval(wrappedCode);
      
      clearTimeout(timeoutId);
      
      // Send result
      self.postMessage({
        type: 'result',
        success: true,
        result: result,
        executionTime: Date.now()
      });

      resolve(result);
      
    } catch (error) {
      clearTimeout(timeoutId);
      
      // Send error
      self.postMessage({
        type: 'result',
        success: false,
        error: {
          message: error.message,
          stack: error.stack,
          name: error.name
        },
        executionTime: Date.now()
      });

      reject(error);
    } finally {
      // Always restore console
      restoreConsole();
    }
  });
}

self.addEventListener('message', async (event) => {
  const { type, code, inputs, timeout } = event.data;

  if (type === 'execute') {
    try {
      await executeCode(code, inputs, timeout);
    } catch (error) {
    }
  } else if (type === 'terminate') {
    self.close();
  }
});

// Send ready signal
self.postMessage({
  type: 'ready'
}); 