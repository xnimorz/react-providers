import React from 'react';

export default function Description() {
  return (
    <div className="text">
      <p>
        The main goal of this example is to show how to work with dependencies between your contexts. Try to click to
        "load comments and users" button. Here we simulated some async operations by setTimeout and implemented comments
        context that depends on user context. Also, the example shows you how to work with components that depends on
        several contexts.
      </p>

      <p>Open react dev-tools to get more information how dependencies between several contexts are resolved.</p>
    </div>
  );
}
