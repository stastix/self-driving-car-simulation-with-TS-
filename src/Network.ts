export class NeuralNetwork {
  levels: Level[];

  constructor(neuronCounts: number[]) {
    this.levels = [];

    for (let i = 0; i < neuronCounts.length - 1; i++) {
      const inputCount = neuronCounts[i];
      const outputCount = neuronCounts[i + 1];
      this.levels.push(new Level(inputCount, outputCount));
    }
  }

  static feedForward(givenInputs: number[], network: NeuralNetwork): number[] {
    let outputs = Level.feedForward(givenInputs, network.levels[0]);

    for (let i = 0; i < network.levels.length; i++) {
      outputs = Level.feedForward(outputs, network.levels[i]);
    }

    return outputs;
  }
}

export class Level {
  inputs: number[];
  outputs: number[];
  weights: number[][];
  biases: number[];

  constructor(inputCount: number, outputCount: number) {
    // initialize input/output arrays
    this.inputs = new Array(inputCount).fill(0);
    this.outputs = new Array(outputCount).fill(0);

    // initialize weight matrix [inputCount][outputCount] and biases
    this.weights = Array.from({ length: inputCount }, () =>
      new Array(outputCount).fill(0)
    );
    this.biases = new Array(outputCount).fill(0);

    // randomize weights and biases
    Level.randomize(this);
  }

  /** Randomizes weights and biases between -1 and 1 */
  private static randomize(level: Level) {
    for (let i = 0; i < level.inputs.length; i++) {
      for (let j = 0; j < level.outputs.length; j++) {
        level.weights[i][j] = Math.random() * 2 - 1; // [-1, 1]
      }
    }

    for (let i = 0; i < level.biases.length; i++) {
      level.biases[i] = Math.random() * 2 - 1; // [-1, 1]
    }
  }

  /** Feedforward: computes output based on given inputs */
  static feedForward(givenInputs: number[], level: Level): number[] {
    if (givenInputs.length !== level.inputs.length) {
      throw new Error("Input length does not match layer input count.");
    }

    // copy inputs
    for (let i = 0; i < level.inputs.length; i++) {
      level.inputs[i] = givenInputs[i];
    }

    // compute outputs
    for (let i = 0; i < level.outputs.length; i++) {
      let sum = 0;
      for (let j = 0; j < level.inputs.length; j++) {
        sum += level.inputs[j] * level.weights[j][i];
      }
      // simple step activation
      level.outputs[i] = sum > level.biases[i] ? 1 : 0;
    }

    return level.outputs;
  }
}
